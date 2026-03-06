'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- 4-pointed star SVG used for sparkle particles ---
function StarIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
        fill={color}
      />
    </svg>
  );
}

interface SparkleParticle {
  id: string;
  createdAt: number;
  color: string;
  size: number;
  style: { top: string; left: string };
}

function generateParticle(color: string): SparkleParticle {
  return {
    id: Math.random().toString(36).slice(2, 8),
    createdAt: Date.now(),
    color,
    size: Math.random() * 10 + 8,
    style: {
      top: Math.random() * 100 + '%',
      left: Math.random() * 100 + '%',
    },
  };
}

interface SparklesProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
}

/** Wraps text in animated star sparkles (Aceternity-style). */
export function Sparkles({ children, color = '#22d3ee', className = '' }: SparklesProps) {
  const [particles, setParticles] = useState<SparkleParticle[]>([]);

  const addParticle = useCallback(() => {
    const p = generateParticle(color);
    setParticles((prev) => [...prev.filter((x) => Date.now() - x.createdAt < 900), p]);
  }, [color]);

  useEffect(() => {
    const id = setInterval(addParticle, 380);
    return () => clearInterval(id);
  }, [addParticle]);

  return (
    <span className={`relative inline-block ${className}`}>
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            className="pointer-events-none absolute z-20"
            style={p.style}
            initial={{ scale: 0, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 45 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <StarIcon size={p.size} color={p.color} />
          </motion.span>
        ))}
      </AnimatePresence>
      <strong className="relative z-10 font-black">{children}</strong>
    </span>
  );
}

// --- Full-screen animated starfield background ---
interface StarDot {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

interface StarfieldBackgroundProps {
  count?: number;
}

/** Renders a twinkling starfield. Stars are generated client-side to avoid SSR mismatch. */
export function StarfieldBackground({ count = 160 }: StarfieldBackgroundProps) {
  const [stars, setStars] = useState<StarDot[]>([]);

  useEffect(() => {
    setStars(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.8 + 0.3,
        opacity: Math.random() * 0.55 + 0.08,
        duration: Math.random() * 4 + 2.5,
        delay: Math.random() * 5,
      }))
    );
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{ opacity: [star.opacity, star.opacity * 0.1, star.opacity] }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
