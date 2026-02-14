import { useState } from 'react'
import StepWalkthrough from '../components/StepWalkthrough'
import type { Step } from '../components/StepWalkthrough'

interface Problem {
  name: string
  icon: string
  difficulty: 'Medium' | 'Hard'
  tags: string[]
  steps: Step[]
}

const problems: Problem[] = [
  { name: 'URL Shortener (TinyURL)', icon: '🔗', difficulty: 'Medium', tags: ['Hashing', 'NoSQL', 'Cache'],
    steps: [
      { title: 'Requirements', content: 'Functional: shorten URL, redirect, custom aliases, analytics. Non-functional: low latency (<100ms), high availability, 100M URLs/day.', details: ['Read:Write ratio ~100:1', '~1B redirects/day', '365B URLs over 5 years'] },
      { title: 'Capacity Estimation', content: 'Storage: 500 bytes/URL × 100M/day × 365 × 5 ≈ 90TB. QPS: writes ~1.2K/s, reads ~120K/s.', details: ['Short URL length: base62 with 7 chars = 3.5T unique URLs', 'Cache hot URLs (Pareto: 20% URLs = 80% traffic)'] },
      { title: 'High-Level Design', content: 'Client → API Gateway → URL Service → Database. Add cache layer (Redis) for read-heavy workload. Use base62 encoding or MD5 hash truncation for short URL generation.', details: ['API: POST /api/shorten, GET /:shortUrl', 'NoSQL (DynamoDB/Cassandra) for horizontal scaling'] },
      { title: 'Detailed Design', content: 'ID generation: Counter-based (Snowflake) or hash-based (MD5 first 7 chars). Handle collisions with retry. Custom aliases stored separately.', details: ['Range-based partitioning by first char of short URL', 'Redis cache with TTL for popular URLs', 'Analytics: async event logging to Kafka → analytics pipeline'] },
      { title: 'Scaling', content: 'Database sharding by hash of short URL. Redis cluster for distributed caching. CDN for redirect (301 vs 302). Rate limiting per API key.', details: ['301 (permanent) saves server load, 302 (temporary) enables analytics', 'Bloom filter to check URL existence before DB lookup'] },
    ] },
  { name: 'Twitter/X Feed', icon: '🐦', difficulty: 'Hard', tags: ['Fan-out', 'Cache', 'Timeline'],
    steps: [
      { title: 'Requirements', content: 'Post tweets, follow users, home timeline, search. 300M MAU, 600 tweets/sec, timeline read-heavy.', details: ['Average user follows 200 people', 'Celebrity accounts have 10M+ followers'] },
      { title: 'Capacity Estimation', content: 'Tweet storage: 280 chars + metadata ≈ 500B. 600/s × 86400 ≈ 50M tweets/day. Timeline: 300M users × 1 timeline/day.', details: ['Media storage separate (S3)', 'Timeline cache: ~800 tweets per user'] },
      { title: 'High-Level Design', content: 'Write path: Tweet Service → Fan-out Service → Timeline Cache. Read path: Timeline Cache → merge with celebrity tweets on read.', details: ['Hybrid fan-out: push for normal users, pull for celebrities', 'Social graph service for follow relationships'] },
      { title: 'Detailed Design', content: 'Fan-out on write: when user tweets, push to all followers\' timeline caches. For celebrities (>10K followers), fan-out on read to avoid write amplification.', details: ['Timeline stored in Redis sorted sets (score = timestamp)', 'Tweet ID generation with Snowflake'] },
      { title: 'Scaling', content: 'Shard timeline cache by user ID. Shard tweet storage by tweet ID. Search: Elasticsearch with inverted index on tweet text.', details: ['Trending topics: count hashtags in sliding window', 'Notification service: separate from timeline'] },
    ] },
  { name: 'Chat System (WhatsApp)', icon: '💬', difficulty: 'Hard', tags: ['WebSocket', 'Queue', 'Presence'],
    steps: [
      { title: 'Requirements', content: '1-on-1 chat, group chat (up to 500), online/offline status, message delivery receipts, push notifications. 500M DAU.', details: ['50B messages/day', 'End-to-end encryption', 'Multi-device support'] },
      { title: 'Capacity Estimation', content: 'Messages: 100 bytes avg × 50B/day = 5TB/day. Connections: 500M concurrent WebSocket connections.', details: ['Each WebSocket server handles ~65K connections', 'Need ~8K servers just for connections'] },
      { title: 'High-Level Design', content: 'Client ↔ WebSocket Gateway ↔ Chat Service ↔ Message Queue ↔ Storage. Presence service for online status. Push notification for offline users.', details: ['WebSocket for real-time, HTTP fallback', 'Message queue between sender and receiver gateways'] },
      { title: 'Detailed Design', content: 'Message flow: Sender → WS Gateway → Chat Service → check receiver online → if online: forward via WS, if offline: push notification + store. Group: fan-out to all members.', details: ['Message ordering: per-chat sequence numbers', 'Message storage: write-optimized (HBase/Cassandra)', 'Delivery receipts: sent/delivered/read acks'] },
      { title: 'Scaling', content: 'Shard by user ID for connections, by chat_id for messages. Presence: heartbeat-based with Redis pub/sub. Group message fan-out via message queue partitions.', details: ['Media: upload to S3, send URL in message', 'Sync protocol for multi-device'] },
    ] },
  { name: 'Video Platform (YouTube)', icon: '📹', difficulty: 'Hard', tags: ['CDN', 'Encoding', 'Storage'],
    steps: [
      { title: 'Requirements', content: 'Upload videos, stream videos, search, recommendations. 2B MAU, 500 hours uploaded/min.', details: ['5M videos watched/day per user', 'Support multiple resolutions'] },
      { title: 'Capacity Estimation', content: 'Storage: 500 hrs/min × 60 min × 50MB/min ≈ 1.5TB/hour of raw video. After encoding: 5-10x.', details: ['CDN bandwidth: massive', 'Metadata DB relatively small'] },
      { title: 'High-Level Design', content: 'Upload: Client → Upload Service → Transcoding Pipeline → CDN. Watch: Client → CDN (cache hit) or Origin. Metadata: separate service + DB.', details: ['DAG-based transcoding pipeline', 'Adaptive bitrate streaming (HLS/DASH)'] },
      { title: 'Detailed Design', content: 'Transcoding: split video into chunks, process in parallel (different resolutions, codecs). Store chunks in S3, serve via CDN. Pre-signed URLs for upload.', details: ['Thumbnail generation', 'Video deduplication', 'Copyright detection (Content ID)'] },
      { title: 'Scaling', content: 'CDN for global distribution. Edge caching for popular videos. Cold storage for rarely accessed. Recommendation engine: collaborative filtering + ML.', details: ['Live streaming: different pipeline (lower latency)', 'Comment system: separate microservice'] },
    ] },
  { name: 'Ride-Sharing (Uber)', icon: '🚗', difficulty: 'Hard', tags: ['Geospatial', 'Matching', 'Real-time'],
    steps: [
      { title: 'Requirements', content: 'Request ride, match with driver, real-time tracking, ETA, pricing, payments. 20M rides/day.', details: ['Drivers send location every 4 seconds', '1M concurrent drivers'] },
      { title: 'Capacity Estimation', content: 'Location updates: 1M drivers × 1 update/4s = 250K writes/sec. Trip storage: 20M × 1KB = 20GB/day.', details: ['Geospatial queries: find drivers within radius', 'Peak QPS: 3-5x average'] },
      { title: 'High-Level Design', content: 'Rider App → API → Trip Service → Matching Service → Driver App. Location Service tracks all drivers. Pricing Service calculates fares.', details: ['WebSocket for real-time location updates', 'Geospatial index for nearby driver lookup'] },
      { title: 'Detailed Design', content: 'Location tracking: QuadTree or GeoHash index. Matching: find nearest available drivers, send ride request, first to accept wins. Dynamic pricing based on supply/demand ratio.', details: ['S2 geometry library for geospatial', 'ETA: graph-based routing (Dijkstra/A*)', 'Driver dispatch: cell-based partitioning'] },
      { title: 'Scaling', content: 'Partition location data by geographic cells. Replicate across regions. Event-driven architecture for trip state machine. Kafka for event streaming.', details: ['Surge pricing: real-time supply/demand calculation', 'Payment: async processing, idempotent charges'] },
    ] },
  { name: 'Notification System', icon: '🔔', difficulty: 'Medium', tags: ['Queue', 'Priority', 'Templates'],
    steps: [
      { title: 'Requirements', content: 'Push notifications (iOS/Android), SMS, email. 10B notifications/day. Priority levels. User preferences. Template system.', details: ['Delivery rate: 99.9%', 'Latency: <1s for urgent'] },
      { title: 'Capacity Estimation', content: '10B/day ≈ 115K/sec. Peak: 500K/sec. Storage for templates and logs.', details: ['Rate limiting per user per channel', 'Analytics: delivery, open rates'] },
      { title: 'High-Level Design', content: 'Event Source → Notification Service → Priority Queue → Channel Workers (push/SMS/email). User preference store. Template engine.', details: ['Separate queues per channel and priority', 'Retry with exponential backoff'] },
      { title: 'Detailed Design', content: 'Template rendering: Handlebars-style with user data injection. Deduplication: hash of (user, template, params, time window). Preference check before sending.', details: ['iOS: APNs, Android: FCM', 'Email: SES/SendGrid', 'SMS: Twilio'] },
      { title: 'Scaling', content: 'Kafka for event ingestion. Separate consumer groups per channel. Redis for rate limiting and dedup. DynamoDB for preferences.', details: ['Observability: track delivery funnel', 'A/B testing for notification content'] },
    ] },
  { name: 'Rate Limiter', icon: '🚦', difficulty: 'Medium', tags: ['Algorithm', 'Redis', 'Distributed'],
    steps: [
      { title: 'Requirements', content: 'Limit API requests per client. Support multiple rules (per second, minute, hour). Distributed across servers. Low latency overhead.', details: ['Configurable limits per API endpoint', 'Return 429 with retry-after header'] },
      { title: 'Capacity Estimation', content: 'Rule checks: 1M QPS × 3 rules/request = 3M rule checks/sec. Redis can handle 100K+ ops/sec per shard.', details: ['Need ~30 Redis shards', 'Rule storage is small (<1GB)'] },
      { title: 'High-Level Design', content: 'API Gateway → Rate Limiter Middleware → Redis (counters/tokens) → Backend Service. Rules stored in config DB, cached locally.', details: ['Middleware approach: least invasive', 'Can also be standalone service'] },
      { title: 'Detailed Design', content: 'Token Bucket: initialize with max tokens, add tokens at fixed rate, consume one per request. Use Redis MULTI/EXEC for atomic check-and-decrement.', details: ['Sliding window: combine fixed window counter with weighted previous window', 'Lua scripts in Redis for atomicity', 'Race condition: use Redis SETNX or Lua'] },
      { title: 'Scaling', content: 'Shard Redis by client ID hash. Synchronize counters across data centers with eventual consistency (slight over-limit OK). Local cache for rules.', details: ['Monitoring: alert on high 429 rates', 'Graceful degradation: fail-open vs fail-closed'] },
    ] },
  { name: 'Key-Value Store', icon: '🔑', difficulty: 'Hard', tags: ['Storage', 'Replication', 'Consistency'],
    steps: [
      { title: 'Requirements', content: 'Put(key, value), Get(key). Tunable consistency. High availability. Horizontal scaling. Small values (<1MB).', details: ['Millions of QPS', 'Sub-millisecond latency for cached'] },
      { title: 'Capacity Estimation', content: '1TB data, 10:1 read:write ratio. Key: 256 bytes max, Value: 1MB max. Replication factor: 3.', details: ['Total storage with replication: 3TB', 'Memory for hot data: 100GB'] },
      { title: 'High-Level Design', content: 'Client → Coordinator → Partition nodes. Consistent hashing for partitioning. Replication to N successor nodes.', details: ['Quorum protocol: W + R > N for consistency', 'Gossip protocol for membership'] },
      { title: 'Detailed Design', content: 'Write path: coordinator → write to commit log → update memtable → when full, flush to SSTable. Read: check memtable → check bloom filter → read SSTables.', details: ['LSM tree storage engine', 'Compaction: size-tiered or leveled', 'Vector clocks for conflict resolution'] },
      { title: 'Scaling', content: 'Add nodes: consistent hashing redistributes minimal data. Handle failures: hinted handoff, anti-entropy with Merkle trees. Sloppy quorum for availability.', details: ['Gossip protocol: ~O(log N) convergence', 'Read repair on read inconsistencies'] },
    ] },
  { name: 'Web Crawler', icon: '🕷️', difficulty: 'Medium', tags: ['Queue', 'Politeness', 'Dedup'],
    steps: [
      { title: 'Requirements', content: 'Crawl 1B pages/month. Respect robots.txt. Deduplication. Politeness (rate limit per domain). Store content for indexing.', details: ['~400 pages/sec', 'Recrawl frequency based on page change rate'] },
      { title: 'Capacity Estimation', content: '1B pages × 500KB avg = 500TB/month storage. Network: 1B × 500KB / 30 days ≈ 200MB/s sustained.', details: ['URL frontier: billions of URLs', 'DNS resolution: cache aggressively'] },
      { title: 'High-Level Design', content: 'URL Frontier → Fetcher → Parser → Content Store → URL Extractor → Dedup → back to Frontier. DNS resolver cache.', details: ['Priority queue for important URLs', 'Politeness queue: one queue per domain'] },
      { title: 'Detailed Design', content: 'URL frontier: priority + politeness queues. Fetcher: async HTTP with connection pooling. Parser: extract links, text, metadata. Dedup: content hash (SimHash for near-duplicates).', details: ['URL normalization', 'Trap detection (infinite URLs)', 'robots.txt cache per domain'] },
      { title: 'Scaling', content: 'Distribute frontier across workers. Partition by domain for politeness. Bloom filter for URL dedup (space-efficient). Checkpointing for fault tolerance.', details: ['Dynamic crawl priority based on PageRank', 'Incremental crawling for changed pages'] },
    ] },
  { name: 'News Feed', icon: '📰', difficulty: 'Hard', tags: ['Fan-out', 'Ranking', 'Cache'],
    steps: [
      { title: 'Requirements', content: 'Publish posts, see friends\' posts in ranked feed. 300M DAU. Feed freshness <30s. Ranked by relevance, not just time.', details: ['Average 500 friends per user', '1000 posts/day in network'] },
      { title: 'Capacity Estimation', content: 'Feed generation: 300M × 5 reads/day = 1.5B/day ≈ 17K/sec. Post creation: 100M/day ≈ 1.2K/sec.', details: ['Feed cache: 500 posts × 300M users = hot data', 'ML ranking model input'] },
      { title: 'High-Level Design', content: 'Post Service → Fan-out Service → Feed Cache. On read: merge cached feed + fresh posts → Ranking Service → return.', details: ['Hybrid: pre-compute for most, on-demand for celebrities', 'Social graph service'] },
      { title: 'Detailed Design', content: 'Ranking: ML model considering recency, engagement, relationship strength, content type. Fan-out: async via Kafka. Feed cache: Redis sorted set (score = ranking).', details: ['Feature store for ML ranking', 'A/B testing framework for ranking experiments'] },
      { title: 'Scaling', content: 'Shard feed cache by user_id. Edge caching for static content. Lazy loading and pagination. Pre-rank during fan-out, re-rank on read.', details: ['Ads injection into feed', 'Content moderation pipeline'] },
    ] },
  { name: 'Google Maps', icon: '🗺️', difficulty: 'Hard', tags: ['Geospatial', 'Graph', 'Tiles'],
    steps: [
      { title: 'Requirements', content: 'Map rendering, routing (driving/walking/transit), ETA, real-time traffic. 1B MAU.', details: ['Map tile serving at multiple zoom levels', 'Turn-by-turn navigation'] },
      { title: 'Capacity Estimation', content: 'Map tiles: pre-rendered at ~20 zoom levels. Road graph: billions of edges. Location queries: millions/sec.', details: ['Tile storage: petabytes', 'Routing graph fits in memory with compression'] },
      { title: 'High-Level Design', content: 'Map Tile Service (CDN) + Geocoding Service + Routing Service + Traffic Service + Location Service.', details: ['Tile pyramid: zoom 0 = 1 tile, zoom 20 = 1T tiles', 'Vector tiles vs raster tiles'] },
      { title: 'Detailed Design', content: 'Routing: road network as weighted graph. Dijkstra for short distances, A* with landmarks for long distances. Precomputed hierarchical routing (Contraction Hierarchies).', details: ['Traffic: aggregate GPS signals from users', 'ETA: historical + real-time traffic', 'Geocoding: inverted index on address components'] },
      { title: 'Scaling', content: 'CDN for tile serving. Partition routing graph geographically. Stitch cross-region routes at boundaries. Cache popular routes.', details: ['Offline maps: pre-download tile packages', 'Places/POI: separate search service'] },
    ] },
  { name: 'Payment System', icon: '💳', difficulty: 'Hard', tags: ['Idempotency', 'Ledger', 'Consistency'],
    steps: [
      { title: 'Requirements', content: 'Process payments, refunds, payouts. Strong consistency. Exactly-once processing. Audit trail. PCI compliance. 1M transactions/day.', details: ['99.999% availability', 'Support multiple currencies'] },
      { title: 'Capacity Estimation', content: '1M/day ≈ 12 TPS average, 100 TPS peak. Each transaction: ~2KB. Ledger grows by ~2GB/day.', details: ['Not high QPS but very high consistency requirement', 'Double-entry bookkeeping'] },
      { title: 'High-Level Design', content: 'Payment Gateway → Payment Service → Payment Processor (Stripe/Adyen) → Ledger Service. Reconciliation job. Notification service.', details: ['Idempotency key for every request', 'State machine for payment lifecycle'] },
      { title: 'Detailed Design', content: 'Payment state machine: INITIATED → PROCESSING → COMPLETED/FAILED. Double-entry ledger: every transaction has debit + credit entries. Idempotency via unique key stored in DB.', details: ['Retry with idempotency key', 'Dead letter queue for failed payments', 'Reconciliation: match internal ledger with processor reports'] },
      { title: 'Scaling', content: 'RDBMS for ACID (PostgreSQL). Horizontal read replicas. Partition by merchant/region. Async notifications and webhooks. Event sourcing for audit trail.', details: ['PCI DSS: tokenize card data', 'Currency conversion service', 'Fraud detection ML pipeline'] },
    ] },
]

