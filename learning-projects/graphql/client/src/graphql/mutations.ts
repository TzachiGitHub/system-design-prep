// ─────────────────────────────────────────────────────────────────────────────
// mutations.ts — GraphQL Mutation Documents
//
// Key mutation design patterns:
//
//  • Mutations return data — not void.
//  • The returned fields are selected carefully to let Apollo Client
//    update its InMemoryCache without a follow-up refetch.
//  • Apollo identifies cache entries by __typename + id.
//    If a mutation returns Book { id: "book-1", ... }, Apollo automatically
//    updates the cached "Book:book-1" entry and re-renders any component
//    using that data.
// ─────────────────────────────────────────────────────────────────────────────

import { gql } from '@apollo/client';

// After adding a book, we select enough fields for Apollo to:
//  1. Create a new "Book:book-id" entry in the cache
//  2. The books list query will re-render because the cache root changes
export const ADD_BOOK = gql`
  mutation AddBook($input: AddBookInput!) {
    addBook(input: $input) {
      id
      title
      genre
      publishedYear
      averageRating
      reviewCount
      author {
        id
        name
      }
    }
  }
`;

// After adding a review:
//  - We select the review fields (creates "Review:review-id" in cache)
//  - We select book.averageRating and book.reviewCount so the cached
//    book entry updates its computed fields automatically
export const ADD_REVIEW = gql`
  mutation AddReview($input: AddReviewInput!) {
    addReview(input: $input) {
      id
      rating
      body
      createdAt
      user {
        id
        username
      }
      book {
        id
        averageRating
        reviewCount
      }
    }
  }
`;

// deleteReview returns the parent Book with its updated reviews list.
// Apollo uses Book.id to find the cached book and update its reviews.
// The UI re-renders without any manual refetch.
export const DELETE_REVIEW = gql`
  mutation DeleteReview($id: ID!) {
    deleteReview(id: $id) {
      id
      averageRating
      reviewCount
      reviews {
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
  }
`;
