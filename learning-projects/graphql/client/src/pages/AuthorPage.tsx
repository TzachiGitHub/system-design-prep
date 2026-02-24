// ─────────────────────────────────────────────────────────────────────────────
// AuthorPage.tsx — Lesson 3: Relationships & The N+1 Problem
//
// Concepts:
//  • Circular references: Author → [Book] → each Book.author → Author
//  • The N+1 Problem: Author.books resolver runs once per author in a list query.
//    This page queries ONE author, but imagine querying ALL authors — then
//    Author.books runs N times (once per author). In production with a real DB,
//    you'd use DataLoader to batch N queries into 1.
//  • Back in server/src/resolvers/Author.ts, there's a comment explaining this.
// ─────────────────────────────────────────────────────────────────────────────

import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { GET_AUTHOR_DETAIL } from '../graphql/queries';

type AuthorData = {
  author: {
    id: string;
    name: string;
    bio: string | null;
    bookCount: number;
    books: Array<{
      id: string;
      title: string;
      genre: string;
      publishedYear: number;
      averageRating: number | null;
      reviewCount: number;
    }>;
  };
};
import RestComparison from '../components/RestComparison';
import QueryInspector from '../components/QueryInspector';

const QUERY_STRING = `query GetAuthorDetail($id: ID!) {
  author(id: $id) {
    id
    name
    bio
    bookCount
    books {
      id
      title
      genre
      publishedYear
      averageRating
      reviewCount
    }
  }
}`;

const GENRE_COLORS: Record<string, string> = {
  FICTION: 'text-purple-400', NON_FICTION: 'text-blue-400',
  SCIENCE: 'text-cyan-400', HISTORY: 'text-yellow-400',
  BIOGRAPHY: 'text-green-400', FANTASY: 'text-pink-400', MYSTERY: 'text-red-400',
};

export default function AuthorPage() {
  const { id } = useParams<{ id: string }>();

  const { loading, error, data } = useQuery<AuthorData>(GET_AUTHOR_DETAIL, {
    variables: { id },
  });

  if (loading) return <div className="p-8 text-gray-500">Loading…</div>;
  if (error)   return <div className="p-8 text-red-400">Error: {error.message}</div>;
  if (!data?.author) return <div className="p-8 text-gray-500">Author not found</div>;

  const { author } = data;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">Lesson 3 · Relationships</p>
        <Link to="/" className="text-xs text-gray-500 hover:text-gray-300">← All books</Link>
      </div>

      {/* Author header */}
      <div className="bg-gray-900 rounded-xl p-6 mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">{author.name}</h1>
        <p className="text-sm text-gray-500 mb-3">{author.bookCount} books</p>
        {author.bio ? (
          <p className="text-sm text-gray-400 leading-relaxed">{author.bio}</p>
        ) : (
          <p className="text-sm text-gray-600 italic">No bio available</p>
        )}
      </div>

      {/* N+1 lesson callout */}
      <div className="border border-yellow-800 bg-yellow-900/10 rounded-lg p-4 mb-6">
        <p className="text-xs font-semibold text-yellow-400 mb-1">The N+1 Problem — explained here</p>
        <p className="text-xs text-gray-400 leading-relaxed">
          The <code className="text-yellow-300">Author.books</code> resolver in{' '}
          <code className="text-yellow-300">server/src/resolvers/Author.ts</code> scans the books
          array once per author. For this page (1 author), it runs once. But a query like{' '}
          <code className="text-yellow-300">{'{ authors { books { title } } }'}</code> would run it
          N times — once per author. With a real DB, that's N SQL queries instead of 1.{' '}
          <strong className="text-yellow-300">DataLoader</strong> fixes this by batching those N
          calls into a single <code>SELECT * FROM books WHERE authorId IN (...)</code>.
        </p>
      </div>

      {/* Books by this author */}
      <h2 className="text-sm font-semibold text-gray-300 mb-3">
        Books by {author.name}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {author.books.map((book) => (
          <Link
            key={book.id}
            to={`/books/${book.id}`}
            className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-indigo-600 transition-colors group"
          >
            <div className="flex items-start justify-between mb-1">
              <span className={`text-xs font-medium ${GENRE_COLORS[book.genre]}`}>
                {book.genre.replace('_', ' ')}
              </span>
              <span className="text-xs text-gray-500">{book.publishedYear}</span>
            </div>
            <p className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
              {book.title}
            </p>
            <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
              {book.averageRating !== null ? (
                <span className="text-yellow-400">★ {book.averageRating.toFixed(1)}</span>
              ) : (
                <span className="text-gray-600">No reviews</span>
              )}
              <span>{book.reviewCount} reviews</span>
            </div>
          </Link>
        ))}
      </div>

      <QueryInspector query={QUERY_STRING} variables={{ id }} />

      <RestComparison
        lesson="Lesson 3"
        concept="Relationships: one query traverses Author → Books"
        graphqlQuery={QUERY_STRING}
        restSteps={[
          { method: 'GET', path: `/authors/${id}`, reason: 'Get author data' },
          { method: 'GET', path: `/authors/${id}/books`, reason: 'Get book list for this author (separate endpoint, separate request)' },
        ]}
      />
    </div>
  );
}
