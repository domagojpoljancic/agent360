import { useId } from 'react'
import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react'
import type { TrendDirection } from '../data'

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

export function ValueSparkline({
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
      <path d={areaPath} fill={`url(#${gradientId}-area)`} className="transition-opacity duration-300 group-hover:opacity-90" />
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
