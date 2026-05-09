from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.outfit import (
    Outfit, OutfitGarment,
    OutfitCreate, OutfitUpdate,
    OutfitPublic, OutfitGarmentPublic,
)
from app.dependencies import get_db_session

router = APIRouter(prefix="/outfits", tags=["Outfits"])


async def _outfit_public(outfit: Outfit, session: AsyncSession) -> OutfitPublic:
    result = await session.execute(
        select(OutfitGarment).where(OutfitGarment.outfit_id == outfit.outfit_id)
    )
    garments = [
        OutfitGarmentPublic(
            garment_id=og.garment_id,
            pos_top=og.pos_top,
            pos_left=og.pos_left,
            pos_scale=og.pos_scale,
            pos_z_index=og.pos_z_index,
        )
        for og in result.scalars().all()
    ]
    return OutfitPublic(**outfit.model_dump(), garments=garments)


@router.get("/", response_model=list[OutfitPublic], status_code=status.HTTP_200_OK)
async def read_outfits(
    session: AsyncSession = Depends(get_db_session),
    user_id: int = Query(...),
    offset: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100),
):
    result = await session.execute(
        select(Outfit).where(Outfit.user_id == user_id).offset(offset).limit(limit)
    )
    outfits = result.scalars().all()
    return [await _outfit_public(o, session) for o in outfits]


@router.get("/{outfit_id}", response_model=OutfitPublic, status_code=status.HTTP_200_OK)
async def read_outfit(outfit_id: int, session: AsyncSession = Depends(get_db_session)):
    outfit = await session.get(Outfit, outfit_id)
    if not outfit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Outfit not found")
    return await _outfit_public(outfit, session)


@router.post("/", response_model=OutfitPublic, status_code=status.HTTP_201_CREATED)
async def create_outfit(
    outfit_data: OutfitCreate,
    session: AsyncSession = Depends(get_db_session),
):
    try:
        outfit = Outfit(
            user_id=outfit_data.user_id,
            title=outfit_data.title,
            description=outfit_data.description,
            is_public=outfit_data.is_public,
        )
        session.add(outfit)
        await session.flush()

        # Deduplicate by garment_id — last position wins
        seen: dict[int, OutfitGarmentPublic] = {}
        for g in outfit_data.garments:
            seen[g.garment_id] = g

        garment_links: list[OutfitGarmentPublic] = []
        for g in seen.values():
            og = OutfitGarment(
                outfit_id=outfit.outfit_id,
                garment_id=g.garment_id,
                pos_top=g.pos_top,
                pos_left=g.pos_left,
                pos_scale=g.pos_scale,
                pos_z_index=g.pos_z_index,
            )
            session.add(og)
            garment_links.append(
                OutfitGarmentPublic(
                    garment_id=g.garment_id,
                    pos_top=g.pos_top,
                    pos_left=g.pos_left,
                    pos_scale=g.pos_scale,
                    pos_z_index=g.pos_z_index,
                )
            )

        await session.commit()
        await session.refresh(outfit)
        return OutfitPublic(**outfit.model_dump(), garments=garment_links)
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.put("/{outfit_id}", response_model=OutfitPublic, status_code=status.HTTP_200_OK)
async def update_outfit(
    outfit_id: int,
    outfit_data: OutfitUpdate,
    session: AsyncSession = Depends(get_db_session),
):
    try:
        outfit = await session.get(Outfit, outfit_id)
        if not outfit:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Outfit not found")
        outfit.sqlmodel_update(outfit_data.model_dump(exclude_unset=True))
        session.add(outfit)
        await session.commit()
        await session.refresh(outfit)
        return await _outfit_public(outfit, session)
    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.delete("/{outfit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_outfit(outfit_id: int, session: AsyncSession = Depends(get_db_session)):
    try:
        outfit = await session.get(Outfit, outfit_id)
        if not outfit:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Outfit not found")
        await session.delete(outfit)
        await session.commit()
    except HTTPException:
        raise
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
