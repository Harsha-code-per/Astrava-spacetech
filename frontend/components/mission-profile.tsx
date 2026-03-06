'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, ExternalLink, Zap } from 'lucide-react';
import { Asteroid, getClassColors, getClassDescription } from '@/lib/data';
import { formatUSD } from '@/lib/api';
import { CompositionChart } from './composition-chart';
import { OrbitalDiagram } from './orbital-diagram';

const ease = [0.16, 1, 0.3, 1] as const;

// ── Helpers ─────────────────────────────────────────────────────────────────

function formatMass(kg: number): string {
  if (kg >= 1e18) return `${(kg / 1e18).toFixed(2)} ×10¹⁸ kg`;
  if (kg >= 1e15) return `${(kg / 1e15).toFixed(2)} ×10¹⁵ kg`;
  if (kg >= 1e12) return `${(kg / 1e12).toFixed(2)} ×10¹² kg`;
  if (kg >= 1e9)  return `${(kg / 1e9).toFixed(2)} ×10⁹ kg`;
  return `${kg.toLocaleString()} kg`;
}

function scoreColor(s: number) {
  return s >= 80 ? '#34d399' : s >= 60 ? '#fbbf24' : s >= 40 ? '#fb923c' : '#f87171';
}
function viabilityLabel(s: number) {
  return s >= 80 ? 'PRIME TARGET' : s >= 60 ? 'VIABLE' : s >= 40 ? 'MODERATE' : 'HIGH Δ-V';
}

// Thin horizontal rule section divider
function Divider() {
  return <div className="h-px w-full bg-white/8" />;
}

// Section label
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.35em] text-white/25">
      {children}
    </p>
  );
}

