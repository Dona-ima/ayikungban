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
        # Vérifier si l'utilisateur existe déjà - SYNTAXE SUPABASE
        existing_user = db.table("users").select("*").eq("npi", npi).limit(1).execute()
        
        if existing_user.data and len(existing_user.data) > 0:
            # L'utilisateur existe déjà, retourner son ID
            return existing_user.data[0]["id"]
        
        # Créer un nouvel utilisateur
        user_data = {
            "npi": npi,
            "phone_number": phone_number,
            "first_name": first_name,
            "last_name": last_name,
            "sex": sex,
            "date_of_birth": date_of_birth,
            "email": email,
            "address": address,
            "profession": profession
        }
        
        # Insérer dans la base de données - SYNTAXE SUPABASE
        result = db.table("users").insert(user_data).execute()
        
        if result.data and len(result.data) > 0:
            return result.data[0]["id"]
        else:
            raise HTTPException(status_code=500, detail="Erreur lors de la création de l'utilisateur")
            
    except Exception as e:
        print(f"Erreur create_user_if_not_exists: {str(e)}")
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