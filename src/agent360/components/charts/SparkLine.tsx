import { getSparkPalette, type SparkTone } from './sparkConfig'

/**
 * Legacy straight-line sparkline. Preserved verbatim for reversibility — the
 * renderer used everywhere before the bar refactor. Retained so any single
 * caller can opt back in without flipping the global `USE_LEGACY_CHARTS` flag.
 */
export function SparkLine({
  points,
  className,
  tone = 'operational-health',
  danger = false,
}: {
  points: number[]
  className?: string
  tone?: SparkTone
  danger?: boolean
}) {
  const palette = getSparkPalette(tone, danger)
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
        stroke={palette.legacyStroke}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={normalized.join(' ')}
        style={{ filter: `drop-shadow(${palette.legacyShadow})` }}
      />
    </svg>
  )
}
