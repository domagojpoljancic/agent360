import { StarRating } from './StarRating'

type ReviewSummaryProps = {
  average: number
  className?: string
}

export function ReviewSummary({ average, className = '' }: ReviewSummaryProps) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-semibold tracking-tight text-[#f2f0eb] tabular-nums md:text-[3.25rem]">
            {average.toFixed(1)}
          </span>
          <span className="pb-1 text-[13px] font-medium text-[#f2f0eb]/45">/ 5</span>
        </div>
        <div className="flex flex-col gap-1.5 pb-0.5">
          <StarRating value={average} readOnly size="lg" />
          <p className="text-[11px] text-[#f2f0eb]/38">Aggregate across collected responses</p>
        </div>
      </div>
    </div>
  )
}
