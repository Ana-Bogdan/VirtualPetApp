# 🐾 AI Pet Companion App

This is a full-stack React application for emotional well-being through an interactive virtual pet companion. The app provides a safe space for users to express their feelings, receive empathetic responses, and track their emotional progress over time. The virtual pet reacts to your emotional state and provides support through conversations, mini-games, and care activities.

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

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts for progress visualization
- **State Management**: React Hooks (useState, useEffect)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Ana-Bogdan/pet-app.git
cd pet-app
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

### Demo Credentials

- **Username**: `demo`
- **Password**: `demo123`

---

## 📁 Project Structure

```
pet-app/
├── src/
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
├── public/                       # Static assets
├── figma/                        # Original design files
└── package.json
```

---

## 🎯 Purpose

This project demonstrates modern React development with TypeScript, showcasing:
- Component-based architecture
- Type-safe development
- Responsive design patterns
- Interactive animations
- Emotional AI conversation patterns
- Data visualization
- User experience design focused on emotional well-being

The app serves as both a portfolio project and a tool for emotional support, combining technical skills with empathetic design.

---

Built with ❤️ for emotional well-being and mental health support.
