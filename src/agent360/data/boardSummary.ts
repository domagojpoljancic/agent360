import type { TimeRange } from '../operational-health/data'

export function boardSummarySubtitle(timeRange: TimeRange | '30d'): string {
  if (timeRange === '1h') return 'Generated for Last hour'
  if (timeRange === '24h') return 'Generated for Last 24h'
  if (timeRange === '7d') return 'Generated for Last 7 days'
  if (timeRange === '30d') return 'Generated for Last 30 days'
  return 'Generated for the selected time range'
}

export type BoardSummarySections = {
  verdict: string
  performingWell: string[]
  needsAttention: string[]
  nextActions: string[]
}

export const operationalHealthBoardSummary: BoardSummarySections = {
  verdict:
    'Fleet reliability is solid: most agents sit within latency SLOs, retrieval is broadly healthy, and error rates are contained. The main operational risk is uneven provider latency and a slight uptick in retrieval timeouts—worth watching if load increases.',
  performingWell: [
    'Fleet availability and p95 latency are in band for most agents; tool and API success rates look normal.',
    'Model/provider mix is stable; smaller and mid-tier models are meeting throughput expectations.',
    'Knowledge retrieval success and source availability are holding; vector layer is not a primary bottleneck.',
  ],
  needsAttention: [
    'Claude 3 Opus (and similar heavy models) show higher p95 latency versus the rest of the provider set.',
    'EU-leaning knowledge sources show modestly higher retrieval latency than US paths.',
    'Timeout rate has edged up slightly—correlated with peak traffic, not a hard failure yet.',
  ],
  nextActions: [
    'Triage top slow model × workflow pairs and consider routing latency-sensitive intents to faster tiers.',
    'Watch retrieval timeout and queue depth over the next 24h; expand capacity if the trend holds.',
    'Document operational risk for premium-model paths so on-call knows when to fail over or throttle.',
  ],
}

export const agentEffectivenessTrustBoardSummary: BoardSummarySections = {
  verdict:
    'Task success and trust signals are generally healthy: users accept answers on straightforward flows, and escalations are understandable. The gap is knowledge-heavy and policy-edge work—where corrections, completeness, and handoffs cluster.',
  performingWell: [
    'Task completion remains strong on support, onboarding, and other high-volume intents.',
    'Trust indicators are steady where answers are short, grounded, and low-risk.',
    'Answer relevance is consistent on well-covered topics; repeat corrections are not widespread.',
  ],
  needsAttention: [
    'Billing and money-movement flows show elevated human correction rates versus fleet average.',
    'Complex policy and compliance questions score lower on completeness; reviewers intervene more.',
    'Escalations concentrate on workflows that depend on external systems or incomplete context.',
  ],
  nextActions: [
    'Sample failed or heavily edited billing conversations and refresh sources or playbooks where needed.',
    'Add targeted evals for long policy threads before the next prompt or catalog change.',
    'Prioritize review queues for high-volume intents with recurring corrections or low confidence.',
  ],
}

export const valueDeliveredBoardSummary: BoardSummarySections = {
  verdict:
    'Agent360 detected strong operational leverage across support, returns, and guided commerce workflows. Customer Support Copilot and Returns & Refunds Agent generated the highest measurable efficiency gains, while Shopping Concierge drove the strongest revenue influence.',
  performingWell: [
    'Support Copilot reclaimed 5,760 employee hours in 30 days and remains the clearest productivity scale candidate.',
    'Returns automation prevented 46.8k repetitive support contacts, reducing workload without degrading the customer journey.',
    'Shopping Concierge influenced €1.08M in assisted purchases through high-intent product discovery journeys.',
  ],
  needsAttention: [
    'Product Q&A reduced pre-purchase friction, but compatibility and category context gaps still create avoidable contacts.',
    'Inventory & Fulfillment Agent impact remains concentrated in only a few operating regions despite broader exception volume.',
    'Mobile product discovery underperforms desktop conversion and leaves assisted revenue influence on the table.',
  ],
  nextActions: [
    'Expand Support Copilot adoption across all support teams and make it the default case workspace.',
    'Improve mobile product discovery journeys for Shopping Concierge.',
    'Scale Inventory & Fulfillment Agent rollout to additional markets and strengthen category attribute completeness for Product Q&A.',
  ],
}

export const costOptimizationBoardSummary: BoardSummarySections = {
  verdict:
    'Spend is broadly under control, but routing and tier choice are the main levers: a few agents still lean on premium models for work that tolerates cheaper tiers, and that gap shows up as predictable savings without sacrificing quality on low-risk flows.',
  performingWell: [
    'Most agents stay within expected token and request budgets for their primary intents.',
    'Model mix is diversified; failover paths are not driving sustained overages.',
    'High-value workflows that justify premium models are identifiable and stable.',
  ],
  needsAttention: [
    'Premium-tier usage is elevated on intents where evals suggest safe down-tier candidates.',
    'Some agents show higher cost per successful task than fleet peers on similar complexity.',
    'Burst traffic periods correlate with temporary scale-up spend that could be smoothed with caching or batching.',
  ],
  nextActions: [
    'Route low-complexity intents to approved lower-cost models where quality gates pass.',
    'Tighten routing rules for the top three cost-outlier agent × intent pairs.',
    'Re-run savings scenarios after the next catalog or prompt change and track realized vs projected savings.',
  ],
}

export const boardSummaryFooter =
  'AI summary · Based on current board state · Last updated 2 min ago'

export const conversationMemoryAIContextCheck: BoardSummarySections = {
  verdict:
    'Conversational continuity is broadly healthy: agents track follow-ups, resolve references, and rarely make users repeat themselves on short threads. The exception is long, policy-heavy refund conversations where context truncation is starting to show.',
  performingWell: [
    'Follow-up understanding stays strong across customer-facing agents, including multi-turn order and delivery questions.',
    'Session continuity held up after the CRM sync update; no regressions observed across reconnects.',
    'Repeat prompt rate is trending down on the support copilot since the summary-memory rollout.',
  ],
  needsAttention: [
    'Returns & Refunds Agent shows elevated context truncation in long refund threads—answers may lose earlier turns.',
    'Product Q&A follow-up understanding drops on multi-step compatibility flows after the fifth turn.',
    'Customer Support Copilot sessions still see users repeating account details in ~9% of conversations.',
  ],
  nextActions: [
    'Enable rolling summarization or longer-window routing on refund threads >12 turns.',
    'Add explicit context anchors to compatibility prompts; revisit the multi-step opener for Product Q&A.',
    'Pull account context earlier in copilot sessions so operators don’t have to re-ask basics.',
  ],
}

export const aiContextCheckSubtitle = 'Conversation context & memory analysis'
