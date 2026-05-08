import type { LucideIcon } from 'lucide-react'

type TeamCardProps = {
  title: string
  line: string
  icon: LucideIcon
}

export function TeamCard({ title, line, icon: Icon }: TeamCardProps) {
  return (
    <article className="group relative flex h-full flex-col gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition hover:-translate-y-0.5 hover:border-[#3694fc]/30 hover:bg-white/[0.04]">
      <div className="flex items-center gap-2.5">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-[#3694fc] transition group-hover:border-[#3694fc]/30 group-hover:bg-[#3694fc]/[0.08]">
          <Icon className="size-4" />
        </span>
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#f2f0eb]/55">
          For {title}
        </p>
      </div>
      <p className="text-[13.5px] leading-relaxed text-[#f2f0eb]/85">{line}</p>
    </article>
  )
}
