import type { CustomerReview, FeedbackCategory, Sentiment } from './data'

export type RatingDistributionCounts = Record<1 | 2 | 3 | 4 | 5, number>

export type FeedbackStats = {
  averageRating: number
  reviewCount: number
  teamsRepresented: number
  mostMentioned: string[]
  sentimentCounts: Record<Sentiment, number>
  ratingDistribution: RatingDistributionCounts
  /** Primary featured quote (highest rating, then longest text, stable id) */
  featuredQuote: string
  featuredQuoteSourceId: string
  topCategory: { category: FeedbackCategory; count: number }
  /** For subtle rotation in shell widgets */
  quotesForRotation: { text: string; id: string }[]
  /** First few reviewers’ initials for compact credibility chips (dataset order). */
  previewInitials: string[]
}

function roundRatingBucket(rating: number): 1 | 2 | 3 | 4 | 5 {
  const r = Math.round(rating)
  return Math.min(5, Math.max(1, r)) as 1 | 2 | 3 | 4 | 5
}

function topMentionedThemes(reviews: CustomerReview[], n: number): string[] {
  const keywords: [string, RegExp][] = [
    ['audit trails', /audit|evidence|retention|DPIA/i],
    ['cost control', /cost|routing|ROI|spend|premium model/i],
    ['latency & health', /latency|incident|provider|degrad/i],
    ['trust & corrections', /trust|correction|grounding|explainab/i],
    ['executive visibility', /executive|board|visibility|QBR/i],
    ['integrations', /integration|connector|API|export/i],
  ]
  const scores = keywords.map(([label, re]) => ({
    label,
    score: reviews.filter((r) =>
      re.test(`${r.review} ${r.likes} ${r.concerns ?? r.improves}`),
    ).length,
  }))
  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((x) => x.label)
}

function pickFeaturedQuote(reviews: CustomerReview[]): { text: string; id: string } {
  if (reviews.length === 0) return { text: '', id: '' }
  const sorted = [...reviews].sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating
    if (b.review.length !== a.review.length) return b.review.length - a.review.length
    return a.id.localeCompare(b.id)
  })
  return { text: sorted[0].review, id: sorted[0].id }
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : ''
  return `${first}${last}`.toUpperCase() || '?'
}

function pickTopCategory(reviews: CustomerReview[]): { category: FeedbackCategory; count: number } {
  if (reviews.length === 0) {
    return { category: 'Value Delivered', count: 0 }
  }
  const map = new Map<FeedbackCategory, number>()
  for (const r of reviews) {
    map.set(r.category, (map.get(r.category) ?? 0) + 1)
  }
  let best: { category: FeedbackCategory; count: number } = {
    category: reviews[0].category,
    count: 0,
  }
  for (const [category, count] of map) {
    if (count > best.count) best = { category, count }
  }
  return best
}

/**
 * Single source of derived metrics for Customer Feedback surfaces (page + global footer).
 * Pass the same review array the page renders to keep everything synchronized.
 */
export function computeFeedbackStats(reviews: CustomerReview[]): FeedbackStats {
  const n = reviews.length
  const avg = n > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / n : 0

  const sentimentCounts: Record<Sentiment, number> = { Positive: 0, Mixed: 0, Critical: 0 }
  const ratingDistribution: RatingDistributionCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

  for (const r of reviews) {
    sentimentCounts[r.sentiment] += 1
    ratingDistribution[roundRatingBucket(r.rating)] += 1
  }

  const featured = pickFeaturedQuote(reviews)
  const topCategory = pickTopCategory(reviews)

  return {
    averageRating: Math.round(avg * 10) / 10,
    reviewCount: n,
    teamsRepresented: new Set(reviews.map((r) => r.companyContext)).size,
    mostMentioned: topMentionedThemes(reviews, 3),
    sentimentCounts,
    ratingDistribution,
    featuredQuote: featured.text,
    featuredQuoteSourceId: featured.id,
    topCategory,
    quotesForRotation: reviews.map((r) => ({ text: r.review, id: r.id })),
    previewInitials: reviews.slice(0, 5).map((r) => initialsFromName(r.name)),
  }
}
