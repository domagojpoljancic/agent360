import { SparkBar } from './SparkBar'
import { SparkLine } from './SparkLine'
import { USE_LEGACY_CHARTS, type SparkTone } from './sparkConfig'

type SparkChartProps = {
  points: number[]
  className?: string
  tone?: SparkTone
  danger?: boolean
  /** Force the legacy line renderer for this single call site. */
  forceLegacy?: boolean
  highlightPeak?: boolean
}

/**
 * Drop-in replacement for the old per-module Sparkline components.
 * Routes to the premium bar renderer by default; flip `USE_LEGACY_CHARTS`
 * in `sparkConfig.ts` (or pass `forceLegacy`) to restore lines.
 */
export function SparkChart({
  points,
  className,
  tone = 'operational-health',
  danger = false,
  forceLegacy = false,
  highlightPeak = true,
}: SparkChartProps) {
  if (USE_LEGACY_CHARTS || forceLegacy) {
    return <SparkLine points={points} className={className} tone={tone} danger={danger} />
  }
  return (
    <SparkBar
      points={points}
      className={className}
      tone={tone}
      danger={danger}
      highlightPeak={highlightPeak}
    />
  )
}
