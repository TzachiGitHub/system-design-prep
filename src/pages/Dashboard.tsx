import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const sections = [
  { path: '/patterns', icon: '🧩', label: 'Architecture Patterns', count: 15, color: 'from-blue-500 to-cyan-500' },
  { path: '/blocks', icon: '🧱', label: 'Building Blocks', count: 12, color: 'from-purple-500 to-pink-500' },
  { path: '/problems', icon: '💡', label: 'Classic Problems', count: 12, color: 'from-green-500 to-emerald-500' },
  { path: '/concepts', icon: '⚖️', label: 'Concepts & Trade-offs', count: 11, color: 'from-orange-500 to-yellow-500' },
  { path: '/framework', icon: '📋', label: 'Interview Framework', count: 8, color: 'from-cyan-500 to-blue-500' },
  { path: '/cheat-sheet', icon: '📝', label: 'Cheat Sheet', count: 1, color: 'from-pink-500 to-red-500' },
  { path: '/quiz', icon: '🎯', label: 'Quiz Mode', count: 20, color: 'from-amber-500 to-orange-500' },
]

const randomQuestions = [
  'How would you design a URL shortener?',
  'Explain the CAP theorem and its implications.',
  'When would you choose eventual consistency over strong consistency?',
  'Design a notification system for 100M users.',
  'What is the difference between horizontal and vertical scaling?',
  'How does consistent hashing work?',
  'Compare message queues: Kafka vs RabbitMQ.',
  'Design a rate limiter for an API gateway.',
  'How would you handle a hot partition in a database?',
  'Explain the Saga pattern for distributed transactions.',
]

function getTimeUntilInterview() {
  // Assume interview is tomorrow at 10:00 AM
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(10, 0, 0, 0)
  const diff = tomorrow.getTime() - now.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return { hours, minutes }
}

function getOverallProgress(): number {
  let total = 0, done = 0
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith('progress-')) {
      try {
        const arr = JSON.parse(localStorage.getItem(key)!)
        done += arr.length
        total += 10 // approximate
      } catch {}
    }
  }
  return total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0
}

export default function Dashboard() {
  const [countdown, setCountdown] = useState(getTimeUntilInterview())
  const [randomQ, setRandomQ] = useState('')
  const progress = getOverallProgress()

  useEffect(() => {
    const iv = setInterval(() => setCountdown(getTimeUntilInterview()), 60000)
    return () => clearInterval(iv)
  }, [])

  const pickRandom = () => {
    setRandomQ(randomQuestions[Math.floor(Math.random() * randomQuestions.length)])
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-accent-blue via-accent-cyan to-accent-purple bg-clip-text text-transparent">
            System Design Prep
          </h1>
          <p className="text-slate-400 mt-1">Your comprehensive interview preparation platform</p>
        </div>
        {/* Countdown */}
        <div className="bg-slate-card border border-navy-600 rounded-xl px-5 py-3 glow-pulse">
          <div className="text-xs text-slate-400 mb-1">⏰ Interview In</div>
          <div className="text-2xl font-bold text-white">
            {countdown.hours}<span className="text-accent-blue">h</span>{' '}
            {countdown.minutes}<span className="text-accent-blue">m</span>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-slate-card border border-navy-600 rounded-xl p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-300 font-medium">Overall Progress</span>
          <span className="text-sm text-accent-cyan font-bold">{progress}%</span>
        </div>
        <div className="w-full h-3 bg-navy-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent-blue via-accent-cyan to-accent-green rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Section Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sections.map(s => (
          <Link
            key={s.path}
            to={s.path}
            className="group bg-slate-card border border-navy-600 rounded-xl p-5 hover:border-accent-blue/50
              hover:shadow-lg hover:shadow-accent-blue/5 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-3xl mb-3">{s.icon}</div>
            <h3 className="font-semibold text-white group-hover:text-accent-blue transition-colors">{s.label}</h3>
            <p className="text-xs text-slate-500 mt-1">{s.count} topics</p>
            <div className={`mt-3 h-1 rounded-full bg-gradient-to-r ${s.color} opacity-30 group-hover:opacity-100 transition-opacity`} />
          </Link>
        ))}
      </div>

      {/* Random Question */}
      <div className="bg-slate-card border border-navy-600 rounded-xl p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-white">🎲 Random Practice Question</h2>
          <button
            onClick={pickRandom}
            className="px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white text-sm rounded-lg transition-colors font-medium"
          >
            Generate
          </button>
        </div>
        {randomQ && (
          <div className="mt-4 p-4 rounded-lg bg-navy-700/50 border border-navy-600 animate-fade-in">
            <p className="text-accent-cyan font-medium">{randomQ}</p>
            <p className="text-xs text-slate-500 mt-2">Think through this for 2 minutes before looking at the answer.</p>
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: '🎯', title: 'Clarify Requirements', desc: 'Always start by asking questions. Functional vs non-functional requirements.' },
          { icon: '📊', title: 'Back-of-Envelope', desc: 'Estimate QPS, storage, bandwidth. Show you think about scale.' },
          { icon: '🔄', title: 'Trade-offs', desc: 'There\'s no perfect design. Discuss trade-offs explicitly.' },
        ].map(tip => (
          <div key={tip.title} className="bg-navy-800/50 border border-navy-700 rounded-lg p-4">
            <span className="text-2xl">{tip.icon}</span>
            <h3 className="font-semibold text-white mt-2 text-sm">{tip.title}</h3>
            <p className="text-xs text-slate-400 mt-1">{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
