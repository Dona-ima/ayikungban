import time
import random
import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import jwt
from app.config.supabase_connection import db
from app.anip.anip_service import get_user_from_anip
from app.utils.user import create_user_if_not_exists
from dotenv import load_dotenv
import os
from passlib.context import CryptContext
from app.utils.otp import send_otp_email

# Charger le fichier .env du dossier app
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(env_path)

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("La variable d'environnement SECRET_KEY n'est pas définie")

ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15))

# Pour le logging des erreurs
import logging
logging.basicConfig(level=logging.INFO)

router = APIRouter(prefix="/auth", tags=["auth"])

# Temporary OTP storage with better structure
class OTPData:
    def __init__(self):
        self._store = {}
    
    def add(self, npi: str, otp: str, email: str):
        self._store[npi] = {
            "otp": otp,
            "expires": time.time() + 300,  # 5 minutes
            "email": email,
            "attempts": 0
        }
        logging.info(f"OTP stocké pour NPI {npi}")
    
    def verify(self, npi: str, otp: str) -> bool:
        data = self._store.get(npi)
        if not data:
            logging.warning(f"Aucun OTP trouvé pour NPI {npi}")
            return False
        
        if time.time() > data["expires"]:
            logging.warning(f"OTP expiré pour NPI {npi}")
            self.remove(npi)
            return False
        
        data["attempts"] += 1
        if data["attempts"] > 3:
            logging.warning(f"Trop de tentatives pour NPI {npi}")
            self.remove(npi)
            return False
            
        return data["otp"] == otp
    
    def get_email(self, npi: str) -> str:
        data = self._store.get(npi)
        return data["email"] if data else None
    
    def remove(self, npi: str):
        if npi in self._store:
            del self._store[npi]
            logging.info(f"OTP supprimé pour NPI {npi}")
    
    def cleanup_expired(self):
        current_time = time.time()
        expired = [npi for npi, data in self._store.items() if current_time > data["expires"]]
        for npi in expired:
            self.remove(npi)

otp_store = OTPData()

class RequestOTP(BaseModel):
    npi: str
    email: str

class VerifyOTP(BaseModel):
    npi: str
    otp: str

class AdminLogin(BaseModel):
    npi: str
    password: str

@router.post("/request-otp")
def request_otp_email(data: RequestOTP):
    try:
        logging.info(f"Demande d'OTP pour NPI: {data.npi}, email: {data.email}")
        
        # Nettoyer les OTP expirés
        otp_store.cleanup_expired()
        
        # Vérifier que l'email correspond à celui attaché au NPI
        user = get_user_from_anip(data.npi)
        
        if not user:
            logging.error(f"Utilisateur non trouvé dans ANIP pour NPI: {data.npi}")
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
        
        if not user.get("email"):
            logging.error(f"Email non trouvé pour NPI: {data.npi}")
            raise HTTPException(status_code=400, detail="Email non trouvé pour cet utilisateur")

        if user.get("email") != data.email:
            logging.warning(f"Email fourni ne correspond pas pour NPI: {data.npi}")
            raise HTTPException(status_code=400, detail="Email ne correspond pas à celui enregistré")

        # Générer un OTP de 6 chiffres
        otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        logging.info(f"OTP généré pour NPI: {data.npi}")

        # Stocker l'OTP
        otp_store.add(data.npi, otp, data.email)
        
        # Envoyer l'email
        success = send_otp_email(data.email, otp)
        if not success:
            logging.error(f"Échec de l'envoi d'email pour NPI: {data.npi}")
            otp_store.remove(data.npi)
            raise HTTPException(status_code=500, detail="Impossible d'envoyer l'OTP")

        logging.info(f"OTP envoyé avec succès à {data.email}")
        return {"message": "OTP envoyé par email"}
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Erreur inattendue lors de la demande d'OTP: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur inattendue: {str(e)}")

