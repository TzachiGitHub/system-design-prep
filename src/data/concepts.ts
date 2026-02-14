export interface Concept {
  id: string;
  name: string;
  emoji: string;
  summary: string;
  deepExplanation: string;
  examples: string[];
  interviewAngle: string;
}

export const concepts: Concept[] = [
  {
    id: 'cap-theorem',
    name: 'CAP Theorem',
    emoji: '🔺',
    summary: 'In a distributed system, you can only guarantee two of three: Consistency, Availability, and Partition Tolerance. Since network partitions are inevitable, the real choice is between CP and AP.',
    deepExplanation: `**Consistency (C):** Every read receives the most recent write or an error. All nodes see the same data at the same time.

**Availability (A):** Every request receives a non-error response, even if it might not be the most recent data.

**Partition Tolerance (P):** The system continues to operate despite network partitions (communication breakdowns between nodes).

**The Real Trade-off:** Network partitions WILL happen in distributed systems. So the actual choice is:
- **CP (Consistency + Partition Tolerance):** During a partition, the system may reject requests to maintain consistency. Example: a banking system that returns an error rather than showing stale balance.
- **AP (Availability + Partition Tolerance):** During a partition, the system continues serving requests but may return stale data. Example: a social media feed showing slightly outdated posts.

**PACELC Extension:** Even when there's no partition (E = Else), you still choose between Latency and Consistency. So it's: "If Partition, choose A or C; Else, choose L or C."`,
    examples: [
      'CP: Google Spanner (strongly consistent, may have higher latency), HBase, MongoDB (with majority reads), ZooKeeper',
      'AP: Cassandra (always writable, eventually consistent), DynamoDB (default), CouchDB, DNS',
      'CA (theoretical, no partition): Traditional single-node RDBMS (PostgreSQL on one server)',
      'Banking systems choose CP: better to show an error than a wrong balance',
      'Social media feeds choose AP: showing a slightly stale feed is better than showing nothing',
    ],
    interviewAngle: 'Don\'t just recite CAP — apply it to your design. Say: "For this use case, I\'d choose AP because availability is more important than showing the absolute latest data. A user seeing a tweet 2 seconds late is acceptable; the timeline being unavailable is not." Always justify YOUR choice for the specific system.',
  },
  {
    id: 'acid-vs-base',
    name: 'ACID vs BASE',
    emoji: '⚗️',
    summary: 'ACID guarantees strict transactional integrity (SQL databases). BASE embraces eventual consistency for availability and scalability (NoSQL databases).',
    deepExplanation: `**ACID:**
- **Atomicity:** Transaction is all-or-nothing. If any part fails, the entire transaction rolls back.
- **Consistency:** Transaction moves database from one valid state to another. Constraints are maintained.
- **Isolation:** Concurrent transactions don't interfere. Each transaction appears to run alone. Levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable.
- **Durability:** Once committed, data survives crashes (written to disk/WAL).

**BASE:**
- **Basically Available:** System guarantees availability (per CAP theorem).
- **Soft State:** State may change over time, even without input (due to eventual consistency).
- **Eventually Consistent:** Given enough time without new updates, all replicas converge to the same state.

**Key Insight:** ACID is pessimistic (lock, validate, then proceed). BASE is optimistic (proceed, reconcile later). ACID is essential for financial transactions; BASE is acceptable for social media feeds, product catalogs, and analytics.`,
    examples: [
      'ACID: Bank transfers (debit account A and credit account B must be atomic), PostgreSQL, MySQL',
      'BASE: Shopping cart in DynamoDB (cart eventually consistent across regions), Cassandra',
      'ACID: Inventory deduction at checkout (must not oversell)',
      'BASE: View counters on YouTube (slightly inaccurate count is fine)',
      'Hybrid: Stripe processes payments with ACID locally, then propagates events with eventual consistency',
    ],
    interviewAngle: 'When choosing a database, explicitly state: "I need ACID guarantees here because [financial data/inventory/etc]" or "BASE is acceptable here because [eventual consistency is fine for social feeds/analytics/etc]." This shows you understand the trade-off, not just the acronyms.',
  },
  {
    id: 'consistency-models',
    name: 'Consistency Models',
    emoji: '🔄',
    summary: 'Different guarantees about when and how updates become visible to readers: strong (immediate), eventual (eventually), and causal (preserves cause-and-effect order).',
    deepExplanation: `**Strong Consistency:** After a write completes, all subsequent reads (from any node) return the updated value. Simplest to reason about but highest latency (requires coordination between nodes).

**Eventual Consistency:** After a write, replicas will converge to the same value "eventually" (typically milliseconds to seconds). No guarantee on when. Reads may return stale data temporarily.

**Causal Consistency:** If event A causes event B, everyone sees A before B. But concurrent events (no causal relationship) can be seen in different orders by different observers. Stronger than eventual, weaker than strong.

**Read-Your-Writes:** A specific user always sees their own writes immediately. Others may see it later. Common compromise.

**Monotonic Reads:** Once you've read a value, you won't see an older value in subsequent reads. Prevents "going back in time."

**Linearizability:** Strongest form — appears as if there's only one copy of data, operations are atomic, and results are ordered in real-time. Gold standard but expensive.`,
    examples: [
      'Strong: Google Spanner (TrueTime, globally consistent), ZooKeeper leader reads',
      'Eventual: DNS propagation, Cassandra (tunable), DynamoDB (default)',
      'Causal: MongoDB causal consistency sessions, COPS system',
      'Read-Your-Writes: Facebook — you see your own post immediately; friends see it eventually',
      'Tunable: Cassandra lets you choose per-query (ONE, QUORUM, ALL)',
    ],
    interviewAngle: 'Use "tunable consistency" as a power move: "We can use Cassandra with QUORUM reads and writes for strong consistency on critical paths (e.g., payments), and ONE for eventual consistency on read-heavy paths (e.g., feed)." This shows sophisticated understanding.',
  },
  {
    id: 'availability-patterns',
    name: 'Availability Patterns',
    emoji: '🛡️',
    summary: 'Strategies to keep systems running despite failures: failover (switch to backup), replication (multiple copies), and redundancy (no single point of failure).',
    deepExplanation: `**Active-Passive Failover:** Primary handles traffic, standby waits. On primary failure, standby takes over. Downtime during switchover (seconds to minutes). Simpler but wastes standby resources.

**Active-Active:** Multiple nodes handle traffic simultaneously. On failure, remaining nodes absorb the load. No downtime, better resource utilization, but more complex (need load balancing, conflict resolution).

**Replication:**
- **Leader-Follower (Master-Slave):** Leader handles writes, followers serve reads. Follower can be promoted on leader failure. Most common pattern.
- **Leader-Leader (Multi-Master):** Multiple leaders accept writes. Need conflict resolution (last-write-wins, vector clocks). Used for multi-region.
- **Leaderless:** Quorum-based (Cassandra, DynamoDB). Write to W nodes, read from R nodes, where W + R > N ensures consistency.

**Availability Math:** 99.9% = 8.76 hours downtime/year. 99.99% = 52.6 minutes/year. 99.999% = 5.26 minutes/year. Two components in sequence: multiply availabilities. Two in parallel: 1 - (1-A)².`,
    examples: [
      'Active-Passive: Traditional database failover with Amazon RDS Multi-AZ',
      'Active-Active: Multi-region deployment with DynamoDB Global Tables',
      'Leader-Follower: PostgreSQL streaming replication for read scaling',
      'Leaderless: Cassandra quorum reads/writes (W=2, R=2, N=3)',
      'DNS failover: Route 53 health checks route traffic away from unhealthy regions',
    ],
    interviewAngle: 'When asked about availability, always quantify: "For 99.99% availability, we need active-active across multiple AZs with automated failover. The single-AZ setup gives us ~99.95%." Also mention: eliminating single points of failure (SPOF) — every component should have redundancy.',
  },
  {
    id: 'scalability',
    name: 'Scalability (Vertical vs Horizontal)',
    emoji: '📈',
    summary: 'Vertical scaling (scale up) adds more power to existing machines. Horizontal scaling (scale out) adds more machines. Modern systems favor horizontal for elasticity.',
    deepExplanation: `**Vertical Scaling (Scale Up):**
- Add more CPU, RAM, disk to existing server
- Simpler — no distributed system concerns
- Has a ceiling — there's a biggest machine you can buy
- Single point of failure
- Example: Upgrading from 8GB to 256GB RAM

**Horizontal Scaling (Scale Out):**
- Add more machines to the pool
- No theoretical ceiling — add as many as needed
- Requires distributed system design (load balancing, data partitioning)
- Better fault tolerance (lose one of many)
- Example: Going from 2 servers to 20 servers

**What to Scale Horizontally:**
- Stateless application servers (behind load balancer) — easiest
- Read replicas for databases
- Cache nodes (Redis cluster)
- Worker pools for async processing

**What's Harder to Scale Horizontally:**
- Databases (need sharding, which adds complexity)
- Stateful services (need sticky sessions or externalized state)
- Services with strong consistency requirements`,
    examples: [
      'Vertical: Stack Overflow runs on just a few very powerful servers',
      'Horizontal: Netflix runs thousands of EC2 instances across regions',
      'Hybrid: Scale DB vertically to a point, then shard horizontally when needed',
      'Auto-scaling: AWS Auto Scaling Groups add/remove instances based on CPU/traffic',
      'Kubernetes HPA: Horizontal Pod Autoscaler scales pods based on metrics',
    ],
    interviewAngle: 'Default answer: "Application servers scale horizontally behind a load balancer. For the database, we start with vertical scaling and read replicas, and shard when we outgrow a single master." This shows pragmatism. Always mention auto-scaling for handling traffic spikes.',
  },
  {
    id: 'latency-vs-throughput',
    name: 'Latency vs Throughput',
    emoji: '⏱️',
    summary: 'Latency is the time for a single operation. Throughput is the number of operations per unit time. Optimizing one often trades off with the other.',
    deepExplanation: `**Latency:** Time from request sent to response received. Measured in milliseconds. Users experience latency directly. Percentiles matter: p50 (median), p95, p99. Amazon found every 100ms of latency cost 1% in sales.

**Throughput:** Number of operations completed per second. Measured in QPS (queries per second), RPS (requests per second), or TPS (transactions per second).

**The Trade-off:**
- Batching increases throughput but increases latency (wait to fill the batch)
- Caching reduces latency but doesn't directly increase throughput (still same compute)
- Parallel processing increases throughput but may increase individual request latency (resource contention)
- Compression reduces network latency but increases CPU time

**Tail Latency (p99, p999):** The slowest 1% or 0.1% of requests. Critical at scale: if you make 100 service calls, the p99 of ANY call being slow is: 1 - (0.99)^100 = 63%. This is why tail latency matters more than average.`,
    examples: [
      'Kafka: batches messages for throughput (trades latency for throughput)',
      'Redis: sub-millisecond latency for cache hits (optimizes latency)',
      'Database connection pooling: improves throughput by reusing connections',
      'CDN: reduces latency by serving from edge (closer to user)',
      'gRPC: binary protocol reduces latency vs REST/JSON',
    ],
    interviewAngle: 'Always ask: "Is this system latency-sensitive (user-facing API) or throughput-sensitive (batch processing pipeline)?" This shapes your design. For user-facing: optimize p99 latency. For data pipelines: optimize throughput. Mention tail latency amplification for microservices.',
  },
  {
    id: 'sql-vs-nosql',
    name: 'SQL vs NoSQL',
    emoji: '🔀',
    summary: 'SQL databases provide ACID, structured schemas, and powerful queries. NoSQL databases offer flexibility, horizontal scaling, and high performance for specific access patterns.',
    deepExplanation: `**Choose SQL when:**
- Data is relational (users → orders → items)
- Need complex queries with JOINs
- ACID transactions required (financial data)
- Schema is well-defined and stable
- Data integrity is critical

**Choose NoSQL when:**
- Schema is flexible or evolving rapidly
- Need horizontal scaling for massive write throughput
- Access pattern is simple (key lookup, document retrieval)
- Eventual consistency is acceptable
- Working with semi-structured data (JSON, logs)

**NoSQL Types and When:**
- **Key-Value (Redis, DynamoDB):** Session storage, caching, simple lookups
- **Document (MongoDB):** Product catalogs, user profiles, content management
- **Wide-Column (Cassandra):** Time-series, IoT, write-heavy analytics
- **Graph (Neo4j):** Social networks, fraud detection, recommendations

**The Pragmatic Answer:** Most systems use BOTH. PostgreSQL for transactional data, Redis for caching, Elasticsearch for search, Cassandra for analytics. This is polyglot persistence.`,
    examples: [
      'Twitter: MySQL for user data (relational), Redis for timeline cache, Elasticsearch for search',
      'Uber: PostgreSQL for trip data, Cassandra for driver locations (high write volume)',
      'Netflix: MySQL for billing (ACID needed), Cassandra for viewing history (write-heavy, eventual consistency OK)',
      'Instagram: PostgreSQL for user data, Cassandra for feed storage',
    ],
    interviewAngle: 'Don\'t pick one — use both. Say: "For the core transactional data (users, orders), I\'d use PostgreSQL for ACID guarantees. For the high-write-volume activity feed, I\'d use Cassandra. For search, Elasticsearch. For caching, Redis." This is polyglot persistence and shows maturity.',
  },
  {
    id: 'sync-vs-async',
    name: 'Synchronous vs Asynchronous',
    emoji: '🔁',
    summary: 'Synchronous: caller waits for response. Asynchronous: caller continues without waiting, response comes later. Async improves resilience and throughput at the cost of complexity.',
    deepExplanation: `**Synchronous (Request-Response):**
- Client sends request, blocks waiting for response
- Simple to reason about and debug
- Tight coupling: caller depends on callee being available
- Timeout issues: slow downstream = slow upstream
- Use for: user-facing APIs where immediate response needed

**Asynchronous (Message-Based):**
- Client sends message to a queue, continues immediately
- Producer and consumer are decoupled in time
- Consumer processes when ready (backpressure handling)
- Retry and DLQ for failure handling
- Use for: background processing, notifications, analytics events

**Async Patterns:**
- Fire-and-forget: send message, don't care about result (logging, analytics)
- Request-reply over messaging: send request with correlation ID, consumer responds to reply queue
- Webhook: register a callback URL, get notified when processing completes
- Polling: client periodically checks if result is ready

**The Hybrid Approach:** Accept request synchronously (return 202 Accepted + task ID), process asynchronously, client polls for result or gets webhook callback.`,
    examples: [
      'Sync: Stripe payment API — charge card and return result immediately',
      'Async: Sending email after user registration — queue it, don\'t block the response',
      'Async: Image/video processing — upload returns immediately, processing happens in background',
      'Hybrid: Order placement returns 202, order processing is async, user polls for status',
      'Webhook: GitHub sends webhook to your server when a push event occurs',
    ],
    interviewAngle: 'For any operation that takes > 500ms or isn\'t needed for the response, make it async. Say: "The user places an order → we synchronously validate and return 201 Created. Then asynchronously: charge payment, send confirmation email, update inventory, notify shipping. The user doesn\'t need to wait for all that."',
  },
  {
    id: 'stateful-vs-stateless',
    name: 'Stateful vs Stateless',
    emoji: '💾',
    summary: 'Stateless services store no client state between requests — any instance can handle any request. Stateful services maintain state, making scaling and failover harder.',
    deepExplanation: `**Stateless:**
- No state stored on the server between requests
- Any instance can handle any request
- Easy to scale horizontally — just add more instances
- Easy failover — if one instance dies, others pick up seamlessly
- State is externalized: stored in database, cache (Redis), or passed by the client (JWT)

**Stateful:**
- Server maintains state between requests (session data, WebSocket connections)
- Requires sticky sessions (route same client to same server) or state synchronization
- Harder to scale and failover
- Sometimes necessary: WebSocket connections, in-memory caches, game servers

**Making Stateful Services Stateless:**
- Move session data to Redis (centralized session store)
- Use JWTs for authentication (client carries the state)
- Use external state stores for any in-memory state
- Use database for workflow state`,
    examples: [
      'Stateless: REST API servers behind a load balancer — any server handles any request',
      'Stateful: WebSocket chat server — client has persistent connection to specific server',
      'Solution: Store chat state in Redis, use pub/sub for cross-server communication',
      'JWT: Client carries auth token, server doesn\'t need session storage',
      'Kubernetes: Stateless apps use Deployments, stateful apps use StatefulSets',
    ],
    interviewAngle: 'Always design application servers as stateless. Say: "I\'ll externalize all state to Redis/database so application servers are stateless and can scale horizontally behind a load balancer. If a server dies, the next request goes to any other server seamlessly."',
  },
  {
    id: 'batch-vs-stream',
    name: 'Batch vs Stream Processing',
    emoji: '🌊',
    summary: 'Batch processes large volumes of data periodically (MapReduce, Spark). Stream processes data in real-time as it arrives (Kafka Streams, Flink). Lambda architecture combines both.',
    deepExplanation: `**Batch Processing:**
- Process large volumes of accumulated data on a schedule (hourly, daily)
- High throughput, high latency (results available after batch completes)
- Ideal for: analytics, reporting, ETL, ML training
- Technologies: Hadoop MapReduce, Apache Spark, AWS EMR

**Stream Processing:**
- Process data record-by-record as it arrives
- Low latency (real-time or near-real-time), but lower throughput per record
- Ideal for: real-time dashboards, fraud detection, alerting, live recommendations
- Technologies: Apache Kafka Streams, Apache Flink, Apache Storm, AWS Kinesis

**Lambda Architecture:** Run both batch and stream in parallel. Batch provides accurate but delayed results (batch layer). Stream provides fast but approximate results (speed layer). Merge at serving layer. Complex to maintain.

**Kappa Architecture:** Simplify by using only stream processing for everything. Replay the event log for reprocessing (instead of batch). Simpler, but requires capable streaming framework.`,
    examples: [
      'Batch: Netflix nightly recommendation model training on viewing history',
      'Stream: Uber real-time surge pricing based on live supply/demand data',
      'Batch: Daily sales report aggregation from data warehouse',
      'Stream: Fraud detection — analyze each transaction in real-time',
      'Lambda: LinkedIn — batch for accurate analytics, stream for real-time counters',
    ],
    interviewAngle: 'Ask yourself: "Does the user need this data in real-time or is a daily/hourly update fine?" Real-time user notifications → stream. Monthly sales report → batch. Activity feed → stream for recent, batch for backfill. Mention Kappa architecture as a simpler alternative to Lambda.',
  },
  {
    id: 'estimation-guide',
    name: 'Back-of-Envelope Estimation',
    emoji: '🧮',
    summary: 'Quick math to estimate system requirements: traffic, storage, bandwidth, and compute. Essential for the "capacity estimation" step in system design interviews.',
    deepExplanation: `**The Process:**
1. Start with users: DAU (Daily Active Users)
2. Estimate actions per user per day
3. Calculate QPS: (DAU × actions) / 86400 seconds
4. Peak QPS: typically 2-5× average QPS
5. Storage: data per action × actions per day × retention period
6. Bandwidth: data per request × QPS

**Key Numbers to Memorize:**
- 1 day = 86,400 seconds ≈ 100K seconds (for easy math)
- 1 million requests/day ≈ 12 QPS
- 1 billion requests/day ≈ 12K QPS
- 1 char = 1 byte (ASCII), 1 char = 2-4 bytes (Unicode/UTF-8 for non-ASCII)
- 1 image (compressed) ≈ 200KB-1MB
- 1 minute of video ≈ 50MB (720p) to 150MB (1080p)
- Average tweet ≈ 300 bytes
- Average web page ≈ 2MB

**Common Estimates:**
- Twitter: 500M tweets/day ≈ 6K writes/sec, 600K reads/sec (100:1 read:write)
- URL shortener: 100M URLs/day ≈ 1200 writes/sec
- Chat message: ~100 bytes per message
- User profile: ~1KB

**Rounding is OK!** The point is getting the right order of magnitude, not exact numbers. 86400 ≈ 100000 is fine.`,
    examples: [
      'URL Shortener: 100M new URLs/day → 1200 QPS write, 12K QPS read (10:1). Each URL = 100 bytes → 10GB/day → 3.6TB/year',
      'Twitter: 500M tweets/day, avg 300 bytes → 150GB/day. 200M DAU × 100 timeline reads/day → 23K QPS reads',
      'Chat: 50M DAU × 40 messages/day = 2B messages → 200GB/day (100 bytes/msg). 23K QPS average, 70K peak',
      'Video: 500 hours uploaded/min → 30K hours/day. At 50MB/min = 1.5TB/min of raw storage',
    ],
    interviewAngle: 'Walk through estimation out loud: "Let me estimate... 100M DAU, each views 10 pages, that\'s 1B page views/day. Divided by 100K seconds, that\'s 10K QPS average. With 3x peak factor, we need to handle 30K QPS." Round aggressively — interviewers care about the approach, not exact math.',
  },
];
