import { useInfiniteQuery } from '@tanstack/react-query'
import { api, type Post } from '../../lib/api'
import RQNav from './RQNav'

function SpinnerIcon() {
  return (
    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )
}

function PostCard({ post, index }: { post: Post; index: number }) {
  return (
    <div className="bg-slate-900 rounded-lg px-4 py-3 space-y-1 flex gap-3 items-start">
      <span className="text-slate-600 text-xs font-mono mt-0.5 w-6 flex-shrink-0">
        {index + 1}
      </span>
      <div className="min-w-0">
        <p className="text-slate-100 text-sm font-medium capitalize leading-snug truncate">
          {post.title}
        </p>
        <p className="text-slate-500 text-xs mt-0.5">
          Post #{post.id} · User #{post.userId}
        </p>
      </div>
    </div>
  )
}

export default function InfiniteScroll() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ['posts', 'infinite'],
    queryFn: ({ pageParam }) => api.getPosts(pageParam as number, 10),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) =>
      lastPage.length < 10 ? undefined : (lastPageParam as number) + 1,
  })

  const allPosts: Post[] = data?.pages.flat() ?? []
  const pageCount = data?.pages.length ?? 0

  const codeSnippet = `const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useInfiniteQuery({
  queryKey: ['posts', 'infinite'],
  queryFn: ({ pageParam }) => api.getPosts(pageParam, 10),
  initialPageParam: 1,
  // Return undefined to signal "no more pages"
  getNextPageParam: (lastPage, _allPages, lastPageParam) =>
    lastPage.length < 10 ? undefined : lastPageParam + 1,
})

// Flatten pages into a single array
const allPosts = data?.pages.flat() ?? []

<button
  onClick={() => fetchNextPage()}
  disabled={!hasNextPage || isFetchingNextPage}
>
  {isFetchingNextPage ? 'Loading more…' : hasNextPage ? 'Load more' : 'All loaded'}
</button>`

  return (
    <div className="max-w-3xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100 mb-2">
          08 — Infinite Scroll
        </h1>
        <p className="text-slate-400">
          <code className="text-purple-300">useInfiniteQuery</code> manages paginated
          data that grows as the user scrolls — no manual page tracking needed.
        </p>
      </div>

      {/* Concept explanation */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-4">
        <h2 className="text-lg font-semibold text-purple-400">
          How useInfiniteQuery works
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          Unlike regular <code className="text-purple-300">useQuery</code>, the
          infinite variant stores every page in <code className="text-slate-200">data.pages</code>{' '}
          — an array of arrays. You tell it how to get the next page param via{' '}
          <code className="text-purple-300">getNextPageParam</code>, then call{' '}
          <code className="text-purple-300">fetchNextPage()</code> whenever the user
          hits the bottom of the list (or clicks "Load more").
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {[
            { label: 'data.pages', desc: 'Array of page results', color: 'purple' },
            { label: 'data.pageParams', desc: 'Array of page params used', color: 'purple' },
            { label: 'fetchNextPage()', desc: 'Trigger next page load', color: 'blue' },
            { label: 'hasNextPage', desc: 'false when getNextPageParam returns undefined', color: 'blue' },
            { label: 'isFetchingNextPage', desc: 'true while next page loads', color: 'yellow' },
            { label: 'initialPageParam', desc: 'The first pageParam value (v5)', color: 'green' },
          ].map(({ label, desc, color }) => (
            <div key={label} className={`bg-${color}-500/10 border border-${color}-500/30 rounded-lg p-3`}>
              <code className={`text-${color}-400 text-xs font-mono`}>{label}</code>
              <p className="text-slate-400 text-xs mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Live demo */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-lg font-semibold text-slate-100">Live Demo</h2>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <span>
              <span className="text-slate-100 font-semibold">{allPosts.length}</span> posts loaded
            </span>
            <span>·</span>
            <span>
              <span className="text-slate-100 font-semibold">{pageCount}</span> pages fetched
            </span>
          </div>
        </div>

        {isError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
            Failed to load posts. Check your connection.
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center gap-2 text-slate-400 text-sm animate-pulse py-4">
            <SpinnerIcon />
            Loading first page…
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {allPosts.map((post, i) => (
              <PostCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}

        {/* Load more button */}
        <div className="flex flex-col items-center gap-2 pt-2">
          <button
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
          >
            {isFetchingNextPage ? (
              <>
                <SpinnerIcon />
                Loading more…
              </>
            ) : hasNextPage ? (
              'Load more posts'
            ) : (
              'All posts loaded'
            )}
          </button>

          {!hasNextPage && !isLoading && (
            <p className="text-slate-500 text-xs">
              Reached the end — <code>getNextPageParam</code> returned{' '}
              <code>undefined</code>.
            </p>
          )}
        </div>
      </div>

      {/* Code snippet */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5 space-y-3">
        <h2 className="text-lg font-semibold text-slate-100">Code Pattern</h2>
        <pre className="bg-slate-950 rounded-lg p-4 font-mono text-sm text-slate-300 overflow-x-auto whitespace-pre">
          {codeSnippet}
        </pre>
        <p className="text-slate-400 text-sm">
          In production, swap the "Load more" button for an{' '}
          <code className="text-purple-300">IntersectionObserver</code> on a sentinel
          div at the bottom of the list to trigger <code className="text-purple-300">fetchNextPage</code>{' '}
          automatically.
        </p>
      </div>
      <RQNav current="/tech/react-query/infinite" />
    </div>
  )
}
