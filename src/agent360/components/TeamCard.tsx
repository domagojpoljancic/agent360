import type { LucideIcon } from 'lucide-react'

type TeamCardProps = {
  title: string
  line: string
  icon: LucideIcon
}

export function TeamCard({ title, line, icon: Icon }: TeamCardProps) {
  return (
    <article className="group relative isolate flex h-full flex-col gap-5 overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#1f1f29]/85 to-[#15151c]/85 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#3694fc]/40 hover:shadow-[0_30px_70px_-30px_rgba(54,148,252,0.55)] md:p-7">
      {/* top edge highlight on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-[#3694fc]/65 to-transparent opacity-0 transition duration-300 group-hover:opacity-100"
      />

      {/* soft accent glow */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-[#3694fc]/[0.08] opacity-0 blur-3xl transition duration-500 group-hover:opacity-100"
      />

      <span className="grid size-11 place-items-center rounded-xl border border-[#3694fc]/30 bg-[#3694fc]/[0.08] text-[#3694fc] transition duration-300 group-hover:border-[#3694fc]/55 group-hover:bg-[#3694fc]/[0.16] group-hover:text-[#7DB6FE]">
        <Icon className="size-5" />
      </span>

      <div>
        <h3 className="text-[17px] font-semibold tracking-tight text-[#f2f0eb] md:text-[18px]">
          {title}
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-[#f2f0eb]/65">
          {line}
        </p>
      </div>
    </article>
  )
}
