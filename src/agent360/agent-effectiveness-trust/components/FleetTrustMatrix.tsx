import { useMemo, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { FleetMatrixAgentInfo } from '../../components/FleetMatrixAgentInfo'
import { SortableHeader } from '../../../components/SortableHeader'
import { nextSortState, sortRows, type SortState } from '../../../utils/tableSorting'
import { operationalHealthData, type FacingType } from '../../operational-health/data'
import type { FleetTrustRow } from '../data'
import { ConfidenceIndicator, Sparkline, TrustBadge } from './shared'
import { ExplainMetricPopover } from './ExplainMetricPopover'

type FleetTrustMatrixProps = {
  rows: FleetTrustRow[]
  selectedAgentId: string | null
  onSelectAgent: (agentId: string) => void
}

export function FleetTrustMatrix({ rows, selectedAgentId, onSelectAgent }: FleetTrustMatrixProps) {
  type SortKey =
    | 'agent'
    | 'facing'
    | 'trustScore'
    | 'taskSuccess'
    | 'retryClarification'
    | 'escalations'
    | 'trustedResponses'
    | 'userSatisfaction'
    | 'highConfidenceFails'
    | 'status'
    | 'signal'
    | 'trustTrend'
  const [sortConfig, setSortConfig] = useState<SortState<SortKey>>({
    key: 'trustScore',
    direction: 'desc',
  })

  const agentPurposeById = useMemo(() => {
    const map = new Map<string, string>()
    for (const r of operationalHealthData['24h'].fleetRows) {
      map.set(r.id, r.purpose)
    }
    return map
  }, [])

  /** Same `facing` values as Fleet Health Matrix (Operational Health). */
  const facingByAgentId = useMemo(() => {
    const map = new Map<string, FacingType>()
    for (const r of operationalHealthData['24h'].fleetRows) {
      map.set(r.id, r.facing)
    }
    return map
  }, [])

  const sortedRows = useMemo(
    () =>
      sortRows(rows, sortConfig, (row, key) => {
        if (key === 'trustTrend') return row.trustTrend[row.trustTrend.length - 1] ?? null
        if (key === 'facing') return facingByAgentId.get(row.id) ?? null
        return row[key as keyof FleetTrustRow]
      }),
    [rows, sortConfig, facingByAgentId],
  )

  const headers: { label: string; key: SortKey; explainKey?: string }[] = [
    { label: 'Agent', key: 'agent' },
    { label: 'Facing', key: 'facing' },
    { label: 'Index', key: 'trustScore', explainKey: 'operational-trust-index' },
    { label: 'Task OK', key: 'taskSuccess', explainKey: 'task-success' },
    { label: 'Retry+', key: 'retryClarification', explainKey: 'retry-clarification' },
    { label: 'Escal.', key: 'escalations', explainKey: 'escalation-rate' },
    { label: 'Trusted', key: 'trustedResponses', explainKey: 'trusted-responses' },
    { label: 'CSAT', key: 'userSatisfaction', explainKey: 'user-satisfaction' },
    { label: 'Hi-conf', key: 'highConfidenceFails', explainKey: 'high-confidence-fails' },
    { label: 'Status', key: 'status' },
    { label: 'Friction', key: 'signal' },
    { label: 'Trend', key: 'trustTrend' },
  ]

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 md:p-4">
      <header className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#f2f0eb]/42">Fleet</p>
          <div className="mt-1 flex items-center gap-1">
            <h2 className="text-lg font-semibold text-[#f2f0eb]">Trust matrix</h2>
            <ExplainMetricPopover explainKey="section-trust-matrix" className="shrink-0" />
          </div>
        </div>
        <p className="text-[11px] text-[#f2f0eb]/50">Row → investigation</p>
      </header>
      <div className="overflow-x-auto overflow-y-visible rounded-xl border border-white/[0.07]">
        <table className="min-w-[1280px] w-full text-left text-[13px]">
          <thead className="sticky top-0 z-10 bg-[#1f1f28]/95 text-[#f2f0eb]/65 backdrop-blur-xl">
            <tr className="border-b border-white/[0.07]">
              {headers.map((header) => (
                <th key={header.key} className="px-3 py-2.5 font-medium uppercase tracking-[0.16em]">
                  <div className="flex items-center gap-0.5">
                    <SortableHeader
                      label={header.label}
                      active={sortConfig.key === header.key}
                      direction={sortConfig.key === header.key ? sortConfig.direction : null}
                      onClick={() => setSortConfig((current) => nextSortState(current, header.key))}
                    />
                    {header.explainKey ? <ExplainMetricPopover explainKey={header.explainKey} /> : null}
                  </div>
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
                      ? 'bg-[#9aa6f0]/[0.12] shadow-[inset_0_0_0_1px_rgba(154,166,240,0.35)]'
                      : 'hover:bg-white/[0.035]'
                  }`}
                >
                  <td className="px-3 py-3">
                    <FleetMatrixAgentInfo
                      name={row.agent}
                      tooltip={agentPurposeById.get(row.id) ?? row.signal}
                    />
                  </td>
                  <td className="px-3 py-3 text-[#f2f0eb]/75">{facingByAgentId.get(row.id) ?? '—'}</td>
                  <td className="px-3 py-3">
                    <ConfidenceIndicator score={row.trustScore} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 tabular-nums text-[#f2f0eb]">{row.taskSuccess}</td>
                  <td className="whitespace-nowrap px-3 py-3 tabular-nums text-[#f2f0eb]">{row.retryClarification}</td>
                  <td className="whitespace-nowrap px-3 py-3 tabular-nums text-[#f2f0eb]">{row.escalations}</td>
                  <td className="whitespace-nowrap px-3 py-3 tabular-nums text-[#f2f0eb]">{row.trustedResponses}</td>
                  <td className="whitespace-nowrap px-3 py-3 tabular-nums text-[#f2f0eb]">
                    {row.userSatisfaction}
                    <span className="text-[#f2f0eb]/45">/5</span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 tabular-nums text-[#f2f0eb]/85">{row.highConfidenceFails}</td>
                  <td className="px-3 py-3">
                    <TrustBadge status={row.status} />
                  </td>
                  <td className="px-3 py-3">
                    {row.issue ? (
                      <span className="inline-flex max-w-[140px] items-center truncate whitespace-nowrap rounded-full border border-[#D6A85B]/30 bg-[#D6A85B]/10 px-2 py-0.5 text-[10px] leading-none text-[#D6A85B]">
                        {row.issue}
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#f2f0eb]/65">{row.signal}</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-24">
                        <Sparkline
                          points={row.trustTrend}
                          danger={row.status === 'At Risk'}
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
