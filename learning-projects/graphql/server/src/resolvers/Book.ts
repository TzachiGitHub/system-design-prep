// ─────────────────────────────────────────────────────────────────────────────
// Book.ts — Book Type Resolvers
//
// ★ THIS FILE IS THE MOST IMPORTANT LESSON IN THE PROJECT ★
//
// These resolvers handle fields on the Book TYPE — not the root Query.
// They only run when the client explicitly requests those fields.
//
// Mental model — when the client sends:
//   query { books { title genre } }
//   → Book.author    DOES NOT run  (client didn't ask for author)
//   → Book.reviews   DOES NOT run  (client didn't ask for reviews)
//
//   query { books { title author { name } } }
//   → Book.author    RUNS once per book in the result
//   → Book.reviews   DOES NOT run  (client didn't ask for reviews)
//
// The resolver chain is lazy — resolvers only execute for fields the client
// requested. This is fundamentally different from REST, where the endpoint
// always fetches everything (overfetching).
//
// Resolver signature:
//   (parent, args, context, info)
//    ↑
//    The raw object returned by the parent resolver.
//    For Book type resolvers, parent = RawBook from the store
//    (which has authorId: string, NOT author: Author).
//    The resolver's job is to RESOLVE that ID into a full Author object.
// ─────────────────────────────────────────────────────────────────────────────

import {
  findAuthorById,
  findReviewsByBookId,
  type RawBook,
} from '../data/store.js';

export const BookResolvers = {
  Book: {
    // parent.authorId → look up and return the full Author object.
    //
    // ⚠️  N+1 TRAP: If the client queries 100 books and asks for author.name,
    // this resolver runs 100 times — one scan of authors[] per book.
    // For our in-memory store this is fine. In production with a real DB,
    // you'd use DataLoader to batch these 100 lookups into a single query:
    //   SELECT * FROM authors WHERE id IN (1, 2, 3, ...)
    //
    // DataLoader is not implemented here (it would obscure the core lesson),
    // but understanding WHY it exists is the lesson.
    author: (parent: RawBook) => {
      return findAuthorById(parent.authorId);
    },

    // parent.id → find all reviews for this book.
    reviews: (parent: RawBook) => {
      return findReviewsByBookId(parent.id);
    },

    // Computed field: averageRating is NOT stored anywhere.
    // It's derived every time a client requests it.
    // Returns null if the book has no reviews (schema: averageRating: Float — nullable).
    averageRating: (parent: RawBook) => {
      const bookReviews = findReviewsByBookId(parent.id);
      if (bookReviews.length === 0) return null;
      const sum = bookReviews.reduce((acc, r) => acc + r.rating, 0);
      return Math.round((sum / bookReviews.length) * 10) / 10; // 1 decimal place
    },

    // Computed field: reviewCount derived from the reviews array.
    reviewCount: (parent: RawBook) => {
      return findReviewsByBookId(parent.id).length;
    },
  },
};
