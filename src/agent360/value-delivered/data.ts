export const valueTimeRanges = ['24h', '7d', '30d'] as const
export type ValueTimeRange = (typeof valueTimeRanges)[number]

export type TrendDirection = 'up' | 'down' | 'flat'

export const trendPatterns = {
  cumulativeValue: [18, 24, 33, 45, 58, 72, 86, 94],
  ticketAcceleration: [20, 22, 28, 39, 55, 70, 84, 92],
  stableResolution: [74, 76, 78, 81, 83, 84, 86, 87],
  productivityLift: [34, 38, 43, 47, 52, 58, 62, 65],
  csatSmooth: [58, 59, 60, 61, 62, 64, 65, 66],
  revenueGrowth: [28, 35, 44, 52, 63, 73, 82, 90],
  revenueMonth: [34, 42, 51, 61, 72, 82, 90, 96],
  adoptionPlateauGrowth: [44, 48, 50, 50, 52, 59, 67, 74],
  supportProductivity: [42, 47, 55, 61, 68, 74, 82, 88],
  returnsWorkload: [46, 52, 61, 68, 73, 79, 84, 89],
  inventoryRecovery: [42, 39, 44, 52, 57, 63, 68, 74],
  productFriction: [40, 43, 48, 54, 57, 62, 66, 71],
  volatileCommerce: [45, 52, 61, 58, 69, 65, 76, 83],
  steadyOps: [48, 51, 55, 57, 60, 62, 65, 67],
  merchandisingStepUp: [34, 36, 41, 45, 51, 54, 60, 66],
  slightDeclineRecovery: [60, 57, 54, 56, 61, 66, 69, 72],
} satisfies Record<string, number[]>

export type ValueMetric = {
  label: string
  value: string
  detail: string
  trendLabel: string
  trend: TrendDirection
  sparkline: number[]
}

export type FleetValueRow = {
  id: string
  agent: string
  purpose: string
  primaryOutcome: string
  timeSaved: string
  ticketsAvoided: string
  productivityGain: string
  revenueInfluence: string
  adoptionTrend: string
  estimatedValue: string
  adoptionScore: number
  valueScore: number
  sparkline: number[]
  selectedNarrative: string
}

export type OutcomeInsight = {
  id: string
  agent: string
  headline: string
  metric: string
  narrative: string
  impactLabel: string
  sparkline: number[]
}

export type WorkflowImpactStory = {
  id: string
  title: string
  agent: string
  before: string
  after: string
  metric: string
  delta: string
  humanImpact: string
}

export type ValueOpportunity = {
  id: string
  title: string
  agent: string
  description: string
  recommendation: string
  impact: string
  priority: 'High' | 'Medium'
}

export type ValueSnapshot = {
  overview: ValueMetric[]
  matrixRows: FleetValueRow[]
  insights: OutcomeInsight[]
  workflowStories: WorkflowImpactStory[]
  opportunities: ValueOpportunity[]
}

