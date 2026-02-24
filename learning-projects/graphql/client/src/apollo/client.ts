// ─────────────────────────────────────────────────────────────────────────────
// client.ts — Apollo Client Configuration
//
// Apollo Client is the GraphQL client for React. It handles:
//  1. Sending queries/mutations over HTTP (POST /graphql)
//  2. Sending subscriptions over WebSocket (ws://localhost:4000/graphql)
//  3. Caching responses in InMemoryCache
//  4. Automatically updating the UI when the cache changes
//
// ── The InMemoryCache ───────────────────────────────────────────────────────
// The cache normalizes data by __typename + id.
// Example: when a query returns Book { id: "book-1", title: "..." },
// the cache stores it as "Book:book-1": { title: "..." }.
//
// When a mutation returns the same Book { id: "book-1", ... } with updated
// data, the cache automatically updates "Book:book-1" — and every React
// component using data from that cache key re-renders.
//
// This is why the UI updates without a manual refetch after a mutation.
//
// ── Split Link ──────────────────────────────────────────────────────────────
// Apollo needs different transports for different operations:
//  • queries/mutations → HTTP (ApolloLink with HttpLink)
//  • subscriptions     → WebSocket (GraphQLWsLink)
//
// The "split link" routes operations to the correct transport.
// ─────────────────────────────────────────────────────────────────────────────

import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

const SERVER_URL = 'http://localhost:4000/graphql';
const WS_URL    = 'ws://localhost:4000/graphql';

// HTTP link — used for queries and mutations
const httpLink = new HttpLink({ uri: SERVER_URL });

// WebSocket link — used for subscriptions
const wsLink = new GraphQLWsLink(
  createClient({ url: WS_URL })
);

// Route operations to the correct transport based on operation type
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,   // subscriptions
  httpLink  // queries + mutations
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
