from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
from ..models.image import Image
from ..config.supabase_connection import supabase
from ..utils.user import get_current_user
from ..utils.ai_services import process_image_extraction
from datetime import datetime
from pdf2image import convert_from_bytes
from io import BytesIO
import os
import uuid

router = APIRouter(prefix="/images", tags=["images"])

BUCKET_NAME = "files"

@router.post("/upload-pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user)
):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Le fichier doit être un PDF")

    user_id = current_user["user_id"]
    unique_id = str(uuid.uuid4())
    pdf_path = f"pdfs/{user_id}/{unique_id}.pdf"

    try:
        content = await file.read()

        # Upload du PDF original avec gestion d'erreur Supabase
        try:
            pdf_upload_result = supabase.storage.from_(BUCKET_NAME).upload(pdf_path, content)
            print(f"PDF upload result: {pdf_upload_result}")
        except Exception as upload_error:
            print(f"Erreur upload PDF: {str(upload_error)}")
            # Essayer de vérifier si le fichier existe déjà
            try:
                # Si le fichier existe déjà, on peut continuer
                pdf_url = supabase.storage.from_(BUCKET_NAME).get_public_url(pdf_path)
                print(f"Fichier PDF déjà existant, URL: {pdf_url}")
            except:
                raise HTTPException(status_code=500, detail=f"Erreur upload PDF: {str(upload_error)}")

        pdf_url = supabase.storage.from_(BUCKET_NAME).get_public_url(pdf_path)
        print(f"PDF URL: {pdf_url}")

        # Conversion PDF en images
        try:
            images = convert_from_bytes(content, dpi=300)
            print(f"PDF converti en {len(images)} images")
        except Exception as convert_error:
            raise HTTPException(status_code=500, detail=f"Erreur conversion PDF: {str(convert_error)}")

        image_results = []

        for i, image in enumerate(images):
            try:
                # Conversion de l'image en bytes
                img_byte_arr = BytesIO()
                image.save(img_byte_arr, format="PNG")
                img_byte_arr = img_byte_arr.getvalue()

                # Upload de l'image
                image_filename = f"{unique_id}_page_{i+1}.png"
                img_path = f"images/{user_id}/{image_filename}"

                try:
                    img_upload_result = supabase.storage.from_(BUCKET_NAME).upload(img_path, img_byte_arr)
                    print(f"Image {i+1} upload result: {img_upload_result}")
                except Exception as img_upload_error:
                    print(f"Erreur upload image {i+1}: {str(img_upload_error)}")
                    # Continuer avec les autres images même si une échoue
                    continue

                img_url = supabase.storage.from_(BUCKET_NAME).get_public_url(img_path)
                print(f"Image {i+1} URL: {img_url}")

                # Créer l'objet Image et le sauvegarder en base
                image_id = str(uuid.uuid4())
                image_data = {
                    "id": image_id,
                    "filename": image_filename,
                    "upload_date": datetime.utcnow().isoformat(),
                    "user_id": user_id,
                    "file_path": img_url,
                    "original_pdf": pdf_url,
                    "processing_status": "processing"
                }
                
                # Sauvegarder en base de données
                try:
                    db_result = supabase.table("images").insert(image_data).execute()
                    print(f"Image {i+1} sauvée en DB: {len(db_result.data) > 0}")
                except Exception as db_error:
                    print(f"Erreur DB pour image {i+1}: {str(db_error)}")
                    # Continuer même si la sauvegarde DB échoue
                    continue
               
                # Traitement IA (optionnel)
                try:
                    extraction_result = await process_image_extraction(img_url, image_id)
                    image_results.append(extraction_result)
                    
                    # Mettre à jour le statut après traitement
                    supabase.table("images").update({
                        "processing_status": "completed"
                    }).eq("id", image_id).execute()
                    
                except Exception as ai_error:
                    print(f"Erreur traitement IA image {i+1}: {str(ai_error)}")
                    # Ajouter quand même l'image sans traitement IA
                    image_results.append({
                        "image_id": image_id,
                        "image_url": img_url,
                        "status": "uploaded",
                        "ai_processing": "failed"
                    })
                    
                    # Marquer comme échec de traitement IA
                    supabase.table("images").update({
                        "processing_status": "failed"
                    }).eq("id", image_id).execute()

            except Exception as page_error:
                print(f"Erreur traitement page {i+1}: {str(page_error)}")
                continue

        return JSONResponse(
            content={
                "message": f"PDF converti avec succès en {len(images)} images",
                "pdf_url": pdf_url,
                "images": [result.get("image_url") for result in image_results if result and result.get("image_url")],
                "extraction_results": image_results,
                "total_pages": len(images),
                "processed_successfully": len(image_results)
            },
            status_code=201
        )

    except HTTPException:
        raise
    except Exception as e:
        print(f"Erreur générale: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur lors du traitement: {str(e)}")

# Route de test pour vérifier la configuration du bucket
@router.get("/test-bucket")
async def test_bucket(current_user: dict = Depends(get_current_user)):
    """Route de test pour vérifier la configuration du bucket"""
    try:
        # Lister les buckets disponibles
        buckets = supabase.storage.list_buckets()
        
        # Vérifier si notre bucket existe
        bucket_exists = any(bucket['name'] == BUCKET_NAME for bucket in buckets)
        
        if not bucket_exists:
            return {
                "error": f"Bucket '{BUCKET_NAME}' n'existe pas",
                "available_buckets": [bucket['name'] for bucket in buckets],
                "solution": f"Créez un bucket nommé '{BUCKET_NAME}' dans votre dashboard Supabase"
            }
        
        # Test d'upload simple
        test_content = b"test file content"
        test_path = f"test/{current_user['user_id']}/test.txt"
        
        try:
            upload_result = supabase.storage.from_(BUCKET_NAME).upload(test_path, test_content)
            
            # Nettoyer le fichier de test
            supabase.storage.from_(BUCKET_NAME).remove([test_path])
            
            return {
                "status": "success",
                "bucket": BUCKET_NAME,
                "message": "Bucket configuré correctement",
                "upload_test": "réussi"
            }
            
        except Exception as upload_error:
            return {
                "status": "error",
                "bucket": BUCKET_NAME,
                "message": "Bucket existe mais erreur d'upload",
                "error": str(upload_error),
                "solution": "Vérifiez les permissions du bucket"
            }
        
    except Exception as e:
        return {
            "status": "error",
            "message": "Erreur lors du test du bucket",
            "error": str(e)
        }