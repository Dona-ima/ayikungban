from fastapi import APIRouter, Depends, HTTPException
from ..config.supabase_connection import supabase
from ..utils.user import get_current_user
from datetime import datetime

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("/")
async def get_notifications(current_user: dict = Depends(get_current_user)):
    """Récupère toutes les notifications de l'utilisateur"""
    user_id = current_user["user_id"]
    
    try:
        result = supabase.table("notifications")\
            .select("*")\
            .eq("user_id", user_id)\
            .order("created_at", desc=True)\
            .execute()
            
        return result.data
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la récupération des notifications: {str(e)}"
        )

@router.post("/{notification_id}/read")
async def mark_notification_as_read(
    notification_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Marque une notification comme lue"""
    user_id = current_user["user_id"]
    
    try:
        result = supabase.table("notifications")\
            .update({"read": True})\
            .eq("id", notification_id)\
            .eq("user_id", user_id)\
            .execute()
            
        if not result.data:
            raise HTTPException(status_code=404, detail="Notification non trouvée")
            
        return {"message": "Notification marquée comme lue"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la mise à jour de la notification: {str(e)}"
        )

@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Supprime une notification"""
    user_id = current_user["user_id"]
    
    try:
        result = supabase.table("notifications")\
            .delete()\
            .eq("id", notification_id)\
            .eq("user_id", user_id)\
            .execute()
            
        if not result.data:
            raise HTTPException(status_code=404, detail="Notification non trouvée")
            
        return {"message": "Notification supprimée"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la suppression de la notification: {str(e)}"
        )

def create_notification(user_id: str, title: str, message: str, type: str, result_id: str = None, pdf_url: str = None):
    """Crée une nouvelle notification pour l'utilisateur"""
    try:
        notification_data = {
            "user_id": user_id,
            "title": title,
            "message": message,
            "type": type,
            "read": False,
            "created_at": datetime.utcnow().isoformat(),
            "result_id": result_id,
            "pdf_url": pdf_url
        }
        
        result = supabase.table("notifications").insert(notification_data).execute()
        return result.data[0] if result.data else None
    except Exception as e:
        print(f"Erreur lors de la création de la notification: {str(e)}")
        return None