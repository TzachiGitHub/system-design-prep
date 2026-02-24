// ─────────────────────────────────────────────────────────────────────────────
// BookDetailPage.tsx — Lesson 2 & 4: Nested Data + Mutations
//
// Concepts:
//  • Variables: $id is passed at runtime via useQuery's 'variables' option
//  • Nested queries: Book → Author → Reviews → Users in ONE request
//  • useMutation: adding and deleting reviews
//  • Cache updates: after mutation, Apollo automatically updates the UI
//    because the mutation returns the affected object with its id
//
// Underfetching problem (REST):
//  To render this page with REST, you'd need:
//  1. GET /books/:id           → book data
//  2. GET /authors/:authorId   → author data (authorId came from step 1)
//  3. GET /books/:id/reviews   → review list
//  4. GET /users/:userId ×N    → user data for each review
//  = 3 sequential + N parallel requests = high latency
//
// With GraphQL: 1 request, complete data.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_BOOK_DETAIL, GET_ALL_BOOKS } from '../graphql/queries';
import { ADD_REVIEW, DELETE_REVIEW } from '../graphql/mutations';
import RestComparison from '../components/RestComparison';
import QueryInspector from '../components/QueryInspector';

const QUERY_STRING = `query GetBookDetail($id: ID!) {
  book(id: $id) {
    id
    title
    publishedYear
    genre
    averageRating
    reviewCount
    author {
      id
      name
      bio
      bookCount
    }
    reviews {
      id
      rating
      body
      createdAt
      user {
        id
        username
      }
    }
  }
}`;

type BookDetail = {
  id: string;
  title: string;
  publishedYear: number;
  genre: string;
  averageRating: number | null;
  reviewCount: number;
  author: { id: string; name: string; bio: string | null; bookCount: number };
  reviews: Array<{ id: string; rating: number; body: string; createdAt: string; user: { id: string; username: string } }>;
};

const GENRE_LABELS: Record<string, string> = {
  FICTION: 'Fiction', NON_FICTION: 'Non-Fiction', SCIENCE: 'Science',
  HISTORY: 'History', BIOGRAPHY: 'Biography', FANTASY: 'Fantasy', MYSTERY: 'Mystery',
};

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState('');
  const [addError, setAddError] = useState('');

  const { loading, error, data } = useQuery<{ book: BookDetail }>(GET_BOOK_DETAIL, {
    variables: { id },
  });

  // useMutation returns a tuple: [mutationFn, { loading, error, data }]
  const [addReview, { loading: addingReview }] = useMutation(ADD_REVIEW, {
    // After adding a review, refetch the books list so the rating on the
    // BooksPage card updates too. (Apollo can't auto-update lists from nested mutations.)
    refetchQueries: [{ query: GET_ALL_BOOKS }],
    onError: (err: Error) => setAddError(err.message),
    onCompleted: () => {
      setBody('');
      setAddError('');
    },
  });

  const [deleteReview] = useMutation(DELETE_REVIEW);

  if (loading) return <div className="p-8 text-gray-500">Loading…</div>;
  if (error)   return <div className="p-8 text-red-400">Error: {error.message}</div>;
  if (!data?.book) return <div className="p-8 text-gray-500">Book not found</div>;

  const { book } = data;

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    addReview({
      variables: {
        input: { bookId: id, userId: 'user-1', rating, body },
      },
    });
  };

  const handleDelete = (reviewId: string) => {
    deleteReview({ variables: { id: reviewId } });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Lesson header */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">Lesson 2 · Nested Data</p>
        <Link to="/" className="text-xs text-gray-500 hover:text-gray-300">← All books</Link>
      </div>

      {/* Book header */}
      <div className="bg-gray-900 rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{book.title}</h1>
            <p className="text-gray-400 text-sm mb-3">
              {GENRE_LABELS[book.genre]} · {book.publishedYear}
            </p>
            <Link
              to={`/authors/${book.author.id}`}
              className="inline-block bg-gray-800 rounded-lg px-4 py-2 hover:bg-gray-700 transition-colors"
            >
              <p className="text-xs text-gray-500 mb-0.5">Author</p>
              <p className="text-sm font-medium text-white">{book.author.name}</p>
              <p className="text-xs text-gray-500">{book.author.bookCount} books</p>
            </Link>
          </div>
          <div className="text-right">
            {book.averageRating !== null ? (
              <>
                <p className="text-3xl font-bold text-yellow-400">{book.averageRating.toFixed(1)}</p>
                <p className="text-xs text-gray-500">{book.reviewCount} reviews</p>
              </>
            ) : (
              <p className="text-sm text-gray-500">No reviews yet</p>
            )}
          </div>
        </div>
        {book.author.bio && (
          <p className="mt-4 text-xs text-gray-500 border-t border-gray-800 pt-4">{book.author.bio}</p>
        )}
      </div>

      {/* Reviews */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-300 mb-3">Reviews ({book.reviewCount})</h2>
        {book.reviews.length === 0 ? (
          <p className="text-sm text-gray-500">No reviews yet — be the first!</p>
        ) : (
          <div className="space-y-3">
            {book.reviews.map((review) => (
              <div key={review.id} className="bg-gray-900 rounded-lg p-4 group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                    <span className="text-xs text-gray-500">{review.user.username}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-600">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="text-xs text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      delete
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-300">{review.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add review form — Lesson 4 */}
      <div className="bg-gray-900 rounded-xl p-5 mb-2">
        <h2 className="text-sm font-semibold text-gray-300 mb-1">Add a review</h2>
        <p className="text-xs text-gray-500 mb-4">
          Lesson 4: this form calls <code className="text-indigo-300">useMutation(ADD_REVIEW)</code>.
          After submitting, watch the review list and rating update without a page refresh.
        </p>
        <form onSubmit={handleAddReview} className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={`text-lg transition-colors ${n <= rating ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-600'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Review</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 resize-none"
              placeholder="Share your thoughts…"
              required
            />
          </div>
          {addError && (
            <p className="text-xs text-red-400 bg-red-900/20 rounded px-3 py-2">{addError}</p>
          )}
          <button
            type="submit"
            disabled={addingReview || !body.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
            {addingReview ? 'Posting…' : 'Post review'}
          </button>
        </form>
      </div>

      {/* Query inspector */}
      <QueryInspector query={QUERY_STRING} variables={{ id }} />

      {/* REST comparison */}
      <RestComparison
        lesson="Lesson 2"
        concept="One GraphQL query replaces 3-4 REST roundtrips"
        graphqlQuery={QUERY_STRING}
        restSteps={[
          { method: 'GET', path: `/books/${id}`, reason: 'Get the book (has authorId, no author name)' },
          { method: 'GET', path: '/authors/:authorId', reason: 'Get author using authorId from step 1 (sequential, adds latency)' },
          { method: 'GET', path: `/books/${id}/reviews`, reason: 'Get reviews (each has userId, no username)' },
          { method: 'GET', path: '/users/:userId (×N)', reason: 'Get username for each reviewer (N requests, sequential or parallel)' },
        ]}
      />
    </div>
  );
}
