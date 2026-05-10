import type { TimeRange } from '../operational-health/data'

export const trustTimeRanges: TimeRange[] = ['1h', '24h', '7d']

export type TrustTone = 'healthy' | 'watch' | 'critical' | 'success' | 'live'
export type TrustTrend = 'up' | 'down' | 'flat'
export type TrustStatus = 'Trusted' | 'Watch' | 'At Risk'

export type TrustOverviewMetric = {
  label: string
  value: string
  trend: TrustTrend
  tone: TrustTone
  sparkline: number[]
  explainKey: string
}

export type FleetTrustRow = {
  id: string
  agent: string
  trustScore: number
  taskSuccess: string
  /** User retry / rephrase / clarification loops—fleet-wide, customer + internal. */
  retryClarification: string
  escalations: string
  trustedResponses: string
  userSatisfaction: string
  highConfidenceFails: string
  trustTrend: number[]
  issue?: string
  status: TrustStatus
  signal: string
  /** Support Copilot & internal agents only—draft edits before send (not shown as fleet KPI). */
  internalHumanEditRate?: string
}

export type TrustSignalCard = {
  id: string
  title: string
  explainKey: string
  metricLabel: string
  metricValue: string
  tone: TrustTone
  trend: number[]
  insightLine?: string
  bars?: { label: string; value: number }[]
}

export type ConversationTrustRow = {
  id: string
  agentId: string
  agent: string
  userIntent: string
  outcome: string
  trustImpact: 'Positive' | 'Neutral' | 'Negative'
  humanIntervention: string
  status: 'Resolved' | 'Escalated' | 'Reviewed'
  userQuestion: string
  aiResponse: string
  interventionSummary: string[]
  suggestedImprovements: string[]
}

export type TrustTrendSeries = {
  id: string
  title: string
  subtitle: string
  value: string
  trend: TrustTrend
  points: number[]
  explainKey?: string
}

export type TrustInvestigation = {
  id: string
  sourceType: 'agent' | 'conversation' | 'signal'
  agentId: string
  agentName: string
  trustScore: number
  status: TrustStatus
  trendLabel: string
  conversationSnapshot: {
    userQuestion: string
    aiResponse: string
    outcome: string
  }
  trustAnalysis: string[]
  humanIntervention: string[]
  suggestedImprovements: string[]
  relatedTrends: TrustTrendSeries[]
}

/** Prompt observability: outcomes by deployed template version (illustrative scenario). */
export type PromptPerformanceTrend = {
  bucketLabels: string[]
  successRates: number[]
  escalationRates: number[]
  retryClarificationRates: number[]
  activeVersion: string[]
}

export type PromptVersionRow = {
  version: string
  success: string
  retries: string
  escalations: string
  avgTokens: string
}

export type PromptPerformanceBlock = {
  trend: PromptPerformanceTrend
  versionRows: PromptVersionRow[]
}

export type TrustSnapshot = {
  overview: TrustOverviewMetric[]
  matrixRows: FleetTrustRow[]
  trustSignals: TrustSignalCard[]
  promptPerformance: PromptPerformanceBlock
  conversations: ConversationTrustRow[]
  trends: TrustTrendSeries[]
}

