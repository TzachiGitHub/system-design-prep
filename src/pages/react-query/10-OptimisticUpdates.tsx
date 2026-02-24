import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, type Todo } from '../../lib/api'
import RQNav from './RQNav'

// Wrapper that randomly throws 50% of the time to simulate server errors
async function flakyUpdateTodo(id: number, patch: Partial<Todo>): Promise<Todo> {
  if (Math.random() < 0.5) {
    await new Promise((r) => setTimeout(r, 600))
    throw new Error('Server error: update rejected (simulated)')
  }
  return api.updateTodo(id, patch)
}

type Toast = {
  id: number
  type: 'success' | 'error' | 'rollback'
  message: string
}

let toastId = 0

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-6 right-6 space-y-2 z-50 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg transition-all
            ${t.type === 'success' ? 'bg-green-600 text-white' : ''}
            ${t.type === 'error' ? 'bg-red-600 text-white' : ''}
            ${t.type === 'rollback' ? 'bg-yellow-600 text-white' : ''}
          `}
        >
          {t.type === 'success' && '✓'}
          {t.type === 'error' && '✕'}
          {t.type === 'rollback' && '↺'}
          {t.message}
        </div>
      ))}
    </div>
  )
}

function TodoItem({
  todo,
  onToggle,
  isPending,
}: {
  todo: Todo
  onToggle: (todo: Todo) => void
  isPending: boolean
}) {
  return (
    <button
      onClick={() => onToggle(todo)}
      disabled={isPending}
      className={`w-full flex items-center gap-3 bg-slate-900 hover:bg-slate-800 border transition-colors rounded-lg px-4 py-3 text-left group
        ${isPending ? 'border-yellow-500/40 opacity-75 cursor-wait' : 'border-slate-800 hover:border-slate-600'}
      `}
    >
      {/* Checkbox */}
      <span
        className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-colors
          ${todo.completed
            ? 'bg-green-600 border-green-600 text-white'
            : 'border-slate-600 group-hover:border-slate-400'
          }
        `}
      >
        {todo.completed && (
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>

      <span
        className={`text-sm flex-1 ${
          todo.completed ? 'text-slate-500 line-through' : 'text-slate-200'
        }`}
      >
        {todo.title}
      </span>

      {isPending && (
        <span className="text-yellow-400 text-xs">saving…</span>
      )}
    </button>
  )
}

