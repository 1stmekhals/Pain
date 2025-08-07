// StarrySky component - renders the interactive night sky with stars, moon/sun, and cosmic effects
// Handles 360-degree sky exploration with drag/touch controls and star interactions
import React, { useState, useEffect } from 'react';
// Import Framer Motion for smooth animations
import { motion, useMotionValue, useTransform } from 'framer-motion';
// Import Star type for TypeScript type safety
import { Star } from '../types/star';
import { SkySegment } from './SkySegment';
import { InteractiveStar } from './InteractiveStar';

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
  // State for tracking if user is currently dragging the sky
  const [isDragging, setIsDragging] = useState(false);
  // State for storing drag start position and initial offset
  const [dragStart, setDragStart] = useState({ x: 0, offset: 0 });
  
  // Use Framer Motion's useMotionValue for smooth, hardware-accelerated animations
  const skyOffset = useMotionValue(0);
  
  // Force night time display - ignore isDayTime prop for now
  // Force night time - ignore isDayTime prop
  const forceNightTime = true;

  // 360-degree sky circumference in pixels (large enough for smooth exploration)
  // 360-degree sky circumference (in pixels)
  const SKY_CIRCUMFERENCE = 3600; // 10x screen width for smooth 360° experience

  // Normalize sky offset to create seamless 360-degree loop
  const normalizedOffset = useTransform(
    skyOffset,
    (value) => ((value % SKY_CIRCUMFERENCE) + SKY_CIRCUMFERENCE) % SKY_CIRCUMFERENCE
  );

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
      offset: skyOffset.get()
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
      const newOffset = dragStart.offset + deltaX * 0.5; // Slower movement for better control
      skyOffset.set(newOffset);
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
      offset: skyOffset.get()
    });
  };

  // Handle touch move event for mobile devices
  const handleTouchMove = (e: React.TouchEvent) => {
    // Only process if currently dragging
    if (isDragging) {
      // Prevent default touch behavior
      e.preventDefault();
      // Calculate touch movement distance
      const deltaX = e.touches[0].clientX - dragStart.x;
      // Update sky offset
      const newOffset = dragStart.offset + deltaX * 0.5; // Slower movement for better control
      skyOffset.set(newOffset);
    }
  };

  // Handle touch end event
  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Effect to add global mouse event listeners for smooth dragging
  useEffect(() => {
    // Global touch move handler for dragging outside component
    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        // Prevent default behavior
        e.preventDefault();
        // Calculate movement and update offset
        const deltaX = e.touches[0].clientX - dragStart.x;
        const newOffset = dragStart.offset + deltaX * 0.5;
        skyOffset.set(newOffset);
      }
    };

    // Global touch end handler
    const handleGlobalTouchEnd = () => {
      setIsDragging(false);
    };

    // Global mouse move handler for dragging outside component
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        // Prevent default behavior
        e.preventDefault();
        // Calculate movement and update offset
        const deltaX = e.clientX - dragStart.x;
        const newOffset = dragStart.offset + deltaX * 0.5;
        skyOffset.set(newOffset);
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
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false });
      document.addEventListener('touchend', handleGlobalTouchEnd);
    }

    // Cleanup listeners on unmount or when dragging stops
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('touchmove', handleGlobalTouchMove);
      document.removeEventListener('touchend', handleGlobalTouchEnd);
    };
  }, [isDragging, dragStart]);

  return (
    <div 
      className="absolute inset-0 overflow-hidden select-none"
      style={{ 
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'pan-x',
        WebkitUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitTapHighlightColor: 'transparent'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Main sky container with drag controls and touch handling */}
      
      <motion.div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at top, rgba(30, 27, 75, 0.8) 0%, transparent 50%),
            radial-gradient(ellipse at bottom, rgba(15, 23, 42, 0.6) 0%, transparent 50%),
            linear-gradient(180deg, 
              #0f0f23 0%, 
              #1a1a2e 25%, 
              #16213e 50%, 
              #0f3460 75%, 
              #000000 100%
            )
          `,
          willChange: 'transform'
        }}
      >
        {/* Dynamic sky background gradient */}
        {/* Dynamic sky background based on time */}
      </motion.div>
      
      {/* Sky segments with background elements */}
      {Array.from({ length: 4 }).map((_, segment) => (
        <SkySegment
          key={`sky-segment-${segment}`}
          segment={segment}
          normalizedOffset={normalizedOffset}
          SKY_CIRCUMFERENCE={SKY_CIRCUMFERENCE}
        />
      ))}

      {/* Interactive user-created stars - visible in both day and night */}
      {stars.map((star) => (
        <InteractiveStar
          key={star.id}
          star={star}
          normalizedOffset={normalizedOffset}
          onStarClick={onStarClick}
          isDragging={isDragging}
          hoveredStar={hoveredStar}
          setHoveredStar={setHoveredStar}
        />
      ))}
    </div>
  );
};