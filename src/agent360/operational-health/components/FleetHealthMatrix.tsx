import { ChevronRight } from 'lucide-react'
import type { AgentOperationalRow } from '../data'
import { HealthPill, Sparkline } from './shared'

type FleetHealthMatrixProps = {
  rows: AgentOperationalRow[]
  selectedAgentId: string | null
  onSelectAgent: (agentId: string) => void
}

export function FleetHealthMatrix({
  rows,
  selectedAgentId,
  onSelectAgent,
}: FleetHealthMatrixProps) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 md:p-4">
      <header className="mb-3 flex items-end justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#f2f0eb]/42">Fleet Overview</p>
          <h2 className="mt-1 text-lg font-semibold text-[#f2f0eb]">Fleet Health Matrix</h2>
        </div>
        <p className="text-[12px] text-[#f2f0eb]/60">Click a row to open investigation drawer</p>
      </header>
      <div className="overflow-auto rounded-xl border border-white/[0.07]">
        <table className="min-w-[1020px] w-full text-left text-[13px]">
          <thead className="sticky top-0 z-10 bg-[#1f1f28]/95 text-[#f2f0eb]/65 backdrop-blur-xl">
            <tr className="border-b border-white/[0.07]">
              {[
                'Agent',
                'Facing',
                'Status',
                'Traffic',
                'p95 Latency',
                'Error Rate',
                'Availability',
                'Tool Failures',
                'Issue',
                'Model',
                'Load Trend',
              ].map((header) => (
                <th key={header} className="px-3 py-2.5 font-medium uppercase tracking-[0.16em]">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const selected = selectedAgentId === row.id
              return (
                <tr
                  key={row.id}
                  onClick={() => onSelectAgent(row.id)}
                  className={`cursor-pointer border-b border-white/[0.05] transition ${
                    selected
                      ? 'bg-[#3694fc]/[0.1] shadow-[inset_0_0_0_1px_rgba(54,148,252,0.3)]'
                      : 'hover:bg-white/[0.035]'
                  }`}
                >
                  <td className="px-3 py-3.5">
                    <p className="text-[13.5px] font-semibold text-[#f2f0eb]">{row.name}</p>
                    <p className="mt-0.5 text-[11.5px] text-[#f2f0eb]/48">{row.purpose}</p>
                  </td>
                  <td className="px-3 py-3.5 text-[#f2f0eb]/75">{row.facing}</td>
                  <td className="px-3 py-3.5">
                    <HealthPill status={row.status} />
                  </td>
                  <td className="px-3 py-3.5 font-medium text-[#f2f0eb]">{row.traffic}</td>
                  <td className="px-3 py-3.5 text-[#f2f0eb]">{row.latencyP95}</td>
                  <td className="px-3 py-3.5 text-[#f2f0eb]">{row.errorRate}</td>
                  <td className="px-3 py-3.5 text-[#f2f0eb]">{row.availability}</td>
                  <td className="px-3 py-3.5 text-[#f2f0eb]">{row.toolFailures}</td>
                  <td className="px-3 py-3.5">
                    {row.issue ? (
                      <span className="rounded-full border border-[#D6A85B]/30 bg-[#D6A85B]/10 px-2 py-0.5 text-[11px] text-[#D6A85B]">
                        {row.issue}
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#f2f0eb]/42">-</span>
                    )}
                  </td>
                  <td className="px-3 py-3.5 text-[#f2f0eb]/80">{row.model}</td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-24">
                        <Sparkline points={row.sparkline} danger={row.status === 'Critical'} />
                      </div>
                      <ChevronRight className="size-3.5 text-[#f2f0eb]/42" />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