const rows24h: FleetValueRow[] = [
  {
    id: 'shopping-concierge',
    agent: 'Shopping Concierge Agent',
    purpose: 'Helps customers discover, compare, and choose products.',
    primaryOutcome: 'Assisted purchases',
    timeSaved: '126h',
    ticketsAvoided: '1.1k',
    productivityGain: '+9%',
    revenueInfluence: '€41k',
    adoptionTrend: '+6%',
    estimatedValue: '€74k',
    adoptionScore: 76,
    valueScore: 91,
    sparkline: trendPatterns.volatileCommerce,
    selectedNarrative:
      'Highest near-term commercial contributor today, especially on guided product discovery and comparison journeys.',
  },
  {
    id: 'product-qa',
    agent: 'Product Q&A Agent',
    purpose: 'Answers product-specific questions using catalog, reviews, and policies.',
    primaryOutcome: 'Reduced buying friction',
    timeSaved: '94h',
    ticketsAvoided: '980',
    productivityGain: '+7%',
    revenueInfluence: '€22k',
    adoptionTrend: '+4%',
    estimatedValue: '€46k',
    adoptionScore: 69,
    valueScore: 82,
    sparkline: trendPatterns.productFriction,
    selectedNarrative:
      'Cuts repetitive pre-purchase questions and keeps shoppers moving when product information is complete.',
  },
  {
    id: 'order-delivery',
    agent: 'Order & Delivery Agent',
    purpose: 'Handles order status, delivery updates, and shipping issues.',
    primaryOutcome: 'Fewer status contacts',
    timeSaved: '112h',
    ticketsAvoided: '1.3k',
    productivityGain: '+8%',
    revenueInfluence: '€8k',
    adoptionTrend: '+2%',
    estimatedValue: '€38k',
    adoptionScore: 73,
    valueScore: 78,
    sparkline: trendPatterns.steadyOps,
    selectedNarrative:
      'Absorbs repetitive delivery-status demand and protects support capacity during carrier volatility.',
  },
  {
    id: 'returns-refunds',
    agent: 'Returns & Refunds Agent',
    purpose: 'Helps users return products, check refund status, and understand policies.',
    primaryOutcome: 'Workload reduction',
    timeSaved: '168h',
    ticketsAvoided: '1.8k',
    productivityGain: '+11%',
    revenueInfluence: '€6k',
    adoptionTrend: '+5%',
    estimatedValue: '€57k',
    adoptionScore: 81,
    valueScore: 88,
    sparkline: trendPatterns.returnsWorkload,
    selectedNarrative:
      'Strong workload reducer: refund-status and policy questions are being resolved before human escalation.',
  },
  {
    id: 'support-copilot',
    agent: 'Customer Support Copilot',
    purpose: 'Assists human agents with summaries, suggested replies, and next best actions.',
    primaryOutcome: 'Employee productivity',
    timeSaved: '236h',
    ticketsAvoided: '620',
    productivityGain: '+15%',
    revenueInfluence: '€12k',
    adoptionTrend: '+8%',
    estimatedValue: '€82k',
    adoptionScore: 84,
    valueScore: 94,
    sparkline: trendPatterns.supportProductivity,
    selectedNarrative:
      'Largest human productivity lever today, saving time inside active support work rather than replacing judgment.',
  },
  {
    id: 'merchandising-insights',
    agent: 'Merchandising Insights Agent',
    purpose: 'Summarizes product feedback, demand signals, and category-level opportunities.',
    primaryOutcome: 'Faster product decisions',
    timeSaved: '58h',
    ticketsAvoided: '210',
    productivityGain: '+6%',
    revenueInfluence: '€18k',
    adoptionTrend: '+3%',
    estimatedValue: '€31k',
    adoptionScore: 58,
    valueScore: 73,
    sparkline: trendPatterns.merchandisingStepUp,
    selectedNarrative:
      'Emerging value source for category teams, especially where feedback synthesis used to take days.',
  },
  {
    id: 'inventory-fulfillment',
    agent: 'Inventory & Fulfillment Agent',
    purpose: 'Helps operations teams investigate stock availability and fulfillment exceptions.',
    primaryOutcome: 'Faster investigations',
    timeSaved: '104h',
    ticketsAvoided: '360',
    productivityGain: '+10%',
    revenueInfluence: '€10k',
    adoptionTrend: '+1%',
    estimatedValue: '€36k',
    adoptionScore: 54,
    valueScore: 76,
    sparkline: trendPatterns.inventoryRecovery,
    selectedNarrative:
      'Meaningful operations leverage, but value is concentrated in a few active regions today.',
  },
]

const rows7d: FleetValueRow[] = [
  {
    ...rows24h[0],
    timeSaved: '780h',
    ticketsAvoided: '6.8k',
    productivityGain: '+12%',
    revenueInfluence: '€260k',
    adoptionTrend: '+11%',
    estimatedValue: '€410k',
    adoptionScore: 82,
    valueScore: 93,
    sparkline: trendPatterns.revenueGrowth,
  },
  {
    ...rows24h[1],
    timeSaved: '620h',
    ticketsAvoided: '5.9k',
    productivityGain: '+9%',
    revenueInfluence: '€136k',
    adoptionTrend: '+7%',
    estimatedValue: '€244k',
    adoptionScore: 74,
    valueScore: 85,
    sparkline: trendPatterns.productFriction,
  },
  {
    ...rows24h[2],
    timeSaved: '710h',
    ticketsAvoided: '7.4k',
    productivityGain: '+10%',
    revenueInfluence: '€48k',
    adoptionTrend: '+5%',
    estimatedValue: '€218k',
    adoptionScore: 78,
    valueScore: 82,
    sparkline: trendPatterns.steadyOps,
  },
  {
    ...rows24h[3],
    timeSaved: '1,060h',
    ticketsAvoided: '10.9k',
    productivityGain: '+13%',
    revenueInfluence: '€38k',
    adoptionTrend: '+9%',
    estimatedValue: '€336k',
    adoptionScore: 86,
    valueScore: 91,
    sparkline: trendPatterns.returnsWorkload,
  },
  {
    ...rows24h[4],
    timeSaved: '1,420h',
    ticketsAvoided: '4.2k',
    productivityGain: '+17%',
    revenueInfluence: '€76k',
    adoptionTrend: '+14%',
    estimatedValue: '€492k',
    adoptionScore: 88,
    valueScore: 96,
    sparkline: trendPatterns.supportProductivity,
  },
  {
    ...rows24h[5],
    timeSaved: '360h',
    ticketsAvoided: '1.4k',
    productivityGain: '+8%',
    revenueInfluence: '€108k',
    adoptionTrend: '+6%',
    estimatedValue: '€176k',
    adoptionScore: 64,
    valueScore: 79,
    sparkline: trendPatterns.merchandisingStepUp,
  },
  {
    ...rows24h[6],
    timeSaved: '690h',
    ticketsAvoided: '2.5k',
    productivityGain: '+12%',
    revenueInfluence: '€58k',
    adoptionTrend: '+4%',
    estimatedValue: '€206k',
    adoptionScore: 61,
    valueScore: 81,
    sparkline: trendPatterns.inventoryRecovery,
  },
]

