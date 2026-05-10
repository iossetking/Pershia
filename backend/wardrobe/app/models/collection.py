from sqlmodel import SQLModel, Field
from datetime import datetime, timezone
from typing import Optional

def utc_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)


# ── Junction tables ───────────────────────────────────────────────────────────

class CollectionGarment(SQLModel, table=True):
    __tablename__ = "collections_garments"
    collection_id: int = Field(foreign_key="collections.collection_id", primary_key=True)
    garment_id: int = Field(foreign_key="garments.garment_id", primary_key=True)


class CollectionOutfit(SQLModel, table=True):
    __tablename__ = "collections_outfits"
    collection_id: int = Field(foreign_key="collections.collection_id", primary_key=True)
    outfit_id: int = Field(foreign_key="outfits.outfit_id", primary_key=True)


# ── Collection ────────────────────────────────────────────────────────────────

class CollectionBase(SQLModel):
    user_id: int = Field(nullable=False)
    title: str = Field(nullable=False)
    description: Optional[str] = Field(default=None)
    is_public: bool = Field(default=False)
    created_at: datetime = Field(default_factory=utc_now)


class Collection(CollectionBase, table=True):
    __tablename__ = "collections"
    collection_id: Optional[int] = Field(default=None, primary_key=True)


class CollectionCreate(SQLModel):
    user_id: int = 1
    title: str
    description: Optional[str] = None
    is_public: bool = False
    garment_ids: list[int] = []
    outfit_ids: list[int] = []


class CollectionUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_public: Optional[bool] = None
    garment_ids: Optional[list[int]] = None
    outfit_ids: Optional[list[int]] = None


class CollectionPublic(CollectionBase):
    collection_id: int
    garment_ids: list[int]
    outfit_ids: list[int]
