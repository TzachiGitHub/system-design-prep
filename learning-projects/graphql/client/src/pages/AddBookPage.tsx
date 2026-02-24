// ─────────────────────────────────────────────────────────────────────────────
// AddBookPage.tsx — Lesson 4: Mutations + Apollo Cache
//
// Concepts:
//  • useMutation: how to send write operations
//  • Cache auto-update: Apollo Client normalizes the returned Book by
//    __typename + id. Any component using that book's data re-renders.
//  • refetchQueries: for list queries, we trigger a refetch so new books
//    appear in the BooksPage grid.
//  • Error handling: GraphQL errors arrive in the 'error' object, NOT as
//    HTTP 4xx/5xx — the HTTP status is always 200 for GraphQL responses.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Link } from 'react-router-dom';
import { GET_ALL_AUTHORS, GET_ALL_BOOKS } from '../graphql/queries';
import { ADD_BOOK } from '../graphql/mutations';
import RestComparison from '../components/RestComparison';
import QueryInspector from '../components/QueryInspector';

const GENRES = ['FICTION', 'NON_FICTION', 'SCIENCE', 'HISTORY', 'BIOGRAPHY', 'FANTASY', 'MYSTERY'] as const;

const MUTATION_STRING = `mutation AddBook($input: AddBookInput!) {
  addBook(input: $input) {
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

export default function AddBookPage() {
  const [title, setTitle] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [genre, setGenre] = useState<typeof GENRES[number]>('FICTION');
  const [year, setYear] = useState(new Date().getFullYear());
  const [addedBook, setAddedBook] = useState<{ id: string; title: string } | null>(null);

  const { data: authorsData } = useQuery<{ authors: Array<{ id: string; name: string }> }>(GET_ALL_AUTHORS);

  const [addBook, { loading, error }] = useMutation<{ addBook: { id: string; title: string } }>(ADD_BOOK, {
    // Refetch the books list so BooksPage shows the new book.
    // Apollo can't automatically know to add this book to the GET_ALL_BOOKS list
    // (it would need to understand the query's filter/sort logic).
    refetchQueries: [{ query: GET_ALL_BOOKS }],
    onCompleted: (data) => {
      setAddedBook({ id: data.addBook.id, title: data.addBook.title });
      setTitle('');
      setAuthorId('');
      setYear(new Date().getFullYear());
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddedBook(null);
    addBook({
      variables: {
        input: { title, authorId, genre, publishedYear: year },
      },
    });
  };

  const variables = title && authorId
    ? { input: { title, authorId, genre, publishedYear: year } }
    : undefined;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">Lesson 4</p>
        <h1 className="text-2xl font-bold text-white mb-2">Mutations & Cache Updates</h1>
        <p className="text-gray-400 text-sm leading-relaxed">
          <code className="text-indigo-300">useMutation(ADD_BOOK)</code> sends a write operation.
          After it completes, Apollo Client merges the returned Book into its InMemoryCache.
          Go to the Books page — your new book appears without a page reload.
        </p>
      </div>

      {/* Apollo cache explanation callout */}
      <div className="border border-indigo-800 bg-indigo-900/10 rounded-lg p-4 mb-6">
        <p className="text-xs font-semibold text-indigo-400 mb-1">How cache updates work</p>
        <p className="text-xs text-gray-400 leading-relaxed">
          When <code className="text-indigo-300">addBook</code> returns{' '}
          <code className="text-indigo-300">{'{ id: "book-1001", title: "...", ... }'}</code>,
          Apollo stores it as <code className="text-indigo-300">Book:book-1001</code> in the
          InMemoryCache. Every component that renders this book by id will automatically
          receive the updated data and re-render — no manual setState or refetch needed.
        </p>
      </div>

      {/* Success banner */}
      {addedBook && (
        <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-400">Book added!</p>
            <p className="text-xs text-gray-400">
              "{addedBook.title}" is now in the cache.{' '}
              <Link to={`/books/${addedBook.id}`} className="text-indigo-400 hover:underline">
                View it →
              </Link>
            </p>
          </div>
          <Link to="/" className="text-xs text-gray-500 hover:text-white">← Books list</Link>
        </div>
      )}

      {/* Add book form */}
      <form onSubmit={handleSubmit} className="bg-gray-900 rounded-xl p-6 space-y-4">
        <div>
          <label className="text-xs text-gray-400 block mb-1">Title *</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500"
            placeholder="Book title"
            required
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 block mb-1">Author *</label>
          <select
            value={authorId}
            onChange={e => setAuthorId(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500"
            required
          >
            <option value="">Select an author…</option>
            {authorsData?.authors.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Genre</label>
            <select
              value={genre}
              onChange={e => setGenre(e.target.value as typeof GENRES[number])}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500"
            >
              {GENRES.map(g => (
                <option key={g} value={g}>{g.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Year</label>
            <input
              type="number"
              value={year}
              onChange={e => setYear(Number(e.target.value))}
              min={1000}
              max={new Date().getFullYear()}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {error && (
          <div className="text-xs text-red-400 bg-red-900/20 rounded px-3 py-2">
            {error.message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-2.5 rounded-md transition-colors"
        >
          {loading ? 'Adding book…' : 'Add book'}
        </button>
      </form>

      <QueryInspector query={MUTATION_STRING} variables={variables} />

      <RestComparison
        lesson="Lesson 4"
        concept="Mutations return data so the client can update its cache"
        graphqlQuery={MUTATION_STRING}
        restSteps={[
          { method: 'POST', path: '/books', reason: 'Create the book. Returns the created book object — but REST doesn\'t guarantee which fields are returned.' },
          { method: 'GET', path: '/books', reason: 'Often needed to refresh the list, because REST POST responses may not include all fields needed for the UI.' },
        ]}
      />
    </div>
  );
}
