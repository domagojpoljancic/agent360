import { SparkChart } from '../../components/charts'
import { StatusBadge } from '../../components/StatusBadge'
import type { TrustStatus, TrustTone } from '../data'

/**
 * Trust-page sparkline shim — delegates to the centralized `SparkChart`.
 * Reversible via `USE_LEGACY_CHARTS` in `components/charts/sparkConfig.ts`.
 */
export function Sparkline({
  points,
  danger = false,
  className,
}: {
  points: number[]
  danger?: boolean
  className?: string
}) {
  return (
    <SparkChart
      points={points}
      className={className}
      tone="agent-effectiveness-trust"
      danger={danger}
    />
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
