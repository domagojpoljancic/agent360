import { AlertTriangle } from 'lucide-react'

type TopologyMapProps = {
  selectedAgentName: string
}

function Node({
  title,
  subtitle,
  degraded,
}: {
  title: string
  subtitle: string
  degraded?: boolean
}) {
  return (
    <div
      className={`rounded-xl border p-3 text-xs ${
        degraded
          ? 'border-amber-400/50 bg-amber-500/10 text-amber-100'
          : 'border-slate-700/70 bg-slate-950/55 text-slate-200'
      }`}
    >
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-slate-400">{subtitle}</p>
    </div>
  )
}

export function TopologyMap({ selectedAgentName }: TopologyMapProps) {
  return (
    <section className="rounded-2xl border border-slate-700/60 bg-slate-900/45 p-4 shadow-2xl backdrop-blur-md">
      <header className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">System Map / Agent Topology</h3>
          <p className="text-xs text-slate-400">Live dependency view for {selectedAgentName}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-1 text-[11px] text-amber-300">
          <AlertTriangle className="size-3" />
          Degraded dependency
        </span>
      </header>
      <div className="grid gap-3 md:grid-cols-3">
        <Node title="User Requests" subtitle="Webhook + chat surfaces" />
        <Node title="Router" subtitle="Intent + policy routing" />
        <Node title="LLM Model" subtitle="gpt-4.1 / fallback chain" />
        <Node title="Retrieval Layer" subtitle="Vector index + reranker" degraded />
        <Node title="Tools / APIs" subtitle="CRM, billing, docs connectors" />
        <Node title="Human Handoff" subtitle="Escalation queue + SLA" />
      </div>
    </section>
  )
}
