// ─────────────────────────────────────────────────────────────────────────────
// Subscription.ts — Subscription Resolvers + PubSub
//
// Subscriptions are real-time: instead of the client polling the server,
// the SERVER pushes data to the client when something changes.
//
// How it works:
//  1. Client sends a subscription operation (over WebSocket, not HTTP)
//  2. Server registers the subscription and waits
//  3. A mutation fires → calls pubsub.publish(EVENT, payload)
//  4. PubSub delivers the payload to all subscribed clients
//  5. The subscription resolver's 'resolve' function shapes the payload
//     for each subscriber
//
// PubSub implementations:
//  • graphql-subscriptions (used here): in-memory, single-process only
//  • Redis PubSub: needed for multi-instance deployments
//  • Kafka, RabbitMQ, etc.: for high-throughput production use
// ─────────────────────────────────────────────────────────────────────────────

import { PubSub, withFilter } from 'graphql-subscriptions';
import type { RawReview, RawBook } from '../data/store.js';

// The event bus. In production, swap this for a Redis-backed PubSub.
export const pubsub = new PubSub();

// Event name constants — use these in Mutation.ts to publish events.
// String constants prevent typos across files.
export const EVENTS = {
  REVIEW_ADDED: 'REVIEW_ADDED',
  BOOK_ADDED:   'BOOK_ADDED',
} as const;

export const SubscriptionResolvers = {
  Subscription: {
    reviewAdded: {
      // subscribe returns an AsyncIterator that yields events.
      // withFilter wraps it to only deliver events to clients that subscribed
      // to the specific bookId — prevents a subscriber for book-1 from
      // receiving reviews for book-2.
      subscribe: withFilter(
        () => pubsub.asyncIterator<{ reviewAdded: RawReview }>([EVENTS.REVIEW_ADDED]),
        (payload: { reviewAdded: RawReview }, variables: { bookId: string }) => {
          return payload.reviewAdded.bookId === variables.bookId;
        }
      ),

      // The resolve function shapes the event payload into the field value.
      // Without this, the entire payload object would be returned.
      resolve: (payload: { reviewAdded: RawReview }) => payload.reviewAdded,
    },

    bookAdded: {
      // No filter needed — all subscribers want all new books.
      subscribe: () => pubsub.asyncIterator<{ bookAdded: RawBook }>([EVENTS.BOOK_ADDED]),
      resolve: (payload: { bookAdded: RawBook }) => payload.bookAdded,
    },
  },
};
