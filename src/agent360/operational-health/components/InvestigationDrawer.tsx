import { X } from 'lucide-react'
import type { AgentOperationalRow } from '../data'
import { HealthPill, MetricChip } from './shared'
import { navigate } from '../../router'

type InvestigationDrawerProps = {
  agent: AgentOperationalRow | null
  open: boolean
  onClose: () => void
}

export function InvestigationDrawer({ agent, open, onClose }: InvestigationDrawerProps) {
  if (!agent) return null

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
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#f2f0eb]/45">Agent Investigation</p>
            <h3 className="mt-1 text-lg font-semibold text-[#f2f0eb]">{agent.name}</h3>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <HealthPill status={agent.status} />
              <span className="rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-[11px] text-[#f2f0eb]/72">
                {agent.facing}
              </span>
              <span className="rounded-full border border-[#3694fc]/30 bg-[#3694fc]/10 px-2.5 py-1 text-[11px] text-[#3694fc]">
                Health Score {agent.healthScore}
              </span>
            </div>
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
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">Operational Summary</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <MetricChip label="Requests/min" value={agent.summary.requestsPerMin} />
              <MetricChip label="p95 latency" value={agent.summary.p95Latency} />
              <MetricChip label="Uptime" value={agent.summary.uptime} />
              <MetricChip label="Retries" value={agent.summary.retries} />
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">Active Dependencies</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {agent.dependencies.map((dep) => (
                <span
                  key={dep}
                  className="rounded-full border border-white/[0.1] bg-[#20202a] px-2 py-0.5 text-[11px] text-[#f2f0eb]/74"
                >
                  {dep}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">Recent Operational Events</p>
            <div className="mt-2 space-y-2">
              {agent.events.map((event) => (
                <p key={event} className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2.5 py-2 text-[12px] text-[#f2f0eb]/75">
                  {event}
                </p>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">Operational Recommendations</p>
            <ul className="mt-2 space-y-2 text-[12px] text-[#f2f0eb]/75">
              {agent.recommendations.map((recommendation) => (
                <li
                  key={recommendation}
                  className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-2"
                >
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <button
          type="button"
          onClick={() => navigate(`/operational-health/agent/${agent.id}`)}
          className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-[#3694fc]/35 bg-[#3694fc]/12 px-3 py-2.5 text-sm font-medium text-[#f2f0eb] transition hover:border-[#3694fc]/65 hover:bg-[#3694fc]/18"
        >
          Open Full Agent Deep Dive
        </button>
      </aside>
    </div>
  )
}
