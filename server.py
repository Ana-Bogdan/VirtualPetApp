import uvicorn
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from virtual_pet import (
    chain_with_history,  # Lanțul LangChain care vorbește
    predict_emotion_hybrid,  # Funcția care detectează emoția + categoria
    users_db,  # Baza de date cu useri (din memorie) - kept for backward compatibility
    UserProfile  # Clasa pentru a crea useri noi
)
from database import (
    init_db,
    get_db,
    DatabaseManager
)

app = FastAPI()

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()

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

class MessageHistory(BaseModel):
    id: int
    sender: str
    text: str
    emotionalState: str = None
    timestamp: str = None

class ConversationHistoryResponse(BaseModel):
    messages: list[MessageHistory]
    user_profile: dict = None


# --- RUTA PRINCIPALĂ ---
@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest, db: Session = Depends(get_db)):
    user_id = request.user_id

    # 1. Gestionare User (Folosim users_db importat din virtual_pet pentru compatibilitate)
    if user_id not in users_db:
        # Creăm userul folosind clasa importată
        users_db[user_id] = UserProfile(request.user_name, request.pet_name)

    current_user = users_db[user_id]

    # 1b. Sync with database - get or create user in DB
    db_user = DatabaseManager.get_or_create_user(
        db, 
        user_id=user_id,
        user_name=request.user_name,
        pet_name=request.pet_name
    )
    
    # Get or create conversation
    conversation = DatabaseManager.get_or_create_conversation(db, user_id, user_id)

    # 2. Analiză Emoțională (Funcția importată)
    # Aceasta folosește deja MentalBERT-ul încărcat în virtual_pet.py
    spec_emo, cat_emo = predict_emotion_hybrid(request.message)

    # 3. Actualizare Scor (Metoda clasei importate)
    current_user.update_score(spec_emo)
    
    # 3b. Update vibe score in database
    DatabaseManager.update_user_vibe_score(db, user_id, current_user.vibe_score)

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

    # 5. Save messages to database
    DatabaseManager.save_message(
        db,
        conversation_id=conversation.id,
        sender="user",
        content=request.message,
        detected_emotion=spec_emo,
        vibe_score=current_user.vibe_score
    )
    
    DatabaseManager.save_message(
        db,
        conversation_id=conversation.id,
        sender="pet",
        content=response_text,
        detected_emotion=spec_emo,
        vibe_score=current_user.vibe_score
    )

    # 6. Returnăm totul la Frontend
    return ChatResponse(
        reply=response_text,
        vibe_score=current_user.vibe_score,
        detected_emotion=spec_emo,
        vibe_status=current_user.get_status_description()
    )


# --- RUTA PENTRU ISTORICUL CONVERSATIILOR ---
@app.get("/conversation/{user_id}", response_model=ConversationHistoryResponse)
async def get_conversation_history(user_id: str, db: Session = Depends(get_db)):
    """Get conversation history for a user"""
    try:
        messages = DatabaseManager.get_conversation_history(db, user_id)
        user_profile = DatabaseManager.get_user_profile(db, user_id)
        
        return ConversationHistoryResponse(
            messages=messages,
            user_profile=user_profile
        )
    except Exception as e:
        print(f"Error fetching conversation history: {e}")
        raise HTTPException(status_code=500, detail="Error fetching conversation history")


@app.get("/")
def health_check():
    return {"status": "Virtual Pet API is Online 🟢"}


if __name__ == "__main__":
    # Pornim serverul pe portul 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)