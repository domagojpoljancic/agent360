import { ArrowLeft, Compass } from 'lucide-react'
import { GridBackground } from '../components/GridBackground'
import { Header } from '../components/Header'
import { navigate } from '../router'

export function NotFoundPage() {
  return (
    <div className="relative min-h-screen text-[#f2f0eb]">
      <GridBackground variant="page" />
      <div className="relative z-10">
        <Header />
        <main className="mx-auto grid max-w-2xl place-items-center px-4 py-24 md:px-6">
          <div className="w-full rounded-2xl border border-white/[0.07] bg-white/[0.02] p-9 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#3694fc]/25 bg-[#3694fc]/[0.08] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[#3694fc]">
              <Compass className="size-3" />
              Out of orbit
            </span>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight text-[#f2f0eb] md:text-[34px]">
              That view isn't on the map yet.
            </h1>
            <p className="mt-3 text-[14px] text-[#f2f0eb]/65">
              Head to the operating view and pick a 360° dimension to explore.
            </p>
            <button
              type="button"
              onClick={() => navigate('/overview')}
              className="mt-6 inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-sm font-medium text-[#f2f0eb] transition hover:border-white/[0.18]"
            >
              <ArrowLeft className="size-3.5" />
              Back to Operating View
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
