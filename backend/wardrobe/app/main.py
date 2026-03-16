# Este archivo ensambla la aplicación.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Creacion de la app
app = FastAPI(
    title='Pershia Wardrobe API',
    description='Bankend del guardaropa',
    version='0.1.0',
)

# CORS para evitar request de otros sitios
app.add_middleware(
    CORSMiddleware, 
    allow_origins = [
        "http://localhost:5173", 
        "http://localhost:3000", 
    ],
    allow_credentials = True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check: vereficar si el servidor esta correctamente iniciado
@app.get('/health', tags=['Health'])
async def health_check():
    """Verifica que el servidor está corriendo correctamente."""
    return {"status": "ok", "service": "pershia-wardrobe-api"}



