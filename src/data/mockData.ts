export type AgentStatus = 'healthy' | 'watch' | 'critical'
export type TraceStatus = 'Success' | 'Warning' | 'Failed' | 'Escalated'
export type Severity = 'low' | 'medium' | 'high'

export type AgentRow = {
  id: string
  name: string
  status: AgentStatus
  traffic: string
  latencyMs: number
  successRate: number
  healthScore: number
  costToday: number
  sparkline: number[]
}

export type TraceRow = {
  id: string
  timestamp: string
  agent: string
  intent: string
  latency: string
  model: string
  status: TraceStatus
  cost: string
  promptVersion: string
  toolCalls: number
  retrievedContext: string
  evaluation: string
  rootCause: string
}

export type Incident = {
  id: string
  title: string
  severity: Severity
  status: 'Open' | 'Investigating' | 'Mitigated'
  timestamp: string
  details: string
}

export const heroMetrics = {
  systemStatus: 'Healthy',
  activeAgents: 24,
  totalConversations: '189.4k',
  activeIncidents: 2,
  spendToday: '$4,283',
  avgLatency: '932ms',
  successRate: '97.2%',
}

export const timeRanges = ['15m', '1h', '6h', '24h', '7d']

export const trafficSeries = Array.from({ length: 24 }).map((_, i) => ({
  time: `${i.toString().padStart(2, '0')}:00`,
  conversations: 120 + Math.round(Math.random() * 150) + (i > 14 ? 80 : 0),
  completions: 98 + Math.round(Math.random() * 110) + (i > 14 ? 60 : 0),
  errors: 6 + Math.round(Math.random() * 14),
  escalations: 8 + Math.round(Math.random() * 18),
}))

export const agentRows: AgentRow[] = [
  {
    id: 'support',
    name: 'Support Agent',
    status: 'healthy',
    traffic: '52.1k',
    latencyMs: 812,
    successRate: 98.1,
    healthScore: 94,
    costToday: 821,
    sparkline: [78, 80, 84, 83, 89, 91, 93, 94],
  },
  {
    id: 'sales',
    name: 'Sales Agent',
    status: 'watch',
    traffic: '36.8k',
    latencyMs: 1189,
    successRate: 94.3,
    healthScore: 81,
    costToday: 1182,
    sparkline: [91, 89, 86, 82, 78, 80, 79, 81],
  },
  {
    id: 'onboarding',
    name: 'Onboarding Agent',
    status: 'healthy',
    traffic: '24.6k',
    latencyMs: 904,
    successRate: 96.9,
    healthScore: 89,
    costToday: 644,
    sparkline: [72, 75, 78, 79, 82, 84, 87, 89],
  },
  {
    id: 'knowledge',
    name: 'Internal Knowledge Agent',
    status: 'watch',
    traffic: '18.9k',
    latencyMs: 1321,
    successRate: 92.4,
    healthScore: 76,
    costToday: 976,
    sparkline: [88, 84, 81, 79, 74, 72, 75, 76],
  },
  {
    id: 'billing',
    name: 'Billing Agent',
    status: 'critical',
    traffic: '10.3k',
    latencyMs: 1518,
    successRate: 90.2,
    healthScore: 64,
    costToday: 660,
    sparkline: [86, 82, 76, 70, 64, 62, 66, 64],
  },
]

