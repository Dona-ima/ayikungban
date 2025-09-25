from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi import BackgroundTasks
from fastapi.responses import JSONResponse
from ..config.supabase_connection import supabase
from ..utils.user import get_current_user
import asyncio
from functools import partial
from ..utils.ai_services import extract_parcelles_coordinates, determine_zone_layers, generate_pdf_summary
from ..routes.routes_notification import create_notification
from datetime import datetime
from pdf2image import convert_from_bytes
from io import BytesIO
import uuid
import json

async def process_pdf_upload(user_id: str, pdf_id: str, file_content: bytes, pdf_url: str):
    """Traitement asynchrone du PDF uploadé"""
    try:
        # Conversion PDF en images
        loop = asyncio.get_event_loop()
        images = await loop.run_in_executor(None, convert_from_bytes, file_content, 100)
        print(f"Conversion PDF terminée : {len(images)} pages trouvées")
        
        for i, image in enumerate(images):
            # Conversion et compression de l'image
            img_byte_arr = BytesIO()
            image.save(img_byte_arr, format="PNG", optimize=True, quality=50)
            img_bytes = img_byte_arr.getvalue()

            # Upload image
            image_filename = f"{pdf_id}_page_{i+1}.png"
            img_path = f"images/{user_id}/{image_filename}"
            supabase.storage.from_(BUCKET_NAME).upload(img_path, img_bytes)
            img_url = supabase.storage.from_(BUCKET_NAME).get_public_url(img_path)

            # Créer l'enregistrement image
            image_id = str(uuid.uuid4())
            # CORRECT
            image_data = {
                "id": image_id,
                "filename": image_filename,
                "upload_date": datetime.utcnow().isoformat(),
                "user_id": user_id,
                "file_path": img_url,
                "processing_status": "processing"
            }
            supabase.table("images").insert(image_data).execute()

            # Lancer l'analyse pour cette image
            await process_full_analysis(
                user_id=user_id,
                image_id=image_id,
                image_url=img_url,
                original_pdf_url=pdf_url,
                image_data=img_bytes
            )

        print(f"Traitement de toutes les pages terminé")

    except Exception as e:
        print(f"Erreur traitement PDF {pdf_id}: {str(e)}")
        # Ne plus mettre à jour le statut du PDF puisqu'il n'est plus en base


router = APIRouter(prefix="/images", tags=["images"])

BUCKET_NAME = "files"

