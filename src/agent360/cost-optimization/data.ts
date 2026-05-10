import type { AgentStatus, FacingType, FleetMetric } from '../operational-health/data'
import { timeRanges, type TimeRange } from '../operational-health/data'

export { timeRanges, type TimeRange }

export type AgentCostRow = {
  id: string
  name: string
  facing: FacingType
  purpose: string
  efficiencyStatus: AgentStatus
  totalSpend: string
  costPerConversation: string
  costPerSuccessfulOutcome: string
  premiumModelShare: string
  routingEfficiency: string
  savingsOpportunity: string
  valueToCost: string
  recommendation: string
  sparkline: number[]
  profile: AgentCostProfile
}

export type AgentCostProfile = {
  efficiencyNarrative: string
  valueToCostRatio: string
  spendSummary: {
    totalSpend: string
    costPerConversation: string
    costPerSuccessfulOutcome: string
    premiumModelShare: string
  }
  modelUsage: {
    gpt4o: string
    claudeSonnet: string
    geminiPro: string
    embedding: string
  }
  optimizationSignals: {
    premiumOveruse: string
    contextWaste: string
    repeatedQueries: string
    fallbackInefficiency: string
    cacheOpportunity: string
  }
  recommendedAction: string
  expectedImpact: {
    estimatedSavings: string
    trustImpact: string
    confidence: string
  }
}

export type RoutingComplexityBucket = {
  id: string
  label: string
  /** Share of traffic in this complexity band (for distribution bar) */
  trafficPct: number
  mainModel: string
  statusLabel: string
  statusKind: 'watch' | 'efficient' | 'justified' | 'protected'
  /** Short action line — only when relevant */
  recommendation?: string
}

export type TopRoutingSignal = {
  id: string
  title: string
  sentence: string
  agent: string
  impact: string
}

export type OptimizationOpportunityCard = {
  id: string
  title: string
  agents: string[]
  savingsPerDay: string
  qualityImpact: string
  confidence: string
  action: string
  badges: Array<'High impact' | 'Low risk' | 'Needs review'>
}

export type SavingsMode = 'conservative' | 'balanced' | 'aggressive'

export type SavingsScenario = {
  monthlySavings: string
  trustImpact: string
  trafficRerouted: string
  premiumReduction: string
}

export type ModelCostTier = 'low' | 'high' | 'premium'

export type CurrentModelCostRow = {
  model: string
  provider: string
  inputPerM: string
  outputPerM: string
  bestFor: string
  tier: ModelCostTier
  /** Modeled 24h spend (aligned with Total AI Spend ~€5.3k / day). */
  dailySpendDisplay: string
  /** Share of total model-layer spend, 0–100. */
  shareOfSpendPct: number
}

/** Sum of `dailySpendDisplay` rows — for labels; keep in sync with overview Total AI Spend (24h). */
export const currentModelCostDailyTotalLabel = '€5.3k'

/** One-line narrative tying spend concentration to fleet agents (24h view). */
export const currentModelCostFleetInsight =
  'GPT-4o accounts for 40% of total AI spend, primarily driven by Shopping Concierge and Product Q&A traffic.'

/** Reference API pricing + modeled daily allocation — not contractual rates. */
export const currentModelCostReference: CurrentModelCostRow[] = [
  {
    model: 'GPT-4o',
    provider: 'OpenAI',
    inputPerM: '$2.50',
    outputPerM: '$10.00',
    bestFor: 'Premium general reasoning',
    tier: 'premium',
    dailySpendDisplay: '€2.1k',
    shareOfSpendPct: 40,
  },
  {
    model: 'Claude Sonnet',
    provider: 'Anthropic',
    inputPerM: '$3.00',
    outputPerM: '$15.00',
    bestFor: 'Strong reasoning & support flows',
    tier: 'premium',
    dailySpendDisplay: '€1.4k',
    shareOfSpendPct: 27,
  },
  {
    model: 'Gemini Pro',
    provider: 'Google',
    inputPerM: '$1.25',
    outputPerM: '$10.00',
    bestFor: 'Long context & complex analysis',
    tier: 'high',
    dailySpendDisplay: '€920',
    shareOfSpendPct: 17,
  },
  {
    model: 'Gemini Flash / Lightweight',
    provider: 'Google',
    inputPerM: '$0.30',
    outputPerM: '$2.50',
    bestFor: 'Low-cost routing for simple tasks',
    tier: 'low',
    dailySpendDisplay: '€520',
    shareOfSpendPct: 10,
  },
  {
    model: 'Embedding Service',
    provider: 'Internal / vector search',
    inputPerM: '$0.10',
    outputPerM: 'N/A',
    bestFor: 'Retrieval & semantic search',
    tier: 'low',
    dailySpendDisplay: '€360',
    shareOfSpendPct: 6,
  },
]

export type CostOptimizationSnapshot = {
  overviewMetrics: FleetMetric[]
  fleetCostRows: AgentCostRow[]
  routingSummaryKpis: FleetMetric[]
  routingComplexityBuckets: RoutingComplexityBucket[]
  topRoutingSignals: TopRoutingSignal[]
  opportunities: OptimizationOpportunityCard[]
  savingsScenarios: Record<SavingsMode, SavingsScenario>
}

