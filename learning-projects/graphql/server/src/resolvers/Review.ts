// ─────────────────────────────────────────────────────────────────────────────
// Review.ts — Review Type Resolvers
//
// Demonstrates back-references: a Review stores bookId and userId (foreign keys),
// but the schema exposes Review.book: Book! and Review.user: User! — full objects.
//
// These resolvers bridge that gap: they receive a raw RawReview (with IDs)
// and return the full related entity.
// ─────────────────────────────────────────────────────────────────────────────

import { findBookById, findUserById, type RawReview } from '../data/store.js';

export const ReviewResolvers = {
  Review: {
    // raw.bookId → full Book object
    book: (parent: RawReview) => findBookById(parent.bookId),

    // raw.userId → full User object
    user: (parent: RawReview) => findUserById(parent.userId),
  },
};
