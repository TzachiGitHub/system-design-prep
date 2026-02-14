import { useState } from 'react';
import type { ProgressStats, Category } from '../types';

const categoryMeta: Record<Category, { label: string; color: string; bg: string }> = {
  fundamentals: { label: 'Fundamentals', color: 'text-blue-400', bg: 'bg-blue-500' },
  'building-blocks': { label: 'Building Blocks', color: 'text-purple-400', bg: 'bg-purple-500' },
  patterns: { label: 'Patterns', color: 'text-emerald-400', bg: 'bg-emerald-500' },
  problems: { label: 'Problems', color: 'text-orange-400', bg: 'bg-orange-500' },
};

interface Props {
  stats: ProgressStats;
}

export default function ProgressBar({ stats }: Props) {
  const [expanded, setExpanded] = useState(false);
  const completed = stats.byStatus.completed;
  const pct = stats.total > 0 ? (completed / stats.total) * 100 : 0;

  return (
    <div className="w-full">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left group"
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-slate-300">
            {completed} of {stats.total} completed
          </span>
          <span className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
            {expanded ? 'Hide' : 'Details'}
          </span>
        </div>
        <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </button>

      {expanded && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.entries(categoryMeta) as [Category, typeof categoryMeta[Category]][]).map(
            ([cat, meta]) => {
              const catStats = stats.byCategory[cat];
              const catPct = catStats.total > 0 ? (catStats.completed / catStats.total) * 100 : 0;
              return (
                <div key={cat} className="bg-slate-800/60 rounded-lg p-2.5 border border-slate-700/50">
                  <div className={`text-xs font-medium ${meta.color} mb-1`}>{meta.label}</div>
                  <div className="text-xs text-slate-400 mb-1.5">
                    {catStats.completed}/{catStats.total}
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${meta.bg} rounded-full transition-all duration-500`}
                      style={{ width: `${catPct}%` }}
                    />
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}
