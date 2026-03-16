from fastapi import FastAPI, UploadFile, File
import uvicorn
import base64
import requests
import os
import json
import re

app = FastAPI()

#API key
NVIDIA_API_KEY = os.environ.get("NVIDIA_API_KEY", "la_llave_maistra")
INVOKE_URL = "https://integrate.api.nvidia.com/v1/chat/completions"

@app.post("/get-metadata/")
async def get_metadata(file: UploadFile = File(...)):
    image_data = await file.read()
    base64_image = base64.b64encode(image_data).decode('utf-8')
    
    #Prompt
    prompt_text = (
        "Analyze the main clothing item in this image. "
        "Do not use <think> tags. Respond ONLY with a valid JSON object. "
        "Format: {\"color\": \"...\", \"fabric\": \"...\", \"category\": \"...\", \"style\": \"...\"}"
    )
    
    headers = {
        "Authorization": f"Bearer {NVIDIA_API_KEY}",
        "Accept": "application/json"
    }
    
    payload = {
        "model": "qwen/qwen3.5-397b-a17b", #NVIDA Qwen
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt_text},
                    {
                        "type": "image_url", 
                        "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}
                    }
                ]
            }
        ],
        "max_tokens": 512,
        "temperature": 0.1 #Intentar con 0.0 si no jala
    }

    try:
        response = requests.post(INVOKE_URL, headers=headers, json=payload)
        response.raise_for_status()
        
        result = response.json()
        raw_output = result["choices"][0]["message"]["content"]
        
        clean_output = re.sub(r'<think>.*?</think>', '', raw_output, flags=re.DOTALL)
        clean_output = clean_output.replace("```json", "").replace("```", "").strip()
        
        return json.loads(clean_output)

    except Exception as e:
        return {
            "error": str(e),
            "raw_model_response": raw_output if 'raw_output' in locals() else None
        }

#Server uvicorn
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)