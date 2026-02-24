import { NavLink } from 'react-router-dom'

const pages = [
  { to: '/tech/react-query', label: 'Overview' },
  { to: '/tech/react-query/intro', label: 'Intro' },
  { to: '/tech/react-query/use-query', label: 'useQuery Basics' },
  { to: '/tech/react-query/states', label: 'Query States' },
  { to: '/tech/react-query/caching', label: 'Caching & Stale Time' },
  { to: '/tech/react-query/mutations', label: 'Mutations' },
  { to: '/tech/react-query/invalidation', label: 'Invalidation' },
  { to: '/tech/react-query/pagination', label: 'Pagination' },
  { to: '/tech/react-query/infinite', label: 'Infinite Scroll' },
  { to: '/tech/react-query/dependent', label: 'Dependent Queries' },
  { to: '/tech/react-query/optimistic', label: 'Optimistic Updates' },
]

interface RQNavProps {
  current: string // the `to` value of the current page
}

export default function RQNav({ current }: RQNavProps) {
  const idx = pages.findIndex(p => p.to === current)
  const prev = idx > 0 ? pages[idx - 1] : null
  const next = idx < pages.length - 1 ? pages[idx + 1] : null

  return (
    <div className="mt-10 pt-6 border-t border-slate-700 flex items-center justify-between gap-4">
      <div className="flex-1">
        {prev && (
          <NavLink
            to={prev.to}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-purple-500/50 transition-all text-sm"
          >
            <span>←</span>
            <span>{prev.label}</span>
          </NavLink>
        )}
      </div>

      <span className="text-xs text-slate-600 shrink-0">
        {idx + 1} / {pages.length}
      </span>

      <div className="flex-1 flex justify-end">
        {next && (
          <NavLink
            to={next.to}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-purple-500/50 transition-all text-sm"
          >
            <span>{next.label}</span>
            <span>→</span>
          </NavLink>
        )}
      </div>
    </div>
  )
}
