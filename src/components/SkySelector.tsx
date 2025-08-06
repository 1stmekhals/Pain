import React from 'react';
import { motion } from 'framer-motion';
import { Globe, User, Sun, Moon } from 'lucide-react';

interface SkySelectorProps {
  currentSky: 'general' | 'user';
  onSkyChange: (skyType: 'general' | 'user') => void;
  isAuthenticated: boolean;
  isDayTime?: boolean;
  viewingUserId?: string | null;
}

export const SkySelector: React.FC<SkySelectorProps> = ({
  currentSky,
  onSkyChange,
  isAuthenticated,
  isDayTime = false,
  viewingUserId,
}) => {
  const getSkyDisplayName = () => {
    if (currentSky === 'general') return 'General Sky';
    if (viewingUserId) {
      return 'User Sky';
    }
    return 'My Sky';
  };

  return (
    <div className="fixed top-4 left-4 z-10">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-dark rounded-xl p-4 shadow-lg animate-float"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isDayTime ? (
              <Sun className="w-4 h-4 text-yellow-300 animate-pulse" />
            ) : (
              <Moon className="w-4 h-4 text-blue-200 animate-pulse" />
            )}
            {currentSky === 'general' ? (
              <Globe className="w-5 h-5 text-blue-400 animate-pulse" />
            ) : (
              <User className="w-5 h-5 text-purple-400 animate-pulse" />
            )}
            <span className="text-white text-sm font-medium">
              {getSkyDisplayName()}
            </span>
            <span className="text-gray-300 text-xs opacity-75">
              ({isDayTime ? 'Day' : 'Night'})
            </span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => onSkyChange('general')}
              className={`px-3 py-1 rounded-full text-xs transition-all ${
                currentSky === 'general'
                  ? 'bg-blue-600 text-white shadow-lg animate-glow'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:scale-105'
              }`}
            >
              General
            </button>
            
            {isAuthenticated && (
              <button
                onClick={() => onSkyChange('user')}
                className={`px-3 py-1 rounded-full text-xs transition-all ${
                  currentSky === 'user'
                    ? 'bg-purple-600 text-white shadow-lg animate-glow'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:scale-105'
                }`}
              >
                {viewingUserId ? 'User Sky' : 'My Sky'}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};