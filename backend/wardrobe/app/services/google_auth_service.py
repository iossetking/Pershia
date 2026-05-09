import httpx
from app.core.config import settings


async def verify_google_token(token: str) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://oauth2.googleapis.com/tokeninfo",
            params={"id_token": token}
        )

    if response.status_code != 200:
        raise ValueError("Invalid Google token")

    data = response.json()

    if "error" in data:
        raise ValueError(f"Google token error: {data['error']}")

    if settings.GOOGLE_CLIENT_ID and data.get("aud") != settings.GOOGLE_CLIENT_ID:
        raise ValueError("Token audience mismatch")

    return {
        "google_id": data["sub"],
        "email": data["email"],
        "name": data.get("name", ""),
        "picture": data.get("picture", ""),
    }
