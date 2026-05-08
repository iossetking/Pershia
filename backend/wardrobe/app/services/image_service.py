import uuid
from pathlib import Path

from fastapi import UploadFile

ITEMS_DIR = Path("items")
ITEMS_DIR.mkdir(exist_ok=True)


async def save_image(file: UploadFile) -> tuple[Path, str]:
    ext = Path(file.filename).suffix if file.filename else ".png"
    filename = f"{uuid.uuid4().hex}{ext}"
    dest = ITEMS_DIR / filename
    dest.write_bytes(await file.read())
    return dest, f"items/{filename}"
