import type { QuizQuestion } from '../../types';

export const databasesQuiz: QuizQuestion[] = [
  {
    question: "What is the primary difference between SQL and NoSQL databases?",
    options: ["SQL is faster than NoSQL", "SQL enforces a fixed schema with structured tables; NoSQL offers flexible schemas with various data models", "NoSQL is newer and always better", "SQL doesn't support indexing"],
    correctIndex: 1,
    explanation: "SQL databases enforce a predefined schema with structured tables, rows, and columns, ensuring data consistency through constraints and relationships. NoSQL databases provide flexible schemas, allowing different records to have different structures — this includes document stores (MongoDB), key-value stores (Redis), column-family (Cassandra), and graph databases (Neo4j). The choice depends on your needs: SQL excels at complex queries and transactions with strong consistency, while NoSQL shines for flexible schemas, horizontal scaling, and high write throughput. Instagram uses both PostgreSQL (for user/relationship data needing consistency) and Cassandra (for high-volume feed data needing scale)."
  },
  {
    question: "What does ACID stand for in database transactions?",
    options: ["Automated, Consistent, Isolated, Durable", "Atomicity, Consistency, Isolation, Durability", "Atomic, Cached, Indexed, Distributed", "Available, Consistent, Isolated, Durable"],
    correctIndex: 1,
    explanation: "ACID stands for Atomicity (all operations in a transaction succeed or all fail), Consistency (the database moves from one valid state to another), Isolation (concurrent transactions don't interfere with each other), and Durability (committed data survives system failures). These properties are the foundation of reliable relational databases like PostgreSQL and MySQL. For example, in a bank transfer, atomicity ensures money is deducted from one account AND added to another — never just one. NoSQL databases often relax some ACID properties (particularly isolation and consistency) in exchange for better performance and availability, following the BASE model instead."
  },
  {
    question: "What is a B-tree index and why is it the default index type in most relational databases?",
    options: ["A binary tree for fast sorting", "A balanced tree structure that keeps data sorted and allows searches, insertions, and deletions in O(log n) time", "A tree that stores only boolean values", "A backup tree for redundancy"],
    correctIndex: 1,
    explanation: "A B-tree is a self-balancing tree data structure that maintains sorted data and allows searches, sequential access, insertions, and deletions in O(log n) time. It's the default index in PostgreSQL, MySQL, and most relational databases because it handles both equality lookups (WHERE id = 5) and range queries (WHERE age BETWEEN 20 AND 30) efficiently. B-trees have high fan-out (many children per node), which minimizes the number of disk reads — a B-tree with branching factor 500 can index billions of rows in just 3-4 levels. Each level requires one disk read, so even very large tables need only a few disk accesses. This is why B-tree indexes dramatically improve query performance on large tables."
  },
  {
    question: "What is an LSM-tree and which databases use it?",
    options: ["A tree for log storage management", "Log-Structured Merge-tree that optimizes write performance by buffering writes in memory then flushing sorted runs to disk", "A tree for least-recently-used data", "A tree structure for read optimization"],
    correctIndex: 1,
    explanation: "An LSM-tree (Log-Structured Merge-tree) optimizes write performance by first writing data to an in-memory sorted structure (memtable), then periodically flushing it to immutable sorted files (SSTables) on disk. Reads check the memtable first, then progressively older SSTables. Background compaction merges SSTables to reduce read amplification. LSM-trees are used by Cassandra, RocksDB, LevelDB, and HBase. They excel at write-heavy workloads because writes are sequential (appending to memtable and writing sorted runs) rather than random (as with B-tree page updates). The tradeoff is that reads can be slower because they may check multiple SSTables, which is mitigated by Bloom filters that quickly determine if a key exists in a given SSTable."
  },
  {
    question: "What is database normalization?",
    options: ["Making the database run at normal speed", "Organizing data to minimize redundancy by decomposing tables according to normal forms", "Converting data to a normal distribution", "Resetting the database to defaults"],
    correctIndex: 1,
    explanation: "Normalization is the process of organizing a relational database to reduce data redundancy and improve data integrity by decomposing tables according to a series of normal forms (1NF, 2NF, 3NF, BCNF, etc.). For example, instead of storing a customer's address in every order row, you store it once in a customers table and reference it via a foreign key. This prevents update anomalies (changing an address in one order but not others), insertion anomalies, and deletion anomalies. The tradeoff is that normalized databases require more JOINs to reconstruct data, which can impact read performance. Most production systems normalize to 3NF as a good balance between data integrity and query performance."
  },
  {
    question: "When would you choose denormalization over normalization?",
    options: ["Always, because it's faster", "When read performance is critical and the cost of JOINs is too high for your query patterns", "When you want better data integrity", "When disk space is limited"],
    correctIndex: 1,
    explanation: "Denormalization intentionally introduces redundancy by storing derived or copied data to avoid expensive JOINs at query time. It's chosen when read performance is the primary concern and the application can tolerate some data redundancy. For example, storing a user's name directly in the orders table (instead of joining to users table) eliminates a JOIN for the common 'show order with customer name' query. The cost is increased storage, more complex updates (must update the name in multiple places), and potential inconsistency. Social media feeds, analytics dashboards, and e-commerce product pages are common use cases where denormalization significantly improves read latency. NoSQL databases often embrace denormalization as a primary design pattern."
  },
  {
    question: "What is a document store database?",
    options: ["A database for storing PDF documents", "A NoSQL database that stores data as semi-structured documents (JSON/BSON) with flexible schemas", "A database that stores documentation", "A relational database with text columns"],
    correctIndex: 1,
    explanation: "A document store is a type of NoSQL database that stores data as semi-structured documents, typically in JSON or BSON format. Each document can have a different structure — one user document might have an 'address' field while another doesn't. This flexibility is ideal for evolving schemas and varied data. MongoDB is the most popular document store, using BSON (Binary JSON) internally. Documents are grouped into collections (analogous to tables), and you can query on any field without predefined schemas. Document stores excel when your data naturally fits a hierarchical/nested structure, like a blog post with embedded comments. The tradeoff is that cross-document queries (equivalent to JOINs) are less efficient than in relational databases."
  },
  {
    question: "What is a column-family database?",
    options: ["A database that only stores columns", "A NoSQL database that stores data in columns grouped by column families, optimized for queries over large datasets", "A relational database with many columns", "A database for spreadsheet data"],
    correctIndex: 1,
    explanation: "Column-family databases (also called wide-column stores) organize data by columns rather than rows, with columns grouped into families. Unlike relational databases where a row stores all columns together, column-family stores keep each column family's data contiguous on disk. This makes them extremely efficient for queries that read specific columns across many rows (like analytics) and for sparse data where most columns are empty. Cassandra and HBase are the main examples. Cassandra's data model uses partition keys for distribution and clustering columns for sorting within partitions. Column-family databases excel at time-series data, event logging, and analytics workloads where you typically query specific attributes across millions of records."
  },
  {
    question: "What is the CAP theorem?",
    options: ["Caching And Processing theorem", "A distributed system can only guarantee two of three: Consistency, Availability, and Partition tolerance", "Concurrency, Atomicity, and Persistence theorem", "A theorem about database capacity"],
    correctIndex: 1,
    explanation: "The CAP theorem states that in a distributed system, you can only guarantee two of three properties simultaneously: Consistency (all nodes see the same data at the same time), Availability (every request receives a response), and Partition tolerance (the system continues operating despite network failures). Since network partitions are inevitable in distributed systems, the real choice is between CP (consistency + partition tolerance, like HBase) and AP (availability + partition tolerance, like Cassandra with eventual consistency). For example, during a network partition, a CP system might refuse to serve requests to maintain consistency, while an AP system serves potentially stale data to remain available. It's important to note that CAP applies only during partition events."
  },
  {
    question: "What is the difference between OLTP and OLAP?",
    options: ["They are the same thing with different names", "OLTP handles real-time transactional operations; OLAP handles analytical queries on large datasets", "OLTP is for old systems; OLAP is for new systems", "OLTP is faster than OLAP"],
    correctIndex: 1,
    explanation: "OLTP (Online Transaction Processing) systems handle high volumes of short, real-time transactions like inserts, updates, and deletes — think of a bank processing transfers or an e-commerce site processing orders. OLAP (Online Analytical Processing) systems are optimized for complex analytical queries that scan large amounts of data — think of a data warehouse generating quarterly revenue reports. OLTP uses row-oriented storage for fast writes and point lookups, while OLAP uses columnar storage for efficient aggregation queries. PostgreSQL and MySQL are OLTP databases; Snowflake, BigQuery, and ClickHouse are OLAP systems. Many architectures use both: OLTP for the application and ETL pipelines feeding data into an OLAP system for analytics."
  },
  {
    question: "What is a composite index and when should you use one?",
    options: ["An index made of composite materials", "An index on multiple columns that speeds up queries filtering on those columns together", "An index that combines multiple tables", "An index that's created automatically"],
    correctIndex: 1,
    explanation: "A composite (compound) index covers multiple columns in a specific order, optimizing queries that filter or sort on those columns together. For example, an index on (country, city) speeds up queries like 'WHERE country = 'US' AND city = 'NYC'' and also 'WHERE country = 'US'' (leftmost prefix). However, it doesn't help 'WHERE city = 'NYC'' alone because indexes follow left-to-right column order. The column order matters enormously — put the highest-cardinality or most-frequently-filtered column first. In PostgreSQL, a composite index on (user_id, created_at) is perfect for 'SELECT * FROM orders WHERE user_id = 123 ORDER BY created_at DESC' because it satisfies both the filter and the sort in a single index scan."
  },
  {
    question: "What is a covering index?",
    options: ["An index that covers the entire table", "An index that contains all columns needed by a query, avoiding table lookups entirely", "An index with encryption coverage", "An index used for covering edge cases"],
    correctIndex: 1,
    explanation: "A covering index includes all the columns that a query needs, so the database can satisfy the query entirely from the index without reading the actual table rows (an 'index-only scan'). For example, if you frequently run 'SELECT name, email FROM users WHERE user_id = ?', an index on (user_id, name, email) covers this query completely. PostgreSQL shows this as 'Index Only Scan' in EXPLAIN output. Covering indexes can dramatically improve performance for read-heavy queries because index structures are typically smaller and more cache-friendly than full table pages. The tradeoff is that wider indexes consume more disk space and slow down writes since each INSERT/UPDATE must update the index."
  },
  {
    question: "What is database sharding?",
    options: ["Breaking a database into pieces for disposal", "Horizontally partitioning data across multiple database instances to distribute load", "Creating read replicas", "Backing up the database"],
    correctIndex: 1,
    explanation: "Sharding horizontally partitions data across multiple independent database instances (shards), each holding a subset of the total data. For example, users with IDs 1-1M go to shard 1, 1M-2M to shard 2, etc. This enables horizontal scaling beyond a single machine's capacity for both storage and throughput. Instagram sharded their PostgreSQL database by user ID to handle billions of photos. The key challenges are choosing a good shard key (to avoid hot shards), handling cross-shard queries (JOINs across shards are very expensive), and rebalancing data when adding shards. Many modern databases like CockroachDB and Vitess (MySQL) handle sharding automatically, while others like MongoDB provide built-in sharding support."
  },
  {
    question: "What is the difference between horizontal and vertical partitioning?",
    options: ["They are the same", "Horizontal partitioning splits rows across tables/databases; vertical partitioning splits columns across tables", "Horizontal is for NoSQL; vertical is for SQL", "Horizontal adds more servers; vertical adds more storage"],
    correctIndex: 1,
    explanation: "Horizontal partitioning (sharding) distributes rows across multiple tables or database instances — each partition has the same columns but different rows. For example, orders from January in one partition, February in another. Vertical partitioning splits columns across tables — frequently accessed columns stay in a 'hot' table while rarely accessed large columns (like BLOBs) go to a separate table. For example, separating user profile data (name, email — read often) from user preferences (JSON blob — read rarely). Horizontal partitioning enables scaling across machines, while vertical partitioning optimizes I/O by keeping hot data compact. PostgreSQL supports both via declarative partitioning (horizontal) and manual table decomposition (vertical)."
  },
  {
    question: "What is eventual consistency?",
    options: ["The database will eventually become consistent when you fix bugs", "All replicas will converge to the same state over time, but reads may return stale data temporarily", "The database is always consistent", "Consistency that applies only to eventual queries"],
    correctIndex: 1,
    explanation: "Eventual consistency is a consistency model where, given enough time without new updates, all replicas will converge to the same state. During the convergence period, different replicas may return different values for the same data. This is the model used by AP systems like Cassandra and DynamoDB (by default). For example, after updating a user's profile, one replica might return the old name while another returns the new name for a brief period. Eventually, all replicas sync up. The benefit is higher availability and lower latency (no need to wait for all replicas to acknowledge). For many use cases like social media likes or product view counts, eventual consistency is perfectly acceptable — users won't notice a count being off by one for a few seconds."
  },
  {
    question: "What is a graph database best suited for?",
    options: ["Storing graphs and charts", "Data with complex many-to-many relationships where traversal queries are common", "Time-series data", "Simple key-value lookups"],
    correctIndex: 1,
    explanation: "Graph databases store data as nodes (entities) and edges (relationships), making them ideal for highly connected data where relationship traversal is the primary query pattern. They excel at queries like 'find all friends of friends who work at company X' or 'what's the shortest path between person A and person B' — queries that would require multiple expensive JOINs in a relational database. Neo4j is the most popular graph database. Real-world use cases include social networks (Facebook's TAO), fraud detection (finding circular money transfers), recommendation engines (products bought by similar users), and knowledge graphs. The key advantage is that traversing relationships is O(1) per hop regardless of total data size, unlike SQL JOINs which degrade with table size."
  },
  {
    question: "What is a write-ahead log (WAL) in databases?",
    options: ["A log of future writes planned", "A durability mechanism that logs changes before applying them to the database, enabling crash recovery", "A log that's written ahead of time", "A performance optimization log"],
    correctIndex: 1,
    explanation: "A write-ahead log (WAL) records all changes to a log file before they're applied to the actual database pages. If the database crashes, it can replay the WAL to recover committed transactions that weren't yet written to the data files, and roll back incomplete transactions. This is how databases achieve durability (the 'D' in ACID) without writing every change synchronously to data files (which would be very slow due to random I/O). PostgreSQL's WAL writes sequentially to disk (fast) while data file updates happen asynchronously in the background. WAL also enables replication — replicas can stream and replay the WAL to stay in sync. MySQL's equivalent is the InnoDB redo log."
  },
  {
    question: "What is the difference between PostgreSQL and MySQL?",
    options: ["They are identical", "PostgreSQL is more standards-compliant with advanced features (JSONB, CTE, window functions); MySQL is simpler with historically better replication", "PostgreSQL is NoSQL; MySQL is SQL", "MySQL is always faster"],
    correctIndex: 1,
    explanation: "PostgreSQL is known for strict SQL standards compliance, advanced data types (JSONB, arrays, hstore), sophisticated query planner, extensibility (custom types, functions, operators), and features like CTEs, window functions, and full-text search. MySQL (especially with InnoDB) has historically offered simpler setup, better replication support, and faster performance for simple queries. PostgreSQL supports MVCC more completely and handles complex queries better, while MySQL's simpler architecture made it the default for web applications. In modern versions, the gap has narrowed significantly — MySQL 8.0 added CTEs and window functions. Companies like Instagram and Discord use PostgreSQL for its JSONB support and reliability, while many legacy web apps (WordPress, Drupal) use MySQL."
  },
];
