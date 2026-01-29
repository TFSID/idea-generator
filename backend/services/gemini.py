import os
import json
import google.generativeai as genai
from typing import List, Dict, Any
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=API_KEY)

GENERATION_CONFIG = {
    "research": {
        "prompt": lambda input_text: f"Buatkan 50 list topik penelitian dengan studi yang relevan dengan \"{input_text}\" yang berfokus pada aspek-aspek praktis dan aplikatif dari topik tersebut, serta menyoroti tren terbaru, inovasi, dan studi kasus yang dapat memberikan wawasan mendalam bagi pembaca yang ingin memahami dan menerapkan konsep-konsep ini dalam konteks nyata.\n\ntolong berikan deskripsi detail dari setiap topik yang telah disediakan untuk bahan penelitian lebih lanjut",
        "fields": ["category", "title", "description"]
    },
    "business": {
        "prompt": lambda input_text: f"Buatkan 50 list topik penelitian dengan studi yang relevan dengan \"{input_text}\" yang berfokus pada aspek-aspek praktis dan aplikatif dari topik tersebut, serta menyoroti tren terbaru, inovasi, dan studi kasus yang dapat memberikan wawasan mendalam bagi pembaca yang ingin memahami dan menerapkan konsep-konsep ini dalam konteks nyata.\n\ntolong berikan deskripsi detail dari setiap topik yang telah disediakan untuk bahan penelitian lebih lanjut\n\nberikan juga refined prompt/instruction (text) untuk disesuaikan berdasarkan sesuai kebutuhan proyek dan organisasi agar dapat dimengerti oleh AI Generative Model (seperti Claude, Gemini) dengan framework R.C.T.F.M: Role (Peran) (R), Context (Konteks) (C), Task (Tugas) (T), Format (Format) (F), dan Meta-Cognition (Metakognisi) (M).",
        "fields": ["category", "title", "description", "moneyValue", "effortValue", "monetizationStrategies", "refinedPrompt"]
    },
    "python": {
        "prompt": lambda input_text: f"Buatkan 50 list topik untuk pembuatan python script dengan studi kasus yang relevan dengan \"{input_text}\" yang berfokus pada aspek-aspek praktis dan aplikatif dari topik tersebut, serta menyoroti tren terbaru, inovasi, dan studi kasus yang dapat memberikan wawasan mendalam bagi pembaca yang ingin memahami dan menerapkan konsep-konsep ini dalam konteks nyata.\n\ntolong berikan deskripsi detail dari setiap topik yang telah disediakan untuk bahan penelitian lebih lanjut\n\nberikan juga refined prompt/instruction (text) untuk detail alur pengimplementasinya, fitur yang dapat ditambahkan, dan parameter serta fungsi dengan skalabilitas tinggi yang dapat disesuaikan berdasarkan sesuai kebutuhan proyek dan organisasi agar dapat dimengerti oleh AI Generative Model (seperti Claude, Gemini) untuk membuat kode programnya dengan framework R.C.T.F.M: Role (Peran) (R), Context (Konteks) (C), Task (Tugas) (T), Format (Format) (F), dan Meta-Cognition (Metakognisi) (M).",
        "fields": ["category", "title", "description", "refinedPrompt"]
    }
}

async def generate_ideas_ai(input_text: str, mode: str) -> List[Dict[str, Any]]:
    if mode not in GENERATION_CONFIG:
        raise ValueError(f"Invalid mode: {mode}")

    config = GENERATION_CONFIG[mode]
    prompt = config["prompt"](input_text)

    # Define the schema for structured output
    schema = {
        "type": "object",
        "properties": {
            "ideas": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "category": {"type": "string"},
                        "title": {"type": "string"},
                        "description": {"type": "string"},
                        "refinedPrompt": {"type": "string"},
                        "moneyValue": {"type": "string"},
                        "effortValue": {"type": "string"},
                        "monetizationStrategies": {"type": "string"},
                    },
                    "required": ["category", "title", "description"]
                }
            }
        },
        "required": ["ideas"]
    }

    model = genai.GenerativeModel("gemini-1.5-flash")

    response = model.generate_content(
        prompt,
        generation_config={
            "response_mime_type": "application/json",
            "response_schema": schema
        }
    )

    try:
        data = json.loads(response.text)
        return data.get("ideas", [])
    except Exception as e:
        print(f"Error parsing Gemini response: {e}")
        return []
