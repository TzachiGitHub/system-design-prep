// ─────────────────────────────────────────────────────────────────────────────
// User.ts — User Type Resolvers
// ─────────────────────────────────────────────────────────────────────────────

import { findReviewsByUserId, type RawUser } from '../data/store.js';

export const UserResolvers = {
  User: {
    reviews: (parent: RawUser) => findReviewsByUserId(parent.id),

    reviewCount: (parent: RawUser) => findReviewsByUserId(parent.id).length,
  },
};
