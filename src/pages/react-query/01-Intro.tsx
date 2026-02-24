import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/api'
import RQNav from './RQNav'

function StatusBadge({ status, isFetching }: { status: string; isFetching: boolean }) {
  if (isFetching && status === 'success') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-medium px-3 py-1 rounded-full">
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        refetching
      </span>
    )
  }
  if (status === 'pending') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-medium px-3 py-1 rounded-full">
        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
        pending
      </span>
    )
  }
  if (status === 'error') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium px-3 py-1 rounded-full">
        <span className="w-2 h-2 rounded-full bg-red-400" />
        error
      </span>
    )
  }
  if (status === 'success') {
    return (
      <span className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-medium px-3 py-1 rounded-full">
        <span className="w-2 h-2 rounded-full bg-green-400" />
        success
      </span>
    )
  }
  return null
}

function FirstQueryDemo() {
  const [enabled, setEnabled] = useState(false)

  const { data, status, isFetching, error, refetch } = useQuery({
    queryKey: ['intro-post', 1],
    queryFn: () => api.getPost(1),
    enabled,
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <button
          onClick={() => {
            if (!enabled) setEnabled(true)
            else refetch()
          }}
          className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {enabled ? 'Refetch Post' : 'Fetch a Post'}
        </button>
        <button
          onClick={() => setEnabled(false)}
          className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Reset
        </button>
        {enabled && <StatusBadge status={status} isFetching={isFetching} />}
      </div>

      {!enabled && (
        <div className="bg-slate-900 rounded-lg p-4 text-slate-500 text-sm text-center border border-dashed border-slate-700">
          Click "Fetch a Post" to run your first query
        </div>
      )}

      {status === 'pending' && enabled && (
        <div className="bg-slate-900 rounded-lg p-6 flex items-center justify-center gap-3">
          <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-400 text-sm">Fetching post from JSONPlaceholder...</span>
        </div>
      )}

      {status === 'error' && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400 text-sm font-medium">Error fetching post</p>
          <p className="text-red-300 text-xs mt-1">{String(error)}</p>
        </div>
      )}

      {status === 'success' && data && (
        <div className="bg-slate-900 rounded-lg p-5 border border-green-500/20 space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-green-400 text-xs font-mono">POST #{data.id}</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-500 text-xs font-mono">userId: {data.userId}</span>
          </div>
          <h3 className="text-slate-100 font-semibold capitalize">{data.title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed">{data.body}</p>
        </div>
      )}
    </div>
  )
}

export default function RQIntro() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="text-purple-400 text-sm font-medium mb-1 font-mono">01 — Introduction</div>
        <h1 className="text-4xl font-bold text-slate-100 mb-3">Intro to React Query</h1>
        <p className="text-slate-400 leading-relaxed">
          React Query makes server state management simple by providing a declarative API
          built on three core pillars.
        </p>
      </div>

      {/* Three pillars */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { num: '01', title: 'Fetching', color: 'purple', desc: 'Declaratively define what data you need. React Query handles the async lifecycle automatically.' },
          { num: '02', title: 'Caching', color: 'blue', desc: 'Every query result is cached by its key. Subsequent requests hit the cache instantly — no waterfall.' },
          { num: '03', title: 'Syncing', color: 'green', desc: 'Background refetching keeps your UI in sync with the server. Window focus, reconnect, intervals.' },
        ].map((p) => (
          <div key={p.num} className={`bg-slate-800 rounded-xl border border-slate-700 p-5`}>
            <div className={`text-xs font-mono mb-2 ${
              p.color === 'purple' ? 'text-purple-400' :
              p.color === 'blue' ? 'text-blue-400' : 'text-green-400'
            }`}>{p.num}</div>
            <h3 className="text-slate-100 font-semibold mb-2">{p.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Code snippet */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-3">
        <h2 className="text-lg font-semibold text-slate-100">What useQuery looks like</h2>
        <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm text-slate-300 leading-relaxed">
          <span className="text-slate-500">{'// 1. Import the hook'}</span>{'\n'}
          <span className="text-purple-400">import</span>
          {' { '}<span className="text-yellow-300">useQuery</span>{' } '}
          <span className="text-purple-400">from</span>
          {" '"}<span className="text-green-300">@tanstack/react-query</span>{"'\n\n"}
          <span className="text-slate-500">{'// 2. Use it in any component'}</span>{'\n'}
          <span className="text-blue-400">const</span>
          {' { '}<span className="text-yellow-300">data, isLoading, error</span>{' } = '}
          <span className="text-yellow-300">useQuery</span>{'({\n'}
          {'  '}<span className="text-red-300">queryKey</span>{': ['}
          <span className="text-green-300">"post"</span>{', id],   '}
          <span className="text-slate-500">{'// cache key (array)'}</span>{'\n'}
          {'  '}<span className="text-red-300">queryFn</span>{': () => '}
          <span className="text-yellow-300">api.getPost</span>{'(id)'}
          <span className="text-slate-500">{'  // async fetcher'}</span>{'\n'}
          {'})\n\n'}
          <span className="text-slate-500">{'// 3. Render'}</span>{'\n'}
          <span className="text-purple-400">if</span>
          {' (isLoading) '}<span className="text-purple-400">return</span>
          {' <'}<span className="text-blue-300">Spinner</span>{' />\n'}
          <span className="text-purple-400">if</span>
          {' (error) '}<span className="text-purple-400">return</span>
          {" <"}<span className="text-blue-300">Error</span>
          {" msg="}<span className="text-green-300">"Something went wrong"</span>
          {" />\n"}
          <span className="text-purple-400">return</span>
          {' <'}<span className="text-blue-300">Post</span>
          {' data={'}<span className="text-yellow-300">data</span>{'} />'}
        </div>
      </div>

      {/* Query keys explanation */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-3">
        <h2 className="text-lg font-semibold text-slate-100">Query Keys</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          Query keys are how React Query identifies and caches your queries. They are always arrays.
          When a key changes, React Query refetches automatically.
        </p>
        <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm space-y-2">
          <div className="flex gap-3">
            <span className="text-slate-300">{`['posts']`}</span>
            <span className="text-slate-500 text-xs self-center">→ all posts</span>
          </div>
          <div className="flex gap-3">
            <span className="text-slate-300">{`['post', 1]`}</span>
            <span className="text-slate-500 text-xs self-center">→ post with id 1</span>
          </div>
          <div className="flex gap-3">
            <span className="text-slate-300">{`['posts', { page: 2, limit: 5 }]`}</span>
            <span className="text-slate-500 text-xs self-center">→ paginated posts</span>
          </div>
          <div className="flex gap-3">
            <span className="text-slate-300">{`['user', userId, 'posts']`}</span>
            <span className="text-slate-500 text-xs self-center">→ posts by user</span>
          </div>
        </div>
      </div>

      {/* Live demo */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">Live Demo: First Query</h2>
          <span className="bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs px-2 py-1 rounded">interactive</span>
        </div>
        <p className="text-slate-400 text-sm">
          Click the button to run <code className="text-purple-300 text-xs bg-slate-900 px-1.5 py-0.5 rounded">useQuery</code> and
          fetch Post #1 from JSONPlaceholder. Watch the status badge change in real time.
        </p>
        <FirstQueryDemo />
      </div>
      <RQNav current="/tech/react-query/intro" />
    </div>
  )
}
