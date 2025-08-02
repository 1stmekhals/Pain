// StarrySky component - renders the interactive night sky with stars, celestial bodies, and cosmic effects
// Handles star positioning, sky scrolling, day/night cycle, and user interactions
import React, { useState, useEffect } from 'react';
// Import React hooks for state management and side effects
import { motion } from 'framer-motion';
// Import Framer Motion for smooth animations
import { Star } from '../types/star';
// Import TypeScript type definition for Star objects

// Props interface defining what data this component expects
interface StarrySkyProps {
  stars: Star[]; // Array of user-created stars to display
  onStarClick: (star: Star) => void; // Callback function when a star is clicked
  isDayTime?: boolean; // Optional boolean to determine if it's day or night
}

// Main StarrySky component that renders the interactive sky
export const StarrySky: React.FC<StarrySkyProps> = ({ stars, onStarClick, isDayTime = false }) => {
  // State for tracking which star is currently being hovered
  const [hoveredStar, setHoveredStar] = useState<string | null>(null);
  // State for tracking the horizontal offset of the sky (for scrolling)
  const [skyOffset, setSkyOffset] = useState(0);
  // State for tracking if the user is currently dragging the sky
  const [isDragging, setIsDragging] = useState(false);
  // State for storing the initial drag position and offset
  const [dragStart, setDragStart] = useState({ x: 0, offset: 0 });
  
  // Force night time - ignore isDayTime prop for now (always show stars)
  const forceNightTime = true;

  // 360-degree sky circumference (in pixels) - defines the total width of the scrollable sky
  const SKY_CIRCUMFERENCE = 3600; // 10x screen width for smooth 360° experience

  // Normalize sky offset to create 360-degree loop (ensures seamless wrapping)
  const normalizedOffset = ((skyOffset % SKY_CIRCUMFERENCE) + SKY_CIRCUMFERENCE) % SKY_CIRCUMFERENCE;

  // Handle mouse down event - start dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default browser behavior
    setIsDragging(true); // Set dragging state to true
    setDragStart({
      x: e.clientX, // Store initial mouse X position
      offset: skyOffset // Store current sky offset
    });
  };

  // Handle mouse move event - update sky position while dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    // Only handle mouse move if we're dragging
    if (isDragging) {
      e.preventDefault(); // Prevent default browser behavior
      const deltaX = e.clientX - dragStart.x; // Calculate horizontal movement
      const newOffset = dragStart.offset + deltaX; // Calculate new sky offset
      setSkyOffset(newOffset); // Update sky offset
    }
  };

  // Handle mouse up event - stop dragging
  const handleMouseUp = () => {
    setIsDragging(false); // Set dragging state to false
  };

  // Handle touch start event - start dragging on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent default touch behavior
    setIsDragging(true); // Set dragging state to true
    setDragStart({
      x: e.touches[0].clientX, // Store initial touch X position
      offset: skyOffset // Store current sky offset
    });
  };

  // Handle touch move event - update sky position while dragging on mobile
  const handleTouchMove = (e: React.TouchEvent) => {
    // Only handle touch move if we're dragging
    if (isDragging) {
      e.preventDefault(); // Prevent default touch behavior
      const deltaX = e.touches[0].clientX - dragStart.x; // Calculate horizontal movement
      const newOffset = dragStart.offset + deltaX; // Calculate new sky offset
      setSkyOffset(newOffset); // Update sky offset
    }
  };

  // Handle touch end event - stop dragging on mobile
  const handleTouchEnd = () => {
    setIsDragging(false); // Set dragging state to false
  };

  // Add global mouse event listeners for smooth dragging experience
  useEffect(() => {
    // Global mouse move handler for when dragging extends outside component
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault(); // Prevent default browser behavior
        const deltaX = e.clientX - dragStart.x; // Calculate horizontal movement
        const newOffset = dragStart.offset + deltaX; // Calculate new sky offset
        setSkyOffset(newOffset); // Update sky offset
      }
    };

    // Global mouse up handler to stop dragging anywhere on the page
    const handleGlobalMouseUp = () => {
      setIsDragging(false); // Set dragging state to false
    };

    // Add event listeners only when dragging
    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    // Cleanup event listeners when component unmounts or dragging stops
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragStart]); // Dependencies: run when dragging state or drag start changes

  return (
    // Main container for the sky - full screen with overflow hidden
    <div 
      className="absolute inset-0 overflow-hidden select-none touch-none"
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }} // Change cursor based on drag state
      onMouseDown={handleMouseDown} // Handle mouse down for desktop
      onMouseUp={handleMouseUp} // Handle mouse up for desktop
      onTouchStart={handleTouchStart} // Handle touch start for mobile
      onTouchEnd={handleTouchEnd} // Handle touch end for mobile
    >
      {/* Dynamic sky background based on time - always dark for now */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-900 to-black"
      />
      
      {/* Night sky elements - multiple layers for depth and realism */}
      
      {/* Static background stars - small twinkling stars */}
      {Array.from({ length: 3 }).map((_, segment) => (
        <motion.div 
          key={`bg-segment-${segment}`} // Unique key for each segment
          className="absolute inset-0"
          style={{ 
            // Transform based on normalized offset with parallax effect (20% speed)
            transform: `translateX(${(normalizedOffset * 0.2) + (segment * SKY_CIRCUMFERENCE * 0.2)}px)`,
            left: `${segment * 100 - 100}%`, // Position segments for seamless looping
            width: '100%'
          }}
        >
          {/* Generate 300 small background stars per segment */}
          {Array.from({ length: 300 }).map((_, i) => {
            const size = Math.random() * 2 + 0.5; // Random size between 0.5 and 2.5
            const opacity = Math.random() * 0.8 + 0.2; // Random opacity between 0.2 and 1
            return (
              <div
                key={`bg-star-${segment}-${i}`} // Unique key for each star
                className="absolute bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`, // Random horizontal position
                  top: `${Math.random() * 100}%`, // Random vertical position
                  width: `${size}px`, // Set width based on random size
                  height: `${size}px`, // Set height based on random size
                  opacity: opacity, // Set opacity based on random value
                  boxShadow: `0 0 ${size * 2}px rgba(255, 255, 255, ${opacity * 0.5})`, // Glow effect
                }}
              />
            );
          })}
        </motion.div>
      ))}

      {/* Larger background stars - more prominent stars */}
      {Array.from({ length: 3 }).map((_, segment) => (
        <motion.div 
          key={`large-segment-${segment}`} // Unique key for each segment
          className="absolute inset-0"
          style={{ 
            // Transform with different parallax speed (30%)
            transform: `translateX(${(normalizedOffset * 0.3) + (segment * SKY_CIRCUMFERENCE * 0.3)}px)`,
            left: `${segment * 100 - 100}%`, // Position segments for seamless looping
            width: '100%'
          }}
        >
          {/* Generate 40 larger stars per segment */}
          {Array.from({ length: 40 }).map((_, i) => {
            const size = Math.random() * 3 + 2; // Random size between 2 and 5
            const opacity = Math.random() * 0.6 + 0.4; // Random opacity between 0.4 and 1
            return (
              <div
                key={`large-star-${segment}-${i}`} // Unique key for each star
                className="absolute bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`, // Random horizontal position
                  top: `${Math.random() * 100}%`, // Random vertical position
                  width: `${size}px`, // Set width based on random size
                  height: `${size}px`, // Set height based on random size
                  opacity: opacity, // Set opacity based on random value
                  boxShadow: `0 0 ${size * 3}px rgba(255, 255, 255, ${opacity * 0.7})`, // Stronger glow effect
                }}
              />
            );
          })}
        </motion.div>
      ))}

      {/* Constellation-like star clusters - grouped stars */}
      {Array.from({ length: 3 }).map((_, segment) => (
        <motion.div 
          key={`cluster-segment-${segment}`} // Unique key for each segment
          className="absolute inset-0"
          style={{ 
            // Transform with different parallax speed (40%)
            transform: `translateX(${(normalizedOffset * 0.4) + (segment * SKY_CIRCUMFERENCE * 0.4)}px)`,
            left: `${segment * 100 - 100}%`, // Position segments for seamless looping
            width: '100%'
          }}
        >
          {/* Generate 15 star clusters per segment */}
          {Array.from({ length: 15 }).map((_, i) => {
            const clusterX = Math.random() * 80 + 10; // Random cluster center X (10% to 90%)
            const clusterY = Math.random() * 80 + 10; // Random cluster center Y (10% to 90%)
            return (
              <div key={`cluster-${segment}-${i}`} className="absolute">
                {/* Generate 3-7 stars per cluster */}
                {Array.from({ length: Math.floor(Math.random() * 5) + 3 }).map((_, j) => {
                  const offsetX = (Math.random() - 0.5) * 10; // Random offset from cluster center (-5% to +5%)
                  const offsetY = (Math.random() - 0.5) * 10; // Random offset from cluster center (-5% to +5%)
                  const size = Math.random() * 1.5 + 1; // Random size between 1 and 2.5
                  return (
                    <div
                      key={`cluster-star-${segment}-${i}-${j}`} // Unique key for each cluster star
                      className="absolute bg-white rounded-full"
                      style={{
                        left: `${clusterX + offsetX}%`, // Position relative to cluster center
                        top: `${clusterY + offsetY}%`, // Position relative to cluster center
                        width: `${size}px`, // Set width based on random size
                        height: `${size}px`, // Set height based on random size
                        opacity: 0.8, // Fixed opacity for cluster stars
                        boxShadow: `0 0 ${size * 2}px rgba(255, 255, 255, 0.6)`, // Glow effect
                      }}
                    />
                  );
                })}
              </div>
            );
          })}
        </motion.div>
      ))}

      {/* Nebula-like clouds - colorful cosmic clouds */}
      {Array.from({ length: 3 }).map((_, segment) => (
        <motion.div 
          key={`nebula-segment-${segment}`} // Unique key for each segment
          className="absolute inset-0"
          style={{ 
            // Transform with different parallax speed (60%)
            transform: `translateX(${(normalizedOffset * 0.6) + (segment * SKY_CIRCUMFERENCE * 0.6)}px)`,
            left: `${segment * 100 - 100}%`, // Position segments for seamless looping
            width: '100%'
          }}
        >
          {/* Generate 3 nebula clouds per segment */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`nebula-${segment}-${i}`} // Unique key for each nebula
              className="absolute rounded-full opacity-10"
              style={{
                left: `${Math.random() * 60 + 20}%`, // Random position (20% to 80%)
                top: `${Math.random() * 60 + 20}%`, // Random position (20% to 80%)
                width: `${Math.random() * 200 + 100}px`, // Random width (100px to 300px)
                height: `${Math.random() * 200 + 100}px`, // Random height (100px to 300px)
                // Random color gradient (blue or orange)
                background: `radial-gradient(circle, rgba(${Math.random() > 0.5 ? '100, 150, 255' : '255, 150, 100'}, 0.3) 0%, transparent 70%)`,
                filter: 'blur(20px)', // Blur effect for cloud-like appearance
              }}
            />
          ))}
        </motion.div>
      ))}

      {/* Milky Way band - diagonal band across the sky */}
      {Array.from({ length: 3 }).map((_, segment) => (
        <motion.div
          key={`milky-way-${segment}`} // Unique key for each segment
          className="absolute inset-0 opacity-15"
          style={{
            // Transform with slow parallax speed (10%)
            transform: `translateX(${(normalizedOffset * 0.1) + (segment * SKY_CIRCUMFERENCE * 0.1)}px)`,
            left: `${segment * 100 - 100}%`, // Position segments for seamless looping
            width: '100%',
            // Diagonal gradient to simulate Milky Way
            background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 45%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.1) 55%, transparent 70%)',
            rotate: '-15deg', // Rotate the band diagonally
          }}
        />
      ))}

      {/* Celestial bodies - Moon for night time, Sun for day time */}
      {!isDayTime ? (
        // Moon for night time - detailed lunar surface
        Array.from({ length: 3 }).map((_, segment) => (
          <motion.div 
            key={`moon-${segment}`} // Unique key for each moon segment
            className="absolute w-24 h-24"
            style={{ 
              // Transform with parallax speed (30%)
              transform: `translateX(${(normalizedOffset * 0.3) + (segment * SKY_CIRCUMFERENCE * 0.3)}px)`,
              right: '10%', // Position from right edge
              top: '10%', // Position from top edge
              left: `${segment * 100 + 80}%`, // Position segments for seamless looping
            }}
          >
            <div className="relative w-full h-full">
              {/* Moon's atmospheric glow */}
              <div
                className="absolute w-full h-full rounded-full opacity-30"
                style={{
                  // Radial gradient for atmospheric glow effect
                  background: 'radial-gradient(circle, rgba(220, 220, 255, 0.4) 0%, rgba(180, 180, 220, 0.2) 40%, transparent 70%)',
                  transform: 'scale(1.8)', // Scale up for glow effect
                  filter: 'blur(8px)', // Blur for soft glow
                }}
              />
              
              {/* Main moon body with realistic surface features */}
              <div
                className="w-full h-full rounded-full"
                style={{
                  // Complex gradient to simulate lunar surface with craters and maria
                  background: `
                    radial-gradient(ellipse at 30% 25%, rgba(255, 255, 255, 0.9) 0%, transparent 25%),
                    radial-gradient(ellipse at 65% 40%, rgba(240, 240, 240, 0.6) 0%, transparent 20%),
                    radial-gradient(ellipse at 45% 70%, rgba(220, 220, 220, 0.4) 0%, transparent 15%),
                    radial-gradient(ellipse at 20% 60%, rgba(200, 200, 200, 0.3) 0%, transparent 12%),
                    radial-gradient(ellipse at 75% 25%, rgba(210, 210, 210, 0.3) 0%, transparent 10%),
                    radial-gradient(circle at 35% 30%, #f8f8f8 0%, #e8e8e8 25%, #d0d0d0 50%, #b8b8b8 75%, #a0a0a0 100%)
                  `,
                  // Multiple box shadows for realistic lighting and glow
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
                      // Radial gradient for crater depth effect
                      background: 'radial-gradient(circle, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 40%, transparent 70%)',
                      boxShadow: 'inset 2px 2px 4px rgba(0, 0, 0, 0.3)', // Inner shadow for depth
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
                  
                  {/* Mare (dark patches) - lunar seas */}
                  <div
                    className="absolute opacity-20"
                    style={{
                      width: '20px',
                      height: '15px',
                      left: '20%',
                      top: '25%',
                      background: 'radial-gradient(ellipse, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.1) 60%, transparent 100%)',
                      borderRadius: '60% 40% 70% 30%', // Irregular shape
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
                      borderRadius: '50% 60% 40% 70%', // Irregular shape
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
                      borderRadius: '70% 30% 60% 40%', // Irregular shape
                      transform: 'rotate(45deg)',
                    }}
                  />
                </div>
              </div>
              
              {/* Subtle light rays from moon */}
              <div className="absolute inset-0">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={`moon-ray-${i}`} // Unique key for each ray
                    className="absolute opacity-10"
                    style={{
                      width: '1px',
                      height: '60px',
                      background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 0%, transparent 100%)',
                      left: '50%',
                      top: '50%',
                      transformOrigin: '0 0',
                      transform: `translate(-50%, -50%) rotate(${i * 45}deg)`, // Rotate each ray
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))
      ) : (
        // Sun for day time - detailed solar surface
        Array.from({ length: 3 }).map((_, segment) => (
          <motion.div 
            key={`sun-${segment}`} // Unique key for each sun segment
            className="absolute w-24 h-24"
            style={{ 
              // Transform with parallax speed (30%)
              transform: `translateX(${(normalizedOffset * 0.3) + (segment * SKY_CIRCUMFERENCE * 0.3)}px)`,
              right: '10%', // Position from right edge
              top: '10%', // Position from top edge
              left: `${segment * 100 + 80}%`, // Position segments for seamless looping
            }}
          >
            <div className="relative w-full h-full">
              {/* Sun's atmospheric glow */}
              <div
                className="absolute w-full h-full rounded-full opacity-40"
                style={{
                  // Radial gradient for solar corona effect
                  background: 'radial-gradient(circle, rgba(255, 215, 0, 0.6) 0%, rgba(255, 165, 0, 0.4) 40%, rgba(255, 69, 0, 0.2) 70%, transparent 100%)',
                  transform: 'scale(2.5)', // Scale up for corona effect
                  filter: 'blur(15px)', // Blur for soft glow
                }}
              />
              
              {/* Main sun body with realistic solar surface */}
              <div
                className="w-full h-full rounded-full"
                style={{
                  // Complex gradient to simulate solar surface with flares and spots
                  background: `
                    radial-gradient(ellipse at 30% 25%, rgba(255, 255, 255, 1) 0%, transparent 30%),
                    radial-gradient(ellipse at 65% 40%, rgba(255, 255, 200, 0.8) 0%, transparent 25%),
                    radial-gradient(ellipse at 45% 70%, rgba(255, 215, 0, 0.6) 0%, transparent 20%),
                    radial-gradient(circle at 50% 50%, #FFD700 0%, #FFA500 30%, #FF8C00 60%, #FF4500 100%)
                  `,
                  // Multiple box shadows for realistic solar glow
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
                      borderRadius: '50% 50% 80% 20%', // Flame-like shape
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
                      borderRadius: '60% 40% 70% 30%', // Flame-like shape
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
                      borderRadius: '70% 30% 60% 40%', // Irregular shape
                      transform: 'rotate(-30deg)',
                    }}
                  />
                </div>
              </div>
              
              {/* Sun rays - static rays */}
              <div className="absolute inset-0">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={`sun-ray-${i}`} // Unique key for each ray
                    className="absolute opacity-20"
                    style={{
                      width: '2px',
                      height: '80px',
                      background: 'linear-gradient(to bottom, rgba(255, 215, 0, 0.6) 0%, rgba(255, 165, 0, 0.4) 50%, transparent 100%)',
                      left: '50%',
                      top: '50%',
                      transformOrigin: '0 0',
                      transform: `translate(-50%, -50%) rotate(${i * 30}deg)`, // Rotate each ray
                    }}
                  />
                ))}
              </div>
              
              {/* Animated sun rays - pulsing rays */}
              <div className="absolute inset-0">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={`animated-ray-${i}`} // Unique key for each animated ray
                    className="absolute opacity-15 animate-pulse"
                    style={{
                      width: '1px',
                      height: '100px',
                      background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.8) 0%, rgba(255, 215, 0, 0.4) 30%, transparent 100%)',
                      left: '50%',
                      top: '50%',
                      transformOrigin: '0 0',
                      transform: `translate(-50%, -50%) rotate(${i * 45 + 22.5}deg)`, // Rotate each ray with offset
                      animationDuration: `${2 + i * 0.3}s`, // Staggered animation duration
                      animationDelay: `${i * 0.2}s`, // Staggered animation delay
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
          key={star.id} // Unique key for each star
          className="absolute cursor-pointer interactive-star"
          style={{
            left: `${star.x}%`, // Horizontal position from star data
            top: `${star.y}%`, // Vertical position from star data
            // Transform with minimal parallax (5%) to keep stars in fixed positions
            transform: `translate(-50%, -50%) translateX(${normalizedOffset * 0.05}px)`,
            zIndex: hoveredStar === star.id ? 10 : 1, // Higher z-index when hovered
          }}
          onClick={(e) => {
            e.stopPropagation(); // Prevent event bubbling
            if (!isDragging) { // Only handle click if not dragging
              onStarClick(star); // Call the click handler
            }
          }}
          onMouseEnter={() => setHoveredStar(star.id)} // Set hovered star on mouse enter
          onMouseLeave={() => setHoveredStar(null)} // Clear hovered star on mouse leave
          onMouseDown={(e) => e.stopPropagation()} // Prevent drag start on star
          onTouchStart={(e) => e.stopPropagation()} // Prevent drag start on star (mobile)
        >
          {/* Shiny star shape with multiple layers */}
          <div className="relative">
            {/* Outer glow effect */}
            <div
              className="absolute transition-all duration-300"
              style={{
                left: '50%',
                top: '50%',
                // Scale up when hovered
                transform: `translate(-50%, -50%) ${hoveredStar === star.id ? 'scale(1.5)' : 'scale(1)'}`,
                filter: `blur(${Math.max(star.size * 2, 4)}px)`, // Blur based on star size
                opacity: star.brightness * 0.8, // Opacity based on star brightness
              }}
            >
              <svg
                width={Math.max(star.size * 12, 24)} // Width based on star size
                height={Math.max(star.size * 12, 24)} // Height based on star size
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z"
                  fill={`rgba(255, 215, 0, ${star.brightness})`} // Fill with golden color and star brightness
                />
              </svg>
            </div>

            {/* Main star body */}
            <div
              className="absolute transition-all duration-300"
              style={{
                left: '50%',
                top: '50%',
                // Scale up when hovered
                transform: `translate(-50%, -50%) ${hoveredStar === star.id ? 'scale(1.3)' : 'scale(1)'}`,
                filter: `drop-shadow(0 0 ${Math.max(star.size * 3, 6)}px rgba(255, 215, 0, ${star.brightness * 0.9}))`, // Drop shadow for glow
              }}
            >
              <svg
                width={Math.max(star.size * 8, 16)} // Width based on star size
                height={Math.max(star.size * 8, 16)} // Height based on star size
                viewBox="0 0 24 24"
                fill="none"
              >
                <defs>
                  {/* Gradient definition for realistic star coloring */}
                  <radialGradient id={`starGradient-${star.id}`} cx="0.3" cy="0.3" r="0.8">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="30%" stopColor="#ffd700" />
                    <stop offset="70%" stopColor="#ffa500" />
                    <stop offset="100%" stopColor="#ff4500" />
                  </radialGradient>
                </defs>
                <path
                  d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z"
                  fill={`url(#starGradient-${star.id})`} // Use gradient fill
                  stroke="rgba(255, 255, 255, 0.9)" // White stroke
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
                // Scale up when hovered
                transform: `translate(-50%, -50%) ${hoveredStar === star.id ? 'scale(1.4)' : 'scale(1)'}`,
              }}
            >
              <svg
                width={Math.max(star.size * 4, 8)} // Width based on star size
                height={Math.max(star.size * 4, 8)} // Height based on star size
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z"
                  fill="rgba(255, 255, 255, 0.95)" // Bright white core
                />
              </svg>
              
              {/* Sparkle effects around the star */}
              <div className="absolute inset-0">
                {Array.from({ length: 4 }).map((_, i) => {
                  // Calculate angle for sparkle positioning
                  const angle = (i * 90) + (hoveredStar === star.id ? 45 : 0);
                  const distance = Math.max(star.size * 6, 12); // Distance from star center
                  const sparkleSize = Math.max(star.size * 1.5, 3); // Size of sparkle
                  return (
                    <div
                      key={`sparkle-${i}`} // Unique key for each sparkle
                      className="absolute transition-all duration-300"
                      style={{
                        left: '50%',
                        top: '50%',
                        // Position sparkle around the star
                        transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${distance}px)`,
                        opacity: star.brightness * 0.7, // Opacity based on star brightness
                      }}
                    >
                      <div
                        className="animate-pulse"
                        style={{
                          width: `${sparkleSize}px`,
                          height: `${sparkleSize}px`,
                          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, transparent 70%)',
                          borderRadius: '50%',
                          animationDuration: `${1.5 + Math.random() * 2}s`, // Random animation duration
                          animationDelay: `${i * 0.3}s`, // Staggered animation delay
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
                opacity: star.brightness * 0.6, // Opacity based on star brightness
                animationDuration: `${2 + Math.random() * 3}s`, // Random animation duration
                animationDelay: `${Math.random() * 2}s`, // Random animation delay
              }}
            >
              <svg
                width={Math.max(star.size * 10, 20)} // Width based on star size
                height={Math.max(star.size * 10, 20)} // Height based on star size
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 2L15.09 8.26L22 9L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9L8.91 8.26L12 2Z"
                  fill="rgba(255, 255, 255, 0.4)" // Semi-transparent white for twinkling effect
                />
              </svg>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};