import os
import uuid
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.image import Image, ImagePublic
from app.dependencies import get_db_session

router = APIRouter(prefix="/upload", tags=["Upload"])

UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/", response_model=ImagePublic)
async def upload_image(
    file: UploadFile = File(...),
    session: AsyncSession = Depends(get_db_session)
):
    try:
        # Generate a unique filename
        file_extension = os.path.splitext(file.filename)[1] if file.filename else ".png"
        file_name = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, file_name)

        # Save the file locally
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        # In a real app, this would be an S3 URL
        # For this prototype, we'll use a local path
        s3_url = f"/uploads/{file_name}"
        s3_key = file_name

        db_image = Image(s3_url=s3_url, s3_key=s3_key)
        session.add(db_image)
        await session.commit()
        await session.refresh(db_image)
        
        return db_image
    except Exception as e:
        await session.rollback()
        raise HTTPException(status_code=500, detail=str(e))
