import type { RoadmapEdge } from '../types';

export const roadmapEdges: RoadmapEdge[] = [
  // Fundamentals → Building Blocks
  { from: 'cap-theorem', to: 'databases' },
  { from: 'cap-theorem', to: 'consistency-patterns' },
  { from: 'acid-base', to: 'databases' },
  { from: 'networking-basics', to: 'load-balancers' },
  { from: 'networking-basics', to: 'cdn' },
  { from: 'scalability', to: 'load-balancers' },
  { from: 'scalability', to: 'consistent-hashing' },
  { from: 'latency-throughput', to: 'caching' },
  { from: 'latency-throughput', to: 'cdn' },

  // Building Blocks → Patterns
  { from: 'load-balancers', to: 'api-gateway' },
  { from: 'databases', to: 'cqrs' },
  { from: 'databases', to: 'consistency-patterns' },
  { from: 'caching', to: 'rate-limiting' },
  { from: 'message-queues', to: 'event-driven' },
  { from: 'message-queues', to: 'microservices' },

  // Patterns → Problems
  { from: 'microservices', to: 'design-chat-system' },
  { from: 'event-driven', to: 'design-newsfeed' },
  { from: 'cqrs', to: 'design-newsfeed' },
  { from: 'rate-limiting', to: 'design-rate-limiter' },
  { from: 'consistency-patterns', to: 'design-url-shortener' },
  { from: 'api-gateway', to: 'design-rate-limiter' },

  // Cross-links within Building Blocks
  { from: 'databases', to: 'caching' },
  { from: 'consistent-hashing', to: 'databases' },

  // Cross-links to Problems
  { from: 'caching', to: 'design-url-shortener' },
  { from: 'databases', to: 'design-chat-system' },
  { from: 'message-queues', to: 'design-chat-system' },
  { from: 'caching', to: 'design-newsfeed' },
];
