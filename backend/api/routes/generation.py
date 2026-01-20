from fastapi import APIRouter, Body
from pydantic import BaseModel
from typing import List

router = APIRouter()

class GenerateRequest(BaseModel):
    voice_model_id: str
    material_id: str
    music_id: str = None

@router.post("/")
async def generate_shorts(request: GenerateRequest):
    """
    Trigger the complete generation pipeline.
    1. Cut video based on analysis (Material ID)
    2. Generate TTS using Voice Model (Voice ID)
    3. Overlay Music (Music ID)
    
    Returns a list of generated 'clips'.
    """
    # Mocking the output for 6 clips
    mock_clips = []
    for i in range(1, 7):
        mock_clips.append({
            "id": f"clip_{i}_{request.material_id[:5]}",
            "title": f"Auto-Generated Short #{i}",
            "duration": "0:58",
            "thumbnail": f"https://picsum.photos/seed/{request.material_id}{i}/300/500",
            "video_url": "#" # In real app, this is a path to static file
        })
        
    return {
        "status": "completed",
        "clips": mock_clips
    }
