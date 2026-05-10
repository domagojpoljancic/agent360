import { useMemo, useState } from 'react'
import { LayoutDashboard, Sparkles } from 'lucide-react'
import type { ApiRuntimeIncident, ApiRuntimeOverview, ApiToolRuntimeRow, TimeRange } from '../data'
import { Sparkline } from './shared'
import { ApiRuntimeWidgetDrawer, type ApiRuntimeWidgetPanel } from './ApiRuntimeWidgetDrawer'

type ApiToolRuntimeSectionProps = {
  apiRows: ApiToolRuntimeRow[]
  incidents: ApiRuntimeIncident[]
  overview: ApiRuntimeOverview
  timeRange: TimeRange
  onOpenApiOverview: () => void
  onOpenAiApiCheck: () => void
  aiApiCheckOpen: boolean
  aiApiCheckGenerating: boolean
}

function incidentSeverityClass(severity: ApiRuntimeIncident['severity']): string {
  if (severity === 'Critical') return 'border-[#E07a83]/40 bg-[#E07a83]/12 text-[#E07a83]'
  if (severity === 'Warning') return 'border-[#D6A85B]/40 bg-[#D6A85B]/12 text-[#D6A85B]'
  return 'border-white/[0.12] bg-white/[0.04] text-[#f2f0eb]/70'
}

function incidentStatusClass(status: ApiRuntimeIncident['status']): string {
  if (status === 'Active') return 'text-[#E07a83]'
  if (status === 'Monitoring') return 'text-[#D6A85B]'
  return 'text-[#3DD68C]'
}

function parseMs(raw: string): number {
  const s = raw.trim()
  if (s.endsWith('ms')) return Number.parseFloat(s) || 0
  if (s.endsWith('s')) return (Number.parseFloat(s) || 0) * 1000
  return Number.parseFloat(s) || 0
}

function parsePct(raw: string): number {
  return Number.parseFloat(String(raw).replace('%', '')) || 0
}

function parseAvailabilityPct(raw: string): number {
  return Number.parseFloat(String(raw).replace('%', '')) || 0
}

function avgLatencyTrendPoints(rows: ApiToolRuntimeRow[]): number[] {
  if (rows.length === 0) return [40, 41, 40, 42, 41]
  const len = rows[0].detail.latencyTrend.length
  return Array.from({ length: len }, (_, i) => {
    const sum = rows.reduce((s, r) => s + (r.detail.latencyTrend[i] ?? 0), 0)
    return sum / rows.length
  })
}

function toolSuccessTrendPoints(rows: ApiToolRuntimeRow[]): number[] {
  if (rows.length === 0) return [94, 95, 94, 96, 96, 97, 96]
  const len = rows[0].detail.failureTrend.length
  return Array.from({ length: len }, (_, i) => {
    const failAvg = rows.reduce((s, r) => s + (r.detail.failureTrend[i] ?? 0), 0) / rows.length
    return Math.min(100, 88 + (1.2 - failAvg) * 12)
  })
}

const widgetBtnClass =
  'w-full rounded-xl border border-white/[0.07] bg-[#1a1a24]/80 p-2.5 text-left transition hover:border-white/[0.14] hover:bg-[#1e1e2a]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3694fc]/40'

