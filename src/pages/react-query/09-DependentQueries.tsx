import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api, type User, type Post } from '../../lib/api'
import RQNav from './RQNav'

function SpinnerIcon({ small }: { small?: boolean }) {
  const cls = small ? 'w-3 h-3' : 'w-4 h-4'
  return (
    <svg className={`${cls} animate-spin`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )
}

export default function DependentQueries() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

  // Query A — always runs
  const {
    data: users,
    isLoading: usersLoading,
    isError: usersError,
  } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: api.getUsers,
  })

  // Query B — only runs when a user is selected
  const {
    data: posts,
    isLoading: postsLoading,
    isFetching: postsFetching,
    isError: postsError,
  } = useQuery<Post[]>({
    queryKey: ['posts', 'byUser', selectedUserId],
    queryFn: () => api.getPostsByUser(selectedUserId!),
    enabled: !!selectedUserId,   // <-- the key option
  })

  const selectedUser = users?.find((u) => u.id === selectedUserId)

  const codeSnippet = `// Query A: always enabled
const { data: users } = useQuery({
  queryKey: ['users'],
  queryFn: api.getUsers,
})

// Query B: only runs when selectedUserId is truthy
const { data: posts } = useQuery({
  queryKey: ['posts', 'byUser', selectedUserId],
  queryFn: () => api.getPostsByUser(selectedUserId!),
  enabled: !!selectedUserId,
})

// Until enabled becomes true:
// • status === 'pending'
// • No network request is fired
// • isFetching === false`

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">
          09 — Dependent Queries
        </h1>
        <p className="text-slate-400">
          Use the <code className="text-purple-300">enabled</code> option to chain
          queries — query B only fires once query A has the data you need.
        </p>
      </div>

      {/* Concept explanation */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-4">
        <h2 className="text-lg font-semibold text-purple-400">The enabled option</h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          Pass <code className="text-purple-300 bg-purple-500/10 px-1 rounded">enabled: false</code>{' '}
          (or a boolean expression) to prevent a query from running. When the expression
          becomes <code className="text-green-400">true</code> — e.g. after the user
          picks an item or query A resolves — React Query automatically fires the request.
          No <code>useEffect</code> needed.
        </p>

        <div className="bg-slate-900 rounded-lg p-4 text-sm space-y-2">
          <div className="flex items-center gap-3">
            <span className="w-24 text-slate-500 text-xs">Before select</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-600" />
              <span className="text-slate-400">Query B: <span className="text-yellow-400">idle</span> — no fetch fired</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-24 text-slate-500 text-xs">After select</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span className="text-slate-400">Query B: <span className="text-purple-400">loading</span> → <span className="text-green-400">success</span></span>
            </span>
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm">
          <p className="text-yellow-400 font-semibold mb-1">Common pattern</p>
          <p className="text-slate-300">
            <code className="text-yellow-300">enabled: !!userId</code> — coerce the value
            to boolean. Works great when the dependency is a nullable ID coming from
            another query's data or a selection state.
          </p>
        </div>
      </div>

      {/* Live demo */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-5">
        <h2 className="text-lg font-semibold text-slate-100">Live Demo</h2>

        {/* Step 1 — Select user */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex-shrink-0">1</span>
            <p className="text-slate-200 text-sm font-medium">Select a user</p>
            {usersLoading && <SpinnerIcon small />}
          </div>

          {usersError && (
            <p className="text-red-400 text-sm">Failed to load users.</p>
          )}

          {!usersLoading && !usersError && (
            <select
              value={selectedUserId ?? ''}
              onChange={(e) =>
                setSelectedUserId(e.target.value ? Number(e.target.value) : null)
              }
              className="w-full bg-slate-900 border border-slate-600 text-slate-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">— Pick a user —</option>
              {users?.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} (@{user.username})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Step 2 — Posts for selected user */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold flex-shrink-0 ${selectedUserId ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-500'}`}>
              2
            </span>
            <p className={`text-sm font-medium ${selectedUserId ? 'text-slate-200' : 'text-slate-500'}`}>
              Posts for selected user
            </p>
            {postsFetching && <SpinnerIcon small />}
          </div>

          {!selectedUserId && (
            <div className="bg-slate-900 rounded-lg px-4 py-6 text-center">
              <p className="text-slate-500 text-sm">
                Waiting for user selection… query B is{' '}
                <span className="text-yellow-400">idle</span> (enabled: false)
              </p>
            </div>
          )}

          {selectedUserId && postsLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-sm animate-pulse py-4">
              <SpinnerIcon />
              Loading posts for {selectedUser?.name}…
            </div>
          )}

          {selectedUserId && postsError && (
            <p className="text-red-400 text-sm">Failed to load posts.</p>
          )}

          {selectedUserId && posts && (
            <div className="space-y-2">
              <p className="text-slate-500 text-xs">
                {posts.length} posts found for{' '}
                <span className="text-slate-300">{selectedUser?.name}</span>
              </p>
              <div className="max-h-72 overflow-y-auto space-y-2">
                {posts.map((post) => (
                  <div key={post.id} className="bg-slate-900 rounded-lg px-4 py-3">
                    <p className="text-slate-100 text-sm font-medium capitalize leading-snug">
                      {post.title}
                    </p>
                    <p className="text-slate-500 text-xs mt-0.5">Post #{post.id}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Code snippet */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-3">
        <h2 className="text-lg font-semibold text-slate-100">Code Pattern</h2>
        <pre className="bg-slate-950 rounded-lg p-4 font-mono text-sm text-slate-300 overflow-x-auto whitespace-pre">
          {codeSnippet}
        </pre>
        <p className="text-slate-400 text-sm">
          You can chain as many queries as needed. Each one waits for its{' '}
          <code className="text-purple-300">enabled</code> condition without any manual
          effect orchestration.
        </p>
      </div>
      <RQNav current="/tech/react-query/dependent" />
    </div>
  )
}
