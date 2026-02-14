import { useState, useEffect } from 'react';

const servers = [
  { name: 'Server 1', health: true, load: 35 },
  { name: 'Server 2', health: true, load: 62 },
  { name: 'Server 3', health: false, load: 0 },
  { name: 'Server 4', health: true, load: 48 },
];

const algorithms = ['Round Robin', 'Least Connections', 'IP Hash', 'Weighted'];

export default function LoadBalancerDiagram() {
  const [activeServer, setActiveServer] = useState<number>(0);
  const [algo, setAlgo] = useState(0);
  const [serverState, setServerState] = useState(servers);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveServer((prev) => {
        let next = (prev + 1) % servers.length;
        while (!serverState[next].health) next = (next + 1) % servers.length;
        return next;
      });
      setServerState((prev) =>
        prev.map((s) => ({
          ...s,
          load: s.health ? Math.min(95, Math.max(10, s.load + Math.floor(Math.random() * 21) - 10)) : 0,
        }))
      );
    }, 1500);
    return () => clearInterval(interval);
  }, [serverState]);

  return (
    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-6 text-center">Load Balancer</h3>

      {/* Algorithm selector */}
      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        {algorithms.map((a, i) => (
          <button
            key={a}
            onClick={() => setAlgo(i)}
            className={`px-3 py-1 rounded-full text-xs transition-all ${i === algo ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400 border border-slate-600 hover:border-cyan-400'}`}
          >
            {a}
          </button>
        ))}
      </div>

      {/* Clients */}
      <div className="flex justify-center gap-4 mb-4">
        {['👤', '👤', '👤'].map((c, i) => (
          <div key={i} className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-center">
            <div className="text-lg">{c}</div>
            <div className="text-[10px] text-slate-400">Client {i + 1}</div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mb-3">
        <div className="w-px h-6 bg-cyan-400 animate-pulse" />
      </div>

      {/* Load Balancer */}
      <div className="flex justify-center mb-3">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl px-8 py-4 text-center shadow-lg shadow-cyan-500/20">
          <div className="text-sm font-bold text-white">⚖️ Load Balancer</div>
          <div className="text-[10px] text-white/70">Algorithm: {algorithms[algo]}</div>
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <div className="flex gap-12">
          {serverState.map((_, i) => (
            <div key={i} className={`w-px h-8 transition-all duration-300 ${activeServer === i ? 'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.5)]' : 'bg-slate-700'}`} />
          ))}
        </div>
      </div>

      {/* Servers */}
      <div className="grid grid-cols-4 gap-3">
        {serverState.map((s, i) => (
          <div
            key={s.name}
            onClick={() => setServerState((prev) => prev.map((srv, j) => j === i ? { ...srv, health: !srv.health } : srv))}
            className={`border-2 rounded-xl p-3 text-center cursor-pointer transition-all duration-300
              ${!s.health ? 'border-red-500/50 bg-red-500/10 opacity-50' : activeServer === i ? 'border-cyan-400 bg-cyan-500/15 scale-105 shadow-lg shadow-cyan-500/10' : 'border-slate-600 bg-slate-800 hover:border-slate-400'}`}
          >
            <div className="text-lg mb-1">{s.health ? '🖥️' : '💀'}</div>
            <div className="text-xs text-white font-medium">{s.name}</div>
            <div className={`text-[10px] ${s.health ? 'text-green-400' : 'text-red-400'}`}>
              {s.health ? '● Healthy' : '● Down'}
            </div>
            {s.health && (
              <div className="mt-2">
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${s.load > 80 ? 'bg-red-400' : s.load > 50 ? 'bg-yellow-400' : 'bg-green-400'}`}
                    style={{ width: `${s.load}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-1">{s.load}% load</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 text-center text-[10px] text-slate-500">Click a server to toggle health status</div>
    </div>
  );
}
