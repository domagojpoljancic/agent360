import { useId } from 'react'

/**
 * Legacy gradient line + soft area sparkline used by Value Delivered. Preserved
 * verbatim so reverts are a one-line flag flip in `sparkConfig.ts`.
 */
export function SparkValueLine({
  points,
  className,
}: {
  points: number[]
  className?: string
}) {
  const rawId = useId()
  const min = Math.min(...points)
  const max = Math.max(...points)
  const padY = 9
  const chartHeight = 100 - padY * 2
  const gradientId = `value-${rawId.replace(/:/g, '')}`
  const normalized = points.map((value, index) => {
    const x = (index / (points.length - 1 || 1)) * 100
    const y =
      max === min
        ? 50
        : 100 - padY - ((value - min) / (max - min)) * chartHeight
    return { x, y }
  })
  const linePath = buildSmoothPath(normalized)
  const areaPath =
    normalized.length > 0
      ? `${linePath} L ${normalized[normalized.length - 1].x} 96 L ${normalized[0].x} 96 Z`
      : ''

  return (
    <svg
      viewBox="0 0 100 100"
      className={`overflow-visible ${className ?? 'h-7 w-full'}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`${gradientId}-line`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5DC2A8" stopOpacity="0.45" />
          <stop offset="55%" stopColor="#7DE0C5" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#3DD68C" stopOpacity="1" />
        </linearGradient>
        <linearGradient id={`${gradientId}-area`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5DC2A8" stopOpacity="0.22" />
          <stop offset="80%" stopColor="#5DC2A8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={areaPath}
        fill={`url(#${gradientId}-area)`}
        className="transition-opacity duration-300 group-hover:opacity-90"
      />
      <path
        d={linePath}
        fill="none"
        stroke={`url(#${gradientId}-line)`}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-[0_0_7px_rgba(93,194,168,0.38)] transition-[stroke-width,filter] duration-300 group-hover:drop-shadow-[0_0_11px_rgba(93,194,168,0.58)]"
      />
    </svg>
  )
}

function buildSmoothPath(points: { x: number; y: number }[]) {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`

  return points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`
    const previous = points[index - 1]
    const controlX = (previous.x + point.x) / 2
    return `${path} C ${controlX} ${previous.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`
  }, '')
}
