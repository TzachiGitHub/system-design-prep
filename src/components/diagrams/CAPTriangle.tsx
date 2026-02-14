import { useState } from 'react';

type CAPChoice = 'CA' | 'CP' | 'AP' | null;

const combos: Record<string, { title: string; desc: string; examples: string; color: string }> = {
  CA: {
    title: 'CA — Consistency + Availability',
    desc: 'All nodes see the same data & every request gets a response. Impossible in a distributed system with network partitions.',
    examples: 'Traditional RDBMS (single node PostgreSQL, MySQL)',
    color: 'purple',
  },
  CP: {
    title: 'CP — Consistency + Partition Tolerance',
    desc: 'Data is always consistent. During partitions, some requests may be rejected (sacrifices availability).',
    examples: 'MongoDB, HBase, Redis (cluster), Zookeeper',
    color: 'blue',
  },
  AP: {
    title: 'AP — Availability + Partition Tolerance',
    desc: 'Always responds, even during partitions. Data may be stale (eventual consistency).',
    examples: 'Cassandra, DynamoDB, CouchDB, DNS',
    color: 'green',
  },
};

export default function CAPTriangle() {
  const [selected, setSelected] = useState<CAPChoice>(null);

  const isActive = (vertex: string) => selected?.includes(vertex);

  const vertexClass = (v: string) =>
    `w-20 h-20 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer transition-all duration-300 border-2 ${
      isActive(v)
        ? 'bg-white/20 border-white text-white scale-110 shadow-lg shadow-white/20'
        : 'bg-slate-800 border-slate-500 text-slate-300 hover:border-white/50'
    }`;

  const edgeClass = (combo: CAPChoice) =>
    `cursor-pointer transition-all duration-300 px-3 py-1 rounded-full text-xs font-medium ${
      selected === combo
        ? 'bg-white/20 text-white ring-2 ring-white/30'
        : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-600 hover:border-white/30'
    }`;

  return (
    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-2 text-center">CAP Theorem</h3>
      <p className="text-xs text-slate-400 text-center mb-8">Pick any two — click an edge to explore</p>

      {/* Triangle */}
      <div className="relative mx-auto" style={{ width: 280, height: 260 }}>
        {/* C vertex - top */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0">
          <div className={vertexClass('C')}>
            <div className="text-center">
              <div className="text-lg">🔒</div>
              <div className="text-[10px]">Consistency</div>
            </div>
          </div>
        </div>

        {/* A vertex - bottom left */}
        <div className="absolute left-0 bottom-0">
          <div className={vertexClass('A')}>
            <div className="text-center">
              <div className="text-lg">✅</div>
              <div className="text-[10px]">Availability</div>
            </div>
          </div>
        </div>

        {/* P vertex - bottom right */}
        <div className="absolute right-0 bottom-0">
          <div className={vertexClass('P')}>
            <div className="text-center">
              <div className="text-lg">🌐</div>
              <div className="text-[10px]">Partition</div>
            </div>
          </div>
        </div>

        {/* Edge labels */}
        <div className="absolute top-[35%] left-[8%]">
          <button onClick={() => setSelected(selected === 'CA' ? null : 'CA')} className={edgeClass('CA')}>CA</button>
        </div>
        <div className="absolute top-[35%] right-[8%]">
          <button onClick={() => setSelected(selected === 'CP' ? null : 'CP')} className={edgeClass('CP')}>CP</button>
        </div>
        <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2">
          <button onClick={() => setSelected(selected === 'AP' ? null : 'AP')} className={edgeClass('AP')}>AP</button>
        </div>

        {/* SVG lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 280 260">
          <line x1="140" y1="45" x2="40" y2="210" stroke={selected === 'CA' ? '#fff' : '#475569'} strokeWidth={selected === 'CA' ? 2 : 1} />
          <line x1="140" y1="45" x2="240" y2="210" stroke={selected === 'CP' ? '#fff' : '#475569'} strokeWidth={selected === 'CP' ? 2 : 1} />
          <line x1="40" y1="210" x2="240" y2="210" stroke={selected === 'AP' ? '#fff' : '#475569'} strokeWidth={selected === 'AP' ? 2 : 1} />
        </svg>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="mt-6 bg-slate-800 rounded-xl p-4 border border-slate-600">
          <div className="text-sm font-bold text-white mb-2">{combos[selected].title}</div>
          <p className="text-xs text-slate-300 mb-2">{combos[selected].desc}</p>
          <div className="text-xs text-slate-400">
            <span className="text-slate-300 font-medium">Examples:</span> {combos[selected].examples}
          </div>
        </div>
      )}
    </div>
  );
}
