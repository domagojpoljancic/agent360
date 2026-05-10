import { Sparkles } from 'lucide-react'

const DEFAULT_TOOLTIP = 'Generate an AI summary of this board for the selected time range.'

type AISummaryButtonProps = {
  onClick: () => void
  /** Summary is generating — sparkle pulse + stronger glow */
  generating?: boolean
  /** Drawer open (including after content ready) — keeps focus ring */
  drawerOpen?: boolean
  /** Button label (default: AI Summary) */
  label?: string
  /** Hover tooltip */
  tooltip?: string
}

export function AISummaryButton({
  onClick,
  generating = false,
  drawerOpen = false,
  label = 'AI Summary',
  tooltip = DEFAULT_TOOLTIP,
}: AISummaryButtonProps) {
  return (
    <div className="group/button relative shrink-0">
      <button
        type="button"
        onClick={onClick}
        aria-expanded={drawerOpen}
        aria-busy={generating}
        aria-haspopup="dialog"
        className={`relative inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-[12px] font-semibold tracking-tight text-[#f2f0eb] shadow-[0_0_24px_-8px_rgba(54,148,252,0.65)] outline-none ring-offset-2 ring-offset-[#1a1a22] transition focus-visible:ring-2 focus-visible:ring-[#3694fc]/60 ${
          generating
            ? 'bg-gradient-to-b from-[#3694fc]/50 to-[#3694fc]/35 ring-2 ring-[#3694fc]/55'
            : drawerOpen
              ? 'bg-gradient-to-b from-[#3694fc]/42 to-[#3694fc]/26 ring-2 ring-[#3694fc]/35'
              : 'bg-gradient-to-b from-[#3694fc]/45 to-[#3694fc]/28 hover:from-[#3694fc]/55 hover:to-[#3694fc]/38 hover:shadow-[0_0_32px_-6px_rgba(54,148,252,0.85)]'
        } before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-t before:from-transparent before:to-white/10 before:opacity-40`}
      >
        <Sparkles
          className={`relative size-4 shrink-0 text-white drop-shadow-[0_0_6px_rgba(138,190,252,0.9)] ${generating ? 'animate-pulse' : 'transition group-hover/button:rotate-12'}`}
          aria-hidden
        />
        <span className="relative">{label}</span>
      </button>
      <div className="pointer-events-none absolute bottom-full right-0 z-30 mb-2 w-60 rounded-lg border border-white/[0.12] bg-[#161620] px-2.5 py-2 text-[11px] leading-snug text-[#f2f0eb]/78 opacity-0 shadow-[0_14px_30px_-20px_rgba(0,0,0,0.8)] transition duration-150 group-hover/button:opacity-100">
        {tooltip}
      </div>
    </div>
  )
}
