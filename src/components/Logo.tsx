import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 120, 
  className = '', 
  showText = true 
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg"
      >
        {/* Background circle with gradient */}
        <defs>
          <radialGradient id="backgroundGradient" cx="0.3" cy="0.3" r="0.8">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="50%" stopColor="#312e81" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
          
          <radialGradient id="starGradient" cx="0.3" cy="0.3" r="0.7">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#fbbf24" />
            <stop offset="70%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </radialGradient>
          
          <radialGradient id="moonGradient" cx="0.3" cy="0.3" r="0.8">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="50%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </radialGradient>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r="58"
          fill="url(#backgroundGradient)"
          stroke="#4338ca"
          strokeWidth="2"
        />
        
        {/* Stars scattered around */}
        <g filter="url(#glow)">
          {/* Main central star */}
          <g transform="translate(60, 45)">
            <circle cx="0" cy="0" r="6" fill="url(#starGradient)" />
            <line x1="0" y1="-12" x2="0" y2="12" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
            <line x1="-12" y1="0" x2="12" y2="0" stroke="#ffffff" strokeWidth="1" opacity="0.8" />
            <line x1="-8" y1="-8" x2="8" y2="8" stroke="#ffffff" strokeWidth="0.5" opacity="0.6" />
            <line x1="8" y1="-8" x2="-8" y2="8" stroke="#ffffff" strokeWidth="0.5" opacity="0.6" />
          </g>
          
          {/* Smaller stars */}
          <circle cx="25" cy="30" r="2" fill="#ffffff" opacity="0.9" />
          <circle cx="85" cy="25" r="1.5" fill="#fbbf24" opacity="0.8" />
          <circle cx="95" cy="50" r="2.5" fill="#ffffff" opacity="0.7" />
          <circle cx="20" cy="70" r="1.8" fill="#f59e0b" opacity="0.8" />
          <circle cx="35" cy="85" r="1.2" fill="#ffffff" opacity="0.9" />
          <circle cx="80" cy="80" r="1.6" fill="#fbbf24" opacity="0.7" />
          <circle cx="15" cy="50" r="1" fill="#ffffff" opacity="0.6" />
          <circle cx="100" cy="70" r="1.3" fill="#f59e0b" opacity="0.8" />
        </g>
        
        {/* Crescent moon */}
        <g transform="translate(85, 35)">
          <circle cx="0" cy="0" r="8" fill="url(#moonGradient)" />
          <circle cx="2" cy="-1" r="6" fill="url(#backgroundGradient)" opacity="0.7" />
          {/* Moon craters */}
          <circle cx="-2" cy="1" r="1" fill="#94a3b8" opacity="0.4" />
          <circle cx="1" cy="-2" r="0.8" fill="#94a3b8" opacity="0.3" />
        </g>
        
        {/* Constellation lines */}
        <g stroke="#6366f1" strokeWidth="0.5" opacity="0.4">
          <line x1="25" y1="30" x2="60" y2="45" />
          <line x1="60" y1="45" x2="95" y2="50" />
          <line x1="20" y1="70" x2="35" y2="85" />
        </g>
        
        {/* Message envelope/scroll */}
        <g transform="translate(40, 70)">
          <rect x="0" y="0" width="16" height="12" rx="2" fill="#f8fafc" opacity="0.9" />
          <rect x="1" y="1" width="14" height="10" rx="1" fill="#e2e8f0" />
          <line x1="2" y1="3" x2="14" y2="3" stroke="#64748b" strokeWidth="0.5" />
          <line x1="2" y1="5" x2="12" y2="5" stroke="#64748b" strokeWidth="0.5" />
          <line x1="2" y1="7" x2="10" y2="7" stroke="#64748b" strokeWidth="0.5" />
        </g>
        
        {/* Sparkle effects */}
        <g fill="#ffffff" opacity="0.6">
          <polygon points="30,15 31,17 33,17 31.5,18.5 32,21 30,19.5 28,21 28.5,18.5 27,17 29,17" />
          <polygon points="90,90 91,92 93,92 91.5,93.5 92,96 90,94.5 88,96 88.5,93.5 87,92 89,92" />
        </g>
      </svg>
      
      {showText && (
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Starry Messages
          </h1>
          <p className="text-sm text-gray-400 font-medium">
            Leave your mark among the stars
          </p>
        </div>
      )}
    </div>
  );
};