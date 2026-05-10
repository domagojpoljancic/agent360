import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { PageTransitionLayer } from '../components/PageTransitionLayer'
import { views } from '../data/views'
import { getCurrentPath, navigate } from '../router'

/** Paths that use the dropdown “main view” transition (the four Agent360 pillars). */
const MAIN_VIEW_PATHS = new Set(views.map((v) => v.path))

/**
 * Timings (ms) for the contained command-center transition.
 * - **navigateAt**: hold loader then `navigate()` (~650–850ms; default 720).
 * - **exitFade**: shade + card fade-out after navigation (~250–300ms).
 * - **pageEnter**: subtle `#root` entrance duration (matches CSS keyframe).
 * Shade fade-in is **180ms** in `index.css` (`.a360-page-tx-shade--enter`).
 */
export const PAGE_TRANSITION_TIMING = {
  navigateAt: 720,
  exitFade: 280,
  pageEnter: 280,
  safety: 1000,
} as const

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

type PageTransitionContextValue = {
  /** Start contained transition then navigate (header dropdown only). */
  startMainViewTransition: (path: string, pageTitle: string) => void
}

const PageTransitionContext = createContext<PageTransitionContextValue | null>(null)

export function usePageTransition(): PageTransitionContextValue {
  const ctx = useContext(PageTransitionContext)
  if (!ctx) {
    return {
      startMainViewTransition: (path: string) => {
        navigate(path)
      },
    } satisfies PageTransitionContextValue
  }
  return ctx
}

type LayerState = {
  visible: boolean
  leaving: boolean
  title: string
}

const initialLayer: LayerState = { visible: false, leaving: false, title: '' }

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const [layer, setLayer] = useState<LayerState>(initialLayer)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const generationRef = useRef(0)

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  useEffect(() => () => clearTimers(), [clearTimers])

  const startMainViewTransition = useCallback(
    (path: string, pageTitle: string) => {
      if (!MAIN_VIEW_PATHS.has(path)) {
        navigate(path)
        return
      }
      if (path === getCurrentPath()) return

      if (prefersReducedMotion()) {
        navigate(path)
        return
      }

      generationRef.current += 1
      const gen = generationRef.current
      clearTimers()

      setLayer({ visible: true, leaving: false, title: pageTitle })

      const schedule = (ms: number, fn: () => void) => {
        const id = setTimeout(() => {
          if (generationRef.current !== gen) return
          fn()
        }, ms)
        timersRef.current.push(id)
      }

      const { navigateAt, exitFade, pageEnter, safety } = PAGE_TRANSITION_TIMING

      schedule(navigateAt, () => {
        navigate(path)
        setLayer((s) => ({ ...s, leaving: true }))
      })

      schedule(navigateAt + exitFade, () => {
        setLayer(initialLayer)
        clearTimers()
        if (typeof document !== 'undefined') {
          document.documentElement.classList.add('a360-page-route-enter')
          window.setTimeout(() => {
            document.documentElement.classList.remove('a360-page-route-enter')
          }, pageEnter)
        }
      })

      const safetyId = setTimeout(() => {
        if (generationRef.current !== gen) return
        setLayer(initialLayer)
        clearTimers()
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('a360-page-route-enter')
        }
      }, safety)
      timersRef.current.push(safetyId)
    },
    [clearTimers],
  )

  return (
    <PageTransitionContext.Provider value={{ startMainViewTransition }}>
      {children}
      <PageTransitionLayer
        isVisible={layer.visible}
        isLeaving={layer.leaving}
        targetPageName={layer.title}
      />
    </PageTransitionContext.Provider>
  )
}
