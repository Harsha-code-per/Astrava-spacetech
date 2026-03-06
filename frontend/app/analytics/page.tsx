'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, TrendingDown, Zap, Compass, Activity } from 'lucide-react';
import { Asteroid, getClassColors, getClassDescription } from '@/lib/data';
import { fetchTargets, formatUSD } from '@/lib/api';
import { CompositionChart } from '@/components/composition-chart';

const ease = [0.16, 1, 0.3, 1] as const;

// ── Helpers ─────────────────────────────────────────────────────────────────

function scoreColor(s: number) {
  return s >= 80 ? '#34d399' : s >= 60 ? '#fbbf24' : s >= 40 ? '#fb923c' : '#f87171';
}
function viabilityLabel(s: number) {
  return s >= 80 ? 'PRIME TARGET' : s >= 60 ? 'VIABLE' : s >= 40 ? 'MODERATE' : 'HIGH Δ-V';
}
function formatMass(kg: number): string {
  if (kg >= 1e18) return `${(kg / 1e18).toFixed(2)} ×10¹⁸ kg`;
  if (kg >= 1e15) return `${(kg / 1e15).toFixed(2)} ×10¹⁵ kg`;
  if (kg >= 1e12) return `${(kg / 1e12).toFixed(2)} ×10¹² kg`;
  if (kg >= 1e9)  return `${(kg / 1e9).toFixed(2)} ×10⁹ kg`;
  return `${kg.toLocaleString()} kg`;
}

// Animated 1px progress bar
function AnimBar({
  value, max, color, delay = 0,
}: { value: number; max: number; color: string; delay?: number }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="h-px w-full bg-white/10">
      <motion.div
        className="h-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1.1, ease, delay }}
      />
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full bg-white/8" />;
}

// ── Loading skeleton ─────────────────────────────────────────────────────────

function AnalyticsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10 md:px-14">
      <div className="grid gap-16 lg:grid-cols-2">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-px animate-pulse bg-white/6" />
          ))}
          <div className="mx-auto mt-8 h-52 w-52 animate-pulse rounded-full bg-white/4" />
        </div>
        <div className="space-y-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-px animate-pulse bg-white/6" />
              <div className="flex justify-between pt-1">
                <div className="h-2 animate-pulse rounded-full bg-white/6" style={{ width: `${25 + i * 9}%` }} />
                <div className="h-2 w-14 animate-pulse rounded-full bg-white/6" />
              </div>
            </div>
          ))}
          <div className="h-20 w-3/4 animate-pulse rounded bg-white/4" />
        </div>
      </div>
    </div>
  );
}

// ── Main inner component (needs searchParams) ────────────────────────────────

