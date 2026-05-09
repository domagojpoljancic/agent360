import { useEffect, useState } from 'react'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.matchMedia(REDUCED_MOTION_QUERY).matches
  } catch {
    return false
  }
}

/**
 * Reveal `text` word-by-word for a fake LLM streaming effect.
 * If the user prefers reduced motion, the full text is shown immediately.
 */
export function useStreamingText(
  text: string,
  options?: { wordDelayMs?: number; startDelayMs?: number; enabled?: boolean },
) {
  const enabled = options?.enabled ?? true
  const wordDelayMs = options?.wordDelayMs ?? 28
  const startDelayMs = options?.startDelayMs ?? 0

  const [displayed, setDisplayed] = useState(enabled ? '' : text)
  const [done, setDone] = useState(!enabled)

  useEffect(() => {
    if (!enabled) {
      setDisplayed(text)
      setDone(true)
      return
    }
    if (!text) {
      setDisplayed('')
      setDone(true)
      return
    }
    if (prefersReducedMotion()) {
      setDisplayed(text)
      setDone(true)
      return
    }

    setDisplayed('')
    setDone(false)

    const tokens = text.split(/(\s+)/)
    let i = 0
    let interval: ReturnType<typeof setInterval> | undefined

    const startTimer = setTimeout(() => {
      interval = setInterval(() => {
        i++
        if (i >= tokens.length) {
          setDisplayed(text)
          setDone(true)
          if (interval) clearInterval(interval)
          return
        }
        setDisplayed(tokens.slice(0, i).join(''))
      }, wordDelayMs)
    }, startDelayMs)

    return () => {
      clearTimeout(startTimer)
      if (interval) clearInterval(interval)
    }
  }, [text, wordDelayMs, startDelayMs, enabled])

  return { displayed, done }
}
