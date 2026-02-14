import { useState } from 'react'

export interface Step {
  title: string
  content: string
  details?: string[]
}

interface Props {
  steps: Step[]
}

export default function StepWalkthrough({ steps }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  return (
    <div className="space-y-2">
      {steps.map((step, i) => (
        <div key={i} className="rounded-lg border border-navy-600 overflow-hidden">
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-navy-700/50 transition-colors"
          >
            <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
              ${openIdx === i ? 'bg-accent-blue text-white' : 'bg-navy-600 text-slate-400'}`}>
              {i + 1}
            </span>
            <span className={`font-medium text-sm ${openIdx === i ? 'text-white' : 'text-slate-300'}`}>
              {step.title}
            </span>
            <span className="ml-auto text-slate-500 text-xs">{openIdx === i ? '▲' : '▼'}</span>
          </button>
          {openIdx === i && (
            <div className="px-4 pb-4 pt-1 animate-fade-in">
              <p className="text-sm text-slate-300 leading-relaxed">{step.content}</p>
              {step.details && (
                <ul className="mt-2 space-y-1">
                  {step.details.map((d, j) => (
                    <li key={j} className="text-xs text-slate-400 flex items-start gap-2">
                      <span className="text-accent-cyan mt-0.5">•</span> {d}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
