from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY_CHAT = os.getenv("GROQ_API_KEY_CHAT")
API_KEY_TRANSLATE = os.getenv("GROQ_API_KEY_TRANSLATE")

API_URL = "https://api.groq.com/openai/v1/chat/completions"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------ CHATBOT ------------------
SYSTEM_PROMPT = """
You are an AI travel buddy specializing in budget weekend trips 
for college students from Delhi.
ONLY answer travel-related questions.
"""

@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    msg = data.get("message")

    payload = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": msg}
        ]
    }

    headers = {
        "Authorization": f"Bearer {API_KEY_CHAT}",
        "Content-Type": "application/json"
    }

    try:
        res = requests.post(API_URL, json=payload, headers=headers).json()
        reply = res["choices"][0]["message"]["content"]
        return {"reply": reply}
    except Exception as e:
        print("CHAT ERROR:", e)
        return {"reply": "Chatbot error."}


# ------------------ TRANSLATION ------------------

LANG_MAP = {
    "hi": "Hindi",
    "ta": "Tamil",
    "bn": "Bengali",
    "te": "Telugu",
    "mr": "Marathi",
    "gu": "Gujarati"
}

@app.post("/api/translate")
async def translate(request: Request):
    data = await request.json()
    text = data.get("text")
    target_code = data.get("target")

    target_lang = LANG_MAP.get(target_code, "Hindi")

    # STRICT JSON response prompt
    system_prompt = (
        f"You are a translation engine. Translate the user's sentence into {target_lang}. "
        f"ALWAYS respond in valid JSON ONLY in this format:\n"
        f'{{"translated": "TRANSLATED_TEXT"}}\n'
        f"No explanations. No extra text. No commentary."
    )

    payload = {
        "model": "llama-3.1-8b-instant",
        "temperature": 0,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": text}
        ]
    }

    headers = {
        "Authorization": f"Bearer {API_KEY_TRANSLATE}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(API_URL, json=payload, headers=headers).json()

        raw = response["choices"][0]["message"]["content"]

        # LLaMA returns JSON NOW, so we parse it safely
        import json
        translated = json.loads(raw)["translated"]

        return {"translated": translated}

    except Exception as e:
        print("TRANS ERROR:", e)
        print("RAW:", response)
        return {"translated": "Translation error."}
