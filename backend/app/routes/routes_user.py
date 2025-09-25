from fastapi import APIRouter, HTTPException, Depends
from app.models.user import User
from app.config.supabase_connection import db
from app.utils.user import get_current_user

router = APIRouter(prefix="/users", tags=["users"])

# -------------------------------
# Get a user by user_id (self only)
# -------------------------------
@router.get("/me")
def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    user_id = current_user["user_id"]

    try:
        # Syntaxe Supabase au lieu de Firestore
        result = db.table("users").select("*").eq("id", user_id).limit(1).execute()
        
        if not result.data or len(result.data) == 0:
            raise HTTPException(status_code=404, detail="User not found")

        user_data = result.data[0]
        
        # Supprimer les champs sensibles s'ils existent
        user_data.pop("id", None)
        user_data.pop("created_at", None)  # masquer le password s'il existe
        user_data.pop("updated_at", None)

        return user_data
        
    except Exception as e:
        if "User not found" in str(e):
            raise e
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
