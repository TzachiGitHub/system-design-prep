import { useState } from 'react'

interface Concept {
  name: string
  icon: string
  category: string
  content: string
  keyPoints: string[]
}

const concepts: Concept[] = [
  { name: 'CAP Theorem', icon: '🔺', category: 'Fundamentals',
    content: 'In a distributed system, you can only guarantee 2 of 3: Consistency (every read gets the most recent write), Availability (every request gets a response), Partition Tolerance (system works despite network partitions). Since network partitions are inevitable, the real choice is between CP and AP.',
    keyPoints: ['CP: Choose consistency (banking, inventory) — e.g., MongoDB, HBase', 'AP: Choose availability (social media, caching) — e.g., Cassandra, DynamoDB', 'CA: Only possible without partitions (single-node RDBMS)', 'Network partitions ARE going to happen', 'PACELC extends CAP: if Partition → A vs C, Else → Latency vs Consistency'] },
  { name: 'ACID vs BASE', icon: '⚗️', category: 'Fundamentals',
    content: 'ACID: Atomicity, Consistency, Isolation, Durability — strong guarantees for transactions (SQL databases). BASE: Basically Available, Soft state, Eventually consistent — relaxed guarantees for scalability (NoSQL databases).',
    keyPoints: ['ACID: all-or-nothing transactions, strong consistency', 'BASE: prioritizes availability, allows temporary inconsistency', 'ACID = pessimistic, BASE = optimistic', 'Most real systems use a mix of both', 'Choose based on data criticality (money = ACID, likes = BASE)'] },
  { name: 'Consistency Models', icon: '🔄', category: 'Distributed Systems',
    content: 'Strong consistency: reads always return latest write. Eventual consistency: reads may return stale data, but will converge. Causal consistency: respects causal ordering of operations.',
    keyPoints: ['Strong: linearizable, highest latency cost', 'Eventual: highest availability, may serve stale data', 'Causal: preserves "happens-before" relationships', 'Read-your-writes: user sees own writes immediately', 'Quorum: W + R > N for strong consistency'] },
  { name: 'Availability Patterns', icon: '🛡️', category: 'Reliability',
    content: 'Active-Passive (failover): standby takes over on primary failure. Active-Active: multiple nodes serve traffic, any can handle requests. Replication: data copied across nodes.',
    keyPoints: ['Active-Passive: simpler, but standby wastes resources', 'Active-Active: better utilization, but data sync challenge', 'RPO: Recovery Point Objective (how much data loss is OK)', 'RTO: Recovery Time Objective (how long downtime is OK)', 'Multi-region for disaster recovery'] },
  { name: 'Scalability', icon: '📈', category: 'Fundamentals',
    content: 'Vertical scaling (scale up): bigger machine (more CPU, RAM). Horizontal scaling (scale out): more machines. Horizontal is preferred for large systems but adds complexity.',
    keyPoints: ['Vertical: simple but has hardware limits', 'Horizontal: unlimited but needs distributed system design', 'Stateless services scale horizontally easily', 'Stateful services need partitioning/sharding', 'Auto-scaling: add/remove instances based on metrics'] },
  { name: 'Latency vs Throughput', icon: '⏱️', category: 'Performance',
    content: 'Latency: time to complete one operation (ms). Throughput: operations completed per unit time (QPS/RPS). They\'re related but different — you can have high throughput with high latency (batching).',
    keyPoints: ['P50/P95/P99 latency percentiles matter more than average', 'Tail latency (P99) often caused by GC, retries, or hot spots', 'Throughput can increase by batching (higher latency)', 'Little\'s Law: L = λ × W (concurrent = rate × latency)', 'SLO usually defined on P99 latency'] },
  { name: 'SQL vs NoSQL', icon: '🗃️', category: 'Databases',
    content: 'SQL: structured data, complex queries, ACID transactions, vertical scaling. NoSQL: flexible schema, horizontal scaling, high throughput, eventual consistency.',
    keyPoints: ['SQL when: complex joins, transactions, structured data', 'NoSQL when: high scale, flexible schema, simple queries', 'Document DB (MongoDB): JSON-like, good for varied structure', 'Key-Value (Redis, DynamoDB): fastest, simple lookups', 'Wide-Column (Cassandra): time-series, high write throughput', 'Graph DB (Neo4j): relationships are first-class'] },
  { name: 'Sync vs Async', icon: '🔀', category: 'Communication',
    content: 'Synchronous: caller waits for response (HTTP request-response). Asynchronous: caller doesn\'t wait, uses callbacks/queues (message queues, events).',
    keyPoints: ['Sync: simpler, but creates coupling and blocks', 'Async: decoupled, resilient, but harder to debug', 'Use async for: long-running tasks, notifications, event processing', 'Use sync for: user-facing reads, authentication, simple CRUD', 'Patterns: request-reply, fire-and-forget, publish-subscribe'] },
  { name: 'Stateful vs Stateless', icon: '💾', category: 'Architecture',
    content: 'Stateless: server doesn\'t store session data between requests. State stored externally (DB, cache, client). Stateful: server maintains session state in memory.',
    keyPoints: ['Stateless services are easier to scale horizontally', 'Move state to external stores (Redis, DB)', 'JWT tokens: stateless authentication', 'Sticky sessions: workaround for stateful, but limits scaling', 'WebSockets are inherently stateful (need session affinity)'] },
  { name: 'Batch vs Stream', icon: '🌊', category: 'Processing',
    content: 'Batch processing: process accumulated data periodically (MapReduce, Spark). Stream processing: process data in real-time as it arrives (Kafka Streams, Flink).',
    keyPoints: ['Batch: high throughput, high latency (minutes to hours)', 'Stream: low latency, continuous processing', 'Lambda architecture: batch + stream layers', 'Kappa architecture: stream-only (treat batch as stream)', 'Use batch for: ETL, analytics, ML training', 'Use stream for: real-time dashboards, fraud detection, alerts'] },
  { name: 'Back-of-Envelope', icon: '🧮', category: 'Interview Skills',
    content: 'Quick estimation to determine feasibility and guide design decisions. Key numbers to memorize: QPS, storage, bandwidth, memory requirements.',
    keyPoints: ['1 day = 86,400s ≈ 100K seconds', '1M requests/day ≈ 12 QPS', '1B requests/day ≈ 12K QPS', 'Read:Write ratio often 10:1 to 100:1', 'SSD read: 100μs, HDD: 10ms, Network roundtrip: 0.5ms', '80/20 rule: cache top 20% for 80% of traffic'] },
]

