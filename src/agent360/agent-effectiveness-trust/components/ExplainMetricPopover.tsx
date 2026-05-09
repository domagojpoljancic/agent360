import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Info } from 'lucide-react'
import { TRUST_METRIC_EXPLAINS, type MetricExplainContent } from '../trustMetricExplains'

/** Matches Fleet trust · snapshot cards — single source of truth for all explain popovers. */
export const METRIC_POPOVER_MAX_WIDTH_PX = 288

const VIEWPORT_GUTTER = 8
const GAP = 6
/** Above sticky headers (z-10–20), cards, and investigation shell (z-40). */
const POPOVER_Z_INDEX = 100

const PANEL_CLASS =
  'overflow-y-auto rounded-lg border border-white/[0.12] bg-[#161620] p-3 text-left shadow-[0_24px_60px_-12px_rgba(0,0,0,0.9)] transition-all duration-200 ease-out'

const TRIGGER_CLASS =
  'rounded p-0.5 text-[#f2f0eb]/40 transition-colors duration-150 hover:text-[#9aa6f0] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#9aa6f0]/50'

type PopoverCoords = {
  top: number
  left: number
  width: number
  maxHeight: number
}

function computePopoverPosition(trigger: DOMRect): PopoverCoords {
  const width = Math.min(METRIC_POPOVER_MAX_WIDTH_PX, window.innerWidth - VIEWPORT_GUTTER * 2)
  let left = trigger.right - width
  left = Math.max(
    VIEWPORT_GUTTER,
    Math.min(left, window.innerWidth - width - VIEWPORT_GUTTER),
  )

  const maxBelow = window.innerHeight - trigger.bottom - GAP - VIEWPORT_GUTTER
  const maxAbove = trigger.top - GAP - VIEWPORT_GUTTER
  const preferBelow = maxBelow >= 200 || maxBelow >= maxAbove

  if (preferBelow) {
    return {
      top: trigger.bottom + GAP,
      left,
      width,
      maxHeight: Math.max(120, maxBelow),
    }
  }

  const maxHeight = Math.max(120, maxAbove)
  const top = Math.max(VIEWPORT_GUTTER, trigger.top - GAP - maxHeight)
  return { top, left, width, maxHeight }
}

/** Shared body: same typography and sections as Fleet trust · snapshot. */
export function MetricPopoverBody({ content }: { content: MetricExplainContent }) {
  return (
    <>
      <p className="text-[11px] font-semibold text-[#f2f0eb]">{content.title}</p>
      <dl className="mt-2 space-y-2 text-[11px] leading-snug text-[#f2f0eb]/72">
        <div>
          <dt className="text-[#f2f0eb]/45">What it is</dt>
          <dd className="mt-0.5">{content.definition}</dd>
        </div>
        <div>
          <dt className="text-[#f2f0eb]/45">Why it matters</dt>
          <dd className="mt-0.5">{content.why}</dd>
        </div>
        <div>
          <dt className="text-[#f2f0eb]/45">How we measure it</dt>
          <dd className="mt-0.5">{content.measured}</dd>
        </div>
        <div>
          <dt className="text-[#f2f0eb]/45">Operational use</dt>
          <dd className="mt-0.5">{content.ops}</dd>
        </div>
      </dl>
    </>
  )
}

type ExplainMetricPopoverProps = {
  explainKey: string
  className?: string
  label?: string
}

export function ExplainMetricPopover({ explainKey, className, label }: ExplainMetricPopoverProps) {
  const content = TRUST_METRIC_EXPLAINS[explainKey]
  const [open, setOpen] = useState(false)
  const [entered, setEntered] = useState(false)
  const [coords, setCoords] = useState<PopoverCoords>({
    top: 0,
    left: 0,
    width: METRIC_POPOVER_MAX_WIDTH_PX,
    maxHeight: 320,
  })
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const popoverRef = useRef<HTMLDivElement | null>(null)

  const updatePosition = useCallback(() => {
    const el = triggerRef.current
    if (!el) return
    setCoords(computePopoverPosition(el.getBoundingClientRect()))
  }, [])

  useLayoutEffect(() => {
    if (!open) {
      setEntered(false)
      return
    }
    updatePosition()
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true))
    })
    return () => cancelAnimationFrame(id)
  }, [open, updatePosition])

  useEffect(() => {
    if (!open) return
    function onScrollOrResize() {
      updatePosition()
    }
    window.addEventListener('resize', onScrollOrResize)
    window.addEventListener('scroll', onScrollOrResize, true)
    return () => {
      window.removeEventListener('resize', onScrollOrResize)
      window.removeEventListener('scroll', onScrollOrResize, true)
    }
  }, [open, updatePosition])

  useEffect(() => {
    function onDoc(event: MouseEvent) {
      const target = event.target as Node
      if (wrapRef.current?.contains(target)) return
      if (popoverRef.current?.contains(target)) return
      setOpen(false)
    }
    function onEsc(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    if (open) {
      document.addEventListener('mousedown', onDoc)
      document.addEventListener('keydown', onEsc)
    }
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  if (!content) return null

  const popover =
    open && typeof document !== 'undefined' ? (
      <div
        ref={popoverRef}
        role="dialog"
        aria-label={content.title}
        className={`fixed ${PANEL_CLASS} ${entered ? 'translate-y-0 opacity-100' : '-translate-y-0.5 opacity-0'}`}
        style={{
          top: coords.top,
          left: coords.left,
          width: coords.width,
          maxHeight: coords.maxHeight,
          zIndex: POPOVER_Z_INDEX,
        }}
      >
        <MetricPopoverBody content={content} />
      </div>
    ) : null

  return (
    <div ref={wrapRef} className={`relative inline-flex items-center ${className ?? ''}`}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={label ?? `Explain ${content.title}`}
        aria-expanded={open}
        onClick={(event) => {
          event.stopPropagation()
          setOpen((value) => !value)
        }}
        className={TRIGGER_CLASS}
      >
        <Info className="size-3.5" />
      </button>
      {popover ? createPortal(popover, document.body) : null}
    </div>
  )
}
