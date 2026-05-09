import { useEffect, useRef, useState } from 'react'
import { ArrowUp, ArrowUpRight, Sparkles } from 'lucide-react'
import { Logo } from '../Logo'
import { surfaceExampleQueries } from './data/mockResponses'

type AIEntrySurfaceProps = {
  onSubmit: (query: string) => void
}

const placeholderRotation = [
  'Why is the Order Agent slower today?',
  'Which agents have the highest escalation rate?',
  'Are we overusing GPT-4o?',
  'Show agents with rising latency.',
  'Which agents create the most value?',
]

export function AIEntrySurface({ onSubmit }: AIEntrySurfaceProps) {
  const [value, setValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [typed, setTyped] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Animated typing placeholder — pauses while user is focused or has typed something.
  useEffect(() => {
    if (isFocused || value) {
      setTyped('')
      return
    }
    const target = placeholderRotation[placeholderIndex]
    let i = 0
    setTyped('')
    const typing = setInterval(() => {
      i++
      setTyped(target.slice(0, i))
      if (i >= target.length) {
        clearInterval(typing)
      }
    }, 40)
    const advance = setTimeout(
      () => {
        setPlaceholderIndex((p) => (p + 1) % placeholderRotation.length)
      },
      target.length * 40 + 1800,
    )
    return () => {
      clearInterval(typing)
      clearTimeout(advance)
    }
  }, [placeholderIndex, isFocused, value])

  function submit(text?: string) {
    const final = (text ?? value).trim()
    if (!final) return
    onSubmit(final)
    setValue('')
  }

  const placeholder =
    isFocused || value ? 'Ask Agent360 anything about your AI fleet…' : typed || ' '

  return (
    <section
      aria-labelledby="ai-surface-title"
      className={`group/ai relative isolate flex h-full flex-col overflow-hidden rounded-3xl border bg-gradient-to-br from-[#1f1f29]/85 to-[#15151c]/85 p-6 backdrop-blur-xl transition md:p-8 ${
        isFocused
          ? 'border-[#3694fc]/35 shadow-[0_40px_80px_-30px_rgba(54,148,252,0.45)]'
          : 'border-white/[0.08]'
      }`}
    >
      {/* aurora glow behind the surface */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="a360-aura absolute -left-10 top-6 h-72 w-72 rounded-full bg-[#3694fc]/[0.12] blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-[#7DB6FE]/[0.06] blur-3xl" />
      </div>

      {/* top edge highlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-12 -top-px h-px bg-gradient-to-r from-transparent via-[#3694fc]/55 to-transparent"
      />

      {/* Header */}
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Logo size={34} />
            <span className="a360-pulse pointer-events-none absolute -inset-1 -z-10 rounded-full border border-[#3694fc]/25" />
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#3694fc]">
              Agent360 Assistant · Conversational
            </p>
            <h2
              id="ai-surface-title"
              className="text-balance text-[19px] font-semibold tracking-tight text-[#f2f0eb] md:text-[22px]"
            >
              Or just <span className="text-[#3694fc]">ask Agent360</span>.
            </h2>
          </div>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.02] px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/55 sm:inline-flex">
          <span className="size-1 rounded-full bg-[#3DD68C]" />
          Beta · live
        </span>
      </header>

      <p className="mt-3 max-w-md text-[14px] leading-relaxed text-[#f2f0eb]/65">
        Describe what you need and Agent360 will guide you to the right operational insight.
      </p>

      {/* the input itself */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
        className={`relative mt-5 flex items-center gap-3 rounded-2xl border bg-[#13131a]/85 px-5 py-3.5 transition ${
          isFocused
            ? 'border-[#3694fc]/55 shadow-[0_0_0_4px_rgba(54,148,252,0.10),0_24px_50px_-30px_rgba(54,148,252,0.55)]'
            : 'border-white/[0.10] hover:border-white/[0.18]'
        }`}
      >
        <Sparkles
          className={`size-4 shrink-0 transition ${
            isFocused ? 'text-[#3694fc]' : 'text-[#f2f0eb]/45'
          }`}
        />
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          aria-label="Ask Agent360"
          className="flex-1 bg-transparent text-[15px] text-[#f2f0eb] outline-none placeholder:text-[#f2f0eb]/40"
        />
        {!isFocused && !value ? (
          <span
            aria-hidden
            className="pointer-events-none -ml-2 inline-block h-4 w-[2px] animate-pulse rounded-sm bg-[#3694fc]"
          />
        ) : null}
        <button
          type="submit"
          disabled={!value.trim()}
          aria-label="Ask Agent360"
          className={`grid size-9 shrink-0 place-items-center rounded-xl border transition ${
            value.trim()
              ? 'border-[#3694fc]/55 bg-[#3694fc]/15 text-[#3694fc] hover:bg-[#3694fc]/25 hover:text-[#7DB6FE]'
              : 'border-white/[0.07] bg-white/[0.02] text-[#f2f0eb]/30'
          }`}
        >
          <ArrowUp className="size-4" />
        </button>
      </form>

      {/* Vertical example queries — fills remaining height */}
      <div className="mt-6 flex flex-1 flex-col">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#f2f0eb]/45">
            Try asking
          </p>
          <span className="text-[11px] text-[#f2f0eb]/35">5 examples</span>
        </div>
        <ul className="flex flex-1 flex-col gap-2.5">
          {surfaceExampleQueries.map((q) => {
            const Icon = q.icon ?? Sparkles
            return (
              <li key={q.text}>
                <button
                  type="button"
                  onClick={() => submit(q.text)}
                  className="group/q flex w-full items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-left transition hover:-translate-y-px hover:border-[#3694fc]/40 hover:bg-[#3694fc]/[0.06]"
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-md border border-[#3694fc]/25 bg-[#3694fc]/10 text-[#3694fc] transition group-hover/q:border-[#3694fc]/55 group-hover/q:bg-[#3694fc]/[0.18] group-hover/q:text-[#7DB6FE]">
                    <Icon className="size-3.5" />
                  </span>
                  <span className="flex-1 text-[13.5px] text-[#f2f0eb]/85 transition group-hover/q:text-[#f2f0eb]">
                    {q.text}
                  </span>
                  <ArrowUpRight className="size-3.5 shrink-0 text-[#f2f0eb]/35 transition group-hover/q:translate-x-0.5 group-hover/q:-translate-y-0.5 group-hover/q:text-[#3694fc]" />
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* footer hint */}
      <div className="mt-5 flex items-center justify-between border-t border-white/[0.05] pt-4 text-[11px] text-[#f2f0eb]/40">
        <span className="inline-flex items-center gap-1.5">
          <span className="relative inline-flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3694fc] opacity-50" />
            <span className="relative inline-flex size-1.5 rounded-full bg-[#3694fc]" />
          </span>
          Responses · grounded in your live signals
        </span>
        <span className="hidden items-center gap-1 sm:inline-flex">
          Press
          <kbd className="rounded border border-white/[0.10] bg-white/[0.04] px-1 py-[1px] font-mono text-[10px]">
            Enter
          </kbd>
          to ask
        </span>
      </div>
    </section>
  )
}
