export function LandingIntro() {
  return (
    <div className="max-w-xl">
      <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.02] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[#f2f0eb]/60">
        <span className="size-1.5 rounded-full bg-[#3694fc]" />
        Agent360 · Operating view
      </span>

      <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-[#f2f0eb] md:text-[44px]">
        Ready to see your agents from{' '}
        <span className="text-[#3694fc]">every angle?</span>
      </h1>

      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#f2f0eb]/70">
        Agent360 brings reliability, trust, value, and cost signals into one operational view.
      </p>

      <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[#f2f0eb]/55">
        <span className="inline-flex items-center gap-2">
          <span className="relative inline-flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3DD68C] opacity-50" />
            <span className="relative inline-flex size-1.5 rounded-full bg-[#3DD68C]" />
          </span>
          <span>All views streaming</span>
        </span>
        <span className="text-[#f2f0eb]/30">·</span>
        <span>24 agents · 3 regions</span>
        <span className="text-[#f2f0eb]/30">·</span>
        <span>Updated 14s ago</span>
      </div>
    </div>
  )
}
