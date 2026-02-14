import type { QuizQuestion } from '../../types';

export const capTheoremQuiz: QuizQuestion[] = [
  {
    question: "What are the three guarantees described by the CAP theorem?",
    options: [
      "Consistency, Availability, Partition Tolerance",
      "Concurrency, Atomicity, Performance",
      "Caching, Authentication, Persistence",
      "Consensus, Agreement, Propagation"
    ],
    correctIndex: 0,
    explanation: "The CAP theorem, proposed by Eric Brewer in 2000, states that a distributed system can only guarantee two out of three properties: Consistency (every read receives the most recent write), Availability (every request receives a non-error response), and Partition Tolerance (the system continues to operate despite network partitions). The other options mix unrelated distributed systems concepts. This theorem is foundational because it forces architects to make explicit trade-offs when designing systems that span multiple nodes."
  },
  {
    question: "In the context of CAP theorem, what does 'Consistency' mean?",
    options: [
      "All nodes see the same data at the same time (linearizability)",
      "Data is never lost even if a node crashes",
      "The system always returns a successful response",
      "Transactions follow ACID properties"
    ],
    correctIndex: 0,
    explanation: "CAP Consistency means linearizability — every read returns the value of the most recent completed write, as if there's a single copy of the data. This is different from ACID consistency, which refers to database invariants being maintained. Durability (option B) is about persistence, availability (option C) is a separate CAP property, and ACID (option D) is a transaction model concept. In practice, achieving CAP consistency requires coordination between nodes, which adds latency — this is why many systems choose eventual consistency instead."
  },
  {
    question: "What does 'Partition Tolerance' mean in CAP theorem?",
    options: [
      "The system can split data across multiple partitions",
      "The system continues to function despite network communication failures between nodes",
      "The system tolerates disk partitioning failures",
      "The system can handle partitioned database tables"
    ],
    correctIndex: 1,
    explanation: "Partition tolerance means the system continues to operate even when network messages between nodes are lost or delayed — essentially, when the network 'partitions' into groups that can't communicate. This is about network failures, not data partitioning (sharding) or disk failures. In real distributed systems, network partitions are inevitable (cables get cut, switches fail, cloud availability zones lose connectivity), so partition tolerance is not really optional — you must handle it. This is why the real CAP choice is between CP and AP during a partition event."
  },
  {
    question: "Why is a 'CA' system (Consistency + Availability, no Partition Tolerance) considered impractical in distributed systems?",
    options: [
      "Because network partitions are unavoidable in distributed systems",
      "Because consistency and availability are mutually exclusive",
      "Because CA systems require infinite bandwidth",
      "Because no database supports both consistency and availability"
    ],
    correctIndex: 0,
    explanation: "Network partitions are a fact of life in distributed systems — switches fail, cables get cut, packets get dropped. Since you can't prevent partitions, you must tolerate them, making P mandatory. A CA system would only work on a single node or a network that never fails, which doesn't exist in practice. This is why the real CAP trade-off is between CP (sacrifice availability during partitions) and AP (sacrifice consistency during partitions). A traditional single-node PostgreSQL instance is technically CA, but the moment you distribute it, you must choose CP or AP."
  },
  {
    question: "Which of the following is a CP (Consistency + Partition Tolerance) system?",
    options: [
      "Amazon DynamoDB (default config)",
      "Apache Cassandra (default config)",
      "Apache HBase",
      "CouchDB"
    ],
    correctIndex: 2,
    explanation: "HBase is a CP system — during a network partition, it will refuse to serve requests from partitioned regions rather than risk returning stale data. It relies on ZooKeeper for coordination and will make a region unavailable if it can't confirm consistency. DynamoDB (default) and Cassandra (default) are AP systems — they prioritize availability and accept eventual consistency. CouchDB is also AP, designed for eventual consistency with multi-master replication. The key insight: CP systems choose correctness over responsiveness when the network misbehaves."
  },
  {
    question: "Which of the following is an AP (Availability + Partition Tolerance) system?",
    options: [
      "Google Spanner",
      "Apache ZooKeeper",
      "Amazon DynamoDB (default configuration)",
      "etcd"
    ],
    correctIndex: 2,
    explanation: "DynamoDB in its default configuration is an AP system — it uses eventual consistency to ensure that reads always return a response, even during network partitions, though the data might be slightly stale. Google Spanner is CP (it uses TrueTime and Paxos for strong consistency). ZooKeeper and etcd are both CP systems used for coordination — they use consensus protocols (ZAB and Raft respectively) and will become unavailable if they lose quorum. The trade-off DynamoDB makes is accepting occasional stale reads in exchange for always being responsive."
  },
  {
    question: "What happens in a CP system during a network partition?",
    options: [
      "It returns stale data to maintain availability",
      "It becomes unavailable rather than risk inconsistent data",
      "It automatically resolves the partition",
      "It switches to eventual consistency mode"
    ],
    correctIndex: 1,
    explanation: "A CP system prioritizes consistency over availability. During a network partition, nodes that can't confirm they have the latest data will refuse to serve requests — returning errors or timing out rather than potentially serving stale or inconsistent data. This is the behavior you see in systems like HBase, ZooKeeper, and etcd. For example, if a ZooKeeper ensemble loses quorum (majority of nodes can't communicate), the remaining nodes stop accepting writes. This is critical for use cases like distributed locks or configuration management where stale data could cause catastrophic errors."
  },
  {
    question: "What happens in an AP system during a network partition?",
    options: [
      "It stops accepting writes until the partition heals",
      "All nodes shut down to prevent data corruption",
      "It continues serving requests but may return stale or divergent data",
      "It automatically promotes a new leader"
    ],
    correctIndex: 2,
    explanation: "An AP system continues serving both reads and writes during a partition, accepting that different nodes might have divergent data. For example, Cassandra will accept writes on both sides of a partition, and when the partition heals, it uses techniques like last-write-wins or vector clocks to reconcile conflicts. This is ideal for systems where availability is more important than immediate consistency — like a shopping cart (Amazon's original Dynamo paper) where it's better to accept a potentially stale cart than to show the user an error page. The reconciliation after partition healing is where the complexity lives."
  },
  {
    question: "Who originally proposed the CAP theorem?",
    options: [
      "Leslie Lamport",
      "Eric Brewer",
      "Martin Fowler",
      "Jeff Dean"
    ],
    correctIndex: 1,
    explanation: "Eric Brewer proposed the CAP theorem as a conjecture at the ACM Symposium on Principles of Distributed Computing (PODC) in 2000. It was later formally proved by Seth Gilbert and Nancy Lynch in 2002. Leslie Lamport is famous for Paxos, Lamport clocks, and LaTeX. Martin Fowler is known for software architecture patterns and refactoring. Jeff Dean is the legendary Google engineer behind MapReduce, BigTable, and TensorFlow. Brewer's insight fundamentally changed how engineers reason about distributed system design trade-offs."
  },
  {
    question: "DynamoDB offers both eventually consistent and strongly consistent reads. When using strongly consistent reads, what CAP trade-off is being made?",
    options: [
      "It becomes a CA system",
      "It trades some availability for consistency (moves toward CP)",
      "It gains partition tolerance it didn't have before",
      "No trade-off — strong consistency is free in DynamoDB"
    ],
    correctIndex: 1,
    explanation: "When you request strongly consistent reads in DynamoDB, you're moving along the CAP spectrum toward CP. The read must go to the leader node of the partition, and if that leader is unreachable due to a network partition, the read will fail — sacrificing availability for consistency. With eventually consistent reads (default), DynamoDB can serve from any replica, giving you availability even during partitions but potentially stale data. This demonstrates that CAP isn't a binary choice but a spectrum — systems can offer different consistency levels for different operations. Strong consistent reads in DynamoDB also have higher latency and lower throughput."
  },
  {
    question: "What is the PACELC theorem?",
    options: [
      "An alternative to CAP that ignores partition tolerance",
      "An extension of CAP: during Partition choose A or C; Else (no partition) choose Latency or Consistency",
      "A theorem about parallel computing efficiency",
      "A consensus protocol for distributed databases"
    ],
    correctIndex: 1,
    explanation: "PACELC extends CAP by addressing what happens when there is NO partition (the normal case). It says: if there's a Partition, choose Availability or Consistency (PAC); Else, choose Latency or Consistency (ELC). This is important because CAP only describes behavior during partitions, but most of the time the network is fine. Even without partitions, there's still a trade-off: strong consistency requires coordination (adding latency), while relaxed consistency can be faster. For example, DynamoDB is PA/EL (available during partitions, low latency normally), while Spanner is PC/EC (consistent during partitions, consistent normally but with higher latency)."
  },
  {
    question: "In PACELC, what does a PA/EL system prioritize?",
    options: [
      "Consistency during partitions, latency during normal operation",
      "Availability during partitions, low latency during normal operation",
      "Consistency always, regardless of partition status",
      "Availability during partitions, consistency during normal operation"
    ],
    correctIndex: 1,
    explanation: "A PA/EL system chooses Availability during Partitions and Low Latency when there's no partition (Else). This describes systems like Cassandra and DynamoDB (default) — they always prioritize responsiveness, whether or not there's a partition. During partitions they serve potentially stale data (PA), and during normal operation they use eventual consistency to minimize latency (EL). Contrast this with a PC/EC system like Google Spanner, which always prioritizes consistency at the cost of higher latency. The PACELC model is more nuanced than CAP because it captures behavior during the 99.99% of time when there's no partition."
  },
  {
    question: "Which consistency model guarantees that once a write is confirmed, all subsequent reads will see that write?",
    options: [
      "Eventual consistency",
      "Strong consistency (linearizability)",
      "Causal consistency",
      "Read-your-writes consistency"
    ],
    correctIndex: 1,
    explanation: "Strong consistency (linearizability) guarantees that once a write completes, ALL subsequent reads from ANY client will see that write — as if there's a single copy of the data updated atomically. Eventual consistency only guarantees that reads will EVENTUALLY see the write, but there's no bound on when. Causal consistency preserves causally related operation order but allows concurrent operations to be seen in different orders. Read-your-writes only guarantees that the client that performed the write sees it — other clients might still see stale data. Linearizability is the strongest guarantee but the most expensive in terms of latency and availability."
  },
  {
    question: "A social media platform needs to display a user's post count. The count doesn't need to be perfectly accurate in real-time. Which CAP trade-off is most appropriate?",
    options: [
      "CP — count must always be exactly correct",
      "AP — eventual consistency is acceptable for display counts",
      "CA — the count should never be unavailable or wrong",
      "None — this doesn't involve CAP trade-offs"
    ],
    correctIndex: 1,
    explanation: "For a non-critical metric like a post count display, AP with eventual consistency is the right trade-off. Users won't notice if their post count is off by one for a few seconds, but they WILL notice if the page fails to load (unavailability). Facebook and Twitter use this approach — counters like likes, followers, and post counts are eventually consistent and may temporarily show different values to different users. This is a classic example of choosing the right consistency level based on business requirements rather than defaulting to the strongest guarantee. Overengineering consistency for non-critical data wastes resources and hurts availability."
  },
  {
    question: "A banking system processes fund transfers between accounts. Which CAP trade-off is most appropriate?",
    options: [
      "AP — the system must always be available for transfers",
      "CP — consistency is critical to prevent double-spending",
      "CA — both consistency and availability are mandatory",
      "AP with conflict resolution after partitions heal"
    ],
    correctIndex: 1,
    explanation: "For financial transactions like fund transfers, consistency is non-negotiable — you cannot risk double-spending or lost money due to stale reads. A CP approach ensures that during a network partition, the system will refuse the transfer rather than potentially process it incorrectly. This is why traditional banking systems use strong consistency and would rather show 'service temporarily unavailable' than process an inconsistent transaction. Banks like HSBC and JPMorgan use CP databases for core transaction processing. The cost of an inconsistency (regulatory fines, lost money) far outweighs the cost of brief unavailability."
  },
  {
    question: "What is a 'split-brain' scenario in distributed systems?",
    options: [
      "When a database table is split across multiple shards",
      "When network partition causes two groups of nodes to independently believe they are the active cluster",
      "When a query execution plan is split into parallel sub-plans",
      "When a leader node's CPU is overloaded and splits tasks"
    ],
    correctIndex: 1,
    explanation: "Split-brain occurs during a network partition when two (or more) groups of nodes can't communicate and each group independently believes it's the legitimate active cluster. Both sides may accept writes, leading to conflicting data. For example, in a two-node cluster, if the network between them fails, both nodes might promote themselves to leader and accept writes — creating divergent state that's extremely difficult to reconcile. This is why consensus protocols like Raft and Paxos require a majority quorum — only the side with the majority can continue operating, preventing split-brain. This is a critical failure mode that CP systems are designed to prevent."
  },
  {
    question: "How does a quorum-based system prevent split-brain during a network partition?",
    options: [
      "By requiring all nodes to agree on every operation",
      "By requiring a majority of nodes to agree before proceeding",
      "By using timestamps to order conflicting operations",
      "By shutting down all nodes when a partition is detected"
    ],
    correctIndex: 1,
    explanation: "Quorum-based systems require a majority (more than half) of nodes to agree before an operation can proceed. Since a majority can only exist on one side of any partition, this prevents split-brain — only one partition can form a quorum and accept operations. For example, in a 5-node cluster, you need 3 nodes to agree. If the network splits into groups of 3 and 2, only the group of 3 can form a quorum and continue operating. The group of 2 becomes unavailable. This is fundamentally why consensus protocols like Raft, Paxos, and ZAB use odd numbers of nodes (3, 5, 7) — it maximizes the chance that one side can achieve quorum."
  },
  {
    question: "Cassandra uses tunable consistency with settings like ONE, QUORUM, and ALL. If you set both read and write consistency to QUORUM, what behavior do you get?",
    options: [
      "Eventual consistency only",
      "Strong consistency for operations where R + W > N",
      "The same as setting consistency to ALL",
      "No consistency guarantees at all"
    ],
    correctIndex: 1,
    explanation: "When R (read replicas) + W (write replicas) > N (total replicas), you get strong consistency because there must be at least one node that participated in both the latest write and the current read. With QUORUM on both reads and writes in a replication factor of 3, R=2 and W=2, so R+W=4 > N=3 — guaranteeing overlap. Setting both to ALL would give even stronger guarantees but at the cost of availability (any single node failure blocks the operation). Setting just one to ONE would break the overlap guarantee. This tunable consistency is what makes Cassandra flexible — you can choose per-query whether you need strong or eventual consistency."
  },
  {
    question: "What is 'eventual consistency'?",
    options: [
      "Data is consistent after every write operation",
      "If no new updates are made, all replicas will eventually converge to the same value",
      "Data becomes consistent only at scheduled intervals",
      "Consistency is guaranteed within a fixed time window"
    ],
    correctIndex: 1,
    explanation: "Eventual consistency means that if no new writes occur, all replicas will eventually converge to the same value — but there's no guarantee on how long this takes. It's not about scheduled intervals or fixed windows; it's a convergence guarantee without a time bound. In practice, convergence usually happens within milliseconds to seconds, but during partitions it could take longer. DNS is a classic example — when you update a DNS record, it propagates eventually but different resolvers may see the old value for varying durations (TTL-based). Amazon's Dynamo paper popularized this model, arguing that many applications can tolerate brief inconsistency in exchange for better availability and performance."
  },
  {
    question: "What consistency model does DNS use?",
    options: [
      "Strong consistency",
      "Eventual consistency with TTL-based propagation",
      "Causal consistency",
      "Sequential consistency"
    ],
    correctIndex: 1,
    explanation: "DNS uses eventual consistency with TTL (Time-To-Live) based propagation. When you update a DNS record, the change doesn't instantly propagate to all DNS resolvers worldwide. Each resolver caches the record for its TTL duration and only fetches the new value when the TTL expires. This means different clients might resolve the same domain to different IPs for a period. This is by design — DNS prioritizes availability and performance (billions of queries per day) over immediate consistency. The TTL mechanism gives a rough upper bound on propagation time, but in practice, some resolvers may not respect TTLs. This is why DNS migrations often involve lowering TTLs beforehand."
  },
  {
    question: "Google Spanner achieves external consistency (strongest form of consistency) in a distributed system. What technology makes this possible?",
    options: [
      "Blockchain-based verification",
      "TrueTime API with GPS and atomic clocks",
      "Eventual consistency with automatic conflict resolution",
      "Single-leader replication with synchronous followers"
    ],
    correctIndex: 1,
    explanation: "Google Spanner uses TrueTime, an API that provides globally consistent timestamps using GPS receivers and atomic clocks in every Google datacenter. TrueTime gives a bounded uncertainty interval for the current time, and Spanner waits out this uncertainty before committing transactions — ensuring that transaction timestamps reflect their real-time order. This allows Spanner to achieve external consistency (even stronger than linearizability) across globally distributed nodes. No other production system has replicated this approach because it requires Google's custom hardware infrastructure. This is why Spanner is often called the 'impossibility-defying' database — it achieves properties that the CAP theorem suggests shouldn't coexist."
  },
  {
    question: "What is a vector clock, and which CAP concern does it address?",
    options: [
      "A physical timestamp mechanism that ensures strong consistency",
      "A logical clock that tracks causality to help resolve conflicts in AP systems",
      "A scheduling algorithm for distributed task execution",
      "A technique for synchronizing wall clocks across data centers"
    ],
    correctIndex: 1,
    explanation: "A vector clock is a logical clock mechanism where each node maintains a vector of counters (one per node). When events happen, counters are incremented and exchanged, allowing the system to determine causal ordering — whether event A happened before event B, or if they're concurrent (and thus conflicting). This is crucial in AP systems where concurrent writes during partitions create conflicts that need resolution. Amazon's original Dynamo used vector clocks to detect conflicting versions and present them to the application for resolution (e.g., merging shopping carts). Vector clocks don't prevent inconsistency — they help detect and resolve it after the fact."
  },
  {
    question: "What conflict resolution strategy does 'last-write-wins' (LWW) use?",
    options: [
      "It merges all conflicting writes into a single combined value",
      "It keeps the write with the highest timestamp and discards others",
      "It asks the user to manually resolve the conflict",
      "It rejects all writes that conflict"
    ],
    correctIndex: 1,
    explanation: "Last-write-wins (LWW) resolves conflicts by simply keeping the write with the highest timestamp and discarding all others. This is used by Cassandra by default and is simple to implement, but it can silently lose data — if two clients write different values concurrently, one write is silently dropped. For example, if client A writes 'blue' and client B writes 'red' at nearly the same time, only the one with the later timestamp survives. This is acceptable for some use cases (like session data or caches) but dangerous for others (like shopping carts, where you'd lose items). The simplicity of LWW comes at the cost of potential data loss, which is why some systems like Riak offer alternative strategies like merge functions."
  },
  {
    question: "A system uses Raft consensus protocol. What CAP classification does it fall under?",
    options: [
      "AP — Raft ensures all nodes can serve requests",
      "CP — Raft requires a quorum and sacrifices availability during partitions",
      "CA — Raft prevents partitions from occurring",
      "None — consensus protocols are unrelated to CAP"
    ],
    correctIndex: 1,
    explanation: "Raft is a CP consensus protocol. It requires a majority quorum to elect a leader and commit log entries. During a network partition, the minority side cannot form a quorum and becomes unavailable — sacrificing availability for consistency. The majority side can still operate with full consistency guarantees. Systems built on Raft (like etcd, CockroachDB, TiKV) inherit this CP characteristic. Raft was designed by Diego Ongaro as an understandable alternative to Paxos, and it explicitly prioritizes safety (consistency) over liveness (availability). This makes it ideal for coordination services, configuration stores, and metadata management where correctness is paramount."
  },
  {
    question: "What is the difference between 'consistency' in CAP theorem and 'consistency' in ACID?",
    options: [
      "They are exactly the same concept",
      "CAP consistency is about linearizability across nodes; ACID consistency is about maintaining database invariants",
      "ACID consistency is stronger than CAP consistency",
      "CAP consistency only applies to NoSQL databases"
    ],
    correctIndex: 1,
    explanation: "These are fundamentally different concepts that unfortunately share a name. CAP consistency (linearizability) means all nodes see the same data at the same time — it's about replica agreement in a distributed system. ACID consistency means a transaction moves the database from one valid state to another, maintaining all defined rules (constraints, cascades, triggers). You could have a single-node database with perfect ACID consistency but no CAP consistency concerns (since there's only one node). Conversely, you could have a distributed system with CAP consistency but no ACID transactions. This naming collision causes endless confusion in system design discussions — always clarify which 'consistency' you mean."
  },
  {
    question: "ZooKeeper is classified as a CP system. In what scenario would ZooKeeper become unavailable?",
    options: [
      "When any single node fails",
      "When the leader node fails (before a new leader is elected)",
      "When a minority of nodes are partitioned from the majority",
      "Both B and C"
    ],
    correctIndex: 3,
    explanation: "ZooKeeper becomes unavailable in two scenarios: (1) When the leader fails, there's a brief unavailability window while a new leader is elected via the ZAB protocol (typically a few seconds). (2) When nodes are partitioned such that some are in the minority — those minority nodes cannot serve consistent reads or accept writes because they can't confirm they have the latest state. The majority partition will elect a new leader and continue operating. A single node failure in a 3+ node ensemble is tolerable as long as quorum is maintained. This is the CP trade-off in action — ZooKeeper would rather be unavailable than serve potentially inconsistent data, which is exactly what you want from a coordination service."
  },
  {
    question: "What is 'read-your-writes' consistency?",
    options: [
      "A guarantee that all clients see writes in the order they were issued",
      "A guarantee that a client will always see its own previous writes",
      "A guarantee that reads are always served from the node that processed the write",
      "A guarantee that all writes are immediately visible to all readers"
    ],
    correctIndex: 1,
    explanation: "Read-your-writes consistency guarantees that if a client writes a value, subsequent reads BY THAT SAME CLIENT will see the write (or a more recent value). Other clients might still see stale data. This is weaker than strong consistency but stronger than eventual consistency, and it's crucial for user experience — imagine posting a tweet and then not seeing it on your own timeline. Many systems implement this by routing a user's reads to the same replica that handled their writes (sticky sessions), or by tracking the latest write timestamp and ensuring reads go to replicas that are at least that up-to-date. Facebook uses a version of this for their social graph."
  },
  {
    question: "What is 'monotonic reads' consistency?",
    options: [
      "Reads always return the latest value",
      "Once a client reads a value, subsequent reads will never return an older value",
      "All reads are served in the order they were issued",
      "Reads always return values in alphabetical order"
    ],
    correctIndex: 1,
    explanation: "Monotonic reads guarantees that if a client reads a value at time T, any subsequent read by that client will return that value or a newer one — never an older value. Without this guarantee, a user might see a post, refresh the page, and the post disappears (because they hit a less-up-to-date replica), then see it again on the next refresh. This 'time travel' effect is confusing and breaks user expectations. Monotonic reads is typically implemented by ensuring a client always reads from the same replica (or one that's at least as up-to-date). It's a session-level guarantee that's weaker than strong consistency but prevents the most jarring user experience issues."
  },
  {
    question: "A system uses eventual consistency with a conflict resolution policy. During a network partition, two clients update the same record simultaneously on different sides of the partition. What is this called?",
    options: [
      "A race condition",
      "A write-write conflict (conflicting writes / siblings)",
      "A deadlock",
      "A dirty read"
    ],
    correctIndex: 1,
    explanation: "When two clients update the same data on different sides of a network partition, it creates a write-write conflict (also called 'siblings' in Riak terminology). Both writes succeed locally because the nodes can't coordinate across the partition. When the partition heals, the system must reconcile these conflicting versions. This is different from a race condition (which is a timing-dependent bug), a deadlock (which is about resource locking), or a dirty read (which is about reading uncommitted data). AP systems must have a strategy for handling these conflicts — LWW, vector clocks, CRDTs, or application-level resolution. The choice of conflict resolution strategy is one of the most important design decisions in AP systems."
  },
  {
    question: "What are CRDTs, and how do they relate to CAP theorem?",
    options: [
      "Conflict-free Replicated Data Types — data structures that can be merged without conflicts, enabling AP systems",
      "Consistent Replication Data Transfers — a protocol for CP systems",
      "Concurrent Read Data Transactions — a transaction isolation mechanism",
      "Checkpoint Recovery Data Techniques — a durability mechanism"
    ],
    correctIndex: 0,
    explanation: "CRDTs (Conflict-free Replicated Data Types) are data structures mathematically designed to always converge when replicas are merged, without requiring coordination. They enable AP systems to handle concurrent updates without conflicts — the merge operation is commutative, associative, and idempotent. Examples include G-Counters (grow-only counters), OR-Sets (observed-remove sets), and LWW-Registers. Redis Enterprise uses CRDTs for active-active geo-replication, and collaborative editors like Figma use CRDT-like structures. They're powerful because they give you the availability benefits of AP systems while eliminating the need for explicit conflict resolution — the math guarantees convergence."
  },
  {
    question: "What is 'tunable consistency' as implemented in Apache Cassandra?",
    options: [
      "The ability to change the consistency model of the cluster at runtime",
      "The ability to specify per-query how many replicas must respond for reads and writes",
      "A feature that automatically adjusts consistency based on network conditions",
      "The ability to set different consistency levels for different tables"
    ],
    correctIndex: 1,
    explanation: "Cassandra's tunable consistency allows you to specify per-query how many replicas must acknowledge a read or write. With consistency level ONE, only one replica needs to respond (fast but weakly consistent). With QUORUM, a majority must respond. With ALL, every replica must respond (slowest but strongest). The key insight is that when Read replicas + Write replicas > Total replicas (R + W > N), you get strong consistency because at least one node overlaps. This lets you make different trade-offs for different queries — strong consistency for critical operations like payments, eventual consistency for non-critical ones like analytics. No other database popularized this concept as effectively as Cassandra."
  },
  {
    question: "What is the significance of the formula R + W > N in quorum-based systems?",
    options: [
      "It calculates the minimum number of nodes needed",
      "It ensures at least one node has the latest write when reading, providing strong consistency",
      "It determines the maximum throughput of the system",
      "It calculates the replication factor needed for fault tolerance"
    ],
    correctIndex: 1,
    explanation: "When R (read quorum) + W (write quorum) > N (replication factor), there's guaranteed overlap — at least one node that handled the write will also be queried during the read. This node has the latest value, so the system can return consistent data. For example, with N=3, R=2, W=2: any 2 nodes you read from must include at least 1 of the 2 nodes that acknowledged the write (since 2+2=4 > 3). If R+W ≤ N, there's no guaranteed overlap, and reads might miss the latest write. This formula is the mathematical foundation of quorum-based consistency in systems like Cassandra, DynamoDB, and Riak. It lets you trade off consistency for latency by adjusting R and W."
  },
  {
    question: "In a Cassandra cluster with replication factor 3, what is the minimum consistency level for BOTH reads and writes to guarantee strong consistency?",
    options: [
      "ONE for both",
      "TWO for reads, ONE for writes",
      "QUORUM for both",
      "ALL for both"
    ],
    correctIndex: 2,
    explanation: "With replication factor N=3, QUORUM means 2 nodes (⌊3/2⌋ + 1 = 2). If both reads and writes use QUORUM, then R + W = 2 + 2 = 4 > 3 = N, satisfying the strong consistency condition. ALL for both would also work but is unnecessarily restrictive — a single node failure would block all operations. ONE for both gives R + W = 2, which is less than N=3, so there's no overlap guarantee. TWO reads + ONE write gives R + W = 3 = N, which is borderline — it works only if there are no concurrent writes. QUORUM for both is the standard strong consistency configuration in Cassandra that also tolerates one node failure."
  },
  {
    question: "What is 'hinted handoff' in distributed databases like Cassandra and DynamoDB?",
    options: [
      "A technique where a node stores writes intended for an unavailable node and forwards them when it recovers",
      "A method for transferring leadership during leader election",
      "A way to redirect client requests to the nearest data center",
      "A protocol for negotiating consistency levels between client and server"
    ],
    correctIndex: 0,
    explanation: "Hinted handoff is a technique used in AP systems where, if a target replica is down, another node temporarily stores the write as a 'hint.' When the unavailable node comes back online, the hint is replayed, bringing it up to date. This improves availability (writes don't fail just because one replica is down) and helps achieve eventual consistency faster after node recovery. However, hints are stored temporarily and have limits — if a node is down for too long, hints may expire, requiring anti-entropy repair mechanisms (like Merkle trees in Cassandra) to fully synchronize. Hinted handoff is a pragmatic trade-off: it sacrifices some consistency guarantees for better availability and faster convergence."
  },
  {
    question: "What is 'anti-entropy' in the context of distributed systems?",
    options: [
      "A mechanism to prevent data corruption from hardware failures",
      "A background process that compares and synchronizes data between replicas to ensure they converge",
      "A technique to prevent entropy-based encryption attacks",
      "A method for reducing the randomness in load balancer routing"
    ],
    correctIndex: 1,
    explanation: "Anti-entropy is a background process where nodes periodically compare their data and synchronize any differences. In Cassandra, this is called 'repair' and uses Merkle trees — hash trees that efficiently identify which data ranges differ between replicas. Dynamo-style systems use anti-entropy to handle cases where hinted handoff isn't sufficient (e.g., a node was down too long and hints expired). The term comes from information theory — entropy represents disorder, so anti-entropy reduces disorder (data inconsistency) between replicas. It's like periodically reconciling two copies of a spreadsheet to ensure they match. This is a key mechanism for achieving eventual consistency in AP systems."
  },
  {
    question: "What is a 'sloppy quorum' as described in the Amazon Dynamo paper?",
    options: [
      "A quorum that includes nodes outside the preference list when some preferred nodes are unavailable",
      "A quorum that requires fewer nodes than a strict majority",
      "A quorum that allows reads from any node without coordination",
      "A quorum that uses approximate rather than exact counts"
    ],
    correctIndex: 0,
    explanation: "In a sloppy quorum, if the designated replica nodes for a key are unavailable, the system writes to other 'healthy' nodes that aren't normally responsible for that key. These temporary holders use hinted handoff to forward the data back when the proper nodes recover. This maximizes availability because writes can always succeed as long as any W nodes in the cluster are reachable — not necessarily the 'correct' W nodes. The trade-off is that this breaks the R + W > N strong consistency guarantee since the read and write sets may not overlap. Sloppy quorums are a key innovation in the Dynamo paper that enables always-writable behavior, making DynamoDB an AP system."
  },
  {
    question: "What is 'causal consistency' and where does it fall in the consistency spectrum?",
    options: [
      "It's stronger than strong consistency — it guarantees global ordering of all operations",
      "It's between strong and eventual consistency — it preserves the order of causally related operations",
      "It's the weakest form of consistency — weaker than eventual",
      "It's identical to sequential consistency"
    ],
    correctIndex: 1,
    explanation: "Causal consistency guarantees that operations that are causally related (one depends on or is influenced by another) are seen in the correct order by all nodes. Operations that are NOT causally related (concurrent) can be seen in any order. This is stronger than eventual consistency (which provides no ordering guarantees) but weaker than strong consistency (which orders ALL operations). For example, if Alice posts a message and Bob replies, causal consistency ensures everyone sees Alice's message before Bob's reply. But two unrelated posts by different users might appear in different orders on different nodes. MongoDB offers causal consistency through causal sessions, and it's often a sweet spot — providing meaningful guarantees without the performance cost of linearizability."
  },
  {
    question: "Which of the following is NOT a valid way to handle conflicts in an AP system after a partition heals?",
    options: [
      "Last-write-wins using timestamps",
      "Application-level conflict resolution",
      "Using CRDTs for automatic merge",
      "Rolling back all writes from both sides of the partition"
    ],
    correctIndex: 3,
    explanation: "Rolling back ALL writes from both partition sides would mean losing all data written during the partition — this defeats the purpose of an AP system, which accepts writes during partitions to maintain availability. The whole point of AP is that writes succeed during partitions and are reconciled afterwards. LWW (option A) picks one write and discards others — simple but lossy. Application-level resolution (option B) lets the app decide how to merge (e.g., Amazon's shopping cart merges items from both sides). CRDTs (option C) mathematically guarantee conflict-free merging. The challenge of AP systems is designing good conflict resolution — it's the price you pay for availability during partitions."
  },
  {
    question: "Netflix uses Cassandra as its primary data store. What CAP trade-off does this reflect about Netflix's priorities?",
    options: [
      "Netflix prioritizes consistency — users must always see the exact same catalog",
      "Netflix prioritizes availability — it's better to show a slightly stale catalog than show an error",
      "Netflix doesn't need partition tolerance because it runs on a single server",
      "Netflix uses Cassandra in CP mode for all operations"
    ],
    correctIndex: 1,
    explanation: "Netflix chose Cassandra (an AP system) because for their use case, availability is paramount. If a user opens Netflix, it's far better to show a slightly outdated 'continue watching' list than to show an error page. A few seconds of stale data in a recommendation or viewing history is invisible to the user, but an error page means a lost customer. Netflix operates across multiple AWS regions, where network partitions between regions are not uncommon. Cassandra's AP design with tunable consistency lets Netflix serve requests from any region regardless of partition status. This is a textbook example of choosing your CAP trade-off based on business impact rather than technical purity."
  },
  {
    question: "What is the CAP classification of Redis Sentinel?",
    options: [
      "AP — Redis always serves reads even during failover",
      "CP — Redis Sentinel ensures consistency through leader election",
      "Neither — Redis Sentinel doesn't fit neatly into CAP",
      "CA — Redis prevents partitions through fast networking"
    ],
    correctIndex: 2,
    explanation: "Redis Sentinel is actually difficult to classify cleanly in CAP terms. During normal operation, it's single-leader (CP-ish), but during failover it can lose acknowledged writes (not fully consistent). It uses asynchronous replication by default, so writes acknowledged by the leader may be lost if the leader fails before replicating. During a partition, the old leader might still accept writes (split-brain), though Sentinel tries to mitigate this with 'min-replicas-to-write' configuration. This illustrates an important point: many real-world systems don't fit neatly into CAP categories. CAP is a simplified model — real systems exist on a spectrum and may behave differently depending on configuration and failure modes."
  },
  {
    question: "What does 'linearizability' mean, and how is it different from 'serializability'?",
    options: [
      "They are the same thing — both ensure operations appear to happen in order",
      "Linearizability is about single-object real-time ordering; serializability is about multi-object transaction ordering",
      "Linearizability applies only to reads; serializability applies only to writes",
      "Linearizability is weaker than serializability"
    ],
    correctIndex: 1,
    explanation: "Linearizability and serializability are both correctness conditions but for different contexts. Linearizability ensures that operations on a SINGLE object appear to take effect instantaneously at some point between their invocation and response, respecting real-time ordering. Serializability ensures that the execution of MULTIPLE concurrent transactions is equivalent to some serial (sequential) execution of those transactions, but doesn't require the serial order to respect real-time ordering. Strict serializability (or 'linearizable + serializable') combines both — Google Spanner offers this. The confusion between these terms is one of the most common misunderstandings in distributed systems. Linearizability is a recency guarantee; serializability is a transaction isolation guarantee."
  },
  {
    question: "In a 5-node Raft cluster, what is the maximum number of node failures the system can tolerate while remaining available?",
    options: [
      "1 node",
      "2 nodes",
      "3 nodes",
      "4 nodes"
    ],
    correctIndex: 1,
    explanation: "A Raft cluster requires a majority quorum to operate. In a 5-node cluster, the quorum size is 3 (⌊5/2⌋ + 1). This means the system can tolerate 2 node failures and still have 3 nodes available to form a quorum. With 3 failures, only 2 nodes remain, which cannot form a majority of 5 — the cluster becomes unavailable. This is the fundamental CP trade-off: more nodes improve fault tolerance but increase the coordination overhead. A 5-node cluster is the sweet spot for many production systems — it tolerates 2 failures (including during rolling upgrades) while keeping quorum size manageable. etcd, used by Kubernetes, typically runs as a 3 or 5-node cluster for this reason."
  },
  {
    question: "What is 'session consistency'?",
    options: [
      "A guarantee that all sessions across all clients see the same data",
      "A guarantee that within a single client session, the client sees a consistent view of the data",
      "A guarantee that sessions are never lost during server failures",
      "A guarantee that all database sessions use the same consistency level"
    ],
    correctIndex: 1,
    explanation: "Session consistency provides guarantees within the scope of a single client session. It typically combines read-your-writes, monotonic reads, and monotonic writes — ensuring that within a session, a client sees a progressively more up-to-date view of the data, never going backwards. Different sessions from different clients may see different data states. This is implemented by tracking the session's read/write timestamps and ensuring subsequent operations go to replicas that are at least as up-to-date. Azure Cosmos DB explicitly offers session consistency as one of its five consistency levels. It's a practical middle ground — strong enough for good UX, weak enough for reasonable performance in geo-distributed systems."
  },
  {
    question: "What is the 'FLP impossibility result' and how does it relate to CAP?",
    options: [
      "It proves that distributed consensus is impossible in a purely asynchronous system with even one faulty node",
      "It proves that CAP is wrong and all three properties can be achieved",
      "It proves that network partitions can always be prevented",
      "It proves that eventual consistency always converges within a bounded time"
    ],
    correctIndex: 0,
    explanation: "The FLP (Fischer, Lynch, Paterson) impossibility result from 1985 proves that in a purely asynchronous distributed system (no timeouts, no clock bounds), deterministic consensus is impossible if even one process can crash. This complements CAP — while CAP says you can't have all three properties during partitions, FLP says you can't even solve consensus reliably in asynchronous networks. In practice, systems work around FLP by using partial synchrony assumptions (timeouts), randomization, or failure detectors. Raft and Paxos, for example, assume partial synchrony — they're guaranteed safe always, but only make progress when the network is behaving. FLP and CAP together form the theoretical bedrock explaining why distributed systems are fundamentally hard."
  },
  {
    question: "You're designing a global e-commerce inventory system. The business requires that items are never oversold. Which approach is most appropriate?",
    options: [
      "AP with eventual consistency — reconcile oversells later with customer apologies",
      "CP with strong consistency on inventory decrements, accepting brief unavailability during partitions",
      "AP with optimistic concurrency and CRDTs for inventory counts",
      "Eventual consistency with last-write-wins for all inventory operations"
    ],
    correctIndex: 1,
    explanation: "When business rules demand 'never oversold,' you need CP with strong consistency for inventory decrements. An oversell means shipping product you don't have or canceling orders — both are costly in money and reputation. CP ensures that during a network partition, the system refuses to process sales rather than risk selling the same item twice. This is exactly the approach that high-value e-commerce uses for limited inventory items. Options A and D risk overselling during partitions. Option C with CRDTs doesn't work for inventory because a counter CRDT can't enforce 'must be ≥ 0' — that's a constraint requiring coordination. For high-volume, non-limited items, you might accept some overselling, but the question specifies 'never oversold.'"
  },
  {
    question: "Cosmos DB offers five consistency levels. From strongest to weakest, what is the correct order?",
    options: [
      "Strong, Session, Bounded Staleness, Consistent Prefix, Eventual",
      "Strong, Bounded Staleness, Session, Consistent Prefix, Eventual",
      "Eventual, Consistent Prefix, Session, Bounded Staleness, Strong",
      "Strong, Bounded Staleness, Consistent Prefix, Session, Eventual"
    ],
    correctIndex: 1,
    explanation: "Azure Cosmos DB offers five consistency levels from strongest to weakest: Strong → Bounded Staleness → Session → Consistent Prefix → Eventual. Strong provides linearizability. Bounded Staleness guarantees reads lag behind writes by at most K versions or T seconds. Session guarantees consistency within a client session (read-your-writes, monotonic reads). Consistent Prefix guarantees that reads never see out-of-order writes. Eventual provides no ordering guarantees but maximum performance. This five-level spectrum is Cosmos DB's answer to the false binary of 'strong vs eventual' — real applications need different consistency levels for different operations. Most Cosmos DB users use Session consistency as their default, which provides a good balance of correctness and performance."
  },
  {
    question: "What is 'bounded staleness' consistency?",
    options: [
      "Reads return data that is at most K versions or T time units behind the latest write",
      "Data is never stale — it's always the latest version",
      "Staleness is bounded by the network latency between data centers",
      "Reads are guaranteed fresh within one second of the write"
    ],
    correctIndex: 0,
    explanation: "Bounded staleness provides a quantitative guarantee on how stale data can be — reads will see data that is at most K versions old or T time units behind the latest write. This is stronger than eventual consistency (which provides no staleness bound) but weaker than strong consistency (which requires zero staleness). It's useful when you can tolerate some lag but need to guarantee it's limited. For example, Cosmos DB's bounded staleness with T=5 seconds means a read is guaranteed to see data no more than 5 seconds old. This is valuable for regulatory or business requirements that need a concrete SLA on data freshness without paying the full cost of strong consistency."
  },
  {
    question: "In the context of distributed databases, what is a 'read repair'?",
    options: [
      "Fixing corrupted data during a read by checking parity bits",
      "When a coordinator detects stale data on some replicas during a read and triggers an update to those replicas",
      "Repairing broken read connections to the database",
      "A scheduled job that re-reads all data to verify integrity"
    ],
    correctIndex: 1,
    explanation: "Read repair is an opportunistic consistency mechanism in Dynamo-style databases. When a coordinator sends a read request to multiple replicas and detects that some replicas have stale data (older versions), it sends the latest version back to the stale replicas to bring them up to date. This happens 'for free' during the read path — no extra coordination needed. Cassandra uses read repair extensively. The coordinator compares digests (hashes) from replicas, and if they differ, it fetches full data from all replicas, determines the latest version, and pushes it to the out-of-date ones. It's an elegant mechanism that gradually improves consistency through normal read traffic, though it only repairs data that's actually being read — rarely accessed data may remain inconsistent until anti-entropy repair runs."
  },
  {
    question: "What is a 'Merkle tree' and how is it used for anti-entropy in distributed systems?",
    options: [
      "A B-tree variant used for indexing in distributed databases",
      "A hash tree where each leaf is a hash of a data block, and parent nodes are hashes of their children, used to efficiently detect data differences between replicas",
      "A tree structure for routing queries in distributed hash tables",
      "A binary tree used for sorting data during map-reduce operations"
    ],
    correctIndex: 1,
    explanation: "A Merkle tree is a binary tree of hashes where each leaf node is the hash of a data block, and each parent node is the hash of its children's hashes. To compare data between two replicas, you only need to compare root hashes. If they differ, you traverse down the tree to find exactly which data blocks differ — a process that requires O(log n) comparisons instead of comparing all data. Cassandra uses Merkle trees during 'nodetool repair' to efficiently identify and synchronize data differences between replicas. This was described in the original Dynamo paper and is crucial for making anti-entropy practical at scale — without Merkle trees, comparing terabytes of data between replicas would be prohibitively expensive."
  },
  {
    question: "What is the 'consensus number' concept, and why does it matter for distributed systems?",
    options: [
      "The minimum number of nodes needed to reach consensus",
      "The maximum number of concurrent processes for which an object can solve consensus in a wait-free manner",
      "The number of rounds needed for Paxos to converge",
      "The percentage of nodes that must agree in a quorum"
    ],
    correctIndex: 1,
    explanation: "The consensus number (from Herlihy's 1991 paper) defines the maximum number of concurrent processes for which a synchronization primitive can solve wait-free consensus. Read-write registers have consensus number 1, test-and-set has consensus number 2, and compare-and-swap (CAS) has consensus number infinity (can solve consensus for any number of processes). This matters because it establishes a hierarchy of synchronization primitives — you can't build stronger primitives from weaker ones. This is why CAS is the foundation of most lock-free data structures and why modern CPUs include CAS instructions. It's a fundamental impossibility result that guides the design of concurrent and distributed algorithms."
  },
  {
    question: "What is the Paxos consensus algorithm, and which CAP property does it sacrifice?",
    options: [
      "A consensus protocol that sacrifices consistency for availability",
      "A consensus protocol that sacrifices availability for consistency (CP)",
      "A consensus protocol that achieves all three CAP properties",
      "A consensus protocol that only works without network partitions (CA)"
    ],
    correctIndex: 1,
    explanation: "Paxos, invented by Leslie Lamport, is a CP consensus protocol. It ensures that a group of nodes can agree on a single value even if some nodes fail or messages are lost. During a network partition, Paxos requires a majority quorum to make progress — the minority side becomes unavailable. Paxos guarantees safety (consistency) always but only guarantees liveness (availability) when a majority of nodes can communicate. It's notoriously difficult to understand and implement correctly — Lamport's original paper used a Greek parliament metaphor that confused many readers. Google's Chubby lock service uses Paxos internally, and many modern systems use Raft instead because it's easier to understand while providing equivalent guarantees."
  },
  {
    question: "What is 'consistent hashing' and how does it relate to partition tolerance?",
    options: [
      "A hashing algorithm that guarantees consistent hash values across different programming languages",
      "A technique for distributing data across nodes where adding/removing nodes only redistributes a minimal amount of data",
      "A method for ensuring hash-based partitions are always consistent",
      "A consensus algorithm for hash-partitioned databases"
    ],
    correctIndex: 1,
    explanation: "Consistent hashing maps both data and nodes onto a conceptual ring (hash space). Each node is responsible for the data between it and its predecessor on the ring. When a node joins or leaves, only the data in its immediate neighborhood needs to be redistributed — not the entire dataset. This is critical for partition tolerance because it minimizes data movement during topology changes (node failures, scaling). DynamoDB, Cassandra, and many CDNs use consistent hashing. Without it, adding a node to a traditional hash-based system (hash(key) % N) would require redistributing nearly all data because N changes. Consistent hashing makes the system resilient to node changes, which is a form of handling partitions gracefully."
  },
  {
    question: "What is a 'gossip protocol' and which CAP-related property does it support?",
    options: [
      "A protocol for achieving strong consistency through message passing",
      "A protocol for leader election in CP systems",
      "A protocol where nodes periodically exchange state with random peers, supporting eventual consistency (AP)",
      "A protocol for encrypting inter-node communication"
    ],
    correctIndex: 2,
    explanation: "A gossip protocol (also called epidemic protocol) is where each node periodically selects a random peer and exchanges state information. Over time, information propagates to all nodes — like how rumors spread in a social network. This supports AP systems because it doesn't require coordination or quorum — nodes spread information opportunistically, and the system eventually converges. Cassandra uses gossip for cluster membership and failure detection. Gossip protocols are inherently eventually consistent — there's no guarantee on when all nodes will have the same information, but they will converge. They're highly scalable (O(log N) rounds to propagate to all N nodes) and robust to node failures, making them ideal for large-scale distributed systems."
  },
  {
    question: "What does the 'C' in PACELC's 'ELC' portion represent differently from the 'C' in 'PAC'?",
    options: [
      "They represent the same thing — linearizable consistency",
      "ELC's C represents the consistency-latency trade-off during normal operation, while PAC's C is about consistency during partitions",
      "ELC's C means caching, PAC's C means consistency",
      "They are unrelated properties that happen to share a letter"
    ],
    correctIndex: 1,
    explanation: "While both use 'C' for consistency, the trade-off context differs. In PAC (during a Partition), choosing C means the system becomes unavailable to maintain consistency — it's a binary choice of serving or not serving. In ELC (Else, no partition), choosing C means accepting higher latency to ensure consistency through coordination between nodes — it's a continuous trade-off between response time and consistency strength. For example, even without partitions, a system like Spanner adds latency for TrueTime uncertainty waits to ensure external consistency (PC/EC). DynamoDB normally returns fast but potentially stale data (PA/EL). The PACELC model captures that consistency costs are different during partitions (availability cost) versus normal operation (latency cost)."
  },
  {
    question: "MongoDB uses a single-leader replication model. During a leader failover, what CAP behavior does MongoDB exhibit?",
    options: [
      "It continues serving reads and writes from secondaries (AP behavior)",
      "It becomes briefly unavailable for writes until a new primary is elected (CP behavior)",
      "It maintains full availability and consistency throughout the failover",
      "It switches to eventual consistency for all operations"
    ],
    correctIndex: 1,
    explanation: "During a MongoDB primary (leader) failover, writes are unavailable for 10-30 seconds while the replica set elects a new primary via Raft-like consensus. Reads can continue from secondaries but may be stale. This makes MongoDB exhibit CP behavior during failovers — it sacrifices write availability to maintain consistency (only one primary can accept writes at a time, preventing split-brain). The election uses a majority vote among replica set members, ensuring only one primary exists. This is a common pattern in single-leader systems: the failover window is a brief availability sacrifice. MongoDB applications must handle 'not master' errors during this window, which is why drivers have built-in retry logic."
  },
  {
    question: "What is a 'witness replica' or 'arbiter' in a consensus system?",
    options: [
      "A replica that stores full data and serves client requests",
      "A lightweight node that participates in voting/quorum but doesn't store full data",
      "A node that monitors system health but doesn't participate in consensus",
      "A backup node that only activates when the leader fails"
    ],
    correctIndex: 1,
    explanation: "A witness (or arbiter in MongoDB terminology) is a node that participates in quorum voting for leader election and consensus but doesn't store a full copy of the data. Its purpose is to provide an odd number of voters to prevent tied elections, without the cost of storing and replicating all the data. For example, if you have two data-bearing nodes in different data centers, adding a lightweight witness in a third location gives you 3 voters for quorum. MongoDB uses arbiters in replica sets, and CockroachDB supports witness replicas. This is cost-effective: you get better fault tolerance for consensus without tripling your storage costs, though you still need at least two full replicas for data durability."
  },
  {
    question: "What is the difference between 'safety' and 'liveness' in distributed systems, and how does it relate to CAP?",
    options: [
      "Safety means data is encrypted; liveness means the system is running",
      "Safety means nothing bad happens (e.g., inconsistency); liveness means something good eventually happens (e.g., requests complete)",
      "Safety is about hardware; liveness is about software",
      "They are the same thing expressed differently"
    ],
    correctIndex: 1,
    explanation: "Safety properties guarantee that 'nothing bad happens' — for example, consistency means you never read incorrect data, and agreement means nodes never decide different values. Liveness properties guarantee that 'something good eventually happens' — for example, availability means requests eventually get responses, and termination means consensus eventually completes. In CAP terms, consistency is a safety property and availability is a liveness property. The FLP impossibility result shows you can't guarantee both in asynchronous systems. Raft and Paxos always maintain safety (consistency) but may sacrifice liveness (availability) during partitions. This safety/liveness framework is fundamental to reasoning about correctness in distributed systems."
  },
  {
    question: "What is a 'network partition' at the infrastructure level? Give a realistic example.",
    options: [
      "A deliberate splitting of data into shards for scalability",
      "A failure where some nodes can communicate with each other but not with other groups of nodes",
      "A DNS failure that prevents name resolution",
      "A firewall rule that blocks all external traffic"
    ],
    correctIndex: 1,
    explanation: "A network partition is when the network breaks into two or more groups that can communicate within their group but not across groups. Real examples: a switch failure between two racks in a data center, a severed fiber optic cable between two AWS availability zones, or a misconfigured firewall rule. The critical characteristic is that nodes on both sides are healthy and running — they just can't reach each other. This is different from a total network failure (where nothing works) because both sides continue operating independently, potentially accepting writes and diverging in state. GitHub experienced a famous 24-second network partition between their primary MySQL and replica in 2018 that caused widespread data inconsistency and a multi-hour outage."
  },
  {
    question: "CockroachDB claims to be both consistent and available. How does it achieve this, and what's the catch?",
    options: [
      "It violates the CAP theorem through a novel algorithm",
      "It's CP but optimizes for availability during normal operation, becoming unavailable only during actual partitions",
      "It achieves CA by running in a single data center",
      "It uses eventual consistency with very fast convergence that appears consistent"
    ],
    correctIndex: 1,
    explanation: "CockroachDB is a CP system that uses Raft consensus for strong consistency. The 'catch' is that CAP only applies during network partitions — which are rare. During normal operation (the vast majority of time), CockroachDB provides both consistency AND high availability through multi-replica Raft groups, automatic failover, and optimized consensus. During an actual partition, it will sacrifice availability (minority partition becomes unavailable) to maintain consistency. This highlights a key misconception about CAP: it's about behavior during partitions, not during normal operation. CockroachDB, Spanner, and YugabyteDB all take this approach — be CP during partitions but design for high availability during the 99.99% of time when the network is healthy."
  },
  {
    question: "What is 'quorum intersection' and why is it essential for consistency?",
    options: [
      "The physical location where quorum servers are co-located",
      "The guarantee that any two quorums share at least one common member, ensuring data overlap",
      "The time when two quorum votes happen simultaneously",
      "The intersection of read and write timeout settings"
    ],
    correctIndex: 1,
    explanation: "Quorum intersection means that any two quorums (sets of nodes that can independently make decisions) must share at least one node in common. This is what guarantees consistency in quorum-based systems — the shared node(s) have participated in both the write quorum and the read quorum, so they can provide the latest data. With majority quorums in a set of N nodes, any two majorities must overlap by at least one node (since two groups each larger than N/2 must share members). If quorums could be disjoint, the system could have two independent writes without any node knowing about both, breaking consistency. This is the mathematical foundation of why R + W > N works."
  },
  {
    question: "What is the 'Two Generals' Problem and how does it relate to distributed consensus?",
    options: [
      "A problem about optimizing military strategy with two leaders",
      "A thought experiment proving that reaching agreement over an unreliable communication channel is impossible",
      "A technique for dual-leader replication in databases",
      "An algorithm for achieving consensus with exactly two nodes"
    ],
    correctIndex: 1,
    explanation: "The Two Generals' Problem illustrates that two parties communicating over an unreliable channel can never be certain they've reached agreement. General A sends 'attack at dawn' to General B, but the messenger might be captured. Even if B confirms, A can't be sure the confirmation arrived. This creates an infinite regress of confirmations. It was the first computer communication problem proved to be unsolvable (1975). It demonstrates why distributed consensus is fundamentally hard — messages can be lost, and you can never be 100% certain the other party received your message. Real systems work around this with timeouts, retries, and probabilistic guarantees (like TCP's three-way handshake), but the fundamental impossibility remains."
  },
  {
    question: "In a geo-distributed system spanning US-East and EU-West regions, a network partition occurs between the regions. Under CP semantics, what happens to requests in each region?",
    options: [
      "Both regions continue serving all requests normally",
      "Both regions become completely unavailable",
      "The region with the majority of replicas continues; the other becomes unavailable for writes",
      "Both regions switch to eventual consistency automatically"
    ],
    correctIndex: 2,
    explanation: "Under CP semantics, the region that can form a quorum (majority of replicas) continues operating normally. The region in the minority becomes unavailable for writes and potentially for consistent reads. For example, if you have 3 replicas (2 in US-East, 1 in EU-West) and the inter-region link goes down, US-East has 2 out of 3 nodes (quorum) and continues serving requests. EU-West has only 1 node and cannot form a quorum — it will refuse writes and return errors. This is why replica placement is a critical design decision in geo-distributed systems. Google Spanner, for instance, carefully places replicas to ensure quorum can be maintained even if one region is isolated."
  },
  {
    question: "What is 'lease-based consistency' and which systems use it?",
    options: [
      "A consistency model where nodes 'lease' data from a central server for a fixed duration",
      "A technique where a leader holds a time-bounded lease, ensuring only one leader exists and reads can be served locally during the lease",
      "A subscription model for database access",
      "A method for renting cloud database instances"
    ],
    correctIndex: 1,
    explanation: "Lease-based consistency uses time-bounded leases to ensure that at most one node acts as leader for a given data partition. The leader can serve consistent reads locally (without quorum) during its lease period, because no other node can become leader until the lease expires. If the leader fails, the system waits for the lease to expire before electing a new one — preventing split-brain. Google's Chubby lock service uses leases extensively, and Raft implementations often use leader leases to optimize read performance. The key trade-off is that after a leader failure, there's a mandatory wait period (lease duration) before a new leader can be elected, which is a bounded unavailability window. This is a practical optimization that reduces read latency in CP systems."
  },
  {
    question: "You're designing a collaborative document editor (like Google Docs). Which consistency model and conflict resolution approach would you use?",
    options: [
      "Strong consistency with pessimistic locking — lock the document for each editor",
      "Eventual consistency with OT (Operational Transformation) or CRDTs for real-time conflict-free merging",
      "CP with single-writer at a time — queue edits and apply sequentially",
      "Last-write-wins — whoever saves last, their version is kept"
    ],
    correctIndex: 1,
    explanation: "Collaborative editors like Google Docs use eventual consistency with conflict resolution algorithms — either OT (Operational Transformation, which Google Docs uses) or CRDTs (which Figma and some newer editors use). Multiple users edit simultaneously on their local copies, and the system automatically merges changes in a way that converges to the same document. Strong consistency with locks would make the experience terrible — only one person could type at a time. Single-writer would queue users. LWW would lose entire edits. OT transforms operations based on concurrent changes (if user A inserts at position 5 and user B deletes at position 3, A's position is adjusted to 4). CRDTs offer a mathematically cleaner approach where merge is always safe. Both provide AP-style availability with automatic conflict resolution."
  },
  {
    question: "What is the role of a 'coordinator node' in Dynamo-style distributed databases?",
    options: [
      "A permanent leader that handles all reads and writes for the cluster",
      "A node that receives a client request and coordinates the operation across the relevant replicas",
      "A node dedicated to monitoring cluster health",
      "A node that handles schema changes and DDL operations"
    ],
    correctIndex: 1,
    explanation: "In Dynamo-style systems (Cassandra, DynamoDB, Riak), any node can act as a coordinator for a given request. When a client sends a request, the receiving node becomes the coordinator for that operation. It determines which replica nodes hold the data (using consistent hashing), forwards the request to those replicas, collects responses, and returns the result to the client based on the configured consistency level. This is different from single-leader systems where one node is permanently the leader. The coordinator role is per-request, enabling any node to serve any request — this is key to the AP nature of these systems. If one node is down, clients can connect to any other node. This leaderless architecture eliminates the single point of failure inherent in leader-based systems."
  },
  {
    question: "What is 'Jepsen testing' and what does it validate about distributed systems?",
    options: [
      "A performance benchmarking tool for measuring throughput",
      "A framework that tests distributed systems under network partitions and other faults to verify consistency and safety claims",
      "A unit testing framework for distributed applications",
      "A security testing tool for finding vulnerabilities in databases"
    ],
    correctIndex: 1,
    explanation: "Jepsen, created by Kyle Kingsbury (Aphyr), is a testing framework that subjects distributed databases to network partitions, clock skew, process crashes, and other faults while checking whether the system maintains its claimed consistency guarantees. It has found critical bugs in nearly every distributed database tested — including MongoDB, Cassandra, CockroachDB, and Elasticsearch. Jepsen uses a formal model to verify properties like linearizability and serializability against actual observed histories. Its findings have been so impactful that 'passing Jepsen testing' has become a credibility milestone for distributed database vendors. It directly validates CAP-related claims — does the system actually maintain consistency during partitions as it claims?"
  },
  {
    question: "In Amazon's original Dynamo paper, what was the 'shopping cart' problem that motivated the AP design?",
    options: [
      "Shopping carts needed ACID transactions for payment processing",
      "Shopping carts needed to always be available for adds/removes, even during partitions, with conflicts merged by union",
      "Shopping carts needed strong consistency to prevent duplicate items",
      "Shopping carts needed to support millions of concurrent users with CP guarantees"
    ],
    correctIndex: 1,
    explanation: "The Dynamo paper was motivated by Amazon's need for an always-available shopping cart. The insight was that it's better to accept an add-to-cart request during a partition (even if it creates a conflict) than to reject it — a rejected add means a lost sale. If conflicts arise (e.g., two versions of the cart after a partition), the resolution is to merge by union (keep all items from both versions). The worst case is a deleted item reappearing, which is far less costly than a customer being unable to add items. This was a groundbreaking business-driven architecture decision: the cost of unavailability (lost revenue) was quantified and found to be much higher than the cost of occasional inconsistency (a reappearing cart item). This thinking spawned an entire generation of AP databases."
  },
  {
    question: "What is 'external consistency' as defined by Google Spanner?",
    options: [
      "Consistency between the database and external APIs",
      "Consistency that respects real-world time ordering — if transaction T1 commits before T2 starts, T1's commit timestamp is earlier",
      "Consistency enforced by an external validation service",
      "The ability to query consistent data from outside the cluster"
    ],
    correctIndex: 1,
    explanation: "External consistency (or strict serializability) is the strongest consistency guarantee — it means that if transaction T1 commits before transaction T2 starts in real (wall-clock) time, then T1's timestamp will be less than T2's timestamp in the database. This is stronger than linearizability because it applies to transactions, not just single operations. Google Spanner achieves this using TrueTime — GPS and atomic clocks that give bounded clock uncertainty. Spanner waits out the uncertainty interval before committing, ensuring timestamps reflect real-time order. This means Spanner's globally distributed database behaves as if it were a single machine processing transactions sequentially in real-time order — a remarkable achievement that requires specialized hardware (atomic clocks in every datacenter)."
  },
  {
    question: "A system uses asynchronous replication from a primary to secondaries. During a primary failure, acknowledged but unreplicated writes are lost. What CAP implication does this have?",
    options: [
      "The system is strongly consistent (CP)",
      "The system is NOT strongly consistent — it may lose acknowledged writes, breaking consistency guarantees",
      "This has no CAP implications — data loss is a durability concern, not consistency",
      "The system achieves perfect availability (AP)"
    ],
    correctIndex: 1,
    explanation: "If the system acknowledges a write to the client but the write hasn't been replicated when the primary fails, the client believes the write succeeded but the data is gone — this violates the consistency guarantee (linearizability requires that once a write is acknowledged, all subsequent reads see it). This is a common issue with asynchronous replication in systems like Redis Sentinel, MongoDB (default), and PostgreSQL streaming replication. The system appears consistent during normal operation but reveals its inconsistency during failures. To achieve true CP behavior, you need synchronous replication or consensus-based replication (like Raft), where writes are only acknowledged after a majority of replicas have them. The CAP classification of a system should be evaluated based on its behavior during failures, not just during normal operation."
  },
  {
    question: "What does it mean for a system to provide 'monotonic writes' consistency?",
    options: [
      "All writes must be larger than the previous write value",
      "Writes from the same client are applied in the order they were issued",
      "Writes are applied in alphabetical order across all clients",
      "Each write must complete before the next write can begin"
    ],
    correctIndex: 1,
    explanation: "Monotonic writes guarantees that writes from the same process are serialized — if a client writes A then writes B, all replicas will apply A before B. Without this guarantee, a replica might see B before A due to message reordering, leading to inconsistent state. For example, if you update a user's email (write A) then send a notification to the new email (write B), monotonic writes ensures no replica processes the notification before the email update. This is weaker than strong consistency (it doesn't order writes across different clients) but prevents a specific class of anomalies. Session-based systems often provide this guarantee by routing all writes from a session through the same replica or by including sequence numbers."
  },
  {
    question: "What is the relationship between consensus and state machine replication (SMR)?",
    options: [
      "They are completely unrelated concepts",
      "Consensus is used to agree on the order of commands, which SMR applies to replicas to keep them in sync",
      "SMR replaces the need for consensus",
      "Consensus handles reads, SMR handles writes"
    ],
    correctIndex: 1,
    explanation: "State Machine Replication (SMR) is the technique of replicating a deterministic state machine across multiple nodes. If all replicas start in the same state and apply the same commands in the same order, they'll end up in the same state. Consensus protocols (Paxos, Raft) provide the mechanism to agree on the order of commands — this is the hard part in a distributed system. Raft explicitly implements SMR: the leader appends commands to a replicated log, consensus ensures all nodes agree on the log order, and each node applies the log to its state machine. This is the foundation of nearly all CP distributed systems — etcd, ZooKeeper, CockroachDB, and TiKV all use consensus-based SMR. The key insight is that ordering + determinism = consistency."
  },
  {
    question: "What is 'chain replication' and how does it differ from quorum-based replication in terms of CAP?",
    options: [
      "It's the same as quorum replication but with a different name",
      "Writes go to the head of a chain and propagate to the tail; reads are served from the tail — providing strong consistency with different availability trade-offs",
      "Data is replicated in a blockchain-like immutable chain",
      "It uses hash chains for data integrity verification"
    ],
    correctIndex: 1,
    explanation: "In chain replication, nodes are arranged in a chain. Writes enter at the head and propagate sequentially to each node until reaching the tail, which sends the acknowledgment. Reads are served only from the tail, which has the latest committed data. This provides strong consistency (the tail always has all committed writes) with high read throughput (reads only hit one node). The trade-off versus quorum replication: chain replication has higher write latency (must traverse the entire chain) and is more sensitive to individual node failures (any node failure breaks the chain until reconfigured). HDFS NameNode and Microsoft's Azure Storage use variants of chain replication. It's CP like quorum systems but with different performance characteristics — better read throughput but worse write latency and failure handling."
  },
  {
    question: "A distributed system uses 'leader leases' where the leader can serve reads locally without consulting followers. What happens if the leader's clock is significantly ahead of other nodes?",
    options: [
      "No impact — clock skew doesn't affect leader leases",
      "The leader might serve stale reads after its lease has actually expired (from other nodes' perspective) but it still thinks it's valid",
      "The system automatically corrects for clock skew",
      "Other nodes will also advance their clocks to match"
    ],
    correctIndex: 1,
    explanation: "If the leader's clock is fast, its lease will expire (by its own clock) before other nodes think it should. This is actually the safe direction — the leader stops serving before others could elect a new one. The dangerous case is if the leader's clock is SLOW — it thinks its lease is still valid when other nodes have already started a new election. In this case, two nodes might both think they're the leader, causing split-brain and inconsistent reads. This is why Google's TrueTime is so valuable — it provides bounded clock uncertainty, and Spanner waits out the uncertainty before relying on timestamps. Without hardware clock synchronization, leader leases depend on the assumption that clock drift is bounded, which NTP tries to provide but can't guarantee."
  },
  {
    question: "What is a 'tombstone' in eventually consistent systems, and why is it needed?",
    options: [
      "A marker indicating a record has been logically deleted, preventing its resurrection during replica synchronization",
      "A backup copy of deleted data for recovery purposes",
      "A log entry marking the end of a database transaction",
      "A timestamp indicating when a node was last seen alive"
    ],
    correctIndex: 0,
    explanation: "In eventually consistent systems, you can't simply delete a record because during synchronization, another replica that still has the record would re-introduce it (thinking the deleting replica just missed the write). Tombstones solve this by replacing the deleted record with a special marker that says 'this was intentionally deleted.' During sync, when a node sees a tombstone, it knows to delete its copy rather than propagate the live version. Cassandra uses tombstones extensively, and they have a configurable retention period (gc_grace_seconds, default 10 days). Tombstones can accumulate and cause performance issues if not cleaned up — a common operational challenge in Cassandra. This is a non-obvious consequence of choosing AP/eventual consistency: even deletes are more complex."
  },
  {
    question: "What is the 'harvest and yield' framework proposed by Eric Brewer as an alternative way to think about CAP?",
    options: [
      "A farming analogy for database scaling",
      "Yield is the probability of completing a request; harvest is the fraction of complete data in the response — systems can trade between them",
      "A method for calculating database throughput",
      "A framework for deciding when to scale up vs scale out"
    ],
    correctIndex: 1,
    explanation: "Brewer proposed 'harvest and yield' as a more nuanced way to think about CAP trade-offs. Yield is the probability that a request completes (related to availability). Harvest is the completeness of the answer — the fraction of total data reflected in the response. Instead of a binary available/unavailable choice, systems can degrade gracefully: return partial results (lower harvest) while maintaining high yield. For example, a search engine might return results from 99 out of 100 index shards if one is down — high yield (the request completes) with slightly reduced harvest (missing some results). Google Search does exactly this. This framework is more practical than binary CAP thinking because it allows for partial degradation rather than complete failure."
  },
  {
    question: "What is the 'CAP theorem proof' by Gilbert and Lynch (2002) based on?",
    options: [
      "An empirical study of distributed database failures",
      "A formal proof showing that in an asynchronous network, it's impossible to implement a read/write data object that guarantees availability and atomic consistency in all executions including partitions",
      "A mathematical proof based on information theory",
      "A simulation of network partition scenarios"
    ],
    correctIndex: 1,
    explanation: "Gilbert and Lynch formally proved Brewer's conjecture by constructing an asynchronous network model and showing that no algorithm can implement an atomic (linearizable) read/write register that is both available (always responds) and consistent (linearizable) in all executions where messages can be lost (partitions). The proof is by contradiction: they show that if a partition occurs and both sides must respond (availability), at least one side must return a stale value (violating consistency), or one side must not respond (violating availability). The formal proof is important because it moved CAP from a conjecture ('I think this is true') to a theorem ('this is mathematically proven'). It also precisely defined the terms, reducing the ambiguity in Brewer's original talk."
  },
  {
    question: "etcd is used by Kubernetes for cluster state. Why is a CP system appropriate for this use case?",
    options: [
      "Because Kubernetes doesn't need high availability",
      "Because cluster state (pod scheduling, service discovery) must be consistent to prevent conflicting assignments",
      "Because etcd is the fastest available key-value store",
      "Because Kubernetes only runs in a single data center"
    ],
    correctIndex: 1,
    explanation: "Kubernetes uses etcd for storing all cluster state — pod assignments, service definitions, ConfigMaps, Secrets, etc. This data must be strongly consistent because inconsistency could cause catastrophic problems: two nodes might both think they own the same pod, or a scheduler might assign work to a node that's been removed. It's better for the control plane to be briefly unavailable (CP) than to make conflicting scheduling decisions. Kubernetes can tolerate brief control plane unavailability because running workloads continue operating even if the control plane is down — it's the control plane decisions that need consistency. This is a textbook CP use case: metadata and coordination data where correctness trumps availability."
  },
  {
    question: "What is a 'phi accrual failure detector' used in systems like Cassandra?",
    options: [
      "A mechanism that gives a continuous suspicion level (phi value) for each node rather than a binary alive/dead determination",
      "A cryptographic method for detecting data tampering",
      "A load balancing algorithm that detects hot spots",
      "A technique for detecting network partitions using packet analysis"
    ],
    correctIndex: 0,
    explanation: "The phi accrual failure detector outputs a continuous suspicion level (phi) rather than a binary alive/dead verdict. Phi represents the likelihood that a node has failed, based on the statistical distribution of heartbeat inter-arrival times. A higher phi means more suspicion. Applications can choose their own phi threshold based on their tolerance for false positives vs. detection speed. This is more nuanced than simple timeout-based detection: a node that usually responds in 10ms but hasn't responded in 100ms gets a high phi, while in a system where responses normally take 500ms, 100ms of silence barely registers. Cassandra uses this to adapt to varying network conditions and avoid falsely marking healthy-but-slow nodes as down, which would cause unnecessary data movement."
  },
  {
    question: "What are the implications of the CAP theorem for microservices architectures?",
    options: [
      "Each microservice must choose the same CAP trade-off for consistency across the system",
      "Different microservices can make different CAP trade-offs based on their specific requirements",
      "CAP theorem doesn't apply to microservices, only to databases",
      "Microservices avoid CAP issues by using REST APIs"
    ],
    correctIndex: 1,
    explanation: "One of the key benefits of microservices is that each service can make independent CAP trade-offs based on its domain requirements. A payment service might use a CP database (PostgreSQL with synchronous replication) because financial consistency is critical. A product catalog service might use an AP database (Cassandra) because availability is more important than immediate consistency for product listings. A session store might use Redis with eventual consistency because session data is ephemeral. This per-service optimization is impossible in a monolith with a single database. However, this creates complexity at service boundaries — when a workflow spans multiple services with different consistency models, you need patterns like sagas, eventual consistency, or compensation transactions to maintain overall system correctness."
  },
  {
    question: "What is the 'saga pattern' and how does it relate to consistency across AP and CP services?",
    options: [
      "A Norse mythology-inspired naming convention for database tables",
      "A pattern for managing distributed transactions across services through a sequence of local transactions with compensating actions for rollback",
      "A protocol for achieving strong consistency in AP systems",
      "A logging pattern for tracking data changes across services"
    ],
    correctIndex: 1,
    explanation: "The saga pattern manages distributed transactions by breaking them into a sequence of local transactions, each in its own service. If one step fails, compensating transactions undo the previous steps. For example, an order saga: (1) Reserve inventory → (2) Charge payment → (3) Ship order. If payment fails, a compensating transaction releases the reserved inventory. Sagas provide eventual consistency across services without requiring distributed locking (2PC), which would create tight coupling and reduce availability. This is essential in microservices where different services may use AP or CP databases. The trade-off: sagas are eventually consistent (there's a window where the system is in a partially completed state), and compensating logic can be complex. Orchestrated sagas use a central coordinator; choreographed sagas use events."
  },
  {
    question: "What is 'strict quorum' vs 'sloppy quorum' in Dynamo-style systems?",
    options: [
      "Strict quorum uses exactly N nodes; sloppy quorum uses fewer than N nodes",
      "Strict quorum only counts designated replica nodes; sloppy quorum can count any healthy node toward the quorum",
      "Strict quorum requires all nodes to respond; sloppy quorum requires only a majority",
      "They are the same thing with different names"
    ],
    correctIndex: 1,
    explanation: "A strict quorum only counts the designated replica nodes (the N nodes responsible for a key based on consistent hashing) toward the R or W threshold. If some designated nodes are down, the operation fails. A sloppy quorum allows the system to count any healthy node toward the quorum — if a designated node is down, the write goes to another node (with a hint for later handoff). Sloppy quorums increase availability (writes succeed even if designated nodes are down) but break the R + W > N consistency guarantee because reads and writes might go to entirely different sets of nodes. DynamoDB uses sloppy quorums to achieve its always-writable design. Cassandra uses strict quorums by default. The choice between them is fundamentally a CP vs AP trade-off."
  },
  {
    question: "How does the 'Raft' consensus protocol handle a leader failure?",
    options: [
      "A human operator manually promotes a new leader",
      "Followers detect leader absence via heartbeat timeout, start an election with randomized timeouts to prevent split votes, and the first candidate to win majority votes becomes leader",
      "The node with the most data automatically becomes leader",
      "All nodes stop processing until the old leader recovers"
    ],
    correctIndex: 1,
    explanation: "In Raft, the leader periodically sends heartbeats to followers. If a follower doesn't receive a heartbeat within its election timeout (randomized to prevent simultaneous elections), it increments its term, transitions to 'candidate' state, votes for itself, and requests votes from other nodes. A candidate wins if it receives votes from a majority. The randomized timeout is crucial — without it, multiple nodes would start elections simultaneously, splitting votes and delaying leader election. The new leader must have all committed log entries (candidates with incomplete logs are rejected). This entire process typically completes in milliseconds, making the unavailability window very brief. Raft's clear separation of leader election, log replication, and safety makes it much easier to understand and implement correctly compared to Paxos."
  },
  {
    question: "What is 'multi-leader replication' (also called 'multi-master'), and what CAP classification does it typically have?",
    options: [
      "CP — multiple leaders ensure stronger consistency",
      "AP — multiple leaders can accept writes independently, tolerating partitions at the cost of potential conflicts",
      "CA — multiple leaders prevent both partitions and unavailability",
      "It doesn't have a CAP classification"
    ],
    correctIndex: 1,
    explanation: "Multi-leader replication allows multiple nodes to accept writes independently and asynchronously replicate changes to each other. This is an AP design because during a network partition, leaders on both sides continue accepting writes — maintaining availability at the cost of consistency (conflicting writes may need resolution later). CouchDB, MySQL Group Replication (multi-primary mode), and DynamoDB global tables use multi-leader replication. The main use case is geo-distributed systems where users write to their nearest leader for low latency. The downside is write conflicts when different leaders modify the same data — requiring conflict resolution strategies (LWW, merge functions, CRDTs). Multi-leader is essentially choosing availability and low latency over consistency."
  },
  {
    question: "Google Bigtable is often described as a CP system. What mechanism provides its consistency guarantee?",
    options: [
      "Multi-leader replication with conflict resolution",
      "Single-leader design where each tablet is served by exactly one tablet server, using Chubby for leader election",
      "Paxos consensus across all tablet servers",
      "Eventual consistency with automatic reconciliation"
    ],
    correctIndex: 1,
    explanation: "Bigtable achieves strong consistency through a simple but effective mechanism: each tablet (data partition) is assigned to exactly one tablet server at a time. All reads and writes for that tablet go to its assigned server, eliminating the possibility of conflicting writes. If the tablet server fails, Chubby (Google's distributed lock service, which uses Paxos internally) detects the failure and reassigns the tablet to another server. During reassignment, the tablet is briefly unavailable — the CP trade-off. This single-server-per-tablet design makes consistency trivial (no concurrent writers) at the cost of availability during failures. HBase, the open-source Bigtable clone, uses ZooKeeper instead of Chubby for the same purpose."
  },
  {
    question: "What is 'conflict-free' about CRDTs, and what types of CRDTs exist?",
    options: [
      "CRDTs prevent conflicts by using locks — there are read-CRDTs and write-CRDTs",
      "CRDTs are mathematically designed so concurrent updates can always be merged without conflicts — the two types are state-based (CvRDT) and operation-based (CmRDT)",
      "CRDTs avoid conflicts by only allowing append operations — there are log-CRDTs and queue-CRDTs",
      "CRDTs resolve conflicts using timestamps — there are LWW-CRDTs and MWW-CRDTs"
    ],
    correctIndex: 1,
    explanation: "CRDTs achieve conflict-freedom through mathematical properties: the merge function is commutative (order doesn't matter), associative (grouping doesn't matter), and idempotent (merging the same state twice has no effect). State-based CRDTs (CvRDTs - Convergent) transmit their full state, and any two states can be merged. Operation-based CRDTs (CmRDTs - Commutative) transmit operations, which must be commutative. Examples include G-Counter (grow-only counter), PN-Counter (increment/decrement), G-Set (grow-only set), OR-Set (observed-remove set), and LWW-Register. The key insight is that by constraining the data structure's operations, you can guarantee convergence without coordination — no locks, no consensus, no conflicts. This makes CRDTs ideal for AP systems and collaborative applications."
  },
  {
    question: "What is the practical impact of CAP theorem on system design decisions in a real-world company?",
    options: [
      "Teams must choose one database technology for the entire company",
      "It forces engineers to have explicit conversations about consistency vs availability trade-offs for each use case and choose appropriate technologies",
      "It means distributed systems are impossible to build correctly",
      "It only matters for database vendors, not application developers"
    ],
    correctIndex: 1,
    explanation: "CAP's greatest practical impact is forcing explicit trade-off discussions. When designing a feature, engineers must ask: 'What happens during a network partition? Is it worse to show stale data or to show an error?' This leads to polyglot persistence — using different databases for different use cases based on their CAP properties. A company might use PostgreSQL (CP) for billing, Cassandra (AP) for user activity feeds, Redis (typically CP with caveats) for caching, and Elasticsearch (AP-ish) for search. CAP also influences API design (should this endpoint return stale data or error?), SLA definitions, and incident response procedures. The theorem's real value isn't the mathematical proof — it's the vocabulary and framework it gives teams to reason about and communicate distributed system trade-offs."
  },
  {
    question: "What happens to a Cassandra cluster if ALL nodes for a particular partition key go down?",
    options: [
      "Other nodes automatically take over the partition",
      "The data is served from a cache layer",
      "Read and write requests for that partition key fail, regardless of consistency level",
      "Cassandra reconstructs the data from parity information"
    ],
    correctIndex: 2,
    explanation: "Even in AP systems like Cassandra, if ALL replicas for a key are down, requests for that key will fail. AP guarantees availability only if at least one replica is reachable. With a replication factor of 3, losing all 3 replicas for a token range makes that data unavailable. This is why Cassandra recommends replication factor of 3 across multiple racks/data centers — it makes simultaneous failure of all replicas extremely unlikely. Cassandra doesn't use parity (like RAID) or automatic data reconstruction. It also doesn't dynamically reassign token ranges to other nodes (unlike some systems with virtual nodes that support range takeover). The data is simply unavailable until at least one replica recovers. This illustrates that 'available' in CAP means 'every non-failing node responds,' not 'the system handles any number of failures.'"
  },
  {
    question: "What is the difference between 'synchronous' and 'asynchronous' replication in terms of CAP?",
    options: [
      "Synchronous replication is always AP; asynchronous is always CP",
      "Synchronous replication provides stronger consistency (CP-leaning) by waiting for replicas to confirm before acknowledging; asynchronous is faster but may lose data (AP-leaning)",
      "There is no difference — both provide the same CAP guarantees",
      "Synchronous replication doesn't involve the network; asynchronous does"
    ],
    correctIndex: 1,
    explanation: "Synchronous replication waits for one or more replicas to confirm the write before acknowledging it to the client. This provides stronger durability and consistency (the data exists on multiple nodes before the client considers the write complete) but increases latency and reduces availability (if a replica is slow or down, the write is delayed or fails). Asynchronous replication acknowledges the write immediately after the primary stores it, then replicates in the background. This is faster and more available but risks data loss during primary failure. PostgreSQL offers both: synchronous_commit=on waits for replica confirmation, synchronous_commit=off doesn't. The choice is a direct CAP/PACELC trade-off — synchronous replication is CP/EC behavior, asynchronous is AP/EL behavior."
  },
  {
    question: "What is the 'impossibility of exactly-once delivery' and how does it relate to CAP?",
    options: [
      "Messages can always be delivered exactly once with the right protocol",
      "In a distributed system with possible failures, you can only guarantee at-most-once or at-least-once delivery, not exactly-once — making idempotency crucial for AP systems",
      "Exactly-once delivery is trivially achievable with TCP",
      "This impossibility only applies to email systems"
    ],
    correctIndex: 1,
    explanation: "In a distributed system where messages can be lost or duplicated, you can guarantee at-most-once delivery (send once, don't retry — might be lost) or at-least-once delivery (retry until acknowledged — might be duplicated), but not exactly-once delivery at the network level. This is related to CAP because AP systems that retry writes for availability may create duplicates. The practical solution is 'effectively exactly-once' through idempotent operations — designing operations so that applying them multiple times has the same effect as applying them once. For example, 'set balance to $100' is idempotent, but 'add $10 to balance' is not. Kafka achieves 'exactly-once semantics' through idempotent producers and transactional consumers — it's still at-least-once at the network level, but deduplication makes it appear exactly-once to the application."
  },
  {
    question: "What is the impact of CAP theorem on global database deployments spanning multiple continents?",
    options: [
      "Global deployments are impossible due to CAP constraints",
      "Cross-continent latency (~100-300ms) amplifies the consistency-latency trade-off: CP means high write latency for coordination; AP means fast writes but potential conflicts",
      "CAP doesn't apply to global deployments",
      "All global databases must use eventual consistency"
    ],
    correctIndex: 1,
    explanation: "In global deployments, the physics of light speed creates ~100-300ms round-trip latency between continents. For CP systems, every write requires cross-continent coordination (consensus), adding this latency to every write. Spanner accepts this cost for external consistency. For AP systems, writes can complete locally and replicate asynchronously, giving low latency but risking conflicts. The PACELC model is especially relevant here: even without partitions (which are more common across continents), the latency-consistency trade-off is severe. This is why many global systems use a hybrid approach: CP for critical data (like user identity), AP for non-critical data (like activity feeds), and careful data placement to keep most operations within a single region."
  },
  {
    question: "What is 'data sovereignty' and how does it intersect with CAP theorem decisions?",
    options: [
      "A marketing term for data encryption",
      "Legal requirements that data must reside in specific geographic regions, constraining replica placement and affecting CAP trade-offs",
      "The right of a database to refuse queries it doesn't want to answer",
      "A technique for preventing data replication"
    ],
    correctIndex: 1,
    explanation: "Data sovereignty laws (GDPR in Europe, LGPD in Brazil, etc.) require that certain data physically resides within specific geographic boundaries. This constrains where you can place replicas, directly affecting CAP trade-offs. If EU user data can only be in EU data centers, you can't have replicas in US-East for faster quorum — limiting your options for fault tolerance and latency. A partition between EU data centers has no US-based backup. Some systems (like CockroachDB and Spanner) support geo-partitioning to pin data to specific regions while maintaining global replication for other data. This intersection of legal requirements and distributed systems theory is increasingly important as more countries enact data localization laws, forcing architects to make CAP trade-offs within geographic constraints."
  },
  {
    question: "What is the 'Dynamo' model and how has it influenced modern databases?",
    options: [
      "A relational database model from Oracle",
      "A design philosophy from Amazon's Dynamo paper: leaderless replication, consistent hashing, sloppy quorums, vector clocks, hinted handoff, and eventual consistency",
      "A specific AWS database product",
      "A consensus-based replication model"
    ],
    correctIndex: 1,
    explanation: "Amazon's 2007 Dynamo paper introduced a revolutionary AP database architecture featuring: leaderless replication (any node can handle any request), consistent hashing (for data distribution), sloppy quorums (for high availability), vector clocks (for conflict detection), hinted handoff (for handling unavailable nodes), and gossip protocols (for membership and failure detection). This design prioritized availability and scalability over strong consistency. Its influence is massive: Cassandra (Facebook, based on Dynamo + Bigtable), Riak (Basho), Voldemort (LinkedIn), and DynamoDB (Amazon's managed version) all descend from this model. The paper's key insight — that many applications can tolerate eventual consistency and benefit enormously from the resulting availability — fundamentally changed distributed database design."
  },
  {
    question: "What is 'convergent conflict resolution' and why is it important?",
    options: [
      "Resolving conflicts by choosing the value that converges to zero",
      "A conflict resolution strategy where all replicas are guaranteed to reach the same final state regardless of the order they receive updates",
      "A method for resolving network routing conflicts",
      "An algorithm for merging sorted data from multiple sources"
    ],
    correctIndex: 1,
    explanation: "Convergent conflict resolution ensures that no matter what order replicas receive and process conflicting updates, they all arrive at the same final state. This is critical in AP systems where different replicas may receive updates in different orders. LWW (Last-Write-Wins) is convergent because all replicas will keep the same write (the one with the highest timestamp). CRDTs are convergent by mathematical design. Non-convergent resolution (like 'first-write-wins' in an uncoordinated system) could leave replicas permanently diverged. Convergence is the minimum viable correctness property for AP systems — without it, replicas might never agree, and clients would get different answers depending on which replica they hit, with no path to consistency even after partitions heal."
  },
  {
    question: "What is the 'write-ahead log' (WAL) pattern and which CAP-related property does it primarily support?",
    options: [
      "Partition tolerance — it helps nodes recover from partitions",
      "Availability — it keeps the system available during failures",
      "It primarily supports durability (related to the 'D' in ACID), not directly a CAP property, but is essential for recovery in both CP and AP systems",
      "Consistency — it ensures all nodes have the same data"
    ],
    correctIndex: 2,
    explanation: "Write-ahead logging (WAL) writes changes to a sequential log on disk before applying them to the main data structure. This ensures durability — if a node crashes mid-operation, it can replay the log on startup to recover its state. WAL is orthogonal to CAP (which is about distributed consistency/availability trade-offs) and is instead about single-node durability and recovery. However, WAL is essential infrastructure for both CP and AP systems: Raft and Paxos use replicated logs (WALs across nodes), and single-node databases use WAL for crash recovery. PostgreSQL, MySQL, etcd, and Cassandra all use WAL. Without WAL, a crash could leave data in a corrupt, partially-written state. It's one of the most fundamental patterns in database engineering."
  },
  {
    question: "How do service meshes like Istio relate to CAP theorem concerns?",
    options: [
      "Service meshes eliminate CAP trade-offs by providing perfect networking",
      "Service meshes provide the infrastructure layer (retries, timeouts, circuit breakers) that implements the chosen CAP trade-offs at the application level",
      "Service meshes only handle security, not consistency",
      "Service meshes enforce strong consistency across all services"
    ],
    correctIndex: 1,
    explanation: "Service meshes don't eliminate CAP trade-offs — they provide the infrastructure to implement and manage them. Circuit breakers implement availability trade-offs (fail fast vs retry). Retry policies affect consistency (retrying a non-idempotent operation could cause duplicates). Timeouts determine when a service considers a downstream service 'partitioned.' Traffic routing can direct reads to nearby replicas (AP-style) or to the primary (CP-style). For example, Istio's retry and timeout configuration directly affects whether your system behaves more CP (strict timeouts, no retries, fail-closed) or AP (generous retries, graceful degradation). The service mesh makes these policies configurable and observable, but the fundamental CAP trade-off decisions still rest with the architect."
  },
  {
    question: "What is 'optimistic replication' and which CAP property does it favor?",
    options: [
      "Replication that assumes the best case and uses strong consistency",
      "Replication that allows replicas to diverge temporarily and reconcile later, favoring availability (AP)",
      "Replication that optimizes for speed by skipping error checking",
      "Replication that only works when network conditions are optimal"
    ],
    correctIndex: 1,
    explanation: "Optimistic replication (also called lazy replication) allows replicas to accept updates independently without coordinating with other replicas first, on the 'optimistic' assumption that conflicts are rare. Conflicting updates are detected and resolved after the fact. This favors availability (AP) because nodes can always accept writes, even during partitions. Git is a great analogy — you commit locally (optimistic, no coordination) and merge/resolve conflicts later when you push/pull. Pessimistic replication (like synchronous replication) coordinates before accepting writes, favoring consistency (CP). Most AP databases use optimistic replication: Cassandra, DynamoDB, CouchDB. The trade-off is that conflict resolution can be complex and application-specific, but the availability and latency benefits are significant for many use cases."
  },
  {
    question: "In CAP terms, what is the difference between a 'partition' and a 'node failure'?",
    options: [
      "They are the same thing — both mean a node is unreachable",
      "A partition means groups of nodes can't communicate with EACH OTHER but are individually healthy; a node failure means a node is actually down",
      "A partition only affects data; a node failure affects processing",
      "A partition is permanent; a node failure is temporary"
    ],
    correctIndex: 1,
    explanation: "A network partition means the communication link between groups of nodes is broken, but the nodes themselves are healthy and running. Both sides might continue accepting client requests independently. A node failure means a specific node has actually crashed or become unresponsive. The distinction matters because partitions can cause split-brain (both sides independently serving requests) while node failures typically don't (the failed node isn't doing anything). In practice, it's often impossible to distinguish between the two from the perspective of a remote node — if you can't reach a node, is it down or is the network broken? This ambiguity is why timeout-based failure detection is inherently imperfect, and why quorum systems are designed to handle both scenarios safely."
  },
  {
    question: "What is 'active-active' vs 'active-passive' replication, and how do they map to CAP?",
    options: [
      "Active-active is CP; active-passive is AP",
      "Active-active (multi-leader, AP-leaning) has all replicas serving writes; active-passive (single-leader, CP-leaning) has one primary and standby replicas",
      "They're the same thing with different marketing names",
      "Active-active requires consensus; active-passive doesn't"
    ],
    correctIndex: 1,
    explanation: "Active-active replication has multiple nodes accepting writes simultaneously (multi-leader), which is AP-leaning because during a partition, any active node can accept writes independently. However, this creates conflict resolution challenges. Active-passive has one primary accepting writes and one or more standby replicas that take over if the primary fails. This is CP-leaning because there's always one source of truth. During a partition, if you can't reach the primary, writes are unavailable (CP behavior). Active-active is used for geo-distributed systems where latency matters (users write to their nearest leader) — Redis Enterprise, CouchDB, and DynamoDB Global Tables support this. Active-passive is common in traditional RDBMS setups — PostgreSQL streaming replication, MySQL replication."
  },
  {
    question: "Why did Amazon build DynamoDB as an AP system rather than a CP system?",
    options: [
      "Because CP systems hadn't been invented yet in 2007",
      "Because Amazon's SLA research showed that even 100ms of added latency reduced sales by 1%, making availability the top priority over consistency",
      "Because CP systems can't scale to Amazon's size",
      "Because AP systems are always faster than CP systems"
    ],
    correctIndex: 1,
    explanation: "Amazon's research quantified the business impact of latency and unavailability on e-commerce revenue. Even small increases in page load time (100ms) measurably reduced sales. An unavailable shopping cart or product page is a guaranteed lost sale. In contrast, a slightly stale product recommendation or shopping cart is barely noticeable to users. This business analysis drove the architectural decision: always be available and responsive, even at the cost of occasional inconsistency. The Dynamo paper explicitly states that Amazon's services needed an 'always-on' experience. This is a masterclass in letting business requirements drive technical trade-offs — the CAP choice wasn't made in a vacuum but based on quantified revenue impact. It demonstrates that system design decisions should start with 'what does the business need?' not 'what's the theoretically correct approach?'"
  },
  {
    question: "What is a 'read quorum' and 'write quorum' in the context of Dynamo-style systems?",
    options: [
      "The number of nodes that must be consulted during read and write operations respectively",
      "The minimum disk space required for reads and writes",
      "The CPU quota allocated for read and write operations",
      "The maximum number of concurrent reads and writes allowed"
    ],
    correctIndex: 0,
    explanation: "In Dynamo-style systems, R (read quorum) is the number of replicas that must respond to a read request, and W (write quorum) is the number of replicas that must acknowledge a write. With N replicas, common configurations are: R=1, W=N (fast reads, slow writes); R=N, W=1 (slow reads, fast writes); R=W=QUORUM (balanced). The fundamental trade-off is captured by R + W > N for strong consistency. Lower R means faster reads but potentially stale data. Lower W means faster writes but less durable. Cassandra exposes this as consistency levels (ONE, QUORUM, ALL) per query. This tunability is powerful because different access patterns within the same application can use different quorum settings — a product search might use R=1 for speed while a checkout might use R=QUORUM for correctness."
  }
];
