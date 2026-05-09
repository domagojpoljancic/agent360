import { Activity } from 'lucide-react'
import type { TrustOverviewMetric } from '../data'
import { Sparkline } from './shared'
import { ExplainMetricPopover } from './ExplainMetricPopover'

type TrustOverviewStripProps = {
  metrics: TrustOverviewMetric[]
}

function trendClass(trend: TrustOverviewMetric['trend']): string {
  if (trend === 'up') return 'text-[#3DD68C]'
  if (trend === 'down') return 'text-[#D6A85B]'
  return 'text-[#f2f0eb]/50'
}

export function TrustOverviewStrip({ metrics }: TrustOverviewStripProps) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 md:p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">
          <Activity className="size-3.5 shrink-0 text-[#9aa6f0]" />
          <span>Fleet trust · snapshot</span>
          <ExplainMetricPopover explainKey="section-fleet-trust-snapshot" className="shrink-0" />
        </div>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="group grid h-[180px] grid-rows-[48px_48px_8px_48px] rounded-xl border border-white/[0.07] bg-[#20202a]/70 p-3.5 transition hover:border-[#9aa6f0]/35 hover:shadow-[0_16px_40px_-30px_rgba(154,166,240,0.8)]"
          >
            <div className="relative z-0 flex min-h-0 items-start justify-between gap-1">
              <p className="line-clamp-2 max-h-10 flex-1 pr-1 text-[11px] font-medium leading-5 text-[#f2f0eb]/72">
                {metric.label}
              </p>
              <div className="flex shrink-0 items-start gap-0.5">
                <ExplainMetricPopover explainKey={metric.explainKey} />
                <span className={`text-[11px] font-medium ${trendClass(metric.trend)}`}>
                  {metric.trend === 'up' ? 'Up' : metric.trend === 'down' ? 'Down' : 'Flat'}
                </span>
              </div>
            </div>
            <div className="flex min-h-0 items-start">
              <p className="text-[24px] font-semibold leading-none text-[#f2f0eb]">{metric.value}</p>
            </div>
            <div aria-hidden className="min-h-0" />
            <div className="h-12 shrink-0 rounded-md border border-white/[0.06] bg-white/[0.02] px-1 py-0.5">
              <Sparkline
                points={metric.sparkline}
                danger={metric.tone === 'critical'}
                className="h-full w-full"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
