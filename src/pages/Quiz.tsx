import { useState, useCallback } from 'react'
import QuizCard from '../components/QuizCard'
import type { QuizQuestion } from '../components/QuizCard'

const allQuestions: QuizQuestion[] = [
  { question: 'Which database would you choose for a social media app with complex relationships?', options: ['Redis', 'Cassandra', 'Neo4j (Graph DB)', 'MongoDB'], correctIndex: 2, explanation: 'Graph databases like Neo4j excel at traversing complex relationships (friends, followers, connections).' },
  { question: 'What does the CAP theorem state?', options: ['You can have all 3: Consistency, Availability, Partition tolerance', 'You can only pick 2 of: Consistency, Availability, Partition tolerance', 'Caching Always Performs better than direct DB access', 'Consistent APIs Produce better results'], correctIndex: 1, explanation: 'CAP theorem states distributed systems can only guarantee 2 of 3: Consistency, Availability, Partition Tolerance.' },
  { question: 'Which pattern handles distributed transactions across microservices?', options: ['Circuit Breaker', 'Saga Pattern', 'Strangler Fig', 'Sidecar'], correctIndex: 1, explanation: 'The Saga pattern manages distributed transactions using a sequence of local transactions with compensating actions.' },
  { question: 'For a URL shortener, what\'s the best approach for ID generation?', options: ['Auto-increment SQL ID', 'Random UUID', 'Base62 encoded counter (Snowflake)', 'Timestamp-based ID'], correctIndex: 2, explanation: 'Base62 encoding of a distributed counter (like Snowflake IDs) gives short, unique, URL-safe strings.' },
  { question: 'What is fan-out on write?', options: ['Writing data to multiple databases simultaneously', 'Pushing content to all followers\' timelines when published', 'Distributing write load across shards', 'Caching writes in multiple regions'], correctIndex: 1, explanation: 'Fan-out on write pre-computes timelines by pushing content to each follower\'s cache when a post is created.' },
  { question: 'Which caching strategy writes to cache AND database simultaneously?', options: ['Write-back', 'Write-around', 'Write-through', 'Cache-aside'], correctIndex: 2, explanation: 'Write-through writes to both cache and database on every write, ensuring consistency at the cost of write latency.' },
  { question: 'What\'s the main advantage of consistent hashing over simple hashing?', options: ['Faster hash computation', 'Minimal redistribution when nodes change', 'Better randomness', 'Simpler implementation'], correctIndex: 1, explanation: 'Consistent hashing only redistributes K/N keys when a node is added/removed, vs rehashing everything with simple hashing.' },
  { question: 'Which algorithm is best for rate limiting with bursty traffic?', options: ['Fixed Window Counter', 'Token Bucket', 'Sliding Window Log', 'Leaky Bucket'], correctIndex: 1, explanation: 'Token Bucket allows bursts up to the bucket capacity while maintaining an average rate, making it ideal for bursty traffic.' },
  { question: 'What\'s the purpose of a dead letter queue?', options: ['Storing deleted messages', 'Handling messages that fail processing repeatedly', 'Archiving old messages', 'Prioritizing urgent messages'], correctIndex: 1, explanation: 'Dead letter queues store messages that couldn\'t be processed after multiple retries, preventing queue blockage.' },
  { question: 'In a payment system, what ensures a transaction isn\'t processed twice?', options: ['Rate limiting', 'Load balancing', 'Idempotency keys', 'Circuit breaker'], correctIndex: 2, explanation: 'Idempotency keys ensure that retrying a request produces the same result, preventing duplicate charges.' },
  { question: 'Which is NOT a benefit of microservices?', options: ['Independent deployment', 'Technology flexibility', 'Simpler debugging', 'Team autonomy'], correctIndex: 2, explanation: 'Debugging is actually harder in microservices due to distributed tracing needs, network calls, and eventual consistency.' },
  { question: 'What does P99 latency mean?', options: ['99% of requests fail', '99% of requests complete within this time', 'The worst-case latency', 'Average latency × 0.99'], correctIndex: 1, explanation: 'P99 means 99% of requests complete within this time. It\'s crucial for SLOs as it captures tail latency.' },
  { question: 'Which approach is best for Twitter celebrity accounts with millions of followers?', options: ['Fan-out on write', 'Fan-out on read', 'Hybrid (fan-out on write + read for celebrities)', 'Direct database queries'], correctIndex: 2, explanation: 'Hybrid approach: fan-out on write for normal users, but celebrities\' posts are merged at read time to avoid massive write amplification.' },
  { question: 'What is the primary purpose of a CDN?', options: ['Database caching', 'Load balancing', 'Serving content from geographically close servers', 'DNS resolution'], correctIndex: 2, explanation: 'CDNs cache content at edge locations worldwide, reducing latency by serving from the nearest server to the user.' },
  { question: 'In database sharding, what is a "hot partition"?', options: ['A partition with corrupted data', 'A shard receiving disproportionately high traffic', 'A recently created partition', 'A partition stored on SSD'], correctIndex: 1, explanation: 'A hot partition/shard receives much more traffic than others, causing performance bottlenecks. Often caused by poor shard key choice.' },
  { question: 'What is the Strangler Fig pattern used for?', options: ['Load balancing', 'Gradually migrating from legacy to new system', 'Caching invalidation', 'Database replication'], correctIndex: 1, explanation: 'Named after the strangler fig tree, this pattern gradually replaces a legacy system by routing traffic piece by piece to the new system.' },
  { question: 'Which replication provides the strongest consistency?', options: ['Asynchronous replication', 'Semi-synchronous replication', 'Synchronous replication', 'Lazy replication'], correctIndex: 2, explanation: 'Synchronous replication waits for all replicas to confirm the write, providing the strongest consistency but highest latency.' },
  { question: 'What\'s the main benefit of event sourcing?', options: ['Faster queries', 'Complete audit trail and ability to replay events', 'Simpler codebase', 'Lower storage costs'], correctIndex: 1, explanation: 'Event sourcing stores all changes as immutable events, providing a complete audit trail and the ability to reconstruct any past state.' },
  { question: 'How many 9s of availability does 5.26 minutes of downtime per year represent?', options: ['99.9% (3 nines)', '99.99% (4 nines)', '99.999% (5 nines)', '99.9999% (6 nines)'], correctIndex: 1, explanation: '99.99% (4 nines) availability allows ~52.6 minutes of downtime per year. 5.26 minutes is actually 5 nines (99.999%).' },
  { question: 'What protocol is best for real-time bidirectional communication?', options: ['HTTP polling', 'HTTP long polling', 'WebSocket', 'Server-Sent Events'], correctIndex: 2, explanation: 'WebSocket provides full-duplex communication over a single TCP connection, ideal for chat, gaming, and real-time updates.' },
]

