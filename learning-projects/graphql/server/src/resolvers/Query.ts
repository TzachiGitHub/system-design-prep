// ─────────────────────────────────────────────────────────────────────────────
// Query.ts — Root Query Resolvers
//
// Each field on the Query type in the schema gets a resolver function here.
// The resolver signature is: (parent, args, context, info)
//  • parent  — for root queries, this is always undefined
//  • args    — the field arguments (e.g. { id: "book-1" } or { filter: {...} })
//  • context — shared request context (currentUser, etc.)
//  • info    — AST info about the query (rarely needed)
//
// Root query resolvers are the "entry points" into the resolver chain.
// They return raw data objects (RawBook, RawAuthor, etc.) — NOT the final
// GraphQL type. The type-level resolvers (Book.ts, Author.ts, etc.) then
// transform those raw objects into the shape the schema expects.
// ─────────────────────────────────────────────────────────────────────────────

import {
  authors,
  books,
  users,
  findAuthorById,
  findBookById,
  findUserById,
  findReviewsByBookId,
  type RawBook,
} from '../data/store.js';
import type { Context } from '../context.js';

type BooksFilterInput = {
  genre?: string;
  authorId?: string;
  minRating?: number;
};

type BooksSortInput = {
  field: string;
  order: 'ASC' | 'DESC';
};

export const QueryResolvers = {
  Query: {
    // Single entity lookups — return null (not an error) when not found.
    // The schema declares these as nullable: book(id: ID!): Book  (no !)
    book: (_parent: undefined, args: { id: string }) =>
      findBookById(args.id),

    author: (_parent: undefined, args: { id: string }) =>
      findAuthorById(args.id),

    user: (_parent: undefined, args: { id: string }) =>
      findUserById(args.id),

    // Collection query with optional filtering and sorting.
    // This is where you'd normally add pagination (first/after cursor args).
    books: (
      _parent: undefined,
      args: { filter?: BooksFilterInput; sort?: BooksSortInput }
    ) => {
      let result = [...books];

      // Apply filters
      if (args.filter) {
        const { genre, authorId, minRating } = args.filter;

        if (genre) {
          result = result.filter(b => b.genre === genre);
        }
        if (authorId) {
          result = result.filter(b => b.authorId === authorId);
        }
        if (minRating !== undefined) {
          // Filter by average rating — must compute per book
          result = result.filter(b => {
            const bookReviews = findReviewsByBookId(b.id);
            if (bookReviews.length === 0) return false;
            const avg = bookReviews.reduce((s, r) => s + r.rating, 0) / bookReviews.length;
            return avg >= minRating;
          });
        }
      }

      // Apply sort
      if (args.sort) {
        const { field, order } = args.sort;
        result.sort((a, b) => {
          let aVal: number | string;
          let bVal: number | string;

          if (field === 'averageRating') {
            const aRevs = findReviewsByBookId(a.id);
            const bRevs = findReviewsByBookId(b.id);
            aVal = aRevs.length ? aRevs.reduce((s, r) => s + r.rating, 0) / aRevs.length : 0;
            bVal = bRevs.length ? bRevs.reduce((s, r) => s + r.rating, 0) / bRevs.length : 0;
          } else if (field === 'publishedYear') {
            aVal = a.publishedYear;
            bVal = b.publishedYear;
          } else {
            aVal = a.title.toLowerCase();
            bVal = b.title.toLowerCase();
          }

          if (aVal < bVal) return order === 'ASC' ? -1 : 1;
          if (aVal > bVal) return order === 'ASC' ? 1 : -1;
          return 0;
        });
      }

      return result;
    },

    authors: () => authors,

    users: () => users,

    // Cross-entity computed query: top books by average rating.
    // This shows how resolvers can aggregate across multiple entities.
    topRatedBooks: (_parent: undefined, args: { limit?: number }) => {
      const limit = args.limit ?? 5;

      const booksWithRating = books
        .map(b => {
          const bookReviews = findReviewsByBookId(b.id);
          const avg = bookReviews.length
            ? bookReviews.reduce((s, r) => s + r.rating, 0) / bookReviews.length
            : 0;
          return { book: b, avg };
        })
        .filter(({ avg }) => avg > 0) // exclude books with no reviews
        .sort((a, b) => b.avg - a.avg)
        .slice(0, limit)
        .map(({ book }) => book);

      return booksWithRating;
    },

    // Convenience query combining filter + sort in one named query.
    booksByAuthor: (
      _parent: undefined,
      args: { authorId: string; sort?: BooksSortInput }
    ): RawBook[] => {
      let result = books.filter(b => b.authorId === args.authorId);

      if (args.sort) {
        const { field, order } = args.sort;
        result.sort((a, b) => {
          const aVal = field === 'publishedYear' ? a.publishedYear : a.title.toLowerCase();
          const bVal = field === 'publishedYear' ? b.publishedYear : b.title.toLowerCase();
          if (aVal < bVal) return order === 'ASC' ? -1 : 1;
          if (aVal > bVal) return order === 'ASC' ? 1 : -1;
          return 0;
        });
      }

      return result;
    },
  },
};
