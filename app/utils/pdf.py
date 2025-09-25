# app/utils/pdf_utils.py
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle
import requests
from io import BytesIO
from PIL import Image as PILImage

def generate_summary_pdf(image_url: str, ai_results: dict, output_path: str):
    """
    Génère un PDF résumé avec :
    - l'image du levé topographique
    - les résultats IA sous forme de tableau
    """
    # Créer le canvas
    c = canvas.Canvas(output_path, pagesize=A4)
    width, height = A4

    # Titre
    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(width / 2, height - 2*cm, "Résumé de l'analyse de l'image")

    # Télécharger l'image depuis l'URL
    response = requests.get(image_url)
    if response.status_code != 200:
        raise Exception(f"Impossible de récupérer l'image depuis {image_url}")
    
    img_bytes = BytesIO(response.content)
    img = PILImage.open(img_bytes)

    # Redimensionner l'image si elle est trop grande
    max_width = width - 4*cm
    max_height = height / 2
    img_width, img_height = img.size
    ratio = min(max_width / img_width, max_height / img_height)
    img_width = img_width * ratio
    img_height = img_height * ratio

    # Placer l'image dans le PDF
    c.drawInlineImage(img, (width - img_width)/2, height - img_height - 4*cm, img_width, img_height)

    # Préparer le tableau des résultats IA
    table_data = [["Champ", "Résultat"]]
    for key, value in ai_results.items():
        table_data.append([key, value])

    # Créer le tableau
    table = Table(table_data, colWidths=[width/2 - 2*cm]*2)
    style = TableStyle([
        ("BACKGROUND", (0,0), (-1,0), colors.gray),
        ("TEXTCOLOR", (0,0), (-1,0), colors.white),
        ("GRID", (0,0), (-1,-1), 0.5, colors.black),
        ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),
        ("ALIGN", (0,0), (-1,-1), "CENTER"),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
    ])
    table.setStyle(style)

    # Placer le tableau
    table.wrapOn(c, width - 4*cm, height)
    table.drawOn(c, 2*cm, height - img_height - 8*cm)

    # Footer
    c.setFont("Helvetica", 10)
    c.drawString(2*cm, 1*cm, f"PDF généré le : {datetime.utcnow().isoformat()} UTC")

    # Sauvegarder le PDF
    c.save()