const rows30d: FleetValueRow[] = [
  {
    ...rows7d[0],
    timeSaved: '3,160h',
    ticketsAvoided: '27.4k',
    productivityGain: '+14%',
    revenueInfluence: '€1.08M',
    adoptionTrend: '+18%',
    estimatedValue: '€1.72M',
    adoptionScore: 87,
    valueScore: 95,
    sparkline: trendPatterns.revenueMonth,
  },
  {
    ...rows7d[1],
    timeSaved: '2,420h',
    ticketsAvoided: '23.8k',
    productivityGain: '+11%',
    revenueInfluence: '€420k',
    adoptionTrend: '+12%',
    estimatedValue: '€890k',
    adoptionScore: 79,
    valueScore: 88,
    sparkline: trendPatterns.productFriction,
  },
  {
    ...rows7d[2],
    timeSaved: '2,860h',
    ticketsAvoided: '29.6k',
    productivityGain: '+12%',
    revenueInfluence: '€210k',
    adoptionTrend: '+9%',
    estimatedValue: '€840k',
    adoptionScore: 82,
    valueScore: 86,
    sparkline: trendPatterns.steadyOps,
  },
  {
    ...rows7d[3],
    timeSaved: '4,980h',
    ticketsAvoided: '46.8k',
    productivityGain: '+15%',
    revenueInfluence: '€180k',
    adoptionTrend: '+16%',
    estimatedValue: '€1.42M',
    adoptionScore: 90,
    valueScore: 94,
    sparkline: trendPatterns.returnsWorkload,
  },
  {
    ...rows7d[4],
    timeSaved: '5,760h',
    ticketsAvoided: '18.4k',
    productivityGain: '+19%',
    revenueInfluence: '€310k',
    adoptionTrend: '+21%',
    estimatedValue: '€1.96M',
    adoptionScore: 91,
    valueScore: 98,
    sparkline: trendPatterns.supportProductivity,
  },
  {
    ...rows7d[5],
    timeSaved: '1,440h',
    ticketsAvoided: '5.8k',
    productivityGain: '+10%',
    revenueInfluence: '€360k',
    adoptionTrend: '+10%',
    estimatedValue: '€640k',
    adoptionScore: 70,
    valueScore: 83,
    sparkline: trendPatterns.merchandisingStepUp,
  },
  {
    ...rows7d[6],
    timeSaved: '2,780h',
    ticketsAvoided: '10.2k',
    productivityGain: '+14%',
    revenueInfluence: '€240k',
    adoptionTrend: '+8%',
    estimatedValue: '€780k',
    adoptionScore: 68,
    valueScore: 84,
    sparkline: trendPatterns.inventoryRecovery,
  },
]

