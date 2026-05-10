import { Activity } from 'lucide-react'
import type { PageTheme } from '../../data/pageThemes'
import type { FleetMetric } from '../data'
import { Sparkline } from './shared'

type FleetStatusStripProps = {
  metrics: FleetMetric[]
  theme: PageTheme
}

function trendClass(trend: FleetMetric['trend']): string {
  if (trend === 'up') return 'text-[#3DD68C]'
  if (trend === 'down') return 'text-[#3694fc]'
  return 'text-[#f2f0eb]/50'
}

export function FleetStatusStrip({ metrics, theme }: FleetStatusStripProps) {
  return (
    <section className={`relative isolate overflow-hidden ${theme.kpiStripSection}`}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className={theme.kpiStripAura} />
        <div className={theme.kpiStripAuraSecondary} />
        <div className={theme.kpiStripTopLine} />
      </div>
      <div className="mb-3 flex items-center">
        <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">
          <Activity className={`size-3.5 ${theme.kpiStripLabel}`} />
          Fleet Status Strip
        </div>
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className={`group rounded-xl border border-white/[0.07] bg-[#20202a]/70 p-3.5 transition ${theme.kpiCardHoverBorder} ${theme.kpiCardHoverShadow}`}
          >
            <div className="mb-1.5 flex items-start justify-between gap-2">
              <p className="text-[11px] font-medium text-[#f2f0eb]/72">{metric.label}</p>
              <span className={`text-[11px] font-medium ${trendClass(metric.trend)}`}>
                {metric.trend === 'up' ? 'Up' : metric.trend === 'down' ? 'Down' : 'Steady'}
              </span>
            </div>
            <p className="text-[24px] font-semibold leading-none text-[#f2f0eb]">{metric.value}</p>
            <div className="mt-2 rounded-md border border-white/[0.06] bg-white/[0.02] px-1 py-0.5">
              <Sparkline
                points={metric.sparkline}
                danger={metric.tone === 'critical'}
                className="h-6 w-full"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
