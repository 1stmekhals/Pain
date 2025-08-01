import React from 'react';
import { Globe, User } from 'lucide-react';

interface SkySelectorProps {
  currentSky: 'general' | 'user';
  onSkyChange: (skyType: 'general' | 'user') => void;
  isAuthenticated: boolean;
}

export const SkySelector: React.FC<SkySelectorProps> = ({
  currentSky,
  onSkyChange,
  isAuthenticated,
}) => {
  const getSkyDisplayName = () => {
    if (currentSky === 'general') return 'General Sky';
    return 'My Sky';
  };

  return (
    <div className="fixed top-4 left-4 z-10">
      <div className="bg-gray-900 bg-opacity-80 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
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
            
            {isAuthenticated && (
              <button
                onClick={() => onSkyChange('user')}
                className={`px-3 py-1 rounded-full text-xs transition-all ${
                  currentSky === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                My Sky
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};