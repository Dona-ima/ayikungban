from fastapi import FastAPI
from app.routes import routes_auth
from app.routes import routes_user
from app.routes import routes_result
from app.routes.routes_image import router as image_router
from app.routes.routes_notification import router as notification_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="ANDF BJ", version="1.0.0")

app.include_router(routes_auth.router)
app.include_router(routes_user.router)
#app.include_router(routes_admin.router)
app.include_router(image_router)
app.include_router(routes_result.router)
app.include_router(notification_router)


# CONFIGURATION CORS - Ajoutez ça
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Vos routes existantes...
@app.get("/")
def root():
    return {"message": "Bienvenue dans l'API Titres Fonciers 🚀"}
