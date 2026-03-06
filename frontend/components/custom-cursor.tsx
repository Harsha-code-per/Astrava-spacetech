'use client';

/**
 * CustomCursor
 * Framer Motion-powered cursor: inverted dot + lagging ring.
 * Hides the native cursor globally via CSS (set in globals.css).
 * Expands the ring on hover over any interactive element.
 */

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number>(0);

  // Raw mouse position
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Dot follows instantly
  const dotX = useSpring(mouseX, { damping: 50, stiffness: 800, mass: 0.2 });
  const dotY = useSpring(mouseY, { damping: 50, stiffness: 800, mass: 0.2 });

  // Ring lags behind — gives the "trailing" feel
  const ringX = useSpring(mouseX, { damping: 28, stiffness: 200, mass: 0.5 });
  const ringY = useSpring(mouseY, { damping: 28, stiffness: 200, mass: 0.5 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      });
    };

    const onEnter = () => setVisible(true);
    const onLeave = () => setVisible(false);

    // Detect hover on interactive elements
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], [data-cursor="expand"], input, select, textarea')) {
        setHovered(true);
      }
    };
    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], [data-cursor="expand"], input, select, textarea')) {
        setHovered(false);
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, [mouseX, mouseY]);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Outer ring — lags behind, expands on hover */}
      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full border border-white mix-blend-difference"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 1 : 0,
        }}
        animate={{
          width: hovered ? 56 : 36,
          height: hovered ? 56 : 36,
        }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Inner dot — snaps to position */}
      <motion.div
        className="pointer-events-none fixed z-[9999] rounded-full bg-white mix-blend-difference"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: visible ? 1 : 0,
        }}
        animate={{
          width: hovered ? 6 : 8,
          height: hovered ? 6 : 8,
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
}
