'use client';

/**
 * SmoothScrollProvider
 * Wraps the app with Lenis for momentum-based smooth scrolling.
 * Must be a Client Component because Lenis uses browser APIs.
 */

import { ReactLenis } from 'lenis/react';
import { TooltipProvider } from '@/components/ui/tooltip';

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.4,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      }}
    >
      <TooltipProvider delayDuration={200}>
        {children}
      </TooltipProvider>
    </ReactLenis>
  );
}
