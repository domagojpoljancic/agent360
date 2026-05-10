import { useEffect, useState } from 'react'
import { Lightbulb, Sparkles } from 'lucide-react'
import type { OptimizationOpportunityCard } from '../data'
import type { TimeRange } from '../../operational-health/data'

type OptimizationOpportunitiesProps = {
  opportunities: OptimizationOpportunityCard[]
  timeRange: TimeRange
}

const ANALYSIS_STEPS = [
  'Analyzing routing patterns…',
  'Evaluating premium model usage…',
  'Comparing trust vs. cost tradeoffs…',
  'Generating optimization recommendations…',
] as const

const ANALYSIS_MS = 3200

function badgeStyle(label: OptimizationOpportunityCard['badges'][number]) {
  if (label === 'High impact') return 'border-[#5DC2A8]/35 bg-[#5DC2A8]/12 text-[#5DC2A8]'
  if (label === 'Low risk') return 'border-[#3694fc]/35 bg-[#3694fc]/12 text-[#3694fc]'
  return 'border-[#D6A85B]/35 bg-[#D6A85B]/12 text-[#D6A85B]'
}

export function OptimizationOpportunities({ opportunities, timeRange }: OptimizationOpportunitiesProps) {
  const [phase, setPhase] = useState<'cta' | 'loading' | 'ready'>('cta')

  useEffect(() => {
    setPhase('cta')
  }, [timeRange])

  function runAnalysis() {
    setPhase('loading')
    window.setTimeout(() => setPhase('ready'), ANALYSIS_MS)
  }

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 md:p-5">
      <header className="mb-4 flex items-start gap-3">
        <div className="rounded-lg border border-[#D6A85B]/25 bg-[#D6A85B]/10 p-2">
          <Lightbulb className="size-5 text-[#D6A85B]" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#f2f0eb]/42">AI-assisted recommendations</p>
          <h2 className="mt-1 text-lg font-semibold text-[#f2f0eb]">Optimization Opportunities</h2>
          <p className="mt-1 text-[13px] text-[#f2f0eb]/58">
            Run an analysis to surface routing and spend opportunities for the selected window.
          </p>
        </div>
      </header>

      {phase === 'cta' ? (
        <div className="rounded-xl border border-white/[0.08] bg-[#1a1b24]/80 px-5 py-8 md:px-8 md:py-9">
          <div className="mx-auto flex max-w-xl flex-col gap-5 md:max-w-none md:flex-row md:items-start md:gap-8">
            <div className="flex shrink-0 justify-center md:justify-start md:pt-0.5">
              <span className="flex size-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
                <Sparkles className="size-4 text-[#f2f0eb]/55" aria-hidden />
              </span>
            </div>
            <div className="min-w-0 flex-1 text-left">
              <h3 className="text-[17px] font-semibold tracking-tight text-[#f2f0eb] md:text-[18px]">
                Run a strategic optimization analysis
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-[#f2f0eb]/58">
                Agent360 will review routing patterns, flagship vs. mid-tier usage, and efficiency signals for this time
                range, then surface ranked opportunities with quality guardrails.
              </p>
              <button
                type="button"
                onClick={runAnalysis}
                className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/[0.12] bg-white/[0.04] px-4 py-2 text-[13px] font-medium text-[#f2f0eb] shadow-sm transition hover:border-[#3694fc]/35 hover:bg-[#3694fc]/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3694fc]/40"
              >
                <Sparkles className="size-3.5 shrink-0 text-[#8abefc]/90" aria-hidden />
                Analyze optimization opportunities
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {phase === 'loading' ? (
        <div className="rounded-xl border border-white/[0.07] bg-[#20202a]/40 px-5 py-8">
          <AnalysisLoadingInline steps={ANALYSIS_STEPS} />
        </div>
      ) : null}

      {phase === 'ready' ? (
        <div className="grid gap-3 motion-safe:animate-[optReveal_0.45s_ease-out] md:grid-cols-2">
          {opportunities.map((card) => (
            <article
              key={card.id}
              className="group flex flex-col rounded-xl border border-white/[0.07] bg-[#20202a]/55 p-4 transition hover:border-[#D6A85B]/30 hover:shadow-[0_20px_50px_-40px_rgba(214,168,91,0.5)]"
            >
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#8abefc]/85">AI recommendation</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {card.badges.map((b) => (
                  <span
                    key={b}
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${badgeStyle(b)}`}
                  >
                    {b}
                  </span>
                ))}
              </div>
              <h3 className="mt-2 text-[15px] font-semibold leading-snug text-[#f2f0eb]">{card.title}</h3>
              <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Affected agents</p>
              <p className="text-[13px] text-[#f2f0eb]/75">{card.agents.join(' · ')}</p>
              <div className="mt-3 grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[#f2f0eb]/42">Savings</p>
                  <p className="mt-0.5 text-[13px] font-semibold text-[#D6A85B]">{card.savingsPerDay}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[#f2f0eb]/42">Quality</p>
                  <p className="mt-0.5 text-[13px] text-[#f2f0eb]">{card.qualityImpact}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[#f2f0eb]/42">Confidence</p>
                  <p className="mt-0.5 text-[13px] text-[#f2f0eb]">{card.confidence}</p>
                </div>
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-[#f2f0eb]/62">
                <span className="font-medium text-[#f2f0eb]/80">Action: </span>
                {card.action}
              </p>
            </article>
          ))}
        </div>
      ) : null}
      <style>{`
        @keyframes optReveal {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}

function AnalysisLoadingInline({ steps }: { steps: readonly string[] }) {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setStepIndex((i) => (i + 1) % steps.length)
    }, 900)
    return () => window.clearInterval(id)
  }, [steps.length])

  return (
    <div className="flex flex-col items-stretch gap-6 sm:flex-row sm:items-center sm:gap-8">
      <div className="flex justify-center sm:justify-start">
        <span className="relative flex size-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03]">
          <span
            className="absolute inset-1 rounded-md bg-[#3694fc]/10 motion-safe:animate-[aiOptSoftPulse_2.4s_ease-in-out_infinite]"
            aria-hidden
          />
          <Sparkles className="relative size-4 text-[#8abefc]/80" aria-hidden />
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#f2f0eb]/40">Analysis in progress</p>
        <p
          key={steps[stepIndex]}
          className="mt-2 text-[13px] font-medium leading-relaxed text-[#f2f0eb]/82 motion-safe:animate-[aiOptFade_0.45s_ease-out]"
        >
          {steps[stepIndex]}
        </p>
        <div className="mt-5 h-px w-full max-w-[280px] overflow-hidden rounded-full bg-white/[0.06]">
          <div className="h-full w-2/5 motion-safe:animate-[shimmerOpt_2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-[#3694fc]/25 to-transparent" />
        </div>
      </div>
      <style>{`
        @keyframes aiOptFade {
          from { opacity: 0; transform: translateY(3px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmerOpt {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(380%); }
        }
        @keyframes aiOptSoftPulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.65; transform: scale(1.02); }
        }
      `}</style>
    </div>
  )
}
