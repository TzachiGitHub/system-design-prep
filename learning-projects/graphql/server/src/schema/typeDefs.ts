// ─────────────────────────────────────────────────────────────────────────────
// typeDefs.ts — The GraphQL Schema (SDL)
//
// This file is the SOURCE OF TRUTH for the entire project. Both the server
// and the client derive their types from this schema.
//
// Key SDL concepts demonstrated here:
//  • scalar  — custom primitive types (beyond String, Int, Float, Boolean, ID)
//  • enum    — a fixed set of string values, type-safe
//  • type    — object types (the shape of data you can query)
//  • input   — separate types for write operations (mutations)
//  • Query   — the read API (maps to GET in REST)
//  • Mutation — the write API (maps to POST/PUT/DELETE in REST)
//  • Subscription — real-time push via WebSocket
//
// The `!` suffix means "non-null". `[Book!]!` = a non-null list of non-null Books.
// ─────────────────────────────────────────────────────────────────────────────

export const typeDefs = `#graphql

  # ── Custom Scalar ──────────────────────────────────────────────────────────
  # GraphQL has 5 built-in scalars: String, Int, Float, Boolean, ID.
  # You can define your own. DateTime serializes as an ISO 8601 string.
  scalar DateTime

  # ── Enums ──────────────────────────────────────────────────────────────────
  # Enums are first-class in GraphQL. The client can only pass one of these
  # values — no "magic strings" that break at runtime.
  enum Genre {
    FICTION
    NON_FICTION
    SCIENCE
    HISTORY
    BIOGRAPHY
    FANTASY
    MYSTERY
  }

  enum SortOrder {
    ASC
    DESC
  }

  # ── Object Types ───────────────────────────────────────────────────────────
  # These are the shapes of data you can query. Notice that types can
  # reference each other (Author has books, Book has an author) — GraphQL
  # resolves these lazily, only when the client asks for them.

  type Author {
    id: ID!
    name: String!
    bio: String          # nullable — some authors have no bio
    books: [Book!]!      # relationship: Author → many Books
    bookCount: Int!      # computed field — no DB column, derived in resolver
  }

  type Book {
    id: ID!
    title: String!
    publishedYear: Int!
    genre: Genre!
    author: Author!       # relationship: Book → one Author
    reviews: [Review!]!   # relationship: Book → many Reviews
    averageRating: Float   # nullable — null if the book has no reviews yet
    reviewCount: Int!
  }

  type User {
    id: ID!
    username: String!
    joinedAt: DateTime!
    reviews: [Review!]!
    reviewCount: Int!
  }

  type Review {
    id: ID!
    rating: Int!           # validated in resolver: must be 1–5
    body: String!
    createdAt: DateTime!
    book: Book!            # back-reference: Review → Book
    user: User!            # back-reference: Review → User
  }

  # ── Input Types ────────────────────────────────────────────────────────────
  # Inputs are separate from output types. You can't use 'Book' as an argument
  # type — you need a dedicated 'AddBookInput'. This enforces a clean
  # read/write boundary and lets you omit fields like 'id' (generated server-side).

  input AddBookInput {
    title: String!
    authorId: ID!
    publishedYear: Int!
    genre: Genre!
  }

  input AddReviewInput {
    bookId: ID!
    userId: ID!
    rating: Int!
    body: String!
  }

  input BooksFilterInput {
    genre: Genre
    authorId: ID
    minRating: Float
  }

  input BooksSortInput {
    field: String!    # "title" | "publishedYear" | "averageRating"
    order: SortOrder!
  }

  # ── Query Type ─────────────────────────────────────────────────────────────
  # Every field on Query is an "entry point" — equivalent to a REST endpoint.
  # Unlike REST, ALL queries go to the same HTTP endpoint (POST /graphql).
  # The client specifies WHICH query and WHICH fields it wants in the request body.

  type Query {
    # Single entity lookups — return null if not found (nullable return type)
    book(id: ID!): Book
    author(id: ID!): Author
    user(id: ID!): User

    # Collection queries with optional filtering and sorting
    # Notice: arguments can be on ANY field, not just root queries
    books(filter: BooksFilterInput, sort: BooksSortInput): [Book!]!
    authors: [Author!]!
    users: [User!]!

    # Cross-entity computed query — top books by average rating
    topRatedBooks(limit: Int = 5): [Book!]!

    # Convenience query — books by a specific author with optional sort
    booksByAuthor(authorId: ID!, sort: BooksSortInput): [Book!]!
  }

  # ── Mutation Type ──────────────────────────────────────────────────────────
  # Mutations change server-side state. Crucially, mutations return the
  # MODIFIED data — not void — so the client can update its cache in one
  # roundtrip without a follow-up query.

  type Mutation {
    addBook(input: AddBookInput!): Book!

    addReview(input: AddReviewInput!): Review!

    # deleteReview returns the PARENT BOOK (not void, not the deleted review).
    # This is a deliberate pattern: the client receives the updated book
    # (with the review removed) so Apollo Client can update its cache automatically.
    deleteReview(id: ID!): Book!
  }

  # ── Subscription Type ──────────────────────────────────────────────────────
  # Subscriptions use WebSocket instead of HTTP. The schema syntax is identical
  # to Query/Mutation — that's the beauty of SDL. The transport is different;
  # the type system is the same.

  type Subscription {
    # Fires when a review is added to a SPECIFIC book.
    # The 'bookId' argument filters events — clients only receive reviews
    # for the book they're watching.
    reviewAdded(bookId: ID!): Review!

    # Fires whenever any new book is added to the catalog.
    bookAdded: Book!
  }
`;
