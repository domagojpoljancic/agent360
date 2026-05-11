import { Sliders } from 'lucide-react'
import { SparkChart } from '../../components/charts'
import type { PageTheme } from '../../data/pageThemes'
import type { FleetMetric } from '../../operational-health/data'

type CostOverviewStripProps = {
  metrics: FleetMetric[]
  theme: PageTheme
}

function trendClass(trend: FleetMetric['trend']): string {
  if (trend === 'up') return 'text-[#3DD68C]'
  if (trend === 'down') return 'text-[#3694fc]'
  return 'text-[#f2f0eb]/50'
}

export function CostOverviewStrip({ metrics, theme }: CostOverviewStripProps) {
  return (
    <section className={`relative isolate overflow-hidden ${theme.kpiStripSection}`}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className={theme.kpiStripAura} />
        <div className={theme.kpiStripAuraSecondary} />
        <div className={theme.kpiStripTopLine} />
      </div>
      <div className="mb-3 flex items-center">
        <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">
          <Sliders className={`size-3.5 ${theme.kpiStripLabel}`} />
          AI Spend &amp; Efficiency Overview
        </div>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className={`group flex h-full min-h-0 flex-col gap-2 rounded-xl border border-white/[0.07] bg-[#20202a]/70 p-3.5 transition ${theme.kpiCardHoverBorder} ${theme.kpiCardHoverShadow}`}
          >
            {/* Top: label + trend — fixed height so every card shares the same grid band */}
            <div className="flex h-10 items-start justify-between gap-2">
              <p className="min-w-0 flex-1 text-[11px] font-medium leading-snug text-[#f2f0eb]/72 line-clamp-2">
                {metric.label}
              </p>
              <span
                className={`shrink-0 pt-px text-[11px] font-medium leading-none tabular-nums ${trendClass(metric.trend)}`}
              >
                {metric.trend === 'up' ? 'Up' : metric.trend === 'down' ? 'Down' : 'Steady'}
              </span>
            </div>
            {/* Middle: KPI value — fixed row, baseline-aligned */}
            <div className="flex h-7 shrink-0 items-end">
              <p className="text-[24px] font-semibold leading-none tracking-tight text-[#f2f0eb] tabular-nums">
                {metric.value}
              </p>
            </div>
            {/* Bottom: supporting line + sparkline — fixed secondary band + identical chart slot */}
            <div className="flex flex-col gap-2">
              <p className="h-8 text-[10px] leading-tight text-[#f2f0eb]/48 line-clamp-2">
                {metric.secondary ?? '\u00a0'}
              </p>
              <div className="rounded-md border border-white/[0.06] bg-white/[0.02] px-1 py-0.5">
                <SparkChart
                  points={metric.sparkline}
                  danger={metric.tone === 'critical'}
                  tone="cost-optimization"
                  className="h-6 w-full"
                />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
