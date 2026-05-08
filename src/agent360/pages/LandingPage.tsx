import { GridBackground } from '../components/GridBackground'
import { Header } from '../components/Header'
import { LandingIntro } from '../components/LandingIntro'
import { Orbit360Graphic } from '../components/Orbit360Graphic'
import { TeamCard } from '../components/TeamCard'
import { teams } from '../data/views'

export function LandingPage() {
  return (
    <div className="relative min-h-screen text-[#f2f0eb]">
      <GridBackground />
      <div className="relative z-10">
        <Header />

        <main className="mx-auto max-w-7xl px-4 pb-16 pt-10 md:px-6 md:pb-20 md:pt-16">
          <section className="grid items-center gap-12 md:grid-cols-2 md:gap-10 lg:gap-16">
            <LandingIntro />

            <div className="md:pl-4">
              <Orbit360Graphic />
            </div>
          </section>

          <section className="mt-16 md:mt-24">
            <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#f2f0eb]/45">
                  Built for
                </p>
                <h2 className="mt-1 text-[22px] font-semibold tracking-tight text-[#f2f0eb] md:text-2xl">
                  Built for every team working with AI agents
                </h2>
              </div>
              <span className="text-[12px] text-[#f2f0eb]/45">
                One operating view · four perspectives
              </span>
            </header>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
          <div className="mx-auto flex max-w-7xl items-center justify-between text-[11px] text-[#f2f0eb]/40">
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
