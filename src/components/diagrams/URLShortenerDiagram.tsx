import { useState } from 'react';

type Phase = 'write' | 'read';

export default function URLShortenerDiagram() {
  const [phase, setPhase] = useState<Phase>('write');

  const Box = ({ children, className = '', glow = false }: { children: React.ReactNode; className?: string; glow?: boolean }) => (
    <div className={`border-2 rounded-xl p-3 text-center transition-all duration-300 ${glow ? 'scale-105 shadow-lg' : ''} ${className}`}>
      {children}
    </div>
  );

  const Arrow = ({ label, active }: { label?: string; active?: boolean }) => (
    <div className="flex flex-col items-center">
      <div className={`w-px h-6 transition-colors ${active ? 'bg-cyan-400' : 'bg-slate-600'}`} />
      {label && <div className={`text-[9px] ${active ? 'text-cyan-300' : 'text-slate-500'}`}>{label}</div>}
      <div className={`text-xs ${active ? 'text-cyan-400' : 'text-slate-600'}`}>▼</div>
    </div>
  );

  const isW = phase === 'write';

  return (
    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-2 text-center">URL Shortener System Design</h3>
      <p className="text-xs text-slate-400 text-center mb-6">like TinyURL / bit.ly</p>

      <div className="flex justify-center gap-3 mb-6">
        <button onClick={() => setPhase('write')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isW ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-400 border border-slate-600'}`}>
          ✏️ Shorten URL
        </button>
        <button onClick={() => setPhase('read')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!isW ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 border border-slate-600'}`}>
          🔗 Redirect
        </button>
      </div>

      <div className="flex flex-col items-center gap-1">
        <Box className="border-slate-500 bg-slate-800">
          <span className="text-lg">👤</span>
          <div className="text-xs text-white font-medium">Client</div>
          <div className="text-[10px] text-slate-400">{isW ? 'POST /shorten {longUrl}' : 'GET /abc123'}</div>
        </Box>

        <Arrow active label="HTTPS" />

        <Box className="border-cyan-400 bg-cyan-500/15" glow>
          <span className="text-lg">⚖️</span>
          <div className="text-xs text-white font-medium">Load Balancer</div>
        </Box>

        <Arrow active />

        <Box className={`${isW ? 'border-green-400 bg-green-500/15' : 'border-blue-400 bg-blue-500/15'}`} glow>
          <span className="text-lg">🖥️</span>
          <div className="text-xs text-white font-medium">API Server</div>
          <div className="text-[10px] text-slate-400">{isW ? 'Generate short code (Base62/hash)' : 'Lookup & redirect (301/302)'}</div>
        </Box>

        <div className="flex gap-8 items-start">
          {/* Cache path */}
          <div className="flex flex-col items-center gap-1">
            <Arrow active={!isW} label="Check cache" />
            <Box className={`border-red-400 bg-red-500/15 ${!isW ? 'ring-1 ring-red-400/50' : ''}`}>
              <span className="text-lg">⚡</span>
              <div className="text-xs text-white font-medium">Redis Cache</div>
              <div className="text-[10px] text-slate-400">Hot URLs cached</div>
            </Box>
          </div>

          {/* DB path */}
          <div className="flex flex-col items-center gap-1">
            <Arrow active label={isW ? 'Store mapping' : 'Cache miss → DB'} />
            <Box className="border-emerald-400 bg-emerald-500/15">
              <span className="text-lg">🗄️</span>
              <div className="text-xs text-white font-medium">Database</div>
              <div className="text-[10px] text-slate-400">short_code → long_url</div>
            </Box>
          </div>
        </div>

        {isW && (
          <div className="mt-3 flex flex-col items-center gap-1">
            <Arrow active label="Unique ID" />
            <Box className="border-purple-400 bg-purple-500/15">
              <span className="text-lg">🔢</span>
              <div className="text-xs text-white font-medium">ID Generator</div>
              <div className="text-[10px] text-slate-400">Snowflake / Base62 counter</div>
            </Box>
          </div>
        )}
      </div>

      <div className="mt-6 bg-slate-800 rounded-lg p-3 border border-slate-700">
        <div className="text-xs text-white font-medium mb-1">📊 Scale estimates</div>
        <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-300">
          <div>100M URLs/day → <span className="text-cyan-300">~1200/sec</span></div>
          <div>Read:Write = <span className="text-cyan-300">100:1</span></div>
          <div>Storage: <span className="text-cyan-300">~36 GB/year</span></div>
        </div>
      </div>
    </div>
  );
}
