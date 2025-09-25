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
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15))

router = APIRouter(prefix="/auth", tags=["auth"])

# Temporary OTP storage 
otp_store = {}

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
    # Vérifier que l'email correspond à celui attaché au NPI
    user = get_user_from_anip(data.npi)
    
    if not user.get("email"):
        raise HTTPException(status_code=400, detail="Email not found for this NPI")

    if not user or user.get("email") != data.email:
        raise HTTPException(status_code=400, detail="Email invalide pour ce NPI")

    otp = str(random.randint(100000, 999999))
    otp_store[data.npi] = {
        "otp": otp,
        "expires": time.time() + 300,  # expire en 5 min
        "email": data.email
    }

    success = send_otp_email(data.email, otp)
    if not success:
        raise HTTPException(status_code=500, detail="Impossible d'envoyer l'OTP")

    return {"message": "OTP envoyé par email"}

@router.post("/verify-otp")
def verify_otp(data: VerifyOTP):
    if data.npi not in otp_store:
        raise HTTPException(status_code=400, detail="OTP not requested")

    otp_data = otp_store[data.npi]
    if time.time() > otp_data["expires"]:
        raise HTTPException(status_code=400, detail="OTP expired")

    if otp_data["otp"] != data.otp:
        raise HTTPException(status_code=400, detail="Incorrect OTP")

    del otp_store[data.npi]  # OTP can be used only once

    # Check if user exists in Supabase
    try:
        users_response = db.table("users").select("*").eq("npi", data.npi).limit(1).execute()
        users_data = users_response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    if not users_data:
        # Fetch user info from ANIP and create Supabase account
        user_anip = get_user_from_anip(data.npi)
        if not user_anip:
            raise HTTPException(status_code=404, detail="User not found in ANIP")

        user_id = create_user_if_not_exists(
            npi=data.npi,
            phone_number=None,
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
        user_id = user_data.get("id")

    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token_payload = {"sub": str(user_id), "exp": expire}
    token = jwt.encode(token_payload, SECRET_KEY, algorithm=ALGORITHM)

    return {"access_token": token, "token_type": "bearer", "user_id": user_id}

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/admin_login")
def admin_login(data: AdminLogin):
    npi = data.npi
    password = data.password
    
    # Fetch user from Supabase
    try:
        user_response = db.table("users").select("*").eq("npi", npi).limit(1).execute()
        users_data = user_response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    if not users_data:
        raise HTTPException(status_code=404, detail="Admin not found")

    user_data = users_data[0]

    # Check if role is admin
    if user_data.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not authorized as admin")

    # Verify password
    if not pwd_context.verify(password, user_data.get("password")):
        raise HTTPException(status_code=401, detail="Invalid password")

    # Create JWT
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token_payload = {
        "sub": user_data["npi"],
        "role": "admin",
        "exp": expire
    }
    token = jwt.encode(token_payload, SECRET_KEY, algorithm=ALGORITHM)

    return {"access_token": token, "token_type": "bearer"}