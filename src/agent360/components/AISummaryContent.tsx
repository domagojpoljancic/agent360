import type { BoardSummarySections } from '../data/boardSummary'
import { boardSummaryFooter } from '../data/boardSummary'
import {
  AISummaryBulletSection,
  AISummaryCard,
  AISummaryFooter,
  AISummarySectionStack,
} from './AISummarySections'

type AISummaryContentProps = {
  sections: BoardSummarySections
}

export function AISummaryContent({ sections }: AISummaryContentProps) {
  return (
    <AISummarySectionStack>
      <AISummaryCard className="border-[#3694fc]/25 bg-gradient-to-br from-[#3694fc]/[0.12] via-[#3694fc]/[0.04] to-transparent shadow-[inset_0_1px_0_0_rgba(138,190,252,0.12)]">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#8abefc]/90">Summary verdict</p>
        <p className="mt-2 text-[14px] font-medium leading-relaxed text-[#f2f0eb]">{sections.verdict}</p>
      </AISummaryCard>

      <AISummaryBulletSection title="Performing well" items={sections.performingWell} />
      <AISummaryBulletSection title="Needs attention" items={sections.needsAttention} />
      <AISummaryBulletSection title="Recommended actions" items={sections.nextActions} />

      <AISummaryFooter text={boardSummaryFooter} />
    </AISummarySectionStack>
  )
}
