// ─────────────────────────────────────────────────────────────────────────────
// resolvers/index.ts — Merge All Resolver Maps
//
// Apollo Server expects a single resolver object. We split resolvers across
// files for organization, then merge them here.
// ─────────────────────────────────────────────────────────────────────────────

import { DateTimeScalar } from '../scalars/DateTime.js';
import { QueryResolvers } from './Query.js';
import { MutationResolvers } from './Mutation.js';
import { SubscriptionResolvers } from './Subscription.js';
import { BookResolvers } from './Book.js';
import { AuthorResolvers } from './Author.js';
import { ReviewResolvers } from './Review.js';
import { UserResolvers } from './User.js';

export const resolvers = {
  // Custom scalar resolver — must match the scalar name in typeDefs
  DateTime: DateTimeScalar,

  // Spread all resolver maps
  ...QueryResolvers,
  ...MutationResolvers,
  ...SubscriptionResolvers,
  ...BookResolvers,
  ...AuthorResolvers,
  ...ReviewResolvers,
  ...UserResolvers,
};
