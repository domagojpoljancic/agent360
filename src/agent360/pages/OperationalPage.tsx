import { useState } from 'react'
import { AIEntrySurface } from '../components/assistant/AIEntrySurface'
import { ExperimentalAssistant } from '../components/assistant/ExperimentalAssistant'
import { Agent360Footer } from '../components/Agent360Footer'
import { GridBackground } from '../components/GridBackground'
import { Header } from '../components/Header'
import { SphereCard } from '../components/SphereCard'

const LAUNCH_FLAG_KEY = 'agent360.launching'
// Window during which a stale flag is still considered a fresh arrival —
// guards against showing the cinematic on a much later session reload.
const LAUNCH_HANDOFF_WINDOW_MS = 1500

/** Detect whether this mount is the cinematic arrival from the vision page.
 *  Single-shot: consumes the flag immediately so reloads / direct navigation
 *  later in the session don't replay the entrance. */
function detectArrival(): boolean {
  if (typeof window === 'undefined') return false
  const tsStr = sessionStorage.getItem(LAUNCH_FLAG_KEY)
  if (!tsStr) return false
  const ts = parseInt(tsStr, 10)
  if (Number.isNaN(ts)) {
    sessionStorage.removeItem(LAUNCH_FLAG_KEY)
    return false
  }
  if (Date.now() - ts >= LAUNCH_HANDOFF_WINDOW_MS) {
    sessionStorage.removeItem(LAUNCH_FLAG_KEY)
    return false
  }
  sessionStorage.removeItem(LAUNCH_FLAG_KEY)
  return true
}

export function OperationalPage() {
  // Captured once at mount — the entrance class never changes for the
  // lifetime of the page so the animation never re-triggers.
  const [arrived] = useState<boolean>(detectArrival)

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip text-[#f2f0eb]">
      <GridBackground />

      {/* Continuation bloom — only when arriving from a vision launch.
          Mounts at the same visual state the vision flash ended at
          (scale 1.6, opacity 1) and dissipates outward, revealing the
          operating layer beneath. Pointer-events: none so it never blocks. */}
      {arrived && (
        <div
          aria-hidden
          className="a360-emerge-bloom pointer-events-none fixed inset-0 z-[55]"
        />
      )}

      {/* Cinematic entrance when arriving from the vision launch; subtle
          fade-up otherwise. */}
      <div
        className={`relative z-10 flex flex-1 flex-col ${arrived ? 'a360-emerge-content' : 'a360-fade-up'}`}
      >
        <Header />

        <main className="mx-auto max-w-[1440px] flex-1 px-4 pb-12 pt-10 md:px-6 md:pb-14 md:pt-14">
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

        <Agent360Footer />
      </div>
    </div>
  )
}