function AnalyticsContent() {
  const searchParams = useSearchParams();
  const targetId     = searchParams.get('id');

  const [asteroid, setAsteroid] = useState<Asteroid | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await fetchTargets();
        if (targetId) {
          const found = data.find((a) => a.id === targetId) ?? data[0];
          setAsteroid(found ?? null);
        } else {
          setAsteroid(data[0] ?? null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [targetId]);

  const backHref = asteroid
    ? `/dashboard?highlight=${encodeURIComponent(asteroid.id)}`
    : '/dashboard';

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── Fixed back button + header ─────────────────────────────── */}
      <div className="border-b border-white/8 px-8 pt-24 pb-6 md:px-14">
        <div className="mx-auto max-w-7xl">

          {/* Back link */}
          <Link
            href="/dashboard"
            className="group mb-6 flex w-max items-center gap-2 font-mono text-[10px] uppercase tracking-[0.35em] text-white/30 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
            Back to Orbital Tracking
          </Link>

          {loading ? (
            <div className="space-y-2">
              <div className="h-3 w-24 animate-pulse rounded bg-white/8" />
              <div className="h-8 w-64 animate-pulse rounded bg-white/8" />
            </div>
          ) : asteroid ? (
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.4em]" style={{ color: '#FF3831' }}>
                  — Deep Financial Analysis
                </p>
                <h1 className="font-serif text-3xl font-black leading-tight text-white md:text-4xl">
                  {asteroid.full_name}
                </h1>
                <p className="mt-1.5 font-mono text-[10px] text-white/30">
                  {getClassDescription(asteroid.classification)}
                </p>
              </div>
              {/* Class badge */}
              <span
                className={`border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest
                  ${getClassColors(asteroid.classification).bg}
                  ${getClassColors(asteroid.classification).text}
                  ${getClassColors(asteroid.classification).border}`}
              >
                {asteroid.classification}-TYPE
              </span>
            </div>
          ) : null}
        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────────────── */}
      {error && (
        <div className="mx-auto max-w-7xl px-8 py-10 md:px-14">
          <p className="font-mono text-sm text-red-400">{error}</p>
        </div>
      )}

      {loading && <AnalyticsSkeleton />}

      {!loading && !error && asteroid && (
        <AnimatePresence mode="wait">
          <motion.div
            key={asteroid.id}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease }}
            className="mx-auto max-w-7xl px-8 py-12 md:px-14"
          >
            {/* ── 2-column deep-dive grid ──────────────────────────── */}
            <div className="grid gap-16 lg:grid-cols-2 lg:items-start">

              {/* ════ LEFT — Composition chart ════ */}
              <div>
                <p className="mb-6 font-mono text-[9px] uppercase tracking-[0.4em] text-white/25">
                  Resource Composition · {asteroid.classification}-Type Profile
                </p>

                {/* Large donut — re-keyed so it animates on every selection */}
                <CompositionChart key={asteroid.id} composition={asteroid.composition} />

                <Divider />

                {/* Composition legend detail */}
                <div className="mt-8 space-y-5">
                  {asteroid.composition.map((entry, i) => (
                    <motion.div
                      key={entry.label}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.45, ease, delay: 0.08 * i }}
                    >
                      <div className="mb-2 flex justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                          {entry.label}
                        </span>
                        <span className="font-mono text-[11px] font-bold text-white/80">
                          {entry.value}%
                        </span>
                      </div>
                      <AnimBar value={entry.value} max={100} color={entry.color} delay={0.1 + i * 0.06} />
                    </motion.div>
                  ))}
                </div>

                {/* Est. mass */}
                <div className="mt-10 border-t border-white/8 pt-8">
                  <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/25">
                    Estimated Mass
                  </p>
                  <p className="mt-2 font-serif text-2xl font-black text-white">
                    {formatMass(asteroid.estimated_mass_kg)}
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-white/25">
                    Diameter: {asteroid.diameter >= 10 ? asteroid.diameter.toFixed(1) : asteroid.diameter.toFixed(3)} km · Albedo: {asteroid.albedo.toFixed(3)}
                  </p>
                </div>
              </div>

              {/* ════ RIGHT — Financials + physics ════ */}
              <div className="flex flex-col gap-0">

                {/* Gross valuation — massive serif */}
                <div className="pb-8">
                  <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.4em] text-white/25">
                    Gross Valuation
                  </p>
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease, delay: 0.05 }}
                  >
                    <div className="font-serif font-black leading-none text-white"
                      style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
                    >
                      ${formatUSD(asteroid.gross_valuation).value}
                    </div>
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.35em] text-white/30">
                      {formatUSD(asteroid.gross_valuation).unit}
                    </p>
                  </motion.div>
                </div>

                <Divider />

                {/* Post-shock valuation */}
                <div className="py-8">
                  <div className="mb-4 flex items-center gap-2">
                    <TrendingDown className="h-3.5 w-3.5 text-orange-400" />
                    <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-orange-400/60">
                      Post-Shock Valuation · Market Saturation Adjusted
                    </p>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease, delay: 0.12 }}
                  >
                    <div className="flex flex-wrap items-end gap-4">
                      <div className="font-serif font-black leading-none text-orange-400"
                        style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)' }}
                      >
                        ${formatUSD(asteroid.adjusted_value_usd).value}
                      </div>
                      <span className="mb-1 font-serif text-2xl font-black text-orange-400/60">
                        −{asteroid.gross_valuation > 0
                          ? ((1 - asteroid.adjusted_value_usd / asteroid.gross_valuation) * 100).toFixed(1)
                          : '0.0'}%
                      </span>
                    </div>
                    <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.35em] text-orange-400/35">
                      {formatUSD(asteroid.adjusted_value_usd).unit}
                    </p>
                  </motion.div>
                  <p className="mt-5 font-mono text-[10px] leading-relaxed text-white/20">
                    Logarithmic market shock penalty applied. Flooding supply crashes commodity prices —
                    adjusted value reflects real, phased extraction economics.
                  </p>
                </div>

                <Divider />

                {/* Accessibility score */}
                <div className="py-8">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-3.5 w-3.5 text-white/25" />
                      <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/25">
                        Mining Viability
                      </p>
                    </div>
                    <span
                      className="font-mono text-[10px] uppercase tracking-widest font-bold"
                      style={{ color: scoreColor(asteroid.accessibility_score) }}
                    >
                      {viabilityLabel(asteroid.accessibility_score)}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-3 mb-5">
                    <span
                      className="font-serif text-[clamp(2.5rem,5vw,4rem)] font-black leading-none"
                      style={{ color: scoreColor(asteroid.accessibility_score) }}
                    >
                      {asteroid.accessibility_score.toFixed(0)}
                    </span>
                    <span className="font-mono text-sm text-white/25">/ 100</span>
                  </div>
                  <AnimBar
                    value={asteroid.accessibility_score}
                    max={100}
                    color={scoreColor(asteroid.accessibility_score)}
                  />
                </div>

                <Divider />

                {/* Orbital physics bars */}
                <div className="py-8">
                  <p className="mb-6 font-mono text-[9px] uppercase tracking-[0.4em] text-white/25">
                    Orbital Mechanics
                  </p>

                  <div className="space-y-7">
                    {/* Inclination */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-white/30">
                          <Compass className="h-3 w-3" />
                          Inclination
                        </span>
                        <span className="font-mono text-[11px] text-white/60">
                          {asteroid.inclination.toFixed(2)}°
                        </span>
                      </div>
                      <AnimBar
                        value={asteroid.inclination}
                        max={30}
                        color={asteroid.inclination < 5 ? '#34d399' : asteroid.inclination < 15 ? '#fbbf24' : '#f87171'}
                        delay={0.05}
                      />
                      <p className="mt-1.5 font-mono text-[9px] text-white/20">
                        {asteroid.inclination < 5 ? 'Low delta-v requirement' : asteroid.inclination < 15 ? 'Moderate delta-v' : 'High delta-v — costly intercept'}
                      </p>
                    </div>

                    {/* Earth MOID */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-white/30">
                          <Activity className="h-3 w-3" />
                          Earth MOID
                        </span>
                        <span className="font-mono text-[11px] text-white/60">
                          {asteroid.moid.toFixed(4)} AU
                        </span>
                      </div>
                      <AnimBar
                        value={Math.max(0, 100 - (asteroid.moid / 0.5) * 100)}
                        max={100}
                        color={asteroid.moid < 0.05 ? '#34d399' : asteroid.moid < 0.25 ? '#22d3ee' : '#52525b'}
                        delay={0.1}
                      />
                      <p className="mt-1.5 font-mono text-[9px] text-white/20">
                        {asteroid.moid < 0.05 ? 'Earth proximal — NEA' : asteroid.moid < 0.25 ? 'Near-Earth accessible' : 'Main belt — deep space mission'}
                      </p>
                    </div>

                    {/* Diameter */}
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">
                          Diameter
                        </span>
                        <span className="font-mono text-[11px] text-white/60">
                          {asteroid.diameter >= 10 ? asteroid.diameter.toFixed(1) : asteroid.diameter.toFixed(3)} km
                        </span>
                      </div>
                      <AnimBar
                        value={Math.log10(asteroid.diameter + 1)}
                        max={Math.log10(231)}
                        color="#a1a1aa"
                        delay={0.15}
                      />
                      <p className="mt-1.5 font-mono text-[9px] text-white/20">
                        {asteroid.diameter < 1 ? 'Sub-km body' : asteroid.diameter < 10 ? 'Small body' : asteroid.diameter < 100 ? 'Medium body' : 'Major body'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Back CTA */}
                <div className="pt-4">
                  <Link
                    href="/dashboard"
                    className="group flex items-center gap-2 border-t border-white/8 pt-6 font-mono text-[10px] uppercase tracking-[0.35em] text-white/25 transition-colors hover:text-white"
                  >
                    <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
                    Back to Orbital Tracking
                  </Link>
                </div>

              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

    </main>
  );
}

// ── Suspense boundary required by useSearchParams ────────────────────────────

export default function AnalyticsPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#0a0a0a] text-white pt-24">
        <AnalyticsSkeleton />
      </main>
    }>
      <AnalyticsContent />
    </Suspense>
  );
}
