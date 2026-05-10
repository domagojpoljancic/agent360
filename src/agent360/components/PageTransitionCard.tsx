type PageTransitionCardProps = {
  isVisible: boolean
  /** When true, play a quick exit before unmount. */
  isLeaving: boolean
  targetPageName: string
}

/**
 * Compact command-center loader for main-view navigation (header dropdown only).
 * Not full-screen; pairs with a regional dim layer below the navbar.
 */
export function PageTransitionCard({
  isVisible,
  isLeaving,
  targetPageName,
}: PageTransitionCardProps) {
  if (!isVisible) return null

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={`Opening ${targetPageName}`}
      className={`a360-page-tx-card pointer-events-auto flex max-w-[min(92vw,380px)] items-center gap-4 rounded-2xl border border-[#3694fc]/20 bg-[#1a1c24]/88 px-5 py-4 shadow-[0_24px_64px_-28px_rgba(0,0,0,0.75),0_0_0_1px_rgba(54,148,252,0.12),0_0_40px_-12px_rgba(54,148,252,0.35)] backdrop-blur-xl ${
        isLeaving ? 'a360-page-tx-card--leave' : 'a360-page-tx-card--enter'
      }`}
    >
      <div className="relative grid size-11 shrink-0 place-items-center">
        <span
          aria-hidden
          className="a360-page-tx-card-ring absolute inset-0 rounded-full border border-[#3694fc]/20 border-t-[#7DB6FE] border-r-transparent shadow-[0_0_16px_-2px_rgba(54,148,252,0.5)]"
        />
        <span
          aria-hidden
          className="a360-page-tx-card-orbit absolute inset-[-3px] rounded-full"
        >
          <span className="a360-page-tx-card-dot" />
        </span>
        <span
          aria-hidden
          className="relative text-[10px] font-semibold tracking-[0.12em] text-[#f2f0eb]/85"
        >
          360°
        </span>
      </div>
      <div className="min-w-0 flex-1 text-left">
        <p className="text-[14px] font-semibold tracking-tight text-[#f2f0eb]">
          Opening {targetPageName}
        </p>
        <p className="mt-0.5 text-[11px] font-medium leading-snug text-[#f2f0eb]/45">
          Preparing 360° view
        </p>
      </div>
    </div>
  )
}
