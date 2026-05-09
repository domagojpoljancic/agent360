import { ArrowUpDown, ChevronDown, ChevronUp } from 'lucide-react'
import type { SortDirection } from '../utils/tableSorting'

type SortableHeaderProps = {
  label: string
  active: boolean
  direction: SortDirection
  onClick: () => void
}

export function SortableHeader({ label, active, direction, onClick }: SortableHeaderProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 transition ${
        active ? 'text-[#f2f0eb]' : 'text-inherit hover:text-[#f2f0eb]'
      }`}
    >
      <span>{label}</span>
      {active ? (
        direction === 'desc' ? (
          <ChevronDown className="size-3.5" />
        ) : direction === 'asc' ? (
          <ChevronUp className="size-3.5" />
        ) : (
          <ArrowUpDown className="size-3.5 text-[#f2f0eb]/45" />
        )
      ) : (
        <ArrowUpDown className="size-3.5 text-[#f2f0eb]/35" />
      )}
    </button>
  )
}
