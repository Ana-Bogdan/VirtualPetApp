import matplotlib.pyplot as plt

# --- 1. DEFINIREA PONDERILOR (Weights) ---
EMOTION_WEIGHTS = {
    # Pozitive
    'joy': 3.0, 'love': 3.5, 'admiration': 3.0, 'gratitude': 2.5,
    'optimism': 2.0, 'relief': 2.0, 'excitement': 2.5, 'pride': 2.0,
    'amusement': 1.5, 'approval': 1.0, 'caring': 2.0, 'desire': 1.0,

    # Neutre / Mixte
    'neutral': 0.0, 'curiosity': 0.5, 'realization': 0.5,
    'surprise': 0.0, 'confusion': -0.5,

    # Negative Ușoare
    'annoyance': -1.5, 'disapproval': -1.5, 'boredom': -1.0,
    'embarrassment': -1.0, 'nervousness': -1.5,

    # Negative Puternice
    'anger': -3.0, 'sadness': -3.5, 'fear': -3.0,
    'disappointment': -2.5, 'disgust': -3.0,

    # Critice
    'grief': -6.0, 'remorse': -4.0
}


# --- 2. FORMULA DE ACTUALIZARE ---
def update_vibe(current_score, detected_emotion):
    impact = EMOTION_WEIGHTS.get(detected_emotion, 0)

    # Formula: Scorul nou este scorul vechi + impactul
    # Adăugăm o "inerție" - scorul nu se schimbă brusc, ci treptat
    new_score = current_score + impact

    # Clamp (Limităm între 0 și 100)
    new_score = max(0.0, min(100.0, new_score))

    return new_score


# --- 3. SIMULARE SCENARIU ---
# Scenariu: Utilizatorul începe neutru, are o criză (grief), apoi își revine
conversation_flow = [
    "neutral", "joy", "neutral",  # Zile normale (Scor ~53)
    "sadness", "sadness", "grief",  # Veste proastă (Scădere bruscă)
    "grief", "anger", "sadness",  # Perioada grea (Scor minim)
    "neutral", "relief", "optimism",  # Început de recuperare
    "joy", "gratitude", "love"  # Revenire
]

scores = [50.0]  # Start
for emotion in conversation_flow:
    new_val = update_vibe(scores[-1], emotion)
    scores.append(new_val)

# --- 4. AFIȘARE REZULTATE ---
print("Evoluția VibeScore:")
for i, (emo, score) in enumerate(zip(["START"] + conversation_flow, scores)):
    status = ""
    if score < 30:
        status = "🔴 (Low/Depressed)"
    elif score < 70:
        status = "🟡 (Neutral/Ok)"
    else:
        status = "🟢 (High/Happy)"
    print(f"Pas {i:02d} | Emoție: {emo:12} | Score: {score:.1f} {status}")

# (Opțional) Plot simplu
plt.plot(scores, marker='o')
plt.title("Simulare VibeScore")
plt.ylabel("Stare de Spirit (0-100)")
plt.axhline(y=30, color='r', linestyle='--', label='Alert Zone')
plt.axhline(y=70, color='g', linestyle='--', label='Thriving Zone')
plt.legend()
plt.grid(True)
plt.show()