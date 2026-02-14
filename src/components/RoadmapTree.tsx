import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import type { RoadmapNode, NodeStatus, Category } from '../types';
import { roadmapNodes } from '../data/roadmapNodes';
import { roadmapEdges } from '../data/roadmapEdges';
import { useProgress } from '../hooks/useProgress';
import NodeCard from './NodeCard';
import DetailPanel from './DetailPanel';
import ProgressBar from './ProgressBar';
import SearchFilter from './SearchFilter';

const lanes: { category: Category; label: string; color: string; accent: string }[] = [
  { category: 'fundamentals', label: 'Fundamentals', color: 'text-blue-400', accent: 'border-blue-500/30' },
  { category: 'building-blocks', label: 'Building Blocks', color: 'text-purple-400', accent: 'border-purple-500/30' },
  { category: 'patterns', label: 'Patterns', color: 'text-emerald-400', accent: 'border-emerald-500/30' },
  { category: 'problems', label: 'Problems', color: 'text-orange-400', accent: 'border-orange-500/30' },
];

export default function RoadmapTree() {
  const { getStatus, setStatus, getStats } = useProgress();
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<NodeStatus | 'all'>('all');
  const treeRef = useRef<HTMLDivElement>(null);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});

  const stats = getStats();

  // Filter nodes
  const filteredNodeIds = useMemo(() => {
    return new Set(
      roadmapNodes
        .filter((n) => {
          if (search && !n.title.toLowerCase().includes(search.toLowerCase())) return false;
          if (categoryFilter !== 'all' && n.category !== categoryFilter) return false;
          if (statusFilter !== 'all' && getStatus(n.id) !== statusFilter) return false;
          return true;
        })
        .map((n) => n.id)
    );
  }, [search, categoryFilter, statusFilter, getStatus]);

  // Group by category
  const nodesByCategory = useMemo(() => {
    const map: Record<Category, RoadmapNode[]> = {
      fundamentals: [],
      'building-blocks': [],
      patterns: [],
      problems: [],
    };
    for (const node of roadmapNodes) {
      map[node.category].push(node);
    }
    return map;
  }, []);

  // Calculate positions for SVG edges
  useEffect(() => {
    const update = () => {
      if (!treeRef.current) return;
      const treeRect = treeRef.current.getBoundingClientRect();
      const positions: Record<string, { x: number; y: number }> = {};
      for (const node of roadmapNodes) {
        const el = treeRef.current.querySelector(`[data-node-id="${node.id}"]`);
        if (el) {
          const rect = el.getBoundingClientRect();
          positions[node.id] = {
            x: rect.left - treeRect.left + rect.width / 2,
            y: rect.top - treeRect.top + rect.height / 2,
          };
        }
      }
      setNodePositions(positions);
    };
    // delay to let layout settle
    const timer = setTimeout(update, 100);
    window.addEventListener('resize', update);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', update);
    };
  }, [filteredNodeIds]);

  const handleNavigate = useCallback(
    (nodeId: string) => {
      const node = roadmapNodes.find((n) => n.id === nodeId);
      if (node) setSelectedNode(node);
    },
    []
  );

  // Visible edges
  const visibleEdges = useMemo(() => {
    return roadmapEdges.filter(
      (e) => filteredNodeIds.has(e.from) && filteredNodeIds.has(e.to)
    );
  }, [filteredNodeIds]);

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
            System Design Roadmap
          </h1>
          <p className="text-sm text-slate-500">Master system design concepts, patterns, and problems</p>
        </div>

        {/* Progress */}
        <ProgressBar stats={stats} />

        {/* Search & Filter */}
        <SearchFilter
          search={search}
          onSearchChange={setSearch}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />

        {/* Tree */}
        <div ref={treeRef} className="relative">
          {/* SVG Edges */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#475569" />
              </marker>
            </defs>
            {visibleEdges.map((edge) => {
              const from = nodePositions[edge.from];
              const to = nodePositions[edge.to];
              if (!from || !to) return null;
              return (
                <line
                  key={`${edge.from}-${edge.to}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke="#334155"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  markerEnd="url(#arrowhead)"
                  opacity={0.5}
                />
              );
            })}
          </svg>

          {/* Lanes */}
          <div className="space-y-6 relative z-10">
            {lanes.map((lane) => {
              const nodes = nodesByCategory[lane.category].filter((n) =>
                filteredNodeIds.has(n.id)
              );
              if (nodes.length === 0) return null;

              return (
                <div key={lane.category} className={`rounded-2xl border ${lane.accent} bg-slate-800/20 p-4 sm:p-5`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-1 h-6 rounded-full ${lane.color.replace('text-', 'bg-')}`} />
                    <h2 className={`text-sm font-semibold uppercase tracking-wider ${lane.color}`}>
                      {lane.label}
                    </h2>
                    <span className="text-xs text-slate-600">
                      {nodesByCategory[lane.category].filter((n) => getStatus(n.id) === 'completed').length}/
                      {nodesByCategory[lane.category].length}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {nodes.map((node) => (
                      <NodeCard
                        key={node.id}
                        node={node}
                        status={getStatus(node.id)}
                        onClick={() => setSelectedNode(node)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      <DetailPanel
        node={selectedNode}
        status={selectedNode ? getStatus(selectedNode.id) : 'not-started'}
        onStatusChange={(s) => {
          if (selectedNode) setStatus(selectedNode.id, s);
        }}
        onClose={() => setSelectedNode(null)}
        onNavigate={handleNavigate}
        allNodes={roadmapNodes}
      />
    </div>
  );
}
