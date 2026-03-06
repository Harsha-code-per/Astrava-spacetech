'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowDownRight } from 'lucide-react';

const ease = [0.16, 1, 0.3, 1] as const;

const WORDS = ['ORBITAL', 'MINING', 'INTELLIGENCE'] as const;

const TICKER = [
  'ASTEROID CLASSIFICATION', 'MINING POTENTIAL',
  'SPECTRAL ANALYSIS',       'DELTA-V ACCESSIBILITY',
  'JPL HORIZONS DATA',       'ROI MODELING',
  'MISSION FEASIBILITY',     'NEAR-EARTH OBJECTS',
];

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col overflow-hidden"
      style={{ backgroundColor: '#181616' }}
    >
      {/* Thin top rule */}
      <motion.div
        className="absolute left-0 right-0 top-0 h-px bg-white/5"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease }}
      />

      {/* ── Main headline — padded for fixed navbar ────────────────── */}
      <div className="flex flex-1 flex-col justify-center px-8 pb-12 pt-28 md:px-14">

        {/* Overline */}
        <motion.p
          className="mb-10 font-mono text-[11px] uppercase tracking-[0.35em] text-white/25"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.7, ease }}
        >
          Near-Earth Object Intelligence Platform &nbsp;·&nbsp; JPL HORIZONS
        </motion.p>

        {/* Three staggered giant words */}
        <div className="select-none space-y-0">
          {WORDS.map((word, i) => (
            <div key={word} className="overflow-hidden leading-none">
              <motion.h1
                className={`font-serif font-black tracking-tight leading-[0.86]
                  text-[clamp(3.5rem,12vw,10.5rem)]
                  ${i === 2 ? '' : 'text-white'}`}
                style={i === 2 ? { color: '#FF3831' } : {}}
                initial={{ y: '105%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1 + i * 0.13, duration: 0.9, ease }}
              >
                {word}
              </motion.h1>
            </div>
          ))}
        </div>

        {/* Bottom row: descriptor + CTAs */}
        <motion.div
          className="mt-14 flex flex-wrap items-end justify-between gap-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.62, duration: 0.7, ease }}
        >
          <p className="max-w-xs text-[13px] leading-relaxed text-white/35">
            Transforming raw JPL spectral data into high-yield financial targets.
            Real-time classification, ROI modeling, mission feasibility scoring.
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 border border-white px-7 py-3.5 font-mono text-[11px] uppercase tracking-widest text-white transition-all duration-200 hover:bg-white hover:text-black"
            >
              Initialize Scanner
              <ArrowDownRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </Link>
            <Link
              href="/analytics"
              className="font-mono text-[11px] uppercase tracking-widest text-white/25 underline underline-offset-4 transition-colors hover:text-white"
            >
              Data Contract
            </Link>
          </div>
        </motion.div>
      </div>

      {/* ── Ticker tape ─────────────────────────────────────────────── */}
      <div className="overflow-hidden border-t border-white/8 py-4">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...TICKER, ...TICKER].map((item, i) => (
            <span
              key={i}
              className="mx-10 font-mono text-[10px] uppercase tracking-[0.3em] text-white/18"
            >
              {item}
              <span className="ml-10 font-bold" style={{ color: '#FF3831' }}>·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
