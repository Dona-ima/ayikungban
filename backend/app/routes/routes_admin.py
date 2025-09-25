"""
from fastapi import APIRouter, HTTPException, Depends
from app.models.user import User
from app.config.supabase_connection import db
from app.utils.user import admin_required, get_user_by_id

router = APIRouter(prefix="/admin", tags=["admin"])
# -------------------------------
# Get all users (admin only)
# -------------------------------
@router.get("/all_users")
def get_all_users(skip: int = 0, limit: int = 50):
    users = db.collection("users").offset(skip).limit(limit).stream()
    
    result = []
    for doc in users:
        user_data = doc.to_dict()
        user_data.pop("password", None)
        result.append(user_data)
    
    return result


# -------------------------------
# Update a user (admin only)
# -------------------------------
@router.patch("/all_users/{user_id}")
def update_user(user_id: str, user_update: User, admin: dict = Depends(admin_required)):
    doc_ref = get_user_by_id(user_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="User not found")
    update_data = user_update.dict(exclude_unset=True)
    db.collection("users").document(user_id).update(update_data)
    return {"message": "User updated"}

# -------------------------------
# Delete a user (admin only)
# -------------------------------
@router.delete("/all_users/{user_id}")
def delete_user(user_id: str, admin: dict = Depends(admin_required)):
    doc_ref = get_user_by_id(user_id)
    if not doc_ref.get().exists:
        raise HTTPException(status_code=404, detail="User not found")
    doc_ref.delete()
    return {"message": "User deleted"}
"""