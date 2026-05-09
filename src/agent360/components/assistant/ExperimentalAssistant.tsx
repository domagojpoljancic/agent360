import { useCallback, useState, type ReactNode } from 'react'
import { AIEntrySurface } from './AIEntrySurface'
import { Agent360AssistantModal } from './Agent360AssistantModal'

export type AssistantSurfaceAPI = {
  /** Submit a query (opens the modal with the streamed mock response). */
  onSubmit: (query: string) => void
}

type ExperimentalAssistantProps = {
  /**
   * Render prop. Receives `onSubmit` so the consumer can render the inline
   * surface (or a custom trigger) wherever they want in their layout — e.g.
   * inside a 2-column dual-interaction grid alongside the sphere.
   *
   * When omitted, the default inline surface is rendered.
   */
  children?: (api: AssistantSurfaceAPI) => ReactNode
}

/**
 * EXPERIMENTAL: conversational entry point to Agent360.
 *
 * Bundles the inline AI input surface and the modal assistant together. The
 * whole feature can be removed by deleting this folder and the call sites for
 * `<ExperimentalAssistant />` and `<AIEntrySurface />`.
 */
export function ExperimentalAssistant({ children }: ExperimentalAssistantProps) {
  const [submission, setSubmission] = useState<{ id: string; query: string } | null>(null)

  const handleSubmit = useCallback((query: string) => {
    const trimmed = query.trim()
    if (!trimmed) return
    setSubmission({
      id: `s_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      query: trimmed,
    })
  }, [])

  const handleClose = useCallback(() => {
    setSubmission(null)
  }, [])

  return (
    <>
      {children
        ? children({ onSubmit: handleSubmit })
        : <AIEntrySurface onSubmit={handleSubmit} />}
      <Agent360AssistantModal
        open={submission !== null}
        seedQuery={submission?.query ?? null}
        onClose={handleClose}
      />
    </>
  )
}
