import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

# Charger le fichier .env du dossier app
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(env_path)

smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
smtp_port = int(os.getenv("SMTP_PORT", 587))
sender_email = os.getenv("SENDER_EMAIL")
sender_password = os.getenv("SENDER_PASSWORD")

def send_otp_email(recipient_email: str, otp: str):
    """Envoie l'OTP par email."""
    subject = "Votre code OTP"
    body = f"Bonjour,\n\nVoici votre code OTP pour vous connecter : {otp}\n\nCordialement."

    # Créer le message email
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = recipient_email
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    try:
        # Connexion au serveur SMTP
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()  # sécurise la connexion
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, recipient_email, message.as_string())
        server.quit()
        print(f"OTP envoyé à {recipient_email}")
        return True
    except Exception as e:
        print("Erreur lors de l'envoi de l'email :", e)
        return False
