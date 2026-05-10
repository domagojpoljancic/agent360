import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { AISummaryButton } from '../components/AISummaryButton'
import { AISummaryDrawer } from '../components/AISummaryDrawer'
import { AISummaryLoadingState } from '../components/AISummaryLoadingState'
import { Agent360Footer } from '../components/Agent360Footer'
import { GridBackground } from '../components/GridBackground'
import { Header } from '../components/Header'
import { navigate } from '../router'
import {
  customerFeedbackReviews,
  feedbackStats,
  type AIMaturityLevel,
  type CustomerReview,
  type ReviewFilter,
  matchesReviewFilter,
} from './data'
import { FeedbackAISummaryContent } from './FeedbackAISummaryContent'
import { RatingDistribution } from './RatingDistribution'
import { ReviewCard } from './ReviewCard'
import { ReviewSummary } from './ReviewSummary'

const PAGE_SIZE = 10

const FILTER_CHIPS: { id: ReviewFilter; shortLabel: string }[] = [
  { id: 'all', shortLabel: 'All' },
  { id: 'Positive', shortLabel: 'Positive' },
  { id: 'Mixed', shortLabel: 'Mixed' },
  { id: 'Critical', shortLabel: 'Critical' },
  { id: 'Value Delivered', shortLabel: 'Value' },
  { id: 'Cost Optimization', shortLabel: 'Cost' },
  { id: 'Trust', shortLabel: 'Trust' },
  { id: 'Operational Health', shortLabel: 'Operations' },
  { id: 'Governance', shortLabel: 'Governance' },
]

type ReviewSortMode =
  | 'dataset'
  | 'rating_high'
  | 'rating_low'
  | 'executive'
  | 'technical'
  | 'governance'
  | 'ai_maturity'
  | 'industry'

const MATURITY_RANK: Record<AIMaturityLevel, number> = {
  'AI Beginner': 0,
  'Early AI Adoption': 1,
  'Scaling AI Operations': 2,
  'Mature AI Platform Organization': 3,
  'Enterprise AI Governance Phase': 4,
}

function executiveWeight(role: string): number {
  const u = role.toUpperCase()
  if (/\b(CTO|COO|CFO|CEO)\b/.test(u) || /VP\b|VICE PRESIDENT/.test(u)) return 4
  if (/HEAD OF|^GLOBAL |DIRECTOR/.test(u)) return 3
  if (/MANAGER|LEAD|CHIEF|PRINCIPAL/.test(u)) return 2
  return 1
}

function technicalWeight(role: string): number {
  const l = role.toLowerCase()
  if (/engineer|sre|architect|developer|devops|secops|scientist|\bml\b|data platform/i.test(l)) return 3
  if (/analyst|administrator|program|platform|security operations|informatics/i.test(l)) return 2
  return 1
}

function governanceWeight(r: CustomerReview): number {
  let w = 0
  if (r.category === 'Governance') w += 4
  if (r.exploredPages?.includes('Governance')) w += 2
  const role = `${r.role} ${r.department ?? ''}`.toLowerCase()
  if (/compliance|governance|audit|privacy|legal|ethics|counsel|dpo|grc|regulatory/.test(role)) w += 3
  return w
}

function maturitySortValue(r: CustomerReview): number {
  if (!r.aiMaturity) return -1
  return MATURITY_RANK[r.aiMaturity] ?? -1
}

function industryLabel(r: CustomerReview): string {
  return (r.industry ?? r.companyContext).toLowerCase()
}

function sortReviews(list: CustomerReview[], mode: ReviewSortMode): CustomerReview[] {
  if (mode === 'dataset') return list
  const out = [...list]
  const byId = (a: CustomerReview, b: CustomerReview) => a.id.localeCompare(b.id)
  switch (mode) {
    case 'rating_high':
      return out.sort((a, b) => b.rating - a.rating || byId(a, b))
    case 'rating_low':
      return out.sort((a, b) => a.rating - b.rating || byId(a, b))
    case 'executive':
      return out.sort(
        (a, b) => executiveWeight(b.role) - executiveWeight(a.role) || byId(a, b),
      )
    case 'technical':
      return out.sort(
        (a, b) => technicalWeight(b.role) - technicalWeight(a.role) || byId(a, b),
      )
    case 'governance':
      return out.sort((a, b) => governanceWeight(b) - governanceWeight(a) || byId(a, b))
    case 'ai_maturity':
      return out.sort(
        (a, b) => maturitySortValue(b) - maturitySortValue(a) || byId(a, b),
      )
    case 'industry':
      return out.sort((a, b) => industryLabel(a).localeCompare(industryLabel(b)) || byId(a, b))
    default:
      return list
  }
}

