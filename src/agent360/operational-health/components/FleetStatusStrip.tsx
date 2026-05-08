import { Activity, RefreshCw } from 'lucide-react'
import { StatusBadge } from '../../components/StatusBadge'
import type { FleetMetric } from '../data'
import { Sparkline } from './shared'

type FleetStatusStripProps = {
  metrics: FleetMetric[]
  isRefreshing: boolean
}

function trendClass(trend: FleetMetric['trend']): string {
  if (trend === 'up') return 'text-[#3DD68C]'
  if (trend === 'down') return 'text-[#3694fc]'
  return 'text-[#f2f0eb]/50'
}

export function FleetStatusStrip({ metrics, isRefreshing }: FleetStatusStripProps) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 md:p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">
          <Activity className="size-3.5 text-[#3694fc]" />
          Fleet Status Strip
        </div>
        <StatusBadge
          label={isRefreshing ? 'Refreshing stream' : 'Auto-refresh active'}
          tone="live"
          icon={<RefreshCw className={`size-3 ${isRefreshing ? 'animate-spin' : ''}`} />}
        />
      </div>
      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="group rounded-xl border border-white/[0.07] bg-[#20202a]/70 p-3.5 transition hover:border-[#3694fc]/35 hover:shadow-[0_16px_40px_-30px_rgba(54,148,252,0.8)]"
          >
            <div className="mb-1.5 flex items-start justify-between gap-2">
              <p className="text-[11px] font-medium text-[#f2f0eb]/72">{metric.label}</p>
              <span className={`text-[11px] font-medium ${trendClass(metric.trend)}`}>
                {metric.trend === 'up' ? 'Up' : metric.trend === 'down' ? 'Down' : 'Steady'}
              </span>
            </div>
            <p className="text-[24px] font-semibold leading-none text-[#f2f0eb]">{metric.value}</p>
            <div className="mt-2 rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-1">
              <Sparkline points={metric.sparkline} danger={metric.tone === 'critical'} />
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
