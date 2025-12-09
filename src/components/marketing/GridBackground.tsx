'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface MapDot {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  pulseDelay: number;
}

export function GridBackground() {
  const [mapDots, setMapDots] = useState<MapDot[]>([]);

  useEffect(() => {
    // Generate map dots on client side only
    const dotCount = 30;
    const newDots: MapDot[] = [];

    for (let i = 0; i < dotCount; i++) {
      newDots.push({
        id: i,
        x: Math.random() * 85 + 7.5,
        y: Math.random() * 90 + 5,
        size: Math.random() * 4 + 3,
        delay: Math.random() * 2,
        pulseDelay: Math.random() * 3,
      });
    }

    setMapDots(newDots);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Map dots - mimicking property locations */}
      {mapDots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute"
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: dot.delay, duration: 0.5 }}
        >
          {/* Outer pulse ring */}
          <motion.div
            className="absolute rounded-full bg-cyber-blue/20"
            style={{
              width: dot.size * 3,
              height: dot.size * 3,
              left: -dot.size,
              top: -dot.size,
            }}
            animate={{
              scale: [1, 2, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: dot.pulseDelay,
              ease: 'easeOut',
            }}
          />

          {/* Inner dot with glow */}
          <motion.div
            className="rounded-full"
            style={{
              width: dot.size,
              height: dot.size,
              background: `radial-gradient(circle, rgba(96, 165, 250, 0.8) 0%, rgba(167, 139, 250, 0.4) 100%)`,
              boxShadow: `0 0 ${dot.size * 2}px rgba(96, 165, 250, 0.5), 0 0 ${dot.size * 4}px rgba(96, 165, 250, 0.2)`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: dot.pulseDelay,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      ))}

      {/* Vignette overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.5) 100%)',
        }}
      />
    </div>
  );
}
