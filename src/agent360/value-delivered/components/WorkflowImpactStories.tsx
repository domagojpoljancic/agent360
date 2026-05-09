import { ArrowRight, CheckCircle2 } from 'lucide-react'
import type { WorkflowImpactStory } from '../data'

type WorkflowImpactStoriesProps = {
  stories: WorkflowImpactStory[]
}

export function WorkflowImpactStories({ stories }: WorkflowImpactStoriesProps) {
  return (
    <section className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-4 md:p-5">
      <header className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#f2f0eb]/42">Workflow Impact Stories</p>
          <h2 className="mt-1 text-lg font-semibold text-[#f2f0eb]">Before and after operational improvements</h2>
        </div>
        <p className="max-w-xl text-[12px] leading-relaxed text-[#f2f0eb]/52">
          Proof that value is showing up in real customer and employee workflows.
        </p>
      </header>

      <div className="grid gap-3 xl:grid-cols-3">
        {stories.map((story) => (
          <article
            key={story.id}
            className="group flex min-h-[520px] flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#20202a]/72 transition duration-300 hover:-translate-y-0.5 hover:border-[#5DC2A8]/35 hover:shadow-[0_22px_60px_-44px_rgba(93,194,168,0.85)]"
          >
            <div className="border-b border-white/[0.06] p-4">
              <p className="text-[11px] font-medium text-[#5DC2A8]">{story.agent}</p>
              <h3 className="mt-1 text-[17px] font-semibold text-[#f2f0eb]">{story.title}</h3>
            </div>

            <div className="grid gap-3 p-4 md:grid-cols-[1fr_auto_1fr] xl:grid-cols-1">
              <div className="min-h-[126px] rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3">
                <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/38">Before AI</p>
                <p className="text-[13px] leading-relaxed text-[#f2f0eb]/58">{story.before}</p>
              </div>
              <div className="hidden items-center justify-center text-[#5DC2A8]/70 md:flex xl:hidden">
                <ArrowRight className="size-4" />
              </div>
              <div className="min-h-[126px] rounded-2xl border border-[#5DC2A8]/[0.18] bg-[#5DC2A8]/[0.06] p-3">
                <p className="mb-2 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#5DC2A8]">
                  <CheckCircle2 className="size-3.5" />
                  After AI
                </p>
                <p className="text-[13px] leading-relaxed text-[#f2f0eb]/72">{story.after}</p>
              </div>
            </div>

            <div className="mx-4 mb-4 mt-auto flex min-h-[104px] items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-[#15151c]/45 p-3">
              <div className="shrink-0">
                <p className="text-[28px] font-semibold leading-none tracking-tight text-[#f2f0eb]">{story.metric}</p>
                <p className="mt-1 text-[12px] text-[#5DC2A8]">{story.delta}</p>
              </div>
              <p className="max-w-[190px] text-right text-[12px] leading-relaxed text-[#f2f0eb]/50">{story.humanImpact}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
