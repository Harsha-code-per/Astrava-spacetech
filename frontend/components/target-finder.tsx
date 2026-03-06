'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronRight } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ASTEROIDS,
  Asteroid,
  AsteroidClass,
  formatValuationShort,
  getClassColors,
} from '@/lib/data';

type SortKey = 'full_name' | 'classification' | 'diameter' | 'accessibility_score' | 'gross_valuation' | 'moid';
type SortDir = 'asc' | 'desc';

function ClassBadge({ cls }: { cls: AsteroidClass }) {
  const c = getClassColors(cls);
  const labels: Record<AsteroidClass, string> = { C: 'C · CARB', S: 'S · SILI', M: 'M · META' };
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-mono font-bold border ${c.bg} ${c.text} ${c.border}`}>
      {labels[cls]}
    </span>
  );
}

function AccessibilityBar({ score }: { score: number }) {
  const colorBar  = score >= 80 ? 'bg-emerald-400' : score >= 60 ? 'bg-amber-400' : score >= 40 ? 'bg-orange-400' : 'bg-red-500';
  const colorText = score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : score >= 40 ? 'text-orange-400' : 'text-red-400';
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full ${colorBar} rounded-full`} style={{ width: `${score}%` }} />
      </div>
      <span className={`font-mono text-xs ${colorText}`}>{score}</span>
    </div>
  );
}

interface Props {
  selected: Asteroid | null;
  onSelect: (asteroid: Asteroid) => void;
}

export function TargetFinder({ selected, onSelect }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('gross_valuation');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  }

  const sorted = useMemo(() => {
    return [...ASTEROIDS].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      const cmp = typeof av === 'string' ? (av as string).localeCompare(bv as string) : (av as number) - (bv as number);
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [sortKey, sortDir]);

  function SortBtn({ label, k }: { label: string; k: SortKey }) {
    const active = sortKey === k;
    const Icon = active ? (sortDir === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown;
    return (
      <button
        onClick={() => handleSort(k)}
        className={`flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${active ? 'text-cyan-400' : 'text-zinc-600 hover:text-zinc-300'}`}
      >
        {label}<Icon className="h-3 w-3" />
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <p className="mb-1 font-mono text-xs uppercase tracking-widest text-cyan-500">— Target Acquisition</p>
        <h3 className="text-xl font-black text-white">TARGET FINDER</h3>
        <p className="mt-0.5 text-xs text-zinc-500">
          {ASTEROIDS.length} targets · Click any row to load mission profile
        </p>
      </div>

      {/* Glassmorphic table container */}
      <div className="overflow-hidden rounded-xl border border-zinc-800/60 bg-black/50 backdrop-blur-md">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800/60 hover:bg-transparent">
              <TableHead className="w-9 font-mono text-[10px] text-zinc-700">#</TableHead>
              <TableHead><SortBtn label="Name" k="full_name" /></TableHead>
              <TableHead><SortBtn label="Class" k="classification" /></TableHead>
              <TableHead className="hidden sm:table-cell"><SortBtn label="Diam." k="diameter" /></TableHead>
              <TableHead className="hidden md:table-cell"><SortBtn label="Access." k="accessibility_score" /></TableHead>
              <TableHead><SortBtn label="Valuation" k="gross_valuation" /></TableHead>
              <TableHead className="w-6" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((asteroid, idx) => {
              const isSelected = selected?.id === asteroid.id;
              const c = getClassColors(asteroid.classification);
              return (
                <motion.tr
                  key={asteroid.id}
                  onClick={() => onSelect(asteroid)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`cursor-pointer border-zinc-800/40 transition-colors duration-150 ${
                    isSelected ? 'bg-cyan-500/10' : 'hover:bg-white/5'
                  }`}
                  style={isSelected ? { borderLeft: '2px solid #22d3ee' } : {}}
                >
                  <TableCell className="font-mono text-[10px] text-zinc-700">
                    {String(idx + 1).padStart(2, '0')}
                  </TableCell>
                  <TableCell>
                    <div className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-zinc-200'}`}>
                      {asteroid.full_name}
                    </div>
                    <div className="font-mono text-[10px] text-zinc-600">JPL:{asteroid.id}</div>
                  </TableCell>
                  <TableCell><ClassBadge cls={asteroid.classification} /></TableCell>
                  <TableCell className="hidden sm:table-cell font-mono text-sm text-zinc-300">
                    {asteroid.diameter >= 10 ? asteroid.diameter.toFixed(1) : asteroid.diameter.toFixed(3)}
                    <span className="text-xs text-zinc-600 ml-0.5">km</span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <AccessibilityBar score={asteroid.accessibility_score} />
                  </TableCell>
                  <TableCell>
                    <span className={`font-mono text-sm font-bold ${c.text}`}>
                      {formatValuationShort(asteroid.gross_valuation)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <ChevronRight className={`h-3.5 w-3.5 ${isSelected ? 'text-cyan-400' : 'text-zinc-700'}`} />
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-zinc-600">
        {[
          { cls: 'C', label: 'Carbonaceous — water ice & volatiles', color: 'text-cyan-500' },
          { cls: 'S', label: 'Silicaceous — iron-nickel silicate',   color: 'text-amber-500' },
          { cls: 'M', label: 'Metallic — PGM-rich core',             color: 'text-red-500' },
        ].map((item) => (
          <div key={item.cls} className="flex items-center gap-1.5">
            <span className={`font-bold ${item.color}`}>{item.cls}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
