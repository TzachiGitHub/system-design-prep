// System Design Problems — 12 Classic Design Problems with Full Interview Walkthroughs

export interface DesignProblem {
  id: string;
  name: string;
  emoji: string;
  difficulty: string;
  estimatedMinutes: number;
  requirements: { functional: string[]; nonFunctional: string[] };
  capacityEstimation: { metric: string; calculation: string; result: string }[];
  highLevelComponents: { name: string; purpose: string }[];
  apiDesign: { method: string; endpoint: string; description: string }[];
  detailedDesign: string;
  scalingDiscussion: string[];
  followUpQuestions: string[];
  commonMistakes: string[];
}

export const designProblems: DesignProblem[] = [
  // ========================================
  // 1. URL SHORTENER
  // ========================================
  {
    id: "url-shortener",
    name: "URL Shortener",
    emoji: "🔗",
    difficulty: "Easy",
    estimatedMinutes: 35,
    requirements: {
      functional: [
        "Given a long URL, generate a short unique URL",
        "When user accesses short URL, redirect to original long URL",
        "Users can optionally pick a custom short link",
        "Links expire after a default or user-specified timespan",
        "Analytics: track click count, referrer, geo per short URL"
      ],
      nonFunctional: [
        "System should be highly available (redirects must always work)",
        "URL redirection should be real-time with minimal latency (<100ms)",
        "Shortened links should not be guessable (not sequential)",
        "System should handle 100M new URLs/month, 10B redirects/month",
        "99.9% uptime SLA"
      ]
    },
    capacityEstimation: [
      { metric: "New URLs/sec", calculation: "100M / (30 × 86400)", result: "~40 URLs/sec" },
      { metric: "Redirects/sec (read QPS)", calculation: "10B / (30 × 86400)", result: "~3,800 QPS (peak: ~7,600)" },
      { metric: "Read:Write ratio", calculation: "3800 / 40", result: "~100:1 (read-heavy)" },
      { metric: "Storage per URL", calculation: "short URL (7B) + long URL (avg 200B) + metadata (100B)", result: "~300 bytes/URL" },
      { metric: "Storage for 5 years", calculation: "100M × 12 × 5 × 300B", result: "~1.8 TB" },
      { metric: "Bandwidth (redirects)", calculation: "3800 QPS × 300B", result: "~1.1 MB/s" },
      { metric: "Cache (80/20 rule)", calculation: "3800 × 86400 × 0.2 × 300B", result: "~20 GB/day (fits in memory)" }
    ],
    highLevelComponents: [
      { name: "API Servers", purpose: "Handle URL creation and redirect requests (stateless, horizontally scalable)" },
      { name: "Database", purpose: "Store URL mappings (shortURL → longURL + metadata). NoSQL preferred for simple key-value lookups at scale" },
      { name: "Cache (Redis)", purpose: "Cache hot URLs for fast redirects. LRU eviction. Dramatically reduces DB reads" },
      { name: "ID Generator", purpose: "Generate unique IDs for short URLs. Options: auto-increment with multiple servers, Snowflake, UUID, or pre-generated key ranges" },
      { name: "Load Balancer", purpose: "Distribute traffic across API servers" },
      { name: "Analytics Service", purpose: "Async processing of click events for stats (via message queue)" }
    ],
    apiDesign: [
      { method: "POST", endpoint: "/api/v1/urls", description: "Create short URL. Body: { longUrl, customAlias?, expiresAt? }. Returns: { shortUrl, longUrl, expiresAt }" },
      { method: "GET", endpoint: "/{shortUrl}", description: "Redirect to long URL. Returns 301 (permanent, cached by browser) or 302 (temporary, enables analytics)" },
      { method: "GET", endpoint: "/api/v1/urls/{shortUrl}/stats", description: "Get analytics: click count, top referrers, geographic distribution" },
      { method: "DELETE", endpoint: "/api/v1/urls/{shortUrl}", description: "Delete/deactivate a short URL (requires authentication)" }
    ],
    detailedDesign: `**Short URL Generation:**
1. Use a distributed unique ID generator (Snowflake-style: 64-bit = timestamp + machine ID + sequence)
2. Convert the numeric ID to base62 (a-z, A-Z, 0-9) → 7 characters gives 62^7 ≈ 3.5 trillion unique URLs
3. Store mapping in database: shortURL → {longURL, createdAt, expiresAt, userId}

**Why base62 over MD5/SHA?**
- MD5 produces 128-bit hash → even truncated, collision probability is higher at scale
- Base62 of unique ID = guaranteed no collisions, predictable length

**Custom aliases:** Check if alias exists in DB → if not, use it; if taken, return error

**Database choice:** NoSQL (DynamoDB/Cassandra) — simple key-value access pattern, easy to shard by shortURL key, no complex queries needed

**Redirect flow:**
1. Client hits GET /{shortUrl}
2. Check Redis cache → if hit, redirect immediately (cache hit rate ~80%+)
3. On cache miss → query DB → populate cache → redirect
4. Log click event to Kafka for async analytics processing

**Cache strategy:** Cache-aside with LRU eviction. Popular URLs stay in cache. TTL on cache entries matches URL expiration.

**Handling expiration:** Background job scans for expired URLs. Alternatively, check expiry on read and return 404 if expired (lazy cleanup + periodic batch cleanup).`,
    scalingDiscussion: [
      "**Read-heavy (100:1)**: Add read replicas for DB, cache aggressively in Redis cluster. Most redirects served from cache.",
      "**Database sharding**: Shard by hash of shortURL. Ensures even distribution. No need for cross-shard queries.",
      "**Multiple ID generators**: Each server gets a unique range of IDs (e.g., server 1: 1-1M, server 2: 1M-2M). No coordination needed.",
      "**CDN for redirects**: For extremely popular URLs, CDN can cache the redirect at edge. Set appropriate Cache-Control headers.",
      "**Rate limiting**: Prevent abuse — limit URL creation per IP/user (e.g., 100/hour). Use token bucket on API gateway.",
      "**Multi-region**: Deploy in multiple regions with geo-DNS routing. Each region has its own DB shard and cache layer."
    ],
    followUpQuestions: [
      "How would you handle a celebrity posting a URL that gets millions of clicks instantly?",
      "How would you implement URL expiration efficiently?",
      "How would you prevent malicious URLs (phishing/spam)?",
      "How would you support custom domains (white-labeling)?",
      "How would you guarantee the same long URL always maps to the same short URL?"
    ],
    commonMistakes: [
      "Using MD5/SHA hash of the URL — high collision probability at scale, hard to manage",
      "Using a single auto-increment counter — single point of failure, contention bottleneck",
      "Not caching — at 100:1 read:write ratio, DB will be crushed without caching",
      "Using 301 redirect exclusively — loses ability to track clicks for analytics",
      "Not considering link expiration — storage grows unbounded",
      "Forgetting rate limiting — bot abuse can generate millions of URLs"
    ]
  },

  // ========================================
  // 2. TWITTER / TIMELINE FEED
  // ========================================
  {
    id: "twitter-feed",
    name: "Twitter / Timeline Feed",
    emoji: "🐦",
    difficulty: "Hard",
    estimatedMinutes: 45,
    requirements: {
      functional: [
        "Users can post tweets (280 chars, optionally with media)",
        "Users can follow/unfollow other users",
        "Home timeline: aggregated feed of tweets from followed users, reverse chronological",
        "User timeline: all tweets by a specific user",
        "Like, retweet, and reply to tweets",
        "Search tweets by keyword"
      ],
      nonFunctional: [
        "Timeline generation should be fast (<500ms)",
        "High availability — the timeline should always load",
        "Eventual consistency is acceptable (slight delay in feed is OK)",
        "Support 500M users, 200M DAU, 400M tweets/day",
        "Handle celebrity users with 50M+ followers"
      ]
    },
    capacityEstimation: [
      { metric: "Tweets/sec", calculation: "400M / 86400", result: "~4,600 tweets/sec (peak: ~9,200)" },
      { metric: "Timeline reads/sec", calculation: "200M DAU × 10 reads/day / 86400", result: "~23,000 QPS (peak: ~46,000)" },
      { metric: "Storage per tweet", calculation: "280 chars + metadata (userId, timestamp, IDs) ≈ 500B + media ref", result: "~500 bytes (text only)" },
      { metric: "Tweet storage/day", calculation: "400M × 500B", result: "~200 GB/day" },
      { metric: "Tweet storage/5 years", calculation: "200GB × 365 × 5", result: "~365 TB" },
      { metric: "Fan-out: avg followers", calculation: "Average user has 200 followers", result: "4600 tweets/sec × 200 = 920K fan-out writes/sec" },
      { metric: "Timeline cache per user", calculation: "800 tweets × 500B", result: "~400 KB per user timeline cache" }
    ],
    highLevelComponents: [
      { name: "Tweet Service", purpose: "Create, delete, retrieve tweets. Stores in Tweet DB (sharded by tweetId)" },
      { name: "Fan-out Service", purpose: "On new tweet, push to followers' timeline caches. Uses message queue for async processing" },
      { name: "Timeline Service", purpose: "Retrieve user's home timeline from pre-computed cache. Falls back to on-the-fly merge if cache miss" },
      { name: "User/Graph Service", purpose: "Manage user profiles and follow relationships. Graph DB or adjacency list" },
      { name: "Search Service", purpose: "Full-text search on tweets. Elasticsearch/Solr index updated async" },
      { name: "Media Service", purpose: "Handle image/video upload, storage (S3), and CDN distribution" },
      { name: "Notification Service", purpose: "Push notifications for mentions, likes, retweets" },
      { name: "Cache Layer (Redis)", purpose: "Store pre-computed timelines (list of tweetIds per user)" }
    ],
    apiDesign: [
      { method: "POST", endpoint: "/api/v1/tweets", description: "Create tweet. Body: { content, mediaIds? }. Triggers fan-out" },
      { method: "GET", endpoint: "/api/v1/timeline/home?cursor={cursor}", description: "Get home timeline (paginated). Returns list of tweets from followed users" },
      { method: "GET", endpoint: "/api/v1/timeline/user/{userId}?cursor={cursor}", description: "Get user timeline (all tweets by userId)" },
      { method: "POST", endpoint: "/api/v1/users/{userId}/follow", description: "Follow a user" },
      { method: "GET", endpoint: "/api/v1/search?q={query}&cursor={cursor}", description: "Search tweets by keyword" },
      { method: "POST", endpoint: "/api/v1/tweets/{tweetId}/like", description: "Like a tweet" }
    ],
    detailedDesign: `**The Core Problem: Fan-out**

When a user tweets, how do their followers see it? Two approaches:

**Fan-out on Write (Push Model):**
- When user posts, immediately write tweetId to every follower's timeline cache (Redis list)
- Timeline read = just read from cache (O(1), super fast!)
- Problem: celebrities with 50M followers → 50M writes per tweet (minutes of delay, massive write amplification)

**Fan-out on Read (Pull Model):**
- When user reads timeline, fetch tweets from all followed users in real-time and merge
- No write amplification
- Problem: slow reads (if you follow 1000 users, must query 1000 sources and merge-sort)

**Hybrid Approach (What Twitter Actually Uses):**
- For regular users (<10K followers): fan-out on write (push to followers' caches)
- For celebrities (>10K followers): fan-out on read (don't push; merge celebrity tweets at read time)
- Timeline read: fetch pre-computed cache + merge with celebrity tweets

**Timeline Cache (Redis):**
- Each user has a Redis list of tweetIds (keep last 800)
- On fan-out, LPUSH tweetId to each follower's list
- On read, LRANGE to get page, then hydrate with tweet data from Tweet Service

**Data Storage:**
- Tweet DB: Sharded by tweetId (snowflake ID = time-sortable). Cassandra or MySQL sharded
- User DB: User profiles. Sharded by userId
- Follow Graph: Adjacency list in Redis or dedicated graph store. Key: userId → Set<followeeIds>
- Timeline Cache: Redis. Key: userId → List<tweetIds>

**Tweet creation flow:**
1. Client → API Gateway → Tweet Service (write to Tweet DB)
2. Tweet Service → Kafka (publish tweet event)
3. Fan-out workers consume from Kafka
4. For each follower: LPUSH tweetId to their Redis timeline
5. If celebrity: skip fan-out, just store tweet (merged at read time)

**Search:** Tweets indexed in Elasticsearch async via Kafka consumer. Supports full-text, hashtag, and user mention search.`,
    scalingDiscussion: [
      "**Redis Cluster for timelines**: Shard timeline caches across Redis cluster. Each user's timeline on one shard (hash by userId).",
      "**Kafka partitioning**: Partition fan-out events by followee. Each partition processed by a consumer group for parallelism.",
      "**Celebrity handling**: Maintain a list of 'high-follower' users. Their tweets are fetched at read time and merged. Keeps fan-out manageable.",
      "**Multi-region**: Replicate timeline caches across regions. User reads from nearest datacenter. Tweets replicate async.",
      "**Media CDN**: All images/videos served via CDN. Upload to S3, generate thumbnails async, serve from CloudFront/Akamai.",
      "**Surge handling**: Auto-scale fan-out workers based on Kafka lag. During events (Super Bowl), temporarily increase worker count.",
      "**Cache warming**: When a user logs in after inactivity, trigger async timeline reconstruction from DB if cache is cold."
    ],
    followUpQuestions: [
      "How would you handle a tweet going viral (millions of retweets)?",
      "How would you implement trending topics?",
      "How would you handle tweet deletion across all cached timelines?",
      "How would you add 'algorithmic' timeline ranking (not just chronological)?",
      "How would you prevent spam/bot accounts?"
    ],
    commonMistakes: [
      "Using only fan-out on write without addressing celebrity problem — a single celebrity tweet could take minutes to fan out",
      "Not pre-computing timelines — doing fan-out on read for ALL users is too slow at scale",
      "Storing full tweet objects in timeline cache — store only tweetIds, hydrate on read (saves memory)",
      "Not using pagination/cursors — returning entire timeline at once",
      "Ignoring the follow graph complexity — follow/unfollow must update timeline caches",
      "Not considering tweet deletion — deleted tweets must be removed from all caches"
    ]
  },

  // ========================================
  // 3. CHAT SYSTEM
  // ========================================
  {
    id: "chat-system",
    name: "Chat System (WhatsApp/Messenger)",
    emoji: "💬",
    difficulty: "Hard",
    estimatedMinutes: 45,
    requirements: {
      functional: [
        "1-on-1 messaging between users",
        "Group chat (up to 500 members)",
        "Online/offline status indicators",
        "Message delivery receipts (sent, delivered, read)",
        "Media sharing (images, videos, files)",
        "Message history and persistence",
        "Push notifications for offline users"
      ],
      nonFunctional: [
        "Real-time message delivery (<100ms for online users)",
        "Messages must not be lost (at-least-once delivery)",
        "Support 500M DAU, 50B messages/day",
        "End-to-end encryption for 1-on-1 chats",
        "High availability: 99.99% uptime"
      ]
    },
    capacityEstimation: [
      { metric: "Messages/sec", calculation: "50B / 86400", result: "~580K messages/sec" },
      { metric: "Concurrent connections", calculation: "500M DAU, ~30% online at peak", result: "~150M concurrent WebSocket connections" },
      { metric: "Storage per message", calculation: "Text avg 100B + metadata 100B", result: "~200 bytes/message" },
      { metric: "Storage/day", calculation: "50B × 200B", result: "~10 TB/day" },
      { metric: "Storage/5 years", calculation: "10TB × 365 × 5", result: "~18 PB" },
      { metric: "WebSocket servers needed", calculation: "150M connections / 50K per server", result: "~3,000 WebSocket servers" }
    ],
    highLevelComponents: [
      { name: "WebSocket Gateway", purpose: "Maintain persistent connections with clients. Route messages. Stateful — tracks which user is on which server" },
      { name: "Chat Service", purpose: "Message routing logic. Determines if recipient is online (route to their WebSocket) or offline (store + push notification)" },
      { name: "Message Store", purpose: "Persistent storage for all messages. Sharded by conversationId. Cassandra or HBase (write-optimized)" },
      { name: "Presence Service", purpose: "Track online/offline status. Uses heartbeats. Stores in Redis with TTL" },
      { name: "Group Service", purpose: "Manage group membership, settings. Fan-out messages to all group members" },
      { name: "Push Notification Service", purpose: "Send notifications to offline users via APNs/FCM" },
      { name: "Media Service", purpose: "Handle upload/download of images, videos, files. Store in object storage (S3), generate thumbnails" },
      { name: "Session Registry", purpose: "Maps userId → WebSocket serverId. Enables routing messages to the correct server. Redis-based" }
    ],
    apiDesign: [
      { method: "WebSocket", endpoint: "/ws/chat", description: "Persistent bidirectional connection. Supports: send_message, ack, typing_indicator, presence" },
      { method: "POST", endpoint: "/api/v1/messages", description: "Send message (fallback for WebSocket unavailability). Body: { conversationId, content, mediaId? }" },
      { method: "GET", endpoint: "/api/v1/conversations/{id}/messages?before={cursor}", description: "Fetch message history (paginated, for sync)" },
      { method: "POST", endpoint: "/api/v1/groups", description: "Create group chat. Body: { name, memberIds }" },
      { method: "GET", endpoint: "/api/v1/conversations", description: "List all conversations for current user with last message preview" },
      { method: "POST", endpoint: "/api/v1/media/upload", description: "Upload media file. Returns mediaId for attachment" }
    ],
    detailedDesign: `**Message Flow (1-on-1):**
1. User A sends message via WebSocket to their connected gateway server
2. Gateway server publishes message to Chat Service
3. Chat Service:
   a. Generate unique messageId (Snowflake) + timestamp
   b. Store message in Message Store (Cassandra, partitioned by conversationId)
   c. Look up User B's connection in Session Registry (Redis)
   d. If B is online: route message to B's WebSocket gateway → deliver to B
   e. If B is offline: queue message + trigger push notification
4. User B receives message → sends ACK → Chat Service marks as 'delivered'
5. User B reads message → sends read receipt → delivered to User A

**Message ordering:** Messages within a conversation are ordered by server-assigned timestamp. Snowflake IDs ensure time-sortable unique IDs. Client-side display sorts by this timestamp.

**Group messaging:**
- Small groups (<100): fan-out to each member individually through the same message routing
- Large groups: message stored once with groupId, members fetch on read (pull model)
- Group membership stored in MySQL/PostgreSQL (transactional updates)

**Presence (Online/Offline):**
- Client sends heartbeat every 30s via WebSocket
- Presence Service stores {userId: lastSeen} in Redis with 60s TTL
- If TTL expires → user marked offline
- Presence updates published to friends/contacts via pub/sub (only to online users who care)

**Message Store (Cassandra):**
- Partition key: conversationId
- Clustering key: messageId (time-sorted)
- Efficient range queries: "get last 50 messages in conversation X"
- Data model: (conversationId, messageId, senderId, content, mediaUrl, type, createdAt)

**Delivery guarantees:**
- At-least-once: messages stored in DB before delivery attempt. If delivery fails, retry from DB.
- Client-side deduplication using messageId (idempotent display)
- ACK system: client ACKs each message. Unacked messages retried on reconnection.

**End-to-end encryption (E2EE):**
- Signal Protocol (used by WhatsApp)
- Public/private key pairs per device
- Server sees only encrypted blobs — cannot read content
- Key exchange via prekeys stored on server`,
    scalingDiscussion: [
      "**WebSocket server fleet**: 3000+ servers, each handling 50K connections. Stateful — need session registry to route messages to correct server.",
      "**Session Registry (Redis Cluster)**: Maps userId → serverId. Updated on connect/disconnect. Critical for message routing.",
      "**Cassandra for messages**: Sharded by conversationId. Each partition = one conversation's messages. Handles massive write throughput.",
      "**Multi-device sync**: Each device maintains a cursor (last received messageId). On reconnect, fetch messages since cursor.",
      "**Media optimization**: Thumbnails generated on upload. Videos transcoded. CDN for delivery. Presigned URLs for direct S3 upload.",
      "**Geographic distribution**: WebSocket gateways in multiple regions. Messages routed cross-region when sender and receiver are in different regions.",
      "**Connection management**: Graceful reconnection with exponential backoff. Client maintains local message queue for offline sends."
    ],
    followUpQuestions: [
      "How would you handle a user with 100 devices (phone, tablet, web, etc.)?",
      "How would you implement message search across all conversations?",
      "How would you handle message encryption key management?",
      "How would you implement disappearing messages?",
      "How would you handle group admin operations (add/remove members, permissions)?"
    ],
    commonMistakes: [
      "Using HTTP polling instead of WebSockets — wastes bandwidth and adds latency",
      "Not having a session registry — can't route messages to the right WebSocket server",
      "Storing messages in a relational DB without sharding — won't scale to 50B messages/day",
      "Not handling offline delivery — messages lost when users are disconnected",
      "Ignoring message ordering — concurrent messages can arrive out of order without proper sequencing",
      "Not implementing delivery ACKs — no way to know if message was actually received"
    ]
  },

  // ========================================
  // 4. VIDEO PLATFORM (YouTube)
  // ========================================
  {
    id: "video-platform",
    name: "Video Streaming Platform (YouTube)",
    emoji: "📺",
    difficulty: "Hard",
    estimatedMinutes: 45,
    requirements: {
      functional: [
        "Upload videos (up to 1GB+)",
        "Stream/watch videos with adaptive quality",
        "Search videos by title, description, tags",
        "Like, comment, subscribe to channels",
        "Video recommendations",
        "View count and analytics"
      ],
      nonFunctional: [
        "Smooth streaming with minimal buffering (<2s start time)",
        "Support 2B total users, 800M DAU",
        "Handle 500 hours of video uploaded per minute",
        "Global low-latency video delivery via CDN",
        "High availability: 99.99%"
      ]
    },
    capacityEstimation: [
      { metric: "Video uploads/day", calculation: "500 hours/min × 60 × 24", result: "720,000 hours/day" },
      { metric: "Storage/day (raw)", calculation: "720K hours × avg 1GB/hour", result: "~720 TB/day raw" },
      { metric: "Storage with transcoding", calculation: "720TB × 3 (multiple resolutions) + thumbnails", result: "~2 PB/day" },
      { metric: "Video views/sec", calculation: "800M DAU × 5 videos/day / 86400", result: "~46,000 views/sec" },
      { metric: "Bandwidth (streaming)", calculation: "46K concurrent × 5 Mbps avg bitrate", result: "~230 Gbps egress" },
      { metric: "Metadata storage per video", calculation: "Title + desc + tags + stats ≈ 5KB", result: "~5 KB/video" }
    ],
    highLevelComponents: [
      { name: "Upload Service", purpose: "Handle video file uploads. Chunked upload for large files. Store raw video in object storage" },
      { name: "Transcoding Pipeline", purpose: "Convert uploaded videos to multiple formats/resolutions (360p, 720p, 1080p, 4K). Generate adaptive bitrate manifests (HLS/DASH)" },
      { name: "Video Storage (Object Store)", purpose: "Store transcoded video segments in S3/GCS. Organized by videoId/resolution/segment" },
      { name: "CDN", purpose: "Cache and serve video content from edge locations worldwide. Most views served from CDN cache" },
      { name: "Metadata Service", purpose: "Store video metadata (title, description, tags, stats). MySQL/PostgreSQL sharded by videoId" },
      { name: "Search Service", purpose: "Full-text search on video metadata. Elasticsearch index" },
      { name: "Recommendation Service", purpose: "ML-based video recommendations using viewing history, collaborative filtering" },
      { name: "Streaming Service", purpose: "Serve video manifests and handle adaptive bitrate switching" }
    ],
    apiDesign: [
      { method: "POST", endpoint: "/api/v1/videos/upload-url", description: "Get presigned URL for direct-to-S3 upload. Returns { uploadUrl, videoId }" },
      { method: "PUT", endpoint: "/api/v1/videos/{videoId}/metadata", description: "Set video title, description, tags, thumbnail" },
      { method: "GET", endpoint: "/api/v1/videos/{videoId}", description: "Get video metadata + streaming manifest URL" },
      { method: "GET", endpoint: "/api/v1/videos/{videoId}/stream/{resolution}/manifest.m3u8", description: "HLS manifest for adaptive streaming" },
      { method: "GET", endpoint: "/api/v1/search?q={query}&cursor={cursor}", description: "Search videos" },
      { method: "GET", endpoint: "/api/v1/feed/recommendations", description: "Get personalized video recommendations" }
    ],
    detailedDesign: `**Upload Flow:**
1. Client requests upload URL → Upload Service returns presigned S3 URL
2. Client uploads video directly to S3 (bypasses application servers)
3. S3 triggers event → message published to transcoding queue (Kafka/SQS)
4. Transcoding workers pull from queue and process:
   - Extract video metadata (duration, codec, resolution)
   - Transcode to multiple resolutions: 360p, 480p, 720p, 1080p, 4K
   - Generate HLS/DASH segments (10-second chunks)
   - Create adaptive bitrate manifest file
   - Generate thumbnails at key intervals
5. Store all outputs back to S3, organized by videoId
6. Update metadata DB: mark video as 'ready', store manifest URLs
7. Push video data to CDN for pre-warming popular regions

**Streaming (Adaptive Bitrate):**
- HLS (HTTP Live Streaming): video split into small segments (~10s each)
- Manifest file (.m3u8) lists available quality levels and segment URLs
- Player monitors bandwidth and switches quality seamlessly
- Each segment request goes to CDN → if cache miss, pulls from origin (S3)

**CDN Strategy:**
- Push popular/new videos to edge locations proactively
- Long-tail content served on-demand (CDN pulls from origin on first request)
- Multi-CDN: use multiple CDN providers for redundancy and cost optimization

**View Counting:**
- Don't increment DB counter on every view (would crush DB at 46K QPS)
- Batch view events: collect in Kafka → aggregate in stream processor → batch update DB every few seconds
- Display approximate count (eventually consistent)

**Transcoding optimization:**
- Parallel processing: split video into segments, transcode in parallel across multiple workers
- Priority queue: popular creators get faster transcoding
- DAG-based pipeline: upload → validate → transcode → thumbnail → notify (managed by workflow engine like Temporal)`,
    scalingDiscussion: [
      "**CDN is king**: 90%+ of views served from CDN cache. Origin servers see minimal traffic for popular content.",
      "**Transcoding fleet**: Auto-scale transcoding workers based on queue depth. Use spot instances for cost savings (transcoding is fault-tolerant).",
      "**Object storage (S3)**: Virtually unlimited storage. Organize by videoId/resolution/segment for efficient retrieval.",
      "**Metadata sharding**: Shard video metadata by videoId. Denormalize creator info into video records to avoid joins.",
      "**Search index**: Elasticsearch cluster replicated across regions. Updated async from metadata changes via CDC.",
      "**Recommendations**: Pre-compute recommendations offline (batch ML). Store in Redis for fast serving. Update periodically.",
      "**Cost optimization**: Transcode only to resolutions that will actually be watched (don't 4K-transcode a 480p source). Delete rarely-watched transcoded versions."
    ],
    followUpQuestions: [
      "How would you implement live streaming in addition to on-demand?",
      "How would you handle copyright detection (Content ID)?",
      "How would you implement video chapters and timestamps?",
      "How would you optimize for mobile users on slow networks?",
      "How would you handle video content moderation at scale?"
    ],
    commonMistakes: [
      "Uploading videos through application servers — must use presigned URLs for direct upload to object storage",
      "Synchronous transcoding — transcoding can take minutes/hours, must be async with a queue",
      "Not using adaptive bitrate streaming — users on slow connections will buffer constantly",
      "Incrementing view count in real-time per request — use batched counting",
      "Ignoring CDN — streaming from origin servers won't scale and latency will be terrible",
      "Not considering the cost — video storage and bandwidth are the primary cost drivers"
    ]
  },

  // ========================================
  // 5. RIDE-SHARING (Uber/Lyft)
  // ========================================
  {
    id: "ride-sharing",
    name: "Ride-Sharing Service (Uber/Lyft)",
    emoji: "🚗",
    difficulty: "Hard",
    estimatedMinutes: 45,
    requirements: {
      functional: [
        "Riders can request a ride from location A to B",
        "System matches rider with nearby available driver",
        "Real-time driver location tracking",
        "ETA calculation for pickup and destination",
        "Fare estimation and payment processing",
        "Trip history for riders and drivers",
        "Rating system for both riders and drivers"
      ],
      nonFunctional: [
        "Low-latency matching (<30 seconds to find a driver)",
        "Real-time location updates (every 3-5 seconds from drivers)",
        "Support 20M daily rides, 5M concurrent drivers",
        "High availability in all operating cities",
        "Accurate ETA calculations"
      ]
    },
    capacityEstimation: [
      { metric: "Ride requests/sec", calculation: "20M / 86400", result: "~230 requests/sec (peak: ~700)" },
      { metric: "Location updates/sec", calculation: "5M drivers × 1 update/4sec", result: "~1.25M updates/sec" },
      { metric: "Location update storage", calculation: "1.25M/sec × (16B lat/lng + 16B metadata)", result: "~40 MB/sec raw location data" },
      { metric: "Active drivers in memory", calculation: "5M × 50 bytes (id, lat, lng, status)", result: "~250 MB (fits in memory)" },
      { metric: "Trip records/day", calculation: "20M × 1KB per trip", result: "~20 GB/day" }
    ],
    highLevelComponents: [
      { name: "Ride Matching Service", purpose: "Match rider requests with nearby available drivers using geospatial index. Core algorithm." },
      { name: "Location Service", purpose: "Ingest real-time driver locations. Update geospatial index. Extremely high write throughput." },
      { name: "Trip Service", purpose: "Manage trip lifecycle: requested → matched → en route → in progress → completed" },
      { name: "ETA Service", purpose: "Calculate estimated time of arrival using road graph, real-time traffic data, and ML models" },
      { name: "Pricing Service", purpose: "Calculate fare based on distance, time, surge multiplier. Dynamic/surge pricing during high demand" },
      { name: "Payment Service", purpose: "Process payments, manage wallets, handle driver payouts" },
      { name: "Notification Service", purpose: "Push notifications for ride matching, driver arrival, trip updates" },
      { name: "Map/Routing Service", purpose: "Route calculation between points using road network graph" }
    ],
    apiDesign: [
      { method: "POST", endpoint: "/api/v1/rides/request", description: "Request a ride. Body: { pickupLat, pickupLng, destLat, destLng, rideType }. Returns { rideId, estimatedFare, eta }" },
      { method: "POST", endpoint: "/api/v1/drivers/location", description: "Driver location update. Body: { lat, lng, heading, speed }. Called every 3-5 seconds" },
      { method: "POST", endpoint: "/api/v1/rides/{rideId}/accept", description: "Driver accepts a ride request" },
      { method: "GET", endpoint: "/api/v1/rides/{rideId}/status", description: "Get current ride status, driver location, ETA" },
      { method: "POST", endpoint: "/api/v1/rides/{rideId}/complete", description: "Complete trip. Triggers fare calculation and payment" },
      { method: "GET", endpoint: "/api/v1/rides/estimate?pickup={}&dest={}", description: "Get fare estimate before requesting" }
    ],
    detailedDesign: `**Driver Location Tracking:**
- Drivers send GPS coordinates every 3-5 seconds via WebSocket or lightweight HTTP
- Location Service updates an in-memory geospatial index
- **Geospatial Index Options:**
  - **Geohash**: Convert (lat, lng) → string. Nearby locations share prefixes. Store in Redis sorted set by geohash prefix.
  - **Quadtree**: Recursively divide map into quadrants. Leaf nodes contain drivers. Dynamic splitting based on density.
  - **Google S2 Geometry**: Hierarchical decomposition of the sphere. Used by Uber. Covers regions with cells at different levels.

**Ride Matching Algorithm:**
1. Rider requests ride → system queries geospatial index for available drivers within radius (e.g., 5 km)
2. Filter: only available drivers, matching ride type (UberX, Black, etc.)
3. Rank by: distance, ETA to pickup, driver rating, acceptance rate
4. Send request to top-ranked driver → driver has 15 seconds to accept
5. If declined/timeout → try next driver
6. If no drivers in radius → expand radius, or notify rider of high wait time

**Trip State Machine:**
REQUESTED → MATCHING → DRIVER_ASSIGNED → DRIVER_EN_ROUTE → ARRIVED → IN_PROGRESS → COMPLETED / CANCELLED

**Surge Pricing:**
- Divide city into hexagonal cells (H3 grid)
- Monitor supply (available drivers) and demand (ride requests) per cell
- When demand/supply ratio exceeds threshold → apply surge multiplier
- Multiplier shown to rider before confirmation

**ETA Calculation:**
- Road network as weighted graph (edges = road segments, weights = travel time)
- Dijkstra's / A* for shortest path
- Real-time traffic data adjusts edge weights
- ML model trained on historical trip data for more accurate predictions
- Precomputed for common routes during rush hours

**Payment Flow:**
- Fare = base + (rate per mile × distance) + (rate per minute × time) × surge
- Payment authorized (hold) at trip start, captured at trip end
- Support multiple payment methods, promo codes, split fare`,
    scalingDiscussion: [
      "**Location ingestion**: 1.25M updates/sec is massive. Use Kafka to buffer, with consumers updating the geospatial index in memory.",
      "**Geospatial index per city/region**: Shard by geography. Each city/region has its own matching service instance. No cross-region queries needed.",
      "**Cell-based architecture (Uber)**: Divide world into cells. Each cell managed by a service instance. Drivers and riders mapped to cells by location.",
      "**Stateful matching**: Keep driver availability state in memory (Redis + local). Trade consistency for speed — occasional double-dispatch resolved by first-accept-wins.",
      "**Multi-region**: Each city operates somewhat independently. Global services (user profiles, payment) replicated across regions.",
      "**Real-time analytics**: Stream location data to analytics pipeline for demand prediction, surge pricing, and fleet optimization.",
      "**Handling failures**: If matching service fails, requests re-queued. Driver locations have TTL — stale locations automatically expire."
    ],
    followUpQuestions: [
      "How would you handle surge pricing fairly?",
      "How would you implement ride pooling (shared rides)?",
      "How would you handle driver fraud (fake GPS locations)?",
      "How would you predict demand and pre-position drivers?",
      "How would you handle trip safety features (emergency button, trip sharing)?"
    ],
    commonMistakes: [
      "Using a relational database for real-time location lookups — too slow at 1M+ updates/sec",
      "Not using a geospatial index — scanning all drivers for proximity is O(N) and too slow",
      "Synchronous matching — matching must be fast; use in-memory data structures",
      "Ignoring the driver response time — must handle accept/decline/timeout gracefully",
      "Not sharding by geography — a global index doesn't make sense; rides are inherently local",
      "Forgetting about network/GPS inaccuracy — locations can be imprecise, need tolerance"
    ]
  },

  // ========================================
  // 6. NOTIFICATION SYSTEM
  // ========================================
  {
    id: "notification-system",
    name: "Notification System",
    emoji: "🔔",
    difficulty: "Medium",
    estimatedMinutes: 35,
    requirements: {
      functional: [
        "Support multiple channels: push notification (iOS/Android), SMS, email",
        "Support various trigger types: transactional, marketing, system alerts",
        "User notification preferences (opt-in/out per channel and type)",
        "Template-based notifications with variable substitution",
        "Notification history and read/unread status",
        "Rate limiting per user to prevent notification fatigue"
      ],
      nonFunctional: [
        "Soft real-time delivery (<30 seconds for urgent, minutes OK for marketing)",
        "At-least-once delivery guarantee",
        "Support 500M users, 10B notifications/day",
        "High availability with graceful degradation",
        "Extensible: easy to add new notification channels"
      ]
    },
    capacityEstimation: [
      { metric: "Notifications/sec", calculation: "10B / 86400", result: "~115K notifications/sec" },
      { metric: "Peak notifications/sec", calculation: "3x average (marketing blasts)", result: "~350K/sec" },
      { metric: "Storage per notification", calculation: "Template ID + user ID + params + status ≈ 500B", result: "~500 bytes/notification" },
      { metric: "Storage/day", calculation: "10B × 500B", result: "~5 TB/day" },
      { metric: "Push notification throughput", calculation: "APNs: ~100K/sec per connection", result: "Need multiple connections and servers" }
    ],
    highLevelComponents: [
      { name: "Notification Service (API)", purpose: "Accept notification requests from internal services. Validate, enrich, and queue for processing" },
      { name: "Message Queue (Kafka)", purpose: "Buffer and distribute notification tasks. Separate topics per channel (push, SMS, email) and priority" },
      { name: "Worker Fleet", purpose: "Consume from queues and deliver via channel-specific providers (APNs, FCM, Twilio, SendGrid)" },
      { name: "Template Service", purpose: "Manage notification templates. Support variable substitution, localization, A/B testing" },
      { name: "User Preference Service", purpose: "Store per-user notification preferences. Check before sending. Redis-cached." },
      { name: "Rate Limiter", purpose: "Prevent notification fatigue. Limit per user per type per time window" },
      { name: "Analytics Service", purpose: "Track delivery, open rates, click-through. Feed back into optimization" },
      { name: "Notification Store", purpose: "Persist notification history for in-app notification center. Cassandra sharded by userId" }
    ],
    apiDesign: [
      { method: "POST", endpoint: "/api/v1/notifications/send", description: "Send notification. Body: { userId, templateId, params, channels[], priority }" },
      { method: "POST", endpoint: "/api/v1/notifications/batch", description: "Send to multiple users. Body: { userIds[], templateId, params, channels[] }" },
      { method: "GET", endpoint: "/api/v1/users/{userId}/notifications?cursor={cursor}", description: "Get notification history for user" },
      { method: "PUT", endpoint: "/api/v1/users/{userId}/preferences", description: "Update notification preferences" },
      { method: "POST", endpoint: "/api/v1/templates", description: "Create/update notification template" }
    ],
    detailedDesign: `**Notification Flow:**
1. Internal service calls Notification API: "Send password reset email to user X"
2. Notification Service:
   a. Validate request (user exists, template exists)
   b. Check user preferences — is email enabled for this notification type?
   c. Check rate limiter — hasn't exceeded limit?
   d. Render template with user-specific variables (name, link, etc.)
   e. Publish to appropriate Kafka topic (email-high-priority)
3. Email Worker consumes message:
   a. Call email provider (SendGrid/SES) API
   b. On success: update notification status to 'sent'
   c. On failure: retry with exponential backoff (up to 3 retries)
   d. On permanent failure: update status to 'failed', alert
4. Provider sends email → delivery webhook updates status to 'delivered'
5. User opens email → tracking pixel fires → status updated to 'read'

**Priority Queues:**
- High priority: password reset, OTP, payment confirmation → separate Kafka topic, more workers
- Medium priority: social notifications (likes, comments) → standard processing
- Low priority: marketing, weekly digests → can be delayed, processed during off-peak

**Template System:**
- Templates stored in DB with variable placeholders: "Hello {{userName}}, your order {{orderId}} is..."
- Support localization: template per locale
- A/B testing: multiple template variants, track which performs better

**Deduplication:**
- Idempotency key per notification request
- Workers check Redis before sending: "Did I already send notification X to user Y?"
- Prevents duplicate sends on retries

**Rate Limiting per User:**
- Sliding window counter in Redis: "user:123:push:count" with 1-hour TTL
- Limit: max 10 push notifications per hour per user
- Marketing notifications: max 3 per day

**Retry Strategy:**
- Exponential backoff: 1s, 2s, 4s, 8s...
- Dead letter queue (DLQ) for permanently failed notifications
- Separate retry topics in Kafka to not block main processing`,
    scalingDiscussion: [
      "**Kafka partitioning**: Partition by userId to maintain ordering per user. Separate topics per channel for independent scaling.",
      "**Worker auto-scaling**: Scale workers based on Kafka consumer lag. Marketing blasts can spike 10x — auto-scale accordingly.",
      "**Provider failover**: If SendGrid is down, failover to SES. If APNs is slow, increase connection pool. Multi-provider per channel.",
      "**Batch optimization**: For marketing sends to millions of users, use bulk APIs provided by email/push providers.",
      "**Regional delivery**: Send from servers closest to the user's region for lower latency with push notification providers.",
      "**Preference caching**: User preferences accessed on every notification. Cache in Redis with invalidation on update."
    ],
    followUpQuestions: [
      "How would you handle notification for a user with 100M followers (celebrity mention)?",
      "How would you implement scheduled notifications (send at 9 AM user's local time)?",
      "How would you handle notification grouping/bundling?",
      "How would you implement in-app real-time notifications (not just push)?",
      "How would you measure and optimize notification engagement?"
    ],
    commonMistakes: [
      "Sending notifications synchronously — must be async for reliability and performance",
      "Not checking user preferences — sending unwanted notifications causes unsubscribes",
      "No rate limiting — notification fatigue leads to users disabling all notifications",
      "Single notification provider — if provider goes down, all notifications fail",
      "Not handling retries properly — messages can be lost without retry mechanism",
      "Treating all notifications equally — urgent OTPs and marketing emails need different priorities"
    ]
  },

  // ========================================
  // 7. RATE LIMITER
  // ========================================
  {
    id: "rate-limiter",
    name: "Rate Limiter",
    emoji: "⏱️",
    difficulty: "Medium",
    estimatedMinutes: 30,
    requirements: {
      functional: [
        "Limit number of requests a client can make in a given time window",
        "Support different rate limits per API endpoint, user tier, and client",
        "Return appropriate headers (X-RateLimit-Remaining, X-RateLimit-Reset, Retry-After)",
        "Support distributed rate limiting across multiple servers",
        "Configurable rules without code deployment"
      ],
      nonFunctional: [
        "Minimal latency overhead (<1ms per request check)",
        "Highly available — if rate limiter fails, fail open (allow traffic)",
        "Accurate counting (minimal over-counting or under-counting)",
        "Support 1M+ requests/sec across the cluster",
        "Memory efficient"
      ]
    },
    capacityEstimation: [
      { metric: "Rate limit checks/sec", calculation: "1M+ requests/sec (each needs a check)", result: "~1M+ lookups/sec" },
      { metric: "Memory per rate limit rule", calculation: "Counter + timestamp per client per rule", result: "~100 bytes per active client" },
      { metric: "Total memory (10M active clients)", calculation: "10M × 100B", result: "~1 GB (fits in Redis)" },
      { metric: "Redis operations/sec", calculation: "1M checks/sec, each = 1-2 Redis commands", result: "~2M Redis ops/sec (need Redis cluster)" }
    ],
    highLevelComponents: [
      { name: "Rate Limiter Middleware", purpose: "Intercepts every request. Checks rate limit before forwarding to application. Minimal latency." },
      { name: "Redis Cluster", purpose: "Centralized counter storage. Shared across all API servers for distributed rate limiting" },
      { name: "Rules Engine", purpose: "Store and serve rate limit rules. Configurable per endpoint, user tier, client. Cached locally." },
      { name: "Configuration Store", purpose: "Store rate limit rules (DB or config service). Pushed to all nodes on change." }
    ],
    apiDesign: [
      { method: "Internal", endpoint: "checkRateLimit(clientId, endpoint)", description: "Returns: { allowed: boolean, remaining: number, resetAt: timestamp }" },
      { method: "Response Header", endpoint: "X-RateLimit-Limit", description: "Maximum requests allowed in window" },
      { method: "Response Header", endpoint: "X-RateLimit-Remaining", description: "Remaining requests in current window" },
      { method: "Response Header", endpoint: "Retry-After", description: "Seconds until the client can retry (on 429 response)" },
      { method: "PUT", endpoint: "/api/v1/rate-limits/rules", description: "Admin: create/update rate limit rules" }
    ],
    detailedDesign: `**Algorithm Options:**

**1. Token Bucket** ⭐ (Most common — used by AWS, Stripe)
- Bucket holds tokens (capacity = burst limit)
- Tokens added at fixed rate (e.g., 10/second)
- Each request consumes 1 token
- If bucket empty → reject (429)
- Allows bursts up to bucket capacity
- Implementation: store {tokens, lastRefillTime} in Redis. On each request, calculate tokens to add since last refill, subtract 1.

**2. Sliding Window Log**
- Store timestamp of each request in a sorted set
- On new request: remove timestamps older than window, count remaining
- If count >= limit → reject
- Most accurate but memory-intensive (stores every timestamp)

**3. Sliding Window Counter** (Good balance)
- Combine fixed window counts with weighted overlap
- Current window count + (previous window count × overlap percentage)
- Example: at 75% through current minute, estimate = current_count + prev_count × 0.25
- Memory efficient, reasonably accurate

**4. Fixed Window Counter** (Simplest)
- Counter per time window (e.g., per minute)
- Reset counter at window boundary
- Problem: burst at window boundary (2x limit in short period)

**5. Leaky Bucket**
- Requests enter a queue (bucket) processed at fixed rate
- If queue full → reject
- Produces very smooth output rate
- Less common for API rate limiting

**Redis Implementation (Token Bucket):**
\`\`\`
-- Lua script for atomic token bucket check
local key = KEYS[1]
local rate = tonumber(ARGV[1])      -- tokens per second
local capacity = tonumber(ARGV[2])  -- max bucket size
local now = tonumber(ARGV[3])       -- current timestamp
local requested = tonumber(ARGV[4]) -- tokens requested (usually 1)

local data = redis.call('HMGET', key, 'tokens', 'last_refill')
local tokens = tonumber(data[1]) or capacity
local last_refill = tonumber(data[2]) or now

-- Calculate tokens to add
local elapsed = now - last_refill
local new_tokens = math.min(capacity, tokens + elapsed * rate)

if new_tokens >= requested then
  new_tokens = new_tokens - requested
  redis.call('HMSET', key, 'tokens', new_tokens, 'last_refill', now)
  redis.call('EXPIRE', key, capacity / rate * 2)
  return {1, new_tokens}  -- allowed, remaining
else
  redis.call('HMSET', key, 'tokens', new_tokens, 'last_refill', now)
  return {0, new_tokens}  -- rejected, remaining
end
\`\`\`

**Distributed Considerations:**
- Use Redis Lua scripts for atomic check-and-update (no race conditions)
- If Redis is unavailable → fail open (allow requests) to maintain availability
- For extreme throughput: use local counters with periodic sync to Redis (slight inaccuracy)

**Rate Limit Rules Example:**
- Free tier: 100 requests/hour per API key
- Pro tier: 10,000 requests/hour per API key  
- Endpoint-specific: POST /api/upload → 10/minute per user
- Global: 1M requests/sec total across all clients (protect infrastructure)`,
    scalingDiscussion: [
      "**Redis Cluster**: Shard by clientId across Redis cluster nodes. Each client's counter on one shard.",
      "**Local + Global hybrid**: Keep fast local counters per API server (approximate), sync to Redis periodically. Handles Redis latency spikes.",
      "**Lua scripts**: Atomic check-and-decrement in Redis. No race conditions between concurrent requests.",
      "**Multi-tier rate limiting**: Per-user, per-IP, per-endpoint, and global limits. Check all — reject if any is exceeded.",
      "**Fail open**: If Redis is unreachable