import { useState, useEffect } from 'react'

interface Props {
  id: string
  items: string[]
  title?: string
}

export default function ProgressTracker({ id, items, title }: Props) {
  const storageKey = `progress-${id}`
  const [checked, setChecked] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      return saved ? new Set(JSON.parse(saved)) : new Set()
    } catch { return new Set() }
  })

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify([...checked]))
  }, [checked, storageKey])

  const toggle = (item: string) => {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(item) ? next.delete(item) : next.add(item)
      return next
    })
  }

  const pct = items.length ? Math.round((checked.size / items.length) * 100) : 0

  return (
    <div>
      {title && <h3 className="text-sm font-semibold text-slate-300 mb-2">{title}</h3>}
      {/* Progress bar */}
      <div className="w-full h-2 bg-navy-700 rounded-full mb-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent-blue to-accent-cyan rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="text-xs text-slate-400 mb-2">{checked.size}/{items.length} completed ({pct}%)</div>
      <div className="space-y-1">
        {items.map(item => (
          <label key={item} className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={checked.has(item)}
              onChange={() => toggle(item)}
              className="accent-accent-blue w-4 h-4"
            />
            <span className={`text-sm transition-colors ${checked.has(item) ? 'text-slate-500 line-through' : 'text-slate-300 group-hover:text-white'}`}>
              {item}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
