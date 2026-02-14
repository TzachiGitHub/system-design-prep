import { useState } from 'react';

const services = [
  { name: 'User Service', color: 'border-blue-400 bg-blue-500/20', icon: '👤' },
  { name: 'Order Service', color: 'border-green-400 bg-green-500/20', icon: '📦' },
  { name: 'Payment Service', color: 'border-amber-400 bg-amber-500/20', icon: '💳' },
  { name: 'Notification Service', color: 'border-pink-400 bg-pink-500/20', icon: '🔔' },
];

export default function MicroservicesDiagram() {
  const [activeService, setActiveService] = useState<string | null>(null);
  const [showFlow, setShowFlow] = useState(false);

  return (
    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-6 text-center">Microservices Architecture</h3>

      {/* Client */}
      <div className="flex justify-center mb-4">
        <div className="bg-slate-700 border border-slate-500 rounded-lg px-6 py-2 text-white text-sm font-medium">
          🌐 Clients (Web / Mobile)
        </div>
      </div>

      {/* Arrow */}
      <div className="flex justify-center mb-4">
        <div className="w-px h-6 bg-gradient-to-b from-slate-500 to-cyan-400" />
      </div>

      {/* API Gateway */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setShowFlow(!showFlow)}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl px-8 py-3 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all"
        >
          🚪 API Gateway
          <span className="block text-[10px] font-normal opacity-70">Auth · Rate Limit · Routing (click me)</span>
        </button>
      </div>

      {/* Fan-out arrows */}
      <div className="flex justify-center mb-4">
        <div className="flex items-end gap-6">
          {services.map((_, i) => (
            <div key={i} className={`w-px h-8 transition-colors duration-500 ${showFlow ? 'bg-cyan-400' : 'bg-slate-600'}`}
              style={{ animationDelay: `${i * 150}ms` }} />
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {services.map((svc) => (
          <div
            key={svc.name}
            className={`border-2 ${svc.color} rounded-xl p-4 text-center cursor-pointer transition-all duration-300
              ${activeService === svc.name ? 'scale-105 shadow-lg ring-1 ring-white/20' : 'hover:scale-[1.02]'}`}
            onClick={() => setActiveService(activeService === svc.name ? null : svc.name)}
          >
            <div className="text-2xl mb-1">{svc.icon}</div>
            <div className="text-xs text-white font-semibold">{svc.name}</div>
            <div className="text-[10px] text-slate-400 mt-1">Own DB · Own Deploy</div>
          </div>
        ))}
      </div>

      {/* Message Queue */}
      <div className="flex justify-center mb-4">
        <div className="flex items-center gap-2">
          {services.map((_, i) => (
            <div key={i} className={`w-px h-6 transition-colors duration-500 ${showFlow ? 'bg-orange-400' : 'bg-slate-600'}`} />
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-400/50 rounded-xl px-8 py-3 text-center">
          <div className="text-sm font-bold text-orange-300">📨 Message Queue</div>
          <div className="text-[10px] text-slate-400">Kafka / RabbitMQ — Async Communication</div>
        </div>
      </div>

      {/* Service detail popup */}
      {activeService && (
        <div className="mt-4 bg-slate-800 rounded-lg p-4 border border-slate-600 text-sm text-slate-300 animate-[fadeIn_0.2s_ease-in]">
          <span className="text-white font-semibold">{activeService}:</span> Independent deployment, own database, scales independently. Communicates via REST/gRPC + async events.
        </div>
      )}
    </div>
  );
}
