import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

type Environment = {
  id: string
  label: string
  hint: string
}

const environments: Environment[] = [
  { id: 'production', label: 'Production', hint: 'Live · primary region' },
  { id: 'staging', label: 'Staging', hint: 'Pre-prod · canary builds' },
  { id: 'sandbox', label: 'Sandbox', hint: 'Internal experiments' },
]

export function EnvironmentSelector() {
  const [selected, setSelected] = useState<Environment>(environments[0])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!ref.current) return
      if (!ref.current.contains(event.target as Node)) setOpen(false)
    }
    function onEsc(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    if (open) {
      document.addEventListener('mousedown', onDocClick)
      document.addEventListener('keydown', onEsc)
    }
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onEsc)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-[12px] font-medium transition ${
          open
            ? 'border-[#3694fc]/40 bg-[#3694fc]/[0.06] text-[#f2f0eb]'
            : 'border-white/[0.08] bg-white/[0.02] text-[#f2f0eb] hover:border-white/[0.18] hover:bg-white/[0.05]'
        }`}
      >
        <span className="relative inline-flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3DD68C] opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-[#3DD68C]" />
        </span>
        <span>{selected.label}</span>
        <ChevronDown
          className={`size-3 text-[#f2f0eb]/55 transition ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open ? (
        <div
          role="listbox"
          className="absolute right-0 top-[calc(100%+6px)] z-40 w-60 origin-top-right rounded-xl border border-white/[0.08] bg-[#1f1f29]/95 p-1.5 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.6)] backdrop-blur-xl a360-fade-up"
        >
          <p className="px-2 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#f2f0eb]/45">
            Environment
          </p>
          {environments.map((env) => {
            const isSelected = env.id === selected.id
            return (
              <button
                key={env.id}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  setSelected(env)
                  setOpen(false)
                }}
                className={`flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 text-left text-[13px] transition ${
                  isSelected
                    ? 'bg-[#3694fc]/[0.10] text-[#f2f0eb]'
                    : 'text-[#f2f0eb]/85 hover:bg-white/[0.04]'
                }`}
              >
                <span className="flex flex-col leading-tight">
                  <span className="font-medium">{env.label}</span>
                  <span className="text-[11px] text-[#f2f0eb]/45">{env.hint}</span>
                </span>
                {isSelected ? <Check className="size-3.5 text-[#3694fc]" /> : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
