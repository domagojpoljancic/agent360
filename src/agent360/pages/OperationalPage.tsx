import { AIEntrySurface } from '../components/assistant/AIEntrySurface'
import { ExperimentalAssistant } from '../components/assistant/ExperimentalAssistant'
import { GridBackground } from '../components/GridBackground'
import { Header } from '../components/Header'
import { SphereCard } from '../components/SphereCard'

export function OperationalPage() {
  return (
    <div className="relative min-h-screen overflow-x-clip text-[#f2f0eb]">
      <GridBackground />
      {/* Fade-up the entire surface on entry — pairs with the vision page launch transition. */}
      <div className="a360-fade-up relative z-10">
        <Header />

        <main className="mx-auto max-w-[1440px] px-4 pb-16 pt-10 md:px-6 md:pb-20 md:pt-14">
          {/* Dual interaction — sphere navigation + conversational AI.
              Both surfaces are rendered inside <ExperimentalAssistant /> so they
              share submission state with the assistant modal. To revert the AI
              feature: remove this <ExperimentalAssistant /> wrapper, drop the
              AIEntrySurface column, and delete src/agent360/components/assistant/. */}
          <ExperimentalAssistant>
            {({ onSubmit }) => (
              <div className="grid w-full items-stretch gap-5 md:gap-6 xl:grid-cols-2 xl:gap-8">
                <SphereCard />
                <AIEntrySurface onSubmit={onSubmit} />
              </div>
            )}
          </ExperimentalAssistant>
        </main>

        <footer className="border-t border-white/[0.05] px-4 py-5 md:px-6">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between text-[11px] text-[#f2f0eb]/40">
            <p>Agent360 · Operating view for AI agents</p>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-[#3DD68C]" />
              All views streaming
            </span>
          </div>
        </footer>
      </div>
    </div>
  )
}
