import { X } from 'lucide-react'
import type { FleetValueRow, ValueOpportunity, WorkflowImpactStory } from '../data'
import { AdoptionIndicator, ValueSparkline } from './shared'

type ValueInvestigationDrawerProps = {
  agent: FleetValueRow | null
  workflowStories: WorkflowImpactStory[]
  opportunities: ValueOpportunity[]
  open: boolean
  onClose: () => void
}

function MetricChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2">
      <p className="text-[10px] uppercase tracking-[0.16em] text-[#f2f0eb]/38">{label}</p>
      <p className="mt-1 text-[14px] font-semibold tabular-nums text-[#f2f0eb]">{value}</p>
    </div>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 space-y-1.5 text-[12px] leading-snug text-[#f2f0eb]/78">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[#5DC2A8]/85" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function ValueInvestigationDrawer({
  agent,
  workflowStories,
  opportunities,
  open,
  onClose,
}: ValueInvestigationDrawerProps) {
  if (!agent) return null

  const agentWorkflows = workflowStories.filter((story) => story.agent === agent.agent)
  const visibleWorkflows = agentWorkflows.length > 0 ? agentWorkflows : workflowStories.slice(0, 2)
  const agentOpportunities = opportunities.filter((opportunity) => opportunity.agent === agent.agent)
  const visibleOpportunities = agentOpportunities.length > 0 ? agentOpportunities : opportunities.slice(0, 2)

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
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#f2f0eb]/45">Value Investigation</p>
            <h3 className="mt-1 truncate text-lg font-semibold text-[#f2f0eb]">{agent.agent}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[#5DC2A8]/30 bg-[#5DC2A8]/10 px-2 py-0.5 text-[10px] text-[#5DC2A8]">
                {agent.primaryOutcome}
              </span>
              <span className="rounded-full border border-white/[0.08] bg-white/[0.02] px-2 py-0.5 text-[10px] text-[#f2f0eb]/62">
                Scale signal {agent.valueScore}
              </span>
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
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">Agent Overview</p>
            <p className="mt-2 text-[13px] leading-relaxed text-[#f2f0eb]/78">{agent.purpose}</p>
            <p className="mt-2 text-[12px] leading-relaxed text-[#f2f0eb]/58">{agent.selectedNarrative}</p>
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">Value Metrics</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <MetricChip label="Time saved" value={agent.timeSaved} />
              <MetricChip label="Tickets avoided" value={agent.ticketsAvoided} />
              <MetricChip label="Productivity" value={agent.productivityGain} />
              <MetricChip label="Value generated" value={agent.estimatedValue} />
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">Adoption</p>
              <span className="text-[11px] font-medium text-[#5DC2A8]">{agent.adoptionTrend}</span>
            </div>
            <div className="mt-3">
              <AdoptionIndicator score={agent.adoptionScore} />
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">Business Contribution</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <MetricChip label="Revenue influence" value={agent.revenueInfluence} />
              <MetricChip label="Primary outcome" value={agent.primaryOutcome} />
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">Strongest Workflows</p>
            <BulletList
              items={visibleWorkflows.map((story) => `${story.title}: ${story.metric} ${story.delta}`)}
            />
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">Opportunities</p>
            <BulletList
              items={visibleOpportunities.map(
                (opportunity) => `${opportunity.title}: ${opportunity.recommendation} (${opportunity.impact})`,
              )}
            />
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">Supporting Trend</p>
              <span className="text-[11px] tabular-nums text-[#f2f0eb]/58">Score {agent.valueScore}</span>
            </div>
            <div className="h-16 rounded-lg border border-white/[0.06] bg-white/[0.025] px-2 py-1">
              <ValueSparkline points={agent.sparkline} className="h-full w-full" />
            </div>
          </div>
        </section>
      </aside>
    </div>
  )
}
