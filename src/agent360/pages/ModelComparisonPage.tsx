import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Search } from 'lucide-react'
import { Agent360Footer } from '../components/Agent360Footer'
import { ComparisonPageLoader } from '../components/ComparisonPageLoader'
import { GridBackground } from '../components/GridBackground'
import { Header } from '../components/Header'
import { SortableHeader } from '../../components/SortableHeader'
import { nextSortState, sortRows, type SortState } from '../../utils/tableSorting'
import { navigate } from '../router'
import { OperationalDetailDrawer } from '../operational-health/components/OperationalDetailDrawer'
import { modelComparisonRows, type ModelComparisonRow } from '../model-comparison/data'

type SortKey =
  | 'model'
  | 'provider'
  | 'modelFamily'
  | 'avgLatency'
  | 'p95Latency'
  | 'latencyTier'
  | 'contextWindow'
  | 'maxOutputTokens'
  | 'inputPricePer1M'
  | 'outputPricePer1M'
  | 'streamingSupport'
  | 'toolCalling'
  | 'multimodal'
  | 'availability'
  | 'typicalCostTier'
  | 'bestUseCase'
  | 'stability'
  | 'recommendedWorkload'
  | 'pricingConfidence'

const providers = ['All', 'OpenAI', 'Anthropic', 'Google', 'Mistral', 'Meta', 'Cohere', 'xAI'] as const
const latencyTiers = ['All', 'Very Low', 'Low', 'Moderate', 'High'] as const
const costTiers = ['All', 'Low', 'Medium', 'High', 'Premium', 'Unknown'] as const

const LOADING_STEPS = [
  'Loading model benchmark data…',
  'Syncing provider specifications…',
  'Preparing comparison matrix…',
] as const

