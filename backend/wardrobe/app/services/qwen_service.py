import base64
import json
import re
from pathlib import Path

from langchain_nvidia_ai_endpoints import ChatNVIDIA
from langchain_core.messages import SystemMessage, HumanMessage

from app.core.config import settings

_llm = ChatNVIDIA(
    model="qwen/qwen3.5-397b-a17b",
    model_type="nv-vlm",
    api_key=settings.NVIDIA_API_KEY,
    temperature=0.6,
    top_p=0.95,
    max_completion_tokens=1024,
)

_recommend_llm = ChatNVIDIA(
    model="qwen/qwen3.5-397b-a17b",
    model_type="nv-vlm",
    api_key=settings.NVIDIA_API_KEY,
    temperature=0.7,
    top_p=0.95,
    max_completion_tokens=2048,
)

_CATEGORIES = (
    "T-shirt, Shirt, Blouse, Sweater, Hoodie, Tank top, Jacket, Coat, Cardigan, Vest, "
    "Pants, Jeans, Shorts, Skirt, Leggings, Dress, Jumpsuit, Suit, Swimwear, "
    "Shoes, Boots, Sneakers, Sandals, Hat, Scarf, Bag, Belt, Gloves, Socks"
)

_SYSTEM_PROMPT = (
    "Analyze the main clothing item in this image. "
    "Do not use <think> tags. Respond ONLY with a valid JSON object. "
    f"For 'category', you MUST pick exactly one from this list: {_CATEGORIES}. "
    "Choose the most general match — never invent a category outside this list. "
    'Format: {"color": "...", "fabric": "...", "category": "...", "style": "...", "description": "..."}'
)

_RECOMMEND_SYSTEM_PROMPT = (
    "You are a professional fashion stylist. "
    "Analyze the provided garments and create outfit recommendations based on the user's request. "
    "Do not use <think> tags. Respond ONLY with a valid JSON object, no markdown, no extra text."
)


async def analyze_garment(image_path: Path) -> dict:
    b64 = base64.b64encode(image_path.read_bytes()).decode()
    suffix = image_path.suffix.lstrip(".") or "png"

    messages = [
        SystemMessage(content=_SYSTEM_PROMPT),
        HumanMessage(content=[{
            "type": "image_url",
            "image_url": {"url": f"data:image/{suffix};base64,{b64}"}
        }])
    ]

    result = await _llm.ainvoke(messages)
    print(f"\n--- Qwen response ---\n{result.content}\n---------------------\n")

    match = re.search(r'\{.*\}', result.content, re.DOTALL)
    if not match:
        raise ValueError(f"No JSON in Qwen response: {result.content}")

    return json.loads(match.group())


async def recommend_outfits(message: str, garments_data: list[dict]) -> list[dict]:
    """
    garments_data: list of {garment_id, category, color, style, image_path}
    Returns: list of {title, description, garment_ids}
    """
    content: list[dict] = []

    for i, g in enumerate(garments_data):
        path = Path(g["image_path"])
        b64 = base64.b64encode(path.read_bytes()).decode()
        suffix = path.suffix.lstrip(".") or "png"
        content.append({
            "type": "text",
            "text": f"[Garment {i + 1}: {g['color']} {g['style']} {g['category']}]",
        })
        content.append({
            "type": "image_url",
            "image_url": {"url": f"data:image/{suffix};base64,{b64}"},
        })

    n = len(garments_data)
    content.append({
        "type": "text",
        "text": (
            f"User request: {message}\n\n"
            f"Above are {n} garments (labeled Garment 1 through Garment {n}). "
            "Create exactly 3 outfit combinations using subsets of these garments. "
            "Each combination should feel distinctly different in style or occasion. "
            "Respond ONLY with this JSON structure:\n"
            '{"options": ['
            '{"title": "Short name", "description": "2-3 sentences about the look and when to wear it.", '
            '"garment_indices": [0, 2]}'
            ", ...]}\n"
            "garment_indices are 0-based (Garment 1 = index 0). "
            "Each option must include at least 1 garment. No extra text outside the JSON."
        ),
    })

    messages = [
        SystemMessage(content=_RECOMMEND_SYSTEM_PROMPT),
        HumanMessage(content=content),
    ]

    result = await _recommend_llm.ainvoke(messages)
    print(f"\n--- Qwen recommendation ---\n{result.content}\n--------------------------\n")

    match = re.search(r'\{.*\}', result.content, re.DOTALL)
    if not match:
        raise ValueError(f"No JSON in recommendation response: {result.content}")

    parsed = json.loads(match.group())
    options = parsed.get("options", [])

    out = []
    for opt in options:
        indices = [i for i in opt.get("garment_indices", []) if 0 <= i < n]
        if not indices:
            continue
        out.append({
            "title": opt.get("title", "Outfit"),
            "description": opt.get("description", ""),
            "garment_ids": [garments_data[i]["garment_id"] for i in indices],
        })

    return out
