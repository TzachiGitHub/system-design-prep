// ─────────────────────────────────────────────────────────────────────────────
// index.ts — Apollo Server Bootstrap
//
// Sets up:
//  • Apollo Server v4 (handles queries + mutations over HTTP)
//  • Express (HTTP server)
//  • graphql-ws (WebSocket server for subscriptions)
//
// Why Express? Apollo Server v4 is transport-agnostic. We bring our own HTTP
// server so we can add the WebSocket server on the same port.
//
// Ports:
//  • HTTP:      http://localhost:4000/graphql  (queries + mutations)
//  • WebSocket: ws://localhost:4000/graphql    (subscriptions)
//  • Sandbox:   http://localhost:4000/         (Apollo Sandbox dev UI)
// ─────────────────────────────────────────────────────────────────────────────

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './resolvers/index.js';
import { buildContext } from './context.js';

const PORT = 4000;

async function startServer() {
  const app = express();
  const httpServer = http.createServer(app);

  // Build the executable schema (typeDefs + resolvers merged)
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // WebSocket server for subscriptions — runs on the same port as HTTP
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  // graphql-ws handles the WebSocket protocol for GraphQL subscriptions
  const serverCleanup = useServer(
    {
      schema,
      context: () => buildContext(),
    },
    wsServer
  );

  // Apollo Server handles HTTP queries and mutations
  const server = new ApolloServer({
    schema,
    plugins: [
      // Gracefully shut down the HTTP server on process exit
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Gracefully shut down the WebSocket server on process exit
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  // Using 'as any' here to avoid a known type mismatch between
  // @apollo/server's bundled @types/express and the project's @types/express.
  // This is a dev-tooling issue only and does not affect runtime behavior.
  app.use(
    '/graphql',
    cors({ origin: ['http://localhost:5173', 'http://localhost:4000'] }),
    express.json(),
    expressMiddleware(server, {
      context: async () => buildContext(),
    }) as any // eslint-disable-line @typescript-eslint/no-explicit-any
  );

  await new Promise<void>(resolve => httpServer.listen({ port: PORT }, resolve));

  console.log(`
GraphQL server ready!

HTTP    -> http://localhost:${PORT}/graphql  (queries + mutations)
WS      -> ws://localhost:${PORT}/graphql    (subscriptions)
Sandbox -> http://localhost:${PORT}/         (Apollo Sandbox explorer)

Open the Sandbox and run your first query:
  query {
    books {
      id
      title
      genre
      author { name }
    }
  }
`);
}

startServer().catch(console.error);
