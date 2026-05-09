import { StatusBadge } from '../../components/StatusBadge'
import type { AgentStatus } from '../data'

export function Sparkline({
  points,
  danger = false,
  className,
}: {
  points: number[]
  danger?: boolean
  className?: string
}) {
  const min = Math.min(...points)
  const max = Math.max(...points)
  const padY = 8
  const chartHeight = 100 - padY * 2
  const normalized = points.map((value, index) => {
    const x = (index / (points.length - 1 || 1)) * 100
    const y =
      max === min
        ? 50
        : 100 - padY - ((value - min) / (max - min)) * chartHeight
    return `${x},${y}`
  })
  return (
    <svg viewBox="0 0 100 100" className={className ?? 'h-7 w-full'} preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={danger ? '#E07a83' : '#3694fc'}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={normalized.join(' ')}
        className="drop-shadow-[0_0_8px_rgba(54,148,252,0.45)]"
      />
    </svg>
  )
}

export function HealthPill({ status }: { status: AgentStatus }) {
  if (status === 'Healthy') return <StatusBadge label={status} tone="healthy" />
  if (status === 'Stable') return <StatusBadge label={status} tone="success" />
  if (status === 'Degraded') return <StatusBadge label={status} tone="watch" />
  return <StatusBadge label={status} tone="critical" />
}

export function MetricChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2">
      <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/42">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#f2f0eb]">{value}</p>
    </div>
  )
}