export const valueDeliveredData: Record<ValueTimeRange, ValueSnapshot> = {
  '24h': {
    overview: [
      { label: 'Time Saved', value: '898h', detail: 'Employee hours reclaimed', trendLabel: '+11% vs prior day', trend: 'up', sparkline: trendPatterns.supportProductivity },
      { label: 'Tickets Avoided', value: '6.4k', detail: 'Self-served customer moments', trendLabel: '+8% vs prior day', trend: 'up', sparkline: trendPatterns.ticketAcceleration },
      { label: 'Successful Resolutions', value: '91%', detail: 'Completed without manual rework', trendLabel: '+3 pts', trend: 'up', sparkline: trendPatterns.stableResolution },
      { label: 'Estimated Operational Value', value: '€364k', detail: 'Tracked savings and influence', trendLabel: '+13% vs prior day', trend: 'up', sparkline: trendPatterns.cumulativeValue },
      { label: 'Productivity Gain', value: '+14%', detail: 'Across assisted teams', trendLabel: '+2 pts', trend: 'up', sparkline: trendPatterns.productivityLift },
      { label: 'CSAT Impact', value: '+6%', detail: 'Customer experience lift', trendLabel: 'Steady positive', trend: 'flat', sparkline: trendPatterns.csatSmooth },
    ],
    matrixRows: rows24h,
    insights: [
      { id: 'support-time', agent: 'Customer Support Copilot', headline: 'Support Copilot saves 3.8 minutes per support interaction.', metric: '236h saved', narrative: 'Summaries and reply drafts are reclaiming frontline team capacity.', impactLabel: 'Employee productivity', sparkline: trendPatterns.supportProductivity },
      { id: 'returns-escalation', agent: 'Returns & Refunds Agent', headline: 'Refund escalations are down 42% on policy-covered requests.', metric: '1.8k tickets avoided', narrative: 'Clear return answers are keeping repetitive contacts out of the queue.', impactLabel: 'Workload reduction', sparkline: trendPatterns.returnsWorkload },
      { id: 'shopping-assisted', agent: 'Shopping Concierge Agent', headline: 'Guided product journeys influenced €41k in assisted purchases today.', metric: '€41k influenced', narrative: 'High-intent product discovery is converting into assisted revenue.', impactLabel: 'Revenue influence', sparkline: trendPatterns.revenueGrowth },
    ],
    workflowStories: [
      { id: 'support', title: 'Support Cases Move Faster', agent: 'Customer Support Copilot', before: 'Agents manually read long threads, rewrite replies, and search policies between every response.', after: 'Copilot summarizes the case, drafts the next best reply, and highlights policy context before the agent responds.', metric: '3.8 min', delta: 'saved per interaction', humanImpact: 'More time for complex customer judgment.' },
      { id: 'returns', title: 'Returns Need Fewer Hand-Offs', agent: 'Returns & Refunds Agent', before: 'Refund-status questions created repetitive tickets and avoidable escalations to billing operations.', after: 'Customers get eligibility, status, and next-step answers in the journey before a human queue is needed.', metric: '42%', delta: 'fewer escalations', humanImpact: 'Lower repetitive load on frontline teams.' },
      { id: 'inventory', title: 'Stockout Investigations Are Shorter', agent: 'Inventory & Fulfillment Agent', before: 'Ops teams checked warehouse dashboards, order notes, and fulfillment exceptions in separate tools.', after: 'The agent assembles likely stockout causes and regional context into one investigation summary.', metric: '61%', delta: 'less investigation time', humanImpact: 'Faster answers for store and support teams.' },
    ],
    opportunities: [
      { id: 'mobile-shopping', title: 'Mobile discovery underperforms', agent: 'Shopping Concierge Agent', description: 'Mobile journeys lag desktop conversion.', recommendation: 'Improve mobile discovery.', impact: '+€38k monthly influence', priority: 'High' },
      { id: 'support-adoption', title: 'Copilot adoption can expand', agent: 'Customer Support Copilot', description: 'Most eligible support cases are still handled without Copilot.', recommendation: 'Make Copilot the default case workspace.', impact: '+520h monthly capacity', priority: 'High' },
      { id: 'inventory-regions', title: 'Inventory value is concentrated', agent: 'Inventory & Fulfillment Agent', description: 'Inventory usage remains concentrated in only a few regions.', recommendation: 'Expand regional templates.', impact: '+190h monthly ops savings', priority: 'Medium' },
    ],
  },
  '7d': {
    overview: [
      { label: 'Time Saved', value: '5,640h', detail: 'Employee hours reclaimed', trendLabel: '+18% vs prior week', trend: 'up', sparkline: trendPatterns.supportProductivity },
      { label: 'Tickets Avoided', value: '39.1k', detail: 'Self-served customer moments', trendLabel: '+15% vs prior week', trend: 'up', sparkline: trendPatterns.ticketAcceleration },
      { label: 'Successful Resolutions', value: '92%', detail: 'Completed without manual rework', trendLabel: '+4 pts', trend: 'up', sparkline: trendPatterns.stableResolution },
      { label: 'Estimated Operational Value', value: '€2.08M', detail: 'Tracked savings and influence', trendLabel: '+21% vs prior week', trend: 'up', sparkline: trendPatterns.cumulativeValue },
      { label: 'Productivity Gain', value: '+16%', detail: 'Across assisted teams', trendLabel: '+3 pts', trend: 'up', sparkline: trendPatterns.productivityLift },
      { label: 'CSAT Impact', value: '+7%', detail: 'Customer experience lift', trendLabel: '+1 pt', trend: 'up', sparkline: trendPatterns.csatSmooth },
    ],
    matrixRows: rows7d,
    insights: [
      { id: 'support-week', agent: 'Customer Support Copilot', headline: 'Support Copilot reclaimed 1,420 hours for frontline teams this week.', metric: '1,420h saved', narrative: 'Faster summaries and next-best actions are raising team throughput.', impactLabel: 'Employee productivity', sparkline: trendPatterns.supportProductivity },
      { id: 'returns-week', agent: 'Returns & Refunds Agent', headline: 'Returns automation avoided 10.9k support tickets over seven days.', metric: '10.9k avoided', narrative: 'Return-status journeys are absorbing repetitive customer demand.', impactLabel: 'Workload reduction', sparkline: trendPatterns.ticketAcceleration },
      { id: 'inventory-week', agent: 'Inventory & Fulfillment Agent', headline: 'Inventory & Fulfillment Agent reduced stockout investigation time by 61%.', metric: '690h saved', narrative: 'Warehouse and order context now resolves exceptions faster.', impactLabel: 'Operational efficiency', sparkline: trendPatterns.inventoryRecovery },
      { id: 'product-week', agent: 'Product Q&A Agent', headline: 'Product Q&A reduced pre-purchase support requests by 27%.', metric: '5.9k avoided', narrative: 'Product answers are reducing pre-purchase contact volume.', impactLabel: 'Customer friction', sparkline: trendPatterns.productFriction },
    ],
    workflowStories: [
      { id: 'support', title: 'Support Teams Resolve More Work', agent: 'Customer Support Copilot', before: 'Senior agents spent a large share of their day rewriting repetitive replies and coaching similar cases.', after: 'Copilot standardizes the first draft and highlights exceptions, so senior agents focus on judgment-heavy work.', metric: '+17%', delta: 'team productivity', humanImpact: 'More throughput without making the work feel rushed.' },
      { id: 'shopping', title: 'Product Discovery Converts Better', agent: 'Shopping Concierge Agent', before: 'Customers bounced between product pages and comparison tables without clear decision support.', after: 'The agent narrows choices, explains tradeoffs, and moves the shopper toward the right product faster.', metric: '€260k', delta: 'assisted purchases', humanImpact: 'Less uncertainty in high-intent shopping moments.' },
      { id: 'orders', title: 'Delivery Status Becomes Self-Service', agent: 'Order & Delivery Agent', before: 'Shipment questions repeatedly entered the support queue during carrier delays.', after: 'Customers receive status, delay context, and next steps before creating a ticket.', metric: '7.4k', delta: 'contacts avoided', humanImpact: 'Support teams stay available for exceptions.' },
    ],
    opportunities: [
      { id: 'refund-escalations', title: 'Refund escalations remain reducible', agent: 'Returns & Refunds Agent', description: 'Refund requests still escalate too often.', recommendation: 'Automate refund status.', impact: '+€110k quarterly value', priority: 'High' },
      { id: 'electronics-trust', title: 'Compatibility questions create friction', agent: 'Product Q&A Agent', description: 'Compatibility questions drive avoidable contacts.', recommendation: 'Improve compatibility coverage.', impact: '-18% pre-purchase contacts', priority: 'High' },
      { id: 'merchant-adoption', title: 'Merchandising insights need a ritual', agent: 'Merchandising Insights Agent', description: 'Category teams are not using insights weekly.', recommendation: 'Launch weekly digests.', impact: '+€72k monthly influence', priority: 'Medium' },
    ],
  },
  '30d': {
    overview: [
      { label: 'Time Saved', value: '23,400h', detail: 'Employee hours reclaimed', trendLabel: '+24% vs prior month', trend: 'up', sparkline: trendPatterns.supportProductivity },
      { label: 'Tickets Avoided', value: '162k', detail: 'Self-served customer moments', trendLabel: '+19% vs prior month', trend: 'up', sparkline: trendPatterns.ticketAcceleration },
      { label: 'Successful Resolutions', value: '93%', detail: 'Completed without manual rework', trendLabel: '+5 pts', trend: 'up', sparkline: trendPatterns.stableResolution },
      { label: 'Estimated Operational Value', value: '€8.25M', detail: 'Tracked savings and influence', trendLabel: '+28% vs prior month', trend: 'up', sparkline: trendPatterns.cumulativeValue },
      { label: 'Productivity Gain', value: '+18%', detail: 'Across assisted teams', trendLabel: '+4 pts', trend: 'up', sparkline: trendPatterns.productivityLift },
      { label: 'CSAT Impact', value: '+8%', detail: 'Customer experience lift', trendLabel: '+2 pts', trend: 'up', sparkline: trendPatterns.csatSmooth },
    ],
    matrixRows: rows30d,
    insights: [
      { id: 'shopping-month', agent: 'Shopping Concierge Agent', headline: 'Shopping Concierge influenced €1.08M in assisted purchases this month.', metric: '€1.08M influenced', narrative: 'High-intent product discovery is converting into measurable assisted revenue.', impactLabel: 'Revenue influence', sparkline: trendPatterns.revenueMonth },
      { id: 'support-month', agent: 'Customer Support Copilot', headline: 'Support Copilot reclaimed 5,760 employee hours in 30 days.', metric: '5,760h saved', narrative: 'Productivity gains are compounding across assisted support cases.', impactLabel: 'Employee productivity', sparkline: trendPatterns.supportProductivity },
      { id: 'returns-month', agent: 'Returns & Refunds Agent', headline: 'Returns automation prevented 46.8k repetitive contacts.', metric: '46.8k avoided', narrative: 'Returns and refund flows are reducing frontline workload at scale.', impactLabel: 'Workload reduction', sparkline: trendPatterns.ticketAcceleration },
      { id: 'inventory-month', agent: 'Inventory & Fulfillment Agent', headline: 'Inventory & Fulfillment Agent created €780k in measured operations value.', metric: '€780k value', narrative: 'Faster exception investigation is shortening internal cycle time.', impactLabel: 'Operational efficiency', sparkline: trendPatterns.inventoryRecovery },
    ],
    workflowStories: [
      { id: 'support', title: 'Support Capacity Scales Without More Repetitive Work', agent: 'Customer Support Copilot', before: 'Growth in contact volume translated directly into staffing pressure and repetitive review work.', after: 'Copilot absorbs drafting, summarization, and policy lookup, creating more capacity from the same team.', metric: '5,760h', delta: 'capacity reclaimed', humanImpact: 'Humans spend more time on empathy, exceptions, and judgment.' },
      { id: 'returns', title: 'Returns Become a Lower-Friction Customer Journey', agent: 'Returns & Refunds Agent', before: 'Customers contacted support to confirm eligibility, refund timing, and next steps.', after: 'The agent resolves most policy-covered questions in-flow and explains what happens next.', metric: '46.8k', delta: 'tickets avoided', humanImpact: 'Less frustration for customers and agents.' },
      { id: 'merchandising', title: 'Merchandising Teams See Customer Demand Faster', agent: 'Merchandising Insights Agent', before: 'Feedback synthesis happened manually after the trend had already surfaced in support queues.', after: 'The agent turns review, search, and question patterns into weekly category opportunities.', metric: '4 days', delta: 'faster insight cycle', humanImpact: 'Product teams act while demand signals are fresh.' },
    ],
    opportunities: [
      { id: 'scale-copilot', title: 'Support Copilot is ready to scale', agent: 'Customer Support Copilot', description: 'High-adoption teams show the strongest productivity lift.', recommendation: 'Default Copilot into every case.', impact: '+2,400h monthly capacity', priority: 'High' },
      { id: 'mobile-revenue', title: 'Mobile discovery leaves value open', agent: 'Shopping Concierge Agent', description: 'Mobile assisted journeys lag desktop conversion.', recommendation: 'Improve mobile discovery.', impact: '+€310k monthly influence', priority: 'High' },
      { id: 'inventory-rollout', title: 'Inventory rollout is too narrow', agent: 'Inventory & Fulfillment Agent', description: 'Inventory usage remains concentrated in lead regions.', recommendation: 'Expand to three markets.', impact: '+€420k quarterly ops value', priority: 'Medium' },
      { id: 'product-qa-context', title: 'Category context can reduce contacts', agent: 'Product Q&A Agent', description: 'Compatibility gaps continue driving avoidable support contacts.', recommendation: 'Strengthen category attributes.', impact: '-22k monthly contacts', priority: 'Medium' },
    ],
  },
}
