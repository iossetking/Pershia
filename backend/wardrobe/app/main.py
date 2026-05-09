from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

#
# Routes
#
from app.routes import garment, user, outfit

app = FastAPI(
    title='Pershia Wardrobe API',
    description='Wardrobe API',
    version='0.1.0',
)

prefix_url = "/api"

app.include_router(garment.router, prefix=prefix_url)
app.include_router(user.router, prefix=prefix_url)
app.include_router(outfit.router, prefix=prefix_url)

# CORS para evitar request de otros sitios
app.add_middleware(
    CORSMiddleware,
    allow_origins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8080",
    ],
    allow_credentials = True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Servir imágenes locales desde items/
items_dir = Path("items")
items_dir.mkdir(exist_ok=True)
app.mount("/items", StaticFiles(directory=str(items_dir)), name="items")


# Health check: vereficar si el servidor esta correctamente iniciado
@app.get('/health', tags=['Health'])
async def health_check():
    """Verifica que el servidor está corriendo correctamente."""
    return {"status": "ok", "service": "pershia-wardrobe-api"}



