import { ArrowLeft } from 'lucide-react'
import { Agent360Footer } from '../components/Agent360Footer'
import { GridBackground } from '../components/GridBackground'
import { Header } from '../components/Header'
import { operationalHealthData } from '../operational-health/data'
import { navigate } from '../router'

type OperationalHealthAgentPageProps = {
  agentId: string
}

export function OperationalHealthAgentPage({ agentId }: OperationalHealthAgentPageProps) {
  const fleetRows = operationalHealthData['24h'].fleetRows
  const agent = fleetRows.find((item) => item.id === agentId)

  if (!agent) {
    return (
      <div className="relative flex min-h-screen flex-col text-[#f2f0eb]">
        <GridBackground variant="page" />
        <div className="relative z-10 flex flex-1 flex-col">
          <Header />
          <main className="mx-auto max-w-4xl flex-1 px-4 py-16 md:px-6">
            <button
              type="button"
              onClick={() => navigate('/operational-health')}
              className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.02] px-3 py-1.5 text-sm"
            >
              <ArrowLeft className="size-3.5" />
              Back to Operational Health
            </button>
            <p className="mt-5 text-[#f2f0eb]/70">Agent not found.</p>
          </main>

          <Agent360Footer />
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen flex-col text-[#f2f0eb]">
      <GridBackground variant="page" />
      <div className="relative z-10 flex flex-1 flex-col">
        <Header />
        <main className="mx-auto max-w-6xl flex-1 space-y-4 px-4 pb-12 pt-8 md:px-6 md:pb-14">
          <button
            type="button"
            onClick={() => navigate('/operational-health')}
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.02] px-3 py-1.5 text-sm text-[#f2f0eb]/80 transition hover:text-[#f2f0eb]"
          >
            <ArrowLeft className="size-3.5" />
            Back to Operational Health
          </button>

          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">Agent Deep Dive</p>
            <h1 className="mt-1 text-[28px] font-semibold tracking-tight">{agent.name}</h1>
            <p className="mt-1 text-sm text-[#f2f0eb]/62">{agent.purpose}</p>
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <article className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
              <h2 className="text-sm font-semibold">Latency Timeline</h2>
              <p className="mt-2 text-sm text-[#f2f0eb]/65">
                p95 is currently {agent.latencyP95} with retry pressure at {agent.summary.retries}.
              </p>
            </article>
            <article className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
              <h2 className="text-sm font-semibold">Dependency Graph</h2>
              <p className="mt-2 text-sm text-[#f2f0eb]/65">{agent.dependencies.join(' · ')}</p>
            </article>
            <article className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
              <h2 className="text-sm font-semibold">Incidents</h2>
              <ul className="mt-2 space-y-1 text-sm text-[#f2f0eb]/65">
                {agent.events.map((event) => (
                  <li key={event}>- {event}</li>
                ))}
              </ul>
            </article>
            <article className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
              <h2 className="text-sm font-semibold">Recommendations</h2>
              <ul className="mt-2 space-y-1 text-sm text-[#f2f0eb]/65">
                {agent.recommendations.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </article>
          </section>
        </main>

        <Agent360Footer />
      </div>
    </div>
  )
}
