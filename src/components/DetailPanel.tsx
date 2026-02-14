import { useEffect, useRef } from 'react';
import type { RoadmapNode, NodeStatus, Category } from '../types';
import QuizSection from './QuizSection';

const categoryBadge: Record<Category, { label: string; bg: string }> = {
  fundamentals: { label: 'Fundamentals', bg: 'bg-blue-500/20 text-blue-400' },
  'building-blocks': { label: 'Building Blocks', bg: 'bg-purple-500/20 text-purple-400' },
  patterns: { label: 'Patterns', bg: 'bg-emerald-500/20 text-emerald-400' },
  problems: { label: 'Problems', bg: 'bg-orange-500/20 text-orange-400' },
};

const statusButtons: { value: NodeStatus; label: string; active: string }[] = [
  { value: 'not-started', label: 'Not Started', active: 'bg-slate-600 text-slate-200' },
  { value: 'in-progress', label: 'In Progress', active: 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40' },
  { value: 'completed', label: 'Completed', active: 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/40' },
];

interface Props {
  node: RoadmapNode | null;
  status: NodeStatus;
  onStatusChange: (status: NodeStatus) => void;
  onClose: () => void;
  onNavigate: (nodeId: string) => void;
  allNodes: RoadmapNode[];
}

function renderContent(content: string) {
  return content.split('\n').map((line, i) => {
    if (!line.trim()) return <br key={i} />;
    // Bold
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j} className="text-slate-200">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
    if (line.startsWith('- ')) {
      return <li key={i} className="ml-4 text-sm text-slate-400 leading-relaxed">{parts.slice(0)}</li>;
    }
    return <p key={i} className="text-sm text-slate-400 leading-relaxed">{parts}</p>;
  });
}

export default function DetailPanel({ node, status, onStatusChange, onClose, onNavigate, allNodes }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const open = node !== null;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleBackdropClick}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={`
          fixed z-50 bg-slate-900 border-l border-slate-700/50 shadow-2xl
          transition-transform duration-300 ease-out overflow-y-auto
          top-0 right-0 h-full
          w-full sm:w-[480px] md:w-[520px]
          ${open ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {node && (
          <div className="p-6 space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-medium ${categoryBadge[node.category].bg}`}>
                  {categoryBadge[node.category].label}
                </span>
                <h2 className="text-xl font-bold text-slate-100">{node.title}</h2>
                <p className="text-sm text-slate-500">{node.description}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Status toggle */}
            <div className="flex gap-2">
              {statusButtons.map((s) => (
                <button
                  key={s.value}
                  onClick={() => onStatusChange(s.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    status === s.value ? s.active : 'bg-slate-800 text-slate-500 hover:text-slate-400'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="space-y-1.5">{renderContent(node.content)}</div>

            {/* Tips */}
            {node.tips.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">💡 Tips</h3>
                {node.tips.map((tip, i) => (
                  <div key={i} className="flex gap-2 p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg">
                    <span className="text-amber-400 shrink-0 text-sm">→</span>
                    <span className="text-sm text-amber-200/80 leading-relaxed">{tip}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Related */}
            {node.relatedIds.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Related Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {node.relatedIds.map((id) => {
                    const related = allNodes.find((n) => n.id === id);
                    if (!related) return null;
                    return (
                      <button
                        key={id}
                        onClick={() => onNavigate(id)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-lg border border-slate-700/50 transition-colors"
                      >
                        {related.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quiz */}
            {node.quizQuestions.length > 0 && <QuizSection questions={node.quizQuestions} />}
          </div>
        )}
      </div>
    </>
  );
}
