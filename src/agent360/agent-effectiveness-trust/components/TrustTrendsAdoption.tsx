import type { TrustTrendSeries } from '../data'
import { Sparkline } from './shared'
import { ExplainMetricPopover } from './ExplainMetricPopover'

type TrustTrendsAdoptionProps = {
  series: TrustTrendSeries[]
}

function trendTone(trend: TrustTrendSeries['trend']) {
  if (trend === 'up') return 'text-[#3DD68C]'
  if (trend === 'down') return 'text-[#D6A85B]'
  return 'text-[#f2f0eb]/58'
}

export function TrustTrendsAdoption({ series }: TrustTrendsAdoptionProps) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 md:p-4">
      <header className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#f2f0eb]/42">Trends</p>
          <div className="mt-1 flex items-center gap-1">
            <h2 className="text-lg font-semibold text-[#f2f0eb]">Trust & adoption</h2>
            <ExplainMetricPopover explainKey="section-trust-trends" className="shrink-0" />
          </div>
        </div>
        <p className="text-[11px] text-[#f2f0eb]/50">Copilot adoption ↑ · retry/clarify loops ↓</p>
      </header>
      <div className="grid gap-3 md:grid-cols-2">
        {series.map((trend) => (
          <article
            key={trend.id}
            className="rounded-xl border border-white/[0.07] bg-[#20202a]/70 p-3 transition hover:border-[#9aa6f0]/35"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-start gap-1">
                <div>
                  <h3 className="text-[13px] font-semibold text-[#f2f0eb]">{trend.title}</h3>
                  {trend.subtitle ? (
                    <p className="mt-0.5 text-[11px] text-[#f2f0eb]/50">{trend.subtitle}</p>
                  ) : null}
                </div>
                {trend.explainKey ? <ExplainMetricPopover explainKey={trend.explainKey} /> : null}
              </div>
              <span className={`shrink-0 text-[11px] font-medium ${trendTone(trend.trend)}`}>
                {trend.trend === 'up' ? '↑' : trend.trend === 'down' ? '↓' : '—'}
              </span>
            </div>
            <p className="mt-2 text-[26px] font-semibold tabular-nums leading-none text-[#f2f0eb]">{trend.value}</p>
            <div className="mt-2 h-14 rounded-md border border-white/[0.06] bg-white/[0.02] px-1 py-0.5">
              <Sparkline
                points={trend.points}
                danger={trend.id === 'retry-clarification-trend' ? trend.trend === 'up' : trend.trend === 'down'}
                className="h-full w-full"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