const baseProfiles: Record<string, Omit<AgentCostProfile, 'efficiencyNarrative' | 'valueToCostRatio'>> = {
  'shopping-concierge': {
    spendSummary: {
      totalSpend: '€1.42k',
      costPerConversation: '€0.38',
      costPerSuccessfulOutcome: '€0.51',
      premiumModelShare: '52%',
    },
    modelUsage: { gpt4o: '58%', claudeSonnet: '31%', geminiPro: '4%', embedding: '7%' },
    optimizationSignals: {
      premiumOveruse: 'Elevated — 41% of browse intents still on GPT-4o',
      contextWaste: 'Moderate — redundant catalog snippets in 18% of turns',
      repeatedQueries: 'Low',
      fallbackInefficiency: 'Low',
      cacheOpportunity: 'High — popular category paths repeat hourly',
    },
    recommendedAction:
      'Route low-complexity browsing queries to Claude Sonnet and reserve GPT-4o for complex comparisons and bundle logic.',
    expectedImpact: {
      estimatedSavings: '€255 / day',
      trustImpact: 'Low — monitored on comparison quality',
      confidence: 'High',
    },
  },
  'product-qa': {
    spendSummary: {
      totalSpend: '€1.08k',
      costPerConversation: '€0.29',
      costPerSuccessfulOutcome: '€0.36',
      premiumModelShare: '61%',
    },
    modelUsage: { gpt4o: '68%', claudeSonnet: '22%', geminiPro: '3%', embedding: '7%' },
    optimizationSignals: {
      premiumOveruse: 'High — 31% of low-complexity traffic on GPT-4o',
      contextWaste: 'Low',
      repeatedQueries: 'High — duplicate compatibility questions',
      fallbackInefficiency: 'Moderate',
      cacheOpportunity: 'High — top SKUs account for 44% of volume',
    },
    recommendedAction:
      'Use a smaller model for low-risk compatibility and sizing checks; keep GPT-4o for policy-adjacent answers.',
    expectedImpact: {
      estimatedSavings: '€165 / day',
      trustImpact: 'Medium-low — A/B on compatibility intents',
      confidence: 'Medium',
    },
  },
  'order-delivery': {
    spendSummary: {
      totalSpend: '€620',
      costPerConversation: '€0.11',
      costPerSuccessfulOutcome: '€0.15',
      premiumModelShare: '28%',
    },
    modelUsage: { gpt4o: '12%', claudeSonnet: '54%', geminiPro: '27%', embedding: '7%' },
    optimizationSignals: {
      premiumOveruse: 'Low',
      contextWaste: 'Low',
      repeatedQueries: 'Very high — identical order lookups',
      fallbackInefficiency: 'Moderate — retry amplification on carrier tools',
      cacheOpportunity: 'Very high — status strings stable for 15–45 min',
    },
    recommendedAction:
      'Cache repeated order-status and tracking lookups with short TTL; reduce tool round-trips for known carriers.',
    expectedImpact: {
      estimatedSavings: '€115 / day',
      trustImpact: 'None expected',
      confidence: 'High',
    },
  },
  'returns-refunds': {
    spendSummary: {
      totalSpend: '€480',
      costPerConversation: '€0.22',
      costPerSuccessfulOutcome: '€0.28',
      premiumModelShare: '44%',
    },
    modelUsage: { gpt4o: '18%', claudeSonnet: '62%', geminiPro: '13%', embedding: '7%' },
    optimizationSignals: {
      premiumOveruse: 'Contained — exceptions drive premium share',
      contextWaste: 'Low',
      repeatedQueries: 'Low',
      fallbackInefficiency: 'Low',
      cacheOpportunity: 'Low — policy windows change often',
    },
    recommendedAction:
      'Restrict premium routing to refund exceptions and ambiguous policy edges; route routine returns to Sonnet.',
    expectedImpact: {
      estimatedSavings: '€145 / day',
      trustImpact: 'Low — policy QA on exceptions only',
      confidence: 'High',
    },
  },
  'support-copilot': {
    spendSummary: {
      totalSpend: '€390',
      costPerConversation: '€0.14',
      costPerSuccessfulOutcome: '€0.17',
      premiumModelShare: '22%',
    },
    modelUsage: { gpt4o: '8%', claudeSonnet: '19%', geminiPro: '66%', embedding: '7%' },
    optimizationSignals: {
      premiumOveruse: 'Low',
      contextWaste: 'Low',
      repeatedQueries: 'Low',
      fallbackInefficiency: 'Low',
      cacheOpportunity: 'Moderate — similar ticket clusters',
    },
    recommendedAction:
      'Scale usage across more support teams; unit economics already strong — expand coverage before further downgrades.',
    expectedImpact: {
      estimatedSavings: '€50 / day incremental',
      trustImpact: 'Positive if paired with coaching',
      confidence: 'Medium',
    },
  },
  'merch-insights': {
    spendSummary: {
      totalSpend: '€560',
      costPerConversation: '€0.89',
      costPerSuccessfulOutcome: '€1.05',
      premiumModelShare: '48%',
    },
    modelUsage: { gpt4o: '55%', claudeSonnet: '28%', geminiPro: '10%', embedding: '7%' },
    optimizationSignals: {
      premiumOveruse: 'Moderate — long-context review bursts',
      contextWaste: 'High — full review dumps on recurring categories',
      repeatedQueries: 'Moderate',
      fallbackInefficiency: 'Low',
      cacheOpportunity: 'High — weekly category briefings',
    },
    recommendedAction:
      'Compress long merchandising context with structured summaries; cache recurring category analysis jobs.',
    expectedImpact: {
      estimatedSavings: '€78 / day',
      trustImpact: 'Low — validate insight parity on samples',
      confidence: 'Medium',
    },
  },
  'inventory-fulfillment': {
    spendSummary: {
      totalSpend: '€710',
      costPerConversation: '€0.41',
      costPerSuccessfulOutcome: '€0.48',
      premiumModelShare: '34%',
    },
    modelUsage: { gpt4o: '14%', claudeSonnet: '21%', geminiPro: '58%', embedding: '7%' },
    optimizationSignals: {
      premiumOveruse: 'Low',
      contextWaste: 'Moderate',
      repeatedQueries: 'Moderate — warehouse polling',
      fallbackInefficiency: 'High — API retries stack cost',
      cacheOpportunity: 'Moderate',
    },
    recommendedAction:
      'Optimize API retries and retrieval calls; batch warehouse reads and dedupe tool failures before model fallback.',
    expectedImpact: {
      estimatedSavings: '€92 / day',
      trustImpact: 'Low',
      confidence: 'High',
    },
  },
}

