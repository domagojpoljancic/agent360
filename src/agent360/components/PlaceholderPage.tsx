import { ArrowLeft, ArrowRight, Construction } from 'lucide-react'
import { accentClasses, type AgentView } from '../data/views'
import { navigate } from '../router'
import { GridBackground } from './GridBackground'
import { Header } from './Header'
import { StatusBadge, type BadgeTone } from './StatusBadge'

type PlaceholderPageProps = {
  view: AgentView
}

const statusToneMap: Record<AgentView['status']['tone'], BadgeTone> = {
  healthy: 'healthy',
  watch: 'watch',
  critical: 'critical',
  success: 'success',
}

export function PlaceholderPage({ view }: PlaceholderPageProps) {
  const accent = accentClasses[view.accent]
  const Icon = view.icon

  return (
    <div className="relative min-h-screen text-[#f2f0eb]">
      <GridBackground variant="page" />
      <div className="relative z-10">
        <Header />

        <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 md:px-6">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-[12px] text-[#f2f0eb]/75 transition hover:border-white/[0.18] hover:text-[#f2f0eb]"
          >
            <ArrowLeft className="size-3.5" />
            Back to Agent360 Home
          </button>

          <header className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7 md:p-9">
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-x-0 -top-24 h-44 bg-gradient-to-b ${accent.gradient} opacity-70 blur-2xl`}
            />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] ${accent.chip}`}
                  >
                    <Icon className="size-3" />
                    {view.shortTitle}
                  </span>
                  <StatusBadge label={view.status.label} tone={statusToneMap[view.status.tone]} />
                  <StatusBadge
                    label="In design"
                    tone="neutral"
                    icon={<Construction className="size-3" />}
                  />
                </div>
                <h1 className="text-balance text-[34px] font-semibold leading-[1.1] tracking-tight text-[#f2f0eb] md:text-[40px]">
                  {view.title}
                </h1>
                <p className="mt-3 text-base text-[#f2f0eb]/70">{view.question}</p>
              </div>

              <div className="grid w-full grid-cols-3 gap-2 lg:w-auto lg:max-w-md">
                {view.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2.5"
                  >
                    <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#f2f0eb]/45">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-base font-semibold text-[#f2f0eb]">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </header>

          <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
              <div className="mb-5">
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#f2f0eb]/45">
                  Coming next
                </p>
                <h2 className="mt-1 text-lg font-semibold text-[#f2f0eb]">
                  {view.comingNext}
                </h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {view.placeholderCards.map((card) => {
                  const CardIcon = card.icon
                  return (
                    <article
                      key={card.title}
                      className="group relative overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition hover:-translate-y-0.5 hover:border-white/[0.18]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`grid size-9 place-items-center rounded-lg border ${accent.iconWrap}`}
                          >
                            <CardIcon className="size-4" />
                          </span>
                          <div>
                            <h3 className="text-sm font-semibold text-[#f2f0eb]">{card.title}</h3>
                            {card.badge ? (
                              <p
                                className={`text-[10px] uppercase tracking-[0.18em] ${accent.softText}`}
                              >
                                {card.badge}
                              </p>
                            ) : null}
                          </div>
                        </div>
                        {card.metric ? (
                          <div className="text-right">
                            <p className="text-[10px] uppercase tracking-[0.18em] text-[#f2f0eb]/45">
                              {card.metric.label}
                            </p>
                            <p className="text-base font-semibold text-[#f2f0eb]">
                              {card.metric.value}
                            </p>
                          </div>
                        ) : null}
                      </div>

                      <p className="mt-3 text-[13px] leading-relaxed text-[#f2f0eb]/65">
                        {card.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
                        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">
                          <span className={`size-1.5 rounded-full ${accent.dot}`} />
                          Placeholder
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-[12px] font-medium ${accent.text}`}
                        >
                          Preview soon
                          <ArrowRight className="size-3" />
                        </span>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#f2f0eb]/45">
                  Live signal
                </p>
                <p className="mt-2 text-[13px] text-[#f2f0eb]/75">
                  This surface is wired to the same agent signal stream. While the full view is
                  being designed, real-time pulses are already being captured.
                </p>
                <div className="mt-4 space-y-2">
                  {view.stats.map((stat) => (
                    <div
                      key={`pulse-${stat.label}`}
                      className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-[13px]"
                    >
                      <span className="text-[#f2f0eb]/55">{stat.label}</span>
                      <span className="font-medium text-[#f2f0eb]">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 text-sm text-[#f2f0eb] transition hover:border-white/[0.18]"
              >
                <ArrowLeft className="size-3.5" />
                Back to Agent360 Home
              </button>
            </aside>
          </section>
        </main>
      </div>
    </div>
  )
}
