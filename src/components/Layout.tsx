import { NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

const sysDesignItems = [
  { to: '/', icon: '🏠', label: 'Dashboard' },
  { to: '/patterns', icon: '🧩', label: 'Patterns' },
  { to: '/blocks', icon: '🧱', label: 'Building Blocks' },
  { to: '/problems', icon: '💡', label: 'Problems' },
  { to: '/concepts', icon: '⚖️', label: 'Concepts' },
  { to: '/framework', icon: '📋', label: 'Framework' },
  { to: '/cheat-sheet', icon: '📝', label: 'Cheat Sheet' },
  { to: '/quiz', icon: '🎯', label: 'Quiz' },
]

const reactQueryItems = [
  { to: '/tech/react-query', label: 'Overview' },
  { to: '/tech/react-query/intro', label: 'Intro' },
  { to: '/tech/react-query/use-query', label: 'useQuery' },
  { to: '/tech/react-query/states', label: 'Query States' },
  { to: '/tech/react-query/caching', label: 'Caching' },
  { to: '/tech/react-query/mutations', label: 'Mutations' },
  { to: '/tech/react-query/invalidation', label: 'Invalidation' },
  { to: '/tech/react-query/pagination', label: 'Pagination' },
  { to: '/tech/react-query/infinite', label: 'Infinite Scroll' },
  { to: '/tech/react-query/dependent', label: 'Dependent Queries' },
  { to: '/tech/react-query/optimistic', label: 'Optimistic Updates' },
]

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="px-4 pt-4 pb-1">
      <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
        {label}
      </span>
    </div>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen">
      {/* Mobile top bar */}
      <header className="no-print lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900/95 backdrop-blur border-b border-slate-700">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-slate-300 hover:text-white text-2xl"
        >
          {mobileOpen ? '✕' : '☰'}
        </button>
        <span className="text-base font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Tech Prep
        </span>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`no-print fixed top-0 left-0 h-screen z-50 flex flex-col
          bg-slate-900 border-r border-slate-700 w-60
          transition-transform duration-300
          lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center gap-2 px-4 py-4 border-b border-slate-700">
          <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent whitespace-nowrap">
            Tech Prep
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden ml-auto text-slate-400 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 py-2 overflow-y-auto">
          {/* System Design section */}
          <SectionLabel label="System Design" />
          {sysDesignItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 mx-2 my-0.5 rounded-lg transition-all duration-200
                ${isActive
                  ? 'bg-blue-500/15 text-blue-400 border-l-2 border-blue-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`
              }
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
            </NavLink>
          ))}

          {/* Technology section */}
          <div className="mt-2 border-t border-slate-700/60">
            <SectionLabel label="Technology" />
            <div className="mx-2 my-0.5 rounded-lg overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-2 text-purple-400">
                <span className="text-lg flex-shrink-0">⚛️</span>
                <span className="text-sm font-semibold whitespace-nowrap">React Query</span>
              </div>
              {reactQueryItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-2 pl-10 pr-4 py-1.5 transition-all duration-200 text-sm
                    ${isActive
                      ? 'text-purple-400 border-l-2 border-purple-400 bg-purple-500/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                    }`
                  }
                >
                  <span className="whitespace-nowrap">{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        <div className="px-4 py-3 border-t border-slate-700 text-xs text-slate-500">
          Keep learning!
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-60 pt-14 lg:pt-0">
        <div className="p-4 sm:p-6 max-w-7xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}
