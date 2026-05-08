import { useState } from 'react'
import type { Incident } from '../data/mockData'
import { StatusBadge } from './StatusBadge'

type IncidentTimelineProps = {
  incidents: Incident[]
}

const severityTone = {
  low: 'healthy',
  medium: 'watch',
  high: 'critical',
} as const

export function IncidentTimeline({ incidents }: IncidentTimelineProps) {
  const [expandedId, setExpandedId] = useState<string>(incidents[0]?.id ?? '')

  if (!incidents.length) {
    return (
      <section className="rounded-2xl border border-slate-700/60 bg-slate-900/45 p-5 text-center text-sm text-slate-300">
        No critical incidents in the selected window.
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-slate-700/60 bg-slate-900/45 p-4 shadow-2xl backdrop-blur-md">
      <header className="mb-3">
        <h3 className="text-sm font-semibold text-slate-100">Incident Timeline</h3>
        <p className="text-xs text-slate-400">Most recent anomaly and reliability events</p>
      </header>
      <div className="space-y-3">
        {incidents.map((incident) => {
          const expanded = expandedId === incident.id
          return (
            <button
              type="button"
              key={incident.id}
              onClick={() => setExpandedId(expanded ? '' : incident.id)}
              className="w-full rounded-xl border border-slate-700/70 bg-slate-950/45 p-3 text-left transition hover:border-slate-500/80"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-xs font-medium text-slate-200">{incident.title}</p>
                <StatusBadge label={incident.severity} tone={severityTone[incident.severity]} />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{incident.timestamp}</span>
                <span>{incident.status}</span>
              </div>
              {expanded ? <p className="mt-2 text-xs text-slate-300">{incident.details}</p> : null}
            </button>
          )
        })}
      </div>
    </section>
  )
}
