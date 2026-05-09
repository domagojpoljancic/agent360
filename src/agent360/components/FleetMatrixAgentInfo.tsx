import { Info } from 'lucide-react'

type FleetMatrixAgentInfoProps = {
  name: string
  tooltip: string
}

/** Info icon + hover tooltip next to agent name, shared by fleet matrix tables. */
export function FleetMatrixAgentInfo({ name, tooltip }: FleetMatrixAgentInfoProps) {
  return (
    <div className="group relative inline-flex items-center gap-1.5">
      <p className="text-[13.5px] font-semibold text-[#f2f0eb]">{name}</p>
      <span className="text-[#f2f0eb]/35 transition group-hover:text-[#f2f0eb]/65">
        <Info className="size-3.5" />
      </span>
      <div className="pointer-events-none absolute left-0 top-6 z-20 w-64 rounded-md border border-white/[0.12] bg-[#161620] px-2 py-1.5 text-[11px] text-[#f2f0eb]/78 opacity-0 shadow-[0_14px_30px_-20px_rgba(0,0,0,0.8)] transition duration-150 group-hover:opacity-100">
        {tooltip}
      </div>
    </div>
  )
}
