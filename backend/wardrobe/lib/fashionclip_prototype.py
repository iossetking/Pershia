from contextlib import asynccontextmanager
from fastapi import FastAPI, UploadFile, File, HTTPException
from PIL import Image
from transformers import CLIPModel, CLIPProcessor
import torch
import io
import uvicorn

# Holds the model and processor after startup
state = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Loads the FashionCLIP model once when the server starts.

    Args:
        app: The FastAPI application instance.

    Yields:
        None
    """
    model = CLIPModel.from_pretrained("patrickjohncyh/fashion-clip")
    processor = CLIPProcessor.from_pretrained("patrickjohncyh/fashion-clip")
    model.eval()
    state["model"] = model
    state["processor"] = processor
    yield
    state.clear()


app = FastAPI(lifespan=lifespan)


@app.post("/embed")
async def embed_image(file: UploadFile = File(...)):
    """Receives an image and returns its FashionCLIP embedding.

    Args:
        file: The uploaded image file.

    Returns:
        A dict with the full embedding vector, its dimension count,
        the first 5 values as a sample, and the vector norm.
    """
    raw = await file.read()
    try:
        image = Image.open(io.BytesIO(raw)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file.")

    # processor converts the PIL image into the tensor format the model expects
    inputs = state["processor"](images=image, return_tensors="pt")

    with torch.no_grad():
        outputs = state["model"].vision_model(**inputs)
        # pooler_output is 768-dim, project to 512-dim CLIP space
        embedding = state["model"].visual_projection(outputs.pooler_output)
        # Normalize so the vector length (norm) equals 1
        embedding = embedding / embedding.norm(dim=-1, keepdim=True)

    vector = embedding[0].tolist()

    return {
        "dimensions": len(vector),
        "norm": round(float(embedding.norm().item()), 6),
        "sample": [round(v, 6) for v in vector[:5]],
        "embedding": vector,
    }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