const trustSnapshots: Record<TimeRange, TrustSnapshot> = {
  '1h': {
    overview: [
      {
        label: 'Task success',
        value: '85%',
        trend: 'flat',
        tone: 'success',
        sparkline: [86, 87, 86, 85, 84, 86, 85],
        explainKey: 'task-success',
      },
      {
        label: 'Retry & clarification',
        value: '10.1%',
        trend: 'up',
        tone: 'watch',
        sparkline: [8.2, 8.6, 9.0, 9.3, 9.6, 9.9, 10.1],
        explainKey: 'retry-clarification',
      },
      {
        label: 'Escalations',
        value: '16%',
        trend: 'up',
        tone: 'watch',
        sparkline: [13, 14, 14, 15, 16, 15, 16],
        explainKey: 'escalation-rate',
      },
      {
        label: 'Trusted responses',
        value: '89%',
        trend: 'down',
        tone: 'success',
        sparkline: [92, 91, 90, 89, 88, 89, 89],
        explainKey: 'trusted-responses',
      },
      {
        label: 'Satisfaction Δ',
        value: '+3%',
        trend: 'up',
        tone: 'live',
        sparkline: [1, 1.8, 2.1, 2.5, 2.8, 3.1, 3],
        explainKey: 'user-satisfaction',
      },
      {
        label: 'High-conf failures',
        value: '14%',
        trend: 'up',
        tone: 'critical',
        sparkline: [10, 11, 11, 12, 13, 14, 14],
        explainKey: 'high-confidence-fails',
      },
    ],
    matrixRows: [
      { id: 'shopping-concierge', agent: 'Shopping Concierge Agent', trustScore: 81, taskSuccess: '84%', retryClarification: '10.8%', escalations: '17%', trustedResponses: '81%', userSatisfaction: '4.3', highConfidenceFails: '11%', trustTrend: [79, 80, 81, 80, 82, 81, 81], status: 'Watch', signal: 'Compare flows' },
      { id: 'product-qa', agent: 'Product Q&A Agent', trustScore: 75, taskSuccess: '80%', retryClarification: '13.4%', escalations: '19%', trustedResponses: '74%', userSatisfaction: '4.0', highConfidenceFails: '18%', trustTrend: [80, 79, 78, 77, 76, 75, 75], status: 'At Risk', signal: 'Compatibility' },
      { id: 'order-delivery', agent: 'Order & Delivery Agent', trustScore: 83, taskSuccess: '86%', retryClarification: '8.9%', escalations: '15%', trustedResponses: '84%', userSatisfaction: '4.2', highConfidenceFails: '12%', trustTrend: [81, 82, 82, 83, 84, 83, 83], status: 'Watch', signal: 'Policy edges' },
      { id: 'returns-refunds', agent: 'Returns & Refunds Agent', trustScore: 86, taskSuccess: '88%', retryClarification: '7.1%', escalations: '12%', trustedResponses: '87%', userSatisfaction: '4.5', highConfidenceFails: '8%', trustTrend: [84, 85, 85, 86, 86, 87, 86], status: 'Trusted', signal: 'Stable' },
      { id: 'support-copilot', agent: 'Customer Support Copilot', trustScore: 91, taskSuccess: '93%', retryClarification: '4.8%', escalations: '8%', trustedResponses: '91%', userSatisfaction: '4.7', highConfidenceFails: '5%', trustTrend: [88, 89, 90, 90, 91, 91, 91], status: 'Trusted', signal: 'Low friction', internalHumanEditRate: '5.1%' },
      { id: 'merch-insights', agent: 'Merchandising Insights Agent', trustScore: 80, taskSuccess: '82%', retryClarification: '9.6%', escalations: '14%', trustedResponses: '80%', userSatisfaction: '4.1', highConfidenceFails: '10%', trustTrend: [78, 79, 80, 81, 80, 80, 80], status: 'Watch', signal: 'Edits ↑', internalHumanEditRate: '11.4%' },
      { id: 'inventory-fulfillment', agent: 'Inventory & Fulfillment Agent', trustScore: 78, taskSuccess: '81%', retryClarification: '11.2%', escalations: '18%', trustedResponses: '78%', userSatisfaction: '4.0', highConfidenceFails: '13%', trustTrend: [77, 78, 79, 78, 78, 79, 78], status: 'Watch', signal: 'Overrides', internalHumanEditRate: '12.8%' },
    ],
    trustSignals: [
      {
        id: 'task-success-rate',
        title: 'Task success rate',
        explainKey: 'task-success',
        metricLabel: 'Fleet · clean completion',
        metricValue: '85%',
        tone: 'success',
        trend: [83, 84, 84, 85, 85, 85, 85],
        insightLine: 'Concierge and delivery agents anchor the hour; Q&A lags on compatibility.',
      },
      {
        id: 'retry-clarification-rate',
        title: 'Retry & clarification rate',
        explainKey: 'retry-clarification',
        metricLabel: 'Convos w/ loops',
        metricValue: '10.1%',
        tone: 'watch',
        trend: [8.2, 8.6, 9.0, 9.3, 9.6, 9.9, 10.1],
        bars: [
          { label: 'Clarify follow-up', value: 34 },
          { label: 'Rephrase intent', value: 28 },
          { label: 'Explicit retry', value: 22 },
          { label: 'Restate after answer', value: 16 },
        ],
        insightLine: 'Spike tied to Product Q&A and concierge compare flows—users reformulating mid-thread.',
      },
      {
        id: 'escalation-reasons',
        title: 'Escalation reasons',
        explainKey: 'escalation-reasons',
        metricLabel: 'Handoffs (1h)',
        metricValue: '1.1k',
        tone: 'watch',
        trend: [17, 16, 17, 18, 19, 18, 19],
        bars: [
          { label: 'Unclear answer', value: 32 },
          { label: 'Incorrect information', value: 25 },
          { label: 'Missing context', value: 19 },
          { label: 'Policy uncertainty', value: 15 },
          { label: 'Failed tool action', value: 9 },
        ],
        insightLine: 'Unclear answers still drive the largest share of handoffs.',
      },
      {
        id: 'trusted-responses-signal',
        title: 'Trusted responses',
        explainKey: 'trusted-responses',
        metricLabel: 'Accepted first reply',
        metricValue: '89%',
        tone: 'success',
        trend: [91, 90, 90, 89, 89, 89, 89],
        insightLine: 'Returns and support copilot threads show the highest first-pass acceptance.',
      },
      {
        id: 'high-confidence-failures',
        title: 'High-confidence failures',
        explainKey: 'high-confidence-fails',
        metricLabel: 'Of escalations',
        metricValue: '14%',
        tone: 'critical',
        trend: [10, 11, 11, 12, 13, 14, 14],
        insightLine: 'Model read as certain—then users or agents still had to intervene.',
      },
      {
        id: 'trust-drift',
        title: 'Trust drift',
        explainKey: 'trust-drift',
        metricLabel: 'Product Q&A vs prior',
        metricValue: '-6%',
        tone: 'watch',
        trend: [0, -1, -2, -3, -4, -5, -6],
        insightLine: 'Catalog sync window—watch compatibility intents.',
      },
    ],
    promptPerformance: {
      trend: {
        bucketLabels: ['-35m', '-30m', '-25m', '-20m', '-15m', '-10m', '-5m'],
        successRates: [81, 82, 82, 84, 86, 85, 84],
        escalationRates: [12, 11.5, 11.2, 9.8, 8.5, 8.9, 9.2],
        retryClarificationRates: [15, 14.5, 14, 11, 9.5, 10.1, 10.4],
        activeVersion: ['v17', 'v17', 'v17', 'v18', 'v18', 'v18', 'v19'],
      },
      versionRows: [
        { version: 'v17', success: '82%', retries: '14%', escalations: '11%', avgTokens: '3.8k' },
        { version: 'v18', success: '89%', retries: '7%', escalations: '6%', avgTokens: '2.9k' },
        { version: 'v19', success: '84%', retries: '10%', escalations: '9%', avgTokens: '2.8k' },
      ],
    },
    conversations: [
      { id: 'conv-101', agentId: 'product-qa', agent: 'Product Q&A Agent', userIntent: 'Compatibility wrong', outcome: 'Escalated · warranty risk', trustImpact: 'Negative', humanIntervention: 'Human corrected SKU mapping', status: 'Escalated', userQuestion: 'Will this charger work with NovaBook Air 14?', aiResponse: 'Yes—compatible with all NovaBook Air variants.', interventionSummary: ['Draft replaced before send.', 'Model year missing in context.'], suggestedImprovements: ['Ground compatibility table.', 'Soften certainty when year unknown.'] },
      { id: 'conv-102', agentId: 'returns-refunds', agent: 'Returns & Refunds Agent', userIntent: 'Refund policy unclear', outcome: 'Reviewed · exception applied', trustImpact: 'Negative', humanIntervention: 'Rewrote policy reply', status: 'Reviewed', userQuestion: 'Opened earbuds—return after 28 days?', aiResponse: 'Opened items are not eligible for refund.', interventionSummary: ['Loyalty tier exception added.', 'Customer stayed.'], suggestedImprovements: ['Surface tier rules in retrieval.'] },
      { id: 'conv-103', agentId: 'support-copilot', agent: 'Customer Support Copilot', userIntent: 'Shipped, no tracking', outcome: 'Resolved · light edit', trustImpact: 'Neutral', humanIntervention: 'Added carrier + ETA', status: 'Resolved', userQuestion: 'Shipped 3 days ago, no movement.', aiResponse: 'In transit—should arrive soon.', interventionSummary: ['SLA line inserted.', 'No escalation.'], suggestedImprovements: ['Pull delay snippets by carrier.'] },
      { id: 'conv-104', agentId: 'shopping-concierge', agent: 'Shopping Concierge Agent', userIntent: 'Pick blender', outcome: 'Resolved · no edit', trustImpact: 'Positive', humanIntervention: 'None', status: 'Resolved', userQuestion: 'Best blender under €150 for daily smoothies?', aiResponse: 'NovaBlend 500—best value in range.', interventionSummary: ['Accepted as-is.', 'Checkout same session.'], suggestedImprovements: ['Keep this pitch pattern.'] },
    ],
    trends: [
      { id: 'trust-index', title: 'Trust index', subtitle: 'Fleet', value: '82', trend: 'down', points: [84, 84, 83, 82, 81, 82, 82], explainKey: 'operational-trust-index' },
      { id: 'adoption', title: 'Copilot adoption', subtitle: 'Active sessions', value: '+18%', trend: 'up', points: [12, 13, 14, 15, 16, 17, 18], explainKey: 'copilot-adoption' },
      { id: 'escalation-trend', title: 'Escalations', subtitle: 'Share of convos', value: '16%', trend: 'up', points: [13, 13, 14, 15, 16, 16, 16], explainKey: 'escalation-rate' },
      { id: 'retry-clarification-trend', title: 'Retry & clarification', subtitle: 'Share of convos', value: '10.1%', trend: 'up', points: [8.2, 8.6, 9.0, 9.3, 9.6, 9.9, 10.1], explainKey: 'retry-clarification' },
    ],
  },
  '24h': {
    overview: [
      { label: 'Task success', value: '87%', trend: 'up', tone: 'live', sparkline: [82, 83, 84, 85, 86, 87, 87], explainKey: 'task-success' },
      { label: 'Retry & clarification', value: '9.1%', trend: 'down', tone: 'healthy', sparkline: [10.4, 10.1, 9.8, 9.5, 9.3, 9.2, 9.1], explainKey: 'retry-clarification' },
      { label: 'Escalations', value: '14%', trend: 'down', tone: 'healthy', sparkline: [16, 16, 15, 15, 14.8, 14.4, 14], explainKey: 'escalation-rate' },
      { label: 'Trusted responses', value: '91%', trend: 'up', tone: 'live', sparkline: [87, 88, 89, 90, 90, 91, 91], explainKey: 'trusted-responses' },
      { label: 'Satisfaction Δ', value: '+6%', trend: 'up', tone: 'live', sparkline: [2, 2.8, 3.5, 4.1, 4.8, 5.4, 6], explainKey: 'user-satisfaction' },
      { label: 'High-conf failures', value: '12%', trend: 'down', tone: 'watch', sparkline: [13, 13, 12.5, 12.4, 12.3, 12.1, 12], explainKey: 'high-confidence-fails' },
    ],
    matrixRows: [
      { id: 'shopping-concierge', agent: 'Shopping Concierge Agent', trustScore: 83, taskSuccess: '86%', retryClarification: '9.3%', escalations: '15%', trustedResponses: '84%', userSatisfaction: '4.4', highConfidenceFails: '9%', trustTrend: [80, 81, 81, 82, 83, 83, 83], status: 'Watch', signal: 'Compare flows' },
      { id: 'product-qa', agent: 'Product Q&A Agent', trustScore: 79, taskSuccess: '84%', retryClarification: '11.8%', escalations: '17%', trustedResponses: '79%', userSatisfaction: '4.1', highConfidenceFails: '15%', trustTrend: [84, 83, 82, 81, 80, 79, 79], status: 'At Risk', signal: 'Compatibility' },
      { id: 'order-delivery', agent: 'Order & Delivery Agent', trustScore: 84, taskSuccess: '87%', retryClarification: '8.1%', escalations: '14%', trustedResponses: '85%', userSatisfaction: '4.3', highConfidenceFails: '10%', trustTrend: [81, 82, 83, 83, 84, 84, 84], status: 'Watch', signal: 'Delays' },
      { id: 'returns-refunds', agent: 'Returns & Refunds Agent', trustScore: 88, taskSuccess: '90%', retryClarification: '6.4%', escalations: '11%', trustedResponses: '89%', userSatisfaction: '4.6', highConfidenceFails: '7%', trustTrend: [85, 86, 86, 87, 87, 88, 88], status: 'Trusted', signal: 'Stable' },
      { id: 'support-copilot', agent: 'Customer Support Copilot', trustScore: 93, taskSuccess: '95%', retryClarification: '4.1%', escalations: '7%', trustedResponses: '93%', userSatisfaction: '4.8', highConfidenceFails: '4%', trustTrend: [90, 91, 91, 92, 92, 93, 93], status: 'Trusted', signal: 'Low friction', internalHumanEditRate: '4.4%' },
      { id: 'merch-insights', agent: 'Merchandising Insights Agent', trustScore: 82, taskSuccess: '84%', retryClarification: '8.8%', escalations: '13%', trustedResponses: '83%', userSatisfaction: '4.2', highConfidenceFails: '9%', trustTrend: [80, 80, 81, 81, 82, 82, 82], status: 'Watch', signal: 'Edits ↑', internalHumanEditRate: '10.2%' },
      { id: 'inventory-fulfillment', agent: 'Inventory & Fulfillment Agent', trustScore: 80, taskSuccess: '83%', retryClarification: '10.1%', escalations: '16%', trustedResponses: '81%', userSatisfaction: '4.1', highConfidenceFails: '12%', trustTrend: [78, 79, 79, 80, 80, 80, 80], status: 'Watch', signal: 'Overrides', internalHumanEditRate: '11.6%' },
    ],
    trustSignals: [
      {
        id: 'task-success-rate',
        title: 'Task success rate',
        explainKey: 'task-success',
        metricLabel: 'Fleet · clean completion',
        metricValue: '87%',
        tone: 'live',
        trend: [83, 84, 85, 85, 86, 86, 87],
        insightLine: 'Weekday traffic up; success climbing with routing tweaks on order status.',
      },
      {
        id: 'retry-clarification-rate',
        title: 'Retry & clarification rate',
        explainKey: 'retry-clarification',
        metricLabel: 'Convos w/ loops',
        metricValue: '9.1%',
        tone: 'healthy',
        trend: [10.4, 10.1, 9.8, 9.5, 9.3, 9.2, 9.1],
        bars: [
          { label: 'Clarify follow-up', value: 33 },
          { label: 'Rephrase intent', value: 29 },
          { label: 'Explicit retry', value: 21 },
          { label: 'Restate after answer', value: 17 },
        ],
        insightLine: 'Down vs prior day—fewer “that’s not what I meant” loops after prompt tightening.',
      },
      {
        id: 'escalation-reasons',
        title: 'Escalation reasons',
        explainKey: 'escalation-reasons',
        metricLabel: 'Handoffs (24h)',
        metricValue: '2.9k',
        tone: 'watch',
        trend: [15, 15, 14, 14, 14, 14, 14],
        bars: [
          { label: 'Unclear answer', value: 31 },
          { label: 'Incorrect information', value: 23 },
          { label: 'Missing context', value: 20 },
          { label: 'Policy uncertainty', value: 17 },
          { label: 'Failed tool action', value: 9 },
        ],
        insightLine: 'Policy uncertainty rising on delivery-delay intents.',
      },
      {
        id: 'trusted-responses-signal',
        title: 'Trusted responses',
        explainKey: 'trusted-responses',
        metricLabel: 'Accepted first reply',
        metricValue: '91%',
        tone: 'live',
        trend: [88, 89, 89, 90, 90, 91, 91],
        insightLine: 'Copilot and returns agents lead; Q&A still drags the fleet average.',
      },
      {
        id: 'high-confidence-failures',
        title: 'High-confidence failures',
        explainKey: 'high-confidence-fails',
        metricLabel: 'Of escalations',
        metricValue: '12%',
        tone: 'critical',
        trend: [13, 13, 12.5, 12.4, 12.3, 12.1, 12],
        insightLine: 'Mostly Product Q&A + policy edges—users challenged a confident wrong answer.',
      },
      {
        id: 'trust-drift',
        title: 'Trust drift',
        explainKey: 'trust-drift',
        metricLabel: 'Product Q&A vs prior',
        metricValue: '-9%',
        tone: 'watch',
        trend: [0, -2, -3, -5, -6, -8, -9],
        insightLine: 'Tied to catalog publish—monitoring active.',
      },
    ],
    promptPerformance: {
      trend: {
        bucketLabels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Now'],
        successRates: [82, 83, 84, 86, 88, 89, 87],
        escalationRates: [11, 10.5, 10, 9.2, 7.5, 6.4, 6.8],
        retryClarificationRates: [14, 13.5, 12, 9.8, 8, 7.2, 7.8],
        activeVersion: ['v17', 'v17', 'v17', 'v18', 'v18', 'v18', 'v19'],
      },
      versionRows: [
        { version: 'v17', success: '82%', retries: '14%', escalations: '11%', avgTokens: '3.8k' },
        { version: 'v18', success: '89%', retries: '7%', escalations: '6%', avgTokens: '2.9k' },
        { version: 'v19', success: '87%', retries: '7.8%', escalations: '6.8%', avgTokens: '2.7k' },
      ],
    },
    conversations: [
      { id: 'conv-201', agentId: 'product-qa', agent: 'Product Q&A Agent', userIntent: 'Keyboard compatibility', outcome: 'Escalated · wrong model year', trustImpact: 'Negative', humanIntervention: 'Matrix pasted · reply replaced', status: 'Escalated', userQuestion: 'Keyboard for NovaTab Air 2025?', aiResponse: 'Yes—all NovaTab Air models.', interventionSummary: ['Year constraint missed.', 'Handoff within SLA.'], suggestedImprovements: ['Year-aware retrieval.', 'Early handoff rule.'] },
      { id: 'conv-202', agentId: 'returns-refunds', agent: 'Returns & Refunds Agent', userIntent: 'Late return refund', outcome: 'Reviewed · exception', trustImpact: 'Negative', humanIntervention: 'Override + clear wording', status: 'Reviewed', userQuestion: 'Return window ended yesterday—refund?', aiResponse: 'No refund after 30 days.', interventionSummary: ['Tier rule applied.', 'CSAT recovered.'], suggestedImprovements: ['Inject tier exceptions.'] },
      { id: 'conv-203', agentId: 'support-copilot', agent: 'Customer Support Copilot', userIntent: 'Damaged item', outcome: 'Resolved · minor edit', trustImpact: 'Neutral', humanIntervention: 'SLA + tone pass', status: 'Resolved', userQuestion: 'Damaged item—need replacement now.', aiResponse: 'We can process replacement shortly.', interventionSummary: ['Warehouse lane added.', 'First contact close.'], suggestedImprovements: ['Auto-attach replacement SLA.'] },
      { id: 'conv-204', agentId: 'shopping-concierge', agent: 'Shopping Concierge Agent', userIntent: 'Air fryer family 4', outcome: 'Resolved · accepted rec', trustImpact: 'Positive', humanIntervention: 'None', status: 'Resolved', userQuestion: 'Air fryer for family of four?', aiResponse: 'NovaCook 7L fits usage + budget.', interventionSummary: ['No edits.', 'Order placed.'], suggestedImprovements: ['Reuse winning template.'] },
    ],
    trends: [
      { id: 'trust-index', title: 'Trust index', subtitle: 'Fleet', value: '84', trend: 'up', points: [80, 81, 82, 82, 83, 84, 84], explainKey: 'operational-trust-index' },
      { id: 'adoption', title: 'Copilot adoption', subtitle: 'Active sessions', value: '+22%', trend: 'up', points: [16, 17, 18, 19, 20, 21, 22], explainKey: 'copilot-adoption' },
      { id: 'escalation-trend', title: 'Escalations', subtitle: 'Share of convos', value: '14%', trend: 'down', points: [17, 16, 16, 15, 15, 14.5, 14], explainKey: 'escalation-rate' },
      { id: 'retry-clarification-trend', title: 'Retry & clarification', subtitle: 'Share of convos', value: '9.1%', trend: 'down', points: [10.4, 10.1, 9.8, 9.5, 9.3, 9.2, 9.1], explainKey: 'retry-clarification' },
    ],
  },
  '7d': {
    overview: [
      { label: 'Task success', value: '88%', trend: 'up', tone: 'live', sparkline: [84, 85, 86, 86, 87, 87, 88], explainKey: 'task-success' },
      { label: 'Retry & clarification', value: '8.3%', trend: 'down', tone: 'healthy', sparkline: [9.8, 9.4, 9.1, 8.8, 8.6, 8.4, 8.3], explainKey: 'retry-clarification' },
      { label: 'Escalations', value: '13%', trend: 'down', tone: 'healthy', sparkline: [16, 15, 15, 14.5, 14, 13.5, 13], explainKey: 'escalation-rate' },
      { label: 'Trusted responses', value: '92%', trend: 'up', tone: 'live', sparkline: [88, 89, 90, 90, 91, 92, 92], explainKey: 'trusted-responses' },
      { label: 'Satisfaction Δ', value: '+8%', trend: 'up', tone: 'live', sparkline: [3, 4, 4.8, 5.8, 6.5, 7.2, 8], explainKey: 'user-satisfaction' },
      { label: 'High-conf failures', value: '10%', trend: 'down', tone: 'watch', sparkline: [13, 12.6, 12.1, 11.5, 11.0, 10.4, 10], explainKey: 'high-confidence-fails' },
    ],
    matrixRows: [
      { id: 'shopping-concierge', agent: 'Shopping Concierge Agent', trustScore: 84, taskSuccess: '87%', retryClarification: '8.5%', escalations: '14%', trustedResponses: '86%', userSatisfaction: '4.4', highConfidenceFails: '8%', trustTrend: [81, 81, 82, 83, 83, 84, 84], status: 'Watch', signal: 'Stable use' },
      { id: 'product-qa', agent: 'Product Q&A Agent', trustScore: 81, taskSuccess: '85%', retryClarification: '10.4%', escalations: '15%', trustedResponses: '82%', userSatisfaction: '4.2', highConfidenceFails: '11%', trustTrend: [79, 79, 80, 80, 81, 81, 81], status: 'Watch', signal: 'Recovering' },
      { id: 'order-delivery', agent: 'Order & Delivery Agent', trustScore: 85, taskSuccess: '88%', retryClarification: '7.5%', escalations: '13%', trustedResponses: '87%', userSatisfaction: '4.4', highConfidenceFails: '9%', trustTrend: [82, 83, 83, 84, 84, 85, 85], status: 'Trusted', signal: 'Stable' },
      { id: 'returns-refunds', agent: 'Returns & Refunds Agent', trustScore: 89, taskSuccess: '91%', retryClarification: '5.9%', escalations: '10%', trustedResponses: '90%', userSatisfaction: '4.6', highConfidenceFails: '6%', trustTrend: [86, 87, 87, 88, 88, 89, 89], status: 'Trusted', signal: 'Low friction' },
      { id: 'support-copilot', agent: 'Customer Support Copilot', trustScore: 94, taskSuccess: '95%', retryClarification: '3.8%', escalations: '6%', trustedResponses: '94%', userSatisfaction: '4.8', highConfidenceFails: '3%', trustTrend: [91, 92, 92, 93, 93, 94, 94], status: 'Trusted', signal: 'Adoption ↑', internalHumanEditRate: '3.9%' },
      { id: 'merch-insights', agent: 'Merchandising Insights Agent', trustScore: 83, taskSuccess: '85%', retryClarification: '8.1%', escalations: '12%', trustedResponses: '84%', userSatisfaction: '4.3', highConfidenceFails: '8%', trustTrend: [81, 81, 82, 82, 83, 83, 83], status: 'Watch', signal: 'Edits ↓', internalHumanEditRate: '9.1%' },
      { id: 'inventory-fulfillment', agent: 'Inventory & Fulfillment Agent', trustScore: 82, taskSuccess: '84%', retryClarification: '9.3%', escalations: '14%', trustedResponses: '83%', userSatisfaction: '4.2', highConfidenceFails: '10%', trustTrend: [79, 80, 80, 81, 81, 82, 82], status: 'Watch', signal: 'Overrides ↓', internalHumanEditRate: '10.4%' },
    ],
    trustSignals: [
      {
        id: 'task-success-rate',
        title: 'Task success rate',
        explainKey: 'task-success',
        metricLabel: 'Fleet · clean completion',
        metricValue: '88%',
        tone: 'live',
        trend: [84, 85, 85, 86, 87, 87, 88],
        insightLine: 'Strong week—customer-facing agents closing more threads without handoff.',
      },
      {
        id: 'retry-clarification-rate',
        title: 'Retry & clarification rate',
        explainKey: 'retry-clarification',
        metricLabel: 'Convos w/ loops',
        metricValue: '8.3%',
        tone: 'healthy',
        trend: [9.8, 9.4, 9.1, 8.8, 8.6, 8.4, 8.3],
        bars: [
          { label: 'Clarify follow-up', value: 32 },
          { label: 'Rephrase intent', value: 30 },
          { label: 'Explicit retry', value: 20 },
          { label: 'Restate after answer', value: 18 },
        ],
        insightLine: 'Down week-over-week; fewer clarification loops after retrieval and tone fixes.',
      },
      {
        id: 'escalation-reasons',
        title: 'Escalation reasons',
        explainKey: 'escalation-reasons',
        metricLabel: 'Handoffs (7d)',
        metricValue: '17.4k',
        tone: 'watch',
        trend: [16, 15.8, 15.4, 14.8, 14.2, 13.7, 13],
        bars: [
          { label: 'Unclear answer', value: 29 },
          { label: 'Incorrect information', value: 22 },
          { label: 'Missing context', value: 21 },
          { label: 'Policy uncertainty', value: 18 },
          { label: 'Failed tool action', value: 10 },
        ],
        insightLine: 'Tool-failure handoffs flat; answer quality is the lever.',
      },
      {
        id: 'trusted-responses-signal',
        title: 'Trusted responses',
        explainKey: 'trusted-responses',
        metricLabel: 'Accepted first reply',
        metricValue: '92%',
        tone: 'live',
        trend: [89, 89, 90, 91, 91, 92, 92],
        insightLine: 'Copilot adoption up without sacrificing first-pass acceptance.',
      },
      {
        id: 'high-confidence-failures',
        title: 'High-confidence failures',
        explainKey: 'high-confidence-fails',
        metricLabel: 'Of escalations',
        metricValue: '10%',
        tone: 'watch',
        trend: [13, 12.6, 12.1, 11.5, 11.0, 10.4, 10],
        insightLine: 'Language controls helped; compatibility intents still drive confident misses.',
      },
      {
        id: 'trust-drift',
        title: 'Trust drift',
        explainKey: 'trust-drift',
        metricLabel: 'Largest agent move',
        metricValue: '-4%',
        tone: 'healthy',
        trend: [-7, -6, -5, -5, -4, -4, -4],
        insightLine: 'Post-catalog dip flattening after retrieval fix.',
      },
    ],
    promptPerformance: {
      trend: {
        bucketLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        successRates: [83, 84, 85, 87, 88, 88, 88],
        escalationRates: [11.5, 11, 10, 8.5, 7, 6.9, 7.1],
        retryClarificationRates: [13.5, 12.5, 11.5, 9.5, 8.2, 8.0, 8.3],
        activeVersion: ['v17', 'v17', 'v18', 'v18', 'v18', 'v19', 'v19'],
      },
      versionRows: [
        { version: 'v17', success: '83%', retries: '13%', escalations: '11%', avgTokens: '3.6k' },
        { version: 'v18', success: '88%', retries: '8%', escalations: '7%', avgTokens: '2.9k' },
        { version: 'v19', success: '88%', retries: '8.1%', escalations: '7.1%', avgTokens: '2.6k' },
      ],
    },
    conversations: [
      { id: 'conv-301', agentId: 'product-qa', agent: 'Product Q&A Agent', userIntent: 'Dock compatibility', outcome: 'Reviewed · sourced fix', trustImpact: 'Negative', humanIntervention: 'Specialist swap + citation', status: 'Reviewed', userQuestion: 'NovaDock X + NovaBook Air 2023?', aiResponse: 'Yes—all Air models supported.', interventionSummary: ['Evidence gap closed.', 'No return opened.'], suggestedImprovements: ['Bind dock matrix to answers.'] },
      { id: 'conv-302', agentId: 'support-copilot', agent: 'Customer Support Copilot', userIntent: 'Refund vs replace', outcome: 'Resolved · zero edit', trustImpact: 'Positive', humanIntervention: 'None', status: 'Resolved', userQuestion: 'Show refund and replace side by side.', aiResponse: 'Both paths with timelines attached.', interventionSummary: ['Accepted as-is.', 'FCR.'], suggestedImprovements: ['Template as default.'] },
      { id: 'conv-303', agentId: 'inventory-fulfillment', agent: 'Inventory & Fulfillment Agent', userIntent: 'Alt warehouse ship', outcome: 'Resolved · ops override', trustImpact: 'Neutral', humanIntervention: 'Stock promise corrected', status: 'Resolved', userQuestion: 'Ship from alternate DC today?', aiResponse: 'Yes—enough stock for same day.', interventionSummary: ['Reservation missed in tool data.', 'Timeline fixed.'], suggestedImprovements: ['Check reservations before promise.'] },
      { id: 'conv-304', agentId: 'returns-refunds', agent: 'Returns & Refunds Agent', userIntent: 'Used item return', outcome: 'Escalated · nuance', trustImpact: 'Neutral', humanIntervention: 'Policy specialist', status: 'Escalated', userQuestion: 'Used once—still returnable?', aiResponse: 'Generally used items are non-returnable.', interventionSummary: ['Edge criteria explained.', 'Customer retained.'], suggestedImprovements: ['Surface exception tree earlier.'] },
    ],
    trends: [
      { id: 'trust-index', title: 'Trust index', subtitle: 'Fleet', value: '85', trend: 'up', points: [82, 82, 83, 84, 84, 85, 85], explainKey: 'operational-trust-index' },
      { id: 'adoption', title: 'Copilot adoption', subtitle: 'Active sessions', value: '+22%', trend: 'up', points: [18, 19, 19.5, 20, 20.5, 21.5, 22], explainKey: 'copilot-adoption' },
      { id: 'escalation-trend', title: 'Escalations', subtitle: 'Share of convos', value: '13%', trend: 'down', points: [16, 15.5, 15, 14.5, 14, 13.6, 13], explainKey: 'escalation-rate' },
      { id: 'retry-clarification-trend', title: 'Retry & clarification', subtitle: 'Share of convos', value: '8.3%', trend: 'down', points: [9.8, 9.4, 9.1, 8.8, 8.6, 8.4, 8.3], explainKey: 'retry-clarification' },
    ],
  },
}

export const trustData: Record<TimeRange, TrustSnapshot> = trustSnapshots
