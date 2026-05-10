from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import select, delete
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.collection import (
    Collection, CollectionGarment, CollectionOutfit,
    CollectionCreate, CollectionUpdate, CollectionPublic,
)
from app.dependencies import get_db_session

router = APIRouter(prefix="/collections", tags=["Collections"])


async def _collection_public(collection: Collection, session: AsyncSession) -> CollectionPublic:
    garment_result = await session.execute(
        select(CollectionGarment).where(CollectionGarment.collection_id == collection.collection_id)
    )
    outfit_result = await session.execute(
        select(CollectionOutfit).where(CollectionOutfit.collection_id == collection.collection_id)
    )
    garment_ids = [cg.garment_id for cg in garment_result.scalars().all()]
    outfit_ids = [co.outfit_id for co in outfit_result.scalars().all()]
    return CollectionPublic(**collection.model_dump(), garment_ids=garment_ids, outfit_ids=outfit_ids)


@router.get("/", response_model=list[CollectionPublic], status_code=status.HTTP_200_OK)
async def read_collections(
    session: AsyncSession = Depends(get_db_session),
    user_id: int = Query(...),
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
):
    result = await session.execute(
        select(Collection).where(Collection.user_id == user_id).offset(offset).limit(limit)
    )
    collections = result.scalars().all()
    return [await _collection_public(c, session) for c in collections]


@router.get("/{collection_id}", response_model=CollectionPublic, status_code=status.HTTP_200_OK)
async def read_collection(collection_id: int, session: AsyncSession = Depends(get_db_session)):
    collection = await session.get(Collection, collection_id)
    if not collection:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found")
    return await _collection_public(collection, session)


@router.post("/", response_model=CollectionPublic, status_code=status.HTTP_201_CREATED)
async def create_collection(
    collection_data: CollectionCreate,
    session: AsyncSession = Depends(get_db_session),
):
    try:
        collection = Collection(
            user_id=collection_data.user_id,
            title=collection_data.title,
            description=collection_data.description,
            is_public=collection_data.is_public,
        )
        session.add(collection)
        await session.flush()

        for garment_id in set(collection_data.garment_ids):
            session.add(CollectionGarment(collection_id=collection.collection_id, garment_id=garment_id))

        for outfit_id in set(collection_data.outfit_ids):
            session.add(CollectionOutfit(collection_id=collection.collection_id, outfit_id=outfit_id))

        await session.commit()
        await session.refresh(collection)
        return CollectionPublic(
            **collection.model_dump(),
            garment_ids=list(set(collection_data.garment_ids)),
            outfit_ids=list(set(collection_data.outfit_ids)),
        )
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.put("/{collection_id}", response_model=CollectionPublic, status_code=status.HTTP_200_OK)
async def update_collection(
    collection_id: int,
    collection_data: CollectionUpdate,
    session: AsyncSession = Depends(get_db_session),
):
    try:
        collection = await session.get(Collection, collection_id)
        if not collection:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found")

        scalar_fields = collection_data.model_dump(exclude_unset=True, exclude={"garment_ids", "outfit_ids"})
        if scalar_fields:
            collection.sqlmodel_update(scalar_fields)
            session.add(collection)

        if collection_data.garment_ids is not None:
            await session.execute(
                delete(CollectionGarment).where(CollectionGarment.collection_id == collection_id)
            )
            for gid in set(collection_data.garment_ids):
                session.add(CollectionGarment(collection_id=collection_id, garment_id=gid))

        if collection_data.outfit_ids is not None:
            await session.execute(
                delete(CollectionOutfit).where(CollectionOutfit.collection_id == collection_id)
            )
            for oid in set(collection_data.outfit_ids):
                session.add(CollectionOutfit(collection_id=collection_id, outfit_id=oid))

        await session.commit()
        await session.refresh(collection)
        return await _collection_public(collection, session)
    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.delete("/{collection_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_collection(collection_id: int, session: AsyncSession = Depends(get_db_session)):
    try:
        collection = await session.get(Collection, collection_id)
        if not collection:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Collection not found")
        await session.delete(collection)
        await session.commit()
    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
