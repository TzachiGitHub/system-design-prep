export interface RealWorldExample {
  company: string;
  useCase: string;
}

export interface Tradeoffs {
  pros: string[];
  cons: string[];
}

export interface Pattern {
  id: string;
  name: string;
  emoji: string;
  category: string;
  summary: string;
  diagram: string;
  whenToUse: string[];
  whenNotToUse: string[];
  realWorldExamples: RealWorldExample[];
  tradeoffs: Tradeoffs;
  interviewBuzzwords: string[];
  keyInsight: string;
}

export const patterns: Pattern[] = [
  {
    id: 'monolithic',
    name: 'Monolithic Architecture',
    emoji: '🏛️',
    category: 'Application Architecture',
    summary: 'A single deployable unit containing all application logic — UI, business logic, and data access — in one codebase and one process.',
    diagram: `
┌─────────────────────────────────┐
│         MONOLITH                │
│  ┌───────┐ ┌───────┐ ┌──────┐  │
│  │  UI   │ │ Biz   │ │ Data │  │
│  │ Layer │ │ Logic  │ │Access│  │
│  └───┬───┘ └───┬───┘ └──┬───┘  │
│      └─────────┴────────┘       │
│         Single Process          │
└────────────┬────────────────────┘
             │
        ┌────▼────┐
        │   DB    │
        └─────────┘
    `,
    whenToUse: [
      'Early-stage startups with small teams (< 10 engineers)',
      'Simple domain with limited bounded contexts',
      'MVP / proof-of-concept where speed-to-market matters most',
      'When team lacks DevOps expertise for distributed systems',
      'Low traffic applications (< 1000 RPS)',
    ],
    whenNotToUse: [
      'Multiple teams need to deploy independently',
      'Different components have vastly different scaling needs',
      'You need polyglot technology stacks',
      'Application is large (> 500K LOC) and hard to reason about',
      'Fault isolation is critical — one bug crashes everything',
    ],
    realWorldExamples: [
      { company: 'Basecamp', useCase: 'Rails monolith serving their entire product, famously defended by DHH' },
      { company: 'Stack Overflow', useCase: 'Serves 1.3B page views/month from a monolithic .NET app on just a few servers' },
      { company: 'Shopify', useCase: 'One of the largest Rails monoliths, modularized with components but still single deploy' },
      { company: 'Etsy', useCase: 'Ran a PHP monolith for years, deploying 50+ times/day with good CI/CD' },
    ],
    tradeoffs: {
      pros: [
        'Simple to develop, test, and debug — single codebase, single debugger',
        'Easy deployment — one artifact, one process to manage',
        'Low latency between components — in-process function calls, no network hops',
        'ACID transactions are straightforward — single database, no distributed transactions',
        'Simple IDE experience — refactoring, find-references, go-to-definition all work',
        'Lower infrastructure cost — no service mesh, API gateway, or container orchestration needed',
      ],
      cons: [
        'Tight coupling — changes in one module can break others',
        'Scaling is all-or-nothing — can\'t scale hot components independently',
        'Long build/deploy times as codebase grows',
        'Technology lock-in — entire app must use same language/framework',
        'Single point of failure — one memory leak or crash kills everything',
        'Onboarding new developers becomes harder as complexity grows',
      ],
    },
    interviewBuzzwords: [
      'single deployable unit', 'shared memory', 'vertical scaling', 'modular monolith',
      'big ball of mud', 'deployment coupling', 'shared database',
    ],
    keyInsight: 'Don\'t dismiss monoliths! Many successful companies run monoliths at scale. The key insight for interviews: start with a monolith and extract services when you have a clear reason — premature microservices are a common anti-pattern.',
  },
  {
    id: 'microservices',
    name: 'Microservices',
    emoji: '🔬',
    category: 'Application Architecture',
    summary: 'Application decomposed into small, independently deployable services, each owning its own data and communicating via APIs or messaging.',
    diagram: `
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Service A│  │ Service B│  │ Service C│
│  (Users) │  │ (Orders) │  │(Payments)│
└────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │              │
┌────▼───┐   ┌────▼───┐    ┌────▼───┐
│  DB A  │   │  DB B  │    │  DB C  │
└────────┘   └────────┘    └────────┘
     │             │              │
     └─────────────┼──────────────┘
            Message Bus / API Gateway
    `,
    whenToUse: [
      'Large teams (> 20 engineers) that need independent deployment',
      'Different components have different scaling requirements (e.g., search vs checkout)',
      'Need for polyglot tech — ML team uses Python, backend uses Go',
      'Organization follows Conway\'s Law with clear team boundaries',
      'High availability required — fault isolation between services',
      'Rapid iteration needed on specific features without full regression',
    ],
    whenNotToUse: [
      'Small team (< 5 engineers) — overhead will slow you down',
      'Unclear domain boundaries — you\'ll get distributed monolith',
      'Startup MVP — you don\'t know your domain well enough yet',
      'Strong consistency requirements across services (distributed transactions are hard)',
      'No DevOps maturity — need CI/CD, monitoring, service discovery',
    ],
    realWorldExamples: [
      { company: 'Netflix', useCase: '1000+ microservices handling 200M+ subscribers, each service independently deployable' },
      { company: 'Uber', useCase: '4000+ microservices, domain-oriented platform with service mesh (moved from monolith)' },
      { company: 'Amazon', useCase: 'Famously mandated service-oriented architecture in 2002 (Bezos API mandate)' },
      { company: 'Spotify', useCase: 'Squad-based microservices aligned with autonomous team structure' },
      { company: 'Twitter', useCase: 'Decomposed Ruby monolith into JVM microservices to handle scale' },
    ],
    tradeoffs: {
      pros: [
        'Independent deployment — ship features without coordinating with other teams',
        'Independent scaling — scale only what\'s hot (e.g., search service during Black Friday)',
        'Fault isolation — one service crashing doesn\'t take down the system',
        'Technology flexibility — use the best tool for each job',
        'Team autonomy — each team owns their service end-to-end',
        'Easier to understand each individual service (small codebase)',
      ],
      cons: [
        'Distributed system complexity — network failures, partial failures, eventual consistency',
        'Data consistency is hard — no ACID across services, need sagas or eventual consistency',
        'Operational overhead — monitoring, logging, tracing, deployment pipelines per service',
        'Network latency — inter-service calls add milliseconds vs in-process calls',
        'Testing complexity — integration tests require running multiple services',
        'Debugging is harder — distributed tracing needed (Jaeger, Zipkin)',
      ],
    },
    interviewBuzzwords: [
      'bounded context', 'service discovery', 'API gateway', 'circuit breaker',
      'saga pattern', 'distributed tracing', 'eventual consistency', 'database per service',
      'Conway\'s Law', 'independently deployable',
    ],
    keyInsight: 'In interviews, always mention: "Each microservice owns its data." If two services share a database, you have a distributed monolith, not microservices. Also: microservices are an organizational pattern as much as a technical one.',
  },
  {
    id: 'event-driven',
    name: 'Event-Driven / Pub-Sub',
    emoji: '📡',
    category: 'Communication Pattern',
    summary: 'Components communicate by producing and consuming events through a message broker, enabling loose coupling and asynchronous processing.',
    diagram: `
┌──────────┐     ┌───────────────────┐     ┌──────────┐
│ Producer │────▶│   Message Broker  │────▶│Consumer A│
│(Order Svc)│    │  (Kafka/RabbitMQ) │     │(Email Svc)│
└──────────┘     │                   │     └──────────┘
                 │  Topic: "orders"  │     ┌──────────┐
                 │                   │────▶│Consumer B│
                 └───────────────────┘     │(Analytics)│
                                           └──────────┘
    `,
    whenToUse: [
      'Decoupling producers from consumers — producer doesn\'t need to know who processes events',
      'Asynchronous workflows (order placed → send email → update inventory → notify shipping)',
      'Real-time data streaming and analytics (clickstream, IoT sensor data)',
      'When you need to fan-out one event to multiple consumers',
      'Event replay capability needed (audit logs, rebuilding state)',
    ],
    whenNotToUse: [
      'Simple request-response needed with immediate result',
      'Strong consistency required — eventual consistency is inherent',
      'Simple CRUD app with no complex workflows',
      'Team unfamiliar with async debugging and eventual consistency',
      'Low throughput — overhead of broker isn\'t justified',
    ],
    realWorldExamples: [
      { company: 'LinkedIn', useCase: 'Created Apache Kafka; processes 7 trillion messages/day for activity feeds, metrics, and data pipelines' },
      { company: 'Netflix', useCase: 'Event-driven data pipeline for recommendations, A/B testing, and real-time analytics' },
      { company: 'Uber', useCase: 'Real-time trip events flow through Kafka for pricing, ETA, matching, and analytics' },
      { company: 'Walmart', useCase: 'Order processing pipeline: order placed → payment → inventory → shipping are all events' },
    ],
    tradeoffs: {
      pros: [
        'Loose coupling — producers and consumers are independent, can evolve separately',
        'Scalability — consumers can be scaled independently based on load',
        'Resilience — if a consumer is down, messages queue up and are processed later',
        'Auditability — event log provides natural audit trail',
        'Extensibility — add new consumers without modifying producers',
        'Natural backpressure handling — consumers process at their own pace',
      ],
      cons: [
        'Eventual consistency — no immediate confirmation of processing',
        'Debugging complexity — hard to trace a request across async boundaries',
        'Message ordering challenges — especially across partitions',
        'Duplicate messages — need idempotent consumers (at-least-once delivery)',
        'Increased infrastructure complexity — need to manage broker (Kafka, RabbitMQ)',
        'Event schema evolution is tricky — backward/forward compatibility needed',
      ],
    },
    interviewBuzzwords: [
      'pub/sub', 'event bus', 'message broker', 'fan-out', 'at-least-once delivery',
      'exactly-once semantics', 'dead letter queue', 'backpressure', 'event replay',
      'idempotency', 'topic', 'partition',
    ],
    keyInsight: 'Always mention idempotency in interviews. Since messages can be delivered more than once, every consumer must handle duplicates safely. Use an idempotency key (e.g., order_id) to deduplicate.',
  },
  {
    id: 'cqrs',
    name: 'CQRS',
    emoji: '✂️',
    category: 'Data Pattern',
    summary: 'Command Query Responsibility Segregation — separate models for reading and writing data, allowing each to be optimized independently.',
    diagram: `
              ┌──────────┐
              │  Client   │
              └─────┬─────┘
           ┌────────┴────────┐
     ┌─────▼─────┐     ┌────▼─────┐
     │  Command   │     │  Query   │
     │  (Write)   │     │  (Read)  │
     │  Service   │     │  Service │
     └─────┬─────┘     └────▲─────┘
           │                 │
     ┌─────▼─────┐     ┌────┴─────┐
     │ Write DB  │────▶│ Read DB  │
     │(Normalized)│sync│(Denorml.)│
     └───────────┘     └──────────┘
    `,
    whenToUse: [
      'Read-heavy systems (read:write ratio > 10:1)',
      'Complex querying needs different from write model (e.g., search, reporting)',
      'Need to scale reads and writes independently',
      'Different consistency requirements for reads vs writes',
      'Used with Event Sourcing for event-driven read model projections',
    ],
    whenNotToUse: [
      'Simple CRUD where read and write models are identical',
      'Small applications — adds unnecessary complexity',
      'Strong consistency required on reads immediately after writes',
      'Team lacks experience with eventual consistency patterns',
    ],
    realWorldExamples: [
      { company: 'Microsoft', useCase: 'Azure services use CQRS internally; major proponents of the pattern' },
      { company: 'Stack Overflow', useCase: 'Read-optimized denormalized tables for fast page loads, separate write path' },
      { company: 'Walmart', useCase: 'Product catalog: writes go to normalized store, reads from denormalized search-optimized store' },
    ],
    tradeoffs: {
      pros: [
        'Independent scaling — scale read replicas without affecting write performance',
        'Optimized models — read model can be denormalized for fast queries',
        'Separation of concerns — write validation logic separate from read projections',
        'Better performance — each side tuned for its workload',
        'Flexibility — read model can use different storage (Elasticsearch for search, Redis for cache)',
      ],
      cons: [
        'Increased complexity — two models to maintain instead of one',
        'Eventual consistency — read model may lag behind writes',
        'Data synchronization overhead — need mechanism to keep read model updated',
        'More code to write and test — projections, sync logic, event handlers',
        'Debugging complexity — issues may be in write path, read path, or sync',
      ],
    },
    interviewBuzzwords: [
      'read model', 'write model', 'projection', 'materialized view', 'read replica',
      'denormalization', 'command handler', 'query handler', 'eventual consistency',
    ],
    keyInsight: 'CQRS shines when read and write workloads are very different. In an interview, a great example: Twitter timeline. Writes (tweets) go to a normalized store. Reads (timeline) are served from a pre-computed, denormalized fan-out cache.',
  },
  {
    id: 'event-sourcing',
    name: 'Event Sourcing',
    emoji: '📜',
    category: 'Data Pattern',
    summary: 'Store all state changes as an immutable sequence of events rather than just the current state. The current state is derived by replaying events.',
    diagram: `
  Event Store (Append-Only Log)
  ┌──────────────────────────────────────────┐
  │ E1: AccountCreated(id=1, balance=0)      │
  │ E2: MoneyDeposited(id=1, amount=100)     │
  │ E3: MoneyWithdrawn(id=1, amount=30)      │
  │ E4: MoneyDeposited(id=1, amount=50)      │
  └──────────────────────────────────────────┘
           │ Replay ──▶ Current State: balance = 120
           │
           ▼ Project ──▶ Read Models (CQRS)
    `,
    whenToUse: [
      'Audit trail is critical (finance, healthcare, legal)',
      'Need to reconstruct past states ("What was the account balance on March 5?")',
      'Complex business domains where state transitions matter (order lifecycle)',
      'Event replay for debugging — reproduce bugs by replaying events',
      'Combined with CQRS for powerful read projections',
    ],
    whenNotToUse: [
      'Simple CRUD apps — massive overkill',
      'When current state is all that matters',
      'High-frequency updates on same entity (event log grows fast)',
      'Team unfamiliar with event-driven patterns',
      'When you need simple ad-hoc queries (querying event streams is complex)',
    ],
    realWorldExamples: [
      { company: 'Banking/Finance', useCase: 'Bank ledgers are the original event source — every transaction is recorded, balance is derived' },
      { company: 'EventStore (Greg Young)', useCase: 'Purpose-built event sourcing database used by many financial institutions' },
      { company: 'Walmart', useCase: 'Order lifecycle events from placed → paid → shipped → delivered for full traceability' },
    ],
    tradeoffs: {
      pros: [
        'Complete audit trail — every change is recorded and immutable',
        'Time travel — reconstruct state at any point in time',
        'Event replay — rebuild read models, fix bugs by replaying corrected logic',
        'Natural fit for event-driven architecture',
        'Debugging — replay events to reproduce issues exactly',
      ],
      cons: [
        'Complexity — fundamentally different from CRUD thinking',
        'Event schema evolution is hard — old events still need to be readable',
        'Storage growth — events accumulate (mitigated by snapshots)',
        'Eventual consistency — current state may lag behind latest events',
        'Querying — can\'t easily query current state without projections',
        'Learning curve — team needs to think in events, not state mutations',
      ],
    },
    interviewBuzzwords: [
      'append-only log', 'event replay', 'snapshot', 'projection', 'temporal query',
      'immutable events', 'event versioning', 'aggregate', 'domain events',
    ],
    keyInsight: 'Use the banking analogy in interviews: "A bank doesn\'t store your balance and overwrite it — it stores every transaction and computes the balance. That\'s event sourcing." Mention snapshots to address the performance concern of replaying millions of events.',
  },
  {
    id: 'serverless',
    name: 'Serverless / FaaS',
    emoji: '☁️',
    category: 'Deployment Pattern',
    summary: 'Run code in ephemeral, event-triggered functions managed by a cloud provider. No server provisioning — you pay only for execution time.',
    diagram: `
  ┌─────────┐    ┌──────────┐    ┌──────────┐
  │ API GW  │───▶│ Lambda / │───▶│  DynamoDB│
  │ / Event │    │ Cloud Fn │    │  / S3    │
  └─────────┘    └──────────┘    └──────────┘
       ▲              │
  ┌────┴────┐    Auto-scales
  │ Trigger │    0 to N instances
  │(HTTP/S3/│
  │ Queue)  │
  └─────────┘
    `,
    whenToUse: [
      'Unpredictable or spiky traffic — auto-scales from 0 to thousands',
      'Event-driven processing (S3 upload → thumbnail, SQS message → process)',
      'APIs with variable load — pay-per-invocation is cheaper at low traffic',
      'Rapid prototyping — no infrastructure to manage',
      'Scheduled tasks / cron jobs',
    ],
    whenNotToUse: [
      'Long-running processes (> 15 min Lambda limit)',
      'Low-latency requirements — cold starts add 100ms-10s',
      'Stateful applications — functions are ephemeral',
      'High, consistent traffic — dedicated servers are cheaper',
      'Complex local development/debugging needs',
      'Vendor lock-in is a concern (tight cloud coupling)',
    ],
    realWorldExamples: [
      { company: 'Netflix', useCase: 'Media encoding pipeline triggered by S3 uploads, scales to thousands of concurrent functions' },
      { company: 'iRobot', useCase: 'Roomba IoT events processed by Lambda for telemetry and fleet management' },
      { company: 'Coca-Cola', useCase: 'Vending machine backends on serverless — handles spiky, unpredictable demand' },
      { company: 'Stripe', useCase: 'Webhook processing via serverless functions for event-driven payment workflows' },
    ],
    tradeoffs: {
      pros: [
        'Zero server management — no patching, no capacity planning',
        'Auto-scaling from 0 to infinity — true elasticity',
        'Pay-per-use — no cost when idle, great for variable workloads',
        'Fast time-to-market — focus on code, not infrastructure',
        'Built-in high availability and fault tolerance',
      ],
      cons: [
        'Cold starts — first invocation can be slow (100ms to 10s depending on runtime)',
        'Execution time limits (AWS Lambda: 15 min, Cloud Functions: 9 min)',
        'Vendor lock-in — tightly coupled to cloud provider APIs',
        'Limited local debugging and testing capabilities',
        'Stateless — no in-memory state between invocations',
        'Cost can spike unpredictably with high, sustained traffic',
      ],
    },
    interviewBuzzwords: [
      'FaaS', 'cold start', 'warm start', 'ephemeral compute', 'event-triggered',
      'pay-per-invocation', 'stateless', 'vendor lock-in', 'provisioned concurrency',
    ],
    keyInsight: 'In interviews, mention cold starts proactively and how to mitigate them: provisioned concurrency, keep-alive pings, or choosing lightweight runtimes. This shows you understand real-world tradeoffs, not just theory.',
  },
  {
    id: 'layered',
    name: 'Layered (N-Tier)',
    emoji: '🍰',
    category: 'Application Architecture',
    summary: 'Application organized into horizontal layers (presentation, business, data access), each depending only on the layer directly below it.',
    diagram: `
┌──────────────────────┐
│  Presentation Layer  │  (UI, Controllers, API)
├──────────────────────┤
│   Business Layer     │  (Domain logic, rules)
├──────────────────────┤
│  Data Access Layer   │  (Repositories, ORM)
├──────────────────────┤
│   Database Layer     │  (SQL, NoSQL)
└──────────────────────┘
    Each layer only calls the layer below
    `,
    whenToUse: [
      'Traditional web applications with clear separation of concerns',
      'Enterprise applications where teams own different layers',
      'When you want a well-understood, conventional architecture',
      'Applications with standard CRUD operations',
    ],
    whenNotToUse: [
      'Highly interactive, real-time applications',
      'When layers become pass-through (adding latency without value)',
      'Microservices — each service is usually too small for layers',
      'When cross-cutting concerns dominate (logging, auth, caching)',
    ],
    realWorldExamples: [
      { company: 'Traditional Enterprise', useCase: 'Most Java/Spring or .NET enterprise apps follow N-tier (Controller → Service → Repository)' },
      { company: 'Django', useCase: 'MTV (Model-Template-View) framework naturally enforces layered architecture' },
      { company: 'Ruby on Rails', useCase: 'MVC pattern is a variant of layered architecture (Model → Controller → View)' },
    ],
    tradeoffs: {
      pros: [
        'Simple to understand — clear separation of concerns',
        'Well-known pattern — easy to onboard new developers',
        'Testable — can mock each layer for unit testing',
        'Layer independence — can swap implementations (e.g., change ORM)',
      ],
      cons: [
        'Can become a "big ball of mud" if layer boundaries aren\'t enforced',
        'Performance overhead — requests pass through all layers even when unnecessary',
        'Monolithic tendency — often deployed as a single unit',
        'Rigid — changes often cascade across multiple layers',
        'Pass-through layers add complexity without value',
      ],
    },
    interviewBuzzwords: [
      'separation of concerns', 'MVC', 'dependency inversion', 'layer isolation',
      'horizontal partitioning', 'data access layer',
    ],
    keyInsight: 'In interviews, mention that layered architecture is often the starting point, but it\'s important to enforce boundaries. Without discipline, layers leak and you get a "smart controller" anti-pattern where the presentation layer contains business logic.',
  },
  {
    id: 'hexagonal',
    name: 'Hexagonal (Ports & Adapters)',
    emoji: '⬡',
    category: 'Application Architecture',
    summary: 'Core business logic is isolated at the center, interacting with the outside world through ports (interfaces) and adapters (implementations). Dependencies point inward.',
    diagram: `
            ┌──── Adapters ────┐
            │                  │
  REST ─────┤   ┌──────────┐  ├───── PostgreSQL
  API       │   │   Core   │  │      Adapter
            │   │ Business │  │
  GraphQL ──┤   │  Logic   │  ├───── Redis
  Adapter   │   │ (Ports)  │  │      Adapter
            │   └──────────┘  │
  CLI ──────┤                  ├───── S3
  Adapter   └──────────────────┘      Adapter

     Driving Adapters ───▶ Core ◀─── Driven Adapters
    `,
    whenToUse: [
      'Domain logic is complex and needs protection from infrastructure changes',
      'Need to support multiple input channels (REST, GraphQL, CLI, events)',
      'Want to swap infrastructure (change DB, cache, or queue) without touching business logic',
      'Emphasis on testability — mock all external dependencies via ports',
    ],
    whenNotToUse: [
      'Simple CRUD — too much abstraction for basic operations',
      'Prototype/MVP where speed matters more than architecture',
      'Small services that don\'t have complex domain logic',
    ],
    realWorldExamples: [
      { company: 'Netflix', useCase: 'Hexagonal architecture in core platform services to swap implementations' },
      { company: 'Alistair Cockburn', useCase: 'Originally proposed the pattern; widely adopted in DDD communities' },
      { company: 'Enterprise Java', useCase: 'Spring applications using ports/adapters with dependency injection' },
    ],
    tradeoffs: {
      pros: [
        'Testability — core logic tested without any infrastructure',
        'Flexibility — swap databases, APIs, or messaging without changing business logic',
        'Domain focus — business logic is pure, not polluted by framework concerns',
        'Multiple entry points — same logic accessible via REST, CLI, events, tests',
      ],
      cons: [
        'More interfaces and abstractions — more code to write',
        'Learning curve — developers unfamiliar with DDD may struggle',
        'Over-engineering risk for simple applications',
        'Indirection — more hops to trace through code',
      ],
    },
    interviewBuzzwords: [
      'ports and adapters', 'dependency inversion', 'clean architecture', 'domain-driven design',
      'driving adapters', 'driven adapters', 'use case boundary',
    ],
    keyInsight: 'The key principle is "dependencies point inward" — the core domain never depends on infrastructure. This is the same principle behind Clean Architecture (Uncle Bob) and Onion Architecture. Mention this connection in interviews.',
  },
  {
    id: 'service-mesh',
    name: 'Service Mesh',
    emoji: '🕸️',
    category: 'Infrastructure Pattern',
    summary: 'A dedicated infrastructure layer that handles service-to-service communication, providing features like load balancing, encryption, observability, and resilience — without changing application code.',
    diagram: `
  ┌─────────────────────┐    ┌─────────────────────┐
  │ Service A           │    │ Service B           │
  │ ┌─────────────────┐ │    │ ┌─────────────────┐ │
  │ │   App Code      │ │    │ │   App Code      │ │
  │ └────────┬────────┘ │    │ └────────▲────────┘ │
  │ ┌────────▼────────┐ │    │ ┌────────┴────────┐ │
  │ │  Sidecar Proxy  │◀┼────┼▶│  Sidecar Proxy  │ │
  │ │  (Envoy)        │ │    │ │  (Envoy)        │ │
  │ └─────────────────┘ │    │ └─────────────────┘ │
  └─────────────────────┘    └─────────────────────┘
              │                         │
              └─────────┬───────────────┘
                  ┌─────▼─────┐
                  │Control Plane│ (Istio, Linkerd)
                  │ (config,   │
                  │  policies) │
                  └────────────┘
    `,
    whenToUse: [
      'Large microservices deployment (50+ services) needing uniform communication policies',
      'Need mTLS encryption between all services without code changes',
      'Require observability (distributed tracing, metrics) across services',
      'Complex traffic management (canary deployments, A/B testing, traffic splitting)',
      'Polyglot services — mesh handles communication regardless of language',
    ],
    whenNotToUse: [
      'Small number of services (< 10) — overhead isn\'t justified',
      'Monolithic application — no service-to-service communication',
      'Team lacks Kubernetes expertise (most meshes require K8s)',
      'Latency-critical paths where sidecar overhead matters (~1ms per hop)',
    ],
    realWorldExamples: [
      { company: 'Google', useCase: 'Created Istio; runs internal equivalent for all Google services' },
      { company: 'Uber', useCase: 'Uses service mesh for traffic management across 4000+ microservices' },
      { company: 'Lyft', useCase: 'Created Envoy proxy, now the standard sidecar in most service meshes' },
    ],
    tradeoffs: {
      pros: [
        'Zero-code networking features — mTLS, retries, timeouts, circuit breaking',
        'Uniform observability — distributed tracing and metrics for all services',
        'Traffic management — canary deploys, traffic splitting, fault injection',
        'Security — mTLS between all services, RBAC policies',
        'Language agnostic — works with any language since it\'s at the network layer',
      ],
      cons: [
        'Operational complexity — another layer to manage, debug, and upgrade',
        'Latency overhead — sidecar proxy adds ~1-3ms per hop',
        'Resource consumption — each sidecar uses CPU and memory',
        'Steep learning curve — Istio configuration is notoriously complex',
        'Debugging — network issues now involve proxy configuration',
      ],
    },
    interviewBuzzwords: [
      'sidecar proxy', 'Envoy', 'Istio', 'Linkerd', 'control plane', 'data plane',
      'mTLS', 'traffic splitting', 'canary deployment', 'observability',
    ],
    keyInsight: 'A service mesh separates application logic from networking logic. Think of it as a "smart network" for microservices. In interviews, mention the data plane (sidecars) vs control plane (configuration) distinction.',
  },
  {
    id: 'saga',
    name: 'Saga Pattern',
    emoji: '📖',
    category: 'Data Pattern',
    summary: 'Manage distributed transactions across multiple services using a sequence of local transactions, each with a compensating action for rollback.',
    diagram: `
  Choreography Saga:
  ┌────────┐  event   ┌────────┐  event   ┌────────┐
  │Order   │────────▶│Payment │────────▶│Shipping│
  │Service │         │Service │         │Service │
  └────┬───┘         └────┬───┘         └────┬───┘
       │ fail?            │ fail?            │ fail?
       ▼                  ▼                  ▼
  compensate         compensate         compensate
  (cancel order)     (refund)           (cancel ship)

  Orchestration Saga:
  ┌──────────────┐
  │ Saga         │──▶ Step 1: Create Order
  │ Orchestrator │──▶ Step 2: Process Payment
  │              │──▶ Step 3: Ship Order
  │              │──▶ On failure: run compensations in reverse
  └──────────────┘
    `,
    whenToUse: [
      'Distributed transactions spanning multiple microservices',
      'Long-running business processes (order → payment → shipping → delivery)',
      'When 2PC (two-phase commit) is too slow or not available',
      'Need to maintain data consistency across services without shared DB',
    ],
    whenNotToUse: [
      'Single database — just use ACID transactions',
      'Simple operations that don\'t span services',
      'When strong consistency is absolutely required (sagas provide eventual consistency)',
      'Compensations are not possible (e.g., sending an email can\'t be "undone")',
    ],
    realWorldExamples: [
      { company: 'Amazon', useCase: 'Order processing saga: reserve inventory → charge payment → ship (compensate: restock → refund → cancel)' },
      { company: 'Uber', useCase: 'Ride booking saga: match driver → start trip → process payment (compensate on failure at each step)' },
      { company: 'Booking.com', useCase: 'Reservation saga: hold room → charge card → confirm (compensate: release room → refund)' },
    ],
    tradeoffs: {
      pros: [
        'Enables distributed transactions without 2PC coordination',
        'Each service maintains ACID locally — simpler than distributed ACID',
        'Supports long-running processes that span minutes/hours',
        'Better availability than 2PC — no global lock',
        'Choreography version is fully decentralized',
      ],
      cons: [
        'Eventual consistency — intermediate states are visible to users',
        'Compensating transactions are hard to design and test',
        'Complex to debug — saga state spread across services',
        'Idempotency required — compensations may be retried',
        'Orchestrator can become a single point of failure (orchestration variant)',
        'No isolation — "dirty reads" of intermediate states possible',
      ],
    },
    interviewBuzzwords: [
      'compensating transaction', 'choreography vs orchestration', 'distributed transaction',
      'two-phase commit (2PC)', 'eventual consistency', 'idempotency', 'saga state machine',
    ],
    keyInsight: 'In interviews, always compare choreography (event-based, decentralized but hard to track) vs orchestration (central coordinator, easier to manage). Recommend orchestration for complex sagas with many steps, choreography for simple 2-3 step flows.',
  },
  {
    id: 'api-gateway',
    name: 'API Gateway',
    emoji: '🚪',
    category: 'Infrastructure Pattern',
    summary: 'Single entry point for all client requests, handling cross-cutting concerns like authentication, rate limiting, routing, and response aggregation.',
    diagram: `
  ┌────────┐  ┌────────┐  ┌────────┐
  │ Mobile │  │  Web   │  │ 3rd    │
  │  App   │  │  App   │  │ Party  │
  └───┬────┘  └───┬────┘  └───┬────┘
      └───────────┼───────────┘
            ┌─────▼─────┐
            │API Gateway│
            │• Auth     │
            │• Rate Limit│
            │• Routing  │
            │• Aggregate│
            └─────┬─────┘
       ┌──────────┼──────────┐
  ┌────▼───┐ ┌───▼────┐ ┌───▼────┐
  │User Svc│ │Order   │ │Product │
  │        │ │Svc     │ │Svc     │
  └────────┘ └────────┘ └────────┘
    `,
    whenToUse: [
      'Microservices architecture — single entry point simplifies client code',
      'Need centralized auth, rate limiting, and logging',
      'Different clients need different API shapes (BFF pattern)',
      'Response aggregation — combine data from multiple services in one call',
      'API versioning and traffic management',
    ],
    whenNotToUse: [
      'Simple monolithic application — not needed',
      'When it becomes a bottleneck or single point of failure',
      'Overly complex routing logic that should be in services',
    ],
    realWorldExamples: [
      { company: 'Netflix', useCase: 'Zuul gateway handles billions of requests/day, A/B testing, canary routing' },
      { company: 'Amazon', useCase: 'API Gateway service used by AWS customers; internally uses similar patterns' },
      { company: 'Kong', useCase: 'Open-source API gateway used by many companies for plugin-based API management' },
    ],
    tradeoffs: {
      pros: [
        'Centralized cross-cutting concerns — auth, logging, rate limiting in one place',
        'Client simplification — clients talk to one endpoint, not many services',
        'Response aggregation — reduce number of client-server round trips',
        'Protocol translation — REST externally, gRPC internally',
        'Versioning — handle API versioning at the gateway level',
      ],
      cons: [
        'Single point of failure — must be highly available',
        'Latency — adds a network hop to every request',
        'Bottleneck risk — all traffic flows through it',
        'Complexity — gateway routing logic can become complex',
        'Coupling — changes in services may require gateway updates',
      ],
    },
    interviewBuzzwords: [
      'BFF (Backend for Frontend)', 'reverse proxy', 'rate limiting', 'request aggregation',
      'API composition', 'Zuul', 'Kong', 'protocol translation', 'edge service',
    ],
    keyInsight: 'Mention the BFF (Backend for Frontend) variant: different API gateways for mobile vs web clients, each tailored to the client\'s needs. This is a common Netflix/Spotify pattern and shows depth in interviews.',
  },
  {
    id: 'strangler-fig',
    name: 'Strangler Fig (Migration)',
    emoji: '🌿',
    category: 'Migration Pattern',
    summary: 'Incrementally replace a legacy system by routing traffic between old and new implementations, gradually "strangling" the old system until it can be decommissioned.',
    diagram: `
  Phase 1:           Phase 2:           Phase 3:
  ┌────────┐         ┌────────┐         ┌────────┐
  │ Proxy/ │         │ Proxy/ │         │  New   │
  │ Router │         │ Router │         │ System │
  └───┬────┘         └───┬────┘         └────────┘
      │                 / \\
  ┌───▼────┐     ┌────▼─┐ ┌▼────┐
  │  Old   │     │ Old  │ │ New │      Old system
  │ System │     │(shrk)│ │(grow)│     decommissioned
  └────────┘     └──────┘ └─────┘
  100% old       50/50            100% new
    `,
    whenToUse: [
      'Migrating from monolith to microservices incrementally',
      'Replacing a legacy system without big-bang rewrite risk',
      'Need to keep serving users during migration (zero downtime)',
      'Risk mitigation — can roll back individual components',
    ],
    whenNotToUse: [
      'Small system that can be rewritten quickly',
      'Legacy system is well-understood and rewrite is straightforward',
      'No proxy/routing layer available to split traffic',
    ],
    realWorldExamples: [
      { company: 'Amazon', useCase: 'Migrated from monolith to services over many years using strangler fig approach' },
      { company: 'Shopify', useCase: 'Gradually extracting services from their Rails monolith' },
      { company: 'BBC', useCase: 'Migrated iPlayer from legacy to new platform using strangler fig pattern' },
    ],
    tradeoffs: {
      pros: [
        'Low risk — incremental migration, can stop at any point',
        'Zero downtime — users are served throughout migration',
        'Rollback capability — route traffic back to old system if new fails',
        'Team learning — team builds confidence with each migrated piece',
      ],
      cons: [
        'Longer migration timeline — can take months/years',
        'Routing complexity — proxy must manage old vs new correctly',
        'Data synchronization — may need to keep old and new DBs in sync during transition',
        'Cost — running two systems in parallel is more expensive',
        'Risk of "permanent strangler" — migration never completes',
      ],
    },
    interviewBuzzwords: [
      'incremental migration', 'legacy modernization', 'proxy routing', 'feature toggle',
      'parallel run', 'big-bang rewrite (anti-pattern)',
    ],
    keyInsight: 'In interviews, contrast this with "big-bang rewrite" — which almost always fails (Netscape Navigator being the classic cautionary tale). Strangler fig is the safe path. Named after a fig tree that grows around a host tree until it replaces it.',
  },
  {
    id: 'circuit-breaker',
    name: 'Circuit Breaker',
    emoji: '⚡',
    category: 'Resilience Pattern',
    summary: 'Prevent cascading failures by wrapping calls to downstream services. When failures exceed a threshold, the circuit "opens" and fails fast instead of waiting for timeouts.',
    diagram: `
          ┌─────────────────────────────────┐
          │        Circuit Breaker          │
          │                                 │
  Request │  CLOSED ──▶ OPEN ──▶ HALF-OPEN │
  ──────▶ │  (normal)  (reject) (test 1    │
          │    │         │       request)   │
          │    │ fails   │ timer  │         │
          │    │ > N     │expires │ success?│
          │    ▼         ▼       │ ──▶CLOSED│
          │  count++   fail fast │ fail?    │
          │             return   │ ──▶OPEN  │
          └─────────────────────────────────┘
    `,
    whenToUse: [
      'Calling unreliable external services or APIs',
      'Preventing cascade failures in microservices',
      'Downstream service has intermittent failures or high latency',
      'Need fast failure instead of slow timeout',
    ],
    whenNotToUse: [
      'Calling a local library or in-process component',
      'Operations where retry is better than failing fast',
      'Internal calls within a monolith',
    ],
    realWorldExamples: [
      { company: 'Netflix', useCase: 'Hystrix library (now deprecated in favor of Resilience4j) — pioneered circuit breaking in microservices' },
      { company: 'AWS', useCase: 'AWS SDK built-in circuit breakers for API calls to prevent hammering degraded services' },
      { company: 'Uber', useCase: 'Circuit breakers on payment service calls — fail fast and queue for retry vs blocking ride requests' },
    ],
    tradeoffs: {
      pros: [
        'Prevents cascading failures across services',
        'Fails fast — better UX than waiting for timeout',
        'Gives downstream service time to recover',
        'Provides fallback mechanism (cached data, default response)',
        'Reduces load on failing services',
      ],
      cons: [
        'Adds complexity to service calls',
        'Tuning thresholds is tricky — too sensitive = false opens, too lenient = slow detection',
        'Need monitoring to track circuit state',
        'Fallback logic must be designed for each endpoint',
        'Half-open state testing can cause request spikes',
      ],
    },
    interviewBuzzwords: [
      'Hystrix', 'Resilience4j', 'cascading failure', 'fail fast', 'fallback',
      'bulkhead', 'timeout', 'retry with exponential backoff', 'half-open state',
    ],
    keyInsight: 'Always pair circuit breaker with other resilience patterns in interviews: retries with exponential backoff, bulkhead (isolate pools), and timeouts. These together form the "resilience trinity" for microservices.',
  },
  {
    id: 'sidecar',
    name: 'Sidecar Pattern',
    emoji: '🏍️',
    category: 'Infrastructure Pattern',
    summary: 'Deploy a helper process alongside each service instance to handle cross-cutting concerns like logging, monitoring, networking, and security — without changing the service code.',
    diagram: `
  ┌──────────────────────────────┐
  │          Pod / Host          │
  │  ┌──────────┐ ┌───────────┐ │
  │  │  Main    │ │  Sidecar  │ │
  │  │  Service │ │  (proxy/  │ │
  │  │  (app)   │ │  logging/ │ │
  │  │          │ │  monitor) │ │
  │  └──────────┘ └───────────┘ │
  │    localhost communication   │
  └──────────────────────────────┘
    `,
    whenToUse: [
      'Adding observability (logging, tracing) without code changes',
      'Service mesh proxies (Envoy as sidecar)',
      'Polyglot services — add same capability to services in different languages',
      'Security (mTLS termination) as infrastructure concern',
    ],
    whenNotToUse: [
      'Simple applications that don\'t need the overhead',
      'When sidecar latency or resource consumption is unacceptable',
      'Capabilities better implemented as libraries in the service itself',
    ],
    realWorldExamples: [
      { company: 'Kubernetes/Istio', useCase: 'Envoy sidecar proxy injected into every pod for service mesh' },
      { company: 'Datadog', useCase: 'Agent runs as sidecar to collect logs, metrics, and traces from services' },
      { company: 'AWS App Mesh', useCase: 'Envoy sidecar for traffic management in ECS/EKS' },
    ],
    tradeoffs: {
      pros: [
        'Language agnostic — same sidecar works with any tech stack',
        'Separation of concerns — networking/observability separate from business logic',
        'Independent deployment — update sidecar without changing service',
        'Consistent behavior across all services',
      ],
      cons: [
        'Resource overhead — each sidecar consumes CPU/memory',
        'Latency — adds network hop (localhost, but still)',
        'Complexity — more moving parts to manage and debug',
        'Lifecycle management — sidecar must start before service',
      ],
    },
    interviewBuzzwords: [
      'sidecar proxy', 'Envoy', 'Kubernetes pod', 'service mesh data plane',
      'cross-cutting concerns', 'polyglot', 'DaemonSet vs Sidecar',
    ],
    keyInsight: 'The sidecar is the building block of service meshes. Understanding sidecars shows you understand how Istio/Linkerd work under the hood. In Kubernetes, a sidecar is simply another container in the same pod sharing the network namespace.',
  },
  {
    id: 'data-mesh',
    name: 'Data Mesh',
    emoji: '🗺️',
    category: 'Data Architecture',
    summary: 'Decentralized data architecture where domain teams own their data as products, with self-serve infrastructure and federated governance. Applies microservices principles to data.',
    diagram: `
  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
  │  Orders     │  │  Users      │  │  Payments   │
  │  Domain     │  │  Domain     │  │  Domain     │
  │ ┌─────────┐ │  │ ┌─────────┐ │  │ ┌─────────┐ │
  │ │  Data   │ │  │ │  Data   │ │  │ │  Data   │ │
  │ │ Product │ │  │ │ Product │ │  │ │ Product │ │
  │ └─────────┘ │  │ └─────────┘ │  │ └─────────┘ │
  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘
         └────────────────┼────────────────┘
              ┌───────────▼──────────┐
              │  Self-Serve Data    │
              │  Infrastructure     │
              │  + Federated Gov.   │
              └─────────────────────┘
    `,
    whenToUse: [
      'Large organizations with many data-producing domains',
      'Central data team is a bottleneck — domains should own their data',
      'Need for domain-specific data models and SLAs',
      'Data lake/warehouse has become a swamp — unclear ownership',
    ],
    whenNotToUse: [
      'Small organization with few domains',
      'Single team handles all data — no organizational need',
      'Limited data infrastructure maturity',
      'Domains don\'t have engineering capacity to manage data products',
    ],
    realWorldExamples: [
      { company: 'Zalando', useCase: 'Early adopter of data mesh, domains publish data products for analytics and ML' },
      { company: 'Netflix', useCase: 'Domain-oriented data pipelines where each team owns their data quality' },
      { company: 'Thoughtworks', useCase: 'Zhamak Dehghani coined data mesh; Thoughtworks promotes it as the future of data architecture' },
    ],
    tradeoffs: {
      pros: [
        'Domain ownership — teams closest to data manage it',
        'Scalable organization — no central data team bottleneck',
        'Data quality — domain experts define and maintain data contracts',
        'Agility — domains evolve data products independently',
      ],
      cons: [
        'Organizational change required — not just a tech pattern',
        'Duplication risk — multiple domains may store similar data',
        'Governance complexity — federated governance is harder than centralized',
        'Infrastructure cost — self-serve platform is expensive to build',
        'Cross-domain queries are harder without centralized warehouse',
      ],
    },
    interviewBuzzwords: [
      'data product', 'domain ownership', 'self-serve data infrastructure',
      'federated governance', 'data as a product', 'data contract', 'data catalog',
    ],
    keyInsight: 'Data mesh applies the four principles of microservices to data: domain ownership, data as a product, self-serve infrastructure, and federated governance. It\'s an organizational pattern more than a technical one — mention this nuance in interviews.',
  },
];
