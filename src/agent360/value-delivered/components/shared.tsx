import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react'
import { SparkChart } from '../../components/charts'
import type { TrendDirection } from '../data'

/**
 * Value-page sparkline shim — delegates to the centralized `SparkChart` so
 * Value Delivered KPI cards share the same premium bar treatment as the rest
 * of Agent360. Reversible globally via `USE_LEGACY_CHARTS`.
 */
export function ValueSparkline({
  points,
  className,
}: {
  points: number[]
  className?: string
}) {
  return <SparkChart points={points} className={className} tone="value-delivered" />
}

export function TrendBadge({
  trend,
  label,
}: {
  trend: TrendDirection
  label: string
}) {
  const Icon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : ArrowRight
  const className =
    trend === 'up'
      ? 'border-[#3DD68C]/30 bg-[#3DD68C]/[0.08] text-[#3DD68C]'
      : trend === 'down'
        ? 'border-[#D6A85B]/30 bg-[#D6A85B]/[0.08] text-[#D6A85B]'
        : 'border-white/[0.09] bg-white/[0.03] text-[#f2f0eb]/62'

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${className}`}>
      <Icon className="size-3" />
      {label}
    </span>
  )
}

export function AdoptionIndicator({ score }: { score: number }) {
  return (
    <div className="flex min-w-[112px] items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#5DC2A8] to-[#3DD68C] shadow-[0_0_10px_rgba(93,194,168,0.35)] transition-all duration-500"
          style={{ width: `${Math.max(8, Math.min(100, score))}%` }}
        />
      </div>
      <span className="w-8 text-right text-[12px] tabular-nums text-[#f2f0eb]/70">{score}%</span>
    </div>
  )
}