export function ModelComparisonPage() {
  const [ready, setReady] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [query, setQuery] = useState('')
  const [providerFilter, setProviderFilter] = useState<(typeof providers)[number]>('All')
  const [latencyFilter, setLatencyFilter] = useState<(typeof latencyTiers)[number]>('All')
  const [costFilter, setCostFilter] = useState<(typeof costTiers)[number]>('All')
  const [selectedModelId, setSelectedModelId] = useState<string>(modelComparisonRows[0]?.id ?? '')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [sortConfig, setSortConfig] = useState<SortState<SortKey>>({
    key: 'avgLatency',
    direction: 'asc',
  })

  useEffect(() => {
    const stepId = window.setInterval(() => {
      setLoadingStep((value) => (value + 1) % LOADING_STEPS.length)
    }, 550)
    const readyId = window.setTimeout(() => setReady(true), 1500)
    return () => {
      window.clearInterval(stepId)
      window.clearTimeout(readyId)
    }
  }, [])

  const filteredRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return modelComparisonRows.filter((row) => {
      const providerMatch = providerFilter === 'All' || row.provider === providerFilter
      const latencyMatch = latencyFilter === 'All' || row.latencyTier === latencyFilter
      const costMatch = costFilter === 'All' || row.typicalCostTier === costFilter
      if (!providerMatch) return false
      if (!latencyMatch) return false
      if (!costMatch) return false
      if (!normalizedQuery) return true
      return (
        row.model.toLowerCase().includes(normalizedQuery) ||
        row.provider.toLowerCase().includes(normalizedQuery) ||
        row.modelFamily.toLowerCase().includes(normalizedQuery) ||
        row.bestUseCase.toLowerCase().includes(normalizedQuery) ||
        row.recommendedWorkload.toLowerCase().includes(normalizedQuery)
      )
    })
  }, [providerFilter, latencyFilter, costFilter, query])

  const sortedRows = useMemo(
    () => sortRows(filteredRows, sortConfig, (row, key) => row[key]),
    [filteredRows, sortConfig],
  )

  const selected = sortedRows.find((row) => row.id === selectedModelId) ?? sortedRows[0] ?? null

  const headers: { key: SortKey; label: string }[] = [
    { key: 'model', label: 'Model' },
    { key: 'provider', label: 'Provider' },
    { key: 'modelFamily', label: 'Family' },
    { key: 'avgLatency', label: 'Avg Latency' },
    { key: 'p95Latency', label: 'p95 Latency' },
    { key: 'latencyTier', label: 'Latency Tier' },
    { key: 'contextWindow', label: 'Context Window' },
    { key: 'maxOutputTokens', label: 'Max Output' },
    { key: 'inputPricePer1M', label: 'Input / 1M' },
    { key: 'outputPricePer1M', label: 'Output / 1M' },
    { key: 'streamingSupport', label: 'Streaming' },
    { key: 'toolCalling', label: 'Tool Calling' },
    { key: 'multimodal', label: 'Multimodal' },
    { key: 'availability', label: 'Availability' },
    { key: 'typicalCostTier', label: 'Cost Tier' },
    { key: 'bestUseCase', label: 'Use Case' },
    { key: 'stability', label: 'Stability' },
    { key: 'recommendedWorkload', label: 'Workload Fit' },
    { key: 'pricingConfidence', label: 'Spec Confidence' },
  ]

  const fastestModels = useMemo(
    () => modelComparisonRows.filter((row) => row.latencyTier === 'Very Low').slice(0, 4),
    [],
  )
  const longContextModels = useMemo(
    () => modelComparisonRows.filter((row) => row.contextWindow.includes('1M')).slice(0, 4),
    [],
  )
  const costEfficientModels = useMemo(
    () => modelComparisonRows.filter((row) => row.typicalCostTier === 'Low').slice(0, 4),
    [],
  )
  const needsVerification = useMemo(
    () => modelComparisonRows.filter((row) => row.pricingConfidence !== 'Documented').slice(0, 4),
    [],
  )

  function stabilityClass(stability: ModelComparisonRow['stability']): string {
    if (stability === 'Excellent') return 'border-[#3DD68C]/35 bg-[#3DD68C]/10 text-[#3DD68C]'
    if (stability === 'Strong') return 'border-[#3694fc]/35 bg-[#3694fc]/10 text-[#8abefc]'
    if (stability === 'Moderate') return 'border-[#D6A85B]/35 bg-[#D6A85B]/10 text-[#D6A85B]'
    return 'border-[#E07a83]/35 bg-[#E07a83]/10 text-[#E07a83]'
  }

  if (!ready) {
    return (
      <ComparisonPageLoader
        eyebrow="Agent360 / Model Comparison"
        steps={LOADING_STEPS}
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
                  Agent360 / Model Comparison
                </p>
                <h1 className="mt-1 text-[26px] font-semibold tracking-tight md:text-[32px]">
                  Model Comparison
                </h1>
                <p className="mt-1 text-sm text-[#f2f0eb]/62">
                  Compare runtime performance, stability, and workload fit across market models.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="relative">
                  <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-[#f2f0eb]/45" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search model, provider, workload..."
                    className="w-64 rounded-md border border-white/[0.1] bg-[#1b1b24]/90 py-1.5 pl-7 pr-2.5 text-[12px] text-[#f2f0eb] outline-none placeholder:text-[#f2f0eb]/35 focus:border-[#3694fc]/45"
                  />
                </label>
                <select
                  value={providerFilter}
                  onChange={(event) =>
                    setProviderFilter(event.target.value as (typeof providers)[number])
                  }
                  className="rounded-md border border-white/[0.1] bg-[#1b1b24]/90 px-2.5 py-1.5 text-[12px] text-[#f2f0eb] outline-none focus:border-[#3694fc]/45"
                >
                  {providers.map((provider) => (
                    <option key={provider} value={provider}>
                      {provider === 'All' ? 'All providers' : provider}
                    </option>
                  ))}
                </select>
                <select
                  value={latencyFilter}
                  onChange={(event) =>
                    setLatencyFilter(event.target.value as (typeof latencyTiers)[number])
                  }
                  className="rounded-md border border-white/[0.1] bg-[#1b1b24]/90 px-2.5 py-1.5 text-[12px] text-[#f2f0eb] outline-none focus:border-[#3694fc]/45"
                >
                  {latencyTiers.map((tier) => (
                    <option key={tier} value={tier}>
                      {tier === 'All' ? 'All latency tiers' : `${tier} latency`}
                    </option>
                  ))}
                </select>
                <select
                  value={costFilter}
                  onChange={(event) => setCostFilter(event.target.value as (typeof costTiers)[number])}
                  className="rounded-md border border-white/[0.1] bg-[#1b1b24]/90 px-2.5 py-1.5 text-[12px] text-[#f2f0eb] outline-none focus:border-[#3694fc]/45"
                >
                  {costTiers.map((tier) => (
                    <option key={tier} value={tier}>
                      {tier === 'All' ? 'All cost tiers' : `${tier} cost`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#f2f0eb]/45">Fastest low-latency</p>
              <p className="mt-2 text-[12px] text-[#f2f0eb]/75">
                {fastestModels.map((item) => item.model).join(' · ') || 'No models matched'}
              </p>
            </article>
            <article className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#f2f0eb]/45">Best long-context</p>
              <p className="mt-2 text-[12px] text-[#f2f0eb]/75">
                {longContextModels.map((item) => item.model).join(' · ') || 'No models matched'}
              </p>
            </article>
            <article className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#f2f0eb]/45">Most cost-efficient</p>
              <p className="mt-2 text-[12px] text-[#f2f0eb]/75">
                {costEfficientModels.map((item) => item.model).join(' · ') || 'No models matched'}
              </p>
            </article>
            <article className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
              <p className="text-[10px] uppercase tracking-[0.14em] text-[#f2f0eb]/45">Needs verification</p>
              <p className="mt-2 text-[12px] text-[#f2f0eb]/75">
                {needsVerification.map((item) => item.model).join(' · ') || 'All documented'}
              </p>
            </article>
          </section>

          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 md:p-4">
            <p className="mb-2 text-[11px] text-[#f2f0eb]/58">
              Model specifications and pricing are based on public provider documentation and should
              be verified before production decisions. Last reviewed: May 2026.
            </p>
            <div className="overflow-auto rounded-xl border border-white/[0.07]">
              <table className="min-w-[2300px] w-full text-left text-[13px]">
                <thead className="sticky top-0 z-10 bg-[#1f1f28]/95 backdrop-blur">
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
                      <td className="px-3 py-2.5 font-semibold text-[#f2f0eb]">{row.model}</td>
                      <td className="px-3 py-2.5 text-[#f2f0eb]/75">{row.provider}</td>
                      <td className="px-3 py-2.5 text-[#f2f0eb]/75">{row.modelFamily}</td>
                      <td className="px-3 py-2.5">{row.avgLatency}</td>
                      <td className="px-3 py-2.5">{row.p95Latency}</td>
                      <td className="px-3 py-2.5 text-[#f2f0eb]/75">{row.latencyTier}</td>
                      <td className="px-3 py-2.5">{row.contextWindow}</td>
                      <td className="px-3 py-2.5">{row.maxOutputTokens}</td>
                      <td className="px-3 py-2.5">{row.inputPricePer1M}</td>
                      <td className="px-3 py-2.5">{row.outputPricePer1M}</td>
                      <td className="px-3 py-2.5">{row.streamingSupport}</td>
                      <td className="px-3 py-2.5">{row.toolCalling}</td>
                      <td className="px-3 py-2.5">{row.multimodal}</td>
                      <td className="px-3 py-2.5">{row.availability}</td>
                      <td className="px-3 py-2.5">{row.typicalCostTier}</td>
                      <td className="px-3 py-2.5 text-[#f2f0eb]/75">{row.bestUseCase}</td>
                      <td className="px-3 py-2.5">
                        <span
                          className={`inline-flex min-w-20 justify-center rounded-md border px-2 py-1 text-[11px] ${stabilityClass(row.stability)}`}
                        >
                          {row.stability}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-[#f2f0eb]/75">{row.recommendedWorkload}</td>
                      <td className="px-3 py-2.5 text-[#f2f0eb]/65">{row.pricingConfidence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>

        <Agent360Footer />
      </div>

      {selected ? (
        <OperationalDetailDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title={`${selected.model} · ${selected.provider}`}
          subtitle={selected.detail.summary}
          meta={
            <div className="flex items-center gap-2">
              {selected.indicators.map((indicator) => (
                <span
                  key={indicator}
                  className="rounded-full border border-white/[0.1] bg-white/[0.02] px-2 py-0.5 text-[11px] text-[#f2f0eb]/75"
                >
                  {indicator}
                </span>
              ))}
              <span className="rounded-full border border-white/[0.1] bg-white/[0.02] px-2 py-0.5 text-[11px] text-[#f2f0eb]/75">
                {selected.modelFamily}
              </span>
            </div>
          }
        >
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
            <p className="mb-1 text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">
              Operational Snapshot
            </p>
            <div className="grid grid-cols-2 gap-1.5 text-[11px] text-[#f2f0eb]/75">
              <p>Avg latency: {selected.avgLatency}</p>
              <p>p95 latency: {selected.p95Latency}</p>
              <p>Availability: {selected.availability}</p>
              <p>Latency tier: {selected.latencyTier}</p>
              <p>Streaming support: {selected.streamingSupport}</p>
              <p>Tool calling: {selected.toolCalling}</p>
              <p>Multimodal: {selected.multimodal}</p>
              <p>Context window: {selected.contextWindow}</p>
              <p>Max output: {selected.maxOutputTokens}</p>
              <p>Input price: {selected.inputPricePer1M}</p>
              <p>Output price: {selected.outputPricePer1M}</p>
              <p>Cost tier: {selected.typicalCostTier}</p>
              <p>Spec confidence: {selected.pricingConfidence}</p>
            </div>
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
            <p className="mb-1 text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Strengths</p>
            <ul className="space-y-1 text-[11px] text-[#f2f0eb]/75">
              {selected.detail.strengths.map((note) => (
                <li key={note}>- {note}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
            <p className="mb-1 text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Limitations</p>
            <ul className="space-y-1 text-[11px] text-[#f2f0eb]/75">
              {selected.detail.limitations.map((incident) => (
                <li key={incident}>- {incident}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
            <p className="mb-1 text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">
              Operational Considerations
            </p>
            <ul className="space-y-1 text-[11px] text-[#f2f0eb]/75">
              {selected.detail.operationalConsiderations.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Source</p>
            <p className="mt-1 text-[11px] text-[#f2f0eb]/75">{selected.sourceLabel}</p>
            <p className="mt-0.5 text-[11px] text-[#f2f0eb]/50">{selected.sourceUrl}</p>
            <p className="mt-1 text-[11px] text-[#f2f0eb]/60">{selected.detail.sourceNote}</p>
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
