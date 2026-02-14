import type { Category, NodeStatus } from '../types';

const categories: { value: Category | 'all'; label: string; color: string }[] = [
  { value: 'all', label: 'All', color: 'bg-slate-600' },
  { value: 'fundamentals', label: 'Fundamentals', color: 'bg-blue-500' },
  { value: 'building-blocks', label: 'Building Blocks', color: 'bg-purple-500' },
  { value: 'patterns', label: 'Patterns', color: 'bg-emerald-500' },
  { value: 'problems', label: 'Problems', color: 'bg-orange-500' },
];

const statuses: { value: NodeStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'not-started', label: 'Not Started' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  categoryFilter: Category | 'all';
  onCategoryChange: (v: Category | 'all') => void;
  statusFilter: NodeStatus | 'all';
  onStatusChange: (v: NodeStatus | 'all') => void;
}

export default function SearchFilter({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
}: Props) {
  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search topics..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {/* Category */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => onCategoryChange(c.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                categoryFilter === c.value
                  ? `${c.color} text-white shadow-lg`
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="w-px bg-slate-700 mx-1 hidden sm:block" />

        {/* Status */}
        <div className="flex flex-wrap gap-1.5">
          {statuses.map((s) => (
            <button
              key={s.value}
              onClick={() => onStatusChange(s.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === s.value
                  ? 'bg-slate-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
