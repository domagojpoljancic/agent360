import { X } from 'lucide-react'
import type { TrustInvestigation } from '../data'
import { ExplainMetricPopover } from './ExplainMetricPopover'
import { ConfidenceIndicator, Sparkline, TrustBadge } from './shared'

type InvestigationDrawerProps = {
  investigation: TrustInvestigation | null
  open: boolean
  onClose: () => void
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 space-y-1.5 text-[12px] leading-snug text-[#f2f0eb]/78">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[#9aa6f0]/80" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function InvestigationDrawer({ investigation, open, onClose }: InvestigationDrawerProps) {
  if (!investigation) return null

  return (
    <div
      className={`fixed inset-0 z-40 transition ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        onClick={onClose}
        className={`absolute inset-0 bg-[#0d0d12]/50 transition ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-xl overflow-auto border-l border-white/[0.08] bg-[#171720]/96 p-4 backdrop-blur-xl transition duration-300 md:p-5 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="mb-4 flex items-start justify-between gap-3 border-b border-white/[0.06] pb-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#f2f0eb]/45">Investigation</p>
            <h3 className="mt-1 truncate text-lg font-semibold text-[#f2f0eb]">{investigation.agentName}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <TrustBadge status={investigation.status} />
              <span className="truncate rounded-full border border-[#9aa6f0]/30 bg-[#9aa6f0]/10 px-2 py-0.5 text-[10px] text-[#9aa6f0]">
                {investigation.trendLabel}
              </span>
              <ConfidenceIndicator score={investigation.trustScore} />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-md border border-white/[0.08] bg-white/[0.02] p-1.5 text-[#f2f0eb]/65 transition hover:text-[#f2f0eb]"
          >
            <X className="size-4" />
          </button>
        </header>

        <section className="space-y-3">
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
            <div className="flex items-center gap-1">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">Snapshot</p>
              <ExplainMetricPopover explainKey="drawer-section-snapshot" label="Explain snapshot" />
            </div>
            <p className="mt-2 text-[11px] text-[#f2f0eb]/45">Customer / user</p>
            <p className="mt-1 text-[12px] text-[#f2f0eb]/88">{investigation.conversationSnapshot.userQuestion}</p>
            <p className="mt-2 text-[11px] text-[#f2f0eb]/45">Agent draft</p>
            <p className="mt-1 text-[12px] text-[#f2f0eb]/75">{investigation.conversationSnapshot.aiResponse}</p>
            <p className="mt-2 text-[11px] text-[#f2f0eb]/45">Outcome</p>
            <p className="mt-1 text-[12px] text-[#f2f0eb]/82">{investigation.conversationSnapshot.outcome}</p>
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
            <div className="flex items-center gap-1">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">Trust read</p>
              <ExplainMetricPopover explainKey="drawer-section-trust-read" label="Explain trust read" />
            </div>
            <BulletList items={investigation.trustAnalysis} />
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
            <div className="flex items-center gap-1">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">Human intervention</p>
              <ExplainMetricPopover explainKey="drawer-section-human-intervention" label="Explain human intervention" />
            </div>
            <BulletList items={investigation.humanIntervention} />
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
            <div className="flex items-center gap-1">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">Next actions</p>
              <ExplainMetricPopover explainKey="drawer-section-next-actions" label="Explain next actions" />
            </div>
            <BulletList items={investigation.suggestedImprovements} />
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
            <div className="flex items-center gap-1">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">Related trends</p>
              <ExplainMetricPopover explainKey="drawer-section-related-trends" label="Explain related trends" />
            </div>
            <div className="mt-2 space-y-2">
              {investigation.relatedTrends.map((trend) => (
                <div key={trend.id} className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-2">
                  <div className="mb-1 flex items-center justify-between gap-2 text-[11px] text-[#f2f0eb]/75">
                    <span className="truncate">{trend.title}</span>
                    <span className="shrink-0 tabular-nums">{trend.value}</span>
                  </div>
                  <Sparkline points={trend.points} danger={trend.trend === 'down'} className="h-5 w-full" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </aside>
    </div>
  )
}
