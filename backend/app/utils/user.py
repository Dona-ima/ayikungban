from app.config.supabase_connection import db
from datetime import datetime
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import os

# Schéma d'authentification Bearer
security = HTTPBearer()

def create_user_if_not_exists(npi, phone_number, first_name, last_name, sex, date_of_birth, email, address, profession):
    """
    Crée un utilisateur dans Supabase s'il n'existe pas déjà
    """
    try:
        import uuid
        import logging
        
        logging.info(f"Vérification de l'existence de l'utilisateur avec NPI: {npi}")
        
        # Vérifier si l'utilisateur existe déjà - SYNTAXE SUPABASE
        existing_user = db.table("users").select("*").eq("npi", npi).limit(1).execute()
        
        if existing_user.data and len(existing_user.data) > 0:
            # L'utilisateur existe déjà, retourner son ID
            user_id = existing_user.data[0]["id"]
            logging.info(f"Utilisateur existant trouvé avec ID: {user_id}")
            return user_id
        
        # Générer un nouvel ID
        new_user_id = str(uuid.uuid4())
        logging.info(f"Création d'un nouvel utilisateur avec ID: {new_user_id}")
        
        # Créer un nouvel utilisateur
        user_data = {
            "id": new_user_id,
            "npi": npi,
            "phone_number": phone_number,
            "first_name": first_name,
            "last_name": last_name,
            "sex": sex,
            "date_of_birth": date_of_birth,
            "email": email,
            "address": address,
            "profession": profession,
            "created_at": datetime.utcnow().isoformat()
        }
        
        # Insérer dans la base de données - SYNTAXE SUPABASE
        result = db.table("users").insert(user_data).execute()
        
        if not result.data:
            logging.error(f"Échec de la création de l'utilisateur pour NPI: {npi}")
            raise HTTPException(status_code=500, detail="Erreur lors de la création de l'utilisateur")
        
        logging.info(f"Nouvel utilisateur créé avec succès, ID: {new_user_id}")
        return new_user_id
            
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Erreur create_user_if_not_exists: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur base de données: {str(e)}")

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Récupère l'utilisateur actuel à partir du token JWT dans l'en-tête Authorization
    """
    SECRET_KEY = os.getenv("SECRET_KEY")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    
    try:
        # Récupérer le token depuis les credentials
        token = credentials.credentials
        
        # Décoder le token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        
        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Token invalide",
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        # Récupérer l'utilisateur depuis la base - SYNTAXE SUPABASE
        user_result = db.table("users").select("*").eq("id", user_id).limit(1).execute()
        
        if not user_result.data or len(user_result.data) == 0:
            raise HTTPException(
                status_code=401,
                detail="Utilisateur introuvable",
                headers={"WWW-Authenticate": "Bearer"}
            )
        
        return {"user_id": user_id, **user_result.data[0]}
        
    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Token invalide",
            headers={"WWW-Authenticate": "Bearer"}
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur d'authentification: {str(e)}"
        )