import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from '../types/star';

interface StarrySkyProps {
  stars: Star[];
  onStarClick: (star: Star) => void;
}

export const StarrySky: React.FC<StarrySkyProps> = ({ stars, onStarClick }) => {
  const [hoveredStar, setHoveredStar] = useState<string | null>(null);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Realistic night sky background */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-900 to-black" />
      
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

      {/* Interactive user-created stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute cursor-pointer interactive-star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            zIndex: hoveredStar === star.id ? 10 : 1,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onStarClick(star);
          }}
          onMouseEnter={() => setHoveredStar(star.id)}
          onMouseLeave={() => setHoveredStar(null)}
        >
          {/* Static star with realistic glow */}
          <div
            className="rounded-full transition-transform duration-200"
            style={{
              width: `${star.size * 4}px`,
              height: `${star.size * 4}px`,
              background: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #fff8dc 40%, #ffd700 100%)',
              boxShadow: `
                0 0 ${star.size * 2}px rgba(255, 255, 255, ${star.brightness}),
                0 0 ${star.size * 4}px rgba(255, 255, 255, ${star.brightness * 0.6}),
                0 0 ${star.size * 6}px rgba(255, 215, 0, ${star.brightness * 0.4})
              `,
              transform: hoveredStar === star.id ? 'scale(1.3)' : 'scale(1)',
            }}
          />
        </div>
      ))}

      {/* Realistic moon */}
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
    </div>
  );
};