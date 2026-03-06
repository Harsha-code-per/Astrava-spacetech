/**
 * lib/api.ts
 * Thin client for the SPECTRAVEIN FastAPI backend.
 * Converts raw API responses into the Asteroid shape used by all UI components.
 */

import { Asteroid, AsteroidClass, CompositionEntry } from './data';

// ── API response shape (mirrors the Pydantic model in main.py) ───────────────

export interface ApiTarget {
  id: string;
  full_name: string;
  diameter_km: number;
  albedo: number;
  inclination: number;
  moid: number;
  spectral_class: string;
  accessibility_score: number;
  estimated_mass_kg: number;
  estimated_value_usd: number;
  adjusted_value_usd: number;
}

// ── Composition templates by spectral class ───────────────────────────────────
// The backend does not return element breakdown, so we derive it from the class.

const COMPOSITION_TEMPLATES: Record<AsteroidClass, CompositionEntry[]> = {
  C: [
    { label: 'Water Ice',    value: 38, color: '#22d3ee' },
    { label: 'Carbon Cpds', value: 32, color: '#64748b' },
    { label: 'Silicates',   value: 22, color: '#a78bfa' },
    { label: 'Organics',    value: 8,  color: '#4ade80' },
  ],
  S: [
    { label: 'Iron',     value: 42, color: '#f59e0b' },
    { label: 'Nickel',   value: 28, color: '#fbbf24' },
    { label: 'Silicate', value: 22, color: '#78716c' },
    { label: 'PGMs',     value: 8,  color: '#cbd5e1' },
  ],
  M: [
    { label: 'Iron',   value: 38, color: '#ef4444' },
    { label: 'Nickel', value: 30, color: '#f97316' },
    { label: 'Cobalt', value: 12, color: '#f59e0b' },
    { label: 'PGMs',   value: 15, color: '#cbd5e1' },
    { label: 'Gold',   value: 5,  color: '#fde68a' },
  ],
};

// ── Value formatter ────────────────────────────────────────────────────────────

export function formatUSD(usd: number): { value: string; unit: string } {
  if (usd >= 1e18) return { value: (usd / 1e18).toFixed(2), unit: 'Quintillion USD' };
  if (usd >= 1e15) return { value: (usd / 1e15).toFixed(2), unit: 'Quadrillion USD' };
  if (usd >= 1e12) return { value: (usd / 1e12).toFixed(2), unit: 'Trillion USD' };
  if (usd >= 1e9)  return { value: (usd / 1e9).toFixed(2),  unit: 'Billion USD' };
  return { value: usd.toLocaleString(), unit: 'USD' };
}

export function formatUSDShort(usd: number): string {
  if (usd >= 1e18) return `$${(usd / 1e18).toFixed(1)}Qn`;
  if (usd >= 1e15) return `$${(usd / 1e15).toFixed(1)}Qd`;
  if (usd >= 1e12) return `$${(usd / 1e12).toFixed(1)}Tn`;
  if (usd >= 1e9)  return `$${(usd / 1e9).toFixed(1)}Bn`;
  return `$${usd.toLocaleString()}`;
}

// ── Adapter: ApiTarget → Asteroid ─────────────────────────────────────────────

export function apiTargetToAsteroid(t: ApiTarget): Asteroid {
  const cls = (['C', 'S', 'M'].includes(t.spectral_class)
    ? t.spectral_class
    : 'S') as AsteroidClass;

  return {
    id: t.id,
    full_name: t.full_name,
    classification: cls,
    moid: t.moid,
    inclination: t.inclination,
    diameter: t.diameter_km,
    albedo: t.albedo,
    accessibility_score: t.accessibility_score,
    gross_valuation: t.estimated_value_usd,
    adjusted_value_usd: t.adjusted_value_usd,
    estimated_mass_kg: t.estimated_mass_kg,
    composition: COMPOSITION_TEMPLATES[cls],
  };
}

// ── Fetch function ─────────────────────────────────────────────────────────────

const API_URL = 'http://localhost:8000/api/targets';

export async function fetchTargets(): Promise<Asteroid[]> {
  const res = await fetch(API_URL, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }
  const raw: ApiTarget[] = await res.json();
  return raw.map(apiTargetToAsteroid);
}
