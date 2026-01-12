import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Wind, Clock, Play, Pause, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BreathingExercise {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  color: string;
}

const exercises: BreathingExercise[] = [
  {
    id: '478',
    name: '4-7-8 Breathing',
    description: 'Calming technique for stress relief and better sleep',
    inhale: 4,
    hold: 7,
    exhale: 8,
    color: 'from-blue-400 to-purple-400',
  },
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Equal intervals for focus and calm',
    inhale: 4,
    hold: 4,
    exhale: 4,
    color: 'from-purple-400 to-pink-400',
  },
  {
    id: 'deep',
    name: 'Deep Breathing',
    description: 'Simple and relaxing deep breaths',
    inhale: 5,
    hold: 0,
    exhale: 5,
    color: 'from-pink-400 to-rose-400',
  },
  {
    id: 'calm',
    name: 'Calm Breathing',
    description: 'Gentle breathing for anxiety relief',
    inhale: 4,
    hold: 2,
    exhale: 6,
    color: 'from-indigo-400 to-purple-400',
  },
];

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest';

interface BreathingExercisesScreenProps {
  onBack: () => void;
}

export function BreathingExercisesScreen({ onBack }: BreathingExercisesScreenProps) {
  const [selectedExercise, setSelectedExercise] = useState<BreathingExercise>(exercises[0]);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<Phase>('inhale');
  const [countdown, setCountdown] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [totalCycles, setTotalCycles] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    let interval: NodeJS.Timeout;
    const duration = phase === 'inhale' 
      ? selectedExercise.inhale 
      : phase === 'hold' 
      ? selectedExercise.hold 
      : selectedExercise.exhale;

    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      // Move to next phase
      if (phase === 'inhale') {
        if (selectedExercise.hold > 0) {
          setPhase('hold');
          setCountdown(selectedExercise.hold);
        } else {
          setPhase('exhale');
          setCountdown(selectedExercise.exhale);
        }
      } else if (phase === 'hold') {
        setPhase('exhale');
        setCountdown(selectedExercise.exhale);
      } else if (phase === 'exhale') {
        setPhase('inhale');
        setCountdown(selectedExercise.inhale);
        setCycle((prev) => prev + 1);
        setTotalCycles((prev) => prev + 1);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, countdown, phase, selectedExercise]);

  const handleStart = () => {
    setIsActive(true);
    setPhase('inhale');
    setCountdown(selectedExercise.inhale);
    setCycle(0);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('inhale');
    setCountdown(selectedExercise.inhale);
    setCycle(0);
    setTotalCycles(0);
  };

  const handleExerciseChange = (exercise: BreathingExercise) => {
    setSelectedExercise(exercise);
    handleReset();
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      default:
        return '';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return 'from-blue-400 to-cyan-400';
      case 'hold':
        return 'from-purple-400 to-pink-400';
      case 'exhale':
        return 'from-pink-400 to-rose-400';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getCircleScale = () => {
    if (!isActive) return 1;
    switch (phase) {
      case 'inhale':
        return 1.5;
      case 'hold':
        return 1.5;
      case 'exhale':
        return 0.8;
      default:
        return 1;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen p-4">
      {/* Header */}
      <div className="mb-4 flex items-center gap-4">
        <Button
          onClick={onBack}
          variant="ghost"
          size="icon"
          className="text-purple-600 hover:bg-purple-50"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-semibold text-purple-600">Breathing Exercises</h2>
          <p className="text-sm text-gray-500">Find your calm and peace</p>
        </div>
      </div>

      {/* Exercise Selection */}
      <Card className="mb-4 p-4 bg-white/80 backdrop-blur-sm border-purple-100">
        <div className="flex items-center gap-2 mb-3">
          <Wind className="w-5 h-5 text-purple-600" />
          <h3 className="text-purple-600 font-semibold">Choose a Technique</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {exercises.map((exercise) => (
            <motion.button
              key={exercise.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleExerciseChange(exercise)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                selectedExercise.id === exercise.id
                  ? 'border-purple-400 bg-purple-50'
                  : 'border-purple-100 hover:border-purple-200'
              }`}
            >
              <div className="text-sm font-semibold text-gray-800">{exercise.name}</div>
              <div className="text-xs text-gray-500 mt-1">{exercise.description}</div>
              <div className="text-xs text-purple-600 mt-2">
                {exercise.inhale}-{exercise.hold > 0 ? `${exercise.hold}-` : ''}
                {exercise.exhale}
              </div>
            </motion.button>
          ))}
        </div>
      </Card>

      {/* Breathing Circle */}
      <Card className="mb-4 p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100 relative overflow-hidden">
        <div className="flex flex-col items-center justify-center min-h-[300px]">
          <motion.div
            animate={{
              scale: getCircleScale(),
            }}
            transition={{
              duration: phase === 'inhale' 
                ? selectedExercise.inhale 
                : phase === 'hold' 
                ? selectedExercise.hold 
                : selectedExercise.exhale,
              ease: phase === 'inhale' ? 'easeOut' : phase === 'exhale' ? 'easeIn' : 'linear',
            }}
            className={`w-48 h-48 rounded-full bg-gradient-to-br ${getPhaseColor()} shadow-lg flex items-center justify-center`}
          >
            <div className="text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={phase}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-white"
                >
                  <div className="text-2xl font-semibold mb-2">{getPhaseText()}</div>
                  {isActive && (
                    <div className="text-4xl font-bold">{countdown}</div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {!isActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 text-center"
            >
              <p className="text-gray-600 mb-4">Ready to begin?</p>
              <p className="text-sm text-gray-500">
                {selectedExercise.inhale}-{selectedExercise.hold > 0 ? `${selectedExercise.hold}-` : ''}
                {selectedExercise.exhale} breathing pattern
              </p>
            </motion.div>
          )}
        </div>
      </Card>

      {/* Controls */}
      <Card className="mb-4 p-4 bg-white/80 backdrop-blur-sm border-purple-100">
        <div className="flex items-center justify-center gap-3 mb-4">
          {!isActive ? (
            <Button
              onClick={handleStart}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8"
            >
              <Play className="w-5 h-5 mr-2" />
              Start
            </Button>
          ) : (
            <>
              <Button
                onClick={handlePause}
                variant="outline"
                className="border-purple-300 text-purple-600 hover:bg-purple-50"
              >
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="border-purple-300 text-purple-600 hover:bg-purple-50"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>
            </>
          )}
        </div>

        {isActive && (
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{cycle}</div>
              <div className="text-xs text-gray-500">Current Cycle</div>
            </div>
            <div className="w-px h-8 bg-purple-200" />
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{totalCycles}</div>
              <div className="text-xs text-gray-500">Total Cycles</div>
            </div>
          </div>
        )}
      </Card>

      {/* Instructions */}
      <Card className="p-4 bg-white/80 backdrop-blur-sm border-purple-100">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-purple-600" />
          <h3 className="text-sm font-semibold text-purple-600">Instructions</h3>
        </div>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Find a comfortable position</li>
          <li>• Follow the circle's rhythm</li>
          <li>• Breathe through your nose</li>
          <li>• Focus on the countdown</li>
          <li>• Practice for 5-10 minutes</li>
        </ul>
        <div className="mt-3 pt-3 border-t border-purple-100">
          <Badge className="bg-purple-100 text-purple-700">
            💜 Take your time and be gentle with yourself
          </Badge>
        </div>
      </Card>
    </div>
  );
}
