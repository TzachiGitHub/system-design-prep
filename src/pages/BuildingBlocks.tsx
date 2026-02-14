import { useState } from 'react'

interface Block {
  name: string
  icon: string
  tagline: string
  color: string
  details: string
  keyPoints: string[]
  technologies: string[]
}

const blocks: Block[] = [
  { name: 'Load Balancers', icon: '⚖️', tagline: 'Distribute traffic across servers', color: 'border-accent-blue',
    details: 'Load balancers distribute incoming network traffic across multiple servers. L4 operates at transport layer (TCP/UDP), L7 at application layer (HTTP). Algorithms include Round Robin, Least Connections, IP Hash, and Weighted.',
    keyPoints: ['L4 vs L7 balancing', 'Health checks', 'Sticky sessions', 'Active-passive vs active-active', 'DNS-based vs hardware vs software'],
    technologies: ['Nginx', 'HAProxy', 'AWS ALB/NLB', 'Cloudflare'] },
  { name: 'Caches', icon: '⚡', tagline: 'Speed up reads with in-memory storage', color: 'border-accent-cyan',
    details: 'Caching stores frequently accessed data in fast storage. Write-through writes to cache and DB simultaneously. Write-back writes to cache first, DB later. Write-around writes to DB only, cache on read.',
    keyPoints: ['Write-through vs Write-back vs Write-around', 'Cache invalidation strategies', 'TTL expiration', 'Cache stampede prevention', 'LRU / LFU eviction'],
    technologies: ['Redis', 'Memcached', 'CDN edge cache', 'Browser cache'] },
  { name: 'Databases', icon: '🗄️', tagline: 'Persistent data storage and retrieval', color: 'border-accent-purple',
    details: 'SQL databases provide ACID transactions and structured schemas. NoSQL offers flexibility and horizontal scaling. Key decisions: sharding strategy, replication (leader-follower, multi-leader), partitioning (range, hash, list).',
    keyPoints: ['SQL vs NoSQL trade-offs', 'Sharding strategies (hash, range)', 'Replication (sync vs async)', 'Indexes (B-tree, LSM)', 'ACID vs BASE'],
    technologies: ['PostgreSQL', 'MySQL', 'MongoDB', 'Cassandra', 'DynamoDB'] },
  { name: 'Message Queues', icon: '📬', tagline: 'Async communication between services', color: 'border-accent-green',
    details: 'Message queues decouple producers and consumers, enabling async processing. Kafka excels at high-throughput event streaming with log-based storage. RabbitMQ is better for task queues with routing.',
    keyPoints: ['At-least-once vs exactly-once delivery', 'Ordering guarantees', 'Dead letter queues', 'Consumer groups', 'Backpressure handling'],
    technologies: ['Apache Kafka', 'RabbitMQ', 'AWS SQS/SNS', 'Redis Streams'] },
  { name: 'CDN', icon: '🌍', tagline: 'Geographically distributed content delivery', color: 'border-accent-orange',
    details: 'CDNs cache content at edge locations worldwide. Push CDN: origin pushes content to edges (good for static). Pull CDN: edges fetch on cache miss (good for dynamic). Key metric: cache hit ratio.',
    keyPoints: ['Push vs Pull CDN', 'Cache hit ratio', 'Origin shield', 'Edge computing', 'Cache invalidation / purge'],
    technologies: ['Cloudflare', 'AWS CloudFront', 'Akamai', 'Fastly'] },
  { name: 'DNS', icon: '🔗', tagline: 'Domain name resolution and routing', color: 'border-accent-pink',
    details: 'DNS translates domain names to IP addresses. Resolution: browser cache → OS cache → recursive resolver → root → TLD → authoritative. Used for load balancing (round-robin DNS), failover, and geographic routing.',
    keyPoints: ['Resolution hierarchy', 'Record types (A, AAAA, CNAME, MX)', 'TTL management', 'GeoDNS routing', 'DNS-based load balancing'],
    technologies: ['Route 53', 'Cloudflare DNS', 'Google Cloud DNS'] },
  { name: 'Proxies', icon: '🛡️', tagline: 'Forward and reverse proxy servers', color: 'border-accent-blue',
    details: 'Forward proxy: client-side, hides client identity (VPN, corporate proxy). Reverse proxy: server-side, hides backend servers (load balancing, SSL termination, caching). Most "proxies" in system design are reverse proxies.',
    keyPoints: ['Forward vs Reverse proxy', 'SSL termination', 'Request routing', 'Compression', 'Rate limiting at proxy level'],
    technologies: ['Nginx', 'Envoy', 'HAProxy', 'Traefik'] },
  { name: 'Consistent Hashing', icon: '🔄', tagline: 'Distribute data with minimal redistribution', color: 'border-accent-cyan',
    details: 'Maps both servers and keys to a hash ring. When a node is added/removed, only K/N keys need redistribution (vs all keys in simple hashing). Virtual nodes improve balance.',
    keyPoints: ['Hash ring concept', 'Virtual nodes for balance', 'K/N redistribution', 'Node addition/removal', 'Used in distributed caches & DBs'],
    technologies: ['DynamoDB', 'Cassandra', 'Memcached', 'Redis Cluster'] },
  { name: 'Rate Limiting', icon: '🚦', tagline: 'Control request rates to prevent abuse', color: 'border-accent-red',
    details: 'Rate limiting controls how many requests a client can make. Token Bucket: tokens added at fixed rate, consumed per request. Leaky Bucket: requests processed at fixed rate. Sliding Window: count requests in rolling window.',
    keyPoints: ['Token Bucket algorithm', 'Leaky Bucket algorithm', 'Sliding Window Counter', 'Fixed Window Counter', 'Distributed rate limiting with Redis'],
    technologies: ['Redis', 'Nginx rate limiting', 'AWS WAF', 'Kong'] },
  { name: 'Blob Storage', icon: '📦', tagline: 'Store unstructured binary data at scale', color: 'border-accent-green',
    details: 'Object storage for images, videos, files, backups. Flat namespace (no hierarchy). Accessed via HTTP. Highly durable (11 9s). Lifecycle policies for cost optimization (hot/warm/cold/archive).',
    keyPoints: ['Object vs Block vs File storage', 'Presigned URLs for direct upload', 'Lifecycle policies', 'Cross-region replication', 'Multipart upload for large files'],
    technologies: ['AWS S3', 'Google Cloud Storage', 'Azure Blob', 'MinIO'] },
  { name: 'Search', icon: '🔍', tagline: 'Full-text search and analytics', color: 'border-accent-purple',
    details: 'Inverted index maps terms to documents. Supports fuzzy matching, faceted search, relevance scoring. Elasticsearch is the dominant solution. Key: keep search index in sync with primary database.',
    keyPoints: ['Inverted index', 'Tokenization & analyzers', 'Relevance scoring (TF-IDF, BM25)', 'Index sync strategies', 'Sharding search indices'],
    technologies: ['Elasticsearch', 'Apache Solr', 'Meilisearch', 'Algolia'] },
  { name: 'Monitoring & Logging', icon: '📊', tagline: 'Observe system health and debug issues', color: 'border-accent-orange',
    details: 'Three pillars of observability: Metrics (numeric measurements), Logs (event records), Traces (request flow across services). Essential for debugging, alerting, and capacity planning.',
    keyPoints: ['Metrics, Logs, Traces', 'Distributed tracing (OpenTelemetry)', 'Alert thresholds', 'Log aggregation', 'SLO/SLI/SLA definitions'],
    technologies: ['Prometheus + Grafana', 'ELK Stack', 'Datadog', 'Jaeger'] },
]

