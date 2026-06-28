// src/components/CjLogo.tsx
// Premium SVG Logo for Accessories By CJ
// Replace path: Acc-by-Cj/src/components/CjLogo.tsx  (NEW FILE)

import React from "react";

interface CjLogoSVGProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export const CjLogoSVG: React.FC<CjLogoSVGProps> = ({
  className = "",
  size = 48,
  glow = true,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${glow ? "animate-pulse-glow" : ""}`}
      style={{ filter: glow ? "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))" : "none" }}
    >
      <defs>
        {/* Neon electric blue and silver gradients */}
        <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
        <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#93c5fd" />
        </linearGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dbeafe" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Hexagon Shield with Metallic Bezel */}
      <polygon
        points="60,6 108,32 108,88 60,114 12,88 12,32"
        stroke="url(#goldGrad)"
        strokeWidth="3.5"
        fill="#040814"
        fillOpacity="0.85"
        strokeLinejoin="round"
      />

      {/* Inner Glowing Hexagonal Trim */}
      <polygon
        points="60,12 102,36 102,84 60,108 18,84 18,36"
        stroke="url(#hexGrad)"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
        opacity="0.8"
      />

      {/* Cybernetic Tech Accents in Vertices */}
      <circle cx="60" cy="18" r="1.5" fill="#3b82f6" />
      <circle cx="96" cy="39" r="1.5" fill="#60a5fa" opacity="0.6" />
      <circle cx="96" cy="81" r="1.5" fill="#60a5fa" opacity="0.6" />
      <circle cx="60" cy="102" r="1.5" fill="#3b82f6" />
      <circle cx="24" cy="81" r="1.5" fill="#60a5fa" opacity="0.6" />
      <circle cx="24" cy="39" r="1.5" fill="#60a5fa" opacity="0.6" />

      {/* Stylized Futuristic letters "C" and "J" in Monogram */}
      <g filter="url(#glowFilter)">
        {/* Custom Letter C */}
        <path
          d="M 52,40 C 40,40 34,48 34,60 C 34,72 40,80 52,80"
          stroke="url(#textGrad)"
          strokeWidth="8.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Custom Letter J */}
        <path
          d="M 72,40 L 72,70 C 72,78 66,82 58,82 M 66,40 L 78,40"
          stroke="url(#textGrad)"
          strokeWidth="8.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      {/* Premium Core Light Dot */}
      <circle cx="60" cy="60" r="2.5" fill="#ffffff" />
    </svg>
  );
};

export default CjLogoSVG;
