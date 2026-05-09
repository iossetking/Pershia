from sqlmodel import SQLModel, Field
from datetime import datetime, timezone
from typing import Optional

def utc_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)


# ── Junction table: outfits ↔ garments with canvas layout ────────────────────

class OutfitGarment(SQLModel, table=True):
    __tablename__ = "outfits_garments"
    outfit_id: int = Field(foreign_key="outfits.outfit_id", primary_key=True)
    garment_id: int = Field(foreign_key="garments.garment_id", primary_key=True)
    pos_top: float = Field(default=0.0)
    pos_left: float = Field(default=0.0)
    pos_scale: float = Field(default=80.0)
    pos_z_index: int = Field(default=1)


class OutfitGarmentPublic(SQLModel):
    garment_id: int
    pos_top: float
    pos_left: float
    pos_scale: float
    pos_z_index: int


class OutfitGarmentCreate(SQLModel):
    garment_id: int
    pos_top: float
    pos_left: float
    pos_scale: float
    pos_z_index: int


# ── Outfit ────────────────────────────────────────────────────────────────────

class OutfitBase(SQLModel):
    user_id: int = Field(nullable=False)
    title: str = Field(nullable=False)
    description: Optional[str] = Field(default=None)
    is_public: bool = Field(default=False)
    created_at: datetime = Field(default_factory=utc_now)


class Outfit(OutfitBase, table=True):
    __tablename__ = "outfits"
    outfit_id: Optional[int] = Field(default=None, primary_key=True)


class OutfitCreate(SQLModel):
    user_id: int = 1
    title: str
    description: Optional[str] = None
    is_public: bool = False
    garments: list[OutfitGarmentCreate]


class OutfitUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_public: Optional[bool] = None


class OutfitPublic(OutfitBase):
    outfit_id: int
    garments: list[OutfitGarmentPublic]