@router.post("/verify-otp")
async def verify_otp(data: VerifyOTP):
    try:
        logging.info(f"Tentative de vérification OTP pour NPI: {data.npi}")
        
        # Vérifier l'OTP
        if not otp_store.verify(data.npi, data.otp):
            raise HTTPException(status_code=400, detail="Code OTP invalide ou expiré")
            
        logging.info(f"OTP validé avec succès pour NPI: {data.npi}")
        
        # Récupérer l'email avant de supprimer l'OTP
        email = otp_store.get_email(data.npi)
        
        # Supprimer l'OTP après validation réussie
        otp_store.remove(data.npi)
        
        # Procéder à la création/récupération de l'utilisateur et génération du token
        try:
            # Check if user exists in Supabase
            users_response = db.table("users").select("*").eq("npi", data.npi).limit(1).execute()
            users_data = users_response.data

            if not users_data:
                # Fetch user info from ANIP and create Supabase account
                user_anip = get_user_from_anip(data.npi)
                if not user_anip:
                    raise HTTPException(status_code=404, detail="Utilisateur non trouvé dans ANIP")

                user_id = create_user_if_not_exists(
                    npi=data.npi,
                    phone_number=user_anip.get("phone_number"),
                    first_name=user_anip["first_name"],
                    last_name=user_anip["last_name"],
                    sex=user_anip["sex"],
                    date_of_birth=user_anip["date_of_birth"],
                    email=user_anip.get("email"),
                    address=user_anip.get("address"),
                    profession=user_anip.get("profession")
                )
            else:
                user_data = users_data[0]
                user_id = user_data["id"]

            # Générer le token JWT
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            token_payload = {"sub": str(user_id), "exp": expire}
            token = jwt.encode(token_payload, SECRET_KEY, algorithm=ALGORITHM)

            return {"access_token": token, "token_type": "bearer", "user_id": user_id}

        except Exception as e:
            logging.error(f"Erreur lors de la création/récupération de l'utilisateur: {str(e)}")
            raise HTTPException(status_code=500, detail=str(e))

    except HTTPException as he:
        raise he
    except Exception as e:
        logging.error(f"Erreur inattendue lors de la vérification OTP: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur inattendue: {str(e)}")

    # Check if user exists in Supabase
    try:
        logging.info(f"Recherche de l'utilisateur dans Supabase avec NPI: {data.npi}")
        users_response = db.table("users").select("*").eq("npi", data.npi).limit(1).execute()
        users_data = users_response.data
    except Exception as e:
        logging.error(f"Erreur lors de la recherche dans Supabase: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur de base de données: {str(e)}")

    try:
        if not users_data:
            logging.info(f"Utilisateur non trouvé dans Supabase, vérification ANIP pour NPI: {data.npi}")
            # Fetch user info from ANIP and create Supabase account
            user_anip = get_user_from_anip(data.npi)
            if not user_anip:
                logging.error(f"Utilisateur non trouvé dans ANIP pour NPI: {data.npi}")
                raise HTTPException(status_code=404, detail="Utilisateur non trouvé dans ANIP")

            logging.info(f"Création d'un nouvel utilisateur pour NPI: {data.npi}")
            user_id = create_user_if_not_exists(
                npi=data.npi,
                phone_number=user_anip.get("phone_number"),
                first_name=user_anip["first_name"],
                last_name=user_anip["last_name"],
                sex=user_anip["sex"],
                date_of_birth=user_anip["date_of_birth"],
                email=user_anip.get("email"),
                address=user_anip.get("address"),
                profession=user_anip.get("profession")
            )
            
            if not user_id:
                logging.error(f"Échec de la création de l'utilisateur pour NPI: {data.npi}")
                raise HTTPException(status_code=500, detail="Échec de la création de l'utilisateur")
                
            logging.info(f"Nouvel utilisateur créé avec succès, ID: {user_id}")
        else:
            user_data = users_data[0]
            user_id = user_data.get("id")
            if not user_id:
                logging.error(f"ID utilisateur manquant pour NPI: {data.npi}")
                raise HTTPException(status_code=500, detail="ID utilisateur manquant")
            logging.info(f"Utilisateur existant trouvé, ID: {user_id}")
            
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Erreur inattendue lors du traitement de l'utilisateur: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur inattendue: {str(e)}")

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token_payload = {"sub": str(user_id), "exp": expire}
    token = jwt.encode(token_payload, SECRET_KEY, algorithm=ALGORITHM)

    return {"access_token": token, "token_type": "bearer", "user_id": user_id}

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