export default function Quiz() {
  const [mode, setMode] = useState<'menu' | 'quiz' | 'results'>('menu')
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(0)

  const startQuiz = useCallback((count: number) => {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, count)
    setQuestions(shuffled)
    setCurrentIdx(0)
    setScore(0)
    setAnswered(0)
    setMode('quiz')
  }, [])

  const handleAnswer = (correct: boolean) => {
    if (correct) setScore(s => s + 1)
    setAnswered(a => a + 1)
  }

  const next = () => {
    if (currentIdx + 1 >= questions.length) {
      setMode('results')
    } else {
      setCurrentIdx(i => i + 1)
    }
  }

  if (mode === 'menu') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">🎯 Quiz Mode</h1>
          <p className="text-slate-400 text-sm mt-1">Test your system design knowledge</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Quick (5)', count: 5, desc: '5 random questions', color: 'from-green-500 to-emerald-500' },
            { label: 'Standard (10)', count: 10, desc: '10 random questions', color: 'from-blue-500 to-cyan-500' },
            { label: 'Full (20)', count: 20, desc: 'All 20 questions', color: 'from-purple-500 to-pink-500' },
          ].map(opt => (
            <button
              key={opt.count}
              onClick={() => startQuiz(opt.count)}
              className="bg-slate-card border border-navy-600 rounded-xl p-6 hover:border-accent-blue/50
                hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-left group"
            >
              <div className={`text-2xl font-bold bg-gradient-to-r ${opt.color} bg-clip-text text-transparent`}>
                {opt.label}
              </div>
              <p className="text-xs text-slate-400 mt-2">{opt.desc}</p>
            </button>
          ))}
        </div>
        <div className="bg-slate-card border border-navy-600 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-2">📊 Your Stats</h2>
          <p className="text-xs text-slate-400">Questions available: {allQuestions.length}</p>
          <p className="text-xs text-slate-400">Topics: CAP theorem, caching, databases, patterns, scaling, algorithms</p>
        </div>
      </div>
    )
  }

  if (mode === 'results') {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="space-y-6 max-w-lg mx-auto text-center">
        <div className="bg-slate-card border border-navy-600 rounded-xl p-8">
          <div className="text-6xl mb-4">{pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '📚'}</div>
          <h2 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h2>
          <div className="text-4xl font-bold bg-gradient-to-r from-accent-blue to-accent-cyan bg-clip-text text-transparent mb-2">
            {score}/{questions.length}
          </div>
          <p className="text-slate-400 text-sm mb-1">{pct}% correct</p>
          <p className="text-xs text-slate-500">
            {pct >= 80 ? 'Excellent! You\'re well prepared.' : pct >= 60 ? 'Good job! Review the concepts you missed.' : 'Keep studying! Review the Concepts and Patterns sections.'}
          </p>
          <div className="flex gap-3 justify-center mt-6">
            <button onClick={() => setMode('menu')} className="px-4 py-2 bg-navy-700 hover:bg-navy-600 text-white text-sm rounded-lg transition-colors">
              Back to Menu
            </button>
            <button onClick={() => startQuiz(questions.length)} className="px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white text-sm rounded-lg transition-colors">
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-white">🎯 Quiz</h1>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-400">
            {currentIdx + 1}/{questions.length}
          </span>
          <span className="text-accent-green font-medium">{score} ✓</span>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full h-1.5 bg-navy-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent-blue to-accent-cyan rounded-full transition-all duration-500"
          style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
        />
      </div>

      <QuizCard key={currentIdx} q={questions[currentIdx]} onAnswer={handleAnswer} />

      {answered > currentIdx && (
        <div className="flex justify-end">
          <button
            onClick={next}
            className="px-6 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white text-sm rounded-lg transition-colors font-medium"
          >
            {currentIdx + 1 >= questions.length ? 'See Results' : 'Next →'}
          </button>
        </div>
      )}
    </div>
  )
}
