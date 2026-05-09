import { useEffect, type ReactNode } from 'react'
import { Sparkles, X } from 'lucide-react'

type AISummaryDrawerProps = {
  open: boolean
  onClose: () => void
  subtitle: string
  title?: string
  badgeLabel?: string
  /** When false, show loading UI instead of children */
  contentReady: boolean
  loading: ReactNode
  children: ReactNode
}

/**
 * AI Board Summary drawer — same interaction shell as OperationalDetailDrawer
 * (backdrop, slide-in, ESC, z-50) with AI-native header chrome.
 */
export function AISummaryDrawer({
  open,
  onClose,
  subtitle,
  title = 'AI Board Summary',
  badgeLabel = 'AI-generated',
  contentReady,
  loading,
  children,
}: AISummaryDrawerProps) {
  useEffect(() => {
    if (!open) return
    function onEsc(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onEsc)
    return () => window.removeEventListener('keydown', onEsc)
  }, [open, onClose])

  return (
    <div
      className={`fixed inset-0 z-50 transition ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        onClick={onClose}
        className={`absolute inset-0 bg-[#0d0d12]/55 backdrop-blur-[2px] transition ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-[min(46vw,720px)] min-w-[340px] overflow-auto border-l border-[#3694fc]/15 bg-[#171720]/96 p-0 backdrop-blur-xl transition duration-250 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#3694fc]/12 via-[#3694fc]/04 to-transparent opacity-90" />
        <div className="pointer-events-none absolute -left-24 top-20 size-48 rounded-full bg-[#3694fc]/15 blur-3xl" />

        <div className="relative p-4 md:p-5">
          <header className="mb-4 flex items-start justify-between gap-3 border-b border-white/[0.06] pb-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#3694fc]/30 bg-gradient-to-br from-[#3694fc]/20 to-[#3694fc]/5 shadow-[0_0_20px_-6px_rgba(54,148,252,0.6)]">
                  <Sparkles className="size-4 text-[#8abefc]" aria-hidden />
                </span>
                <div>
                  <h3 className="text-[17px] font-semibold tracking-tight text-[#f2f0eb]">
                    {title}
                  </h3>
                  <p className="mt-0.5 text-[12px] text-[#f2f0eb]/62">{subtitle}</p>
                </div>
              </div>
              <span className="mt-3 inline-flex items-center rounded-full border border-[#3694fc]/25 bg-[#3694fc]/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-[#8abefc]">
                {badgeLabel}
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-md border border-white/[0.08] bg-white/[0.02] p-1.5 text-[#f2f0eb]/65 outline-none ring-[#3694fc]/40 transition hover:text-[#f2f0eb] focus-visible:ring-2"
            >
              <X className="size-4" />
            </button>
          </header>

          <div className="space-y-3">
            {!contentReady ? (
              loading
            ) : (
              <div className="motion-safe:animate-[aiSummaryContentIn_0.45s_ease-out]">{children}</div>
            )}
          </div>
        </div>
        <style>{`
          @keyframes aiSummaryContentIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </aside>
    </div>
  )
}
