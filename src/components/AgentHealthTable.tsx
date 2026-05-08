import { Activity } from 'lucide-react'
import type { AgentRow } from '../data/mockData'
import { StatusBadge } from './StatusBadge'

type AgentHealthTableProps = {
  agents: AgentRow[]
  selectedAgentId: string
  onSelectAgent: (id: string) => void
}

const statusTone = {
  healthy: 'healthy',
  watch: 'watch',
  critical: 'critical',
} as const

export function AgentHealthTable({ agents, selectedAgentId, onSelectAgent }: AgentHealthTableProps) {
  return (
    <section className="rounded-2xl border border-slate-700/60 bg-slate-900/45 p-4 shadow-2xl backdrop-blur-md">
      <header className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-100">Agent Fleet Health</h3>
          <p className="text-xs text-slate-400">Live performance and reliability across active agents</p>
        </div>
        <Activity className="size-4 text-cyan-300" />
      </header>
      <div className="space-y-2">
        {agents.map((agent) => {
          const isActive = selectedAgentId === agent.id
          return (
            <button
              key={agent.id}
              type="button"
              onClick={() => onSelectAgent(agent.id)}
              className={`grid w-full grid-cols-8 items-center gap-2 rounded-xl border p-2 text-left transition ${
                isActive
                  ? 'border-cyan-400/50 bg-cyan-500/10 shadow-[0_0_25px_-16px_rgba(56,189,248,0.9)]'
                  : 'border-slate-700/70 bg-slate-950/35 hover:border-slate-500/80 hover:bg-slate-900/60'
              }`}
            >
              <div className="col-span-2">
                <p className="text-xs font-medium text-slate-100">{agent.name}</p>
                <StatusBadge label={agent.status} tone={statusTone[agent.status]} />
              </div>
              <p className="text-xs text-slate-300">{agent.traffic}</p>
              <p className="text-xs text-slate-300">{agent.latencyMs}ms</p>
              <p className="text-xs text-slate-300">{agent.successRate}%</p>
              <p className="text-xs text-slate-300">${agent.costToday}</p>
              <div className="flex items-end gap-0.5">
                {agent.sparkline.map((value, index) => (
                  <span
                    key={`${agent.id}-${index}`}
                    className="w-1 rounded-sm bg-cyan-300/80"
                    style={{ height: `${Math.max(6, (value / 100) * 24)}px` }}
                  />
                ))}
              </div>
              <p className="text-right text-xs font-semibold text-slate-100">{agent.healthScore}</p>
            </button>
          )
        })}
      </div>
    </section>
  )
}
