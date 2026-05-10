from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pathlib import Path
from pydantic import BaseModel

from app.models.garment import Garment
from app.dependencies import get_db_session
from app.services.qwen_service import recommend_outfits

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


class RecommendationRequest(BaseModel):
    message: str
    garment_ids: list[int]
    user_id: int


class OutfitOption(BaseModel):
    title: str
    description: str
    garment_ids: list[int]


class RecommendationResponse(BaseModel):
    options: list[OutfitOption]


@router.post("/", response_model=RecommendationResponse, status_code=status.HTTP_200_OK)
async def get_recommendations(
    request: RecommendationRequest,
    session: AsyncSession = Depends(get_db_session),
):
    if not request.garment_ids:
        raise HTTPException(status_code=400, detail="Select at least one garment.")
    if len(request.garment_ids) > 10:
        raise HTTPException(status_code=400, detail="Maximum 10 garments allowed.")
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message is required.")

    garments_data = []
    for gid in request.garment_ids:
        garment = await session.get(Garment, gid)
        if not garment or garment.user_id != request.user_id:
            raise HTTPException(status_code=404, detail=f"Garment {gid} not found.")

        image_path = Path(garment.s3_url)
        if not image_path.exists():
            raise HTTPException(status_code=404, detail=f"Image for garment {gid} not found on disk.")

        garments_data.append({
            "garment_id": garment.garment_id,
            "category": garment.category,
            "color": garment.color,
            "style": garment.style,
            "image_path": str(image_path),
        })

    try:
        options = await recommend_outfits(request.message, garments_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation failed: {e}")

    return RecommendationResponse(options=[OutfitOption(**o) for o in options])
