type StatusTone = 'healthy' | 'watch' | 'critical' | 'success' | 'warning' | 'failed' | 'escalated'

const toneMap: Record<StatusTone, string> = {
  healthy: 'bg-emerald-400/15 text-emerald-300 border-emerald-400/30',
  watch: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
  critical: 'bg-red-400/15 text-red-300 border-red-400/30',
  success: 'bg-cyan-400/15 text-cyan-300 border-cyan-400/30',
  warning: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
  failed: 'bg-red-400/15 text-red-300 border-red-400/30',
  escalated: 'bg-fuchsia-400/15 text-fuchsia-300 border-fuchsia-400/30',
}

type StatusBadgeProps = {
  label: string
  tone: StatusTone
}

export function StatusBadge({ label, tone }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-medium tracking-wide ${toneMap[tone]}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  )
}