function buildRow(
  id: string,
  name: string,
  facing: FacingType,
  purpose: string,
  efficiencyStatus: AgentStatus,
  metrics: {
    totalSpend: string
    costPerConversation: string
    costPerSuccessfulOutcome: string
    premiumModelShare: string
    routingEfficiency: string
    savingsOpportunity: string
    valueToCost: string
  },
  recommendation: string,
  sparkline: number[],
): AgentCostRow {
  const base = baseProfiles[id]
  if (!base) throw new Error(`Missing profile ${id}`)
  return {
    id,
    name,
    facing,
    purpose,
    efficiencyStatus,
    recommendation,
    sparkline,
    ...metrics,
    profile: {
      ...base,
      spendSummary: {
        totalSpend: metrics.totalSpend,
        costPerConversation: metrics.costPerConversation,
        costPerSuccessfulOutcome: metrics.costPerSuccessfulOutcome,
        premiumModelShare: metrics.premiumModelShare,
      },
      efficiencyNarrative:
        efficiencyStatus === 'Healthy'
          ? 'Spend is well aligned with outcomes and routing discipline.'
          : efficiencyStatus === 'Stable'
            ? 'Balanced efficiency with selective premium use.'
            : efficiencyStatus === 'Degraded'
              ? 'Premium usage or waste signals exceed guardrails.'
              : 'Critical misalignment — immediate routing review.',
      valueToCostRatio: metrics.valueToCost,
    },
  }
}

const fleet24h: AgentCostRow[] = [
  buildRow(
    'shopping-concierge',
    'Shopping Concierge Agent',
    'Customer',
    'Helps customers discover, compare, and choose products.',
    'Stable',
    {
      totalSpend: '€1.42k',
      costPerConversation: '€0.38',
      costPerSuccessfulOutcome: '€0.51',
      premiumModelShare: '52%',
      routingEfficiency: '71%',
      savingsOpportunity: '€255',
      valueToCost: '8.2x',
    },
    'Route simple browsing to cheaper model',
    [62, 64, 63, 67, 70, 72, 74],
  ),
  buildRow(
    'product-qa',
    'Product Q&A Agent',
    'Customer',
    'Answers product-specific questions using catalog, reviews, and policies.',
    'Degraded',
    {
      totalSpend: '€1.08k',
      costPerConversation: '€0.29',
      costPerSuccessfulOutcome: '€0.36',
      premiumModelShare: '61%',
      routingEfficiency: '64%',
      savingsOpportunity: '€165',
      valueToCost: '6.1x',
    },
    'Use smaller model for low-risk compatibility checks',
    [48, 52, 55, 58, 60, 59, 62],
  ),
  buildRow(
    'order-delivery',
    'Order & Delivery Agent',
    'Customer',
    'Handles order status, delivery updates, and shipping issues.',
    'Stable',
    {
      totalSpend: '€620',
      costPerConversation: '€0.11',
      costPerSuccessfulOutcome: '€0.15',
      premiumModelShare: '28%',
      routingEfficiency: '82%',
      savingsOpportunity: '€115',
      valueToCost: '7.4x',
    },
    'Cache order-status calls',
    [40, 42, 44, 45, 47, 48, 50],
  ),
  buildRow(
    'returns-refunds',
    'Returns & Refunds Agent',
    'Customer',
    'Helps users return products, check refund status, and understand policies.',
    'Healthy',
    {
      totalSpend: '€480',
      costPerConversation: '€0.22',
      costPerSuccessfulOutcome: '€0.28',
      premiumModelShare: '44%',
      routingEfficiency: '79%',
      savingsOpportunity: '€145',
      valueToCost: '9.1x',
    },
    'Use premium model only for refund exceptions',
    [44, 45, 46, 47, 48, 49, 50],
  ),
  buildRow(
    'support-copilot',
    'Customer Support Copilot',
    'Internal',
    'Helps support agents summarize cases and draft replies.',
    'Healthy',
    {
      totalSpend: '€390',
      costPerConversation: '€0.14',
      costPerSuccessfulOutcome: '€0.17',
      premiumModelShare: '22%',
      routingEfficiency: '88%',
      savingsOpportunity: '€50',
      valueToCost: '11.4x',
    },
    'Scale usage across more support teams',
    [52, 54, 55, 56, 57, 58, 59],
  ),
  buildRow(
    'merch-insights',
    'Merchandising Insights Agent',
    'Internal',
    'Helps category teams analyze reviews, complaints, and product gaps.',
    'Stable',
    {
      totalSpend: '€560',
      costPerConversation: '€0.89',
      costPerSuccessfulOutcome: '€1.05',
      premiumModelShare: '48%',
      routingEfficiency: '69%',
      savingsOpportunity: '€78',
      valueToCost: '5.8x',
    },
    'Compress context and cache recurring analysis',
    [36, 38, 39, 41, 42, 43, 45],
  ),
  buildRow(
    'inventory-fulfillment',
    'Inventory & Fulfillment Agent',
    'Internal',
    'Helps ops teams understand stockouts, delivery delays, and warehouse issues.',
    'Stable',
    {
      totalSpend: '€710',
      costPerConversation: '€0.41',
      costPerSuccessfulOutcome: '€0.48',
      premiumModelShare: '34%',
      routingEfficiency: '74%',
      savingsOpportunity: '€92',
      valueToCost: '6.9x',
    },
    'Optimize API retries and retrieval calls',
    [42, 44, 46, 48, 50, 51, 53],
  ),
]

