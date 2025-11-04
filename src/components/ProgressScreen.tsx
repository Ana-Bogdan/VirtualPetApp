import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { TrendingUp, Calendar, MessageCircle, Heart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface ProgressScreenProps {
  username: string;
}

// Mock data for emotional tracking
const mockEmotionalData = [
  { date: 'Oct 29', mood: 6, label: 'Neutral' },
  { date: 'Oct 30', mood: 7, label: 'Good' },
  { date: 'Oct 31', mood: 5, label: 'Low' },
  { date: 'Nov 1', mood: 8, label: 'Great' },
  { date: 'Nov 2', mood: 7, label: 'Good' },
  { date: 'Nov 3', mood: 9, label: 'Excellent' },
  { date: 'Nov 4', mood: 8, label: 'Great' },
];

// Mock chat history
const mockChatHistory = [
  {
    id: 1,
    date: 'Nov 4, 2025',
    snippet: "I'm feeling really good today! Had a great morning...",
    emotion: 'happy',
    messageCount: 12,
  },
  {
    id: 2,
    date: 'Nov 3, 2025',
    snippet: 'Feeling a bit stressed about upcoming exams...',
    emotion: 'anxious',
    messageCount: 18,
  },
  {
    id: 3,
    date: 'Nov 2, 2025',
    snippet: 'Just had a good chat with friends, feeling better...',
    emotion: 'happy',
    messageCount: 15,
  },
  {
    id: 4,
    date: 'Nov 1, 2025',
    snippet: "Today was challenging but I'm managing...",
    emotion: 'neutral',
    messageCount: 10,
  },
  {
    id: 5,
    date: 'Oct 31, 2025',
    snippet: 'Feeling down, need someone to talk to...',
    emotion: 'sad',
    messageCount: 20,
  },
];

export function ProgressScreen({ username }: ProgressScreenProps) {
  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'happy':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'sad':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'anxious':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getEmotionEmoji = (emotion: string) => {
    switch (emotion) {
      case 'happy':
        return '😊';
      case 'sad':
        return '😢';
      case 'anxious':
        return '😰';
      default:
        return '😐';
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen p-4">
      <div className="mb-4">
        <h2 className="text-purple-600 flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          Your Progress
        </h2>
        <p className="text-sm text-gray-500">Track your emotional well-being journey</p>
      </div>

      <Tabs defaultValue="tracking" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="tracking">
            <Calendar className="w-4 h-4 mr-2" />
            Mood Tracking
          </TabsTrigger>
          <TabsTrigger value="history">
            <MessageCircle className="w-4 h-4 mr-2" />
            Chat History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tracking" className="space-y-4">
          {/* Mood Overview */}
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-purple-600">Weekly Mood Overview</h3>
              <Badge className="bg-purple-500 text-white">
                7 Days
              </Badge>
            </div>

            {/* Chart */}
            <div className="bg-white/60 rounded-lg p-3 mb-4">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={mockEmotionalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E9D5FF" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    stroke="#A855F7"
                  />
                  <YAxis
                    domain={[0, 10]}
                    tick={{ fontSize: 12 }}
                    stroke="#A855F7"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#F3E8FF',
                      border: '1px solid #A855F7',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#A855F7"
                    strokeWidth={3}
                    dot={{ fill: '#EC4899', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white/60 rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">😊</div>
                <div className="text-xs text-gray-600">Avg Mood</div>
                <div className="text-purple-600">7.3/10</div>
              </div>
              <div className="bg-white/60 rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">📈</div>
                <div className="text-xs text-gray-600">Trend</div>
                <div className="text-green-600">+12%</div>
              </div>
              <div className="bg-white/60 rounded-lg p-3 text-center">
                <div className="text-2xl mb-1">🎯</div>
                <div className="text-xs text-gray-600">Check-ins</div>
                <div className="text-purple-600">7 days</div>
              </div>
            </div>
          </Card>

          {/* Emotional Insights */}
          <Card className="p-4 bg-white/80 backdrop-blur-sm border-purple-100">
            <h3 className="mb-3 text-purple-600 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Insights & Patterns
            </h3>

            <div className="space-y-3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-green-50 rounded-lg border border-green-200"
              >
                <div className="flex items-start gap-2">
                  <div className="text-xl">✨</div>
                  <div>
                    <p className="text-sm text-green-800">
                      Your mood has been improving! You've had 4 positive days this week.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="p-3 bg-purple-50 rounded-lg border border-purple-200"
              >
                <div className="flex items-start gap-2">
                  <div className="text-xl">💜</div>
                  <div>
                    <p className="text-sm text-purple-800">
                      You're most active in the evenings. Great time for reflection!
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="p-3 bg-blue-50 rounded-lg border border-blue-200"
              >
                <div className="flex items-start gap-2">
                  <div className="text-xl">🌟</div>
                  <div>
                    <p className="text-sm text-blue-800">
                      Talking about your feelings helps! Keep sharing with your pet companion.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-3">
          <Card className="p-4 bg-white/80 backdrop-blur-sm border-purple-100">
            <h3 className="mb-3 text-purple-600">Recent Conversations</h3>
            <p className="text-sm text-gray-500 mb-4">
              Review your past chats and emotional journey
            </p>

            <div className="space-y-3">
              {mockChatHistory.map((chat, index) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100 hover:border-purple-300 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="text-xl">{getEmotionEmoji(chat.emotion)}</div>
                      <div>
                        <div className="text-sm text-gray-700">{chat.date}</div>
                      </div>
                    </div>
                    <Badge className={getEmotionColor(chat.emotion)}>
                      {chat.emotion}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{chat.snippet}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <MessageCircle className="w-3 h-3" />
                    {chat.messageCount} messages
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-800 text-center">
                💭 Reflecting on your journey helps you grow
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
