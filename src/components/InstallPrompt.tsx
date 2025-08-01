import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Monitor } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

export const InstallPrompt: React.FC = () => {
  const { canInstall, install, isStandalone } = usePWA();
  const [isVisible, setIsVisible] = useState(true);
  const [isInstalling, setIsInstalling] = useState(false);

  // Don't show if already installed or not installable
  if (!canInstall || !isVisible || isStandalone) {
    return null;
  }

  const handleInstall = async () => {
    try {
      setIsInstalling(true);
      await install();
      setIsVisible(false);
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Remember user dismissed the prompt
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Check if user previously dismissed
  React.useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      setIsVisible(false);
    }
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50"
        >
          <div className="bg-gray-900 bg-opacity-95 backdrop-blur-md rounded-xl p-4 border border-gray-700 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm mb-1">
                  Install Star Letter
                </h3>
                <p className="text-gray-300 text-xs mb-3 leading-relaxed">
                  Install our app for a better experience! Access your stars offline and get a native app feel.
                </p>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleInstall}
                    disabled={isInstalling}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-xs font-medium"
                  >
                    {isInstalling ? (
                      <>
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                        Installing...
                      </>
                    ) : (
                      <>
                        <Download className="w-3 h-3" />
                        Install
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleDismiss}
                    className="px-3 py-1.5 text-gray-400 hover:text-white transition-colors text-xs"
                  >
                    Maybe later
                  </button>
                </div>
              </div>
              
              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};