import type { ReactNode } from 'react'
import { StatusDot } from './StatusDot'

export type BadgeTone = 'live' | 'healthy' | 'success' | 'watch' | 'critical' | 'neutral'

type StatusBadgeProps = {
  label: string
  tone?: BadgeTone
  icon?: ReactNode
  className?: string
}

const toneClasses: Record<BadgeTone, string> = {
  live: 'border-[#3DD68C]/30 bg-[#3DD68C]/[0.08] text-[#3DD68C]',
  healthy: 'border-[#3DD68C]/30 bg-[#3DD68C]/[0.08] text-[#3DD68C]',
  success: 'border-[#3694fc]/30 bg-[#3694fc]/[0.08] text-[#3694fc]',
  watch: 'border-[#D6A85B]/30 bg-[#D6A85B]/[0.08] text-[#D6A85B]',
  critical: 'border-[#E07a83]/30 bg-[#E07a83]/[0.08] text-[#E07a83]',
  neutral: 'border-white/[0.08] bg-white/[0.03] text-[#f2f0eb]/70',
}

const dotTone: Record<BadgeTone, NonNullable<React.ComponentProps<typeof StatusDot>['tone']>> = {
  live: 'live',
  healthy: 'live',
  success: 'blue',
  watch: 'amber',
  critical: 'rose',
  neutral: 'neutral',
}

export function StatusBadge({ label, tone = 'neutral', icon, className }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide ${toneClasses[tone]} ${className ?? ''}`}
    >
      {icon ?? <StatusDot tone={dotTone[tone]} pulse={tone === 'live' || tone === 'healthy'} />}
      <span>{label}</span>
    </span>
  )
}
