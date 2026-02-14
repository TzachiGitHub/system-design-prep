interface BoxProps {
  label: string
  color?: string
  icon?: string
  children?: React.ReactNode
  className?: string
}

const colorMap: Record<string, string> = {
  blue: 'border-accent-blue bg-accent-blue/10 text-accent-blue',
  cyan: 'border-accent-cyan bg-accent-cyan/10 text-accent-cyan',
  purple: 'border-accent-purple bg-accent-purple/10 text-accent-purple',
  green: 'border-accent-green bg-accent-green/10 text-accent-green',
  orange: 'border-accent-orange bg-accent-orange/10 text-accent-orange',
  pink: 'border-accent-pink bg-accent-pink/10 text-accent-pink',
  red: 'border-accent-red bg-accent-red/10 text-accent-red',
}

export default function DiagramBox({ label, color = 'blue', icon, children, className = '' }: BoxProps) {
  const c = colorMap[color] || colorMap.blue
  return (
    <div className={`border-2 rounded-xl px-4 py-3 text-center ${c} ${className}`}>
      {icon && <div className="text-2xl mb-1">{icon}</div>}
      <div className="font-bold text-sm">{label}</div>
      {children && <div className="text-xs mt-1 text-slate-300">{children}</div>}
    </div>
  )
}

export function Arrow({ direction = 'right', label }: { direction?: 'right' | 'down' | 'left' | 'up'; label?: string }) {
  const arrows: Record<string, string> = { right: '→', down: '↓', left: '←', up: '↑' }
  return (
    <div className={`flex items-center justify-center text-slate-500 ${direction === 'down' || direction === 'up' ? 'flex-col py-1' : 'px-2'}`}>
      <span className="text-lg">{arrows[direction]}</span>
      {label && <span className="text-xs text-slate-400 ml-1">{label}</span>}
    </div>
  )
}
