import { NavLink } from 'react-router-dom'
import RQNav from './RQNav'

const concepts = [
  {
    path: '/tech/react-query/intro',
    title: 'Intro',
    icon: '🚀',
    description: 'What React Query is, the three pillars, and your first query in action.',
  },
  {
    path: '/tech/react-query/use-query',
    title: 'useQuery',
    icon: '🔍',
    description: 'Query keys, queryFn, return values, refetching, and isFetching vs isLoading.',
  },
  {
    path: '/tech/react-query/states',
    title: 'Query States',
    icon: '🔄',
    description: 'Interactive state machine: pending, success, error, paused — with live flags.',
  },
  {
    path: '/tech/react-query/caching',
    title: 'Caching',
    icon: '💾',
    description: 'staleTime, gcTime, background refetching, fresh vs stale lifecycle.',
  },
  {
    path: '/tech/react-query/mutations',
    title: 'Mutations',
    icon: '✏️',
    description: 'useMutation for create, update, delete with pending states and callbacks.',
  },
  {
    path: '/tech/react-query/invalidation',
    title: 'Invalidation',
    icon: '🗑️',
    description: 'invalidateQueries, query matching patterns, and refetch triggers.',
  },
  {
    path: '/tech/react-query/pagination',
    title: 'Pagination',
    icon: '📄',
    description: 'keepPreviousData, page-based queries, and smooth page transitions.',
  },
  {
    path: '/tech/react-query/infinite',
    title: 'Infinite Scroll',
    icon: '♾️',
    description: 'useInfiniteQuery, getNextPageParam, and load-more patterns.',
  },
  {
    path: '/tech/react-query/dependent',
    title: 'Dependent Queries',
    icon: '🔗',
    description: 'Chaining queries with the enabled option for sequential data fetching.',
  },
  {
    path: '/tech/react-query/optimistic',
    title: 'Optimistic Updates',
    icon: '⚡',
    description: 'Update the UI instantly before the server responds, roll back on error.',
  },
]

const painPoints = [
  {
    title: 'Manual loading states',
    desc: 'Every component needs its own isLoading, isError, data useState boilerplate.',
  },
  {
    title: 'No caching',
    desc: 'Navigating away and back re-fetches the same data even if nothing changed.',
  },
  {
    title: 'Race conditions',
    desc: 'Async responses can arrive out of order, causing stale data to overwrite fresh data.',
  },
  {
    title: 'No background sync',
    desc: 'Data goes stale silently — you never know when to re-fetch to stay current.',
  },
]

export default function ReactQueryOverview() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-1.5 text-purple-400 text-sm font-medium">
          TanStack Query v5
        </div>
        <h1 className="text-5xl font-bold text-slate-100">React Query</h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          The missing piece for server state management in React — async data fetching,
          caching, synchronization, and background updates with zero boilerplate.
        </p>
      </div>

      {/* What is React Query */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-purple-400">What is React Query?</h2>
        <p className="text-slate-300 leading-relaxed">
          React Query is a <span className="text-purple-300 font-medium">server state management</span> library.
          It handles the complexities of fetching, caching, and synchronizing data from external sources.
        </p>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="bg-slate-900 rounded-lg p-4 border border-green-500/20">
            <h3 className="text-green-400 font-semibold mb-2">Server State (React Query owns this)</h3>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• Persisted remotely (API, database)</li>
              <li>• Shared across multiple clients</li>
              <li>• Can become stale without your knowledge</li>
              <li>• Requires async operations to update</li>
            </ul>
          </div>
          <div className="bg-slate-900 rounded-lg p-4 border border-blue-500/20">
            <h3 className="text-blue-400 font-semibold mb-2">Client State (useState / Zustand)</h3>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• Owned and controlled by your app</li>
              <li>• Stored in memory, lost on refresh</li>
              <li>• Always synchronous to update</li>
              <li>• UI state: modals, tabs, form inputs</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Why not useEffect */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-red-400">Why not just useEffect + fetch?</h2>
        <p className="text-slate-400 text-sm mb-4">
          You can fetch data with useEffect, but at scale it becomes a maintenance nightmare:
        </p>
        <div className="grid md:grid-cols-2 gap-3">
          {painPoints.map((p) => (
            <div key={p.title} className="bg-slate-900 rounded-lg p-4 border border-red-500/20">
              <h3 className="text-red-400 font-medium text-sm mb-1">{p.title}</h3>
              <p className="text-slate-400 text-sm">{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="bg-slate-950 rounded-lg p-4 mt-2">
          <p className="text-slate-500 text-xs mb-2 font-mono">// A typical useEffect fetch — 30+ lines of boilerplate per query</p>
          <pre className="text-slate-300 font-mono text-sm leading-relaxed">{`const [data, setData] = useState(null)
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState(null)

useEffect(() => {
  let cancelled = false
  setIsLoading(true)
  fetch('/api/posts')
    .then(r => r.json())
    .then(d => { if (!cancelled) setData(d) })
    .catch(e => { if (!cancelled) setError(e) })
    .finally(() => { if (!cancelled) setIsLoading(false) })
  return () => { cancelled = true }
}, [])`}</pre>
        </div>
      </div>

      {/* How React Query solves it */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-purple-400">How React Query solves it</h2>
        <div className="bg-slate-950 rounded-lg p-4">
          <p className="text-slate-500 text-xs mb-2 font-mono">// The entire above example becomes:</p>
          <pre className="text-slate-300 font-mono text-sm leading-relaxed">{`const { data, isLoading, error } = useQuery({
  queryKey: ['posts'],
  queryFn: () => api.getPosts(),
})`}</pre>
        </div>
        <div className="grid md:grid-cols-3 gap-3 mt-2">
          {[
            { label: 'Automatic caching', desc: 'Data is cached by key. Re-renders and re-mounts reuse cached data instantly.' },
            { label: 'Background refetching', desc: 'Stale data is refetched silently when the window regains focus or network reconnects.' },
            { label: 'Deduplication', desc: 'Multiple components querying the same key share one network request.' },
          ].map((item) => (
            <div key={item.label} className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
              <h3 className="text-purple-300 font-semibold text-sm mb-1">{item.label}</h3>
              <p className="text-slate-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Concept cards grid */}
      <div>
        <h2 className="text-2xl font-semibold text-slate-100 mb-5">Learning Path</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {concepts.map((c) => (
            <NavLink
              key={c.path}
              to={c.path}
              className="bg-slate-800 rounded-xl border border-slate-700 p-5 hover:border-purple-500/50 hover:bg-slate-700/50 transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{c.icon}</span>
                <span className="text-slate-100 font-semibold group-hover:text-purple-300 transition-colors">
                  {c.title}
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">{c.description}</p>
            </NavLink>
          ))}
        </div>
      </div>
      <RQNav current="/tech/react-query" />
    </div>
  )
}
