import { useState, useEffect } from 'react';

const partitions = [
  { id: 0, messages: ['msg1', 'msg2', 'msg3', 'msg4'] },
  { id: 1, messages: ['msg5', 'msg6', 'msg7'] },
  { id: 2, messages: ['msg8', 'msg9', 'msg10', 'msg11'] },
];

const consumerGroups = [
  { name: 'Group A', consumers: ['C1', 'C2'], color: 'blue' },
  { name: 'Group B', consumers: ['C3'], color: 'green' },
];

export default function MessageQueueDiagram() {
  const [offsets, setOffsets] = useState([0, 0, 0]);
  const [producing, setProducing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProducing(true);
      setTimeout(() => setProducing(false), 600);
      setOffsets((prev) => prev.map((o, i) => Math.min(o + 1, partitions[i].messages.length)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-2 text-center">Message Queue (Kafka-style)</h3>
      <p className="text-xs text-slate-400 text-center mb-6">Partitioned topic with consumer groups</p>

      <div className="flex items-start justify-between gap-6">
        {/* Producers */}
        <div className="space-y-3 flex-shrink-0">
          <div className="text-xs text-slate-400 uppercase tracking-wider text-center">Producers</div>
          {['P1', 'P2'].map((p) => (
            <div key={p} className={`border rounded-lg p-3 text-center transition-all duration-300
              ${producing ? 'border-orange-400 bg-orange-500/20 scale-105' : 'border-slate-600 bg-slate-800'}`}>
              <div className="text-lg">📤</div>
              <div className="text-xs text-white">{p}</div>
            </div>
          ))}
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center justify-center pt-12">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`h-0.5 w-8 mb-6 transition-colors ${producing ? 'bg-orange-400' : 'bg-slate-700'}`} />
          ))}
        </div>

        {/* Topic with partitions */}
        <div className="flex-1">
          <div className="border-2 border-dashed border-amber-400/50 rounded-xl p-4">
            <div className="text-xs text-amber-300 font-semibold mb-3 text-center">📋 Topic: orders</div>
            <div className="space-y-2">
              {partitions.map((p, pi) => (
                <div key={p.id} className="flex items-center gap-1">
                  <div className="text-[9px] text-slate-500 w-6">P{p.id}</div>
                  <div className="flex gap-0.5 flex-1">
                    {p.messages.map((m, mi) => (
                      <div
                        key={m}
                        className={`flex-1 h-7 rounded text-[8px] flex items-center justify-center transition-all duration-500
                          ${mi < offsets[pi]
                            ? 'bg-amber-500/40 text-amber-200 border border-amber-500/50'
                            : 'bg-slate-700/50 text-slate-500 border border-slate-600/50'}`}
                      >
                        {m}
                      </div>
                    ))}
                  </div>
                  <div className="text-[8px] text-slate-500">offset:{offsets[pi]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center justify-center pt-12">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`h-0.5 w-8 mb-6 transition-colors ${offsets[i] > 0 ? 'bg-blue-400' : 'bg-slate-700'}`} />
          ))}
        </div>

        {/* Consumer groups */}
        <div className="space-y-4 flex-shrink-0">
          <div className="text-xs text-slate-400 uppercase tracking-wider text-center">Consumer Groups</div>
          {consumerGroups.map((g) => (
            <div key={g.name} className={`border border-${g.color}-400/50 bg-${g.color}-500/10 rounded-lg p-3`}>
              <div className={`text-[10px] text-${g.color}-300 font-semibold mb-2`}>{g.name}</div>
              <div className="flex gap-2">
                {g.consumers.map((c) => (
                  <div key={c} className="bg-slate-800 border border-slate-600 rounded px-2 py-1 text-[10px] text-white">{c}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-4 text-[10px] text-slate-400">
        <span>⚡ Ordering guaranteed per partition</span>
        <span>•</span>
        <span>📊 Each group reads independently</span>
      </div>
    </div>
  );
}
