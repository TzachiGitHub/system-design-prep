import type { QuizQuestion } from '../../types';

export const designUrlShortenerQuiz: QuizQuestion[] = [
  {
    question: "What is the primary advantage of using base62 encoding for URL shortener keys?",
    options: ["It produces the shortest possible keys", "It uses only URL-safe characters (a-z, A-Z, 0-9)", "It prevents hash collisions entirely", "It enables automatic expiration"],
    correctIndex: 1,
    explanation: "Base62 encoding uses characters a-z (26), A-Z (26), and 0-9 (10), totaling 62 URL-safe characters. This is critical because URL shortener keys appear directly in URLs, so they must not contain special characters that could break URL parsing or require percent-encoding. Base64, by contrast, includes '+' and '/' which are not URL-safe without modification. While base62 does produce compact keys, the primary advantage is URL-safety — a 7-character base62 string gives 62^7 ≈ 3.5 trillion unique URLs, which is more than sufficient for most services."
  },
  {
    question: "How many unique short URLs can a 7-character base62 key generate?",
    options: ["About 3.5 million", "About 3.5 billion", "About 3.5 trillion", "About 3.5 quadrillion"],
    correctIndex: 2,
    explanation: "A 7-character base62 key generates 62^7 = 3,521,614,606,208, which is approximately 3.5 trillion unique combinations. This calculation is straightforward: each of the 7 positions can hold any of 62 characters. For context, bit.ly processes billions of links but is nowhere near this limit, making 7 characters a practical choice. If you needed fewer characters, 6 gives only ~57 billion combinations, while 8 gives ~218 trillion — so 7 is the sweet spot for most URL shortening services."
  },
  {
    question: "What HTTP status code should a URL shortener return for temporary redirects where analytics tracking is important?",
    options: ["200 OK", "301 Moved Permanently", "302 Found", "404 Not Found"],
    correctIndex: 2,
    explanation: "A 302 (Found) redirect tells the browser that the redirect is temporary, meaning the browser will NOT cache the redirect and will hit the URL shortener server on every request. This is critical for analytics because each request passes through your server, allowing you to log click counts, referrers, geolocation, and timestamps. A 301 (Moved Permanently) would cause browsers to cache the redirect and skip your server on subsequent visits, making your analytics incomplete. Most URL shorteners like bit.ly use 302 redirects (or 307) to ensure accurate click tracking, even though 301 would be slightly faster for end users."
  },
  {
    question: "What is the main problem with using MD5 or SHA-256 hashing directly for generating short URLs?",
    options: ["They are too slow to compute", "They produce fixed-length outputs that are too long for short URLs", "They cannot handle Unicode input", "They require a salt"],
    correctIndex: 1,
    explanation: "MD5 produces a 128-bit (32 hex characters) hash, and SHA-256 produces a 256-bit (64 hex characters) hash — both far too long for a 'short' URL. Even if you take just the first 7 characters of the hash, you dramatically increase collision probability compared to using all the bits. The birthday paradox means collisions become likely much sooner than you'd expect — with 7 characters of hex (16^7 ≈ 268 million), you'd expect a collision after roughly 23,000 URLs. A Key Generation Service (KGS) that pre-generates unique keys avoids this collision problem entirely, which is why it's the preferred approach in system design interviews."
  },
  {
    question: "What is a Key Generation Service (KGS) in the context of a URL shortener?",
    options: ["A service that encrypts URLs before storage", "A service that pre-generates unique short keys and stores them in a database", "A service that manages API authentication keys", "A service that compresses URLs"],
    correctIndex: 1,
    explanation: "A Key Generation Service (KGS) pre-generates a large pool of unique random keys (e.g., 7-character base62 strings) and stores them in a database with two tables: one for unused keys and one for used keys. When a new short URL is needed, KGS simply moves a key from the unused table to the used table, guaranteeing uniqueness without any collision checking at creation time. This is far more efficient than hash-then-check-collision approaches because the uniqueness guarantee is built into the pre-generation step. Services like bit.ly and TinyURL use similar approaches — pre-generation decouples the key uniqueness problem from the URL creation hot path, making the write operation O(1) with no retry logic needed."
  },
  {
    question: "In a URL shortener, why is the read-to-write ratio typically very high (e.g., 100:1)?",
    options: ["Because URLs expire frequently", "Because each short URL is created once but redirected many times", "Because the database performs read replicas", "Because caching is not used"],
    correctIndex: 1,
    explanation: "A short URL is created exactly once (one write) but may be clicked hundreds or thousands of times (many reads). For example, a popular tweet with a shortened link might generate millions of clicks from a single creation event. This 100:1 or even 1000:1 read-to-write ratio fundamentally shapes the system architecture: you should optimize for reads with extensive caching (Redis/Memcached), use read replicas for the database, and consider a CDN for geographic distribution. The write path can be simpler and slower since it's invoked far less frequently — this is why many URL shortener designs focus their optimization efforts on the redirect (read) path."
  },
  {
    question: "Which caching strategy is most appropriate for a URL shortener's redirect service?",
    options: ["Write-through cache", "Write-around cache with LRU eviction", "Write-back cache", "No caching needed"],
    correctIndex: 1,
    explanation: "Write-around cache with LRU (Least Recently Used) eviction is ideal because URL shortener access patterns follow a power-law distribution — a small percentage of URLs receive the vast majority of traffic. With write-around, new URL mappings are written directly to the database, and the cache is populated only on read misses. LRU eviction ensures hot (frequently accessed) URLs stay in cache while rarely-accessed URLs are evicted. Write-through would unnecessarily cache every newly created URL, most of which may never be accessed. A Redis or Memcached layer with this strategy can serve 99%+ of redirect requests from memory, reducing database load dramatically — bit.ly reportedly caches its hottest URLs this way."
  },
  {
    question: "What database type is most commonly recommended for a URL shortener's primary storage?",
    options: ["Graph database like Neo4j", "NoSQL key-value store like DynamoDB", "Time-series database like InfluxDB", "Document database like MongoDB"],
    correctIndex: 1,
    explanation: "A URL shortener's data model is fundamentally a key-value mapping: short_key → long_url. This maps perfectly to a NoSQL key-value store like DynamoDB, Cassandra, or Riak, which provide O(1) lookups by key, horizontal scalability, and high throughput. Relational databases work but add overhead for features (joins, transactions, schemas) that aren't needed for this simple mapping. The access pattern is almost entirely point lookups (get URL by key) with no complex queries, making key-value stores the natural fit. Companies like Pinterest (which shortened billions of URLs) chose similar NoSQL approaches for their URL shortening infrastructure."
  },
  {
    question: "How should you handle hash collisions when using a hash-based approach for short URL generation?",
    options: ["Ignore them — collisions are extremely rare", "Append a sequence number to the URL before re-hashing", "Use a longer hash output", "Switch to a different hashing algorithm"],
    correctIndex: 1,
    explanation: "When a collision is detected (the generated short key already exists in the database), the standard approach is to append a monotonically increasing sequence number or timestamp to the original URL and re-hash. For example, if hash('example.com') = 'abc1234' and that key is taken, you try hash('example.com1'), then hash('example.com2'), etc. This is preferable to using a longer hash (which defeats the purpose of short URLs) or switching algorithms (which doesn't prevent future collisions). However, this retry approach has performance implications under high write load, which is exactly why a KGS is preferred — it eliminates collisions entirely by pre-generating guaranteed-unique keys."
  },
  {
    question: "What is the purpose of database sharding in a URL shortener, and what is the best sharding key?",
    options: ["Shard by user ID to keep each user's URLs together", "Shard by the hash/short key for even distribution", "Shard by creation date for time-based queries", "Shard by the long URL's domain"],
    correctIndex: 1,
    explanation: "Sharding by the short key (hash) provides the most even distribution of data across shards because short keys are random (especially with base62 encoding or pre-generated random keys). This avoids hot spots — if you sharded by user ID, a single power user could overload one shard. Date-based sharding would create hot spots on the current day's shard. The short key is also the primary lookup key for redirects, so sharding by it means every redirect request hits exactly one shard with no scatter-gather needed. Consistent hashing is often used to map short keys to shards, allowing smooth scaling when adding or removing nodes — this is the approach used by large-scale URL shorteners."
  },
  {
    question: "What happens when a user requests a custom alias that already exists?",
    options: ["Silently assign a different alias", "Return an error indicating the alias is taken", "Overwrite the existing alias", "Add a random suffix to make it unique"],
    correctIndex: 1,
    explanation: "When a custom alias collides with an existing one, the correct behavior is to return a clear error (e.g., HTTP 409 Conflict) telling the user the alias is taken and to choose another. Silently changing the alias would violate the user's intent and break their expected URL. Overwriting would be a security disaster — someone could hijack existing short URLs. Adding random suffixes defeats the purpose of a custom alias. This check requires a database lookup before creation, and for KGS-based systems, you need to also check that the custom alias doesn't conflict with pre-generated keys — some systems use separate namespaces or length conventions to avoid this (e.g., custom aliases must be 8+ characters while auto-generated are exactly 7)."
  },
  {
    question: "Why might a URL shortener use 301 redirects instead of 302?",
    options: ["To reduce server load since browsers cache the redirect", "To improve SEO for the short URL", "To prevent analytics tracking", "To support HTTPS"],
    correctIndex: 0,
    explanation: "A 301 (Moved Permanently) redirect tells the browser to cache the redirect mapping locally, so subsequent clicks on the same short URL bypass the shortener's server entirely and go directly to the destination. This dramatically reduces server load and improves user experience with faster redirects. The trade-off is that you lose analytics visibility for repeat visitors. Services that prioritize performance and low infrastructure costs over detailed analytics may prefer 301. Google's goo.gl (now discontinued) originally used 301 redirects, while bit.ly uses 302 to maintain analytics — the choice depends on whether your product prioritizes speed or tracking."
  },
  {
    question: "How should a URL shortener handle URL expiration?",
    options: ["Delete expired URLs immediately from the database", "Use a lazy cleanup approach — check expiration on read and run periodic batch cleanup", "Set database TTL and let the database handle it", "Never expire URLs — storage is cheap"],
    correctIndex: 1,
    explanation: "A lazy cleanup approach is most practical: when a redirect request comes in, check if the URL has expired, and if so, return a 410 Gone or 404. Separately, run a periodic batch job (e.g., nightly) to delete expired entries and reclaim keys. Immediate deletion on expiration would require a scheduled task per URL, which doesn't scale to billions of URLs. While database-level TTL (like DynamoDB's) can work, it provides less control and doesn't allow graceful error responses. The lazy approach ensures no redirect latency impact for non-expired URLs while still eventually cleaning up storage — this is similar to how Redis handles key expiration with lazy + periodic deletion strategies."
  },
  {
    question: "What rate limiting strategy should a URL shortener use for its creation endpoint?",
    options: ["No rate limiting needed", "Rate limit by IP address with a token bucket algorithm", "Rate limit only authenticated users", "Rate limit based on URL domain"],
    correctIndex: 1,
    explanation: "Rate limiting the creation endpoint by IP address (for anonymous users) or API key (for authenticated users) using a token bucket algorithm is essential to prevent abuse. Without rate limiting, attackers could exhaust your key space, use your service for spam/phishing link distribution, or simply overwhelm your write infrastructure. Token bucket is preferred because it allows burst traffic (a user creating several URLs quickly) while enforcing a sustained rate limit. The redirect endpoint typically doesn't need aggressive rate limiting since it's designed for high-throughput reads. Real-world services like bit.ly enforce strict creation rate limits — free tier users get limited link creation per month, which serves both business and infrastructure protection purposes."
  },
  {
    question: "In a URL shortener system, what is the role of a CDN?",
    options: ["To store the database closer to users", "To cache redirect responses at edge locations for faster response times", "To compress the short URLs", "To generate short keys at edge locations"],
    correctIndex: 1,
    explanation: "A CDN (Content Delivery Network) caches the redirect responses at edge servers distributed globally, so a user in Tokyo clicking a short URL gets the redirect response from a nearby edge server rather than a data center in Virginia. With 302 redirects, CDN caching requires careful configuration (short TTLs or using the Cache-Control header) to balance performance with analytics accuracy. With 301 redirects, the CDN can aggressively cache since the redirect is permanent. This is especially impactful for viral links that receive millions of clicks from diverse geographic locations. Services like Cloudflare or AWS CloudFront can reduce redirect latency from hundreds of milliseconds to single-digit milliseconds for cached URLs."
  },
  {
    question: "What is the birthday paradox and how does it relate to URL shortener design?",
    options: ["It's about generating unique URLs for users born on the same day", "It means hash collisions become probable much sooner than intuition suggests, affecting key space sizing", "It's a method for generating random keys", "It's related to URL expiration timing"],
    correctIndex: 1,
    explanation: "The birthday paradox states that in a set of n randomly chosen values from a space of N possibilities, collisions become likely when n ≈ √N. For a URL shortener, if your key space has N possible keys, you'll likely see your first collision after approximately √N URLs. For example, with a 7-character hex key (16^7 ≈ 268M possibilities), collisions become probable after only ~16,000 URLs — far sooner than the intuitive 268M/2. This is why base62 with 7 characters (62^7 ≈ 3.5T) is preferred — collisions become likely only after ~1.87M URLs. Understanding this paradox is critical for sizing your key space correctly and justifying the use of KGS over hash-based approaches in system design interviews."
  },
  {
    question: "How should a URL shortener validate the destination URL before creating a short link?",
    options: ["Only check that it starts with http:// or https://", "Validate URL format, check against malware/phishing blacklists, and optionally verify the URL is reachable", "No validation needed — just store whatever the user provides", "Only check URL length"],
    correctIndex: 1,
    explanation: "Comprehensive URL validation involves multiple layers: format validation (proper URL syntax), protocol checking (restrict to http/https), blacklist checking against known malware/phishing databases (like Google Safe Browsing API), and optionally an HTTP HEAD request to verify the destination is reachable. This is crucial because URL shorteners are frequently abused for phishing — a legitimate-looking short URL can hide a malicious destination. Bit.ly and other major shorteners integrate with threat intelligence feeds and scan destinations periodically (not just at creation time, since a destination could become malicious later). Skipping validation exposes your service to abuse and could get your domain blacklisted by browsers and email providers."
  },
  {
    question: "What is the advantage of using a NoSQL database over a relational database for a URL shortener?",
    options: ["NoSQL supports SQL queries", "NoSQL provides horizontal scalability and handles the simple key-value access pattern efficiently", "NoSQL is always faster than relational databases", "NoSQL provides ACID transactions"],
    correctIndex: 1,
    explanation: "A URL shortener's primary data access pattern is a simple key-value lookup: given a short key, return the long URL. NoSQL databases like DynamoDB or Cassandra are purpose-built for this pattern, offering O(1) lookups and linear horizontal scalability by adding more nodes. Relational databases would work but carry overhead from features like enforcing schemas, supporting complex joins, and maintaining ACID transactions — none of which are needed for a key-value mapping. NoSQL isn't 'always faster' (that's a myth), but for this specific access pattern at scale (billions of URLs, millions of reads/second), it's the more natural and cost-effective choice. Companies like Instagram and Pinterest have successfully used NoSQL stores for similar simple-mapping use cases."
  },
  {
    question: "How can a URL shortener track analytics without significantly impacting redirect latency?",
    options: ["Log analytics synchronously before redirecting", "Write analytics events to a message queue (like Kafka) asynchronously and process them separately", "Store analytics in the same database as URL mappings", "Skip analytics for high-traffic URLs"],
    correctIndex: 1,
    explanation: "Writing analytics events asynchronously to a message queue like Kafka or Amazon Kinesis allows the redirect response to return immediately (within milliseconds) while analytics data is processed separately by downstream consumers. Synchronous logging would add database write latency to every redirect, directly impacting user experience. Storing analytics in the same database as URL mappings would create write contention on the read-optimized URL store. The async approach also enables rich analytics processing — a stream processor can compute real-time dashboards, aggregate by geography, referrer, device type, and time windows. This is a classic CQRS (Command Query Responsibility Segregation) pattern used by virtually all production URL shorteners."
  },
  {
    question: "What is consistent hashing and why is it useful for a URL shortener?",
    options: ["It ensures all hash values are the same length", "It minimizes key redistribution when adding or removing database shards", "It prevents hash collisions", "It ensures URLs are distributed alphabetically"],
    correctIndex: 1,
    explanation: "Consistent hashing maps both keys and servers onto a hash ring, so each key is assigned to the nearest server clockwise on the ring. When a server is added or removed, only the keys that map to the affected segment of the ring need to be redistributed — typically only K/N keys (where K is total keys and N is number of servers) rather than remapping everything. For a URL shortener with billions of entries across many database shards, this means adding a new shard to handle growth only requires migrating a fraction of existing data. Without consistent hashing, adding a shard with simple modular hashing (key % N) would require redistributing nearly all keys. Virtual nodes (multiple points per server on the ring) further improve distribution uniformity."
  },
  {
    question: "What is the difference between a URL shortener using random key generation vs. sequential counter-based keys?",
    options: ["Random keys are shorter than sequential ones", "Random keys don't reveal information about URL creation order or volume, while sequential keys are predictable", "Sequential keys are impossible to implement at scale", "Random keys never collide"],
    correctIndex: 1,
    explanation: "Random keys (e.g., 'xK9mQ2z') provide security through unpredictability — an attacker cannot guess other valid short URLs by incrementing a counter. Sequential keys (e.g., '0000001', '0000002') reveal business metrics (total URL count, creation rate) and allow enumeration attacks where someone scrapes all URLs by iterating through the sequence. However, sequential keys have the advantage of guaranteed uniqueness without collision checking, which is why KGS uses pre-generated random keys — combining the uniqueness guarantee of sequential generation with the unpredictability of random keys. In practice, most production URL shorteners use random or pseudo-random keys, sometimes with a distributed ID generator like Twitter's Snowflake as a seed."
  },
  {
    question: "How should a URL shortener handle the same long URL being shortened multiple times?",
    options: ["Always return the same short URL (deduplication)", "Always generate a new short URL each time", "It depends on the product requirements — dedup saves space but prevents per-context analytics", "Return an error for duplicate URLs"],
    correctIndex: 2,
    explanation: "This is a product decision with engineering trade-offs. Deduplication (returning the same short URL for the same long URL) saves storage and key space but means you can't track analytics separately for each context where the URL was shared. Generating a new short URL each time uses more storage but enables per-link analytics — a marketer sharing the same article in an email vs. a tweet wants separate click counts. Most commercial shorteners like bit.ly create a new short URL each time because analytics per-link is their core value proposition. If you do want dedup, you'd need an index on the long URL column, which adds write overhead and storage for the index itself. The interviewer wants to hear you articulate this trade-off."
  },
  {
    question: "What is the purpose of the X-Forwarded-For header in URL shortener analytics?",
    options: ["To forward the short URL to another server", "To identify the original client IP address when the request passes through proxies or load balancers", "To forward the URL to the destination", "To encrypt the client's IP address"],
    correctIndex: 1,
    explanation: "When a request passes through load balancers, reverse proxies, or CDN edge servers before reaching the URL shortener's application server, the source IP seen by the application is the proxy's IP, not the end user's. The X-Forwarded-For header preserves the original client IP chain, which is essential for geo-analytics (determining where clicks come from), rate limiting, and fraud detection. Without this header, all analytics would show your load balancer's IP as the source, making geographic and per-user analytics useless. In production, you must validate this header carefully — it can be spoofed by clients, so you typically trust only the rightmost IP added by your own infrastructure. This is a common detail that differentiates senior engineers in system design discussions."
  },
  {
    question: "Why is eventual consistency acceptable for a URL shortener's read path?",
    options: ["Because URLs change frequently", "Because a short delay in propagating new URL mappings to read replicas is tolerable — the URL will resolve correctly within seconds", "Because consistency doesn't matter for any system", "Because users don't notice errors"],
    correctIndex: 1,
    explanation: "When a user creates a short URL, there may be a brief delay (milliseconds to seconds) before the mapping propagates to all read replicas and cache nodes. This is acceptable because users rarely create a short URL and click it within the same second — typically they share it and others click it later. The trade-off is worth it because strong consistency would require synchronous replication to all nodes before returning the creation response, significantly increasing write latency and reducing availability. This is a textbook application of the CAP theorem — for a URL shortener, we prefer availability and partition tolerance (AP) over strict consistency. In the rare case a click arrives before replication completes, a cache miss falls through to the primary database, which has the data."
  },
  {
    question: "How would you design the database schema for a URL shortener?",
    options: ["Single table with columns: short_key (PK), long_url, user_id, created_at, expires_at", "Normalized schema with separate tables for URLs, users, clicks, and tags", "Store everything in a single JSON document", "Use a graph schema with URL nodes and user edges"],
    correctIndex: 0,
    explanation: "A simple single-table design with short_key as the primary key is ideal because the dominant access pattern is point lookups by short key. The table contains: short_key (partition key), long_url, user_id (who created it), created_at (timestamp), and expires_at (optional TTL). Analytics data should be stored separately (in a time-series database or data warehouse) rather than in the URL mapping table to avoid write contention. A normalized schema with joins would add unnecessary latency to the redirect hot path. Additional secondary indexes on user_id enable 'list my URLs' functionality but aren't needed for the core redirect path. This denormalized design is a perfect fit for DynamoDB or Cassandra."
  },
  {
    question: "What is the role of a load balancer in a URL shortener architecture?",
    options: ["To shorten URLs faster", "To distribute incoming redirect requests across multiple application servers for high availability and throughput", "To cache URL mappings", "To generate short keys"],
    correctIndex: 1,
    explanation: "A load balancer sits between clients and the URL shortener's application servers, distributing incoming requests (both URL creation and redirect) across multiple server instances. This provides horizontal scalability (add more servers to handle more traffic), high availability (if one server dies, traffic routes to others), and even load distribution. For a URL shortener with potentially millions of redirects per second, a single server cannot handle the load. Layer 7 (application) load balancers can also perform health checks, SSL termination, and request routing. In production, you'd typically use multiple layers — a DNS-based global load balancer (like AWS Route 53) for geographic routing, and an L7 load balancer (like nginx or AWS ALB) within each region."
  },
  {
    question: "What is the significance of using PUT vs POST for creating short URLs in a RESTful API?",
    options: ["PUT is faster than POST", "PUT is idempotent (same request = same result), making it suitable for custom aliases, while POST is for server-generated keys", "PUT supports longer URLs", "There is no difference"],
    correctIndex: 1,
    explanation: "In REST semantics, PUT is idempotent — sending the same PUT request multiple times produces the same result. This maps well to custom aliases: PUT /urls/my-custom-alias with a body containing the long URL always creates or updates the same mapping. POST is non-idempotent, meaning each call can create a different resource — appropriate when the server generates the short key, as each POST creates a new unique short URL. This distinction matters for retry logic: if a PUT request times out, the client can safely retry without creating duplicates. With POST, a retry might create a duplicate entry. In system design interviews, discussing this shows understanding of API design principles and their implications for distributed systems reliability."
  },
  {
    question: "How would you implement a URL shortener that needs to support 1 billion URLs with 10,000 redirects per second?",
    options: ["Single powerful server with lots of RAM", "Microservices architecture with separate read/write services, NoSQL storage, caching layer, and CDN", "Serverless functions for each redirect", "Peer-to-peer architecture"],
    correctIndex: 1,
    explanation: "At this scale, you need a distributed architecture with clear separation of concerns. The write service handles URL creation through a KGS, storing mappings in a horizontally-sharded NoSQL database (like DynamoDB or Cassandra). The read service handles redirects, first checking a distributed cache layer (Redis cluster) that holds hot URLs — with a typical 80/20 distribution, caching the top 20% of URLs serves 80% of requests. A CDN layer in front handles geographically distributed traffic. 10,000 redirects/second is modest for this architecture — each Redis node can handle 100K+ operations/second. A single server would be a single point of failure and couldn't scale. Serverless has cold start issues that would add unacceptable latency to redirects. This layered approach is how real URL shorteners operate at scale."
  },
  {
    question: "What is URL canonicalization and why is it important for a URL shortener?",
    options: ["Making URLs prettier", "Converting equivalent URLs to a standard form to prevent duplicate entries for the same destination", "Encrypting URLs for security", "Compressing URLs to save space"],
    correctIndex: 1,
    explanation: "URL canonicalization converts URLs to a standard form so that equivalent URLs map to the same short URL (if deduplication is desired). For example, 'HTTP://Example.COM/page' and 'http://example.com/page' are equivalent but textually different. Canonicalization includes: lowercasing the scheme and host, removing default ports (80 for HTTP, 443 for HTTPS), removing trailing slashes, sorting query parameters, and removing unnecessary fragments. Without canonicalization, the same destination could consume multiple short keys unnecessarily. However, over-aggressive canonicalization can be dangerous — removing query parameters or fragments might change the page content. The implementation should be configurable and well-tested against edge cases like URLs with authentication credentials or unusual encoding."
  },
  {
    question: "What security concern arises from URL shorteners and how can it be mitigated?",
    options: ["Short URLs use too much bandwidth", "URL shorteners can be used to disguise malicious/phishing URLs behind trusted-looking short domains", "Short URLs expire too quickly", "URL shorteners slow down page loads"],
    correctIndex: 1,
    explanation: "URL shorteners fundamentally hide the destination behind a short, opaque link, making them ideal tools for phishing attacks. An attacker can shorten a malicious URL (e.g., a fake banking login page) and share the innocent-looking short link. Mitigations include: scanning destination URLs against malware/phishing blacklists (Google Safe Browsing, PhishTank) at creation time AND periodically re-scanning existing URLs, implementing preview pages (like bit.ly's '+' suffix) that show the destination before redirecting, adding interstitial warning pages for suspicious destinations, and flagging URLs with multiple reports. Some browsers and email clients also preview short URLs before following them. This is why URL shortener services bear significant responsibility for internet safety."
  },
  {
    question: "How does a distributed counter work for URL shortener analytics?",
    options: ["Each server maintains its own counter independently", "Use a centralized counter with locks", "Approximate counting with HyperLogLog for unique visitors and append-only logs for total clicks", "Counters are stored in the URL database"],
    correctIndex: 2,
    explanation: "At scale, maintaining exact real-time counters for every short URL is impractical because it would require a synchronized write for every redirect. Instead, production systems use approximate counting structures like HyperLogLog for unique visitor counts (which uses only ~12KB of memory per counter regardless of cardinality) and append-only event logs (Kafka/Kinesis) for total click streams. Click events are asynchronously consumed and aggregated in batch or stream processing systems (like Apache Flink or Spark Streaming) to update dashboards. For rough real-time counts, Redis INCR commands with eventual aggregation work well. This separation of the real-time redirect path from the analytics aggregation path is a fundamental principle of scalable system design."
  },
  {
    question: "What is the advantage of using a Bloom filter in a URL shortener?",
    options: ["It compresses URLs", "It provides a space-efficient probabilistic check for whether a short key already exists, reducing database lookups", "It encrypts URL mappings", "It speeds up URL redirects"],
    correctIndex: 1,
    explanation: "A Bloom filter is a probabilistic data structure that can tell you with certainty when an element is NOT in a set, and with high probability when it IS in a set (allowing small false positive rates). For a URL shortener using hash-based key generation, before checking the database for a collision, you first check the Bloom filter — if it says the key doesn't exist, you skip the database lookup entirely. This dramatically reduces database reads during URL creation. The false positive rate can be tuned by adjusting the filter size (typically a few bits per element). For 1 billion URLs, a Bloom filter with 1% false positive rate requires only about 1.2 GB of memory. However, Bloom filters cannot delete entries, which complicates URL expiration — counting Bloom filters or cuckoo filters address this limitation."
  },
  {
    question: "What is the purpose of using a separate read replica database in a URL shortener?",
    options: ["To store different types of data", "To handle high read throughput by distributing redirect queries across multiple database copies", "To provide backup in case of data loss", "To speed up write operations"],
    correctIndex: 1,
    explanation: "Read replicas are copies of the primary database that handle read queries (redirect lookups) while the primary handles writes (URL creation). Given the extreme read-to-write ratio (100:1 or higher) of URL shorteners, this architecture allows you to scale read capacity independently by adding more replicas. Each replica can serve redirect queries, and a load balancer distributes read traffic across them. While replicas also provide some backup capability, that's not their primary purpose — dedicated backup solutions are separate. Write operations aren't sped up by replicas; in fact, writes may be slightly slower due to replication overhead. This is a standard pattern for read-heavy workloads and is used extensively in production systems at companies like Twitter and Pinterest."
  },
  {
    question: "How would you handle a database failure in a URL shortener?",
    options: ["Show a 500 error for all requests", "Use circuit breaker pattern with fallback to cache, and redirect to a status page for cache misses", "Retry indefinitely until the database recovers", "Queue all requests until the database comes back"],
    correctIndex: 1,
    explanation: "The circuit breaker pattern detects database failures and stops sending requests to the failing database, preventing cascade failures. For redirects, the system falls back to the cache layer — if the short URL is cached (likely for hot URLs), the redirect works normally despite the database being down. For cache misses, return a friendly error page or redirect to a status page. For URL creation, requests can be queued in a message queue (like Kafka) for processing when the database recovers. Infinite retries would overwhelm the recovering database and degrade the entire system. This graceful degradation approach ensures that the majority of redirects (those hitting cache) continue working during database outages, maintaining high availability where it matters most."
  },
  {
    question: "What is the trade-off between using auto-increment IDs vs. random IDs for short URL keys?",
    options: ["Auto-increment is always better because it's simpler", "Auto-increment reveals business metrics and is predictable; random IDs are secure but require collision handling", "Random IDs are always better because they're faster", "There is no meaningful trade-off"],
    correctIndex: 1,
    explanation: "Auto-increment IDs (1, 2, 3...) converted to base62 are simple and guarantee uniqueness, but they expose business information — anyone can estimate total URLs created and creation rate by decoding the latest short URL. They're also sequentially predictable, enabling enumeration attacks. Random IDs provide security through unpredictability but require collision detection (checking if the random key already exists). The KGS approach solves this by pre-generating random unique keys, giving you both unpredictability and guaranteed uniqueness. In a distributed system, auto-increment also requires coordination (like Twitter's Snowflake) to avoid duplicate IDs across servers, while random keys from KGS can be distributed to multiple servers from a shared pool."
  },
  {
    question: "Why is it important to URL-encode the long URL before storing it in a URL shortener?",
    options: ["To make it shorter", "To ensure special characters in the URL don't break storage, retrieval, or redirect operations", "To encrypt the URL", "To compress the URL"],
    correctIndex: 1,
    explanation: "URLs can contain special characters (spaces, Unicode, ampersands, quotes) that could break database queries, HTTP redirect headers, or JSON API responses if not properly encoded. Storing the properly encoded form ensures the URL is faithfully preserved and can be safely included in the HTTP Location header during redirect. For example, a URL containing a space should be stored with %20 encoding. Additionally, different databases handle special characters differently — proper encoding provides a consistent representation regardless of the storage backend. However, you should also store the original (decoded) URL for display purposes, as showing '%20' instead of spaces in analytics dashboards provides a poor user experience."
  },
  {
    question: "What monitoring metrics are most important for a URL shortener service?",
    options: ["Only tracking total number of URLs created", "Redirect latency (p50/p95/p99), cache hit ratio, creation throughput, error rates, and database query latency", "Only monitoring disk space usage", "Only tracking the number of active users"],
    correctIndex: 1,
    explanation: "Comprehensive monitoring is critical for a URL shortener's reliability. Redirect latency percentiles (p50, p95, p99) tell you about user experience — p99 matters because 1% of millions of daily users is still thousands of people. Cache hit ratio indicates cache effectiveness — a drop might signal a change in traffic patterns or cache issues. Creation throughput and error rates detect abuse or system problems. Database query latency detects storage layer issues before they become user-facing. Additional metrics include: KGS key pool size (to prevent running out of keys), queue depth for analytics events, and per-URL redirect rates for detecting abuse. Setting up alerts on these metrics enables proactive incident response — for example, if cache hit ratio drops below 90%, the on-call engineer investigates immediately."
  },
  {
    question: "How would you implement URL shortener expiration at database level in DynamoDB?",
    options: ["Use a cron job to scan the entire table", "Use DynamoDB's built-in TTL (Time-To-Live) feature which automatically deletes expired items", "Manually delete items on each read", "Set up a separate expiration service"],
    correctIndex: 1,
    explanation: "DynamoDB's TTL feature allows you to specify an attribute containing an expiration timestamp (Unix epoch). DynamoDB automatically scans for and deletes expired items in the background at no additional cost, without consuming write capacity. This is ideal for URL shortener expiration because it requires zero application-level code for cleanup. The deletion is eventually consistent — items may persist briefly after their TTL — so your application should still check expiration on reads. A full table scan would be prohibitively expensive at scale (billions of items), and manual deletion on reads would only clean up accessed items, leaving orphaned expired URLs consuming storage. The freed-up short keys can be recycled back to the KGS pool through a DynamoDB Streams trigger that captures deletion events."
  },
  {
    question: "What is the role of a message queue in a URL shortener architecture?",
    options: ["To queue redirect requests during peak traffic", "To decouple URL creation from analytics processing and handle asynchronous tasks like link scanning and expiration", "To store URL mappings temporarily", "To communicate between frontend and backend"],
    correctIndex: 1,
    explanation: "A message queue (like Kafka, RabbitMQ, or SQS) serves multiple asynchronous purposes in a URL shortener. First, click analytics: every redirect publishes an event to the queue, and separate analytics consumers aggregate the data without impacting redirect latency. Second, link safety scanning: newly created URLs are queued for asynchronous malware/phishing analysis, so the creation API returns quickly while scanning happens in the background. Third, expired URL cleanup: expiration events trigger key recycling back to the KGS pool. This decoupling is fundamental to building scalable systems — the synchronous redirect path stays fast and simple while complex processing happens asynchronously. Without a message queue, you'd need to perform all these operations synchronously, dramatically increasing latency and coupling between components."
  },
  {
    question: "How do you handle the 'thundering herd' problem for a popular short URL?",
    options: ["Block all requests until one completes", "Use request coalescing (single-flight) where concurrent requests for the same key share one database lookup", "Increase database capacity", "Disable the URL temporarily"],
    correctIndex: 1,
    explanation: "When a viral short URL's cache entry expires, hundreds of concurrent requests might simultaneously miss the cache and hit the database — this is the 'thundering herd' or 'cache stampede' problem. Request coalescing (also called single-flight or request collapsing) ensures that only the first request actually queries the database, while all concurrent requests for the same key wait for and share that single result. Libraries like Go's singleflight or custom implementations with distributed locks (Redis SETNX) achieve this. Additional mitigations include: staggered cache TTLs (adding random jitter to prevent synchronized expiration), cache-aside with early refresh (refreshing entries before they expire), and background cache warming for known hot URLs. This is a critical concept that shows deep understanding of caching challenges in system design interviews."
  },
  {
    question: "What is the CAP theorem trade-off for a URL shortener?",
    options: ["URL shorteners need strong consistency above all", "URL shorteners typically choose AP (Availability + Partition Tolerance) with eventual consistency, since brief stale reads are acceptable", "URL shorteners need CP (Consistency + Partition Tolerance)", "The CAP theorem doesn't apply to URL shorteners"],
    correctIndex: 1,
    explanation: "The CAP theorem states that during a network partition, a distributed system must choose between Consistency (all nodes see the same data) and Availability (every request gets a response). For a URL shortener, availability is paramount — returning a 503 error for a redirect is a worse user experience than a brief period where a newly-created URL isn't yet resolvable on all nodes. Eventual consistency means that after a new URL is created, it might take milliseconds to seconds for the mapping to propagate to all read replicas and cache nodes, which is acceptable because users rarely click a short URL within milliseconds of creating it. This AP choice aligns with DynamoDB's and Cassandra's default modes, which is another reason these databases are popular choices for URL shorteners."
  },
  {
    question: "How should a URL shortener handle internationalized (non-ASCII) long URLs?",
    options: ["Reject non-ASCII URLs", "Accept and store them with proper percent-encoding (Punycode for domains, UTF-8 percent-encoding for paths)", "Convert them to ASCII by removing non-ASCII characters", "Store them as-is without any encoding"],
    correctIndex: 1,
    explanation: "Internationalized URLs contain non-ASCII characters in domain names (IDN) and paths. The correct approach is to convert domain names using Punycode (e.g., 'münchen.de' → 'xn--mnchen-3ya.de') and percent-encode path segments using UTF-8 encoding (e.g., 'путь' → '%D0%BF%D1%83%D1%82%D1%8C'). This produces a valid ASCII URL that browsers and HTTP clients can handle. Rejecting non-ASCII URLs would exclude a huge portion of the international web. Storing them as-is could cause issues with HTTP headers (which must be ASCII) and database encoding. The display URL shown to users should preserve the original Unicode characters for readability, while the stored/redirected URL uses the encoded form. This internationalization support is increasingly important as internet usage grows globally."
  },
  {
    question: "What happens if the Key Generation Service (KGS) becomes unavailable?",
    options: ["All URL creation stops immediately", "Pre-fetched key batches on application servers allow URL creation to continue temporarily until KGS recovers or local batches are exhausted", "The system switches to hash-based generation as a fallback", "Nothing — KGS is not a critical service"],
    correctIndex: 1,
    explanation: "To avoid KGS being a single point of failure, application servers pre-fetch batches of keys from KGS (e.g., 1000 keys at a time) and store them in local memory. When KGS goes down, servers continue creating URLs using their local key batches, buying time for KGS recovery. Once local batches are exhausted, the system can either fail gracefully with a 503 or fall back to a hash-based approach with collision detection. For high availability, KGS itself should be replicated with a primary-standby setup and use a persistent database (not just in-memory) for the unused key pool. The key batch size represents a trade-off: larger batches provide more buffer during outages but mean more wasted keys if a server crashes before using its batch."
  },
  {
    question: "Why is it important to log the User-Agent header for URL shortener analytics?",
    options: ["To verify the URL format", "To identify the device type, browser, and OS of users clicking short URLs, enabling device-specific analytics", "To authenticate users", "To speed up redirects"],
    correctIndex: 1,
    explanation: "The User-Agent header contains information about the client's browser, operating system, and device type (mobile, desktop, bot). For URL shortener analytics, this data enables: device breakdown charts (60% mobile, 35% desktop, 5% tablet), browser statistics, OS distribution, and critically, bot detection — distinguishing real human clicks from automated crawlers and link preview generators (like Facebook's, Twitter's, and Slack's preview bots). Without filtering bot traffic, click analytics would be severely inflated and misleading. Modern User-Agent parsing libraries (like ua-parser) can extract structured device information from the raw header string. This granular analytics is often the premium feature that URL shortener services monetize."
  },
  {
    question: "How would you design the URL shortener's API for creating short URLs?",
    options: ["GET /create?url=<long_url>", "POST /api/v1/urls with JSON body containing the long URL, optional custom alias, and expiration", "PUT /shorten/<long_url>", "DELETE /api/v1/urls"],
    correctIndex: 1,
    explanation: "A well-designed REST API uses POST for resource creation (since each call creates a new short URL), versioned endpoints (/api/v1/) for backward compatibility, and a JSON request body for structured parameters. The body should include: 'long_url' (required), 'custom_alias' (optional), 'expires_at' (optional), and any metadata. The response should return the short URL, creation timestamp, and expiration details. Using GET for creation is an anti-pattern because GET should be idempotent and safe (no side effects), and URLs have length limits. API versioning prevents breaking existing clients when you evolve the API. Authentication via API key or OAuth token in the Authorization header enables per-user rate limiting and analytics. This RESTful design is what interviewers expect in system design discussions."
  },
  {
    question: "What is the benefit of using Redis as a caching layer for a URL shortener?",
    options: ["Redis supports complex SQL queries", "Redis provides sub-millisecond read latency, built-in TTL support, and data structures like HyperLogLog for analytics", "Redis automatically scales horizontally without configuration", "Redis provides strong ACID guarantees"],
    correctIndex: 1,
    explanation: "Redis is an in-memory data store that provides sub-millisecond read latency — critical for URL shortener redirects where every millisecond matters. Its built-in TTL (Time-To-Live) support naturally handles cache expiration, and it supports data structures beyond simple key-value: HyperLogLog for approximate unique visitor counting (using only 12KB per counter), sorted sets for top-URL leaderboards, and bitmaps for daily active URL tracking. Redis Cluster provides horizontal scaling through hash-slot-based sharding. While Redis doesn't 'automatically' scale (it requires cluster configuration), it's operationally simpler than many alternatives. Combined with the URL shortener's simple key-value access pattern, Redis achieves cache hit response times of 0.1-0.5ms, compared to 5-20ms for database lookups. This order-of-magnitude improvement is why Redis is ubiquitous in URL shortener architectures."
  },
  {
    question: "How would you implement a 'link preview' feature for a URL shortener?",
    options: ["Scrape the destination page in real-time when the short URL is accessed", "Pre-fetch and cache Open Graph metadata (title, description, image) when the short URL is created, with periodic refresh", "Embed the destination page in an iframe", "Ask the user to provide preview information manually"],
    correctIndex: 1,
    explanation: "Pre-fetching Open Graph (og:title, og:description, og:image) and Twitter Card metadata at URL creation time provides instant link previews without impacting redirect latency. The metadata is stored alongside the URL mapping and served via an API endpoint (e.g., GET /api/v1/urls/{key}/preview). Periodic background refreshes ensure metadata stays current if the destination page changes. Real-time scraping at access time would add seconds of latency and create a DoS vector. Iframes have cross-origin security restrictions and poor mobile experience. Requiring manual input adds friction to URL creation. This pre-fetch approach is exactly how Slack, Discord, and social media platforms generate link previews — they fetch the destination's metadata and cache it for fast display."
  },
  {
    question: "What is the difference between URL shortening and URL aliasing?",
    options: ["They are exactly the same thing", "Shortening generates a random/auto key; aliasing lets users choose a custom, meaningful short path (e.g., bit.ly/my-brand)", "Aliasing only works with certain URLs", "Shortening is faster than aliasing"],
    correctIndex: 1,
    explanation: "URL shortening generates an opaque, system-assigned key (like 'xK9mQ2z') optimized for brevity, while URL aliasing (also called custom short links or vanity URLs) lets users choose a meaningful, branded path (like 'bit.ly/summer-sale-2024'). Aliasing requires additional validation: checking that the custom alias is available, doesn't conflict with reserved words or system paths, meets length/character requirements, and isn't offensive. Custom aliases are a premium feature in most URL shortener business models because they provide brand value. The technical implementation differs too: auto-generated keys come from KGS, while custom aliases require a real-time uniqueness check against the database. Both map to the same underlying redirect mechanism, but the creation paths are distinct."
  },
  {
    question: "How would you prevent a URL shortener from being used as an open redirect vulnerability?",
    options: ["Only allow URLs from a whitelist of approved domains", "Validate destination URLs, implement abuse detection, add warning interstitials for suspicious URLs, and support user reporting", "Block all external URLs", "Require CAPTCHA for every redirect"],
    correctIndex: 1,
    explanation: "Open redirect vulnerabilities occur when an attacker uses your trusted short URL domain to redirect users to malicious sites, bypassing security filters that trust your domain. A multi-layered defense includes: URL validation at creation time (checking against phishing/malware databases), real-time abuse detection (monitoring for patterns like bulk creation of URLs pointing to the same suspicious domain), interstitial warning pages for URLs flagged as potentially dangerous, and a user reporting mechanism for URLs that bypass automated detection. Domain whitelisting is too restrictive for a general-purpose shortener, and CAPTCHAs on redirects would destroy user experience. This defense-in-depth approach is standard practice — Google, Microsoft, and other major shortener operators continuously scan and block millions of malicious URLs."
  },
  {
    question: "In a URL shortener, what is a 'warm-up' cache strategy?",
    options: ["Heating up the server hardware", "Pre-loading frequently accessed URL mappings into cache before traffic arrives, typically after a deployment or cache flush", "Gradually increasing rate limits", "Slowly starting the application server"],
    correctIndex: 1,
    explanation: "Cache warm-up involves pre-populating the cache with known hot URL mappings before the cache starts receiving production traffic. This is critical after events like: deploying a new cache cluster, recovering from a cache failure, or performing cache maintenance. Without warm-up, the cold cache would cause all requests to hit the database simultaneously (a thundering herd), potentially overwhelming it. Warm-up strategies include: replaying recent access logs to identify hot keys, querying the database for the most-accessed URLs, or gradually shifting traffic to the new cache while the old one is still serving. Some systems maintain a 'hot key list' specifically for this purpose. Cache warm-up is an operational detail that demonstrates production experience in system design interviews."
  },
  {
    question: "What is the advantage of using a CDN with anycast for a URL shortener?",
    options: ["It makes URLs shorter", "Anycast routes users to the nearest CDN edge server automatically via BGP, minimizing redirect latency globally", "It prevents DDoS attacks", "It compresses URL data"],
    correctIndex: 1,
    explanation: "Anycast is a network routing technique where multiple servers share the same IP address, and BGP routing directs each client to the topologically nearest server. For a URL shortener CDN, this means a user in Sydney automatically reaches an edge server in Australia rather than a server in the US, reducing redirect latency from ~200ms to ~5ms. Unlike DNS-based geographic routing which has TTL-based delays, anycast routing is immediate and transparent. Additionally, anycast provides natural DDoS resilience by distributing attack traffic across all edge locations. While DDoS protection is a side benefit, the primary advantage is latency reduction. Cloudflare and other major CDN providers use anycast extensively, and URL shortener services running on these CDNs automatically benefit from this routing optimization."
  },
  {
    question: "How do you handle database migration or schema changes in a running URL shortener service?",
    options: ["Shut down the service and perform the migration", "Use online schema migration tools (like pt-online-schema-change or gh-ost) with blue-green or rolling deployments", "Create a new database and copy all data", "Schema changes are not needed for URL shorteners"],
    correctIndex: 1,
    explanation: "Zero-downtime schema migrations are essential for a URL shortener serving millions of requests per second. Tools like gh-ost (GitHub's online schema tool) or pt-online-schema-change create a shadow copy of the table, apply the schema change, copy data incrementally, and swap tables atomically. For NoSQL databases, schema evolution is handled at the application level with backward-compatible changes (adding optional fields, handling missing fields gracefully). Blue-green deployments maintain two production environments and switch traffic after verification. Shutting down is unacceptable for a service that's part of the web's redirect infrastructure — a major shortener outage breaks millions of links across the internet. This operational awareness is what distinguishes senior engineers in system design interviews."
  },
  {
    question: "What is the impact of HTTPS on URL shortener performance?",
    options: ["HTTPS has no impact on performance", "TLS handshakes add latency to each new connection, but connection reuse and TLS 1.3 minimize the overhead", "HTTPS makes URLs shorter", "HTTPS prevents URL shortening"],
    correctIndex: 1,
    explanation: "HTTPS requires a TLS handshake before any data is exchanged, adding 1-2 round trips (with TLS 1.2) or 1 round trip (with TLS 1.3's 0-RTT) to each new connection. For a URL shortener where each redirect is often a new connection, this overhead is significant — potentially adding 50-200ms per redirect depending on geographic distance. Mitigations include: TLS 1.3 with 0-RTT resumption, TLS session tickets for returning visitors, HTTP/2 connection pooling, and CDN edge termination (which terminates TLS close to the user). Despite the overhead, HTTPS is mandatory for modern URL shorteners — browsers increasingly warn about HTTP-only sites, and HTTPS prevents intermediate network manipulation of redirects. Certificate management at scale (via Let's Encrypt or AWS ACM) is also an operational consideration."
  },
  {
    question: "How would you design a URL shortener to support A/B testing with split redirects?",
    options: ["Create two separate short URLs", "Allow a single short URL to redirect to different destinations based on configurable traffic percentages", "Randomly change the destination URL", "Use cookies to track A/B assignments"],
    correctIndex: 1,
    explanation: "Split redirect (also called split URL testing) allows a single short URL to redirect different percentages of traffic to different destination URLs. For example, 50% of clicks on 'sho.rt/campaign' go to page A and 50% to page B. Implementation requires: storing multiple destination URLs with traffic weights per short key, a deterministic assignment mechanism (hashing the request IP or generating a random number per request), and analytics that track conversions per variant. This is a powerful marketing feature — marketers can test different landing pages without creating multiple short URLs. Cookie-based tracking helps maintain consistent assignment for returning users but requires the redirect response to set a cookie before redirecting, adding complexity. This feature differentiates premium URL shortener services from basic ones."
  },
  {
    question: "What are the implications of GDPR on URL shortener design?",
    options: ["GDPR doesn't apply to URL shorteners", "URL shorteners must handle personal data (IP addresses, analytics) with consent, retention limits, and data deletion capabilities", "GDPR only requires HTTPS", "GDPR requires URLs to be encrypted"],
    correctIndex: 1,
    explanation: "GDPR considers IP addresses and device information as personal data, which URL shorteners collect during redirects for analytics. Compliance requires: a clear privacy policy explaining what data is collected and why, a legal basis for processing (typically legitimate interest for basic functionality, consent for detailed analytics), data retention limits (not storing click data indefinitely), data deletion capabilities (right to erasure — users can request deletion of their data), and data processing agreements with third-party analytics providers. For EU users, you may need to avoid logging IP addresses or anonymize them (truncating the last octet). The 'right to be forgotten' means your analytics pipeline must support deleting specific user data retroactively. These privacy requirements significantly impact the analytics architecture and should be discussed in system design interviews."
  },
  {
    question: "How would you implement URL shortener high availability across multiple data centers?",
    options: ["Run everything in one data center with backups", "Deploy in multiple regions with active-active configuration, cross-region database replication, and global DNS routing", "Use a single database shared across regions", "Only replicate the cache layer across regions"],
    correctIndex: 1,
    explanation: "Multi-region active-active deployment ensures the URL shortener remains available even if an entire data center or region fails. Each region runs a complete stack: load balancers, application servers, cache layer, and database nodes. Cross-region database replication (using Cassandra's multi-DC replication or DynamoDB Global Tables) keeps URL mappings synchronized. Global DNS routing (AWS Route 53 latency-based routing or Cloudflare's anycast) directs users to the nearest healthy region. Write conflicts are handled with last-writer-wins or vector clocks depending on the database. This architecture provides both high availability (surviving regional outages) and low latency (serving users from nearby regions). A single data center, no matter how well-provisioned, represents a single point of failure — natural disasters, network partitions, or power outages can take down an entire region."
  },
  {
    question: "What is the purpose of the HTTP 307 status code in URL shortening?",
    options: ["It means the URL was not found", "It's a temporary redirect that preserves the HTTP method (POST stays POST), unlike 302 which may change POST to GET", "It's a permanent redirect like 301", "It means the server is unavailable"],
    correctIndex: 1,
    explanation: "HTTP 307 (Temporary Redirect) is similar to 302 but with a crucial difference: 307 guarantees that the HTTP method and body are preserved across the redirect. With 302, browsers historically changed POST requests to GET requests when following the redirect (despite the spec saying they shouldn't). For a URL shortener, this distinction matters if short URLs are used for API endpoints or form submissions where the POST method must be preserved. For simple click redirects (GET requests), 302 and 307 behave identically. The 308 status code similarly preserves the method but for permanent redirects (equivalent to 301). Understanding these subtle HTTP semantics demonstrates deep web protocol knowledge in system design interviews."
  },
  {
    question: "How would you implement rate limiting for the URL shortener's redirect endpoint?",
    options: ["Apply the same strict limits as the creation endpoint", "Use lenient limits (e.g., 1000 requests/minute/IP) to protect against DDoS while allowing normal viral traffic patterns", "No rate limiting needed for redirects", "Block IPs after 10 redirects"],
    correctIndex: 1,
    explanation: "The redirect endpoint needs rate limiting but with much higher thresholds than the creation endpoint because legitimate use cases include: a popular link being clicked thousands of times per minute from the same corporate proxy IP, automated monitoring checking link health, and social media platforms generating link previews. Overly aggressive limits would block legitimate traffic and degrade the service's core value proposition. A reasonable approach uses tiered rate limiting: lenient per-IP limits (e.g., 1000/min) with stricter per-URL limits if a single URL receives suspicious traffic patterns (like exactly 100 requests/second from different IPs — a botnet pattern). DDoS protection should be handled at the infrastructure layer (CDN/WAF) rather than the application layer for the redirect path, as the goal is to keep redirect latency minimal."
  },
  {
    question: "Why might you choose Cassandra over MongoDB for a URL shortener's primary database?",
    options: ["Cassandra supports SQL queries", "Cassandra provides linear horizontal scalability, tunable consistency, and no single point of failure, ideal for the simple partition-key lookup pattern", "MongoDB is not a NoSQL database", "Cassandra is always faster for all workloads"],
    correctIndex: 1,
    explanation: "Cassandra excels at the URL shortener's access pattern for several reasons: its partition-key-based architecture maps perfectly to short-key lookups (O(1) reads), it scales linearly by adding nodes (no master node bottleneck), it supports multi-datacenter replication natively, and it offers tunable consistency (use ONE for fast reads, QUORUM for consistent writes). MongoDB would work but uses a primary-secondary architecture that creates a single point of failure for writes and requires more complex sharding configuration. Cassandra's ring-based architecture distributes data evenly and handles node failures gracefully — any node can serve any request. However, Cassandra's write-optimized LSM-tree storage is overkill for a read-heavy URL shortener, and it lacks the rich query capabilities of MongoDB, which aren't needed for this use case anyway."
  },
  {
    question: "What is the difference between URL shortener keys generated with counter-based vs. random approaches in a distributed system?",
    options: ["Counter-based is impossible in distributed systems", "Counter-based requires coordination between servers (like Snowflake IDs) to avoid duplicates, while random approaches need collision detection but require no coordination", "Random approaches never produce duplicates", "Counter-based is always preferred"],
    correctIndex: 1,
    explanation: "In a distributed system, a simple auto-increment counter doesn't work because multiple servers would generate the same numbers. Coordination mechanisms like Twitter's Snowflake solve this by combining: a timestamp, a worker ID (unique per server), and a per-server sequence number — guaranteeing globally unique IDs without inter-server communication. The trade-off is that Snowflake IDs are 64-bit (12+ characters in base62) — longer than desired for a URL shortener. Random approaches (random 7-character base62 strings) produce shorter keys but require collision detection (check if key exists before using it). KGS bridges both worlds by pre-generating random unique keys centrally. The key insight for interviews: understand the coordination vs. collision trade-off and why KGS is the elegant solution that avoids both problems."
  },
  {
    question: "How does a URL shortener handle the 'hot key' problem in a sharded database?",
    options: ["Ignore it — all keys are accessed equally", "Replicate hot keys across multiple shards and use caching to absorb the majority of reads for popular URLs", "Move hot keys to a separate database", "Delete hot keys after they become too popular"],
    correctIndex: 1,
    explanation: "In a sharded database, a viral URL can create a 'hot key' — a single shard receiving disproportionate traffic while others sit idle. The primary defense is caching: a Redis cluster absorbs the vast majority of reads for hot URLs, ensuring most requests never reach the database. For extreme cases (a URL going viral on the homepage of Reddit), you can: replicate the hot key's data across multiple cache nodes (read from any), use client-side caching on application servers, or prepend the cache key with a random prefix (e.g., 'shard-1-abc123', 'shard-2-abc123') to distribute the key across multiple cache nodes. This is the same problem Twitter faces with celebrity tweets and Instagram faces with popular accounts — caching with key replication is the universal solution."
  },
  {
    question: "What encryption should a URL shortener use for storing URLs at rest?",
    options: ["No encryption needed — URLs are public data", "Encrypt sensitive metadata (user IDs, analytics data) but URL mappings themselves may not need encryption since the URLs are publicly accessible", "Encrypt everything with AES-256", "Use homomorphic encryption"],
    correctIndex: 1,
    explanation: "This is a nuanced question. The URL mappings themselves (short key → long URL) are essentially public data — anyone with the short URL can discover the long URL by clicking it. However, associated metadata deserves encryption: user account information, detailed analytics (who clicked what, when, from where), API keys, and any personally identifiable information. For compliance-sensitive deployments (healthcare, finance), encrypting everything at rest with AES-256 via database-level encryption (like DynamoDB's or RDS's encryption at rest) provides defense-in-depth with minimal performance impact. The key point for interviews: don't apply a one-size-fits-all approach. Threat model first, then decide what needs protection. Encrypting everything adds operational complexity (key management, rotation) that should be justified by actual security requirements."
  },
  {
    question: "How would you implement URL shortener search functionality (e.g., searching through created URLs)?",
    options: ["Full table scan on every search", "Use Elasticsearch or similar search engine indexed on long URL, custom alias, and creation metadata", "Store URLs in alphabetical order", "Use LIKE queries on the primary database"],
    correctIndex: 1,
    explanation: "Full-text search across millions of URL mappings requires a dedicated search engine like Elasticsearch or Apache Solr. When a URL is created, an event is published to index the mapping in Elasticsearch, including: the long URL, custom alias (if any), creation timestamp, user ID, and any tags/metadata. This enables searching by destination domain, partial URL matches, tags, and creation date ranges. LIKE queries on the primary database (NoSQL or SQL) would be catastrophically slow at scale and could impact production traffic. Elasticsearch provides full-text search, fuzzy matching, and aggregations with sub-second response times even over billions of documents. This is a classic polyglot persistence pattern — use the right storage engine for each access pattern: key-value store for redirects, Elasticsearch for search, time-series for analytics."
  },
  {
    question: "What is base62 encoding?",
    options: ["An encoding that uses 62 characters: a-z, A-Z, 0-9", "An encoding that uses 62 bits", "A compression algorithm", "A hashing algorithm"],
    correctIndex: 0,
    explanation: "Base62 encoding maps numbers to a 62-character alphabet consisting of lowercase letters (a-z, 26 chars), uppercase letters (A-Z, 26 chars), and digits (0-9, 10 chars), totaling 62 characters. Unlike base64, base62 excludes '+' and '/' which are not URL-safe, making it ideal for URL shortener keys. A numeric ID like 125 would be converted by repeatedly dividing by 62 and mapping remainders to characters. This encoding is reversible — given a base62 string, you can decode it back to the original number, which is useful when the short key is derived from a database auto-increment ID."
  },
  {
    question: "What is the main bottleneck in a URL shortener system?",
    options: ["CPU processing", "Database reads during redirect operations at peak traffic", "Network bandwidth", "Disk storage"],
    correctIndex: 1,
    explanation: "The primary bottleneck is the database read path during redirects, especially at peak traffic. Each redirect requires looking up the short key to find the long URL, and at millions of redirects per second, even fast databases struggle. This is why caching is the single most important optimization — a well-tuned Redis cache with high hit ratios can reduce database load by 95%+. CPU is minimal (just a lookup and redirect), network bandwidth is small (redirect responses are tiny), and disk storage grows slowly. The read-heavy workload pattern (100:1 read-to-write ratio) means optimizing the read path has 100x more impact than optimizing writes."
  },
  {
    question: "What is the purpose of a 410 Gone HTTP response in a URL shortener?",
    options: ["The server is temporarily unavailable", "It indicates the short URL existed but has been permanently removed or expired", "The URL was redirected", "Authentication is required"],
    correctIndex: 1,
    explanation: "HTTP 410 (Gone) explicitly tells clients and search engines that the resource existed previously but has been intentionally and permanently removed. This is more informative than a 404 (Not Found), which doesn't distinguish between 'never existed' and 'existed but was deleted.' For expired or manually deleted short URLs, 410 is semantically correct and helps search engines remove the URL from their index faster. This matters for SEO — if someone published the short URL and it's been shared widely, search engines need to know to stop indexing it. Returning 404 might cause search engines to keep retrying, while 410 is a clear signal to give up."
  },
  {
    question: "How many database reads does a single redirect operation require in an optimized URL shortener?",
    options: ["At least 3 reads (key lookup, user lookup, analytics lookup)", "One read — a single key-value lookup by the short key, or zero if cached", "At least 5 reads including authentication", "It varies based on URL length"],
    correctIndex: 1,
    explanation: "In an optimized URL shortener, the redirect path involves a single key-value lookup: given the short key, retrieve the long URL. If the result is cached in Redis, it's zero database reads. The operation is O(1) in both the cache and a key-value database. There's no need to look up user information (that's only for the management API), no authentication required (short URLs are public), and analytics are written asynchronously rather than read. This simplicity is by design — the redirect path must be as fast as possible, and every additional lookup adds latency. This is why the data model should be denormalized for the redirect use case, with all necessary redirect information in a single record."
  },
  {
    question: "What is the purpose of the Location header in a URL shortener redirect response?",
    options: ["It specifies the server's geographic location", "It contains the destination URL that the browser should navigate to", "It contains the short URL", "It specifies the cache location"],
    correctIndex: 1,
    explanation: "The HTTP Location header is a required component of 3xx redirect responses. When a URL shortener returns a 301 or 302 response, the Location header contains the full destination URL (the original long URL). The browser reads this header and automatically navigates to the specified URL. Without the Location header, the browser wouldn't know where to redirect. The response body is typically empty or contains a small HTML page with a meta refresh tag as a fallback for older clients that don't handle redirects properly. The Location header must contain a valid, absolute URL — relative URLs are technically allowed by HTTP/1.1 but can cause issues with some clients."
  },
  {
    question: "What is the impact of using a SQL database with indexes for a URL shortener at scale?",
    options: ["SQL databases are always better than NoSQL", "SQL databases work but B-tree indexes add write overhead and JOIN capabilities go unused for the simple key-value pattern", "SQL databases cannot handle URL shortener workloads", "SQL databases don't support indexing on string columns"],
    correctIndex: 1,
    explanation: "SQL databases like PostgreSQL or MySQL can handle URL shortener workloads at moderate scale (millions of URLs). However, B-tree indexes on the short_key column add write amplification (each insert updates the index), and the relational features (JOINs, foreign keys, transactions) add overhead without providing value for the simple key-value access pattern. At billions of URLs with thousands of reads per second, SQL database sharding becomes complex (no native support in most SQL databases) compared to NoSQL databases that shard automatically. That said, if your scale doesn't require billions of entries, PostgreSQL with proper indexing and connection pooling (PgBouncer) is a perfectly valid choice — over-engineering with NoSQL for a small-scale service is equally problematic."
  },
  {
    question: "How does DNS resolution affect URL shortener latency?",
    options: ["DNS has no impact on URL shortener latency", "Each new connection requires DNS resolution of the short URL domain, adding 10-100ms that can be mitigated with low TTLs and DNS prefetching", "DNS only affects the creation of short URLs", "DNS resolution is handled by the database"],
    correctIndex: 1,
    explanation: "Before a browser can connect to your URL shortener server, it must resolve the short URL domain name to an IP address via DNS. This DNS lookup adds 10-100ms depending on whether the result is cached in the user's DNS resolver. For a URL shortener where speed is critical, DNS optimization matters: use low but reasonable TTL values (300 seconds), ensure DNS records are available from multiple authoritative nameservers, and use a DNS provider with global anycast (like Cloudflare or Route 53). Websites can also add DNS prefetch hints (<link rel='dns-prefetch'>) for their short URL domains. After the first resolution, DNS caching makes subsequent lookups near-instant — but the first click on a short URL from a new device always pays the DNS tax."
  },
  {
    question: "What is the maximum URL length that a URL shortener should accept?",
    options: ["No limit", "A practical limit of 2,000-8,000 characters, matching browser and server constraints", "Exactly 255 characters", "Exactly 100 characters"],
    correctIndex: 1,
    explanation: "While HTTP doesn't define a maximum URL length, practical limits exist: Internet Explorer historically supported only 2,083 characters, most modern browsers support 8,000-65,000 characters, and many web servers default to 8KB maximum header size (which includes the URL). A URL shortener should enforce a reasonable limit (e.g., 2,048 or 8,192 characters) that works across all major browsers and servers. Accepting unlimited-length URLs could be exploited for storage abuse or buffer overflow attacks. The limit should be documented in the API specification and enforced with a clear 414 (URI Too Long) error response. In practice, URLs longer than 2,000 characters are rare and often indicate encoding issues or tracking parameter bloat."
  },
  {
    question: "What is the role of connection pooling in a URL shortener's database layer?",
    options: ["It pools multiple databases together", "It reuses database connections across requests to avoid the overhead of creating new connections for each redirect", "It compresses database queries", "It caches query results"],
    correctIndex: 1,
    explanation: "Creating a new database connection for each request involves TCP handshake, authentication, and SSL negotiation — adding 5-50ms of overhead per request. Connection pooling (using tools like PgBouncer for PostgreSQL, or built-in pools in application frameworks) maintains a pool of pre-established connections that are reused across requests. For a URL shortener handling thousands of redirects per second, this eliminates connection creation overhead entirely. The pool size should be tuned based on the database's max_connections setting and the number of application server instances. A common mistake is setting pool size too high, which can overwhelm the database with too many concurrent connections. A good starting point is: pool_size = (database_max_connections - reserved) / number_of_app_servers."
  },
  {
    question: "How should a URL shortener handle concurrent requests to create the same custom alias?",
    options: ["Allow both requests to succeed", "Use database-level unique constraints and optimistic locking — the first request succeeds, subsequent ones get a conflict error", "Queue all requests and process them sequentially", "Ignore the conflict and overwrite"],
    correctIndex: 1,
    explanation: "Database-level unique constraints on the custom alias column provide atomic conflict detection: when two concurrent requests try to insert the same alias, the database guarantees exactly one succeeds while the other receives a unique constraint violation. The application catches this error and returns HTTP 409 (Conflict) to the losing request. This approach is more efficient than pessimistic locking (which would serialize all creation requests) or application-level checking (which has a race condition between check and insert). Optimistic concurrency is the standard pattern for handling concurrent writes in web applications. For distributed databases without unique constraints (like Cassandra), you can use lightweight transactions (IF NOT EXISTS) to achieve the same atomicity, though with higher latency."
  },
  {
    question: "What is the purpose of a WAF (Web Application Firewall) for a URL shortener?",
    options: ["To shorten URLs faster", "To protect against common web attacks like SQL injection, XSS, DDoS, and bot abuse targeting the shortener's API", "To compress HTTP responses", "To cache URL mappings"],
    correctIndex: 1,
    explanation: "A WAF sits in front of the URL shortener's API and inspects incoming requests for malicious patterns. It protects against: SQL injection in URL parameters (even with NoSQL, injection attacks exist), cross-site scripting (XSS) in custom alias fields, DDoS attacks by rate-limiting at the edge, bot abuse (automated bulk URL creation for spam), and request smuggling attacks. Cloud WAF services (like Cloudflare WAF or AWS WAF) can also enforce geographic restrictions, block known malicious IPs, and implement custom rules (e.g., blocking requests containing known phishing domains). For a URL shortener that's publicly accessible on the internet, a WAF is a critical security layer that handles threats before they reach the application code."
  },
  {
    question: "How do you test a URL shortener system for correctness and performance?",
    options: ["Only manual testing is needed", "Unit tests for encoding logic, integration tests for redirect flows, load tests simulating realistic traffic patterns, and chaos engineering for resilience", "Only load testing matters", "Testing isn't important for URL shorteners"],
    correctIndex: 1,
    explanation: "A comprehensive testing strategy includes multiple layers: unit tests verify base62 encoding/decoding, URL validation, and key generation logic. Integration tests verify the full redirect flow (create → redirect → analytics), custom alias creation, expiration behavior, and error handling. Load tests using tools like k6, Locust, or Gatling simulate realistic traffic patterns — high read-to-write ratios, burst traffic during viral events, and geographic distribution. Chaos engineering (killing cache nodes, simulating database failures, introducing network latency) verifies graceful degradation. Performance benchmarks establish baselines for redirect latency (target: <50ms p99), cache hit ratios (target: >95%), and throughput (target: sustain 10x average load). This multi-layered approach catches bugs at every level and gives confidence in the system's behavior under stress."
  },
  {
    question: "What is the 'stampede' problem when a cache entry for a popular URL expires?",
    options: ["Users rush to create the same short URL simultaneously", "Many concurrent requests miss the expired cache entry and simultaneously query the database, potentially overwhelming it", "The database runs out of storage", "Short URLs expire too quickly"],
    correctIndex: 1,
    explanation: "Cache stampede occurs when a cached entry expires and many concurrent requests for the same key arrive before the cache is repopulated. All requests find a cache miss and query the database simultaneously. For a viral short URL with 10,000 requests/second, a cache expiry could instantly send 10,000 queries to the database for the same key. Mitigations include: probabilistic early expiration (each request has a small random chance of refreshing the cache before TTL expires), distributed locking (only one request fetches from DB while others wait for the cache to be repopulated), and staggered TTLs (adding random jitter to TTL values so entries don't expire simultaneously). This is also known as the 'thundering herd' problem and is a critical concern for any read-heavy cached system."
  },
  {
    question: "How does a URL shortener handle Unicode/emoji in custom aliases?",
    options: ["Reject all non-ASCII characters", "Allow Unicode with proper percent-encoding, or use Punycode-like encoding to support emoji/international aliases in a URL-safe way", "Convert to ASCII by removing special characters", "Store as-is without encoding"],
    correctIndex: 1,
    explanation: "Supporting Unicode custom aliases (like 'bit.ly/🎉party' or 'bit.ly/日本旅行') requires careful handling. The alias must be percent-encoded for the actual URL (emoji → %F0%9F%8E%89...) but displayed in its readable form in the UI. You need to normalize Unicode (NFC normalization) to prevent visually-identical-but-different-byte-sequence aliases from coexisting. Security concerns include homograph attacks (using Cyrillic 'а' that looks like Latin 'a'). Some shorteners restrict aliases to ASCII to avoid these complexities, while others embrace Unicode as a differentiating feature. If supporting Unicode, validate against confusable characters, normalize consistently, and store both the display form and the encoded form."
  },
  {
    question: "What is the benefit of using HTTP/2 for a URL shortener's server?",
    options: ["HTTP/2 creates shorter URLs", "HTTP/2's multiplexing, header compression, and server push can reduce connection overhead for clients making multiple requests", "HTTP/2 is required for redirects", "HTTP/2 encrypts URLs"],
    correctIndex: 1,
    explanation: "HTTP/2 provides several performance benefits for URL shorteners: header compression (HPACK) reduces the overhead of repeated headers across requests, which matters when a page contains multiple short URLs. Multiplexing allows multiple redirect requests over a single TCP connection, avoiding head-of-line blocking. For the shortener's API (creating URLs, checking analytics), HTTP/2's binary framing and multiplexing reduce latency compared to HTTP/1.1's sequential request processing. While a single redirect doesn't benefit much from multiplexing, analytics API endpoints returning multiple data streams do. Most modern CDNs and load balancers support HTTP/2 automatically. The practical impact is modest for simple redirect operations but meaningful for API-heavy interactions."
  },
  {
    question: "What is the trade-off between storing analytics data in the same database as URL mappings vs. a separate analytics store?",
    options: ["Always store everything together for simplicity", "Separating analytics from URL mappings prevents write-heavy analytics from degrading read-heavy redirect performance", "Analytics data should never be stored", "The same database is always better for consistency"],
    correctIndex: 1,
    explanation: "URL mappings are read-heavy (millions of lookups/second) while analytics data is write-heavy (every redirect generates an analytics event). Storing both in the same database creates resource contention — analytics writes compete with redirect reads for I/O, CPU, and memory. Separating them allows each database to be optimized for its workload: the URL mapping store uses read-optimized settings (large buffer pool, read replicas), while the analytics store uses write-optimized settings (write-ahead log, batch inserts, columnar storage for aggregation queries). Time-series databases (InfluxDB, TimescaleDB) or columnar analytics databases (ClickHouse, BigQuery) are ideal for analytics data. This polyglot persistence approach is standard in production systems at scale."
  },
  {
    question: "How would you implement a URL shortener preview feature (like bit.ly's '+' suffix)?",
    options: ["Create a separate short URL for the preview", "Append a special character (like '+') to the short URL path that serves an HTML page showing destination URL and metadata instead of redirecting", "Add a query parameter for preview mode", "Preview is not possible with short URLs"],
    correctIndex: 1,
    explanation: "The preview feature works by reserving a URL pattern (e.g., 'sho.rt/abc123+' or 'sho.rt/abc123/info') that returns an HTML page showing: the destination URL, page title and description (from Open Graph metadata), click statistics, creation date, and a 'proceed to destination' button. The server routes these requests differently from redirect requests — matching the '+' suffix pattern returns an HTML page rather than a 302 redirect. This feature is important for security-conscious users who want to verify the destination before being redirected. Query parameters (like '?preview=true') would also work technically but could conflict with URLs that contain similar parameters. Bit.ly popularized the '+' convention, and it has become a de facto standard in the URL shortener space."
  },
  {
    question: "What is the role of a reverse proxy (like Nginx) in front of a URL shortener application?",
    options: ["To generate short URLs", "To handle SSL termination, static content serving, request buffering, and act as a gateway before requests reach the application servers", "To store URL mappings", "To generate analytics reports"],
    correctIndex: 1,
    explanation: "A reverse proxy like Nginx sits between clients and application servers, providing several critical functions. SSL/TLS termination handles HTTPS decryption at the proxy level so application servers process plain HTTP, reducing their CPU load. Request buffering absorbs slow client connections so application servers aren't tied up waiting for slow uploads. Connection pooling maintains a smaller number of persistent connections to backend servers. Static content serving returns error pages and status pages without hitting the application. Rate limiting and access control provide a first line of defense against abuse. For URL shorteners, Nginx can also handle the redirect logic directly for cached URLs using its built-in proxy_cache module, making redirects extremely fast without involving the application server at all."
  },
  {
    question: "How would you design a URL shortener to be serverless?",
    options: ["Serverless architectures can't support URL shorteners", "Use API Gateway for routing, Lambda/Cloud Functions for logic, DynamoDB for storage, and CloudFront as CDN — but cold starts may increase redirect latency", "Replace all servers with a single large instance", "Use only edge computing"],
    correctIndex: 1,
    explanation: "A serverless URL shortener architecture uses: API Gateway (AWS API Gateway or Cloudflare Workers) for request routing, Lambda or Cloud Functions for creation logic and analytics processing, DynamoDB or FaunaDB for URL storage with built-in TTL for expiration, and CloudFront or another CDN for caching redirect responses. Benefits include zero infrastructure management, automatic scaling, and pay-per-request pricing. The main concern is cold start latency — a Lambda function that hasn't been invoked recently may take 100-500ms to start, which is unacceptable for redirect latency. Mitigations include provisioned concurrency (keeping functions warm) and edge-based execution (Cloudflare Workers run on the edge with near-zero cold starts). For low-to-moderate traffic URL shorteners, serverless is cost-effective; at high scale, dedicated infrastructure may be cheaper."
  },
  {
    question: "What is the difference between soft delete and hard delete for expired URLs?",
    options: ["There is no difference", "Soft delete marks the URL as inactive (preserving data for analytics/legal), while hard delete permanently removes the record from the database", "Soft delete is slower", "Hard delete preserves data"],
    correctIndex: 1,
    explanation: "Soft delete adds a 'deleted_at' timestamp or 'is_active' flag to the record without removing it from the database. The redirect logic checks this flag and returns 410 Gone for soft-deleted URLs. This preserves historical data for analytics, compliance, and potential restoration. Hard delete permanently removes the record, freeing storage space and allowing the short key to be recycled. The choice depends on requirements: regulated industries (finance, healthcare) may require retaining records for audit trails, while privacy regulations (GDPR right to erasure) may require actual deletion. A common pattern is soft delete with a grace period (30-90 days) followed by hard delete and key recycling. This allows users to recover accidentally deleted URLs while eventually reclaiming resources."
  },
  {
    question: "How would you handle a URL shortener migration from one database to another?",
    options: ["Shut down and migrate everything at once", "Use the strangler fig pattern: dual-write to both databases, gradually shift reads to the new database, verify consistency, then decommission the old one", "Simply point the application to the new database", "Migrations are unnecessary"],
    correctIndex: 1,
    explanation: "The strangler fig pattern provides zero-downtime database migration. Phase 1: Set up the new database and begin dual-writing (every URL creation writes to both old and new databases). Phase 2: Backfill historical data from the old database to the new one using a batch migration job. Phase 3: Verify consistency by comparing read results from both databases (shadow reads). Phase 4: Gradually shift read traffic to the new database using feature flags (e.g., 1% → 10% → 50% → 100%). Phase 5: Stop writing to the old database and decommission it. This approach ensures zero data loss and allows rollback at any phase. The dual-write phase requires careful handling of failures — if one write succeeds but the other fails, you need compensating logic or an eventual consistency reconciliation job."
  },
  {
    question: "What is the significance of the Referer header in URL shortener analytics?",
    options: ["It specifies the URL shortener's domain", "It indicates where the user was before clicking the short URL, revealing which websites or platforms are driving traffic", "It contains the user's name", "It specifies the redirect destination"],
    correctIndex: 1,
    explanation: "The HTTP Referer (historically misspelled) header contains the URL of the page that linked to the current request. For URL shortener analytics, this reveals traffic sources — whether clicks are coming from Twitter, Facebook, email clients, direct messaging apps, or other websites. This information is invaluable for marketers tracking campaign performance across channels. However, Referer is not always available: HTTPS-to-HTTP transitions strip it (though HTTPS-to-HTTPS preserves it), some privacy-focused browsers suppress it, and Referrer-Policy headers can restrict it. Despite these limitations, Referer data typically covers 60-80% of traffic and remains one of the most valuable analytics dimensions. Modern URL shorteners supplement Referer with UTM parameters for more reliable source tracking."
  },
  {
    question: "How would you implement a QR code generation feature for a URL shortener?",
    options: ["Store pre-generated QR codes for all URLs", "Generate QR codes on-demand by encoding the short URL, cache the result, and optionally allow customization (colors, logo embedding)", "QR codes cannot encode URLs", "Use a third-party QR code service for every request"],
    correctIndex: 1,
    explanation: "QR code generation is a natural complement to URL shortening — the short URL is encoded into the QR code, keeping the QR pattern simple and scannable. Implementation involves: generating QR codes on-demand using a library (like qrcode in Node.js or Python), encoding the short URL (not the long URL, for a simpler QR pattern), caching generated QR code images (since the same short URL always produces the same QR code), and optionally allowing customization (brand colors, embedded logos, rounded dots). The QR code should be served with appropriate cache headers for browser caching. For high-traffic generation, a dedicated microservice with image caching (S3 + CDN) keeps the main redirect service unaffected. This feature is increasingly important as QR codes have seen massive adoption since COVID-19."
  },
  {
    question: "What is the purpose of using a write-ahead log (WAL) in a URL shortener's database?",
    options: ["To log URL redirect analytics", "To ensure durability by writing changes to a sequential log before applying them to the database, preventing data loss on crashes", "To compress URL data", "To cache frequently accessed URLs"],
    correctIndex: 1,
    explanation: "A write-ahead log (WAL) ensures that no committed data is lost even if the database server crashes mid-operation. Before any change is applied to the actual data files, it's first written to the WAL — a sequential, append-only log on disk. If the server crashes, it replays the WAL on startup to recover committed transactions. For a URL shortener, this means a successfully created short URL won't be lost due to a server crash between the creation confirmation and the data being flushed to disk. WAL also improves write performance because sequential writes to the log are much faster than random writes to data files. Both PostgreSQL and MySQL use WAL (MySQL calls it the 'redo log'), and even NoSQL databases like Cassandra use a similar commit log mechanism."
  },
  {
    question: "How would you implement geographic routing for a multi-region URL shortener?",
    options: ["Route all traffic to a single region", "Use GeoDNS or latency-based DNS routing to direct users to the nearest region, with health checks for failover", "Use client-side routing", "Route based on the URL content"],
    correctIndex: 1,
    explanation: "Geographic routing directs users to the closest healthy deployment region, minimizing latency. AWS Route 53's latency-based routing measures actual latency from DNS resolvers to each region, while GeoDNS maps source IPs to geographic regions. Implementation requires: deploying the full shortener stack in multiple regions, cross-region data replication (using DynamoDB Global Tables or Cassandra multi-DC), health checks that automatically remove unhealthy regions from DNS, and a global CDN layer (CloudFront, Cloudflare) for edge caching. The DNS TTL should be low enough (e.g., 60 seconds) to enable fast failover but high enough to not add excessive DNS resolution overhead. This ensures a user in Tokyo gets served from an Asia-Pacific region (~20ms latency) rather than US-East (~200ms latency)."
  },
  {
    question: "What is the concept of 'backpressure' in a URL shortener's analytics pipeline?",
    options: ["Pushing back the user's browser", "A mechanism where overwhelmed downstream analytics consumers signal upstream producers to slow down, preventing system overload", "Compressing analytics data", "Reversing URL redirects"],
    correctIndex: 1,
    explanation: "Backpressure is a flow control mechanism in stream processing systems. In a URL shortener's analytics pipeline, click events flow from the redirect service → message queue → stream processor → analytics database. If the stream processor or analytics database becomes overwhelmed, backpressure signals the message queue to slow down event delivery, which may in turn signal the redirect service to buffer events locally. Without backpressure, the analytics pipeline could crash under load, losing click data. Kafka handles this naturally through consumer lag (consumers read at their own pace, and Kafka retains events). Redis Streams and RabbitMQ provide similar mechanisms. The key principle: it's better to process analytics events slowly than to lose them, since the redirect path is independent and unaffected."
  },
  {
    question: "How would you implement URL shortener link rotation (cycling through multiple destination URLs)?",
    options: ["Create separate short URLs for each destination", "Store an ordered list of destination URLs with rotation rules (round-robin, weighted, time-based) in the URL mapping record", "Randomly pick a destination on each redirect", "URL rotation is not possible"],
    correctIndex: 1,
    explanation: "Link rotation allows a single short URL to redirect to different destinations based on configurable rules. The URL mapping record stores an array of destinations with rotation strategy metadata. Round-robin rotation assigns each click to the next destination in sequence (using an atomic counter). Weighted rotation assigns different traffic percentages to each destination (similar to A/B testing). Time-based rotation changes the destination at scheduled times (e.g., redirect to morning page before noon, afternoon page after). Implementation requires atomic read-modify-write operations for round-robin counters (Redis INCR works well here). This feature is valuable for marketers running multi-variant campaigns and for load distribution across multiple landing page servers."
  },
  {
    question: "What are idempotency keys and how do they apply to URL shortener creation?",
    options: ["Keys that generate identical short URLs", "Client-generated unique identifiers sent with creation requests to ensure the same request processed multiple times produces only one short URL", "Keys that expire after one use", "Keys used for URL encryption"],
    correctIndex: 1,
    explanation: "Idempotency keys solve the problem of duplicate creation in unreliable networks. When a client sends a URL creation request, it includes a unique idempotency key (typically a UUID) in the header. The server stores this key with the creation result. If the client retries the same request (due to a timeout or network error), the server recognizes the duplicate idempotency key and returns the original result without creating a new short URL. Without idempotency keys, network retries could create multiple short URLs for the same long URL, wasting key space and confusing analytics. This pattern is used by Stripe, AWS, and other API-first companies. Implementation typically uses a Redis cache with a TTL (e.g., 24 hours) to store idempotency_key → response mappings."
  },
  {
    question: "What is the purpose of health checks in a URL shortener's load balancer configuration?",
    options: ["To check the health of URLs", "To verify application servers are functioning correctly so the load balancer routes traffic only to healthy instances", "To check database health", "To monitor URL creation rates"],
    correctIndex: 1,
    explanation: "Health checks are periodic probes sent by the load balancer to each application server to verify it's capable of handling requests. For a URL shortener, a health check endpoint (e.g., GET /health) should verify: the application process is running, the database connection is active, and the cache is reachable. If a server fails health checks, the load balancer stops routing traffic to it, preventing users from hitting a broken server. Health checks should be fast (<100ms) and not perform heavy operations. A deep health check (testing all dependencies) is useful but risky — if the database is temporarily slow, all servers might fail deep health checks simultaneously, causing total service outage. A common pattern is shallow checks for load balancer routing and deep checks for monitoring/alerting."
  },
  {
    question: "How does consistent hashing with virtual nodes improve data distribution in a sharded URL shortener?",
    options: ["Virtual nodes are faster than real nodes", "Virtual nodes create multiple points per server on the hash ring, evening out distribution and reducing hotspots when servers are added or removed", "Virtual nodes provide encryption", "Virtual nodes reduce storage requirements"],
    correctIndex: 1,
    explanation: "Without virtual nodes, each physical server gets one point on the hash ring, which can lead to uneven data distribution — especially with a small number of servers. Virtual nodes assign multiple points (e.g., 150-256) per physical server on the ring, creating a much more uniform distribution. When a server is removed, its virtual nodes' key ranges are distributed across many other servers rather than being absorbed by a single neighbor. This prevents sudden load spikes on individual servers. For a URL shortener with billions of entries, this uniform distribution is critical — a 10% imbalance across 10 shards means one shard handles 10% more traffic, which could exceed its capacity during peak hours. Amazon's Dynamo paper popularized this technique, and it's used in Cassandra, Riak, and most modern distributed databases."
  },
  {
    question: "What is the difference between proactive and reactive cache invalidation in a URL shortener?",
    options: ["There is no difference", "Proactive invalidation removes cache entries before they become stale (e.g., when a URL is updated/deleted), while reactive uses TTL expiration", "Proactive is always slower", "Reactive requires more code"],
    correctIndex: 1,
    explanation: "Proactive (or explicit) invalidation immediately removes or updates cache entries when the underlying data changes — for example, when a user updates a short URL's destination or deletes it, the cache entry is immediately invalidated. Reactive invalidation relies on TTL expiration, meaning stale data may be served until the TTL expires. For a URL shortener, both approaches are needed: TTL-based expiration for normal operation (prevents indefinite caching and handles gradual consistency), and proactive invalidation for user-initiated changes (a user updating their URL's destination expects the change to take effect immediately, not after a 5-minute TTL). The implementation uses cache-aside pattern: on URL update, delete the cache entry and let the next request repopulate it from the database. This combination is a standard practice in any caching architecture."
  },
  {
    question: "What is the security risk of sequential/predictable short URL keys?",
    options: ["Sequential keys are slower to look up", "Attackers can enumerate all URLs by iterating through the key space, accessing potentially sensitive destination URLs", "Sequential keys use more storage", "Sequential keys cause more cache misses"],
    correctIndex: 1,
    explanation: "If a URL shortener uses sequential keys (1, 2, 3... converted to base62), an attacker can systematically try every possible key to discover all shortened URLs. This is a privacy and security risk because people often shorten sensitive URLs — private documents, internal company tools, personal photos, or confidential business links — assuming the short URL is effectively 'secret.' Enumeration attacks on sequential keys are trivial to automate and can expose thousands of sensitive URLs per minute. Random keys make enumeration impractical — with a 7-character base62 key space of 3.5 trillion possibilities, randomly guessing valid keys has a negligible success rate. This is one of the strongest arguments against sequential key generation and in favor of random/KGS-based approaches in system design interviews."
  },
  {
    question: "How should a URL shortener handle a destination URL that becomes unreachable?",
    options: ["Immediately delete the short URL", "Continue redirecting users (the destination might be temporarily down), but flag the URL for review and optionally show a warning after prolonged unavailability", "Return a 404 error", "Replace the destination with a cached version"],
    correctIndex: 1,
    explanation: "A URL shortener's job is to redirect, not to guarantee destination availability. The destination might be temporarily down for maintenance, experiencing a brief outage, or behind a firewall that blocks the shortener's monitoring probe. Immediately deleting or blocking the redirect would break legitimate use cases. Instead, implement a monitoring system that periodically checks destination health and flags URLs that have been unreachable for extended periods (e.g., 7+ days). For flagged URLs, you could: show an interstitial warning ('This link's destination appears to be unavailable'), send a notification to the URL's creator, or mark it in analytics. The redirect itself should always attempt to work — the user might have access even if the monitoring system doesn't. This nuanced approach balances user experience with proactive monitoring."
  },
  {
    question: "What is the maximum QPS (Queries Per Second) a single Redis instance can typically handle for URL shortener lookups?",
    options: ["About 1,000 QPS", "About 10,000 QPS", "About 100,000+ QPS", "About 1,000,000+ QPS"],
    correctIndex: 2,
    explanation: "A single Redis instance can typically handle 100,000 to 250,000+ simple GET operations per second, depending on hardware, network configuration, and value sizes. For URL shortener lookups (GET by short key returning a URL string of ~100-500 bytes), Redis comfortably handles 100K+ QPS per instance. This means even a small Redis cluster (3-5 nodes) can serve the redirect traffic of most URL shorteners. Redis achieves this through: single-threaded event loop (no lock contention), in-memory data storage, efficient data structures, and minimal protocol overhead. Redis 6+ introduced I/O threading for even higher throughput. For comparison, a well-tuned PostgreSQL instance might handle 10,000-50,000 simple lookups per second — an order of magnitude less. This performance difference is why Redis is the de facto caching layer for read-heavy systems."
  },
  {
    question: "How would you implement URL shortener access controls (private short URLs)?",
    options: ["All short URLs must be public", "Add an authentication layer where private URLs require an API key or token in a query parameter or header before redirecting", "Use longer keys for private URLs", "Encrypt the destination URL"],
    correctIndex: 1,
    explanation: "Private short URLs add an access control layer before the redirect. Implementation options include: API key in a query parameter (sho.rt/abc123?key=secret123), bearer token in a cookie/header (requires the user to be authenticated), password-protected redirect (interstitial page asking for a password), or organization-based access (only users authenticated with the organization's SSO can access the redirect). The trade-off is user experience — adding authentication to redirects adds friction and breaks the simplicity of short URLs. For API-based access, tokens are cleaner. For browser-based access, a lightweight interstitial page with password entry works well. The short URL's metadata record needs an 'access_type' field (public/private/password-protected) and associated credentials. This feature is valuable for enterprise use cases where companies share internal links externally but want to control access."
  },
  {
    question: "What is the purpose of request tracing (distributed tracing) in a URL shortener system?",
    options: ["To trace the destination URL", "To track a single request's journey through all system components (load balancer → app server → cache/DB → analytics), enabling debugging and performance optimization", "To trace user identity", "To trace URL creation history"],
    correctIndex: 1,
    explanation: "Distributed tracing assigns a unique trace ID to each incoming request and propagates it through every component the request touches. For a URL shortener redirect: the load balancer logs the trace ID, the application server logs cache hit/miss with the trace ID, the database query (if any) is tagged with the trace ID, and the analytics event includes it. When a user reports slow redirects, you can look up the trace ID and see exactly where time was spent — was it DNS resolution? TLS handshake? Cache miss? Slow database query? Tools like Jaeger, Zipkin, or AWS X-Ray provide visualization of trace data. Without distributed tracing, debugging performance issues in a multi-component system becomes guesswork. This observability capability is essential for any production system and demonstrates operational maturity in system design interviews."
  },
  {
    question: "What is the role of feature flags in a URL shortener deployment?",
    options: ["To flag malicious URLs", "To enable gradual rollout of new features (like new redirect logic or caching strategies) to a percentage of traffic without redeploying", "To mark URLs for deletion", "To flag popular URLs for caching"],
    correctIndex: 1,
    explanation: "Feature flags (also called feature toggles) allow you to enable or disable specific code paths at runtime without redeploying the application. For a URL shortener, this enables: gradual rollout of a new caching strategy (test with 1% of traffic before full deployment), A/B testing different redirect logic (302 vs 307), canary deployments of new database clients, quick rollback of problematic features without redeployment, and enabling premium features for specific user tiers. Tools like LaunchDarkly, Split.io, or simple Redis-backed configurations provide feature flag infrastructure. The key benefit is risk reduction — if a new feature causes issues, you flip the flag off instantly rather than waiting for a deployment. This operational pattern is used extensively at companies like Facebook, Google, and Netflix for safe continuous deployment."
  },
];