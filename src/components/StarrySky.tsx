import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from '../types/star';

interface StarrySkyProps {
  stars: Star[];
  onStarClick: (star: Star) => void;
}

export const StarrySky: React.FC<StarrySkyProps> = ({ stars, onStarClick }) => {
  const [hoveredStar, setHoveredStar] = useState<string | null>(null);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Static night sky background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1475274047050-1d0c0975c63e?auto=format&fit=crop&q=80&w=2940")',
          filter: 'brightness(0.4)',
        }}
      />
      
      {/* Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/40" />

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
          <img 
            src="https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?auto=format&fit=crop&q=80&w=256"
            alt="Moon"
            className="w-full h-full object-cover rounded-full"
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