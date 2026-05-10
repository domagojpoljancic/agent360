type RatingDistributionProps = {
  counts: Record<1 | 2 | 3 | 4 | 5, number>
}

export function RatingDistribution({ counts }: RatingDistributionProps) {
  const total = ([5, 4, 3, 2, 1] as const).reduce((s, k) => s + counts[k], 0)
  const levels: (keyof typeof counts)[] = [5, 4, 3, 2, 1]

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2.5">
      {levels.map((level) => {
        const n = counts[level]
        const pct = total > 0 ? Math.round((n / total) * 100) : 0
        return (
          <div key={level} className="grid grid-cols-[2.25rem_1fr_2.25rem] items-center gap-3">
            <span className="text-[11px] font-medium tabular-nums text-[#f2f0eb]/55">{level}★</span>
            <div className="h-2 overflow-hidden rounded-full border border-white/[0.06] bg-white/[0.04]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#3694fc]/25 via-[#D6A85B]/35 to-[#5DC2A8]/30"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-right text-[11px] tabular-nums text-[#f2f0eb]/40">{n}</span>
          </div>
        )
      })}
    </div>
  )
}
