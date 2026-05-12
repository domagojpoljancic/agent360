import { useEffect, useState } from 'react'
import { Agent360Footer } from '../components/Agent360Footer'
import { GridBackground } from '../components/GridBackground'
import { TeamCard } from '../components/TeamCard'
import { VisionHero } from '../components/VisionHero'
import { VisionSphere } from '../components/VisionSphere'
import { teams } from '../data/views'
import { navigate } from '../router'

// Navigation handoff happens at the peak of the bloom transition so the
// OperationalPage can pick up at the same visual state — see the
// `.a360-emerge-bloom` rule in index.css for the matching exit animation.
const LAUNCH_DURATION_MS = 600
const LAUNCH_FLAG_KEY = 'agent360.launching'

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
    // Drop a single-shot flag the operational page reads on mount to
    // continue the bloom — survives the route change, consumed once.
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(LAUNCH_FLAG_KEY, String(Date.now()))
    }
    setLaunching(true)
  }

  return (
    <div
      className={`a360-vision-root relative flex min-h-screen flex-col overflow-x-clip text-[#f2f0eb] ${
        launching ? 'is-launching' : ''
      }`}
    >
      <GridBackground />

      {/* Ambient atmosphere — cinematic decorative 360° sphere behind the
          hero. Fades during the launch transition via .a360-vision-ambient.
          Sphere is purely decorative (aria-hidden, pointer-events-none). */}
      <div
        aria-hidden
        className="a360-vision-ambient pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      >
        <VisionSphere
          className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 'min(120vw, 1280px)',
            height: 'min(120vw, 1280px)',
          }}
        />

        {/* Soft text-stage vignette — gently darkens the region behind the
            hero copy so the moving sphere atmosphere never reduces contrast
            on the headline / subhead. Sits over the sphere, under content. */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 58% 42% at 50% 46%, rgba(15,17,24,0.30), transparent 64%)',
          }}
        />
      </div>

      {/* Launch flash — radial bloom that covers the screen at end of transition. */}
      <div aria-hidden className="a360-vision-flash pointer-events-none fixed inset-0 z-[55]" />

      {/* Page content (the part that scales, blurs, and fades on launch) */}
      <div className="a360-vision-content relative z-10 flex flex-1 flex-col">
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 md:px-6">
          {/* Section 1 — Hero. Vertical footprint is tuned so the "For every
              team" section appears above the fold on standard laptop heights:
              `min-h-[66vh]` plus tighter top/bottom padding keeps the hero
              cinematic while pulling section 2 ~120-150px higher. */}
          <section className="flex min-h-[66vh] flex-col items-center justify-center pt-14 pb-12 md:pt-20 md:pb-16">
            <VisionHero onLaunch={handleLaunch} launching={launching} />
          </section>

          {/* Section 2 — Built for every team. Padding tightened so the team
              cards start landing above the fold on common viewport heights. */}
          <section className="pb-16 md:pb-20">
            <header className="mx-auto mb-6 flex max-w-3xl flex-col items-center gap-3 text-center md:mb-8">
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

        <Agent360Footer />
      </div>
    </div>
  )
}
