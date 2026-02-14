import { useState } from 'react';

type Scenario = 'hit' | 'miss';

export default function CDNDiagram() {
  const [scenario, setScenario] = useState<Scenario>('hit');
  const isHit = scenario === 'hit';

  return (
    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-2 text-center">CDN Architecture</h3>
      <p className="text-xs text-slate-400 text-center mb-6">Content Delivery Network — Edge Caching</p>

      <div className="flex justify-center gap-3 mb-6">
        <button onClick={() => setScenario('hit')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isHit ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-400 border border-slate-600'}`}>
          ⚡ Cache Hit
        </button>
        <button onClick={() => setScenario('miss')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!isHit ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400 border border-slate-600'}`}>
          🔄 Cache Miss
        </button>
      </div>

      <div className="flex flex-col items-center gap-2">
        {/* User */}
        <div className="bg-slate-800 border border-slate-600 rounded-xl px-6 py-3 text-center">
          <span className="text-xl">👤</span>
          <div className="text-xs text-white font-medium">User (Tokyo)</div>
        </div>

        <div className={`w-px h-6 ${isHit ? 'bg-green-400' : 'bg-orange-400'}`} />
        <div className="text-[9px] text-slate-400">DNS → Nearest Edge</div>
        <div className={`w-px h-4 ${isHit ? 'bg-green-400' : 'bg-orange-400'}`} />

        {/* Edge Servers */}
        <div className="flex gap-4">
          {['🗼 Tokyo Edge', '🗼 Seoul Edge', '🗼 Singapore Edge'].map((edge, i) => (
            <div key={edge}
              className={`border-2 rounded-xl p-3 text-center transition-all duration-300
                ${i === 0
                  ? isHit
                    ? 'border-green-400 bg-green-500/20 scale-105 shadow-lg shadow-green-500/20'
                    : 'border-orange-400 bg-orange-500/20 scale-105'
                  : 'border-slate-600 bg-slate-800 opacity-50'}`}
            >
              <div className="text-sm">{edge.slice(0, 2)}</div>
              <div className="text-[10px] text-white font-medium">{edge.slice(2)}</div>
              {i === 0 && (
                <div className={`text-[9px] mt-1 font-semibold ${isHit ? 'text-green-300' : 'text-orange-300'}`}>
                  {isHit ? '✅ HIT — return cached' : '❌ MISS — fetch origin'}
                </div>
              )}
            </div>
          ))}
        </div>

        {!isHit && (
          <>
            <div className="w-px h-6 bg-orange-400 animate-pulse" />
            <div className="text-[9px] text-orange-300">Fetch from origin</div>
            <div className="w-px h-4 bg-orange-400" />
          </>
        )}

        {/* Origin */}
        <div className={`border-2 rounded-xl p-4 text-center transition-all duration-300
          ${!isHit ? 'border-blue-400 bg-blue-500/20 scale-105' : 'border-slate-600 bg-slate-800 opacity-50'}`}>
          <span className="text-xl">🏢</span>
          <div className="text-xs text-white font-medium">Origin Server (US-East)</div>
          <div className="text-[10px] text-slate-400">S3 + Application Server</div>
        </div>

        {/* Latency comparison */}
        <div className="mt-4 grid grid-cols-2 gap-3 w-full max-w-xs">
          <div className={`rounded-lg p-3 text-center border ${isHit ? 'border-green-400 bg-green-500/10' : 'border-slate-600 bg-slate-800'}`}>
            <div className="text-lg font-bold text-green-300">~20ms</div>
            <div className="text-[10px] text-slate-400">Cache Hit (Edge)</div>
          </div>
          <div className={`rounded-lg p-3 text-center border ${!isHit ? 'border-orange-400 bg-orange-500/10' : 'border-slate-600 bg-slate-800'}`}>
            <div className="text-lg font-bold text-orange-300">~200ms</div>
            <div className="text-[10px] text-slate-400">Cache Miss (Origin)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