const overview24h: FleetMetric[] = [
  {
    label: 'Total AI Spend',
    value: '€5.3k',
    trend: 'up',
    tone: 'watch',
    sparkline: [38, 40, 42, 41, 44, 46, 48],
    secondary: '+9% vs prior day',
  },
  {
    label: 'Cost / Successful Outcome',
    value: '€0.42',
    trend: 'down',
    tone: 'healthy',
    sparkline: [52, 50, 49, 48, 46, 44, 42],
    secondary: '12.6k successful outcomes',
  },
  {
    label: 'Value-to-Cost Ratio',
    value: '6.8x',
    trend: 'up',
    tone: 'healthy',
    sparkline: [58, 59, 60, 61, 63, 65, 68],
    secondary: 'Value ÷ spend',
  },
  {
    label: 'Est. Savings Opportunity',
    value: '€0.9k',
    trend: 'up',
    tone: 'watch',
    sparkline: [20, 21, 22, 23, 24, 25, 26],
    secondary: 'Agent-level signals · 24h',
  },
  {
    label: 'Premium Model Usage',
    value: '38%',
    trend: 'flat',
    tone: 'watch',
    sparkline: [40, 39, 40, 38, 38, 37, 38],
    secondary: 'Flagship share of volume',
  },
  {
    label: 'Routing Efficiency',
    value: '76%',
    trend: 'up',
    tone: 'healthy',
    sparkline: [68, 69, 70, 72, 73, 75, 76],
    secondary: '+5 pts vs yesterday',
  },
]

const overview1h: FleetMetric[] = [
  {
    label: 'Total AI Spend',
    value: '€440',
    trend: 'up',
    tone: 'watch',
    sparkline: [18, 20, 22, 21, 24, 23, 25],
    secondary: 'Elevated hourly run-rate',
  },
  {
    label: 'Cost / Successful Outcome',
    value: '€0.58',
    trend: 'down',
    tone: 'watch',
    sparkline: [66, 64, 62, 61, 60, 59, 58],
    secondary: '760 outcomes · 1h window',
  },
  {
    label: 'Value-to-Cost Ratio',
    value: '5.2x',
    trend: 'flat',
    tone: 'watch',
    sparkline: [50, 51, 50, 52, 51, 52, 52],
    secondary: 'Volatile in short window',
  },
  {
    label: 'Est. Savings Opportunity',
    value: '€180',
    trend: 'up',
    tone: 'healthy',
    sparkline: [12, 13, 14, 15, 16, 17, 18],
    secondary: 'Run-rate from last hour',
  },
  {
    label: 'Premium Model Usage',
    value: '44%',
    trend: 'up',
    tone: 'watch',
    sparkline: [38, 39, 40, 41, 42, 43, 44],
    secondary: 'Peak-hour flagship tilt',
  },
  {
    label: 'Routing Efficiency',
    value: '68%',
    trend: 'down',
    tone: 'watch',
    sparkline: [74, 72, 71, 70, 69, 68, 68],
    secondary: 'EU burst · check 24h',
  },
]

