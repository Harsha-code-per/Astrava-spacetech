export type AsteroidClass = 'C' | 'S' | 'M';

export interface CompositionEntry {
  label: string;
  value: number;
  color: string;
}

export interface Asteroid {
  id: string;
  full_name: string;
  classification: AsteroidClass;
  /** Minimum Orbit Intersection Distance in AU */
  moid: number;
  /** Orbital inclination in degrees */
  inclination: number;
  /** Diameter in km */
  diameter: number;
  /** Albedo (0–1 reflectivity) */
  albedo: number;
  /** Accessibility score 0–100 derived from moid + inclination */
  accessibility_score: number;
  /** Estimated gross valuation in USD */
  gross_valuation: number;
  composition: CompositionEntry[];
}

export const ASTEROIDS: Asteroid[] = [
  {
    id: '16-psyche',
    full_name: '16 Psyche',
    classification: 'M',
    moid: 1.026,
    inclination: 3.09,
    diameter: 226,
    albedo: 0.12,
    accessibility_score: 34,
    gross_valuation: 1e19,
    composition: [
      { label: 'Iron', value: 38, color: '#ef4444' },
      { label: 'Nickel', value: 30, color: '#f97316' },
      { label: 'Cobalt', value: 12, color: '#f59e0b' },
      { label: 'PGMs', value: 15, color: '#cbd5e1' },
      { label: 'Gold', value: 5, color: '#fde68a' },
    ],
  },
  {
    id: '1986-da',
    full_name: '1986 DA',
    classification: 'M',
    moid: 0.203,
    inclination: 4.32,
    diameter: 2.3,
    albedo: 0.14,
    accessibility_score: 71,
    gross_valuation: 1.3e16,
    composition: [
      { label: 'Iron', value: 40, color: '#ef4444' },
      { label: 'Nickel', value: 32, color: '#f97316' },
      { label: 'Cobalt', value: 10, color: '#f59e0b' },
      { label: 'PGMs', value: 12, color: '#cbd5e1' },
      { label: 'Gold', value: 6, color: '#fde68a' },
    ],
  },
  {
    id: '3554-amun',
    full_name: '3554 Amun',
    classification: 'M',
    moid: 0.118,
    inclination: 3.07,
    diameter: 2.2,
    albedo: 0.15,
    accessibility_score: 78,
    gross_valuation: 8e15,
    composition: [
      { label: 'Iron', value: 36, color: '#ef4444' },
      { label: 'Nickel', value: 28, color: '#f97316' },
      { label: 'Cobalt', value: 14, color: '#f59e0b' },
      { label: 'PGMs', value: 17, color: '#cbd5e1' },
      { label: 'Gold', value: 5, color: '#fde68a' },
    ],
  },
  {
    id: '2011-uw158',
    full_name: '2011 UW158',
    classification: 'M',
    moid: 0.078,
    inclination: 2.79,
    diameter: 0.6,
    albedo: 0.13,
    accessibility_score: 84,
    gross_valuation: 3.5e15,
    composition: [
      { label: 'Iron', value: 35, color: '#ef4444' },
      { label: 'Nickel', value: 28, color: '#f97316' },
      { label: 'Cobalt', value: 15, color: '#f59e0b' },
      { label: 'PGMs', value: 16, color: '#cbd5e1' },
      { label: 'Gold', value: 6, color: '#fde68a' },
    ],
  },
  {
    id: '433-eros',
    full_name: '433 Eros',
    classification: 'S',
    moid: 0.149,
    inclination: 10.83,
    diameter: 16.84,
    albedo: 0.25,
    accessibility_score: 72,
    gross_valuation: 1.14e13,
    composition: [
      { label: 'Iron', value: 42, color: '#f59e0b' },
      { label: 'Nickel', value: 28, color: '#fbbf24' },
      { label: 'Silicates', value: 22, color: '#78716c' },
      { label: 'PGMs', value: 8, color: '#cbd5e1' },
    ],
  },
  {
    id: '25143-itokawa',
    full_name: '25143 Itokawa',
    classification: 'S',
    moid: 0.014,
    inclination: 1.62,
    diameter: 0.535,
    albedo: 0.23,
    accessibility_score: 92,
    gross_valuation: 2.2e12,
    composition: [
      { label: 'Iron', value: 38, color: '#f59e0b' },
      { label: 'Nickel', value: 25, color: '#fbbf24' },
      { label: 'Silicates', value: 30, color: '#78716c' },
      { label: 'PGMs', value: 7, color: '#cbd5e1' },
    ],
  },
  {
    id: '1036-ganymed',
    full_name: '1036 Ganymed',
    classification: 'S',
    moid: 0.229,
    inclination: 26.66,
    diameter: 31.66,
    albedo: 0.24,
    accessibility_score: 41,
    gross_valuation: 6.8e13,
    composition: [
      { label: 'Iron', value: 40, color: '#f59e0b' },
      { label: 'Nickel', value: 26, color: '#fbbf24' },
      { label: 'Silicates', value: 26, color: '#78716c' },
      { label: 'PGMs', value: 8, color: '#cbd5e1' },
    ],
  },
  {
    id: '4179-toutatis',
    full_name: '4179 Toutatis',
    classification: 'S',
    moid: 0.006,
    inclination: 0.45,
    diameter: 2.5,
    albedo: 0.13,
    accessibility_score: 89,
    gross_valuation: 3.9e12,
    composition: [
      { label: 'Iron', value: 39, color: '#f59e0b' },
      { label: 'Nickel', value: 27, color: '#fbbf24' },
      { label: 'Silicates', value: 25, color: '#78716c' },
      { label: 'PGMs', value: 9, color: '#cbd5e1' },
    ],
  },
  {
    id: '1620-geographos',
    full_name: '1620 Geographos',
    classification: 'S',
    moid: 0.031,
    inclination: 13.34,
    diameter: 2.56,
    albedo: 0.33,
    accessibility_score: 74,
    gross_valuation: 4.3e12,
    composition: [
      { label: 'Iron', value: 44, color: '#f59e0b' },
      { label: 'Nickel', value: 26, color: '#fbbf24' },
      { label: 'Silicates', value: 22, color: '#78716c' },
      { label: 'PGMs', value: 8, color: '#cbd5e1' },
    ],
  },
  {
    id: '101955-bennu',
    full_name: '101955 Bennu',
    classification: 'C',
    moid: 0.003,
    inclination: 6.03,
    diameter: 0.492,
    albedo: 0.044,
    accessibility_score: 95,
    gross_valuation: 6.7e11,
    composition: [
      { label: 'Water Ice', value: 38, color: '#22d3ee' },
      { label: 'Carbon Cpds', value: 32, color: '#64748b' },
      { label: 'Silicates', value: 22, color: '#a78bfa' },
      { label: 'Organics', value: 8, color: '#4ade80' },
    ],
  },
  {
    id: '162173-ryugu',
    full_name: '162173 Ryugu',
    classification: 'C',
    moid: 0.001,
    inclination: 5.88,
    diameter: 0.9,
    albedo: 0.045,
    accessibility_score: 97,
    gross_valuation: 8.9e11,
    composition: [
      { label: 'Water Ice', value: 35, color: '#22d3ee' },
      { label: 'Carbon Cpds', value: 35, color: '#64748b' },
      { label: 'Silicates', value: 20, color: '#a78bfa' },
      { label: 'Organics', value: 10, color: '#4ade80' },
    ],
  },
  {
    id: '253-mathilde',
    full_name: '253 Mathilde',
    classification: 'C',
    moid: 0.356,
    inclination: 6.71,
    diameter: 52.8,
    albedo: 0.043,
    accessibility_score: 47,
    gross_valuation: 1.8e14,
    composition: [
      { label: 'Water Ice', value: 40, color: '#22d3ee' },
      { label: 'Carbon Cpds', value: 28, color: '#64748b' },
      { label: 'Silicates', value: 24, color: '#a78bfa' },
      { label: 'Organics', value: 8, color: '#4ade80' },
    ],
  },
];

