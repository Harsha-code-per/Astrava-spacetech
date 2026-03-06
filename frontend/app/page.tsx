'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Asteroid } from '@/lib/data';
import { HeroSection } from '@/components/hero-section';
import { TargetFinder } from '@/components/target-finder';
import { MissionProfile } from '@/components/mission-profile';
import { ScanSearch } from 'lucide-react';

export default function Home() {
  const [selected, setSelected] = useState<Asteroid | null>(null);

  const handleSelect = (asteroid: Asteroid) => {
    setSelected(asteroid);
  };

  return (
    <main className="bg-black text-zinc-100">
      {/* ── Hero (full viewport, video background) ── */}
      <HeroSection />

      {/* ── Command Dashboard ── */}
      <section id="command-dashboard" className="bg-zinc-950">
        {/* Dashboard header bar */}
        <div className="border-b border-zinc-800/50 bg-black/40 px-6 py-5 backdrop-blur-sm md:px-10">
          <div className="mx-auto max-w-[1600px] flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-cyan-500">
                — Command Dashboard
              </p>
              <h2 className="text-2xl font-black text-white">MISSION CONTROL</h2>
              <p className="mt-0.5 text-sm text-zinc-500">
                {selected
                  ? `Active target: ${selected.full_name}`
                  : 'Select a target from the table to initialize mission profile'}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-zinc-700/60 bg-black/40 px-4 py-2 text-xs font-mono text-zinc-400 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              LIVE · JPL HORIZONS
            </div>
          </div>
        </div>

        {/* 2-column grid */}
        <div className="mx-auto max-w-[1600px] grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-zinc-800/50">
          {/* ── Left: Target Finder ── */}
          <div className="px-6 py-7 md:px-8">
            <TargetFinder selected={selected} onSelect={handleSelect} />
          </div>

          {/* ── Right: Mission Profile ── */}
          <div className="px-6 py-7 md:px-8">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.38 }}
                >
                  <MissionProfile asteroid={selected} />
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[480px] flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-zinc-800 bg-black/30 backdrop-blur-sm"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-zinc-700">
                    <ScanSearch className="h-6 w-6 text-zinc-700" />
                  </div>
                  <div className="text-center">
                    <p className="font-mono text-xs uppercase tracking-widest text-zinc-600">
                      Awaiting Target Selection
                    </p>
                    <p className="mt-1 text-xs text-zinc-700">← Click any row in the target finder</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 bg-black py-6 text-center">
        <p className="font-mono text-xs text-zinc-700">
          SPECTRAVEIN · Data modeled from JPL Small-Body Database · All valuations are theoretical models
        </p>
      </footer>
    </main>
  );
}
