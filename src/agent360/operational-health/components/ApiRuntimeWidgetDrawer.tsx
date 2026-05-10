import { OperationalDetailDrawer } from './OperationalDetailDrawer'
import { Sparkline } from './shared'
import type {
  ApiRuntimeIncident,
  ApiRuntimeOverview,
  ApiToolRuntimeRow,
  TimeRange,
} from '../data'

export type ApiRuntimeWidgetPanel = 'availability' | 'latency' | 'tools' | 'errors' | 'incidents'

type Aggregates = {
  avgUptime: string
  fleetAvgMs: number
  fleetP95Ms: number
  slowest: { name: string; p95: string }[]
  fleetErrorPct: string
  degradedNames: string[]
}

function parsePct(raw: string): number {
  return Number.parseFloat(String(raw).replace('%', '')) || 0
}

function avgSeries(rows: ApiToolRuntimeRow[], key: 'latencyTrend' | 'p95Trend' | 'sparkline'): number[] {
  if (rows.length === 0) return [40, 42, 41, 43, 42]
  const getArr = (r: ApiToolRuntimeRow) =>
    key === 'sparkline' ? r.sparkline : key === 'latencyTrend' ? r.detail.latencyTrend : r.detail.p95Trend
  const len = getArr(rows[0]).length
  return Array.from({ length: len }, (_, i) => {
    const sum = rows.reduce((s, r) => s + (getArr(r)[i] ?? 0), 0)
    return sum / rows.length
  })
}

function toolSuccessTrendPoints(rows: ApiToolRuntimeRow[]): number[] {
  if (rows.length === 0) return [92, 93, 92, 94, 95, 94, 96]
  const len = rows[0].detail.failureTrend.length
  return Array.from({ length: len }, (_, i) => {
    const failAvg =
      rows.reduce((s, r) => s + (r.detail.failureTrend[i] ?? 0), 0) / rows.length
    return Math.min(100, 88 + (1.2 - failAvg) * 12)
  })
}

function panelTitle(panel: ApiRuntimeWidgetPanel): string {
  switch (panel) {
    case 'availability':
      return 'API availability — dependency health'
    case 'latency':
      return 'API latency — conversational runtime'
    case 'tools':
      return 'Tool execution — agent actions'
    case 'errors':
      return 'API errors & failure mix'
    case 'incidents':
      return 'Active API incidents'
    default:
      return 'API runtime'
  }
}

function panelSubtitle(_panel: ApiRuntimeWidgetPanel, timeRange: TimeRange): string {
  const windowLabel = timeRange === '1h' ? 'Last hour' : timeRange === '7d' ? 'Last 7 days' : 'Last 24 hours'
  return `${windowLabel} · enterprise agent tool-calling context`
}

