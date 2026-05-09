from sqlmodel import SQLModel, Field
from datetime import datetime, timezone
from typing import Optional


def utc_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)


class UserBase(SQLModel):
    username: str = Field(nullable=False)
    email: str = Field(nullable=False)
    name: Optional[str] = Field(default=None)
    preferences: Optional[str] = Field(default=None)
    joined_at: datetime = Field(default_factory=utc_now)


class User(UserBase, table=True):
    __tablename__ = "users"
    user_id: Optional[int] = Field(default=None, primary_key=True)
    hashed_pw: Optional[str] = Field(default=None)
    google_id: Optional[str] = Field(default=None)


class UserCreate(SQLModel):
    username: str
    email: str
    name: Optional[str] = None
    hashed_pw: Optional[str] = None


class UserUpdate(SQLModel):
    username: Optional[str] = None
    name: Optional[str] = None
    preferences: Optional[str] = None


class UserPublic(SQLModel):
    user_id: int
    username: str
    email: str
    name: Optional[str] = None
    preferences: Optional[str] = None
    joined_at: datetime


class GoogleAuthRequest(SQLModel):
    token: str
