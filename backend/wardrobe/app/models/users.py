from sqlmodel import SQLModel, Field
from datetime import datetime, timezone
from typing import Optional

def utc_now():
    return datetime.now(timezone.utc)

class UserBase(SQLModel):
    # Foreign key
    # user_id: int = Field(nullable=False, foreign_key="user.id")
    user_id: int = Field(nullable=False)
    s3_url: str = Field(nullable=False)
    s3_key: str = Field(nullable=False)
    color: str = Field(nullable=False)
    fabric: str = Field(nullable=False)
    category: str = Field(nullable=False)
    style: str = Field(nullable=False)
    is_public: bool = Field(default=False)
    is_owned: bool = Field(default=False)
    created_at: datetime = Field(default_factory=utc_now)
  
class User(UserBase, table=True):
    __tablename__ = "users"
    user_id: Optional[int] = Field(default=None, primary_key=True)

class UserCreate(UserBase):
    pass

class UserPublic(UserBase):
    user_id: int