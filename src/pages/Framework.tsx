import { useState } from 'react'

const steps = [
  { letter: 'R', name: 'Requirements', time: '5 min', color: 'bg-accent-blue',
    description: 'Clarify functional and non-functional requirements. Ask questions!',
    tips: ['Who are the users? How many?', 'What are the core features? (MVP first)', 'Non-functional: latency, availability, consistency, scale', 'Read-heavy or write-heavy?', 'Any special constraints?'],
    mistakes: ['Jumping straight to design', 'Not asking clarifying questions', 'Trying to design everything at once'] },
  { letter: 'E', name: 'Estimation', time: '3 min', color: 'bg-accent-cyan',
    description: 'Back-of-envelope calculations for scale.',
    tips: ['DAU/MAU → QPS (read + write)', 'Storage per record × records/day × retention', 'Bandwidth = QPS × response size', 'Cache: 20% of daily data for 80% hit rate', 'Round numbers are fine — show the thought process'],
    mistakes: ['Spending too long on exact math', 'Forgetting to estimate peak vs average', 'Not considering growth'] },
  { letter: 'S', name: 'Storage', time: '3 min', color: 'bg-accent-purple',
    description: 'Choose data models and storage technologies.',
    tips: ['SQL vs NoSQL based on requirements', 'Define key entities and relationships', 'Consider read/write patterns for schema design', 'Blob storage for media', 'Cache layer for hot data'],
    mistakes: ['Choosing tech without justification', 'Over-normalizing when NoSQL is better', 'Forgetting about data retention and cleanup'] },
  { letter: 'H', name: 'High-Level Design', time: '10 min', color: 'bg-accent-green',
    description: 'Draw the architecture diagram with main components.',
    tips: ['Start with client → load balancer → service → database', 'Add caching, CDN, message queues as needed', 'Show data flow with arrows', 'Label everything clearly', 'Keep it simple — detail comes later'],
    mistakes: ['Too much detail too early', 'Missing obvious components (LB, cache)', 'Not showing data flow direction'] },
  { letter: 'A', name: 'API Design', time: '3 min', color: 'bg-accent-orange',
    description: 'Define the key API endpoints.',
    tips: ['RESTful: GET/POST/PUT/DELETE with resources', 'Include request/response schemas', 'Pagination for list endpoints', 'Authentication/authorization headers', 'Rate limiting headers'],
    mistakes: ['Designing too many endpoints', 'Forgetting pagination', 'Not mentioning authentication'] },
  { letter: 'D', name: 'Detailed Design', time: '12 min', color: 'bg-accent-pink',
    description: 'Deep dive into 2-3 critical components.',
    tips: ['Pick the most interesting/challenging components', 'Discuss algorithms and data structures', 'Walk through request lifecycle', 'Address edge cases', 'This is where you show depth'],
    mistakes: ['Trying to detail everything', 'Surface-level only', 'Not discussing trade-offs for each decision'] },
  { letter: 'E', name: 'Evaluation', time: '5 min', color: 'bg-accent-red',
    description: 'Discuss trade-offs, bottlenecks, and improvements.',
    tips: ['Identify single points of failure', 'Discuss bottlenecks and how to address them', 'Mention monitoring and alerting', 'Discuss what you\'d do differently with more time', 'Show awareness of operational concerns'],
    mistakes: ['Claiming your design is perfect', 'Not identifying obvious bottlenecks', 'Forgetting about failure scenarios'] },
  { letter: 'D', name: 'Distinct', time: '4 min', color: 'bg-accent-purple',
    description: 'Stand out with unique considerations and extensions.',
    tips: ['Security: authentication, encryption, rate limiting', 'Multi-region / disaster recovery', 'Cost optimization strategies', 'Analytics and ML opportunities', 'Future extensibility'],
    mistakes: ['Running out of time for this', 'Generic answers without specifics', 'Not tying back to original requirements'] },
]

