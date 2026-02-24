import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, type Todo } from '../../lib/api'
import RQNav from './RQNav'

function RefreshIcon({ spinning }: { spinning: boolean }) {
  return (
    <svg
      className={`w-4 h-4 ${spinning ? 'animate-spin' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  )
}

export default function Invalidation() {
  const queryClient = useQueryClient()
  const [flashList, setFlashList] = useState(false)
  const [localTodos, setLocalTodos] = useState<Todo[]>([])

  const { data: todos, isFetching, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const result = await api.getTodos()
      return result
    },
  })

  const addTodoMutation = useMutation({
    mutationFn: () =>
      api.createTodo({
        userId: 1,
        title: `Random task #${Math.floor(Math.random() * 1000)}`,
        completed: false,
      }),
    onSuccess: (newTodo) => {
      // Optimistically append to local list so the demo is visible
      setLocalTodos((prev) => [newTodo, ...prev])
      // Invalidate — marks the query stale and triggers a background refetch
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      // Flash the list to visualise the refetch
      setFlashList(true)
      setTimeout(() => setFlashList(false), 800)
    },
  })

  const allTodos = [...localTodos, ...(todos ?? [])]

  const codeSnippet = `const queryClient = useQueryClient()

const addTodoMutation = useMutation({
  mutationFn: (newTodo) => api.createTodo(newTodo),
  onSuccess: () => {
    // Mark 'todos' query as stale and refetch if mounted
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})`

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">
          06 — Query Invalidation
        </h1>
        <p className="text-slate-400">
          After a mutation, tell React Query that cached data is out-of-date so
          it refetches automatically.
        </p>
      </div>

      {/* Concept explanation */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-4">
        <h2 className="text-lg font-semibold text-purple-400">
          What is invalidateQueries?
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          <code className="text-purple-300 bg-purple-500/10 px-1 rounded">
            queryClient.invalidateQueries
          </code>{' '}
          marks one or more queries as <span className="text-yellow-400">stale</span>.
          If the query is currently rendered (mounted), React Query immediately
          triggers a background refetch — the old data stays visible while the
          fresh data loads.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <p className="text-green-400 font-semibold mb-1">invalidateQueries</p>
            <ul className="text-slate-300 space-y-1 list-disc list-inside">
              <li>Marks the query stale</li>
              <li>Refetches if the query is mounted</li>
              <li>Works by query key prefix</li>
              <li>Best after create / update / delete</li>
            </ul>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <p className="text-blue-400 font-semibold mb-1">refetchQueries</p>
            <ul className="text-slate-300 space-y-1 list-disc list-inside">
              <li>Forces an immediate refetch</li>
              <li>Even if data is still fresh</li>
              <li>Works regardless of mount state</li>
              <li>Rarely needed — prefer invalidate</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Live demo */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">Live Demo</h2>
          <div className="flex items-center gap-2 text-sm">
            {isFetching && (
              <span className="flex items-center gap-1 text-purple-400">
                <RefreshIcon spinning />
                Refetching…
              </span>
            )}
            {!isFetching && (
              <span className="text-slate-500 text-xs">Cache fresh</span>
            )}
          </div>
        </div>

        <button
          onClick={() => addTodoMutation.mutate()}
          disabled={addTodoMutation.isPending}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {addTodoMutation.isPending ? (
            <>
              <RefreshIcon spinning />
              Adding…
            </>
          ) : (
            '+ Add random todo'
          )}
        </button>

        {addTodoMutation.isSuccess && (
          <p className="text-green-400 text-sm">
            Todo added — list invalidated and refetching in the background.
          </p>
        )}

        {isLoading ? (
          <div className="text-slate-400 text-sm animate-pulse">Loading todos…</div>
        ) : (
          <ul
            className={`space-y-2 transition-all duration-300 ${
              flashList ? 'ring-2 ring-purple-500 rounded-lg p-2' : ''
            }`}
          >
            {allTodos.map((todo) => (
              <li
                key={`${todo.id}-${todo.title}`}
                className="flex items-center gap-3 bg-slate-900 rounded-lg px-4 py-2 text-sm"
              >
                <span
                  className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    todo.completed ? 'bg-green-500' : 'bg-slate-600'
                  }`}
                />
                <span
                  className={
                    todo.completed ? 'text-slate-500 line-through' : 'text-slate-300'
                  }
                >
                  {todo.title}
                </span>
              </li>
            ))}
          </ul>
        )}

        <p className="text-slate-500 text-xs">
          The purple ring flashes when the list refetches after invalidation.
        </p>
      </div>

      {/* Code snippet */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-3">
        <h2 className="text-lg font-semibold text-slate-100">Code Pattern</h2>
        <pre className="bg-slate-950 rounded-lg p-4 font-mono text-sm text-slate-300 overflow-x-auto whitespace-pre">
          {codeSnippet}
        </pre>
        <p className="text-slate-400 text-sm">
          The key insight: you pass a <span className="text-purple-300">prefix</span>{' '}
          array to invalidate any query whose key starts with{' '}
          <code className="text-purple-300">['todos']</code>, including{' '}
          <code className="text-slate-300">['todos', userId]</code>.
        </p>
      </div>
      <RQNav current="/tech/react-query/invalidation" />
    </div>
  )
}
