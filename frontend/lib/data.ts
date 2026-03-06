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
  /** Estimated gross valuation in USD (no market impact) */
  gross_valuation: number;
  /** Market-shock-deflated valuation in USD */
  adjusted_value_usd: number;
  /** Estimated mass in kg */
  estimated_mass_kg: number;
  composition: CompositionEntry[];
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
