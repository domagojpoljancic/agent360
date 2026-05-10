import type { PageTheme } from '../../data/pageThemes'
import type { ValueMetric } from '../data'
import { ValueSparkline } from './shared'

type BusinessImpactStripProps = {
  metrics: ValueMetric[]
  theme: PageTheme
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

export function BusinessImpactStrip({ metrics, theme }: BusinessImpactStripProps) {
  return (
    <section className={theme.kpiStripSection}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className={theme.kpiStripAura} />
        <div className={theme.kpiStripAuraSecondary} />
        <div className={theme.kpiStripTopLine} />
      </div>

      <header className="mb-4">
        <div>
          <p className={`text-[10px] uppercase tracking-[0.24em] ${theme.kpiStripLabel}`}>
            Business Impact Overview
          </p>
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
              className={`group relative flex min-h-[238px] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#20202a]/68 p-5 transition duration-300 hover:-translate-y-0.5 hover:bg-[#242432]/72 ${theme.kpiCardHoverBorder} ${theme.kpiCardHoverShadow}`}
            >
              <div className="min-h-[62px]">
                <p className="line-clamp-2 min-h-9 text-[11.5px] font-medium leading-[18px] text-[#f2f0eb]/62">
                  {metric.label}
                </p>
                <span className={`mt-1 block truncate text-[11px] font-medium leading-4 ${theme.kpiCardTrendMuted}`}>
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
