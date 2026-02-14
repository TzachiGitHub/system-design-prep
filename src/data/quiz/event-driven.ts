import type { QuizQuestion } from '../../types';

export const eventDrivenQuiz: QuizQuestion[] = [
  {
    question: "What is the fundamental principle of event-driven architecture?",
    options: [
      "Services communicate by directly calling each other's APIs",
      "Components communicate by producing and consuming events, reacting to state changes asynchronously",
      "All services share a single database that triggers events",
      "Events are only used for logging and monitoring"
    ],
    correctIndex: 1,
    explanation: "Event-driven architecture (EDA) is a design pattern where components communicate through events—notifications that something has happened. Producers emit events without knowing who will consume them, and consumers react to events they're interested in. This creates loose coupling: producers and consumers can evolve independently, and new consumers can be added without modifying producers. Unlike direct API calls (request/response), EDA is inherently asynchronous—the producer doesn't wait for a response. This enables higher resilience, better scalability, and natural support for workflows that span multiple services. Real-world examples include order processing pipelines, IoT telemetry systems, and real-time analytics."
  },
  {
    question: "What is event sourcing?",
    options: [
      "Sourcing events from third-party APIs",
      "Storing the state of an entity as a sequence of immutable events rather than the current state",
      "Using source control to track event changes",
      "A technique for finding the source of errors in event logs"
    ],
    correctIndex: 1,
    explanation: "Event sourcing stores every state change as an immutable event in an append-only log (event store), rather than storing just the current state. To get the current state of an entity, you replay all its events from the beginning. For example, instead of storing 'account balance = $500,' you store 'deposited $1000,' 'withdrew $300,' 'deposited $100,' 'withdrew $300.' This provides a complete audit trail, enables temporal queries ('what was the balance on Tuesday?'), and allows rebuilding state from scratch. The trade-off is complexity: reading current state requires replaying events (solved by snapshots), and the event schema must be carefully managed since events are immutable. Event sourcing is the foundation of CQRS in many systems."
  },
];
