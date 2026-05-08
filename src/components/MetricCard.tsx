import type { ReactNode } from 'react'

type MetricCardProps = {
  label: string
  value: string
  hint?: string
  icon?: ReactNode
}

export function MetricCard({ label, value, hint, icon }: MetricCardProps) {
  return (
    <article className="rounded-xl border border-slate-700/60 bg-slate-900/45 p-4 shadow-[0_0_0_1px_rgba(148,163,184,0.03),0_16px_30px_-20px_rgba(14,165,233,0.35)] backdrop-blur-md">
      <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.15em] text-slate-400">
        <span>{label}</span>
        {icon}
      </div>
      <p className="text-xl font-semibold text-slate-100">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
    </article>
  )
}
