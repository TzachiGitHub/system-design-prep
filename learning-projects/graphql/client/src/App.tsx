import { Routes, Route, NavLink } from 'react-router-dom';
import BooksPage from './pages/BooksPage';
import BookDetailPage from './pages/BookDetailPage';
import AuthorPage from './pages/AuthorPage';
import AddBookPage from './pages/AddBookPage';
import LiveFeedPage from './pages/LiveFeedPage';

const navItems = [
  { to: '/',          label: 'Lesson 1 · Books',       exact: true },
  { to: '/add-book',  label: 'Lesson 4 · Add Book' },
  { to: '/live-feed', label: 'Lesson 5 · Live Feed' },
];

export default function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col p-4 gap-1">
        <div className="mb-6">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">GraphQL Learning</p>
          <p className="text-xs text-gray-500">Bookclub API</p>
        </div>

        {navItems.map(({ to, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              `text-sm px-3 py-2 rounded-md transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`
            }
          >
            {label}
          </NavLink>
        ))}

        <div className="mt-auto pt-4 border-t border-gray-800">
          <a
            href="http://localhost:4000"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-gray-500 hover:text-indigo-400 block transition-colors"
          >
            Apollo Sandbox ↗
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<BooksPage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="/authors/:id" element={<AuthorPage />} />
          <Route path="/add-book" element={<AddBookPage />} />
          <Route path="/live-feed" element={<LiveFeedPage />} />
        </Routes>
      </main>
    </div>
  );
}
