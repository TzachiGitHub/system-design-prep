import { useState } from 'react';

const nodes = [
  { name: 'Node A', angle: 30, color: '#3b82f6' },
  { name: 'Node B', angle: 120, color: '#10b981' },
  { name: 'Node C', angle: 210, color: '#f59e0b' },
  { name: 'Node D', angle: 300, color: '#ec4899' },
];

const keys = [
  { name: 'key1', angle: 55, assignedTo: 1 },
  { name: 'key2', angle: 150, assignedTo: 2 },
  { name: 'key3', angle: 240, assignedTo: 3 },
  { name: 'key4', angle: 340, assignedTo: 0 },
  { name: 'key5', angle: 95, assignedTo: 1 },
];

export default function ConsistentHashingDiagram() {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [showKeys, setShowKeys] = useState(true);

  const r = 110; // ring radius
  const cx = 150, cy = 150;

  const posAt = (angle: number, radius = r) => ({
    x: cx + radius * Math.cos((angle - 90) * Math.PI / 180),
    y: cy + radius * Math.sin((angle - 90) * Math.PI / 180),
  });

  return (
    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700">
      <h3 className="text-xl font-bold text-white mb-2 text-center">Consistent Hashing</h3>
      <p className="text-xs text-slate-400 text-center mb-4">Hash ring — keys map to the next clockwise node</p>

      <div className="flex justify-center mb-4">
        <button
          onClick={() => setShowKeys(!showKeys)}
          className={`px-3 py-1 rounded-full text-xs transition-all ${showKeys ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400 border border-slate-600'}`}
        >
          {showKeys ? '🔑 Hide Keys' : '🔑 Show Keys'}
        </button>
      </div>

      <div className="flex justify-center">
        <svg width="300" height="300" viewBox="0 0 300 300">
          {/* Ring */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#334155" strokeWidth="3" strokeDasharray="4 4" />

          {/* Hash direction arrow */}
          <text x={cx + r + 15} y={cy} fill="#64748b" fontSize="10" textAnchor="start">↻ clockwise</text>

          {/* Node markers */}
          {nodes.map((node, i) => {
            const pos = posAt(node.angle);
            const isHovered = hoveredNode === i;
            const assignedKeys = keys.filter((k) => k.assignedTo === i);
            return (
              <g key={node.name}
                onMouseEnter={() => setHoveredNode(i)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: 'pointer' }}>
                {/* Glow */}
                {isHovered && <circle cx={pos.x} cy={pos.y} r="22" fill={node.color} opacity="0.2" />}
                <circle cx={pos.x} cy={pos.y} r="16" fill="#0f172a" stroke={node.color} strokeWidth={isHovered ? 3 : 2} />
                <text x={pos.x} y={pos.y + 1} fill={node.color} fontSize="8" textAnchor="middle" dominantBaseline="middle" fontWeight="bold">
                  {node.name.split(' ')[1]}
                </text>
                {/* Label */}
                {(() => { const lp = posAt(node.angle, r + 32); return (
                  <text x={lp.x} y={lp.y} fill={isHovered ? '#fff' : '#94a3b8'} fontSize="9" textAnchor="middle" dominantBaseline="middle">
                    {node.name}{isHovered ? ` (${assignedKeys.length} keys)` : ''}
                  </text>
                ); })()}
              </g>
            );
          })}

          {/* Keys */}
          {showKeys && keys.map((key) => {
            const pos = posAt(key.angle, r - 25);
            const nodePos = posAt(nodes[key.assignedTo].angle);
            const isHighlighted = hoveredNode === key.assignedTo;
            return (
              <g key={key.name}>
                {/* Line to node */}
                <line x1={pos.x} y1={pos.y} x2={nodePos.x} y2={nodePos.y}
                  stroke={isHighlighted ? nodes[key.assignedTo].color : '#334155'}
                  strokeWidth={isHighlighted ? 1.5 : 0.5}
                  strokeDasharray="3 3" opacity={isHighlighted ? 0.8 : 0.3} />
                <circle cx={pos.x} cy={pos.y} r="8" fill={isHighlighted ? nodes[key.assignedTo].color : '#475569'} opacity={isHighlighted ? 0.8 : 0.5} />
                <text x={pos.x} y={pos.y + 1} fill="#fff" fontSize="6" textAnchor="middle" dominantBaseline="middle">
                  {key.name.slice(-1)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {nodes.map((n, i) => (
          <div key={n.name}
            onMouseEnter={() => setHoveredNode(i)}
            onMouseLeave={() => setHoveredNode(null)}
            className={`text-center p-2 rounded-lg border transition-all cursor-pointer ${hoveredNode === i ? 'border-white/30 bg-slate-800' : 'border-transparent'}`}>
            <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: n.color }} />
            <div className="text-[10px] text-slate-300">{n.name}</div>
            <div className="text-[9px] text-slate-500">{keys.filter((k) => k.assignedTo === i).length} keys</div>
          </div>
        ))}
      </div>
    </div>
  );
}
