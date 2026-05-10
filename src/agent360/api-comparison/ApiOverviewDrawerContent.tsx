import { useEffect, useMemo, useState } from 'react'
import { Activity, GitBranch, Users, Workflow } from 'lucide-react'
import { SortableHeader } from '../../components/SortableHeader'
import { nextSortState, sortRows, type SortState } from '../../utils/tableSorting'
import { Sparkline, MetricChip } from '../operational-health/components/shared'
import type { ApiComparisonRow } from './data'
import type { ApiEndpointMetric, ApiTimelineEvent } from './detailTypes'

type EndpointSortKey =
  | 'path'
  | 'avgLatency'
  | 'p95Latency'
  | 'errorRate'
  | 'timeoutRate'
  | 'requestsPerMin'
  | 'retryRate'
  | 'availability'
  | 'lastIncident'
  | 'operationalStatus'

function endpointStatusDotClass(status: ApiEndpointMetric['operationalStatus']): string {
  if (status === 'Healthy') return 'bg-[#3DD68C] shadow-[0_0_6px_rgba(61,214,140,0.45)]'
  if (status === 'Degraded') return 'bg-[#D6A85B] shadow-[0_0_6px_rgba(214,168,91,0.4)]'
  return 'bg-[#E07a83] shadow-[0_0_6px_rgba(224,122,131,0.45)]'
}

function severityBadgeClass(label: ApiEndpointMetric['severityLabel']): string {
  if (label === 'OK') return 'border-[#3DD68C]/35 bg-[#3DD68C]/10 text-[#3DD68C]'
  if (label === 'Watch') return 'border-[#D6A85B]/35 bg-[#D6A85B]/10 text-[#D6A85B]'
  return 'border-[#E07a83]/35 bg-[#E07a83]/10 text-[#E07a83]'
}

function stabilityClass(s: ApiComparisonRow['operationalStability']): string {
  if (s === 'Excellent') return 'border-[#3DD68C]/35 bg-[#3DD68C]/10 text-[#3DD68C]'
  if (s === 'Strong') return 'border-[#3694fc]/35 bg-[#3694fc]/10 text-[#8abefc]'
  if (s === 'Moderate') return 'border-[#D6A85B]/35 bg-[#D6A85B]/10 text-[#D6A85B]'
  return 'border-[#E07a83]/35 bg-[#E07a83]/10 text-[#E07a83]'
}

function criticalityClass(c: ApiComparisonRow['detail']['dependencyOverview']['criticality']): string {
  if (c === 'Critical') return 'border-[#E07a83]/35 bg-[#E07a83]/10 text-[#E07a83]'
  if (c === 'High') return 'border-[#D6A85B]/35 bg-[#D6A85B]/10 text-[#D6A85B]'
  return 'border-white/[0.12] bg-white/[0.04] text-[#f2f0eb]/75'
}

function timelineToneClass(t: ApiTimelineEvent['tone']): string {
  if (t === 'critical') return 'border-[#E07a83]/30 bg-[#E07a83]/08'
  if (t === 'warning') return 'border-[#D6A85B]/30 bg-[#D6A85B]/08'
  if (t === 'positive') return 'border-[#3DD68C]/25 bg-[#3DD68C]/06'
  return 'border-white/[0.08] bg-white/[0.02]'
}

