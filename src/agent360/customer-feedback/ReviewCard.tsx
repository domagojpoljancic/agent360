import type { CustomerReview, ExploredAgent360Page, FeedbackCategory, Sentiment } from './data'
import { StarRating } from './StarRating'

type ReviewCardProps = {
  review: CustomerReview
}

const avatarStyles = [
  'from-[#3694fc]/35 to-[#3694fc]/10',
  'from-[#5DC2A8]/35 to-[#5DC2A8]/10',
  'from-[#9aa6f0]/35 to-[#9aa6f0]/10',
  'from-[#D6A85B]/35 to-[#D6A85B]/10',
]

const sentimentStyles: Record<
  Sentiment,
  { label: string; className: string }
> = {
  Positive: {
    label: 'Positive',
    className:
      'border-emerald-400/25 bg-emerald-500/[0.12] text-emerald-200/95',
  },
  Mixed: {
    label: 'Mixed',
    className: 'border-amber-400/28 bg-amber-500/[0.12] text-amber-200/95',
  },
  Critical: {
    label: 'Critical',
    className: 'border-rose-400/35 bg-rose-500/[0.14] text-rose-200/95',
  },
}

const categoryStyles: Record<FeedbackCategory, string> = {
  'Value Delivered':
    'border-emerald-400/22 bg-emerald-500/[0.08] text-emerald-200/88',
  'Cost Optimization': 'border-amber-400/22 bg-amber-500/[0.08] text-amber-200/88',
  'Agent Effectiveness & Trust':
    'border-violet-400/25 bg-violet-500/[0.1] text-violet-200/88',
  'Operational Health': 'border-cyan-400/25 bg-cyan-500/[0.1] text-cyan-200/88',
  Governance: 'border-rose-400/22 bg-rose-950/40 text-rose-100/75',
}

const exploredPageShort: Record<ExploredAgent360Page, string> = {
  Overview: 'Overview',
  'Value Delivered': 'Value',
  'Cost Optimization': 'Cost',
  'Agent Effectiveness & Trust': 'Trust',
  'Operational Health': 'Ops health',
  Governance: 'Governance',
}