export default function OptimisticUpdates() {
  const queryClient = useQueryClient()
  const [toasts, setToasts] = useState<Toast[]>([])
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set())

  function addToast(type: Toast['type'], message: string) {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }

  const { data: todos, isLoading } = useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: api.getTodos,
  })

  const toggleMutation = useMutation({
    mutationFn: (todo: Todo) =>
      flakyUpdateTodo(todo.id, { completed: !todo.completed }),

    onMutate: async (todo: Todo) => {
      // 1. Cancel any in-flight refetches (they would overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['todos'] })

      // 2. Snapshot the current data for potential rollback
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])

      // 3. Optimistically update the cache immediately
      queryClient.setQueryData<Todo[]>(['todos'], (old) =>
        old?.map((t) =>
          t.id === todo.id ? { ...t, completed: !t.completed } : t
        )
      )

      // Track which item is in-flight
      setPendingIds((prev) => new Set(prev).add(todo.id))

      // Return context for onError rollback
      return { previousTodos, todoId: todo.id }
    },

    onError: (_err, _todo, context) => {
      // Roll back to snapshot
      if (context?.previousTodos) {
        queryClient.setQueryData<Todo[]>(['todos'], context.previousTodos)
      }
      addToast('rollback', 'Update failed — rolled back')
      setPendingIds((prev) => {
        const next = new Set(prev)
        next.delete(context?.todoId ?? -1)
        return next
      })
    },

    onSuccess: (_data, todo) => {
      addToast('success', `Todo ${todo.completed ? 'unchecked' : 'checked'} successfully`)
      setPendingIds((prev) => {
        const next = new Set(prev)
        next.delete(todo.id)
        return next
      })
    },

    onSettled: () => {
      // Always sync with server after mutation completes or fails
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  // Clean up pendingIds when mutation queue empties
  useEffect(() => {
    if (!toggleMutation.isPending) {
      setPendingIds(new Set())
    }
  }, [toggleMutation.isPending])

  const codeSnippet = `useMutation({
  mutationFn: (todo) => api.updateTodo(todo.id, { completed: !todo.completed }),

  onMutate: async (todo) => {
    // Cancel in-flight refetches
    await queryClient.cancelQueries({ queryKey: ['todos'] })
    // Snapshot for rollback
    const previousTodos = queryClient.getQueryData(['todos'])
    // Optimistically flip the item
    queryClient.setQueryData(['todos'], (old) =>
      old?.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t)
    )
    return { previousTodos }
  },

  onError: (_err, _todo, context) => {
    // Restore snapshot on failure
    queryClient.setQueryData(['todos'], context?.previousTodos)
  },

  onSettled: () => {
    // Re-sync with server regardless of outcome
    queryClient.invalidateQueries({ queryKey: ['todos'] })
  },
})`

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-6">
      <ToastContainer toasts={toasts} />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">
          10 — Optimistic Updates
        </h1>
        <p className="text-slate-400">
          Update the UI instantly before the server responds — roll back
          automatically if the request fails.
        </p>
      </div>

      {/* Concept explanation */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-4">
        <h2 className="text-lg font-semibold text-purple-400">The Pattern</h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          Instead of waiting for the server, we modify the cache immediately via{' '}
          <code className="text-purple-300 bg-purple-500/10 px-1 rounded">
            queryClient.setQueryData
          </code>{' '}
          in <code className="text-purple-300">onMutate</code>. We also save the old
          data as a snapshot. If the server rejects the change,{' '}
          <code className="text-purple-300">onError</code> restores the snapshot.
          <code className="text-purple-300"> onSettled</code> then invalidates to
          ensure eventual consistency.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          {[
            {
              step: 'onMutate',
              color: 'blue',
              desc: 'Cancel refetches, snapshot old data, apply optimistic change, return snapshot',
            },
            {
              step: 'onError',
              color: 'red',
              desc: 'Restore the snapshot to roll back the optimistic change',
            },
            {
              step: 'onSettled',
              color: 'green',
              desc: 'Invalidate the query to sync with the real server state',
            },
          ].map(({ step, color, desc }) => (
            <div key={step} className={`bg-${color}-500/10 border border-${color}-500/30 rounded-lg p-3`}>
              <code className={`text-${color}-400 text-xs font-mono`}>{step}</code>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm">
          <p className="text-yellow-400 font-semibold mb-1">Demo has 50% failure rate</p>
          <p className="text-slate-300 text-sm">
            Click any todo to toggle it. Half the time the server will reject the change
            — watch the UI snap back and a rollback toast appear.
          </p>
        </div>
      </div>

      {/* Live demo */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-lg font-semibold text-slate-100">Live Demo — click to toggle</h2>
          <span className="text-slate-500 text-xs bg-slate-900 rounded px-2 py-1">
            ~50% server failure rate
          </span>
        </div>

        {isLoading ? (
          <div className="text-slate-400 text-sm animate-pulse py-4 text-center">
            Loading todos…
          </div>
        ) : (
          <div className="space-y-2">
            {todos?.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={(t) => toggleMutation.mutate(t)}
                isPending={pendingIds.has(todo.id)}
              />
            ))}
          </div>
        )}

        <p className="text-slate-500 text-xs">
          The yellow border and "saving…" label show the in-flight item.
          On error, the checkbox flips back and a toast confirms the rollback.
        </p>
      </div>

      {/* Code snippet */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-3">
        <h2 className="text-lg font-semibold text-slate-100">Code Pattern</h2>
        <pre className="bg-slate-950 rounded-lg p-4 font-mono text-sm text-slate-300 overflow-x-auto whitespace-pre">
          {codeSnippet}
        </pre>
        <p className="text-slate-400 text-sm">
          The context object returned from <code className="text-purple-300">onMutate</code>{' '}
          is passed as the third argument to <code className="text-purple-300">onError</code>{' '}
          and <code className="text-purple-300">onSettled</code>, making the snapshot
          available exactly where you need it.
        </p>
      </div>
      <RQNav current="/tech/react-query/optimistic" />
    </div>
  )
}
