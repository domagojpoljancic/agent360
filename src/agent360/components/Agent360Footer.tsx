import { ArrowRight } from 'lucide-react'
import { feedbackStats } from '../customer-feedback/data'
import { StarRating } from '../customer-feedback/StarRating'
import { navigate, useRoute } from '../router'

export function Agent360Footer() {
  const route = useRoute()
  const onFeedback = route === '/customer-feedback'

  function goFeedback() {
    navigate('/customer-feedback')
  }

  return (
    <footer className="relative mt-auto border-t border-white/[0.05] bg-[#121218]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-2.5 sm:min-h-[3.5rem] sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-3 md:px-6">
        <div className="min-w-0 shrink-0">
          <p className="text-[11px] font-semibold leading-none tracking-tight text-[#f2f0eb]/82">
            Agent<span className="text-[#3694fc]">360</span>
          </p>
          <p className="mt-1 max-w-md text-[10px] leading-snug text-[#f2f0eb]/38">
            From agent activity to business value — in one 360° view.
          </p>
        </div>

        <button
          type="button"
          onClick={goFeedback}
          aria-label="Open Customer Feedback"
          className={`group -mx-1 inline-flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 rounded-md px-1 py-1 text-left transition sm:justify-end sm:gap-x-3 ${
            onFeedback
              ? 'text-[#f2f0eb]/70'
              : 'text-[#f2f0eb]/55 hover:bg-white/[0.03] hover:text-[#f2f0eb]/72'
          } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3694fc]/35`}
        >
          <span className="inline-flex items-center gap-1.5 shrink-0" aria-hidden>
            <StarRating value={feedbackStats.averageRating} readOnly size="sm" />
          </span>
          <span className="text-[11px] font-medium tabular-nums text-[#f2f0eb]/62 group-hover:text-[#f2f0eb]/75">
            {feedbackStats.averageRating}
            <span className="font-normal text-[#f2f0eb]/35"> · </span>
            {feedbackStats.reviewCount} reviews
          </span>
          <span className="inline-flex items-center gap-0.5 text-[11px] font-medium text-[#3694fc]/65 transition group-hover:text-[#7DB6FE]">
            View feedback
            <ArrowRight className="size-3 transition group-hover:translate-x-0.5" />
          </span>
        </button>
      </div>
    </footer>
  )
}
