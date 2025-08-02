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
  const [skyOffset, setSkyOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, offset: 0 });
  
  // Force night time - ignore isDayTime prop
  const forceNightTime = true;

  // 360-degree sky circumference (in pixels)
  const SKY_CIRCUMFERENCE = 3600; // 10x screen width for smooth 360° experience

  // Normalize sky offset to create 360-degree loop
  const normalizedOffset = ((skyOffset % SKY_CIRCUMFERENCE) + SKY_CIRCUMFERENCE) % SKY_CIRCUMFERENCE;

  // Handle mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      offset: skyOffset
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // Only handle mouse move if we're dragging
    if (isDragging) {
      e.preventDefault();
      const deltaX = e.clientX - dragStart.x;
      const newOffset = dragStart.offset + deltaX;
      setSkyOffset(newOffset);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX,
      offset: skyOffset
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Only handle touch move if we're dragging
    if (isDragging) {
      e.preventDefault();
      const deltaX = e.touches[0].clientX - dragStart.x;
      const newOffset = dragStart.offset + deltaX;
      setSkyOffset(newOffset);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Add global mouse event listeners
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        const deltaX = e.clientX - dragStart.x;
        const newOffset = dragStart.offset + deltaX;
        setSkyOffset(newOffset);
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragStart]);

  return (
    <div 
      className="absolute inset-0 overflow-hidden select-none touch-none"
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Dynamic sky background based on time */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-900 to-black"
      />
      
      {/* Night sky elements */}
      {/* Static background stars */}
      {Array.from({ length: 3 }).map((segment) => (
        <motion.div 
          key={`bg-segment-${segment}`}
          className="absolute inset-0"
          style={{ 
            transform: `translateX(${(normalizedOffset * 0.2) + (segment * SKY_CIRCUMFERENCE * 0.2)}px)`,
            left: `${segment * 100 - 100}%`,
            width: '100%'
          }}
        >
          {Array.from({ length: 300 }).map((_, i) => {
            const size = Math.random() * 2 + 0.5;
            const opacity = Math.random() * 0.8 + 0.2;
            return (
              <div
                key={`bg-star-${segment}-${i}`}
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
        </motion.div>
      ))}

      {/* Larger background stars */}
      {Array.from({ length: 3 }).map((segment) => (
        <motion.div 
          key={`large-segment-${segment}`}
          className="absolute inset-0"
          style={{ 
            transform: `translateX(${(normalizedOffset * 0.3) + (segment * SKY_CIRCUMFERENCE * 0.3)}px)`,
            left: `${segment * 100 - 100}%`,
            width: '100%'
          }}
        >
          {Array.from({ length: 40 }).map((_, i) => {
            const size = Math.random() * 3 + 2;
            const opacity = Math.random() * 0.6 + 0.4;
            return (
              <div
                key={`large-star-${segment}-${i}`}
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
        </motion.div>
      ))}

      {/* Constellation-like star clusters */}
      {Array.from({ length: 3 }).map((segment) => (
        <motion.div 
          key={`cluster-segment-${segment}`}
          className="absolute inset-0"
          style={{ 
            transform: `translateX(${(normalizedOffset * 0.4) + (segment * SKY_CIRCUMFERENCE * 0.4)}px)`,
            left: `${segment * 100 - 100}%`,
            width: '100%'
          }}
        >
          {Array.from({ length: 15 }).map((_, i) => {
            const clusterX = Math.random() * 80 + 10;
            const clusterY = Math.random() * 80 + 10;
            return (
              <div key={`cluster-${segment}-${i}`} className="absolute">
                {Array.from({ length: Math.floor(Math.random() * 5) + 3 }).map((_, j) => {
                  const offsetX = (Math.random() - 0.5) * 10;
                  const offsetY = (Math.random() - 0.5) * 10;
                  const size = Math.random() * 1.5 + 1;
                  return (
                    <div
                      key={`cluster-star-${segment}-${i}-${j}`}
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
        </motion.div>
      ))}

      {/* Nebula-like clouds */}
      {Array.from({ length: 3 }).map((segment) => (
        <motion.div 
          key={`nebula-segment-${segment}`}
          className="absolute inset-0"
          style={{ 
            transform: `translateX(${(normalizedOffset * 0.6) + (segment * SKY_CIRCUMFERENCE * 0.6)}px)`,
            left: `${segment * 100 - 100}%`,
            width: '100%'
          }}
        >
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`nebula-${segment}-${i}`}
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
        </motion.div>
      ))}

      {/* Milky Way band */}
      {Array.from({ length: 3 }).map((segment) => (
        <motion.div
          key={`milky-way-${segment}`}
          className="absolute inset-0 opacity-15"
          style={{
            transform: `translateX(${(normalizedOffset * 0.1) + (segment * SKY_CIRCUMFERENCE * 0.1)}px)`,
            left: `${segment * 100 - 100}%`,
            width: '100%',
            background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 45%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.1) 55%, transparent 70%)',
            rotate: '-15deg',
          }}
        />
      ))}

      {/* Moon for night sky */}
      {!isDayTime ? (
        // Moon for night time
        Array.from({ length: 3 }).map((segment) => (
          <motion.div 
            key={`moon-${segment}`}
            className="absolute w-24 h-24"
            style={{ 
              transform: `translateX(${(normalizedOffset * 0.3) + (segment * SKY_CIRCUMFERENCE * 0.3)}px)`,
              right: '10%',
              top: '10%',
              left: `${segment * 100 + 80}%`,
            }}
          >
        <div className="relative w-full h-full">
          {/* Moon's atmospheric glow */}
          <div
            className="absolute w-full h-full rounded-full opacity-30"
            style={{
              background: 'radial-gradient(circle, rgba(220, 220, 255, 0.4) 0%, rgba(180, 180, 220, 0.2) 40%, transparent 70%)',
              transform: 'scale(1.8)',
              filter: 'blur(8px)',
            }}
          />
          
          {/* Main moon body */}
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `
                radial-gradient(ellipse at 30% 25%, rgba(255, 255, 255, 0.9) 0%, transparent 25%),
                radial-gradient(ellipse at 65% 40%, rgba(240, 240, 240, 0.6) 0%, transparent 20%),
                radial-gradient(ellipse at 45% 70%, rgba(220, 220, 220, 0.4) 0%, transparent 15%),
                radial-gradient(ellipse at 20% 60%, rgba(200, 200, 200, 0.3) 0%, transparent 12%),
                radial-gradient(ellipse at 75% 25%, rgba(210, 210, 210, 0.3) 0%, transparent 10%),
                radial-gradient(circle at 35% 30%, #f8f8f8 0%, #e8e8e8 25%, #d0d0d0 50%, #b8b8b8 75%, #a0a0a0 100%)
              `,
              boxShadow: `
                0 0 20px rgba(245, 245, 255, 0.6),
                0 0 40px rgba(220, 220, 255, 0.3),
                inset -10px -10px 20px rgba(0, 0, 0, 0.3),
                inset 5px 5px 15px rgba(255, 255, 255, 0.2)
              `,
            }}
          >
            {/* Lunar craters and surface features */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              {/* Large crater */}
              <div
                className="absolute rounded-full opacity-40"
                style={{
                  width: '18px',
                  height: '18px',
                  left: '45%',
                  top: '35%',
                  background: 'radial-gradient(circle, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 40%, transparent 70%)',
                  boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.3)',
                }}
              />
              
              {/* Medium craters */}
              <div
                className="absolute rounded-full opacity-30"
                style={{
                  width: '12px',
                  height: '12px',
                  left: '25%',
                  top: '50%',
                  background: 'radial-gradient(circle, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 50%, transparent 80%)',
                  boxShadow: 'inset 1px 1px 3px rgba(0, 0, 0, 0.2)',
                }}
              />
              
              <div
                className="absolute rounded-full opacity-25"
                style={{
                  width: '8px',
                  height: '8px',
                  left: '65%',
                  top: '60%',
                  background: 'radial-gradient(circle, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 50%, transparent 80%)',
                  boxShadow: 'inset 1px 1px 2px rgba(0, 0, 0, 0.2)',
                }}
              />
              
              {/* Small craters */}
              <div
                className="absolute rounded-full opacity-20"
                style={{
                  width: '6px',
                  height: '6px',
                  left: '35%',
                  top: '65%',
                  background: 'radial-gradient(circle, rgba(0, 0, 0, 0.2) 0%, transparent 70%)',
                  boxShadow: 'inset 1px 1px 1px rgba(0, 0, 0, 0.1)',
                }}
              />
              
              <div
                className="absolute rounded-full opacity-15"
                style={{
                  width: '4px',
                  height: '4px',
                  left: '55%',
                  top: '25%',
                  background: 'radial-gradient(circle, rgba(0, 0, 0, 0.2) 0%, transparent 70%)',
                }}
              />
              
              {/* Mare (dark patches) */}
              <div
                className="absolute opacity-20"
                style={{
                  width: '20px',
                  height: '15px',
                  left: '20%',
                  top: '25%',
                  background: 'radial-gradient(ellipse, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 60%, transparent 100%)',
                  borderRadius: '60% 40% 70% 30%',
                  transform: 'rotate(-15deg)',
                }}
              />
              
              <div
                className="absolute opacity-15"
                style={{
                  width: '16px',
                  height: '12px',
                  left: '50%',
                  top: '45%',
                  background: 'radial-gradient(ellipse, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.1) 70%, transparent 100%)',
                  borderRadius: '50% 60% 40% 70%',
                  transform: 'rotate(25deg)',
                }}
              />
              
              {/* Bright highlands */}
              <div
                className="absolute opacity-30"
                style={{
                  width: '14px',
                  height: '10px',
                  left: '60%',
                  top: '20%',
                  background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 60%, transparent 100%)',
                  borderRadius: '70% 30% 60% 40%',
                  transform: 'rotate(45deg)',
                }}
              />
            </div>
          </div>
          
          {/* Subtle light rays from moon */}
          <div className="absolute inset-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`moon-ray-${i}`}
                className="absolute opacity-10"
                style={{
                  width: '1px',
                  height: '60px',
                  background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 0%, transparent 100%)',
                  left: '50%',
                  top: '50%',
                  transformOrigin: '0 0',
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                }}
              />
            ))}
          </div>
        </div>
          </motion.div>
        ))
      ) : (
        // Sun for day time
        Array.from({ length: 3 }).map((segment) => (
          <motion.div 
            key={`sun-${segment}`}
            className="absolute w-24 h-24"
            style={{ 
              transform: `translateX(${(normalizedOffset * 0.3) + (segment * SKY_CIRCUMFERENCE * 0.3)}px)`,
              right: '10%',
              top: '10%',
              left: `${segment * 100 + 80}%`,
            }}
          >
          <div className="relative w-full h-full">
            {/* Sun's atmospheric glow */}
            <div
              className="absolute w-full h-full rounded-full opacity-40"
              style={{
                background: 'radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, rgba(255, 165, 0, 0.4) 40%, rgba(255, 69, 0, 0.2) 70%, transparent 100%)',
                transform: 'scale(2.5)',
                filter: 'blur(15px)',
              }}
            />
            
            {/* Main sun body */}
            <div
              className="w-full h-full rounded-full"
              style={{
                background: `
                  radial-gradient(ellipse at 30% 25%, rgba(255, 255, 255, 1) 0%, transparent 30%),
                  radial-gradient(ellipse at 65% 40%, rgba(255, 255, 200, 0.8) 0%, transparent 25%),
                  radial-gradient(ellipse at 45% 70%, rgba(255, 215, 0, 0.6) 0%, transparent 20%),
                  radial-gradient(circle at 50% 50%, #FFD700 0%, #FFA500 30%, #FF8C00 60%, #FF4500 100%)
                `,
                boxShadow: `
                  0 0 30px rgba(255, 215, 0, 0.8),
                  0 0 60px rgba(255, 165, 0, 0.6),
                  0 0 90px rgba(255, 69, 0, 0.4),
                  inset 5px 5px 20px rgba(255, 255, 255, 0.3),
                  inset -5px -5px 15px rgba(255, 140, 0, 0.2)
                `,
              }}
            >
              {/* Solar flares and surface features */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                {/* Solar prominences */}
                <div
                  className="absolute opacity-60"
                  style={{
                    width: '8px',
                    height: '20px',
                    left: '20%',
                    top: '10%',
                    background: 'radial-gradient(ellipse, rgba(255, 100, 0, 0.8) 0%, rgba(255, 200, 0, 0.4) 50%, transparent 100%)',
                    borderRadius: '50% 50% 80% 20%',
                    transform: 'rotate(-20deg)',
                  }}
                />
                
                <div
                  className="absolute opacity-50"
                  style={{
                    width: '6px',
                    height: '15px',
                    left: '75%',
                    top: '30%',
                    background: 'radial-gradient(ellipse, rgba(255, 150, 0, 0.7) 0%, rgba(255, 220, 0, 0.3) 60%, transparent 100%)',
                    borderRadius: '60% 40% 70% 30%',
                    transform: 'rotate(45deg)',
                  }}
                />
                
                {/* Sunspots */}
                <div
                  className="absolute opacity-30"
                  style={{
                    width: '8px',
                    height: '6px',
                    left: '45%',
                    top: '40%',
                    background: 'radial-gradient(ellipse, rgba(139, 69, 19, 0.6) 0%, rgba(160, 82, 45, 0.3) 70%, transparent 100%)',
                    borderRadius: '60%',
                  }}
                />
                
                <div
                  className="absolute opacity-25"
                  style={{
                    width: '5px',
                    height: '4px',
                    left: '65%',
                    top: '60%',
                    background: 'radial-gradient(ellipse, rgba(139, 69, 19, 0.5) 0%, transparent 80%)',
                    borderRadius: '50%',
                  }}
                />
                
                {/* Bright solar regions */}
                <div
                  className="absolute opacity-40"
                  style={{
                    width: '16px',
                    height: '12px',
                    left: '30%',
                    top: '50%',
                    background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 200, 0.3) 60%, transparent 100%)',
                    borderRadius: '70% 30% 60% 40%',
                    transform: 'rotate(-30deg)',
                  }}
                />
              </div>
            </div>
            
            {/* Sun rays */}
            <div className="absolute inset-0">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={`sun-ray-${i}`}
                  className="absolute opacity-20"
                  style={{
                    width: '2px',
                    height: '80px',
                    background: 'linear-gradient(to bottom, rgba(255, 215, 0, 0.6) 0%, rgba(255, 165, 0, 0.4) 50%, transparent 100%)',
                    left: '50%',
                    top: '50%',
                    transformOrigin: '0 0',
                    transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
                  }}
                />
              ))}
            </div>
            
            {/* Animated sun rays */}
            <div className="absolute inset-0">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={`animated-ray-${i}`}
                  className="absolute opacity-15 animate-pulse"
                  style={{
                    width: '1px',
                    height: '100px',
                    background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.8) 0%, rgba(255, 215, 0, 0.4) 30%, transparent 100%)',
                    left: '50%',
                    top: '50%',
                    transformOrigin: '0 0',
                    transform: `translate(-50%, -50%) rotate(${i * 45 + 22.5}deg)`,
                    animationDuration: `${2 + i * 0.3}s`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
          </div>
          </motion.div>
        ))
      )}

      {/* Interactive user-created stars - visible in both day and night */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute cursor-pointer interactive-star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            transform: `translate(-50%, -50%) translateX(${normalizedOffset * 0.05}px)`,
            zIndex: hoveredStar === star.id ? 10 : 1,
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (!isDragging) {
              onStarClick(star);
            }
          }}
          onMouseEnter={() => setHoveredStar(star.id)}
          onMouseLeave={() => setHoveredStar(null)}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {/* Shiny star shape with multiple layers */}
          <div className="relative">
            {/* Outer glow effect */}
            <div
              className="absolute transition-all duration-300"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) ${hoveredStar === star.id ? 'scale(1.5)' : 'scale(1)'}`,
                filter: `blur(${Math.max(star.size * 2, 4)}px)`,
                opacity: star.brightness * 0.8,
              }}
            >
              <svg
                width={Math.max(star.size * 12, 24)}
                height={Math.max(star.size * 12, 24)}
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z"
                  fill={`rgba(255, 215, 0, ${star.brightness})`}
                />
              </svg>
            </div>

            {/* Main star body */}
            <div
              className="absolute transition-all duration-300"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) ${hoveredStar === star.id ? 'scale(1.3)' : 'scale(1)'}`,
                filter: `drop-shadow(0 0 ${Math.max(star.size * 3, 6)}px rgba(255, 215, 0, ${star.brightness * 0.9}))`,
              }}
            >
              <svg
                width={Math.max(star.size * 8, 16)}
                height={Math.max(star.size * 8, 16)}
                viewBox="0 0 24 24"
                fill="none"
              >
                <defs>
                  <radialGradient id={`starGradient-${star.id}`} cx="0.3" cy="0.3" r="0.8">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="30%" stopColor="#ffd700" />
                    <stop offset="70%" stopColor="#ffa500" />
                    <stop offset="100%" stopColor="#ff4500" />
                  </radialGradient>
                </defs>
                <path
                  d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z"
                  fill={`url(#starGradient-${star.id})`}
                  stroke="rgba(255, 255, 255, 0.9)"
                  strokeWidth="0.5"
                />
              </svg>
            </div>

            {/* Inner bright core */}
            <div
              className="absolute transition-all duration-300"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) ${hoveredStar === star.id ? 'scale(1.4)' : 'scale(1)'}`,
              }}
            >
              <svg
                width={Math.max(star.size * 4, 8)}
                height={Math.max(star.size * 4, 8)}
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z"
                  fill="rgba(255, 255, 255, 0.95)"
                />
              </svg>
            {/* Sparkle effects around the star */}
            <div className="absolute inset-0">
              {Array.from({ length: 4 }).map((_, i) => {
                const angle = (i * 90) + (hoveredStar === star.id ? 45 : 0);
                const distance = Math.max(star.size * 6, 12);
                const sparkleSize = Math.max(star.size * 1.5, 3);
                return (
                  <div
                    key={`sparkle-${i}`}
                    className="absolute transition-all duration-300"
                    style={{
                      left: '50%',
                      top: '50%',
                      transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${distance}px)`,
                      opacity: star.brightness * 0.7,
                    }}
                  >
                    <div
                      className="animate-pulse"
                      style={{
                        width: `${sparkleSize}px`,
                        height: `${sparkleSize}px`,
                        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, transparent 70%)',
                        borderRadius: '50%',
                        animationDuration: `${1.5 + Math.random() * 2}s`,
                        animationDelay: `${i * 0.3}s`,
                      }}
                    />
                  </div>
                );
              })}
            </div>
            </div>
            {/* Twinkling animation overlay */}
            <div
              className="absolute animate-pulse"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: star.brightness * 0.6,
                animationDuration: `${2 + Math.random() * 3}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              <svg
                width={Math.max(star.size * 10, 20)}
                height={Math.max(star.size * 10, 20)}
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z"
                  fill="rgba(255, 255, 255, 0.4)"
                />
              </svg>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};