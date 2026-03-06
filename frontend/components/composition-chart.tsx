'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CompositionEntry } from '@/lib/data';

interface Props {
  composition: CompositionEntry[];
}

export function CompositionChart({ composition }: Props) {
  return (
    <ResponsiveContainer width="100%" height={230}>
      <PieChart>
        <Pie
          data={composition}
          cx="50%"
          cy="45%"
          innerRadius={58}
          outerRadius={88}
          paddingAngle={3}
          dataKey="value"
          nameKey="label"
          strokeWidth={0}
        >
          {composition.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`${value ?? 0}%`]}
          contentStyle={{
            background: '#09090b',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px',
            fontSize: '12px',
            fontFamily: 'monospace',
          }}
          itemStyle={{ color: '#a1a1aa' }}
          labelStyle={{ display: 'none' }}
        />
        <Legend
          formatter={(value) => (
            <span style={{ color: '#71717a', fontSize: '11px', fontFamily: 'monospace' }}>{value}</span>
          )}
          iconType="circle"
          iconSize={7}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
