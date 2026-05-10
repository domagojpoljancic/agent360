import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Search } from 'lucide-react'
import { Agent360Footer } from '../components/Agent360Footer'
import { ComparisonPageLoader } from '../components/ComparisonPageLoader'
import { GridBackground } from '../components/GridBackground'
import { Header } from '../components/Header'
import { navigate } from '../router'
import { SortableHeader } from '../../components/SortableHeader'
import { nextSortState, sortRows, type SortState } from '../../utils/tableSorting'
import { OperationalDetailDrawer } from '../operational-health/components/OperationalDetailDrawer'
import {
  embeddingModelRows,
  retrievalStrategyRows,
  vectorDatabaseRows,
  type EmbeddingModelRow,
  type VectorDatabaseRow,
} from '../retrieval-comparison/data'

type EmbeddingSortKey =
  | 'embeddingModel'
  | 'provider'
  | 'dimensions'
  | 'avgRetrievalLatency'
  | 'costTier'
  | 'retrievalAccuracyTier'
  | 'multilingualSupport'
  | 'storageEfficiency'
  | 'recommendedUseCase'
  | 'operationalStability'

type DbSortKey =
  | 'vectorDb'
  | 'queryLatency'
  | 'availability'
  | 'scalingSupport'
  | 'hybridSearchSupport'
  | 'regionReplication'
  | 'costTier'
  | 'operationalStability'
  | 'bestUseCase'

type StrategySortKey =
  | 'strategy'
  | 'retrievalSpeed'
  | 'accuracyImpact'
  | 'tokenOverhead'
  | 'complexity'
  | 'recommendedWorkload'

const providerFilters = [
  'All',
  'OpenAI',
  'Cohere',
  'Voyage AI',
  'BAAI',
  'Intfloat',
  'HKUNLP',
  'Mistral',
] as const

const loadingCopy = [
  'Loading retrieval benchmarks…',
  'Syncing vector database metrics…',
  'Preparing embedding comparison matrix…',
] as const

