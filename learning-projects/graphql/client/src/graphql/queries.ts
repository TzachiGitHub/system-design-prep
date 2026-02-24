// ─────────────────────────────────────────────────────────────────────────────
// queries.ts — GraphQL Query Documents
//
// All query documents are centralized here using the `gql` tag.
// gql parses the query string into an AST at compile time.
//
// In larger apps you'd co-locate queries with their components, but having
// them here makes it easy to see the full query surface at a glance.
//
// Each query is annotated to explain WHAT GraphQL concept it demonstrates.
// ─────────────────────────────────────────────────────────────────────────────

import { gql } from '@apollo/client';

// ── Lesson 1: Field Selection (no overfetching) ───────────────────────────
// We ask for exactly the fields we need. The server returns ONLY those fields.
// A REST GET /books endpoint would return ALL book fields regardless.
//
// Try removing 'genre' and re-running — the network response shrinks.
// Try adding 'author { name }' — the server resolves Book.author for each book.
export const GET_ALL_BOOKS = gql`
  query GetAllBooks {
    books {
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

// ── Lesson 2: Nested Data + Variables (no underfetching) ─────────────────
// One query, four entity types (Book → Author → Reviews → Users).
// Without GraphQL: GET /books/:id, GET /authors/:id, GET /books/:id/reviews,
// GET /users/:id (per review) = 3+ roundtrips.
// With GraphQL: 1 POST, complete data in one response.
//
// $id is a variable — the client passes { id: "book-1" } at query time.
export const GET_BOOK_DETAIL = gql`
  query GetBookDetail($id: ID!) {
    book(id: $id) {
      id
      title
      publishedYear
      genre
      averageRating
      reviewCount
      author {
        id
        name
        bio
        bookCount
      }
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

// ── Lesson 3: Author + Their Books (Circular Reference) ──────────────────
// Author → [Book] → each Book.author points back to Author.
// GraphQL handles this: resolution depth is bounded by the query shape.
export const GET_AUTHOR_DETAIL = gql`
  query GetAuthorDetail($id: ID!) {
    author(id: $id) {
      id
      name
      bio
      bookCount
      books {
        id
        title
        genre
        publishedYear
        averageRating
        reviewCount
      }
    }
  }
`;

// ── Filtered + Sorted Query (demonstrates field arguments) ───────────────
export const GET_FILTERED_BOOKS = gql`
  query GetFilteredBooks($filter: BooksFilterInput, $sort: BooksSortInput) {
    books(filter: $filter, sort: $sort) {
      id
      title
      genre
      averageRating
      reviewCount
      author {
        id
        name
      }
    }
  }
`;

// ── Lesson 5: Dashboard — Multiple Root Fields in One Request ─────────────
// One HTTP POST, two independent data trees returned in one response.
// REST: two separate GET requests.
// GraphQL: one request, parallel resolution on the server.
export const GET_DASHBOARD = gql`
  query GetDashboard {
    topRatedBooks(limit: 5) {
      id
      title
      averageRating
      reviewCount
      genre
      author {
        id
        name
      }
    }
    authors {
      id
      name
      bookCount
    }
  }
`;

export const GET_ALL_AUTHORS = gql`
  query GetAllAuthors {
    authors {
      id
      name
      bio
      bookCount
    }
  }
`;

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      username
      joinedAt
      reviewCount
    }
  }
`;
