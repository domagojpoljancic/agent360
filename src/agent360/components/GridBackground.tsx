import type { ViewKey } from '../data/views'
import { pageThemes } from '../data/pageThemes'

type GridBackgroundProps = {
  variant?: 'landing' | 'page'
  /** When `variant` is `page`, shifts ambient wash to the pillar accent (switcher icon colors). */
  pageAccent?: ViewKey
}

export function GridBackground({ variant = 'landing', pageAccent }: GridBackgroundProps) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.16]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="agent360-grid" width="64" height="64" patternUnits="userSpaceOnUse">
            <path
              d="M 64 0 L 0 0 0 64"
              fill="none"
              stroke="rgba(242,240,235,0.12)"
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id="agent360-grid-fade" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="white" stopOpacity="0.85" />
            <stop offset="80%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="agent360-grid-mask">
            <rect width="100%" height="100%" fill="url(#agent360-grid-fade)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#agent360-grid)" mask="url(#agent360-grid-mask)" />
      </svg>

      {variant === 'page' && pageAccent ? (
        <>
          <div className={pageThemes[pageAccent].gridOrbPrimary} />
          <div className={pageThemes[pageAccent].gridOrbSecondary} />
        </>
      ) : (
        <>
          <div className="absolute -top-32 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[#3694fc]/[0.10] blur-3xl" />
          {variant === 'landing' ? (
            <div className="absolute top-[40%] left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#3694fc]/[0.06] blur-3xl" />
          ) : null}
        </>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#15151c]" />
    </div>
  )
}
