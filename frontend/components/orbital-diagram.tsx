'use client';

/**
 * OrbitalDiagram
 * SVG-based 2D top-down orbital visualization derived from real orbital elements.
 * Renders: Sun, Earth orbit, asteroid orbit (sized by semi-major axis approximation),
 * inclination tilt, MOID proximity indicator, and animated asteroid position.
 */

import { motion } from 'framer-motion';
import { Asteroid, getClassColors } from '@/lib/data';

interface Props {
  asteroid: Asteroid;
}

const CX = 160;  // SVG centre x
const CY = 160;  // SVG centre y

/** Map AU value to SVG pixels (1 AU ≈ 70px) */
function au(value: number) {
  return value * 70;
}

/** Approximate NEO semi-major axis from MOID + inclination heuristic.
 *  Real NEOs cluster 0.9–2.5 AU; we bias toward 1.2 + moid for visual spread. */
function semiMajor(moid: number): number {
  return Math.min(2.2, 1.15 + moid * 1.8);
}

/** Eccentricity heuristic — NEOs are typically eccentric */
function eccentricity(moid: number, sma: number): number {
  const perihelion = Math.max(0.05, sma - moid - 0.05);
  return Math.min(0.92, 1 - perihelion / sma);
}

export function OrbitalDiagram({ asteroid }: Props) {
  const c = getClassColors(asteroid.classification);

  // Orbital parameters
  const sma = semiMajor(asteroid.moid);        // semi-major axis in AU
  const ecc = eccentricity(asteroid.moid, sma); // eccentricity
  const smb = sma * Math.sqrt(1 - ecc * ecc);  // semi-minor axis in AU
  const focusOffset = sma * ecc;               // focus offset from centre

  // SVG sizes (px)
  const smaP = au(sma);
  const smbP = au(smb);
  const focusP = au(focusOffset);
  const earthR = au(1.0);     // Earth orbit radius
  const moidPx = au(asteroid.moid); // MOID distance in px

  // Inclination tilt applied as CSS skewY (visual only, not true 3D projection)
  const tiltDeg = Math.min(asteroid.inclination * 0.6, 45);

  // Ellipse centre (Sun at one focus) — shift so Sun stays at CX,CY
  const ellipseCX = CX - focusP;

  // Asteroid body size (log-scaled)
  const bodyR = Math.max(3, Math.min(9, 3 + Math.log10(asteroid.diameter + 1) * 2.5));

  // Perihelion position (closest point to Sun, rightmost tip of ellipse)
  const perihelionX = ellipseCX + smaP;
  const perihelionY = CY;

  return (
    <div className="relative overflow-hidden rounded-md border border-zinc-800 bg-black">
      {/* Grid overlay for "mission terminal" feel */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <svg
        viewBox="0 0 320 320"
        width="100%"
        height="100%"
        style={{ display: 'block', aspectRatio: '1 / 1' }}
      >
        {/* ── Background stars ── */}
        {[
          [20, 30], [60, 15], [100, 45], [150, 8], [200, 25], [260, 40], [290, 12],
          [15, 80], [50, 110], [85, 75], [130, 95], [180, 60], [230, 85], [285, 70],
          [10, 160], [45, 200], [80, 230], [140, 180], [210, 210], [270, 175], [305, 220],
          [25, 270], [70, 295], [115, 255], [165, 290], [220, 270], [260, 305], [300, 260],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={0.6 + (i % 3) * 0.4} fill="white" opacity={0.15 + (i % 4) * 0.1} />
        ))}

        {/* ── Legend (top-left) ── */}
        <text x="8" y="14" fill="#52525b" fontSize="6" fontFamily="monospace">ORBITAL MECHANICS · HELIOCENTRIC VIEW</text>
        <text x="8" y="22" fill="#3f3f46" fontSize="5.5" fontFamily="monospace">
          {`SMA: ${sma.toFixed(2)} AU  ECC: ${ecc.toFixed(2)}  INC: ${asteroid.inclination.toFixed(1)}°  MOID: ${asteroid.moid.toFixed(4)} AU`}
        </text>

        {/* ── Earth orbit ── */}
        <circle
          cx={CX} cy={CY} r={earthR}
          fill="none" stroke="#22d3ee" strokeWidth="0.6" strokeDasharray="3 3" opacity="0.5"
        />
        {/* Earth label */}
        <circle cx={CX + earthR} cy={CY} r={3} fill="#22d3ee" opacity="0.7" />
        <text x={CX + earthR + 5} y={CY + 4} fill="#22d3ee" fontSize="6" fontFamily="monospace" opacity="0.7">EARTH</text>

        {/* ── Mars orbit (reference) ── */}
        <circle
          cx={CX} cy={CY} r={au(1.52)}
          fill="none" stroke="#dc2626" strokeWidth="0.4" strokeDasharray="2 5" opacity="0.2"
        />
        <text x={CX + au(1.52) + 3} y={CY - 3} fill="#dc2626" fontSize="5" fontFamily="monospace" opacity="0.3">MARS</text>

        {/* ── Asteroid orbit (inclined ellipse) ── */}
        <g style={{ transform: `rotate(${tiltDeg * 0.5}deg)`, transformOrigin: `${CX}px ${CY}px` }}>
          <ellipse
            cx={ellipseCX} cy={CY}
            rx={smaP} ry={smbP}
            fill="none" stroke={c.accent} strokeWidth="1" opacity="0.6"
            strokeDasharray="4 2"
          />

          {/* MOID proximity indicator — arc/line from Earth orbit to asteroid perihelion */}
          {asteroid.moid < 0.5 && (
            <line
              x1={CX + earthR}
              y1={CY}
              x2={perihelionX}
              y2={perihelionY}
              stroke={asteroid.moid < 0.05 ? '#ef4444' : asteroid.moid < 0.2 ? '#f59e0b' : '#22d3ee'}
              strokeWidth="0.8"
              strokeDasharray="2 2"
              opacity="0.6"
            />
          )}

          {/* Perihelion marker */}
          <circle cx={perihelionX} cy={perihelionY} r={1.5} fill={c.accent} opacity="0.7" />

          {/* ── Animated asteroid body ── */}
          <motion.circle
            cx={perihelionX}
            cy={perihelionY}
            r={bodyR}
            fill={c.accent}
            opacity={0.9}
            style={{ filter: `drop-shadow(0 0 ${bodyR * 2}px ${c.accent})` }}
            animate={{
              cx: [perihelionX, ellipseCX - smaP, perihelionX],
              cy: [CY, CY, CY],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Orbit direction arrows */}
          <text
            x={ellipseCX} y={CY - smbP - 5}
            fill={c.accent} fontSize="7" textAnchor="middle" opacity="0.4"
            fontFamily="monospace"
          >
            ↻
          </text>
        </g>

        {/* ── Sun ── */}
        <circle cx={CX} cy={CY} r={6} fill="#fde68a" opacity="0.95"
          style={{ filter: 'drop-shadow(0 0 8px #fde68a)' }} />
        <circle cx={CX} cy={CY} r={10} fill="none" stroke="#fde68a" strokeWidth="0.5" opacity="0.3" />
        <circle cx={CX} cy={CY} r={14} fill="none" stroke="#fde68a" strokeWidth="0.3" opacity="0.15" />
        <text x={CX + 12} y={CY - 8} fill="#fde68a" fontSize="6" fontFamily="monospace" opacity="0.6">SOL</text>

        {/* ── MOID label ── */}
        {asteroid.moid < 0.5 && (
          <text
            x={(CX + earthR + perihelionX) / 2}
            y={CY + 10}
            fill={asteroid.moid < 0.05 ? '#ef4444' : '#f59e0b'}
            fontSize="5.5"
            textAnchor="middle"
            fontFamily="monospace"
            opacity="0.8"
          >
            {`MOID ${asteroid.moid.toFixed(3)} AU`}
          </text>
        )}

        {/* ── Asteroid class label ── */}
        <text x="8" y="312" fill={c.accent} fontSize="6.5" fontFamily="monospace" opacity="0.7">
          {asteroid.full_name.length > 28 ? asteroid.full_name.slice(0, 28) + '…' : asteroid.full_name}
        </text>
        <text x="312" y="312" fill="#52525b" fontSize="6" fontFamily="monospace" textAnchor="end">
          {asteroid.classification}-TYPE
        </text>
      </svg>
    </div>
  );
}