export function formatValuation(usd: number): { value: string; unit: string } {
  if (usd >= 1e18) return { value: (usd / 1e18).toFixed(2), unit: 'Quintillion USD' };
  if (usd >= 1e15) return { value: (usd / 1e15).toFixed(2), unit: 'Quadrillion USD' };
  if (usd >= 1e12) return { value: (usd / 1e12).toFixed(2), unit: 'Trillion USD' };
  if (usd >= 1e9) return { value: (usd / 1e9).toFixed(2), unit: 'Billion USD' };
  return { value: usd.toLocaleString(), unit: 'USD' };
}

export function formatValuationShort(usd: number): string {
  if (usd >= 1e18) return `$${(usd / 1e18).toFixed(1)}Qn`;
  if (usd >= 1e15) return `$${(usd / 1e15).toFixed(1)}Qd`;
  if (usd >= 1e12) return `$${(usd / 1e12).toFixed(1)}Tn`;
  if (usd >= 1e9) return `$${(usd / 1e9).toFixed(1)}Bn`;
  return `$${usd.toLocaleString()}`;
}

export function getClassColors(cls: AsteroidClass) {
  switch (cls) {
    case 'C':
      return { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/40', accent: '#22d3ee' };
    case 'S':
      return { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/40', accent: '#f59e0b' };
    case 'M':
      return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/40', accent: '#ef4444' };
  }
}

export function getClassDescription(cls: AsteroidClass): string {
  switch (cls) {
    case 'C':
      return 'Carbonaceous — Rich in water ice, organics & volatiles. High scientific value.';
    case 'S':
      return 'Silicaceous — Iron-nickel silicate matrix. Viable PGM extraction target.';
    case 'M':
      return 'Metallic — Pure iron-nickel core with platinum group metals. Highest ROI class.';
  }
}
