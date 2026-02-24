import { useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { api, type Post } from '../../lib/api'
import RQNav from './RQNav'

const TOTAL_PAGES = 10
const PAGE_SIZE = 10

function SpinnerIcon() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )
}

function PostRow({ post }: { post: Post }) {
  return (
    <div className="bg-slate-900 rounded-lg px-4 py-3 space-y-1">
      <p className="text-slate-100 text-sm font-medium capitalize leading-snug">
        {post.title}
      </p>
      <p className="text-slate-500 text-xs">Post #{post.id} · User #{post.userId}</p>
    </div>
  )
}

export default function Pagination() {
  const [page, setPage] = useState(1)

  const { data, isFetching, isLoading, isPlaceholderData } = useQuery<Post[]>({
    queryKey: ['posts', 'paginated', page],
    queryFn: () => api.getPosts(page, PAGE_SIZE),
    placeholderData: keepPreviousData,
  })

  const isFirstPage = page === 1
  const isLastPage = page === TOTAL_PAGES

  const codeSnippet = `import { keepPreviousData } from '@tanstack/react-query'

const { data, isFetching, isPlaceholderData } = useQuery({
  queryKey: ['posts', 'paginated', page],
  queryFn: () => api.getPosts(page, 10),
  // Keep old page data visible while next page loads
  placeholderData: keepPreviousData,
})

// Disable "Next" while showing stale data so user
// can't skip ahead of the in-flight request
<button disabled={isPlaceholderData || isLastPage}>
  Next
</button>`

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">
          07 — Pagination
        </h1>
        <p className="text-slate-400">
          Use <code className="text-purple-300">keepPreviousData</code> to prevent
          loading-flicker when navigating between pages.
        </p>
      </div>

      {/* Concept explanation */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-4">
        <h2 className="text-lg font-semibold text-purple-400">
          placeholderData: keepPreviousData
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          By default, when you change the query key (e.g. change the page number),
          React Query treats it as a brand-new query and shows a loading spinner.
          Passing{' '}
          <code className="text-purple-300 bg-purple-500/10 px-1 rounded">
            placeholderData: keepPreviousData
          </code>{' '}
          tells the query to keep returning the last successful data while the new
          page is loading — zero flicker, much smoother UX.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-400 font-semibold mb-1">Without keepPreviousData</p>
            <ul className="text-slate-300 space-y-1 list-disc list-inside">
              <li>Page changes trigger loading state</li>
              <li>Content area goes blank</li>
              <li>Layout shift / spinner appears</li>
            </ul>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
            <p className="text-green-400 font-semibold mb-1">With keepPreviousData</p>
            <ul className="text-slate-300 space-y-1 list-disc list-inside">
              <li>Old page stays visible</li>
              <li>Subtle isFetching indicator</li>
              <li>New data swaps in seamlessly</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Live demo */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-lg font-semibold text-slate-100">Live Demo</h2>
          <div className="flex items-center gap-3">
            {isFetching && (
              <span className="flex items-center gap-1 text-purple-400 text-sm">
                <SpinnerIcon />
                {isPlaceholderData ? 'Loading next page…' : 'Fetching…'}
              </span>
            )}
            <span className="text-slate-400 text-sm">
              Page <span className="text-slate-100 font-semibold">{page}</span> / {TOTAL_PAGES}
            </span>
          </div>
        </div>

        {/* Page indicator dots */}
        <div className="flex gap-1 flex-wrap">
          {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                p === page
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Post list — opacity change to hint at stale data */}
        <div className={`space-y-2 transition-opacity duration-200 ${isPlaceholderData ? 'opacity-60' : 'opacity-100'}`}>
          {isLoading ? (
            <div className="text-slate-400 text-sm animate-pulse py-4 text-center">
              Loading posts…
            </div>
          ) : (
            data?.map((post) => <PostRow key={post.id} post={post} />)
          )}
        </div>

        {/* Prev / Next controls */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={isFirstPage}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-100 text-sm rounded-lg transition-colors"
          >
            ← Prev
          </button>

          <span className="text-slate-500 text-sm flex-1 text-center">
            Showing posts {(page - 1) * PAGE_SIZE + 1}–{page * PAGE_SIZE}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(TOTAL_PAGES, p + 1))}
            disabled={isLastPage || isPlaceholderData}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-100 text-sm rounded-lg transition-colors"
          >
            Next →
          </button>
        </div>

        <p className="text-slate-500 text-xs">
          Notice: while loading the next page the current page stays visible at reduced
          opacity instead of showing a spinner.
        </p>
      </div>

      {/* Code snippet */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-3">
        <h2 className="text-lg font-semibold text-slate-100">Code Pattern</h2>
        <pre className="bg-slate-950 rounded-lg p-4 font-mono text-sm text-slate-300 overflow-x-auto whitespace-pre">
          {codeSnippet}
        </pre>
        <p className="text-slate-400 text-sm">
          <code className="text-purple-300">isPlaceholderData</code> is{' '}
          <code className="text-green-400">true</code> while the query is loading fresh
          data and the UI is still showing the previous page's data. Use it to dim the
          list or disable the "Next" button.
        </p>
      </div>
      <RQNav current="/tech/react-query/pagination" />
    </div>
  )
}
