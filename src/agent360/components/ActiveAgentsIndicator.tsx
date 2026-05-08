type ActiveAgentsIndicatorProps = {
  count?: number
}

const BAR_HEIGHTS = [7, 11, 8, 12, 9, 10, 6, 11, 8, 12]

export function ActiveAgentsIndicator({ count = 7 }: ActiveAgentsIndicatorProps) {
  const safeCount = Math.max(0, Math.min(count, 12))

  return (
    <div
      role="status"
      aria-label={`${safeCount} agents active`}
      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-md border border-white/[0.07] bg-white/[0.02] py-1.5 pl-2 pr-2.5 transition hover:border-[#3DD68C]/30 hover:bg-[#3DD68C]/[0.04]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -inset-x-2 a360-sweep bg-gradient-to-r from-transparent via-[#3DD68C]/[0.12] to-transparent"
        style={{ width: '40%' }}
      />

      <span
        aria-hidden
        className="relative flex h-4 items-end gap-[2px]"
      >
        {Array.from({ length: safeCount }).map((_, i) => (
          <span
            key={i}
            className="a360-bar block w-[2.5px] rounded-[1.5px] bg-[#3DD68C]"
            style={{
              height: `${BAR_HEIGHTS[i % BAR_HEIGHTS.length]}px`,
              animationDelay: `${i * 110}ms`,
              boxShadow: '0 0 6px rgba(61, 214, 140, 0.55)',
            }}
          />
        ))}
      </span>

      <span className="relative flex items-baseline gap-1 text-[12px] font-medium leading-none tabular-nums text-[#f2f0eb]">
        <span className="text-[13px] font-semibold text-[#3DD68C]">{safeCount}</span>
        <span className="text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/55">
          <span className="hidden lg:inline">active </span>
          agents
        </span>
      </span>

      <span
        aria-hidden
        className="relative ml-0.5 inline-flex size-1.5 items-center justify-center"
      >
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#3DD68C] opacity-50" />
        <span className="relative inline-flex size-1.5 rounded-full bg-[#3DD68C] shadow-[0_0_8px_rgba(61,214,140,0.65)]" />
      </span>
    </div>
  )
}
