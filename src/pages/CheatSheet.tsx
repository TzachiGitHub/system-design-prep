export default function CheatSheet() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">📝 Quick Reference Cheat Sheet</h1>
          <p className="text-slate-400 text-sm mt-1">Everything on one page — print this!</p>
        </div>
        <button
          onClick={() => window.print()}
          className="no-print px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white text-sm rounded-lg transition-colors"
        >
          🖨️ Print
        </button>
      </div>

      {/* Latency Numbers */}
      <Section title="⏱️ Latency Numbers Every Programmer Should Know">
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
          {[
            ['L1 cache reference', '0.5 ns'],
            ['Branch mispredict', '5 ns'],
            ['L2 cache reference', '7 ns'],
            ['Mutex lock/unlock', '25 ns'],
            ['Main memory reference', '100 ns'],
            ['SSD random read', '150 μs'],
            ['Read 1 MB from memory', '250 μs'],
            ['Round trip in datacenter', '500 μs'],
            ['Read 1 MB from SSD', '1 ms'],
            ['HDD seek', '10 ms'],
            ['Read 1 MB from HDD', '20 ms'],
            ['Send packet CA→NL→CA', '150 ms'],
          ].map(([op, time]) => (
            <div key={op} className="flex justify-between py-1 border-b border-navy-700/50">
              <span className="text-slate-300">{op}</span>
              <span className="text-accent-cyan font-mono">{time}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Powers of 2 */}
      <Section title="🔢 Powers of 2">
        <div className="grid grid-cols-3 gap-x-6 gap-y-1 text-sm">
          {[
            ['2^10', '1 KB', '1 Thousand'],
            ['2^20', '1 MB', '1 Million'],
            ['2^30', '1 GB', '1 Billion'],
            ['2^40', '1 TB', '1 Trillion'],
            ['2^50', '1 PB', '1 Quadrillion'],
          ].map(([power, size, approx]) => (
            <div key={power} className="contents">
              <span className="text-accent-purple font-mono py-1">{power}</span>
              <span className="text-slate-300 py-1">{size}</span>
              <span className="text-slate-500 py-1">{approx}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Estimation Shortcuts */}
      <Section title="🧮 Estimation Shortcuts">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          {[
            '1 day ≈ 100K seconds (86,400)',
            '1M req/day ≈ 12 QPS',
            '1B req/day ≈ 12K QPS',
            '1 char = 1 byte (ASCII), 2 bytes (Unicode)',
            'UUID = 128 bits = 16 bytes',
            'Timestamp = 8 bytes',
            'Image ≈ 200KB–1MB',
            'Video ≈ 50MB/min (compressed)',
            '80/20 rule: cache 20% for 80% traffic',
            'Replication factor: typically 3',
            'Peak = 2–5× average QPS',
            'Web server: ~1K–10K concurrent connections',
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2 p-2 rounded bg-navy-800/50">
              <span className="text-accent-green">▸</span>
              <span className="text-slate-300">{tip}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Architecture Decision Flowchart */}
      <Section title="🔀 Quick Decision Guide">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {[
            { q: 'Need ACID transactions?', a: 'SQL (PostgreSQL, MySQL)' },
            { q: 'High write throughput, flexible schema?', a: 'NoSQL (Cassandra, DynamoDB)' },
            { q: 'Complex relationships?', a: 'Graph DB (Neo4j) or SQL with joins' },
            { q: 'Full-text search?', a: 'Elasticsearch / Solr' },
            { q: 'Real-time messaging?', a: 'WebSocket + Message Queue (Kafka)' },
            { q: 'File/media storage?', a: 'Blob storage (S3) + CDN' },
            { q: 'Cache layer?', a: 'Redis (features) or Memcached (simple)' },
            { q: 'Async processing?', a: 'Message queue (Kafka/SQS/RabbitMQ)' },
            { q: 'Rate limiting?', a: 'Token bucket with Redis' },
            { q: 'Service communication?', a: 'REST (simple), gRPC (internal, fast), GraphQL (flexible client)' },
          ].map(({ q, a }, i) => (
            <div key={i} className="p-3 rounded-lg bg-navy-800/50 border border-navy-700">
              <div className="text-accent-orange text-xs font-medium mb-1">{q}</div>
              <div className="text-slate-300">→ {a}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Availability */}
      <Section title="📊 Availability Numbers">
        <div className="grid grid-cols-3 gap-2 text-sm">
          {[
            ['99%', '3.65 days/year', '2 nines'],
            ['99.9%', '8.77 hours/year', '3 nines'],
            ['99.99%', '52.6 min/year', '4 nines'],
            ['99.999%', '5.26 min/year', '5 nines'],
            ['99.9999%', '31.5 sec/year', '6 nines'],
          ].map(([pct, downtime, nines]) => (
            <div key={pct} className="contents">
              <span className="text-accent-cyan font-mono py-1">{pct}</span>
              <span className="text-slate-300 py-1">{downtime}</span>
              <span className="text-slate-500 py-1">{nines}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* RESHADED */}
      <Section title="📋 RESHADED Framework">
        <div className="flex flex-wrap gap-2">
          {[
            { l: 'R', n: 'Requirements', c: 'bg-accent-blue' },
            { l: 'E', n: 'Estimation', c: 'bg-accent-cyan' },
            { l: 'S', n: 'Storage', c: 'bg-accent-purple' },
            { l: 'H', n: 'High-Level', c: 'bg-accent-green' },
            { l: 'A', n: 'API', c: 'bg-accent-orange' },
            { l: 'D', n: 'Detailed', c: 'bg-accent-pink' },
            { l: 'E', n: 'Evaluation', c: 'bg-accent-red' },
            { l: 'D', n: 'Distinct', c: 'bg-accent-purple' },
          ].map((s, i) => (
            <div key={i} className={`${s.c} text-white px-3 py-1.5 rounded-lg text-sm font-medium`}>
              <span className="font-bold">{s.l}</span> — {s.n}
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-slate-card border border-navy-600 rounded-xl p-5">
      <h2 className="text-sm font-semibold text-white mb-4">{title}</h2>
      {children}
    </div>
  )
}
