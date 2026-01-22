import os
import torch

# AGREE TO COQUI LICENSE AUTOMATICALLY
os.environ["COQUI_TOS_AGREED"] = "1"

from TTS.api import TTS
from pydub import AudioSegment
from pydub.effects import normalize, compress_dynamic_range

# Define output directory
OUTPUT_DIR = "uploads/generated"
os.makedirs(OUTPUT_DIR, exist_ok=True)

class TTSEngine:
    def __init__(self):
        self.tts = None
        self.model_name = "tts_models/multilingual/multi-dataset/xtts_v2"
        # We delay loading to startup or first request to avoid blocking import
        self.device = "cuda" if torch.cuda.is_available() else "cpu"

    def load_model(self):
        if not self.tts:
            print(f"Loading TTS Model ({self.model_name}) on {self.device}...")
            # Init TTS with the target model
            self.tts = TTS(self.model_name).gpu(True) if torch.cuda.is_available() else TTS(self.model_name)
            print("TTS Model Loaded successfully.")

    def clone_voice(
        self, 
        text: str, 
        ref_audio_path: str, 
        output_path: str, 
        language: str = "en",
        temperature: float = 0.4,
        length_penalty: float = 1.8,
        repetition_penalty: float = 3.0,
        top_k: int = 50,
        top_p: float = 0.85,
        sentence_split: bool = True
    ):
        """
        Clones voice from ref_audio_path and generates speech for the given text.
        Optimized for ASMR-style soft, calm delivery.
        """
        self.load_model()
        
        print(f"Generating audio for: '{text}' using {ref_audio_path}")
        
        # XTTS generation with user-controlled parameters
        # Note: length_penalty doesn't work well with XTTS, so we map it to speed instead
        # Higher length_penalty (1.8-2.0) = slower speed (0.5-0.7)
        # Lower length_penalty (0.5-1.0) = faster speed (1.0-1.5)
        speed_value = 2.5 - length_penalty  # Inverse mapping: 1.8 -> 0.7, 0.5 -> 2.0
        
        self.tts.tts_to_file(
            text=text,
            speaker_wav=ref_audio_path,
            language=language,
            file_path=output_path,
            temperature=temperature,
            repetition_penalty=repetition_penalty,
            top_k=top_k,
            top_p=top_p,
            speed=speed_value,  # Controls speaking pace (0.5=slow, 1.0=normal, 2.0=fast)
            split_sentences=sentence_split  # Enable/disable sentence splitting for natural pauses
        )
        
        return output_path

# Singleton instance
tts_engine = TTSEngine()