const overview7d: FleetMetric[] = [
  {
    label: 'Total AI Spend',
    value: '€35.6k',
    trend: 'up',
    tone: 'watch',
    sparkline: [28, 32, 36, 40, 44, 48, 52],
    secondary: '+6% vs prior week',
  },
  {
    label: 'Cost / Successful Outcome',
    value: '€0.39',
    trend: 'down',
    tone: 'healthy',
    sparkline: [48, 47, 46, 45, 44, 40, 39],
    secondary: '91k successful outcomes',
  },
  {
    label: 'Value-to-Cost Ratio',
    value: '7.4x',
    trend: 'up',
    tone: 'healthy',
    sparkline: [60, 62, 64, 66, 69, 72, 74],
    secondary: '7-day blend',
  },
  {
    label: 'Est. Savings Opportunity',
    value: '€6.2k',
    trend: 'up',
    tone: 'watch',
    sparkline: [22, 26, 30, 34, 38, 42, 46],
    secondary: 'Rolling 7-day pool',
  },
  {
    label: 'Premium Model Usage',
    value: '35%',
    trend: 'down',
    tone: 'healthy',
    sparkline: [42, 41, 40, 39, 37, 36, 35],
    secondary: '−3 pts vs prior week',
  },
  {
    label: 'Routing Efficiency',
    value: '81%',
    trend: 'up',
    tone: 'healthy',
    sparkline: [72, 74, 75, 76, 78, 79, 81],
    secondary: '+8% vs prior week',
  },
]

const fleet1h: AgentCostRow[] = [
  buildRow(
    'shopping-concierge',
    'Shopping Concierge Agent',
    'Customer',
    'Helps customers discover, compare, and choose products.',
    'Stable',
    {
      totalSpend: '€118',
      costPerConversation: '€0.44',
      costPerSuccessfulOutcome: '€0.61',
      premiumModelShare: '56%',
      routingEfficiency: '66%',
      savingsOpportunity: '€48',
      valueToCost: '7.1x',
    },
    'Route simple browsing to cheaper model',
    [60, 62, 64, 63, 65, 67, 68],
  ),
  buildRow(
    'product-qa',
    'Product Q&A Agent',
    'Customer',
    'Answers product-specific questions using catalog, reviews, and policies.',
    'Degraded',
    {
      totalSpend: '€92',
      costPerConversation: '€0.34',
      costPerSuccessfulOutcome: '€0.44',
      premiumModelShare: '66%',
      routingEfficiency: '59%',
      savingsOpportunity: '€36',
      valueToCost: '5.4x',
    },
    'Use smaller model for low-risk compatibility checks',
    [46, 48, 50, 52, 54, 53, 55],
  ),
  buildRow(
    'order-delivery',
    'Order & Delivery Agent',
    'Customer',
    'Handles order status, delivery updates, and shipping issues.',
    'Stable',
    {
      totalSpend: '€54',
      costPerConversation: '€0.13',
      costPerSuccessfulOutcome: '€0.18',
      premiumModelShare: '32%',
      routingEfficiency: '78%',
      savingsOpportunity: '€24',
      valueToCost: '6.8x',
    },
    'Cache order-status calls',
    [38, 40, 41, 42, 43, 44, 45],
  ),
  buildRow(
    'returns-refunds',
    'Returns & Refunds Agent',
    'Customer',
    'Helps users return products, check refund status, and understand policies.',
    'Healthy',
    {
      totalSpend: '€41',
      costPerConversation: '€0.25',
      costPerSuccessfulOutcome: '€0.32',
      premiumModelShare: '48%',
      routingEfficiency: '76%',
      savingsOpportunity: '€30',
      valueToCost: '8.4x',
    },
    'Use premium model only for refund exceptions',
    [43, 44, 45, 46, 47, 48, 49],
  ),
  buildRow(
    'support-copilot',
    'Customer Support Copilot',
    'Internal',
    'Helps support agents summarize cases and draft replies.',
    'Healthy',
    {
      totalSpend: '€33',
      costPerConversation: '€0.16',
      costPerSuccessfulOutcome: '€0.20',
      premiumModelShare: '26%',
      routingEfficiency: '84%',
      savingsOpportunity: '€11',
      valueToCost: '9.8x',
    },
    'Scale usage across more support teams',
    [50, 51, 52, 53, 54, 55, 56],
  ),
  buildRow(
    'merch-insights',
    'Merchandising Insights Agent',
    'Internal',
    'Helps category teams analyze reviews, complaints, and product gaps.',
    'Stable',
    {
      totalSpend: '€47',
      costPerConversation: '€0.96',
      costPerSuccessfulOutcome: '€1.14',
      premiumModelShare: '52%',
      routingEfficiency: '64%',
      savingsOpportunity: '€16',
      valueToCost: '5.2x',
    },
    'Compress context and cache recurring analysis',
    [34, 35, 36, 38, 39, 40, 41],
  ),
  buildRow(
    'inventory-fulfillment',
    'Inventory & Fulfillment Agent',
    'Internal',
    'Helps ops teams understand stockouts, delivery delays, and warehouse issues.',
    'Stable',
    {
      totalSpend: '€59',
      costPerConversation: '€0.46',
      costPerSuccessfulOutcome: '€0.54',
      premiumModelShare: '38%',
      routingEfficiency: '70%',
      savingsOpportunity: '€19',
      valueToCost: '6.2x',
    },
    'Optimize API retries and retrieval calls',
    [40, 42, 43, 45, 46, 47, 49],
  ),
]

