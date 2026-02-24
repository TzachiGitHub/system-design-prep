// ─────────────────────────────────────────────────────────────────────────────
// store.ts — In-Memory Data Store
//
// This is your "database". It exports mutable arrays and helper functions that
// mirror what a real ORM/query layer would provide.
//
// The key insight: resolvers don't care WHERE data comes from. If you replaced
// these arrays with Prisma/Postgres calls tomorrow, the resolver files would
// NOT change. That's the resolver layer's value as an abstraction.
// ─────────────────────────────────────────────────────────────────────────────

import {
  seedAuthors,
  seedBooks,
  seedUsers,
  seedReviews,
  type RawAuthor,
  type RawBook,
  type RawUser,
  type RawReview,
} from './seed.js';

// Re-export types so resolvers don't need to import from seed
export type { RawAuthor, RawBook, RawUser, RawReview };

// Mutable in-memory collections. Spread so mutations don't affect seed data
// if you ever want to reset state between tests.
export const authors: RawAuthor[] = [...seedAuthors];
export const books: RawBook[]     = [...seedBooks];
export const users: RawUser[]     = [...seedUsers];
export const reviews: RawReview[] = [...seedReviews];

// ── Lookup helpers ────────────────────────────────────────────────────────────
// These functions are what resolvers call to fetch related entities.
// In a real app, these would be SQL queries or ORM calls.

export const findAuthorById  = (id: string) => authors.find(a => a.id === id) ?? null;
export const findBookById    = (id: string) => books.find(b => b.id === id) ?? null;
export const findUserById    = (id: string) => users.find(u => u.id === id) ?? null;
export const findReviewById  = (id: string) => reviews.find(r => r.id === id) ?? null;

export const findBooksByAuthorId    = (authorId: string) => books.filter(b => b.authorId === authorId);
export const findReviewsByBookId    = (bookId: string)   => reviews.filter(r => r.bookId === bookId);
export const findReviewsByUserId    = (userId: string)   => reviews.filter(r => r.userId === userId);

// ── ID generator ─────────────────────────────────────────────────────────────

let idCounter = 1000;
export const generateId = (prefix: string) => `${prefix}-${++idCounter}`;
