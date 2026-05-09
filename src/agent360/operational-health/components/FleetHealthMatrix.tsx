import { useMemo, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { FleetMatrixAgentInfo } from '../../components/FleetMatrixAgentInfo'
import { SortableHeader } from '../../../components/SortableHeader'
import { nextSortState, sortRows, type SortState } from '../../../utils/tableSorting'
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
  type SortKey =
    | 'name'
    | 'facing'
    | 'status'
    | 'traffic'
    | 'latencyP95'
    | 'errorRate'
    | 'availability'
    | 'toolFailures'
    | 'issue'
    | 'model'
    | 'sparkline'
  const [sortConfig, setSortConfig] = useState<SortState<SortKey>>({
    key: 'name',
    direction: 'asc',
  })
  const sortedRows = useMemo(
    () =>
      sortRows(rows, sortConfig, (row, key) => {
        if (key === 'sparkline') return row.sparkline[row.sparkline.length - 1] ?? null
        if (key === 'issue') return row.issue ?? null
        return row[key]
      }),
    [rows, sortConfig],
  )

  const headers: { label: string; key: SortKey }[] = [
    { label: 'Agent', key: 'name' },
    { label: 'Facing', key: 'facing' },
    { label: 'Status', key: 'status' },
    { label: 'Traffic', key: 'traffic' },
    { label: 'p95 Latency', key: 'latencyP95' },
    { label: 'Error Rate', key: 'errorRate' },
    { label: 'Availability', key: 'availability' },
    { label: 'Tool Failures', key: 'toolFailures' },
    { label: 'Issue', key: 'issue' },
    { label: 'Model', key: 'model' },
    { label: 'Load Trend', key: 'sparkline' },
  ]

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 md:p-4">
      <header className="mb-3 flex items-end justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#f2f0eb]/42">Fleet Overview</p>
          <h2 className="mt-1 text-lg font-semibold text-[#f2f0eb]">Fleet Health Matrix</h2>
        </div>
        <p className="text-[12px] text-[#f2f0eb]/60">Click a row to open investigation drawer</p>
      </header>
      <div className="overflow-x-auto overflow-y-visible rounded-xl border border-white/[0.07]">
        <table className="min-w-[1020px] w-full text-left text-[13px]">
          <thead className="sticky top-0 z-10 bg-[#1f1f28]/95 text-[#f2f0eb]/65 backdrop-blur-xl">
            <tr className="border-b border-white/[0.07]">
              {headers.map((header) => (
                <th key={header.key} className="px-3 py-2.5 font-medium uppercase tracking-[0.16em]">
                  <SortableHeader
                    label={header.label}
                    active={sortConfig.key === header.key}
                    direction={sortConfig.key === header.key ? sortConfig.direction : null}
                    onClick={() => setSortConfig((current) => nextSortState(current, header.key))}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row) => {
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
                  <td className="px-3 py-3">
                    <FleetMatrixAgentInfo name={row.name} tooltip={row.purpose} />
                  </td>
                  <td className="px-3 py-3 text-[#f2f0eb]/75">{row.facing}</td>
                  <td className="px-3 py-3">
                    <HealthPill status={row.status} />
                  </td>
                  <td className="px-3 py-3 font-medium text-[#f2f0eb]">{row.traffic}</td>
                  <td className="px-3 py-3 text-[#f2f0eb]">{row.latencyP95}</td>
                  <td className="px-3 py-3 text-[#f2f0eb]">{row.errorRate}</td>
                  <td className="px-3 py-3 text-[#f2f0eb]">{row.availability}</td>
                  <td className="px-3 py-3 text-[#f2f0eb]">{row.toolFailures}</td>
                  <td className="px-3 py-3">
                    {row.issue ? (
                      <span className="inline-flex max-w-[180px] items-center truncate whitespace-nowrap rounded-full border border-[#D6A85B]/30 bg-[#D6A85B]/10 px-2.5 py-1 text-[11px] leading-none text-[#D6A85B]">
                        {row.issue}
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#f2f0eb]/42">-</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-[#f2f0eb]/80">{row.model}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24">
                        <Sparkline
                          points={row.sparkline}
                          danger={row.status === 'Critical'}
                          className="h-6 w-full"
                        />
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
