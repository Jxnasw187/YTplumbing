from fastapi import APIRouter, UploadFile, File
import shutil
import uuid
import os

router = APIRouter()

UPLOAD_DIR = "uploads/video"

@router.post("/upload")
async def upload_material(file: UploadFile = File(...)):
    """
    Upload source video material.
    """
    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}_{file.filename}")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {
        "status": "analyzed", 
        "material_id": file_id, 
        "filename": file.filename,
        "metadata": {
            "duration": "mock_60_min",
            "scenes_detected": 42
        }
    }
