import type { QuizQuestion } from '../../types';

export const cqrsQuiz: QuizQuestion[] = [
  {
    question: "What does CQRS stand for?",
    options: ["Command Query Responsibility Segregation", "Command Queue Replication Service", "Consistent Query Read Separation", "Command Query Resource Sharing"],
    correctIndex: 0,
    explanation: "CQRS stands for Command Query Responsibility Segregation. It is a pattern that separates the read (query) and write (command) operations into different models. This separation allows each side to be optimized independently — for example, the read model can be denormalized for fast queries while the write model maintains strict consistency. Greg Young popularized this pattern, building on Bertrand Meyer's Command Query Separation (CQS) principle."
  },
  {
    question: "In CQRS, what is the primary purpose of the 'command' side?",
    options: ["To serve read-heavy dashboards", "To handle state mutations and enforce business rules", "To replicate data across regions", "To generate analytics reports"],
    correctIndex: 1,
    explanation: "The command side in CQRS is responsible for handling all write operations — creating, updating, and deleting data. It enforces business rules, validates invariants, and ensures that the domain logic is correctly applied before persisting state changes. By isolating writes, the command side can use a normalized, consistency-focused data model without worrying about read performance. This separation means you can scale and optimize the write path independently from reads."
  },
  {
    question: "What is a materialized view in the context of CQRS?",
    options: ["A database index on the write model", "A pre-computed, denormalized representation of data optimized for queries", "A temporary cache that expires after TTL", "A SQL view that runs on every query"],
    correctIndex: 1,
    explanation: "A materialized view is a pre-computed, stored result set that represents data in a query-friendly format. Unlike a regular SQL view that recalculates on every access, a materialized view persists the result and updates it when the underlying data changes. In CQRS, the read model often consists of materialized views built from events or change notifications from the write side. This allows the read side to serve queries with minimal joins and maximum throughput, at the cost of slight staleness."
  },
  {
    question: "How does event sourcing complement CQRS?",
    options: ["It replaces the need for a read model entirely", "It stores every state change as an immutable event, providing a complete audit trail that feeds projections", "It eliminates eventual consistency", "It removes the need for a message broker"],
    correctIndex: 1,
    explanation: "Event sourcing stores every change to application state as an immutable event in an append-only log, rather than storing just the current state. When combined with CQRS, events from the write side are projected into read-optimized views. This provides a complete audit trail, enables temporal queries ('what was the state at time T?'), and allows rebuilding read models from scratch by replaying events. The combination is powerful but adds complexity — you must handle event versioning, schema evolution, and eventual consistency between the write and read sides."
  },
  {
    question: "What is a projection in event sourcing + CQRS?",
    options: ["A database backup strategy", "A function that transforms a stream of events into a read-optimized data structure", "A load balancer configuration", "A write-ahead log entry"],
    correctIndex: 1,
    explanation: "A projection is a function or process that consumes events from the event store and builds a read-optimized representation (the read model). For example, an OrderSummaryProjection might listen to OrderPlaced, ItemAdded, and OrderShipped events to maintain a denormalized orders table. Projections can be rebuilt from scratch by replaying all events, making it easy to create new read models or fix bugs in existing ones. They are the bridge between the event-sourced write side and the query-optimized read side in a CQRS architecture."
  },
  {
    question: "What consistency model typically exists between the write and read sides in CQRS?",
    options: ["Strong consistency", "Eventual consistency", "Linearizable consistency", "No consistency guarantee at all"],
    correctIndex: 1,
    explanation: "In most CQRS implementations, the read model is updated asynchronously from the write model, resulting in eventual consistency. After a command is processed and an event is published, there is a propagation delay before the read model reflects the change. This means a user who writes data might not immediately see it in a query. Designers must account for this with techniques like read-your-own-writes consistency, optimistic UI updates, or polling. The trade-off is that eventual consistency enables independent scaling and optimization of each side."
  },
  {
    question: "Why might you choose separate databases for the read and write models?",
    options: ["To save on licensing costs", "To independently optimize storage engines — e.g., relational for writes, denormalized/NoSQL for reads", "Because CQRS requires different databases by definition", "To avoid needing an ORM"],
    correctIndex: 1,
    explanation: "Using separate databases allows you to pick the best storage technology for each workload. The write side might use a relational database with strong transactional guarantees, while the read side might use Elasticsearch for full-text search, Redis for low-latency lookups, or a document store for denormalized views. This polyglot persistence approach maximizes performance for each access pattern. Note that CQRS does not require separate databases — you can use different tables in the same database — but separate stores unlock the most flexibility."
  },
  {
    question: "What is the 'read-your-own-writes' problem in CQRS?",
    options: ["The write model cannot read its own state", "A user writes data but the read model hasn't caught up yet, so they don't see their change", "The read model overwrites the write model", "Events are delivered out of order"],
    correctIndex: 1,
    explanation: "Read-your-own-writes is a common UX challenge in CQRS. Because the read model updates asynchronously, a user who just submitted a command may query the read side and not see their change reflected yet. This can be confusing and feel like a bug. Solutions include: routing the user's next read to the write database temporarily, including a version token in the response so the UI waits for the read model to catch up, or using optimistic UI updates on the client side. This is one of the key trade-offs of the pattern."
  },
  {
    question: "In CQRS, what is a command handler responsible for?",
    options: ["Rendering the UI", "Receiving a command, validating it, and executing the corresponding domain logic", "Querying the read model", "Managing database migrations"],
    correctIndex: 1,
    explanation: "A command handler receives an incoming command (e.g., PlaceOrderCommand), validates its data and business rules, and orchestrates the domain logic to process it. It typically loads the relevant aggregate, invokes methods on it, and persists the resulting state changes or events. Command handlers should be idempotent where possible and should not return query data — they return success/failure or the ID of the created resource at most. This strict separation ensures the write path stays focused on correctness and consistency."
  },
  {
    question: "What is the key difference between CQS and CQRS?",
    options: ["CQS is about method-level separation; CQRS extends this to architectural separation of read and write models", "They are the same thing", "CQS is for distributed systems; CQRS is for monoliths", "CQRS does not allow queries"],
    correctIndex: 0,
    explanation: "CQS (Command Query Separation) is a principle coined by Bertrand Meyer stating that a method should either change state (command) or return data (query), but not both. CQRS takes this principle to the architectural level by using separate models, potentially separate databases, and separate services for reads and writes. While CQS is a code-level design guideline, CQRS is a system-level architectural pattern that enables independent scaling, optimization, and evolution of the read and write paths."
  },
  {
    question: "What is an aggregate in the context of CQRS and Domain-Driven Design?",
    options: ["A SQL aggregation function like SUM or COUNT", "A cluster of domain objects treated as a single unit for data changes with a root entity enforcing invariants", "A read model cache", "A message queue topic"],
    correctIndex: 1,
    explanation: "An aggregate is a DDD concept that groups related entities and value objects into a consistency boundary. The aggregate root is the only entry point for modifications, and it enforces all business invariants within the boundary. In CQRS, commands target specific aggregates, and the aggregate decides whether to accept or reject the command based on its current state. When using event sourcing, the aggregate's state is rebuilt by replaying its events, and new events are appended after successful command processing."
  },
  {
    question: "How can you rebuild a read model in an event-sourced CQRS system?",
    options: ["Restore from the latest database backup", "Replay all events from the event store through the projection logic", "Copy the write database tables", "You cannot rebuild read models once created"],
    correctIndex: 1,
    explanation: "One of the major benefits of event sourcing is that the event store serves as the single source of truth. To rebuild a read model, you simply replay all relevant events from the beginning (or a snapshot) through the projection logic, writing the results to a new read store. This is invaluable for fixing projection bugs, creating new read models for new features, or migrating to a different storage technology. The process can be done in parallel with the live system, switching over once the new model catches up to the current event stream."
  },
  {
    question: "What is the purpose of a process manager (saga) in CQRS?",
    options: ["To manage database connections", "To coordinate long-running business processes that span multiple aggregates or services", "To compress event logs", "To handle user authentication"],
    correctIndex: 1,
    explanation: "A process manager (sometimes called a saga) listens to events and coordinates multi-step business workflows that involve multiple aggregates or services. For example, an OrderFulfillmentSaga might listen for OrderPlaced, then send ReserveInventory and ChargePayment commands, handling success/failure of each step. It maintains its own state to track progress and can implement compensating actions if a step fails. In CQRS systems, sagas are essential for managing distributed transactions without using two-phase commit."
  },
  {
    question: "What problem does snapshotting solve in event sourcing?",
    options: ["It reduces the size of the event store", "It speeds up aggregate loading by storing periodic state snapshots so you don't replay all events from the beginning", "It prevents event duplication", "It enforces schema validation on events"],
    correctIndex: 1,
    explanation: "As an aggregate accumulates events over time, replaying all of them to rebuild state becomes increasingly slow. Snapshotting solves this by periodically saving the aggregate's current state as a snapshot. When loading the aggregate, the system loads the latest snapshot and only replays events that occurred after it. This dramatically reduces load time for long-lived aggregates. Snapshots are an optimization, not a replacement for events — the event log remains the authoritative source of truth and snapshots can be regenerated at any time."
  },
  {
    question: "Which of the following is NOT a typical benefit of CQRS?",
    options: ["Independent scaling of read and write workloads", "Simplified codebase with less overall complexity", "Optimized data models for each access pattern", "Better separation of concerns between reads and writes"],
    correctIndex: 1,
    explanation: "CQRS actually increases the overall complexity of a system — you now have two models to maintain, synchronization mechanisms, eventual consistency to manage, and more moving parts. The benefits are independent scaling (you can add read replicas without affecting writes), optimized data models (denormalized reads, normalized writes), and cleaner separation of concerns. CQRS should only be applied to bounded contexts where the read and write patterns are significantly different enough to justify the added complexity. It is not a default architecture for simple CRUD applications."
  },
  {
    question: "In CQRS, what is the role of a domain event?",
    options: ["A request to change state", "A record of something that has already happened in the domain", "A query for current state", "A database transaction log entry"],
    correctIndex: 1,
    explanation: "A domain event is an immutable record that describes something that has already occurred in the system — for example, OrderPlaced, PaymentProcessed, or ItemShipped. Unlike commands (which are requests that may be rejected), events are facts. In CQRS with event sourcing, events are persisted in the event store and used to update read models via projections. They also serve as integration events to notify other bounded contexts or services about changes, enabling loose coupling in a distributed system."
  },
  {
    question: "What is the difference between a thin event and a fat event?",
    options: ["Thin events are faster to process", "Thin events contain only IDs/references requiring lookups; fat events carry all relevant data inline", "Fat events are compressed; thin events are not", "There is no meaningful difference"],
    correctIndex: 1,
    explanation: "A thin event contains minimal data — typically just identifiers and the type of change (e.g., OrderPlaced { orderId: 123 }). Consumers must query back to get full details. A fat event includes all the relevant data needed by consumers (e.g., OrderPlaced { orderId: 123, items: [...], total: 99.99, customer: {...} }). Fat events reduce coupling because consumers don't need to call back to the source, but they increase event size and can leak domain details. The choice depends on your consistency requirements and how tightly coupled your services can afford to be."
  },
  {
    question: "How should you handle event schema evolution in an event-sourced system?",
    options: ["Delete old events and replace them with new schema events", "Use event upcasting/versioning to transform old events to the current schema when reading", "Ignore schema changes since events are immutable", "Stop the system and migrate all events at once"],
    correctIndex: 1,
    explanation: "Since events are immutable and stored forever, you cannot simply modify old events when the schema changes. Event upcasting is the standard approach: when reading events, a transformation layer converts old event versions to the current schema. For example, if OrderPlaced v1 had a 'price' field and v2 split it into 'subtotal' and 'tax', an upcaster converts v1 events on the fly. You can also use event versioning (OrderPlacedV1, OrderPlacedV2) with explicit migration logic. This allows the system to evolve without losing historical data."
  },
  {
    question: "What is a denormalizer in a CQRS read model?",
    options: ["A tool that normalizes database schemas", "A component that processes events and writes denormalized data into the read store", "A query optimizer in the write model", "A data compression algorithm"],
    correctIndex: 1,
    explanation: "A denormalizer (also called a projector) subscribes to events from the write side and transforms them into denormalized structures stored in the read database. For instance, when an OrderPlaced event occurs, the denormalizer might update a flat 'order_summaries' table that includes customer name, item count, and total — all pre-joined for fast querying. This eliminates expensive joins at query time. Each read model can have its own denormalizer, allowing multiple specialized views of the same data optimized for different query patterns."
  },
  {
    question: "When is CQRS overkill?",
    options: ["When your system has complex business logic", "When your read and write patterns are simple, similar, and a basic CRUD approach suffices", "When you need to scale reads independently", "When you have multiple bounded contexts"],
    correctIndex: 1,
    explanation: "CQRS adds significant complexity — separate models, eventual consistency, synchronization infrastructure, and more code to maintain. If your application is a straightforward CRUD system where reads and writes use similar data shapes and volumes, CQRS provides little benefit while adding substantial overhead. It shines when read and write workloads are vastly different (e.g., 1000:1 read-to-write ratio), when you need different storage technologies for each, or when the domain logic on the write side is complex enough to warrant isolation. Always start simple and introduce CQRS only where justified."
  },
  {
    question: "What is the 'write model' in CQRS typically optimized for?",
    options: ["Fast full-text search", "Transactional consistency, validation, and enforcing business invariants", "Low-latency read queries", "Data warehousing and analytics"],
    correctIndex: 1,
    explanation: "The write model in CQRS focuses on correctness over performance. It uses normalized data structures that enforce referential integrity, business rules, and domain invariants. Transactions on the write side ensure that state changes are atomic and consistent. This is in contrast to the read model, which sacrifices normalization for query speed. By separating concerns, the write model doesn't need to compromise its consistency guarantees to support read patterns, and vice versa."
  },
  {
    question: "How do you handle idempotency in CQRS command processing?",
    options: ["You don't — commands are always processed exactly once", "By assigning unique command IDs and tracking which have been processed to prevent duplicate execution", "By using optimistic locking on the read model", "By batching commands together"],
    correctIndex: 1,
    explanation: "In distributed systems, messages can be delivered more than once due to retries, network issues, or broker redelivery. To ensure a command isn't processed twice, each command is assigned a unique ID (often a UUID). The command handler checks if this ID has already been processed (e.g., in a deduplication table) before executing. If it was already handled, the handler returns the previous result without re-executing. This is critical in CQRS because duplicate command processing would emit duplicate events, corrupting the read model and potentially causing incorrect business outcomes."
  },
  {
    question: "What is a catch-up subscription in event sourcing?",
    options: ["A subscription that only receives future events", "A subscription that starts reading from a specific position in the event stream and processes all events from that point forward", "A mechanism to delete old events", "A real-time WebSocket connection to the event store"],
    correctIndex: 1,
    explanation: "A catch-up subscription reads events from a specific position (or from the beginning) in the event store and processes them sequentially until it reaches the current end, then continues processing new events as they arrive. This is how projections rebuild or stay up-to-date: the projection tracks its last processed position, and on startup it resumes from there. If you're building a new read model, you start a catch-up subscription from position 0 to process the entire event history. This mechanism is fundamental to how EventStoreDB and similar systems support CQRS projections."
  },
  {
    question: "What is the 'task-based UI' pattern often associated with CQRS?",
    options: ["A UI that shows database tables directly", "A UI designed around user intentions/actions (commands) rather than CRUD forms editing raw data", "A UI that only displays read model data", "A drag-and-drop task management board"],
    correctIndex: 1,
    explanation: "Task-based UIs capture user intent rather than raw data edits. Instead of a generic 'Edit Order' form that saves all fields at once, you'd have specific actions like 'Change Shipping Address', 'Add Item', or 'Apply Discount'. Each action maps directly to a command in the CQRS system, preserving the business intent. This is more expressive for the domain model because the command carries semantic meaning, not just a diff of changed fields. It also enables better validation, auditing, and event generation since the system knows exactly what the user intended."
  },
  {
    question: "How does CQRS enable polyglot persistence?",
    options: ["By requiring all data be stored in JSON format", "By allowing the read and write sides to use entirely different database technologies suited to their access patterns", "By using a single database with multiple schemas", "By compressing data differently on each side"],
    correctIndex: 1,
    explanation: "Since CQRS separates reads and writes into distinct models, each can use its own database technology. The write side might use PostgreSQL for strong ACID transactions, while the read side uses Elasticsearch for full-text search, Redis for real-time dashboards, or Cassandra for high-throughput time-series queries. The synchronization happens through events — the write side emits events, and each read model's projection consumes them and writes to its respective store. This allows you to pick the perfect tool for each job rather than compromising with a single database."
  },
  {
    question: "What is an event store?",
    options: ["A regular relational database used for CRUD operations", "An append-only database optimized for storing and retrieving ordered sequences of immutable events", "A caching layer for frequently accessed events", "A message broker like Kafka"],
    correctIndex: 1,
    explanation: "An event store is a specialized database designed to persist events in an append-only fashion. Events are stored in streams (typically per aggregate), ordered by sequence number, and are immutable once written. The event store supports reading events for a specific stream (to rebuild aggregate state) and subscribing to events across streams (for projections). Examples include EventStoreDB, Axon Server, and Marten (for PostgreSQL). While Kafka can serve as an event store, purpose-built event stores offer features like optimistic concurrency, stream-level subscriptions, and built-in projections."
  },
  {
    question: "What concurrency control mechanism is commonly used when writing events to an event store?",
    options: ["Pessimistic locking on the entire database", "Optimistic concurrency using expected stream version numbers", "Two-phase commit across all streams", "No concurrency control is needed"],
    correctIndex: 1,
    explanation: "Optimistic concurrency is the standard approach: when appending events to a stream, you specify the expected version (the version you read when loading the aggregate). If another command has appended events since you read, the version won't match and the write fails with a concurrency conflict. The command handler can then retry by reloading the aggregate with the new events and re-executing the command. This is lightweight and scalable compared to pessimistic locking, and it naturally fits the append-only nature of event stores."
  },
  {
    question: "What is the 'projection lag' problem?",
    options: ["Events being stored too slowly", "The delay between an event being written and the corresponding read model being updated", "The write model falling behind the read model", "A network latency issue between services"],
    correctIndex: 1,
    explanation: "Projection lag is the time delay between when an event is persisted in the event store and when the read model reflects that change. During this window, queries to the read model return stale data. The lag can vary from milliseconds to seconds depending on the projection infrastructure, event volume, and processing complexity. High lag can lead to poor user experience (users don't see their changes) and inconsistency in downstream processes. Monitoring projection lag is critical in production CQRS systems, and strategies like read-your-own-writes or version-aware queries can mitigate its impact."
  },
  {
    question: "What is a command in CQRS?",
    options: ["A SQL statement", "An intent to change the system state, expressed as an imperative-named message", "A query that returns data", "An event that has already occurred"],
    correctIndex: 1,
    explanation: "A command is a message that represents the intent to perform an action — it's a request, not a fact. Commands are named imperatively (PlaceOrder, CancelReservation, UpdateProfile) and carry the data needed to execute the action. Unlike events (past tense, something that happened), commands can be rejected if validation fails or business rules are violated. In CQRS, commands flow through a command bus or handler pipeline that routes them to the appropriate handler for processing."
  },
  {
    question: "Can a single CQRS read model serve multiple query use cases?",
    options: ["No, each query must have its own read model", "Yes, but it's often better to create specialized read models per use case for optimal performance", "Read models cannot serve queries directly", "Only if using a relational database"],
    correctIndex: 1,
    explanation: "While a single read model can technically serve multiple query patterns, the power of CQRS lies in creating purpose-built read models tailored to specific use cases. A product listing page might need a lightweight summary model, while a product detail page needs a rich model with reviews and recommendations. Creating separate read models for each eliminates compromises — each model contains exactly the data its consumers need, in the exact shape they need it. The trade-off is maintaining multiple projections and storage, but the performance and simplicity gains at query time are often worth it."
  },
  {
    question: "What happens to the read model if the projection logic has a bug?",
    options: ["The write model is also corrupted", "You fix the projection code and rebuild the read model by replaying events from the event store", "The read model must be manually corrected row by row", "The system must be rebuilt from scratch"],
    correctIndex: 1,
    explanation: "This is one of the greatest advantages of combining CQRS with event sourcing. Since the event store is the source of truth and events are immutable, a buggy projection doesn't cause permanent damage. You fix the projection code, drop the corrupted read model, and replay all events through the corrected projection to rebuild it accurately. This capability makes the system remarkably resilient to bugs — you can always get back to a correct state. Without event sourcing, a corrupted read model might require complex data migration or manual fixes."
  },
  {
    question: "What is the difference between an integration event and a domain event?",
    options: ["They are identical concepts", "Domain events are internal to a bounded context; integration events cross context boundaries and are part of the public contract", "Integration events are faster than domain events", "Domain events are stored; integration events are not"],
    correctIndex: 1,
    explanation: "Domain events represent things that happened within a specific bounded context and may contain internal implementation details. Integration events are designed to communicate across bounded contexts or services — they are part of the public API contract and should be stable, well-documented, and backward-compatible. In CQRS, domain events drive internal projections and process managers, while integration events are published to a message broker for external consumers. Keeping them separate prevents internal domain changes from breaking external consumers."
  },
  {
    question: "How does CQRS relate to the CAP theorem?",
    options: ["CQRS violates the CAP theorem", "CQRS typically trades strong consistency for availability and partition tolerance on the read side", "CQRS guarantees all three CAP properties", "CQRS is unrelated to the CAP theorem"],
    correctIndex: 1,
    explanation: "The CAP theorem states that in a distributed system, you can only guarantee two of: Consistency, Availability, and Partition Tolerance. CQRS systems typically favor availability and partition tolerance (AP) on the read side by accepting eventual consistency. The write side can still maintain strong consistency within its boundary. This means reads may return slightly stale data during network partitions or replication lag, but the system remains available. This trade-off aligns well with many real-world applications where reads vastly outnumber writes and brief staleness is acceptable."
  },
  {
    question: "What is a command bus in CQRS?",
    options: ["A physical network cable", "A message routing infrastructure that dispatches commands to their appropriate handlers", "A database connection pool", "A load balancer for read queries"],
    correctIndex: 1,
    explanation: "A command bus is a mediator pattern implementation that receives commands and routes them to the correct command handler. It provides a single entry point for all write operations, enabling cross-cutting concerns like logging, validation, authorization, and retry logic to be applied uniformly via middleware/decorators. The command bus decouples the sender (e.g., API controller) from the handler, making the system more modular and testable. Libraries like MediatR (.NET), Axon Framework (Java), and similar exist in most language ecosystems."
  },
  {
    question: "What is the 'two-phase projection' strategy?",
    options: ["Running projections on two different servers", "Building the new read model in the background while the old one serves queries, then switching over atomically", "Projecting events twice for redundancy", "Using two databases for the same projection"],
    correctIndex: 1,
    explanation: "Two-phase projection (also called blue-green projection) is a strategy for safely rebuilding or migrating read models without downtime. In phase one, you build the new projection in the background, processing historical events until it catches up. In phase two, you atomically switch the query endpoint from the old read model to the new one. This ensures users always get consistent query results and never hit a half-built read model. It's especially important in production systems where read model rebuilds can take hours for large event stores."
  },
  {
    question: "What is an eventual consistency window?",
    options: ["A UI component showing data freshness", "The time period between a write being committed and the read model reflecting that write", "A database configuration parameter", "The maximum number of allowed stale reads"],
    correctIndex: 1,
    explanation: "The eventual consistency window is the time lag between when data is written on the command side and when it becomes visible in the read model. During this window, queries return stale data. The window's size depends on factors like event bus latency, projection processing speed, and system load. In well-tuned systems, this window is typically milliseconds to low seconds. Understanding and communicating this window is crucial for setting user expectations and designing UIs that handle transient staleness gracefully."
  },
  {
    question: "Which messaging pattern is commonly used to propagate events from the write side to the read side?",
    options: ["Request-response HTTP calls", "Publish-subscribe via a message broker", "Shared database polling", "Direct method invocation"],
    correctIndex: 1,
    explanation: "Publish-subscribe (pub/sub) is the most common pattern for event propagation in CQRS. The write side publishes events to a message broker (Kafka, RabbitMQ, AWS SNS/SQS), and read-side projections subscribe to relevant event topics. This decouples the write and read sides — the write side doesn't know or care about its consumers. Multiple projections can independently subscribe and process events at their own pace. Pub/sub also enables adding new read models without modifying the write side, supporting the open-closed principle at the architectural level."
  },
  {
    question: "What is the 'outbox pattern' in CQRS?",
    options: ["Storing emails in an outbox folder", "Writing events to a local database table atomically with the state change, then asynchronously publishing them to the message broker", "Buffering commands before processing", "Caching read model updates"],
    correctIndex: 1,
    explanation: "The outbox pattern solves the dual-write problem: when you need to both update a database and publish an event, doing them separately can lead to inconsistency if one fails. The outbox pattern writes the event to an 'outbox' table in the same transaction as the state change. A separate process (or CDC/change data capture tool like Debezium) then reads from the outbox table and publishes events to the message broker. This guarantees at-least-once delivery: the event is always published if the state change committed, and idempotent consumers handle potential duplicates."
  },
  {
    question: "What is the role of a query handler in CQRS?",
    options: ["To process commands", "To receive a query, fetch data from the read model, and return the result", "To publish events", "To validate business rules"],
    correctIndex: 1,
    explanation: "A query handler is the read-side counterpart to a command handler. It receives a query object (e.g., GetOrderSummaryQuery), accesses the appropriate read model, and returns the data. Query handlers should be simple and focused — they don't enforce business rules or trigger side effects. They may apply filtering, pagination, or sorting on top of the pre-computed read model data. In some implementations, query handlers are so thin that they're just a direct database query, which is perfectly fine since the complexity lives in the projection that built the read model."
  },
  {
    question: "How does CQRS support multi-tenant systems?",
    options: ["It doesn't — CQRS is incompatible with multi-tenancy", "By partitioning event streams, projections, and read models per tenant, allowing independent scaling and isolation", "By using a single shared read model for all tenants", "By routing all tenants to the same command handler"],
    correctIndex: 1,
    explanation: "CQRS naturally supports multi-tenancy through stream partitioning. Each tenant's events can be stored in separate streams or even separate event stores, providing data isolation. Projections can be tenant-specific, building separate read models per tenant. This enables per-tenant scaling — a high-volume tenant can have dedicated projection infrastructure while smaller tenants share resources. The command side can also enforce tenant-specific business rules. This isolation is much harder to achieve in a traditional CRUD architecture where all tenants share the same tables and queries."
  },
  {
    question: "What is temporal querying in event sourcing?",
    options: ["Querying based on time zones", "The ability to reconstruct the state of the system at any point in time by replaying events up to that moment", "Running queries on a schedule", "Caching queries for a specific duration"],
    correctIndex: 1,
    explanation: "Temporal querying is the ability to answer 'what was the state at time T?' by replaying events up to that timestamp. Since event sourcing stores every state change as an immutable event, you can reconstruct any historical state by replaying the event stream up to the desired point. This is incredibly valuable for auditing, debugging, compliance, and analytics. For example, you could reconstruct a customer's account state at the exact moment a disputed transaction occurred. Traditional CRUD systems that only store current state cannot support this without complex auditing infrastructure."
  },
  {
    question: "What is the 'event replay' concept?",
    options: ["Replaying video recordings of system events", "Re-processing stored events through projections to rebuild read models or derive new insights", "Undoing the last event", "Broadcasting events to all subscribers simultaneously"],
    correctIndex: 1,
    explanation: "Event replay is the process of re-reading events from the event store and processing them through projection logic. This is used to rebuild corrupted read models, create entirely new read models for new features, migrate to new storage technologies, or perform historical analysis. The ability to replay is a fundamental benefit of event sourcing — your event log is the source of truth, and any derived state can be rebuilt from it. Replay can be done at full speed (not real-time), so rebuilding a read model from millions of events typically takes minutes to hours depending on complexity."
  },
  {
    question: "How do you handle ordering guarantees when projecting events?",
    options: ["Ordering doesn't matter in projections", "By ensuring events for the same aggregate/stream are processed in order, typically using stream position or sequence numbers", "By timestamp sorting only", "By processing all events in parallel"],
    correctIndex: 1,
    explanation: "Event ordering is critical for correct projections. Events within a single stream (typically per aggregate) must be processed in order — an OrderShipped event makes no sense before OrderPlaced. Most event stores guarantee ordering per stream via sequence numbers. The projection tracks its last processed position per stream and processes events sequentially. Across streams, strict global ordering is often unnecessary and would limit scalability. Kafka provides per-partition ordering, EventStoreDB provides per-stream ordering, and projections should be designed to handle events from different streams arriving in any interleaved order."
  },
  {
    question: "What is a 'live projection' vs a 'catch-up projection'?",
    options: ["Live projections run in production; catch-up projections run in development", "A live projection processes events in real-time as they arrive; a catch-up projection replays historical events to build or rebuild a read model", "They are the same thing with different names", "Live projections are faster than catch-up projections"],
    correctIndex: 1,
    explanation: "A live projection subscribes to the event stream and processes new events as they are published, keeping the read model up-to-date in near real-time. A catch-up projection starts from a specific position (often the beginning) and processes historical events until it reaches the current position, at which point it becomes a live projection. When building a new read model or recovering from a crash, you first run catch-up to process missed events, then seamlessly transition to live processing. Most production projections operate in a hybrid mode: catch-up on restart, then live during normal operation."
  },
  {
    question: "What is the 'anti-corruption layer' concept in CQRS with bounded contexts?",
    options: ["A firewall between services", "A translation layer that maps between different bounded contexts' models, preventing one context's concepts from leaking into another", "A data validation middleware", "An encryption layer for events"],
    correctIndex: 1,
    explanation: "An anti-corruption layer (ACL) is a DDD pattern used at the boundary between bounded contexts to translate between their different models and languages. In CQRS, when one context consumes integration events from another, the ACL translates external events into internal domain concepts. For example, the Shipping context might receive an 'OrderPlaced' integration event and translate it into a 'ShipmentRequested' internal event using its own domain language. This prevents external model changes from corrupting the internal domain model and maintains clean bounded context boundaries."
  },
  {
    question: "How does CQRS handle reporting and analytics use cases?",
    options: ["CQRS cannot support reporting", "By creating dedicated read models optimized for analytical queries, potentially using a data warehouse as the read store", "By querying the write model directly", "By exporting data to CSV files"],
    correctIndex: 1,
    explanation: "CQRS excels at supporting diverse query patterns, including analytics. You can create dedicated read models that project events into star schemas, time-series databases, or data warehouses optimized for analytical queries. These analytical projections can aggregate, denormalize, and pre-compute metrics from the event stream. For example, a 'SalesAnalytics' projection might maintain daily revenue totals, top-selling products, and customer cohort data. Since projections are independent, adding analytics doesn't affect the operational read models or the write side."
  },
  {
    question: "What is the 'set-based validation' challenge in CQRS?",
    options: ["Validating mathematical sets", "Enforcing uniqueness constraints (like unique email) that require checking across multiple aggregates, which is hard when each aggregate is loaded independently", "Validating command field types", "Testing projection correctness"],
    correctIndex: 1,
    explanation: "Set-based validation involves constraints that span multiple aggregates — for example, ensuring no two users have the same email address. In CQRS, aggregates are loaded and validated independently, so checking a cross-aggregate constraint isn't straightforward. Solutions include: using a lightweight read model (lookup table) to check uniqueness before processing the command, relying on database unique constraints as a safety net, using a domain service that coordinates the check, or accepting the rare duplicate and handling it asynchronously. This is one of the more nuanced challenges in CQRS design."
  },
  {
    question: "What is 'command validation' vs 'domain validation' in CQRS?",
    options: ["They are the same thing", "Command validation checks structural correctness (required fields, formats); domain validation enforces business rules using aggregate state", "Command validation runs after domain validation", "Domain validation is optional"],
    correctIndex: 1,
    explanation: "Command validation and domain validation are two distinct layers. Command validation is stateless and checks that the command message is well-formed: required fields are present, email format is valid, amounts are positive, etc. This can be done in middleware before reaching the handler. Domain validation is stateful and happens inside the aggregate: does this customer have sufficient credit? Is this order in a state that allows cancellation? Is the inventory available? Separating these layers keeps the domain model focused on business rules while catching obvious errors early, providing better error messages and reducing unnecessary aggregate loading."
  },
  {
    question: "How can you test projections in a CQRS system?",
    options: ["Only through manual end-to-end testing", "By feeding a known sequence of events into the projection and asserting the expected read model state", "Projections cannot be unit tested", "By comparing the read model to the write model"],
    correctIndex: 1,
    explanation: "Projections are highly testable because they are pure functions of events: given a sequence of events, the projection should produce a deterministic read model state. You can write unit tests that create a projection instance, feed it a series of events (OrderPlaced, ItemAdded, OrderShipped), and assert that the resulting read model contains the expected data. This is much simpler than testing through the full stack. You can also test edge cases like out-of-order events, duplicate events, and event schema versions. The deterministic nature of projections makes them one of the most testable components in a CQRS architecture."
  },
  {
    question: "What is the 'competing consumers' pattern in CQRS projection processing?",
    options: ["Multiple projections competing for the same events", "Multiple instances of the same projection consumer processing events in parallel for scalability, where each event is processed by exactly one instance", "Different read models competing for database resources", "Command handlers competing for lock acquisition"],
    correctIndex: 1,
    explanation: "Competing consumers is a scalability pattern where multiple instances of the same projection processor share the workload. Events are distributed across instances (e.g., via Kafka consumer groups), and each event is processed by exactly one instance. This allows horizontal scaling of projection processing. However, you must ensure that events for the same aggregate/entity are always routed to the same instance (partition by aggregate ID) to maintain ordering guarantees. This pattern is essential for high-throughput systems where a single projection processor can't keep up with the event volume."
  },
  {
    question: "What is 'event-carried state transfer' in CQRS?",
    options: ["Transferring the event store between environments", "Including enough data in events so that consumers can update their local state without querying back to the source", "Moving events from one stream to another", "Migrating state between aggregates"],
    correctIndex: 1,
    explanation: "Event-carried state transfer is a pattern where events contain all the data consumers need to update their local state, eliminating the need for callbacks or API queries. For example, instead of publishing CustomerAddressChanged { customerId: 123 } (requiring consumers to fetch the new address), you publish CustomerAddressChanged { customerId: 123, newAddress: {...} }. This reduces coupling and improves resilience — consumers don't depend on the source service being available. It's a form of 'fat events' and is especially valuable in CQRS where read models need to maintain denormalized copies of data from multiple services."
  },
  {
    question: "How does CQRS handle data deletion for GDPR compliance?",
    options: ["GDPR doesn't apply to event-sourced systems", "By using crypto-shredding (encrypting PII with per-user keys and destroying the key) or event rewriting strategies", "By deleting events from the event store directly", "By ignoring deletion requests since events are immutable"],
    correctIndex: 1,
    explanation: "GDPR's 'right to be forgotten' is challenging with immutable event stores. The most common approach is crypto-shredding: personally identifiable information (PII) in events is encrypted with a per-user key stored separately. When a deletion request comes in, you destroy the key, rendering the PII in events unreadable. Another approach is storing PII in a separate mutable store referenced by events, allowing direct deletion. Some systems use event rewriting with tombstone events. The read models can be rebuilt without the deleted PII. This is a critical consideration when designing event-sourced CQRS systems for European markets."
  },
  {
    question: "What is a 'read model subscription checkpoint'?",
    options: ["A bookmark in a document", "A persisted position marker indicating which events a projection has already processed, enabling resumption after restarts", "A health check endpoint for the read model", "A database savepoint"],
    correctIndex: 1,
    explanation: "A checkpoint (or bookmark) is a persisted record of the last event position successfully processed by a projection. When the projection process restarts (after a crash, deployment, or scaling event), it reads the checkpoint and resumes processing from that position rather than replaying all events from the beginning. Checkpoints should be updated atomically with the read model writes to prevent duplicate processing. If the checkpoint is updated but the read model write fails (or vice versa), you get inconsistency. Some systems store the checkpoint in the same transaction as the read model update to ensure atomicity."
  },
  {
    question: "What is the purpose of a 'command retry policy' in CQRS?",
    options: ["To retry failed database queries", "To automatically re-execute commands that fail due to transient errors like concurrency conflicts", "To resend events to the message broker", "To reconnect to the event store"],
    correctIndex: 1,
    explanation: "In CQRS with event sourcing, optimistic concurrency conflicts are expected — two commands targeting the same aggregate may conflict if processed simultaneously. A retry policy automatically reloads the aggregate with the latest state and re-attempts the command when a concurrency exception occurs. This is safe because the command is re-validated against the updated state. Retry policies should have limits (max retries) and backoff strategies (exponential backoff) to avoid infinite loops. They should only retry transient errors — business rule violations should not be retried."
  },
  {
    question: "How does the Axon Framework support CQRS?",
    options: ["It's a JavaScript UI framework", "It provides building blocks for CQRS and event sourcing in Java, including command/event buses, aggregate support, sagas, and projections", "It's a database migration tool", "It's a message broker like RabbitMQ"],
    correctIndex: 1,
    explanation: "Axon Framework is a Java/Kotlin framework specifically designed for building CQRS and event-sourcing applications. It provides: command buses for routing commands to handlers, event buses for publishing and subscribing to events, aggregate annotations for defining event-sourced aggregates, saga support for long-running processes, and query handling infrastructure. Axon Server (the companion product) provides a combined event store, command bus, and query bus. It's one of the most mature CQRS frameworks and is widely used in enterprise Java applications, reducing the boilerplate of implementing CQRS patterns from scratch."
  },
  {
    question: "What is EventStoreDB and how does it relate to CQRS?",
    options: ["A general-purpose relational database", "A purpose-built database for event sourcing that provides stream-based storage, subscriptions, and built-in projections for CQRS", "A caching layer for event data", "A monitoring tool for event-driven systems"],
    correctIndex: 1,
    explanation: "EventStoreDB (formerly Event Store) is an open-source database specifically designed for event sourcing. Created by Greg Young (who coined CQRS), it stores events in streams with built-in optimistic concurrency, provides catch-up and persistent subscriptions for projections, and includes a projection engine that can create read models using JavaScript. It supports features like stream metadata, system events, and user-defined projections. Its native support for event sourcing patterns makes it a natural fit for CQRS architectures, though you can implement event sourcing on top of any database."
  },
  {
    question: "What is 'event versioning' and why is it important?",
    options: ["Versioning the event store software", "Maintaining version numbers for event schemas to handle backward/forward compatibility as the domain model evolves", "Counting how many events exist", "Tracking which events have been processed"],
    correctIndex: 1,
    explanation: "Event versioning assigns version identifiers to event schemas (e.g., OrderPlacedV1, OrderPlacedV2) to manage schema evolution over time. As the domain model changes, events may gain new fields, lose old ones, or change their structure. Since events are immutable and stored forever, old versions must remain readable. Versioning strategies include: upcasting (transforming old versions to current when reading), weak schema (ignoring unknown fields, providing defaults for missing ones), or explicit version mapping. Without proper versioning, evolving the domain model becomes increasingly difficult as the event history grows."
  },
  {
    question: "What is the relationship between CQRS and microservices?",
    options: ["CQRS can only be used with microservices", "CQRS can be applied within a single microservice or across service boundaries; it's an architectural pattern that complements but doesn't require microservices", "Microservices require CQRS", "They are competing architectural styles"],
    correctIndex: 1,
    explanation: "CQRS and microservices are orthogonal patterns that work well together but don't depend on each other. You can use CQRS within a monolith (separating read and write models in the same application) or within a single microservice. In a microservices architecture, CQRS naturally fits: each service owns its write model, and other services can build their own read models from integration events. However, CQRS also works perfectly in modular monoliths with separate bounded contexts. The key is applying CQRS where the complexity of read/write separation is justified, regardless of the deployment architecture."
  },
  {
    question: "How do you monitor the health of a CQRS system?",
    options: ["Only check if the web server is running", "Monitor projection lag, event processing rate, command failure rate, and the gap between write-side and read-side positions", "Check disk space only", "Monitor only the read model query latency"],
    correctIndex: 1,
    explanation: "Monitoring a CQRS system requires observing both sides and the bridge between them. Key metrics include: projection lag (how far behind the read model is), event processing throughput, command acceptance/rejection rates, read model query latencies, event store growth rate, and consumer group lag (in Kafka-based systems). Alerting on projection lag is particularly important — if a projection falls too far behind, the read model becomes unacceptably stale. You should also monitor for projection errors, dead-letter queues, and concurrency conflict rates as indicators of system health."
  },
  {
    question: "What is a 'process manager' vs a 'saga' in CQRS terminology?",
    options: ["They are always identical", "A process manager is an orchestrator that sends commands based on events; a saga (in its original definition) is a sequence of transactions with compensating actions for rollback", "Sagas are faster than process managers", "Process managers handle queries; sagas handle commands"],
    correctIndex: 1,
    explanation: "While often used interchangeably, these terms have distinct origins. A saga (originally from the 1987 Garcia-Molina/Salem paper) is a sequence of local transactions where each step has a compensating transaction for rollback. A process manager is a more general pattern: a stateful component that reacts to events and issues commands to coordinate a workflow. In practice, the CQRS community often uses 'saga' to mean what is technically a process manager. The key distinction is that sagas emphasize compensation for failure, while process managers emphasize stateful workflow coordination."
  },
  {
    question: "What is 'command deduplication' and how is it implemented?",
    options: ["Removing duplicate command handlers", "Detecting and discarding duplicate commands using unique IDs to ensure exactly-once processing semantics", "Merging similar commands into one", "Preventing users from submitting the same form twice via UI"],
    correctIndex: 1,
    explanation: "Command deduplication ensures each command is executed at most once, even if delivered multiple times due to retries or network issues. Implementation typically involves: assigning each command a unique ID (UUID), storing processed command IDs in a deduplication table, and checking this table before processing. If the ID exists, the command is skipped and the previous result is returned. The deduplication table can be pruned after a retention period (e.g., 24 hours) since duplicates are unlikely after that window. In event-sourced systems, the event store's optimistic concurrency can sometimes serve as a natural deduplication mechanism."
  },
  {
    question: "What is the 'strangler fig' pattern in the context of migrating to CQRS?",
    options: ["A database migration tool", "Gradually replacing a legacy system by routing specific features to a new CQRS implementation while the old system continues to handle the rest", "Removing unused code from the codebase", "A load balancing algorithm"],
    correctIndex: 1,
    explanation: "The strangler fig pattern (named after the strangler fig tree that gradually envelops its host) is an incremental migration strategy. Instead of rewriting the entire system to use CQRS at once (a risky big-bang approach), you identify specific bounded contexts or features that would benefit most from CQRS and migrate them individually. A routing layer directs traffic to either the old or new system based on the feature. Over time, more features move to the CQRS system until the legacy system is fully replaced. This reduces risk, allows learning, and delivers value incrementally."
  },
  {
    question: "What is the difference between 'inline projection' and 'async projection'?",
    options: ["Inline projections are faster", "Inline projections update the read model synchronously within the command transaction; async projections update it asynchronously after the transaction commits", "Async projections use more memory", "There is no practical difference"],
    correctIndex: 1,
    explanation: "Inline (synchronous) projections update the read model as part of the same transaction that processes the command and stores events. This provides strong consistency between the write and read models — no eventual consistency lag — but it couples the command's performance to the projection's speed and means the command fails if the projection fails. Async projections update the read model in a separate process after events are committed, providing eventual consistency but better decoupling and performance. Most production CQRS systems use async projections, reserving inline projections for cases where strong read consistency is critical."
  },
  {
    question: "How should you handle 'event ordering across streams' in CQRS?",
    options: ["Enforce strict global ordering for all events", "Design projections to handle events from different streams arriving in any order, using timestamps or causation IDs for correlation when needed", "Process only one stream at a time", "Ignore cross-stream ordering entirely"],
    correctIndex: 1,
    explanation: "Strict global ordering across all event streams is expensive and limits scalability. Instead, CQRS projections should be designed to tolerate out-of-order events from different streams. Techniques include: using correlation and causation IDs to link related events, designing projections to handle 'dangling references' (e.g., receiving a ShipmentCreated event before the referenced OrderPlaced event), and using reconciliation processes to fix temporary inconsistencies. If a projection absolutely needs cross-stream ordering, you can use a global position/sequence number, but this creates a scalability bottleneck."
  },
  {
    question: "What is 'event enrichment' in CQRS?",
    options: ["Adding metadata to events after they're stored", "Adding contextual data (user info, timestamps, correlation IDs) to events during creation so projections have all needed information", "Compressing event payloads", "Encrypting sensitive event data"],
    correctIndex: 1,
    explanation: "Event enrichment is the practice of adding useful metadata and contextual information to events at creation time. This includes: correlation IDs (linking events to the originating command), causation IDs (which event caused this one), user/actor information, timestamps, and relevant denormalized data. Enriched events reduce the need for projections to make additional queries to build the read model. For example, including the customer name in an OrderPlaced event means the order list projection doesn't need to query the customer service. However, over-enrichment leads to large events and potential data duplication."
  },
  {
    question: "What role does Apache Kafka play in CQRS architectures?",
    options: ["It serves as the primary write database", "It acts as a durable, ordered event log for publishing and subscribing to events between the write and read sides", "It replaces the need for a read model", "It only handles command routing"],
    correctIndex: 1,
    explanation: "Kafka is widely used in CQRS as the event backbone connecting the write side to read-side projections. Its partitioned, append-only log with configurable retention makes it suitable for event streaming. Kafka guarantees ordering within partitions (partition by aggregate ID for correct per-aggregate ordering), supports multiple consumer groups (each projection gets its own group), and provides durable storage. Kafka can also serve as a lightweight event store with log compaction, though purpose-built event stores offer better support for event sourcing patterns like stream-level reads and optimistic concurrency."
  },
  {
    question: "What is 'projection partitioning' in CQRS?",
    options: ["Splitting the projection code into modules", "Distributing projection workload across multiple workers by partitioning events (e.g., by aggregate ID or tenant) for parallel processing", "Creating separate databases for each projection", "Archiving old projection data"],
    correctIndex: 1,
    explanation: "Projection partitioning divides the event processing workload across multiple projection instances. Events are partitioned by a key (typically aggregate ID, tenant ID, or entity type), and each partition is assigned to a specific worker. This enables horizontal scaling — you can add more workers to process events faster. The key requirement is that events for the same entity always go to the same partition to maintain ordering. Kafka consumer groups naturally support this pattern. Projection partitioning is essential for high-throughput CQRS systems where a single projection worker can't keep up with the event volume."
  },
  {
    question: "How do you implement 'exactly-once projection processing'?",
    options: ["It's impossible in distributed systems", "By storing the read model update and the projection checkpoint atomically in the same transaction", "By processing events very slowly", "By using TCP instead of UDP"],
    correctIndex: 1,
    explanation: "Exactly-once processing semantics for projections are achieved through atomic checkpoint management. The projection's position checkpoint and the read model update are written in the same database transaction. If the transaction fails, neither the checkpoint nor the read model is updated, so the event will be reprocessed. If it succeeds, both are committed, and the event won't be reprocessed. When using different databases for the checkpoint and read model, you fall back to at-least-once processing with idempotent projections. Kafka's transactions API can also help by committing consumer offsets and producer writes atomically."
  },
  {
    question: "What is 'event-driven architecture' vs CQRS?",
    options: ["They are the same pattern", "Event-driven architecture is a broader pattern about communicating via events; CQRS specifically separates read and write models and often uses events as the synchronization mechanism", "CQRS is a subset of event-driven architecture", "Event-driven architecture requires CQRS"],
    correctIndex: 1,
    explanation: "Event-driven architecture (EDA) is a broad paradigm where components communicate by producing and consuming events. CQRS is a specific pattern that separates command (write) and query (read) responsibilities into different models. While CQRS often uses events to synchronize the read and write sides (making it event-driven), you can implement CQRS with other synchronization mechanisms (like database triggers or polling). Conversely, you can have an event-driven architecture without CQRS. They complement each other well — CQRS with event sourcing naturally produces events that can drive an event-driven architecture."
  },
  {
    question: "What is the 'query side gateway' pattern in CQRS?",
    options: ["A network firewall for database queries", "An API layer that routes queries to the appropriate read model based on the query type", "A caching proxy for the event store", "A load balancer for write operations"],
    correctIndex: 1,
    explanation: "The query side gateway is a routing layer that directs incoming queries to the appropriate read model or data store. Since CQRS may involve multiple specialized read models (e.g., Elasticsearch for search, Redis for real-time data, PostgreSQL for complex queries), the gateway determines which read model can best serve each query. It may also handle cross-cutting concerns like authentication, caching, and rate limiting for the read side. This pattern keeps the client simple — it sends queries to one endpoint, and the gateway handles the complexity of routing to the correct backend."
  },
  {
    question: "How does CQRS handle complex queries that span multiple aggregates?",
    options: ["It can't — each query must target a single aggregate", "By building denormalized read models that pre-join data from multiple aggregates, eliminating the need for runtime joins", "By running distributed queries across aggregate boundaries", "By using stored procedures on the write model"],
    correctIndex: 1,
    explanation: "One of CQRS's key strengths is handling complex, cross-aggregate queries efficiently. Instead of joining data at query time, projections build pre-joined, denormalized read models. For example, an 'OrderWithCustomerDetails' read model might combine data from OrderPlaced events and CustomerUpdated events into a single denormalized table. Queries then read from this pre-computed view with zero joins. This shifts the computational cost from query time (where latency matters) to projection time (which is asynchronous and can be slower). The read model is designed backwards from the query needs."
  },
  {
    question: "What is the 'thin read layer' pattern in CQRS?",
    options: ["A read model with minimal data", "A lightweight query layer that directly reads from denormalized read models with minimal logic, often bypassing ORM/domain layers entirely", "A compressed version of the read model", "A read model stored in memory only"],
    correctIndex: 1,
    explanation: "The thin read layer advocates keeping the query side as simple as possible — often just direct database queries returning DTOs without going through domain objects, repositories, or complex ORM mappings. Since the read model is already denormalized and shaped for the consumer, there's no need for domain logic on the query path. This can be as simple as raw SQL queries or lightweight data access returning flat objects directly to the API. This simplicity is a major benefit of CQRS — the read side can be trivially simple while all the complexity lives in the write side and projections."
  },
  {
    question: "What challenges arise when using CQRS in a system with complex authorization rules?",
    options: ["CQRS doesn't support authorization", "Authorization must be enforced on both the command side (can the user perform this action?) and the read side (can the user see this data?), potentially requiring filtered projections or row-level security", "Authorization is only needed on the write side", "Authorization is only needed on the read side"],
    correctIndex: 1,
    explanation: "CQRS requires authorization on both sides. The command side checks if the user is allowed to perform the action (e.g., can this user cancel this order?). The read side must filter data based on user permissions (e.g., a manager sees all orders, a customer sees only their own). This can be implemented through: per-user/role read models, row-level security in the read database, query-time filtering, or separate projections per permission level. The challenge is that pre-computing per-user views can be expensive, while runtime filtering can be complex. The right approach depends on the authorization model's complexity."
  },
  {
    question: "What is an 'aggregate stream' in event sourcing?",
    options: ["A river of data flowing between aggregates", "A sequence of events belonging to a specific aggregate instance, identified by the aggregate type and ID", "A backup of all aggregate states", "A real-time dashboard of aggregate operations"],
    correctIndex: 1,
    explanation: "An aggregate stream is the ordered sequence of all events that belong to a specific aggregate instance. It's typically identified by a stream name like 'Order-abc123' or 'Customer-456'. When loading an aggregate, the system reads all events from its stream and applies them sequentially to rebuild the current state. When processing a command, new events are appended to the stream with the expected version for optimistic concurrency. The stream is the fundamental unit of consistency in event sourcing — within a stream, events are strictly ordered and atomically appended."
  },
  {
    question: "How do you handle large read models that take hours to rebuild from events?",
    options: ["Never rebuild them", "Use snapshots/checkpoints during replay, parallel processing, and incremental rebuild strategies to reduce rebuild time", "Only store the last 100 events", "Skip events during rebuild for speed"],
    correctIndex: 1,
    explanation: "Rebuilding large read models from millions of events can indeed take hours. Strategies to manage this include: parallel replay (processing events from different partitions simultaneously), snapshot-based replay (starting from a recent read model snapshot rather than event zero), incremental rebuild (rebuilding only the changed portions), and optimized batch writes (buffering read model updates and writing in large batches). The two-phase rebuild approach keeps the old read model serving queries while the new one catches up. For extremely large systems, consider maintaining read model snapshots specifically for fast rebuild."
  },
  {
    question: "What is the role of 'correlation ID' in CQRS?",
    options: ["It identifies the database server", "It links a command, its resulting events, and any downstream effects together for tracing and debugging across the entire workflow", "It uniquely identifies an aggregate", "It determines event ordering"],
    correctIndex: 1,
    explanation: "A correlation ID is a unique identifier assigned when a workflow begins (typically when a command is received) and propagated through all resulting events, subsequent commands, and side effects. This enables end-to-end tracing: you can follow a single user action through command processing, event emission, projection updates, and saga coordination. In distributed CQRS systems, correlation IDs are essential for debugging — when something goes wrong, you can trace the entire causal chain. They're also valuable for monitoring, logging, and auditing the full lifecycle of a business operation."
  },
  {
    question: "What is 'event sourcing without CQRS'?",
    options: ["Impossible — event sourcing requires CQRS", "Using an event store as the persistence mechanism but reading by reconstructing aggregate state from events without a separate read model", "Storing events but never reading them", "Using CQRS without events"],
    correctIndex: 1,
    explanation: "Event sourcing and CQRS are independent patterns that work well together but don't require each other. You can use event sourcing without CQRS by storing events as your persistence mechanism and reconstructing aggregate state by replaying events when you need to read. Queries would load the aggregate from its event stream rather than reading from a separate optimized read model. This approach gives you the audit trail and temporal query benefits of event sourcing but doesn't give you the read-side optimization benefits of CQRS. It works well for write-heavy systems with simple read patterns."
  },
  {
    question: "What is the 'event handler' vs 'event listener' distinction?",
    options: ["They are always identical", "An event handler modifies state (updating a projection); an event listener performs side effects (sending emails, triggering notifications) without modifying the read model", "Event handlers are synchronous; listeners are asynchronous", "Event listeners are deprecated in modern CQRS"],
    correctIndex: 1,
    explanation: "While the terminology varies by framework, a useful distinction is: event handlers are responsible for updating read model state (projections) and should be idempotent and deterministic. Event listeners (or reactors/policies) trigger side effects like sending emails, calling external APIs, or publishing integration events. This distinction matters for replay: when rebuilding a read model by replaying events, you want event handlers to run but NOT event listeners (you don't want to re-send thousands of emails). Frameworks like Axon and Marten support this distinction explicitly."
  },
  {
    question: "How does CQRS handle search functionality?",
    options: ["CQRS cannot support search", "By projecting events into a search engine (like Elasticsearch) as a dedicated read model", "By running full-text search on the event store", "By using SQL LIKE queries on the write model"],
    correctIndex: 1,
    explanation: "Search is a perfect use case for CQRS's polyglot persistence capability. A dedicated search projection consumes events and indexes them into a search engine like Elasticsearch, Solr, or Typesense. This search index becomes a specialized read model optimized for full-text search, faceting, and relevance scoring. The projection maps domain events to search documents, handling creates, updates, and deletes. This approach gives you powerful search without compromising the write model's data structure and without the limitations of database-native full-text search."
  },
  {
    question: "What is 'command sourcing' and how does it differ from event sourcing?",
    options: ["They are the same thing", "Command sourcing stores the commands (requests) rather than the resulting events (facts), which is generally less useful since commands don't capture the outcome", "Command sourcing is faster than event sourcing", "Command sourcing uses a different database type"],
    correctIndex: 1,
    explanation: "Command sourcing stores every command sent to the system, while event sourcing stores every event produced by processing commands. The key difference is that commands are requests (which may be rejected), while events are facts (what actually happened). Replaying commands is problematic because the outcome might differ if the system state has changed. Replaying events always produces the same result since they represent what actually occurred. Command sourcing can be useful for auditing (what did users try to do?) but event sourcing is the standard for state reconstruction. In practice, many systems log commands for debugging while event-sourcing for state management."
  },
  {
    question: "How does 'backpressure' apply to CQRS projections?",
    options: ["It's a plumbing concept irrelevant to software", "When events are produced faster than projections can consume them, backpressure mechanisms slow down or buffer the event flow to prevent projection overload", "Projections always process events instantly", "Backpressure only applies to the write side"],
    correctIndex: 1,
    explanation: "Backpressure occurs when the event production rate exceeds the projection consumption rate, causing the projection lag to grow continuously. Without backpressure handling, this can lead to unbounded queue growth, memory exhaustion, or unacceptable read model staleness. Solutions include: scaling projection consumers horizontally, buffering events in a durable message broker (Kafka handles this naturally), batching projection updates, optimizing projection processing speed, or in extreme cases, throttling the write side. Monitoring projection lag is the primary indicator of backpressure problems in a CQRS system."
  },
  {
    question: "What is the 'read model per screen' approach in CQRS?",
    options: ["One database per UI screen", "Designing each read model to exactly match the data needs of a specific UI view, eliminating over-fetching and under-fetching", "Displaying the read model directly on screen", "A front-end rendering technique"],
    correctIndex: 1,
    explanation: "The 'read model per screen' (or 'read model per query') approach creates purpose-built read models that contain exactly the data needed for a specific UI view. Instead of a generic 'orders' table that serves multiple screens with different data needs, you might have 'order_list_items' (for the list view), 'order_details' (for the detail view), and 'order_analytics' (for the dashboard). Each projection shapes data for its specific consumer, eliminating joins, reducing payload size, and simplifying the query layer. This is where CQRS delivers its biggest performance and simplicity wins on the read side."
  },
  {
    question: "What is 'event stream merging' in CQRS projections?",
    options: ["Combining two event stores into one", "A projection that consumes events from multiple streams/aggregates to build a composite read model", "Merging duplicate events", "Joining two database tables"],
    correctIndex: 1,
    explanation: "Event stream merging occurs when a projection needs data from multiple aggregate types to build its read model. For example, an 'OrderWithCustomer' projection consumes events from both Order and Customer streams. When an OrderPlaced event arrives, the projection creates a record with order details; when a CustomerNameChanged event arrives, it updates all orders for that customer. This cross-stream projection is one of the most powerful patterns in CQRS — it creates views that would require expensive joins in a traditional system. The challenge is handling events arriving in any order from different streams."
  },
  {
    question: "What is 'command routing' in a distributed CQRS system?",
    options: ["DNS routing for API endpoints", "Directing a command to the specific node or service instance that owns the target aggregate, often using consistent hashing on the aggregate ID", "Routing commands to a message queue", "Load balancing across all services equally"],
    correctIndex: 1,
    explanation: "In a distributed CQRS system with multiple service instances, each command must reach the instance that can load and modify the target aggregate. Command routing uses the aggregate ID to deterministically select the handling instance — typically via consistent hashing or a routing table. This ensures commands for the same aggregate are serialized at the same instance, preventing concurrent modification conflicts. Frameworks like Axon Server and Microsoft Orleans provide built-in command routing. Without proper routing, you'd need distributed locking, which is much more expensive and fragile."
  },
  {
    question: "What is the significance of 'immutable events' in event sourcing?",
    options: ["Events can be modified but shouldn't be", "Events are stored as append-only, immutable facts — never updated or deleted — providing a trustworthy audit trail and enabling deterministic replay", "Immutability is optional for performance", "Only some events need to be immutable"],
    correctIndex: 1,
    explanation: "Event immutability is a cornerstone principle of event sourcing. Once an event is stored, it is never modified or deleted. This provides a tamper-proof audit trail (critical for compliance), enables deterministic replay (you always get the same result from the same events), and simplifies the system (no update conflicts in the event store). To 'undo' something, you append a compensating event (e.g., OrderCancelled to reverse OrderPlaced) rather than deleting the original. This append-only nature also enables efficient storage (no random I/O for updates) and is what makes event stores fundamentally different from traditional databases."
  },
  {
    question: "How do you implement 'real-time projections' that update the UI immediately?",
    options: ["Polling the read model every second", "Using event-driven push notifications (WebSockets, SSE, or SignalR) triggered by projection updates to notify clients of changes", "Refreshing the entire page", "Having the client query the event store directly"],
    correctIndex: 1,
    explanation: "Real-time projections combine async projection processing with push notifications to clients. When a projection processes an event and updates the read model, it also publishes a notification (via WebSocket, Server-Sent Events, or SignalR) to connected clients. The client receives the notification and either fetches the updated data or receives it inline. This creates a reactive UX where changes appear almost instantly. Libraries like SignalR (.NET) or Socket.io (Node.js) handle the connection management. This is particularly effective for collaborative applications where multiple users need to see each other's changes in real-time."
  },
  {
    question: "What is the 'aggregate design rule' of keeping aggregates small in CQRS?",
    options: ["Aggregates should have as few fields as possible", "Aggregates should be designed around consistency boundaries, not convenience — only include entities that must change together in a single transaction", "Aggregates should never reference other aggregates", "All entities in a domain should be in one aggregate"],
    correctIndex: 1,
    explanation: "Vaughn Vernon's aggregate design rules emphasize keeping aggregates small by only including what must be transactionally consistent together. A large aggregate (e.g., an Order that contains all OrderItems, ShippingInfo, PaymentInfo, and CustomerInfo) creates contention — any modification locks the entire aggregate. Instead, design smaller aggregates (Order, Shipment, Payment) that reference each other by ID. In CQRS with event sourcing, smaller aggregates mean fewer events to replay when loading, less contention for concurrent commands, and clearer domain boundaries. The read model handles denormalization for query purposes."
  },
  {
    question: "What is 'command validation middleware' in CQRS?",
    options: ["A network firewall", "A pipeline component that validates command structure, permissions, and preconditions before the command reaches the handler", "A testing framework for commands", "A UI form validation library"],
    correctIndex: 1,
    explanation: "Command validation middleware sits in the command processing pipeline before the handler. It performs cross-cutting validations that don't require domain knowledge: schema validation (required fields, correct types), authentication (is the user logged in?), authorization (does the user have permission?), rate limiting, and structural preconditions. This keeps command handlers focused on domain logic rather than boilerplate checks. The pipeline pattern (similar to HTTP middleware) allows stacking multiple validators, loggers, and other cross-cutting concerns. Libraries like MediatR (with pipeline behaviors) make this pattern easy to implement."
  },
  {
    question: "How does CQRS affect testing strategy?",
    options: ["CQRS makes testing harder with no benefits", "CQRS enables isolated testing: commands are tested with 'given events, when command, then events'; projections with 'given events, then read model state'", "Only integration tests are possible with CQRS", "Testing is the same as in any other architecture"],
    correctIndex: 1,
    explanation: "CQRS significantly improves testability by creating clear, isolated components. Command handlers are tested using the 'given-when-then' pattern: given a set of prior events (aggregate state), when a command is processed, then specific new events should be emitted. Projections are tested by feeding events and asserting read model state. Read queries are tested by seeding the read model and verifying results. Each component can be unit tested independently without complex mocking. This separation also enables property-based testing (generate random event sequences and verify projection invariants) and makes it easy to test edge cases like concurrency conflicts and event schema evolution."
  },
  {
    question: "What is a 'subscription group' in the context of CQRS projections?",
    options: ["A team of developers working on subscriptions", "A set of projection consumers that share event processing workload, where each event is processed by exactly one consumer in the group", "A group of event streams", "A collection of similar events"],
    correctIndex: 1,
    explanation: "A subscription group (similar to Kafka consumer groups) allows multiple instances of the same projection to share the workload. Events are distributed across group members, and each event is processed by exactly one member. This enables horizontal scaling of projection processing. When a member fails, its partitions are rebalanced to surviving members. EventStoreDB calls these 'persistent subscriptions' (with competing consumers), Kafka uses 'consumer groups', and other brokers have similar concepts. The key constraint is maintaining per-partition ordering to ensure events for the same entity are processed sequentially."
  },
  {
    question: "What is the 'domain event vs integration event' publishing strategy?",
    options: ["Publish all events everywhere", "Publish domain events internally within the bounded context for projections/sagas, and selectively publish curated integration events externally for other services", "Only publish integration events", "Domain events are not published at all"],
    correctIndex: 1,
    explanation: "A well-designed CQRS system distinguishes between internal domain events and external integration events. Domain events contain internal details relevant to the bounded context (e.g., OrderItemPriceRecalculated with internal pricing logic details). Integration events are a curated, stable public API for external consumers (e.g., OrderTotalChanged with just the new total). The bounded context subscribes to its own domain events for projections and sagas, and a separate integration event publisher selectively transforms domain events into integration events. This prevents leaking internal domain knowledge and gives you freedom to refactor internally without breaking external consumers."
  },
  {
    question: "How do you handle 'eventual consistency' in the UI when using CQRS?",
    options: ["Always show a loading spinner for 10 seconds after every action", "Use optimistic UI updates, polling with version checks, or push notifications to give users immediate feedback while the read model catches up", "Ignore the issue — users won't notice", "Switch to strong consistency everywhere"],
    correctIndex: 1,
    explanation: "Handling eventual consistency in the UI is critical for good UX. Strategies include: optimistic UI updates (immediately update the UI to reflect the expected result of the command, then reconcile when the read model catches up), version-aware polling (include the expected version in the response and poll until the read model reaches it), push notifications (the server pushes updates via WebSocket when the projection completes), and confirmation pages ('Your order has been placed and is being processed'). The key is setting user expectations — many real-world systems are eventually consistent (bank transactions, order processing) and users already understand slight delays."
  },
  {
    question: "What is 'event deduplication' in CQRS projections?",
    options: ["Removing duplicate events from the event store", "Ensuring that projections handle duplicate event deliveries gracefully by making projection handlers idempotent", "Preventing users from creating duplicate records", "Deduplicating query results"],
    correctIndex: 1,
    explanation: "In distributed systems, events can be delivered more than once due to broker redelivery, consumer restarts, or network issues. Projections must handle this gracefully through idempotent processing. Strategies include: tracking the last processed event position/ID and skipping already-seen events, designing projection updates to be naturally idempotent (e.g., SET balance = 100 is idempotent, but SET balance = balance + 10 is not), or using upsert operations. Atomic checkpoint management (updating the checkpoint in the same transaction as the read model) is the most robust approach, ensuring an event is counted as processed only when its effect is committed."
  },
  {
    question: "What is the benefit of 'append-only storage' in an event store?",
    options: ["It uses less disk space", "Append-only writes are extremely fast (no random I/O), support high write throughput, and naturally prevent data loss through immutability", "It makes reads faster", "It simplifies indexing"],
    correctIndex: 1,
    explanation: "Append-only storage is the foundation of event stores and provides several advantages. Write performance is excellent because appends are sequential I/O — the fastest operation for both SSDs and especially HDDs. There are no update-in-place operations, so no write amplification or fragmentation. Immutability means no data is ever lost or corrupted by overwrites. Concurrency is simplified since appends don't conflict with reads. The trade-off is that reading current state requires replaying events (mitigated by snapshots and read models), and storage grows indefinitely (mitigated by archiving or compaction strategies). These properties make event stores naturally suited to high-write-throughput systems."
  },
  {
    question: "What is the 'split-brain' problem relevant to CQRS?",
    options: ["A cognitive issue for developers", "When network partitions cause multiple instances to process commands for the same aggregate independently, leading to conflicting event streams", "When the read model splits into two databases", "When projections fall too far behind"],
    correctIndex: 1,
    explanation: "Split-brain occurs when network partitions cause multiple nodes in a CQRS system to believe they are the authoritative handler for the same aggregate, leading to conflicting commands being processed independently. This can result in divergent event streams that are difficult to reconcile. Prevention strategies include: using the event store's optimistic concurrency (only one writer succeeds), cluster consensus protocols (Raft/Paxos for leader election), distributed locking, or accepting conflicts and implementing merge strategies. This is particularly relevant in multi-region deployments where network partitions between regions are common."
  },
  {
    question: "How does 'event store compaction' work?",
    options: ["Compressing event data", "Keeping only the latest event per key and discarding older events, similar to Kafka log compaction, to reduce storage while preserving final state", "Merging multiple event stores", "Removing empty events"],
    correctIndex: 1,
    explanation: "Event store compaction (like Kafka's log compaction) retains the latest event for each key while removing older events. This is useful for scenarios where you care about the final state rather than the full history (e.g., user profile updates). After compaction, you lose the ability to replay the full event history but save significant storage. This is NOT appropriate for true event sourcing where the complete history is the source of truth — it's more suited for event-carried state transfer or CDC scenarios. True event-sourced systems typically use snapshots plus archiving instead of compaction to manage storage growth."
  },
  {
    question: "What is the 'command return value' debate in CQRS?",
    options: ["Commands should always return the full entity", "There is debate about whether commands should return void (pure CQS) or minimal data like the created entity's ID for practical API design", "Commands should return events", "Commands should return the read model state"],
    correctIndex: 1,
    explanation: "Purists argue commands should return nothing (void), following strict CQS principles — you separate commands (do something) from queries (return something). However, pragmatists argue that returning at least the identifier of a created resource (e.g., the new order ID) is essential for practical API design — without it, the client doesn't know what was created. Some return a result object with the ID and success/failure status. Others return the full created entity for convenience. The consensus in the community is that returning a minimal result (ID + status) is a reasonable compromise that maintains the spirit of CQRS while being practical for API consumers."
  },
  {
    question: "How does GraphQL relate to the query side of CQRS?",
    options: ["GraphQL replaces CQRS entirely", "GraphQL is a natural fit for the CQRS query side, providing flexible querying of read models with client-specified field selection", "GraphQL can only be used on the command side", "GraphQL and CQRS are incompatible"],
    correctIndex: 1,
    explanation: "GraphQL complements the query side of CQRS by allowing clients to request exactly the fields they need from read models. Each GraphQL query type can resolve from a different read model or data store, leveraging CQRS's polyglot persistence. GraphQL mutations map naturally to CQRS commands. The flexibility of GraphQL reduces the need for 'one read model per screen' since clients can compose their views from multiple resolvers. However, GraphQL doesn't replace the need for optimized read models — poorly designed resolvers can still cause N+1 query problems. The combination of GraphQL + CQRS can be very powerful when the read models are designed to support the GraphQL schema efficiently."
  },
  {
    question: "What is 'command authorization' in CQRS?",
    options: ["Authorizing the event store to write events", "Verifying that the user issuing a command has the required permissions to perform the requested action before processing it", "Authorizing database connections", "Giving commands priority over queries"],
    correctIndex: 1,
    explanation: "Command authorization is the process of verifying that the user or system issuing a command has the necessary permissions. This typically happens in the command processing pipeline, either as middleware or within the handler. Authorization checks might include role-based access (is the user an admin?), resource-based access (does the user own this order?), or attribute-based access (is the user's department allowed to approve expenses above $1000?). In CQRS, authorization is especially important because commands change state — unauthorized mutations could have serious consequences. Some authorization checks require loading the aggregate (to check ownership), adding a dependency on the domain layer."
  },
  {
    question: "What is the role of 'metadata' on events in event sourcing?",
    options: ["Metadata is optional and rarely used", "Metadata carries contextual information (timestamp, user ID, correlation ID, causation ID) that aids in tracing, auditing, and projection processing", "Metadata stores the event payload", "Metadata is the event schema version"],
    correctIndex: 1,
    explanation: "Event metadata is contextual information attached to events beyond the domain payload. Common metadata includes: timestamp (when the event was created), user/actor ID (who caused it), correlation ID (which workflow it belongs to), causation ID (which event or command caused this one), schema version, source service/aggregate, and IP address. Metadata is invaluable for debugging (trace an event back to its origin), auditing (who did what when), and operational concerns (filtering events by time range or source). Most event stores and frameworks support metadata as a first-class concept separate from the event body."
  },
  {
    question: "What is 'CQRS with a shared database'?",
    options: ["Not possible — CQRS requires separate databases", "Using the same database for both read and write models but with separate tables/schemas optimized for each concern", "Sharing a database between microservices", "Using a database shared between production and staging"],
    correctIndex: 1,
    explanation: "CQRS with a shared database is the simplest implementation: the write model uses normalized tables with foreign keys and constraints, while the read model uses denormalized tables or materialized views in the same database. Synchronization can be done via database triggers, views, or application-level event publishing. This approach avoids the operational complexity of managing multiple databases while still gaining the benefits of optimized data models for each concern. It's a great starting point — you can later split to separate databases if scaling demands require it. The key insight is that CQRS is about separate models, not necessarily separate physical databases."
  },
  {
    question: "How do you handle 'projection failures' in production?",
    options: ["Ignore them — the system will self-heal", "Implement dead-letter queues for failed events, alerting, retry logic with exponential backoff, and the ability to replay from the last successful checkpoint", "Restart the entire system", "Delete the failed events"],
    correctIndex: 1,
    explanation: "Projection failures are inevitable in production — events might reference data that doesn't exist yet, external services might be down, or bugs might cause exceptions. A robust approach includes: retry logic with exponential backoff for transient failures, dead-letter queues (DLQ) for events that fail repeatedly, alerting when the DLQ grows or projection lag increases, and the ability to fix the code and replay from the last checkpoint. Some systems support 'poison message' handling where a single bad event is skipped and logged rather than blocking the entire projection. Monitoring projection health (lag, error rate, throughput) is essential for operating CQRS in production."
  },
  {
    question: "What is the 'event-first' design approach?",
    options: ["Writing events before commands", "Designing the system by first identifying the domain events that occur, then working backwards to determine what commands trigger them and what read models consume them", "Prioritizing event processing over command processing", "Event-driven programming paradigm"],
    correctIndex: 1,
    explanation: "Event-first design (also called 'event storming' when done as a workshop) starts by identifying what happens in the domain — the events. This is counterintuitive compared to traditional approaches that start with data models or API endpoints. By identifying events first (OrderPlaced, PaymentReceived, ItemShipped), you discover the natural domain boundaries, the commands that trigger events, the policies that react to events, and the read models that aggregate events. This approach naturally leads to CQRS/ES architecture because you've already identified the events that drive the system. It also improves domain understanding because events are expressed in business language."
  },
  {
    question: "What is the maximum recommended size of an event payload?",
    options: ["Exactly 1 KB", "There's no strict limit, but events should be small (1-10 KB typically), carrying only the data that changed, not entire entity snapshots", "Events should be as large as possible for completeness", "Events must be under 100 bytes"],
    correctIndex: 1,
    explanation: "While there's no universal limit, best practice is keeping events small — typically 1-10 KB. An event should carry only the data relevant to what changed, not the entire entity state. Large events (carrying full entity snapshots) waste storage, slow down serialization/deserialization, and increase network bandwidth. If you need the full entity state, that's what snapshots are for. The exception is 'fat events' for event-carried state transfer, where including additional data reduces coupling. Kafka has configurable message size limits (default 1 MB), and EventStoreDB handles large events but performs best with smaller ones."
  },
  {
    question: "What is 'event sourcing with snapshots' and when should you take snapshots?",
    options: ["Snapshot every single event", "Periodically save the aggregate's current state (e.g., every N events) to speed up loading, only replaying events after the snapshot", "Snapshots replace event sourcing entirely", "Take snapshots only during system maintenance windows"],
    correctIndex: 1,
    explanation: "Snapshots are periodic saves of an aggregate's computed state, stored alongside or separately from the event stream. When loading an aggregate, the system loads the latest snapshot and replays only the events after it. Common strategies for when to snapshot include: every N events (e.g., every 100), when loading time exceeds a threshold, or on a schedule. Snapshots are an optimization, not a replacement for events — the event stream remains the source of truth. Start without snapshots and add them only when aggregate loading becomes a measurable performance bottleneck. Premature snapshot optimization adds complexity for minimal benefit in systems with short-lived aggregates or few events per aggregate."
  },
  {
    question: "How does CQRS relate to Domain-Driven Design (DDD)?",
    options: ["CQRS replaces DDD", "CQRS and DDD complement each other: DDD provides the strategic (bounded contexts) and tactical (aggregates, entities) patterns that inform CQRS model design", "DDD requires CQRS", "They are competing methodologies"],
    correctIndex: 1,
    explanation: "CQRS and DDD are complementary. DDD provides the strategic patterns (bounded contexts, ubiquitous language, context mapping) that help you identify where CQRS should be applied. DDD's tactical patterns (aggregates, entities, value objects, domain events) directly inform the write model design. Bounded contexts are the natural boundaries for CQRS implementations — each context can independently decide whether CQRS is appropriate. The combination of DDD + CQRS + Event Sourcing is often called the 'DDD triad' and is considered a powerful approach for complex domains. However, both patterns can be used independently."
  },
  {
    question: "What is the 'event store as single source of truth' principle?",
    options: ["The read model is the source of truth", "In event sourcing + CQRS, the event store contains the authoritative record of everything that happened; all other data stores are derived projections that can be rebuilt", "Both the event store and read model are sources of truth", "The database with the most data is the source of truth"],
    correctIndex: 1,
    explanation: "When using event sourcing with CQRS, the event store is the single source of truth for the system. Every read model, cache, search index, and materialized view is a derived projection that can be rebuilt from the event store at any time. This has profound implications: data loss in a read model is recoverable (replay events), bugs in projections are fixable (fix code, rebuild), and new query patterns are supportable (create a new projection). The event store must therefore be treated with the highest level of care — it needs robust backups, replication, and durability guarantees. Losing the event store means losing the authoritative history of the system."
  },
  {
    question: "What is the 'closing the books' pattern in event sourcing?",
    options: ["Financial auditing terminology only", "Periodically creating a summary event that captures the current state, allowing old events to be archived while maintaining a starting point for future processing", "Deleting old events monthly", "Locking event streams from further writes"],
    correctIndex: 1,
    explanation: "The 'closing the books' pattern (borrowed from accounting) addresses the challenge of ever-growing event streams. Periodically (e.g., end of month, end of quarter), the system creates a summary event that captures the aggregate's state at that point. Old events before the summary can then be archived to cold storage, reducing the active event store size. Future aggregate loading starts from the summary event rather than from the beginning of time. This is similar to snapshots but is modeled as a domain concept (like closing a financial period) rather than a technical optimization. It's particularly relevant for long-lived aggregates with many events."
  },
  {
    question: "How does CQRS handle cross-aggregate transactions?",
    options: ["Use distributed two-phase commit across all aggregates", "Avoid cross-aggregate transactions; instead use eventual consistency with sagas/process managers that coordinate through events and compensating actions", "Lock all involved aggregates before processing", "Cross-aggregate transactions are not possible"],
    correctIndex: 1,
    explanation: "CQRS strongly discourages cross-aggregate transactions because they create tight coupling and reduce scalability. Instead, the pattern favors eventual consistency: a command modifies one aggregate and emits an event, a saga/process manager listens for that event and issues commands to other aggregates, and compensating commands handle failures. For example, placing an order might first create the Order aggregate, then a saga handles payment by commanding the Payment aggregate, and if payment fails, a compensating CancelOrder command is issued. This approach is more resilient and scalable than distributed transactions but requires careful design of compensation logic."
  },
  {
    question: "What is 'event-driven projection rebuild' vs 'state-based snapshot rebuild'?",
    options: ["They produce different results", "Event-driven rebuild replays all events through projection logic; state-based rebuild copies from a point-in-time snapshot of the read model as a starting point", "Event-driven rebuilds are always faster", "State-based rebuilds are more accurate"],
    correctIndex: 1,
    explanation: "Event-driven rebuild processes every event from the event store through the projection logic to construct the read model from scratch. It's the most accurate approach and works even if the projection logic has changed. State-based rebuild starts from a snapshot of the read model taken at a specific point and only processes events that occurred after the snapshot. This is faster for large event stores but requires that the projection logic hasn't changed since the snapshot was taken. In practice, systems use a hybrid: maintain periodic read model snapshots for fast recovery, but support full event replay when the projection logic changes."
  },
  {
    question: "What is the significance of 'event ordering' in an event store?",
    options: ["Events don't need ordering", "Events within a stream must be strictly ordered to ensure deterministic aggregate state reconstruction and correct projection processing", "Events should be randomly ordered for better distribution", "Only global ordering matters"],
    correctIndex: 1,
    explanation: "Event ordering is fundamental to correctness in event sourcing. Within a single stream (per aggregate), events must be strictly ordered — applying them in a different order would produce a different state (e.g., 'account opened' must come before 'funds deposited'). Event stores guarantee per-stream ordering through sequence numbers. Global ordering across all streams is sometimes useful for projections that need a consistent view of the entire system, but it's expensive and limits write throughput. Most projections only need per-stream ordering plus a global position for checkpointing. The ordering guarantees of your event store directly impact what your projections can reliably compute."
  },
  {
    question: "What is the 'Decider' pattern in functional CQRS?",
    options: ["A design pattern for making decisions in the UI", "A functional programming pattern that encapsulates command handling as a pure function: (State, Command) → Event[] and state evolution as (State, Event) → State", "A consensus algorithm for distributed decisions", "A pattern for deciding which read model to query"],
    correctIndex: 1,
    explanation: "The Decider pattern, popularized by Jérémie Chassaing, models the command side as two pure functions: a 'decide' function that takes the current state and a command, returning zero or more events; and an 'evolve' function that takes the current state and an event, returning the new state. This functional approach makes the command side highly testable, composable, and free of side effects. The initial state, decide, and evolve functions together form a complete specification of the aggregate's behavior. This pattern has gained popularity in F#, TypeScript, and Kotlin CQRS implementations for its simplicity and mathematical elegance."
  },
  {
    question: "How do you handle 'late-arriving events' in CQRS projections?",
    options: ["Reject them — late events are invalid", "Design projections to handle events arriving out of expected order, using upsert logic, idempotent updates, and reconciliation processes", "Queue them until the expected event arrives", "Late events never occur in well-designed systems"],
    correctIndex: 1,
    explanation: "In distributed systems, events can arrive at projections out of the expected business order — for example, a ShipmentCreated event might arrive before the OrderPlaced event it references. Projections must handle this gracefully. Strategies include: using upsert logic (create-if-not-exists, update-if-exists), storing 'pending' references that are resolved when the missing event arrives, periodic reconciliation processes that fix inconsistencies, and designing the read model schema to tolerate temporary gaps. The key insight is that projections in distributed CQRS are not traditional ETL pipelines — they must be resilient to real-world messaging disorder."
  },
  {
    question: "What is the 'event catalog' concept?",
    options: ["An online store for event tickets", "A documented registry of all event types in the system, including their schemas, versions, producers, and consumers — serving as the contract between services", "A database table listing past events", "A logging system for events"],
    correctIndex: 1,
    explanation: "An event catalog is a living documentation of all event types in the system. For each event, it describes: the schema (field names, types, constraints), version history, which service produces it, which services consume it, and example payloads. It serves as the contract between producers and consumers, similar to an API specification. Tools like AsyncAPI, EventCatalog (eventcatalog.dev), and schema registries (Confluent Schema Registry) help maintain this catalog. In a CQRS system with many event types flowing between bounded contexts, the event catalog is essential for governance, onboarding new developers, and preventing breaking changes."
  }
];
