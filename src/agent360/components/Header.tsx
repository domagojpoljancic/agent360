import { useMemo } from 'react'
import { views } from '../data/views'
import { navigate, useRoute } from '../router'
import { ActiveAgentsIndicator } from './ActiveAgentsIndicator'
import { EnvironmentSelector } from './EnvironmentSelector'
import { Logo } from './Logo'
import { PageViewSwitcher } from './PageViewSwitcher'
import { SearchInput } from './SearchInput'

export function Header() {
  const route = useRoute()

  const isVision = route === '/'

  const currentViewPath = useMemo(() => {
    if (route.startsWith('/operational-health/agent/')) return '/operational-health'
    return views.find((view) => view.path === route)?.path ?? null
  }, [route])

  const selectedView = useMemo(() => {
    return views.find((view) => view.path === currentViewPath) ?? null
  }, [currentViewPath])

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
          {selectedView ? <PageViewSwitcher selectedView={selectedView} /> : null}
        </div>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          {route !== '/' ? <ActiveAgentsIndicator count={7} /> : null}
          <EnvironmentSelector />
        </div>
      </div>
    </header>
  )
}
