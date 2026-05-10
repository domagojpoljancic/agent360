import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

type OperationalDetailDrawerProps = {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  meta?: ReactNode
  children: ReactNode
  /** Override default `max-w` / `min-w` for wider drilldowns (e.g. API endpoint matrix). */
  asideWidthClassName?: string
}

export function OperationalDetailDrawer({
  open,
  onClose,
  title,
  subtitle,
  meta,
  children,
  asideWidthClassName = 'max-w-[min(46vw,720px)] min-w-[340px]',
}: OperationalDetailDrawerProps) {
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
        className={`absolute right-0 top-0 h-full w-full overflow-auto border-l border-white/[0.08] bg-[#171720]/95 p-4 backdrop-blur-xl transition duration-250 md:p-5 ${asideWidthClassName} ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="text-[17px] font-semibold text-[#f2f0eb]">{title}</h3>
            {subtitle ? <p className="mt-1 text-[12px] text-[#f2f0eb]/62">{subtitle}</p> : null}
            {meta ? <div className="mt-2">{meta}</div> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-white/[0.08] bg-white/[0.02] p-1.5 text-[#f2f0eb]/65 transition hover:text-[#f2f0eb]"
          >
            <X className="size-4" />
          </button>
        </header>
        <div className="space-y-3">{children}</div>
      </aside>
    </div>
  )
}
