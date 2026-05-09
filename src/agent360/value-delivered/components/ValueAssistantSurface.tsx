import { ArrowUpRight, Sparkles } from 'lucide-react'

type ValueAssistantSurfaceProps = {
  onSubmit: (query: string) => void
}

const prompts = [
  'Which agents create the most value?',
  'Where are we saving the most time?',
  'Which workflows improved after AI rollout?',
  'Show underutilized agents',
]

export function ValueAssistantSurface({ onSubmit }: ValueAssistantSurfaceProps) {
  return (
    <section className="relative isolate overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#20202a]/80 to-[#15151c]/88 p-4 md:p-5">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 -z-10 h-72 w-72 rounded-full bg-[#5DC2A8]/[0.10] blur-3xl" />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="grid size-10 place-items-center rounded-xl border border-[#5DC2A8]/20 bg-[#5DC2A8]/10 text-[#5DC2A8]">
            <Sparkles className="size-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#5DC2A8]">Ask Agent360</p>
            <h2 className="mt-1 text-lg font-semibold text-[#f2f0eb]">Ask about business impact</h2>
            <p className="mt-1 text-[13px] text-[#f2f0eb]/55">
              Use the assistant to explain value drivers, adoption gaps, and scale opportunities.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          {prompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onSubmit(prompt)}
              className="group inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[12px] text-[#f2f0eb]/76 transition hover:-translate-y-px hover:border-[#5DC2A8]/40 hover:bg-[#5DC2A8]/[0.07] hover:text-[#f2f0eb]"
            >
              {prompt}
              <ArrowUpRight className="size-3.5 text-[#5DC2A8] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
