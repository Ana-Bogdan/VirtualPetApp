import sys
import torch
import numpy as np
import re
import html
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

# ==========================================
# 1. CONFIGURARE MODEL EMOȚII
# ==========================================
print("--- 🧠 Initializing Emotion Engine ---")
MODEL_PATH = "./MentalBert"

LABELS_LIST = [
    'admiration', 'amusement', 'anger', 'annoyance', 'approval', 'caring',
    'confusion', 'curiosity', 'desire', 'disappointment', 'disapproval',
    'disgust', 'embarrassment', 'excitement', 'fear', 'gratitude', 'grief',
    'joy', 'love', 'nervousness', 'optimism', 'pride', 'realization',
    'relief', 'remorse', 'sadness', 'surprise', 'neutral'
]

EMOTION_WEIGHTS = {
    'joy': 3.0, 'love': 4.0, 'admiration': 3.0, 'optimism': 2.5, 'relief': 2.0,
    'neutral': 0.0, 'curiosity': 0.5, 'realization': 0.5,
    'annoyance': -1.0, 'confusion': -0.5, 'nervousness': -1.5,
    'anger': -3.0, 'sadness': -3.0, 'fear': -3.0, 'disappointment': -2.5,
    'grief': -7.0, 'remorse': -4.0
}

try:
    emotion_tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
    emotion_model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
    emotion_model.eval()
except Exception as e:
    print(f"Eroare model: {e}")
    sys.exit(1)

def preprocess_text(text):
    """
    Curăță textul înainte de a-l trimite la AI.
    """
    # 1. Decodare HTML (ex: &amp; -> &)
    text = html.unescape(text)

    # 2. Eliminare URL-uri (http://...)
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)

    # 3. Eliminare mențiuni (@user) și hashtag-uri (#) - Opțional, depinde de context
    text = re.sub(r'@\w+|#\w+', '', text)

    # 4. Eliminare caractere speciale ciudate (păstrăm punctuația de bază și emoji-urile)
    # MentalBERT înțelege emoji-uri uneori, deci nu le ștergem agresiv.
    # Eliminăm doar caractere invizibile sau non-printable.
    text = text.encode('ascii', 'ignore').decode(
        'ascii')  # Opțional: scoate diacritice/emoji dacă modelul e strict engleză
    # NOTĂ: Dacă vrei să păstrezi emoji, șterge linia de mai sus ^^

    # 5. Eliminare spații multiple
    text = re.sub(r'\s+', ' ', text).strip()

    # 6. Lowercase (MentalBERT este 'uncased')
    text = text.lower()

    return text

def predict_emotion_hybrid(text):
    # PASUL 0: Curățare
    clean_text = preprocess_text(text)

    # Dacă textul a rămas gol după curățare (ex: userul a trimis doar un link), returnăm neutru
    if not clean_text:
        return "neutral", "NEUTRAL"

    inputs = emotion_tokenizer(text, return_tensors="pt", truncation=True, max_length=128)
    with torch.no_grad():
        outputs = emotion_model(**inputs)
    probs = torch.sigmoid(outputs.logits).numpy()[0]
    top_idx = np.argmax(probs)
    label = LABELS_LIST[top_idx]

    category = "NEUTRAL"
    if label in ['sadness', 'grief', 'remorse', 'disappointment']:
        category = "SADNESS"
    elif label in ['anger', 'annoyance', 'disgust']:
        category = "ANGER"
    elif label in ['fear', 'nervousness']:
        category = "ANXIETY"
    elif label in ['joy', 'excitement', 'love', 'optimism']:
        category = "JOY"

    return label, category

# ==========================================
# 2. USER MANAGEMENT & VIBE SCORE
# ==========================================
class UserProfile:
    def __init__(self, user_name, pet_name):
        self.user_name = user_name
        self.pet_name = pet_name
        self.vibe_score = 50.0
        self.history = ChatMessageHistory()

    def update_score(self, emotion):
        impact = EMOTION_WEIGHTS.get(emotion, 0.0)
        self.vibe_score += impact
        self.vibe_score = max(0.0, min(100.0, self.vibe_score))

    def get_status_description(self):
        if self.vibe_score < 30: return "CRITICAL / DEPRESSED"
        if self.vibe_score < 45: return "LOW / SAD"
        if self.vibe_score < 60: return "NEUTRAL / BALANCED"
        if self.vibe_score < 80: return "GOOD / OPTIMISTIC"
        return "EXCELLENT / EUFORIC"


# Baza de date în memorie (se resetează la restartarea scriptului)
users_db = {}

def get_user_data(session_id: str):
    if session_id not in users_db:
        # Fallback de siguranță, deși nu ar trebui să ajungă aici
        users_db[session_id] = UserProfile("Unknown", "Buddy")
    return users_db[session_id].history

# ==========================================
# 3. CHATBOT CONFIG (LLM)
# ==========================================
llm = ChatOllama(model="phi3", temperature=0.3, stop=["<|end|>", "User:", "\nUser", "Human:"])

