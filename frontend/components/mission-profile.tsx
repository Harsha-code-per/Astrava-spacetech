'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Layers, Globe, Compass, Activity, Zap } from 'lucide-react';
import { Asteroid, formatValuation, getClassColors, getClassDescription } from '@/lib/data';
import { CompositionChart } from './composition-chart';

function StatRow({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 py-2 last:border-0">
      <span className="text-xs uppercase tracking-wider text-zinc-600">{label}</span>
      <span className="font-mono text-sm text-zinc-300">
        {value}
        {unit && <span className="ml-1 text-xs text-zinc-600">{unit}</span>}
      </span>
    </div>
  );
}

function AnimatedBar({ value, max, colorClass }: { value: number; max: number; colorClass: string }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <motion.div
        className={`h-full rounded-full ${colorClass}`}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      />
    </div>
  );
}

function scoreColor(s: number) {
  return s >= 80 ? 'text-emerald-400' : s >= 60 ? 'text-amber-400' : s >= 40 ? 'text-orange-400' : 'text-red-400';
}
function scoreBar(s: number) {
  return s >= 80 ? 'bg-emerald-400' : s >= 60 ? 'bg-amber-400' : s >= 40 ? 'bg-orange-400' : 'bg-red-500';
}
function viabilityLabel(s: number) {
  return s >= 80 ? 'PRIME TARGET' : s >= 60 ? 'VIABLE' : s >= 40 ? 'MODERATE' : 'HIGH DELTA-V';
}

/** Glassmorphic panel wrapper */
function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-800/60 bg-black/50 p-5 backdrop-blur-md">
      {children}
    </div>
  );
}

interface Props { asteroid: Asteroid; }

