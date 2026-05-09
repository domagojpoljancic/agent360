import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { views } from '../data/views'
import { navigate, useRoute } from '../router'
import { ActiveAgentsIndicator } from './ActiveAgentsIndicator'
import { EnvironmentSelector } from './EnvironmentSelector'
import { Logo } from './Logo'
import { SearchInput } from './SearchInput'

export function Header() {
  const route = useRoute()
  const [selectorOpen, setSelectorOpen] = useState(false)
  const selectorRef = useRef<HTMLDivElement | null>(null)

  const isVision = route === '/'

  const currentViewPath = useMemo(() => {
    if (route.startsWith('/operational-health/agent/')) return '/operational-health'
    return views.find((view) => view.path === route)?.path ?? null
  }, [route])

  const selectedView = useMemo(() => {
    return views.find((view) => view.path === currentViewPath) ?? null
  }, [currentViewPath])

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!selectorRef.current) return
      if (!selectorRef.current.contains(event.target as Node)) setSelectorOpen(false)
    }
    function onEsc(event: KeyboardEvent) {
      if (event.key === 'Escape') setSelectorOpen(false)
    }
    if (selectorOpen) {
      document.addEventListener('mousedown', onDocClick)
      document.addEventListener('keydown', onEsc)
    }
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [selectorOpen])

  function goHome(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()
    navigate('/overview')
  }

  // Minimal header on the cinematic vision page — just the brand mark and a
  // calm "Production · Live" status pill on the right.
  if (isVision) {
    return (
      <header className="sticky top-0 z-30 border-b border-white/[0.05] bg-[#1a1a22]/55 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-3 px-4 md:px-6">
          <a href="/overview" onClick={goHome} className="flex shrink-0 items-center gap-2.5">
            <Logo size={26} />
            <span className="text-[15px] font-semibold tracking-tight text-[#f2f0eb]">
              Agent<span className="text-[#3694fc]">360</span>
            </span>
          </a>
          <div className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.02] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[#f2f0eb]/55">
            <span className="relative inline-flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3DD68C] opacity-50" />
              <span className="relative inline-flex size-1.5 rounded-full bg-[#3DD68C]" />
            </span>
            Production · Live
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#1a1a22]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-3 px-4 md:px-6">
        <a href="/overview" onClick={goHome} className="flex shrink-0 items-center gap-2.5">
          <Logo size={26} />
          <span className="text-[15px] font-semibold tracking-tight text-[#f2f0eb]">
            Agent<span className="text-[#3694fc]">360</span>
          </span>
        </a>

        <div className="ml-2 flex w-full max-w-3xl items-center gap-2 md:ml-8">
          <div className="hidden w-full max-w-sm md:block">
            <SearchInput />
          </div>
          {selectedView ? (
            <div ref={selectorRef} className="relative shrink-0">
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={selectorOpen}
                onClick={() => setSelectorOpen((open) => !open)}
                className={`inline-flex w-[340px] max-w-[44vw] items-center gap-2 whitespace-nowrap rounded-md border px-2.5 py-1.5 text-[12px] font-medium transition ${
                  selectorOpen
                    ? 'border-[#3694fc]/40 bg-[#3694fc]/[0.06] text-[#f2f0eb]'
                    : 'border-white/[0.08] bg-white/[0.02] text-[#f2f0eb] hover:border-white/[0.18] hover:bg-white/[0.05]'
                }`}
              >
                <span className="shrink-0 text-[#f2f0eb]/55">Page</span>
                <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left">
                  {selectedView.title}
                </span>
                <ChevronDown
                  className={`ml-auto size-3 shrink-0 text-[#f2f0eb]/55 transition ${selectorOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {selectorOpen ? (
                <div
                  role="listbox"
                  className="absolute left-0 top-[calc(100%+6px)] z-40 w-64 origin-top-left rounded-xl border border-white/[0.08] bg-[#1f1f29]/95 p-1.5 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)] backdrop-blur-xl a360-fade-up"
                >
                  <p className="px-2 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#f2f0eb]/45">
                    Views
                  </p>
                  {views.map((view) => {
                    const isSelected = view.path === selectedView.path
                    return (
                      <button
                        key={view.key}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          navigate(view.path)
                          setSelectorOpen(false)
                        }}
                        className={`flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left text-[13px] transition ${
                          isSelected
                            ? 'bg-[#3694fc]/[0.10] text-[#f2f0eb]'
                            : 'text-[#f2f0eb]/85 hover:bg-white/[0.04]'
                        }`}
                      >
                        <span className="flex flex-col leading-tight">
                          <span className="font-medium">{view.title}</span>
                          <span className="text-[11px] text-[#f2f0eb]/45">{view.question}</span>
                        </span>
                        {isSelected ? <Check className="size-3.5 text-[#3694fc]" /> : null}
                      </button>
                    )
                  })}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          {route !== '/' ? <ActiveAgentsIndicator count={7} /> : null}
          <EnvironmentSelector />
        </div>
      </div>
    </header>
  )
}
