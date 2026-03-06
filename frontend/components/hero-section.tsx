'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const easeOut = [0.16, 1, 0.3, 1] as const;

const MARQUEE_ITEMS = [
  'ASTEROID CLASSIFICATION',
  'MINING POTENTIAL',
  'SPECTRAL ANALYSIS',
  'DELTA-V ACCESSIBILITY',
  'JPL HORIZONS DATA',
  'ORBITAL MECHANICS',
  'RESOURCE EXTRACTION',
  'ROI MODELING',
  'MISSION FEASIBILITY',
  'NEAR-EARTH OBJECTS',
  'SPECTRAL IMAGING',
  'PLATINUM GROUP METALS',
];

export function HeroSection() {
  const scrollToDashboard = () => {
    document.getElementById('command-dashboard')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative flex h-screen flex-col overflow-hidden">
      {/* ── Video background ── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/asteroid-bg.mp4" type="video/mp4" />
      </video>

      {/* ── Gradient overlay: transparent top → solid black bottom ── */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/65 to-black" />

      {/* ── All foreground content (above video) ── */}
      <div className="relative z-10 flex flex-1 flex-col">

        {/* Navigation */}
        <nav className="flex items-center justify-between px-6 py-5 md:px-12">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="SPECTRAVEIN"
              width={42}
              height={42}
              className="rounded-full ring-2 ring-cyan-500/50 shadow-[0_0_18px_rgba(34,211,238,0.4)]"
            />
            <span className="font-mono text-sm font-bold uppercase tracking-[0.22em] text-white">
              SPECTRAVEIN
            </span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            {['TARGETS', 'ANALYTICS', 'CONTRACTS'].map((item) => (
              <button
                key={item}
                onClick={scrollToDashboard}
                className="font-mono text-xs uppercase tracking-widest text-zinc-400 transition-colors hover:text-cyan-400"
              >
                {item}
              </button>
            ))}
          </div>
        </nav>

        {/* Hero content */}
        <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
          {/* Status badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-emerald-400">
              SYSTEM STATUS: ONLINE
            </span>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: easeOut, delay: 0.2 }}
            className="text-5xl font-black uppercase leading-[0.95] tracking-tight text-white md:text-7xl lg:text-8xl xl:text-[6.5rem]"
          >
            ORBITAL MINING
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-yellow-300 to-red-400 bg-clip-text text-transparent">
              INTELLIGENCE
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: easeOut, delay: 0.42 }}
            className="mt-6 max-w-lg text-sm leading-relaxed text-zinc-400 md:text-base"
          >
            Transforming raw JPL spectral data into high-yield financial targets.
            Real-time classification · ROI modeling · Mission feasibility scoring.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.6 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-4"
          >
            <button
              onClick={scrollToDashboard}
              className="rounded-full bg-white px-8 py-3.5 text-sm font-bold uppercase tracking-[0.15em] text-black transition-all duration-300 hover:bg-zinc-200 hover:shadow-[0_0_40px_rgba(255,255,255,0.35)]"
            >
              Initialize Scanner
            </button>
            <button
              onClick={scrollToDashboard}
              className="rounded-full border border-white/35 bg-white/10 px-8 py-3.5 text-sm font-bold uppercase tracking-[0.15em] text-white backdrop-blur-sm transition-all duration-300 hover:border-white/55 hover:bg-white/20"
            >
              View Data Contract
            </button>
          </motion.div>

          {/* Scroll cue */}
          <motion.div
            className="mt-14 flex flex-col items-center gap-1 text-zinc-600"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </div>

        {/* ── Marquee ticker ── */}
        <div className="overflow-hidden border-t border-white/10 bg-black/65 py-3 backdrop-blur-sm">
          {/* Single div containing doubled content → translateX(-50%) loops seamlessly */}
          <div className="flex w-max animate-marquee">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span
                key={i}
                className="flex items-center whitespace-nowrap font-mono text-xs uppercase tracking-widest text-zinc-500"
              >
                <span className="px-5">{item}</span>
                <span className="text-cyan-500/60">◆</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
