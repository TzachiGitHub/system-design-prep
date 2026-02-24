// ─────────────────────────────────────────────────────────────────────────────
// BooksPage.tsx — Lesson 1: Basic Queries and Field Selection
//
// Concepts:
//  • useQuery hook — the primary way to fetch data in Apollo Client
//  • Field selection — the client specifies WHICH fields it wants
//  • Loading/error states — Apollo handles these automatically
//  • Overfetching: REST /books returns every field on every book.
//    This query returns only what we asked for.
//
// Try this: open graphql/queries.ts, remove 'genre' from GET_ALL_BOOKS,
// and watch the network tab — the response JSON shrinks.
// ─────────────────────────────────────────────────────────────────────────────

import { useQuery } from '@apollo/client/react';
import { Link } from 'react-router-dom';
import { GET_ALL_BOOKS } from '../graphql/queries';
import RestComparison from '../components/RestComparison';
import QueryInspector from '../components/QueryInspector';

const GENRE_COLORS: Record<string, string> = {
  FICTION:     'bg-purple-900 text-purple-300',
  NON_FICTION: 'bg-blue-900 text-blue-300',
  SCIENCE:     'bg-cyan-900 text-cyan-300',
  HISTORY:     'bg-yellow-900 text-yellow-300',
  BIOGRAPHY:   'bg-green-900 text-green-300',
  FANTASY:     'bg-pink-900 text-pink-300',
  MYSTERY:     'bg-red-900 text-red-300',
};

const QUERY_STRING = `query GetAllBooks {
  books {
    id
    title
    genre
    publishedYear
    averageRating
    reviewCount
    author {
      id
      name
    }
  }
}`;

export default function BooksPage() {
  type Book = { id: string; title: string; genre: string; publishedYear: number; averageRating: number | null; reviewCount: number; author: { id: string; name: string } };
  const { loading, error, data } = useQuery<{ books: Book[] }>(GET_ALL_BOOKS);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Lesson header */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">Lesson 1</p>
        <h1 className="text-2xl font-bold text-white mb-2">Basic Queries & Field Selection</h1>
        <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
          <code className="text-indigo-300">useQuery(GET_ALL_BOOKS)</code> sends one HTTP POST to{' '}
          <code className="text-indigo-300">/graphql</code>. The server returns <em>only</em> the
          fields you asked for — nothing more. Open the network tab and compare the response to
          what a REST <code className="text-indigo-300">GET /books</code> would return.
        </p>
      </div>

      {/* Query inspector */}
      <QueryInspector query={QUERY_STRING} />

      {/* Book grid */}
      <div className="mt-8">
        {loading && (
          <div className="text-gray-500 text-sm">Loading books…</div>
        )}
        {error && (
          <div className="text-red-400 text-sm bg-red-900/20 rounded-md p-4">
            Error: {error.message}
          </div>
        )}
        {data && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.books.map((book) => (
              <Link
                key={book.id}
                to={`/books/${book.id}`}
                className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-indigo-600 transition-colors group"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${GENRE_COLORS[book.genre] ?? 'bg-gray-800 text-gray-300'}`}>
                    {book.genre.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-gray-500">{book.publishedYear}</span>
                </div>
                <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors leading-snug mb-1">
                  {book.title}
                </h3>
                <Link
                  to={`/authors/${book.author.id}`}
                  onClick={e => e.stopPropagation()}
                  className="text-xs text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  {book.author.name}
                </Link>
                <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                  {book.averageRating !== null ? (
                    <span className="text-yellow-400">★ {book.averageRating.toFixed(1)}</span>
                  ) : (
                    <span className="text-gray-600">No reviews</span>
                  )}
                  <span>{book.reviewCount} review{book.reviewCount !== 1 ? 's' : ''}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* REST comparison panel */}
      <RestComparison
        lesson="Lesson 1"
        concept="Field selection prevents overfetching"
        graphqlQuery={QUERY_STRING}
        restSteps={[
          {
            method: 'GET',
            path: '/books',
            reason: 'Returns ALL fields on ALL books — id, title, genre, publishedYear, authorId, createdAt, updatedAt, etc. You wanted 6 fields; you received 12+.',
          },
          {
            method: 'GET',
            path: '/authors/:authorId (×N)',
            reason: 'REST /books doesn\'t include author name — only authorId. Fetching author names requires N additional requests (one per unique author).',
          },
        ]}
      />
    </div>
  );
}