export default function Problems() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">💡 Classic Problems</h1>
        <p className="text-slate-400 text-sm mt-1">12 most-asked system design interview problems with step-by-step walkthroughs</p>
      </div>

      {selected === null ? (
        <div className="space-y-3">
          {problems.map((p, i) => (
            <button
              key={p.name}
              onClick={() => setSelected(i)}
              className="w-full text-left bg-slate-card border border-navy-600 rounded-xl p-4
                hover:border-accent-blue/50 hover:shadow-lg transition-all duration-200 group flex items-center gap-4"
            >
              <span className="text-2xl">{p.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white group-hover:text-accent-blue transition-colors">{p.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium
                    ${p.difficulty === 'Hard' ? 'bg-accent-red/15 text-accent-red' : 'bg-accent-orange/15 text-accent-orange'}`}>
                    {p.difficulty}
                  </span>
                  {p.tags.map(t => (
                    <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-navy-700 text-slate-400">{t}</span>
                  ))}
                </div>
              </div>
              <span className="text-slate-500 text-sm">→</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="animate-fade-in space-y-6">
          <button onClick={() => setSelected(null)} className="text-sm text-accent-blue hover:text-accent-cyan transition-colors">
            ← Back to all problems
          </button>
          <div className="bg-slate-card border border-navy-600 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">{problems[selected].icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-white">{problems[selected].name}</h2>
                <div className="flex gap-2 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full
                    ${problems[selected].difficulty === 'Hard' ? 'bg-accent-red/15 text-accent-red' : 'bg-accent-orange/15 text-accent-orange'}`}>
                    {problems[selected].difficulty}
                  </span>
                  {problems[selected].tags.map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-navy-700 text-slate-400">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <StepWalkthrough steps={problems[selected].steps} />
          </div>
        </div>
      )}
    </div>
  )
}
