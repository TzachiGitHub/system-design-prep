import { useState, useEffect, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api'
import RQNav from './RQNav'

const STALE_TIME_MS = 10_000  // 10 seconds — short enough to observe

function UsersQuery({ onFetched }: { onFetched: (ts: number) => void }) {
  const hasFired = useRef(false)
  const { data, isLoading, isFetching, dataUpdatedAt } = useQuery({
    queryKey: ['caching-users'],
    queryFn: () => api.getUsers(),
    staleTime: STALE_TIME_MS,
    gcTime: 60_000,
  })

  useEffect(() => {
    if (dataUpdatedAt && !hasFired.current) {
      hasFired.current = true
      onFetched(dataUpdatedAt)
    }
  }, [dataUpdatedAt, onFetched])

  useEffect(() => {
    if (dataUpdatedAt && hasFired.current) {
      onFetched(dataUpdatedAt)
    }
  }, [dataUpdatedAt])  // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <div className="flex flex-col items-center py-8 gap-3">
        <div className="w-7 h-7 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400 text-sm">Loading users...</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {isFetching && (
        <div className="flex items-center gap-2 text-blue-400 text-xs mb-3">
          <span className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin" />
          Background refetch in progress...
        </div>
      )}
      {data?.slice(0, 5).map((user) => (
        <div key={user.id} className="bg-slate-900 rounded-lg px-4 py-2.5 border border-slate-700 flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 text-xs font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="text-slate-100 text-sm font-medium">{user.name}</p>
            <p className="text-slate-500 text-xs">{user.email}</p>
          </div>
          <span className="ml-auto text-slate-600 text-xs font-mono">@{user.username}</span>
        </div>
      ))}
    </div>
  )
}

