import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Heart, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginScreenProps {
  onLogin: (username: string, password: string) => boolean;
  onRegister: (username: string, password: string, mail: string) => boolean;
}

export function LoginScreen({ onLogin, onRegister }: LoginScreenProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mail, setMail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      if (!username || !password || !mail) {
        setError('Please fill in all fields');
        return;
      }
      const success = onRegister(username, password, mail);
      if (success) {
        setError('');
      } else {
        setError('Registration failed');
      }
    } else {
      if (!username || !password) {
        setError('Please fill in all fields');
        return;
      }
      const success = onLogin(username, password);
      if (!success) {
        setError('Invalid username or password');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 bg-white/80 backdrop-blur-sm border-purple-100 shadow-xl">
          {/* Logo/Branding */}
          <div className="text-center mb-8">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mb-4 shadow-lg"
            >
              <Heart className="w-10 h-10 text-white" fill="white" />
            </motion.div>
            <h1 className="mb-2 text-purple-600 flex items-center justify-center gap-2">
              AI Pet Companion
              <Sparkles className="w-5 h-5 text-pink-400" />
            </h1>
            <p className="text-gray-600">Your emotional well-being friend</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-gray-700">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="mt-1 border-purple-200 focus:border-purple-400"
              />
            </div>

            {isRegister && (
              <div>
                <Label htmlFor="mail" className="text-gray-700">Email</Label>
                <Input
                  id="mail"
                  type="email"
                  value={mail}
                  onChange={(e) => setMail(e.target.value)}
                  placeholder="Enter your email"
                  className="mt-1 border-purple-200 focus:border-purple-400"
                />
              </div>
            )}

            <div>
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="mt-1 border-purple-200 focus:border-purple-400"
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
            >
              {isRegister ? 'Create Account' : 'Login'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-purple-600 hover:text-purple-700 transition-colors"
            >
              {isRegister
                ? 'Already have an account? Login'
                : "Don't have an account? Sign up"}
            </button>
          </div>

          {!isRegister && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800">
                <strong>Demo:</strong> username: <code>demo</code> | password: <code>demo123</code>
              </p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
