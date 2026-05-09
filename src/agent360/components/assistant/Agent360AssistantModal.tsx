import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUp, Sparkles, X } from 'lucide-react'
import { Logo } from '../Logo'
import { navigate } from '../../router'
import { matchResponse, modalExampleQueries } from './data/mockResponses'
import { MockConversation, type AssistantMessage } from './MockConversation'
import { SuggestionChip } from './SuggestionChip'

type Agent360AssistantModalProps = {
  open: boolean
  /** A query to seed the modal with when it opens. Use a fresh string each time. */
  seedQuery: string | null
  onClose: () => void
}

function makeId() {
  return `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`
}

export function Agent360AssistantModal({
  open,
  seedQuery,
  onClose,
}: Agent360AssistantModalProps) {
  const [messages, setMessages] = useState<AssistantMessage[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const conversationEndRef = useRef<HTMLDivElement | null>(null)
  const seededRef = useRef<string | null>(null)

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const response = matchResponse(trimmed)
    setMessages((prev) => [
      ...prev,
      { id: makeId(), role: 'user', text: trimmed },
      { id: makeId(), role: 'assistant', text: response.text, response },
    ])
    setIsStreaming(true)
    setInput('')
  }, [])

  // body scroll lock
  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [open])

  // ESC to close
  useEffect(() => {
    if (!open) return
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  // reset when closing
  useEffect(() => {
    if (open) return
    setMessages([])
    setInput('')
    setIsStreaming(false)
    seededRef.current = null
  }, [open])

  // seed the first message from the entry-surface query
  useEffect(() => {
    if (!open || !seedQuery) return
    if (seededRef.current === seedQuery) return
    seededRef.current = seedQuery
    sendMessage(seedQuery)
  }, [open, seedQuery, sendMessage])

  // focus the input when not streaming
  useEffect(() => {
    if (open && !isStreaming) {
      const t = setTimeout(() => inputRef.current?.focus(), 80)
      return () => clearTimeout(t)
    }
  }, [open, isStreaming])

  // auto-scroll to latest
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length, isStreaming])

  if (!open || typeof document === 'undefined') return null

  function handleAction(path: string) {
    onClose()
    navigate(path)
  }

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-stretch justify-center p-3 sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close assistant"
        onClick={onClose}
        className="absolute inset-0 bg-[#08080d]/70 backdrop-blur-md"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Agent360 Assistant"
        className="a360-modal-in relative flex h-full w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/[0.10] bg-[#1a1a22]/97 shadow-[0_60px_140px_-30px_rgba(0,0,0,0.7)] backdrop-blur-xl sm:h-auto sm:max-h-[80vh]"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-12 -top-px h-px bg-gradient-to-r from-transparent via-[#3694fc]/60 to-transparent"
        />

        <header className="flex items-center justify-between gap-4 border-b border-white/[0.06] px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Logo size={28} />
              <span className="a360-pulse pointer-events-none absolute -inset-1 -z-10 rounded-full border border-[#3694fc]/30" />
            </div>
            <div className="leading-tight">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#3694fc]">
                Agent360 Assistant
              </p>
              <p className="text-[14px] font-semibold text-[#f2f0eb]">
                Operating intelligence · Beta
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.02] px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/55 sm:inline-flex">
              <span className="relative inline-flex size-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3DD68C] opacity-50" />
                <span className="relative inline-flex size-1.5 rounded-full bg-[#3DD68C]" />
              </span>
              Live signal
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close assistant"
              className="grid size-8 place-items-center rounded-lg border border-white/[0.07] bg-white/[0.02] text-[#f2f0eb]/65 transition hover:border-white/[0.18] hover:text-[#f2f0eb]"
            >
              <X className="size-4" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {messages.length === 0 ? (
            <EmptyState onPick={(q) => sendMessage(q)} />
          ) : (
            <>
              <MockConversation
                messages={messages}
                isStreaming={isStreaming}
                onAction={handleAction}
                onStreamingDone={() => setIsStreaming(false)}
              />
              <div ref={conversationEndRef} />
            </>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage(input)
          }}
          className="border-t border-white/[0.06] bg-[#15151c]/40 px-5 py-3.5"
        >
          <div
            className={`flex items-center gap-2 rounded-2xl border bg-[#13131a]/85 px-4 py-2.5 transition ${
              isStreaming
                ? 'border-white/[0.05]'
                : 'border-white/[0.10] focus-within:border-[#3694fc]/55 focus-within:shadow-[0_0_0_4px_rgba(54,148,252,0.10)]'
            }`}
          >
            <Sparkles
              className={`size-4 shrink-0 ${
                isStreaming ? 'text-[#f2f0eb]/30' : 'text-[#3694fc]'
              }`}
            />
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isStreaming}
              placeholder={isStreaming ? 'Agent360 is responding…' : 'Ask a follow-up…'}
              aria-label="Ask a follow-up"
              className="flex-1 bg-transparent text-[14px] text-[#f2f0eb] outline-none placeholder:text-[#f2f0eb]/40 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={isStreaming || !input.trim()}
              aria-label="Ask"
              className={`grid size-8 place-items-center rounded-lg border transition ${
                input.trim() && !isStreaming
                  ? 'border-[#3694fc]/55 bg-[#3694fc]/15 text-[#3694fc] hover:bg-[#3694fc]/25 hover:text-[#7DB6FE]'
                  : 'border-white/[0.07] bg-white/[0.02] text-[#f2f0eb]/30'
              }`}
            >
              <ArrowUp className="size-4" />
            </button>
          </div>
          <p className="mt-2 px-1 text-[10px] text-[#f2f0eb]/35">
            Responses for the experimental assistant. Press{' '}
            <kbd className="rounded border border-white/[0.10] bg-white/[0.04] px-1 py-[1px] font-mono text-[10px]">
              Esc
            </kbd>{' '}
            to close.
          </p>
        </form>
      </div>
    </div>,
    document.body,
  )
}

function EmptyState({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 px-2 py-10 text-center">
      <div className="relative">
        <Logo size={48} />
        <span className="a360-pulse pointer-events-none absolute -inset-2 -z-10 rounded-full border border-[#3694fc]/30" />
      </div>
      <div>
        <p className="text-[18px] font-semibold tracking-tight text-[#f2f0eb]">
          How can I help with your AI fleet?
        </p>
        <p className="mt-1 text-[13px] text-[#f2f0eb]/55">
          Ask anything across reliability, trust, value or cost.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {modalExampleQueries.map((q) => (
          <SuggestionChip key={q.text} label={q.text} onClick={() => onPick(q.text)} size="md" />
        ))}
      </div>
    </div>
  )
}
