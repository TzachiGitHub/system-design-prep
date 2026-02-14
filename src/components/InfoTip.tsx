import { useState } from 'react'

const glossary: Record<string, string> = {
  'CAP Theorem': 'States that a distributed system can only guarantee two of: Consistency, Availability, Partition tolerance.',
  'Sharding': 'Splitting a database into smaller pieces (shards) across multiple servers.',
  'Consistent Hashing': 'A technique to distribute data across nodes minimizing redistribution when nodes are added/removed.',
  'CQRS': 'Command Query Responsibility Segregation — separating read and write models.',
  'Event Sourcing': 'Storing all changes as a sequence of events rather than just current state.',
  'Circuit Breaker': 'A pattern that prevents cascading failures by failing fast when a service is unhealthy.',
  'Load Balancer': 'Distributes incoming traffic across multiple servers to ensure reliability and performance.',
  'CDN': 'Content Delivery Network — geographically distributed servers that cache content close to users.',
  'Replication': 'Copying data across multiple nodes for fault tolerance and read scalability.',
  'Partitioning': 'Dividing data across multiple databases/tables based on some key.',
}

interface Props {
  term: string
  children?: React.ReactNode
}

export default function InfoTip({ term, children }: Props) {
  const [show, setShow] = useState(false)
  const definition = glossary[term] || 'Technical term used in system design.'

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="border-b border-dashed border-accent-cyan text-accent-cyan cursor-help">
        {children || term}
      </span>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-lg
          bg-navy-700 border border-navy-600 text-sm text-slate-200 shadow-xl z-50 animate-fade-in">
          <span className="font-semibold text-accent-cyan">{term}</span>
          <br />
          <span className="text-slate-300 text-xs leading-relaxed">{definition}</span>
        </span>
      )}
    </span>
  )
}
