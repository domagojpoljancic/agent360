import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Logo } from '../Logo'
import {
  type AssistantHighlightTone,
  type AssistantResponse,
} from './data/mockResponses'
import { useStreamingText } from './useStreamingText'

export type AssistantMessage = {
  id: string
  role: 'user' | 'assistant'
  text: string
  response?: AssistantResponse
}

const toneClasses: Record<AssistantHighlightTone, string> = {
  blue: 'border-[#3694fc]/30 bg-[#3694fc]/[0.10] text-[#7DB6FE]',
  amber: 'border-[#D6A85B]/30 bg-[#D6A85B]/[0.10] text-[#D6A85B]',
  rose: 'border-[#E07A83]/30 bg-[#E07A83]/[0.10] text-[#E07A83]',
  mint: 'border-[#3DD68C]/30 bg-[#3DD68C]/[0.10] text-[#3DD68C]',
}

type MockConversationProps = {
  messages: AssistantMessage[]
  isStreaming: boolean
  onAction: (path: string) => void
  onStreamingDone: () => void
}

export function MockConversation({
  messages,
  isStreaming,
  onAction,
  onStreamingDone,
}: MockConversationProps) {
  return (
    <div className="space-y-5">
      {messages.map((message, idx) => {
        const isLast = idx === messages.length - 1
        const shouldStream = isStreaming && isLast && message.role === 'assistant'
        return (
          <MessageBubble
            key={message.id}
            message={message}
            shouldStream={shouldStream}
            onAction={onAction}
            onStreamingDone={onStreamingDone}
          />
        )
      })}
    </div>
  )
}

type MessageBubbleProps = {
  message: AssistantMessage
  shouldStream: boolean
  onAction: (path: string) => void
  onStreamingDone: () => void
}

function MessageBubble({
  message,
  shouldStream,
  onAction,
  onStreamingDone,
}: MessageBubbleProps) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end a360-fade-up">
        <div className="max-w-[82%] rounded-2xl border border-[#3694fc]/30 bg-[#3694fc]/[0.10] px-4 py-2.5 text-[14px] text-[#f2f0eb]">
          {message.text}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3 a360-fade-up">
      <div className="relative shrink-0">
        <div className="grid size-9 place-items-center rounded-full border border-[#3694fc]/30 bg-[#1c1c25] shadow-[0_0_18px_-6px_rgba(54,148,252,0.6)]">
          <Logo size={22} />
        </div>
      </div>
      <div className="min-w-0 flex-1 space-y-3">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#3694fc]">
          Agent360
        </p>
        <AssistantBody
          message={message}
          shouldStream={shouldStream}
          onAction={onAction}
          onStreamingDone={onStreamingDone}
        />
      </div>
    </div>
  )
}

function AssistantBody({
  message,
  shouldStream,
  onAction,
  onStreamingDone,
}: MessageBubbleProps) {
  const [thinking, setThinking] = useState(shouldStream)

  useEffect(() => {
    if (!shouldStream) {
      setThinking(false)
      return
    }
    setThinking(true)
    const t = setTimeout(() => setThinking(false), 700)
    return () => clearTimeout(t)
  }, [shouldStream, message.id])

  if (thinking) {
    return <ThinkingDots />
  }

  return (
    <StreamingBody
      message={message}
      shouldStream={shouldStream}
      onAction={onAction}
      onStreamingDone={onStreamingDone}
    />
  )
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5 text-[#f2f0eb]/60">
      <span className="flex items-center gap-1">
        <span
          className="size-1.5 rounded-full bg-[#3694fc]"
          style={{ animation: 'agent360-pulse 1.1s ease-in-out infinite', animationDelay: '0ms' }}
        />
        <span
          className="size-1.5 rounded-full bg-[#3694fc]"
          style={{ animation: 'agent360-pulse 1.1s ease-in-out infinite', animationDelay: '150ms' }}
        />
        <span
          className="size-1.5 rounded-full bg-[#3694fc]"
          style={{ animation: 'agent360-pulse 1.1s ease-in-out infinite', animationDelay: '300ms' }}
        />
      </span>
      <span className="text-[12.5px] text-[#f2f0eb]/55">Analysing live signals…</span>
    </div>
  )
}

function StreamingBody({
  message,
  shouldStream,
  onAction,
  onStreamingDone,
}: MessageBubbleProps) {
  const { displayed, done } = useStreamingText(message.text, {
    enabled: shouldStream,
    wordDelayMs: 24,
  })

  useEffect(() => {
    if (shouldStream && done) onStreamingDone()
  }, [shouldStream, done, onStreamingDone])

  const finalText = shouldStream ? displayed : message.text
  const isStreamingNow = shouldStream && !done
  const showMeta = !shouldStream || done
  const paragraphs = finalText.split(/\n\n+/)

  return (
    <div className="space-y-3">
      <div className="text-[14px] leading-relaxed text-[#f2f0eb]/90">
        {paragraphs.map((para, i) => (
          <p key={i} className={i > 0 ? 'mt-3' : ''}>
            {para}
            {isStreamingNow && i === paragraphs.length - 1 ? (
              <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 animate-pulse rounded-sm bg-[#3694fc] align-baseline" />
            ) : null}
          </p>
        ))}
      </div>

      {showMeta && message.response?.highlights && message.response.highlights.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {message.response.highlights.map((h) => (
            <span
              key={h.label}
              className={`inline-flex items-center gap-2 rounded-lg border px-2.5 py-1 ${toneClasses[h.tone ?? 'blue']}`}
            >
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] opacity-70">
                {h.label}
              </span>
              <span className="text-[12.5px] font-semibold">{h.value}</span>
            </span>
          ))}
        </div>
      ) : null}

      {showMeta && message.response?.actions && message.response.actions.length > 0 ? (
        <div className="flex flex-wrap gap-2 pt-1">
          {message.response.actions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => onAction(action.path)}
              className="group inline-flex items-center gap-1.5 rounded-lg border border-[#3694fc]/30 bg-[#3694fc]/[0.08] px-3 py-1.5 text-[12.5px] font-medium text-[#7DB6FE] transition hover:-translate-y-px hover:border-[#3694fc]/55 hover:bg-[#3694fc]/[0.16]"
            >
              {action.label}
              <ArrowRight className="size-3.5 transition group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
