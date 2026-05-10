import { X } from 'lucide-react'
import type { AgentCostRow } from '../data'
import { HealthPill, MetricChip } from '../../operational-health/components/shared'
import { navigate } from '../../router'

type AgentCostInvestigationDrawerProps = {
  agent: AgentCostRow | null
  open: boolean
  onClose: () => void
}

export function AgentCostInvestigationDrawer({ agent, open, onClose }: AgentCostInvestigationDrawerProps) {
  if (!agent) return null

  const { profile } = agent

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
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#f2f0eb]/45">Cost investigation</p>
            <h3 className="mt-1 text-lg font-semibold text-[#f2f0eb]">{agent.name} Cost Profile</h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <HealthPill status={agent.efficiencyStatus} />
              <span className="rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-[11px] text-[#f2f0eb]/72">
                {agent.facing}
              </span>
              <span className="rounded-full border border-[#D6A85B]/30 bg-[#D6A85B]/10 px-2.5 py-1 text-[11px] text-[#D6A85B]">
                Value/Cost {profile.valueToCostRatio}
              </span>
            </div>
            <p className="mt-2 text-[12px] text-[#f2f0eb]/62">{profile.efficiencyNarrative}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-white/[0.08] bg-white/[0.02] p-1.5 text-[#f2f0eb]/65 transition hover:text-[#f2f0eb]"
          >
            <X className="size-4" />
          </button>
        </header>

        <section className="space-y-3">
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">Spend summary</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <MetricChip label="Total spend" value={profile.spendSummary.totalSpend} />
              <MetricChip label="Cost / conversation" value={profile.spendSummary.costPerConversation} />
              <MetricChip label="Cost / successful outcome" value={profile.spendSummary.costPerSuccessfulOutcome} />
              <MetricChip label="Premium model share" value={profile.spendSummary.premiumModelShare} />
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">Model usage</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <MetricChip label="GPT-4o share" value={profile.modelUsage.gpt4o} />
              <MetricChip label="Claude Sonnet share" value={profile.modelUsage.claudeSonnet} />
              <MetricChip label="Gemini Pro share" value={profile.modelUsage.geminiPro} />
              <MetricChip label="Embedding usage" value={profile.modelUsage.embedding} />
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">Optimization signals</p>
            <ul className="mt-2 space-y-2 text-[12px] text-[#f2f0eb]/72">
              <li className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
                <span className="text-[#f2f0eb]/45">Premium overuse · </span>
                {profile.optimizationSignals.premiumOveruse}
              </li>
              <li className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
                <span className="text-[#f2f0eb]/45">Context waste · </span>
                {profile.optimizationSignals.contextWaste}
              </li>
              <li className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
                <span className="text-[#f2f0eb]/45">Repeated queries · </span>
                {profile.optimizationSignals.repeatedQueries}
              </li>
              <li className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
                <span className="text-[#f2f0eb]/45">Fallback inefficiency · </span>
                {profile.optimizationSignals.fallbackInefficiency}
              </li>
              <li className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
                <span className="text-[#f2f0eb]/45">Cache opportunity · </span>
                {profile.optimizationSignals.cacheOpportunity}
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-[#D6A85B]/20 bg-[#D6A85B]/[0.06] p-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#D6A85B]/90">Recommended action</p>
            <p className="mt-2 text-[13px] leading-relaxed text-[#f2f0eb]/85">{profile.recommendedAction}</p>
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">Expected impact</p>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <MetricChip label="Estimated savings" value={profile.expectedImpact.estimatedSavings} />
              <MetricChip label="Trust impact" value={profile.expectedImpact.trustImpact} />
              <MetricChip label="Confidence" value={profile.expectedImpact.confidence} />
            </div>
          </div>
        </section>

        <button
          type="button"
          onClick={() => navigate('/cost-optimization/deep-dive')}
          className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-[#D6A85B]/35 bg-[#D6A85B]/12 px-3 py-2.5 text-sm font-medium text-[#f2f0eb] transition hover:border-[#D6A85B]/55 hover:bg-[#D6A85B]/18"
        >
          Open Full Cost Deep Dive
        </button>
      </aside>
    </div>
  )
}
