import type { LucideIcon } from 'lucide-react'
import { Sparkles } from 'lucide-react'

type SuggestionChipProps = {
  label: string
  icon?: LucideIcon
  onClick?: () => void
  size?: 'sm' | 'md'
}

export function SuggestionChip({
  label,
  icon: Icon,
  onClick,
  size = 'sm',
}: SuggestionChipProps) {
  const IconComp = Icon ?? Sparkles
  const padding = size === 'md' ? 'px-3.5 py-2 text-[12.5px]' : 'px-3 py-1.5 text-[12px]'
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] ${padding} text-[#f2f0eb]/80 transition hover:-translate-y-px hover:border-[#3694fc]/45 hover:bg-[#3694fc]/[0.07] hover:text-[#f2f0eb] focus-visible:border-[#3694fc]/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3694fc]/30`}
    >
      <IconComp className="size-3 text-[#3694fc] transition group-hover:text-[#7DB6FE]" />
      <span className="whitespace-nowrap">{label}</span>
    </button>
  )
}
