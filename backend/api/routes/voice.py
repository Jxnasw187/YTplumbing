from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from api.services.tts_engine import tts_engine
import shutil
import uuid
import os

router = APIRouter()

UPLOAD_DIR = "uploads/audio"
GENERATED_DIR = "uploads/generated"

@router.post("/upload")
async def upload_voice(file: UploadFile = File(...)):
    """
    Upload reference audio for voice cloning.
    """
    file_id = str(uuid.uuid4())
    # Ensure extension is preserved (wav/mp3)
    ext = file.filename.split(".")[-1]
    filename = f"{file_id}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {
        "status": "success", 
        "voice_id": file_id,
        "filename": filename,
        "message": "Reference audio uploaded."
    }

@router.post("/train")
async def train_voice(voice_id: str = Form(...)):
    """
    For Local TTS (XTTS), training is instant/zero-shot. 
    We just verify the file exists.
    """
    return {
        "status": "ready",
        "model_id": voice_id, # In XTTS, the voice_id IS the reference audio
        "type": "local_xtts"
    }

@router.post("/preview")
def preview_voice(voice_id: str = Form(...), text: str = Form(...)):
    """
    Generate a preview audio file using the local TTS engine (Coqui).
    """
    print(f"--- [BACKEND] Received Preview Request for {voice_id} ---")
    
    # 1. Find reference audio
    # Try wav then mp3 (simple lookup)
    ref_path = None
    for ext in ["wav", "mp3", "m4a"]:
        p = os.path.join(UPLOAD_DIR, f"{voice_id}.{ext}")
        if os.path.exists(p):
            ref_path = p
            print(f"--- [BACKEND] Found Reference Audio: {p} ---")
            break
            
    if not ref_path:
        # Fallback search if voice_id contains the filename already or different pattern
        # This handles re-uploads or different id references
        potential_path = os.path.join(UPLOAD_DIR, voice_id)
        if os.path.exists(potential_path):
            ref_path = potential_path
            print(f"--- [BACKEND] Found Reference Audio (Fallback): {potential_path} ---")
        else:
            print(f"--- [BACKEND] Reference Audio NOT FOUND for ID: {voice_id} ---")
            raise HTTPException(status_code=404, detail=f"Reference audio not found for ID: {voice_id}")

    # 2. Generate Output Filename
    output_filename = f"preview_{voice_id}_{uuid.uuid4().hex[:6]}.wav"
    output_path = os.path.join(GENERATED_DIR, output_filename)

    # 3. Call TTS Engine
    try:
        print("--- [BACKEND] Calling TTS Engine (Model Load + Inference)... ---")
        # Note: clone_voice synchronous in this version of service, wrapped in async def is fine or offload to thread
        # For simplicity in MVP we run it direct. It might block event loop briefly.
        tts_engine.clone_voice(text, ref_path, output_path)
        print("--- [BACKEND] TTS Generation Complete ---")
    except Exception as e:
        print(f"--- [BACKEND] TTS Error: {e} ---")
        raise HTTPException(status_code=500, detail=str(e))

    # 4. Return URL (served via static mount in main.py)
    return {
        "audio_url": f"http://localhost:8000/generated/{output_filename}"
    }
