import { useMemo, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { SortableHeader } from '../../../components/SortableHeader'
import { nextSortState, sortRows, type SortState } from '../../../utils/tableSorting'
import type { ConversationTrustRow } from '../data'
import { StatusBadge } from '../../components/StatusBadge'
import { ExplainMetricPopover } from './ExplainMetricPopover'

type ConversationExplorerProps = {
  rows: ConversationTrustRow[]
  onSelectConversation: (conversationId: string) => void
}

function impactTone(impact: ConversationTrustRow['trustImpact']) {
  if (impact === 'Positive') return 'healthy'
  if (impact === 'Neutral') return 'neutral'
  return 'critical'
}

function statusTone(status: ConversationTrustRow['status']) {
  if (status === 'Resolved') return 'healthy'
  if (status === 'Reviewed') return 'watch'
  return 'critical'
}

export function ConversationExplorer({ rows, onSelectConversation }: ConversationExplorerProps) {
  type SortKey = 'agent' | 'userIntent' | 'outcome' | 'trustImpact' | 'humanIntervention' | 'status'
  const [sortConfig, setSortConfig] = useState<SortState<SortKey>>({
    key: 'status',
    direction: 'asc',
  })
  const sortedRows = useMemo(
    () => sortRows(rows, sortConfig, (row, key) => row[key]),
    [rows, sortConfig],
  )
  const headers: { label: string; key: SortKey; explainKey: string }[] = [
    { label: 'Agent', key: 'agent', explainKey: 'conversation-explorer-agent' },
    { label: 'What happened', key: 'userIntent', explainKey: 'conversation-explorer-what-happened' },
    { label: 'Outcome', key: 'outcome', explainKey: 'conversation-explorer-outcome' },
    { label: 'Trust', key: 'trustImpact', explainKey: 'conversation-explorer-trust' },
    { label: 'Human signal', key: 'humanIntervention', explainKey: 'conversation-explorer-human-signal' },
    { label: 'Status', key: 'status', explainKey: 'conversation-explorer-status' },
  ]

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 md:p-4">
      <header className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#f2f0eb]/42">Incidents</p>
          <div className="mt-1 flex items-center gap-1">
            <h2 className="text-lg font-semibold text-[#f2f0eb]">Conversation trust</h2>
            <ExplainMetricPopover explainKey="section-conversation-trust" className="shrink-0" />
          </div>
        </div>
        <p className="text-[11px] text-[#f2f0eb]/50">Row → investigation</p>
      </header>
      <div className="overflow-x-auto overflow-y-visible rounded-xl border border-white/[0.07]">
        <table className="min-w-[920px] w-full text-left text-[13px]">
          <thead className="sticky top-0 z-10 bg-[#1f1f28]/95 text-[#f2f0eb]/65 backdrop-blur-xl">
            <tr className="border-b border-white/[0.07]">
              {headers.map((header) => (
                <th key={header.key} className="px-3 py-2.5 font-medium uppercase tracking-[0.14em]">
                  <div className="flex items-center gap-0.5">
                    <SortableHeader
                      label={header.label}
                      active={sortConfig.key === header.key}
                      direction={sortConfig.key === header.key ? sortConfig.direction : null}
                      onClick={() => setSortConfig((current) => nextSortState(current, header.key))}
                    />
                    <ExplainMetricPopover explainKey={header.explainKey} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onSelectConversation(row.id)}
                className="cursor-pointer border-b border-white/[0.05] transition hover:bg-white/[0.035]"
              >
                <td className="whitespace-nowrap px-3 py-2.5 text-[#f2f0eb]/90">{row.agent}</td>
                <td className="max-w-[200px] px-3 py-2.5 font-medium text-[#f2f0eb]">{row.userIntent}</td>
                <td className="max-w-[220px] px-3 py-2.5 text-[12px] text-[#f2f0eb]/75">{row.outcome}</td>
                <td className="px-3 py-2.5">
                  <StatusBadge label={row.trustImpact} tone={impactTone(row.trustImpact)} />
                </td>
                <td className="max-w-[200px] px-3 py-2.5 text-[12px] text-[#f2f0eb]/72">{row.humanIntervention}</td>
                <td className="px-3 py-2.5">
                  <div className="inline-flex items-center gap-2">
                    <StatusBadge label={row.status} tone={statusTone(row.status)} />
                    <ChevronRight className="size-3.5 text-[#f2f0eb]/42" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
