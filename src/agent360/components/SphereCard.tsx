import { Compass } from 'lucide-react'
import { useEffect, useState } from 'react'
import { views, type ViewKey } from '../data/views'
import { Orbit360Graphic } from './Orbit360Graphic'

const AUTO_CYCLE_MS = 2800
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.matchMedia(REDUCED_MOTION_QUERY).matches
  } catch {
    return false
  }
}

export function SphereCard() {
  const [hoveredKey, setHoveredKey] = useState<ViewKey | null>(null)
  const [autoIndex, setAutoIndex] = useState(0)

  // Ambient auto-focus cycle: every ~2.8s the highlight moves to the next
  // dimension. Pauses while the user is hovering / focusing a node, and is
  // disabled entirely for users that prefer reduced motion.
  useEffect(() => {
    if (hoveredKey !== null) return
    if (prefersReducedMotion()) return
    const id = setInterval(() => {
      setAutoIndex((i) => (i + 1) % views.length)
    }, AUTO_CYCLE_MS)
    return () => clearInterval(id)
  }, [hoveredKey])

  const autoKey = views[autoIndex].key
  const focusKey: ViewKey = hoveredKey ?? autoKey

  return (
    <section
      aria-labelledby="sphere-card-title"
      className="relative isolate flex h-full flex-col rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#1f1f29]/85 to-[#15151c]/85 p-6 backdrop-blur-xl md:p-8"
    >
      {/* ambient blue aura */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl"
      >
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#3694fc]/[0.10] blur-3xl" />
        <div className="absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-[#7DB6FE]/[0.05] blur-3xl" />
      </div>

      {/* top edge highlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-12 -top-px h-px bg-gradient-to-r from-transparent via-[#3694fc]/55 to-transparent"
      />

      {/* Header */}
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg border border-[#3694fc]/30 bg-[#3694fc]/10 text-[#3694fc]">
            <Compass className="size-4" />
          </span>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#3694fc]">
              Operational Navigation · 4 dimensions
            </p>
            <h2
              id="sphere-card-title"
              className="text-balance text-[19px] font-semibold tracking-tight text-[#f2f0eb] md:text-[22px]"
            >
              Choose your <span className="text-[#3694fc]">360° view</span>.
            </h2>
          </div>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.02] px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/55 sm:inline-flex">
          <span className="size-1 rounded-full bg-[#3DD68C]" />
          Live signals
        </span>
      </header>

      <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-[#f2f0eb]/60">
        Hover any dimension to reveal its operational lens. Click to open it.
      </p>

      {/* Orbit area — grows to fill the remaining space */}
      <div className="mt-6 flex flex-1 items-center justify-center md:mt-8">
        <Orbit360Graphic activeKey={focusKey} onHoverChange={setHoveredKey} />
      </div>
    </section>
  )
}
