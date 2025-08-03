// StarrySky component - renders the interactive night sky with stars, moon/sun, and cosmic effects
// Handles 360-degree sky exploration with drag/touch controls and star interactions
import React, { useState, useEffect } from 'react';
// Import Framer Motion for smooth animations
import { motion } from 'framer-motion';
// Import Star type for TypeScript type safety
import { Star } from '../types/star';

// Props interface for the StarrySky component
interface StarrySkyProps {
  // Array of user-created stars to display
  stars: Star[];
  // Callback function when a star is clicked
  onStarClick: (star: Star) => void;
  // Whether it's currently daytime (affects sun/moon display)
  isDayTime?: boolean;
}

// Main StarrySky component
export const StarrySky: React.FC<StarrySkyProps> = ({ stars, onStarClick, isDayTime = false }) => {
  // State for tracking which star is currently being hovered
  const [hoveredStar, setHoveredStar] = useState<string | null>(null);
  // State for tracking horizontal offset of the sky (for 360° exploration)
  const [skyOffset, setSkyOffset] = useState(0);
  // State for tracking if user is currently dragging the sky
  const [isDragging, setIsDragging] = useState(false);
  // State for storing drag start position and initial offset
  const [dragStart, setDragStart] = useState({ x: 0, offset: 0 });
  
  // Force night time display - ignore isDayTime prop for now
  // Force night time - ignore isDayTime prop
  const forceNightTime = true;

  // 360-degree sky circumference in pixels (large enough for smooth exploration)
  // 360-degree sky circumference (in pixels)
  const SKY_CIRCUMFERENCE = 3600; // 10x screen width for smooth 360° experience

  // Normalize sky offset to create seamless 360-degree loop
  // Normalize sky offset to create 360-degree loop
  const normalizedOffset = ((skyOffset % SKY_CIRCUMFERENCE) + SKY_CIRCUMFERENCE) % SKY_CIRCUMFERENCE;

  // Handle mouse down event to start dragging
  // Handle mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent default browser behavior
    e.preventDefault();
    // Set dragging state to true
    setIsDragging(true);
    // Store initial mouse position and current offset
    setDragStart({
      x: e.clientX,
      offset: skyOffset
    });
  };

  // Handle mouse move event during dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    // Only process if currently dragging
    // Only handle mouse move if we're dragging
    if (isDragging) {
      // Prevent default browser behavior
      e.preventDefault();
      // Calculate how far mouse has moved
      const deltaX = e.clientX - dragStart.x;
      // Update sky offset based on mouse movement
      const newOffset = dragStart.offset + deltaX;
      setSkyOffset(newOffset);
    }
  };

  // Handle mouse up event to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle touch start event for mobile devices
  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    // Prevent default touch behavior
    e.preventDefault();
    // Set dragging state
    setIsDragging(true);
    // Store initial touch position and offset
    setDragStart({
      x: e.touches[0].clientX,
      offset: skyOffset
    });
  };

  // Handle touch move event for mobile devices
  const handleTouchMove = (e: React.TouchEvent) => {
    // Only process if currently dragging
    // Only handle touch move if we're dragging
    if (isDragging) {
      // Prevent default touch behavior
      e.preventDefault();
      // Calculate touch movement distance
      const deltaX = e.touches[0].clientX - dragStart.x;
      // Update sky offset
      const newOffset = dragStart.offset + deltaX;
      setSkyOffset(newOffset);
    }
  };

  // Handle touch end event
  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Effect to add global mouse event listeners for smooth dragging
  // Add global mouse event listeners
  useEffect(() => {
    // Global mouse move handler for dragging outside component
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        // Prevent default behavior
        e.preventDefault();
        // Calculate movement and update offset
        const deltaX = e.clientX - dragStart.x;
        const newOffset = dragStart.offset + deltaX;
        setSkyOffset(newOffset);
      }
    };

    // Global mouse up handler
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    // Add listeners only when dragging
    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    // Cleanup listeners on unmount or when dragging stops
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
      {/* Main sky container with drag controls and touch handling */}
      
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-900 to-black"
      >
        {/* Dynamic sky background gradient */}
        {/* Dynamic sky background based on time */}
      </motion.div>
      
      {/* Static background stars - small twinkling stars */}
      {/* Night sky elements */}
      {/* Static background stars */}
      {Array.from({ length: 3 }).map((segment) => (
        <motion.div 
          key={`bg-segment-${segment}`}
          className="absolute inset-0"
          style={{ 
            // Move at 20% speed with proper segmentation for 360° loop
            transform: `translateX(${(normalizedOffset * 0.2) + (segment * SKY_CIRCUMFERENCE * 0.2)}px)`,
            left: `${segment * 100 - 100}%`,
            width: '100%'
          }}
        >
          {/* Generate 300 small background stars per segment */}
          {Array.from({ length: 300 }).map((_, i) => {
            // Random size and opacity for each star
            const size = Math.random() * 2 + 0.5;
            const opacity = Math.random() * 0.8 + 0.2;
            return (
              <div
                key={`bg-star-${segment}-${i}`}
                className="absolute bg-white rounded-full"
                style={{
                  // Random position within segment
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  // Size and visual effects
                  width: `${size}px`,
                  height: `${size}px`,
                  opacity: opacity,
                  // Subtle glow effect
                  boxShadow: `0 0 ${size * 2}px rgba(255, 255, 255, ${opacity * 0.5})`,
                }}
              />
            );
          })}
        </motion.div>
      ))}

      {/* Larger background stars for depth */}
      {/* Larger background stars */}
      {Array.from({ length: 3 }).map((segment) => (
        <motion.div 
          key={`large-segment-${segment}`}
          className="absolute inset-0"
          style={{ 
            // Move at 30% speed for parallax effect
            transform: `translateX(${(normalizedOffset * 0.3) + (segment * SKY_CIRCUMFERENCE * 0.3)}px)`,
            left: `${segment * 100 - 100}%`,
            width: '100%'
          }}
        >
          {/* Generate 40 larger stars per segment */}
          {Array.from({ length: 40 }).map((_, i) => {
            // Larger size range for these stars
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
                  // Stronger glow for larger stars
                  boxShadow: `0 0 ${size * 3}px rgba(255, 255, 255, ${opacity * 0.7})`,
                }}
              />
            );
          })}
        </motion.div>
      ))}

      {/* Constellation-like star clusters */}
      {/* Constellation-like star clusters */}
      {Array.from({ length: 3 }).map((segment) => (
        <motion.div 
          key={`cluster-segment-${segment}`}
          className="absolute inset-0"
          style={{ 
            // Move at 40% speed
            transform: `translateX(${(normalizedOffset * 0.4) + (segment * SKY_CIRCUMFERENCE * 0.4)}px)`,
            left: `${segment * 100 - 100}%`,
            width: '100%'
          }}
        >
          {/* Generate 15 star clusters per segment */}
          {Array.from({ length: 15 }).map((_, i) => {
            // Random cluster center position
            const clusterX = Math.random() * 80 + 10;
            const clusterY = Math.random() * 80 + 10;
            return (
              <div key={`cluster-${segment}-${i}`} className="absolute">
                {/* Generate 3-7 stars per cluster */}
                {Array.from({ length: Math.floor(Math.random() * 5) + 3 }).map((_, j) => {
                  // Random offset from cluster center
                  const offsetX = (Math.random() - 0.5) * 10;
                  const offsetY = (Math.random() - 0.5) * 10;
                  const size = Math.random() * 1.5 + 1;
                  return (
                    <div
                      key={`cluster-star-${segment}-${i}-${j}`}
                      className="absolute bg-white rounded-full"
                      style={{
                        // Position relative to cluster center
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

      {/* Nebula-like clouds for cosmic atmosphere */}
      {/* Nebula-like clouds */}
      {Array.from({ length: 3 }).map((segment) => (
        <motion.div 
          key={`nebula-segment-${segment}`}
          className="absolute inset-0"
          style={{ 
            // Move at 60% speed
            transform: `translateX(${(normalizedOffset * 0.6) + (segment * SKY_CIRCUMFERENCE * 0.6)}px)`,
            left: `${segment * 100 - 100}%`,
            width: '100%'
          }}
        >
          {/* Generate 3 nebula clouds per segment */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`nebula-${segment}-${i}`}
              className="absolute rounded-full opacity-10"
              style={{
                // Random position and size
                left: `${Math.random() * 60 + 20}%`,
                top: `${Math.random() * 60 + 20}%`,
                width: `${Math.random() * 200 + 100}px`,
                height: `${Math.random() * 200 + 100}px`,
                // Random color (blue or orange tint)
                background: `radial-gradient(circle, rgba(${Math.random() > 0.5 ? '100, 150, 255' : '255, 150, 100'}, 0.3) 0%, transparent 70%)`,
                // Blur effect for nebula appearance
                filter: 'blur(20px)',
              }}
            />
          ))}
        </motion.div>
      ))}

      {/* Milky Way band across the sky */}
      {/* Milky Way band */}
      {Array.from({ length: 3 }).map((segment) => (
        <motion.div
          key={`milky-way-${segment}`}
          className="absolute inset-0 opacity-15"
          style={{
            // Move at 10% speed (slowest for distant effect)
            transform: `translateX(${(normalizedOffset * 0.1) + (segment * SKY_CIRCUMFERENCE * 0.1)}px)`,
            left: `${segment * 100 - 100}%`,
            width: '100%',
            // Diagonal gradient to simulate Milky Way
            background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 45%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.1) 55%, transparent 70%)',
            // Rotate for diagonal appearance
            rotate: '-15deg',
          }}
        />
      ))}

      {/* Conditional rendering of Moon (night) or Sun (day) */}
      {/* Moon for all times (removed sun) */}
      {(
        Array.from({ length: 3 }).map((segment) => (
          <motion.div 
            key={`moon-${segment}`}
            className="absolute w-24 h-24"
            style={{ 
              // Move at 30% speed and position in top-right area
              transform: `translateX(${(normalizedOffset * 0.3) + (segment * SKY_CIRCUMFERENCE * 0.3)}px)`,
              right: '10%',
              top: '10%',
              left: `${segment * 100 + 80}%`,
            }}
          >
            {/* Moon segments for night time */}
            {/* Moon for night time */}
        <div className="relative w-full h-full">
          <div
            className="absolute w-full h-full rounded-full opacity-30"
            style={{
              // Radial gradient for atmospheric glow
              background: 'radial-gradient(circle, rgba(220, 220, 255, 0.4) 0%, rgba(180, 180, 220, 0.2) 40%, transparent 70%)',
              // Scale up and blur for glow effect
              transform: 'scale(1.8)',
              filter: 'blur(8px)',
            }}
          >
            {/* Moon's atmospheric glow effect */}
            {/* Moon's atmospheric glow */}
          </div>
          
          <div
            className="w-full h-full rounded-full"
            style={{
              // Complex gradient system for realistic lunar surface
              background: `
                radial-gradient(ellipse at 30% 25%, rgba(255, 255, 255, 0.9) 0%, transparent 25%),
                radial-gradient(ellipse at 65% 40%, rgba(240, 240, 240, 0.6) 0%, transparent 20%),
                radial-gradient(ellipse at 45% 70%, rgba(220, 220, 220, 0.4) 0%, transparent 15%),
                radial-gradient(ellipse at 20% 60%, rgba(200, 200, 200, 0.3) 0%, transparent 12%),
                radial-gradient(ellipse at 75% 25%, rgba(210, 210, 210, 0.3) 0%, transparent 10%),
                radial-gradient(circle at 35% 30%, #f8f8f8 0%, #e8e8e8 25%, #d0d0d0 50%, #b8b8b8 75%, #a0a0a0 100%)
              `,
              // Multiple shadow effects for 3D appearance
              boxShadow: `
                0 0 20px rgba(245, 245, 255, 0.6),
                0 0 40px rgba(220, 220, 255, 0.3),
                inset -10px -10px 20px rgba(0, 0, 0, 0.3),
                inset 5px 5px 15px rgba(255, 255, 255, 0.2)
              `,
            }}
          >
            <div className="absolute inset-0 rounded-full overflow-hidden">
              {/* Main moon body with realistic surface features */}
              {/* Main moon body */}
              {/* Lunar surface features container */}
              {/* Lunar craters and surface features */}
              {/* Large crater */}
              {/* Large crater */}
              <div
                className="absolute rounded-full opacity-40"
                style={{
                  width: '18px',
                  height: '18px',
                  left: '45%',
                  top: '35%',
                  // Radial gradient for crater depth
                  background: 'radial-gradient(circle, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 40%, transparent 70%)',
                  // Inset shadow for crater effect
                  boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.3)',
                }}
              />
              
              {/* Medium-sized craters */}
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
              
              {/* Small craters for detail */}
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
              
              {/* Mare (dark patches on lunar surface) */}
              {/* Mare (dark patches) */}
              <div
                className="absolute opacity-20"
                style={{
                  width: '20px',
                  height: '15px',
                  left: '20%',
                  top: '25%',
                  // Dark gradient for mare appearance
                  background: 'radial-gradient(ellipse, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 60%, transparent 100%)',
                  // Irregular shape for natural appearance
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
              
              {/* Bright highlands on lunar surface */}
              {/* Bright highlands */}
              <div
                className="absolute opacity-30"
                style={{
                  width: '14px',
                  height: '10px',
                  left: '60%',
                  top: '20%',
                  // Bright gradient for highland appearance
                  background: 'radial-gradient(ellipse, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.1) 60%, transparent 100%)',
                  borderRadius: '70% 30% 60% 40%',
                  transform: 'rotate(45deg)',
                }}
              />
            </div>
          </div>
          
          <div className="absolute inset-0">
            {/* Subtle light rays emanating from moon */}
            {/* Subtle light rays from moon */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`moon-ray-${i}`}
                className="absolute opacity-10"
                style={{
                  width: '1px',
                  height: '60px',
                  // Gradient ray effect
                  background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 0%, transparent 100%)',
                  left: '50%',
                  top: '50%',
                  // Position rays in 8 directions
                  transformOrigin: '0 0',
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg)`,
                }}
              />
            ))}
          </div>
        </div>
          </motion.div>
        ))
      )}

      {/* Interactive user-created stars - visible in both day and night */}
      {/* Interactive user-created stars - visible in both day and night */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute cursor-pointer interactive-star"
          style={{
            // Position star at its fixed coordinates
            left: `${star.x}%`,
            top: `${star.y}%`,
            // Center the star and apply minimal movement (5% of sky offset)
            transform: `translate(-50%, -50%) translateX(${normalizedOffset * 0.05}px)`,
            // Higher z-index when hovered
            zIndex: hoveredStar === star.id ? 10 : 1,
          }}
          onClick={(e) => {
            // Prevent event bubbling
            e.stopPropagation();
            // Only trigger click if not dragging
            if (!isDragging) {
              onStarClick(star);
            }
          }}
          // Mouse hover handlers
          onMouseEnter={() => setHoveredStar(star.id)}
          onMouseLeave={() => setHoveredStar(null)}
          // Prevent star events from interfering with sky dragging
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <div className="relative">
            {/* Multi-layered star rendering for realistic appearance */}
            {/* Shiny star shape with multiple layers */}
            {/* Outer glow effect layer */}
            {/* Outer glow effect */}
            <div
              className="absolute transition-all duration-300"
              style={{
                left: '50%',
                top: '50%',
                // Scale up when hovered
                transform: `translate(-50%, -50%) ${hoveredStar === star.id ? 'scale(1.5)' : 'scale(1)'}`,
                // Blur for glow effect
                filter: `blur(${Math.max(star.size * 2, 4)}px)`,
                opacity: star.brightness * 0.8,
              }}
            >
              {/* SVG star shape for glow */}
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

            {/* Main star body layer */}
            {/* Main star body */}
            <div
              className="absolute transition-all duration-300"
              style={{
                left: '50%',
                top: '50%',
                // Scale up when hovered
                transform: `translate(-50%, -50%) ${hoveredStar === star.id ? 'scale(1.3)' : 'scale(1)'}`,
                // Drop shadow for depth
                filter: `drop-shadow(0 0 ${Math.max(star.size * 3, 6)}px rgba(255, 215, 0, ${star.brightness * 0.9}))`,
              }}
            >
              <svg
                width={Math.max(star.size * 8, 16)}
                height={Math.max(star.size * 8, 16)}
                viewBox="0 0 24 24"
                fill="none"
              >
                {/* Gradient definition for realistic star coloring */}
                <defs>
                  <radialGradient id={`starGradient-${star.id}`} cx="0.3" cy="0.3" r="0.8">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="30%" stopColor="#ffd700" />
                    <stop offset="70%" stopColor="#ffa500" />
                    <stop offset="100%" stopColor="#ff4500" />
                  </radialGradient>
                </defs>
                {/* Star path with gradient fill and stroke */}
                <path
                  d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z"
                  fill={`url(#starGradient-${star.id})`}
                  stroke="rgba(255, 255, 255, 0.9)"
                  strokeWidth="0.5"
                />
              </svg>
            </div>

            {/* Inner bright core layer */}
            {/* Inner bright core */}
            <div
              className="absolute transition-all duration-300"
              style={{
                left: '50%',
                top: '50%',
                // Scale up when hovered
                transform: `translate(-50%, -50%) ${hoveredStar === star.id ? 'scale(1.4)' : 'scale(1)'}`,
              }}
            >
              <svg
                width={Math.max(star.size * 4, 8)}
                height={Math.max(star.size * 4, 8)}
                viewBox="0 0 24 24"
                fill="none"
              >
                {/* Bright white core */}
                <path
                  d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z"
                  fill="rgba(255, 255, 255, 0.95)"
                />
              </svg>
            <div className="absolute inset-0">
              {/* Sparkle effects around the star */}
              {/* Sparkle effects around the star */}
              {Array.from({ length: 4 }).map((_, i) => {
                // Calculate sparkle position (rotates when hovered)
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
                      // Position sparkles around star
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
                    >
                      {/* Individual sparkle with pulsing animation */}
                    </div>
                  </div>
                );
              })}
            </div>
            </div>
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
              {/* Twinkling animation overlay */}
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