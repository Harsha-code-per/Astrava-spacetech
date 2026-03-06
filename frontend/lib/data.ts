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
  /** Total mission CapEx in USD (base + inclination + distance penalties) */
  mission_cost_usd: number;
  /** Net profit in USD = adjusted_value_usd − mission_cost_usd (can be negative) */
  net_profit_usd: number;
  /** Estimated CO2 equivalent (tons) avoided vs Earth-based terrestrial mining */
  earth_co2_offset_tons: number;
  /** Semi-major axis in AU — needed for orbital orrery geometry */
  semi_major_axis_au: number;
  /** Orbital eccentricity (0 = circular, 1 = parabolic) */
  eccentricity: number;
  /** Predicted optimal launch window, e.g. "OCT 2028" */
  next_pass_date: string;
  /** Plain-English AI-generated mission briefing */
  xai_summary: string;
  /** Potentially Hazardous Asteroid flag from JPL dataset */
  pha: boolean;
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
