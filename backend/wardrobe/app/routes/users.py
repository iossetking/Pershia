from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.users import User, UserCreate, UserPublic
from app.dependencies import get_db_session

router = APIRouter(
    prefix="/users",
    tags=['Users']
)

@router.get("/", response_model=list[UserPublic], status_code=status.HTTP_200_OK)
async def read_users(
    session: AsyncSession = Depends(get_db_session),
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100)
):
    statement = select(User).offset(offset).limit(limit)
    result = await session.execute(statement)
    users = result.scalars().all()
    return users 

@router.get("/{user_id}", response_model=UserPublic, status_code=status.HTTP_200_OK)
async def read_user(
    user_id: int,
    session: AsyncSession = Depends(get_db_session)
):
    # statement = select(User).where(User.user_id == user_id)
    # result = await session.execute(statement)
    # garment = result.scalars().first()
    db_user = await session.get(User, user_id)
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='User not found')
    return db_user

@router.post("/", response_model=UserPublic, status_code=status.HTTP_200_OK)
async def create_garment(
    user: UserCreate,
    session: AsyncSession = Depends(get_db_session)
):
    try:
        user = User.model_validate(user)
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user 
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.put('/{user_id}', response_model=UserPublic, status_code=status.HTTP_200_OK)
async def update_user(
    user_id: int,
    new_user_data: UserCreate,
    session: AsyncSession = Depends(get_db_session)
):
    try:
        db_user = await session.get(User, user_id)
        if not db_user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        update_data = new_user_data.model_dump(exclude_unset=True)
        db_user.sqlmodel_update(update_data)
        session.add(db_user)
        await session.commit()
        await session.refresh(db_user)
        return db_user
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.delete("/{user}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: int,
    session: AsyncSession = Depends(get_db_session)
):
  try:
    db_user = await session.get(User, user_id)
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    await session.delete(db_user)
    await session.commit()
    return {"message": "User deleted successfully"}
  except Exception as e:
    await session.rollback()
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))