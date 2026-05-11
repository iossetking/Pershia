from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings
from app.core.config import settings

EMBEDDING_DIM = 1024

_embedder = NVIDIAEmbeddings(
    model="nvidia/nv-embedqa-e5-v5",
    api_key=settings.NVIDIA_API_KEY,
)

def _garment_text(metadata: dict) -> str:
    parts = [
        metadata.get("color", ""),
        metadata.get("fabric", ""),
        metadata.get("category", ""),
        metadata.get("style", ""),
        metadata.get("description") or "",
    ]
    return " ".join(p for p in parts if p)

async def embed_garment(metadata: dict) -> list[float]:
    text = _garment_text(metadata)
    results = await _embedder.aembed_documents([text])
    return results[0]

async def embed_query(query: str) -> list[float]:
    return await _embedder.aembed_query(query)
