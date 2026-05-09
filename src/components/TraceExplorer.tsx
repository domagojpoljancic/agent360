import { Fragment, useMemo, useState } from 'react'
import type { TraceRow } from '../data/mockData'
import { StatusBadge } from './StatusBadge'
import { SortableHeader } from './SortableHeader'
import { nextSortState, sortRows, type SortState } from '../utils/tableSorting'

type TraceExplorerProps = {
  traces: TraceRow[]
  selectedTraceId: string
  onSelectTrace: (id: string) => void
}

const statusTone = {
  Success: 'success',
  Warning: 'warning',
  Failed: 'failed',
  Escalated: 'escalated',
} as const

export function TraceExplorer({ traces, selectedTraceId, onSelectTrace }: TraceExplorerProps) {
  type SortKey = 'timestamp' | 'agent' | 'intent' | 'latency' | 'model' | 'status' | 'cost' | 'id'
  const [sortConfig, setSortConfig] = useState<SortState<SortKey>>({
    key: 'timestamp',
    direction: 'desc',
  })
  const sortedTraces = useMemo(
    () => sortRows(traces, sortConfig, (trace, key) => trace[key]),
    [traces, sortConfig],
  )

  const headers: { label: string; key: SortKey }[] = [
    { label: 'Timestamp', key: 'timestamp' },
    { label: 'Agent', key: 'agent' },
    { label: 'User Intent', key: 'intent' },
    { label: 'Latency', key: 'latency' },
    { label: 'Model', key: 'model' },
    { label: 'Status', key: 'status' },
    { label: 'Cost', key: 'cost' },
    { label: 'Trace ID', key: 'id' },
  ]

  if (!traces.length) {
    return (
      <section className="rounded-2xl border border-slate-700/60 bg-slate-900/45 p-5 text-center text-sm text-slate-300">
        No traces match your current search.
      </section>
    )
  }

  return (
    <section className="rounded-2xl border border-slate-700/60 bg-slate-900/45 p-4 shadow-2xl backdrop-blur-md">
      <header className="mb-3">
        <h3 className="text-sm font-semibold text-slate-100">Trace Explorer Preview</h3>
        <p className="text-xs text-slate-400">Recent session traces with selected context details</p>
      </header>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400">
              {headers.map((header) => (
                <th key={header.key} className="pb-2 font-medium">
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
            {sortedTraces.map((trace) => {
              const isSelected = trace.id === selectedTraceId
              return (
                <Fragment key={trace.id}>
                  <tr
                    onClick={() => onSelectTrace(trace.id)}
                    className={`cursor-pointer border-b border-slate-800/80 transition hover:bg-slate-800/40 ${
                      isSelected ? 'bg-cyan-500/10' : ''
                    }`}
                  >
                    <td className="py-2 text-slate-200">{trace.timestamp}</td>
                    <td className="py-2 text-slate-200">{trace.agent}</td>
                    <td className="py-2 text-slate-300">{trace.intent}</td>
                    <td className="py-2 text-slate-300">{trace.latency}</td>
                    <td className="py-2 text-slate-300">{trace.model}</td>
                    <td className="py-2">
                      <StatusBadge label={trace.status} tone={statusTone[trace.status]} />
                    </td>
                    <td className="py-2 text-slate-300">{trace.cost}</td>
                    <td className="py-2 font-mono text-slate-400">{trace.id}</td>
                  </tr>
                  {isSelected ? (
                    <tr className="border-b border-slate-700/80 bg-slate-950/55">
                      <td colSpan={8} className="p-3">
                        <div className="grid gap-2 text-xs text-slate-300 md:grid-cols-5">
                          <p>
                            <span className="text-slate-500">Prompt:</span> {trace.promptVersion}
                          </p>
                          <p>
                            <span className="text-slate-500">Tool Calls:</span> {trace.toolCalls}
                          </p>
                          <p>
                            <span className="text-slate-500">Retrieved Context:</span> {trace.retrievedContext}
                          </p>
                          <p>
                            <span className="text-slate-500">Evaluation:</span> {trace.evaluation}
                          </p>
                          <p>
                            <span className="text-slate-500">Root Cause Hint:</span> {trace.rootCause}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