export function RetrievalComparisonPage() {
  const [ready, setReady] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [search, setSearch] = useState('')
  const [provider, setProvider] = useState<(typeof providerFilters)[number]>('All')
  const [selectedEmbeddingId, setSelectedEmbeddingId] = useState(embeddingModelRows[0]?.id ?? '')
  const [embeddingDrawerOpen, setEmbeddingDrawerOpen] = useState(false)
  const [selectedDbId, setSelectedDbId] = useState(vectorDatabaseRows[0]?.id ?? '')
  const [dbDrawerOpen, setDbDrawerOpen] = useState(false)
  const [embeddingSort, setEmbeddingSort] = useState<SortState<EmbeddingSortKey>>({
    key: 'avgRetrievalLatency',
    direction: 'asc',
  })
  const [dbSort, setDbSort] = useState<SortState<DbSortKey>>({ key: 'queryLatency', direction: 'asc' })
  const [strategySort, setStrategySort] = useState<SortState<StrategySortKey>>({
    key: 'retrievalSpeed',
    direction: 'asc',
  })

  useEffect(() => {
    const stepId = window.setInterval(() => {
      setLoadingStep((value) => (value + 1) % loadingCopy.length)
    }, 550)
    const readyId = window.setTimeout(() => setReady(true), 1500)
    return () => {
      window.clearInterval(stepId)
      window.clearTimeout(readyId)
    }
  }, [])

  const filteredEmbeddings = useMemo(() => {
    const query = search.trim().toLowerCase()
    return embeddingModelRows.filter((row) => {
      if (provider !== 'All' && row.provider !== provider) return false
      if (!query) return true
      return (
        row.embeddingModel.toLowerCase().includes(query) ||
        row.provider.toLowerCase().includes(query) ||
        row.recommendedUseCase.toLowerCase().includes(query)
      )
    })
  }, [provider, search])

  const sortedEmbeddings = useMemo(
    () => sortRows(filteredEmbeddings, embeddingSort, (row, key) => row[key]),
    [filteredEmbeddings, embeddingSort],
  )
  const selectedEmbedding =
    sortedEmbeddings.find((item) => item.id === selectedEmbeddingId) ?? sortedEmbeddings[0] ?? null

  const filteredDbs = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return vectorDatabaseRows
    return vectorDatabaseRows.filter(
      (row) =>
        row.vectorDb.toLowerCase().includes(query) || row.bestUseCase.toLowerCase().includes(query),
    )
  }, [search])

  const sortedDbs = useMemo(() => sortRows(filteredDbs, dbSort, (row, key) => row[key]), [filteredDbs, dbSort])
  const selectedDb = sortedDbs.find((item) => item.id === selectedDbId) ?? sortedDbs[0] ?? null

  const sortedStrategies = useMemo(
    () => sortRows(retrievalStrategyRows, strategySort, (row, key) => row[key]),
    [strategySort],
  )

  const topEmbedding = [...embeddingModelRows].sort((a, b) => a.avgRetrievalLatency.localeCompare(b.avgRetrievalLatency))[0]
  const stableDb = vectorDatabaseRows.find((row) => row.operationalStability === 'Excellent') ?? vectorDatabaseRows[0]

  const embeddingHeaders: { key: EmbeddingSortKey; label: string }[] = [
    { key: 'embeddingModel', label: 'Embedding Model' },
    { key: 'provider', label: 'Provider' },
    { key: 'dimensions', label: 'Dimensions' },
    { key: 'avgRetrievalLatency', label: 'Avg Retrieval Latency' },
    { key: 'costTier', label: 'Cost Tier' },
    { key: 'retrievalAccuracyTier', label: 'Accuracy Tier' },
    { key: 'multilingualSupport', label: 'Multilingual' },
    { key: 'storageEfficiency', label: 'Storage Efficiency' },
    { key: 'recommendedUseCase', label: 'Recommended Use Case' },
    { key: 'operationalStability', label: 'Operational Stability' },
  ]

  const dbHeaders: { key: DbSortKey; label: string }[] = [
    { key: 'vectorDb', label: 'Vector DB' },
    { key: 'queryLatency', label: 'Query Latency' },
    { key: 'availability', label: 'Availability' },
    { key: 'scalingSupport', label: 'Scaling Support' },
    { key: 'hybridSearchSupport', label: 'Hybrid Search' },
    { key: 'regionReplication', label: 'Region Replication' },
    { key: 'costTier', label: 'Cost Tier' },
    { key: 'operationalStability', label: 'Operational Stability' },
    { key: 'bestUseCase', label: 'Best Use Case' },
  ]

  const strategyHeaders: { key: StrategySortKey; label: string }[] = [
    { key: 'strategy', label: 'Strategy' },
    { key: 'retrievalSpeed', label: 'Retrieval Speed' },
    { key: 'accuracyImpact', label: 'Accuracy Impact' },
    { key: 'tokenOverhead', label: 'Token Overhead' },
    { key: 'complexity', label: 'Complexity' },
    { key: 'recommendedWorkload', label: 'Recommended Workload' },
  ]

  function stabilityClass(stability: EmbeddingModelRow['operationalStability']): string {
    if (stability === 'Excellent') return 'border-[#3DD68C]/35 bg-[#3DD68C]/10 text-[#3DD68C]'
    if (stability === 'Strong') return 'border-[#3694fc]/35 bg-[#3694fc]/10 text-[#8abefc]'
    if (stability === 'Moderate') return 'border-[#D6A85B]/35 bg-[#D6A85B]/10 text-[#D6A85B]'
    return 'border-[#E07a83]/35 bg-[#E07a83]/10 text-[#E07a83]'
  }

  function dbStabilityClass(stability: VectorDatabaseRow['operationalStability']): string {
    if (stability === 'Excellent') return 'border-[#3DD68C]/35 bg-[#3DD68C]/10 text-[#3DD68C]'
    if (stability === 'Strong') return 'border-[#3694fc]/35 bg-[#3694fc]/10 text-[#8abefc]'
    if (stability === 'Moderate') return 'border-[#D6A85B]/35 bg-[#D6A85B]/10 text-[#D6A85B]'
    return 'border-[#E07a83]/35 bg-[#E07a83]/10 text-[#E07a83]'
  }

  if (!ready) {
    return (
      <ComparisonPageLoader
        eyebrow="Agent360 / Retrieval Comparison"
        steps={loadingCopy}
        activeStepIndex={loadingStep}
      />
    )
  }

  return (
    <div className="relative flex min-h-screen flex-col text-[#f2f0eb] motion-safe:animate-[comparisonFadeIn_0.4s_ease-out]">
      <GridBackground variant="page" />
      <div className="relative z-10 flex flex-1 flex-col">
        <Header />
        <main className="mx-auto max-w-7xl flex-1 space-y-4 px-4 pb-12 pt-8 md:px-6 md:pb-14">
          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 md:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <button
                  type="button"
                  onClick={() => navigate('/operational-health')}
                  className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.1] bg-white/[0.02] px-2.5 py-1 text-[11px] text-[#f2f0eb]/75 transition hover:text-[#f2f0eb]"
                >
                  <ArrowLeft className="size-3.5" />
                  Back to Operational Health
                </button>
                <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">
                  Agent360 / Retrieval Comparison
                </p>
                <h1 className="mt-1 text-[26px] font-semibold tracking-tight md:text-[32px]">
                  Retrieval Comparison
                </h1>
                <p className="mt-1 text-sm text-[#f2f0eb]/62">
                  Benchmark embedding models, vector stores, and retrieval strategies for operational reliability.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="relative">
                  <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-[#f2f0eb]/45" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search provider, model, workload..."
                    className="w-64 rounded-md border border-white/[0.1] bg-[#1b1b24]/90 py-1.5 pl-7 pr-2.5 text-[12px] text-[#f2f0eb] outline-none placeholder:text-[#f2f0eb]/35 focus:border-[#3694fc]/45"
                  />
                </label>
                <select
                  value={provider}
                  onChange={(event) =>
                    setProvider(event.target.value as (typeof providerFilters)[number])
                  }
                  className="rounded-md border border-white/[0.1] bg-[#1b1b24]/90 px-2.5 py-1.5 text-[12px] text-[#f2f0eb] outline-none focus:border-[#3694fc]/45"
                >
                  {providerFilters.map((item) => (
                    <option key={item} value={item}>
                      {item === 'All' ? 'All embedding providers' : item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#f2f0eb]/45">Fastest embedding path</p>
              <p className="mt-2 text-[12px] text-[#f2f0eb]/75">
                {topEmbedding?.embeddingModel ?? 'N/A'} ({topEmbedding?.avgRetrievalLatency ?? 'N/A'})
              </p>
            </article>
            <article className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#f2f0eb]/45">Most stable vector DB</p>
              <p className="mt-2 text-[12px] text-[#f2f0eb]/75">
                {stableDb.vectorDb} ({stableDb.queryLatency})
              </p>
            </article>
            <article className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#f2f0eb]/45">Recommended default strategy</p>
              <p className="mt-2 text-[12px] text-[#f2f0eb]/75">Hybrid Search + selective reranking</p>
            </article>
            <article className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#f2f0eb]/45">Needs verification</p>
              <p className="mt-2 text-[12px] text-[#f2f0eb]/75">
                Provider pricing and region limits vary by plan.
              </p>
            </article>
          </section>

          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 md:p-4">
            <p className="mb-2 text-[11px] text-[#f2f0eb]/58">
              Retrieval specifications are based on public provider documentation and benchmark-style operational estimates;
              verify before production decisions. Last reviewed: May 2026.
            </p>
            <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Embedding Model Comparison</p>
            <div className="overflow-auto rounded-xl border border-white/[0.07]">
              <table className="min-w-[1600px] w-full text-left text-[12px]">
                <thead className="sticky top-0 z-10 bg-[#1f1f28]/95 backdrop-blur">
                  <tr className="border-b border-white/[0.07] text-[#f2f0eb]/65">
                    {embeddingHeaders.map((header) => (
                      <th key={header.key} className="px-3 py-2.5 font-medium uppercase tracking-[0.16em]">
                        <SortableHeader
                          label={header.label}
                          active={embeddingSort.key === header.key}
                          direction={embeddingSort.key === header.key ? embeddingSort.direction : null}
                          onClick={() => setEmbeddingSort((current) => nextSortState(current, header.key))}
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedEmbeddings.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => {
                        setSelectedEmbeddingId(row.id)
                        setEmbeddingDrawerOpen(true)
                      }}
                      className="cursor-pointer border-b border-white/[0.05] transition hover:bg-white/[0.03]"
                    >
                      <td className="px-3 py-2.5 font-semibold text-[#f2f0eb]">{row.embeddingModel}</td>
                      <td className="px-3 py-2.5 text-[#f2f0eb]/75">{row.provider}</td>
                      <td className="px-3 py-2.5">{row.dimensions}</td>
                      <td className="px-3 py-2.5">{row.avgRetrievalLatency}</td>
                      <td className="px-3 py-2.5">{row.costTier}</td>
                      <td className="px-3 py-2.5">{row.retrievalAccuracyTier}</td>
                      <td className="px-3 py-2.5">{row.multilingualSupport}</td>
                      <td className="px-3 py-2.5">{row.storageEfficiency}</td>
                      <td className="px-3 py-2.5 text-[#f2f0eb]/75">{row.recommendedUseCase}</td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-flex min-w-20 justify-center rounded-md border px-2 py-1 text-[11px] ${stabilityClass(row.operationalStability)}`}>
                          {row.operationalStability}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 md:p-4">
            <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Vector Database Comparison</p>
            <div className="overflow-auto rounded-xl border border-white/[0.07]">
              <table className="min-w-[1500px] w-full text-left text-[12px]">
                <thead className="sticky top-0 z-10 bg-[#1f1f28]/95 backdrop-blur">
                  <tr className="border-b border-white/[0.07] text-[#f2f0eb]/65">
                    {dbHeaders.map((header) => (
                      <th key={header.key} className="px-3 py-2.5 font-medium uppercase tracking-[0.16em]">
                        <SortableHeader
                          label={header.label}
                          active={dbSort.key === header.key}
                          direction={dbSort.key === header.key ? dbSort.direction : null}
                          onClick={() => setDbSort((current) => nextSortState(current, header.key))}
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedDbs.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => {
                        setSelectedDbId(row.id)
                        setDbDrawerOpen(true)
                      }}
                      className="cursor-pointer border-b border-white/[0.05] transition hover:bg-white/[0.03]"
                    >
                      <td className="px-3 py-2.5 font-semibold text-[#f2f0eb]">{row.vectorDb}</td>
                      <td className="px-3 py-2.5">{row.queryLatency}</td>
                      <td className="px-3 py-2.5">{row.availability}</td>
                      <td className="px-3 py-2.5">{row.scalingSupport}</td>
                      <td className="px-3 py-2.5">{row.hybridSearchSupport}</td>
                      <td className="px-3 py-2.5">{row.regionReplication}</td>
                      <td className="px-3 py-2.5">{row.costTier}</td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-flex min-w-20 justify-center rounded-md border px-2 py-1 text-[11px] ${dbStabilityClass(row.operationalStability)}`}>
                          {row.operationalStability}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-[#f2f0eb]/75">{row.bestUseCase}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 md:p-4">
            <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Retrieval Strategy Comparison</p>
            <div className="overflow-auto rounded-xl border border-white/[0.07]">
              <table className="min-w-[980px] w-full text-left text-[12px]">
                <thead className="sticky top-0 z-10 bg-[#1f1f28]/95 backdrop-blur">
                  <tr className="border-b border-white/[0.07] text-[#f2f0eb]/65">
                    {strategyHeaders.map((header) => (
                      <th key={header.key} className="px-3 py-2.5 font-medium uppercase tracking-[0.16em]">
                        <SortableHeader
                          label={header.label}
                          active={strategySort.key === header.key}
                          direction={strategySort.key === header.key ? strategySort.direction : null}
                          onClick={() => setStrategySort((current) => nextSortState(current, header.key))}
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedStrategies.map((row) => (
                    <tr key={row.id} className="border-b border-white/[0.05]">
                      <td className="px-3 py-2.5 font-semibold text-[#f2f0eb]">{row.strategy}</td>
                      <td className="px-3 py-2.5">{row.retrievalSpeed}</td>
                      <td className="px-3 py-2.5">{row.accuracyImpact}</td>
                      <td className="px-3 py-2.5">{row.tokenOverhead}</td>
                      <td className="px-3 py-2.5">{row.complexity}</td>
                      <td className="px-3 py-2.5 text-[#f2f0eb]/75">{row.recommendedWorkload}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>

        <Agent360Footer />
      </div>

      {selectedEmbedding ? (
        <OperationalDetailDrawer
          open={embeddingDrawerOpen}
          onClose={() => setEmbeddingDrawerOpen(false)}
          title={`${selectedEmbedding.embeddingModel} · ${selectedEmbedding.provider}`}
          subtitle={selectedEmbedding.recommendedUseCase}
          meta={
            <span className="rounded-full border border-white/[0.1] bg-white/[0.02] px-2 py-0.5 text-[11px] text-[#f2f0eb]/75">
              Source: {selectedEmbedding.sourceLabel}
            </span>
          }
        >
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5 text-[11px] text-[#f2f0eb]/75">
            <p>Dimensions: {selectedEmbedding.dimensions}</p>
            <p>Avg retrieval latency: {selectedEmbedding.avgRetrievalLatency}</p>
            <p>Cost tier: {selectedEmbedding.costTier}</p>
            <p>Accuracy tier: {selectedEmbedding.retrievalAccuracyTier}</p>
            <p>Multilingual: {selectedEmbedding.multilingualSupport}</p>
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5 text-[11px] text-[#f2f0eb]/75">
            <p>{selectedEmbedding.notes}</p>
            <p className="mt-1 text-[#f2f0eb]/55">{selectedEmbedding.sourceUrl}</p>
          </div>
        </OperationalDetailDrawer>
      ) : null}

      {selectedDb ? (
        <OperationalDetailDrawer
          open={dbDrawerOpen}
          onClose={() => setDbDrawerOpen(false)}
          title={selectedDb.vectorDb}
          subtitle={selectedDb.bestUseCase}
          meta={
            <span className="rounded-full border border-white/[0.1] bg-white/[0.02] px-2 py-0.5 text-[11px] text-[#f2f0eb]/75">
              Source: {selectedDb.sourceLabel}
            </span>
          }
        >
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5 text-[11px] text-[#f2f0eb]/75">
            <p>Query latency: {selectedDb.queryLatency}</p>
            <p>Availability: {selectedDb.availability}</p>
            <p>Scaling support: {selectedDb.scalingSupport}</p>
            <p>Hybrid search: {selectedDb.hybridSearchSupport}</p>
            <p>Region replication: {selectedDb.regionReplication}</p>
            <p>Cost tier: {selectedDb.costTier}</p>
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5 text-[11px] text-[#f2f0eb]/75">
            <p>{selectedDb.notes}</p>
            <p className="mt-1 text-[#f2f0eb]/55">{selectedDb.sourceUrl}</p>
          </div>
        </OperationalDetailDrawer>
      ) : null}

      <style>{`
        @keyframes comparisonFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
