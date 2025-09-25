from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from ..config.supabase_connection import supabase
from ..utils.user import get_current_user
 
import os
from datetime import datetime

router = APIRouter(prefix="/results", tags=["results"])

@router.get("/{image_id}")
async def get_result_for_image(image_id: str, current_user: dict = Depends(get_current_user)):
    """
    Récupère le résultat final pour une image traitée :
    - Vérifie que l'image appartient à l'utilisateur
    - Retourne les résultats IA + lien vers le PDF résumé
    """
    user_id = current_user["user_id"]

    # Vérifier que l'image existe et appartient à l'utilisateur
    image_record = supabase.table("images")\
        .select("id, file_path, extraction_result, zones_result, result_summary_pdf, processing_status")\
        .eq("id", image_id)\
        .eq("user_id", user_id)\
        .single()\
        .execute()
    
    if not image_record.data:
        raise HTTPException(status_code=404, detail="Image non trouvée")
    
    image_data = image_record.data

    return JSONResponse(
        status_code=200,
        content={
            "image_id": image_id,
            "status": image_data.get("processing_status"),
            "file_url": image_data.get("file_path"),
            "extraction_result": image_data.get("extraction_result"),
            "zones_result": image_data.get("zones_result"),
            "summary_pdf": supabase.storage.from_("files").get_public_url(image_data.get("result_summary_pdf"))
        }
    )
