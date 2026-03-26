from sqlmodel import SQLModel, Field
from datetime import datetime, timezone
from typing import Optional

def utc_now():
    return datetime.now(timezone.utc)

class UserBase(SQLModel):
    #user_id: int = Field(default=None, primary_key=True)
    user_id: int = Field(nullable=False)
    username: str = Field(nullable=False)
    email: str = Field(nullable=False)
    hashed_pw: str = Field(nullable=False)
    preferences: str = Field(nullable=False)
    #joined_at: datetime | None = Field(default=None, sa_column_kwargs={"server_default": text("CURRENT_TIMESTAMP")})
    joined_at: datetime = Field(default_factory=utc_now)

class User(UserBase, table=True):
    __tablename__ = "users"
    user_id: Optional[int] = Field(default=None, primary_key=True)

class UserCreate(UserBase):
    pass

class UserPublic(UserBase):
    user_id: int
