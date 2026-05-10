import { useEffect, useState } from 'react'

const ROUTE_CHANGE_EVENT = 'agent360:routechange'

export function getCurrentPath(): string {
  if (typeof window === 'undefined') return '/'
  return window.location.pathname || '/'
}

export function useRoute(): string {
  const [path, setPath] = useState<string>(getCurrentPath)

  useEffect(() => {
    function update() {
      setPath(getCurrentPath())
    }
    window.addEventListener('popstate', update)
    window.addEventListener(ROUTE_CHANGE_EVENT, update)
    return () => {
      window.removeEventListener('popstate', update)
      window.removeEventListener(ROUTE_CHANGE_EVENT, update)
    }
  }, [])

  return path
}

export function navigate(to: string, options?: { replace?: boolean }): void {
  if (typeof window === 'undefined') return
  if (options?.replace) {
    window.history.replaceState({}, '', to)
  } else {
    window.history.pushState({}, '', to)
  }
  window.dispatchEvent(new Event(ROUTE_CHANGE_EVENT))
  window.scrollTo({ top: 0, behavior: 'instant' })
}

export function isActive(path: string, current: string): boolean {
  if (path === '/') return current === '/'
  return current === path || current.startsWith(`${path}/`)
}
