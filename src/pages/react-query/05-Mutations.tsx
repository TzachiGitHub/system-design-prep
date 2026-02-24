import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, type Todo } from '../../lib/api'
import RQNav from './RQNav'

function TodoItem({
  todo,
  onToggle,
  onDelete,
  isToggling,
  isDeleting,
}: {
  todo: Todo
  onToggle: (todo: Todo) => void
  onDelete: (id: number) => void
  isToggling: boolean
  isDeleting: boolean
}) {
  return (
    <div className={`flex items-center gap-3 bg-slate-900 rounded-lg px-4 py-3 border transition-opacity ${
      isDeleting ? 'opacity-40 border-red-500/30' : 'border-slate-700'
    }`}>
      <button
        onClick={() => onToggle(todo)}
        disabled={isToggling || isDeleting}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          todo.completed
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-slate-600 hover:border-purple-500'
        } disabled:opacity-50`}
      >
        {isToggling ? (
          <span className="w-2.5 h-2.5 border border-white border-t-transparent rounded-full animate-spin" />
        ) : todo.completed ? (
          <span className="text-white text-xs">✓</span>
        ) : null}
      </button>

      <span className={`flex-1 text-sm ${todo.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
        {todo.title}
      </span>

      {todo.id > 200 && (
        <span className="text-purple-400 text-xs bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded">new</span>
      )}

      <button
        onClick={() => onDelete(todo.id)}
        disabled={isDeleting || isToggling}
        className="text-slate-600 hover:text-red-400 transition-colors disabled:opacity-50 flex items-center justify-center w-6 h-6"
      >
        {isDeleting
          ? <span className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
          : '✕'
        }
      </button>
    </div>
  )
}

function AddTodoForm({ onAdd }: { onAdd: (title: string) => void; isPending: boolean }) {
  const [value, setValue] = useState('')

  const addMutation = useMutation({
    mutationFn: (title: string) =>
      api.createTodo({ userId: 1, title, completed: false }),
    onSuccess: (newTodo) => {
      onAdd(newTodo.title)
      setValue('')
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    addMutation.mutate(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add a new todo..."
        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
        disabled={addMutation.isPending}
      />
      <button
        type="submit"
        disabled={addMutation.isPending || !value.trim()}
        className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
      >
        {addMutation.isPending && (
          <span className="w-3.5 h-3.5 border border-white border-t-transparent rounded-full animate-spin" />
        )}
        {addMutation.isPending ? 'Adding...' : 'Add Todo'}
      </button>
      {addMutation.isError && (
        <p className="text-red-400 text-xs mt-1">Failed to add: {String(addMutation.error)}</p>
      )}
    </form>
  )
}

function TodoList() {
  const queryClient = useQueryClient()
  const [localTodos, setLocalTodos] = useState<Todo[]>([])
  const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set())
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set())

  const { data: serverTodos = [], isLoading } = useQuery({
    queryKey: ['mutations-todos'],
    queryFn: api.getTodos,
    staleTime: 60_000,
  })

  const allTodos = [...localTodos, ...serverTodos]

  const toggleMutation = useMutation({
    mutationFn: (todo: Todo) => api.updateTodo(todo.id, { completed: !todo.completed }),
    onMutate: (todo) => setTogglingIds((s) => new Set(s).add(todo.id)),
    onSettled: (_, __, todo) => {
      setTogglingIds((s) => { const n = new Set(s); n.delete(todo.id); return n })
      // Simulate local toggle since JSONPlaceholder doesn't persist
      setLocalTodos((prev) => prev.map((t) => t.id === todo.id ? { ...t, completed: !t.completed } : t))
      queryClient.setQueryData(['mutations-todos'], (old: Todo[] | undefined) =>
        old?.map((t) => t.id === todo.id ? { ...t, completed: !t.completed } : t)
      )
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteTodo(id),
    onMutate: (id) => setDeletingIds((s) => new Set(s).add(id)),
    onSettled: (_, __, id) => {
      setDeletingIds((s) => { const n = new Set(s); n.delete(id); return n })
      setLocalTodos((prev) => prev.filter((t) => t.id !== id))
      queryClient.setQueryData(['mutations-todos'], (old: Todo[] | undefined) =>
        old?.filter((t) => t.id !== id)
      )
    },
  })

  function handleAdd(title: string) {
    // JSONPlaceholder always returns id 201 — use timestamp to differentiate locally
    const newTodo: Todo = {
      id: Date.now(),
      userId: 1,
      title,
      completed: false,
    }
    setLocalTodos((prev) => [newTodo, ...prev])
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10 gap-3">
        <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-slate-400 text-sm">Loading todos...</span>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <AddTodoForm onAdd={handleAdd} isPending={false} />
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {allTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={(t) => toggleMutation.mutate(t)}
            onDelete={(id) => deleteMutation.mutate(id)}
            isToggling={togglingIds.has(todo.id)}
            isDeleting={deletingIds.has(todo.id)}
          />
        ))}
      </div>
    </div>
  )
}

