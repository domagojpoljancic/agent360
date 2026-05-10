import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import type { AgentView } from '../data/views'
import { accentClasses, PAGE_SWITCHER_MENU_WIDTH_PX, views } from '../data/views'
import { usePageTransition } from '../page-transition/PageTransitionProvider'

type PageViewSwitcherProps = {
  selectedView: AgentView
}

export function PageViewSwitcher({ selectedView }: PageViewSwitcherProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])
  const { startMainViewTransition } = usePageTransition()
  const reactId = useId()
  const menuDomId = `page-view-switcher-menu-${reactId.replace(/:/g, '')}`

  const SelectedIcon = selectedView.icon
  const selectedAccent = accentClasses[selectedView.accent]

  useEffect(() => {
    if (!open) return
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  const focusOption = useCallback((index: number) => {
    const el = optionRefs.current[index]
    el?.focus()
  }, [])

  useEffect(() => {
    if (!open) return
    const id = requestAnimationFrame(() => {
      const i = views.findIndex((v) => v.path === selectedView.path)
      focusOption(i >= 0 ? i : 0)
    })
    return () => cancelAnimationFrame(id)
  }, [open, selectedView.path, focusOption])

  const onSelect = useCallback(
    (view: AgentView) => {
      setOpen(false)
      triggerRef.current?.focus()
      if (view.path === selectedView.path) return
      startMainViewTransition(view.path, view.title)
    },
    [selectedView.path, startMainViewTransition],
  )

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) setOpen(true)
      else focusOption(e.key === 'ArrowDown' ? 0 : views.length - 1)
    }
  }

  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    const i = views.findIndex((v) => v.path === selectedView.path)
    const currentIdx = optionRefs.current.findIndex((el) => el === document.activeElement)
    const start = currentIdx >= 0 ? currentIdx : Math.max(0, i)
    const next =
      e.key === 'ArrowDown'
        ? Math.min(views.length - 1, start + 1)
        : Math.max(0, start - 1)
    focusOption(next)
  }

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuDomId}
        id={`${menuDomId}-trigger`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onTriggerKeyDown}
        className={`group inline-flex h-8 max-w-[min(15.5rem,38vw)] items-center gap-2 rounded-lg border px-2 pl-2 pr-1.5 text-left transition duration-200 ease-out ${
          open
            ? 'border-[#3694fc]/45 bg-[#3694fc]/[0.08] text-[#f2f0eb] shadow-[0_0_24px_-10px_rgba(54,148,252,0.55)]'
            : 'border-white/[0.09] bg-white/[0.03] text-[#f2f0eb] hover:border-[#3694fc]/32 hover:bg-[#3694fc]/[0.05] hover:shadow-[0_0_20px_-12px_rgba(54,148,252,0.35)]'
        }`}
      >
        <span
          className={`grid size-6 shrink-0 place-items-center rounded-md border ${selectedAccent.border} ${selectedAccent.iconWrap}`}
        >
          <SelectedIcon className="size-3.5 opacity-95" aria-hidden />
        </span>
        <span className="min-w-0 flex-1 truncate text-[13px] font-semibold leading-tight tracking-tight">
          {selectedView.title}
        </span>
        <ChevronDown
          aria-hidden
          className={`size-3.5 shrink-0 text-[#f2f0eb]/45 transition duration-200 group-hover:text-[#f2f0eb]/60 ${
            open ? 'rotate-180 text-[#3694fc]' : ''
          }`}
        />
      </button>

      {open ? (
        <div
          id={menuDomId}
          role="listbox"
          aria-labelledby={`${menuDomId}-trigger`}
          onKeyDown={onMenuKeyDown}
          style={{ width: `min(${PAGE_SWITCHER_MENU_WIDTH_PX}px, calc(100vw - 2rem))` }}
          className="a360-page-switcher-menu absolute left-0 top-[calc(100%+5px)] z-40 origin-top overflow-hidden rounded-xl border border-white/[0.09] bg-[#1c1e26]/96 py-0 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.65),0_0_0_1px_rgba(54,148,252,0.06)] backdrop-blur-xl"
        >
          {views.map((view, index) => {
            const isSelected = view.path === selectedView.path
            const Icon = view.icon
            const ac = accentClasses[view.accent]
            return (
              <button
                key={view.key}
                ref={(el) => {
                  optionRefs.current[index] = el
                }}
                type="button"
                role="option"
                aria-selected={isSelected}
                tabIndex={-1}
                onClick={() => onSelect(view)}
                className={`grid h-11 w-full grid-cols-[2.25rem_minmax(0,1fr)_1.125rem] items-center gap-x-2 border-b border-white/[0.05] px-2 text-left transition duration-150 last:border-b-0 ${
                  isSelected
                    ? 'bg-[#3694fc]/[0.08] shadow-[inset_0_0_0_1px_rgba(54,148,252,0.2)]'
                    : 'hover:bg-white/[0.035]'
                }`}
              >
                <span
                  className={`grid size-9 shrink-0 place-items-center rounded-lg border ${ac.border} ${ac.iconWrap}`}
                >
                  <Icon className="size-4 shrink-0 opacity-95" aria-hidden />
                </span>
                <span className="min-w-0 justify-self-stretch overflow-hidden">
                  <span className="block truncate text-[12px] font-semibold leading-4 tracking-normal text-[#f2f0eb]">
                    {view.title}
                  </span>
                  <span className="mt-0.5 block truncate text-[10px] font-medium leading-3 text-[#f2f0eb]/42">
                    {view.navSubtitle}
                  </span>
                </span>
                <span className="flex size-[1.125rem] shrink-0 items-center justify-center justify-self-end">
                  {isSelected ? (
                    <Check className="size-3.5 shrink-0 text-[#3694fc]" aria-hidden />
                  ) : null}
                </span>
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