const fleet7d: AgentCostRow[] = [
  buildRow(
    'shopping-concierge',
    'Shopping Concierge Agent',
    'Customer',
    'Helps customers discover, compare, and choose products.',
    'Stable',
    {
      totalSpend: '€9.6k',
      costPerConversation: '€0.36',
      costPerSuccessfulOutcome: '€0.48',
      premiumModelShare: '48%',
      routingEfficiency: '74%',
      savingsOpportunity: '€1.7k',
      valueToCost: '8.6x',
    },
    'Route simple browsing to cheaper model',
    [64, 66, 67, 69, 71, 73, 75],
  ),
  buildRow(
    'product-qa',
    'Product Q&A Agent',
    'Customer',
    'Answers product-specific questions using catalog, reviews, and policies.',
    'Degraded',
    {
      totalSpend: '€7.4k',
      costPerConversation: '€0.27',
      costPerSuccessfulOutcome: '€0.34',
      premiumModelShare: '57%',
      routingEfficiency: '67%',
      savingsOpportunity: '€1.1k',
      valueToCost: '6.4x',
    },
    'Use smaller model for low-risk compatibility checks',
    [50, 53, 56, 58, 60, 61, 63],
  ),
  buildRow(
    'order-delivery',
    'Order & Delivery Agent',
    'Customer',
    'Handles order status, delivery updates, and shipping issues.',
    'Stable',
    {
      totalSpend: '€4.2k',
      costPerConversation: '€0.10',
      costPerSuccessfulOutcome: '€0.14',
      premiumModelShare: '26%',
      routingEfficiency: '84%',
      savingsOpportunity: '€770',
      valueToCost: '7.8x',
    },
    'Cache order-status calls',
    [42, 44, 45, 47, 48, 50, 52],
  ),
  buildRow(
    'returns-refunds',
    'Returns & Refunds Agent',
    'Customer',
    'Helps users return products, check refund status, and understand policies.',
    'Healthy',
    {
      totalSpend: '€3.2k',
      costPerConversation: '€0.20',
      costPerSuccessfulOutcome: '€0.26',
      premiumModelShare: '41%',
      routingEfficiency: '81%',
      savingsOpportunity: '€970',
      valueToCost: '9.5x',
    },
    'Use premium model only for refund exceptions',
    [45, 46, 47, 48, 49, 50, 51],
  ),
  buildRow(
    'support-copilot',
    'Customer Support Copilot',
    'Internal',
    'Helps support agents summarize cases and draft replies.',
    'Healthy',
    {
      totalSpend: '€2.6k',
      costPerConversation: '€0.13',
      costPerSuccessfulOutcome: '€0.16',
      premiumModelShare: '20%',
      routingEfficiency: '90%',
      savingsOpportunity: '€330',
      valueToCost: '12.1x',
    },
    'Scale usage across more support teams',
    [54, 55, 56, 57, 58, 59, 60],
  ),
  buildRow(
    'merch-insights',
    'Merchandising Insights Agent',
    'Internal',
    'Helps category teams analyze reviews, complaints, and product gaps.',
    'Stable',
    {
      totalSpend: '€3.8k',
      costPerConversation: '€0.85',
      costPerSuccessfulOutcome: '€0.99',
      premiumModelShare: '45%',
      routingEfficiency: '72%',
      savingsOpportunity: '€530',
      valueToCost: '6.1x',
    },
    'Compress context and cache recurring analysis',
    [38, 40, 41, 43, 44, 45, 47],
  ),
  buildRow(
    'inventory-fulfillment',
    'Inventory & Fulfillment Agent',
    'Internal',
    'Helps ops teams understand stockouts, delivery delays, and warehouse issues.',
    'Stable',
    {
      totalSpend: '€4.8k',
      costPerConversation: '€0.38',
      costPerSuccessfulOutcome: '€0.45',
      premiumModelShare: '31%',
      routingEfficiency: '77%',
      savingsOpportunity: '€650',
      valueToCost: '7.2x',
    },
    'Optimize API retries and retrieval calls',
    [44, 46, 48, 50, 52, 53, 55],
  ),
]

function syncProfiles(rows: AgentCostRow[]) {
  for (const row of rows) {
    const base = baseProfiles[row.id]
    row.profile = {
      ...base,
      spendSummary: {
        totalSpend: row.totalSpend,
        costPerConversation: row.costPerConversation,
        costPerSuccessfulOutcome: row.costPerSuccessfulOutcome,
        premiumModelShare: row.premiumModelShare,
      },
      efficiencyNarrative: row.profile.efficiencyNarrative,
      valueToCostRatio: row.valueToCost,
    }
  }
}

syncProfiles(fleet24h)
syncProfiles(fleet1h)
syncProfiles(fleet7d)

const routingSummaryKpis24h: FleetMetric[] = [
  { label: 'Routing Efficiency', value: '76%', trend: 'up', tone: 'healthy', sparkline: [68, 69, 71, 72, 73, 75, 76] },
  { label: 'Premium Model Overuse', value: '23%', trend: 'down', tone: 'watch', sparkline: [28, 27, 26, 25, 24, 23, 23] },
  { label: 'Low-Risk Premium Traffic', value: '31%', trend: 'flat', tone: 'watch', sparkline: [33, 32, 32, 31, 31, 31, 31] },
  { label: 'Est. Routing Savings', value: '€18.7k', trend: 'up', tone: 'healthy', sparkline: [12, 14, 15, 16, 17, 18, 19] },
]

