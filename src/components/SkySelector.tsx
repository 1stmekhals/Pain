import React from 'react';
import { motion } from 'framer-motion';
import { Globe, User } from 'lucide-react';
import { Profile } from '../types/profile';

interface SkySelectorProps {
  currentSky: 'general' | string;
  onSkyChange: (skyType: 'general' | string) => void;
  userProfile: Partial<Profile> | null;
}

export const SkySelector: React.FC<SkySelectorProps> = ({
  currentSky,
  onSkyChange,
  userProfile,
}) => {
  const getSkyDisplayName = () => {
    if (currentSky === 'general') return 'General Sky';
    if (currentSky === userProfile?.id) return 'My Sky';
    return 'User Sky';
  };

  return (
    <div className="fixed top-4 left-4 z-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-lg p-3 border border-gray-700"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {currentSky === 'general' ? (
              <Globe className="w-5 h-5 text-blue-400" />
            ) : (
              <User className="w-5 h-5 text-purple-400" />
            )}
            <span className="text-white text-sm font-medium">
              {getSkyDisplayName()}
            </span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => onSkyChange('general')}
              className={`px-3 py-1 rounded-full text-xs transition-all ${
                currentSky === 'general'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              General
            </button>
            
            {userProfile && (
              <button
                onClick={() => onSkyChange(userProfile.id!)}
                className={`px-3 py-1 rounded-full text-xs transition-all ${
                  currentSky === userProfile.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                My Sky
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};