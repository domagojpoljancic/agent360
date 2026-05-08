import { Fragment } from 'react'
import type { TraceRow } from '../data/mockData'
import { StatusBadge } from './StatusBadge'

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
              <th className="pb-2 font-medium">Timestamp</th>
              <th className="pb-2 font-medium">Agent</th>
              <th className="pb-2 font-medium">User Intent</th>
              <th className="pb-2 font-medium">Latency</th>
              <th className="pb-2 font-medium">Model</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Cost</th>
              <th className="pb-2 font-medium">Trace ID</th>
            </tr>
          </thead>
          <tbody>
            {traces.map((trace) => {
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
