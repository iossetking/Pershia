# database.py — Async connection to PostgreSQL

# This file manages the database connection and provides sessions to those who need them.
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

from sqlmodel import SQLModel, select

from app.core.config import settings

# Engine manages the connections of sqlalchemy
engine = create_async_engine(
    settings.DATABASE_URL, # URL of the database
    echo=settings.APP_ENV == 'development', # Print each SQL query (only in development)
    pool_pre_ping = True,   # Verify if the pool is still active
    )

# SessionFactory 
AsyncSessionLocal = async_sessionmaker(
    bind = engine, # Each session uses the engine
    class_ = AsyncSession, # Sessions will be async
    expire_on_commit = False, # So that memory is not deleted after commit
)


# Base for the models
class Base(SQLModel):
    pass

# Dependency
async def get_session():
    """
    Dependency which provides a DB session to each endpoint.
    """
    async with AsyncSessionLocal() as session:
        yield session
