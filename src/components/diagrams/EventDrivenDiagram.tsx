import { useState, useEffect } from 'react';

const producers = [
  { name: 'Order Service', icon: '📦', event: 'OrderPlaced' },
  { name: 'User Service', icon: '👤', event: 'UserSignedUp' },
  { name: 'Payment Service', icon: '💳', event: 'PaymentProcessed' },
];

const consumers = [
  { name: 'Email Service', icon: '📧' },
  { name: 'Analytics', icon: '📊' },
  { name: 'Inventory', icon: '🏭' },
  { name: 'Notification', icon: '🔔' },
];

export default function EventDrivenDiagram() {
  const [activeEvent, setActiveEvent] = useState<number | null>(null);
  const [particles, setParticles] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * producers.length);
      setParticles((p) => [...p.slice(-5), Date.now()]);
      setActiveEvent(idx);
      setTimeout(() => setActiveEvent(null), 1200);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-6 text-center">Event-Driven Architecture (Pub/Sub)</h3>

      <div className="flex items-center justify-between gap-4">
        {/* Producers */}
        <div className="space-y-3 flex-shrink-0">
          <div className="text-xs text-slate-400 uppercase tracking-wider text-center mb-2">Producers</div>
          {producers.map((p, i) => (
            <div
              key={p.name}
              className={`border rounded-lg p-3 text-center transition-all duration-300 min-w-[120px]
                ${activeEvent === i
                  ? 'border-green-400 bg-green-500/20 scale-105 shadow-lg shadow-green-500/20'
                  : 'border-slate-600 bg-slate-800'}`}
            >
              <div className="text-xl">{p.icon}</div>
              <div className="text-xs text-white font-medium">{p.name}</div>
              {activeEvent === i && (
                <div className="text-[10px] text-green-300 mt-1 animate-pulse">→ {p.event}</div>
              )}
            </div>
          ))}
        </div>

        {/* Arrows to bus */}
        <div className="flex flex-col items-center gap-3">
          {producers.map((_, i) => (
            <div key={i} className={`h-1 w-12 rounded transition-colors duration-300 ${activeEvent === i ? 'bg-green-400' : 'bg-slate-700'}`} />
          ))}
        </div>

        {/* Event Bus */}
        <div className="relative flex-shrink-0">
          <div className={`border-2 border-dashed rounded-2xl px-6 py-8 text-center transition-all duration-300
            ${activeEvent !== null ? 'border-yellow-400 bg-yellow-500/10' : 'border-slate-500 bg-slate-800/50'}`}>
            <div className="text-3xl mb-2">🚌</div>
            <div className="text-sm font-bold text-yellow-300">Event Bus</div>
            <div className="text-[10px] text-slate-400">Kafka / EventBridge</div>

            {/* Floating event particles */}
            {activeEvent !== null && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-3 h-3 rounded-full bg-yellow-400 animate-ping opacity-50" />
              </div>
            )}
          </div>
        </div>

        {/* Arrows from bus */}
        <div className="flex flex-col items-center gap-2">
          {consumers.map((_, i) => (
            <div key={i} className={`h-1 w-12 rounded transition-colors duration-500 ${activeEvent !== null ? 'bg-purple-400' : 'bg-slate-700'}`}
              style={{ transitionDelay: `${i * 100}ms` }} />
          ))}
        </div>

        {/* Consumers */}
        <div className="space-y-3 flex-shrink-0">
          <div className="text-xs text-slate-400 uppercase tracking-wider text-center mb-2">Consumers</div>
          {consumers.map((c, i) => (
            <div
              key={c.name}
              className={`border rounded-lg p-3 text-center transition-all duration-500 min-w-[110px]
                ${activeEvent !== null
                  ? 'border-purple-400 bg-purple-500/20'
                  : 'border-slate-600 bg-slate-800'}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="text-xl">{c.icon}</div>
              <div className="text-xs text-white font-medium">{c.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-slate-400">
        ⚡ Events fire automatically — watch the flow
      </div>
    </div>
  );
}