@router.post("/upload-pdf")
async def upload_pdf(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    """Upload PDF et démarrage du traitement en arrière-plan"""
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Le fichier doit être un PDF")

    user_id = current_user["user_id"]
    pdf_id = str(uuid.uuid4())

    try:
        # Upload du PDF immédiat
        content = await file.read()
        pdf_path = f"pdfs/{user_id}/{pdf_id}.pdf"
        supabase.storage.from_(BUCKET_NAME).upload(pdf_path, content)
        pdf_url = supabase.storage.from_(BUCKET_NAME).get_public_url(pdf_path)

        # Lancer directement le traitement en arrière-plan
        background_tasks.add_task(
            process_pdf_upload,
            user_id=user_id,
            pdf_id=pdf_id,
            file_content=content,
            pdf_url=pdf_url
        )

        # Réponse immédiate
        return JSONResponse(
            content={
                "message": "PDF reçu, traitement démarré",
                "pdf_id": pdf_id,
                "status": "uploading",
                "images": [{
                    "image_id": pdf_id,
                    "status": "uploading",
                    "processing_status": "uploading"
                }],
                "note": "Utilisez GET /images/pdf-status/{pdf_id} pour suivre le progrès"
            },
            status_code=202  # 202 Accepted - indique que le traitement est en cours
        )



    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur upload: {str(e)}")


# --- FONCTION DE TRAITEMENT COMPLET ---
async def process_full_analysis(user_id: str, image_id: str, image_url: str, original_pdf_url: str, image_data: bytes = None):
    print(f" Démarrage traitement complet pour image {image_id}")
    
    try:
        # Télécharger l'image depuis Supabase seulement si pas déjà en mémoire
        if not image_data:
            storage_path = image_url.split(f'/{BUCKET_NAME}/')[-1]
            image_data = supabase.storage.from_(BUCKET_NAME).download(storage_path)
            if not image_data:
                raise Exception("Impossible de télécharger l'image")
            print(f" Image téléchargée : {len(image_data)} bytes")

        # Exécution parallèle des modèles
        print(" Lancement des modèles en parallèle...")
        loop = asyncio.get_event_loop()
        
        # Exécuter l'extraction des parcelles
        parcelles_result = await loop.run_in_executor(None, extract_parcelles_coordinates, image_data)
        print(f" Résultat Modèle 1 : {parcelles_result}")
        
        # Déterminer les zones directement avec le résultat des parcelles
        zones_result = await loop.run_in_executor(None, determine_zone_layers, parcelles_result)
        print(f" Résultat Modèle 2 : {zones_result}")

        # Génération PDF de résumé en mémoire
        print(" Génération PDF de résumé...")
        pdf_bytes = generate_pdf_summary(
            text_data=zones_result,
            image_data=image_data,
            image_id=image_id
        )

        # Upload PDF dans Supabase
        pdf_filename = f"summary_{image_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        pdf_storage_path = f"results/{user_id}/{image_id}/{pdf_filename}"
        supabase.storage.from_(BUCKET_NAME).upload(pdf_storage_path, pdf_bytes)
        pdf_public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(pdf_storage_path)
        print(f" PDF généré et uploadé : {pdf_public_url}")

        # Mise à jour en base
        update_data = {
            "processing_status": "completed",
            "zones_result": json.dumps({
                **zones_result,
                "original_pdf_url": original_pdf_url
            }),
            "result_summary_pdf": pdf_public_url
        }
        result = supabase.table("images").update(update_data).eq("id", image_id).execute()
        if not result.data:
            raise Exception("Échec mise à jour en base")

        print(f" Traitement TERMINÉ pour image {image_id}")
        
        # Créer une notification de succès
        create_notification(
            user_id=user_id,
            title="Traitement terminé",
            message="Le traitement de votre levé topographique est terminé avec succès.",
            type="success",
            result_id=image_id,
            pdf_url=pdf_public_url
        )

    except Exception as e:
        print(f" ERREUR traitement image {image_id}: {str(e)}")
        # Marquer l'image comme échouée
        supabase.table("images").update({
            "processing_status": "failed",
            "extraction_result": json.dumps({"error": str(e)}),  # ← extraction_result
        }).eq("id", image_id).execute()
        
        # Créer une notification d'erreur
        create_notification(
            user_id=user_id,
            title="Erreur de traitement",
            message=f"Une erreur est survenue lors du traitement de votre levé : {str(e)}",
            type="error",
            result_id=image_id
        )


# --- Endpoint statut ---
@router.get("/pdf-status/{pdf_id}")
async def get_pdf_status(
    pdf_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Obtenir le statut de traitement des images extraites d'un PDF"""
    user_id = current_user["user_id"]
    try:
        result = supabase.table("images").select(
            "id, processing_status, extraction_result, filename"
        ).eq("user_id", user_id).execute()
        
        if not result.data:
            return {
                "pdf_id": pdf_id,
                "status": "not_found",
                "total_pages": 0,
                "processed_pages": 0,
                "images": []
            }

        all_records = result.data

        
        # Trouver le PDF principal (par filename ou autre logique)
        pdf_record = next((item for item in all_records if pdf_id in item.get("filename", "")), None)
        
        # Ou plus simple : chercher par processing_status
        images = [item for item in all_records if item.get("processing_status") in ["completed", "processing", "failed"]]
        
        completed_images = [img for img in images if img["processing_status"] == "completed"]
        
        return {
            "pdf_id": pdf_id,
            "status": "completed" if completed_images else "processing",
            "total_pages": len(images),
            "processed_pages": len(completed_images),
            "images": [{"id": img["id"], "status": img["processing_status"]} for img in images]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur vérification statut: {str(e)}")

@router.get("/processing-status/{image_id}")
async def get_processing_status(
    image_id: str, 
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["user_id"]
    try:
    
        result = supabase.table("images").select(
            "id, processing_status, extraction_result, result_summary_pdf"  # ← extraction_result
        )
        # Vérifier si on trouve quelque chose
        if not result.data or len(result.data) == 0:
            raise HTTPException(status_code=404, detail="Image non trouvée")
        
        image = result.data[0]  # Prendre le premier résultat
        status = image.get("processing_status", "unknown")
        zones = json.loads(image["zones_result"]) if image["zones_result"] else {}
        
        response = {
            "image_id": image_id,
            "status": status,
            "is_completed": status == "completed",
            "is_processing": status == "processing",
            "is_failed": status == "failed",
            "error": zones.get("error"),
            "result_pdf": image.get("result_summary_pdf")  # AJOUT du lien PDF
        }

        return response

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur vérification statut: {str(e)}")