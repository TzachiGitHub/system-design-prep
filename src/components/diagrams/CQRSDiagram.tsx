import { useState } from 'react';

type Path = 'write' | 'read' | null;

export default function CQRSDiagram() {
  const [activePath, setActivePath] = useState<Path>(null);

  const isWrite = activePath === 'write';
  const isRead = activePath === 'read';

  return (
    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-2 text-center">CQRS Pattern</h3>
      <p className="text-xs text-slate-400 text-center mb-6">Command Query Responsibility Segregation</p>

      {/* Toggle buttons */}
      <div className="flex justify-center gap-3 mb-6">
        <button
          onClick={() => setActivePath(activePath === 'write' ? null : 'write')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isWrite ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-slate-800 text-slate-300 border border-slate-600 hover:border-red-400'}`}
        >
          ✏️ Write Path (Command)
        </button>
        <button
          onClick={() => setActivePath(activePath === 'read' ? null : 'read')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isRead ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-800 text-slate-300 border border-slate-600 hover:border-blue-400'}`}
        >
          👁️ Read Path (Query)
        </button>
      </div>

      {/* Client */}
      <div className="flex justify-center mb-4">
        <div className="bg-slate-700 rounded-lg px-6 py-2 text-sm text-white font-medium border border-slate-500">🌐 Client</div>
      </div>

      {/* Split paths */}
      <div className="grid grid-cols-2 gap-6">
        {/* Write side */}
        <div className={`space-y-3 transition-all duration-300 ${isRead ? 'opacity-30' : ''}`}>
          <div className="text-center text-xs text-red-300 uppercase tracking-wider font-semibold">Command Side</div>

          <div className={`border rounded-lg p-3 text-center transition-all ${isWrite ? 'border-red-400 bg-red-500/15 scale-105' : 'border-slate-600 bg-slate-800'}`}>
            <div className="text-sm font-medium text-white">📝 Command Handler</div>
            <div className="text-[10px] text-slate-400">Validate & process writes</div>
          </div>

          <div className="flex justify-center"><span className={`text-xs ${isWrite ? 'text-red-400' : 'text-slate-600'}`}>▼</span></div>

          <div className={`border rounded-lg p-3 text-center transition-all ${isWrite ? 'border-red-400 bg-red-500/15 scale-105' : 'border-slate-600 bg-slate-800'}`}>
            <div className="text-sm font-medium text-white">💾 Write DB</div>
            <div className="text-[10px] text-slate-400">Normalized, optimized for writes</div>
          </div>

          <div className="flex justify-center"><span className={`text-xs ${isWrite ? 'text-red-400' : 'text-slate-600'}`}>▼</span></div>

          <div className={`border-2 border-dashed rounded-lg p-3 text-center transition-all ${isWrite ? 'border-yellow-400 bg-yellow-500/10' : 'border-slate-600 bg-slate-800/50'}`}>
            <div className="text-sm font-medium text-yellow-300">📨 Event Store</div>
            <div className="text-[10px] text-slate-400">Publish domain events</div>
          </div>
        </div>

        {/* Read side */}
        <div className={`space-y-3 transition-all duration-300 ${isWrite ? 'opacity-30' : ''}`}>
          <div className="text-center text-xs text-blue-300 uppercase tracking-wider font-semibold">Query Side</div>

          <div className={`border rounded-lg p-3 text-center transition-all ${isRead ? 'border-blue-400 bg-blue-500/15 scale-105' : 'border-slate-600 bg-slate-800'}`}>
            <div className="text-sm font-medium text-white">🔍 Query Handler</div>
            <div className="text-[10px] text-slate-400">Optimized read queries</div>
          </div>

          <div className="flex justify-center"><span className={`text-xs ${isRead ? 'text-blue-400' : 'text-slate-600'}`}>▲</span></div>

          <div className={`border rounded-lg p-3 text-center transition-all ${isRead ? 'border-blue-400 bg-blue-500/15 scale-105' : 'border-slate-600 bg-slate-800'}`}>
            <div className="text-sm font-medium text-white">📖 Read DB</div>
            <div className="text-[10px] text-slate-400">Denormalized, optimized for reads</div>
          </div>

          <div className="flex justify-center"><span className={`text-xs ${isRead ? 'text-blue-400' : 'text-slate-600'}`}>▲</span></div>

          <div className={`border-2 border-dashed rounded-lg p-3 text-center transition-all ${isRead || isWrite ? 'border-yellow-400 bg-yellow-500/10' : 'border-slate-600 bg-slate-800/50'}`}>
            <div className="text-sm font-medium text-yellow-300">🔄 Projector</div>
            <div className="text-[10px] text-slate-400">Events → Read Model sync</div>
          </div>
        </div>
      </div>

      {/* Sync arrow */}
      <div className="flex justify-center mt-3">
        <div className={`text-[10px] px-3 py-1 rounded-full transition-all ${activePath ? 'bg-yellow-500/20 text-yellow-300' : 'bg-slate-800 text-slate-500'}`}>
          ← Eventual Consistency →
        </div>
      </div>
    </div>
  );
}