function RuntimeCompositionBar({
  breakdown,
}: {
  breakdown: ApiComparisonRow['detail']['runtimeBreakdown']
}) {
  const segments = [
    { label: 'Network', pct: breakdown.network, className: 'bg-[#3694fc]/85' },
    { label: 'Processing', pct: breakdown.processing, className: 'bg-[#6b8ce8]/85' },
    { label: 'Auth', pct: breakdown.authOverhead, className: 'bg-[#D6A85B]/85' },
    { label: 'Retries', pct: breakdown.retryOverhead, className: 'bg-[#c49fd4]/80' },
    { label: 'Fallback', pct: breakdown.fallbackExecution, className: 'bg-[#3DD68C]/55' },
  ]
  return (
    <div>
      <div className="flex h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
        {segments.map((s) => (
          <div
            key={s.label}
            title={`${s.label}: ${s.pct}`}
            className={`h-full min-w-[3px] transition-all ${s.className}`}
            style={{ width: s.pct }}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[#f2f0eb]/55">
        {segments.map((s) => (
          <span key={s.label} className="inline-flex items-center gap-1">
            <span className={`size-1.5 rounded-sm ${s.className}`} />
            {s.label} {s.pct}
          </span>
        ))}
      </div>
    </div>
  )
}

export function ApiOverviewDrawerContent({ row }: { row: ApiComparisonRow }) {
  const { detail } = row
  const [sortConfig, setSortConfig] = useState<SortState<EndpointSortKey>>({
    key: 'p95Latency',
    direction: 'desc',
  })

  useEffect(() => {
    setSortConfig({ key: 'p95Latency', direction: 'desc' })
  }, [row.id])

  const sortedEndpoints = useMemo(
    () => sortRows(detail.endpoints, sortConfig, (ep, key) => ep[key]),
    [detail.endpoints, sortConfig],
  )

  const dep = detail.dependencyOverview

  return (
    <>
      <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
        <p className="mb-1 text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Agent tool runtime</p>
        <p className="text-[11px] leading-relaxed text-[#f2f0eb]/78">{detail.agentToolingContext}</p>
      </div>

      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-5">
        <MetricChip label="Avg latency" value={row.avgLatency} />
        <MetricChip label="Availability" value={row.availability} />
        <MetricChip label="Error rate" value={row.errorRate} />
        <MetricChip label="Retry rate" value={row.retryRate} />
        <MetricChip label="Rate limits" value={row.rateLimitFrequency} />
      </div>

      <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
        <p className="mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">
          <GitBranch className="size-3.5 text-[#3694fc]" />
          Dependency graph
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium ${criticalityClass(dep.criticality)}`}
          >
            {dep.criticality} dependency
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-white/[0.1] bg-white/[0.02] px-2 py-1 text-[11px] text-[#f2f0eb]/75">
            <Users className="size-3 text-[#f2f0eb]/50" />
            {dep.productionAgentCount} production agents
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-white/[0.1] bg-white/[0.02] px-2 py-1 text-[11px] text-[#f2f0eb]/75">
            <Workflow className="size-3 text-[#f2f0eb]/50" />
            {dep.workflowCount} workflows
          </span>
          <span className="inline-flex items-center gap-1 rounded-md border border-white/[0.1] bg-white/[0.02] px-2 py-1 text-[11px] text-[#f2f0eb]/75">
            {dep.volumeClass}
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] ${
              dep.fallbackEnabled
                ? 'border-[#3DD68C]/30 bg-[#3DD68C]/08 text-[#3DD68C]'
                : 'border-white/[0.1] bg-white/[0.02] text-[#f2f0eb]/55'
            }`}
          >
            {dep.fallbackEnabled ? 'Fallback enabled' : 'No fallback'}
          </span>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-[#f2f0eb]/42">Primary workflows</p>
            <ul className="mt-1.5 space-y-1 text-[11px] text-[#f2f0eb]/72">
              {dep.primaryWorkflows.map((w) => (
                <li key={w} className="flex gap-1.5">
                  <span className="text-[#3694fc]/80">→</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-[#f2f0eb]/42">Agent consumers</p>
            <div className="mt-1.5 flex flex-wrap gap-1">
              {dep.agentNames.map((a) => (
                <span
                  key={a}
                  className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[10px] text-[#f2f0eb]/72"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>
        {dep.notes.length > 0 ? (
          <ul className="mt-2 space-y-1 border-t border-white/[0.06] pt-2 text-[10px] text-[#f2f0eb]/58">
            {dep.notes.map((n) => (
              <li key={n}>• {n}</li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
        <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Runtime breakdown</p>
        <p className="mb-2 text-[10px] text-[#f2f0eb]/55">
          Estimated share of agent-perceived latency (network, provider processing, auth, retries, fallback execution).
        </p>
        <RuntimeCompositionBar breakdown={detail.runtimeBreakdown} />
      </div>

      <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
        <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Endpoint telemetry</p>
        <div className="overflow-x-auto rounded-lg border border-white/[0.06]">
          <table className="w-full min-w-[920px] text-left text-[10px]">
            <thead className="bg-[#1f1f28]/90 text-[#f2f0eb]/60">
              <tr className="border-b border-white/[0.06]">
                <th className="px-2 py-2 font-medium uppercase tracking-[0.12em]"> </th>
                <th className="px-2 py-2 font-medium uppercase tracking-[0.12em]">
                  <SortableHeader
                    label="Endpoint"
                    active={sortConfig.key === 'path'}
                    direction={sortConfig.key === 'path' ? sortConfig.direction : null}
                    onClick={() => setSortConfig((c) => nextSortState(c, 'path'))}
                  />
                </th>
                <th className="px-2 py-2 font-medium uppercase tracking-[0.12em]">
                  <SortableHeader
                    label="Status"
                    active={sortConfig.key === 'operationalStatus'}
                    direction={sortConfig.key === 'operationalStatus' ? sortConfig.direction : null}
                    onClick={() => setSortConfig((c) => nextSortState(c, 'operationalStatus'))}
                  />
                </th>
                <th className="px-2 py-2 font-medium uppercase tracking-[0.12em]">
                  <SortableHeader
                    label="Avg"
                    active={sortConfig.key === 'avgLatency'}
                    direction={sortConfig.key === 'avgLatency' ? sortConfig.direction : null}
                    onClick={() => setSortConfig((c) => nextSortState(c, 'avgLatency'))}
                  />
                </th>
                <th className="px-2 py-2 font-medium uppercase tracking-[0.12em]">
                  <SortableHeader
                    label="p95"
                    active={sortConfig.key === 'p95Latency'}
                    direction={sortConfig.key === 'p95Latency' ? sortConfig.direction : null}
                    onClick={() => setSortConfig((c) => nextSortState(c, 'p95Latency'))}
                  />
                </th>
                <th className="px-2 py-2 font-medium uppercase tracking-[0.12em]">
                  <SortableHeader
                    label="Err"
                    active={sortConfig.key === 'errorRate'}
                    direction={sortConfig.key === 'errorRate' ? sortConfig.direction : null}
                    onClick={() => setSortConfig((c) => nextSortState(c, 'errorRate'))}
                  />
                </th>
                <th className="px-2 py-2 font-medium uppercase tracking-[0.12em]">
                  <SortableHeader
                    label="T/O"
                    active={sortConfig.key === 'timeoutRate'}
                    direction={sortConfig.key === 'timeoutRate' ? sortConfig.direction : null}
                    onClick={() => setSortConfig((c) => nextSortState(c, 'timeoutRate'))}
                  />
                </th>
                <th className="px-2 py-2 font-medium uppercase tracking-[0.12em]">
                  <SortableHeader
                    label="RPM"
                    active={sortConfig.key === 'requestsPerMin'}
                    direction={sortConfig.key === 'requestsPerMin' ? sortConfig.direction : null}
                    onClick={() => setSortConfig((c) => nextSortState(c, 'requestsPerMin'))}
                  />
                </th>
                <th className="px-2 py-2 font-medium uppercase tracking-[0.12em]">
                  <SortableHeader
                    label="Retry"
                    active={sortConfig.key === 'retryRate'}
                    direction={sortConfig.key === 'retryRate' ? sortConfig.direction : null}
                    onClick={() => setSortConfig((c) => nextSortState(c, 'retryRate'))}
                  />
                </th>
                <th className="px-2 py-2 font-medium uppercase tracking-[0.12em]">
                  <SortableHeader
                    label="Avail"
                    active={sortConfig.key === 'availability'}
                    direction={sortConfig.key === 'availability' ? sortConfig.direction : null}
                    onClick={() => setSortConfig((c) => nextSortState(c, 'availability'))}
                  />
                </th>
                <th className="px-2 py-2 font-medium uppercase tracking-[0.12em]">
                  <SortableHeader
                    label="Last incident"
                    active={sortConfig.key === 'lastIncident'}
                    direction={sortConfig.key === 'lastIncident' ? sortConfig.direction : null}
                    onClick={() => setSortConfig((c) => nextSortState(c, 'lastIncident'))}
                  />
                </th>
                <th className="px-2 py-2 font-medium uppercase tracking-[0.12em]">Trend</th>
              </tr>
            </thead>
            <tbody>
              {sortedEndpoints.map((ep) => (
                <tr key={ep.path} className="border-b border-white/[0.05] align-top">
                  <td className="px-2 py-2">
                    <span
                      className={`mt-0.5 inline-block size-2 rounded-full ${endpointStatusDotClass(ep.operationalStatus)}`}
                      title={ep.operationalStatus}
                    />
                  </td>
                  <td className="max-w-[220px] px-2 py-2">
                    <p className="font-mono text-[10px] text-[#f2f0eb]/88">{ep.path}</p>
                    <p className="mt-1 text-[10px] leading-snug text-[#f2f0eb]/52" title={ep.insight}>
                      {ep.insight}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-2 py-2">
                    <span
                      className={`inline-flex rounded-md border px-1.5 py-0.5 text-[9px] font-semibold ${severityBadgeClass(ep.severityLabel)}`}
                    >
                      {ep.severityLabel}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-2 py-2 text-[#f2f0eb]/75">{ep.avgLatency}</td>
                  <td className="whitespace-nowrap px-2 py-2 text-[#f2f0eb]/75">{ep.p95Latency}</td>
                  <td className="whitespace-nowrap px-2 py-2 text-[#f2f0eb]/75">{ep.errorRate}</td>
                  <td className="whitespace-nowrap px-2 py-2 text-[#f2f0eb]/75">{ep.timeoutRate}</td>
                  <td className="whitespace-nowrap px-2 py-2 text-[#f2f0eb]/75">{ep.requestsPerMin}</td>
                  <td className="whitespace-nowrap px-2 py-2 text-[#f2f0eb]/75">{ep.retryRate}</td>
                  <td className="whitespace-nowrap px-2 py-2 text-[#f2f0eb]/75">{ep.availability}</td>
                  <td className="whitespace-nowrap px-2 py-2 text-[#f2f0eb]/65">{ep.lastIncident}</td>
                  <td className="w-20 px-1 py-2">
                    <Sparkline
                      points={ep.latencySparkline}
                      danger={ep.operationalStatus !== 'Healthy'}
                      className="h-7 w-full"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
        <p className="mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">
          <Activity className="size-3.5 text-[#3694fc]" />
          Incidents & timeline
        </p>
        <ul className="space-y-2">
          {detail.timeline.map((ev) => (
            <li
              key={`${ev.timeUtc}-${ev.message}`}
              className={`flex gap-2 rounded-md border px-2 py-1.5 text-[11px] leading-snug ${timelineToneClass(ev.tone)}`}
            >
              <span className="shrink-0 font-mono text-[10px] text-[#f2f0eb]/50">{ev.timeUtc}</span>
              <span className="text-[#f2f0eb]/78">{ev.message}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
        <p className="mb-1 text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Operational notes</p>
        <ul className="list-disc space-y-1 pl-4 text-[11px] text-[#f2f0eb]/72">
          {detail.operationalNotes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </div>
    </>
  )
}

export function apiOverviewDrawerMeta(row: ApiComparisonRow) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${stabilityClass(row.operationalStability)}`}
      >
        {row.operationalStability}
      </span>
      <span className="rounded-full border border-white/[0.1] bg-white/[0.02] px-2 py-0.5 text-[11px] text-[#f2f0eb]/72">
        {row.bestUseCase}
      </span>
    </div>
  )
}
