import { useState } from 'react';

type Strategy = 'aside' | 'through' | 'back';

const strategies: { key: Strategy; name: string; icon: string; steps: string[]; color: string }[] = [
  {
    key: 'aside',
    name: 'Cache-Aside',
    icon: '🔍',
    color: 'blue',
    steps: ['1. App checks cache', '2. Cache MISS', '3. App reads from DB', '4. App writes to cache', '5. Return data'],
  },
  {
    key: 'through',
    name: 'Write-Through',
    icon: '✏️',
    color: 'green',
    steps: ['1. App writes to cache', '2. Cache writes to DB (sync)', '3. Write confirmed', '4. Strong consistency'],
  },
  {
    key: 'back',
    name: 'Write-Back',
    icon: '⚡',
    color: 'amber',
    steps: ['1. App writes to cache', '2. Return immediately', '3. Cache flushes to DB (async)', '4. Risk of data loss'],
  },
];

const colorMap: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  blue: { border: 'border-blue-400', bg: 'bg-blue-500/20', text: 'text-blue-300', glow: 'shadow-blue-500/20' },
  green: { border: 'border-green-400', bg: 'bg-green-500/20', text: 'text-green-300', glow: 'shadow-green-500/20' },
  amber: { border: 'border-amber-400', bg: 'bg-amber-500/20', text: 'text-amber-300', glow: 'shadow-amber-500/20' },
};

export default function CachingDiagram() {
  const [active, setActive] = useState<Strategy>('aside');
  const strat = strategies.find((s) => s.key === active)!;
  const c = colorMap[strat.color];

  return (
    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-6 text-center">Caching Strategies</h3>

      {/* Strategy tabs */}
      <div className="flex justify-center gap-3 mb-6">
        {strategies.map((s) => {
          const sc = colorMap[s.color];
          return (
            <button
              key={s.key}
              onClick={() => setActive(s.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border-2
                ${active === s.key ? `${sc.border} ${sc.bg} ${sc.text} shadow-lg ${sc.glow}` : 'border-slate-600 bg-slate-800 text-slate-400 hover:border-slate-400'}`}
            >
              {s.icon} {s.name}
            </button>
          );
        })}
      </div>

      {/* Diagram */}
      <div className="flex items-center justify-center gap-6 mb-6">
        <div className={`border-2 ${c.border} ${c.bg} rounded-xl p-4 text-center transition-all duration-300`}>
          <div className="text-2xl mb-1">📱</div>
          <div className="text-xs text-white font-medium">Application</div>
        </div>

        <div className="flex flex-col items-center">
          <div className={`text-xs ${c.text} mb-1`}>←→</div>
          <div className={`h-0.5 w-16 ${active === 'aside' ? 'bg-blue-400' : active === 'through' ? 'bg-green-400' : 'bg-amber-400'} transition-colors`} />
        </div>

        <div className={`border-2 border-red-400 bg-red-500/20 rounded-xl p-4 text-center transition-all duration-300`}>
          <div className="text-2xl mb-1">⚡</div>
          <div className="text-xs text-white font-medium">Cache</div>
          <div className="text-[10px] text-slate-400">Redis / Memcached</div>
        </div>

        <div className="flex flex-col items-center">
          <div className={`text-xs ${c.text} mb-1`}>←→</div>
          <div className={`h-0.5 w-16 ${active === 'aside' ? 'bg-blue-400' : active === 'through' ? 'bg-green-400' : 'bg-amber-400'} transition-colors`} />
        </div>

        <div className={`border-2 border-emerald-400 bg-emerald-500/20 rounded-xl p-4 text-center transition-all duration-300`}>
          <div className="text-2xl mb-1">🗄️</div>
          <div className="text-xs text-white font-medium">Database</div>
        </div>
      </div>

      {/* Steps */}
      <div className={`border-2 ${c.border} ${c.bg} rounded-xl p-4`}>
        <div className={`text-sm font-bold ${c.text} mb-3`}>{strat.icon} {strat.name} Flow</div>
        <div className="grid grid-cols-1 gap-1.5">
          {strat.steps.map((step, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
              <span className={`w-5 h-5 rounded-full ${c.bg} ${c.border} border flex items-center justify-center text-[10px] ${c.text} font-bold flex-shrink-0`}>
                {i + 1}
              </span>
              {step.slice(2)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
