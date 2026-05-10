import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Search } from 'lucide-react'
import { ComparisonPageLoader } from '../components/ComparisonPageLoader'
import { GridBackground } from '../components/GridBackground'
import { Header } from '../components/Header'
import { navigate } from '../router'
import { SortableHeader } from '../../components/SortableHeader'
import { nextSortState, sortRows, type SortState } from '../../utils/tableSorting'
import { OperationalDetailDrawer } from '../operational-health/components/OperationalDetailDrawer'
import { ApiOverviewDrawerContent, apiOverviewDrawerMeta } from '../api-comparison/ApiOverviewDrawerContent'
import { apiComparisonRows, type ApiComparisonRow } from '../api-comparison/data'

type SortKey =
  | 'api'
  | 'provider'
  | 'avgLatency'
  | 'availability'
  | 'errorRate'
  | 'retryRate'
  | 'rateLimitFrequency'
  | 'operationalStability'
  | 'bestUseCase'

const stabilityFilters = ['All', 'Excellent', 'Strong', 'Moderate', 'Watch'] as const

const loadingCopy = [
  'Loading API runtime data…',
  'Syncing dependency metrics…',
  'Preparing API overview…',
] as const

export function ApiOverviewPage() {
  const [ready, setReady] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [search, setSearch] = useState('')
  const [stabilityFilter, setStabilityFilter] = useState<(typeof stabilityFilters)[number]>('All')
  const [sortConfig, setSortConfig] = useState<SortState<SortKey>>({
    key: 'avgLatency',
    direction: 'asc',
  })
  const [selectedId, setSelectedId] = useState(apiComparisonRows[0]?.id ?? '')
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const stepId = window.setInterval(() => {
      setLoadingStep((i) => (i + 1) % loadingCopy.length)
    }, 550)
    const readyId = window.setTimeout(() => setReady(true), 1500)
    return () => {
      window.clearInterval(stepId)
      window.clearTimeout(readyId)
    }
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return apiComparisonRows.filter((row) => {
      if (stabilityFilter !== 'All' && row.operationalStability !== stabilityFilter) return false
      if (!q) return true
      return (
        row.api.toLowerCase().includes(q) ||
        row.provider.toLowerCase().includes(q) ||
        row.bestUseCase.toLowerCase().includes(q)
      )
    })
  }, [search, stabilityFilter])

  const sorted = useMemo(() => sortRows(filtered, sortConfig, (row, key) => row[key]), [filtered, sortConfig])
  const selected = sorted.find((r) => r.id === selectedId) ?? sorted[0] ?? null

  const headers: { key: SortKey; label: string }[] = [
    { key: 'api', label: 'API' },
    { key: 'provider', label: 'Provider' },
    { key: 'avgLatency', label: 'Avg Latency' },
    { key: 'availability', label: 'Availability' },
    { key: 'errorRate', label: 'Error Rate' },
    { key: 'retryRate', label: 'Retry Rate' },
    { key: 'rateLimitFrequency', label: 'Rate Limit Freq.' },
    { key: 'operationalStability', label: 'Stability' },
    { key: 'bestUseCase', label: 'Best Use Case' },
  ]

  function stabilityClass(s: ApiComparisonRow['operationalStability']): string {
    if (s === 'Excellent') return 'border-[#3DD68C]/35 bg-[#3DD68C]/10 text-[#3DD68C]'
    if (s === 'Strong') return 'border-[#3694fc]/35 bg-[#3694fc]/10 text-[#8abefc]'
    if (s === 'Moderate') return 'border-[#D6A85B]/35 bg-[#D6A85B]/10 text-[#D6A85B]'
    return 'border-[#E07a83]/35 bg-[#E07a83]/10 text-[#E07a83]'
  }

  if (!ready) {
    return (
      <ComparisonPageLoader
        eyebrow="Agent360 / API Overview"
        steps={loadingCopy}
        activeStepIndex={loadingStep}
      />
    )
  }

  return (
    <div className="relative min-h-screen text-[#f2f0eb] motion-safe:animate-[apiOverviewIn_0.4s_ease-out]">
      <GridBackground variant="page" />
      <div className="relative z-10">
        <Header />
        <main className="mx-auto max-w-7xl space-y-4 px-4 pb-20 pt-8 md:px-6">
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
                  Agent360 / API Overview
                </p>
                <h1 className="mt-1 text-[26px] font-semibold tracking-tight md:text-[32px]">API Overview</h1>
                <p className="mt-1 text-sm text-[#f2f0eb]/62">
                  Full operational matrix for external APIs and agent tool dependencies. Row drilldown opens endpoint-level
                  telemetry, dependency fan-out, and incident timelines.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="relative">
                  <Search className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-[#f2f0eb]/45" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search API, provider, use case…"
                    className="w-64 rounded-md border border-white/[0.1] bg-[#1b1b24]/90 py-1.5 pl-7 pr-2.5 text-[12px] text-[#f2f0eb] outline-none placeholder:text-[#f2f0eb]/35 focus:border-[#3694fc]/45"
                  />
                </label>
                <select
                  value={stabilityFilter}
                  onChange={(e) =>
                    setStabilityFilter(e.target.value as (typeof stabilityFilters)[number])
                  }
                  className="rounded-md border border-white/[0.1] bg-[#1b1b24]/90 px-2.5 py-1.5 text-[12px] text-[#f2f0eb] outline-none focus:border-[#3694fc]/45"
                >
                  {stabilityFilters.map((s) => (
                    <option key={s} value={s}>
                      {s === 'All' ? 'All stability tiers' : s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 md:p-4">
            <p className="mb-2 text-[11px] text-[#f2f0eb]/58">
              Figures are demo operational benchmarks for Agent360; validate against your own telemetry and vendor
              SLAs before production decisions.
            </p>
            <div className="overflow-auto rounded-xl border border-white/[0.07]">
              <table className="min-w-[1200px] w-full text-left text-[12px]">
                <thead className="sticky top-0 z-10 bg-[#1f1f28]/95 backdrop-blur">
                  <tr className="border-b border-white/[0.07] text-[#f2f0eb]/65">
                    {headers.map((h) => (
                      <th key={h.key} className="px-3 py-2.5 font-medium uppercase tracking-[0.16em]">
                        <SortableHeader
                          label={h.label}
                          active={sortConfig.key === h.key}
                          direction={sortConfig.key === h.key ? sortConfig.direction : null}
                          onClick={() => setSortConfig((c) => nextSortState(c, h.key))}
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => {
                        setSelectedId(row.id)
                        setDrawerOpen(true)
                      }}
                      className="cursor-pointer border-b border-white/[0.05] transition hover:bg-white/[0.03]"
                    >
                      <td className="px-3 py-2.5 font-semibold text-[#f2f0eb]">{row.api}</td>
                      <td className="px-3 py-2.5 text-[#f2f0eb]/75">{row.provider}</td>
                      <td className="px-3 py-2.5">{row.avgLatency}</td>
                      <td className="px-3 py-2.5">{row.availability}</td>
                      <td className="px-3 py-2.5">{row.errorRate}</td>
                      <td className="px-3 py-2.5">{row.retryRate}</td>
                      <td className="px-3 py-2.5">{row.rateLimitFrequency}</td>
                      <td className="px-3 py-2.5">
                        <span
                          className={`inline-flex min-w-20 justify-center rounded-md border px-2 py-1 text-[11px] ${stabilityClass(row.operationalStability)}`}
                        >
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
        </main>
      </div>

      {selected ? (
        <OperationalDetailDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          title={`${selected.api} · ${selected.provider}`}
          subtitle={selected.detail.summary}
          meta={apiOverviewDrawerMeta(selected)}
          asideWidthClassName="max-w-[min(92vw,1024px)] min-w-[340px]"
        >
          <ApiOverviewDrawerContent row={selected} />
        </OperationalDetailDrawer>
      ) : null}

      <style>{`
        @keyframes apiOverviewIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
