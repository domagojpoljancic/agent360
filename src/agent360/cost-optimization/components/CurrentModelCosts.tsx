import { Info } from 'lucide-react'
import {
  currentModelCostFleetInsight,
  currentModelCostReference,
  type ModelCostTier,
} from '../data'

const TOOLTIP =
  'Reference costs help estimate whether premium routing is justified. Daily spend is a modeled 24h allocation to each model and approximates billing timing. Actual prices vary by provider, tier, caching, batch usage, and contract terms.'

function tierPillClass(tier: ModelCostTier): string {
  if (tier === 'premium') {
    return 'border-[#c9a227]/35 bg-[#c9a227]/10 text-[#f0d78c]'
  }
  if (tier === 'high') {
    return 'border-[#D6A85B]/30 bg-[#D6A85B]/10 text-[#E8C080]'
  }
  return 'border-emerald-500/25 bg-emerald-500/[0.07] text-[#3DD68C]'
}

function tierLabel(tier: ModelCostTier): string {
  if (tier === 'premium') return 'Premium'
  if (tier === 'high') return 'High'
  return 'Low'
}

/** Neutral metric pill — matches common Agent360 badge rhythm (border-white/[0.08], glass fill). */
const sharePillClass =
  'inline-flex min-w-[2.75rem] items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-0.5 text-[10px] font-medium tabular-nums tracking-tight text-[#f2f0eb]/72'

export function CurrentModelCosts() {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 md:p-4">
      <header className="mb-2.5 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#f2f0eb]/42">Reference pricing</p>
            <button
              type="button"
              className="inline-flex shrink-0 rounded p-0.5 text-[#f2f0eb]/35 transition hover:text-[#D6A85B] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D6A85B]/45"
              title={TOOLTIP}
              aria-label="About reference model pricing and spend allocation"
            >
              <Info className="size-3.5" strokeWidth={1.75} />
            </button>
          </div>
          <h2 className="mt-1 text-lg font-semibold text-[#f2f0eb]">Current Model Costs</h2>
          <p className="mt-1 max-w-3xl text-[12px] leading-snug text-[#f2f0eb]/58">
            Reference pricing and current spend across models used by the NovaMart agent fleet.
          </p>
        </div>
      </header>

      <div className="-mx-1 overflow-x-auto px-1">
        <table className="w-full min-w-[800px] border-collapse text-left text-[11px]">
          <thead>
            <tr className="border-b border-white/[0.07] text-[10px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">
              <th className="pb-2 pr-3 font-medium">Model</th>
              <th className="pb-2 pr-3 font-medium">Provider</th>
              <th className="max-w-[5.5rem] pb-2 pr-3 font-medium leading-tight tabular-nums">
                Input / 1M tokens
              </th>
              <th className="max-w-[5.5rem] pb-2 pr-3 font-medium leading-tight tabular-nums">
                Output / 1M tokens
              </th>
              <th className="max-w-[4.5rem] pb-2 pr-3 text-right font-medium leading-tight tabular-nums">
                Current daily spend
              </th>
              <th className="w-[5.5rem] px-2 pb-2 text-center font-medium leading-tight">Share of AI spend</th>
              <th className="min-w-[8.5rem] pb-2 pr-3 font-medium">Best used for</th>
              <th className="pb-2 font-medium">Relative cost</th>
            </tr>
          </thead>
          <tbody className="text-[#f2f0eb]/78">
            {currentModelCostReference.map((row) => {
              const topDriver = row.model === 'GPT-4o'
              return (
                <tr
                  key={row.model}
                  className={`border-b border-white/[0.05] last:border-0 [&>td]:py-1.5 [&>td]:align-middle ${
                    topDriver ? 'bg-[#D6A85B]/[0.04]' : ''
                  }`}
                >
                  <td className="pr-3">
                    <span className="font-medium text-[#f2f0eb]/88">{row.model}</span>
                    {topDriver ? (
                      <span className="ml-1.5 text-[9px] font-medium uppercase tracking-wider text-[#D6A85B]/90">
                        top driver
                      </span>
                    ) : null}
                  </td>
                  <td className="pr-3 text-[#f2f0eb]/65">{row.provider}</td>
                  <td className="pr-3 tabular-nums text-[#f2f0eb]/72">{row.inputPerM}</td>
                  <td
                    className={`pr-3 tabular-nums ${row.outputPerM === 'N/A' ? 'text-[#f2f0eb]/42' : 'text-[#f2f0eb]/72'}`}
                  >
                    {row.outputPerM}
                  </td>
                  <td className="pr-3 text-right tabular-nums font-medium text-[#f2f0eb]/88">
                    {row.dailySpendDisplay}
                  </td>
                  <td className="px-2 text-center align-middle">
                    <span className={sharePillClass}>{row.shareOfSpendPct}%</span>
                  </td>
                  <td className="pr-3 leading-snug text-[#f2f0eb]/62">{row.bestFor}</td>
                  <td>
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium ${tierPillClass(row.tier)}`}
                    >
                      {tierLabel(row.tier)}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-2.5 text-[11px] leading-snug text-[#f2f0eb]/52">{currentModelCostFleetInsight}</p>

      <p className="mt-2 border-t border-white/[0.06] pt-2 text-[10px] leading-relaxed text-[#f2f0eb]/42">
        Pricing shown reflects representative API reference pricing and may vary by provider configuration, caching, or
        enterprise agreements.
      </p>
    </section>
  )
}
