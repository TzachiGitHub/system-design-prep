import { useState } from 'react'
import TradeoffTable from '../components/TradeoffTable'
import DiagramBox, { Arrow } from '../components/DiagramBox'

interface Pattern {
  name: string
  icon: string
  tagline: string
  color: string
  when: string[]
  whenNot: string[]
  examples: string[]
  buzzwords: string[]
  pros: string[]
  cons: string[]
}

const patterns: Pattern[] = [
  { name: 'Monolithic', icon: '🏛️', tagline: 'Single deployable unit', color: 'blue',
    when: ['Small team', 'MVP / early stage', 'Simple domain'], whenNot: ['Large team', 'Need independent scaling', 'Complex domains'],
    examples: ['Early Shopify', 'Basecamp', 'Small SaaS apps'], buzzwords: ['Single deploy', 'Shared DB', 'Tight coupling'],
    pros: ['Simple deployment', 'Easy debugging', 'Low latency (in-process)'], cons: ['Hard to scale independently', 'Tech stack lock-in', 'Long build times'] },
  { name: 'Microservices', icon: '🔬', tagline: 'Independent services per domain', color: 'cyan',
    when: ['Large teams', 'Independent scaling needed', 'Complex domain'], whenNot: ['Small team', 'Simple app', 'No DevOps maturity'],
    examples: ['Netflix', 'Uber', 'Amazon'], buzzwords: ['Service boundary', 'API contract', 'Independent deployment', 'Domain-driven'],
    pros: ['Independent scaling', 'Tech flexibility', 'Team autonomy'], cons: ['Network complexity', 'Data consistency', 'Operational overhead'] },
  { name: 'Event-Driven (Pub/Sub)', icon: '📡', tagline: 'Async communication via events', color: 'green',
    when: ['Decoupled services', 'Real-time processing', 'Event logging'], whenNot: ['Simple CRUD', 'Need strong consistency', 'Low complexity'],
    examples: ['Uber surge pricing', 'Stock trading', 'IoT systems'], buzzwords: ['Publisher', 'Subscriber', 'Event bus', 'Async', 'Decoupling'],
    pros: ['Loose coupling', 'Scalable', 'Real-time'], cons: ['Eventual consistency', 'Hard to debug', 'Message ordering'] },
  { name: 'CQRS', icon: '📖', tagline: 'Separate read and write models', color: 'purple',
    when: ['Read-heavy workloads', 'Complex queries', 'Different read/write models'], whenNot: ['Simple CRUD', 'Small scale', 'Tight deadlines'],
    examples: ['E-commerce catalogs', 'Reporting systems', 'Social feeds'], buzzwords: ['Command', 'Query', 'Read model', 'Write model', 'Projection'],
    pros: ['Optimized reads', 'Scalable independently', 'Flexibility'], cons: ['Complexity', 'Eventual consistency', 'More infrastructure'] },
  { name: 'Event Sourcing', icon: '📜', tagline: 'Store all state changes as events', color: 'orange',
    when: ['Audit trail needed', 'Complex domain logic', 'Time-travel debugging'], whenNot: ['Simple data', 'No audit needs', 'Team unfamiliar'],
    examples: ['Banking systems', 'Git', 'Event stores'], buzzwords: ['Event store', 'Replay', 'Aggregate', 'Projection', 'Snapshot'],
    pros: ['Complete audit trail', 'Time travel', 'Event replay'], cons: ['Storage growth', 'Complexity', 'Eventual consistency'] },
  { name: 'Serverless / FaaS', icon: '☁️', tagline: 'Function-level deployment, pay per use', color: 'pink',
    when: ['Sporadic traffic', 'Event-driven tasks', 'Quick prototyping'], whenNot: ['Long-running processes', 'Low latency needs', 'Complex state'],
    examples: ['AWS Lambda', 'Cloudflare Workers', 'Vercel Functions'], buzzwords: ['Cold start', 'Stateless', 'Pay-per-invocation', 'Auto-scaling'],
    pros: ['No server management', 'Auto-scaling', 'Cost-efficient for low traffic'], cons: ['Cold starts', 'Vendor lock-in', 'Execution time limits'] },
  { name: 'Layered (N-Tier)', icon: '🎂', tagline: 'Presentation → Business → Data layers', color: 'blue',
    when: ['Traditional web apps', 'Clear separation needed', 'Established teams'], whenNot: ['Microservices needed', 'Real-time systems', 'Event-driven'],
    examples: ['Enterprise Java apps', 'ASP.NET MVC', 'Django apps'], buzzwords: ['Presentation layer', 'Business logic', 'Data access', 'Separation of concerns'],
    pros: ['Clear structure', 'Easy to understand', 'Testable layers'], cons: ['Can become monolithic', 'Layer overhead', 'Tight vertical coupling'] },
  { name: 'Hexagonal', icon: '⬡', tagline: 'Ports & Adapters — domain at center', color: 'cyan',
    when: ['Complex domain logic', 'Multiple integrations', 'Testability priority'], whenNot: ['Simple CRUD', 'Rapid prototyping', 'Small apps'],
    examples: ['Banking systems', 'Trading platforms', 'Enterprise apps'], buzzwords: ['Port', 'Adapter', 'Domain core', 'Inversion of control'],
    pros: ['Highly testable', 'Decoupled from infra', 'Clean domain'], cons: ['Over-engineering for simple apps', 'Learning curve', 'More boilerplate'] },
  { name: 'Service Mesh', icon: '🕸️', tagline: 'Infrastructure layer for service-to-service', color: 'purple',
    when: ['Many microservices', 'Need observability', 'mTLS requirement'], whenNot: ['Few services', 'Simple architecture', 'No K8s'],
    examples: ['Istio', 'Linkerd', 'Consul Connect'], buzzwords: ['Sidecar proxy', 'mTLS', 'Traffic management', 'Observability'],
    pros: ['Transparent security', 'Traffic control', 'Observability'], cons: ['Complexity', 'Resource overhead', 'Debugging difficulty'] },
  { name: 'Saga Pattern', icon: '📚', tagline: 'Distributed transactions via compensations', color: 'green',
    when: ['Cross-service transactions', 'Eventual consistency OK', 'Microservices'], whenNot: ['Single DB', 'Need ACID', 'Simple workflows'],
    examples: ['E-commerce checkout', 'Travel booking', 'Order processing'], buzzwords: ['Choreography', 'Orchestration', 'Compensating transaction', 'Rollback'],
    pros: ['No distributed locks', 'Scalable', 'Resilient'], cons: ['Complex error handling', 'Eventual consistency', 'Hard to debug'] },
  { name: 'API Gateway', icon: '🚪', tagline: 'Single entry point for all clients', color: 'orange',
    when: ['Multiple microservices', 'Different client types', 'Cross-cutting concerns'], whenNot: ['Single service', 'Internal only', 'Simple API'],
    examples: ['Kong', 'AWS API Gateway', 'Netflix Zuul'], buzzwords: ['Rate limiting', 'Auth', 'Request routing', 'Response aggregation'],
    pros: ['Single entry point', 'Cross-cutting concerns', 'Client simplification'], cons: ['Single point of failure', 'Latency', 'Complexity'] },
  { name: 'Strangler Fig', icon: '🌿', tagline: 'Gradually replace legacy system', color: 'green',
    when: ['Legacy migration', 'Risk-averse', 'Incremental modernization'], whenNot: ['Greenfield projects', 'Simple systems', 'Full rewrite OK'],
    examples: ['Shopify Rails migration', 'Amazon monolith breakup'], buzzwords: ['Facade', 'Incremental migration', 'Feature toggle', 'Routing'],
    pros: ['Low risk', 'Incremental', 'No big bang'], cons: ['Dual maintenance', 'Routing complexity', 'Slow process'] },
  { name: 'Circuit Breaker', icon: '⚡', tagline: 'Fail fast when service is unhealthy', color: 'red',
    when: ['External dependencies', 'Cascading failure risk', 'Microservices'], whenNot: ['Single service', 'No external deps', 'Batch jobs'],
    examples: ['Netflix Hystrix', 'Resilience4j', 'Polly (.NET)'], buzzwords: ['Open/Closed/Half-Open', 'Fallback', 'Threshold', 'Timeout'],
    pros: ['Prevents cascading failures', 'Fast failure', 'Self-healing'], cons: ['Added complexity', 'Tuning thresholds', 'May hide issues'] },
  { name: 'Sidecar', icon: '🏍️', tagline: 'Helper process alongside main service', color: 'pink',
    when: ['Cross-cutting concerns', 'Polyglot services', 'Service mesh'], whenNot: ['Simple deployments', 'Single language', 'Resource constrained'],
    examples: ['Envoy proxy', 'Fluentd logging', 'Consul agent'], buzzwords: ['Co-located', 'Proxy', 'Agent', 'Lifecycle coupled'],
    pros: ['Language agnostic', 'Separation of concerns', 'Reusable'], cons: ['Resource overhead', 'Latency', 'Deployment complexity'] },
  { name: 'Data Mesh', icon: '🗺️', tagline: 'Domain-oriented decentralized data', color: 'purple',
    when: ['Large orgs', 'Multiple data domains', 'Data democratization'], whenNot: ['Small teams', 'Single domain', 'Centralized analytics OK'],
    examples: ['Zalando', 'Netflix', 'ThoughtWorks clients'], buzzwords: ['Data product', 'Domain ownership', 'Self-serve platform', 'Federated governance'],
    pros: ['Domain ownership', 'Scalable', 'Autonomous teams'], cons: ['Governance challenge', 'Duplication risk', 'Tooling investment'] },
]

