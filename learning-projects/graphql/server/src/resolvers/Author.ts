// ─────────────────────────────────────────────────────────────────────────────
// Author.ts — Author Type Resolvers
//
// Demonstrates:
//  1. Relationship resolution: Author → [Book] (one-to-many, opposite direction)
//  2. Circular references: Author.books returns Books, each Book.author points
//     back to this Author. GraphQL handles this safely because resolution
//     depth is bounded by the client's query shape — it never infinite-loops.
//  3. Computed fields (bookCount).
// ─────────────────────────────────────────────────────────────────────────────

import { findBooksByAuthorId, type RawAuthor } from '../data/store.js';

export const AuthorResolvers = {
  Author: {
    // Given an Author, find all Books written by that author.
    //
    // ⚠️  N+1 HERE TOO: If the client queries { authors { books { title } } },
    // this resolver runs once per author. With 5 authors it runs 5 times.
    // With 500 authors in production, it runs 500 times — each doing a full
    // scan of the books array (or a SELECT * FROM books WHERE authorId = ?).
    //
    // DataLoader would batch this: collect all authorIds during resolution,
    // then run one query: SELECT * FROM books WHERE authorId IN (...).
    books: (parent: RawAuthor) => {
      return findBooksByAuthorId(parent.id);
    },

    // Computed: count books by this author.
    bookCount: (parent: RawAuthor) => {
      return findBooksByAuthorId(parent.id).length;
    },
  },
};
