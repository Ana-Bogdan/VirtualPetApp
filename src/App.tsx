import { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { HomeScreen } from './components/HomeScreen';
import { PetCareScreen } from './components/PetCareScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { Heart, Home, Package, TrendingUp } from 'lucide-react';

// Mock user database
const mockUsers = [
  { id: 1, username: 'demo', password: 'demo123', mail: 'demo@example.com' }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeScreen, setActiveScreen] = useState<'home' | 'care' | 'progress'>('home');

  const handleLogin = (username: string, password: string) => {
    const user = mockUsers.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const handleRegister = (username: string, password: string, mail: string) => {
    // Mock registration - in real app this would save to database
    const newUser = {
      id: mockUsers.length + 1,
      username,
      password,
      mail
    };
    mockUsers.push(newUser);
    setCurrentUser(newUser);
    return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveScreen('home');
  };

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Main Content */}
      <div className="pb-20">
        {activeScreen === 'home' && <HomeScreen username={currentUser.username} />}
        {activeScreen === 'care' && <PetCareScreen />}
        {activeScreen === 'progress' && <ProgressScreen username={currentUser.username} />}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-purple-100 shadow-lg">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex justify-around items-center">
            <button
              onClick={() => setActiveScreen('home')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                activeScreen === 'home'
                  ? 'bg-purple-100 text-purple-600'
                  : 'text-gray-500 hover:text-purple-500'
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </button>

            <button
              onClick={() => setActiveScreen('care')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                activeScreen === 'care'
                  ? 'bg-purple-100 text-purple-600'
                  : 'text-gray-500 hover:text-purple-500'
              }`}
            >
              <Heart className="w-6 h-6" />
              <span className="text-xs">Care</span>
            </button>

            <button
              onClick={() => setActiveScreen('progress')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                activeScreen === 'progress'
                  ? 'bg-purple-100 text-purple-600'
                  : 'text-gray-500 hover:text-purple-500'
              }`}
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs">Progress</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-gray-500 hover:text-purple-500 transition-all"
            >
              <Package className="w-6 h-6" />
              <span className="text-xs">Logout</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
