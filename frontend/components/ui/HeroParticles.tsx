'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 3000;
const RED_FRACTION = 0.04; // ~120 anomaly particles

// ── Inner scene — must live inside <Canvas> ───────────────────────────────────

function ParticleField() {
  const groupRef = useRef<THREE.Group>(null!);
  // Accumulated base rotation (separate from mouse offset)
  const baseRot = useRef({ y: 0, x: 0 });
  // Normalized mouse coords [-1, 1] tracked via window listener
  const mouse = useRef<[number, number]>([0, 0]);

  // Pre-compute geometry buffers once
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const white = new THREE.Color('#ffffff');
    const red   = new THREE.Color('#FF3831');

    for (let i = 0; i < COUNT; i++) {
      // Uniform spherical distribution across a shell (r = 12–32 AU-scaled units)
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 12 + Math.random() * 20;

      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const c = Math.random() < RED_FRACTION ? red : white;
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  // Global mouse listener — pointer-events-none on the canvas wrapper still
  // allows us to read mouse position from the window
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = [
        (e.clientX / window.innerWidth  - 0.5) * 2,
        -(e.clientY / window.innerHeight - 0.5) * 2,
      ];
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  useFrame((_state, delta) => {
    // Slow autonomous drift
    baseRot.current.y += delta * 0.025;
    baseRot.current.x += delta * 0.007;
    // Apply base + mouse parallax offset
    groupRef.current.rotation.y = baseRot.current.y + mouse.current[0] * 0.25;
    groupRef.current.rotation.x = baseRot.current.x + mouse.current[1] * 0.12;
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          vertexColors
          transparent
          opacity={0.55}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}

// ── Exported component ────────────────────────────────────────────────────────

export function HeroParticles() {
  return (
    <Canvas
      camera={{ position: [0, 0, 14], fov: 70 }}
      gl={{ alpha: true, antialias: false }}
      style={{ background: 'transparent' }}
      dpr={[1, 1.5]}
    >
      <ParticleField />
    </Canvas>
  );
}
