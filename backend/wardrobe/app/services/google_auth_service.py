import httpx
from app.core.config import settings


async def verify_google_token(token: str) -> dict:
    async with httpx.AsyncClient() as client:
        # Try as access_token first (returned by useGoogleLogin hook)
        userinfo_resp = await client.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {token}"},
        )
        if userinfo_resp.status_code == 200:
            data = userinfo_resp.json()
            return {
                "google_id": data["sub"],
                "email": data["email"],
                "name": data.get("name", ""),
                "picture": data.get("picture", ""),
            }

        # Fall back to id_token (returned by GoogleLogin component)
        id_resp = await client.get(
            "https://oauth2.googleapis.com/tokeninfo",
            params={"id_token": token},
        )

    if id_resp.status_code != 200:
        raise ValueError("Invalid Google token")

    data = id_resp.json()

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
