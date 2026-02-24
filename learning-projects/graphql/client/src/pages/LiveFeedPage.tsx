// ─────────────────────────────────────────────────────────────────────────────
// LiveFeedPage.tsx — Lesson 5: Subscriptions (Real-time)
//
// Concepts:
//  • useSubscription: like useQuery, but data arrives over WebSocket PUSH
//  • PubSub pattern: server publishes REVIEW_ADDED → subscribed clients receive it
//  • withFilter: subscription filtered by bookId — clients only receive reviews
//    for the book they're watching
//  • Transport: subscriptions use ws:// (WebSocket), not http://
//    The split link in apollo/client.ts routes them correctly
//
// How to demo:
//  1. Select a book and click "Watch for reviews"
//  2. Open a NEW BROWSER TAB and go to a Book Detail page
//  3. Add a review for the same book
//  4. Come back to this tab — the review appeared in real-time!
//
// Or use Apollo Sandbox (http://localhost:4000) to run:
//   mutation {
//     addReview(input: { bookId: "book-1", userId: "user-2", rating: 5, body: "Test!" }) {
//       id
//     }
//   }
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { useQuery, useSubscription } from '@apollo/client/react';
import { GET_ALL_BOOKS } from '../graphql/queries';
import { ON_REVIEW_ADDED, ON_BOOK_ADDED } from '../graphql/subscriptions';

const SUB_STRING = `subscription OnReviewAdded($bookId: ID!) {
  reviewAdded(bookId: $bookId) {
    id
    rating
    body
    createdAt
    user {
      id
      username
    }
  }
}`;

type Review = {
  id: string;
  rating: number;
  body: string;
  createdAt: string;
  user: { id: string; username: string };
};

