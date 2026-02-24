// ─────────────────────────────────────────────────────────────────────────────
// context.ts — Apollo Context
//
// The context object is built once per request and passed to EVERY resolver
// as the third argument: (parent, args, CONTEXT, info).
//
// Context is how you share request-scoped state across resolvers without
// passing it through arguments:
//  • Authentication: who is making this request?
//  • DataLoaders: per-request batching (not implemented here, but noted)
//  • Database connections: a db client scoped to the request transaction
//
// Here we simulate a "logged-in" user by always using user-1. In a real app
// you'd parse a JWT from the Authorization header.
// ─────────────────────────────────────────────────────────────────────────────

import { findUserById, type RawUser } from './data/store.js';

export type Context = {
  currentUser: RawUser | null;
};

export function buildContext(): Context {
  // Simulated auth: in a real app you'd check req.headers.authorization
  // and decode a JWT to find the user ID.
  const currentUser = findUserById('user-1');
  return { currentUser };
}
