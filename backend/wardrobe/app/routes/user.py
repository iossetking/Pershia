import traceback
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import select, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User, UserCreate, UserUpdate, UserPublic, GoogleAuthRequest
from app.dependencies import get_db_session
from app.services.google_auth_service import verify_google_token

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=list[UserPublic], status_code=status.HTTP_200_OK)
async def read_users(
    session: AsyncSession = Depends(get_db_session),
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
):
    result = await session.execute(select(User).offset(offset).limit(limit))
    return result.scalars().all()


@router.get("/{user_id}", response_model=UserPublic, status_code=status.HTTP_200_OK)
async def read_user(user_id: int, session: AsyncSession = Depends(get_db_session)):
    user = await session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.post("/", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
async def create_user(
    user_data: UserCreate,
    session: AsyncSession = Depends(get_db_session),
):
    try:
        user = User(**user_data.model_dump())
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.put("/{user_id}", response_model=UserPublic, status_code=status.HTTP_200_OK)
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    session: AsyncSession = Depends(get_db_session),
):
    try:
        user = await session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        user.sqlmodel_update(user_data.model_dump(exclude_unset=True))
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user
    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, session: AsyncSession = Depends(get_db_session)):
    try:
        user = await session.get(User, user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        await session.delete(user)
        await session.commit()
    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/google-auth", response_model=UserPublic, status_code=status.HTTP_200_OK)
async def google_auth(
    body: GoogleAuthRequest,
    session: AsyncSession = Depends(get_db_session),
):
    try:
        google_info = await verify_google_token(body.token)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

    try:
        result = await session.execute(
            select(User).where(
                or_(User.google_id == google_info["google_id"], User.email == google_info["email"])
            )
        )
        user = result.scalars().first()

        if user:
            user.name = google_info["name"]
            if not user.google_id:
                user.google_id = google_info["google_id"]
        else:
            username = google_info["email"].split("@")[0]
            user = User(
                username=username,
                email=google_info["email"],
                name=google_info["name"],
                google_id=google_info["google_id"],
            )
            session.add(user)

        await session.commit()
        await session.refresh(user)
        return user
    except Exception as e:
        traceback.print_exc()
        await session.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
