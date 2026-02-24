# Learning Projects

Standalone, full-stack learning projects. Each one teaches a specific technology through a real, runnable app — not just slides.

These live separately from the main SPA (`../src/`) and never intersect with it. Each project has its own `server/` and `client/`, runs on its own ports, and can be started independently.

---

## Projects

| Project | What you'll learn | Server port | Client port |
|---|---|---|---|
| [GraphQL](./graphql/) | Schema, resolvers, queries, mutations, subscriptions, Apollo Client | 4000 | 5173 |

---

## How to Use

Each project has its own `README.md` with a structured teaching guide. Start there, then follow the lesson pages in order in the app.

```bash
# Example: start the GraphQL project
cd graphql/server && npm install && npm run dev   # Terminal 1
cd graphql/client && npm install && npm run dev   # Terminal 2
```

---

## Adding New Projects

Create a new directory here (`redis/`, `typescript/`, `docker/`, etc.) following the same pattern:

```
learning-projects/<topic>/
├── README.md        ← teaching guide
├── server/          ← backend (if needed)
└── client/          ← frontend
```
