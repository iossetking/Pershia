from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File, Form
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.garment import Garment, GarmentCreate, GarmentPublic
from app.dependencies import get_db_session
from app.services.image_service import save_image
from app.services.qwen_service import analyze_garment
from app.services.embedding_service import embed_garment, embed_query

router = APIRouter(
    prefix="/garments",
    tags=["Garments"]
)


@router.get("/", response_model=list[GarmentPublic], status_code=status.HTTP_200_OK)
async def read_garments(
    session: AsyncSession = Depends(get_db_session),
    user_id: int = Query(...),
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100)
):
    statement = select(Garment).where(Garment.user_id == user_id).offset(offset).limit(limit)
    result = await session.execute(statement)
    return result.scalars().all()


# /search must be defined before /{garment_id} to avoid int-cast conflict
@router.get("/search", response_model=list[GarmentPublic], status_code=status.HTTP_200_OK)
async def search_garments(
    q: str = Query(..., min_length=1),
    user_id: int = Query(...),
    limit: int = Query(default=12, ge=1, le=50),
    session: AsyncSession = Depends(get_db_session),
):
    query_vec = await embed_query(q)
    statement = (
        select(Garment)
        .where(Garment.user_id == user_id, Garment.embedding.isnot(None))
        .order_by(Garment.embedding.cosine_distance(query_vec))
        .limit(limit)
    )
    result = await session.execute(statement)
    return result.scalars().all()


@router.get("/{garment_id}", response_model=GarmentPublic, status_code=status.HTTP_200_OK)
async def read_garment(
    garment_id: int,
    session: AsyncSession = Depends(get_db_session)
):
    db_garment = await session.get(Garment, garment_id)
    if not db_garment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Garment not found")
    return db_garment


@router.get("/{garment_id}/similar", response_model=list[GarmentPublic], status_code=status.HTTP_200_OK)
async def similar_garments(
    garment_id: int,
    user_id: int = Query(...),
    limit: int = Query(default=6, ge=1, le=20),
    session: AsyncSession = Depends(get_db_session),
):
    garment = await session.get(Garment, garment_id)
    if not garment or garment.embedding is None:
        return []
    statement = (
        select(Garment)
        .where(
            Garment.user_id == user_id,
            Garment.garment_id != garment_id,
            Garment.embedding.isnot(None),
        )
        .order_by(Garment.embedding.cosine_distance(garment.embedding))
        .limit(limit)
    )
    result = await session.execute(statement)
    return result.scalars().all()


@router.post("/", response_model=GarmentPublic, status_code=status.HTTP_201_CREATED)
async def upload_garment(
    file: UploadFile = File(...),
    user_id: int = Form(default=1),
    session: AsyncSession = Depends(get_db_session)
):
    image_path = None
    try:
        image_path, relative_path = await save_image(file)
        metadata = await analyze_garment(image_path)

        embedding = None
        try:
            embedding = await embed_garment(metadata)
        except Exception as e:
            print(f"Warning: embedding failed, garment saved without it: {e}")

        garment = Garment(
            user_id=user_id,
            s3_url=relative_path,
            s3_key=image_path.name,
            color=metadata.get("color", ""),
            fabric=metadata.get("fabric", ""),
            category=metadata.get("category", "").strip().capitalize(),
            style=metadata.get("style", ""),
            description=metadata.get("description"),
            embedding=embedding,
        )
        session.add(garment)
        await session.commit()
        await session.refresh(garment)
        return garment
    except Exception as e:
        if image_path:
            image_path.unlink(missing_ok=True)
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
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
