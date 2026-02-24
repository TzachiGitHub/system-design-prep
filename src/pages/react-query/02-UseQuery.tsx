import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import RQNav from './RQNav'

function PostsDemo() {
  const {
    data,
    isLoading,
    isError,
    isFetching,
    status,
    fetchStatus,
    error,
    refetch,
  } = useQuery({
    queryKey: ['demo-posts'],
    queryFn: () => api.getPosts(1, 5),
    staleTime: 10_000,
  })

  return (
    <div className="space-y-4">
      {/* Status bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-mono px-2.5 py-1 rounded-full border ${
            status === 'pending' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' :
            status === 'error'   ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                                   'bg-green-500/10 border-green-500/30 text-green-400'
          }`}>
            status: {status}
          </span>
          <span className={`text-xs font-mono px-2.5 py-1 rounded-full border ${
            fetchStatus === 'fetching' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
            fetchStatus === 'paused'   ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' :
                                        'bg-slate-700 border-slate-600 text-slate-400'
          }`}>
            fetchStatus: {fetchStatus}
          </span>
          {isFetching && !isLoading && (
            <span className="inline-flex items-center gap-1.5 text-xs text-blue-400">
              <span className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin" />
              background refetch
            </span>
          )}
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          {isFetching && (
            <span className="w-3.5 h-3.5 border border-white border-t-transparent rounded-full animate-spin" />
          )}
          Refetch
        </button>
      </div>

      {/* isLoading only true on first load — no cached data */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-10 gap-3">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">
            <span className="text-yellow-400 font-mono">isLoading: true</span> — first load, no cache yet
          </p>
        </div>
      )}

      {isError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400 font-medium text-sm">Query failed</p>
          <p className="text-red-300 text-xs mt-1">{String(error)}</p>
        </div>
      )}

      {data && (
        <div className="space-y-3">
          {data.map((post) => (
            <div key={post.id} className="bg-slate-900 rounded-lg p-4 border border-slate-700">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-purple-400 text-xs font-mono">#{post.id}</span>
                <span className="text-slate-600 text-xs">userId: {post.userId}</span>
              </div>
              <h3 className="text-slate-100 text-sm font-semibold capitalize mb-1">{post.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{post.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const returnValues = [
  { name: 'data', type: 'T | undefined', desc: 'The resolved value from queryFn. undefined until first success.' },
  { name: 'isLoading', type: 'boolean', desc: 'True only on the initial fetch when there is no cached data yet.' },
  { name: 'isFetching', type: 'boolean', desc: 'True whenever a network request is in flight — including background refetches.' },
  { name: 'isError', type: 'boolean', desc: 'True when the latest fetch resulted in an error.' },
  { name: 'isSuccess', type: 'boolean', desc: 'True when data is available from a successful fetch.' },
  { name: 'status', type: '"pending" | "error" | "success"', desc: 'The coarse query status string.' },
  { name: 'fetchStatus', type: '"fetching" | "paused" | "idle"', desc: 'Fine-grained network status, independent of data status.' },
  { name: 'error', type: 'Error | null', desc: 'The thrown error object when isError is true.' },
  { name: 'refetch', type: '() => Promise', desc: 'Imperatively trigger a refetch of this query.' },
]

export default function RQUseQuery() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="text-purple-400 text-sm font-medium mb-1 font-mono">02 — useQuery</div>
        <h1 className="text-4xl font-bold text-slate-100 mb-3">useQuery Basics</h1>
        <p className="text-slate-400 leading-relaxed">
          The primary hook for reading server state. Handles fetching, caching, and
          all the status flags you need to build great loading UIs.
        </p>
      </div>

      {/* isLoading vs isFetching callout */}
      <div className="bg-slate-800 rounded-xl border border-amber-500/30 p-5 space-y-3">
        <h2 className="text-lg font-semibold text-amber-400">isLoading vs isFetching</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-900 rounded-lg p-4 border border-yellow-500/20">
            <p className="text-yellow-400 font-mono text-sm font-semibold mb-1">isLoading</p>
            <p className="text-slate-300 text-sm leading-relaxed">
              Only <span className="text-yellow-300">true on the very first fetch</span> when there is no data in
              the cache. Use this to show a full-page skeleton or spinner.
            </p>
          </div>
          <div className="bg-slate-900 rounded-lg p-4 border border-blue-500/20">
            <p className="text-blue-400 font-mono text-sm font-semibold mb-1">isFetching</p>
            <p className="text-slate-300 text-sm leading-relaxed">
              True <span className="text-blue-300">any time a network request is in-flight</span>, including
              background refetches when data is already visible. Use for subtle loading indicators.
            </p>
          </div>
        </div>
        <p className="text-slate-500 text-xs font-mono mt-1">
          isLoading = status === "pending" && fetchStatus === "fetching"
        </p>
      </div>

      {/* Query Keys */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-3">
        <h2 className="text-lg font-semibold text-slate-100">Query Keys & queryFn</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          The <span className="text-purple-300">queryKey</span> is the cache address for your query.
          React Query will refetch whenever the key changes — making it the primary way to
          drive dynamic queries (e.g., changing page, userId, search term).
          The <span className="text-purple-300">queryFn</span> must return a Promise.
        </p>
        <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm text-slate-300 leading-relaxed">
          <span className="text-blue-400">const</span>
          {' { data, isLoading, isFetching, refetch } = '}
          <span className="text-yellow-300">useQuery</span>{'({\n'}
          {'  '}<span className="text-red-300">queryKey</span>
          {": ["}<span className="text-green-300">'demo-posts'</span>
          {'],\n'}
          {'  '}<span className="text-red-300">queryFn</span>
          {': () => '}<span className="text-yellow-300">api.getPosts</span>
          {'(1, 5),\n'}
          {'  '}<span className="text-red-300">staleTime</span>
          {': 10_000,  '}
          <span className="text-slate-500">{'// 10s before background refetch'}</span>
          {'\n})'}
        </div>
      </div>

      {/* Return values table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-3">
        <h2 className="text-lg font-semibold text-slate-100">Return Values</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 text-xs border-b border-slate-700">
                <th className="pb-2 pr-4 font-medium">Property</th>
                <th className="pb-2 pr-4 font-medium">Type</th>
                <th className="pb-2 font-medium">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {returnValues.map((rv) => (
                <tr key={rv.name}>
                  <td className="py-2.5 pr-4 font-mono text-purple-300 whitespace-nowrap">{rv.name}</td>
                  <td className="py-2.5 pr-4 font-mono text-yellow-300/70 text-xs whitespace-nowrap">{rv.type}</td>
                  <td className="py-2.5 text-slate-400 text-xs leading-relaxed">{rv.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live demo */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">Live Demo: 5 Posts</h2>
          <span className="bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs px-2 py-1 rounded">interactive</span>
        </div>
        <p className="text-slate-400 text-sm">
          The query fetches on mount. Hit <strong className="text-slate-300">Refetch</strong> to see{' '}
          <code className="text-blue-300 text-xs bg-slate-900 px-1 rounded">isFetching</code> go
          true while <code className="text-yellow-300 text-xs bg-slate-900 px-1 rounded">isLoading</code>{' '}
          stays false (data is already in cache).
        </p>
        <PostsDemo />
      </div>
      <RQNav current="/tech/react-query/use-query" />
    </div>
  )
}
