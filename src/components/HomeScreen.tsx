import { useState, useRef, useEffect } from 'react';
import { VirtualPet } from './VirtualPet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Send, Flame, Gamepad2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'pet';
  emotionalState?: string;
  timestamp: Date;
}

interface HomeScreenProps {
  username: string;
}

export function HomeScreen({ username }: HomeScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Hi ${username}! I'm so happy to see you today! 💜 How are you feeling?`,
      sender: 'pet',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [streak, setStreak] = useState(7);
  const [petMood, setPetMood] = useState<'happy' | 'neutral' | 'sad'>('happy');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // API endpoint - adjust if your backend runs on a different port
  const API_BASE_URL = 'http://localhost:8000';
  const PET_NAME = 'Nori'; // Default pet name, can be made configurable later

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Map vibe_score to pet mood
  const getMoodFromVibeScore = (vibeScore: number): 'happy' | 'neutral' | 'sad' => {
    if (vibeScore > 0.3) return 'happy';
    if (vibeScore < -0.3) return 'sad';
    return 'neutral';
  };

  // Call backend API to get pet response
  const getPetResponse = async (userMessage: string): Promise<{ text: string; emotionalState: string; vibeScore: number }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: username, // Using username as user_id
          message: userMessage,
          user_name: username,
          pet_name: PET_NAME,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Update pet mood based on vibe_score
      const mood = getMoodFromVibeScore(data.vibe_score);
      setPetMood(mood);

      return {
        text: data.reply,
        emotionalState: data.detected_emotion || 'neutral',
        vibeScore: data.vibe_score,
      };
    } catch (error) {
      console.error('Error calling API:', error);
      // Fallback response if API fails
      return {
        text: "I'm having trouble connecting right now, but I'm still here for you! 💜 Could you try again?",
        emotionalState: 'neutral',
        vibeScore: 0,
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessageText = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: userMessageText,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    try {
      // Get pet response from API
      const { text: responseText, emotionalState } = await getPetResponse(userMessageText);

      const petMessage: Message = {
        id: messages.length + 2,
        text: responseText,
        sender: 'pet',
        emotionalState,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, petMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Show error message to user
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble connecting. Please make sure the backend server is running! 💜",
        sender: 'pet',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const simulateDailyCheckIn = () => {
    setStreak((prev) => prev + 1);
    const congratsMessage: Message = {
      id: messages.length + 1,
      text: `Awesome! You've checked in ${streak + 1} days in a row! 🎉 Keep up the amazing work!`,
      sender: 'pet',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, congratsMessage]);
  };

  const openMiniGame = () => {
    const gameMessage: Message = {
      id: messages.length + 1,
      text: "Let's play! Mini-games help reduce stress. How about a quick breathing exercise? Inhale... Exhale... 🌸",
      sender: 'pet',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, gameMessage]);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen p-4">
      {/* Header with Streak */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-gray-700">Welcome back, {username}!</h2>
            <p className="text-sm text-gray-500">Your companion is excited to see you</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={simulateDailyCheckIn}
            className="cursor-pointer"
          >
            <Badge className="bg-gradient-to-r from-orange-400 to-red-400 text-white px-4 py-2 gap-2">
              <Flame className="w-4 h-4" />
              {streak} Day Streak
            </Badge>
          </motion.div>
        </div>

        {/* Mini-games button */}
        <Button
          onClick={openMiniGame}
          variant="outline"
          className="w-full mb-4 border-purple-200 text-purple-600 hover:bg-purple-50"
        >
          <Gamepad2 className="w-4 h-4 mr-2" />
          Play Mini-Game
          <Sparkles className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Pet Display */}
      <Card className="mb-4 p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
        <VirtualPet mood={petMood} accessories={[]} />
      </Card>

      {/* Chat Interface */}
      <Card className="bg-white/80 backdrop-blur-sm border-purple-100 shadow-lg">
        {/* Messages */}
        <div className="h-[300px] overflow-y-auto p-4 space-y-3">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-purple-50 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  {message.emotionalState && (
                    <Badge className="mt-2 text-xs bg-white/20">
                      Detected: {message.emotionalState}
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-purple-100">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isLoading ? "Thinking..." : "How are you feeling today?"}
              disabled={isLoading}
              className="flex-1 border-purple-200 focus:border-purple-400 disabled:opacity-50"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Share your feelings openly. I'm here to listen 💜
          </p>
        </div>
      </Card>
    </div>
  );
}
