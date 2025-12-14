# 🐾 VirtualPet AI Backend

Acesta este backend-ul pentru aplicația Virtual Pet. Este un server API scris în Python care gestionează:

* Chatbot-ul Empatic: Folosește un LLM local (Phi-3) prin Ollama.

* Analiza Emoțiilor: Folosește un model MentalBERT antrenat custom pentru a detecta 28 de emoții fine și a calcula un "Vibe Score" al utilizatorului.

* Memoria: Ține minte conversația și starea emoțională a utilizatorului.

## 📋 Cerințe de Sistem

Python 3.10+ instalat.

Ollama instalat și rulând în fundal.

RAM: Minim 8GB (recomandat 16GB pentru a rula ambele modele simultan).

## 🚀 Instalare și Rulare (Pas cu Pas)

### **Pasul 1: Clonarea proiectului**

Descarcă acest repository și deschide folderul în terminal (sau VS Code / PyCharm).

### **Pasul 2: Configurarea Modelului MentalBERT**

⚠️ Important: Deoarece modelul de detecție a emoțiilor este mare, asigurați-vă că folderul MentalBert din rădăcina proiectului conține fișierul model.safetensors.

Dacă lipsește, descărcă-l de aici: https://drive.google.com/file/d/172K6ha3m0keAS3pKsKqiauw6a7e5ddiH/view?usp=drive_link

### **Pasul 3: Instalarea Dependențelor**

# Windows
`python -m venv venv
.\venv\Scripts\activate`

# Mac/Linux
`python3 -m venv venv
source venv/bin/activate`

Instalați librăriile necesare:

`pip install -r requirements.txt`

### **Pasul 4: Configurarea Ollama (LLM-ul de Chat)**

Asigurați-vă că aveți Ollama instalat.

Deschideți un terminal separat și descărcați modelul phi3:

`ollama pull phi3`

Lăsați aplicația Ollama pornită în fundal.

### **Pasul 5: Pornirea Serverului**

În terminalul proiectului, rulați:

`python server.py`

Dacă totul este OK, veți vedea mesajul:

`INFO: Uvicorn running on http://0.0.0.0:8000`

## 🔌 API Endpoints

Serverul rulează local la adresa http://127.0.0.1:8000.

Exemplu de apel:

POST http://127.0.0.1:8000/chat

Body:
`{
  "user_id": "test_user",
  "user_name": "Andrei",
  "pet_name": "Buddy",
  "message": "Ma simt foarte obosit si trist azi."
}`