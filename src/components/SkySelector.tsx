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
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="glass-ultra rounded-2xl p-4 shadow-2xl"
        whileHover={{ scale: 1.02, y: -2 }}
        style={{ willChange: 'transform' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isDayTime ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sun className="w-4 h-4 text-yellow-300 drop-shadow-lg" />
              </motion.div>
            ) : (
              <motion.div
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Moon className="w-4 h-4 text-blue-200 drop-shadow-lg" />
              </motion.div>
            )}
            {currentSky === 'general' ? (
              <motion.div
                animate={{ rotateY: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Globe className="w-5 h-5 text-blue-400 drop-shadow-lg" />
              </motion.div>
            ) : (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <User className="w-5 h-5 text-purple-400 drop-shadow-lg" />
              </motion.div>
            )}
            <span className="text-white text-sm font-medium drop-shadow-sm">
              {getSkyDisplayName()}
            </span>
            <span className="text-gray-300 text-xs opacity-75 drop-shadow-sm">
              ({isDayTime ? 'Day' : 'Night'})
            </span>
          </div>
          
          <div className="flex gap-2">
            <motion.button
              onClick={() => onSkyChange('general')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                currentSky === 'general'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20 backdrop-blur-sm'
              }`}
            >
              General
            </motion.button>
            
            {isAuthenticated && (
              <motion.button
                onClick={() => onSkyChange('user')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                  currentSky === 'user'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                {viewingUserId ? 'User Sky' : 'My Sky'}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};