const categories = [...new Set(concepts.map(c => c.category))]

export default function Concepts() {
  const [selected, setSelected] = useState<number | null>(null)
  const [filter, setFilter] = useState<string | null>(null)

  const filtered = filter ? concepts.filter(c => c.category === filter) : concepts

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">⚖️ Concepts & Trade-offs</h1>
        <p className="text-slate-400 text-sm mt-1">Core concepts and decision frameworks for system design</p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter(null)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors
            ${!filter ? 'bg-accent-blue/20 border-accent-blue text-accent-blue' : 'border-navy-600 text-slate-400 hover:border-accent-blue/50'}`}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors
              ${filter === cat ? 'bg-accent-blue/20 border-accent-blue text-accent-blue' : 'border-navy-600 text-slate-400 hover:border-accent-blue/50'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {selected === null ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((c, i) => {
            const realIdx = concepts.indexOf(c)
            return (
              <button
                key={c.name}
                onClick={() => setSelected(realIdx)}
                className="text-left bg-slate-card border border-navy-600 rounded-xl p-5
                  hover:border-accent-blue/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-accent-blue transition-colors">{c.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-navy-700 text-slate-500">{c.category}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{c.content}</p>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="animate-fade-in space-y-6">
          <button onClick={() => setSelected(null)} className="text-sm text-accent-blue hover:text-accent-cyan transition-colors">
            ← Back to all concepts
          </button>
          <div className="bg-slate-card border border-navy-600 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{concepts[selected].icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-white">{concepts[selected].name}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-navy-700 text-slate-400">{concepts[selected].category}</span>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">{concepts[selected].content}</p>

            {/* CAP Triangle visualization */}
            {concepts[selected].name === 'CAP Theorem' && (
              <div className="flex justify-center my-8">
                <div className="relative w-64 h-56">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg bg-accent-blue/20 border border-accent-blue text-accent-blue font-bold text-sm">
                    Consistency
                  </div>
                  <div className="absolute bottom-0 left-0 px-4 py-2 rounded-lg bg-accent-green/20 border border-accent-green text-accent-green font-bold text-sm">
                    Availability
                  </div>
                  <div className="absolute bottom-0 right-0 px-4 py-2 rounded-lg bg-accent-orange/20 border border-accent-orange text-accent-orange font-bold text-sm">
                    Partition Tolerance
                  </div>
                  {/* Lines */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 256 224">
                    <line x1="128" y1="30" x2="40" y2="190" stroke="#3b82f6" strokeWidth="1" opacity="0.3" />
                    <line x1="128" y1="30" x2="216" y2="190" stroke="#3b82f6" strokeWidth="1" opacity="0.3" />
                    <line x1="40" y1="190" x2="216" y2="190" stroke="#3b82f6" strokeWidth="1" opacity="0.3" />
                    <text x="60" y="120" fill="#94a3b8" fontSize="10">CP</text>
                    <text x="180" y="120" fill="#94a3b8" fontSize="10">CA</text>
                    <text x="120" y="210" fill="#94a3b8" fontSize="10">AP</text>
                  </svg>
                </div>
              </div>
            )}

            <h3 className="text-sm font-semibold text-accent-cyan mb-3">🎯 Key Points</h3>
            <div className="space-y-2">
              {concepts[selected].keyPoints.map((kp, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-navy-800/50 border border-navy-700">
                  <span className="text-accent-cyan flex-shrink-0">▸</span>
                  <span className="text-sm text-slate-300">{kp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
