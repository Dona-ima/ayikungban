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

def create_notification(user_id: str, title: str, message: str, type: str, result_id: str, pdf_url: str = None):
    try:
        # Vérification de l'existence de l'utilisateur
        user_check = supabase.table("users").select("id").eq("id", user_id).execute()
        if not user_check.data or len(user_check.data) == 0:
            print(f"⚠️ Utilisateur {user_id} non trouvé dans la table users, notification ignorée")
            return
        print("\n\n\nL'id de l'utilisateur: ", user_id, " \n\n\n")
        # Votre code existant pour créer la notification...
        notification_data = {
            "user_id": user_id,
            "title": title,
            "message": message,
            "type": type,
            "result_id": result_id,
            "pdf_url": pdf_url,
            "created_at": datetime.utcnow().isoformat(),
            "read": False
        }
        supabase.table("notifications").insert(notification_data).execute()
        
    except Exception as e:
        # Erreur non critique, on continue
        print(f"⚠️ Erreur notification (non critique): {e}")