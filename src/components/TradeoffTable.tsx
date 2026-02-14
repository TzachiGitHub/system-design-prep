interface Props {
  pros: string[]
  cons: string[]
}

export default function TradeoffTable({ pros, cons }: Props) {
  const maxLen = Math.max(pros.length, cons.length)
  return (
    <div className="grid grid-cols-2 gap-0 rounded-lg overflow-hidden border border-navy-600">
      <div className="bg-accent-green/10 px-4 py-2 font-semibold text-accent-green text-sm border-b border-navy-600">
        ✅ Pros
      </div>
      <div className="bg-accent-red/10 px-4 py-2 font-semibold text-accent-red text-sm border-b border-navy-600">
        ❌ Cons
      </div>
      {Array.from({ length: maxLen }).map((_, i) => (
        <div key={i} className="contents">
          <div className="px-4 py-2 text-sm text-slate-300 border-b border-navy-700/50">
            {pros[i] || ''}
          </div>
          <div className="px-4 py-2 text-sm text-slate-300 border-b border-navy-700/50 border-l border-navy-600">
            {cons[i] || ''}
          </div>
        </div>
      ))}
    </div>
  )
}
