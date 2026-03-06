'use client';

/**
 * LoadingScreen
 * Full-screen black intro that displays for 2 seconds,
 * then animates upward to reveal the site.
 * Uses AnimatePresence so it unmounts cleanly after exit.
 */

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Individual letter for staggered entrance
function SplitText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.05 + i * 0.03,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

export function LoadingScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setShow(false), 2400);
    return () => clearTimeout(id);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden"
          style={{ backgroundColor: '#181616' }}
          initial={{ y: 0 }}
          exit={{
            y: '-100%',
            transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* Top rule */}
          <motion.div
            className="absolute top-0 left-0 h-px w-full bg-white/10"
            initial={{ scaleX: 0, transformOrigin: 'left' }}
            animate={{ scaleX: 1, transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } }}
          />

          {/* Content */}
          <div className="px-8 text-center">
            {/* Overline */}
            <motion.p
              className="mb-6 font-mono text-xs uppercase tracking-[0.35em] text-white/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.2, duration: 0.6 } }}
            >
              SPECTRAVEIN · ORBITAL MINING INTELLIGENCE
            </motion.p>

            {/* Main headline — massive serif */}
            <div className="overflow-hidden">
              <h1
                className="font-serif text-[clamp(2.5rem,8vw,7rem)] font-black leading-none tracking-tight text-white"
              >
                <SplitText text="INITIALIZING" />
              </h1>
            </div>
            <div className="overflow-hidden">
              <h1
                className="font-serif text-[clamp(2.5rem,8vw,7rem)] font-black leading-none tracking-tight"
                style={{ color: '#FF3831' }}
              >
                <SplitText text="SPECTRAVEIN..." />
              </h1>
            </div>

            {/* Progress bar */}
            <div className="mx-auto mt-10 h-px w-64 overflow-hidden bg-white/10">
              <motion.div
                className="h-full"
                style={{ backgroundColor: '#FF3831' }}
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.0, ease: 'linear' }}
              />
            </div>

            {/* Status text */}
            <motion.p
              className="mt-4 font-mono text-[10px] uppercase tracking-widest text-white/25"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.6, duration: 0.4 } }}
            >
              Connecting to JPL HORIZONS · Loading asteroid catalog
            </motion.p>
          </div>

          {/* Bottom rule */}
          <motion.div
            className="absolute bottom-0 left-0 h-px w-full bg-white/10"
            initial={{ scaleX: 0, transformOrigin: 'right' }}
            animate={{ scaleX: 1, transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } }}
          />

          {/* Corner marks — agency aesthetic */}
          {['top-6 left-6', 'top-6 right-6', 'bottom-6 left-6', 'bottom-6 right-6'].map((pos, i) => (
            <motion.div
              key={i}
              className={`absolute ${pos} h-4 w-4 border-white/20`}
              style={{
                borderTopWidth: i < 2 ? 1 : 0,
                borderBottomWidth: i >= 2 ? 1 : 0,
                borderLeftWidth: i % 2 === 0 ? 1 : 0,
                borderRightWidth: i % 2 !== 0 ? 1 : 0,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.3 + i * 0.05 } }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
