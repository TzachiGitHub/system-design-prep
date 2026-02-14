import { useState } from 'react'

export interface QuizQuestion {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

interface Props {
  q: QuizQuestion
  onAnswer?: (correct: boolean) => void
}

export default function QuizCard({ q, onAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  const handleSelect = (i: number) => {
    if (revealed) return
    setSelected(i)
    setRevealed(true)
    onAnswer?.(i === q.correctIndex)
  }

  return (
    <div className="bg-slate-card border border-navy-600 rounded-xl p-5">
      <p className="text-white font-medium mb-4">{q.question}</p>
      <div className="space-y-2">
        {q.options.map((opt, i) => {
          let cls = 'border-navy-600 hover:border-accent-blue/50 hover:bg-navy-700/50'
          if (revealed) {
            if (i === q.correctIndex) cls = 'border-accent-green bg-accent-green/10'
            else if (i === selected) cls = 'border-accent-red bg-accent-red/10'
            else cls = 'border-navy-700 opacity-50'
          }
          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${cls}
                ${!revealed ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <span className="text-slate-400 mr-2 font-mono text-xs">{String.fromCharCode(65 + i)}.</span>
              <span className={revealed && i === q.correctIndex ? 'text-accent-green' : 'text-slate-300'}>{opt}</span>
            </button>
          )
        })}
      </div>
      {revealed && (
        <div className="mt-4 p-3 rounded-lg bg-navy-700/50 border border-navy-600 animate-fade-in">
          <p className="text-xs text-slate-400">
            <span className={selected === q.correctIndex ? 'text-accent-green' : 'text-accent-red'}>
              {selected === q.correctIndex ? '✅ Correct!' : '❌ Incorrect.'}
            </span>
            {' '}{q.explanation}
          </p>
        </div>
      )}
    </div>
  )
}
