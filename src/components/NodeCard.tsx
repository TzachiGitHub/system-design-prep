import type { RoadmapNode, NodeStatus, Category } from '../types';

const categoryColors: Record<Category, { border: string; glow: string; dot: string }> = {
  fundamentals: { border: 'border-blue-500/30', glow: 'hover:shadow-blue-500/10', dot: 'bg-blue-500' },
  'building-blocks': { border: 'border-purple-500/30', glow: 'hover:shadow-purple-500/10', dot: 'bg-purple-500' },
  patterns: { border: 'border-emerald-500/30', glow: 'hover:shadow-emerald-500/10', dot: 'bg-emerald-500' },
  problems: { border: 'border-orange-500/30', glow: 'hover:shadow-orange-500/10', dot: 'bg-orange-500' },
};

const statusDot: Record<NodeStatus, string> = {
  locked: 'bg-slate-600',
  'not-started': 'bg-slate-500',
  'in-progress': 'bg-amber-400',
  completed: 'bg-emerald-400',
};

const statusBg: Record<NodeStatus, string> = {
  locked: 'bg-slate-800/40 opacity-50',
  'not-started': 'bg-slate-800',
  'in-progress': 'bg-slate-800',
  completed: 'bg-slate-800',
};

interface Props {
  node: RoadmapNode;
  status: NodeStatus;
  onClick: () => void;
}

export default function NodeCard({ node, status, onClick }: Props) {
  const cat = categoryColors[node.category];
  const isLocked = status === 'locked';

  return (
    <button
      onClick={isLocked ? undefined : onClick}
      disabled={isLocked}
      data-node-id={node.id}
      className={`
        relative group flex items-center gap-2.5 px-4 py-3
        rounded-xl border transition-all duration-200 ease-out
        ${statusBg[status]} ${cat.border}
        ${isLocked ? 'cursor-not-allowed' : `cursor-pointer hover:scale-[1.03] hover:shadow-lg ${cat.glow} hover:border-opacity-60`}
        min-w-[140px] max-w-[200px]
      `}
    >
      {/* Status dot */}
      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusDot[status]} ${status === 'in-progress' ? 'animate-pulse' : ''}`} />

      {/* Title */}
      <span className={`text-sm font-medium text-left leading-tight ${isLocked ? 'text-slate-600' : 'text-slate-200'}`}>
        {node.title}
      </span>

      {/* Completed checkmark */}
      {status === 'completed' && (
        <svg className="w-4 h-4 text-emerald-400 shrink-0 ml-auto" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
}
