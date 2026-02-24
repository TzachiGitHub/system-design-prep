# GraphQL Learning Project — Bookclub API

A lean, full-stack project that teaches GraphQL through a real, runnable app. You'll build understanding by reading annotated code and running queries — not by reading slides.

**Domain:** Books → Authors → Reviews → Users
**Server:** Apollo Server v4 + TypeScript (port 4000)
**Client:** React + Apollo Client + Vite (port 5173)

---

## Setup (< 5 minutes)

```bash
# Terminal 1 — Server
cd server && npm install && npm run dev

# Terminal 2 — Client
cd client && npm install && npm run dev
```

Open **http://localhost:5173** → app with 5 lesson pages
Open **http://localhost:4000** → Apollo Sandbox (interactive query explorer)

---

## Part 1: What IS GraphQL?

GraphQL is three things:
1. **A query language** — clients describe the shape of data they want
2. **A type system** — the schema defines every type, field, and relationship
3. **A runtime** — the server resolves queries by executing resolver functions

GraphQL is NOT:
- A database
- A REST replacement in all cases
- A specific library (it's a specification — Apollo, Strawberry, etc. are implementations)

**The schema is the contract.** Read `server/src/schema/typeDefs.ts` first — everything else in the project derives from it.

---

## Part 2: The Resolver Chain

This is the mental model that changes everything.

When a client sends:
```graphql
query {
  books {         # → calls Query.books resolver
    title         # → default resolver (reads book.title)
    author {      # → calls Book.author resolver
      name        # → default resolver (reads author.name)
      books {     # → calls Author.books resolver
        title     # → default resolver (reads book.title)
      }
    }
  }
}
```

The resolver chain is **lazy** — resolvers only execute for fields the client actually requested.

```
Query.books ─────────────→ [RawBook, RawBook, ...]
                               │
                           Book.author ──────────→ RawAuthor
                               │                      │
                           Book.reviews           Author.books ──→ [RawBook, ...]
                               │
                           Review.user ──────────→ RawUser
```

**Read `server/src/resolvers/Book.ts`** — it's the most important file in the project. Every line is annotated.

---

## Part 3: Overfetching & Underfetching (Why GraphQL Exists)

REST has two failure modes:

**Overfetching:** `GET /books` returns 15 fields per book. You needed 4.
→ Wasted bandwidth, especially on mobile.

**Underfetching:** `GET /books` doesn't include `author.name` — only `authorId`.
→ You must make a second request: `GET /authors/:authorId`.
→ Or you build a custom "expanded" endpoint that quickly becomes unmaintainable.

GraphQL eliminates both:
```graphql
query {
  books {
    title          # ← exactly 4 fields
    genre
    publishedYear
    author { name }  # ← author name included, no second request
  }
}
```

**Run this in your browser:** go to BooksPage, open the Network tab, and look at the POST request body and response. Compare the response size to a typical REST `/books` response.

---

## Part 4: Mutations & Apollo Cache

Mutations work like queries — they return typed data.

```graphql
mutation AddReview($input: AddReviewInput!) {
  addReview(input: $input) {
    id
    rating
    book {
      id
      averageRating   # ← updated value
      reviewCount     # ← updated value
    }
  }
}
```

Why does the mutation return `book.averageRating`? Because **Apollo Client's InMemoryCache normalizes by `__typename + id`**.

When the mutation returns `Book { id: "book-1", averageRating: 4.6 }`, Apollo:
1. Finds the cached entry `"Book:book-1"`
2. Updates `averageRating` to `4.6`
3. Re-renders every component that uses `Book:book-1`

**Without writing any code**, the BookDetailPage's rating updates when you add a review. Try it.

---

## Part 5: The N+1 Problem

Open `server/src/resolvers/Author.ts`. The `books` resolver does:
```typescript
books: (parent: RawAuthor) => findBooksByAuthorId(parent.id)
```

When the client queries:
```graphql
{ authors { books { title } } }
```

The resolver chain runs:
1. `Query.authors` → returns 5 authors
2. `Author.books` → runs **5 times** (once per author)
3. Each call scans the entire books array

With 5 authors: 5 scans. With 500 authors: 500 scans. With a real database: 500 SQL queries.

**The fix: DataLoader**
DataLoader batches the 500 resolver calls into one query:
```sql
SELECT * FROM books WHERE authorId IN ('author-1', 'author-2', ..., 'author-500')
```

DataLoader is not implemented here — it would obscure the core lessons. But knowing WHY it exists is the lesson. Search "DataLoader graphql" to go deeper.

---

## Part 6: Subscriptions

Subscriptions use **WebSocket** (`ws://`) instead of HTTP. The server pushes data to the client when something happens.

```graphql
subscription OnReviewAdded($bookId: ID!) {
  reviewAdded(bookId: $bookId) {
    id rating body
    user { username }
  }
}
```

In React, `useSubscription` works like `useQuery`:
```typescript
const { data } = useSubscription(ON_REVIEW_ADDED, {
  variables: { bookId: 'book-1' },
  onData: ({ data }) => setReviews(prev => [data.data.reviewAdded, ...prev]),
});
```

The `withFilter` helper (in `server/src/resolvers/Subscription.ts`) ensures clients only receive events for their subscribed book.

**Demo:** Open two browser tabs on LiveFeedPage. Select the same book. Add a review from one tab — watch it appear in the other instantly.

---

## Part 7: When NOT to Use GraphQL

GraphQL is excellent when you have:
- Multiple clients (web, mobile, third-party) with different data needs
- Deeply relational data that REST would require multiple roundtrips to fetch
- Rapid frontend iteration (clients can add fields without backend changes)
- A need for real-time (subscriptions)

Use REST instead when:
- **Simple CRUD:** a single resource with no relationships. REST is simpler.
- **File uploads:** `multipart/form-data` over REST is easier than the GraphQL file upload spec.
- **HTTP caching:** REST GET responses are cache-friendly by URL. GraphQL POST requests are not (without persisted queries).
- **Team unfamiliarity:** the tooling overhead (schema, codegen, resolvers) has a real learning curve.
- **Public APIs:** REST is more universally understood.

Rule of thumb: **GraphQL shines at the graph** — when data has meaningful relationships between entities. If your app is mostly "get list of X" and "create/update X", REST may be simpler.

---

## Part 8: Production Pointers

You've learned the fundamentals. Here's what comes next in production:

| Topic | Why it matters |
|---|---|
| **DataLoader** | Eliminates N+1; required for any real DB |
| **Persisted Queries** | Cache queries by hash instead of POST body; enables GET caching |
| **graphql-codegen** | Auto-generates TypeScript types from your schema — eliminates manual typing |
| **Schema Federation** | Split the schema across microservices (Apollo Federation) |
| **Authorization** | Per-field or per-operation auth via context + resolver guards or `@auth` directives |
| **Rate limiting** | GraphQL queries can be expensive; use depth/complexity analysis to limit |
| **Error handling** | Use `GraphQLError` with `extensions.code` for structured client errors |
| **Redis PubSub** | Replace in-memory PubSub with Redis for multi-instance subscriptions |

---

## Exercises

These build on the lessons above. Each has a hint in the relevant source file.

1. **Add a field:** Add `wordCount: Int` to the Book type in `typeDefs.ts`. Write its resolver in `Book.ts`. Return a random number 40,000–120,000. Query it in Apollo Sandbox.

2. **Write a query:** In Apollo Sandbox, write a query that fetches the top 3 rated books including the author's name and the number of reviews. Use the `topRatedBooks(limit: 3)` field.

3. **Observe cache behavior:** Add a review on the BookDetailPage. Before clicking submit, open Apollo DevTools (browser extension). After submitting, watch the cache update in real-time.

4. **Trigger the N+1 problem:** In Apollo Sandbox, run `{ authors { books { title } } }`. In the server terminal, add a `console.log('Author.books called')` to the Author resolver. Count how many times it fires.

5. **Add a filter:** Add a `minYear: Int` filter to `BooksFilterInput` in the schema. Implement it in the `Query.books` resolver. Test it from the Sandbox.

6. **Break a mutation:** Add a review with `rating: 6`. Observe the GraphQL error in the response. Note that HTTP status is still `200` — the error is in `response.errors`, not the HTTP status code.

---

## Key Files Reference

| File | What it teaches |
|---|---|
| `server/src/schema/typeDefs.ts` | SDL, enums, scalars, input types |
| `server/src/resolvers/Book.ts` | The resolver chain + N+1 explanation |
| `server/src/resolvers/Author.ts` | N+1 trap + how DataLoader would fix it |
| `server/src/resolvers/Mutation.ts` | Mutation patterns, validation, PubSub publish |
| `server/src/resolvers/Subscription.ts` | PubSub, withFilter, WebSocket |
| `client/src/apollo/client.ts` | Split link, InMemoryCache |
| `client/src/graphql/queries.ts` | All query documents with explanatory comments |
| `client/src/pages/BooksPage.tsx` | Lesson 1: useQuery, field selection |
| `client/src/pages/BookDetailPage.tsx` | Lesson 2: variables, nested data |
| `client/src/pages/AuthorPage.tsx` | Lesson 3: circular refs, N+1 |
| `client/src/pages/AddBookPage.tsx` | Lesson 4: useMutation, cache |
| `client/src/pages/LiveFeedPage.tsx` | Lesson 5: useSubscription |
