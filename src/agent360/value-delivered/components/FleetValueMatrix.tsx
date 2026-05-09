import { useMemo, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { FleetMatrixAgentInfo } from '../../components/FleetMatrixAgentInfo'
import { SortableHeader } from '../../../components/SortableHeader'
import { nextSortState, sortRows, type SortState } from '../../../utils/tableSorting'
import type { FleetValueRow } from '../data'
import { AdoptionIndicator, ValueSparkline } from './shared'

type FleetValueMatrixProps = {
  rows: FleetValueRow[]
  selectedAgentId: string | null
  onSelectAgent: (agentId: string) => void
}

export function FleetValueMatrix({ rows, selectedAgentId, onSelectAgent }: FleetValueMatrixProps) {
  type SortKey =
    | 'agent'
    | 'primaryOutcome'
    | 'timeSaved'
    | 'ticketsAvoided'
    | 'productivityGain'
    | 'revenueInfluence'
    | 'adoptionScore'
    | 'estimatedValue'
    | 'valueScore'

  const [sortConfig, setSortConfig] = useState<SortState<SortKey>>({
    key: 'valueScore',
    direction: 'desc',
  })

  const sortedRows = useMemo(
    () =>
      sortRows(rows, sortConfig, (row, key) => {
        if (key === 'adoptionScore' || key === 'valueScore') return row[key]
        return row[key]
      }),
    [rows, sortConfig],
  )

  const headers: { label: string; key: SortKey }[] = [
    { label: 'Agent', key: 'agent' },
    { label: 'Primary Outcome', key: 'primaryOutcome' },
    { label: 'Time Saved', key: 'timeSaved' },
    { label: 'Tickets Avoided', key: 'ticketsAvoided' },
    { label: 'Productivity', key: 'productivityGain' },
    { label: 'Revenue Influence', key: 'revenueInfluence' },
    { label: 'Adoption', key: 'adoptionScore' },
    { label: 'Value Generated', key: 'estimatedValue' },
    { label: 'Trend', key: 'valueScore' },
  ]

  return (
    <section className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-3 md:p-4">
      <header className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#f2f0eb]/42">Fleet Value Matrix</p>
          <h2 className="mt-1 text-lg font-semibold text-[#f2f0eb]">Which agents create value worth scaling?</h2>
        </div>
        <p className="text-[12px] text-[#f2f0eb]/55">Row → value investigation</p>
      </header>

      <div className="overflow-x-auto overflow-y-visible rounded-2xl border border-white/[0.07]">
        <table className="min-w-[1220px] w-full text-left text-[13px]">
          <thead className="sticky top-0 z-10 bg-[#1f1f28]/95 text-[#f2f0eb]/65 backdrop-blur-xl">
            <tr className="border-b border-white/[0.07]">
              {headers.map((header) => (
                <th key={header.key} className="px-3 py-3 font-medium uppercase tracking-[0.16em]">
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
                  className={`cursor-pointer border-b border-white/[0.05] transition duration-200 ${
                    selected
                      ? 'bg-[#5DC2A8]/[0.10] shadow-[inset_0_0_0_1px_rgba(93,194,168,0.34)]'
                      : 'hover:bg-white/[0.035]'
                  }`}
                >
                  <td className="px-3 py-4">
                    <FleetMatrixAgentInfo name={row.agent} tooltip={row.purpose} />
                  </td>
                  <td className="px-3 py-4">
                    <span className="inline-flex rounded-full border border-[#5DC2A8]/25 bg-[#5DC2A8]/10 px-2.5 py-1 text-[11px] text-[#5DC2A8]">
                      {row.primaryOutcome}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 font-medium tabular-nums text-[#f2f0eb]">{row.timeSaved}</td>
                  <td className="whitespace-nowrap px-3 py-4 tabular-nums text-[#f2f0eb]/82">{row.ticketsAvoided}</td>
                  <td className="whitespace-nowrap px-3 py-4 tabular-nums text-[#3DD68C]">{row.productivityGain}</td>
                  <td className="whitespace-nowrap px-3 py-4 tabular-nums text-[#f2f0eb]/82">{row.revenueInfluence}</td>
                  <td className="px-3 py-4">
                    <AdoptionIndicator score={row.adoptionScore} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-[14px] font-semibold tabular-nums text-[#f2f0eb]">
                    {row.estimatedValue}
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-24 rounded-md bg-white/[0.015] px-0.5">
                        <ValueSparkline points={row.sparkline} className="h-full w-full" />
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
