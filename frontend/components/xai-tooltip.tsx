import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Props {
  term: React.ReactNode;
  explanation: string;
  children?: React.ReactNode;
}

export function XaiTooltip({ term, explanation, children }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="cursor-help border-b border-dashed border-zinc-500 transition-colors hover:text-white">
          {children ?? term}
        </span>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="max-w-xs rounded-none border border-zinc-700 bg-zinc-900 p-3"
      >
        {typeof term === 'string' && (
          <p className="mb-1 font-mono text-[8px] uppercase tracking-widest text-white/40">
            {term}
          </p>
        )}
        <p className="font-mono text-[10px] leading-relaxed text-zinc-300">
          {explanation}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
