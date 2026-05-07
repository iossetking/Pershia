from sqlmodel import SQLModel, Field
from datetime import datetime, timezone
from typing import Optional

def utc_now():
    return datetime.now(timezone.utc)

class ImageBase(SQLModel):
    s3_url: str = Field(nullable=False)
    s3_key: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=utc_now)

class Image(ImageBase, table=True):
    __tablename__ = "images"
    image_id: Optional[int] = Field(default=None, primary_key=True)

class ImagePublic(ImageBase):
    image_id: int
