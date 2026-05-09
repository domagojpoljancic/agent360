import { ArrowUpRight } from 'lucide-react'
import type { ValueOpportunity } from '../data'

type ValueOpportunityFeedProps = {
  opportunities: ValueOpportunity[]
}

export function ValueOpportunityFeed({ opportunities }: ValueOpportunityFeedProps) {
  return (
    <section className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-4 md:p-5">
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#f2f0eb]/42">Value Opportunities</p>
          <h2 className="mt-1 text-lg font-semibold text-[#f2f0eb]">Where more value can be unlocked</h2>
        </div>
        <p className="max-w-xl text-[12px] leading-relaxed text-[#f2f0eb]/52">
          Decision support for expansion, adoption, and optimization.
        </p>
      </header>

      <div className="grid gap-3 lg:grid-cols-2 2xl:grid-cols-4">
        {opportunities.map((opportunity) => (
          <article
            key={opportunity.id}
            className="group relative flex min-h-[324px] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#20202a]/64 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#5DC2A8]/28 hover:bg-[#242432]/72 hover:shadow-[0_22px_54px_-44px_rgba(93,194,168,0.76)]"
          >
            <div aria-hidden className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#5DC2A8]/45 to-transparent opacity-0 transition group-hover:opacity-100" />

            <div className="min-h-[62px] space-y-2.5">
              <span
                className={`inline-flex w-full justify-center rounded-full border px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] ${
                  opportunity.priority === 'High'
                    ? 'border-[#3DD68C]/25 bg-[#3DD68C]/[0.07] text-[#3DD68C]'
                    : 'border-[#D6A85B]/25 bg-[#D6A85B]/[0.07] text-[#D6A85B]'
                }`}
              >
                {opportunity.priority} leverage
              </span>
              <p className="truncate text-[12px] font-medium text-[#f2f0eb]/55">{opportunity.agent}</p>
            </div>

            <div className="mt-4 min-h-[92px]">
              <h3 className="line-clamp-2 text-[18px] font-semibold leading-snug tracking-tight text-[#f2f0eb]">{opportunity.title}</h3>
              <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-[#f2f0eb]/56">{opportunity.description}</p>
            </div>

            <div className="mt-3 min-h-[74px] rounded-2xl border border-[#5DC2A8]/[0.10] bg-[#5DC2A8]/[0.04] px-3.5 py-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#f2f0eb]/34">Potential impact</p>
              <p className="mt-1 text-[19px] font-semibold leading-tight tracking-tight text-[#f2f0eb]">{opportunity.impact}</p>
            </div>

            <div className="mt-auto min-h-[54px] pt-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#f2f0eb]/38">Recommended move</p>
              <p className="mt-1 line-clamp-1 text-[13px] font-medium text-[#f2f0eb]/76">{opportunity.recommendation}</p>
            </div>
            <button
              type="button"
              className="mt-3 inline-flex min-h-5 items-center gap-1 text-[12px] font-medium text-[#5DC2A8] opacity-75 transition group-hover:opacity-100"
            >
              View brief
              <ArrowUpRight className="size-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