const mutationProps = [
  { name: 'mutate(vars)', desc: 'Trigger the mutation synchronously. Fire and forget.' },
  { name: 'mutateAsync(vars)', desc: 'Trigger and await the promise. Useful for sequential operations.' },
  { name: 'isPending', desc: 'True while the mutationFn is in-flight.' },
  { name: 'isSuccess', desc: 'True after a successful mutation.' },
  { name: 'isError', desc: 'True if the mutation threw or rejected.' },
  { name: 'data', desc: 'The resolved value from a successful mutationFn.' },
  { name: 'error', desc: 'The thrown error from a failed mutationFn.' },
  { name: 'reset()', desc: 'Reset the mutation state back to idle.' },
]

export default function RQMutations() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="text-purple-400 text-sm font-medium mb-1 font-mono">05 — Mutations</div>
        <h1 className="text-4xl font-bold text-slate-100 mb-3">useMutation</h1>
        <p className="text-slate-400 leading-relaxed">
          While <code className="text-purple-300 text-sm">useQuery</code> reads data,{' '}
          <code className="text-purple-300 text-sm">useMutation</code> writes it — POST, PATCH,
          DELETE operations with full lifecycle hooks and state tracking.
        </p>
      </div>

      {/* Anatomy */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-3">
        <h2 className="text-lg font-semibold text-slate-100">Anatomy of useMutation</h2>
        <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm text-slate-300 leading-relaxed">
          <span className="text-blue-400">const</span>
          {' { mutate, isPending, isError } = '}
          <span className="text-yellow-300">useMutation</span>{'({\n'}
          {'  '}<span className="text-red-300">mutationFn</span>
          {': (title: '}<span className="text-blue-300">string</span>
          {') => '}<span className="text-yellow-300">api.createTodo</span>
          {'({ title }),\n\n'}
          {'  '}<span className="text-red-300">onSuccess</span>
          {': (data) => {\n'}
          {'    '}<span className="text-slate-500">{'// data = resolved value from mutationFn'}</span>
          {'\n    '}<span className="text-yellow-300">queryClient</span>
          {'.invalidateQueries({ queryKey: ['}
          <span className="text-green-300">"todos"</span>
          {'] })\n  },\n\n'}
          {'  '}<span className="text-red-300">onError</span>
          {': (error) => {\n'}
          {'    '}<span className="text-yellow-300">toast</span>
          {'.error('}<span className="text-green-300">"Failed: "</span>
          {' + error.message)\n  },\n})\n\n'}
          <span className="text-slate-500">{'// Then call it:'}</span>
          {'\n'}<span className="text-yellow-300">mutate</span>
          {'('}<span className="text-green-300">"Buy milk"</span>
          {')'}
        </div>
      </div>

      {/* Key difference from useQuery */}
      <div className="bg-slate-800 rounded-xl border border-amber-500/30 p-5 space-y-3">
        <h2 className="text-lg font-semibold text-amber-400">Key Difference from useQuery</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1.5">
            <p className="text-slate-300 font-semibold">useQuery</p>
            <ul className="text-slate-400 space-y-1">
              <li>• Runs automatically on mount</li>
              <li>• Cached and deduplicated</li>
              <li>• Re-runs when key changes</li>
              <li>• Read-only — no side effects</li>
            </ul>
          </div>
          <div className="space-y-1.5">
            <p className="text-slate-300 font-semibold">useMutation</p>
            <ul className="text-slate-400 space-y-1">
              <li>• Only runs when you call mutate()</li>
              <li>• Not cached</li>
              <li>• Lifecycle callbacks: onSuccess, onError, onSettled</li>
              <li>• Side effects — creates/updates/deletes</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Return values */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-3">
        <h2 className="text-lg font-semibold text-slate-100">Return Values</h2>
        <div className="space-y-2">
          {mutationProps.map((p) => (
            <div key={p.name} className="flex gap-3 py-2 border-b border-slate-700/50 last:border-0">
              <code className="text-purple-300 font-mono text-sm whitespace-nowrap w-36 flex-shrink-0">{p.name}</code>
              <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* JSONPlaceholder note */}
      <div className="bg-yellow-500/5 border border-yellow-500/30 rounded-lg p-4 flex gap-3">
        <span className="text-yellow-400 text-lg flex-shrink-0">⚠</span>
        <div>
          <p className="text-yellow-400 text-sm font-semibold mb-1">JSONPlaceholder does not persist data</p>
          <p className="text-slate-400 text-sm leading-relaxed">
            All create/update/delete requests return fake success responses but nothing is actually
            saved. The demo simulates persistence locally using React state — in a real app, you
            would invalidate queries after mutations to refetch real data.
          </p>
        </div>
      </div>

      {/* Live demo */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">Live Demo: Todo CRUD</h2>
          <span className="bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs px-2 py-1 rounded">interactive</span>
        </div>
        <p className="text-slate-400 text-sm">
          Add todos, toggle completion, and delete — each operation uses a separate{' '}
          <code className="text-purple-300 text-xs bg-slate-900 px-1 rounded">useMutation</code>.
          Watch the spinners appear on the active mutation.
        </p>
        <TodoList />
      </div>
      <RQNav current="/tech/react-query/mutations" />
    </div>
  )
}
