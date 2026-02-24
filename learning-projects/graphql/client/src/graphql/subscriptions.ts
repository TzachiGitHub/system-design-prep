// ─────────────────────────────────────────────────────────────────────────────
// subscriptions.ts — GraphQL Subscription Documents
//
// Subscriptions use WebSocket (not HTTP). The server PUSHES data to the client
// when an event occurs. The client does not poll — it just listens.
//
// In code, useSubscription() works identically to useQuery():
//   const { data } = useSubscription(ON_REVIEW_ADDED, { variables: { bookId } });
// Apollo handles the WebSocket connection transparently.
// ─────────────────────────────────────────────────────────────────────────────

import { gql } from '@apollo/client';

// Fires when a review is added to the subscribed book.
// The bookId variable filters events — only reviews for THIS book are received.
export const ON_REVIEW_ADDED = gql`
  subscription OnReviewAdded($bookId: ID!) {
    reviewAdded(bookId: $bookId) {
      id
      rating
      body
      createdAt
      user {
        id
        username
      }
    }
  }
`;

// Fires when any new book is added to the catalog.
export const ON_BOOK_ADDED = gql`
  subscription OnBookAdded {
    bookAdded {
      id
      title
      genre
      publishedYear
      averageRating
      author {
        id
        name
      }
    }
  }
`;