// Component that actively subscribes to a specific book's reviews
function ReviewSubscriber({ bookId, bookTitle }: { bookId: string; bookTitle: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useSubscription<{ reviewAdded: Review }>(ON_REVIEW_ADDED, {
    variables: { bookId },
    onData: ({ data }) => {
      if (data.data?.reviewAdded) {
        setReviews(prev => [data.data!.reviewAdded, ...prev]);
      }
    },
  });

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <p className="text-xs text-green-400">Listening for reviews on "{bookTitle}" via WebSocket…</p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-gray-900 rounded-lg p-6 text-center">
          <p className="text-gray-500 text-sm">Waiting for reviews…</p>
          <p className="text-gray-600 text-xs mt-1">
            Open another tab, go to this book's detail page, and add a review.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review, i) => (
            <div
              key={review.id}
              className={`bg-gray-900 border rounded-lg p-4 transition-all ${
                i === 0 ? 'border-green-700' : 'border-gray-800'
              }`}
            >
              {i === 0 && (
                <span className="text-xs text-green-400 font-medium mb-2 block">← just received</span>
              )}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-yellow-400">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                <span className="text-xs text-gray-500">{review.user.username}</span>
                <span className="text-xs text-gray-600 ml-auto">
                  {new Date(review.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-gray-300">{review.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Bonus: subscribe to all new books
function BookFeed() {
  const [books, setBooks] = useState<Array<{ id: string; title: string; author: { name: string } }>>([]);

  type BookAddedData = { bookAdded: { id: string; title: string; author: { name: string } } };
  useSubscription<BookAddedData>(ON_BOOK_ADDED, {
    onData: ({ data }) => {
      if (data.data?.bookAdded) {
        setBooks(prev => [data.data!.bookAdded, ...prev]);
      }
    },
  });

  if (books.length === 0) return null;

  return (
    <div className="mb-6">
      <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">New books added</p>
      <div className="space-y-2">
        {books.map(book => (
          <div key={book.id} className="bg-gray-900 border border-indigo-800 rounded-lg p-3 text-sm">
            <span className="text-white font-medium">{book.title}</span>
            <span className="text-gray-500"> by {book.author.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LiveFeedPage() {
  const [selectedBook, setSelectedBook] = useState<{ id: string; title: string } | null>(null);
  const [watching, setWatching] = useState(false);

  const { data: booksData } = useQuery<{ books: Array<{ id: string; title: string }> }>(GET_ALL_BOOKS);

  const handleConnect = () => {
    if (selectedBook) setWatching(true);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">Lesson 5</p>
        <h1 className="text-2xl font-bold text-white mb-2">Subscriptions — Real-time Push</h1>
        <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
          Subscriptions use WebSocket (<code className="text-indigo-300">ws://localhost:4000/graphql</code>).
          The server pushes data to the client when an event fires — no polling.
          The schema syntax is identical to queries; only the transport differs.
        </p>
      </div>

      {/* How subscriptions work callout */}
      <div className="border border-indigo-800 bg-indigo-900/10 rounded-lg p-4 mb-6">
        <p className="text-xs font-semibold text-indigo-400 mb-2">How it works</p>
        <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
          <li>Client sends subscription operation over WebSocket (not HTTP)</li>
          <li>Server registers the subscription and listens on PubSub</li>
          <li>Another client calls <code className="text-indigo-300">addReview</code> (HTTP mutation)</li>
          <li>Mutation resolver calls <code className="text-indigo-300">pubsub.publish("REVIEW_ADDED", payload)</code></li>
          <li><code className="text-indigo-300">withFilter</code> checks if this review matches our bookId</li>
          <li>Server pushes the review to our WebSocket connection</li>
          <li><code className="text-indigo-300">useSubscription</code>'s <code className="text-indigo-300">onData</code> fires → React re-renders</li>
        </ol>
      </div>

      {/* Book added feed */}
      <BookFeed />

      {/* Book selector */}
      {!watching ? (
        <div className="bg-gray-900 rounded-xl p-6">
          <p className="text-sm text-gray-300 mb-4">Select a book to watch for new reviews:</p>
          <div className="flex gap-3">
            <select
              value={selectedBook?.id ?? ''}
              onChange={e => {
                const book = booksData?.books.find((b: { id: string }) => b.id === e.target.value);
                setSelectedBook(book ? { id: book.id, title: book.title } : null);
              }}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="">Choose a book…</option>
              {booksData?.books.map((b: { id: string; title: string }) => (
                <option key={b.id} value={b.id}>{b.title}</option>
              ))}
            </select>
            <button
              onClick={handleConnect}
              disabled={!selectedBook}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors whitespace-nowrap"
            >
              Watch for reviews
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-white">{selectedBook!.title}</p>
            <button
              onClick={() => { setWatching(false); setSelectedBook(null); }}
              className="text-xs text-gray-500 hover:text-white transition-colors"
            >
              Change book
            </button>
          </div>
          <ReviewSubscriber bookId={selectedBook!.id} bookTitle={selectedBook!.title} />
        </div>
      )}

      {/* Subscription query */}
      <div className="mt-8 border border-gray-700 rounded-lg overflow-hidden">
        <div className="bg-gray-900 px-4 py-2 border-b border-gray-700">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Subscription document</p>
        </div>
        <pre className="bg-gray-950 p-4 text-xs text-gray-300 overflow-x-auto leading-relaxed">
          <code>{SUB_STRING}</code>
        </pre>
      </div>

      {/* REST comparison */}
      <div className="border border-gray-700 rounded-lg overflow-hidden mt-4">
        <div className="bg-gray-900 px-4 py-3 border-b border-gray-700">
          <p className="text-xs font-semibold text-gray-400">REST equivalent for real-time</p>
        </div>
        <div className="p-4 space-y-3">
          <div className="bg-gray-900 rounded p-3">
            <p className="text-xs font-medium text-orange-400 mb-1">Option 1: Polling</p>
            <code className="text-xs text-gray-300">GET /books/:id/reviews  (every 2 seconds)</code>
            <p className="text-xs text-gray-500 mt-1">Works but wastes server resources. Latency = polling interval.</p>
          </div>
          <div className="bg-gray-900 rounded p-3">
            <p className="text-xs font-medium text-orange-400 mb-1">Option 2: Server-Sent Events</p>
            <code className="text-xs text-gray-300">GET /books/:id/reviews/stream  (SSE)</code>
            <p className="text-xs text-gray-500 mt-1">Better than polling, but one-directional and not standardized per-resource.</p>
          </div>
          <div className="bg-gray-900 rounded p-3">
            <p className="text-xs font-medium text-green-400 mb-1">GraphQL Subscriptions</p>
            <code className="text-xs text-gray-300">ws://localhost:4000/graphql  (single connection, any resource)</code>
            <p className="text-xs text-gray-500 mt-1">One WebSocket, any subscription. Typed. Filtered. Same schema as queries.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