export function ApiRuntimeWidgetDrawer({
  open,
  panel,
  onClose,
  timeRange,
  apiRows,
  overview,
  incidents,
  aggregates,
}: {
  open: boolean
  panel: ApiRuntimeWidgetPanel | null
  onClose: () => void
  timeRange: TimeRange
  apiRows: ApiToolRuntimeRow[]
  overview: ApiRuntimeOverview
  incidents: ApiRuntimeIncident[]
  aggregates: Aggregates
}) {
  if (!panel) return null

  const mix = overview.errorMix
  const worstTools = [...apiRows]
    .sort((a, b) => parsePct(b.toolExecFailureRate) - parsePct(a.toolExecFailureRate))
    .slice(0, 3)

  const latencySpark = avgSeries(apiRows, 'latencyTrend')
  const p95Spark = avgSeries(apiRows, 'p95Trend')
  const toolSpark = toolSuccessTrendPoints(apiRows)

  return (
    <OperationalDetailDrawer
      open={open}
      onClose={onClose}
      title={panelTitle(panel)}
      subtitle={panelSubtitle(panel, timeRange)}
    >
      {panel === 'availability' ? (
        <>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Degraded dependencies</p>
            {aggregates.degradedNames.length > 0 ? (
              <ul className="mt-2 space-y-1 text-[11px] text-[#f2f0eb]/78">
                {aggregates.degradedNames.map((n) => (
                  <li key={n}>
                    <span className="text-[#D6A85B]">●</span> {n} — agent reachability reduced
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-[11px] text-[#f2f0eb]/60">No degraded APIs in this window.</p>
            )}
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Fleet uptime trend</p>
            <Sparkline points={avgSeries(apiRows, 'sparkline')} className="mt-2 h-6 w-full" />
            <p className="mt-2 text-[11px] text-[#f2f0eb]/68">
              Salesforce API availability dipped to <span className="text-[#D6A85B]">98.1%</span> in EU-West during
              peak support traffic — agent ticket-enrichment tools saw elevated retries.
            </p>
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Regional dependency health</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] text-[#f2f0eb]/72">
              <li>US-East: primary path green for CRM and ticketing tools.</li>
              <li>EU-West: watch Zendesk and calendar dependencies for support agents.</li>
              <li>Internal IAM: all regions within SLO — token introspection stable.</li>
            </ul>
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Recent recovery</p>
            <p className="mt-1 text-[11px] text-[#f2f0eb]/72">
              Identity / Auth API recovered after proactive token refresh at 09:08 UTC — tool gates cleared for all
              fleets.
            </p>
          </div>
        </>
      ) : null}

      {panel === 'latency' ? (
        <>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Fleet latency trend</p>
            <p className="mt-1 text-[10px] text-[#f2f0eb]/48">Avg dependency latency (rolling)</p>
            <Sparkline points={latencySpark} className="mt-1 h-6 w-full" />
            <p className="mt-2 text-[10px] text-[#f2f0eb]/48">p95 trend</p>
            <Sparkline points={p95Spark} className="mt-1 h-6 w-full" danger />
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Slowest dependencies (p95)</p>
            <ul className="mt-2 space-y-1 text-[11px] text-[#f2f0eb]/78">
              {aggregates.slowest.map((s) => (
                <li key={s.name} className="flex justify-between gap-2">
                  <span>{s.name}</span>
                  <span className="tabular-nums text-[#8abefc]">{s.p95}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Endpoint spikes</p>
            <p className="mt-2 text-[11px] leading-relaxed text-[#f2f0eb]/72">
              <span className="font-medium text-[#f2f0eb]">/tickets/create</span> latency increased by{' '}
              <span className="text-[#D6A85B]">34%</span> during retry amplification on Zendesk — support assistant
              turns felt slower until backoff kicked in.
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-[#f2f0eb]/72">
              Google Calendar <span className="font-medium text-[#f2f0eb]">freebusy/query</span> p95 elevated in EU —
              scheduling agent handoffs queued briefly.
            </p>
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Regional latency</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] text-[#f2f0eb]/68">
              <li>US-East: ~{Math.round(aggregates.fleetAvgMs * 0.92)}ms avg vs fleet baseline.</li>
              <li>EU-West: +{Math.round(aggregates.fleetP95Ms * 0.08)}ms p95 delta on ticketing integrations.</li>
            </ul>
          </div>
        </>
      ) : null}

      {panel === 'tools' ? (
        <>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Tool success trend</p>
            <Sparkline points={toolSpark} className="mt-2 h-6 w-full" />
            <p className="mt-2 text-[11px] text-[#f2f0eb]/65">
              Inferred from tool failure telemetry across agent workflows ({overview.toolSuccessRate} success rate).
            </p>
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Failed tool workflows</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] text-[#f2f0eb]/72">
              <li>Shipment tracking tool: validation errors before carrier fallback path.</li>
              <li>CRM profile tool: intermittent schema mismatch on custom fields.</li>
              <li>Calendar create: timeout after third retry in EU shard.</li>
            </ul>
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Fallback &amp; retries</p>
            <p className="mt-1 text-[11px] text-[#f2f0eb]/72">
              Fallback executions: <span className="font-semibold text-[#8abefc]">{overview.fallbackShare}</span> of
              tool invocations. Retry amplification <span className="text-[#D6A85B]">{overview.toolRetryAmp}</span> on
              bursty agent sends (Slack, Zendesk).
            </p>
            <p className="mt-2 text-[11px] text-[#f2f0eb]/65">
              Shipment tracking tool triggered fallback execution{' '}
              <span className="font-medium text-[#f2f0eb]">142×</span> in the last 24h during carrier outage window.
            </p>
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Highest tool failure rates</p>
            <ul className="mt-2 space-y-1 text-[11px] text-[#f2f0eb]/78">
              {worstTools.map((r) => (
                <li key={r.id} className="flex justify-between gap-2">
                  <span className="truncate">{r.name}</span>
                  <span className="shrink-0 text-[#D6A85B]">{r.toolExecFailureRate}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : null}

      {panel === 'errors' ? (
        <>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Failure mix (agent dependency calls)</p>
            <div className="mt-2 flex h-3 overflow-hidden rounded-md bg-white/[0.06]">
              <span className="h-full bg-[#D6A85B]/85" style={{ width: `${parsePct(mix.clientErrorsPct)}%` }} />
              <span className="h-full bg-[#E07a83]/80" style={{ width: `${parsePct(mix.serverErrorsPct)}%` }} />
              <span className="h-full bg-[#8abefc]/75" style={{ width: `${parsePct(mix.timeoutPct)}%` }} />
              <span className="h-full bg-[#c49fd4]/70" style={{ width: `${parsePct(mix.schemaPct)}%` }} />
            </div>
            <ul className="mt-2 grid grid-cols-2 gap-2 text-[10px] text-[#f2f0eb]/65">
              <li>4xx / auth: {mix.clientErrorsPct}%</li>
              <li>5xx: {mix.serverErrorsPct}%</li>
              <li>Timeouts: {mix.timeoutPct}%</li>
              <li>Schema validation: {mix.schemaPct}%</li>
            </ul>
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Auth &amp; contract drift</p>
            <p className="mt-1 text-[11px] text-[#f2f0eb]/72">
              Auth failures cluster on token refresh boundaries for ServiceNow and long-lived support sessions. Schema
              validation failures ticked up after Internal CRM API minor version — agent tool contracts re-validated.
            </p>
            <p className="mt-2 text-[11px] text-[#f2f0eb]/65">
              Schema validation failures increased after CRM API version update — contract tests flagged{' '}
              <span className="text-[#f2f0eb]/80">/customer/profile</span> field map drift.
            </p>
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Timeout categories</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] text-[#f2f0eb]/68">
              <li>Upstream read timeouts on ticket search and macro list.</li>
              <li>Client-side agent timeout budget exceeded on chained CRM + calendar tools.</li>
            </ul>
          </div>
        </>
      ) : null}

      {panel === 'incidents' ? (
        <>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Incident timeline &amp; impact</p>
            <ul className="mt-2 space-y-3">
              {incidents.map((inc) => (
                <li key={inc.id} className="border-b border-white/[0.06] pb-2 last:border-0 last:pb-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-medium uppercase text-[#f2f0eb]/50">{inc.severity}</span>
                    <span className="text-[12px] font-semibold text-[#f2f0eb]">{inc.apiName}</span>
                    <span className="text-[11px] text-[#f2f0eb]/45">{inc.timestamp}</span>
                    <span className="text-[11px] text-[#8abefc]">{inc.status}</span>
                  </div>
                  <p className="mt-1 text-[11px] font-medium text-[#f2f0eb]/85">{inc.title}</p>
                  <p className="mt-0.5 text-[11px] text-[#f2f0eb]/65">{inc.shortNote}</p>
                  <p className="mt-1 text-[10px] text-[#f2f0eb]/48">
                    Affected: Support Assistant, Escalation Router · enterprise conversational workflows
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Example window</p>
            <p className="mt-1 text-[11px] text-[#f2f0eb]/72">
              Slack API rate limiting affected escalation workflows between <span className="font-mono text-[#f2f0eb]/80">09:12–09:41 UTC</span> — agents queued outbound messages until Retry-After cleared.
            </p>
          </div>
        </>
      ) : null}
    </OperationalDetailDrawer>
  )
}
