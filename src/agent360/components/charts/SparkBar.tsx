import { useId, useMemo } from 'react'
import { getSparkPalette, type SparkTone } from './sparkConfig'

type SparkBarProps = {
  points: number[]
  className?: string
  tone?: SparkTone
  danger?: boolean
  /** Highlight the highest bar with full intensity + soft halo. */
  highlightPeak?: boolean
}

/**
 * Mini vertical-bar sparkline. Premium observability look: soft rounded bars,
 * top-to-bottom gradient, faded baseline floor, optional peak highlight + halo.
 *
 * Designed to drop into the same slot as the previous line sparklines: viewBox
 * 0..100 in both axes, `preserveAspectRatio="none"` so containers like
 * `h-6 w-full` keep working unchanged.
 */
export function SparkBar({
  points,
  className,
  tone = 'operational-health',
  danger = false,
  highlightPeak = true,
}: SparkBarProps) {
  const rawId = useId()
  const palette = getSparkPalette(tone, danger)

  const { bars, peakIndex } = useMemo(() => buildBars(points), [points])
  const gradId = `sb-${rawId.replace(/:/g, '')}`
  const glowId = `${gradId}-g`

  return (
    <svg
      viewBox="0 0 100 100"
      className={`overflow-visible ${className ?? 'h-7 w-full'}`}
      preserveAspectRatio="none"
      role="presentation"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={palette.primary} stopOpacity="1" />
          <stop offset="100%" stopColor={palette.secondary} stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={`${gradId}-faded`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={palette.inactive} stopOpacity="1" />
          <stop offset="100%" stopColor={palette.inactive} stopOpacity="0.35" />
        </linearGradient>
        <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
      </defs>

      {/* baseline tick — preserves a “floor” feeling without a strong axis line */}
      <line
        x1="0"
        y1="96.5"
        x2="100"
        y2="96.5"
        stroke="rgba(242,240,235,0.07)"
        strokeWidth="0.6"
      />

      {bars.map((bar, index) => {
        const isPeak = index === peakIndex
        const fill = bar.muted ? `url(#${gradId}-faded)` : `url(#${gradId})`
        return (
          <g key={index}>
            {highlightPeak && isPeak && !bar.muted ? (
              <rect
                x={bar.x - 0.4}
                y={bar.y - 1.6}
                width={bar.width + 0.8}
                height={bar.height + 3}
                rx={bar.width * 0.55}
                fill={palette.glow}
                opacity={0.55}
                filter={`url(#${glowId})`}
              />
            ) : null}
            <rect
              x={bar.x}
              y={bar.y}
              width={bar.width}
              height={bar.height}
              rx={Math.min(bar.width / 2, 1.4)}
              ry={Math.min(bar.width / 2, 1.4)}
              fill={fill}
              className="transition-[opacity] duration-300"
              style={{ opacity: bar.muted ? 0.9 : 1 }}
            />
          </g>
        )
      })}
    </svg>
  )
}

type Bar = {
  x: number
  y: number
  width: number
  height: number
  /** Quiet bars (below ~28% of the local range) render with the inactive gradient. */
  muted: boolean
}

function buildBars(points: number[]): { bars: Bar[]; peakIndex: number } {
  if (points.length === 0) return { bars: [], peakIndex: -1 }

  const minVal = Math.min(...points)
  const maxVal = Math.max(...points)
  const span = maxVal - minVal || 1

  // Layout: predictable column widths, small gaps, generous top headroom so the
  // tallest bar never touches the container edge.
  const count = points.length
  const totalGap = Math.min(2.4 * (count - 1), 24)
  const usable = 100 - totalGap - 2 // 1px breathing on each side
  const width = Math.max(2, usable / count)
  const gap = count > 1 ? totalGap / (count - 1) : 0
  const startX = 1
  const minHeight = 6
  const topPad = 6
  const baseY = 96

  let peakIndex = 0
  for (let i = 1; i < count; i += 1) if (points[i] > points[peakIndex]) peakIndex = i

  const bars: Bar[] = points.map((value, index) => {
    const normalized = (value - minVal) / span // 0..1
    const height = Math.max(minHeight, normalized * (baseY - topPad - minHeight) + minHeight)
    const y = baseY - height
    const x = startX + index * (width + gap)
    return {
      x,
      y,
      width,
      height,
      muted: normalized < 0.28,
    }
  })

  return { bars, peakIndex }
}