export const traceRows: TraceRow[] = [
  {
    id: 'tr_91B2D1',
    timestamp: '14:59:51',
    agent: 'Support Agent',
    intent: 'Subscription cancellation',
    latency: '782ms',
    model: 'gpt-4.1',
    status: 'Success',
    cost: '$0.028',
    promptVersion: 'support-v21',
    toolCalls: 2,
    retrievedContext: '4 docs',
    evaluation: 'Grounded and complete',
    rootCause: 'N/A',
  },
  {
    id: 'tr_84C0AD',
    timestamp: '14:58:42',
    agent: 'Sales Agent',
    intent: 'Enterprise pricing breakdown',
    latency: '1.62s',
    model: 'gpt-4.1-mini',
    status: 'Warning',
    cost: '$0.041',
    promptVersion: 'sales-v14',
    toolCalls: 3,
    retrievedContext: '2 docs',
    evaluation: 'Low confidence at turn 3',
    rootCause: 'Likely prompt regression with discount logic',
  },
  {
    id: 'tr_6D0A71',
    timestamp: '14:56:11',
    agent: 'Billing Agent',
    intent: 'Invoice tax mismatch',
    latency: '2.11s',
    model: 'claude-3.7-sonnet',
    status: 'Escalated',
    cost: '$0.057',
    promptVersion: 'billing-v12',
    toolCalls: 4,
    retrievedContext: '0 docs',
    evaluation: 'Escalated to human',
    rootCause: 'Retriever timeout from billing index',
  },
  {
    id: 'tr_55122F',
    timestamp: '14:54:20',
    agent: 'Internal Knowledge Agent',
    intent: 'SAML setup policy',
    latency: '1.91s',
    model: 'gpt-4.1',
    status: 'Failed',
    cost: '$0.039',
    promptVersion: 'knowledge-v8',
    toolCalls: 2,
    retrievedContext: '1 doc',
    evaluation: 'Unsupported tool schema',
    rootCause: 'Tool invocation mismatch with v2 connector',
  },
]

export const incidents: Incident[] = [
  {
    id: 'inc_101',
    title: 'Latency spike detected in Sales Agent',
    severity: 'high',
    status: 'Investigating',
    timestamp: '14:47',
    details:
      'P95 moved from 980ms to 1.8s after prompt v14 rollout. Suggested rollback window is ready.',
  },
  {
    id: 'inc_102',
    title: 'Retrieval failure rate above baseline',
    severity: 'medium',
    status: 'Open',
    timestamp: '14:25',
    details:
      'Billing index reported 6.2% timeout rate over last hour. Correlated with increased escalations.',
  },
  {
    id: 'inc_103',
    title: 'Prompt v12 regression suspected',
    severity: 'medium',
    status: 'Mitigated',
    timestamp: '13:58',
    details: 'Auto-evals found higher hallucination risk. Feature-flag rollback reduced impact.',
  },
  {
    id: 'inc_104',
    title: 'Cost anomaly detected',
    severity: 'low',
    status: 'Open',
    timestamp: '13:31',
    details:
      'Fallback route is overusing premium model. Opportunity to shift low-risk sessions to cheaper tier.',
  },
]

export const qualityScores = [
  { name: 'Groundedness', score: 94, status: 'Excellent' },
  { name: 'Policy Compliance', score: 98, status: 'Excellent' },
  { name: 'Task Completion', score: 91, status: 'Excellent' },
  { name: 'Tone Consistency', score: 82, status: 'Watch' },
  { name: 'Hallucination Risk', score: 71, status: 'Needs Review' },
]

export const costBreakdown = [
  { name: 'Inference', value: 61 },
  { name: 'Retrieval', value: 14 },
  { name: 'Tooling', value: 9 },
  { name: 'Eval Runs', value: 16 },
]

export const spendTrend = [
  { day: 'Mon', spend: 2980, efficiency: 82 },
  { day: 'Tue', spend: 3110, efficiency: 85 },
  { day: 'Wed', spend: 3440, efficiency: 81 },
  { day: 'Thu', spend: 3820, efficiency: 78 },
  { day: 'Fri', spend: 4283, efficiency: 80 },
]

export const recommendedActions = [
  {
    title: 'Investigate Billing Agent retrieval failures',
    impact: 'High',
    owner: 'Platform Eng',
    priority: 'P1',
  },
  {
    title: 'Roll back Sales Agent prompt v14',
    impact: 'High',
    owner: 'Applied AI',
    priority: 'P1',
  },
  {
    title: 'Move low-risk traffic to cheaper model',
    impact: 'Medium',
    owner: 'FinOps',
    priority: 'P2',
  },
  {
    title: 'Review low confidence + high escalation sessions',
    impact: 'Medium',
    owner: 'QA',
    priority: 'P2',
  },
]
