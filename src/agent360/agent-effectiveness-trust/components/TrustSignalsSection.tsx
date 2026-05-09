import type { TrustSignalCard } from '../data'
import { Sparkline, TrustToneBadge } from './shared'
import { ExplainMetricPopover } from './ExplainMetricPopover'

type TrustSignalsSectionProps = {
  cards: TrustSignalCard[]
  onOpenSignal: (signalId: string) => void
}

export function TrustSignalsSection({ cards, onOpenSignal }: TrustSignalsSectionProps) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 md:p-4">
      <header className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#f2f0eb]/42">Behavior</p>
          <div className="mt-1 flex items-center gap-1">
            <h2 className="text-lg font-semibold text-[#f2f0eb]">Trust signals</h2>
            <ExplainMetricPopover explainKey="section-trust-signals" className="shrink-0" />
          </div>
        </div>
        <p className="text-[11px] text-[#f2f0eb]/50">Open a card for investigation</p>
      </header>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.id}
            role="button"
            tabIndex={0}
            onClick={() => onOpenSignal(card.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onOpenSignal(card.id)
              }
            }}
            className="grid cursor-pointer grid-rows-[auto_auto_1fr_auto] rounded-xl border border-white/[0.07] bg-[#20202a]/70 p-3 transition hover:border-[#9aa6f0]/35 hover:bg-[#232331] min-h-[200px]"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-start gap-1">
                <h3 className="text-[13px] font-semibold leading-snug text-[#f2f0eb]">{card.title}</h3>
                <div onClick={(event) => event.stopPropagation()} className="shrink-0">
                  <ExplainMetricPopover explainKey={card.explainKey} />
                </div>
              </div>
              <TrustToneBadge tone={card.tone} />
            </div>
            <div className="mt-2 flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[#f2f0eb]/40">{card.metricLabel}</p>
                <p className="mt-0.5 text-2xl font-semibold tabular-nums text-[#f2f0eb]">{card.metricValue}</p>
              </div>
              <div className="h-14 w-[7.5rem] shrink-0 rounded-md border border-white/[0.06] bg-white/[0.02] px-1 py-0.5">
                <Sparkline points={card.trend} danger={card.tone === 'critical'} className="h-full w-full" />
              </div>
            </div>
            {card.bars ? (
              <div className="mt-3 space-y-1.5">
                {card.bars.map((bar) => (
                  <div key={bar.label}>
                    <div className="mb-0.5 flex items-center justify-between text-[10px] text-[#f2f0eb]/65">
                      <span className="truncate pr-2">{bar.label}</span>
                      <span className="shrink-0 tabular-nums">{bar.value}%</span>
                    </div>
                    <div className="h-1 rounded-full bg-white/[0.07]">
                      <div className="h-full rounded-full bg-[#9aa6f0]" style={{ width: `${bar.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="min-h-[4px]" />
            )}
            {card.insightLine ? (
              <p className="mt-2 border-t border-white/[0.06] pt-2 text-[11px] leading-snug text-[#f2f0eb]/58">
                {card.insightLine}
              </p>
            ) : (
              <div />
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
