'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CompositionEntry } from '@/lib/data';

interface Props {
  composition: CompositionEntry[];
}

// Griflan-tinted palette: desaturated whites + one red accent
const GRIFLAN_COLORS = ['#ffffff', '#a1a1aa', '#FF3831', '#52525b'];

export function CompositionChart({ composition }: Props) {
  const data = composition.map((e, i) => ({
    ...e,
    gColor: GRIFLAN_COLORS[i % GRIFLAN_COLORS.length],
  }));

  return (
    <div className="flex flex-col gap-4">
      {/* Donut */}
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={52}
            outerRadius={82}
            paddingAngle={2}
            dataKey="value"
            nameKey="label"
            strokeWidth={0}
            isAnimationActive
            animationBegin={120}
            animationDuration={1100}
            animationEasing="ease-out"
          >
            {data.map((entry, i) => (
              <Cell key={`cell-${i}`} fill={entry.gColor} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${value ?? 0}%`]}
            contentStyle={{
              background: '#000',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 0,
              fontSize: 11,
              fontFamily: 'monospace',
            }}
            itemStyle={{ color: '#a1a1aa' }}
            labelStyle={{ display: 'none' }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend rows */}
      <div className="space-y-2">
        {data.map((entry) => (
          <div key={entry.label} className="flex items-center gap-3">
            <div
              className="h-px flex-1 opacity-30"
              style={{ backgroundColor: entry.gColor }}
            />
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                {entry.label}
              </span>
              <span
                className="font-mono text-[11px] font-bold"
                style={{ color: entry.gColor }}
              >
                {entry.value}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
