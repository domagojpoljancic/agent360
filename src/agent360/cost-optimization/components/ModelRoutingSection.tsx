import type { FleetMetric } from '../../operational-health/data'
import type { RoutingComplexityBucket, TopRoutingSignal } from '../data'
import { RoutingEfficiencyInfoPopover } from './RoutingEfficiencyInfoPopover'
import { Sparkline } from '../../operational-health/components/shared'

type ModelRoutingSectionProps = {
  routingSummaryKpis: FleetMetric[]
  routingComplexityBuckets: RoutingComplexityBucket[]
  topRoutingSignals: TopRoutingSignal[]
}

const BUCKET_BAR: Record<string, string> = {
  low: '#3694fc',
  med: '#9aa6f0',
  high: '#5DC2A8',
  risk: '#D6A85B',
}

function trendClass(trend: FleetMetric['trend']): string {
  if (trend === 'up') return 'text-[#3DD68C]'
  if (trend === 'down') return 'text-[#3694fc]'
  return 'text-[#f2f0eb]/50'
}

function statusPillClass(kind: RoutingComplexityBucket['statusKind']) {
  if (kind === 'watch') return 'border-[#D6A85B]/35 bg-[#D6A85B]/12 text-[#D6A85B]'
  if (kind === 'efficient') return 'border-[#5DC2A8]/35 bg-[#5DC2A8]/12 text-[#5DC2A8]'
  if (kind === 'justified') return 'border-[#3694fc]/35 bg-[#3694fc]/12 text-[#3694fc]'
  return 'border-[#8abefc]/35 bg-[#3694fc]/10 text-[#8abefc]'
}

function impactBadgeClass(impact: string) {
  if (impact.includes('High savings')) return 'border-[#5DC2A8]/35 bg-[#5DC2A8]/12 text-[#5DC2A8]'
  if (impact.includes('Expected') || impact.includes('behavior')) return 'border-[#3694fc]/35 bg-[#3694fc]/12 text-[#3694fc]'
  if (impact.includes('Monitor')) return 'border-white/[0.12] bg-white/[0.04] text-[#f2f0eb]/65'
  return 'border-[#D6A85B]/35 bg-[#D6A85B]/12 text-[#D6A85B]'
}

export function ModelRoutingSection({
  routingSummaryKpis,
  routingComplexityBuckets,
  topRoutingSignals,
}: ModelRoutingSectionProps) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 md:p-5">
      <header className="mb-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold text-[#f2f0eb]">Model Routing Efficiency</h2>
          <RoutingEfficiencyInfoPopover />
        </div>
        <p className="mt-1 max-w-2xl text-[13px] text-[#f2f0eb]/58">
          Understand where premium AI models are justified and where lower-cost routing could preserve quality.
        </p>
      </header>

      <div className="mb-5">
        <p className="mb-2.5 text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/42">Routing efficiency summary</p>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {routingSummaryKpis.map((metric) => (
            <article
              key={metric.label}
              className="rounded-xl border border-white/[0.07] bg-[#20202a]/70 p-3.5 transition hover:border-[#D6A85B]/25"
            >
              <div className="mb-1.5 flex items-start justify-between gap-2">
                <p className="text-[11px] font-medium text-[#f2f0eb]/72">{metric.label}</p>
                <span className={`text-[11px] font-medium ${trendClass(metric.trend)}`}>
                  {metric.trend === 'up' ? 'Up' : metric.trend === 'down' ? 'Down' : 'Steady'}
                </span>
              </div>
              <p className="text-[22px] font-semibold leading-none text-[#f2f0eb]">{metric.value}</p>
              <div className="mt-2 rounded-md border border-white/[0.06] bg-white/[0.02] px-1 py-0.5">
                <Sparkline
                  points={metric.sparkline}
                  danger={metric.tone === 'critical'}
                  className="h-5 w-full"
                />
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <p className="mb-2.5 text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/42">Task complexity distribution</p>
        <div className="mb-3 flex h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
          {routingComplexityBuckets.map((b) => (
            <div
              key={b.id}
              className="h-full min-w-0 transition-all"
              style={{ width: `${b.trafficPct}%`, backgroundColor: BUCKET_BAR[b.id] ?? '#3694fc' }}
              title={`${b.label} · ${b.trafficPct}%`}
            />
          ))}
        </div>
        <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-[#f2f0eb]/50">
          {routingComplexityBuckets.map((b) => (
            <span key={b.id} className="inline-flex items-center gap-1.5">
              <span className="size-2 shrink-0 rounded-sm" style={{ backgroundColor: BUCKET_BAR[b.id] }} />
              {b.label} ({b.trafficPct}%)
            </span>
          ))}
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
          {routingComplexityBuckets.map((b) => (
            <div
              key={b.id}
              className="rounded-xl border border-white/[0.07] bg-[#20202a]/55 p-3 transition hover:border-white/[0.11]"
            >
              <p className="text-[12px] font-semibold text-[#f2f0eb]">{b.label}</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-[#f2f0eb]/42">Main model</p>
              <p className="text-[13px] font-medium text-[#f2f0eb]">{b.mainModel}</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-[#f2f0eb]/42">Status</p>
              <span
                className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusPillClass(b.statusKind)}`}
              >
                {b.statusLabel}
              </span>
              {b.recommendation ? (
                <>
                  <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-[#f2f0eb]/42">Recommendation</p>
                  <p className="text-[11px] leading-snug text-[#f2f0eb]/65">{b.recommendation}</p>
                </>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2.5 text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/42">Top routing signals</p>
        <div className="grid gap-2.5 md:grid-cols-3">
          {topRoutingSignals.map((signal) => (
            <article
              key={signal.id}
              className="rounded-xl border border-white/[0.07] bg-[#20202a]/50 p-3 transition hover:border-white/[0.12]"
            >
              <p className="text-[12px] font-semibold text-[#f2f0eb]">{signal.title}</p>
              <p className="mt-1.5 text-[12px] leading-snug text-[#f2f0eb]/68">{signal.sentence}</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-[#f2f0eb]/42">Affected</p>
              <p className="text-[11px] text-[#f2f0eb]/78">{signal.agent}</p>
              <span
                className={`mt-2 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${impactBadgeClass(signal.impact)}`}
              >
                {signal.impact}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