const communicationTips = [
  'Think out loud — silence is your enemy',
  'Ask "Does this make sense?" periodically',
  'Use the whiteboard/drawing tool actively',
  'Say "Let me think about this for a moment" instead of going silent',
  'Acknowledge trade-offs: "We could do X, but the trade-off is Y"',
  'Be receptive to hints — the interviewer is trying to help',
  'Prioritize: "Given our time, let me focus on the most critical parts"',
]

export default function Framework() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">📋 RESHADED Framework</h1>
        <p className="text-slate-400 text-sm mt-1">Structure your 45-minute system design answer</p>
      </div>

      {/* Timeline */}
      <div className="bg-slate-card border border-navy-600 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-slate-300 mb-4">⏱️ Timeline (45 minutes)</h2>
        <div className="flex gap-1 mb-4 h-8 rounded-lg overflow-hidden">
          {steps.map((s, i) => {
            const minutes = parseInt(s.time)
            const widthPct = (minutes / 45) * 100
            return (
              <div
                key={i}
                className={`${s.color} flex items-center justify-center text-[10px] font-bold text-white cursor-pointer
                  hover:opacity-80 transition-opacity`}
                style={{ width: `${widthPct}%` }}
                onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                title={`${s.letter} - ${s.name} (${s.time})`}
              >
                {s.letter}
              </div>
            )
          })}
        </div>
        <div className="flex gap-1 text-[10px] text-slate-500">
          {steps.map((s, i) => {
            const minutes = parseInt(s.time)
            const widthPct = (minutes / 45) * 100
            return (
              <div key={i} style={{ width: `${widthPct}%` }} className="text-center truncate">{s.time}</div>
            )
          })}
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((s, i) => (
          <div key={i} className="bg-slate-card border border-navy-600 rounded-xl overflow-hidden">
            <button
              onClick={() => setExpandedStep(expandedStep === i ? null : i)}
              className="w-full flex items-center gap-4 p-4 hover:bg-navy-700/30 transition-colors"
            >
              <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                {s.letter}
              </div>
              <div className="text-left flex-1">
                <h3 className="font-semibold text-white">{s.name}</h3>
                <p className="text-xs text-slate-400">{s.description}</p>
              </div>
              <span className="text-xs text-slate-500 font-mono flex-shrink-0">{s.time}</span>
              <span className="text-slate-500">{expandedStep === i ? '▲' : '▼'}</span>
            </button>

            {expandedStep === i && (
              <div className="px-4 pb-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-xs font-semibold text-accent-green mb-2">✅ Tips</h4>
                    <ul className="space-y-1">
                      {s.tips.map((t, j) => (
                        <li key={j} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="text-accent-green mt-0.5">•</span>{t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-accent-red mb-2">❌ Common Mistakes</h4>
                    <ul className="space-y-1">
                      {s.mistakes.map((m, j) => (
                        <li key={j} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="text-accent-red mt-0.5">•</span>{m}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Communication Tips */}
      <div className="bg-slate-card border border-navy-600 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-white mb-4">🗣️ Communication Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {communicationTips.map((tip, i) => (
            <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-navy-800/50 border border-navy-700">
              <span className="text-accent-cyan flex-shrink-0 text-sm">💬</span>
              <span className="text-xs text-slate-300">{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Questions to Ask */}
      <div className="bg-slate-card border border-navy-600 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-white mb-4">❓ Questions to Ask the Interviewer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            'What is the expected scale? (users, QPS)',
            'Which features are most important? (MVP)',
            'Is this read-heavy or write-heavy?',
            'What consistency level is required?',
            'Are there latency requirements?',
            'Should we design for a specific region or global?',
            'Is there an existing system we\'re extending?',
            'What\'s the budget/cost consideration?',
          ].map((q, i) => (
            <div key={i} className="flex items-start gap-2 p-2 text-xs text-slate-300">
              <span className="text-accent-orange">▸</span>{q}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