function visiblePageNumbers(current: number, total: number): number[] {
  if (total <= 1) return [1]
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const s = new Set<number>()
  s.add(1)
  s.add(total)
  for (let d = -1; d <= 1; d++) {
    const p = current + d
    if (p >= 1 && p <= total) s.add(p)
  }
  return [...s].sort((a, b) => a - b)
}

export function CustomerFeedbackPage() {
  const [filter, setFilter] = useState<ReviewFilter>('all')
  const [sortMode, setSortMode] = useState<ReviewSortMode>('dataset')
  const [page, setPage] = useState(1)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [summaryReady, setSummaryReady] = useState(false)

  const filtered = useMemo(
    () => customerFeedbackReviews.filter((r) => matchesReviewFilter(r, filter)),
    [filter],
  )

  const visibleReviews = useMemo(
    () => sortReviews(filtered, sortMode),
    [filtered, sortMode],
  )

  const totalPages = Math.max(1, Math.ceil(visibleReviews.length / PAGE_SIZE))

  useEffect(() => {
    setPage(1)
  }, [filter, sortMode])

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages))
  }, [totalPages])

  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const pageEnd = Math.min(pageStart + PAGE_SIZE, visibleReviews.length)
  const paginatedReviews = visibleReviews.slice(pageStart, pageEnd)

  const sentimentPct = (n: number) =>
    feedbackStats.reviewCount > 0
      ? Math.round((n / feedbackStats.reviewCount) * 100)
      : 0

  useEffect(() => {
    if (!summaryOpen) {
      setSummaryReady(false)
      return
    }
    setSummaryReady(false)
    const id = window.setTimeout(() => setSummaryReady(true), 2600)
    return () => window.clearTimeout(id)
  }, [summaryOpen])

  const pageNums = visiblePageNumbers(currentPage, totalPages)

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip text-[#f2f0eb]">
      <GridBackground variant="page" />
      <div className="relative z-10 flex flex-1 flex-col">
        <Header />

        <main className="mx-auto max-w-7xl flex-1 space-y-5 px-4 pb-12 pt-6 md:space-y-6 md:px-6 md:pb-14 md:pt-7">
          <button
            type="button"
            onClick={() => navigate('/overview')}
            className="group inline-flex items-center gap-2 rounded-lg border border-transparent px-1 py-1 text-[12px] font-medium text-[#f2f0eb]/55 transition hover:border-white/[0.08] hover:bg-white/[0.03] hover:text-[#f2f0eb]/85"
          >
            <ArrowLeft className="size-3.5 transition group-hover:-translate-x-0.5" />
            Back to Agent360
          </button>

          {/* Hero */}
          <section className="relative isolate overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 backdrop-blur-xl md:p-6">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 top-0 h-52 w-52 rounded-full bg-[#3694fc]/[0.12] blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -left-20 bottom-0 h-44 w-44 rounded-full bg-[#5DC2A8]/[0.08] blur-3xl"
            />
            <div className="relative flex flex-col gap-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
                <div className="max-w-2xl space-y-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[#f2f0eb]/50">
                    Customer insights
                  </span>
                  <div>
                    <h1 className="text-balance text-[24px] font-semibold tracking-tight text-[#f2f0eb] md:text-[30px]">
                      Customer Feedback
                    </h1>
                    <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-[#f2f0eb]/55 md:text-[14px]">
                      Feedback collected across product, operations, engineering, finance, and governance
                      teams—covering value, cost discipline, trust, reliability, and controls.
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 lg:pt-1">
                  <AISummaryButton
                    label="AI Feedback Summary"
                    tooltip="Synthesize themes, sentiment, and priorities from the current feedback set."
                    drawerOpen={summaryOpen}
                    generating={summaryOpen && !summaryReady}
                    onClick={() => {
                      setSummaryOpen(true)
                    }}
                  />
                </div>
              </div>

              <dl className="grid w-full max-w-3xl grid-cols-2 gap-2.5 sm:max-w-none sm:gap-3 lg:grid-cols-4">
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5 md:px-3.5 md:py-3">
                  <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#f2f0eb]/40">
                    Average rating
                  </dt>
                  <dd className="mt-0.5 text-[18px] font-semibold tabular-nums text-[#f2f0eb] md:text-[20px]">
                    {feedbackStats.averageRating}{' '}
                    <span className="text-[12px] font-medium text-[#f2f0eb]/45">/ 5</span>
                  </dd>
                </div>
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5 md:px-3.5 md:py-3">
                  <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#f2f0eb]/40">
                    Responses
                  </dt>
                  <dd className="mt-0.5 text-[18px] font-semibold tabular-nums text-[#f2f0eb] md:text-[20px]">
                    {feedbackStats.reviewCount}
                  </dd>
                </div>
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5 md:px-3.5 md:py-3">
                  <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#f2f0eb]/40">
                    Enterprise perspectives
                  </dt>
                  <dd className="mt-0.5 text-[18px] font-semibold tabular-nums text-[#f2f0eb] md:text-[20px]">
                    {feedbackStats.teamsRepresented}
                  </dd>
                </div>
                <div className="col-span-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5 sm:col-span-2 lg:col-span-1 md:px-3.5 md:py-3">
                  <dt className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#f2f0eb]/40">
                    Recurring themes
                  </dt>
                  <dd className="mt-0.5 text-[11px] font-medium leading-snug text-[#f2f0eb]/68 md:text-[12px]">
                    {feedbackStats.mostMentioned.map((t) => `“${t}”`).join(' · ')}
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          {/* Rating overview */}
          <section aria-labelledby="rating-overview-heading" className="space-y-2">
            <h2
              id="rating-overview-heading"
              className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#f2f0eb]/45"
            >
              Rating distribution
            </h2>
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#1f1f29]/92 to-[#15151c]/92 p-5 backdrop-blur-xl md:flex md:items-stretch md:gap-8 md:p-6">
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-[#3694fc]/45 to-transparent"
              />
              <ReviewSummary average={feedbackStats.averageRating} className="md:max-w-sm md:shrink-0" />
              <div className="my-6 h-px w-full bg-white/[0.06] md:my-0 md:h-auto md:w-px md:self-stretch" />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#f2f0eb]/40">
                  Star mix
                </p>
                <RatingDistribution counts={feedbackStats.ratingDistribution} />
                <p className="mt-3 text-[11px] leading-relaxed text-[#f2f0eb]/42">
                  Label mix:{' '}
                  <span className="text-[#f2f0eb]/55">
                    {sentimentPct(feedbackStats.sentimentCounts.Positive)}% favorable ·{' '}
                    {sentimentPct(feedbackStats.sentimentCounts.Mixed)}% mixed ·{' '}
                    {sentimentPct(feedbackStats.sentimentCounts.Critical)}% critical
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* Reviews grid */}
          <section aria-labelledby="reviews-grid-heading" className="space-y-4">
            <div className="flex flex-col gap-3">
              <div>
                <h2
                  id="reviews-grid-heading"
                  className="text-[17px] font-semibold tracking-tight text-[#f2f0eb] md:text-[18px]"
                >
                  Verbatim feedback
                </h2>
                <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-[#f2f0eb]/48">
                  Structured responses from leaders and operators—including direct critiques on rollout,
                  controls, and depth of analysis.
                </p>
              </div>

              <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
                <div
                  className="min-w-0 flex-1 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  role="toolbar"
                  aria-label="Filter feedback"
                >
                  <div className="flex w-max max-w-none flex-nowrap gap-1 lg:w-full lg:min-w-0">
                    {FILTER_CHIPS.map((chip) => {
                      const active = filter === chip.id
                      return (
                        <button
                          key={chip.id}
                          type="button"
                          onClick={() => setFilter(chip.id)}
                          className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-medium transition md:px-2.5 md:py-1 md:text-[11px] ${
                            active
                              ? 'border-[#3694fc]/40 bg-[#3694fc]/12 text-[#f2f0eb]'
                              : 'border-white/[0.08] bg-white/[0.02] text-[#f2f0eb]/50 hover:border-white/[0.14] hover:bg-white/[0.04] hover:text-[#f2f0eb]/78'
                          }`}
                        >
                          {chip.shortLabel}
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 lg:justify-end">
                  <label htmlFor="feedback-sort" className="whitespace-nowrap text-[10px] font-medium text-[#f2f0eb]/35">
                    Sort
                  </label>
                  <select
                    id="feedback-sort"
                    value={sortMode}
                    onChange={(e) => setSortMode(e.target.value as ReviewSortMode)}
                    className="max-w-[min(100%,18rem)] cursor-pointer rounded-lg border border-white/[0.1] bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-[#f2f0eb]/75 outline-none transition hover:border-white/[0.16] hover:bg-white/[0.06] focus-visible:ring-2 focus-visible:ring-[#3694fc]/40"
                  >
                    <option value="dataset">Source order</option>
                    <option value="rating_high">Highest rated</option>
                    <option value="rating_low">Lowest rated</option>
                    <option value="executive">Executive roles first</option>
                    <option value="technical">Technical roles first</option>
                    <option value="governance">Governance emphasis</option>
                    <option value="ai_maturity">AI maturity (highest first)</option>
                    <option value="industry">Industry (A–Z)</option>
                  </select>
                </div>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.02] px-6 py-14 text-center">
                <p className="text-[14px] font-medium text-[#f2f0eb]/70">No responses match this filter</p>
                <p className="mt-2 text-[12px] text-[#f2f0eb]/45">
                  Adjust filters or{' '}
                  <button
                    type="button"
                    onClick={() => setFilter('all')}
                    className="font-medium text-[#3694fc]/80 underline decoration-[#3694fc]/35 underline-offset-2 hover:text-[#7DB6FE]"
                  >
                    show all responses
                  </button>
                  .
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:gap-5 lg:grid-cols-2 lg:items-stretch">
                  {paginatedReviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>

                <nav
                  aria-label="Feedback pagination"
                  className="flex flex-col items-stretch gap-3 border-t border-white/[0.06] pt-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <p className="text-center text-[11px] tabular-nums text-[#f2f0eb]/45 sm:text-left">
                    {visibleReviews.length === 0
                      ? 'No responses'
                      : `Showing ${pageStart + 1}–${pageEnd} of ${visibleReviews.length}`}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage <= 1}
                      className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-[11px] font-medium text-[#f2f0eb]/65 transition hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-[#f2f0eb] disabled:pointer-events-none disabled:opacity-35"
                    >
                      <ChevronLeft className="size-3.5" />
                      Previous
                    </button>
                    <div className="flex items-center gap-0.5">
                      {pageNums.map((pNum, idx) => (
                        <span key={pNum} className="flex items-center">
                          {idx > 0 && pageNums[idx] - pageNums[idx - 1] > 1 ? (
                            <span className="px-1 text-[11px] text-[#f2f0eb]/30" aria-hidden>
                              …
                            </span>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => setPage(pNum)}
                            className={`min-w-[2rem] rounded-md px-2 py-1 text-[11px] font-medium tabular-nums transition ${
                              pNum === currentPage
                                ? 'border border-[#3694fc]/35 bg-[#3694fc]/12 text-[#f2f0eb]'
                                : 'border border-transparent text-[#f2f0eb]/45 hover:border-white/[0.08] hover:bg-white/[0.04] hover:text-[#f2f0eb]/75'
                            }`}
                          >
                            {pNum}
                          </button>
                        </span>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage >= totalPages}
                      className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-[11px] font-medium text-[#f2f0eb]/65 transition hover:border-white/[0.14] hover:bg-white/[0.05] hover:text-[#f2f0eb] disabled:pointer-events-none disabled:opacity-35"
                    >
                      Next
                      <ChevronRight className="size-3.5" />
                    </button>
                  </div>
                </nav>
              </>
            )}
          </section>
        </main>

        <Agent360Footer />
      </div>

      <AISummaryDrawer
        open={summaryOpen}
        onClose={() => {
          setSummaryOpen(false)
          setSummaryReady(false)
        }}
        title="AI Feedback Summary"
        subtitle={`Across ${feedbackStats.reviewCount} responses · Mean ${feedbackStats.averageRating.toFixed(1)} / 5`}
        badgeLabel="AI-generated synthesis"
        contentReady={summaryReady}
        loading={
          <AISummaryLoadingState
            steps={[
              'Clustering themes and sentiment…',
              'Mapping feedback to product pillars…',
              'Drafting executive-ready synthesis…',
            ]}
          />
        }
      >
        <FeedbackAISummaryContent stats={feedbackStats} reviews={customerFeedbackReviews} />
      </AISummaryDrawer>
    </div>
  )
}
