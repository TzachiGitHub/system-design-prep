import { NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

const navItems = [
  { to: '/', icon: '🏠', label: 'Dashboard' },
  { to: '/patterns', icon: '🧩', label: 'Patterns' },
  { to: '/blocks', icon: '🧱', label: 'Building Blocks' },
  { to: '/problems', icon: '💡', label: 'Problems' },
  { to: '/concepts', icon: '⚖️', label: 'Concepts' },
  { to: '/framework', icon: '📋', label: 'Framework' },
  { to: '/cheat-sheet', icon: '📝', label: 'Cheat Sheet' },
  { to: '/quiz', icon: '🎯', label: 'Quiz' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  // Close mobile menu on navigation
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
          SysDesign Prep
        </span>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — hidden on mobile, slide-in when open */}
      <aside
        className={`no-print fixed top-0 left-0 h-screen z-50 flex flex-col
          bg-slate-900 border-r border-slate-700 w-60
          transition-transform duration-300
          lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center gap-2 px-4 py-4 border-b border-slate-700">
          <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent whitespace-nowrap">
            SysDesign Prep
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden ml-auto text-slate-400 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 py-2 overflow-y-auto">
          {navItems.map(item => (
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
        </nav>

        <div className="px-4 py-3 border-t border-slate-700 text-xs text-slate-500">
          🚀 Interview Tomorrow!
        </div>
      </aside>

      {/* Main content — offset on desktop, full-width on mobile */}
      <main className="lg:ml-60 pt-14 lg:pt-0">
        <div className="p-4 sm:p-6 max-w-7xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}
