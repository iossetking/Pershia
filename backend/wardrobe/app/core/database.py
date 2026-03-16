# database.py — Conexión async a PostgreSQL

# Este archivo gestiona la conexión a la base de datos y proveer sessions a quien las necesite.
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings

# Engine gestionamos las conexiones de sqlalchemy
engine = create_async_engine(
    settings.DATABASE_URL, # URL de la database
    echo=settings.APP_ENV == 'development', # Imprimir cada query de SQL (solo en development)
    pool_pre_ping = True,   # Verificar si la pool sigue activa
    )

# SessionFactory 
AsyncSessionLocal = async_sessionmaker(
    bind = engine, # Cada session usa el engine
    class_ = AsyncSession, # Las sessions seran async
    expire_on_commit = False, # Para que no se borre memoria despues de commit
)


# Base para los modelos
class Base(DeclarativeBase):
    pass

# Dependency
async def get_db():
    """
    Dependency que provee una session de DB a cada endpoint.
    """
    async with AsyncSessionLocal() as session:
        yield session
