import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'

const DEFAULT_STEPS = [
  'Scanning board metrics…',
  'Detecting patterns and anomalies…',
  'Preparing summary…',
] as const

export function AISummaryLoadingState({ steps = DEFAULT_STEPS }: { steps?: readonly string[] }) {
  const activeSteps = steps.length > 0 ? steps : DEFAULT_STEPS
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setStepIndex((i) => (i + 1) % activeSteps.length)
    }, 850)
    return () => window.clearInterval(id)
  }, [activeSteps.length])

  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-6 px-2 py-8">
      <div className="relative">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#3694fc]/20" aria-hidden />
        <span className="relative flex size-14 items-center justify-center rounded-2xl border border-[#3694fc]/35 bg-gradient-to-br from-[#3694fc]/20 to-[#3694fc]/5 shadow-[0_0_28px_-8px_rgba(54,148,252,0.7)]">
          <Sparkles className="size-7 text-[#8abefc] a360-pulse" aria-hidden />
        </span>
      </div>
      <div className="w-full max-w-xs text-center">
        <p
          key={activeSteps[stepIndex]}
          className="text-[13px] font-medium text-[#f2f0eb]/85 motion-safe:animate-[aiSummaryFade_0.35s_ease-out]"
        >
          {activeSteps[stepIndex]}
        </p>
        <div className="mt-4 flex justify-center gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`size-1.5 rounded-full transition-all duration-300 ${
                i === stepIndex % 3
                  ? 'scale-125 bg-[#3694fc]'
                  : 'bg-[#f2f0eb]/25'
              }`}
            />
          ))}
        </div>
      </div>
      <div className="h-px w-full max-w-[200px] overflow-hidden rounded-full bg-white/[0.06]">
        <div className="h-full w-1/2 animate-[shimmer_1.2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-[#3694fc]/40 to-transparent" />
      </div>
      <style>{`
        @keyframes aiSummaryFade {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  )
}
