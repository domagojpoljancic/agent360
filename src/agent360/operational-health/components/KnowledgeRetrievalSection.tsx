import { useMemo, useState } from 'react'
import { GitCompareArrows, Info, Sparkles } from 'lucide-react'
import type { KnowledgeSourceRow, RetrievalMetric } from '../data'
import { Sparkline } from './shared'
import { OperationalDetailDrawer } from './OperationalDetailDrawer'
import { SortableHeader } from '../../../components/SortableHeader'
import { nextSortState, sortRows, type SortState } from '../../../utils/tableSorting'

type KnowledgeRetrievalSectionProps = {
  metrics: RetrievalMetric[]
  sources: KnowledgeSourceRow[]
  onOpenRetrievalComparison: () => void
  onOpenAiRetrievalCheck: () => void
  aiRetrievalCheckOpen: boolean
  aiRetrievalCheckGenerating: boolean
}

type SortKey = 'source' | 'availability' | 'avgLatency' | 'timeoutRate' | 'lastSync' | 'status'

function toneClass(tone: RetrievalMetric['tone']) {
  if (tone === 'healthy') return 'text-[#3DD68C]'
  if (tone === 'watch') return 'text-[#D6A85B]'
  if (tone === 'critical') return 'text-[#E07a83]'
  return 'text-[#f2f0eb]'
}

function sourceStatusClass(status: KnowledgeSourceRow['status']) {
  if (status === 'Healthy') return 'border-[#3DD68C]/35 bg-[#3DD68C]/10 text-[#3DD68C]'
  if (status === 'Degraded') return 'border-[#D6A85B]/35 bg-[#D6A85B]/10 text-[#D6A85B]'
  return 'border-[#3694fc]/35 bg-[#3694fc]/10 text-[#3694fc]'
}

const metricTooltips: Record<string, string> = {
  'Retrieval Success Rate': 'Percentage of retrieval requests that returned valid context.',
  'Avg Retrieval Latency':
    'Average time required to retrieve context from connected knowledge sources.',
  'Retrieval Timeout Rate': 'Percentage of retrieval requests that exceeded timeout thresholds.',
  'No-Context Returned Rate': 'Requests where no relevant context could be retrieved.',
  'Retrieval Error Rate': 'Requests that failed due to retrieval system or source errors.',
  'Vector Search Availability': 'Availability of the vector search infrastructure layer.',
  'Knowledge Source Sync Status': 'Operational state of source synchronization pipelines.',
  'Index Refresh Delay': 'Current delay between source updates and searchable index refresh.',
  'Retrieval Queue Depth': 'Current number of queued retrieval operations awaiting processing.',
}

const headers: { label: string; key: SortKey }[] = [
  { label: 'Source', key: 'source' },
  { label: 'Availability', key: 'availability' },
  { label: 'Avg Latency', key: 'avgLatency' },
  { label: 'Timeout Rate', key: 'timeoutRate' },
  { label: 'Last Sync', key: 'lastSync' },
  { label: 'Status', key: 'status' },
]