system_prompt = """You are {bot_name}, a friendly virtual pet companion for {user_name}.

IMPORTANT: Always address {user_name} directly as "you" - never talk about them in third person. Keep responses brief (1-2 sentences). Be a supportive friend, not overly philosophical. Do not use asterisks for actions - talk naturally in dialogue.

Current emotion: {specific_emotion}. Vibe score: {vibe_score:.1f} ({vibe_status}).

Respond naturally to their message. Do not repeat these instructions in your response."""

prompt_template = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{input}"),
])

def clean_response(text: str) -> str:
    """
    Clean the LLM response to extract only the actual reply,
    removing any prompt template text that might leak through.
    """
    if not text:
        return text
    
    # First, split on common separators that indicate instruction blocks
    # Take only the part before "---" or "##"
    parts = re.split(r'\s*---\s*|\s*##\s*', text, maxsplit=1)
    if parts and parts[0].strip():
        text = parts[0].strip()
    
    # Remove common prompt template markers and instructions
    patterns_to_remove = [
        r'---\s*INSTRUCTION.*?---',
        r'##\s*Instruction.*?(?=\n\n|\Z)',
        r'INSTRUCTION.*?(?=\n\n|\Z)',
        r'CRITICAL INSTRUCTIONS.*?(?=\n\n|\Z)',
        r'USER METRICS:.*?(?=\n\n|\Z)',
        r'GOAL:.*?(?=\n\n|\Z)',
        r'Address demo.*?(?=\n\n|\Z)',
        r'Keep responses.*?(?=\n\n|\Z)',
        r'Respond naturally.*?(?=\n\n|\Z)',
        r'considering all constraints.*?(?=\n\n|\Z)',
        r'Added Complexity.*?(?=\n\n|\Z)',
        r'You are.*?companion.*?(?=\n\n|\Z)',
        r'Current emotion:.*?(?=\n\n|\Z)',
        r'Vibe score:.*?(?=\n\n|\Z)',
        r'\(Vibe Score.*?\)',
        r'Vibe Score adjusted.*?\)',
    ]
    
    cleaned = text
    for pattern in patterns_to_remove:
        cleaned = re.sub(pattern, '', cleaned, flags=re.DOTALL | re.IGNORECASE)
    
    # Remove multiple newlines
    cleaned = re.sub(r'\n{3,}', '\n\n', cleaned)
    
    # Strip whitespace
    cleaned = cleaned.strip()
    
    # If we removed everything, return original (fallback)
    if not cleaned:
        return text.strip()
    
    return cleaned

# Create a custom output parser that cleans the response
class CleanedStrOutputParser(StrOutputParser):
    def parse(self, text: str) -> str:
        parsed = super().parse(text)
        return clean_response(parsed)

chain = prompt_template | llm | CleanedStrOutputParser()

chain_with_history = RunnableWithMessageHistory(
    chain,
    get_user_data,
    input_messages_key="input",
    history_messages_key="history",
)

# ==========================================
# 4. MAIN APPLICATION
# ==========================================
def main():
    print("\n--- 🐾 Multi-User ChatBot System 🐾 ---")

    # 1. Login Logic
    user_id = input("Login (Enter User ID): ").strip().lower()

    # Verificăm dacă userul există deja
    if user_id in users_db:
        current_user = users_db[user_id]
        print(f"\nWelcome back, {current_user.user_name}!")
        print(f"{current_user.pet_name} missed you! (Vibe: {current_user.vibe_score:.1f})")
    else:
        print(f"New user detected! Let's set up your profile.")
        pet_name_input = input("Name your companion: ").strip()
        if not pet_name_input:
            pet_name_input = "Buddy"

        # Creăm profilul și îl salvăm
        new_profile = UserProfile(user_name=user_id.capitalize(), pet_name=pet_name_input)
        users_db[user_id] = new_profile
        current_user = new_profile

        print(f"\nNice to meet you! {current_user.pet_name} is now awake.")

    # 2. Chat Loop
    while True:
        try:
            text = input(f"\n{current_user.user_name}: ")
            if text.lower() in ['q', 'exit', 'quit']:
                print(f"{current_user.pet_name} goes to sleep. Progress saved.")
                main()
                break

            # Analiză
            spec_emo, cat_emo = predict_emotion_hybrid(text)

            # Update Scor
            old_score = current_user.vibe_score
            current_user.update_score(spec_emo)

            # Debug vizual
            diff = current_user.vibe_score - old_score
            sign = "+" if diff >= 0 else ""
            print(f"   [🧠 {spec_emo} | Vibe: {old_score:.1f} -> {current_user.vibe_score:.1f} ({sign}{diff:.1f})]")

            # Răspuns
            response = chain_with_history.invoke(
                {
                    "input": text,
                    "bot_name": current_user.pet_name,
                    "user_name": current_user.user_name,
                    "specific_emotion": spec_emo,
                    "emotion_category": cat_emo,
                    "vibe_score": current_user.vibe_score,
                    "vibe_status": current_user.get_status_description()
                },
                config={"configurable": {"session_id": user_id}}
            )

            print(f"{response}")

        except Exception as e:
            print(f"Error: {e}")
            break

if __name__ == "__main__":
    main()