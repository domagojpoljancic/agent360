import { ArrowUpRight } from 'lucide-react'
import type { OutcomeInsight } from '../data'
import { ValueSparkline } from './shared'

type OutcomeInsightsProps = {
  insights: OutcomeInsight[]
}

export function OutcomeInsights({ insights }: OutcomeInsightsProps) {
  return (
    <section className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-4 md:p-5">
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#f2f0eb]/42">Outcome Insights</p>
          <h2 className="mt-1 text-lg font-semibold text-[#f2f0eb]">Strategic wins surfaced by Agent360</h2>
        </div>
        <p className="max-w-lg text-[12px] leading-relaxed text-[#f2f0eb]/52">
          Clear business narratives, not raw activity metrics.
        </p>
      </header>

      <div className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-4">
        {insights.map((insight, index) => (
          <article
            key={insight.id}
            className="group relative isolate flex min-h-[360px] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#20202a]/66 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#5DC2A8]/28 hover:bg-[#242432]/74 hover:shadow-[0_22px_60px_-46px_rgba(93,194,168,0.78)]"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <div aria-hidden className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#5DC2A8]/50 to-transparent opacity-0 transition group-hover:opacity-100" />

            <div className="flex min-h-[54px] flex-col gap-2">
              <span className="w-fit rounded-full border border-[#5DC2A8]/20 bg-[#5DC2A8]/[0.07] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-[#5DC2A8]">
                {insight.impactLabel}
              </span>
              <p className="truncate text-[12px] font-medium text-[#f2f0eb]/48">{insight.agent}</p>
            </div>

            <div className="mt-5 min-h-[132px]">
              <h3 className="line-clamp-3 text-[18px] font-semibold leading-snug tracking-tight text-[#f2f0eb]">
                {insight.headline}
              </h3>
              <p className="mt-3 line-clamp-2 text-[13px] leading-relaxed text-[#f2f0eb]/54">{insight.narrative}</p>
            </div>

            <div className="mt-auto pt-4">
              <div className="min-h-[34px]">
                <p className="text-[25px] font-semibold leading-none tracking-tight text-[#f2f0eb]">{insight.metric}</p>
              </div>

              <div className="mt-4 h-12 rounded-xl bg-white/[0.018] px-1.5 py-1">
                <ValueSparkline points={insight.sparkline} className="h-full w-full" />
              </div>

              <div className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium text-[#5DC2A8] opacity-75 transition group-hover:opacity-100">
                View journeys
                <ArrowUpRight className="size-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
