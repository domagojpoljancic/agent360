import { Sparkles } from 'lucide-react'
import { GridBackground } from './GridBackground'
import { Header } from './Header'

export type ComparisonPageLoaderProps = {
  /** e.g. `Agent360 / Model Comparison` */
  eyebrow: string
  /** Rotating loading lines (same length as active step modulo). */
  steps: readonly string[]
  activeStepIndex: number
  /** Skeleton row placeholders below the hero card. */
  skeletonRowCount?: number
}

/**
 * Full-page loading shell for benchmark/comparison routes.
 * Matches the API Overview loading layout: no footer, full-width main column, fixed shimmer animation.
 */
export function ComparisonPageLoader({
  eyebrow,
  steps,
  activeStepIndex,
  skeletonRowCount = 6,
}: ComparisonPageLoaderProps) {
  const copy = steps[activeStepIndex % steps.length] ?? ''

  return (
    <div className="relative min-h-screen text-[#f2f0eb]">
      <GridBackground variant="page" />
      <div className="relative z-10">
        <Header />
        <main className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-7xl flex-col px-4 pb-20 pt-8 md:px-6">
          <div className="w-full space-y-4">
            <section className="w-full rounded-2xl border border-[#3694fc]/25 bg-[#171722]/90 p-5">
              <div className="flex items-center gap-3">
                <span className="relative flex size-10 shrink-0 items-center justify-center rounded-lg border border-[#3694fc]/30 bg-[#3694fc]/10">
                  <span className="absolute inset-0 animate-pulse rounded-lg bg-[#3694fc]/15" />
                  <Sparkles className="relative size-4 text-[#8abefc]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">{eyebrow}</p>
                  <p className="text-sm text-[#f2f0eb]/82">{copy}</p>
                </div>
              </div>
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
                <div className="h-full w-1/2 animate-[comparisonPageLoaderShimmer_1.2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-[#3694fc]/60 to-transparent" />
              </div>
            </section>
            <section className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 md:p-4">
              <div className="space-y-2">
                {Array.from({ length: skeletonRowCount }, (_, row) => (
                  <div key={row} className="h-9 w-full animate-pulse rounded-md bg-white/[0.04]" />
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
      <style>{`
        @keyframes comparisonPageLoaderShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(220%); }
        }
      `}</style>
    </div>
  )
}
