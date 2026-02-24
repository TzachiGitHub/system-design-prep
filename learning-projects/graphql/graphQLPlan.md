# GraphQL Learning Project Plan

## Context
A lean, hands-on project that teaches GraphQL from scratch: what it is, when to use it, and how it works. It lives here in `learning-projects/graphql/` — completely standalone from the main SPA — so future learning projects can be added alongside it without conflict.

---

## Domain: Book Club API

Books → Authors (many-to-one) → Reviews (one-to-many) → Users. A single detail page needs data from 4 entity types. REST needs 3-4 roundtrips. GraphQL does it in one typed query. That contrast is the core lesson.

---

## What You'll Learn (ordered, foundational to advanced)

| Concept | Where you'll see it |
|---|---|
| Schema Definition Language (SDL) | `server/src/schema/typeDefs.ts` |
| Queries + field selection (no overfetching) | `BooksPage` |
| Nested data in one request (no underfetching) | `BookDetailPage` |
| Resolver chain: `(parent, args, ctx, info)` | `server/src/resolvers/Book.ts` |
| Computed fields (no DB column needed) | `averageRating`, `bookCount` |
| Arguments + filter/sort on collections | `books(filter: …, sort: …)` |
| Input types vs output types | `AddReviewInput`, `AddBookInput` |
| Mutations + Apollo cache auto-update | `AddBookPage`, `AddReviewForm` |
| GraphQL error handling (partial data) | Rating validation → `GraphQLError` |
| N+1 problem awareness | `Author.books` resolver + comment |
| Subscriptions + WebSocket | `LiveFeedPage` — live review stream |
| Custom scalars | `DateTime` |
| Apollo InMemoryCache normalization | `client/src/apollo/client.ts` |
| When NOT to use GraphQL | README Part 7 |

---

## GraphQL Schema

```graphql
scalar DateTime

enum Genre { FICTION NON_FICTION SCIENCE HISTORY BIOGRAPHY FANTASY MYSTERY }
enum SortOrder { ASC DESC }

type Author  { id: ID!  name: String!  bio: String  books: [Book!]!  bookCount: Int! }
type Book    { id: ID!  title: String!  publishedYear: Int!  genre: Genre!  author: Author!  reviews: [Review!]!  averageRating: Float  reviewCount: Int! }
type User    { id: ID!  username: String!  joinedAt: DateTime!  reviews: [Review!]!  reviewCount: Int! }
type Review  { id: ID!  rating: Int!  body: String!  createdAt: DateTime!  book: Book!  user: User! }

input AddBookInput   { title: String!  authorId: ID!  publishedYear: Int!  genre: Genre! }
input AddReviewInput { bookId: ID!  userId: ID!  rating: Int!  body: String! }
input BooksFilterInput { genre: Genre  authorId: ID  minRating: Float }
input BooksSortInput   { field: String!  order: SortOrder! }

type Query {
  book(id: ID!): Book
  author(id: ID!): Author
  books(filter: BooksFilterInput, sort: BooksSortInput): [Book!]!
  authors: [Author!]!
  topRatedBooks(limit: Int = 5): [Book!]!
}

type Mutation {
  addBook(input: AddBookInput!): Book!
  addReview(input: AddReviewInput!): Review!
  deleteReview(id: ID!): Book!
}

type Subscription {
  reviewAdded(bookId: ID!): Review!
  bookAdded: Book!
}
```

---

## Project Structure

```
learning-projects/graphql/
├── graphQLPlan.md
├── server/                            # Apollo Server v4 + Node.js + TypeScript (port 4000)
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts                   # Server bootstrap (Apollo + Express + WS)
│       ├── schema/typeDefs.ts         # SDL schema (source of truth)
│       ├── data/
│       │   ├── seed.ts                # 5 authors, 12 books, 5 users, 25 reviews
│       │   └── store.ts               # In-memory arrays + helpers
│       ├── resolvers/
│       │   ├── index.ts               # Merges all resolver maps
│       │   ├── Query.ts
│       │   ├── Mutation.ts
│       │   ├── Subscription.ts
│       │   ├── Book.ts                # The resolver chain lesson
│       │   ├── Author.ts              # N+1 lesson here
│       │   ├── Review.ts
│       │   └── User.ts
│       ├── scalars/DateTime.ts
│       └── context.ts
│
└── client/                            # React + Vite + TypeScript + Apollo Client (port 5173)
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── main.tsx
        ├── apollo/client.ts           # HTTP+WS split link, InMemoryCache
        ├── graphql/
        │   ├── queries.ts
        │   ├── mutations.ts
        │   └── subscriptions.ts
        ├── pages/
        │   ├── BooksPage.tsx          # Lesson 1: field selection
        │   ├── BookDetailPage.tsx     # Lesson 2: nested data
        │   ├── AuthorPage.tsx         # Lesson 3: N+1 demo
        │   ├── AddBookPage.tsx        # Lesson 4: mutations
        │   └── LiveFeedPage.tsx       # Lesson 5: subscriptions
        └── components/
            ├── RestComparison.tsx     # Collapsible REST vs GraphQL panel
            └── QueryInspector.tsx     # Shows raw query + response
```

---

## Tech Stack

| Layer | Choice |
|---|---|
| Server | Apollo Server v4 + Express |
| Language | TypeScript (both sides) |
| Data | In-memory arrays (no DB) |
| Client | React + Vite + Apollo Client |
| Styling | Tailwind v4 (`@tailwindcss/vite`) |
| Real-time | `graphql-subscriptions` PubSub + `graphql-ws` |

---

## To-Do List

### Phase 0 — Structure
- [x] Create `learning-projects/` directory
- [x] Write `learning-projects/README.md`
- [x] Write `graphQLPlan.md`

### Phase 1 — Server
- [ ] `server/package.json` + `tsconfig.json`
- [ ] `server/src/schema/typeDefs.ts`
- [ ] `server/src/data/seed.ts`
- [ ] `server/src/data/store.ts`
- [ ] `server/src/context.ts`
- [ ] `server/src/scalars/DateTime.ts`
- [ ] `server/src/resolvers/Query.ts`
- [ ] `server/src/resolvers/Book.ts`
- [ ] `server/src/resolvers/Author.ts`
- [ ] `server/src/resolvers/Review.ts`
- [ ] `server/src/resolvers/User.ts`
- [ ] `server/src/resolvers/Mutation.ts`
- [ ] `server/src/resolvers/Subscription.ts`
- [ ] `server/src/resolvers/index.ts`
- [ ] `server/src/index.ts`

### Phase 2 — Client
- [ ] Scaffold with Vite + React + Tailwind v4
- [ ] `client/src/apollo/client.ts`
- [ ] `client/src/main.tsx`
- [ ] `client/src/graphql/queries.ts`
- [ ] `client/src/graphql/mutations.ts`
- [ ] `client/src/graphql/subscriptions.ts`

### Phase 3 — Pages
- [ ] `BooksPage.tsx`
- [ ] `BookDetailPage.tsx`
- [ ] `AuthorPage.tsx`
- [ ] `AddBookPage.tsx`
- [ ] `LiveFeedPage.tsx`

### Phase 4 — Components
- [ ] `RestComparison.tsx`
- [ ] `QueryInspector.tsx`
- [ ] `AddReviewForm` in `BookDetailPage`

### Phase 5 — README
- [ ] Full teaching guide (8 parts + exercises)

---

## How to Run

```bash
# Terminal 1 — Server
cd server && npm install && npm run dev
# Apollo Sandbox: http://localhost:4000

# Terminal 2 — Client
cd client && npm install && npm run dev
# App: http://localhost:5173
```
