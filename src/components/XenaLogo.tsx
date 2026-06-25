import React from 'react';

interface XenaLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textSize?: string;
  textTracking?: string;
}

export default function XenaLogo({
  className = '',
  size = 64,
  showText = true,
  textSize = 'text-[11px]',
  textTracking = 'tracking-[0.6em]'
}: XenaLogoProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Visual Logo SVG */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full filter drop-shadow-[0_0_15px_rgba(0,163,255,0.45)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* High-fidelity corporate gradient from Deep Blue to Electric Cyan */}
            <linearGradient id="xenaGradPrimary" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0052FF" />
              <stop offset="50%" stopColor="#00A3FF" />
              <stop offset="100%" stopColor="#00E0FF" />
            </linearGradient>
            
            <linearGradient id="xenaGradSecondary" x1="80" y1="20" x2="20" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00E0FF" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#00A3FF" />
              <stop offset="100%" stopColor="#0052FF" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Background glowing geometric orbit circle */}
          <circle 
            cx="50" 
            cy="50" 
            r="44" 
            stroke="url(#xenaGradPrimary)" 
            strokeWidth="1" 
            strokeOpacity="0.15" 
            strokeDasharray="4 6"
          />

          {/* Thin backing diagonal accent lines for structural blueprint feel */}
          <line
            x1="12"
            y1="12"
            x2="88"
            y2="88"
            stroke="#00a3ff"
            strokeWidth="1"
            strokeOpacity="0.3"
            strokeDasharray="2 4"
          />
          <line
            x1="88"
            y1="12"
            x2="12"
            y2="88"
            stroke="#00a3ff"
            strokeWidth="1"
            strokeOpacity="0.3"
            strokeDasharray="2 4"
          />

          {/* Left-to-Right diagonal solid bar with a clean futuristic cut */}
          <path
            d="M22 25 C22 23.3 23.3 22 25 22 H34 C35.2 22 36.3 22.7 36.8 23.8 L77.2 92.2 C77.8 93.3 78.9 94 80.1 94 H84 C85.7 94 87 92.7 87 91 V82 C87 80.8 86.3 79.7 85.2 79.2 L44.8 10.8 C44.2 9.7 43.1 9 41.9 9 H25 C23.3 9 22 10.3 22 12 V25Z"
            fill="url(#xenaGradPrimary)"
            fillOpacity="0.95"
          />

          {/* Right-to-Left crossing band, elegantly split in the center to overlay with 3D depth */}
          <path
            d="M78 22 C79.7 22 81 23.3 81 25 V38 C81 39.2 80.3 40.3 79.2 40.8 L61 50 L79.2 59.2 C80.3 59.7 81 60.8 81 62 V75 C81 76.7 79.7 78 78 78 H69 C67.8 78 66.7 77.3 66.2 76.2 L57 61 L46 76.2 C45.5 77.3 44.4 78 43.2 78 H22 C20.3 78 19 76.7 19 75 V62 C19 60.8 19.7 59.7 20.8 59.2 L39 50 L20.8 40.8 C19.7 40.3 19 39.2 19 38 V25 C19 23.3 20.3 22 22 22 H31 C32.2 22 33.3 22.7 33.8 23.8 L43 39 L53.8 23.8 C54.3 22.7 55.4 22 56.6 22 H78Z"
            fill="url(#xenaGradSecondary)"
            fillOpacity="0.85"
          />

          {/* Premium central core lock / diamond emblem signifying Security & Trust */}
          <path
            d="M50 38 L59 50 L50 62 L41 50 Z"
            fill="#05070c"
            stroke="url(#xenaGradPrimary)"
            strokeWidth="2.5"
          />
          
          <circle
            cx="50"
            cy="50"
            r="3"
            fill="#00E0FF"
          />
        </svg>
      </div>

      {/* Tracked out XENA brand typography */}
      {showText && (
        <span className={`mt-2 font-sans font-black text-white uppercase ${textSize} ${textTracking} pl-[0.6em]`}>
          XENA
        </span>
      )}
    </div>
  );
}
