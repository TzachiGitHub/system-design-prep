import { NavLink } from 'react-router-dom'
import { useState } from 'react'

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
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`no-print fixed top-0 left-0 h-screen z-40 flex flex-col
          bg-navy-900 border-r border-navy-700 transition-all duration-300
          ${collapsed ? 'w-16' : 'w-56'}`}
      >
        <div className="flex items-center gap-2 px-4 py-4 border-b border-navy-700">
          {!collapsed && (
            <span className="text-lg font-bold bg-gradient-to-r from-accent-blue to-accent-cyan bg-clip-text text-transparent whitespace-nowrap">
              SysDesign Prep
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto text-slate-400 hover:text-white transition-colors text-sm"
          >
            {collapsed ? '→' : '←'}
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
                  ? 'bg-accent-blue/15 text-accent-blue border-l-2 border-accent-blue'
                  : 'text-slate-400 hover:text-white hover:bg-navy-700/50'
                }`
              }
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-3 border-t border-navy-700 text-xs text-slate-500">
          {!collapsed && '🚀 Interview Tomorrow!'}
        </div>
      </aside>

      {/* Main */}
      <main className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-56'}`}>
        <div className="p-6 max-w-7xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  )
}
