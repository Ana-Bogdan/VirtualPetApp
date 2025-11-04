import { useState, useRef, useEffect } from 'react';
import { VirtualPet } from './VirtualPet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Send, Flame, Gamepad2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock AI response generator with emotional intelligence
  const generatePetResponse = (userMessage: string): { text: string; emotionalState: string } => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Detect emotional state
    let emotionalState = 'neutral';
    let response = '';

    if (lowerMessage.includes('sad') || lowerMessage.includes('down') || lowerMessage.includes('depressed')) {
      emotionalState = 'sad';
      setPetMood('sad');
      const responses = [
        "I'm here for you. That sounds really tough. Would you like to talk about what's making you feel this way? 💙",
        "I can sense you're going through a hard time. Remember, it's okay to not be okay. I'm here to listen. 🫂",
        "That sounds challenging. You're brave for sharing this with me. How can I support you right now? 💙",
      ];
      response = responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('stressed')) {
      emotionalState = 'anxious';
      setPetMood('neutral');
      const responses = [
        "I hear you. Anxiety can feel overwhelming. Let's take a deep breath together. What's on your mind? 🌸",
        "That sounds stressful. Remember to breathe. Would you like to try a calming mini-game with me? 🌿",
        "I understand. When I feel anxious, I focus on the present moment. What's one thing you can see right now? 💚",
      ];
      response = responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('happy') || lowerMessage.includes('good') || lowerMessage.includes('great') || lowerMessage.includes('excited')) {
      emotionalState = 'happy';
      setPetMood('happy');
      const responses = [
        "Yay! Your happiness makes me so happy too! Tell me more about what's making you feel good! ✨",
        "That's wonderful! I love seeing you this happy! Keep that positive energy going! 🌟",
        "Amazing! Your smile brightens my day! What happened that made you feel this way? 💖",
      ];
      response = responses[Math.floor(Math.random() * responses.length)];
    } else if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted')) {
      emotionalState = 'tired';
      setPetMood('neutral');
      const responses = [
        "Rest is important. Make sure you're taking care of yourself. Have you been getting enough sleep? 😴",
        "Being tired is your body's way of asking for care. Maybe it's time for a break? 💜",
      ];
      response = responses[Math.floor(Math.random() * responses.length)];
    } else {
      setPetMood('happy');
      const responses = [
        "Thank you for sharing that with me. How did that make you feel? 💭",
        "I'm listening. Tell me more about what's on your mind. 🌸",
        "That's interesting! I'd love to hear more about your day. 💜",
        "I appreciate you opening up to me. What else would you like to talk about? ✨",
      ];
      response = responses[Math.floor(Math.random() * responses.length)];
    }

    return { text: response, emotionalState };
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Generate pet response
    const { text: responseText, emotionalState } = generatePetResponse(inputValue);

    setTimeout(() => {
      const petMessage: Message = {
        id: messages.length + 2,
        text: responseText,
        sender: 'pet',
        emotionalState,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, petMessage]);
    }, 800);

    setInputValue('');
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
              placeholder="How are you feeling today?"
              className="flex-1 border-purple-200 focus:border-purple-400"
            />
            <Button
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <Send className="w-4 h-4" />
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
