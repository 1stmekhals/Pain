import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from '../types/star';

interface StarrySkyProps {
  stars: Star[];
  onStarClick: (star: Star) => void;
  isDayTime?: boolean;
}

export const StarrySky: React.FC<StarrySkyProps> = ({ stars, onStarClick, isDayTime = false }) => {
  const [hoveredStar, setHoveredStar] = useState<string | null>(null);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Dynamic sky background based on time */}
      <div className={`absolute inset-0 transition-all duration-1000 ${
        isDayTime 
          ? 'bg-gradient-to-b from-blue-400 via-blue-300 to-blue-200' 
          : 'bg-gradient-to-b from-indigo-950 via-slate-900 to-black'
      }`} />
      
      {isDayTime ? (
        <>
          {/* Day sky elements */}
          {/* Sun */}
          <div className="absolute right-20 top-20 w-32 h-32">
            <div
              className="w-full h-full rounded-full"
              style={{
                background: 'radial-gradient(circle at 30% 30%, #ffeb3b 0%, #ffc107 40%, #ff9800 100%)',
                boxShadow: '0 0 50px rgba(255, 235, 59, 0.6), 0 0 100px rgba(255, 235, 59, 0.4)',
              }}
            />
          </div>

          {/* Clouds */}
          <div className="absolute inset-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`cloud-${i}`}
                className="absolute opacity-80"
                style={{
                  left: `${Math.random() * 80 + 10}%`,
                  top: `${Math.random() * 40 + 10}%`,
                  width: `${Math.random() * 100 + 80}px`,
                  height: `${Math.random() * 40 + 30}px`,
                  background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 50%, transparent 100%)',
                  borderRadius: '50px',
                  filter: 'blur(1px)',
                }}
              />
            ))}
          </div>

          {/* Birds */}
          <div className="absolute inset-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={`bird-${i}`}
                className="absolute text-gray-700 opacity-60"
                style={{
                  left: `${Math.random() * 70 + 15}%`,
                  top: `${Math.random() * 30 + 20}%`,
                  fontSize: '12px',
                  transform: `rotate(${Math.random() * 30 - 15}deg)`,
                }}
              >
                ᵛ
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Night sky elements */}
          {/* Static background stars */}
          <div className="absolute inset-0">
            {Array.from({ length: 300 }).map((_, i) => {
              const size = Math.random() * 2 + 0.5;
              const opacity = Math.random() * 0.8 + 0.2;
              return (
                <div
                  key={`bg-star-${i}`}
                  className="absolute bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    opacity: opacity,
                    boxShadow: `0 0 ${size * 2}px rgba(255, 255, 255, ${opacity * 0.5})`,
                  }}
                />
              );
            })}
          </div>

          {/* Larger background stars */}
          <div className="absolute inset-0">
            {Array.from({ length: 50 }).map((_, i) => {
              const size = Math.random() * 3 + 2;
              const opacity = Math.random() * 0.6 + 0.4;
              return (
                <div
                  key={`large-star-${i}`}
                  className="absolute bg-white rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    opacity: opacity,
                    boxShadow: `0 0 ${size * 3}px rgba(255, 255, 255, ${opacity * 0.7})`,
                  }}
                />
              );
            })}
          </div>

          {/* Constellation-like star clusters */}
          <div className="absolute inset-0">
            {Array.from({ length: 20 }).map((_, i) => {
              const clusterX = Math.random() * 80 + 10;
              const clusterY = Math.random() * 80 + 10;
              return (
                <div key={`cluster-${i}`} className="absolute">
                  {Array.from({ length: Math.floor(Math.random() * 5) + 3 }).map((_, j) => {
                    const offsetX = (Math.random() - 0.5) * 10;
                    const offsetY = (Math.random() - 0.5) * 10;
                    const size = Math.random() * 1.5 + 1;
                    return (
                      <div
                        key={`cluster-star-${i}-${j}`}
                        className="absolute bg-white rounded-full"
                        style={{
                          left: `${clusterX + offsetX}%`,
                          top: `${clusterY + offsetY}%`,
                          width: `${size}px`,
                          height: `${size}px`,
                          opacity: 0.8,
                          boxShadow: `0 0 ${size * 2}px rgba(255, 255, 255, 0.6)`,
                        }}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Nebula-like clouds */}
          <div className="absolute inset-0">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`nebula-${i}`}
                className="absolute rounded-full opacity-10"
                style={{
                  left: `${Math.random() * 60 + 20}%`,
                  top: `${Math.random() * 60 + 20}%`,
                  width: `${Math.random() * 200 + 100}px`,
                  height: `${Math.random() * 200 + 100}px`,
                  background: `radial-gradient(circle, rgba(${Math.random() > 0.5 ? '100, 150, 255' : '255, 150, 100'}, 0.3) 0%, transparent 70%)`,
                  filter: 'blur(20px)',
                }}
              />
            ))}
          </div>

          {/* Milky Way band */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 45%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.1) 55%, transparent 70%)',
              transform: 'rotate(-15deg)',
            }}
          />

          {/* Moon for night sky */}
          <div className="absolute right-10 top-10 w-24 h-24">
            <div className="relative w-full h-full">
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: 'radial-gradient(circle at 35% 35%, #f5f5f5 0%, #e0e0e0 30%, #c0c0c0 60%, #a0a0a0 100%)',
                  boxShadow: '0 0 15px rgba(245, 245, 245, 0.4), inset -8px -8px 15px rgba(0, 0, 0, 0.2)',
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* Interactive user-created stars - visible in both day and night */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute cursor-pointer interactive-star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            zIndex: hoveredStar === star.id ? 10 : 1,
            transform: 'translate(-50%, -50%)', // Center the star on its coordinates
          }}
          onClick={(e) => {
            e.stopPropagation();
            onStarClick(star);
          }}
          onMouseEnter={() => setHoveredStar(star.id)}
          onMouseLeave={() => setHoveredStar(null)}
        >
          {/* Realistic star with multiple layers */}
          <div className="relative">
            {/* Main star body */}
            <div
              className="absolute rounded-full transition-all duration-300"
              style={{
                width: `${Math.max(star.size * 8, 14)}px`,
                height: `${Math.max(star.size * 8, 14)}px`,
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) ${hoveredStar === star.id ? 'scale(1.4)' : 'scale(1)'}`,
                background: isDayTime 
                  ? `radial-gradient(circle at 35% 35%, 
                      rgba(135, 206, 250, ${star.brightness * 0.9}) 0%, 
                      rgba(70, 130, 180, ${star.brightness * 0.8}) 30%, 
                      rgba(25, 25, 112, ${star.brightness * 0.6}) 70%, 
                      rgba(0, 0, 139, ${star.brightness * 0.4}) 100%)`
                  : `radial-gradient(circle at 35% 35%, 
                      rgba(255, 255, 255, ${star.brightness}) 0%, 
                      rgba(255, 248, 220, ${star.brightness * 0.9}) 25%, 
                      rgba(255, 215, 0, ${star.brightness * 0.8}) 50%, 
                      rgba(255, 140, 0, ${star.brightness * 0.6}) 75%, 
                      rgba(255, 69, 0, ${star.brightness * 0.3}) 100%)`,
                boxShadow: isDayTime 
                  ? `
                    0 0 ${Math.max(star.size * 4, 8)}px rgba(135, 206, 250, ${star.brightness * 0.8}),
                    0 0 ${Math.max(star.size * 8, 16)}px rgba(70, 130, 180, ${star.brightness * 0.5}),
                    0 0 ${Math.max(star.size * 12, 24)}px rgba(25, 25, 112, ${star.brightness * 0.3})
                  `
                  : `
                    0 0 ${Math.max(star.size * 4, 8)}px rgba(255, 255, 255, ${star.brightness * 0.9}),
                    0 0 ${Math.max(star.size * 8, 16)}px rgba(255, 215, 0, ${star.brightness * 0.7}),
                    0 0 ${Math.max(star.size * 12, 24)}px rgba(255, 140, 0, ${star.brightness * 0.5}),
                    0 0 ${Math.max(star.size * 16, 32)}px rgba(255, 69, 0, ${star.brightness * 0.3})
                  `,
              }}
            />
            
            {/* Star spikes/rays */}
            {!isDayTime && (
              <>
                {/* Vertical ray */}
                <div
                  className="absolute bg-white opacity-60 transition-all duration-300"
                  style={{
                    width: '1px',
                    height: `${Math.max(star.size * 16, 32)}px`,
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) ${hoveredStar === star.id ? 'scale(1.2)' : 'scale(1)'}`,
                    boxShadow: `0 0 ${Math.max(star.size * 2, 4)}px rgba(255, 255, 255, ${star.brightness * 0.8})`,
                  }}
                />
                {/* Horizontal ray */}
                <div
                  className="absolute bg-white opacity-60 transition-all duration-300"
                  style={{
                    width: `${Math.max(star.size * 16, 32)}px`,
                    height: '1px',
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) ${hoveredStar === star.id ? 'scale(1.2)' : 'scale(1)'}`,
                    boxShadow: `0 0 ${Math.max(star.size * 2, 4)}px rgba(255, 255, 255, ${star.brightness * 0.8})`,
                  }}
                />
                {/* Diagonal rays */}
                <div
                  className="absolute bg-white opacity-40 transition-all duration-300"
                  style={{
                    width: '1px',
                    height: `${Math.max(star.size * 12, 24)}px`,
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) rotate(45deg) ${hoveredStar === star.id ? 'scale(1.2)' : 'scale(1)'}`,
                    boxShadow: `0 0 ${Math.max(star.size * 1.5, 3)}px rgba(255, 255, 255, ${star.brightness * 0.6})`,
                  }}
                />
                <div
                  className="absolute bg-white opacity-40 transition-all duration-300"
                  style={{
                    width: '1px',
                    height: `${Math.max(star.size * 12, 24)}px`,
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) rotate(-45deg) ${hoveredStar === star.id ? 'scale(1.2)' : 'scale(1)'}`,
                    boxShadow: `0 0 ${Math.max(star.size * 1.5, 3)}px rgba(255, 255, 255, ${star.brightness * 0.6})`,
                  }}
                />
              </>
            )}
            
            {/* Core highlight */}
            <div
              className="absolute rounded-full transition-all duration-300"
              style={{
                width: `${Math.max(star.size * 3, 6)}px`,
                height: `${Math.max(star.size * 3, 6)}px`,
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) translate(-20%, -20%) ${hoveredStar === star.id ? 'scale(1.5)' : 'scale(1)'}`,
                background: isDayTime 
                  ? 'rgba(255, 255, 255, 0.9)'
                  : 'rgba(255, 255, 255, 0.95)',
                boxShadow: `0 0 ${Math.max(star.size * 2, 4)}px rgba(255, 255, 255, 0.8)`,
              }}
            />
            
            {/* Subtle twinkle animation */}
            <div
              className="absolute rounded-full animate-pulse"
              style={{
                width: `${Math.max(star.size * 6, 12)}px`,
                height: `${Math.max(star.size * 6, 12)}px`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                background: isDayTime 
                  ? 'rgba(135, 206, 250, 0.3)'
                  : 'rgba(255, 255, 255, 0.2)',
                animationDuration: `${2 + Math.random() * 3}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};