// Animated progress bar
function AnimBar({
  value,
  max,
  color,
  delay = 0,
}: {
  value: number;
  max: number;
  color: string;
  delay?: number;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="h-px w-full bg-white/10">
      <motion.div
        className="h-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1.0, ease, delay }}
      />
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

interface Props { asteroid: Asteroid }

export function MissionProfile({ asteroid }: Props) {
  const [orbitalHovered, setOrbitalHovered] = useState(false);

  const c = getClassColors(asteroid.classification);
  const { value: valNum, unit: valUnit } = formatUSD(asteroid.gross_valuation);
  const { value: adjNum, unit: adjUnit } = formatUSD(asteroid.adjusted_value_usd);
  const deflationPct = asteroid.gross_valuation > 0
    ? (1 - asteroid.adjusted_value_usd / asteroid.gross_valuation) * 100
    : 0;

  const diam = asteroid.diameter >= 10
    ? asteroid.diameter.toFixed(1)
    : asteroid.diameter.toFixed(3);

  return (
    <div className="flex flex-col gap-0 pb-12">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="pb-6">
        <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.35em] text-white/25">
          — Mission Profile
        </p>
        <h2 className="font-serif text-3xl font-black leading-tight text-white">
          {asteroid.full_name}
        </h2>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest ${c.bg} ${c.text} ${c.border}`}
          >
            {asteroid.classification}-TYPE
          </span>
          <span className="text-xs text-white/30">{getClassDescription(asteroid.classification)}</span>
        </div>
      </div>

      <Divider />

      {/* ── Gross Valuation ─────────────────────────────────────────── */}
      <div className="py-8">
        <SectionLabel>Gross Valuation</SectionLabel>

        {/* Massive serif number */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.05 }}
        >
          <div className="flex items-end gap-1 leading-none">
            <span className="font-serif text-[clamp(3.5rem,7vw,5.5rem)] font-black leading-none text-white">
              ${valNum}
            </span>
          </div>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.3em] text-white/30">
            {valUnit} USD
          </p>
        </motion.div>
      </div>

      <Divider />

      {/* ── Post-Shock Valuation ─────────────────────────────────────── */}
      <div className="py-8">
        <div className="mb-4 flex items-center gap-2">
          <TrendingDown className="h-3.5 w-3.5 text-orange-400" />
          <SectionLabel>Post-Shock Valuation · Market Saturation Adjusted</SectionLabel>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.1 }}
        >
          <div className="flex items-end gap-3">
            <span className="font-serif text-[clamp(2rem,5vw,3.5rem)] font-black leading-none text-orange-400">
              ${adjNum}
            </span>
            <span
              className="mb-1 font-mono text-lg font-bold text-orange-400/70"
            >
              −{deflationPct.toFixed(1)}%
            </span>
          </div>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.3em] text-orange-400/40">
            {adjUnit} USD
          </p>
        </motion.div>

        <p className="mt-4 font-mono text-[10px] leading-relaxed text-white/20">
          Flooding commodity markets with {diam} km of material would collapse global prices.
          Logarithmic deflator applied to model real extractable value.
        </p>
      </div>

      <Divider />

      {/* ── Key Stats ───────────────────────────────────────────────── */}
      <div className="py-8">
        <SectionLabel>Physical Parameters</SectionLabel>

        <div className="space-y-5">
          {[
            { label: 'Est. Mass',       value: formatMass(asteroid.estimated_mass_kg) },
            { label: 'Diameter',        value: `${diam} km` },
            { label: 'Albedo',          value: asteroid.albedo.toFixed(3) },
            { label: 'Inclination',     value: `${asteroid.inclination.toFixed(2)}°` },
            { label: 'Earth MOID',      value: `${asteroid.moid.toFixed(4)} AU` },
            { label: 'Classification',  value: `${asteroid.classification}-Type` },
          ].map(({ label, value }, i) => (
            <motion.div
              key={label}
              className="flex items-baseline justify-between border-b border-white/5 pb-3 last:border-0"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, ease, delay: 0.06 * i }}
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/25">{label}</span>
              <span className="font-mono text-sm text-white/80">{value}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <Divider />

      {/* ── Mining Viability ────────────────────────────────────────── */}
      <div className="py-8">
        <SectionLabel>Mining Viability</SectionLabel>

        <div className="flex items-baseline justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-white/40" />
            <span className="font-mono text-xs text-white/40">Accessibility Score</span>
          </div>
          <div className="text-right">
            <span
              className="font-serif text-4xl font-black leading-none"
              style={{ color: scoreColor(asteroid.accessibility_score) }}
            >
              {asteroid.accessibility_score.toFixed(0)}
            </span>
            <span className="ml-1 font-mono text-xs text-white/25">/100</span>
          </div>
        </div>

        <div className="mt-4">
          <AnimBar
            value={asteroid.accessibility_score}
            max={100}
            color={scoreColor(asteroid.accessibility_score)}
          />
        </div>

        <p className="mt-2 font-mono text-[10px] uppercase tracking-widest" style={{ color: scoreColor(asteroid.accessibility_score) }}>
          {viabilityLabel(asteroid.accessibility_score)}
        </p>

        {/* Orbital bars */}
        <div className="mt-6 space-y-4">
          {[
            {
              label: 'Diameter',
              value: Math.log10(asteroid.diameter + 1),
              max: Math.log10(231),
              color: '#a1a1aa',
              desc: diam + ' km',
            },
            {
              label: 'Inclination',
              value: asteroid.inclination,
              max: 30,
              color: asteroid.inclination < 5 ? '#34d399' : asteroid.inclination < 15 ? '#fbbf24' : '#f87171',
              desc: asteroid.inclination.toFixed(2) + '°',
            },
            {
              label: 'Earth MOID',
              value: Math.max(0, 100 - (asteroid.moid / 0.5) * 100),
              max: 100,
              color: asteroid.moid < 0.05 ? '#34d399' : asteroid.moid < 0.25 ? '#22d3ee' : '#52525b',
              desc: asteroid.moid.toFixed(4) + ' AU',
            },
          ].map(({ label, value, max, color, desc }, i) => (
            <div key={label}>
              <div className="mb-2 flex justify-between">
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/25">{label}</span>
                <span className="font-mono text-[10px] text-white/50">{desc}</span>
              </div>
              <AnimBar value={value} max={max} color={color} delay={0.08 * i} />
            </div>
          ))}
        </div>
      </div>

      <Divider />

      {/* ── Resource Composition ────────────────────────────────────── */}
      <div className="py-8">
        <SectionLabel>Resource Composition</SectionLabel>
        <CompositionChart key={asteroid.id} composition={asteroid.composition} />
      </div>

      <Divider />

      {/* ── Orbital Telemetry ────────────────────────────────────────── */}
      <div className="py-8">
        <SectionLabel>Orbital Telemetry · Heliocentric Projection</SectionLabel>

        {/* OrbitalDiagram: grayscale by default, color on hover — matches brutalist aesthetic */}
        <motion.div
          className="overflow-hidden"
          onHoverStart={() => setOrbitalHovered(true)}
          onHoverEnd={() => setOrbitalHovered(false)}
          animate={{ filter: orbitalHovered ? 'grayscale(0%) contrast(100%)' : 'grayscale(100%) contrast(120%)' }}
          transition={{ duration: 0.5 }}
          style={{ filter: 'grayscale(100%) contrast(120%)' }}
        >
          <OrbitalDiagram asteroid={asteroid} />
        </motion.div>

        <p className="mt-2 font-mono text-[9px] uppercase tracking-widest text-white/20">
          Hover to reveal spectral data
        </p>

        {/* JPL external link */}
        <a
          href={`https://ssd.jpl.nasa.gov/tools/sbdb_asteroids.html?sstr=${encodeURIComponent(asteroid.id)}&ov=1`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex w-full items-center justify-between border-t border-white/8 pt-4 font-mono text-[10px] uppercase tracking-widest text-white/25 transition-colors hover:text-white"
        >
          <span>Open NASA JPL Small Body Database</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

    </div>
  );
}
