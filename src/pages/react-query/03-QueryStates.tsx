import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import RQNav from './RQNav'

type DemoMode = 'idle' | 'success' | 'error'

function QueryStateDemo({ mode }: { mode: DemoMode }) {
  const queryClient = useQueryClient()

  // Remove cached data when mode changes so we always see loading state
  const queryKey = ['states-demo', mode]

  const { data, status, fetchStatus, isLoading, isError, isSuccess, isFetching, error } =
    useQuery({
      queryKey,
      queryFn: () => {
        if (mode === 'error') {
          return fetch('https://jsonplaceholder.typicode.com/invalid-endpoint-xyz')
            .then((r) => {
              if (!r.ok) throw new Error(`HTTP ${r.status}: Not Found`)
              return r.json()
            })
        }
        return api.getPosts(1, 3)
      },
      enabled: mode !== 'idle',
      retry: mode === 'error' ? 0 : 1,
      gcTime: 0,
    })

  const flags = [
    { name: 'status', value: status, mono: true },
    { name: 'fetchStatus', value: fetchStatus, mono: true },
    { name: 'isLoading', value: String(isLoading), bool: isLoading },
    { name: 'isFetching', value: String(isFetching), bool: isFetching },
    { name: 'isError', value: String(isError), bool: isError, negative: true },
    { name: 'isSuccess', value: String(isSuccess), bool: isSuccess },
  ]

  return (
    <div className="space-y-4">
      {/* State card */}
      <div className={`rounded-xl border p-5 transition-all ${
        mode === 'idle'
          ? 'bg-slate-800/50 border-slate-600'
          : isLoading
          ? 'bg-blue-500/5 border-blue-500/30'
          : isError
          ? 'bg-red-500/5 border-red-500/30'
          : isSuccess
          ? 'bg-green-500/5 border-green-500/30'
          : 'bg-slate-800/50 border-slate-600'
      }`}>
        {mode === 'idle' && (
          <div className="flex flex-col items-center py-6 gap-2">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 text-lg">—</div>
            <p className="text-slate-400 text-sm">No query running. Choose an action above.</p>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center py-6 gap-3">
            <div className="w-10 h-10 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-blue-300 text-sm font-medium">Fetching data...</p>
            <p className="text-slate-500 text-xs">status: pending · fetchStatus: fetching</p>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center py-6 gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-xl">✕</div>
            <p className="text-red-300 text-sm font-medium">Query failed</p>
            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded font-mono">
              {String(error)}
            </p>
            <p className="text-slate-500 text-xs">status: error · fetchStatus: idle</p>
          </div>
        )}

        {isSuccess && data && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs">✓</div>
              <p className="text-green-300 text-sm font-medium">Success — {Array.isArray(data) ? data.length : 1} items loaded</p>
            </div>
            {Array.isArray(data) && data.map((post) => (
              <div key={post.id} className="bg-slate-900/80 rounded-lg px-4 py-3 border border-slate-700">
                <p className="text-slate-100 text-sm font-medium capitalize">{post.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Flags table */}
      <div className="bg-slate-900 rounded-lg p-4">
        <p className="text-slate-500 text-xs mb-3 font-mono">// Current flag values</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {flags.map((f) => (
            <div key={f.name} className="bg-slate-800 rounded-lg px-3 py-2 border border-slate-700">
              <p className="text-slate-500 text-xs font-mono mb-0.5">{f.name}</p>
              <p className={`text-sm font-mono font-semibold ${
                f.mono
                  ? f.value === 'pending' ? 'text-yellow-400'
                  : f.value === 'success' ? 'text-green-400'
                  : f.value === 'error' ? 'text-red-400'
                  : f.value === 'fetching' ? 'text-blue-400'
                  : 'text-slate-400'
                : f.bool && !f.negative ? 'text-green-400'
                : f.bool && f.negative ? 'text-red-400'
                : 'text-slate-500'
              }`}>
                {f.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const states = [
  {
    name: 'pending',
    color: 'yellow',
    desc: 'The query has no data yet. Either it has never run, or the previous fetch failed and there is no cached result.',
  },
  {
    name: 'success',
    color: 'green',
    desc: 'The queryFn resolved successfully. data is available. The query may still refetch in the background.',
  },
  {
    name: 'error',
    color: 'red',
    desc: 'The queryFn threw or returned a rejected promise. error holds the reason. All retries have been exhausted.',
  },
  {
    name: 'paused',
    color: 'orange',
    desc: 'The query wanted to fetch but the network was unavailable. It will resume automatically when connectivity returns.',
  },
]

export default function RQQueryStates() {
  const [mode, setMode] = useState<DemoMode>('idle')
  const queryClient = useQueryClient()

  function activate(next: DemoMode) {
    queryClient.removeQueries({ queryKey: ['states-demo', next] })
    setMode(next)
  }

  function reset() {
    queryClient.removeQueries({ queryKey: ['states-demo'] })
    setMode('idle')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="text-purple-400 text-sm font-medium mb-1 font-mono">03 — Query States</div>
        <h1 className="text-4xl font-bold text-slate-100 mb-3">Query States</h1>
        <p className="text-slate-400 leading-relaxed">
          Every query lives in one of four states at any given moment. Understanding these states
          helps you build accurate and responsive loading UIs.
        </p>
      </div>

      {/* State explanations */}
      <div className="grid md:grid-cols-2 gap-3">
        {states.map((s) => (
          <div key={s.name} className={`bg-slate-800 rounded-xl border p-4 ${
            s.color === 'yellow' ? 'border-yellow-500/30' :
            s.color === 'green'  ? 'border-green-500/30' :
            s.color === 'red'    ? 'border-red-500/30' :
                                   'border-orange-500/30'
          }`}>
            <p className={`font-mono text-sm font-semibold mb-1.5 ${
              s.color === 'yellow' ? 'text-yellow-400' :
              s.color === 'green'  ? 'text-green-400' :
              s.color === 'red'    ? 'text-red-400' :
                                     'text-orange-400'
            }`}>{s.name}</p>
            <p className="text-slate-300 text-sm leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Status vs fetchStatus */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-3">
        <h2 className="text-lg font-semibold text-slate-100">status vs fetchStatus</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          React Query v5 separates two orthogonal concerns into two properties:
        </p>
        <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm space-y-1.5">
          <p className="text-slate-300">
            <span className="text-red-300">status</span>
            {' — '}
            <span className="text-slate-400 text-xs">does the query have data?</span>
          </p>
          <p className="text-slate-500 text-xs ml-4">{"'pending' | 'success' | 'error'"}</p>
          <p className="text-slate-300 mt-3">
            <span className="text-red-300">fetchStatus</span>
            {' — '}
            <span className="text-slate-400 text-xs">is the queryFn currently running?</span>
          </p>
          <p className="text-slate-500 text-xs ml-4">{"'fetching' | 'paused' | 'idle'"}</p>
        </div>
        <p className="text-slate-500 text-xs">
          A query can be <span className="text-green-400">status: success</span> and{' '}
          <span className="text-blue-400">fetchStatus: fetching</span> simultaneously — that is
          background refetching.
        </p>
      </div>

      {/* Live demo */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">Live Demo: State Machine</h2>
          <span className="bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs px-2 py-1 rounded">interactive</span>
        </div>
        <p className="text-slate-400 text-sm">
          Trigger each path and watch the state card and flag values update in real time.
        </p>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => activate('success')}
            className="bg-green-600 hover:bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Fetch Posts (success)
          </button>
          <button
            onClick={() => activate('error')}
            className="bg-red-600 hover:bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Trigger Error
          </button>
          <button
            onClick={reset}
            className="bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Reset
          </button>
        </div>
        <QueryStateDemo mode={mode} />
      </div>
      <RQNav current="/tech/react-query/states" />
    </div>
  )
}
