# app/utils/ai_services.py

def extract_parcelles_coordinates(image_path: str) -> dict:
    """
    Simule l'extraction des coordonnées de la parcelle depuis l'image.
    En vrai ici tu mettras ton modèle OCR/computer vision.
    """
    return {
        "coordonnees": [
            {"x": 123, "y": 456},
            {"x": 789, "y": 101},
        ]
    }


def determine_zone_layers(coords: dict) -> dict:
    """
    Simule la détermination de la zone (litige, zone protégée, etc.)
    À remplacer par ton vrai modèle IA.
    """
    return {
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


from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from io import BytesIO

# app/utils/ai_services.py

def generate_pdf_summary(text_data: dict, image_data: bytes, image_id: str) -> bytes:
    """
    Génère un PDF résumé directement en mémoire.
    """
    from reportlab.lib.pagesizes import A4
    from reportlab.pdfgen import canvas
    from io import BytesIO

    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)

    c.drawString(100, 800, "Résumé de l'analyse IA")
    c.drawString(100, 780, f"Image ID: {image_id}")

    # Afficher les résultats OCR/extraction
    y = 750
    for key, value in text_data.items():
        c.drawString(100, y, f"{key}: {value}")
        y -= 20

    c.save()
    buffer.seek(0)
    return buffer.read()
