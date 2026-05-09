import { ArrowRight } from 'lucide-react'

type VisionHeroProps = {
  onLaunch: () => void
  disabled?: boolean
}

export function VisionHero({ onLaunch, disabled = false }: VisionHeroProps) {
  return (
    <section
      aria-labelledby="vision-hero-title"
      className="relative mx-auto flex w-full max-w-3xl flex-col items-center text-center"
    >
      {/* eyebrow */}
      <div className="flex items-center gap-2.5 text-[10px] font-medium uppercase tracking-[0.24em] text-[#f2f0eb]/55">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.02] px-3 py-1.5 backdrop-blur-md">
          <span className="relative inline-flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3694fc] opacity-50" />
            <span className="relative inline-flex size-1.5 rounded-full bg-[#3694fc]" />
          </span>
          Agent360 · AI agent observability
        </span>
      </div>

      {/* headline */}
      <h1
        id="vision-hero-title"
        className="mt-7 text-balance text-[34px] font-semibold leading-[1.05] tracking-tight text-[#f2f0eb] md:mt-9 md:text-[56px] lg:text-[64px]"
      >
        Ready to see your agents from{' '}
        <span className="bg-gradient-to-br from-[#7DB6FE] via-[#3694fc] to-[#3694fc] bg-clip-text text-transparent">
          every angle?
        </span>
      </h1>

      {/* subhead */}
      <p className="mx-auto mt-5 max-w-2xl text-balance text-[15px] leading-relaxed text-[#f2f0eb]/70 md:mt-6 md:text-[17px]">
        Agent360 gives teams a complete operating view of AI agents — from reliability and trust
        to business value and cost optimization.
      </p>

      {/* CTA */}
      <div className="mt-9 flex flex-col items-center gap-4 md:mt-11">
        <button
          type="button"
          onClick={onLaunch}
          disabled={disabled}
          aria-label="Start your 360° view"
          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-[#3694fc]/45 bg-gradient-to-r from-[#3694fc]/30 via-[#3694fc]/20 to-[#3694fc]/15 px-7 py-3.5 text-[14.5px] font-semibold tracking-tight text-[#f2f0eb] shadow-[0_28px_70px_-22px_rgba(54,148,252,0.75)] backdrop-blur-xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#3694fc]/75 hover:from-[#3694fc]/45 hover:via-[#3694fc]/30 hover:to-[#3694fc]/20 hover:shadow-[0_36px_90px_-22px_rgba(54,148,252,0.95)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3694fc]/45 active:scale-[0.98] disabled:cursor-default disabled:opacity-60 disabled:hover:translate-y-0 md:px-8 md:py-4 md:text-[15.5px]"
        >
          {/* outer glow ring */}
          <span
            aria-hidden
            className="pointer-events-none absolute -inset-1 -z-10 rounded-full bg-[#3694fc]/40 opacity-0 blur-2xl transition duration-500 group-hover:opacity-60"
          />

          {/* sweep highlight on hover */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 transition-all duration-700 group-hover:left-[110%] group-hover:opacity-100"
          />

          <span>Start Your 360° View</span>
          <ArrowRight className="size-4 shrink-0 transition group-hover:translate-x-1" />
        </button>

        <p className="max-w-md text-[12.5px] text-[#f2f0eb]/45">
          Monitor, trust, optimize, and scale AI agents with confidence.
        </p>
      </div>
    </section>
  )
}