export function KnowledgeRetrievalSection({
  metrics,
  sources,
  onOpenRetrievalComparison,
  onOpenAiRetrievalCheck,
  aiRetrievalCheckOpen,
  aiRetrievalCheckGenerating,
}: KnowledgeRetrievalSectionProps) {
  const [selectedSourceId, setSelectedSourceId] = useState(sources[0]?.id ?? '')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [sortConfig, setSortConfig] = useState<SortState<SortKey>>({
    key: 'availability',
    direction: 'desc',
  })

  const sortedSources = useMemo(
    () => sortRows(sources, sortConfig, (source, key) => source[key]),
    [sources, sortConfig],
  )
  const selectedSource = useMemo(
    () => sortedSources.find((source) => source.id === selectedSourceId) ?? sortedSources[0],
    [selectedSourceId, sortedSources],
  )

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 md:p-4">
      <header className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/42">Knowledge Retrieval</p>
          <h3 className="mt-1 text-base font-semibold text-[#f2f0eb]">Retrieval Runtime Health</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="group/retrieval relative">
            <button
              type="button"
              onClick={onOpenRetrievalComparison}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.12] bg-white/[0.03] px-2.5 py-1.5 text-[11px] font-medium text-[#f2f0eb]/80 transition hover:border-white/[0.2] hover:text-[#f2f0eb]"
            >
              <GitCompareArrows className="size-3.5" />
              Retrieval Comparison
            </button>
            <div className="pointer-events-none absolute bottom-full right-0 z-30 mb-2 w-64 rounded-lg border border-white/[0.12] bg-[#161620] px-2.5 py-2 text-[11px] leading-snug text-[#f2f0eb]/78 opacity-0 shadow-[0_14px_30px_-20px_rgba(0,0,0,0.8)] transition duration-150 group-hover/retrieval:opacity-100">
              Compare embedding models, vector databases, and retrieval performance.
            </div>
          </div>
          <div className="group/ai-retrieval relative">
            <button
              type="button"
              onClick={onOpenAiRetrievalCheck}
              aria-expanded={aiRetrievalCheckOpen}
              aria-busy={aiRetrievalCheckGenerating}
              aria-haspopup="dialog"
              className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] font-semibold text-[#f2f0eb] transition ${
                aiRetrievalCheckGenerating
                  ? 'border-[#3694fc]/65 bg-[#3694fc]/35'
                  : aiRetrievalCheckOpen
                    ? 'border-[#3694fc]/45 bg-[#3694fc]/24'
                    : 'border-[#3694fc]/35 bg-[#3694fc]/16 hover:border-[#3694fc]/55 hover:bg-[#3694fc]/24'
              }`}
            >
              <Sparkles className={`size-3.5 ${aiRetrievalCheckGenerating ? 'animate-pulse' : ''}`} />
              AI Retrieval Check
            </button>
            <div className="pointer-events-none absolute bottom-full right-0 z-30 mb-2 w-64 rounded-lg border border-white/[0.12] bg-[#161620] px-2.5 py-2 text-[11px] leading-snug text-[#f2f0eb]/78 opacity-0 shadow-[0_14px_30px_-20px_rgba(0,0,0,0.8)] transition duration-150 group-hover/ai-retrieval:opacity-100">
              Analyze retrieval performance and generate optimization recommendations.
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
        {metrics.slice(0, 5).map((metric) => (
          <article
            key={metric.label}
            className="group relative rounded-xl border border-white/[0.07] bg-[#1f1f29]/70 px-3 py-2.5"
          >
            <span className="absolute right-2 top-2 text-[#f2f0eb]/35 transition group-hover:text-[#f2f0eb]/65">
              <Info className="size-3.5" />
            </span>
            <div className="pointer-events-none absolute right-2 top-7 z-10 w-56 rounded-md border border-white/[0.12] bg-[#161620] px-2 py-1.5 text-[11px] text-[#f2f0eb]/78 opacity-0 shadow-[0_14px_30px_-20px_rgba(0,0,0,0.8)] transition duration-150 group-hover:opacity-100">
              {metricTooltips[metric.label]}
            </div>
            <p className="text-[11px] text-[#f2f0eb]/65">{metric.label}</p>
            <p className={`mt-1 text-xl font-semibold ${toneClass(metric.tone)}`}>{metric.value}</p>
          </article>
        ))}
      </div>

      <div className="mt-2 grid gap-2.5 md:grid-cols-2 xl:grid-cols-4">
        {metrics.slice(5).map((metric) => (
          <article
            key={metric.label}
            className="group relative rounded-lg border border-white/[0.07] bg-[#1f1f29]/65 px-3 py-2"
          >
            <span className="absolute right-2 top-2 text-[#f2f0eb]/30 transition group-hover:text-[#f2f0eb]/60">
              <Info className="size-3" />
            </span>
            <div className="pointer-events-none absolute right-2 top-6 z-10 w-52 rounded-md border border-white/[0.12] bg-[#161620] px-2 py-1.5 text-[11px] text-[#f2f0eb]/78 opacity-0 transition duration-150 group-hover:opacity-100">
              {metricTooltips[metric.label]}
            </div>
            <p className="text-[11px] text-[#f2f0eb]/62">{metric.label}</p>
            <p className={`mt-1 text-[15px] font-semibold ${toneClass(metric.tone)}`}>{metric.value}</p>
          </article>
        ))}
      </div>

      <div className="mt-3">
        <section className="rounded-xl border border-white/[0.07] bg-[#1f1f29]/70 p-3">
          <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-[#f2f0eb]/45">
            Knowledge Sources
          </p>
          <div className="overflow-auto rounded-lg border border-white/[0.06]">
            <table className="min-w-[760px] w-full text-left text-[12px]">
              <thead className="bg-[#1b1b25] text-[#f2f0eb]/60">
                <tr className="border-b border-white/[0.06]">
                  {headers.map((header) => (
                    <th key={header.key} className="px-3 py-2 font-medium uppercase tracking-[0.16em]">
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
                {sortedSources.map((source) => {
                  const selected = source.id === selectedSource?.id
                  return (
                    <tr
                      key={source.id}
                      onClick={() => {
                        setSelectedSourceId(source.id)
                        setDrawerOpen(true)
                      }}
                      className={`cursor-pointer border-b border-white/[0.05] transition ${
                        selected
                          ? 'bg-[#3694fc]/[0.1] shadow-[inset_0_0_0_1px_rgba(54,148,252,0.3)]'
                          : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      <td className="px-3 py-2.5 text-[#f2f0eb]">{source.source}</td>
                      <td className="px-3 py-2.5 text-[#f2f0eb]/82">{source.availability}</td>
                      <td className="px-3 py-2.5 text-[#f2f0eb]/82">{source.avgLatency}</td>
                      <td className="px-3 py-2.5 text-[#f2f0eb]/82">{source.timeoutRate}</td>
                      <td className="px-3 py-2.5 text-[#f2f0eb]/82">{source.lastSync}</td>
                      <td className="px-3 py-2.5">
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[10px] ${sourceStatusClass(source.status)}`}
                        >
                          {source.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {selectedSource ? (
        <OperationalDetailDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title={selectedSource.source}
          subtitle={selectedSource.detail.syncStatus}
          meta={
            <span className="rounded-full border border-white/[0.1] bg-white/[0.02] px-2 py-0.5 text-[11px] text-[#f2f0eb]/75">
              Last sync {selectedSource.lastSync}
            </span>
          }
        >
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
            <p className="mb-1 text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">
              Retrieval Trend
            </p>
            <Sparkline
              points={selectedSource.trend}
              danger={selectedSource.status === 'Degraded'}
              className="h-7 w-full"
            />
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
            <p className="mb-1 text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">
              Source Reliability
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <p className="rounded border border-white/[0.06] bg-white/[0.02] px-2 py-1 text-[#f2f0eb]/72">
                Avg latency: {selectedSource.avgLatency}
              </p>
              <p className="rounded border border-white/[0.06] bg-white/[0.02] px-2 py-1 text-[#f2f0eb]/72">
                Timeout rate: {selectedSource.timeoutRate}
              </p>
              <p className="rounded border border-white/[0.06] bg-white/[0.02] px-2 py-1 text-[#f2f0eb]/72">
                Availability: {selectedSource.availability}
              </p>
              <p className="rounded border border-white/[0.06] bg-white/[0.02] px-2 py-1 text-[#f2f0eb]/72">
                Queue depth: {selectedSource.detail.queueDepth}
              </p>
            </div>
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
            <p className="mb-1 text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">
              Sync & Availability
            </p>
            <div className="space-y-1 text-[11px] text-[#f2f0eb]/75">
              <p>Index refresh delay: {selectedSource.detail.indexDelay}</p>
              <p>Vector availability: {selectedSource.detail.vectorAvailability}</p>
              <p>Sync health: {selectedSource.detail.syncStatus}</p>
              <p>Operational incident note: Retrieval variance monitored on this source.</p>
            </div>
          </div>
        </OperationalDetailDrawer>
      ) : null}
    </section>
  )
}
