import { useState } from 'react';

const layers = [
  { name: 'Presentation Layer', desc: 'UI, Controllers, API endpoints', color: 'from-blue-500 to-blue-600', icon: '🖥️' },
  { name: 'Business Logic Layer', desc: 'Services, Validation, Rules engine', color: 'from-purple-500 to-purple-600', icon: '⚙️' },
  { name: 'Data Access Layer', desc: 'ORM, Repositories, Query builders', color: 'from-amber-500 to-amber-600', icon: '🔗' },
  { name: 'Database', desc: 'Single relational database (PostgreSQL, MySQL)', color: 'from-emerald-500 to-emerald-600', icon: '🗄️' },
];

export default function MonolithDiagram() {
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  return (
    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-6 text-center">Monolithic Architecture</h3>

      {/* Single deployment unit box */}
      <div className="relative border-2 border-dashed border-slate-500 rounded-xl p-6 mx-auto max-w-lg">
        <span className="absolute -top-3 left-4 bg-slate-900 px-2 text-xs text-slate-400 uppercase tracking-wider">
          Single Deployment Unit
        </span>

        <div className="space-y-3">
          {layers.map((layer, i) => (
            <div
              key={layer.name}
              className={`relative bg-gradient-to-r ${layer.color} rounded-lg p-4 cursor-pointer
                transition-all duration-300 ${activeLayer === i ? 'scale-105 shadow-lg shadow-white/10 ring-2 ring-white/30' : 'hover:scale-[1.02]'}`}
              onClick={() => setActiveLayer(activeLayer === i ? null : i)}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{layer.icon}</span>
                <div>
                  <div className="font-semibold text-white text-sm">{layer.name}</div>
                  <div className={`text-xs text-white/70 transition-all duration-300 overflow-hidden ${activeLayer === i ? 'max-h-20 mt-1' : 'max-h-0'}`}>
                    {layer.desc}
                  </div>
                </div>
              </div>

              {/* Arrow between layers */}
              {i < layers.length - 1 && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-10 text-slate-400 text-xs">▼</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Properties */}
      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
        {[
          { label: 'Deploy', value: 'Single unit', emoji: '📦' },
          { label: 'Scale', value: 'Vertical', emoji: '↕️' },
          { label: 'Coupling', value: 'Tight', emoji: '🔒' },
        ].map((p) => (
          <div key={p.label} className="bg-slate-800 rounded-lg p-3 border border-slate-700">
            <div className="text-lg">{p.emoji}</div>
            <div className="text-[10px] text-slate-400 uppercase">{p.label}</div>
            <div className="text-xs text-white font-medium">{p.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