function StalenessBadge({ fetchedAt }: { fetchedAt: number | null }) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!fetchedAt) return
    const tick = () => setElapsed(Date.now() - fetchedAt)
    tick()
    const id = setInterval(tick, 500)
    return () => clearInterval(id)
  }, [fetchedAt])

  if (!fetchedAt) return null

  const isStale = elapsed > STALE_TIME_MS
  const remaining = Math.max(0, Math.ceil((STALE_TIME_MS - elapsed) / 1000))

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
      isStale
        ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
        : 'bg-green-500/10 border-green-500/30 text-green-400'
    }`}>
      <span className={`w-2 h-2 rounded-full ${isStale ? 'bg-yellow-400' : 'bg-green-400 animate-pulse'}`} />
      {isStale ? 'STALE — will refetch on next interaction' : `FRESH — stale in ${remaining}s`}
    </div>
  )
}

export default function RQCaching() {
  const queryClient = useQueryClient()
  const [showQuery, setShowQuery] = useState(true)
  const [fetchedAt, setFetchedAt] = useState<number | null>(null)
  const [fetchCount, setFetchCount] = useState(0)

  function handleFetched(ts: number) {
    setFetchedAt(ts)
    setFetchCount((n) => n + 1)
  }

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['caching-users'] })
  }

  function remount() {
    setShowQuery(false)
    setTimeout(() => setShowQuery(true), 80)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="text-purple-400 text-sm font-medium mb-1 font-mono">04 — Caching</div>
        <h1 className="text-4xl font-bold text-slate-100 mb-3">Caching & Stale Time</h1>
        <p className="text-slate-400 leading-relaxed">
          React Query's cache is what makes it feel instant. Understanding staleTime and gcTime
          gives you full control over when data is considered fresh and when it gets collected.
        </p>
      </div>

      {/* staleTime vs gcTime */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-800 rounded-xl border border-purple-500/30 p-5">
          <p className="text-purple-400 font-mono text-sm font-semibold mb-2">staleTime</p>
          <p className="text-slate-300 text-sm leading-relaxed mb-3">
            How long (ms) data is considered <span className="text-green-400">fresh</span>. While fresh,
            React Query will never trigger a background refetch — it trusts the cache.
          </p>
          <div className="bg-slate-950 rounded p-3 font-mono text-xs text-slate-400">
            staleTime: 0<span className="text-slate-600 ml-2">// default — always stale</span>
            <br />
            staleTime: 60_000<span className="text-slate-600 ml-2">// fresh for 1min</span>
            <br />
            staleTime: Infinity<span className="text-slate-600 ml-2">// never stale</span>
          </div>
        </div>
        <div className="bg-slate-800 rounded-xl border border-orange-500/30 p-5">
          <p className="text-orange-400 font-mono text-sm font-semibold mb-2">gcTime</p>
          <p className="text-slate-300 text-sm leading-relaxed mb-3">
            How long (ms) <span className="text-orange-300">inactive</span> (unmounted) cache entries
            survive before being garbage collected. Default is 5 minutes.
          </p>
          <div className="bg-slate-950 rounded p-3 font-mono text-xs text-slate-400">
            gcTime: 300_000<span className="text-slate-600 ml-2">// default — 5min</span>
            <br />
            gcTime: 0<span className="text-slate-600 ml-2">// evict immediately</span>
            <br />
            gcTime: Infinity<span className="text-slate-600 ml-2">// keep forever</span>
          </div>
        </div>
      </div>

      {/* Lifecycle */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-3">
        <h2 className="text-lg font-semibold text-slate-100">Cache Lifecycle</h2>
        <div className="flex items-center gap-2 flex-wrap text-sm">
          <div className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-1.5 text-green-400 font-mono text-xs">Fresh</div>
          <span className="text-slate-600">──── staleTime expires ────</span>
          <div className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-1.5 text-yellow-400 font-mono text-xs">Stale</div>
          <span className="text-slate-600">──── unmount / no subscribers ────</span>
          <div className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-1.5 text-orange-400 font-mono text-xs">Inactive</div>
          <span className="text-slate-600">──── gcTime expires ────</span>
          <div className="bg-slate-900 border border-slate-600 rounded-lg px-3 py-1.5 text-red-400 font-mono text-xs">Collected</div>
        </div>
        <ul className="text-slate-400 text-sm space-y-1.5 mt-2">
          <li><span className="text-green-400">Fresh</span> — React Query will NOT trigger a background refetch on window focus or remount.</li>
          <li><span className="text-yellow-400">Stale</span> — Data is served from cache immediately, but a background refetch is triggered.</li>
          <li><span className="text-orange-400">Inactive</span> — No component is subscribed. gcTime countdown starts.</li>
          <li><span className="text-red-400">Collected</span> — Evicted from memory. Next request causes a full loading state.</li>
        </ul>
      </div>

      {/* Code snippet */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-3">
        <h2 className="text-lg font-semibold text-slate-100">Configuration</h2>
        <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm text-slate-300 leading-relaxed">
          <span className="text-blue-400">const</span>
          {' { data } = '}
          <span className="text-yellow-300">useQuery</span>{'({\n'}
          {'  '}<span className="text-red-300">queryKey</span>
          {": ["}<span className="text-green-300">'users'</span>{'],\n'}
          {'  '}<span className="text-red-300">queryFn</span>
          {': () => '}<span className="text-yellow-300">api.getUsers</span>{'(),\n'}
          {'  '}<span className="text-red-300">staleTime</span>
          {': 10_000,   '}
          <span className="text-slate-500">{'// fresh for 10s'}</span>
          {'\n  '}<span className="text-red-300">gcTime</span>
          {':  60_000,   '}
          <span className="text-slate-500">{'// keep in cache 60s after unmount'}</span>
          {'\n})'}
        </div>
      </div>

      {/* Live demo */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">Live Demo: Staleness Timer</h2>
          <span className="bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs px-2 py-1 rounded">interactive</span>
        </div>
        <p className="text-slate-400 text-sm">
          staleTime is set to <strong className="text-slate-300">10 seconds</strong>. Watch the badge
          count down from FRESH to STALE. Then unmount/remount the component — data loads
          instantly from the cache.
        </p>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
            <p className="text-2xl font-bold text-purple-400">{fetchCount}</p>
            <p className="text-slate-500 text-xs mt-0.5">Network requests</p>
          </div>
          <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
            <p className="text-slate-100 text-xs font-mono mt-1">
              {fetchedAt ? new Date(fetchedAt).toLocaleTimeString() : '—'}
            </p>
            <p className="text-slate-500 text-xs mt-0.5">Last fetched</p>
          </div>
          <div className="bg-slate-900 rounded-lg p-3 border border-slate-700">
            <p className="text-slate-100 text-xs font-mono mt-1">{showQuery ? 'mounted' : 'unmounted'}</p>
            <p className="text-slate-500 text-xs mt-0.5">Component</p>
          </div>
        </div>

        {fetchedAt && <StalenessBadge fetchedAt={fetchedAt} />}

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={remount}
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Unmount & Remount
          </button>
          <button
            onClick={invalidate}
            className="bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Invalidate Cache
          </button>
        </div>

        <div className="border-t border-slate-700 pt-4">
          {showQuery
            ? <UsersQuery onFetched={handleFetched} />
            : (
              <div className="flex items-center justify-center py-8 text-slate-500 text-sm border border-dashed border-slate-700 rounded-lg">
                Component unmounted — cache still lives in memory for gcTime
              </div>
            )
          }
        </div>
      </div>
      <RQNav current="/tech/react-query/caching" />
    </div>
  )
}
