import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from virtual_pet import (
    chain_with_history,  # Lanțul LangChain care vorbește
    predict_emotion_hybrid,  # Funcția care detectează emoția + categoria
    users_db,  # Baza de date cu useri (din memorie)
    UserProfile  # Clasa pentru a crea useri noi
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    user_id: str
    message: str
    user_name: str = "User"
    pet_name: str = "Nori"

class ChatResponse(BaseModel):
    reply: str
    vibe_score: float
    detected_emotion: str
    vibe_status: str


# --- RUTA PRINCIPALĂ ---
@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    user_id = request.user_id

    # 1. Gestionare User (Folosim users_db importat din virtual_pet)
    if user_id not in users_db:
        # Creăm userul folosind clasa importată
        users_db[user_id] = UserProfile(request.user_name, request.pet_name)

    current_user = users_db[user_id]

    # 2. Analiză Emoțională (Funcția importată)
    # Aceasta folosește deja MentalBERT-ul încărcat în virtual_pet.py
    spec_emo, cat_emo = predict_emotion_hybrid(request.message)

    # 3. Actualizare Scor (Metoda clasei importate)
    current_user.update_score(spec_emo)

    # 4. Generare Răspuns (Chain-ul importat)
    try:
        response_text = chain_with_history.invoke(
            {
                "input": request.message,
                "bot_name": current_user.pet_name,
                "user_name": current_user.user_name,
                "specific_emotion": spec_emo,
                "emotion_category": cat_emo,
                "vibe_score": current_user.vibe_score,
                "vibe_status": current_user.get_status_description()
            },
            config={"configurable": {"session_id": user_id}}
        )
    except Exception as e:
        print(f"Eroare la generare: {e}")
        raise HTTPException(status_code=500, detail="Eroare internă la generarea răspunsului.")

    # 5. Returnăm totul la Frontend
    return ChatResponse(
        reply=response_text,
        vibe_score=current_user.vibe_score,
        detected_emotion=spec_emo,
        vibe_status=current_user.get_status_description()
    )


@app.get("/")
def health_check():
    return {"status": "Virtual Pet API is Online 🟢"}


if __name__ == "__main__":
    # Pornim serverul pe portul 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)