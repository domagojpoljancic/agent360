import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Info } from 'lucide-react'

const POPOVER_MAX_WIDTH_PX = 288
const VIEWPORT_GUTTER = 8
const GAP = 6
const POPOVER_Z_INDEX = 100

const PANEL_CLASS =
  'overflow-y-auto rounded-lg border border-white/[0.12] bg-[#161620] p-3 text-left text-[12px] leading-relaxed text-[#f2f0eb]/78 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.9)] transition-all duration-200 ease-out'

const TRIGGER_CLASS =
  'rounded p-0.5 text-[#f2f0eb]/40 transition-colors duration-150 hover:text-[#D6A85B] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D6A85B]/50'

const TOOLTIP_TEXT =
  'Agent360 analyzes whether requests are routed to the appropriate AI model based on task complexity, policy sensitivity, and expected quality requirements.'

type PopoverCoords = {
  top: number
  left: number
  width: number
  maxHeight: number
}

function computePopoverPosition(trigger: DOMRect): PopoverCoords {
  const width = Math.min(POPOVER_MAX_WIDTH_PX, window.innerWidth - VIEWPORT_GUTTER * 2)
  let left = trigger.right - width
  left = Math.max(
    VIEWPORT_GUTTER,
    Math.min(left, window.innerWidth - width - VIEWPORT_GUTTER),
  )

  const maxBelow = window.innerHeight - trigger.bottom - GAP - VIEWPORT_GUTTER
  const maxAbove = trigger.top - GAP - VIEWPORT_GUTTER
  const preferBelow = maxBelow >= 160 || maxBelow >= maxAbove

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

const HOVER_CLOSE_MS = 180

export function RoutingEfficiencyInfoPopover() {
  const [open, setOpen] = useState(false)
  const [entered, setEntered] = useState(false)
  const [coords, setCoords] = useState<PopoverCoords>({
    top: 0,
    left: 0,
    width: POPOVER_MAX_WIDTH_PX,
    maxHeight: 320,
  })
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const popoverRef = useRef<HTMLDivElement | null>(null)
  const hoverCloseRef = useRef<number | null>(null)

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

  useEffect(() => {
    return () => {
      if (hoverCloseRef.current != null) window.clearTimeout(hoverCloseRef.current)
    }
  }, [])

  function cancelHoverClose() {
    if (hoverCloseRef.current != null) {
      window.clearTimeout(hoverCloseRef.current)
      hoverCloseRef.current = null
    }
  }

  function openFromHover() {
    cancelHoverClose()
    setOpen(true)
  }

  function scheduleHoverClose() {
    cancelHoverClose()
    hoverCloseRef.current = window.setTimeout(() => setOpen(false), HOVER_CLOSE_MS)
  }

  const popover =
    open && typeof document !== 'undefined' ? (
      <div
        ref={popoverRef}
        role="dialog"
        aria-label="About task complexity and routing"
        className={`fixed ${PANEL_CLASS} ${entered ? 'translate-y-0 opacity-100' : '-translate-y-0.5 opacity-0'}`}
        style={{
          top: coords.top,
          left: coords.left,
          width: coords.width,
          maxHeight: coords.maxHeight,
          zIndex: POPOVER_Z_INDEX,
        }}
        onMouseEnter={cancelHoverClose}
        onMouseLeave={scheduleHoverClose}
      >
        {TOOLTIP_TEXT}
      </div>
    ) : null

  return (
    <div ref={wrapRef} className="relative inline-flex items-center">
      <button
        ref={triggerRef}
        type="button"
        aria-label="Explain task complexity and model routing"
        aria-expanded={open}
        onMouseEnter={openFromHover}
        onMouseLeave={scheduleHoverClose}
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
