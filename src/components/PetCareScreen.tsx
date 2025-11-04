import { useState } from 'react';
import { VirtualPet } from './VirtualPet';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Heart, Utensils, Sparkles, Crown, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface PetStats {
  happiness: number;
  hunger: number;
  energy: number;
}

interface InventoryItem {
  id: string;
  name: string;
  type: 'food' | 'accessory';
  icon: string;
  effect?: keyof PetStats;
  value?: number;
}

export function PetCareScreen() {
  const [stats, setStats] = useState<PetStats>({
    happiness: 85,
    hunger: 60,
    energy: 70,
  });

  const [appliedAccessories, setAppliedAccessories] = useState<string[]>([]);
  const [feedAnimation, setFeedAnimation] = useState(false);

  // Mock inventory items
  const inventoryItems: InventoryItem[] = [
    { id: '1', name: 'Berry', type: 'food', icon: '🫐', effect: 'hunger', value: 20 },
    { id: '2', name: 'Cookie', type: 'food', icon: '🍪', effect: 'happiness', value: 15 },
    { id: '3', name: 'Energy Drink', type: 'food', icon: '⚡', effect: 'energy', value: 25 },
    { id: '4', name: 'Bow', type: 'accessory', icon: '🎀', effect: 'happiness', value: 10 },
    { id: '5', name: 'Crown', type: 'accessory', icon: '👑', effect: 'happiness', value: 15 },
    { id: '6', name: 'Star', type: 'accessory', icon: '⭐', effect: 'happiness', value: 10 },
  ];

  const handleUseItem = (item: InventoryItem) => {
    if (item.type === 'food') {
      setFeedAnimation(true);
      setTimeout(() => setFeedAnimation(false), 1000);

      if (item.effect && item.value) {
        setStats((prev) => ({
          ...prev,
          [item.effect!]: Math.min(100, prev[item.effect!] + item.value!),
        }));
      }
    } else if (item.type === 'accessory') {
      const accessoryMap: { [key: string]: string } = {
        'Bow': 'bow',
        'Crown': 'hat',
        'Star': 'star',
      };
      
      const accessoryKey = accessoryMap[item.name];
      if (accessoryKey && !appliedAccessories.includes(accessoryKey)) {
        setAppliedAccessories((prev) => [...prev, accessoryKey]);
        if (item.effect && item.value) {
          setStats((prev) => ({
            ...prev,
            [item.effect!]: Math.min(100, prev[item.effect!] + item.value!),
          }));
        }
      }
    }
  };

  const handleRemoveAccessory = (accessory: string) => {
    setAppliedAccessories((prev) => prev.filter((a) => a !== accessory));
  };

  const getStatColor = (value: number) => {
    if (value >= 70) return 'bg-green-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getMoodFromStats = (): 'happy' | 'neutral' | 'sad' => {
    const average = (stats.happiness + stats.hunger + stats.energy) / 3;
    if (average >= 70) return 'happy';
    if (average >= 40) return 'neutral';
    return 'sad';
  };

  return (
    <div className="max-w-md mx-auto min-h-screen p-4">
      <h2 className="mb-4 text-purple-600">Pet Care & Customization</h2>

      {/* Pet Display */}
      <Card className="mb-4 p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100 relative overflow-hidden">
        <VirtualPet mood={getMoodFromStats()} accessories={appliedAccessories} />
        
        {feedAnimation && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: -50 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl"
          >
            ❤️
          </motion.div>
        )}
      </Card>

      {/* Applied Accessories */}
      {appliedAccessories.length > 0 && (
        <Card className="mb-4 p-4 bg-white/80 backdrop-blur-sm border-purple-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-purple-600 flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Applied Accessories
            </h3>
          </div>
          <div className="flex gap-2 flex-wrap">
            {appliedAccessories.map((accessory) => (
              <Badge
                key={accessory}
                className="bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer"
                onClick={() => handleRemoveAccessory(accessory)}
              >
                {accessory}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Pet Stats */}
      <Card className="mb-4 p-4 bg-white/80 backdrop-blur-sm border-purple-100">
        <h3 className="mb-3 text-purple-600 flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Pet Status
        </h3>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Happiness</span>
              <span className="text-sm">{stats.happiness}%</span>
            </div>
            <Progress value={stats.happiness} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Fullness</span>
              <span className="text-sm">{stats.hunger}%</span>
            </div>
            <Progress value={stats.hunger} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Energy</span>
              <span className="text-sm">{stats.energy}%</span>
            </div>
            <Progress value={stats.energy} className="h-2" />
          </div>
        </div>

        <div className="mt-4 p-3 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-800">
            {getMoodFromStats() === 'happy' && '✨ Your pet is thriving and happy!'}
            {getMoodFromStats() === 'neutral' && '💭 Your pet could use some attention.'}
            {getMoodFromStats() === 'sad' && '💙 Your pet needs your care and love.'}
          </p>
        </div>
      </Card>

      {/* Inventory */}
      <Card className="p-4 bg-white/80 backdrop-blur-sm border-purple-100">
        <h3 className="mb-3 text-purple-600 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Inventory
        </h3>

        {/* Food Items */}
        <div className="mb-4">
          <h4 className="text-sm text-gray-600 mb-2 flex items-center gap-2">
            <Utensils className="w-4 h-4" />
            Food & Items
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {inventoryItems
              .filter((item) => item.type === 'food')
              .map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleUseItem(item)}
                  className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:border-purple-400 transition-all"
                >
                  <div className="text-3xl mb-1">{item.icon}</div>
                  <div className="text-xs text-gray-700">{item.name}</div>
                </motion.button>
              ))}
          </div>
        </div>

        {/* Accessories */}
        <div>
          <h4 className="text-sm text-gray-600 mb-2 flex items-center gap-2">
            <Crown className="w-4 h-4" />
            Accessories
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {inventoryItems
              .filter((item) => item.type === 'accessory')
              .map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleUseItem(item)}
                  className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:border-purple-400 transition-all"
                >
                  <div className="text-3xl mb-1">{item.icon}</div>
                  <div className="text-xs text-gray-700">{item.name}</div>
                </motion.button>
              ))}
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Tap items to use them. Feed your pet and dress them up! 💜
        </p>
      </Card>
    </div>
  );
}
