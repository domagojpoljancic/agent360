import { useEffect, useState } from 'react'
import { GridBackground } from '../components/GridBackground'
import { TeamCard } from '../components/TeamCard'
import { VisionHero } from '../components/VisionHero'
import { teams } from '../data/views'
import { navigate } from '../router'

const LAUNCH_DURATION_MS = 480

export function VisionPage() {
  const [launching, setLaunching] = useState(false)

  // Cinematic transition out of the vision page into the operational view.
  useEffect(() => {
    if (!launching) return
    const id = setTimeout(() => navigate('/overview'), LAUNCH_DURATION_MS)
    return () => clearTimeout(id)
  }, [launching])

  function handleLaunch() {
    if (launching) return
    setLaunching(true)
  }

  return (
    <div
      className={`a360-vision-root relative min-h-screen overflow-x-clip text-[#f2f0eb] ${
        launching ? 'is-launching' : ''
      }`}
    >
      <GridBackground />

      {/* Ambient atmosphere — slow rotating orbit + soft glows.
          Sits behind everything but above the grid, fades on launch. */}
      <div
        aria-hidden
        className="a360-vision-ambient pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      >
        <div className="absolute left-1/2 top-[48%] h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3694fc]/[0.08] blur-3xl" />
        <div className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2">
          <svg
            viewBox="0 0 800 800"
            className="a360-rotate-slow"
            style={{ width: 'min(110vw, 1200px)', height: 'min(110vw, 1200px)', animationDuration: '90s' }}
          >
            <circle
              cx="400"
              cy="400"
              r="380"
              fill="none"
              stroke="rgba(54,148,252,0.07)"
              strokeWidth="0.8"
              strokeDasharray="2 9"
            />
            <circle
              cx="400"
              cy="400"
              r="290"
              fill="none"
              stroke="rgba(54,148,252,0.06)"
              strokeWidth="0.8"
              strokeDasharray="2 9"
            />
            <circle
              cx="400"
              cy="400"
              r="200"
              fill="none"
              stroke="rgba(54,148,252,0.05)"
              strokeWidth="0.8"
              strokeDasharray="2 9"
            />
          </svg>
        </div>
      </div>

      {/* Launch flash — radial bloom that covers the screen at end of transition. */}
      <div aria-hidden className="a360-vision-flash pointer-events-none fixed inset-0 z-[55]" />

      {/* Page content (the part that scales, blurs, and fades on launch) */}
      <div className="a360-vision-content relative z-10">
        <main className="mx-auto max-w-[1440px] px-4 md:px-6">
          {/* Section 1 — Hero */}
          <section className="flex min-h-[78vh] flex-col items-center justify-center pt-20 pb-20 md:pt-28 md:pb-28">
            <VisionHero onLaunch={handleLaunch} disabled={launching} />
          </section>

          {/* Section 2 — Built for every team */}
          <section className="pb-24 md:pb-28">
            <header className="mx-auto mb-8 flex max-w-3xl flex-col items-center gap-3 text-center md:mb-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.02] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[#f2f0eb]/55">
                <span className="size-1 rounded-full bg-[#3694fc]" />
                For every team
              </span>
              <h2 className="text-balance text-[24px] font-semibold tracking-tight text-[#f2f0eb] md:text-[30px]">
                Built for every team working with AI agents
              </h2>
              <p className="max-w-xl text-[14px] leading-relaxed text-[#f2f0eb]/60 md:text-[15px]">
                One operating view. Four perspectives — each tuned to how its team works with the
                agent fleet.
              </p>
            </header>

            <div className="grid gap-4 sm:grid-cols-2 md:gap-5 xl:grid-cols-4">
              {teams.map((team) => (
                <TeamCard
                  key={team.title}
                  title={team.title}
                  line={team.line}
                  icon={team.icon}
                />
              ))}
            </div>
          </section>
        </main>

        <footer className="border-t border-white/[0.05] px-4 py-5 md:px-6">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between text-[11px] text-[#f2f0eb]/40">
            <p>Agent360 · Operating view for AI agents</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
