import { StatusBadge } from '../../components/StatusBadge'
import type { TrustStatus, TrustTone } from '../data'

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
        stroke={danger ? '#E07a83' : '#9aa6f0'}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={normalized.join(' ')}
        className="drop-shadow-[0_0_8px_rgba(154,166,240,0.5)]"
      />
    </svg>
  )
}

export function TrustBadge({ status }: { status: TrustStatus }) {
  if (status === 'Trusted') return <StatusBadge label={status} tone="healthy" />
  if (status === 'Watch') return <StatusBadge label={status} tone="watch" />
  return <StatusBadge label={status} tone="critical" />
}

const toneLabels: Record<TrustTone, string> = {
  healthy: 'On track',
  watch: 'Watch',
  critical: 'Alert',
  success: 'Stable',
  live: 'Live',
}

export function TrustToneBadge({ tone }: { tone: TrustTone }) {
  return <StatusBadge label={toneLabels[tone]} tone={tone} />
}

export function ConfidenceIndicator({ score }: { score: number }) {
  const tone =
    score >= 90 ? 'bg-[#3DD68C]' : score >= 82 ? 'bg-[#3694fc]' : score >= 75 ? 'bg-[#D6A85B]' : 'bg-[#E07a83]'
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.08]">
        <div className={`h-full ${tone}`} style={{ width: `${Math.max(6, Math.min(100, score))}%` }} />
      </div>
      <span className="text-[12px] text-[#f2f0eb]/78">{score}</span>
    </div>
  )
}
