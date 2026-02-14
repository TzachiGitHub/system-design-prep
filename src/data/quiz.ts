// System Design Quiz Questions

export interface QuizQuestion {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const quizQuestions: QuizQuestion[] = [
  // === PATTERNS (1-15) ===
  {
    id: 1,
    category: "patterns",
    question: "Which pattern is best for handling 1000x more reads than writes?",
    options: ["CQRS", "Saga Pattern", "Two-Phase Commit", "Circuit Breaker"],
    correctIndex: 0,
    explanation: "CQRS (Command Query Responsibility Segregation) separates read and write models, allowing you to independently scale and optimize each side. Read replicas can be denormalized for fast queries."
  },
  {
    id: 2,
    category: "patterns",
    question: "What does consistent hashing primarily solve?",
    options: ["Data encryption", "Minimizing redistribution when nodes change", "SQL query optimization", "Message ordering"],
    correctIndex: 1,
    explanation: "Consistent hashing maps both data and nodes onto a ring. When a node is added/removed, only ~1/N of keys need to be remapped, unlike modular hashing where almost everything moves."
  },
  {
    id: 3,
    category: "patterns",
    question: "In the Circuit Breaker pattern, what happens in the 'half-open' state?",
    options: ["All requests are blocked", "A limited number of test requests are allowed through", "The circuit is fully restored", "Requests are queued indefinitely"],
    correctIndex: 1,
    explanation: "Half-open allows a few trial requests to check if the downstream service has recovered. If they succeed, the circuit closes (normal). If they fail, it opens again."
  },
  {
    id: 4,
    category: "patterns",
    question: "Which pattern ensures data consistency across microservices without distributed transactions?",
    options: ["Sharding", "Saga Pattern", "Load Balancing", "CDN"],
    correctIndex: 1,
    explanation: "The Saga pattern breaks a distributed transaction into a sequence of local transactions, each with a compensating action for rollback. It avoids 2PC's blocking nature."
  },
  {
    id: 5,
    category: "patterns",
    question: "What is the main benefit of event sourcing?",
    options: ["Faster reads", "Complete audit trail and ability to reconstruct state", "Reduced storage costs", "Simpler codebase"],
    correctIndex: 1,
    explanation: "Event sourcing stores every state change as an immutable event. You can rebuild state at any point in time, get a full audit log, and replay events for debugging or migration."
  },
  {
    id: 6,
    category: "patterns",
    question: "Write-ahead logging (WAL) is primarily used for:",
    options: ["Caching", "Crash recovery and durability", "Load balancing", "Service discovery"],
    correctIndex: 1,
    explanation: "WAL writes changes to a log before applying them to the database. If the system crashes mid-operation, it can replay the log to recover to a consistent state."
  },
  {
    id: 7,
    category: "patterns",
    question: "Which strategy does a Bloom filter use?",
    options: ["Exact membership lookup", "Probabilistic membership test (no false negatives)", "B-tree indexing", "Hash table with chaining"],
    correctIndex: 1,
    explanation: "A Bloom filter uses multiple hash functions to set bits. It can definitively say 'not in set' (no false negatives) but may say 'possibly in set' (false positives). Space-efficient for large datasets."
  },
  {
    id: 8,
    category: "patterns",
    question: "What does the 'fan-out on write' approach do in a news feed system?",
    options: ["Fetches posts at read time", "Pre-computes and pushes posts to all followers' feeds at write time", "Compresses data before writing", "Batches writes for efficiency"],
    correctIndex: 1,
    explanation: "Fan-out on write (push model) pre-computes feeds when a post is created, writing it to each follower's feed cache. Fast reads, but expensive for users with millions of followers."
  },
  {
    id: 9,
    category: "patterns",
    question: "The Bulkhead pattern is analogous to:",
    options: ["A ship's watertight compartments", "A highway toll booth", "A power grid transformer", "A water filter"],
    correctIndex: 0,
    explanation: "Like a ship's bulkheads that prevent flooding from sinking the entire vessel, the Bulkhead pattern isolates failures to specific components so one failing service doesn't bring down the system."
  },
  {
    id: 10,
    category: "patterns",
    question: "In a leader-follower replication setup, what is 'split-brain'?",
    options: ["When data is sharded evenly", "When two nodes both think they are the leader", "When a follower falls behind", "When the leader runs out of memory"],
    correctIndex: 1,
    explanation: "Split-brain occurs during network partitions when two nodes both believe they are the leader, potentially accepting conflicting writes. Quorum-based approaches and fencing tokens prevent this."
  },
  {
    id: 11,
    category: "patterns",
    question: "What is the primary advantage of the Sidecar pattern?",
    options: ["Faster database queries", "Decoupling cross-cutting concerns from application code", "Reducing network latency", "Simplifying database schema"],
    correctIndex: 1,
    explanation: "The Sidecar pattern deploys helper components (logging, monitoring, TLS) alongside the main service as a separate process/container. The application stays focused on business logic."
  },
  {
    id: 12,
    category: "patterns",
    question: "Exponential backoff with jitter is used to:",
    options: ["Speed up retries", "Prevent thundering herd on retries", "Compress retry payloads", "Route retries to different servers"],
    correctIndex: 1,
    explanation: "Without jitter, retries from many clients happen at the same intervals, causing load spikes. Adding randomness (jitter) spreads retries over time, preventing thundering herd."
  },
  {
    id: 13,
    category: "patterns",
    question: "What is the 'outbox pattern' used for?",
    options: ["Storing sent emails", "Reliably publishing events after a database transaction", "Managing outgoing API calls", "Buffering write requests"],
    correctIndex: 1,
    explanation: "The outbox pattern writes events to an outbox table in the same transaction as the business data. A separate process reads the outbox and publishes events, ensuring at-least-once delivery."
  },
  {
    id: 14,
    category: "patterns",
    question: "Which pattern helps handle requests that take a long time to process?",
    options: ["Circuit Breaker", "Async Request-Reply with polling/callback", "Rate Limiting", "Connection Pooling"],
    correctIndex: 1,
    explanation: "For long-running tasks, accept the request immediately (return 202 Accepted with a status URL), process in background, and let clients poll for completion or receive a callback."
  },
  {
    id: 15,
    category: "patterns",
    question: "What is the key insight behind the 'lease' mechanism in distributed caching?",
    options: ["It grants temporary exclusive access to prevent stale sets", "It compresses cache entries", "It replicates data to multiple caches", "It encrypts cached data"],
    correctIndex: 0,
    explanation: "A lease (used by Facebook's Memcache) gives a client a token on cache miss. Only the holder can set the value, preventing thundering herd and stale data from racing writes."
  },

  // === BUILDING BLOCKS (16-30) ===
  {
    id: 16,
    category: "building-blocks",
    question: "Which load balancing algorithm is best for servers with different capacities?",
    options: ["Round Robin", "Weighted Round Robin", "Random", "IP Hash"],
    correctIndex: 1,
    explanation: "Weighted Round Robin assigns more requests to servers with higher capacity. A server with weight 3 gets 3x the traffic of a server with weight 1."
  },
  {
    id: 17,
    category: "building-blocks",
    question: "What is the main difference between L4 and L7 load balancers?",
    options: ["L4 is faster, L7 is slower", "L4 operates on transport layer (TCP/UDP), L7 on application layer (HTTP)", "L4 is software, L7 is hardware", "No meaningful difference"],
    correctIndex: 1,
    explanation: "L4 load balancers route based on IP/port (fast, no content inspection). L7 load balancers can inspect HTTP headers, URLs, cookies — enabling content-based routing, SSL termination, etc."
  },
  {
    id: 18,
    category: "building-blocks",
    question: "What does a CDN primarily reduce?",
    options: ["Database load", "Latency for static content by serving from edge locations", "CPU usage on application servers", "Memory consumption"],
    correctIndex: 1,
    explanation: "CDNs cache static content (images, CSS, JS, videos) at edge servers worldwide. Users get content from the nearest edge, dramatically reducing latency."
  },
  {
    id: 19,
    category: "building-blocks",
    question: "What is the CAP theorem?",
    options: ["Cache, API, Protocol", "You can only guarantee 2 of 3: Consistency, Availability, Partition tolerance", "Centralized Application Processing", "Continuous Availability Protocol"],
    correctIndex: 1,
    explanation: "CAP theorem states that in a distributed system during a network partition, you must choose between Consistency (all nodes see same data) and Availability (every request gets a response)."
  },
  {
    id: 20,
    category: "building-blocks",
    question: "Redis is single-threaded. How does it achieve ~100K QPS?",
    options: ["Multithreading", "In-memory operations + I/O multiplexing (epoll)", "GPU acceleration", "Distributed processing"],
    correctIndex: 1,
    explanation: "Redis keeps all data in memory (no disk I/O for reads), uses efficient data structures, and leverages I/O multiplexing (epoll/kqueue) to handle many connections in a single thread."
  },
  {
    id: 21,
    category: "building-blocks",
    question: "What is the purpose of a message queue like Kafka?",
    options: ["Direct synchronous communication", "Decoupling producers and consumers with async, durable messaging", "Database replication", "Static file serving"],
    correctIndex: 1,
    explanation: "Message queues decouple services — producers write messages without knowing consumers. This enables async processing, load leveling, fault tolerance, and independent scaling."
  },
  {
    id: 22,
    category: "building-blocks",
    question: "Horizontal scaling means:",
    options: ["Adding more CPU/RAM to one machine", "Adding more machines to handle load", "Optimizing code", "Using a faster network"],
    correctIndex: 1,
    explanation: "Horizontal scaling (scale out) adds more machines. Vertical scaling (scale up) adds more resources to one machine. Horizontal is preferred for large systems as it has no single-machine ceiling."
  },
  {
    id: 23,
    category: "building-blocks",
    question: "What is database sharding?",
    options: ["Replicating data across nodes", "Partitioning data across multiple databases based on a shard key", "Caching database queries", "Compressing database files"],
    correctIndex: 1,
    explanation: "Sharding splits data across multiple databases. Each shard holds a subset of data (e.g., users A-M on shard 1, N-Z on shard 2). Enables horizontal scaling but adds complexity for cross-shard queries."
  },
  {
    id: 24,
    category: "building-blocks",
    question: "What problem does a distributed lock (e.g., Redlock) solve?",
    options: ["Data encryption", "Ensuring only one process accesses a shared resource at a time", "Load balancing", "Data compression"],
    correctIndex: 1,
    explanation: "Distributed locks prevent race conditions when multiple services need exclusive access to a resource. Redlock uses multiple Redis instances to achieve fault-tolerant locking."
  },
  {
    id: 25,
    category: "building-blocks",
    question: "What is the role of a reverse proxy?",
    options: ["Connects users to the internet", "Sits in front of servers, forwarding client requests", "Encrypts database connections", "Manages DNS records"],
    correctIndex: 1,
    explanation: "A reverse proxy (e.g., Nginx) sits between clients and servers, providing load balancing, SSL termination, caching, compression, and protection from direct exposure."
  },
  {
    id: 26,
    category: "building-blocks",
    question: "SSDs are faster than HDDs primarily because:",
    options: ["They use more electricity", "No mechanical seek time — direct electronic access", "They have larger capacity", "They use better compression"],
    correctIndex: 1,
    explanation: "SSDs use flash memory with no moving parts. HDDs have a spinning disk and mechanical arm that must physically move to read data (seek time ~10ms vs ~0.1ms for SSD)."
  },
  {
    id: 27,
    category: "building-blocks",
    question: "What is the purpose of an API Gateway?",
    options: ["Database management", "Single entry point for microservices: routing, auth, rate limiting, aggregation", "File storage", "Email delivery"],
    correctIndex: 1,
    explanation: "An API Gateway is the front door for microservices. It handles cross-cutting concerns: authentication, rate limiting, request routing, response aggregation, and protocol translation."
  },
  {
    id: 28,
    category: "building-blocks",
    question: "Gossip protocol is used for:",
    options: ["Encrypted communication", "Spreading information across nodes in a decentralized way", "SQL query execution", "File compression"],
    correctIndex: 1,
    explanation: "Gossip protocol spreads information by having each node randomly share state with a few peers, who share with others. Eventually all nodes converge. Used by Cassandra, DynamoDB for membership and failure detection."
  },
  {
    id: 29,
    category: "building-blocks",
    question: "What is a write-through cache?",
    options: ["Writes go to cache only", "Writes go to both cache and database simultaneously", "Writes go to database only, cache is updated on read", "Writes are batched and sent to database later"],
    correctIndex: 1,
    explanation: "Write-through writes to cache AND database on every write. Ensures cache is always consistent but adds write latency. Compare: write-back (cache only, async DB), write-around (DB only, cache on read miss)."
  },
  {
    id: 30,
    category: "building-blocks",
    question: "ZooKeeper is primarily used for:",
    options: ["Web serving", "Distributed coordination: leader election, config management, service discovery", "Image processing", "Email routing"],
    correctIndex: 1,
    explanation: "ZooKeeper provides primitives for distributed coordination: leader election, distributed locks, configuration management, and service discovery. Used by Kafka, HBase, and many distributed systems."
  },

  // === CONCEPTS (31-45) ===
  {
    id: 31,
    category: "concepts",
    question: "What does 'eventual consistency' mean?",
    options: ["Data is always consistent", "Given enough time without new updates, all replicas will converge to the same value", "Data is never consistent", "Consistency is guaranteed within 1 second"],
    correctIndex: 1,
    explanation: "Eventual consistency means that if no new writes occur, all replicas will eventually return the same value. The window of inconsistency depends on replication lag. Used by DynamoDB, Cassandra."
  },
  {
    id: 32,
    category: "concepts",
    question: "What is the difference between latency and throughput?",
    options: ["They are the same thing", "Latency is time per request, throughput is requests per unit time", "Latency is for writes, throughput is for reads", "Throughput is always higher than latency"],
    correctIndex: 1,
    explanation: "Latency = how long a single request takes (e.g., 50ms). Throughput = how many requests the system handles per second (e.g., 10K QPS). You can have low latency but low throughput, or vice versa."
  },
  {
    id: 33,
    category: "concepts",
    question: "What is a hot partition (hot spot)?",
    options: ["A server running at high temperature", "Uneven data/load distribution where one shard gets disproportionate traffic", "A recently created partition", "An encrypted partition"],
    correctIndex: 1,
    explanation: "Hot partitions occur when certain keys (e.g., celebrity user, popular item) concentrate load on one shard. Solutions: add salt/prefix to keys, use separate handling for hot keys."
  },
  {
    id: 34,
    category: "concepts",
    question: "Idempotency in APIs means:",
    options: ["Requests are encrypted", "Making the same request multiple times produces the same result", "Requests are processed in order", "Requests are cached"],
    correctIndex: 1,
    explanation: "An idempotent operation produces the same result regardless of how many times it's called. Critical for retries — PUT and DELETE should be idempotent. Achieved with idempotency keys."
  },
  {
    id: 35,
    category: "concepts",
    question: "What is the 'thundering herd' problem?",
    options: ["Too many database connections", "Many clients simultaneously requesting the same expired/missing cache entry", "Servers running out of memory", "Network congestion"],
    correctIndex: 1,
    explanation: "When a popular cache entry expires, hundreds of concurrent requests all miss cache and hit the database simultaneously. Solutions: locking, lease-based approaches, staggered expiration."
  },
  {
    id: 36,
    category: "concepts",
    question: "What is the difference between vertical and horizontal partitioning?",
    options: ["No difference", "Vertical splits by columns, horizontal splits by rows", "Vertical is faster", "Horizontal uses more memory"],
    correctIndex: 1,
    explanation: "Vertical partitioning splits a table by columns (e.g., move blob data to a separate table). Horizontal partitioning (sharding) splits by rows (e.g., users 1-1M on shard 1, 1M-2M on shard 2)."
  },
  {
    id: 37,
    category: "concepts",
    question: "What does 'data denormalization' trade off?",
    options: ["Security for speed", "Write complexity and storage for faster reads", "Reads for writes", "Nothing — it's always better"],
    correctIndex: 1,
    explanation: "Denormalization duplicates data to avoid expensive JOINs. Faster reads but: more storage, write amplification (must update all copies), and risk of inconsistency. Common in read-heavy systems."
  },
  {
    id: 38,
    category: "concepts",
    question: "What is a vector clock used for?",
    options: ["Measuring time precisely", "Tracking causality and detecting conflicts in distributed systems", "Encrypting timestamps", "Scheduling cron jobs"],
    correctIndex: 1,
    explanation: "Vector clocks track the causal ordering of events across nodes. Each node maintains a counter. By comparing vectors, you can determine if events are causally related or concurrent (conflicting)."
  },
  {
    id: 39,
    category: "concepts",
    question: "What is tail latency (p99)?",
    options: ["Average response time", "The latency experienced by the slowest 1% of requests", "Maximum possible latency", "Network latency only"],
    correctIndex: 1,
    explanation: "p99 latency means 99% of requests are faster than this value. At scale, tail latency matters — with 100 parallel calls, there's a 63% chance at least one hits p99. Jeff Dean calls this the 'tail at scale' problem."
  },
  {
    id: 40,
    category: "concepts",
    question: "What is the purpose of a checksum in distributed systems?",
    options: ["Access control", "Detecting data corruption during storage or transfer", "Compressing data", "Encrypting data"],
    correctIndex: 1,
    explanation: "Checksums (CRC, MD5, SHA) verify data integrity. When data is stored or transmitted, the checksum is computed and stored. On retrieval, recompute and compare — any mismatch means corruption."
  },
  {
    id: 41,
    category: "concepts",
    question: "What does 'graceful degradation' mean?",
    options: ["The system crashes gracefully", "The system continues operating with reduced functionality under stress", "The system shuts down slowly", "The system logs errors gracefully"],
    correctIndex: 1,
    explanation: "Graceful degradation means the system still works (possibly with fewer features) under failure. Example: if recommendations service is down, show trending items instead. Better than total failure."
  },
  {
    id: 42,
    category: "concepts",
    question: "What is the benefit of immutable data?",
    options: ["Uses less storage", "No concurrency issues, simpler reasoning, easy caching", "Faster writes", "Better encryption"],
    correctIndex: 1,
    explanation: "Immutable data never changes once written. Benefits: no locks needed (no concurrent modification), perfect for caching (never stale), easy replication, complete history. Used in event sourcing, append-only logs."
  },
  {
    id: 43,
    category: "concepts",
    question: "What is back-pressure in a distributed system?",
    options: ["Network compression", "A mechanism for slow consumers to signal producers to slow down", "Data backup strategy", "Reverse DNS lookup"],
    correctIndex: 1,
    explanation: "Back-pressure prevents overwhelming slow components. When a consumer can't keep up, it signals the producer to slow down or starts rejecting. Without it, queues grow unbounded and the system OOMs."
  },
  {
    id: 44,
    category: "concepts",
    question: "What is a quorum in distributed systems?",
    options: ["A type of database", "The minimum number of nodes that must agree for an operation to succeed", "A network protocol", "A caching strategy"],
    correctIndex: 1,
    explanation: "A quorum is typically a majority (N/2 + 1). For writes to succeed on W nodes and reads on R nodes, if W + R > N, you get strong consistency. Example: 3 replicas, W=2, R=2."
  },
  {
    id: 45,
    category: "concepts",
    question: "What is the difference between push and pull architectures?",
    options: ["Push is faster", "Push: server sends data to clients; Pull: clients request data from server", "Pull is more reliable", "No functional difference"],
    correctIndex: 1,
    explanation: "Push (e.g., WebSockets, fan-out on write): server proactively sends. Good for real-time. Pull (e.g., HTTP polling, fan-out on read): client requests. Good for infrequent reads. Many systems use hybrid."
  },

  // === PROBLEMS (46-60) ===
  {
    id: 46,
    category: "problems",
    question: "For a URL shortener, what is a good approach for generating unique short URLs?",
    options: ["Random strings with collision check", "Base62 encoding of an auto-incrementing ID or pre-generated unique ID", "MD5 hash of the URL", "Use the domain name"],
    correctIndex: 1,
    explanation: "Base62 encoding of a unique counter/ID (from a distributed ID generator like Snowflake) gives predictable, collision-free short URLs. 7 chars of base62 = 62^7 ≈ 3.5 trillion URLs."
  },
  {
    id: 47,
    category: "problems",
    question: "In designing a chat system, which protocol is best for real-time messaging?",
    options: ["HTTP polling", "WebSockets for bidirectional real-time communication", "FTP", "SMTP"],
    correctIndex: 1,
    explanation: "WebSockets provide full-duplex, persistent connections — ideal for real-time chat. HTTP polling wastes resources, long-polling is better but still half-duplex. WebSockets are the standard for chat."
  },
  {
    id: 48,
    category: "problems",
    question: "For a video streaming platform, what is adaptive bitrate streaming?",
    options: ["Always streaming at max quality", "Dynamically adjusting video quality based on user's network bandwidth", "Compressing all videos to one bitrate", "Streaming audio and video separately"],
    correctIndex: 1,
    explanation: "Adaptive bitrate (ABR) streaming (e.g., HLS, DASH) encodes videos at multiple quality levels. The player monitors bandwidth and switches quality in real-time for smooth playback without buffering."
  },
  {
    id: 49,
    category: "problems",
    question: "In a rate limiter, what is the 'token bucket' algorithm?",
    options: ["Tokens are generated randomly", "A bucket holds tokens added at fixed rate; each request costs a token; empty bucket = rejected", "Tokens are purchased by users", "A bucket stores request data"],
    correctIndex: 1,
    explanation: "Token bucket adds tokens at a fixed rate (e.g., 10/sec). Each request removes one token. If the bucket is empty, request is rejected. Bucket size allows bursts up to the bucket capacity."
  },
  {
    id: 50,
    category: "problems",
    question: "What is the key challenge in designing a web crawler?",
    options: ["HTML parsing", "Politeness, deduplication, and handling the massive scale of the web", "CSS rendering", "JavaScript execution"],
    correctIndex: 1,
    explanation: "Key challenges: politeness (respecting robots.txt, rate limiting per domain), URL deduplication (billions of URLs), handling traps (infinite loops), prioritization, and distributed coordination."
  },
  {
    id: 51,
    category: "problems",
    question: "For a ride-sharing system, how do you efficiently find nearby drivers?",
    options: ["Scan all drivers", "Use geospatial indexing (Geohash, Quadtree, or R-tree)", "Sort drivers by name", "Use a simple SQL query"],
    correctIndex: 1,
    explanation: "Geospatial indexes like Geohash (converts 2D coords to 1D string, nearby points share prefixes), Quadtree, or R-tree enable efficient proximity queries. Much faster than scanning all drivers."
  },
  {
    id: 52,
    category: "problems",
    question: "In a notification system, why use a message queue?",
    options: ["To slow down notifications", "To decouple notification generation from delivery, enable retries, and handle spikes", "To encrypt notifications", "To reduce notification count"],
    correctIndex: 1,
    explanation: "Message queues decouple producers from delivery handlers (push, SMS, email). They buffer spikes, enable retries for failed deliveries, and allow independent scaling of each notification channel."
  },
  {
    id: 53,
    category: "problems",
    question: "For a key-value store, what data structure gives O(1) reads and writes?",
    options: ["B-tree", "Hash table (hash map)", "Binary search tree", "Linked list"],
    correctIndex: 1,
    explanation: "Hash tables provide O(1) average-case lookups and inserts. In-memory KV stores (like Redis) use hash tables as the primary data structure. On-disk stores often use LSM trees for write-optimized workloads."
  },
  {
    id: 54,
    category: "problems",
    question: "In a payment system, why is idempotency critical?",
    options: ["For faster processing", "To prevent duplicate charges when retrying failed requests", "For encryption", "For load balancing"],
    correctIndex: 1,
    explanation: "Network failures can cause retries. Without idempotency, a user could be charged twice. An idempotency key (unique per transaction) ensures that retrying produces the same result — exactly-once semantics."
  },
  {
    id: 55,
    category: "problems",
    question: "How does Google Maps calculate the shortest route?",
    options: ["Brute force all paths", "Modified Dijkstra's/A* with precomputed hierarchical decomposition", "Random path selection", "Straight-line distance"],
    correctIndex: 1,
    explanation: "Google Maps uses algorithms like A* (with heuristics) and Contraction Hierarchies that precompute shortcuts. The road network is a weighted graph. Real-time traffic data adjusts edge weights."
  },
  {
    id: 56,
    category: "problems",
    question: "For a news feed, what is the 'hybrid' approach?",
    options: ["Mix of SQL and NoSQL", "Fan-out on write for regular users, fan-out on read for celebrities", "Combine push and pull CDN", "Mix of HTTP and WebSocket"],
    correctIndex: 1,
    explanation: "Hybrid approach: push (fan-out on write) for normal users (fast reads), but pull (fan-out on read) for celebrities with millions of followers (avoids writing to millions of feeds on each post)."
  },
  {
    id: 57,
    category: "problems",
    question: "What is the biggest challenge in designing a distributed key-value store?",
    options: ["Key naming", "Managing data partitioning, replication, consistency, and failure handling", "Key-value size limits", "Color coding values"],
    correctIndex: 1,
    explanation: "Distributed KV stores must handle: consistent hashing for partitioning, replication for durability, consistency models (strong vs eventual), failure detection, conflict resolution, and anti-entropy."
  },
  {
    id: 58,
    category: "problems",
    question: "In a URL shortener, how do you handle 301 vs 302 redirects?",
    options: ["They are identical", "301 (permanent) is cached by browsers reducing server load; 302 (temporary) allows tracking each click", "301 is for errors", "302 is faster"],
    correctIndex: 1,
    explanation: "301 Moved Permanently: browser caches it, reducing server load but losing analytics. 302 Found: every click hits your server, enabling click tracking. Choose based on whether you need analytics."
  },
  {
    id: 59,
    category: "problems",
    question: "What is 'long polling' and when is it used?",
    options: ["Polling every 1 second", "Server holds the request open until new data is available or timeout", "Polling once a day", "Polling with large payloads"],
    correctIndex: 1,
    explanation: "Long polling: client sends request, server holds it open (doesn't respond immediately) until there's new data or timeout. More efficient than short polling. Used when WebSockets aren't available."
  },
  {
    id: 60,
    category: "problems",
    question: "For a video platform, why process videos asynchronously?",
    options: ["To save bandwidth", "Video transcoding is CPU-intensive and slow; async processing prevents blocking user uploads", "To reduce storage", "For encryption"],
    correctIndex: 1,
    explanation: "Transcoding a video into multiple formats/resolutions can take minutes to hours. Async processing (via task queue) lets the upload return immediately while workers process in the background."
  },
];
