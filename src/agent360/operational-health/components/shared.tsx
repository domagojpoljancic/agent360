import { SparkChart } from '../../components/charts'
import { StatusBadge } from '../../components/StatusBadge'
import type { AgentStatus } from '../data'

/**
 * Thin wrapper preserved for call sites — delegates to the centralized
 * `SparkChart`. To revert globally, flip `USE_LEGACY_CHARTS` in
 * `src/agent360/components/charts/sparkConfig.ts`.
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
      tone="operational-health"
      danger={danger}
    />
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
