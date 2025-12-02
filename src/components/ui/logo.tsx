'use client';

import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

// All arcs are centered at (50, 50) with properly calculated start/end points
// Using circle arc formula: x = cx + r*cos(angle), y = cy + r*sin(angle)

export function Logo({ size = 'md', className }: LogoProps) {
  return (
    <div
      className={cn(
        sizeMap[size],
        'relative flex items-center justify-center',
        className
      )}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
          <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer ring - r=42, ~280° arc, gap at top-right */}
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="url(#logoGrad)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="230 34"
          strokeDashoffset="-20"
          opacity="0.4"
        />

        {/* Middle ring - r=28, ~260° arc, gap at bottom-left */}
        <circle
          cx="50"
          cy="50"
          r="28"
          fill="none"
          stroke="url(#logoGrad)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="150 26"
          strokeDashoffset="70"
          opacity="0.7"
        />

        {/* Inner ring - r=14, ~220° arc, gap at right */}
        <circle
          cx="50"
          cy="50"
          r="14"
          fill="none"
          stroke="url(#logoGrad)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="68 20"
          strokeDashoffset="-30"
          filter="url(#logoGlow)"
        />

        {/* Center dot */}
        <circle
          cx="50"
          cy="50"
          r="4"
          fill="url(#logoGrad)"
          filter="url(#logoGlow)"
        />
      </svg>
    </div>
  );
}

export function LogoAnimated({ size = 'md', className }: LogoProps) {
  return (
    <div
      className={cn(
        sizeMap[size],
        'relative flex items-center justify-center',
        className
      )}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="logoGradAnim" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
          <filter id="logoGlowAnim" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer ring - rotating slowly */}
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="url(#logoGradAnim)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="230 34"
          strokeDashoffset="-20"
          opacity="0.4"
          className="origin-center animate-[spin_10s_linear_infinite]"
        />

        {/* Middle ring - rotating opposite */}
        <circle
          cx="50"
          cy="50"
          r="28"
          fill="none"
          stroke="url(#logoGradAnim)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="150 26"
          strokeDashoffset="70"
          opacity="0.7"
          className="origin-center animate-[spin_6s_linear_infinite_reverse]"
        />

        {/* Inner ring - rotating faster */}
        <circle
          cx="50"
          cy="50"
          r="14"
          fill="none"
          stroke="url(#logoGradAnim)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="68 20"
          strokeDashoffset="-30"
          filter="url(#logoGlowAnim)"
          className="origin-center animate-[spin_3s_linear_infinite]"
        />

        {/* Center dot - pulsing */}
        <circle
          cx="50"
          cy="50"
          r="4"
          fill="url(#logoGradAnim)"
          filter="url(#logoGlowAnim)"
          className="animate-pulse"
        />
      </svg>
    </div>
  );
}