export default function Patterns() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">🧩 Architecture Patterns</h1>
        <p className="text-slate-400 text-sm mt-1">15 patterns you need to know for your interview</p>
      </div>

      {selected === null ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patterns.map((p, i) => (
            <button
              key={p.name}
              onClick={() => setSelected(i)}
              className="text-left bg-slate-card border border-navy-600 rounded-xl p-5
                hover:border-accent-blue/50 hover:shadow-lg hover:shadow-accent-blue/5
                transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{p.icon}</span>
                <h3 className="font-semibold text-white group-hover:text-accent-blue transition-colors">{p.name}</h3>
              </div>
              <p className="text-xs text-slate-400">{p.tagline}</p>
              <div className="flex flex-wrap gap-1 mt-3">
                {p.buzzwords.slice(0, 3).map(b => (
                  <span key={b} className="text-[10px] px-2 py-0.5 rounded-full bg-navy-700 text-slate-400">{b}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="animate-fade-in space-y-6">
          <button
            onClick={() => setSelected(null)}
            className="text-sm text-accent-blue hover:text-accent-cyan transition-colors"
          >
            ← Back to all patterns
          </button>

          <div className="bg-slate-card border border-navy-600 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{patterns[selected].icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-white">{patterns[selected].name}</h2>
                <p className="text-slate-400 text-sm">{patterns[selected].tagline}</p>
              </div>
            </div>

            {/* Simple Diagram */}
            <div className="flex items-center justify-center gap-2 flex-wrap my-6 p-6 bg-navy-800/50 rounded-lg border border-navy-700">
              <DiagramBox label="Client" icon="👤" color="blue" />
              <Arrow direction="right" />
              <DiagramBox label={patterns[selected].name} icon={patterns[selected].icon} color={patterns[selected].color} />
              <Arrow direction="right" />
              <DiagramBox label="Data Store" icon="💾" color="green" />
            </div>

            {/* When to use */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-accent-green mb-2">✅ When to Use</h3>
                <ul className="space-y-1">
                  {patterns[selected].when.map(w => (
                    <li key={w} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-accent-green text-xs mt-1">●</span>{w}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-accent-red mb-2">❌ When NOT to Use</h3>
                <ul className="space-y-1">
                  {patterns[selected].whenNot.map(w => (
                    <li key={w} className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="text-accent-red text-xs mt-1">●</span>{w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Examples */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-300 mb-2">🏢 Real-World Examples</h3>
              <div className="flex flex-wrap gap-2">
                {patterns[selected].examples.map(e => (
                  <span key={e} className="text-xs px-3 py-1 rounded-full bg-accent-purple/15 text-accent-purple border border-accent-purple/30">{e}</span>
                ))}
              </div>
            </div>

            {/* Buzzwords */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-300 mb-2">🗣️ Interview Buzzwords</h3>
              <div className="flex flex-wrap gap-2">
                {patterns[selected].buzzwords.map(b => (
                  <span key={b} className="text-xs px-3 py-1 rounded-full bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30">{b}</span>
                ))}
              </div>
            </div>

            {/* Trade-offs */}
            <h3 className="text-sm font-semibold text-slate-300 mb-2">⚖️ Trade-offs</h3>
            <TradeoffTable pros={patterns[selected].pros} cons={patterns[selected].cons} />
          </div>
        </div>
      )}
    </div>
  )
}
