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

        # Vérifier d'abord si l'utilisateur existe
        user_check = supabase.table("users").select("id").eq("id", user_id).execute()
        if not user_check.data or len(user_check.data) == 0:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé dans la table users")

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
            status_code=202
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur upload: {str(e)}")

async def process_pdf_upload(user_id: str, pdf_id: str, file_content: bytes, pdf_url: str):
    """Traitement asynchrone du PDF uploadé"""
    try:
        # Conversion PDF en images
        loop = asyncio.get_event_loop()
        images = await loop.run_in_executor(None, convert_from_bytes, file_content, 200)
        print(f"Conversion PDF terminée : {len(images)} pages trouvées")
        
        for i, image in enumerate(images):
            try:
                # Conversion et compression de l'image
                img_byte_arr = BytesIO()
                image.save(img_byte_arr, format="PNG", optimize=True, quality=85)
                img_bytes = img_byte_arr.getvalue()

                # Upload image
                image_filename = f"{pdf_id}_page_{i+1}.png"
                img_path = f"images/{user_id}/{image_filename}"
                supabase.storage.from_(BUCKET_NAME).upload(img_path, img_bytes)
                img_url = supabase.storage.from_(BUCKET_NAME).get_public_url(img_path)

                # Créer l'enregistrement image
                image_id = str(uuid.uuid4())
                image_data = {
                    "id": image_id,
                    "filename": image_filename,
                    "upload_date": datetime.utcnow().isoformat(),
                    "user_id": user_id,
                    "file_path": img_url,
                    "processing_status": "processing",
                    "zones_result": json.dumps({
                        "pdf_id": pdf_id,
                        "page_number": i + 1,
                        "total_pages": len(images)
                    })
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

            except Exception as page_error:
                print(f"Erreur traitement page {i+1}: {str(page_error)}")
                continue

        print("Traitement de toutes les pages terminé")

    except Exception as e:
        print(f"Erreur traitement PDF {pdf_id}: {str(e)}")

async def process_full_analysis(user_id: str, image_id: str, image_url: str, original_pdf_url: str, image_data: bytes = None):
    """Traitement complet d'une image"""
    print(f"Démarrage traitement complet pour image {image_id}")
    
    try:
        if not image_data:
            storage_path = image_url.split(f'/{BUCKET_NAME}/')[-1]
            image_data = supabase.storage.from_(BUCKET_NAME).download(storage_path)
            if not image_data:
                raise Exception("Impossible de télécharger l'image")

        # Vérifier si l'utilisateur existe toujours
        user_check = supabase.table("users").select("id").eq("id", user_id).execute()
        if not user_check.data or len(user_check.data) == 0:
            raise Exception(f"Utilisateur {user_id} non trouvé dans la table users")

        # Exécution des modèles
        loop = asyncio.get_event_loop()
        
        # Extraction des coordonnées
        parcelles_result = await loop.run_in_executor(None, extract_parcelles_coordinates, image_data)
        print(f"Résultat Modèle 1: {parcelles_result}")
        
        # Détermination des zones
        zones_result = await loop.run_in_executor(None, determine_zone_layers, parcelles_result)
        print(f"Résultat Modèle 2: {zones_result}")

        # Génération du PDF de résumé
        pdf_bytes = await loop.run_in_executor(None, generate_pdf_summary,
            text_data=zones_result,
            image_data=image_data,
            image_id=image_id
        )

        # Upload du PDF dans Supabase
        pdf_filename = f"summary_{image_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        pdf_storage_path = f"results/{user_id}/{image_id}/{pdf_filename}"
        supabase.storage.from_(BUCKET_NAME).upload(pdf_storage_path, pdf_bytes)
        pdf_public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(pdf_storage_path)
        print(f"PDF généré et uploadé : {pdf_public_url}")

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

        print(f"Traitement TERMINÉ pour image {image_id}")
        
        # Créer une notification de succès
        try:
            create_notification(
                user_id=user_id,
                title="Traitement terminé",
                message="Le traitement de votre levé topographique est terminé avec succès.",
                type="success",
                result_id=image_id,
                pdf_url=pdf_public_url
            )
        except Exception as notif_error:
            print(f"⚠️ Erreur notification (non critique): {str(notif_error)}")

    except Exception as e:
        error_msg = str(e)
        print(f"ERREUR traitement image {image_id}: {error_msg}")
        
        # Marquer l'image comme échouée
        try:
            supabase.table("images").update({
                "processing_status": "failed",
                "zones_result": json.dumps({"error": error_msg}),
            }).eq("id", image_id).execute()
            
            # Créer une notification d'erreur
            create_notification(
                user_id=user_id,
                title="Erreur de traitement",
                message=f"Une erreur est survenue lors du traitement de votre levé : {error_msg}",
                type="error",
                result_id=image_id
            )
        except Exception as update_error:
            print(f"Erreur supplémentaire lors de la mise à jour du statut: {str(update_error)}")

@router.get("/pdf-status/{pdf_id}")
async def get_pdf_status(
    pdf_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Obtenir le statut de traitement des images extraites d'un PDF"""
    user_id = current_user["user_id"]
    try:
        result = supabase.table("images").select(
            "*"
        ).eq("user_id", user_id).execute()
        
        if not result.data:
            return {
                "pdf_id": pdf_id,
                "status": "not_found",
                "total_pages": 0,
                "processed_pages": 0,
                "images": []
            }

        # Trouver toutes les images associées à ce PDF
        images = []
        for record in result.data:
            try:
                zones_data = record.get("zones_result", "{}")
                zones = json.loads(zones_data) if zones_data else {}
                if zones.get("pdf_id") == pdf_id:
                    images.append(record)
            except:
                continue
        
        if not images:
            return {
                "pdf_id": pdf_id,
                "status": "processing",
                "total_pages": 0,
                "processed_pages": 0,
                "images": []
            }

        completed_images = [img for img in images if img["processing_status"] == "completed"]
        failed_images = [img for img in images if img["processing_status"] == "failed"]
        
        # Déterminer le statut global
        if len(failed_images) == len(images):
            status = "failed"
        elif len(completed_images) == len(images):
            status = "completed"
        else:
            status = "processing"

        return {
            "pdf_id": pdf_id,
            "status": status,
            "total_pages": len(images),
            "processed_pages": len(completed_images),
            "images": [{
                "id": img["id"],
                "status": img["processing_status"],
                "error": json.loads(img["zones_result"]).get("error") if img["processing_status"] == "failed" else None
            } for img in images]
        }

    except Exception as e:
        print(f"Erreur get_pdf_status: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur vérification statut: {str(e)}")

@router.get("/processing-status/{image_id}")
async def get_processing_status(
    image_id: str, 
    current_user: dict = Depends(get_current_user)
):
    """Obtenir le statut de traitement d'une image spécifique"""
    user_id = current_user["user_id"]
    try:
        result = supabase.table("images").select(
            "*"
        ).eq("id", image_id).eq("user_id", user_id).execute()
        
        if not result.data or len(result.data) == 0:
            raise HTTPException(status_code=404, detail="Image non trouvée")
        
        image = result.data[0]
        status = image.get("processing_status", "unknown")
        
        try:
            zones = json.loads(image.get("zones_result", "{}"))
        except:
            zones = {}
        
        response = {
            "image_id": image_id,
            "status": status,
            "is_completed": status == "completed",
            "is_processing": status == "processing",
            "is_failed": status == "failed",
            "error": zones.get("error"),
            "result_pdf": image.get("result_summary_pdf")
        }

        return response

    except HTTPException:
        raise
    except Exception as e:
        print(f"Erreur get_processing_status: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur vérification statut: {str(e)}")