export function ReviewCard({ review }: ReviewCardProps) {
  const initials = review.name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const avatarClass =
    avatarStyles[Math.abs(review.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % avatarStyles.length]
  const sentiment = sentimentStyles[review.sentiment]
  const ratingLabel = Number.isInteger(review.rating) ? `${review.rating}.0` : review.rating.toFixed(1)

  const titleLine = review.title ?? review.role
  const orgLine =
    review.industry && review.department
      ? [review.department, review.industry, review.companySize, review.region].filter(Boolean).join(' · ')
      : review.companyContext

  const improvementCopy = review.concerns ?? review.improves
  const improvementLabel = review.concerns ? 'Concerns & gaps' : 'Improvement areas'

  return (
    <article
      className="group relative flex h-full min-h-0 flex-col rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-5 shadow-[0_24px_60px_-44px_rgba(0,0,0,0.7)] backdrop-blur-xl transition duration-300 md:p-6 hover:border-[#3694fc]/28 hover:shadow-[0_36px_90px_-50px_rgba(54,148,252,0.42)]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-[#3694fc]/35 to-transparent opacity-80 transition duration-300 group-hover:via-[#3694fc]/55"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] transition duration-300 group-hover:opacity-100"
      />

      <header className="relative flex shrink-0 flex-wrap items-start gap-4">
        <span
          aria-hidden
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-gradient-to-br ${avatarClass} text-[12px] font-semibold tracking-tight text-[#f2f0eb]/95 shadow-inner shadow-black/20`}
        >
          {initials}
        </span>
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="text-[15px] font-semibold tracking-tight text-[#f2f0eb] md:text-[16px]">
            {review.name}
          </p>
          <p className="text-[12px] leading-snug text-[#f2f0eb]/50 md:text-[13px]">
            {titleLine}
          </p>
          <p className="text-[11px] leading-snug text-[#f2f0eb]/42">{orgLine}</p>
          {review.aiMaturity ? (
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              <span className="inline-flex items-center rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-[#f2f0eb]/58">
                {review.aiMaturity}
              </span>
              {review.industry ? (
                <span className="inline-flex items-center rounded-md border border-[#3694fc]/20 bg-[#3694fc]/08 px-2 py-0.5 text-[10px] font-medium text-[#9ec8fc]/90">
                  {review.industry}
                </span>
              ) : null}
              {review.companySize ? (
                <span className="inline-flex items-center rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[10px] text-[#f2f0eb]/45">
                  {review.companySize}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="flex w-full shrink-0 flex-col items-stretch gap-2 sm:ml-auto sm:w-auto sm:items-end">
          <div className="flex flex-wrap items-center justify-between gap-2 sm:justify-end">
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${sentiment.className}`}
            >
              {sentiment.label}
            </span>
            <StarRating value={review.rating} readOnly size="md" />
          </div>
          <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#f2f0eb]/32 sm:text-right">
            {ratingLabel} / 5
          </span>
        </div>
      </header>

      {review.exploredPages && review.exploredPages.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#f2f0eb]/35">
            Explored
          </span>
          {review.exploredPages.map((p) => (
            <span
              key={p}
              className="inline-flex items-center rounded-full border border-white/[0.1] bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-[#f2f0eb]/65"
            >
              {exploredPageShort[p]}
            </span>
          ))}
        </div>
      ) : null}

      {review.aiExperience ? (
        <p className="mt-2 text-[11px] leading-relaxed text-[#f2f0eb]/40">
          <span className="font-medium text-[#f2f0eb]/48">AI context: </span>
          {review.aiExperience}
        </p>
      ) : null}

      {review.competingTools ? (
        <p className="mt-1 text-[11px] leading-relaxed text-[#f2f0eb]/38">
          <span className="font-medium text-[#f2f0eb]/45">Compared to: </span>
          {review.competingTools}
        </p>
      ) : null}

      <blockquote className="relative mt-4 flex-1 border-l-2 border-[#3694fc]/40 pl-4 text-[15px] font-medium leading-[1.55] tracking-tight text-[#f2f0eb]/92 md:mt-5 md:pl-5 md:text-[16px] md:leading-[1.6]">
        <span className="text-[#f2f0eb]/35">“</span>
        {review.review}
        <span className="text-[#f2f0eb]/35">”</span>
      </blockquote>

      <dl className="mt-5 grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3 md:mt-6">
        <div className="flex min-h-0 flex-col rounded-xl border border-white/[0.06] bg-white/[0.025] px-3.5 py-3 md:px-4 md:py-3.5">
          <dt className="shrink-0 text-[10px] font-medium uppercase tracking-[0.18em] text-[#5DC2A8]/75">
            Highlights
          </dt>
          <dd className="mt-1.5 text-[13px] leading-relaxed text-[#f2f0eb]/72">{review.likes}</dd>
        </div>
        <div className="flex min-h-0 flex-col rounded-xl border border-white/[0.06] bg-white/[0.025] px-3.5 py-3 md:px-4 md:py-3.5">
          <dt className="shrink-0 text-[10px] font-medium uppercase tracking-[0.18em] text-[#D6A85B]/75">
            {improvementLabel}
          </dt>
          <dd className="mt-1.5 text-[13px] leading-relaxed text-[#f2f0eb]/72">{improvementCopy}</dd>
        </div>
      </dl>

      <footer className="relative mt-auto flex shrink-0 flex-wrap items-center gap-2 border-t border-white/[0.04] pt-4 md:mt-5 md:pt-4">
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium ${categoryStyles[review.category]}`}
        >
          {review.category}
        </span>
      </footer>
    </article>
  )
}
