import type { ValueMetric } from '../data'
import { ValueSparkline } from './shared'

type BusinessImpactStripProps = {
  metrics: ValueMetric[]
}

function compactTrendLabel(metric: ValueMetric) {
  if (metric.trend === 'flat') return 'Steady positive'

  const match = metric.trendLabel.match(/([+-]?\d+%|[+-]?\d+\s?pts?)/)
  const value = match?.[0].replace('+', '') ?? metric.trendLabel

  if (metric.trendLabel.includes('prior month')) return `Up ${value} this month`
  if (metric.trendLabel.includes('prior week')) return `Up ${value} this week`
  if (metric.trendLabel.includes('prior day')) return `Up ${value} today`
  return `Up ${value}`
}

export function BusinessImpactStrip({ metrics }: BusinessImpactStripProps) {
  return (
    <section className="relative isolate overflow-hidden rounded-3xl border border-[#5DC2A8]/[0.16] bg-gradient-to-br from-white/[0.055] via-[#20202a]/80 to-[#15151c]/90 p-4 shadow-[0_28px_80px_-60px_rgba(93,194,168,0.9)] md:p-5">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="a360-aura absolute -left-20 -top-24 h-72 w-72 rounded-full bg-[#5DC2A8]/[0.14] blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[#3694fc]/[0.07] blur-3xl" />
        <div className="absolute inset-x-14 top-0 h-px bg-gradient-to-r from-transparent via-[#5DC2A8]/65 to-transparent" />
      </div>

      <header className="mb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-[#5DC2A8]">Business Impact Overview</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-[#f2f0eb] md:text-2xl">
            AI is creating visible operating leverage.
          </h2>
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {metrics.map((metric) => {
          return (
            <article
              key={metric.label}
              className="group relative flex min-h-[238px] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#20202a]/68 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#5DC2A8]/30 hover:bg-[#242432]/72 hover:shadow-[0_22px_50px_-38px_rgba(93,194,168,0.75)]"
            >
              <div className="min-h-[62px]">
                <p className="line-clamp-2 min-h-9 text-[11.5px] font-medium leading-[18px] text-[#f2f0eb]/62">
                  {metric.label}
                </p>
                <span className="mt-1 block truncate text-[11px] font-medium leading-4 text-[#5DC2A8]/85">
                  {compactTrendLabel(metric)}
                </span>
              </div>

              <p className="mt-3 text-[34px] font-semibold leading-none tracking-tight text-[#f2f0eb]">
                {metric.value}
              </p>
              <p className="mt-3 min-h-10 max-w-[14rem] text-[13px] leading-relaxed text-[#f2f0eb]/52">{metric.detail}</p>

              <div className="mt-auto pt-6">
                <div className="h-12 rounded-xl border border-white/[0.055] bg-white/[0.02] px-2 py-1.5">
                  <ValueSparkline points={metric.sparkline} className="h-full w-full" />
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
