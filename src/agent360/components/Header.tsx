import { navigate } from '../router'
import { ActiveAgentsIndicator } from './ActiveAgentsIndicator'
import { EnvironmentSelector } from './EnvironmentSelector'
import { Logo } from './Logo'
import { SearchInput } from './SearchInput'

export function Header() {
  function goHome(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#1a1a22]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 md:px-6">
        <a href="/" onClick={goHome} className="flex shrink-0 items-center gap-2.5">
          <Logo size={26} />
          <span className="text-[15px] font-semibold tracking-tight text-[#f2f0eb]">
            Agent<span className="text-[#3694fc]">360</span>
          </span>
        </a>

        <div className="hidden w-full max-w-md md:ml-8 md:block">
          <SearchInput />
        </div>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <ActiveAgentsIndicator count={7} />
          <EnvironmentSelector />
        </div>
      </div>
    </header>
  )
}
