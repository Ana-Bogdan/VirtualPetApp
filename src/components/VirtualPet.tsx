import { motion } from 'framer-motion';
import { Heart, Sparkles, Star } from 'lucide-react';

interface VirtualPetProps {
  mood?: 'happy' | 'neutral' | 'sad';
  accessories?: string[];
}

export function VirtualPet({ mood = 'happy', accessories = [] }: VirtualPetProps) {
  const getMoodColor = () => {
    switch (mood) {
      case 'happy':
        return 'from-pink-300 to-purple-300';
      case 'neutral':
        return 'from-blue-300 to-indigo-300';
      case 'sad':
        return 'from-gray-300 to-slate-300';
      default:
        return 'from-pink-300 to-purple-300';
    }
  };

  const getEyeExpression = () => {
    switch (mood) {
      case 'happy':
        return '12';
      case 'neutral':
        return '10';
      case 'sad':
        return '8';
      default:
        return '12';
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Floating sparkles */}
      <motion.div
        animate={{
          y: [-10, -20, -10],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute -top-4 -right-4"
      >
        <Sparkles className="w-6 h-6 text-yellow-400" />
      </motion.div>

      <motion.div
        animate={{
          y: [-10, -20, -10],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute -top-2 -left-6"
      >
        <Star className="w-5 h-5 text-pink-400" />
      </motion.div>

      {/* Main pet body */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        {/* Shadow */}
        <motion.div
          animate={{ scale: [1, 0.9, 1], opacity: [0.2, 0.1, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-purple-300 rounded-full blur-xl"
        />

        {/* Pet SVG */}
        <svg width="200" height="200" viewBox="0 0 200 200" className="relative z-10">
          {/* Body */}
          <defs>
            <linearGradient id="petGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" className={`stop-color-${mood}`} stopColor="#F9A8D4" />
              <stop offset="100%" className={`stop-color-${mood}`} stopColor="#C084FC" />
            </linearGradient>
          </defs>

          {/* Main body - cute blob shape */}
          <motion.ellipse
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            cx="100"
            cy="110"
            rx="60"
            ry="65"
            fill="url(#petGradient)"
          />

          {/* Ears */}
          <motion.ellipse
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{ transformOrigin: '60px 60px' }}
            cx="60"
            cy="60"
            rx="20"
            ry="35"
            fill="#F9A8D4"
          />
          <motion.ellipse
            animate={{ rotate: [5, -5, 5] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{ transformOrigin: '140px 60px' }}
            cx="140"
            cy="60"
            rx="20"
            ry="35"
            fill="#F9A8D4"
          />

          {/* Inner ear details */}
          <ellipse cx="60" cy="65" rx="10" ry="18" fill="#FDE4F3" />
          <ellipse cx="140" cy="65" rx="10" ry="18" fill="#FDE4F3" />

          {/* Eyes */}
          <motion.g
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          >
            <circle cx="80" cy="100" r={getEyeExpression()} fill="#1F2937" />
            <circle cx="120" cy="100" r={getEyeExpression()} fill="#1F2937" />
            {/* Eye shine */}
            <circle cx="83" cy="97" r="4" fill="white" />
            <circle cx="123" cy="97" r="4" fill="white" />
          </motion.g>

          {/* Blush */}
          <ellipse cx="60" cy="115" rx="12" ry="8" fill="#FCA5A5" opacity="0.5" />
          <ellipse cx="140" cy="115" rx="12" ry="8" fill="#FCA5A5" opacity="0.5" />

          {/* Mouth/Nose */}
          <circle cx="100" cy="115" r="5" fill="#1F2937" />
          {mood === 'happy' && (
            <>
              <path
                d="M 85 125 Q 100 135 115 125"
                stroke="#1F2937"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
            </>
          )}
          {mood === 'neutral' && (
            <line
              x1="85"
              y1="130"
              x2="115"
              y2="130"
              stroke="#1F2937"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}
          {mood === 'sad' && (
            <path
              d="M 85 135 Q 100 125 115 135"
              stroke="#1F2937"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
          )}

          {/* Accessories */}
          {accessories.includes('bow') && (
            <g transform="translate(90, 30)">
              <path
                d="M 0 10 L -15 0 L -10 10 L -15 20 L 0 10 M 0 10 L 15 0 L 10 10 L 15 20 L 0 10"
                fill="#FF69B4"
              />
              <circle cx="0" cy="10" r="4" fill="#FF1493" />
            </g>
          )}

          {accessories.includes('hat') && (
            <g transform="translate(100, 30)">
              <ellipse cx="0" cy="15" rx="40" ry="8" fill="#4F46E5" />
              <rect x="-20" y="-15" width="40" height="30" rx="5" fill="#6366F1" />
            </g>
          )}

          {accessories.includes('star') && (
            <g transform="translate(100, 25)">
              <motion.path
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: '0px 0px' }}
                d="M 0 -15 L 4 -4 L 15 -4 L 6 2 L 9 13 L 0 7 L -9 13 L -6 2 L -15 -4 L -4 -4 Z"
                fill="#FFD700"
                stroke="#FFA500"
                strokeWidth="0.5"
              />
            </g>
          )}
        </svg>

        {/* Heart indicator when happy */}
        {mood === 'happy' && (
          <motion.div
            animate={{ y: [-50, -70], opacity: [1, 0], scale: [0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-0 left-1/2 transform -translate-x-1/2"
          >
            <Heart className="w-6 h-6 text-pink-500" fill="currentColor" />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