export function MissionProfile({ asteroid }: Props) {
  const c = getClassColors(asteroid.classification);
  const { value: valNum, unit: valUnit } = formatValuation(asteroid.gross_valuation);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div>
        <p className="mb-1 font-mono text-xs uppercase tracking-widest text-cyan-500">— Mission Profile</p>
        <div className="flex flex-wrap items-baseline gap-2">
          <h3 className="text-xl font-black text-white">{asteroid.full_name}</h3>
          <span className={`inline-flex items-center rounded border px-2.5 py-0.5 font-mono text-xs font-bold ${c.bg} ${c.text} ${c.border}`}>
            {asteroid.classification}-TYPE
          </span>
        </div>
        <p className="mt-0.5 text-xs text-zinc-500">{getClassDescription(asteroid.classification)}</p>
      </div>

      {/* ── Panel A: Financials ── */}
      <Panel>
        <div className="mb-4 flex items-center gap-2 text-zinc-500">
          <TrendingUp className="h-3.5 w-3.5 text-yellow-400" />
          <span className="font-mono text-xs uppercase tracking-widest">Gross Valuation</span>
        </div>

        {/* Gold glowing ROI number */}
        <div
          className="font-mono text-5xl font-black leading-none tracking-tight text-yellow-400"
          style={{ textShadow: '0 0 40px rgba(234,179,8,0.55), 0 0 80px rgba(234,179,8,0.2)' }}
        >
          ${valNum}
        </div>
        <div className="mt-1 font-mono text-sm uppercase tracking-widest text-zinc-600">{valUnit}</div>

        <div className="mt-4 space-y-0">
          <StatRow label="Classification" value={`${asteroid.classification}-Type`} />
          <StatRow label="Diameter" value={asteroid.diameter >= 10 ? asteroid.diameter.toFixed(1) : asteroid.diameter.toFixed(3)} unit="km" />
          <StatRow label="Albedo" value={asteroid.albedo.toFixed(3)} />
          <StatRow label="Inclination" value={`${asteroid.inclination.toFixed(2)}°`} />
          <StatRow label="MOID" value={asteroid.moid.toFixed(4)} unit="AU" />
        </div>

        {/* Viability strip */}
        <div className="mt-4 rounded-lg border border-white/5 bg-white/5 p-3">
          <div className="mb-2 flex justify-between">
            <span className="text-xs uppercase tracking-wider text-zinc-500">Mining Viability</span>
            <span className={`font-mono text-xs font-bold ${scoreColor(asteroid.accessibility_score)}`}>
              {viabilityLabel(asteroid.accessibility_score)}
            </span>
          </div>
          <AnimatedBar value={asteroid.accessibility_score} max={100} colorClass={scoreBar(asteroid.accessibility_score)} />
          <div className="mt-1 text-right font-mono text-xs text-zinc-700">{asteroid.accessibility_score}/100</div>
        </div>
      </Panel>

      {/* ── Panel B: Composition ── */}
      <Panel>
        <div className="mb-3 flex items-center gap-2 text-zinc-500">
          <Layers className="h-3.5 w-3.5 text-purple-400" />
          <span className="font-mono text-xs uppercase tracking-widest">Resource Composition</span>
        </div>

        <CompositionChart composition={asteroid.composition} />

        <div className="mt-3 space-y-2">
          {asteroid.composition.map((entry) => (
            <div key={entry.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-xs text-zinc-400">{entry.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1 w-14 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full" style={{ width: `${entry.value}%`, backgroundColor: entry.color }} />
                </div>
                <span className="w-8 text-right font-mono text-xs text-zinc-300">{entry.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* ── Panel C: Orbital Physics ── */}
      <Panel>
        <div className="mb-4 flex items-center gap-2 text-zinc-500">
          <Globe className="h-3.5 w-3.5 text-cyan-400" />
          <span className="font-mono text-xs uppercase tracking-widest">Orbital Physics</span>
        </div>

        <div className="space-y-4">
          {/* Diameter */}
          <div>
            <div className="mb-1.5 flex justify-between">
              <span className="text-xs uppercase tracking-wider text-zinc-600">Diameter</span>
              <span className="font-mono text-xs text-zinc-300">
                {asteroid.diameter >= 10 ? asteroid.diameter.toFixed(1) : asteroid.diameter.toFixed(3)} km
              </span>
            </div>
            <AnimatedBar value={Math.log10(asteroid.diameter + 1)} max={Math.log10(231)} colorClass="bg-blue-500" />
            <p className="mt-1 text-[10px] text-zinc-700">
              {asteroid.diameter < 1 ? 'Sub-km body' : asteroid.diameter < 10 ? 'Small body' : asteroid.diameter < 100 ? 'Medium body' : 'Major body'}
            </p>
          </div>

          {/* Albedo */}
          <div>
            <div className="mb-1.5 flex justify-between">
              <span className="text-xs uppercase tracking-wider text-zinc-600">Albedo</span>
              <span className="font-mono text-xs text-zinc-300">{asteroid.albedo.toFixed(3)}</span>
            </div>
            <AnimatedBar value={asteroid.albedo * 100} max={40} colorClass="bg-yellow-400" />
            <p className="mt-1 text-[10px] text-zinc-700">
              {asteroid.albedo < 0.1 ? 'Very dark surface' : asteroid.albedo < 0.2 ? 'Dark surface' : asteroid.albedo < 0.3 ? 'Moderate reflectivity' : 'High reflectivity'}
            </p>
          </div>

          {/* Inclination */}
          <div>
            <div className="mb-1.5 flex justify-between">
              <span className="flex items-center gap-1 text-xs uppercase tracking-wider text-zinc-600">
                <Compass className="h-3 w-3" /> Inclination
              </span>
              <span className="font-mono text-xs text-zinc-300">{asteroid.inclination.toFixed(2)}°</span>
            </div>
            <AnimatedBar
              value={asteroid.inclination} max={30}
              colorClass={asteroid.inclination < 5 ? 'bg-emerald-400' : asteroid.inclination < 15 ? 'bg-amber-400' : 'bg-red-500'}
            />
            <p className="mt-1 text-[10px] text-zinc-700">
              {asteroid.inclination < 5 ? 'Low delta-v requirement' : asteroid.inclination < 15 ? 'Moderate delta-v' : 'High delta-v — costly intercept'}
            </p>
          </div>

          {/* Earth MOID */}
          <div>
            <div className="mb-1.5 flex justify-between">
              <span className="flex items-center gap-1 text-xs uppercase tracking-wider text-zinc-600">
                <Activity className="h-3 w-3" /> Earth MOID
              </span>
              <span className="font-mono text-xs text-zinc-300">{asteroid.moid.toFixed(4)} AU</span>
            </div>
            <AnimatedBar
              value={Math.max(0, 100 - (asteroid.moid / 0.5) * 100)} max={100}
              colorClass={asteroid.moid < 0.05 ? 'bg-emerald-400' : asteroid.moid < 0.25 ? 'bg-cyan-400' : 'bg-zinc-600'}
            />
            <p className="mt-1 text-[10px] text-zinc-700">
              {asteroid.moid < 0.05 ? 'Earth proximal — NEA' : asteroid.moid < 0.25 ? 'Near-Earth accessible' : 'Main belt — deep space mission'}
            </p>
          </div>

          {/* Accessibility score */}
          <div className="rounded-lg border border-white/5 bg-white/5 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs uppercase tracking-wider text-zinc-500">
                <Zap className="h-3 w-3" /> Accessibility Score
              </span>
              <span className="font-mono text-xl font-black text-white">{asteroid.accessibility_score}</span>
            </div>
            <AnimatedBar value={asteroid.accessibility_score} max={100} colorClass={scoreBar(asteroid.accessibility_score)} />
          </div>
        </div>
      </Panel>
    </div>
  );
}
