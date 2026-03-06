'use client';

/**
 * SmoothScrollProvider
 * Wraps the app with Lenis for momentum-based smooth scrolling.
 * Must be a Client Component because Lenis uses browser APIs.
 */

import { ReactLenis } from 'lenis/react';

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,          // interpolation factor — lower = smoother / slower
        duration: 1.4,       // scroll duration in seconds
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      }}
    >
      {children}
    </ReactLenis>
  );
}
