import { useState } from 'react';

type Tab = 'compare' | 'sharding';

const sqlVsNosql = [
  { prop: 'Schema', sql: 'Fixed schema', nosql: 'Flexible/schemaless' },
  { prop: 'Scale', sql: 'Vertical', nosql: 'Horizontal' },
  { prop: 'Joins', sql: 'Full support', nosql: 'Limited/none' },
  { prop: 'ACID', sql: '✅ Strong', nosql: '⚠️ Eventual' },
  { prop: 'Use case', sql: 'Transactions, relations', nosql: 'High throughput, flexible data' },
];

const shards = [
  { range: 'A–F', data: ['alice', 'bob', 'charlie', 'dave'], color: 'blue' },
  { range: 'G–M', data: ['george', 'helen', 'ivan', 'kate'], color: 'green' },
  { range: 'N–S', data: ['nancy', 'oscar', 'peter', 'sara'], color: 'amber' },
  { range: 'T–Z', data: ['tom', 'uma', 'victor', 'wendy'], color: 'pink' },
];

export default function DatabaseDiagram() {
  const [tab, setTab] = useState<Tab>('compare');
  const [hoveredShard, setHoveredShard] = useState<number | null>(null);

  return (
    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-6 text-center">Database Concepts</h3>

      <div className="flex justify-center gap-3 mb-6">
        {(['compare', 'sharding'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 border border-slate-600'}`}
          >
            {t === 'compare' ? '⚔️ SQL vs NoSQL' : '🔪 Sharding'}
          </button>
        ))}
      </div>

      {tab === 'compare' ? (
        <div className="grid grid-cols-3 gap-px bg-slate-700 rounded-xl overflow-hidden">
          <div className="bg-slate-800 p-3 text-center text-xs text-slate-400 font-semibold">Property</div>
          <div className="bg-blue-500/20 p-3 text-center text-xs text-blue-300 font-semibold">🐘 SQL</div>
          <div className="bg-green-500/20 p-3 text-center text-xs text-green-300 font-semibold">🍃 NoSQL</div>
          {sqlVsNosql.map((row) => (
            <>
              <div key={row.prop} className="bg-slate-800 p-3 text-xs text-white font-medium">{row.prop}</div>
              <div className="bg-slate-800/80 p-3 text-xs text-blue-200">{row.sql}</div>
              <div className="bg-slate-800/80 p-3 text-xs text-green-200">{row.nosql}</div>
            </>
          ))}
        </div>
      ) : (
        <div>
          {/* Router */}
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl px-6 py-3 text-center">
              <div className="text-sm font-bold text-white">🔀 Shard Router</div>
              <div className="text-[10px] text-white/70">Routes by key range</div>
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <div className="flex gap-10">
              {shards.map((_, i) => (
                <div key={i} className="w-px h-6 bg-indigo-400/50" />
              ))}
            </div>
          </div>

          {/* Shards */}
          <div className="grid grid-cols-4 gap-3">
            {shards.map((s, i) => (
              <div
                key={s.range}
                onMouseEnter={() => setHoveredShard(i)}
                onMouseLeave={() => setHoveredShard(null)}
                className={`border-2 rounded-xl p-3 text-center transition-all duration-300 cursor-pointer
                  ${hoveredShard === i ? `border-${s.color}-400 bg-${s.color}-500/20 scale-105` : 'border-slate-600 bg-slate-800'}`}
              >
                <div className="text-lg mb-1">🗄️</div>
                <div className="text-xs text-white font-bold">Shard {i + 1}</div>
                <div className={`text-[10px] text-${s.color}-300`}>Keys: {s.range}</div>
                {hoveredShard === i && (
                  <div className="mt-2 space-y-0.5">
                    {s.data.map((d) => (
                      <div key={d} className="text-[10px] text-slate-300 bg-slate-700/50 rounded px-1">{d}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
