import json
from pathlib import Path

ANIP_FILE = Path(__file__).parent / "anip_data.json"

def load_anip_data():
    with open(ANIP_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def get_user_from_anip(npi: str):
    data = load_anip_data()
    for user in data:
        if user["npi"] == npi:
            return user
    return None
