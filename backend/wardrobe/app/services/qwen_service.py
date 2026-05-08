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

_SYSTEM_PROMPT = (
    "Analyze the main clothing item in this image. "
    "Do not use <think> tags. Respond ONLY with a valid JSON object. "
    'Format: {"color": "...", "fabric": "...", "category": "...", "style": "..."}'
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

    # Qwen sometimes wraps the JSON in ```json ... ```
    match = re.search(r'\{.*\}', result.content, re.DOTALL)
    if not match:
        raise ValueError(f"No JSON in Qwen response: {result.content}")

    return json.loads(match.group())
