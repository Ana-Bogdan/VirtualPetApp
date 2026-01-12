# 🐾 AI Pet Companion App

This is a full-stack application for emotional well-being through an interactive virtual pet companion. The app provides a safe space for users to express their feelings, receive empathetic responses, and track their emotional progress over time. The virtual pet reacts to your emotional state and provides support through conversations, mini-games, and care activities.

---

## ✨ Features

- 🔐 **User Authentication** - Secure login and registration system with demo credentials.

- 💬 **Emotional AI Chat** - Interactive chat interface where the pet responds empathetically to your feelings:

  - Detects emotional states (happy, sad, anxious, tired)
  - Provides supportive and understanding responses
  - Real-time mood-based reactions

- 🐾 **Virtual Pet Companion** - Animated pet that reflects your emotional state:

  - Three moods: Happy, Neutral, Sad
  - Visual expressions change based on your well-being
  - Cute animations and personality

- 🏠 **Home Screen** - Main interaction hub:

  - Daily check-in with streak tracking
  - Chat with your pet companion
  - Mini-games for stress relief
  - Streak counter with fire emoji

- 💝 **Pet Care Screen** - Nurture your virtual pet:

  - Feed your pet (Berry, Cookie, Energy Drink)
  - Apply accessories (Bow, Crown, Star)
  - Track pet stats (Happiness, Fullness, Energy)
  - Real-time stat updates

- 📊 **Progress Tracking**:
  - Visual charts showing emotional trends
  - Daily check-in history
  - Message count and interaction statistics
  - Weekly and monthly progress views

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts for progress visualization
- **State Management**: React Hooks (useState, useEffect)

### Backend

- **Framework**: FastAPI (Python)
- **LLM**: Phi-3 via Ollama for empathetic chatbot responses
- **Emotion Detection**: Custom-trained MentalBERT model for fine-grained emotion detection (28 emotions)
- **Database**: SQLite with SQLAlchemy for persistent conversation storage
- **Memory**: Conversation and emotional state tracking with persistent history

---

## 🚀 Getting Started

### Prerequisites

- **Frontend**: Node.js (v18 or higher), npm or yarn
- **Backend**: Python 3.10+, Ollama installed and running

### Frontend Installation

1. Clone the repository:

```bash
git clone https://github.com/Ana-Bogdan/VirtualPetApp.git
cd VirtualPetApp
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Backend Installation

1. **Configure MentalBERT Model**:

   - Ensure the `MentalBert` folder contains `model.safetensors`
   - If missing, download from: https://drive.google.com/file/d/172K6ha3m0keAS3pKsKqiauw6a7e5ddiH/view?usp=drive_link

2. **Create Virtual Environment**:

   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # Mac/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install Dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

   This will install all required packages including database dependencies (SQLAlchemy, aiosqlite).

4. **Setup Ollama**:

   - Install Ollama if not already installed
   - In a separate terminal, pull the phi3 model:
     ```bash
     ollama pull phi3
     ```
   - Keep Ollama running in the background

5. **Start the Backend Server**:

   ```bash
   python server.py
   ```

   You should see: `INFO: Uvicorn running on http://0.0.0.0:8000`

### Demo Credentials

- **Username**: `demo`
- **Password**: `demo123`

---

## 🔌 API Endpoints

The backend server runs locally at `http://127.0.0.1:8000`.

### Chat Endpoint

**POST** `/chat`

Request body:

```json
{
  "user_id": "test_user",
  "user_name": "Andrei",
  "pet_name": "Buddy",
  "message": "Ma simt foarte obosit si trist azi."
}
```

### Conversation History Endpoint

**GET** `/conversation/{user_id}`

Returns conversation history for a specific user, including all past messages and user profile information.

---

## 💾 Database

The app uses SQLite to persist all conversations and user data. The database file (`virtual_pet.db`) is automatically created when you first run the backend server.

### Accessing the Database

**Option 1: Using the View Script (Recommended)**

```bash
# View all database contents
python view_db.py

# View a specific user's conversation
python view_db.py demo
```

**Option 2: Using SQLite Command Line**

```bash
sqlite3 virtual_pet.db
.tables                    # List all tables
SELECT * FROM users;      # View all users
SELECT * FROM messages;     # View all messages
.quit                      # Exit
```

**Option 3: Using GUI Tools**

- **DB Browser for SQLite** (Free): https://sqlitebrowser.org/
- **TablePlus** (Mac/Windows): https://tableplus.com/
- **DBeaver** (Free, cross-platform): https://dbeaver.io/

### Database Structure

- **users** - User profiles (user_id, user_name, pet_name, vibe_score)
- **conversations** - Chat sessions linked to users
- **messages** - Individual messages with timestamps and detected emotions

### Data Persistence

- ✅ All conversations are automatically saved to the database
- ✅ Data persists after closing the app
- ✅ Previous conversations load automatically when you log in
- ✅ Each user has their own conversation history
- ✅ Database file is in `.gitignore` (not committed to git)

### Security Notes

**Current Setup (Local Development):**
- Each user has their own local database file
- Data is private to each user
- No shared data between users
- Perfect for development and personal use

**For Production Deployment:**
- ⚠️ SQLite is NOT suitable for production with multiple concurrent users
- ✅ Use PostgreSQL or MySQL with proper authentication
- ✅ Implement user authentication (JWT tokens, sessions)
- ✅ Add API authentication middleware
- ✅ Use environment variables for database credentials

### Quick Database Commands

```bash
# View database
python view_db.py

# View specific user
python view_db.py demo

# Backup database
cp virtual_pet.db virtual_pet.db.backup

# Delete database (starts fresh)
rm virtual_pet.db
```

---

## 📁 Project Structure

```
VirtualPetApp/
├── src/                          # Frontend React application
│   ├── components/
│   │   ├── HomeScreen.tsx       # Main chat interface
│   │   ├── LoginScreen.tsx       # Authentication
│   │   ├── PetCareScreen.tsx     # Pet care & customization
│   │   ├── ProgressScreen.tsx    # Statistics & charts
│   │   ├── VirtualPet.tsx        # Animated pet component
│   │   └── ui/                    # Reusable UI components
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles
├── MentalBert/                    # Emotion detection model files
├── server.py                      # FastAPI backend server
├── virtual_pet.py                 # Virtual pet logic
├── database.py                    # Database models and utilities
├── view_db.py                     # Database viewer script
├── virtual_pet.db                 # SQLite database (auto-created)
├── simulare.py                    # Simulation/testing utilities
├── requirements.txt               # Python dependencies
└── package.json                   # Node.js dependencies
```

---

## 🎯 Purpose

This project demonstrates modern full-stack development, showcasing:

- Component-based React architecture with TypeScript
- FastAPI backend with AI/ML integration
- Emotion detection using custom-trained models
- Empathetic AI conversation patterns
- Data visualization and progress tracking
- User experience design focused on emotional well-being

The app serves as both a portfolio project and a tool for emotional support, combining technical skills with empathetic design.

---

Built with ❤️ for emotional well-being and mental health support.
