import { useState } from 'react'
import { Orbit, Zap } from 'lucide-react'
import type { SavingsMode, SavingsScenario } from '../data'

type SavingsSimulationProps = {
  scenarios: Record<SavingsMode, SavingsScenario>
}

const modes: { id: SavingsMode; label: string; hint: string }[] = [
  { id: 'conservative', label: 'Conservative', hint: 'Small routing shifts · minimal trust drift' },
  { id: 'balanced', label: 'Balanced', hint: 'Recommended default for most fleets' },
  { id: 'aggressive', label: 'Aggressive', hint: 'Maximum savings · tighter monitoring' },
]

export function SavingsSimulation({ scenarios }: SavingsSimulationProps) {
  const [mode, setMode] = useState<SavingsMode>('balanced')
  const active = scenarios[mode]

  return (
    <section className="relative isolate overflow-hidden rounded-2xl border border-[#3694fc]/[0.18] bg-gradient-to-br from-[#1a1f2e]/90 via-[#171720]/95 to-[#14141a]/95 p-4 md:p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full bg-[#3694fc]/[0.12] blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-[#9aa6f0]/[0.08] blur-3xl"
      />

      <header className="relative mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#8abefc]/90">
            <Orbit className="size-3.5" />
            Routing strategy lab
          </div>
          <h2 className="mt-1 text-xl font-semibold text-[#f2f0eb]">Savings Simulation</h2>
          <p className="mt-1 max-w-xl text-[13px] text-[#f2f0eb]/60">
            Preview how routing changes could affect spend and trust before rollout.
          </p>
        </div>
      </header>

      <div className="relative flex flex-wrap gap-2">
        {modes.map((m) => {
          const selected = mode === m.id
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`flex min-w-[140px] flex-1 flex-col rounded-xl border px-3 py-2.5 text-left transition ${
                selected
                  ? 'border-[#3694fc]/50 bg-[#3694fc]/15 shadow-[0_0_24px_-8px_rgba(54,148,252,0.5)]'
                  : 'border-white/[0.08] bg-white/[0.02] hover:border-white/[0.14]'
              }`}
            >
              <span className="text-[13px] font-semibold text-[#f2f0eb]">{m.label}</span>
              <span className="mt-0.5 text-[11px] text-[#f2f0eb]/52">{m.hint}</span>
            </button>
          )
        })}
      </div>

      <div className="relative mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">Projected monthly savings</p>
          <p className="mt-2 flex items-center gap-2 text-[28px] font-semibold tracking-tight text-[#5DC2A8]">
            <Zap className="size-6 text-[#5DC2A8]/80" />
            {active.monthlySavings}
          </p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">Trust / quality impact</p>
          <p className="mt-2 text-[28px] font-semibold text-[#f2f0eb]">{active.trustImpact}</p>
          <p className="mt-1 text-[11px] text-[#f2f0eb]/50">Expected delta in trust index</p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">Traffic rerouted</p>
          <p className="mt-2 text-[28px] font-semibold text-[#3694fc]">{active.trafficRerouted}</p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#3694fc] to-[#9aa6f0] transition-all duration-500"
              style={{ width: active.trafficRerouted }}
            />
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">Premium usage reduction</p>
          <p className="mt-2 text-[28px] font-semibold text-[#D6A85B]">{active.premiumReduction}</p>
          <p className="mt-1 text-[11px] text-[#f2f0eb]/50">Fewer flagship-model calls</p>
        </div>
      </div>
    </section>
  )
}
