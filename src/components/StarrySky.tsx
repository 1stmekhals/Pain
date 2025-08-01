import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from '../types/star';

interface StarrySkyProps {
  stars: Star[];
  onStarClick: (star: Star) => void;
}

interface ShootingStar {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number;
}

export const StarrySky: React.FC<StarrySkyProps> = ({ stars, onStarClick }) => {
  const [hoveredStar, setHoveredStar] = useState<string | null>(null);
  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([]);

  // Generate shooting stars every 5 seconds
  useEffect(() => {
    const generateShootingStar = () => {
      const newShootingStar: ShootingStar = {
        id: Math.random().toString(36).substr(2, 9),
        startX: Math.random() * 100,
        startY: -5,
        endX: Math.random() * 100,
        endY: Math.random() * 50 + 25,
        duration: Math.random() * 2 + 1.5, // 1.5-3.5 seconds
      };

      setShootingStars(prev => [...prev, newShootingStar]);

      // Remove shooting star after animation
      setTimeout(() => {
        setShootingStars(prev => prev.filter(star => star.id !== newShootingStar.id));
      }, newShootingStar.duration * 1000 + 500);
    };

    // Generate first shooting star after 2 seconds
    const initialTimeout = setTimeout(generateShootingStar, 2000);
    
    // Then generate every 5 seconds
    const interval = setInterval(generateShootingStar, 5000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Realistic night sky background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-blue-900 to-black" />
      
      {/* Stars background layer */}
      <div className="absolute inset-0">
        {/* Generate random background stars */}
        {Array.from({ length: 200 }).map((_, i) => (
          <div
            key={`bg-star-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `twinkle-${['slow', 'medium', 'fast'][Math.floor(Math.random() * 3)]} ${Math.random() * 3 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Milky Way effect */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse 80% 40% at 50% 60%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
        }}
      />

      {/* Shooting stars */}
      <AnimatePresence>
        {shootingStars.map((shootingStar) => (
          <motion.div
            key={shootingStar.id}
            className="absolute"
            initial={{
              x: `${shootingStar.startX}%`,
              y: `${shootingStar.startY}%`,
              opacity: 0,
            }}
            animate={{
              x: `${shootingStar.endX}%`,
              y: `${shootingStar.endY}%`,
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: shootingStar.duration,
              ease: "easeOut",
            }}
            style={{
              width: '2px',
              height: '2px',
            }}
          >
            {/* Shooting star trail */}
            <div
              className="absolute bg-gradient-to-r from-white via-blue-200 to-transparent rounded-full"
              style={{
                width: '60px',
                height: '2px',
                transform: 'rotate(45deg)',
                transformOrigin: 'left center',
                boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)',
              }}
            />
            {/* Shooting star head */}
            <div
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                boxShadow: '0 0 8px rgba(255, 255, 255, 0.9)',
                left: '-1px',
                top: '-1px',
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Interactive user-created stars */}
      <AnimatePresence>
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute cursor-pointer interactive-star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              zIndex: hoveredStar === star.id ? 10 : 1,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: hoveredStar === star.id ? 1.2 : 1,
              opacity: 1
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
            }}
            whileHover={{ scale: 1.2 }}
            onClick={(e) => {
              e.stopPropagation();
              onStarClick(star);
            }}
            onMouseEnter={() => setHoveredStar(star.id)}
            onMouseLeave={() => setHoveredStar(null)}
          >
            {/* Outer glow layer */}
            <motion.div
              className="absolute"
              style={{
                width: `${star.size * 20}px`,
                height: `${star.size * 20}px`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                opacity: [0.3, 0.5, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                  filter: 'blur(4px)',
                }}
              />
            </motion.div>

            {/* Middle glow layer */}
            <motion.div
              className="absolute"
              style={{
                width: `${star.size * 12}px`,
                height: `${star.size * 12}px`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                opacity: [0.5, 0.7, 0.5],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                  filter: 'blur(3px)',
                }}
              />
            </motion.div>

            {/* Inner glow layer */}
            <motion.div
              className="absolute"
              style={{
                width: `${star.size * 8}px`,
                height: `${star.size * 8}px`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                opacity: [0.7, 1, 0.7],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%)',
                  filter: 'blur(2px)',
                }}
              />
            </motion.div>

            {/* Star core with dynamic glow */}
            <motion.div
              className="relative"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div 
                className="rounded-full"
                style={{
                  width: `${star.size * 3}px`,
                  height: `${star.size * 3}px`,
                  background: 'radial-gradient(circle at 30% 30%, rgb(255, 255, 255) 0%, rgb(255, 250, 240) 30%, rgb(255, 240, 210) 60%, rgb(255, 215, 0) 100%)',
                  boxShadow: `
                    0 0 ${star.size * 1}px rgba(255, 255, 255, ${star.brightness}),
                    0 0 ${star.size * 2}px rgba(255, 255, 255, ${star.brightness * 0.8}),
                    0 0 ${star.size * 3}px rgba(255, 240, 210, ${star.brightness * 0.6}),
                    0 0 ${star.size * 4}px rgba(255, 215, 0, ${star.brightness * 0.4})
                  `,
                }}
              />
            </motion.div>

            {/* Light rays */}
            <motion.div
              className="absolute inset-0"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                opacity: 0.4,
              }}
            >
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    width: `${star.size * 16}px`,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.3) 50%, transparent 100%)',
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                  }}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Animated moon */}
      <motion.div 
        className="absolute right-10 top-10 w-32 h-32"
        animate={{
          scale: [1, 1.02, 1],
          opacity: [0.9, 1, 0.9],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="relative w-full h-full">
          <div
            className="w-full h-full rounded-full"
            style={{
              background: 'radial-gradient(circle at 30% 30%, #f8f8ff 0%, #e6e6fa 30%, #d3d3d3 70%, #a9a9a9 100%)',
              boxShadow: '0 0 20px rgba(248, 248, 255, 0.3), inset -10px -10px 20px rgba(0, 0, 0, 0.1)',
            }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
              filter: 'blur(8px)',
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};