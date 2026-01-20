from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from api.routes import voice, materials, generation
import os

app = FastAPI(title="AutoShorts Backend", version="0.1.0")

# Setup CORS to allow Frontend to communicate
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if not exists
os.makedirs("uploads/audio", exist_ok=True)
os.makedirs("uploads/video", exist_ok=True)
os.makedirs("uploads/generated", exist_ok=True)

# Mount static files for playback
app.mount("/generated", StaticFiles(directory="uploads/generated"), name="generated")

# Include Routers
app.include_router(voice.router, prefix="/api/voice", tags=["Voice"])
app.include_router(materials.router, prefix="/api/materials", tags=["Materials"])
app.include_router(generation.router, prefix="/api/generate", tags=["Generation"])

@app.get("/")
def read_root():
    return {"status": "ok", "message": "AutoShorts Backend is running"}
