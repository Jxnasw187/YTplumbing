import os
import torch

# AGREE TO COQUI LICENSE AUTOMATICALLY
os.environ["COQUI_TOS_AGREED"] = "1"

from TTS.api import TTS

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

    def clone_voice(self, text: str, ref_audio_path: str, output_path: str, language: str = "en"):
        """
        Clones voice from ref_audio_path and generates speech for the given text.
        """
        self.load_model()
        
        print(f"Generating audio for: '{text}' using {ref_audio_path}")
        
        # XTTS generation
        self.tts.tts_to_file(
            text=text,
            speaker_wav=ref_audio_path,
            language=language,
            file_path=output_path
        )
        
        return output_path

# Singleton instance
tts_engine = TTSEngine()
