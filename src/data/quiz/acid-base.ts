import type { QuizQuestion } from '../../types';

export const acidBaseQuiz: QuizQuestion[] = [
  {
    question: "What does the 'A' in ACID stand for?",
    options: ["Availability", "Atomicity", "Asynchrony", "Authorization"],
    correctIndex: 1,
    explanation: "Atomicity means that a transaction is treated as a single, indivisible unit of work — either all operations succeed or none do. If any part of the transaction fails, the entire transaction is rolled back to its previous state. This ensures that the database never ends up in a partially completed state. For example, in a bank transfer, both the debit and credit must succeed together or neither should happen."
  },
  {
    question: "Which isolation level allows dirty reads?",
    options: ["Serializable", "Read Committed", "Read Uncommitted", "Repeatable Read"],
    correctIndex: 2,
    explanation: "Read Uncommitted is the lowest isolation level and allows transactions to read data that has been modified by other transactions but not yet committed. This means a transaction can see 'dirty' data that might later be rolled back, leading to inconsistent reads. While this level offers the highest concurrency and performance, it sacrifices data consistency. Higher isolation levels like Read Committed prevent this by only allowing reads of committed data."
  },
  {
    question: "What is a phantom read?",
    options: [
      "Reading data that was rolled back",
      "A new row appearing in a repeated range query within the same transaction",
      "Reading stale data from cache",
      "A deadlock between two transactions"
    ],
    correctIndex: 1,
    explanation: "A phantom read occurs when a transaction re-executes a range query and finds new rows that were inserted by another committed transaction since the first execution. Unlike non-repeatable reads (where existing rows change), phantoms involve entirely new rows appearing. For example, if you query all orders above $100, another transaction inserts a qualifying order, and your re-query now returns an extra row. Serializable isolation or gap locking prevents phantom reads."
  },
  {
    question: "Which ACID property ensures that once a transaction is committed, its changes survive system failures?",
    options: ["Atomicity", "Consistency", "Isolation", "Durability"],
    correctIndex: 3,
    explanation: "Durability guarantees that once a transaction has been committed, its effects are permanently recorded in the database, even in the event of power loss, crashes, or other system failures. This is typically achieved through write-ahead logging (WAL), where changes are written to a persistent log before being applied. Many databases also use techniques like fsync to ensure data reaches non-volatile storage. Without durability, committed transactions could be lost during recovery."
  },
  {
    question: "What is the purpose of Write-Ahead Logging (WAL)?",
    options: [
      "To speed up read queries",
      "To ensure changes are logged to disk before being applied to the database",
      "To replicate data across nodes",
      "To compress database files"
    ],
    correctIndex: 1,
    explanation: "Write-Ahead Logging ensures that all modifications are written to a sequential log file on disk before the actual database pages are updated. This provides both atomicity and durability: if the system crashes, the log can be replayed to redo committed transactions or undo uncommitted ones. WAL is highly efficient because sequential writes to the log are much faster than random writes to data pages. PostgreSQL, SQLite, and many other databases rely heavily on WAL for crash recovery."
  },
  {
    question: "In the BASE model, what does 'S' stand for?",
    options: ["Synchronous", "Soft state", "Strong consistency", "Stateless"],
    correctIndex: 1,
    explanation: "BASE stands for Basically Available, Soft state, Eventually consistent. The 'S' represents Soft state, meaning the system's state may change over time even without new input, due to the eventual consistency model. Data might be temporarily inconsistent across replicas as updates propagate asynchronously. This is a fundamental trade-off in distributed systems where availability is prioritized over immediate consistency. BASE is often contrasted with ACID as the approach favored by NoSQL databases."
  },
  {
    question: "What is the Two-Phase Commit (2PC) protocol used for?",
    options: [
      "Optimizing query execution plans",
      "Coordinating distributed transactions across multiple nodes",
      "Compressing data for storage",
      "Load balancing read requests"
    ],
    correctIndex: 1,
    explanation: "Two-Phase Commit is a distributed algorithm that ensures all participating nodes in a distributed transaction either commit or abort together. In the prepare phase, the coordinator asks all participants if they can commit, and each responds with a vote. In the commit phase, if all voted yes, the coordinator tells everyone to commit; otherwise, all abort. While 2PC guarantees atomicity across nodes, it has drawbacks including blocking if the coordinator fails. This is why alternatives like Saga patterns are sometimes preferred."
  },
  {
    question: "Which isolation level prevents non-repeatable reads but allows phantom reads?",
    options: ["Read Uncommitted", "Read Committed", "Repeatable Read", "Serializable"],
    correctIndex: 2,
    explanation: "Repeatable Read ensures that if a transaction reads a row, subsequent reads of the same row within that transaction will return the same data, even if other transactions modify it. However, it does not prevent phantom reads — new rows inserted by other transactions can still appear in range queries. In MySQL's InnoDB, Repeatable Read actually does prevent phantoms through next-key locking, but the SQL standard definition allows them. Serializable is the only standard level that prevents all anomalies."
  },
  {
    question: "What happens during the 'prepare' phase of 2PC?",
    options: [
      "The coordinator commits the transaction",
      "Each participant votes whether it can commit the transaction",
      "Data is replicated to backup nodes",
      "The transaction log is compressed"
    ],
    correctIndex: 1,
    explanation: "During the prepare phase, the coordinator sends a prepare request to all participants, asking them to guarantee they can commit the transaction. Each participant performs all necessary work (acquiring locks, writing to log) and responds with either 'yes' (ready to commit) or 'no' (cannot commit). Once a participant votes yes, it must be able to commit even after a crash, which means the decision is durable in its log. Only after receiving all votes does the coordinator proceed to the commit or abort phase."
  },
  {
    question: "What is a dirty read?",
    options: [
      "Reading data from a crashed node",
      "Reading uncommitted data from another transaction that might be rolled back",
      "Reading data from a stale cache",
      "Reading corrupted data from disk"
    ],
    correctIndex: 1,
    explanation: "A dirty read occurs when a transaction reads data that has been written by another transaction that has not yet committed. If the writing transaction later rolls back, the reading transaction will have used data that never officially existed. This can lead to serious data integrity issues, such as making business decisions based on phantom values. Only the Read Uncommitted isolation level permits dirty reads; all higher levels prevent them."
  },
  {
    question: "Which ACID property ensures that a transaction brings the database from one valid state to another?",
    options: ["Atomicity", "Consistency", "Isolation", "Durability"],
    correctIndex: 1,
    explanation: "Consistency in ACID means that a transaction must transition the database from one valid state to another valid state, maintaining all defined rules, constraints, cascades, and triggers. If a transaction would violate any integrity constraint (like a foreign key or unique constraint), the entire transaction is rolled back. This is different from consistency in the CAP theorem, which refers to all nodes seeing the same data. Database consistency relies on both the database engine enforcing constraints and application-level logic being correct."
  },
  {
    question: "What is the main disadvantage of the Serializable isolation level?",
    options: [
      "It allows dirty reads",
      "It cannot handle concurrent transactions efficiently, causing significant performance overhead",
      "It doesn't support rollbacks",
      "It requires eventual consistency"
    ],
    correctIndex: 1,
    explanation: "Serializable is the strictest isolation level, ensuring that concurrent transactions produce results identical to some serial execution order. This prevents all anomalies (dirty reads, non-repeatable reads, and phantom reads) but comes at a significant performance cost. The database must use extensive locking, predicate locks, or serializable snapshot isolation (SSI), which can dramatically reduce throughput and increase latency. Many applications choose lower isolation levels and handle edge cases in application logic for better performance."
  },
  {
    question: "In BASE, what does 'Eventually Consistent' mean?",
    options: [
      "Data is always immediately consistent",
      "Data will become consistent across all nodes given enough time without new updates",
      "Data is never consistent",
      "Consistency is checked only during reads"
    ],
    correctIndex: 1,
    explanation: "Eventually consistent means that if no new updates are made to a piece of data, all replicas will eventually converge to the same value. There is no guarantee about how long this convergence takes, but the system will reach consistency given sufficient time. This model is widely used in distributed systems like DynamoDB and Cassandra where high availability is prioritized. Applications using eventually consistent stores must be designed to tolerate temporary inconsistencies between replicas."
  },
  {
    question: "What is a non-repeatable read?",
    options: [
      "A read that returns different results when re-executed within the same transaction because another transaction modified and committed the data",
      "A read that always returns null",
      "A read that takes too long to execute",
      "A read from an uncommitted transaction"
    ],
    correctIndex: 0,
    explanation: "A non-repeatable read occurs when a transaction reads the same row twice and gets different values because another transaction modified and committed that row between the two reads. Unlike dirty reads, the data read was actually committed — it just changed between reads. For example, reading an account balance of $100, then re-reading it as $50 after another transaction's withdrawal committed. Repeatable Read and Serializable isolation levels prevent this anomaly."
  },
  {
    question: "How does optimistic concurrency control differ from pessimistic locking?",
    options: [
      "Optimistic control assumes conflicts are rare and checks at commit time, while pessimistic locking acquires locks upfront",
      "Optimistic control is slower than pessimistic locking",
      "Pessimistic locking never causes deadlocks",
      "They are the same thing with different names"
    ],
    correctIndex: 0,
    explanation: "Optimistic concurrency control (OCC) allows transactions to proceed without acquiring locks, assuming conflicts are rare. At commit time, the system validates whether any conflicts occurred and aborts the transaction if they did. Pessimistic locking, on the other hand, acquires locks on data before accessing it, preventing other transactions from modifying it. OCC works well with low-contention workloads and read-heavy scenarios, while pessimistic locking is better when conflicts are frequent and retries would be costly."
  },
  {
    question: "What is the role of a coordinator in 2PC?",
    options: [
      "To execute all queries directly",
      "To manage the commit/abort decision by collecting votes from all participants",
      "To replicate data to backup servers",
      "To optimize query execution plans"
    ],
    correctIndex: 1,
    explanation: "The coordinator in Two-Phase Commit orchestrates the entire distributed transaction process. It initiates the prepare phase by asking all participants to vote, collects their responses, and then makes the final commit or abort decision based on unanimous agreement. The coordinator must durably log its decision before sending the final command, because if it crashes, participants need to know the outcome during recovery. This central role makes the coordinator a single point of failure, which is one of 2PC's main weaknesses."
  },
  {
    question: "What does the CAP theorem state?",
    options: [
      "A distributed system can achieve consistency, availability, and partition tolerance simultaneously",
      "A distributed system can only guarantee two out of three: consistency, availability, and partition tolerance",
      "A distributed system must always choose availability over consistency",
      "A distributed system must use ACID transactions"
    ],
    correctIndex: 1,
    explanation: "The CAP theorem, formulated by Eric Brewer, states that in the presence of a network partition, a distributed system must choose between consistency (all nodes see the same data) and availability (every request receives a response). Since network partitions are inevitable in distributed systems, the real choice is between CP (consistent but may be unavailable during partitions) and AP (available but may return stale data). In practice, most systems make nuanced trade-offs rather than being strictly CP or AP."
  },
  {
    question: "What is a write-ahead log (WAL) checkpoint?",
    options: [
      "A point where the WAL file is deleted",
      "A point where all dirty pages are flushed to disk and the recovery start position is advanced",
      "A backup of the entire database",
      "A lock on the WAL file"
    ],
    correctIndex: 1,
    explanation: "A WAL checkpoint is an operation where the database flushes all dirty (modified) pages from memory to the actual data files on disk and records a new recovery start position. After a checkpoint, the database only needs to replay WAL entries after that point during crash recovery, significantly reducing recovery time. Without checkpoints, the WAL would grow indefinitely and recovery would take longer as the entire log would need to be replayed. Checkpoints balance between write performance and recovery speed."
  },
  {
    question: "Which of the following is NOT an ACID property?",
    options: ["Atomicity", "Consistency", "Availability", "Durability"],
    correctIndex: 2,
    explanation: "Availability is not part of ACID — it belongs to the CAP theorem and BASE model. The four ACID properties are Atomicity (all-or-nothing transactions), Consistency (valid state transitions), Isolation (concurrent transactions don't interfere), and Durability (committed data survives failures). Availability refers to a system's ability to respond to every request, which is a distributed systems concern rather than a transaction property."
  },
  {
    question: "What problem does the Saga pattern solve that 2PC cannot handle well?",
    options: [
      "Query optimization across databases",
      "Long-running distributed transactions where holding locks is impractical",
      "Data compression",
      "Index creation on large tables"
    ],
    correctIndex: 1,
    explanation: "The Saga pattern addresses long-running distributed transactions by breaking them into a sequence of local transactions, each with a compensating action for rollback. Unlike 2PC, which holds locks across all participants until the final commit, Sagas release resources after each local transaction completes. If a step fails, compensating transactions undo the previously completed steps. This makes Sagas more suitable for microservices architectures where transactions might span minutes or hours and locking resources that long would be impractical."
  },
  {
    question: "In MVCC (Multi-Version Concurrency Control), how are reads handled?",
    options: [
      "Reads always block writes",
      "Reads access a snapshot of the data at a point in time, without blocking writers",
      "Reads require exclusive locks",
      "Reads are always served from cache"
    ],
    correctIndex: 1,
    explanation: "MVCC maintains multiple versions of each data item, allowing read operations to access a consistent snapshot without acquiring locks or blocking concurrent writers. Each transaction sees a snapshot of the database as it existed at the transaction's start time (or statement's start time, depending on isolation level). Writers create new versions rather than overwriting existing data, so readers and writers don't conflict. PostgreSQL, Oracle, and MySQL InnoDB all use MVCC to achieve high concurrency while maintaining consistency."
  },
  {
    question: "What is the 'blocking problem' in 2PC?",
    options: [
      "Transactions block all reads",
      "If the coordinator fails after participants voted yes, participants must wait indefinitely for the coordinator to recover",
      "Network latency blocks transaction processing",
      "Database indexes block inserts"
    ],
    correctIndex: 1,
    explanation: "The blocking problem is 2PC's most significant weakness. After a participant votes 'yes' in the prepare phase, it cannot unilaterally decide to commit or abort — it must wait for the coordinator's decision. If the coordinator crashes before sending the final decision, all participants that voted yes are stuck holding locks and cannot proceed. This can block the entire system until the coordinator recovers. Three-Phase Commit (3PC) was designed to address this, though it adds complexity and is rarely used in practice."
  },
  {
    question: "What is the difference between pessimistic and optimistic locking in database transactions?",
    options: [
      "Pessimistic locking is always faster",
      "Optimistic locking checks for conflicts at read time",
      "Pessimistic locking prevents access upfront; optimistic locking allows access and validates at commit time",
      "There is no difference"
    ],
    correctIndex: 2,
    explanation: "Pessimistic locking acquires locks before accessing data, preventing other transactions from reading or modifying it until the lock is released. Optimistic locking allows multiple transactions to proceed concurrently without locks and only checks for conflicts when a transaction tries to commit, typically using version numbers or timestamps. If a conflict is detected, the transaction is aborted and must retry. Optimistic locking shines in low-contention environments, while pessimistic locking is preferred when conflicts are frequent."
  },
  {
    question: "What does 'Basically Available' mean in the BASE model?",
    options: [
      "The system is always 100% available",
      "The system guarantees availability most of the time, possibly with degraded functionality during failures",
      "The system requires manual restart after failures",
      "Availability is not a concern"
    ],
    correctIndex: 1,
    explanation: "Basically Available means the system appears to work most of the time and will respond to requests even during partial failures, though the response might be stale or approximate. Unlike strict availability guarantees, the system may degrade gracefully — for example, serving cached data when the primary is unreachable or showing partial results. This approach prioritizes keeping the system operational over ensuring perfect consistency. E-commerce sites exemplify this by showing possibly stale inventory counts rather than going offline."
  },
  {
    question: "Which mechanism does PostgreSQL primarily use for concurrency control?",
    options: ["Two-Phase Locking only", "MVCC (Multi-Version Concurrency Control)", "Optimistic locking only", "No concurrency control"],
    correctIndex: 1,
    explanation: "PostgreSQL uses MVCC as its primary concurrency control mechanism. Each row can have multiple versions, identified by transaction IDs (xmin and xmax). When a transaction updates a row, it creates a new version rather than overwriting the old one. Read transactions see a snapshot based on their transaction ID, ensuring they get a consistent view without blocking writers. Dead versions are later cleaned up by the VACUUM process. This allows PostgreSQL to achieve high concurrency with minimal lock contention."
  },
  {
    question: "What is a lost update anomaly?",
    options: [
      "A database losing data during backup",
      "Two transactions reading the same data, then both writing updates, causing one update to overwrite the other",
      "An update that takes too long to execute",
      "A failed replication of updates to a secondary node"
    ],
    correctIndex: 1,
    explanation: "A lost update occurs when two transactions read the same data, perform modifications based on what they read, and then both write back their results — the second write overwrites the first, effectively losing that update. For example, two transactions both read a counter value of 10, each increment it to 11, and write 11 back — the counter should be 12 but is 11. This can be prevented with SELECT FOR UPDATE, atomic operations, or higher isolation levels like Repeatable Read with proper conflict detection."
  },
  {
    question: "What is the purpose of undo logs in a database?",
    options: [
      "To speed up read queries",
      "To roll back uncommitted transactions and provide consistent read views for MVCC",
      "To compress data files",
      "To encrypt transaction data"
    ],
    correctIndex: 1,
    explanation: "Undo logs store the previous version of data before it was modified by a transaction, serving two critical purposes. First, they enable rollback: if a transaction is aborted, the undo log entries restore the original values. Second, they support MVCC by providing older versions of data to transactions that started before the modification. In InnoDB, undo logs are stored in the undo tablespace and are purged once no active transaction needs them. Without undo logs, neither rollback nor consistent snapshots would be possible."
  },
  {
    question: "What distinguishes a CP system from an AP system in the CAP theorem?",
    options: [
      "CP systems use caching; AP systems don't",
      "CP systems sacrifice availability during partitions to maintain consistency; AP systems sacrifice consistency to remain available",
      "CP systems are faster than AP systems",
      "AP systems cannot store data"
    ],
    correctIndex: 1,
    explanation: "In a CP (Consistent-Partition tolerant) system, when a network partition occurs, the system may refuse to respond to requests (sacrificing availability) to ensure all accessible nodes return the same, correct data. Examples include HBase and MongoDB (in default config). An AP (Available-Partition tolerant) system continues to serve requests during partitions but may return stale or conflicting data. Examples include Cassandra and DynamoDB. The choice depends on whether your application can tolerate stale data or downtime."
  },
  {
    question: "What is Serializable Snapshot Isolation (SSI)?",
    options: [
      "A technique that locks all tables during transactions",
      "An optimistic approach that detects serialization conflicts at commit time using snapshot reads",
      "A method of compressing transaction logs",
      "A way to partition data across shards"
    ],
    correctIndex: 1,
    explanation: "Serializable Snapshot Isolation (SSI) is an advanced concurrency control mechanism that provides serializable isolation without the heavy locking overhead of traditional two-phase locking. It works by allowing transactions to execute using snapshot reads (like in MVCC) and then detecting potential serialization anomalies at commit time. If a conflict is detected (read-write dependency cycles), the transaction is aborted and must retry. PostgreSQL uses SSI for its Serializable isolation level since version 9.1, offering much better performance than lock-based approaches."
  },
  {
    question: "What is the ACID property that prevents concurrent transactions from interfering with each other?",
    options: ["Atomicity", "Consistency", "Isolation", "Durability"],
    correctIndex: 2,
    explanation: "Isolation ensures that concurrent transactions execute as if they were running sequentially, without seeing each other's intermediate states. Without isolation, transactions could read partially completed data from other transactions, leading to anomalies. Different isolation levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable) offer varying degrees of protection, trading off between data correctness and performance. The database uses mechanisms like locks, MVCC, or SSI to enforce the chosen isolation level."
  },
  {
    question: "What happens if a participant in 2PC votes 'no' during the prepare phase?",
    options: [
      "The coordinator ignores the vote",
      "Only the voting participant rolls back",
      "The coordinator sends an abort message to all participants",
      "The transaction is retried automatically"
    ],
    correctIndex: 2,
    explanation: "In 2PC, the commit decision requires unanimous agreement. If any single participant votes 'no' during the prepare phase, the coordinator must send a global abort message to all participants, causing everyone to roll back their portion of the transaction. The participant that voted no has already rolled back its changes. Participants that voted yes must undo their prepared changes upon receiving the abort message. This ensures atomicity across the distributed system — the transaction is all-or-nothing."
  },
  {
    question: "What is the difference between redo and undo logs?",
    options: [
      "They are the same thing",
      "Redo logs replay committed changes after a crash; undo logs reverse uncommitted changes during rollback",
      "Redo logs are for reads; undo logs are for writes",
      "Redo logs work on disk; undo logs work in memory"
    ],
    correctIndex: 1,
    explanation: "Redo logs and undo logs serve complementary purposes in crash recovery. Redo logs (also called WAL) contain the new values of committed transactions and are replayed after a crash to ensure committed data is restored — this provides durability. Undo logs contain the old values before modification and are used to roll back uncommitted transactions during recovery — this provides atomicity. Together, they implement the ARIES recovery algorithm used in most relational databases. The redo phase replays all changes, then the undo phase reverses uncommitted ones."
  },
  {
    question: "Which consistency model provides the strongest guarantees?",
    options: ["Eventual consistency", "Causal consistency", "Linearizability", "Read-your-writes consistency"],
    correctIndex: 2,
    explanation: "Linearizability (also called strong consistency or atomic consistency) is the strongest consistency model. It guarantees that once a write completes, all subsequent reads (from any node) will return that value or a more recent one, as if there were a single copy of the data. Operations appear to take effect instantaneously at some point between their invocation and completion. This is the most intuitive model for programmers but the most expensive to implement in distributed systems, as it typically requires consensus protocols like Raft or Paxos."
  },
  {
    question: "What is a write skew anomaly?",
    options: [
      "Data being written to the wrong table",
      "Two transactions read overlapping data, make decisions based on it, and write to different rows, violating a constraint",
      "Writes being slower than reads",
      "A write that causes a deadlock"
    ],
    correctIndex: 1,
    explanation: "Write skew is a subtle concurrency anomaly where two transactions both read a set of rows satisfying some condition, then each updates different rows in a way that violates the condition. For example, if a hospital requires at least one doctor on call, and two doctors each check that the other is on call before removing themselves, both could end up off call. Unlike lost updates (which affect the same row), write skew involves different rows. Only Serializable isolation prevents write skew; Repeatable Read does not."
  },
  {
    question: "How does Three-Phase Commit (3PC) improve upon 2PC?",
    options: [
      "It's faster than 2PC",
      "It adds a pre-commit phase to avoid the blocking problem when the coordinator fails",
      "It eliminates the need for a coordinator",
      "It uses fewer network round trips"
    ],
    correctIndex: 1,
    explanation: "Three-Phase Commit adds a 'pre-commit' phase between the vote and final commit phases of 2PC. After all participants vote yes, the coordinator sends a pre-commit message before the final commit. This ensures that if the coordinator fails, any participant can determine the transaction's fate by communicating with other participants. If no participant received a pre-commit, they can safely abort. However, 3PC is still not perfectly safe under network partitions and adds latency, so it's rarely used in practice compared to alternatives like Paxos-based commits."
  },
  {
    question: "What is the purpose of savepoints in a transaction?",
    options: [
      "To save the transaction to disk",
      "To create intermediate rollback points within a transaction without aborting the entire transaction",
      "To save query execution plans",
      "To create database backups"
    ],
    correctIndex: 1,
    explanation: "Savepoints allow you to set markers within a transaction that you can roll back to without aborting the entire transaction. If a portion of the transaction fails, you can ROLLBACK TO SAVEPOINT to undo only the work after that savepoint while preserving earlier operations. This is especially useful in complex transactions with multiple steps where partial failure should not require starting over. Most databases support savepoints with SAVEPOINT, ROLLBACK TO SAVEPOINT, and RELEASE SAVEPOINT commands."
  },
  {
    question: "What is the difference between strong consistency and eventual consistency?",
    options: [
      "Strong consistency is only for SQL databases",
      "Strong consistency guarantees reads see the latest write immediately; eventual consistency guarantees convergence over time",
      "Eventual consistency is faster in all cases",
      "They are interchangeable terms"
    ],
    correctIndex: 1,
    explanation: "Strong consistency (linearizability) ensures that after a write completes, any subsequent read from any node will return that value, giving the appearance of a single copy of data. Eventual consistency only guarantees that if no new writes occur, all replicas will eventually converge to the same value, but reads in the interim may return stale data. Strong consistency requires coordination (consensus protocols, synchronous replication) which adds latency. Eventual consistency allows higher availability and lower latency but shifts complexity to the application layer."
  },
  {
    question: "What is a deadlock in the context of database transactions?",
    options: [
      "A transaction that runs forever",
      "Two or more transactions waiting for each other to release locks, creating a cycle of dependencies",
      "A transaction that cannot find the required data",
      "A database running out of memory"
    ],
    correctIndex: 1,
    explanation: "A deadlock occurs when two or more transactions form a circular chain of lock dependencies — Transaction A holds a lock that B needs, while B holds a lock that A needs. Neither can proceed, and without intervention, they'd wait forever. Databases detect deadlocks using wait-for graphs or timeout mechanisms and resolve them by aborting one transaction (the 'victim') to break the cycle. Prevention strategies include always acquiring locks in a consistent order, using lock timeouts, or using optimistic concurrency control."
  },
  {
    question: "Which of the following best describes the 'Soft State' in BASE?",
    options: [
      "The database always maintains a consistent state",
      "The system state may change over time due to eventual consistency, even without new inputs",
      "The database is in a soft-delete mode",
      "The system uses soft locks instead of hard locks"
    ],
    correctIndex: 1,
    explanation: "Soft state means the system's state can change without any explicit input, simply because data is propagating between replicas to achieve eventual consistency. At any given moment, different nodes might have different values for the same data item. This is in contrast to 'hard state' in ACID systems where the state changes only in response to explicit transactions. The softness reflects the transient nature of the data's accuracy across the distributed system until convergence is reached."
  },
  {
    question: "What is a transaction log (also known as a journal)?",
    options: [
      "A file that records user login events",
      "A sequential record of all database modifications used for crash recovery and replication",
      "A summary of query execution times",
      "A list of all database tables"
    ],
    correctIndex: 1,
    explanation: "A transaction log is a sequential file that records every modification made to the database, including the before and after images of changed data. It serves multiple critical purposes: crash recovery (replaying committed transactions and undoing uncommitted ones), point-in-time recovery (restoring the database to any moment), and replication (streaming changes to replica nodes). The log is append-only for performance, and databases like PostgreSQL, MySQL, and SQL Server all maintain transaction logs as a fundamental component of their architecture."
  },
  {
    question: "How does Read Committed isolation level work?",
    options: [
      "It allows dirty reads",
      "Each query within a transaction sees only data committed before that query began",
      "It prevents all concurrency anomalies",
      "It locks all rows accessed by the transaction"
    ],
    correctIndex: 1,
    explanation: "Read Committed ensures that any data read by a transaction has been committed by the time of the read. Each statement within the transaction gets a fresh snapshot, meaning different statements may see different committed data. This prevents dirty reads but allows non-repeatable reads (reading the same row twice may return different values if another transaction committed a change in between) and phantom reads. It's the default isolation level in PostgreSQL and Oracle, offering a good balance between consistency and concurrency."
  },
  {
    question: "What is the role of a lock manager in a database?",
    options: [
      "To encrypt database files",
      "To manage lock requests, detect deadlocks, and coordinate access to shared resources",
      "To manage user authentication",
      "To optimize query execution"
    ],
    correctIndex: 1,
    explanation: "The lock manager is a critical database component that tracks all active locks, processes lock requests from transactions, and handles lock conflicts. When a transaction requests a lock that conflicts with an existing one, the lock manager places it in a wait queue. It also runs deadlock detection algorithms (typically using wait-for graphs) to identify and resolve circular dependencies. The lock manager supports various lock types (shared, exclusive) and granularities (row, page, table) to balance concurrency and overhead."
  },
  {
    question: "What is the difference between shared locks and exclusive locks?",
    options: [
      "Shared locks are faster than exclusive locks",
      "Shared locks allow multiple readers; exclusive locks allow only one writer and block all other access",
      "Shared locks work on tables; exclusive locks work on rows",
      "There is no practical difference"
    ],
    correctIndex: 1,
    explanation: "Shared locks (S locks) are acquired for read operations and are compatible with other shared locks, allowing multiple transactions to read the same data concurrently. Exclusive locks (X locks) are acquired for write operations and are incompatible with both shared and other exclusive locks, ensuring only one transaction can modify the data. A shared lock blocks exclusive locks (readers block writers), and an exclusive lock blocks both shared and exclusive locks (writers block everyone). This protocol is fundamental to Two-Phase Locking (2PL)."
  },
  {
    question: "What is the ARIES recovery algorithm?",
    options: [
      "An algorithm for optimizing joins",
      "A database crash recovery algorithm using WAL that performs analysis, redo, and undo phases",
      "An algorithm for distributing data across shards",
      "A method for compressing database backups"
    ],
    correctIndex: 1,
    explanation: "ARIES (Algorithms for Recovery and Isolation Exploiting Semantics) is the industry-standard crash recovery algorithm. It operates in three phases: Analysis scans the log from the last checkpoint to determine which transactions were active at crash time. Redo replays all logged changes (even from uncommitted transactions) to restore the database to its pre-crash state. Undo then rolls back all uncommitted transactions. ARIES uses LSNs (Log Sequence Numbers) to avoid redundant work and supports fine-grained locking for high concurrency."
  },
  {
    question: "What is a distributed transaction?",
    options: [
      "A transaction that runs very slowly",
      "A transaction that spans multiple databases, services, or network nodes and must maintain atomicity across all of them",
      "A transaction distributed across multiple threads",
      "A transaction that is logged to multiple files"
    ],
    correctIndex: 1,
    explanation: "A distributed transaction is one that involves operations across multiple independent systems — different databases, microservices, or network nodes — that must all succeed or all fail as a single atomic unit. This is significantly more complex than local transactions because network failures, node crashes, and partial failures must be handled. Protocols like 2PC, 3PC, and Saga patterns are used to coordinate distributed transactions. The challenge is maintaining ACID properties across unreliable networks, which is fundamentally difficult per the CAP theorem."
  },
  {
    question: "What is snapshot isolation?",
    options: [
      "Taking a backup of the database",
      "Each transaction works with a consistent snapshot of the database taken at the transaction's start time",
      "Isolating the database from network access",
      "Creating a read-only copy of the database"
    ],
    correctIndex: 1,
    explanation: "Snapshot isolation provides each transaction with a consistent point-in-time view of the database as it existed when the transaction started. All reads within the transaction see this snapshot, regardless of concurrent modifications. Writes from other transactions committed after the snapshot was taken are invisible. This is implemented using MVCC, where multiple versions of rows coexist. Snapshot isolation prevents dirty reads, non-repeatable reads, and phantoms but can still allow write skew anomalies, making it weaker than true serializable isolation."
  },
  {
    question: "What is the purpose of intent locks?",
    options: [
      "To indicate a transaction's intent to acquire a finer-grained lock at a lower level",
      "To lock data temporarily",
      "To prevent deadlocks entirely",
      "To optimize read queries"
    ],
    correctIndex: 0,
    explanation: "Intent locks are used in hierarchical locking schemes (table → page → row) to signal that a transaction holds or intends to hold locks at a finer granularity. For example, an Intent Exclusive (IX) lock on a table means a transaction holds exclusive locks on some rows within that table. This allows other transactions to quickly determine whether they can acquire a table-level lock without scanning every row's lock status. Intent locks dramatically improve performance in multi-granularity locking by avoiding expensive lock compatibility checks at every level."
  },
  {
    question: "What is the difference between two-phase locking (2PL) and two-phase commit (2PC)?",
    options: [
      "They are the same protocol",
      "2PL controls concurrency within a single database; 2PC coordinates commits across distributed systems",
      "2PL is for distributed systems; 2PC is for single databases",
      "2PL is newer than 2PC"
    ],
    correctIndex: 1,
    explanation: "Two-Phase Locking (2PL) is a concurrency control protocol where a transaction has a growing phase (acquiring locks) and a shrinking phase (releasing locks), ensuring serializability within a single database. Two-Phase Commit (2PC) is a distributed consensus protocol that coordinates the commit decision across multiple nodes to ensure atomicity of distributed transactions. Despite the similar names, they solve completely different problems: 2PL manages concurrent access to shared data, while 2PC manages agreement across distributed participants."
  },
  {
    question: "What is the purpose of a redo log buffer?",
    options: [
      "To cache frequently read data",
      "To temporarily store redo log entries in memory before flushing them to disk for better write performance",
      "To store the undo log",
      "To hold query execution plans"
    ],
    correctIndex: 1,
    explanation: "The redo log buffer is a memory area that holds redo log entries before they're written to the redo log files on disk. Instead of writing each log entry individually to disk (which would be very slow), the buffer accumulates entries and flushes them in batches. The buffer is flushed when a transaction commits, when it becomes full, or periodically. This batching of writes significantly improves performance while still maintaining durability, since the buffer is flushed at commit time. InnoDB's innodb_log_buffer_size controls its size."
  },
  {
    question: "What is a compensation transaction in the Saga pattern?",
    options: [
      "A transaction that adds extra data for completeness",
      "A transaction that semantically undoes the effect of a previously completed step in the saga",
      "A transaction that retries a failed operation",
      "A transaction that compensates for slow network speeds"
    ],
    correctIndex: 1,
    explanation: "In the Saga pattern, each step has an associated compensating transaction that semantically reverses its effect if a later step fails. Unlike a database rollback which physically undoes changes, compensating transactions perform new operations to logically negate previous ones. For example, if a payment was processed but shipping fails, the compensation would issue a refund rather than rolling back the payment record. Compensating transactions must be idempotent to handle retries safely. Designing correct compensation logic is one of the main challenges of implementing Sagas."
  },
  {
    question: "What is the difference between logical and physical logging in WAL?",
    options: [
      "Logical logging records the operation performed; physical logging records the exact bytes changed on disk pages",
      "Logical logging is faster",
      "Physical logging supports distributed systems; logical logging doesn't",
      "They produce identical log entries"
    ],
    correctIndex: 0,
    explanation: "Physical logging records the exact before and after images of the data pages modified by a transaction, making redo and undo straightforward but generating large log volumes. Logical logging records the high-level operation (e.g., 'INSERT INTO table VALUES(...)'), which is more compact but harder to replay correctly, especially with concurrent operations. Most modern databases use physiological logging — a hybrid that records physical page identifiers with logical changes within those pages. This combines the benefits of both approaches."
  },
  {
    question: "What is the purpose of a transaction isolation level?",
    options: [
      "To determine how fast transactions execute",
      "To define the degree to which a transaction is protected from the effects of concurrent transactions",
      "To set the maximum number of concurrent transactions",
      "To control transaction log size"
    ],
    correctIndex: 1,
    explanation: "Transaction isolation levels define what phenomena (dirty reads, non-repeatable reads, phantom reads) a transaction might experience from concurrent transactions. Higher isolation levels provide stronger guarantees about data consistency but typically reduce concurrency and increase the chance of transaction conflicts or deadlocks. The SQL standard defines four levels: Read Uncommitted, Read Committed, Repeatable Read, and Serializable. Choosing the right level is a critical design decision that balances data correctness requirements against performance needs."
  },
  {
    question: "What is the role of LSN (Log Sequence Number) in WAL?",
    options: [
      "To identify database users",
      "To uniquely identify each log record and establish ordering for crash recovery",
      "To count the number of transactions",
      "To measure database size"
    ],
    correctIndex: 1,
    explanation: "A Log Sequence Number is a monotonically increasing identifier assigned to each entry in the write-ahead log. LSNs establish a total order of all changes and are crucial for crash recovery: the database compares the LSN of each data page with log records to determine which changes need to be redone. Each data page stores the LSN of the last log record that modified it. During recovery, if a page's LSN is less than a redo log record's LSN, that change must be replayed. LSNs also help determine the checkpoint position for efficient recovery."
  },
  {
    question: "How does quorum-based replication relate to consistency?",
    options: [
      "It has no relation to consistency",
      "By requiring writes to W replicas and reads from R replicas where W + R > N, it ensures reads see the latest write",
      "It only works with ACID databases",
      "It guarantees serializable isolation"
    ],
    correctIndex: 1,
    explanation: "Quorum-based replication achieves tunable consistency by requiring that write and read operations succeed on a minimum number of replicas. With N total replicas, if writes succeed on W nodes and reads query R nodes, then when W + R > N, at least one node in every read quorum must have the latest write, ensuring strong consistency. Common configurations include W=N, R=1 (fast reads) or W=⌊N/2⌋+1, R=⌊N/2⌋+1 (balanced). Reducing W or R below this threshold trades consistency for availability and lower latency."
  },
  {
    question: "What is a database constraint, and how does it relate to ACID consistency?",
    options: [
      "Constraints limit the number of connections",
      "Constraints are rules (unique, foreign key, check) that the database enforces to maintain consistency during transactions",
      "Constraints control transaction isolation levels",
      "Constraints manage disk space"
    ],
    correctIndex: 1,
    explanation: "Database constraints are declarative rules that define what constitutes a valid database state — including primary keys, foreign keys, unique constraints, check constraints, and not-null constraints. They are the enforcement mechanism for the 'C' (Consistency) in ACID: when a transaction would violate a constraint, the database rejects it, ensuring only valid state transitions occur. For example, a foreign key constraint prevents inserting an order referencing a non-existent customer. Without constraints, maintaining consistency would fall entirely on application code."
  },
  {
    question: "What is the difference between strict and non-strict two-phase locking?",
    options: [
      "Strict 2PL releases all locks only at transaction end; non-strict 2PL can release some locks before commit",
      "Strict 2PL is slower than non-strict",
      "Non-strict 2PL allows dirty reads",
      "They acquire locks differently"
    ],
    correctIndex: 0,
    explanation: "In strict two-phase locking (Strict 2PL), all locks are held until the transaction commits or aborts, ensuring that no other transaction can read the modified data until it's committed. In non-strict 2PL (basic 2PL), a transaction can release locks during the shrinking phase before committing, which can lead to cascading aborts — if the releasing transaction aborts, transactions that read its released data must also abort. Strict 2PL is more commonly used because it avoids cascading aborts and simplifies recovery, though it holds locks longer."
  },
  {
    question: "What is the XA protocol?",
    options: [
      "A compression protocol",
      "A standard interface for coordinating distributed transactions between a transaction manager and resource managers",
      "A network protocol for database replication",
      "An encryption standard for databases"
    ],
    correctIndex: 1,
    explanation: "XA is a standard defined by the Open Group for distributed transaction processing. It defines the interface between a Transaction Manager (TM) and Resource Managers (RMs, such as databases). The TM uses the XA interface to coordinate 2PC across multiple RMs, calling xa_prepare, xa_commit, and xa_rollback. Most major databases (PostgreSQL, MySQL, Oracle) support XA transactions. However, XA transactions have significant overhead and can cause blocking, so many modern architectures prefer Saga-based approaches for cross-service transactions."
  },
  {
    question: "What is the difference between READ_COMMITTED and SNAPSHOT isolation in SQL Server?",
    options: [
      "They are identical",
      "READ_COMMITTED uses locks for reads; SNAPSHOT uses row versioning so reads never block writes",
      "SNAPSHOT is less consistent",
      "READ_COMMITTED is faster in all cases"
    ],
    correctIndex: 1,
    explanation: "In SQL Server, READ_COMMITTED (default) acquires shared locks on rows being read, which can block if a writer holds an exclusive lock. SNAPSHOT isolation uses row versioning (MVCC) to provide each transaction with a consistent view as of its start time, so readers never block writers and vice versa. SNAPSHOT provides a stronger guarantee (no non-repeatable reads) but uses more tempdb space for version storage. SQL Server also offers READ_COMMITTED_SNAPSHOT, which combines Read Committed semantics with row versioning for statement-level consistency."
  },
  {
    question: "What is the purpose of group commit in transaction processing?",
    options: [
      "To group multiple transactions into a single transaction",
      "To batch multiple transaction log flushes into a single disk write for improved throughput",
      "To group related tables together",
      "To commit transactions across multiple databases simultaneously"
    ],
    correctIndex: 1,
    explanation: "Group commit is a performance optimization where the database batches multiple transactions' log records into a single disk flush operation. Since fsync (ensuring data reaches disk) is expensive, writing one batch of log entries is much faster than multiple individual flushes. Transactions that commit around the same time share the cost of a single disk sync. This can improve throughput dramatically under high concurrency. The trade-off is a small increase in commit latency for individual transactions as they wait for the batch to fill. PostgreSQL, MySQL, and most modern databases implement group commit."
  },
  {
    question: "What is a phantom read and which isolation levels prevent it?",
    options: [
      "Reading deleted data; prevented by all levels",
      "New rows appearing in repeated range queries; only prevented by Serializable",
      "Reading NULL values; prevented by Read Committed",
      "Reading encrypted data; prevented by Repeatable Read"
    ],
    correctIndex: 1,
    explanation: "A phantom read occurs when a transaction re-executes a range query and discovers rows that were inserted by another committed transaction. For example, querying 'SELECT * FROM orders WHERE amount > 100' might return 10 rows initially and 11 rows on re-execution. According to the SQL standard, only the Serializable isolation level prevents phantoms, though some implementations (like MySQL InnoDB's Repeatable Read with gap locking) also prevent them. Serializable uses techniques like predicate locking or SSI to block or detect phantom-producing inserts."
  },
  {
    question: "What is the difference between implicit and explicit transactions?",
    options: [
      "Implicit transactions are faster",
      "Implicit transactions are automatically started by the database for each statement; explicit transactions are manually started with BEGIN",
      "Explicit transactions don't support rollback",
      "There is no difference in modern databases"
    ],
    correctIndex: 1,
    explanation: "In autocommit mode (default in many databases), each SQL statement is implicitly wrapped in its own transaction — it's automatically committed upon success or rolled back on failure. Explicit transactions are manually started with BEGIN (or START TRANSACTION) and ended with COMMIT or ROLLBACK, allowing multiple statements to be grouped as a single atomic unit. Explicit transactions are essential when multiple related operations must succeed or fail together, such as transferring money between accounts. Understanding this distinction is crucial for correct application behavior."
  },
  {
    question: "What is the consistency guarantee of reading from a replica in a primary-replica setup?",
    options: [
      "Always strongly consistent",
      "Eventually consistent, as the replica may lag behind the primary",
      "The replica always has newer data",
      "Replicas don't support read operations"
    ],
    correctIndex: 1,
    explanation: "In a primary-replica (master-slave) setup with asynchronous replication, replicas may lag behind the primary because changes are applied with a delay. Reading from a replica provides eventual consistency — the data will eventually match the primary but may be stale at any given moment. Replication lag can range from milliseconds to seconds (or more under load). For use cases requiring strong consistency, reads must go to the primary, or synchronous replication must be used (at the cost of write latency). Some systems offer 'read-your-writes' consistency as a middle ground."
  },
  {
    question: "What is the purpose of a transaction timeout?",
    options: [
      "To optimize query performance",
      "To automatically abort transactions that exceed a time limit, preventing resource hogging and potential deadlocks",
      "To schedule transactions for later execution",
      "To measure transaction latency"
    ],
    correctIndex: 1,
    explanation: "Transaction timeouts set a maximum duration for a transaction to complete. If the timeout is exceeded, the database automatically aborts the transaction and releases all its locks and resources. This prevents long-running transactions from holding locks indefinitely, which could block other transactions and degrade system performance. Timeouts also serve as a simple deadlock resolution mechanism — if a transaction waits too long for a lock, the timeout breaks the potential deadlock. Setting appropriate timeouts is important for system reliability and resource management."
  },
  {
    question: "What is the PACELC theorem and how does it extend CAP?",
    options: [
      "It replaces CAP entirely",
      "It adds that even without partitions (E), a system must choose between latency (L) and consistency (C)",
      "It's a different name for the BASE model",
      "It only applies to SQL databases"
    ],
    correctIndex: 1,
    explanation: "PACELC extends the CAP theorem by addressing system behavior both during and without network partitions. It states: if there is a Partition (P), choose between Availability (A) and Consistency (C); Else (E), choose between Latency (L) and Consistency (C). This captures an important real-world trade-off that CAP ignores: even when the network is healthy, enforcing strong consistency requires coordination between nodes, which adds latency. For example, DynamoDB is PA/EL (favors availability and latency), while systems using synchronous replication are PC/EC (favors consistency always)."
  },
  {
    question: "What is write amplification in the context of WAL?",
    options: [
      "Writing data multiple times across the system (to the WAL, buffer pool, and data files)",
      "Writing very large transactions",
      "Amplifying write speed",
      "Writing to multiple databases simultaneously"
    ],
    correctIndex: 0,
    explanation: "Write amplification refers to the phenomenon where a single logical write results in multiple physical writes to storage. In WAL-based systems, a data modification is first written to the WAL, then eventually written to the actual data pages, and potentially written again during compaction or checkpointing. LSM-tree based storage engines (used in RocksDB, Cassandra) can have even higher write amplification due to compaction. Understanding write amplification is crucial for capacity planning and choosing appropriate storage engines for write-heavy workloads."
  },
  {
    question: "What is the difference between immediate and deferred constraint checking?",
    options: [
      "They produce different results",
      "Immediate checks constraints after each statement; deferred checks constraints only at commit time",
      "Deferred is always faster",
      "Immediate doesn't support foreign keys"
    ],
    correctIndex: 1,
    explanation: "With immediate constraint checking (the default), the database validates constraints after each individual SQL statement. If a statement violates a constraint, it's immediately rejected. Deferred constraint checking postpones validation until the transaction commits, allowing temporarily inconsistent states within the transaction. This is useful for operations like inserting mutually referencing rows (circular foreign keys) where neither row can exist without the other. PostgreSQL supports SET CONSTRAINTS DEFERRED for constraints defined as DEFERRABLE. Oracle supports similar functionality."
  },
  {
    question: "What is a read-write conflict in MVCC?",
    options: [
      "Two transactions reading the same data",
      "A transaction reading data that another concurrent transaction has written, potentially causing a serialization anomaly",
      "A conflict between read and write file permissions",
      "Reading and writing to different tables"
    ],
    correctIndex: 1,
    explanation: "In MVCC, a read-write conflict (also called a rw-dependency) occurs when one transaction reads a version of a row and another concurrent transaction writes a new version of that same row. While MVCC allows both to proceed without blocking, this creates a dependency that could lead to serialization anomalies. Serializable Snapshot Isolation (SSI) tracks these dependencies and aborts transactions when it detects dangerous patterns (like rw-dependency cycles). Detecting and handling these conflicts is the key mechanism that makes SSI work without locks."
  },
  {
    question: "How does MySQL InnoDB handle gap locking?",
    options: [
      "InnoDB doesn't support gap locking",
      "Gap locks prevent insertions into index gaps, helping prevent phantom reads at Repeatable Read isolation",
      "Gap locks only apply to primary keys",
      "Gap locking is the same as table locking"
    ],
    correctIndex: 1,
    explanation: "InnoDB uses gap locks to lock the gaps between existing index records, preventing other transactions from inserting new rows into those gaps. This is how InnoDB prevents phantom reads at the Repeatable Read isolation level — even though the SQL standard only requires Serializable to prevent phantoms. A next-key lock combines a record lock with a gap lock on the gap before the record. While gap locks effectively prevent phantoms, they can also increase lock contention and cause deadlocks, especially with range queries on non-unique indexes."
  },
  {
    question: "What is the role of a prepare record in 2PC WAL?",
    options: [
      "To mark the start of a transaction",
      "To durably record a participant's 'yes' vote so it can honor its commitment even after a crash",
      "To prepare data for compression",
      "To prepare the log for archiving"
    ],
    correctIndex: 1,
    explanation: "When a 2PC participant votes 'yes' during the prepare phase, it writes a prepare record to its local WAL before sending the vote. This is critical because the participant is making a promise: 'I can commit this transaction.' If it crashes and restarts, the prepare record tells the recovery process that this transaction is in a prepared state and must wait for the coordinator's final decision (commit or abort). Without the prepare record, the participant wouldn't know about the pending transaction after a crash and might incorrectly undo changes that should be committed."
  },
  {
    question: "What is the difference between synchronous and asynchronous replication in terms of consistency?",
    options: [
      "They provide the same consistency",
      "Synchronous replication waits for replicas to confirm writes, providing strong consistency; asynchronous allows replicas to lag",
      "Asynchronous replication is more consistent",
      "Synchronous replication doesn't support transactions"
    ],
    correctIndex: 1,
    explanation: "Synchronous replication waits for one or more replicas to acknowledge receiving and persisting a write before confirming the commit to the client. This ensures replicas are always up-to-date, providing strong consistency, but adds latency equal to the round-trip time to the replica. Asynchronous replication confirms the commit immediately after the primary persists the write, then sends changes to replicas in the background. This is faster but means replicas may lag, providing only eventual consistency. Semi-synchronous replication (waiting for one replica) is a common compromise."
  },
  {
    question: "What is a global transaction ID (GTID)?",
    options: [
      "A unique identifier for database tables",
      "A unique identifier assigned to each transaction that is consistent across all nodes in a replicated setup",
      "A global lock identifier",
      "An identifier for database users"
    ],
    correctIndex: 1,
    explanation: "A Global Transaction ID is a unique identifier assigned to each committed transaction that remains the same across all replicas in a replication topology. GTIDs simplify replication management by making it easy to determine which transactions have been applied to each replica, facilitating failover and replication setup. In MySQL, GTIDs consist of a source UUID and a sequence number (e.g., 3E11FA47-71CA-11E1-9E33-C80AA9429562:23). PostgreSQL has a similar concept with LSN-based replication slots. GTIDs eliminate the need to track binary log file positions manually."
  },
  {
    question: "What is a cascading rollback?",
    options: [
      "Rolling back transactions in order of their start time",
      "When aborting one transaction forces the abort of other transactions that read its uncommitted data",
      "Rolling back changes across multiple databases",
      "A gradual rollback of changes"
    ],
    correctIndex: 1,
    explanation: "A cascading rollback occurs when Transaction A writes data that Transaction B reads before A commits. If A then aborts, B has read invalid data and must also abort. If Transaction C read B's uncommitted data, C must abort too, creating a cascade. This is a significant problem because it can cause widespread transaction failures. Strict Two-Phase Locking prevents cascading rollbacks by holding all write locks until commit, ensuring no transaction can read uncommitted data. This is one reason strict 2PL is preferred over basic 2PL in practice."
  },
  {
    question: "What is the difference between a latch and a lock in database internals?",
    options: [
      "They are the same thing",
      "Latches are lightweight, short-term synchronization primitives for internal structures; locks are heavier, long-term mechanisms for transaction isolation",
      "Locks are faster than latches",
      "Latches support deadlock detection; locks don't"
    ],
    correctIndex: 1,
    explanation: "Latches and locks serve different purposes in database systems. Latches are low-level synchronization primitives (like mutexes) that protect internal data structures such as buffer pool pages, hash tables, and log buffers for very short durations (microseconds). They have minimal overhead and no deadlock detection. Locks are higher-level mechanisms managed by the lock manager to enforce transaction isolation — they protect logical data objects (rows, tables) and can be held for the entire transaction duration. Locks support deadlock detection and various compatibility modes (shared, exclusive)."
  },
  {
    question: "What is a transaction's visibility in MVCC?",
    options: [
      "Whether a transaction is logged",
      "The set of data versions a transaction can see based on its snapshot timestamp and the commit status of other transactions",
      "Whether the transaction is visible in monitoring tools",
      "The size of the transaction's changes"
    ],
    correctIndex: 1,
    explanation: "In MVCC, each transaction has a visibility rule that determines which row versions it can see. Generally, a transaction can see versions created by transactions that committed before it started, plus its own changes. It cannot see versions from transactions that started after it or that haven't committed yet. PostgreSQL implements this using xmin/xmax fields on each row tuple and a snapshot that lists in-progress transaction IDs. This visibility rule is what enables consistent, non-blocking reads in MVCC systems."
  },
  {
    question: "How does the Saga orchestration pattern differ from choreography?",
    options: [
      "They are the same approach",
      "Orchestration uses a central coordinator to manage steps; choreography has services react to events independently",
      "Choreography is always more reliable",
      "Orchestration doesn't support compensating transactions"
    ],
    correctIndex: 1,
    explanation: "In orchestration-based Sagas, a central orchestrator service explicitly commands each participant to execute its step and handles the logic for compensating transactions on failure. The orchestrator knows the full workflow. In choreography-based Sagas, there is no central controller — each service listens for events and decides what action to take next, publishing its own events when done. Orchestration is easier to understand and debug but creates a single point of dependency. Choreography is more decoupled but can become hard to trace and maintain as the number of services grows."
  },
  {
    question: "What is idempotency and why is it important for distributed transactions?",
    options: [
      "A mathematical concept with no practical use",
      "An operation that produces the same result whether executed once or multiple times, critical for safe retries in distributed systems",
      "A type of database index",
      "A locking strategy"
    ],
    correctIndex: 1,
    explanation: "An idempotent operation produces the same result regardless of how many times it's executed. In distributed systems, network failures can cause uncertainty about whether a request was processed, leading to retries. Without idempotency, retrying a 'transfer $100' operation could transfer $200. Idempotent designs use unique request IDs or conditional operations (e.g., 'set balance to $100' instead of 'subtract $100') so duplicates are harmless. This is essential for Saga compensating transactions, message queue consumers, and any operation that might be retried."
  },
  {
    question: "What is the purpose of VACUUM in PostgreSQL?",
    options: [
      "To compress database files",
      "To reclaim storage from dead tuples left by MVCC and update visibility information",
      "To optimize query execution plans",
      "To back up the database"
    ],
    correctIndex: 1,
    explanation: "PostgreSQL's MVCC creates new tuple versions for every update and marks old versions as dead rather than overwriting them. VACUUM reclaims the storage occupied by these dead tuples, making it available for reuse. It also updates the visibility map (tracking which pages contain only tuples visible to all active transactions) and the free space map. Without regular vacuuming, tables bloat with dead tuples, wasting disk space and degrading query performance. Autovacuum runs automatically, but understanding its behavior is crucial for PostgreSQL performance tuning."
  },
  {
    question: "What is a distributed lock and when would you use one?",
    options: [
      "A lock that is very spread out",
      "A locking mechanism that coordinates access to a shared resource across multiple nodes or services",
      "A database table lock",
      "A file system lock"
    ],
    correctIndex: 1,
    explanation: "A distributed lock ensures mutual exclusion across multiple nodes or services that don't share memory. It's used when only one process should perform an action at a time, such as processing a scheduled job, accessing an external resource, or preventing duplicate operations. Implementations include Redis-based locks (Redlock), ZooKeeper ephemeral nodes, and etcd lease-based locks. Distributed locks are inherently more complex than local locks due to network failures, clock skew, and the need for TTLs to prevent deadlocks from crashed lock holders."
  },
  {
    question: "What problem does the 'heuristic decision' solve in 2PC?",
    options: [
      "Query optimization",
      "When the coordinator is unreachable for too long, a participant unilaterally decides to commit or abort",
      "Data compression decisions",
      "Schema migration choices"
    ],
    correctIndex: 1,
    explanation: "A heuristic decision is a last-resort mechanism in 2PC where a participant that has voted 'yes' but hasn't received the coordinator's final decision makes its own commit or abort choice to unblock itself. This violates the 2PC protocol and may cause data inconsistency — if the participant commits but the coordinator eventually sends an abort (or vice versa). Heuristic decisions are recorded for manual reconciliation and should only be used when the coordinator is unreachable for an unacceptable duration. They represent a trade-off between availability and strict atomicity."
  },
  {
    question: "What is the difference between a transaction's read set and write set?",
    options: [
      "They always contain the same data",
      "The read set is data the transaction read; the write set is data it modified — used for conflict detection",
      "Read sets are larger than write sets always",
      "Write sets include only deleted data"
    ],
    correctIndex: 1,
    explanation: "A transaction's read set includes all data items it has read, and the write set includes all data items it has modified (inserted, updated, or deleted). These sets are fundamental to concurrency control: optimistic concurrency control validates that no other transaction's write set overlaps with this transaction's read set since it started. SSI uses read and write sets to detect dangerous dependency cycles. In 2PL, locks on the read set are shared locks, and locks on the write set are exclusive locks. Understanding these sets is key to reasoning about transaction anomalies."
  },
  {
    question: "What is multi-version timestamp ordering?",
    options: [
      "Ordering queries by execution time",
      "A concurrency control method where each transaction gets a timestamp and versions are maintained to allow reads of appropriate past values",
      "Sorting database records by creation date",
      "Ordering log entries by time"
    ],
    correctIndex: 1,
    explanation: "Multi-version timestamp ordering (MVTO) assigns each transaction a unique timestamp at the start and uses it to determine which version of a data item each transaction should see. When a transaction reads, it gets the latest version created by a transaction with a smaller timestamp. Writes create new versions tagged with the writing transaction's timestamp. If a write would affect a version that a newer transaction has already read, the writing transaction must abort. MVTO provides serializable isolation without locks but may have higher abort rates under contention."
  },
  {
    question: "What is the difference between point-in-time recovery and crash recovery?",
    options: [
      "They are the same process",
      "Crash recovery restores to the moment of failure; point-in-time recovery restores to any specified past moment",
      "Point-in-time recovery is automatic",
      "Crash recovery requires backups"
    ],
    correctIndex: 1,
    explanation: "Crash recovery is an automatic process that occurs when a database restarts after an unexpected failure. It replays the WAL from the last checkpoint to redo committed transactions and undo uncommitted ones, restoring the database to its state just before the crash. Point-in-time recovery (PITR) allows restoring the database to any specific moment in time by restoring a base backup and then replaying WAL records up to the desired timestamp. PITR requires a combination of periodic base backups and continuous WAL archiving, and is used for recovering from logical errors like accidental data deletion."
  },
  {
    question: "What is the relationship between ACID and performance?",
    options: [
      "ACID properties always improve performance",
      "ACID properties have no impact on performance",
      "Stronger ACID guarantees generally require more coordination, locking, and I/O, reducing throughput and increasing latency",
      "Performance depends only on hardware"
    ],
    correctIndex: 2,
    explanation: "Each ACID property introduces overhead: Atomicity requires undo logging and rollback mechanisms. Consistency requires constraint checking. Isolation requires concurrency control (locks, MVCC, or SSI). Durability requires synchronous disk writes (fsync). Stronger isolation levels demand more locking or conflict checking, reducing concurrency. This is why many applications choose lower isolation levels and why NoSQL databases often adopt the BASE model — to gain performance by relaxing ACID guarantees. The key is choosing the minimum level of consistency your application requires."
  },
  {
    question: "What is predicate locking and why is it used?",
    options: [
      "Locking rows that match a predicate condition",
      "Locking all data that matches a query's WHERE clause, including rows that don't yet exist, to prevent phantoms",
      "Locking the database predicate parser",
      "Locking only primary key columns"
    ],
    correctIndex: 1,
    explanation: "Predicate locking locks all data items that match a particular condition (predicate), including items that don't yet exist. This is the theoretically correct way to prevent phantom reads at the Serializable isolation level — if you lock the predicate 'salary > 100000', no one can insert a new row matching that predicate. However, true predicate locking is expensive to implement because it requires evaluating whether new inserts satisfy existing predicates. In practice, databases use approximations like index-range locks (next-key locking) or gap locks, which may be slightly more restrictive but are much more efficient."
  },
  {
    question: "What is the purpose of a fence token in distributed locking?",
    options: [
      "To encrypt the lock",
      "A monotonically increasing number attached to each lock acquisition to detect stale lock holders",
      "To limit the number of lock holders",
      "To measure lock duration"
    ],
    correctIndex: 1,
    explanation: "A fence token is a monotonically increasing number issued each time a lock is acquired. When a client accesses a shared resource, it includes its fence token. The resource server rejects requests with a token lower than the highest it has seen. This solves a critical problem: if Client A acquires a lock, gets delayed (GC pause, network), and the lock expires, Client B acquires the lock with a higher token. When A finally sends its request with the old token, the server rejects it. Martin Kleppmann demonstrated that without fencing, distributed locks cannot provide true mutual exclusion."
  },
  {
    question: "What is the difference between row-level and table-level locking?",
    options: [
      "They have the same performance characteristics",
      "Row-level locks are granular allowing more concurrency; table-level locks are coarser but have less overhead",
      "Table-level locking is always better",
      "Row-level locking doesn't prevent dirty reads"
    ],
    correctIndex: 1,
    explanation: "Row-level locking locks individual rows, allowing different transactions to modify different rows in the same table concurrently. This maximizes concurrency but requires more memory to track locks and more CPU for lock management. Table-level locking locks the entire table, which is simpler and cheaper to manage but blocks all concurrent access to that table. Most OLTP databases (PostgreSQL, InnoDB) default to row-level locking for maximum concurrency. Some operations (like ALTER TABLE) require table-level locks. MyISAM uses only table-level locking, which is one reason it's been largely superseded by InnoDB."
  },
  {
    question: "What is the role of the transaction manager in a database?",
    options: [
      "To manage database users",
      "To coordinate transaction execution, ensure ACID properties, manage concurrency, and handle recovery",
      "To manage disk space",
      "To optimize network connections"
    ],
    correctIndex: 1,
    explanation: "The transaction manager is the core database component responsible for maintaining the ACID properties. It coordinates with the lock manager for isolation, the log manager for atomicity and durability, and the buffer manager for efficiently accessing data. It assigns transaction IDs, manages transaction state transitions (active, partially committed, committed, aborted), handles savepoints, and coordinates recovery after crashes. In distributed databases, the transaction manager also handles distributed commit protocols like 2PC. It's essentially the orchestrator of all transactional behavior."
  },
  {
    question: "What is the 'write-write conflict' in MVCC?",
    options: [
      "Two writes to the same disk sector",
      "Two concurrent transactions attempting to modify the same row, where the second must abort or wait",
      "Writing duplicate data",
      "Writing to a read-only database"
    ],
    correctIndex: 1,
    explanation: "A write-write conflict in MVCC occurs when two concurrent transactions attempt to update the same row. Since MVCC typically uses 'first writer wins,' the second transaction to attempt the write detects that the row has been modified since it read it and must either abort (in snapshot isolation) or wait (in some implementations). In PostgreSQL's Repeatable Read, the second writer gets a serialization failure and must retry. This is different from lost updates — MVCC detects the conflict rather than silently overwriting. Proper handling of write-write conflicts is essential for data integrity."
  },
  {
    question: "What is the Paxos consensus algorithm and how does it relate to distributed transactions?",
    options: [
      "A sorting algorithm",
      "A consensus protocol that allows distributed nodes to agree on a value, used as a building block for distributed transaction commits",
      "A compression algorithm",
      "A query optimization algorithm"
    ],
    correctIndex: 1,
    explanation: "Paxos is a family of consensus protocols that enable a group of distributed nodes to agree on a single value despite node failures. Unlike 2PC, Paxos can make progress as long as a majority of nodes are available, avoiding the blocking problem. It works through a proposer-acceptor-learner model with prepare and accept phases. Systems like Google's Spanner use Paxos for distributed transaction commits, replacing 2PC's coordinator with a Paxos group for fault tolerance. Raft is a more understandable alternative to Paxos that provides the same guarantees."
  },
  {
    question: "How does Google Spanner achieve external consistency?",
    options: [
      "By using eventual consistency",
      "By combining Paxos consensus with TrueTime (GPS/atomic clock-synchronized timestamps) for globally consistent transactions",
      "By using 2PC without modification",
      "By avoiding distributed transactions"
    ],
    correctIndex: 1,
    explanation: "Google Spanner achieves external consistency (real-time ordering of transactions) by using TrueTime, an API that provides globally synchronized timestamps with bounded uncertainty using GPS and atomic clocks. When a transaction commits, Spanner assigns it a TrueTime timestamp and waits out the uncertainty interval to ensure no other transaction can be assigned an earlier timestamp that hasn't yet committed. This wait (typically a few milliseconds) guarantees that transactions are ordered consistently with real-time. Combined with Paxos for replication, Spanner provides the strongest consistency guarantees of any globally distributed database."
  },
  {
    question: "What is the purpose of the undo tablespace in InnoDB?",
    options: [
      "To store temporary tables",
      "To store undo logs that enable MVCC read views and transaction rollbacks",
      "To store database backups",
      "To store query results"
    ],
    correctIndex: 1,
    explanation: "The undo tablespace in InnoDB stores undo log records that serve two purposes: rolling back transactions when they're aborted, and providing consistent read views for MVCC. When a row is updated, the old version is written to the undo tablespace, allowing other transactions to read the previous version. The purge thread periodically removes undo records that are no longer needed by any active transaction. If long-running transactions prevent purging, the undo tablespace can grow significantly, a condition known as 'undo log bloat.' Monitoring undo tablespace size is important for production database management."
  },
  {
    question: "What is the difference between two-phase commit and consensus protocols like Raft?",
    options: [
      "They are identical protocols",
      "2PC requires all participants to agree and blocks if the coordinator fails; Raft requires only a majority and can elect a new leader",
      "Raft is slower than 2PC in all cases",
      "2PC supports more nodes than Raft"
    ],
    correctIndex: 1,
    explanation: "Two-Phase Commit and consensus protocols solve related but different problems. 2PC ensures all participants commit or abort together but requires every participant to be available — if the coordinator or any participant fails, the protocol blocks. Raft (and Paxos) require only a majority (quorum) of nodes to agree, allowing progress even when some nodes are down. 2PC coordinates heterogeneous operations (each node does something different), while Raft replicates the same state across nodes. Modern systems often combine them: using Raft for replication within a shard and 2PC for cross-shard transactions."
  },
  {
    question: "What is a materialized conflict in optimistic concurrency control?",
    options: [
      "A conflict that exists in a materialized view",
      "A situation where validation at commit time detects that another transaction has modified data this transaction read",
      "A conflict between materialized and virtual tables",
      "A pre-computed list of potential conflicts"
    ],
    correctIndex: 1,
    explanation: "In optimistic concurrency control, a materialized conflict is detected during the validation phase when a committing transaction discovers that data it read has been modified by another transaction that committed since the read. The validating transaction must then abort and retry because its computations were based on stale data. The validation typically compares the transaction's read set against the write sets of all transactions that committed during its execution. While optimistic control avoids lock overhead, materialized conflicts lead to wasted work, making it less suitable for high-contention workloads."
  },
  {
    question: "How does CockroachDB handle distributed transactions differently from traditional 2PC?",
    options: [
      "It doesn't support distributed transactions",
      "It uses a parallel commit protocol that allows transactions to be considered committed before all intents are resolved",
      "It uses the exact same 2PC protocol",
      "It uses eventual consistency instead"
    ],
    correctIndex: 1,
    explanation: "CockroachDB uses a parallel commit protocol that improves on traditional 2PC by allowing a transaction to be considered committed as soon as all writes (called 'intents') are staged and the transaction record is committed, without waiting for intents to be resolved (cleaned up). This reduces the critical path of a distributed commit to a single round of parallel writes. Intents are resolved asynchronously afterward. CockroachDB also uses a hybrid logical clock (HLC) for timestamp ordering and serializable isolation by default, making it one of the few distributed databases offering strong consistency with reasonable performance."
  },
  {
    question: "What is the 'phantom problem' in index locking?",
    options: [
      "Indexes that disappear after restart",
      "Range queries missing newly inserted rows because index locks don't cover the gaps where new entries could be inserted",
      "Corrupted index entries",
      "Indexes taking up phantom disk space"
    ],
    correctIndex: 1,
    explanation: "The phantom problem in index locking occurs when a transaction's range scan locks only existing index entries but not the gaps between them. Another transaction can then insert a new row that falls within the range, and a subsequent scan by the first transaction will see this 'phantom' row. To solve this, databases use next-key locking (InnoDB) or predicate locking, which locks not just existing entries but also the gaps where new qualifying entries could be inserted. This is one of the most subtle concurrency issues and is the reason Serializable isolation requires special locking techniques."
  },
  {
    question: "What is the relationship between WAL and replication?",
    options: [
      "WAL cannot be used for replication",
      "WAL records can be shipped to replicas to replay changes, providing physical replication",
      "Replication replaces the need for WAL",
      "WAL is only used for backup, not replication"
    ],
    correctIndex: 1,
    explanation: "WAL-based (physical) replication works by streaming WAL records from the primary to replica servers, which replay them to maintain identical copies of the data. PostgreSQL's streaming replication works this way, sending WAL segments in near real-time. This is efficient because the same log needed for crash recovery is reused for replication. However, physical replication requires replicas to have identical binary formats. Logical replication (used in MySQL's binlog replication and PostgreSQL's logical decoding) operates at a higher level, describing row changes independently of physical storage format, enabling cross-version replication."
  },
  {
    question: "What is the purpose of a read view (or snapshot) in InnoDB?",
    options: [
      "To create a materialized view",
      "To establish which transaction versions are visible to a given transaction based on active transaction IDs at snapshot creation time",
      "To optimize read queries",
      "To read data from multiple tables simultaneously"
    ],
    correctIndex: 1,
    explanation: "An InnoDB read view is a snapshot that records the state of active transactions at the time it's created. It contains the list of active (uncommitted) transaction IDs, the lowest active transaction ID, and the next transaction ID to be assigned. Using this information, the read view determines visibility: changes from transactions that were committed before the read view was created are visible; changes from active or future transactions are not. At Read Committed, a new read view is created for each statement; at Repeatable Read, one read view is used for the entire transaction."
  },
  {
    question: "What is the Calvin distributed transaction protocol?",
    options: [
      "A caching protocol",
      "A deterministic transaction processing system that pre-orders all transactions to avoid distributed coordination during execution",
      "A consensus protocol for leader election",
      "A data compression protocol"
    ],
    correctIndex: 1,
    explanation: "Calvin is a distributed transaction protocol that takes a fundamentally different approach from traditional protocols by establishing a global transaction order before execution. A sequencing layer collects transactions and assigns them a deterministic order. Each node then executes transactions in this pre-determined order, guaranteeing that all nodes reach the same state without runtime coordination for commit decisions. This eliminates the need for 2PC during execution since the outcome is predetermined. The trade-off is added latency in the sequencing phase and the requirement that transaction read/write sets be known in advance."
  },
  {
    question: "What is an anti-dependency (write-read conflict) in serialization theory?",
    options: [
      "A dependency that cancels out another",
      "When a transaction writes a value that another concurrent transaction has already read, creating a potential serialization anomaly",
      "A conflict between antivirus and database software",
      "A dependency that doesn't matter"
    ],
    correctIndex: 1,
    explanation: "An anti-dependency (or write-read dependency) occurs when Transaction T2 reads a data item, and then Transaction T1 writes a new version of that same item. In serialization order, T1 must appear before T2 (since T2 read the old version). Anti-dependencies are one of three types of dependencies in serialization graphs (along with read-write and write-write). A cycle involving anti-dependencies indicates a potential serialization anomaly. SSI specifically tracks anti-dependencies (called 'rw-conflicts') to detect and prevent serialization failures in snapshot isolation."
  },
  {
    question: "What is the difference between logical replication and physical replication?",
    options: [
      "They are the same thing",
      "Physical replication copies raw WAL bytes; logical replication decodes changes into logical operations (INSERT, UPDATE, DELETE)",
      "Logical replication is always faster",
      "Physical replication supports cross-version setups"
    ],
    correctIndex: 1,
    explanation: "Physical replication ships and replays raw WAL records, creating byte-identical replicas. It's efficient and simple but requires identical PostgreSQL versions, architecture, and even the same tablespace layout. Logical replication decodes WAL into logical change records (operations on rows), allowing replication between different versions, selective table replication, and even different database engines. PostgreSQL supports both: streaming replication (physical) and logical replication via publications/subscriptions. MySQL's binary log replication is inherently logical. Each approach has trade-offs in performance, flexibility, and complexity."
  }
];
