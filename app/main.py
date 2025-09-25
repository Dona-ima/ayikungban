from fastapi import FastAPI
from app.routes import routes_auth
from app.routes import routes_user
from app.routes import routes_admin
from app.routes.routes_image import router as image_router

app = FastAPI(title="ANDF BJ", version="1.0.0")

app.include_router(routes_auth.router)
app.include_router(routes_user.router)
#app.include_router(routes_admin.router)
app.include_router(image_router)

@app.get("/")
def root():
    return {"message": "Bienvenue dans l'API Titres Fonciers 🚀"}