export function ApiToolRuntimeSection({
  apiRows,
  incidents,
  overview,
  timeRange,
  onOpenApiOverview,
  onOpenAiApiCheck,
  aiApiCheckOpen,
  aiApiCheckGenerating,
}: ApiToolRuntimeSectionProps) {
  const [widgetPanel, setWidgetPanel] = useState<ApiRuntimeWidgetPanel | null>(null)

  const aggregates = useMemo(() => {
    let healthy = 0
    let degraded = 0
    let unavailable = 0
    let availSum = 0
    let avgLatSum = 0
    let p95Sum = 0
    let errorSum = 0
    const degradedNames: string[] = []

    const n = apiRows.length || 1
    for (const row of apiRows) {
      if (row.status === 'Healthy' || row.status === 'Stable') healthy += 1
      else if (row.status === 'Degraded') {
        degraded += 1
        degradedNames.push(row.name)
      } else {
        unavailable += 1
        degradedNames.push(row.name)
      }

      availSum += parseAvailabilityPct(row.availability)
      avgLatSum += parseMs(row.avgLatency)
      p95Sum += parseMs(row.p95Latency)
      errorSum += parsePct(row.errorRate)
    }

    const slowest = [...apiRows]
      .sort((a, b) => parseMs(b.p95Latency) - parseMs(a.p95Latency))
      .slice(0, 3)
      .map((r) => ({ name: r.name, p95: r.p95Latency }))

    return {
      healthy,
      degraded,
      unavailable,
      avgUptime: (availSum / n).toFixed(2),
      fleetAvgMs: Math.round(avgLatSum / n),
      fleetP95Ms: Math.round(p95Sum / n),
      fleetErrorPct: (errorSum / n).toFixed(2),
      slowest,
      degradedNames,
    }
  }, [apiRows])

  const totalApis = apiRows.length || 1
  const healthPct = (aggregates.healthy / totalApis) * 100
  const degPct = (aggregates.degraded / totalApis) * 100
  const unPct = (aggregates.unavailable / totalApis) * 100

  const mix = overview.errorMix
  const clientW = parsePct(mix.clientErrorsPct)
  const serverW = parsePct(mix.serverErrorsPct)
  const timeoutW = parsePct(mix.timeoutPct)
  const schemaW = parsePct(mix.schemaPct)

  const latencyTrend = useMemo(() => avgLatencyTrendPoints(apiRows), [apiRows])
  const toolTrend = useMemo(() => toolSuccessTrendPoints(apiRows), [apiRows])
  const slowestOne = aggregates.slowest[0]
  const topIncidents = incidents.slice(0, 4)

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-2.5 md:p-3">
      <header className="mb-2.5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-[#f2f0eb]/40">API runtime</p>
          <h3 className="mt-0.5 text-[15px] font-semibold text-[#f2f0eb]">API &amp; tool runtime health</h3>
          <p className="mt-0.5 text-[11px] text-[#f2f0eb]/55">
            Concise operational dependency overview for conversational AI agents.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div className="group/api relative">
            <button
              type="button"
              onClick={onOpenApiOverview}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.12] bg-white/[0.03] px-2.5 py-1.5 text-[11px] font-medium text-[#f2f0eb]/80 transition hover:border-white/[0.2] hover:text-[#f2f0eb]"
            >
              <LayoutDashboard className="size-3.5 shrink-0" />
              API Overview
            </button>
            <div className="pointer-events-none absolute bottom-full right-0 z-30 mb-2 w-64 rounded-lg border border-white/[0.12] bg-[#161620] px-2.5 py-2 text-[11px] leading-snug text-[#f2f0eb]/78 opacity-0 shadow-[0_14px_30px_-20px_rgba(0,0,0,0.8)] transition duration-150 group-hover/api:opacity-100">
              Explore operational performance across connected APIs and tools.
            </div>
          </div>
          <div className="group/ai-api relative">
            <button
              type="button"
              onClick={onOpenAiApiCheck}
              aria-expanded={aiApiCheckOpen}
              aria-busy={aiApiCheckGenerating}
              aria-haspopup="dialog"
              className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] font-semibold text-[#f2f0eb] transition ${
                aiApiCheckGenerating
                  ? 'border-[#3694fc]/65 bg-[#3694fc]/35'
                  : aiApiCheckOpen
                    ? 'border-[#3694fc]/45 bg-[#3694fc]/24'
                    : 'border-[#3694fc]/35 bg-[#3694fc]/16 hover:border-[#3694fc]/55 hover:bg-[#3694fc]/24'
              }`}
            >
              <Sparkles className={`size-3.5 shrink-0 ${aiApiCheckGenerating ? 'animate-pulse' : ''}`} />
              AI API Check
            </button>
            <div className="pointer-events-none absolute bottom-full right-0 z-30 mb-2 w-64 rounded-lg border border-white/[0.12] bg-[#161620] px-2.5 py-2 text-[11px] leading-snug text-[#f2f0eb]/78 opacity-0 shadow-[0_14px_30px_-20px_rgba(0,0,0,0.8)] transition duration-150 group-hover/ai-api:opacity-100">
              Analyze API reliability and generate operational recommendations.
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <button type="button" className={widgetBtnClass} onClick={() => setWidgetPanel('availability')}>
          <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#f2f0eb]/45">API availability</p>
          <div className="mt-1.5 flex h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <span className="bg-[#3DD68C]/88" style={{ width: `${healthPct}%` }} />
            <span className="bg-[#D6A85B]/88" style={{ width: `${degPct}%` }} />
            <span className="bg-[#E07a83]/88" style={{ width: `${unPct}%` }} />
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-3 text-[10px] text-[#f2f0eb]/65">
            <span>
              <span className="font-semibold text-[#3DD68C]">{aggregates.healthy}</span> ok
            </span>
            <span>
              <span className="font-semibold text-[#D6A85B]">{aggregates.degraded}</span> degr.
            </span>
            <span>
              <span className="font-semibold text-[#E07a83]">{aggregates.unavailable}</span> crit.
            </span>
          </div>
          <p className="mt-2 text-[17px] font-semibold tabular-nums leading-none text-[#f2f0eb]">
            {aggregates.avgUptime}%
            <span className="ml-1.5 text-[10px] font-normal text-[#f2f0eb]/45">fleet</span>
          </p>
        </button>

        <button type="button" className={widgetBtnClass} onClick={() => setWidgetPanel('latency')}>
          <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#f2f0eb]/45">API latency</p>
          <p className="mt-1 text-[10px] text-[#f2f0eb]/48">Are APIs slowing conversations?</p>
          <Sparkline points={latencyTrend} className="mt-2 h-5 w-full" />
          <div className="mt-2 flex gap-3 text-[10px]">
            <span className="text-[#f2f0eb]/55">
              Avg{' '}
              <span className="font-semibold tabular-nums text-[#f2f0eb]">{aggregates.fleetAvgMs}ms</span>
            </span>
            <span className="text-[#f2f0eb]/55">
              p95{' '}
              <span className="font-semibold tabular-nums text-[#8abefc]">{aggregates.fleetP95Ms}ms</span>
            </span>
          </div>
          {slowestOne ? (
            <p className="mt-1.5 truncate text-[10px] text-[#f2f0eb]/62">
              Slowest: <span className="text-[#f2f0eb]/82">{slowestOne.name}</span>{' '}
              <span className="tabular-nums text-[#8abefc]">{slowestOne.p95}</span>
            </p>
          ) : null}
        </button>

        <button type="button" className={widgetBtnClass} onClick={() => setWidgetPanel('tools')}>
          <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#f2f0eb]/45">Tool execution</p>
          <p className="mt-1 text-[10px] text-[#f2f0eb]/48">Are tool calls succeeding?</p>
          <Sparkline points={toolTrend} className="mt-2 h-5 w-full" />
          <p className="mt-2 text-[17px] font-semibold tabular-nums leading-none text-[#3DD68C]">
            {overview.toolSuccessRate}
          </p>
          <p className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 text-[10px] text-[#f2f0eb]/62">
            <span>
              Failed <span className="font-semibold text-[#D6A85B]">{overview.toolFailedExec}</span>
            </span>
            <span>
              Fallback <span className="font-semibold text-[#8abefc]">{overview.fallbackShare}</span>
            </span>
          </p>
        </button>
      </div>

      <button
        type="button"
        className={`${widgetBtnClass} mt-2`}
        onClick={() => setWidgetPanel('errors')}
      >
        <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#f2f0eb]/45">
          API error &amp; failure mix
        </p>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="text-[18px] font-semibold tabular-nums text-[#f2f0eb]">{aggregates.fleetErrorPct}%</span>
          <span className="text-[10px] text-[#f2f0eb]/45">fleet error rate</span>
        </div>
        <div className="mt-2 flex h-2 overflow-hidden rounded-md bg-white/[0.06]">
          <span className="h-full bg-[#D6A85B]/85" style={{ width: `${clientW}%` }} />
          <span className="h-full bg-[#E07a83]/80" style={{ width: `${serverW}%` }} />
          <span className="h-full bg-[#8abefc]/75" style={{ width: `${timeoutW}%` }} />
          <span className="h-full bg-[#c49fd4]/70" style={{ width: `${schemaW}%` }} />
        </div>
        <p className="mt-1.5 text-[9px] text-[#f2f0eb]/45">
          4xx {mix.clientErrorsPct}% · 5xx {mix.serverErrorsPct}% · timeout {mix.timeoutPct}% · schema{' '}
          {mix.schemaPct}%
        </p>
      </button>

      <button
        type="button"
        className={`${widgetBtnClass} mt-2 py-2`}
        onClick={() => setWidgetPanel('incidents')}
      >
        <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-[#f2f0eb]/45">Top API incidents</p>
        <ul className="mt-1.5 divide-y divide-white/[0.06]">
          {topIncidents.map((inc) => (
            <li key={inc.id} className="flex flex-wrap items-start gap-x-2 gap-y-0.5 py-1.5 first:pt-0">
              <span
                className={`shrink-0 rounded border px-1 py-px text-[9px] font-medium uppercase ${incidentSeverityClass(inc.severity)}`}
              >
                {inc.severity}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                  <span className="text-[11px] font-medium text-[#f2f0eb]">{inc.apiName}</span>
                  <span className="text-[10px] text-[#f2f0eb]/45">{inc.timestamp}</span>
                </div>
                <p className="text-[11px] text-[#f2f0eb]/75">{inc.title}</p>
                <p className="text-[10px] leading-snug text-[#f2f0eb]/48">{inc.shortNote}</p>
              </div>
              <span className={`shrink-0 text-[10px] font-medium ${incidentStatusClass(inc.status)}`}>
                {inc.status}
              </span>
            </li>
          ))}
        </ul>
      </button>

      <ApiRuntimeWidgetDrawer
        open={widgetPanel !== null}
        panel={widgetPanel}
        onClose={() => setWidgetPanel(null)}
        timeRange={timeRange}
        apiRows={apiRows}
        overview={overview}
        incidents={incidents}
        aggregates={aggregates}
      />
    </section>
  )
}
