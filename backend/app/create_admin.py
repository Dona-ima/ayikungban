# create_admin.py
import uuid
from datetime import datetime
from getpass import getpass
from passlib.context import CryptContext
from app.config.supabase_connection import db
from models.user import User

# Pour hasher le mot de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_admin():
    print("=== Création d'un compte admin ===")
    npi = input("Enter admin NPI: ").strip()
    first_name = input("First name: ").strip()
    last_name = input("Last name: ").strip()
    phone_number = input("Phone number: ").strip()
    email = input("Email (optional): ").strip() or None
    sex = input("Sex: ").strip()
    address = input("Address (optional): ").strip() or None
    profession = input("Profession (optional): ").strip() or None
    date_of_birth = input("Date of Birth (YYYY-MM-DD): ").strip()

    # Saisir le mot de passe en caché
    password = getpass("Password: ")
    confirm_password = getpass("Confirm Password: ")
    if password != confirm_password:
        print("Passwords do not match!")
        return

    hashed_password = pwd_context.hash(password)

    # Créer l'ID de l'admin
    user_id = str(uuid.uuid4())
    admin_user = User(
        user_id=user_id,
        npi=npi,
        first_name=first_name,
        last_name=last_name,
        sex=sex,
        date_of_birth=date_of_birth,
        email=email,
        phone_number=phone_number,
        address=address,
        profession=profession,
        role="admin",
        created_at=datetime.utcnow().isoformat(),
        password=hashed_password  # Stocker le mot de passe hashé
    )

    # Sauvegarder dans Firestore avec Pydantic V2
    db.collection("users").document(user_id).set(admin_user.model_dump())
    print(f"✅ Admin {first_name} {last_name} créé avec succès avec l'ID: {user_id}")

if __name__ == "__main__":
    create_admin()
