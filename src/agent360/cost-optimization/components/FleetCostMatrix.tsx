import { useMemo, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { FleetMatrixAgentInfo } from '../../components/FleetMatrixAgentInfo'
import { SortableHeader } from '../../../components/SortableHeader'
import { nextSortState, sortRows, type SortState } from '../../../utils/tableSorting'
import type { AgentCostRow } from '../data'
import { SparkChart } from '../../components/charts'

type FleetCostMatrixProps = {
  rows: AgentCostRow[]
  selectedAgentId: string | null
  onSelectAgent: (agentId: string) => void
}

export function FleetCostMatrix({ rows, selectedAgentId, onSelectAgent }: FleetCostMatrixProps) {
  type SortKey =
    | 'name'
    | 'facing'
    | 'totalSpend'
    | 'costPerConversation'
    | 'costPerSuccessfulOutcome'
    | 'premiumModelShare'
    | 'routingEfficiency'
    | 'savingsOpportunity'
    | 'valueToCost'
    | 'recommendation'
    | 'sparkline'

  const [sortConfig, setSortConfig] = useState<SortState<SortKey>>({
    key: 'totalSpend',
    direction: 'desc',
  })

  const sortedRows = useMemo(
    () =>
      sortRows(rows, sortConfig, (row, key) => {
        if (key === 'sparkline') return row.sparkline[row.sparkline.length - 1] ?? null
        if (key === 'totalSpend' || key === 'savingsOpportunity') {
          return row[key].replace(/[€,k]/g, '').trim()
        }
        if (
          key === 'costPerConversation' ||
          key === 'costPerSuccessfulOutcome' ||
          key === 'premiumModelShare' ||
          key === 'routingEfficiency'
        ) {
          return row[key].replace('€', '').replace('%', '').trim()
        }
        if (key === 'valueToCost') return row.valueToCost.replace('x', '').trim()
        return row[key as keyof AgentCostRow] as unknown
      }),
    [rows, sortConfig],
  )

  const headers: { label: string; key: SortKey }[] = [
    { label: 'Agent', key: 'name' },
    { label: 'Facing', key: 'facing' },
    { label: 'Total Spend', key: 'totalSpend' },
    { label: 'Cost / Conversation', key: 'costPerConversation' },
    { label: 'Cost / Successful Outcome', key: 'costPerSuccessfulOutcome' },
    { label: 'Premium Model Share', key: 'premiumModelShare' },
    { label: 'Routing Efficiency', key: 'routingEfficiency' },
    { label: 'Savings Opportunity', key: 'savingsOpportunity' },
    { label: 'Value-to-Cost', key: 'valueToCost' },
    { label: 'Recommendation', key: 'recommendation' },
    { label: 'Trend', key: 'sparkline' },
  ]

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 md:p-4">
      <header className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#f2f0eb]/42">Fleet Overview</p>
          <h2 className="mt-1 text-lg font-semibold text-[#f2f0eb]">Fleet Cost Matrix</h2>
          <p className="mt-1 max-w-2xl text-[12px] text-[#f2f0eb]/58">
            Compare every agent by spend, efficiency, routing behavior, and optimization potential.
          </p>
        </div>
        <p className="text-[12px] text-[#f2f0eb]/60">Click a row to open cost investigation</p>
      </header>
      <div className="overflow-x-auto overflow-y-visible rounded-xl border border-white/[0.07]">
        <table className="min-w-[1320px] w-full text-left text-[13px]">
          <thead className="sticky top-0 z-10 bg-[#1f1f28]/95 text-[#f2f0eb]/65 backdrop-blur-xl">
            <tr className="border-b border-white/[0.07]">
              {headers.map((header) => (
                <th key={header.key} className="px-3 py-2.5 font-medium uppercase tracking-[0.14em]">
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
                      ? 'bg-[#D6A85B]/[0.08] shadow-[inset_0_0_0_1px_rgba(214,168,91,0.28)]'
                      : 'hover:bg-white/[0.035]'
                  }`}
                >
                  <td className="px-3 py-3">
                    <FleetMatrixAgentInfo name={row.name} tooltip={row.purpose} />
                  </td>
                  <td className="px-3 py-3 text-[#f2f0eb]/75">{row.facing}</td>
                  <td className="px-3 py-3 font-medium text-[#f2f0eb]">{row.totalSpend}</td>
                  <td className="px-3 py-3 text-[#f2f0eb]">{row.costPerConversation}</td>
                  <td className="px-3 py-3 text-[#f2f0eb]">{row.costPerSuccessfulOutcome}</td>
                  <td className="px-3 py-3 text-[#f2f0eb]">{row.premiumModelShare}</td>
                  <td className="px-3 py-3 text-[#f2f0eb]">{row.routingEfficiency}</td>
                  <td className="px-3 py-3 text-[#D6A85B]">{row.savingsOpportunity}</td>
                  <td className="px-3 py-3 font-medium text-[#5DC2A8]">{row.valueToCost}</td>
                  <td className="px-3 py-3">
                    <span className="inline-flex max-w-[220px] items-start rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-[11px] leading-snug text-[#f2f0eb]/80">
                      {row.recommendation}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24">
                        <SparkChart
                          points={row.sparkline}
                          danger={row.efficiencyStatus === 'Critical'}
                          tone="cost-optimization"
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
