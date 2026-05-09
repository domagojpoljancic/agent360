import { useMemo, useState } from 'react'
import { Activity, GitCompareArrows, Sparkles, TimerReset } from 'lucide-react'
import type { ProviderHealth } from '../data'
import { Sparkline } from './shared'
import { OperationalDetailDrawer } from './OperationalDetailDrawer'
import { SortableHeader } from '../../../components/SortableHeader'
import { nextSortState, sortRows, type SortState } from '../../../utils/tableSorting'

type SortKey =
  | 'model'
  | 'provider'
  | 'avgLatency'
  | 'p95Latency'
  | 'errorRate'
  | 'status'
  | 'latencyTier'
  | 'trend'

type ProviderHealthTableProps = {
  rows: ProviderHealth[]
  onOpenModelComparison: () => void
  onOpenAiCheck: () => void
  aiCheckOpen: boolean
  aiCheckGenerating: boolean
}

export function ProviderHealthTable({
  rows,
  onOpenModelComparison,
  onOpenAiCheck,
  aiCheckOpen,
  aiCheckGenerating,
}: ProviderHealthTableProps) {
  const [selectedModelId, setSelectedModelId] = useState(rows[0]?.id ?? '')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [sortConfig, setSortConfig] = useState<SortState<SortKey>>({
    key: 'avgLatency',
    direction: 'asc',
  })

  function latencyTier(avgLatency: string): 'Excellent' | 'Good' | 'Moderate' | 'Slow' {
    const value = Number.parseFloat(avgLatency)
    if (value <= 1.0) return 'Excellent'
    if (value <= 1.6) return 'Good'
    if (value <= 2.3) return 'Moderate'
    return 'Slow'
  }

  const sortedRows = useMemo(
    () =>
      sortRows(rows, sortConfig, (row, key) => {
        if (key === 'latencyTier') return latencyTier(row.avgLatency)
        if (key === 'trend') return row.sparkline[row.sparkline.length - 1] ?? null
        return row[key]
      }),
    [rows, sortConfig],
  )

  const selected = sortedRows.find((row) => row.id === selectedModelId) ?? sortedRows[0]
  const fastestModelId = useMemo(
    () =>
      [...rows].sort(
        (a, b) => Number.parseFloat(a.avgLatency) - Number.parseFloat(b.avgLatency),
      )[0]?.id,
    [rows],
  )

  const headers: { label: string; key: SortKey }[] = [
    { label: 'Model', key: 'model' },
    { label: 'Provider', key: 'provider' },
    { label: 'Avg Latency', key: 'avgLatency' },
    { label: 'p95 Latency', key: 'p95Latency' },
    { label: 'Error Rate', key: 'errorRate' },
    { label: 'Status', key: 'status' },
    { label: 'Latency Tier', key: 'latencyTier' },
    { label: 'Trend', key: 'trend' },
  ]

  function statusBadgeClass(status: ProviderHealth['status']): string {
    if (status === 'Degraded' || status === 'Critical')
      return 'border-[#E07a83]/35 bg-[#E07a83]/10 text-[#E07a83]'
    if (status === 'Stable') return 'border-[#3694fc]/30 bg-[#3694fc]/10 text-[#8abefc]'
    if (status === 'Healthy') return 'border-[#3694fc]/30 bg-[#3694fc]/10 text-[#7eb5fc]'
    return 'border-[#D6A85B]/35 bg-[#D6A85B]/10 text-[#D6A85B]'
  }

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 md:p-4">
      <header className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/42">AI Stack</p>
          <h3 className="mt-1 text-base font-semibold text-[#f2f0eb]">Model & Provider Health</h3>
          <p className="mt-1 text-[12px] text-[#f2f0eb]/60">
            Compare provider runtime responsiveness and stability across conversational models.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenModelComparison}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.12] bg-white/[0.03] px-2.5 py-1.5 text-[11px] font-medium text-[#f2f0eb]/80 transition hover:border-white/[0.2] hover:text-[#f2f0eb]"
          >
            <GitCompareArrows className="size-3.5" />
            Model Comparison
          </button>
          <div className="group/ai relative">
            <button
              type="button"
              onClick={onOpenAiCheck}
              aria-expanded={aiCheckOpen}
              aria-busy={aiCheckGenerating}
              aria-haspopup="dialog"
              className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] font-semibold text-[#f2f0eb] transition ${
                aiCheckGenerating
                  ? 'border-[#3694fc]/65 bg-[#3694fc]/35'
                  : aiCheckOpen
                    ? 'border-[#3694fc]/45 bg-[#3694fc]/24'
                    : 'border-[#3694fc]/35 bg-[#3694fc]/16 hover:border-[#3694fc]/55 hover:bg-[#3694fc]/24'
              }`}
            >
              <Sparkles className={`size-3.5 ${aiCheckGenerating ? 'animate-pulse' : ''}`} />
              AI Check
            </button>
            <div className="pointer-events-none absolute bottom-full right-0 z-30 mb-2 w-64 rounded-lg border border-white/[0.12] bg-[#161620] px-2.5 py-2 text-[11px] leading-snug text-[#f2f0eb]/78 opacity-0 shadow-[0_14px_30px_-20px_rgba(0,0,0,0.8)] transition duration-150 group-hover/ai:opacity-100">
              Analyze current provider performance and generate operational recommendations.
            </div>
          </div>
        </div>
      </header>
      <div className="overflow-auto rounded-xl border border-white/[0.07]">
        <table className="min-w-[980px] w-full text-left text-[13px]">
          <thead className="bg-[#1f1f28]/90">
            <tr className="border-b border-white/[0.07] text-[#f2f0eb]/65">
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
            {sortedRows.map((row) => (
              <tr
                key={row.id}
                onClick={() => {
                  setSelectedModelId(row.id)
                  setDrawerOpen(true)
                }}
                className={`cursor-pointer border-b border-white/[0.05] transition ${
                  row.id === selected?.id ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
                }`}
              >
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-[#f2f0eb]">{row.model}</p>
                    {row.id === fastestModelId ? (
                      <span className="rounded border border-[#3694fc]/30 bg-[#3694fc]/10 px-1.5 py-0.5 text-[10px] text-[#8abefc]">
                        Best latency
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className="px-3 py-2.5 text-[12px] text-[#f2f0eb]/60">{row.provider}</td>
                <td className="px-3 py-2.5">
                  <p className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#f2f0eb]">
                    <TimerReset className="size-3.5 text-[#3694fc] a360-pulse" />
                    {row.avgLatency}
                  </p>
                </td>
                <td className="px-3 py-2.5 text-[#f2f0eb]">{row.p95Latency}</td>
                <td className="px-3 py-2.5 text-[#f2f0eb]">{row.errorRate}</td>
                <td className="px-3 py-2.5">
                  <span
                    className={`inline-flex min-w-20 justify-center rounded-md border px-2 py-1 text-[11px] ${statusBadgeClass(
                      row.status,
                    )}`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-[#f2f0eb]/80">{latencyTier(row.avgLatency)}</td>
                <td className="px-3 py-2.5">
                  <div className="w-24">
                    <Sparkline
                      points={row.sparkline}
                      danger={row.status === 'Degraded'}
                      className="h-6 w-full"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected ? (
        <OperationalDetailDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title={`${selected.model} · ${selected.provider}`}
          subtitle={selected.detail.regionalInsight}
          meta={
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-white/[0.1] bg-white/[0.02] px-2 py-0.5 text-[11px] text-[#f2f0eb]/75">
                Streaming start {selected.detail.streamingStartDelay}
              </span>
              <span className="rounded-full border border-white/[0.1] bg-white/[0.02] px-2 py-0.5 text-[11px] text-[#f2f0eb]/75">
                Provider {selected.detail.providerHealth}
              </span>
            </div>
          }
        >
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
            <p className="mb-1 text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">
              Latency Trends
            </p>
            <div className="space-y-2">
              <div>
                <p className="mb-1 text-[11px] text-[#f2f0eb]/65">Avg latency trend</p>
                <Sparkline points={selected.detail.avgLatencyTrend} className="h-6 w-full" />
              </div>
              <div>
                <p className="mb-1 text-[11px] text-[#f2f0eb]/65">p95 latency trend</p>
                <Sparkline points={selected.detail.p95LatencyTrend} className="h-6 w-full" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
            <p className="mb-1 text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">
              Reliability Metrics
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <p className="rounded border border-white/[0.06] bg-white/[0.02] px-2 py-1 text-[#f2f0eb]/75">
                Timeout rate: {selected.timeoutRate}
              </p>
              <p className="rounded border border-white/[0.06] bg-white/[0.02] px-2 py-1 text-[#f2f0eb]/75">
                Retries: {selected.detail.retries}
              </p>
              <p className="rounded border border-white/[0.06] bg-white/[0.02] px-2 py-1 text-[#f2f0eb]/75">
                Availability: {selected.availability}
              </p>
              <p className="rounded border border-white/[0.06] bg-white/[0.02] px-2 py-1 text-[#f2f0eb]/75">
                Failed requests: {selected.detail.failedRequests}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
            <p className="mb-1 text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">
              Runtime Breakdown
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] text-[#f2f0eb]/75">
              <p>Network: {selected.detail.runtimeBreakdown.network}</p>
              <p>Provider: {selected.detail.runtimeBreakdown.providerProcessing}</p>
              <p>Retrieval: {selected.detail.runtimeBreakdown.retrievalOverhead}</p>
              <p>Tools: {selected.detail.runtimeBreakdown.toolOverhead}</p>
            </div>
          </div>

          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
            <p className="mb-1 text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">
              Recent Incidents
            </p>
            <ul className="space-y-1 text-[11px] text-[#f2f0eb]/75">
              {selected.detail.incidents.map((incident) => (
                <li key={incident} className="flex items-center gap-1.5">
                  <Activity className="size-3 text-[#3694fc]" />
                  {incident}
                </li>
              ))}
            </ul>
          </div>
        </OperationalDetailDrawer>
      ) : null}
    </section>
  )
}
