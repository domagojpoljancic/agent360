import {
  AISummaryBulletSection,
  AISummaryCard,
  AISummaryFooter,
  AISummarySectionStack,
} from '../components/AISummarySections'
import type { CustomerReview } from './data'
import type { FeedbackStats } from './stats'

function categoryRankings(reviews: CustomerReview[], take: number): string[] {
  const m = new Map<string, number>()
  for (const r of reviews) {
    m.set(r.category, (m.get(r.category) ?? 0) + 1)
  }
  return [...m.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, take)
    .map(([cat, n]) => `${cat} — ${n} responses`)
}

type FeedbackAISummaryContentProps = {
  stats: FeedbackStats
  reviews: CustomerReview[]
}

export function FeedbackAISummaryContent({ stats, reviews }: FeedbackAISummaryContentProps) {
  const { Positive, Mixed, Critical } = stats.sentimentCounts
  const n = stats.reviewCount
  const posPct = n > 0 ? Math.round((Positive / n) * 100) : 0
  const mixPct = n > 0 ? Math.round((Mixed / n) * 100) : 0
  const critPct = n > 0 ? Math.round((Critical / n) * 100) : 0

  const topCats = categoryRankings(reviews, 4)

  return (
    <AISummarySectionStack>
      <AISummaryCard className="border-[#3694fc]/25 bg-gradient-to-br from-[#3694fc]/[0.12] via-[#3694fc]/[0.04] to-transparent shadow-[inset_0_1px_0_0_rgba(138,190,252,0.12)]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-200/90">
            {posPct}% favorable
          </span>
          <span className="rounded-full border border-amber-400/28 bg-amber-500/12 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-200/85">
            {mixPct}% mixed
          </span>
          <span className="rounded-full border border-rose-400/30 bg-rose-500/12 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-rose-200/85">
            {critPct}% critical
          </span>
        </div>
        <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-[#8abefc]/90">Overall sentiment</p>
        <p className="mt-2 text-[14px] font-medium leading-relaxed text-[#f2f0eb]">
          Customer sentiment skews positive ({posPct}%) with meaningful mixed ({mixPct}%) and critical ({critPct}%)
          signal—strongest praise clusters around operational visibility and value tracking; sharpest friction
          mentions onboarding depth, auditability, and workflow drill-down.
        </p>
        <p className="mt-2 text-[12px] text-[#f2f0eb]/55">
          Mean rating {stats.averageRating.toFixed(1)} / 5 · {stats.reviewCount} responses ·{' '}
          {stats.teamsRepresented} distinct organization contexts
        </p>
      </AISummaryCard>

      <AISummaryCard>
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">Most discussed themes</p>
        <ul className="mt-3 space-y-2 text-[13px] leading-snug text-[#f2f0eb]/78">
          {topCats.map((line) => (
            <li key={line} className="flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#3694fc]/70" />
              {line}
            </li>
          ))}
        </ul>
      </AISummaryCard>

      <AISummaryBulletSection
        title="Most praised areas"
        items={[
          'Clarity of value and outcome framing for leadership reviews',
          'Operational visibility across providers, latency, and incidents',
          'Cost transparency and model-routing narratives for finance partners',
          'Executive-readable summaries without raw-log noise',
        ]}
      />

      <AISummaryBulletSection
        title="Most common concerns"
        items={[
          'First-time onboarding and connector setup effort',
          'Governance: audit trails, retention, and exportable evidence',
          'Deeper workflow- and cohort-level drilldown from summary tiles',
          'Trust signals—grounding, escalation paths, and frontline confidence',
        ]}
      />

      <AISummaryBulletSection
        title="Cross-functional patterns"
        items={[
          'Executives anchor on business metrics, board-ready narratives, and ROI defensibility',
          'Engineering and SRE prioritize depth of observability and provider correlation',
          'Governance and risk stakeholders press for controls, segregation, and reproducible evidence',
          'Frontline teams need faster escalation, clearer confidence cues, and less double-checking',
        ]}
      />

      <AISummaryBulletSection
        title="Recommended product moves"
        items={[
          'Ship workflow-level drilldowns from high-level KPI tiles',
          'Expand guided onboarding and reference architectures for connectors',
          'Expose trust-score methodology and stronger provenance in the UI',
          'Deepen compliance packs: retention controls, signed exports, GRC-oriented mappings',
        ]}
      />

      <AISummaryFooter text="AI synthesis · Inferred from aggregated customer feedback in Agent360 · For executive review only" />
    </AISummarySectionStack>
  )
}
