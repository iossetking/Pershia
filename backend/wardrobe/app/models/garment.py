from sqlmodel import SQLModel, Field
from sqlalchemy import Column
from pgvector.sqlalchemy import Vector
from datetime import datetime, timezone
from typing import Optional, Any

def utc_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)

class GarmentBase(SQLModel):
    user_id: int = Field(nullable=False)
    s3_url: str = Field(nullable=False)
    s3_key: str = Field(nullable=False)
    color: str = Field(nullable=False)
    fabric: str = Field(nullable=False)
    category: str = Field(nullable=False)
    style: str = Field(nullable=False)
    description: Optional[str] = Field(default=None)
    is_public: bool = Field(default=False)
    is_owned: bool = Field(default=False)
    created_at: datetime = Field(default_factory=utc_now)

class Garment(GarmentBase, table=True):
    __tablename__ = "garments"
    garment_id: Optional[int] = Field(default=None, primary_key=True)
    embedding: Optional[Any] = Field(
        default=None,
        sa_column=Column(Vector(1024), nullable=True)
    )

class GarmentCreate(GarmentBase):
    pass

class GarmentPublic(GarmentBase):
    garment_id: int
