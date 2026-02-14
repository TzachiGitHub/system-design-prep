import { useState } from 'react';

interface FlowNode {
  id: string;
  label: string;
  icon?: string;
  sublabel?: string;
  color?: string;
}

interface FlowEdge {
  from: string;
  to: string;
  label?: string;
}

interface DataFlowDiagramProps {
  title?: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  layout?: 'horizontal' | 'vertical';
}

const colorClasses: Record<string, { border: string; bg: string }> = {
  blue: { border: 'border-blue-400', bg: 'bg-blue-500/20' },
  green: { border: 'border-green-400', bg: 'bg-green-500/20' },
  amber: { border: 'border-amber-400', bg: 'bg-amber-500/20' },
  red: { border: 'border-red-400', bg: 'bg-red-500/20' },
  purple: { border: 'border-purple-400', bg: 'bg-purple-500/20' },
  cyan: { border: 'border-cyan-400', bg: 'bg-cyan-500/20' },
  pink: { border: 'border-pink-400', bg: 'bg-pink-500/20' },
  emerald: { border: 'border-emerald-400', bg: 'bg-emerald-500/20' },
  slate: { border: 'border-slate-400', bg: 'bg-slate-500/20' },
};

export default function DataFlowDiagram({ title, nodes, edges, layout = 'horizontal' }: DataFlowDiagramProps) {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const isHoriz = layout === 'horizontal';
  const activeEdges = activeNode ? edges.filter((e) => e.from === activeNode || e.to === activeNode) : [];
  const connectedNodes = new Set(activeEdges.flatMap((e) => [e.from, e.to]));

  return (
    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-700">
      {title && <h3 className="text-xl font-bold text-white mb-6 text-center">{title}</h3>}

      <div className={`flex ${isHoriz ? 'flex-row items-center' : 'flex-col items-center'} gap-3 justify-center flex-wrap`}>
        {nodes.map((node, i) => {
          const c = colorClasses[node.color || 'slate'];
          const isActive = activeNode === node.id || connectedNodes.has(node.id);

          return (
            <div key={node.id} className="flex items-center gap-3">
              {/* Node box */}
              <div
                className={`border-2 ${c.border} ${c.bg} rounded-xl p-4 text-center cursor-pointer transition-all duration-300 min-w-[100px]
                  ${isActive ? 'scale-105 shadow-lg ring-1 ring-white/20' : 'hover:scale-[1.02]'}
                  ${activeNode && !isActive ? 'opacity-30' : ''}`}
                onMouseEnter={() => setActiveNode(node.id)}
                onMouseLeave={() => setActiveNode(null)}
              >
                {node.icon && <div className="text-2xl mb-1">{node.icon}</div>}
                <div className="text-xs text-white font-semibold">{node.label}</div>
                {node.sublabel && <div className="text-[10px] text-slate-400 mt-0.5">{node.sublabel}</div>}
              </div>

              {/* Arrow to next */}
              {i < nodes.length - 1 && (
                <div className={`flex ${isHoriz ? 'flex-row' : 'flex-col'} items-center`}>
                  {(() => {
                    const edge = edges.find((e) => e.from === node.id);
                    const edgeActive = activeEdges.some((e) => e.from === node.id || e.to === nodes[i + 1]?.id);
                    return (
                      <div className="flex flex-col items-center">
                        <div className={`${isHoriz ? 'w-8 h-0.5' : 'h-8 w-0.5'} transition-colors duration-300 ${edgeActive ? 'bg-cyan-400' : 'bg-slate-600'}`} />
                        {edge?.label && (
                          <div className={`text-[8px] transition-colors ${edgeActive ? 'text-cyan-300' : 'text-slate-500'}`}>{edge.label}</div>
                        )}
                        <div className={`text-xs transition-colors ${edgeActive ? 'text-cyan-400' : 'text-slate-600'}`}>
                          {isHoriz ? '→' : '↓'}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
