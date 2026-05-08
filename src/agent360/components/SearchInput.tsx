import { useEffect, useRef, useState } from 'react'
import { Command, Search } from 'lucide-react'

type SearchInputProps = {
  placeholder?: string
}

export function SearchInput({ placeholder = 'Search agents, traces, signals…' }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [value, setValue] = useState('')

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
      }
      if (event.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="group relative flex w-full items-center">
      <Search className="pointer-events-none absolute left-3 size-3.5 text-[#f2f0eb]/40 transition group-focus-within:text-[#3694fc]" />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search Agent360"
        className="w-full rounded-md border border-white/[0.07] bg-white/[0.02] py-1.5 pl-9 pr-12 text-[13px] text-[#f2f0eb] placeholder:text-[#f2f0eb]/45 outline-none transition focus:border-[#3694fc]/45 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#3694fc]/15 hover:border-white/[0.12]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-2 hidden items-center gap-0.5 rounded border border-white/[0.08] bg-white/[0.03] px-1.5 py-[1px] text-[10px] font-medium text-[#f2f0eb]/45 transition group-focus-within:opacity-0 sm:inline-flex"
      >
        <Command className="size-2.5" />K
      </span>
    </div>
  )
}
