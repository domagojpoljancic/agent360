import { Agent360Footer } from '../components/Agent360Footer'
import { GridBackground } from '../components/GridBackground'
import { Header } from '../components/Header'
import { navigate } from '../router'

export function CostDeepDivePlaceholderPage() {
  return (
    <div className="relative flex min-h-screen flex-col text-[#f2f0eb]">
      <GridBackground variant="page" />
      <div className="relative z-10 flex flex-1 flex-col">
        <Header />
        <main className="mx-auto max-w-2xl flex-1 space-y-6 px-4 pb-12 pt-12 md:px-6 md:pb-14">
          <button
            type="button"
            onClick={() => navigate('/cost-optimization')}
            className="text-[12px] text-[#3694fc] transition hover:text-[#8abefc]"
          >
            ← Back to Cost Optimization
          </button>
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#f2f0eb]/45">Prototype</p>
            <h1 className="mt-2 text-2xl font-semibold text-[#f2f0eb]">Cost deep dive</h1>
            <p className="mt-3 text-sm leading-relaxed text-[#f2f0eb]/65">
              This full-page drill-down is a placeholder for the walkthrough. In a production build it would surface
              token-level forensics, routing experiment history, and finance exports — without turning Agent360 into a
              raw billing console.
            </p>
          </div>
        </main>

        <Agent360Footer />
      </div>
    </div>
  )
}