const routingSummaryKpis1h: FleetMetric[] = [
  { label: 'Routing Efficiency', value: '68%', trend: 'down', tone: 'watch', sparkline: [74, 72, 71, 70, 69, 68, 68] },
  { label: 'Premium Model Overuse', value: '27%', trend: 'up', tone: 'watch', sparkline: [22, 23, 24, 25, 26, 27, 27] },
  { label: 'Low-Risk Premium Traffic', value: '36%', trend: 'up', tone: 'watch', sparkline: [30, 31, 33, 34, 35, 36, 36] },
  { label: 'Est. Routing Savings', value: '€1.4k', trend: 'flat', tone: 'watch', sparkline: [14, 14, 15, 14, 15, 14, 15] },
]

const routingSummaryKpis7d: FleetMetric[] = [
  { label: 'Routing Efficiency', value: '81%', trend: 'up', tone: 'healthy', sparkline: [74, 76, 77, 78, 79, 80, 81] },
  { label: 'Premium Model Overuse', value: '19%', trend: 'down', tone: 'healthy', sparkline: [24, 23, 22, 21, 20, 19, 19] },
  { label: 'Low-Risk Premium Traffic', value: '26%', trend: 'down', tone: 'healthy', sparkline: [31, 30, 29, 28, 27, 26, 26] },
  { label: 'Est. Routing Savings', value: '€20.5k', trend: 'up', tone: 'healthy', sparkline: [16, 17, 18, 19, 19, 20, 21] },
]

const routingComplexityBuckets24h: RoutingComplexityBucket[] = [
  {
    id: 'low',
    label: 'Low Complexity',
    trafficPct: 38,
    mainModel: 'GPT-4o (31%)',
    statusLabel: 'Premium overuse detected',
    statusKind: 'watch',
    recommendation: 'Route more traffic to Claude Sonnet',
  },
  {
    id: 'med',
    label: 'Medium Complexity',
    trafficPct: 36,
    mainModel: 'Claude Sonnet',
    statusLabel: 'Efficient routing',
    statusKind: 'efficient',
  },
  {
    id: 'high',
    label: 'High Complexity',
    trafficPct: 18,
    mainModel: 'GPT-4o',
    statusLabel: 'Premium usage justified',
    statusKind: 'justified',
  },
  {
    id: 'risk',
    label: 'Policy / High-Risk',
    trafficPct: 8,
    mainModel: 'GPT-4o',
    statusLabel: 'Expected protected routing',
    statusKind: 'protected',
  },
]

const topRoutingSignals24h: TopRoutingSignal[] = [
  {
    id: 'sig-1',
    title: 'Premium Overuse',
    sentence: 'Product Q&A routes too many simple compatibility checks to GPT-4o.',
    agent: 'Product Q&A Agent',
    impact: 'Medium savings opportunity',
  },
  {
    id: 'sig-2',
    title: 'Large Downgrade Opportunity',
    sentence: 'Shopping Concierge has the highest low-risk downgrade potential.',
    agent: 'Shopping Concierge Agent',
    impact: 'High savings opportunity',
  },
  {
    id: 'sig-3',
    title: 'Protected Premium Routing',
    sentence: 'Returns exceptions correctly use premium routing due to policy sensitivity.',
    agent: 'Returns & Refunds Agent',
    impact: 'Expected behavior',
  },
]

const opportunities24h: OptimizationOpportunityCard[] = [
  {
    id: '1',
    title: 'Route shopping browse off GPT-4o to Claude Sonnet',
    agents: ['Shopping Concierge Agent'],
    savingsPerDay: '€255 / day',
    qualityImpact: 'Low',
    confidence: 'High',
    action: 'Deploy intent classifier v2; shadow-route browse intents before cutover.',
    badges: ['High impact', 'Low risk'],
  },
  {
    id: '2',
    title: 'Move low-risk Product Q&A off GPT-4o',
    agents: ['Product Q&A Agent'],
    savingsPerDay: '€165 / day',
    qualityImpact: 'Medium-low',
    confidence: 'Medium',
    action: 'Pilot Sonnet on compatibility and sizing lookups with golden-set evals.',
    badges: ['High impact', 'Needs review'],
  },
  {
    id: '3',
    title: 'Cache repeated order-status lookups',
    agents: ['Order & Delivery Agent'],
    savingsPerDay: '€115 / day',
    qualityImpact: 'None',
    confidence: 'High',
    action: 'Add 20-minute TTL cache on tracking + status tool responses.',
    badges: ['Low risk'],
  },
  {
    id: '4',
    title: 'Compress long merchandising context',
    agents: ['Merchandising Insights Agent'],
    savingsPerDay: '€78 / day',
    qualityImpact: 'Low',
    confidence: 'Medium',
    action: 'Summarize review dumps to structured bullets before model call.',
    badges: ['Needs review'],
  },
  {
    id: '5',
    title: 'Restrict premium model to refund exceptions',
    agents: ['Returns & Refunds Agent'],
    savingsPerDay: '€145 / day',
    qualityImpact: 'Low',
    confidence: 'High',
    action: 'Gate GPT-4o on exception score; routine flows stay on Sonnet.',
    badges: ['High impact', 'Low risk'],
  },
  {
    id: '6',
    title: 'Dedupe inventory tool retries before fallback',
    agents: ['Inventory & Fulfillment Agent'],
    savingsPerDay: '€92 / day',
    qualityImpact: 'Low',
    confidence: 'High',
    action: 'Backoff + single-flight per warehouse query cluster.',
    badges: ['Low risk'],
  },
]

