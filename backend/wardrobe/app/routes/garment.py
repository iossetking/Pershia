from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.garment import Garment, GarmentCreate, GarmentPublic
from app.dependencies import get_db_session

router = APIRouter(
  prefix="/garments",
  tags=["Garments"]
)

@router.get("/", response_model=list[GarmentPublic], status_code=status.HTTP_200_OK)
async def read_garments(
    session: AsyncSession = Depends(get_db_session),
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100)
):
    statement = select(Garment).offset(offset).limit(limit)
    result = await session.execute(statement)
    garments = result.scalars().all()
    return garments

@router.get("/{garment_id}", response_model=GarmentPublic, status_code=status.HTTP_200_OK)
async def read_garment(
    garment_id: int,
    session: AsyncSession = Depends(get_db_session)
):
    # statement = select(Garment).where(Garment.garment_id == garment_id)
    # result = await session.execute(statement)
    # garment = result.scalars().first()
    db_garment = await session.get(Garment, garment_id)
    if not db_garment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Garment not found")
    return db_garment

@router.post("/", response_model=GarmentPublic, status_code=status.HTTP_201_CREATED)
async def create_garment(
    garment: GarmentCreate,
    session: AsyncSession = Depends(get_db_session)
):
  try:
    garment = Garment.model_validate(garment)
    session.add(garment)
    await session.commit()
    await session.refresh(garment)
    return garment
  except Exception as e:
    await session.rollback()
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.put("/{garment_id}", response_model=GarmentPublic, status_code=status.HTTP_200_OK)
async def update_garment(
    garment_id: int,
    new_garment_data: GarmentCreate,
    session: AsyncSession = Depends(get_db_session)
):
  try:
    db_garment = await session.get(Garment, garment_id)
    if not db_garment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Garment not found")

    update_data = new_garment_data.model_dump(exclude_unset=True)
    db_garment.sqlmodel_update(update_data)
    session.add(db_garment)
    await session.commit()
    await session.refresh(db_garment)
    return db_garment
  except Exception as e:
    await session.rollback()
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.delete("/{garment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_garment(
    garment_id: int,
    session: AsyncSession = Depends(get_db_session)
):
  try:
    db_garment = await session.get(Garment, garment_id)
    if not db_garment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Garment not found")
    await session.delete(db_garment)
    await session.commit()
    return {"message": "Garment deleted successfully"}
  except Exception as e:
    await session.rollback()
    raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
