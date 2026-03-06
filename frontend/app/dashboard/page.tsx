'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, RefreshCw, ScanSearch, Satellite, ExternalLink } from 'lucide-react';
import { Asteroid } from '@/lib/data';
import { fetchTargets } from '@/lib/api';
import { TargetFinder } from '@/components/target-finder';
import { OrbitalDiagram } from '@/components/orbital-diagram';
import { ErrorBanner } from '@/components/loading-skeleton';

const ease = [0.16, 1, 0.3, 1] as const;

export default function DashboardPage() {
  const [targets, setTargets]           = useState<Asteroid[]>([]);
  const [activeTarget, setActiveTarget] = useState<Asteroid | null>(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);

  async function loadTargets() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTargets();
      setTargets(data);
      if (data.length > 0) setActiveTarget(data[0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadTargets(); }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="border-b border-white/8 px-8 pt-24 pb-6 md:px-14">
        <div className="mx-auto max-w-7xl flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.4em]" style={{ color: '#FF3831' }}>
              — ORBITAL COMMAND CENTER
            </p>
            <h1 className="font-serif text-3xl font-black leading-tight text-white md:text-4xl">
              TARGET ACQUISITION
            </h1>
            <p className="mt-1.5 font-mono text-[11px] text-white/30">
              {loading
                ? 'Connecting to SPECTRAVEIN API…'
                : error
                ? 'Connection failed'
                : `${targets.length} NEO targets indexed · Select a row to load orbital telemetry`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {error && !loading && (
              <button
                onClick={loadTargets}
                className="flex items-center gap-2 border border-red-500/30 px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-red-400 transition hover:bg-red-500/10"
              >
                <RefreshCw className="h-3 w-3" />
                Retry
              </button>
            )}
            <div className="flex items-center gap-2 border border-white/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-white/30">
              {loading ? (
                <><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-400" /> Connecting</>
              ) : error ? (
                <><span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Offline</>
              ) : (
                <><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Live · JPL Horizons</>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && !loading && <ErrorBanner message={error} />}

      {!error && (
        <div className="mx-auto max-w-7xl px-8 py-8 md:px-14">

          {/* ── Wide table ─────────────────────────────────────────── */}
          <TargetFinder
            targets={targets}
            loading={loading}
            selected={activeTarget}
            onSelect={setActiveTarget}
          />

          {/* ── Orbital telemetry panel (shown when a target is selected) ── */}
          <AnimatePresence>
            {activeTarget && !loading && (
              <motion.div
                key={activeTarget.id}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.5, ease }}
                className="mt-10 border-t border-white/8 pt-10"
              >
                <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">

                  {/* Left — orbital diagram */}
                  <div>
                    <div className="mb-4 flex items-center gap-2">
                      <Satellite className="h-3.5 w-3.5 text-white/25" />
                      <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/25">
                        Orbital Telemetry · Heliocentric Projection
                      </p>
                    </div>

                    {/* SVG diagram — grayscale default, color on hover */}
                    <motion.div
                      className="overflow-hidden"
                      initial={false}
                      whileHover={{ filter: 'grayscale(0%) contrast(100%)' }}
                      animate={{ filter: 'grayscale(100%) contrast(120%)' }}
                      transition={{ duration: 0.45 }}
                    >
                      <OrbitalDiagram asteroid={activeTarget} />
                    </motion.div>

                    <p className="mt-2 font-mono text-[9px] text-white/18 uppercase tracking-widest">
                      Hover to reveal spectral colour data
                    </p>

                    {/* JPL external */}
                    <a
                      href={`https://ssd.jpl.nasa.gov/tools/sbdb_asteroids.html?sstr=${encodeURIComponent(activeTarget.id)}&ov=1`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex w-max items-center gap-2 border-b border-white/15 pb-px font-mono text-[10px] uppercase tracking-widest text-white/25 transition-colors hover:text-white"
                    >
                      Open full 3D viewer in NASA JPL
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  {/* Right — summary + deep-analytics CTA */}
                  <div className="flex flex-col gap-6">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.35em] text-white/25">
                        Active Target
                      </p>
                      <h2 className="mt-2 font-serif text-2xl font-black leading-tight text-white md:text-3xl">
                        {activeTarget.full_name}
                      </h2>
                      <p className="mt-1 font-mono text-[10px] text-white/30">
                        {activeTarget.classification}-Type ·&nbsp;
                        {activeTarget.diameter >= 10
                          ? activeTarget.diameter.toFixed(1)
                          : activeTarget.diameter.toFixed(3)} km ·&nbsp;
                        MOID {activeTarget.moid.toFixed(4)} AU
                      </p>
                    </div>

                    {/* Quick stats */}
                    <div className="space-y-3 border-t border-white/8 pt-5">
                      {[
                        { label: 'Inclination',      value: `${activeTarget.inclination.toFixed(2)}°` },
                        { label: 'Accessibility',    value: `${activeTarget.accessibility_score.toFixed(1)} / 100` },
                        { label: 'Classification',   value: `${activeTarget.classification}-Type` },
                        { label: 'Albedo',           value: activeTarget.albedo.toFixed(3) },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between border-b border-white/5 pb-3 last:border-0">
                          <span className="font-mono text-[10px] uppercase tracking-widest text-white/25">{label}</span>
                          <span className="font-mono text-[11px] text-white/60">{value}</span>
                        </div>
                      ))}
                    </div>

                    {/* VIEW DEEP ANALYTICS CTA */}
                    <Link
                      href={`/analytics?id=${encodeURIComponent(activeTarget.id)}`}
                      className="group mt-2 flex items-center justify-between border border-white/20 px-6 py-4 transition-all duration-200 hover:border-white hover:bg-white"
                    >
                      <span className="font-mono text-[11px] uppercase tracking-widest text-white transition-colors group-hover:text-black">
                        View Deep Analytics
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-white transition-colors group-hover:text-black" />
                    </Link>

                    <p className="font-mono text-[9px] text-white/18 uppercase tracking-widest">
                      Full financial model, composition breakdown &amp; ROI analysis
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}
    </main>
  );
}