export default function BuildingBlocks() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">🧱 Building Blocks</h1>
        <p className="text-slate-400 text-sm mt-1">12 core components every system design uses</p>
      </div>

      {selected === null ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {blocks.map((b, i) => (
            <button
              key={b.name}
              onClick={() => setSelected(i)}
              className={`text-left bg-slate-card border-l-4 ${b.color} border border-navy-600 rounded-xl p-5
                hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group`}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{b.icon}</span>
                <h3 className="font-semibold text-white group-hover:text-accent-cyan transition-colors">{b.name}</h3>
              </div>
              <p className="text-xs text-slate-400">{b.tagline}</p>
              <div className="flex flex-wrap gap-1 mt-3">
                {b.technologies.slice(0, 3).map(t => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-navy-700 text-slate-400">{t}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="animate-fade-in space-y-6">
          <button onClick={() => setSelected(null)} className="text-sm text-accent-blue hover:text-accent-cyan transition-colors">
            ← Back to all blocks
          </button>
          <div className="bg-slate-card border border-navy-600 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{blocks[selected].icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-white">{blocks[selected].name}</h2>
                <p className="text-slate-400 text-sm">{blocks[selected].tagline}</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">{blocks[selected].details}</p>

            <h3 className="text-sm font-semibold text-accent-cyan mb-3">🎯 Key Points to Remember</h3>
            <div className="space-y-2 mb-6">
              {blocks[selected].keyPoints.map((kp, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-navy-800/50 border border-navy-700">
                  <span className="text-accent-cyan font-bold text-sm mt-0.5">{i + 1}</span>
                  <span className="text-sm text-slate-300">{kp}</span>
                </div>
              ))}
            </div>

            <h3 className="text-sm font-semibold text-slate-300 mb-2">🛠️ Technologies</h3>
            <div className="flex flex-wrap gap-2">
              {blocks[selected].technologies.map(t => (
                <span key={t} className="text-xs px-3 py-1.5 rounded-lg bg-accent-purple/15 text-accent-purple border border-accent-purple/30">{t}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
