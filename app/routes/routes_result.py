from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from ..config.supabase_connection import supabase
from ..utils.user import get_current_user
from ..utils.pdf import generate_summary_pdf  
import os
from datetime import datetime

router = APIRouter(prefix="/results", tags=["results"])

@router.post("/{image_id}")
async def create_result_for_image(image_id: str, current_user: dict = Depends(get_current_user)):
    """
    Crée un dossier résultat pour l'image uploadée et génère un PDF de résumé.
    """
    user_id = current_user["user_id"]

    # Vérifier que l'image existe et appartient à l'utilisateur
    image_record = supabase.table("images")\
        .select("*")\
        .eq("id", image_id)\
        .eq("user_id", user_id)\
        .single()\
        .execute()
    
    if not image_record.data:
        raise HTTPException(status_code=404, detail="Image non trouvée")
    
    image_data = image_record.data

    # Créer les dossiers results/<user_id>/<image_id>
    user_dir = os.path.join("results", user_id)
    os.makedirs(user_dir, exist_ok=True)

    result_dir = os.path.join(user_dir, image_id)
    os.makedirs(result_dir, exist_ok=True)

    # Chemin du PDF résumé
    pdf_path = os.path.join(result_dir, "summary.pdf")

    # Récupérer ou simuler les résultats IA
    # (Dans ton projet, tu peux récupérer depuis la table des résultats IA)
    ai_results = {
        "air": "NON",
        "air_proteges": "NON",
        "dpl": "NON",
        "dpm": "NON",
        "enregistrement_personnel": "NON",
        "litige": "NON",
        "parcelles": "NON",
        "restriction": "NON",
        "tf_demande": "NON",
        "tf_en_cours": "NON",
        "tf_etat": "NON",
        "titre_reconstitue": "NON",
        "zone_inondable": "NON"
    }

    # URL de l'image
    image_url = image_data.get("file_path")

    # Générer le PDF résumé
    try:
        generate_summary_pdf(
            image_url=image_url,
            ai_results=ai_results,
            output_path=pdf_path
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur génération PDF: {str(e)}")

    # Retourner l'info
    return JSONResponse(
        status_code=201,
        content={
            "message": "Dossier résultat créé et PDF généré avec succès",
            "result_dir": result_dir,
            "pdf_path": pdf_path,
            "ai_results": ai_results
        }
    )
