import type { RoadmapNode } from '../types';

export const roadmapNodes: RoadmapNode[] = [
  // ── Fundamentals ──
  {
    id: 'cap-theorem',
    title: 'CAP Theorem',
    category: 'fundamentals',
    description: 'Consistency, Availability, Partition Tolerance — pick two.',
    content: `In a distributed system you can only guarantee two of three properties:\n\n**Consistency (C):** Every read receives the most recent write or an error.\n\n**Availability (A):** Every request gets a non-error response.\n\n**Partition Tolerance (P):** The system works despite network partitions.\n\nSince partitions are inevitable, the real choice is CP vs AP.\n\n**CP** — reject requests during a partition to stay consistent (e.g., banking).\n**AP** — serve requests with potentially stale data (e.g., social feeds).`,
    tips: [
      'Don\'t just recite CAP — apply it: "I choose AP here because…"',
      'Mention PACELC as a more nuanced model.',
      'Real systems aren\'t purely CP or AP; they make per-operation trade-offs.',
    ],
    relatedIds: ['consistency-patterns', 'databases'],
    quizQuestions: [
      { question: 'Which CAP property is always required in a distributed system?', options: ['Consistency', 'Availability', 'Partition Tolerance', 'Durability'], correctIndex: 2, explanation: 'Network partitions are inevitable, so Partition Tolerance is always needed.' },
      { question: 'A social media feed that shows slightly stale posts during a partition is an example of?', options: ['CP system', 'AP system', 'CA system', 'ACID system'], correctIndex: 1, explanation: 'It favours Availability over Consistency — classic AP.' },
    ],
  },
  {
    id: 'acid-base',
    title: 'ACID vs BASE',
    category: 'fundamentals',
    description: 'Strict transactional integrity vs eventual consistency.',
    content: `**ACID** (SQL databases):\n- **Atomicity** — all or nothing\n- **Consistency** — valid state transitions\n- **Isolation** — concurrent txns don't interfere\n- **Durability** — committed data survives crashes\n\n**BASE** (NoSQL):\n- **Basically Available** — always responds\n- **Soft State** — state may change without input\n- **Eventually Consistent** — converges over time\n\nChoose ACID when correctness matters (payments). Choose BASE when availability & scale matter (analytics, feeds).`,
    tips: [
      'Isolation levels matter — know Read Committed vs Serializable.',
      'Many modern databases (CockroachDB, Spanner) offer ACID at scale.',
    ],
    relatedIds: ['cap-theorem', 'databases'],
    quizQuestions: [
      { question: 'Which ACID property ensures a transaction is all-or-nothing?', options: ['Consistency', 'Isolation', 'Atomicity', 'Durability'], correctIndex: 2, explanation: 'Atomicity means the entire transaction succeeds or rolls back.' },
    ],
  },
  {
    id: 'networking-basics',
    title: 'Networking Basics',
    category: 'fundamentals',
    description: 'TCP/IP, HTTP, DNS, WebSockets — the foundation.',
    content: `**TCP** — reliable, ordered byte stream. 3-way handshake.\n**UDP** — unreliable, fast. Good for video/gaming.\n**HTTP/1.1** — request/response, keep-alive.\n**HTTP/2** — multiplexed streams, header compression.\n**HTTP/3** — QUIC (UDP-based), faster handshake.\n**WebSockets** — full-duplex persistent connection.\n**DNS** — translates domain names to IPs. Hierarchical caching.`,
    tips: [
      'Know when to use WebSockets vs polling vs SSE.',
      'DNS can be used for load balancing (round-robin DNS).',
    ],
    relatedIds: ['load-balancers', 'cdn'],
    quizQuestions: [
      { question: 'Which protocol is HTTP/3 built on?', options: ['TCP', 'UDP/QUIC', 'SCTP', 'WebSocket'], correctIndex: 1, explanation: 'HTTP/3 uses QUIC, which runs over UDP.' },
    ],
  },
  {
    id: 'scalability',
    title: 'Scalability',
    category: 'fundamentals',
    description: 'Vertical vs horizontal scaling, stateless design.',
    content: `**Vertical Scaling** — bigger machine (limited ceiling).\n**Horizontal Scaling** — more machines (preferred for web).\n\nKey principles:\n- **Stateless services** — any instance can handle any request\n- **Shared-nothing architecture** — nodes don't share memory/disk\n- **Data partitioning** — split data across nodes\n- **Replication** — copies for read throughput & fault tolerance\n\nAmdahl's Law: speedup limited by the serial fraction of work.`,
    tips: [
      'Always start with the simplest approach; scale when needed.',
      'Horizontal scaling requires solving distributed coordination.',
    ],
    relatedIds: ['load-balancers', 'databases', 'consistent-hashing'],
    quizQuestions: [
      { question: 'Which scaling approach adds more machines?', options: ['Vertical', 'Horizontal', 'Diagonal', 'Elastic'], correctIndex: 1, explanation: 'Horizontal scaling = adding more machines.' },
    ],
  },
  {
    id: 'latency-throughput',
    title: 'Latency & Throughput',
    category: 'fundamentals',
    description: 'Numbers every engineer should know.',
    content: `**Key latencies:**\n- L1 cache: ~1 ns\n- RAM: ~100 ns\n- SSD random read: ~16 μs\n- HDD seek: ~4 ms\n- Same datacenter round-trip: ~0.5 ms\n- Cross-continent: ~150 ms\n\n**Throughput** = requests/second the system handles.\n**Bandwidth** = max data transfer rate.\n\nLittle's Law: L = λ × W (avg items = arrival rate × avg time in system).`,
    tips: [
      'Memorize the orders of magnitude, not exact numbers.',
      'Use these to do back-of-envelope calculations in interviews.',
    ],
    relatedIds: ['caching', 'cdn'],
    quizQuestions: [
      { question: 'Roughly how long is a cross-continent network round-trip?', options: ['1 ms', '15 ms', '150 ms', '1500 ms'], correctIndex: 2, explanation: 'Cross-continent RTT is roughly 100–150 ms.' },
    ],
  },

  // ── Building Blocks ──
  {
    id: 'load-balancers',
    title: 'Load Balancers',
    category: 'building-blocks',
    description: 'Distribute traffic across servers.',
    content: `**Layer 4 (Transport)** — routes based on IP/port. Fast, no content inspection.\n**Layer 7 (Application)** — routes based on HTTP headers, URL, cookies. More flexible.\n\n**Algorithms:**\n- Round Robin / Weighted Round Robin\n- Least Connections\n- IP Hash (sticky sessions)\n- Consistent Hashing\n\n**Health checks** — periodic probes remove unhealthy backends.\n\nExamples: AWS ALB/NLB, Nginx, HAProxy, Envoy.`,
    tips: [
      'L7 is slower but enables content-based routing, SSL termination, etc.',
      'Mention health checks — interviewers love hearing about failure handling.',
    ],
    relatedIds: ['scalability', 'networking-basics', 'cdn'],
    quizQuestions: [
      { question: 'Which LB layer can route based on HTTP headers?', options: ['Layer 3', 'Layer 4', 'Layer 7', 'Layer 2'], correctIndex: 2, explanation: 'Layer 7 (Application) LBs inspect HTTP content.' },
    ],
  },
  {
    id: 'databases',
    title: 'Databases',
    category: 'building-blocks',
    description: 'SQL vs NoSQL, replication, partitioning.',
    content: `**SQL** — relational, ACID, schemas, joins. Great for structured data.\n**NoSQL types:**\n- Key-Value (Redis, DynamoDB)\n- Document (MongoDB)\n- Wide-Column (Cassandra, HBase)\n- Graph (Neo4j)\n\n**Replication:** Leader-follower, multi-leader, leaderless.\n**Partitioning:** Range, hash, composite.\n**Indexes:** B-tree (reads), LSM-tree (writes).`,
    tips: [
      'Don\'t say "NoSQL is faster" — it depends on the access pattern.',
      'Justify your DB choice with the read/write ratio and consistency needs.',
    ],
    relatedIds: ['acid-base', 'consistent-hashing', 'caching'],
    quizQuestions: [
      { question: 'Which index structure is optimized for write-heavy workloads?', options: ['B-tree', 'LSM-tree', 'Hash index', 'Bitmap index'], correctIndex: 1, explanation: 'LSM-trees batch writes to memory then flush — great for writes.' },
    ],
  },
  {
    id: 'caching',
    title: 'Caching',
    category: 'building-blocks',
    description: 'Speed up reads with in-memory data stores.',
    content: `**Levels:** Browser → CDN → API Gateway → Application → Database query cache.\n\n**Strategies:**\n- **Cache-Aside** — app checks cache, falls back to DB, populates cache\n- **Read-Through** — cache loads from DB automatically\n- **Write-Through** — write to cache + DB simultaneously\n- **Write-Behind** — write to cache, async flush to DB\n\n**Eviction:** LRU, LFU, TTL.\n\n**Tools:** Redis, Memcached.`,
    tips: [
      'Always discuss cache invalidation — it\'s the hard part.',
      'Mention thundering herd: use locks or request coalescing.',
    ],
    relatedIds: ['latency-throughput', 'databases', 'cdn'],
    quizQuestions: [
      { question: 'In Cache-Aside, who is responsible for populating the cache?', options: ['The cache itself', 'The database', 'The application', 'The CDN'], correctIndex: 2, explanation: 'In cache-aside, the application checks the cache and populates it on a miss.' },
    ],
  },
  {
    id: 'message-queues',
    title: 'Message Queues',
    category: 'building-blocks',
    description: 'Async communication between services.',
    content: `**Queue** — point-to-point, one consumer gets each message (SQS, RabbitMQ).\n**Pub/Sub** — one message, many subscribers (Kafka, SNS).\n**Event Streaming** — ordered, durable log (Kafka, Pulsar).\n\n**Benefits:**\n- Decouples producers & consumers\n- Handles traffic spikes (buffering)\n- Enables retry & dead-letter queues\n\n**Guarantees:** At-most-once, at-least-once, exactly-once (hard!).`,
    tips: [
      'Kafka for high-throughput ordered events; SQS for simple task queues.',
      'Idempotent consumers handle at-least-once delivery safely.',
    ],
    relatedIds: ['event-driven', 'microservices'],
    quizQuestions: [
      { question: 'Which delivery guarantee is hardest to achieve?', options: ['At-most-once', 'At-least-once', 'Exactly-once', 'Best-effort'], correctIndex: 2, explanation: 'Exactly-once requires coordination between producer, broker, and consumer.' },
    ],
  },
  {
    id: 'cdn',
    title: 'CDN',
    category: 'building-blocks',
    description: 'Content Delivery Networks — serve content from the edge.',
    content: `**Push CDN** — you upload content proactively.\n**Pull CDN** — CDN fetches on first request, caches.\n\n**Benefits:** Lower latency, reduced origin load, DDoS mitigation.\n\nEdge locations worldwide. Cache static assets (images, JS, CSS) and even dynamic content (edge compute).\n\nExamples: CloudFront, Cloudflare, Akamai, Fastly.`,
    tips: [
      'Use pull CDN for most web apps; push for large static catalogs.',
      'Mention cache invalidation strategies (versioned URLs, purge APIs).',
    ],
    relatedIds: ['caching', 'latency-throughput', 'load-balancers'],
    quizQuestions: [
      { question: 'Which CDN type fetches content on the first request?', options: ['Push CDN', 'Pull CDN', 'Hybrid CDN', 'Edge CDN'], correctIndex: 1, explanation: 'Pull CDNs lazily fetch and cache content on the first request.' },
    ],
  },
  {
    id: 'consistent-hashing',
    title: 'Consistent Hashing',
    category: 'building-blocks',
    description: 'Distribute data with minimal redistribution when nodes change.',
    content: `**Problem:** Simple hash(key) % N breaks when N changes — massive redistribution.\n\n**Solution:** Hash ring. Nodes and keys mapped to a circle. Key goes to the next node clockwise.\n\n**Virtual nodes** — each physical node gets multiple positions on the ring for better balance.\n\nWhen a node joins/leaves, only K/N keys move (K=total keys, N=nodes).\n\nUsed by: DynamoDB, Cassandra, Memcached, Akamai.`,
    tips: [
      'Always mention virtual nodes — without them, distribution is uneven.',
      'Great answer for "how would you partition this data?"',
    ],
    relatedIds: ['databases', 'scalability', 'caching'],
    quizQuestions: [
      { question: 'What problem do virtual nodes solve?', options: ['Network latency', 'Uneven data distribution', 'Cache invalidation', 'Leader election'], correctIndex: 1, explanation: 'Virtual nodes spread each physical node across the ring for balanced distribution.' },
    ],
  },

  // ── Patterns ──
  {
    id: 'microservices',
    title: 'Microservices',
    category: 'patterns',
    description: 'Decompose into independently deployable services.',
    content: `**Monolith → Microservices:**\n- Each service owns its data and logic\n- Communicates via APIs or events\n- Independently deployable and scalable\n\n**Challenges:**\n- Distributed transactions (Saga pattern)\n- Service discovery\n- Network latency & partial failures\n- Data consistency across services\n\n**When to use:** Large teams, different scaling needs per component, polyglot tech stacks.`,
    tips: [
      'Start with a monolith, extract services when complexity demands it.',
      'Mention the Saga pattern for cross-service transactions.',
    ],
    relatedIds: ['message-queues', 'event-driven', 'api-gateway'],
    quizQuestions: [
      { question: 'What pattern handles distributed transactions across microservices?', options: ['Two-Phase Commit', 'Saga', 'CQRS', 'Circuit Breaker'], correctIndex: 1, explanation: 'Saga uses a sequence of local transactions with compensating actions.' },
    ],
  },
  {
    id: 'event-driven',
    title: 'Event-Driven Architecture',
    category: 'patterns',
    description: 'React to events instead of direct calls.',
    content: `**Components:**\n- **Event Producer** — emits events (user clicked, order placed)\n- **Event Broker** — routes events (Kafka, EventBridge)\n- **Event Consumer** — reacts to events\n\n**Patterns:**\n- Event Notification — lightweight signal\n- Event-Carried State Transfer — event contains full data\n- Event Sourcing — store all events as the source of truth\n- CQRS — separate read and write models\n\n**Benefits:** Loose coupling, scalability, audit trail.`,
    tips: [
      'Event sourcing + CQRS is powerful but complex — justify the complexity.',
      'Idempotency is crucial in event-driven systems.',
    ],
    relatedIds: ['message-queues', 'microservices', 'cqrs'],
    quizQuestions: [
      { question: 'In Event Sourcing, what is the source of truth?', options: ['Current state in DB', 'The event log', 'A snapshot', 'The cache'], correctIndex: 1, explanation: 'Event sourcing stores all state changes as an immutable event log.' },
    ],
  },
  {
    id: 'cqrs',
    title: 'CQRS',
    category: 'patterns',
    description: 'Separate read and write models for different optimization.',
    content: `**Command Query Responsibility Segregation:**\n- **Write side** — validates and processes commands, stores events\n- **Read side** — optimized projections/views for queries\n\nThe read model is eventually consistent with the write model.\n\n**When useful:**\n- Read and write workloads have very different patterns\n- Need different data models for reading vs writing\n- High read-to-write ratio\n\nOften paired with Event Sourcing.`,
    tips: [
      'CQRS adds complexity — only use when read/write patterns truly differ.',
      'The read model can use a completely different database (e.g., Elasticsearch).',
    ],
    relatedIds: ['event-driven', 'databases'],
    quizQuestions: [
      { question: 'What is the main benefit of CQRS?', options: ['Stronger consistency', 'Independent optimization of reads and writes', 'Simpler codebase', 'Reduced storage'], correctIndex: 1, explanation: 'CQRS lets you optimize the read and write paths independently.' },
    ],
  },
  {
    id: 'api-gateway',
    title: 'API Gateway',
    category: 'patterns',
    description: 'Single entry point for all client requests.',
    content: `**Responsibilities:**\n- Request routing to backend services\n- Authentication & authorization\n- Rate limiting & throttling\n- Response aggregation (BFF pattern)\n- SSL termination\n- Request/response transformation\n- Caching\n\n**Examples:** Kong, AWS API Gateway, Zuul, Envoy.\n\n**BFF (Backend for Frontend):** Separate gateways per client type (web, mobile, IoT).`,
    tips: [
      'API Gateway can become a single point of failure — discuss redundancy.',
      'BFF pattern is great when mobile and web need different response shapes.',
    ],
    relatedIds: ['microservices', 'load-balancers', 'rate-limiting'],
    quizQuestions: [
      { question: 'What does BFF stand for in the API Gateway context?', options: ['Best Friend Forever', 'Backend for Frontend', 'Binary Format Framework', 'Buffered File Fetcher'], correctIndex: 1, explanation: 'BFF = Backend for Frontend — a gateway tailored to each client type.' },
    ],
  },
  {
    id: 'rate-limiting',
    title: 'Rate Limiting',
    category: 'patterns',
    description: 'Protect services from being overwhelmed.',
    content: `**Algorithms:**\n- **Token Bucket** — tokens added at fixed rate; request costs a token\n- **Leaky Bucket** — requests queue and drain at fixed rate\n- **Fixed Window** — count requests per time window\n- **Sliding Window Log** — track timestamps of recent requests\n- **Sliding Window Counter** — hybrid of fixed window + log\n\n**Where:** API Gateway, per-service, per-user, per-IP.\n\n**Response:** HTTP 429 Too Many Requests + Retry-After header.`,
    tips: [
      'Token bucket is the most commonly used — know it well.',
      'Distributed rate limiting needs a shared store (Redis).',
    ],
    relatedIds: ['api-gateway', 'caching'],
    quizQuestions: [
      { question: 'Which algorithm adds tokens at a fixed rate?', options: ['Leaky Bucket', 'Fixed Window', 'Token Bucket', 'Sliding Log'], correctIndex: 2, explanation: 'Token Bucket refills tokens at a steady rate.' },
    ],
  },
  {
    id: 'consistency-patterns',
    title: 'Consistency Patterns',
    category: 'patterns',
    description: 'Strong, eventual, and causal consistency models.',
    content: `**Strong Consistency** — reads always return the latest write. Requires coordination (slower).\n\n**Eventual Consistency** — reads may return stale data, but the system converges. Faster, more available.\n\n**Causal Consistency** — operations that are causally related are seen in order. A sweet middle ground.\n\n**Read-your-writes** — a user always sees their own updates.\n\n**Monotonic reads** — you never see older data after seeing newer data.\n\nChoose based on user expectations and business requirements.`,
    tips: [
      'Most web apps need read-your-writes, not full strong consistency.',
      'Eventual consistency is fine for many use cases — quantify "how eventual".',
    ],
    relatedIds: ['cap-theorem', 'databases', 'cqrs'],
    quizQuestions: [
      { question: 'Which consistency model guarantees you always see your own writes?', options: ['Strong', 'Eventual', 'Read-your-writes', 'Causal'], correctIndex: 2, explanation: 'Read-your-writes ensures a user sees their own updates immediately.' },
    ],
  },

  // ── Problems ──
  {
    id: 'design-url-shortener',
    title: 'Design URL Shortener',
    category: 'problems',
    description: 'TinyURL / Bit.ly — generate short links and redirect.',
    content: `**Requirements:**\n- Shorten a URL → 7-char code\n- Redirect short URL → original\n- Analytics (click count)\n- High read throughput (100:1 read:write)\n\n**Key Decisions:**\n- **ID Generation:** Base62 encoding of auto-increment ID, or MD5/SHA hash truncated\n- **Storage:** Key-value store (DynamoDB) or SQL with index on short_code\n- **Caching:** Redis for hot URLs (80/20 rule)\n- **Scaling:** Stateless service + DB sharding by hash\n\n**Back-of-envelope:** 100M URLs/month = ~40 writes/sec, 4000 reads/sec.`,
    tips: [
      'Discuss collision handling if using hash truncation.',
      'Mention custom aliases and expiration as features.',
    ],
    relatedIds: ['databases', 'caching', 'consistent-hashing'],
    quizQuestions: [
      { question: 'What encoding gives the shortest URL codes?', options: ['Base16', 'Base36', 'Base62', 'Base64'], correctIndex: 2, explanation: 'Base62 (a-z, A-Z, 0-9) maximizes info per character without special chars.' },
    ],
  },
  {
    id: 'design-chat-system',
    title: 'Design Chat System',
    category: 'problems',
    description: 'WhatsApp / Slack — real-time messaging at scale.',
    content: `**Requirements:**\n- 1:1 and group messaging\n- Online/offline status\n- Message history & search\n- Push notifications\n- Read receipts\n\n**Architecture:**\n- **WebSocket servers** for real-time delivery\n- **Message queue** (Kafka) for reliable delivery\n- **Chat storage:** Cassandra (write-heavy, time-series)\n- **User presence:** Redis with TTL heartbeats\n- **Push:** FCM/APNs for offline users\n\n**Key challenge:** Ordering in group chats (vector clocks or server-assigned timestamps).`,
    tips: [
      'Start with 1:1, then extend to groups.',
      'Discuss how to handle the user being on multiple devices.',
    ],
    relatedIds: ['message-queues', 'databases', 'networking-basics'],
    quizQuestions: [
      { question: 'Which protocol is best for real-time chat?', options: ['HTTP polling', 'Long polling', 'WebSockets', 'SMTP'], correctIndex: 2, explanation: 'WebSockets provide full-duplex persistent connections — ideal for chat.' },
    ],
  },
  {
    id: 'design-newsfeed',
    title: 'Design News Feed',
    category: 'problems',
    description: 'Facebook / Twitter feed — fanout and ranking.',
    content: `**Two approaches:**\n\n**Fan-out on Write (Push):**\n- When user posts, push to all followers' feeds\n- Fast reads, slow writes\n- Problem: celebrities with millions of followers\n\n**Fan-out on Read (Pull):**\n- Build feed at read time by querying followed users\n- Slow reads, fast writes\n\n**Hybrid:** Push for normal users, pull for celebrities.\n\n**Ranking:** ML model scores posts by relevance, recency, engagement.\n\n**Storage:** Feed cache in Redis (sorted set by timestamp/score).`,
    tips: [
      'The hybrid approach is the expected answer.',
      'Discuss the celebrity problem explicitly — shows depth.',
    ],
    relatedIds: ['caching', 'message-queues', 'databases'],
    quizQuestions: [
      { question: 'Which fanout model has the "celebrity problem"?', options: ['Fan-out on Read', 'Fan-out on Write', 'Both equally', 'Neither'], correctIndex: 1, explanation: 'Fan-out on Write must push to millions of followers for celebrity posts.' },
    ],
  },
  {
    id: 'design-rate-limiter',
    title: 'Design Rate Limiter',
    category: 'problems',
    description: 'Build a distributed rate limiter service.',
    content: `**Requirements:**\n- Limit requests per user/IP/API key\n- Distributed (multiple servers)\n- Low latency overhead\n- Configurable rules\n\n**Architecture:**\n- **Rules engine** — load rules from config DB\n- **Counter store** — Redis (INCR + EXPIRE, or sorted sets for sliding window)\n- **Middleware** — intercepts requests before hitting the service\n\n**Algorithm choice:** Token Bucket (flexible, allows bursts) or Sliding Window Counter (smoother).\n\n**Race conditions:** Use Redis Lua scripts for atomic check-and-increment.`,
    tips: [
      'Discuss where to place the limiter (client, server, middleware, API gateway).',
      'Mention race conditions in distributed counters — Lua scripts solve it.',
    ],
    relatedIds: ['rate-limiting', 'caching', 'api-gateway'],
    quizQuestions: [
      { question: 'How to avoid race conditions in distributed rate limiting with Redis?', options: ['Optimistic locking', 'Lua scripts', 'Mutex locks', 'Two-phase commit'], correctIndex: 1, explanation: 'Redis Lua scripts execute atomically — perfect for check-and-increment.' },
    ],
  },
];