const savings24h: Record<SavingsMode, SavingsScenario> = {
  conservative: {
    monthlySavings: '€9.2k',
    trustImpact: '-0.4%',
    trafficRerouted: '12%',
    premiumReduction: '7%',
  },
  balanced: {
    monthlySavings: '€18.7k',
    trustImpact: '-1.1%',
    trafficRerouted: '24%',
    premiumReduction: '17%',
  },
  aggressive: {
    monthlySavings: '€31.4k',
    trustImpact: '-3.8%',
    trafficRerouted: '41%',
    premiumReduction: '29%',
  },
}

function buildSnapshot(
  overview: FleetMetric[],
  fleet: AgentCostRow[],
  routingSummaryKpis: FleetMetric[],
  routingComplexityBuckets: RoutingComplexityBucket[],
  topRoutingSignals: TopRoutingSignal[],
  opportunities: OptimizationOpportunityCard[],
  savings: Record<SavingsMode, SavingsScenario>,
): CostOptimizationSnapshot {
  return {
    overviewMetrics: overview,
    fleetCostRows: fleet,
    routingSummaryKpis,
    routingComplexityBuckets,
    topRoutingSignals,
    opportunities,
    savingsScenarios: savings,
  }
}

export const costOptimizationData: Record<TimeRange, CostOptimizationSnapshot> = {
  '1h': buildSnapshot(
    overview1h,
    fleet1h,
    routingSummaryKpis1h,
    routingComplexityBuckets24h.map((b) =>
      b.id === 'low'
        ? {
            ...b,
            mainModel: 'GPT-4o (36%)',
            statusLabel: 'Elevated premium share',
            recommendation: 'Validate against daily mix before shifting routes',
          }
        : b,
    ),
    topRoutingSignals24h.map((s) =>
      s.id === 'sig-2'
        ? {
            ...s,
            sentence: 'Shopping Concierge shows a short spike in flagship use — confirm when the hour normalizes.',
            impact: 'Monitor',
          }
        : s,
    ),
    opportunities24h.map((o) => {
      const hourlyFactor = 0.085
      const m = Number.parseFloat(o.savingsPerDay.replace(/[€/ day]/g, '').trim())
      const scaled = Number.isFinite(m) ? Math.max(12, Math.round(m * hourlyFactor)) : 12
      return { ...o, savingsPerDay: `~€${scaled} / hr (scaled from daily baseline)` }
    }),
    {
      conservative: {
        monthlySavings: '€0.8k',
        trustImpact: '-0.2%',
        trafficRerouted: '8%',
        premiumReduction: '5%',
      },
      balanced: {
        monthlySavings: '€1.6k',
        trustImpact: '-0.6%',
        trafficRerouted: '15%',
        premiumReduction: '11%',
      },
      aggressive: {
        monthlySavings: '€2.7k',
        trustImpact: '-2.1%',
        trafficRerouted: '28%',
        premiumReduction: '19%',
      },
    },
  ),
  '24h': buildSnapshot(
    overview24h,
    fleet24h,
    routingSummaryKpis24h,
    routingComplexityBuckets24h,
    topRoutingSignals24h,
    opportunities24h,
    savings24h,
  ),
  '7d': buildSnapshot(
    overview7d,
    fleet7d,
    routingSummaryKpis7d,
    routingComplexityBuckets24h.map((b) =>
      b.id === 'low'
        ? {
            ...b,
            mainModel: 'Sonnet-led (GPT-4o fallback)',
            statusLabel: 'Improving — fewer mismatches',
            statusKind: 'efficient' as const,
            recommendation: undefined,
          }
        : b,
    ),
    topRoutingSignals24h.map((s) =>
      s.id === 'sig-1'
        ? {
            ...s,
            sentence: 'Product Q&A mismatch is shrinking as Sonnet coverage expands.',
            impact: 'Medium savings · improving',
          }
        : s.id === 'sig-2'
          ? {
              ...s,
              sentence: 'Shopping Concierge still offers the clearest structural savings if quality gates hold.',
            }
          : s,
    ),
    opportunities24h.map((o) => ({
      ...o,
      savingsPerDay: o.savingsPerDay
        .replace('€255', '€280')
        .replace('€165', '€182')
        .replace('€115', '€127')
        .replace('€78', '€86')
        .replace('€145', '€160')
        .replace('€92', '€102'),
    })),
    {
      conservative: {
        monthlySavings: '€10.1k',
        trustImpact: '-0.3%',
        trafficRerouted: '14%',
        premiumReduction: '9%',
      },
      balanced: {
        monthlySavings: '€20.5k',
        trustImpact: '-0.9%',
        trafficRerouted: '27%',
        premiumReduction: '18%',
      },
      aggressive: {
        monthlySavings: '€34.4k',
        trustImpact: '-3.2%',
        trafficRerouted: '44%',
        premiumReduction: '31%',
      },
    },
  ),
}
