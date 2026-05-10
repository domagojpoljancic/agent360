export type AgentStatus = 'Healthy' | 'Stable' | 'Degraded' | 'Critical'
export type FacingType = 'Customer' | 'Internal'

export type FleetMetric = {
  label: string
  value: string
  trend: 'up' | 'down' | 'flat'
  tone: 'healthy' | 'watch' | 'critical' | 'live'
  sparkline: number[]
  /** Optional subline for denser KPI cards (e.g. Cost Optimization overview). */
  secondary?: string
}

export type AgentOperationalRow = {
  id: string
  name: string
  facing: FacingType
  purpose: string
  status: AgentStatus
  traffic: string
  latencyP95: string
  errorRate: string
  availability: string
  toolFailures: string
  issue?: string
  model: string
  sparkline: number[]
  healthScore: number
  summary: {
    requestsPerMin: string
    p95Latency: string
    uptime: string
    retries: string
    incidents: string
  }
  dependencies: string[]
  events: string[]
  recommendations: string[]
}

export type ProviderHealth = {
  id: string
  provider: string
  model: string
  avgLatency: string
  p95Latency: string
  timeoutRate: string
  availability: string
  requestThroughput: string
  errorRate: string
  status: AgentStatus
  badge?: 'Fastest' | 'Stable' | 'Watch' | 'Degraded'
  lowLatencyRecommended?: boolean
  sparkline: number[]
  detail: {
    avgLatencyTrend: number[]
    p95LatencyTrend: number[]
    retries: string
    failedRequests: string
    streamingStartDelay: string
    providerHealth: string
    regionalInsight: string
    runtimeBreakdown: {
      network: string
      providerProcessing: string
      retrievalOverhead: string
      toolOverhead: string
    }
    incidents: string[]
  }
}

export type RetrievalMetric = {
  label: string
  value: string
  tone?: 'healthy' | 'watch' | 'critical' | 'neutral'
}

export type KnowledgeSourceRow = {
  id: string
  source: string
  availability: string
  avgLatency: string
  timeoutRate: string
  lastSync: string
  status: 'Healthy' | 'Degraded' | 'Syncing'
  trend: number[]
  detail: {
    queueDepth: string
    indexDelay: string
    syncStatus: string
    vectorAvailability: string
  }
}

export type ApiRuntimeIncidentSeverity = 'Critical' | 'Warning' | 'Info'

export type ApiRuntimeIncidentStatus = 'Active' | 'Monitoring' | 'Resolved'

export type ApiRuntimeIncident = {
  id: string
  severity: ApiRuntimeIncidentSeverity
  apiName: string
  title: string
  /** One-line operational note for compact incident strips. */
  shortNote: string
  timestamp: string
  status: ApiRuntimeIncidentStatus
}

export type ApiToolRuntimeRow = {
  id: string
  name: string
  provider: string
  availability: string
  avgLatency: string
  p95Latency: string
  errorRate: string
  timeoutRate: string
  retryRate: string
  rateLimitEvents: string
  schemaFailures: string
  authFailures: string
  toolExecFailureRate: string
  status: AgentStatus
  sparkline: number[]
  lastIncident: string
  detail: {
    latencyTrend: number[]
    p95Trend: number[]
    retryTrend: number[]
    failureTrend: number[]
    recentIncidents: string[]
    dependencyInsights: string[]
    recommendations: string[]
    circuitBreaker: string
    cachedResponseUsage: string
    queueBackpressure: string
    fallbackExecutionRate: string
  }
}

/** Compact dashboard signals for the main Operational Health API strip (not the full API Overview page). */
export type ApiRuntimeOverview = {
  trafficSeries: number[]
  peakTrafficLabel: string
  retryTrafficShare: string
  fallbackShare: string
  toolAvgExec: string
  toolFailedExec: string
  toolRetryAmp: string
  /** Tool-call success rate across agent tool executions (rolling window). */
  toolSuccessRate: string
  toolSuccessfulCalls: string
  toolFailedCallsCount: string
  /** Share of categorized API failures (approximate mix for agent dependency calls). */
  errorMix: {
    clientErrorsPct: string
    serverErrorsPct: string
    timeoutPct: string
    schemaPct: string
  }
  rateLimit: {
    throttledShare: string
    apisNearLimitLabel: string
  }
  insightsTicker: string[]
}

export const timeRanges = ['1h', '24h', '7d'] as const
export type TimeRange = (typeof timeRanges)[number]

const fleetRows24h: AgentOperationalRow[] = [
  {
    id: 'shopping-concierge',
    name: 'Shopping Concierge Agent',
    facing: 'Customer',
    purpose: 'Helps customers discover, compare, and choose products.',
    status: 'Stable',
    traffic: '3.6k rpm',
    latencyP95: '1.5s',
    errorRate: '0.5%',
    availability: '99.97%',
    toolFailures: '0.9%',
    model: 'GPT-4o',
    sparkline: [42, 45, 43, 47, 49, 50, 52],
    healthScore: 93,
    summary: {
      requestsPerMin: '3,612',
      p95Latency: '1.5s',
      uptime: '99.97%',
      retries: '2.4%',
      incidents: '1 warning / 24h',
    },
    dependencies: ['OpenAI GPT-4o', 'Shopify API', 'Vector DB', 'CRM Escalation'],
    events: [
      'Recommendation latency normalized after cache warmup.',
      'Search reranker timeout rate dropped 12% after prompt trim.',
    ],
    recommendations: [
      'Route low-intent browse flows to Claude Sonnet to reduce OpenAI pressure.',
      'Increase product embedding cache TTL during traffic spikes.',
    ],
  },
  {
    id: 'product-qa',
    name: 'Product Q&A Agent',
    facing: 'Customer',
    purpose: 'Answers product-specific questions using catalog, reviews, and policies.',
    status: 'Degraded',
    traffic: '2.9k rpm',
    latencyP95: '2.4s',
    errorRate: '1.2%',
    availability: '99.81%',
    toolFailures: '2.6%',
    issue: 'Retrieval timeout',
    model: 'GPT-4o',
    sparkline: [35, 37, 40, 43, 47, 44, 48],
    healthScore: 84,
    summary: {
      requestsPerMin: '2,931',
      p95Latency: '2.4s',
      uptime: '99.81%',
      retries: '5.8%',
      incidents: '1 active',
    },
    dependencies: ['OpenAI GPT-4o', 'Vector DB', 'Policy Service', 'Human Escalation'],
    events: [
      'Latency increased 34% after provider retry spike.',
      'Retrieval timeouts crossed threshold for long-tail SKU questions.',
    ],
    recommendations: [
      'Increase retrieval timeout budget by 300ms for policy namespace.',
      'Enable fallback response template for no-context retrieval misses.',
    ],
  },
  {
    id: 'order-delivery',
    name: 'Order & Delivery Agent',
    facing: 'Customer',
    purpose: 'Handles order status, delivery updates, and shipping issues.',
    status: 'Degraded',
    traffic: '2.1k rpm',
    latencyP95: '2.1s',
    errorRate: '1.7%',
    availability: '99.72%',
    toolFailures: '4.4%',
    issue: 'Delivery API timeout',
    model: 'Claude Sonnet',
    sparkline: [55, 52, 58, 63, 69, 67, 71],
    healthScore: 78,
    summary: {
      requestsPerMin: '2,143',
      p95Latency: '2.1s',
      uptime: '99.72%',
      retries: '8.3%',
      incidents: '1 critical / active',
    },
    dependencies: ['Claude Sonnet', 'Delivery API', 'Order Service', 'CRM'],
    events: [
      'Delivery API timeout threshold exceeded in EU warehouse region.',
      'Fallback carrier endpoint activated for 27% of requests.',
    ],
    recommendations: [
      'Enable circuit breaker for Delivery API read timeouts.',
      'Shift shipment ETA intents to cached status responses for 20 minutes.',
    ],
  },
  {
    id: 'returns-refunds',
    name: 'Returns & Refunds Agent',
    facing: 'Customer',
    purpose: 'Helps users return products, check refund status, and understand policies.',
    status: 'Healthy',
    traffic: '1.6k rpm',
    latencyP95: '1.3s',
    errorRate: '0.6%',
    availability: '99.96%',
    toolFailures: '0.7%',
    model: 'Claude Sonnet',
    sparkline: [40, 42, 41, 44, 46, 48, 47],
    healthScore: 95,
    summary: {
      requestsPerMin: '1,608',
      p95Latency: '1.3s',
      uptime: '99.96%',
      retries: '1.8%',
      incidents: 'Recovery event only',
    },
    dependencies: ['Claude Sonnet', 'Policy API', 'Returns API', 'Escalation Queue'],
    events: [
      'Returns Agent recovered successfully after policy schema rollback.',
      'Refund status endpoint now stable for 6h.',
    ],
    recommendations: [
      'Add schema contract test between Policy API and Returns workflows.',
      'Keep current routing ratio; no provider saturation risk.',
    ],
  },
  {
    id: 'support-copilot',
    name: 'Customer Support Copilot',
    facing: 'Internal',
    purpose: 'Helps support agents summarize cases and draft replies.',
    status: 'Healthy',
    traffic: '1.8k rpm',
    latencyP95: '1.1s',
    errorRate: '0.4%',
    availability: '99.99%',
    toolFailures: '0.4%',
    model: 'Gemini Pro',
    sparkline: [46, 45, 47, 49, 50, 49, 51],
    healthScore: 97,
    summary: {
      requestsPerMin: '1,821',
      p95Latency: '1.1s',
      uptime: '99.99%',
      retries: '1.2%',
      incidents: '0 active',
    },
    dependencies: ['Gemini Pro', 'CRM', 'Ticket API', 'Knowledge Base'],
    events: [
      'Copilot summary path remained under 1.2s for entire day.',
      'No escalation anomalies detected.',
    ],
    recommendations: [
      'Use this agent as overflow target for low-risk conversational intents.',
      'Enable proactive context prefetch for high-tier support queues.',
    ],
  },
  {
    id: 'merch-insights',
    name: 'Merchandising Insights Agent',
    facing: 'Internal',
    purpose: 'Helps category teams analyze reviews, complaints, and product gaps.',
    status: 'Stable',
    traffic: '1.0k rpm',
    latencyP95: '1.9s',
    errorRate: '0.9%',
    availability: '99.89%',
    toolFailures: '1.8%',
    issue: 'Rate-limit watch',
    model: 'GPT-4o',
    sparkline: [31, 33, 35, 37, 39, 38, 40],
    healthScore: 89,
    summary: {
      requestsPerMin: '994',
      p95Latency: '1.9s',
      uptime: '99.89%',
      retries: '4.1%',
      incidents: 'Watch signal',
    },
    dependencies: ['OpenAI GPT-4o', 'Reviews API', 'Vector DB', 'BI Export'],
    events: [
      'Anthropic fallback disabled after route quality dip.',
      'Provider rate-limit headroom narrowed during category sync job.',
    ],
    recommendations: [
      'Batch long review synthesis jobs in low-traffic window.',
      'Route exploratory prompts to Gemini for cost and rate-limit relief.',
    ],
  },
  {
    id: 'inventory-fulfillment',
    name: 'Inventory & Fulfillment Agent',
    facing: 'Internal',
    purpose: 'Helps ops teams understand stockouts, delivery delays, and warehouse issues.',
    status: 'Stable',
    traffic: '1.2k rpm',
    latencyP95: '2.2s',
    errorRate: '1.1%',
    availability: '99.85%',
    toolFailures: '3.1%',
    issue: 'Inventory retries',
    model: 'Gemini Pro',
    sparkline: [38, 41, 43, 45, 49, 52, 54],
    healthScore: 86,
    summary: {
      requestsPerMin: '1,182',
      p95Latency: '2.2s',
      uptime: '99.85%',
      retries: '7.1%',
      incidents: '1 warning / active',
    },
    dependencies: ['Gemini Pro', 'Inventory API', 'Warehouse API', 'Human Escalation'],
    events: [
      'Inventory sync retries increased after warehouse service deploy.',
      'Queue depth recovered but retry budget remains elevated.',
    ],
    recommendations: [
      'Cache inventory requests for low-volatility SKUs.',
      'Enable fallback read replica for Inventory API during deploy windows.',
    ],
  },
]

const providerHealthRows24h: ProviderHealth[] = [
  {
    id: 'gpt-4o',
    provider: 'OpenAI',
    model: 'GPT-4o',
    avgLatency: '1.2s',
    p95Latency: '2.1s',
    timeoutRate: '1.3%',
    availability: '99.92%',
    requestThroughput: '8.1k rpm',
    errorRate: '0.8%',
    status: 'Stable',
    badge: 'Stable',
    lowLatencyRecommended: true,
    sparkline: [31, 33, 34, 35, 36, 34, 33],
    detail: {
      avgLatencyTrend: [1.3, 1.25, 1.22, 1.18, 1.2, 1.19, 1.2],
      p95LatencyTrend: [2.3, 2.25, 2.15, 2.08, 2.12, 2.1, 2.1],
      retries: '2.1%',
      failedRequests: '0.6%',
      streamingStartDelay: '220ms',
      providerHealth: 'Healthy',
      regionalInsight: 'Higher latency observed in EU-West during peak hour.',
      runtimeBreakdown: {
        network: '160ms',
        providerProcessing: '710ms',
        retrievalOverhead: '210ms',
        toolOverhead: '120ms',
      },
      incidents: ['Latency degradation detected in EU-West edge.', 'Elevated retry rate resolved after failover.'],
    },
  },
  {
    id: 'gpt-4-turbo',
    provider: 'OpenAI',
    model: 'GPT-4 Turbo',
    avgLatency: '1.6s',
    p95Latency: '2.8s',
    timeoutRate: '1.7%',
    availability: '99.87%',
    requestThroughput: '4.2k rpm',
    errorRate: '1.0%',
    status: 'Stable',
    badge: 'Watch',
    sparkline: [36, 37, 39, 40, 42, 40, 41],
    detail: {
      avgLatencyTrend: [1.7, 1.68, 1.63, 1.59, 1.6, 1.61, 1.6],
      p95LatencyTrend: [2.9, 2.85, 2.8, 2.75, 2.78, 2.8, 2.8],
      retries: '2.8%',
      failedRequests: '0.9%',
      streamingStartDelay: '280ms',
      providerHealth: 'Stable',
      regionalInsight: 'Slightly slower first-token response in APAC.',
      runtimeBreakdown: {
        network: '180ms',
        providerProcessing: '940ms',
        retrievalOverhead: '260ms',
        toolOverhead: '130ms',
      },
      incidents: ['Provider timeout spike during deploy window.'],
    },
  },
  {
    id: 'gpt-4.1',
    provider: 'OpenAI',
    model: 'GPT-4.1',
    avgLatency: '1.4s',
    p95Latency: '2.4s',
    timeoutRate: '1.4%',
    availability: '99.90%',
    requestThroughput: '5.0k rpm',
    errorRate: '0.9%',
    status: 'Stable',
    badge: 'Stable',
    sparkline: [33, 34, 35, 36, 37, 36, 35],
    detail: {
      avgLatencyTrend: [1.45, 1.43, 1.41, 1.39, 1.4, 1.4, 1.4],
      p95LatencyTrend: [2.5, 2.45, 2.4, 2.35, 2.38, 2.4, 2.4],
      retries: '2.3%',
      failedRequests: '0.7%',
      streamingStartDelay: '240ms',
      providerHealth: 'Healthy',
      regionalInsight: 'Latency stable across US and EU regions.',
      runtimeBreakdown: {
        network: '170ms',
        providerProcessing: '820ms',
        retrievalOverhead: '250ms',
        toolOverhead: '120ms',
      },
      incidents: ['Minor p95 increase after provider routing update.'],
    },
  },
  {
    id: 'gpt-4o-mini',
    provider: 'OpenAI',
    model: 'GPT-4o-mini',
    avgLatency: '0.9s',
    p95Latency: '1.5s',
    timeoutRate: '0.8%',
    availability: '99.95%',
    requestThroughput: '9.4k rpm',
    errorRate: '0.5%',
    status: 'Healthy',
    badge: 'Fastest',
    lowLatencyRecommended: true,
    sparkline: [24, 23, 24, 25, 24, 23, 24],
    detail: {
      avgLatencyTrend: [0.92, 0.9, 0.89, 0.88, 0.9, 0.9, 0.9],
      p95LatencyTrend: [1.6, 1.55, 1.5, 1.48, 1.5, 1.5, 1.5],
      retries: '1.1%',
      failedRequests: '0.3%',
      streamingStartDelay: '140ms',
      providerHealth: 'Healthy',
      regionalInsight: 'Consistent response times across all active regions.',
      runtimeBreakdown: {
        network: '140ms',
        providerProcessing: '430ms',
        retrievalOverhead: '210ms',
        toolOverhead: '80ms',
      },
      incidents: ['No critical incidents in selected window.'],
    },
  },
  {
    id: 'gpt-3.5-turbo',
    provider: 'OpenAI',
    model: 'GPT-3.5 Turbo',
    avgLatency: '0.95s',
    p95Latency: '1.7s',
    timeoutRate: '1.0%',
    availability: '99.93%',
    requestThroughput: '6.8k rpm',
    errorRate: '0.7%',
    status: 'Healthy',
    badge: 'Stable',
    sparkline: [26, 27, 28, 27, 28, 29, 28],
    detail: {
      avgLatencyTrend: [0.98, 0.96, 0.95, 0.94, 0.95, 0.95, 0.95],
      p95LatencyTrend: [1.8, 1.75, 1.7, 1.68, 1.7, 1.7, 1.7],
      retries: '1.6%',
      failedRequests: '0.4%',
      streamingStartDelay: '150ms',
      providerHealth: 'Stable',
      regionalInsight: 'Occasional jitter in South America region.',
      runtimeBreakdown: {
        network: '150ms',
        providerProcessing: '460ms',
        retrievalOverhead: '250ms',
        toolOverhead: '90ms',
      },
      incidents: ['Streaming delay increased after provider update.'],
    },
  },
  {
    id: 'claude-3-opus',
    provider: 'Anthropic',
    model: 'Claude 3 Opus',
    avgLatency: '2.8s',
    p95Latency: '4.6s',
    timeoutRate: '3.2%',
    availability: '99.71%',
    requestThroughput: '1.9k rpm',
    errorRate: '1.8%',
    status: 'Degraded',
    badge: 'Degraded',
    sparkline: [58, 60, 63, 67, 65, 68, 70],
    detail: {
      avgLatencyTrend: [2.5, 2.6, 2.7, 2.9, 2.8, 2.85, 2.8],
      p95LatencyTrend: [4.2, 4.3, 4.4, 4.7, 4.5, 4.6, 4.6],
      retries: '4.6%',
      failedRequests: '1.5%',
      streamingStartDelay: '520ms',
      providerHealth: 'Degraded',
      regionalInsight: 'Anthropic API degradation detected in EU-West.',
      runtimeBreakdown: {
        network: '220ms',
        providerProcessing: '1960ms',
        retrievalOverhead: '420ms',
        toolOverhead: '200ms',
      },
      incidents: ['Provider timeout spike', 'Latency degradation detected'],
    },
  },
  {
    id: 'claude-3-sonnet',
    provider: 'Anthropic',
    model: 'Claude 3 Sonnet',
    avgLatency: '1.7s',
    p95Latency: '2.9s',
    timeoutRate: '1.9%',
    availability: '99.85%',
    requestThroughput: '3.4k rpm',
    errorRate: '1.0%',
    status: 'Stable',
    badge: 'Stable',
    sparkline: [39, 40, 41, 43, 42, 43, 44],
    detail: {
      avgLatencyTrend: [1.8, 1.75, 1.72, 1.7, 1.71, 1.7, 1.7],
      p95LatencyTrend: [3.0, 2.95, 2.9, 2.85, 2.88, 2.9, 2.9],
      retries: '2.9%',
      failedRequests: '0.8%',
      streamingStartDelay: '300ms',
      providerHealth: 'Stable',
      regionalInsight: 'Higher latency observed in EU-West.',
      runtimeBreakdown: {
        network: '190ms',
        providerProcessing: '980ms',
        retrievalOverhead: '360ms',
        toolOverhead: '140ms',
      },
      incidents: ['Elevated retry rate during morning traffic peak.'],
    },
  },
  {
    id: 'claude-3-haiku',
    provider: 'Anthropic',
    model: 'Claude 3 Haiku',
    avgLatency: '1.0s',
    p95Latency: '1.8s',
    timeoutRate: '0.9%',
    availability: '99.93%',
    requestThroughput: '4.8k rpm',
    errorRate: '0.6%',
    status: 'Healthy',
    badge: 'Fastest',
    lowLatencyRecommended: true,
    sparkline: [27, 26, 27, 28, 29, 27, 26],
    detail: {
      avgLatencyTrend: [1.05, 1.03, 1.0, 0.99, 1.0, 1.0, 1.0],
      p95LatencyTrend: [1.9, 1.85, 1.8, 1.78, 1.8, 1.8, 1.8],
      retries: '1.4%',
      failedRequests: '0.4%',
      streamingStartDelay: '170ms',
      providerHealth: 'Healthy',
      regionalInsight: 'Balanced latency in all active geos.',
      runtimeBreakdown: {
        network: '150ms',
        providerProcessing: '520ms',
        retrievalOverhead: '230ms',
        toolOverhead: '100ms',
      },
      incidents: ['No significant incidents in selected window.'],
    },
  },
  {
    id: 'gemini-1-5-pro',
    provider: 'Google',
    model: 'Gemini 1.5 Pro',
    avgLatency: '1.9s',
    p95Latency: '3.2s',
    timeoutRate: '2.1%',
    availability: '99.82%',
    requestThroughput: '2.7k rpm',
    errorRate: '1.1%',
    status: 'Stable',
    badge: 'Watch',
    sparkline: [42, 43, 44, 46, 45, 47, 46],
    detail: {
      avgLatencyTrend: [2.0, 1.98, 1.95, 1.9, 1.92, 1.9, 1.9],
      p95LatencyTrend: [3.3, 3.25, 3.2, 3.15, 3.18, 3.2, 3.2],
      retries: '3.1%',
      failedRequests: '0.9%',
      streamingStartDelay: '340ms',
      providerHealth: 'Stable',
      regionalInsight: 'Latency spikes observed during index refresh windows.',
      runtimeBreakdown: {
        network: '200ms',
        providerProcessing: '1070ms',
        retrievalOverhead: '430ms',
        toolOverhead: '160ms',
      },
      incidents: ['Latency spike detected in us-central routing cluster.'],
    },
  },
  {
    id: 'gemini-1-5-flash',
    provider: 'Google',
    model: 'Gemini 1.5 Flash',
    avgLatency: '0.8s',
    p95Latency: '1.4s',
    timeoutRate: '0.7%',
    availability: '99.96%',
    requestThroughput: '7.2k rpm',
    errorRate: '0.5%',
    status: 'Healthy',
    badge: 'Fastest',
    lowLatencyRecommended: true,
    sparkline: [21, 22, 23, 24, 23, 22, 21],
    detail: {
      avgLatencyTrend: [0.85, 0.83, 0.82, 0.8, 0.81, 0.8, 0.8],
      p95LatencyTrend: [1.5, 1.45, 1.42, 1.4, 1.41, 1.4, 1.4],
      retries: '1.0%',
      failedRequests: '0.3%',
      streamingStartDelay: '130ms',
      providerHealth: 'Healthy',
      regionalInsight: 'Lowest latency in APAC and EU edge clusters.',
      runtimeBreakdown: {
        network: '130ms',
        providerProcessing: '360ms',
        retrievalOverhead: '220ms',
        toolOverhead: '90ms',
      },
      incidents: ['Brief timeout increase auto-recovered.'],
    },
  },
]

const retrievalMetrics24h: RetrievalMetric[] = [
  { label: 'Retrieval Success Rate', value: '98.1%', tone: 'healthy' },
  { label: 'Avg Retrieval Latency', value: '420ms', tone: 'watch' },
  { label: 'Retrieval Timeout Rate', value: '1.4%', tone: 'watch' },
  { label: 'No-Context Returned Rate', value: '3.8%', tone: 'watch' },
  { label: 'Retrieval Error Rate', value: '0.9%', tone: 'healthy' },
  { label: 'Vector Search Availability', value: '99.92%', tone: 'healthy' },
  { label: 'Knowledge Source Sync Status', value: '4/5 Healthy', tone: 'watch' },
  { label: 'Index Refresh Delay', value: '14m', tone: 'watch' },
  { label: 'Retrieval Queue Depth', value: '37', tone: 'neutral' },
]

const knowledgeSources24h: KnowledgeSourceRow[] = [
  {
    id: 'help-center',
    source: 'Help Center',
    availability: '99.95%',
    avgLatency: '390ms',
    timeoutRate: '1.1%',
    lastSync: '3m ago',
    status: 'Healthy',
    trend: [35, 33, 34, 32, 31, 30, 29],
    detail: {
      queueDepth: '11',
      indexDelay: '2m',
      syncStatus: 'On schedule',
      vectorAvailability: '99.97%',
    },
  },
  {
    id: 'product-docs',
    source: 'Product Docs',
    availability: '99.90%',
    avgLatency: '430ms',
    timeoutRate: '1.5%',
    lastSync: '14m ago',
    status: 'Syncing',
    trend: [30, 32, 34, 35, 37, 39, 38],
    detail: {
      queueDepth: '24',
      indexDelay: '14m',
      syncStatus: 'Backfill running',
      vectorAvailability: '99.92%',
    },
  },
  {
    id: 'billing-policies',
    source: 'Billing Policies',
    availability: '99.97%',
    avgLatency: '360ms',
    timeoutRate: '0.8%',
    lastSync: '5m ago',
    status: 'Healthy',
    trend: [28, 27, 29, 28, 27, 26, 26],
    detail: {
      queueDepth: '9',
      indexDelay: '1m',
      syncStatus: 'Healthy',
      vectorAvailability: '99.99%',
    },
  },
  {
    id: 'internal-wiki',
    source: 'Internal Wiki',
    availability: '99.88%',
    avgLatency: '470ms',
    timeoutRate: '1.9%',
    lastSync: '9m ago',
    status: 'Degraded',
    trend: [37, 38, 40, 42, 43, 41, 44],
    detail: {
      queueDepth: '29',
      indexDelay: '9m',
      syncStatus: 'Partial lag',
      vectorAvailability: '99.84%',
    },
  },
  {
    id: 'crm-kb',
    source: 'CRM Knowledge Base',
    availability: '99.72%',
    avgLatency: '560ms',
    timeoutRate: '3.4%',
    lastSync: '22m ago',
    status: 'Degraded',
    trend: [42, 45, 48, 51, 49, 54, 56],
    detail: {
      queueDepth: '41',
      indexDelay: '22m',
      syncStatus: 'Connection instability',
      vectorAvailability: '99.76%',
    },
  },
]

const apiToolRuntimeRows24h: ApiToolRuntimeRow[] = [
  {
    id: 'salesforce',
    name: 'Salesforce API',
    provider: 'Salesforce',
    availability: '99.94%',
    avgLatency: '240ms',
    p95Latency: '520ms',
    errorRate: '0.4%',
    timeoutRate: '0.6%',
    retryRate: '1.8%',
    rateLimitEvents: '12/h',
    schemaFailures: '0.02%',
    authFailures: '0.05%',
    toolExecFailureRate: '0.3%',
    status: 'Stable',
    sparkline: [38, 40, 39, 42, 44, 43, 45],
    lastIncident: '2h ago',
    detail: {
      latencyTrend: [260, 250, 245, 240, 242, 238, 240],
      p95Trend: [540, 530, 525, 520, 518, 522, 520],
      retryTrend: [2.1, 2.0, 1.9, 1.8, 1.85, 1.8, 1.8],
      failureTrend: [0.5, 0.48, 0.45, 0.42, 0.41, 0.4, 0.4],
      recentIncidents: ['Minor latency bump during org sync window.', 'No active outages.'],
      dependencyInsights: [
        'Primary dependency for Support Copilot ticket enrichment.',
        'Used by 4 production workflows.',
        'Peak traffic between 09:00–12:00 UTC.',
      ],
      recommendations: [
        'Enable response caching for low-volatility read endpoints.',
        'Monitor composite API batch sizes during morning peaks.',
      ],
      circuitBreaker: '0 activations / 24h',
      cachedResponseUsage: '18%',
      queueBackpressure: 'Low',
      fallbackExecutionRate: '1.1%',
    },
  },
  {
    id: 'zendesk',
    name: 'Zendesk API',
    provider: 'Zendesk',
    availability: '99.78%',
    avgLatency: '310ms',
    p95Latency: '780ms',
    errorRate: '1.1%',
    timeoutRate: '2.4%',
    retryRate: '4.2%',
    rateLimitEvents: '28/h',
    schemaFailures: '0.08%',
    authFailures: '0.12%',
    toolExecFailureRate: '0.9%',
    status: 'Degraded',
    sparkline: [42, 48, 52, 58, 55, 60, 62],
    lastIncident: '18m ago',
    detail: {
      latencyTrend: [280, 290, 300, 310, 315, 308, 310],
      p95Trend: [620, 680, 720, 760, 780, 775, 780],
      retryTrend: [3.2, 3.5, 3.8, 4.0, 4.1, 4.15, 4.2],
      failureTrend: [0.8, 0.9, 1.0, 1.05, 1.08, 1.1, 1.1],
      recentIncidents: ['Timeout spike detected during EU peak.', 'Elevated 503 responses on ticket search.'],
      dependencyInsights: [
        'Feeds customer support escalation and macro tools.',
        'Shared across Support Copilot and Returns workflows.',
      ],
      recommendations: [
        'Increase retry backoff for search endpoints under load.',
        'Shard ticket lookups by region to reduce tail latency.',
      ],
      circuitBreaker: '2 activations / 24h',
      cachedResponseUsage: '9%',
      queueBackpressure: 'Medium',
      fallbackExecutionRate: '3.4%',
    },
  },
  {
    id: 'jira',
    name: 'Jira API',
    provider: 'Atlassian',
    availability: '99.91%',
    avgLatency: '275ms',
    p95Latency: '590ms',
    errorRate: '0.5%',
    timeoutRate: '0.9%',
    retryRate: '2.1%',
    rateLimitEvents: '8/h',
    schemaFailures: '0.04%',
    authFailures: '0.06%',
    toolExecFailureRate: '0.4%',
    status: 'Healthy',
    sparkline: [33, 34, 33, 35, 36, 35, 36],
    lastIncident: '6h ago',
    detail: {
      latencyTrend: [290, 285, 280, 278, 276, 275, 275],
      p95Trend: [610, 600, 595, 592, 590, 591, 590],
      retryTrend: [2.4, 2.3, 2.25, 2.2, 2.15, 2.1, 2.1],
      failureTrend: [0.55, 0.52, 0.51, 0.5, 0.5, 0.5, 0.5],
      recentIncidents: ['Brief rate-limit advisory cleared automatically.'],
      dependencyInsights: ['Used by internal ops agents for issue linking.', 'Low overnight traffic.'],
      recommendations: ['Keep JQL queries scoped; avoid unbounded project scans.'],
      circuitBreaker: '0 activations / 24h',
      cachedResponseUsage: '22%',
      queueBackpressure: 'Low',
      fallbackExecutionRate: '0.8%',
    },
  },
  {
    id: 'slack',
    name: 'Slack API',
    provider: 'Slack',
    availability: '99.89%',
    avgLatency: '195ms',
    p95Latency: '440ms',
    errorRate: '0.6%',
    timeoutRate: '0.7%',
    retryRate: '2.6%',
    rateLimitEvents: '44/h',
    schemaFailures: '0.01%',
    authFailures: '0.03%',
    toolExecFailureRate: '0.35%',
    status: 'Stable',
    sparkline: [28, 30, 31, 32, 31, 33, 32],
    lastIncident: '1h ago',
    detail: {
      latencyTrend: [210, 205, 200, 198, 196, 195, 195],
      p95Trend: [470, 460, 450, 445, 442, 440, 440],
      retryTrend: [2.9, 2.8, 2.75, 2.7, 2.65, 2.6, 2.6],
      failureTrend: [0.65, 0.63, 0.62, 0.61, 0.6, 0.6, 0.6],
      recentIncidents: ['Rate limiting observed during peak traffic.'],
      dependencyInsights: ['Notifications and internal handoff automation.', 'Bursty traffic aligns with business hours.'],
      recommendations: ['Batch postMessage calls; respect tier-2 rate headers.'],
      circuitBreaker: '0 activations / 24h',
      cachedResponseUsage: '14%',
      queueBackpressure: 'Low',
      fallbackExecutionRate: '1.6%',
    },
  },
  {
    id: 'stripe',
    name: 'Stripe API',
    provider: 'Stripe',
    availability: '99.99%',
    avgLatency: '180ms',
    p95Latency: '380ms',
    errorRate: '0.2%',
    timeoutRate: '0.25%',
    retryRate: '0.9%',
    rateLimitEvents: '3/h',
    schemaFailures: '0.01%',
    authFailures: '0.02%',
    toolExecFailureRate: '0.15%',
    status: 'Healthy',
    sparkline: [22, 23, 22, 24, 23, 24, 23],
    lastIncident: '1d ago',
    detail: {
      latencyTrend: [190, 186, 184, 182, 181, 180, 180],
      p95Trend: [400, 392, 388, 385, 382, 380, 380],
      retryTrend: [1.1, 1.05, 1.0, 0.95, 0.92, 0.9, 0.9],
      failureTrend: [0.25, 0.23, 0.22, 0.21, 0.2, 0.2, 0.2],
      recentIncidents: ['No material incidents in window.'],
      dependencyInsights: ['Critical path for billing and refund tools.', 'Strict idempotency requirements.'],
      recommendations: ['Increase retry backoff for Stripe API on 429 responses.'],
      circuitBreaker: '0 activations / 24h',
      cachedResponseUsage: '6%',
      queueBackpressure: 'Low',
      fallbackExecutionRate: '0.2%',
    },
  },
  {
    id: 'hubspot',
    name: 'HubSpot API',
    provider: 'HubSpot',
    availability: '99.86%',
    avgLatency: '265ms',
    p95Latency: '610ms',
    errorRate: '0.7%',
    timeoutRate: '1.1%',
    retryRate: '2.9%',
    rateLimitEvents: '19/h',
    schemaFailures: '0.05%',
    authFailures: '0.09%',
    toolExecFailureRate: '0.5%',
    status: 'Stable',
    sparkline: [35, 36, 37, 38, 37, 39, 38],
    lastIncident: '3h ago',
    detail: {
      latencyTrend: [280, 275, 270, 268, 266, 265, 265],
      p95Trend: [640, 630, 620, 615, 612, 610, 610],
      retryTrend: [3.1, 3.05, 3.0, 2.95, 2.92, 2.9, 2.9],
      failureTrend: [0.72, 0.7, 0.69, 0.68, 0.7, 0.7, 0.7],
      recentIncidents: ['Transient 502s during provider maintenance window.'],
      dependencyInsights: ['Marketing and lead context for concierge flows.'],
      recommendations: ['Cache contact property reads where TTL allows.'],
      circuitBreaker: '0 activations / 24h',
      cachedResponseUsage: '16%',
      queueBackpressure: 'Low',
      fallbackExecutionRate: '1.4%',
    },
  },
  {
    id: 'servicenow',
    name: 'ServiceNow API',
    provider: 'ServiceNow',
    availability: '99.72%',
    avgLatency: '340ms',
    p95Latency: '820ms',
    errorRate: '1.2%',
    timeoutRate: '1.8%',
    retryRate: '3.6%',
    rateLimitEvents: '15/h',
    schemaFailures: '0.11%',
    authFailures: '0.4%',
    toolExecFailureRate: '0.85%',
    status: 'Degraded',
    sparkline: [45, 48, 52, 54, 56, 55, 57],
    lastIncident: '32m ago',
    detail: {
      latencyTrend: [320, 328, 332, 336, 340, 338, 340],
      p95Trend: [760, 780, 800, 810, 820, 818, 820],
      retryTrend: [3.0, 3.2, 3.3, 3.4, 3.5, 3.55, 3.6],
      failureTrend: [1.05, 1.1, 1.12, 1.15, 1.18, 1.2, 1.2],
      recentIncidents: ['Auth token expired — refreshed via rotation job.', 'Table API latency elevated in EU instance.'],
      dependencyInsights: ['ITSM bridge for internal escalation tooling.'],
      recommendations: ['Shorten OAuth refresh interval for high-QPS integrations.'],
      circuitBreaker: '1 activation / 24h',
      cachedResponseUsage: '11%',
      queueBackpressure: 'Medium',
      fallbackExecutionRate: '2.8%',
    },
  },
  {
    id: 'confluence',
    name: 'Confluence API',
    provider: 'Atlassian',
    availability: '99.90%',
    avgLatency: '290ms',
    p95Latency: '640ms',
    errorRate: '0.55%',
    timeoutRate: '0.85%',
    retryRate: '2.2%',
    rateLimitEvents: '10/h',
    schemaFailures: '0.06%',
    authFailures: '0.07%',
    toolExecFailureRate: '0.38%',
    status: 'Healthy',
    sparkline: [30, 31, 30, 32, 33, 32, 33],
    lastIncident: '5h ago',
    detail: {
      latencyTrend: [305, 300, 296, 292, 290, 291, 290],
      p95Trend: [660, 655, 650, 645, 642, 640, 640],
      retryTrend: [2.4, 2.35, 2.3, 2.25, 2.22, 2.2, 2.2],
      failureTrend: [0.58, 0.57, 0.56, 0.55, 0.55, 0.55, 0.55],
      recentIncidents: ['No user-facing outages.'],
      dependencyInsights: ['Internal wiki retrieval for policy agents.'],
      recommendations: ['Prefer CQL-scoped queries to reduce payload size.'],
      circuitBreaker: '0 activations / 24h',
      cachedResponseUsage: '20%',
      queueBackpressure: 'Low',
      fallbackExecutionRate: '1.0%',
    },
  },
  {
    id: 'notion',
    name: 'Notion API',
    provider: 'Notion',
    availability: '99.84%',
    avgLatency: '320ms',
    p95Latency: '710ms',
    errorRate: '0.8%',
    timeoutRate: '1.3%',
    retryRate: '3.1%',
    rateLimitEvents: '22/h',
    schemaFailures: '0.07%',
    authFailures: '0.1%',
    toolExecFailureRate: '0.55%',
    status: 'Stable',
    sparkline: [36, 37, 38, 39, 38, 40, 39],
    lastIncident: '4h ago',
    detail: {
      latencyTrend: [335, 330, 326, 322, 320, 321, 320],
      p95Trend: [730, 720, 715, 712, 710, 711, 710],
      retryTrend: [3.3, 3.25, 3.2, 3.15, 3.12, 3.1, 3.1],
      failureTrend: [0.82, 0.8, 0.79, 0.8, 0.8, 0.8, 0.8],
      recentIncidents: ['Intermittent 429s during batch sync.'],
      dependencyInsights: ['Playbooks and runbooks for support teams.'],
      recommendations: ['Throttle block updates during index rebuilds.'],
      circuitBreaker: '0 activations / 24h',
      cachedResponseUsage: '13%',
      queueBackpressure: 'Low',
      fallbackExecutionRate: '2.0%',
    },
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar API',
    provider: 'Google',
    availability: '99.93%',
    avgLatency: '210ms',
    p95Latency: '480ms',
    errorRate: '0.35%',
    timeoutRate: '0.5%',
    retryRate: '1.5%',
    rateLimitEvents: '16/h',
    schemaFailures: '0.02%',
    authFailures: '0.04%',
    toolExecFailureRate: '0.28%',
    status: 'Healthy',
    sparkline: [26, 27, 26, 28, 27, 29, 28],
    lastIncident: '8h ago',
    detail: {
      latencyTrend: [225, 220, 216, 212, 211, 210, 210],
      p95Trend: [500, 495, 490, 485, 482, 480, 480],
      retryTrend: [1.7, 1.65, 1.6, 1.55, 1.52, 1.5, 1.5],
      failureTrend: [0.38, 0.37, 0.36, 0.35, 0.35, 0.35, 0.35],
      recentIncidents: ['Quota advisory only; no customer impact.'],
      dependencyInsights: ['Scheduling handoffs for concierge and support.'],
      recommendations: ['Use incremental sync tokens for busy calendars.'],
      circuitBreaker: '0 activations / 24h',
      cachedResponseUsage: '24%',
      queueBackpressure: 'Low',
      fallbackExecutionRate: '0.9%',
    },
  },
  {
    id: 'internal-crm',
    name: 'Internal CRM API',
    provider: 'Internal',
    availability: '99.68%',
    avgLatency: '185ms',
    p95Latency: '560ms',
    errorRate: '1.4%',
    timeoutRate: '2.1%',
    retryRate: '5.2%',
    rateLimitEvents: '2/h',
    schemaFailures: '0.18%',
    authFailures: '0.22%',
    toolExecFailureRate: '1.1%',
    status: 'Degraded',
    sparkline: [40, 44, 48, 52, 50, 54, 53],
    lastIncident: '12m ago',
    detail: {
      latencyTrend: [170, 175, 178, 182, 185, 184, 185],
      p95Trend: [480, 510, 530, 545, 555, 558, 560],
      retryTrend: [4.5, 4.7, 4.9, 5.0, 5.1, 5.15, 5.2],
      failureTrend: [1.2, 1.25, 1.3, 1.32, 1.35, 1.38, 1.4],
      recentIncidents: ['Retry amplification detected for CRM-related workflows.', 'Replica lag caused stale reads.'],
      dependencyInsights: ['Shared dependency for 6 agent tool paths.'],
      recommendations: ['Add read-after-write consistency guard for ticket updates.'],
      circuitBreaker: '3 activations / 24h',
      cachedResponseUsage: '8%',
      queueBackpressure: 'High',
      fallbackExecutionRate: '4.5%',
    },
  },
  {
    id: 'delivery-tracking',
    name: 'Delivery Tracking API',
    provider: 'Logistics Partner',
    availability: '99.61%',
    avgLatency: '380ms',
    p95Latency: '920ms',
    errorRate: '1.6%',
    timeoutRate: '3.1%',
    retryRate: '6.4%',
    rateLimitEvents: '6/h',
    schemaFailures: '0.35%',
    authFailures: '0.08%',
    toolExecFailureRate: '1.4%',
    status: 'Degraded',
    sparkline: [48, 52, 58, 62, 60, 64, 66],
    lastIncident: '25m ago',
    detail: {
      latencyTrend: [350, 360, 370, 375, 380, 378, 380],
      p95Trend: [820, 860, 880, 900, 910, 918, 920],
      retryTrend: [5.5, 5.8, 6.0, 6.1, 6.2, 6.3, 6.4],
      failureTrend: [1.4, 1.45, 1.5, 1.52, 1.55, 1.58, 1.6],
      recentIncidents: ['Schema mismatch detected in shipment status payload.', 'Timeout spike on carrier fallback endpoint.'],
      dependencyInsights: ['Primary dependency for Order & Delivery Agent.'],
      recommendations: ['Monitor schema changes for Delivery API with contract tests.', 'Enable circuit breaker for carrier fallback reads.'],
      circuitBreaker: '4 activations / 24h',
      cachedResponseUsage: '5%',
      queueBackpressure: 'High',
      fallbackExecutionRate: '6.1%',
    },
  },
  {
    id: 'identity-auth',
    name: 'Identity / Auth API',
    provider: 'Internal IAM',
    availability: '99.97%',
    avgLatency: '95ms',
    p95Latency: '220ms',
    errorRate: '0.15%',
    timeoutRate: '0.12%',
    retryRate: '0.4%',
    rateLimitEvents: '1/h',
    schemaFailures: '0.01%',
    authFailures: '0.08%',
    toolExecFailureRate: '0.12%',
    status: 'Healthy',
    sparkline: [18, 19, 18, 20, 19, 20, 19],
    lastIncident: '2d ago',
    detail: {
      latencyTrend: [102, 100, 98, 96, 95, 96, 95],
      p95Trend: [235, 230, 226, 223, 221, 220, 220],
      retryTrend: [0.5, 0.48, 0.45, 0.42, 0.41, 0.4, 0.4],
      failureTrend: [0.16, 0.155, 0.15, 0.15, 0.15, 0.15, 0.15],
      recentIncidents: ['No active auth incidents.'],
      dependencyInsights: ['Gate for all tool calls requiring user context.'],
      recommendations: ['Watch token refresh failures correlated with regional clocks.'],
      circuitBreaker: '0 activations / 24h',
      cachedResponseUsage: '31%',
      queueBackpressure: 'Low',
      fallbackExecutionRate: '0.1%',
    },
  },
]

const apiRuntimeIncidents24h: ApiRuntimeIncident[] = [
  {
    id: 'inc-zendesk-timeout',
    severity: 'Warning',
    apiName: 'Zendesk API',
    title: 'Zendesk timeout spike',
    shortNote: '/tickets/search p95 elevated — support agent tool path',
    timestamp: '18m ago',
    status: 'Monitoring',
  },
  {
    id: 'inc-slack-ratelimit',
    severity: 'Warning',
    apiName: 'Slack API',
    title: 'Slack API rate limiting',
    shortNote: 'chat.postMessage throttled — escalation workflows',
    timestamp: '1h ago',
    status: 'Monitoring',
  },
  {
    id: 'inc-delivery-schema',
    severity: 'Critical',
    apiName: 'Delivery Tracking API',
    title: 'CRM shipment schema drift',
    shortNote: 'Validation failures on shipment status tool payload',
    timestamp: '25m ago',
    status: 'Active',
  },
  {
    id: 'inc-calendar-latency',
    severity: 'Warning',
    apiName: 'Google Calendar API',
    title: 'Calendar latency increase',
    shortNote: 'freebusy/query slower — scheduling agent handoffs',
    timestamp: '40m ago',
    status: 'Monitoring',
  },
]

function apiToolRowsByRange(range: TimeRange): ApiToolRuntimeRow[] {
  if (range === '1h') {
    return apiToolRuntimeRows24h.map((row) => ({
      ...row,
      avgLatency:
        row.id === 'zendesk'
          ? '285ms'
          : row.id === 'delivery-tracking'
            ? '350ms'
            : row.avgLatency,
      p95Latency:
        row.id === 'zendesk'
          ? '720ms'
          : row.id === 'internal-crm'
            ? '520ms'
            : row.p95Latency,
      timeoutRate:
        row.id === 'zendesk'
          ? '2.0%'
          : row.id === 'identity-auth'
            ? '0.1%'
            : row.timeoutRate,
      sparkline: row.sparkline.map((v, i) => v + (i % 2 === 0 ? -1 : 2)),
    }))
  }
  if (range === '7d') {
    return apiToolRuntimeRows24h.map((row) => ({
      ...row,
      availability:
        row.id === 'delivery-tracking'
          ? '99.55%'
          : row.id === 'internal-crm'
            ? '99.62%'
            : row.availability,
      retryRate:
        row.id === 'internal-crm'
          ? '5.8%'
          : row.id === 'zendesk'
            ? '4.5%'
            : row.retryRate,
      sparkline: row.sparkline.map((v, i) => v + Math.floor(i / 2)),
    }))
  }
  return apiToolRuntimeRows24h
}

function apiRuntimeIncidentsByRange(range: TimeRange): ApiRuntimeIncident[] {
  if (range === '1h') {
    return apiRuntimeIncidents24h.map((inc) =>
      inc.id === 'inc-calendar-latency'
        ? { ...inc, timestamp: '12m ago', status: 'Monitoring' as const }
        : inc,
    )
  }
  if (range === '7d') {
    return apiRuntimeIncidents24h.map((inc) =>
      inc.id === 'inc-zendesk-timeout'
        ? { ...inc, status: 'Resolved' as const }
        : inc,
    )
  }
  return apiRuntimeIncidents24h
}

function apiRuntimeOverviewByRange(range: TimeRange): ApiRuntimeOverview {
  if (range === '1h') {
    return {
      trafficSeries: [2.1, 2.3, 2.2, 2.5, 2.4, 2.6, 2.5],
      peakTrafficLabel: '2.6k rpm',
      retryTrafficShare: '11%',
      fallbackShare: '2.1%',
      toolAvgExec: '420ms',
      toolFailedExec: '0.7%',
      toolRetryAmp: '1.4× baseline',
      toolSuccessRate: '98.4%',
      toolSuccessfulCalls: '48.2k',
      toolFailedCallsCount: '760',
      errorMix: {
        clientErrorsPct: '36',
        serverErrorsPct: '40',
        timeoutPct: '14',
        schemaPct: '10',
      },
      rateLimit: {
        throttledShare: '3.8%',
        apisNearLimitLabel: 'Slack · Zendesk',
      },
      insightsTicker: [
        'Zendesk API timeout spike — support agent tool path',
        'Slack API rate limiting observed during burst handoffs',
        'CRM retry amplification detected on Internal CRM API',
        'Calendar API latency elevated — scheduling agent',
      ],
    }
  }
  if (range === '7d') {
    return {
      trafficSeries: [3.2, 3.4, 3.5, 3.6, 3.55, 3.7, 3.75],
      peakTrafficLabel: '4.1k rpm',
      retryTrafficShare: '14%',
      fallbackShare: '2.8%',
      toolAvgExec: '455ms',
      toolFailedExec: '0.85%',
      toolRetryAmp: '1.6× baseline',
      toolSuccessRate: '97.9%',
      toolSuccessfulCalls: '1.02M',
      toolFailedCallsCount: '21.4k',
      errorMix: {
        clientErrorsPct: '30',
        serverErrorsPct: '46',
        timeoutPct: '16',
        schemaPct: '8',
      },
      rateLimit: {
        throttledShare: '5.1%',
        apisNearLimitLabel: 'Slack · HubSpot',
      },
      insightsTicker: [
        'Tool execution fallback activated — Delivery Tracking API',
        'Stripe payment tool path stable after EU retry burst',
        'Identity / Auth API SLO green — all agent fleets',
        'Internal CRM schema validation errors cleared',
      ],
    }
  }
  return {
    trafficSeries: [2.8, 2.9, 3.0, 3.1, 3.05, 3.2, 3.15],
    peakTrafficLabel: '3.4k rpm',
    retryTrafficShare: '12%',
    fallbackShare: '2.4%',
    toolAvgExec: '438ms',
    toolFailedExec: '0.78%',
    toolRetryAmp: '1.5× baseline',
    toolSuccessRate: '98.1%',
    toolSuccessfulCalls: '186k',
    toolFailedCallsCount: '3.5k',
    errorMix: {
      clientErrorsPct: '32',
      serverErrorsPct: '44',
      timeoutPct: '14',
      schemaPct: '10',
    },
    rateLimit: {
      throttledShare: '4.2%',
      apisNearLimitLabel: 'Slack · Zendesk',
    },
    insightsTicker: [
      'Zendesk API timeout spike — tier-1 support workflows',
      'CRM retry amplification on Internal CRM API',
      'Slack API rate limiting during concurrent agent sends',
      'Tool execution fallback active on calendar create path',
    ],
  }
}

function withRangeAdjustments(
  rows: AgentOperationalRow[],
  range: TimeRange,
): AgentOperationalRow[] {
  if (range === '24h') return rows
  if (range === '1h') {
    return rows.map((row) => ({
      ...row,
      traffic: row.id === 'shopping-concierge' ? '2.2k rpm' : row.id === 'support-copilot' ? '1.1k rpm' : row.id === 'order-delivery' ? '1.4k rpm' : row.id === 'product-qa' ? '1.8k rpm' : row.traffic,
      latencyP95:
        row.id === 'product-qa'
          ? '2.0s'
          : row.id === 'order-delivery'
            ? '1.9s'
            : row.id === 'inventory-fulfillment'
              ? '2.0s'
              : row.id === 'shopping-concierge'
                ? '1.4s'
                : row.latencyP95,
      errorRate:
        row.id === 'order-delivery'
          ? '1.2%'
          : row.id === 'product-qa'
            ? '0.9%'
            : row.id === 'inventory-fulfillment'
              ? '0.9%'
              : row.errorRate,
      issue: row.id === 'order-delivery' ? 'Carrier API jitter' : row.id === 'product-qa' ? 'Spiky retrieval latency' : row.id === 'inventory-fulfillment' ? 'Retry bursts' : undefined,
      sparkline: row.sparkline.map((value, index) => value + (index % 2 === 0 ? -2 : 3)),
      summary: {
        ...row.summary,
        requestsPerMin:
          row.id === 'shopping-concierge'
            ? '2,204'
            : row.id === 'support-copilot'
              ? '1,143'
              : row.id === 'order-delivery'
                ? '1,403'
                : row.summary.requestsPerMin,
        p95Latency:
          row.id === 'product-qa'
            ? '2.0s'
            : row.id === 'order-delivery'
              ? '1.9s'
              : row.summary.p95Latency,
      },
    }))
  }
  return rows.map((row) => ({
    ...row,
    traffic:
      row.id === 'shopping-concierge'
        ? '4.9k rpm'
        : row.id === 'product-qa'
          ? '3.7k rpm'
          : row.id === 'order-delivery'
            ? '2.8k rpm'
            : row.id === 'support-copilot'
              ? '2.4k rpm'
              : row.id === 'inventory-fulfillment'
                ? '1.6k rpm'
                : row.traffic,
    latencyP95:
      row.id === 'product-qa'
        ? '2.1s'
        : row.id === 'order-delivery'
          ? '2.0s'
          : row.id === 'inventory-fulfillment'
            ? '2.1s'
            : row.id === 'support-copilot'
              ? '1.2s'
              : row.latencyP95,
    availability:
      row.id === 'order-delivery'
        ? '99.81%'
        : row.id === 'product-qa'
          ? '99.86%'
          : row.id === 'shopping-concierge'
            ? '99.98%'
            : row.availability,
    sparkline: row.sparkline.map((value, index) => value + Math.floor(index / 3)),
    summary: {
      ...row.summary,
      requestsPerMin:
        row.id === 'shopping-concierge'
          ? '4,892'
          : row.id === 'product-qa'
            ? '3,702'
            : row.id === 'order-delivery'
              ? '2,763'
              : row.summary.requestsPerMin,
      incidents: row.issue ? 'Trend only / no active paging' : 'No active issues',
    },
  }))
}

function providerRowsByRange(range: TimeRange): ProviderHealth[] {
  if (range === '1h') {
    return providerHealthRows24h.map((row) => ({
      ...row,
      avgLatency:
        row.id === 'claude-3-opus'
          ? '2.5s'
          : row.id === 'gemini-1-5-flash'
            ? '0.75s'
            : row.id === 'gpt-4o-mini'
              ? '0.85s'
              : row.avgLatency,
      p95Latency:
        row.id === 'claude-3-opus'
          ? '4.2s'
          : row.id === 'gemini-1-5-flash'
            ? '1.3s'
            : row.p95Latency,
      timeoutRate:
        row.id === 'claude-3-opus'
          ? '2.8%'
          : row.id === 'gemini-1-5-flash'
            ? '0.6%'
            : row.timeoutRate,
      requestThroughput:
        row.id === 'gpt-4o'
          ? '7.4k rpm'
          : row.id === 'claude-3-opus'
            ? '1.5k rpm'
            : row.requestThroughput,
    }))
  }
  if (range === '7d') {
    return providerHealthRows24h.map((row) => ({
      ...row,
      avgLatency:
        row.id === 'claude-3-opus'
          ? '2.9s'
          : row.id === 'gpt-4o'
            ? '1.25s'
            : row.id === 'gemini-1-5-flash'
              ? '0.82s'
              : row.avgLatency,
      p95Latency:
        row.id === 'claude-3-opus'
          ? '4.9s'
          : row.id === 'gemini-1-5-pro'
            ? '3.3s'
            : row.p95Latency,
      timeoutRate:
        row.id === 'claude-3-opus'
          ? '3.4%'
          : row.id === 'gemini-1-5-pro'
            ? '2.3%'
            : row.timeoutRate,
      requestThroughput:
        row.id === 'gpt-4o'
          ? '9.8k rpm'
          : row.id === 'gemini-1-5-flash'
            ? '8.4k rpm'
            : row.requestThroughput,
    }))
  }
  return providerHealthRows24h
}

function fleetMetricsByRange(range: TimeRange): FleetMetric[] {
  if (range === '1h') {
    return [
      { label: 'Fleet Health', value: '92 / 100', trend: 'up', tone: 'healthy', sparkline: [87, 88, 90, 91, 89, 92, 92] },
      { label: 'Active Issues', value: '2', trend: 'flat', tone: 'watch', sparkline: [3, 2, 2, 2, 3, 2, 2] },
      { label: 'p95 Latency', value: '1.6s', trend: 'down', tone: 'healthy', sparkline: [2.1, 1.9, 1.8, 1.7, 1.9, 1.6, 1.6] },
      { label: 'Error Rate', value: '0.7%', trend: 'down', tone: 'healthy', sparkline: [1.1, 1.0, 0.9, 0.8, 0.8, 0.75, 0.7] },
      { label: 'Availability', value: '99.95%', trend: 'up', tone: 'live', sparkline: [99.88, 99.89, 99.92, 99.93, 99.95, 99.94, 99.95] },
      { label: 'Requests', value: '10.6k rpm', trend: 'up', tone: 'live', sparkline: [8.1, 8.7, 9.2, 9.6, 9.9, 10.2, 10.6] },
    ]
  }
  if (range === '7d') {
    return [
      { label: 'Fleet Health', value: '90 / 100', trend: 'flat', tone: 'healthy', sparkline: [88, 89, 89, 90, 90, 90, 90] },
      { label: 'Active Issues', value: '1', trend: 'down', tone: 'healthy', sparkline: [4, 3, 3, 2, 2, 1, 1] },
      { label: 'p95 Latency', value: '1.9s', trend: 'flat', tone: 'watch', sparkline: [2.2, 2.1, 2.0, 1.9, 1.9, 1.9, 1.9] },
      { label: 'Error Rate', value: '0.9%', trend: 'down', tone: 'healthy', sparkline: [1.2, 1.1, 1.0, 1.0, 0.95, 0.92, 0.9] },
      { label: 'Availability', value: '99.96%', trend: 'up', tone: 'live', sparkline: [99.91, 99.92, 99.93, 99.94, 99.95, 99.95, 99.96] },
      { label: 'Requests', value: '17.8k rpm', trend: 'up', tone: 'live', sparkline: [13.4, 14.2, 15.1, 16.1, 16.8, 17.2, 17.8] },
    ]
  }
  return [
    { label: 'Fleet Health', value: '91 / 100', trend: 'up', tone: 'healthy', sparkline: [78, 80, 79, 83, 86, 88, 91] },
    { label: 'Active Issues', value: '3', trend: 'flat', tone: 'watch', sparkline: [5, 4, 4, 3, 3, 4, 3] },
    { label: 'p95 Latency', value: '1.8s', trend: 'down', tone: 'healthy', sparkline: [2.7, 2.4, 2.2, 2.1, 2.0, 1.9, 1.8] },
    { label: 'Error Rate', value: '0.8%', trend: 'down', tone: 'healthy', sparkline: [1.4, 1.2, 1.1, 0.9, 0.95, 0.86, 0.8] },
    { label: 'Availability', value: '99.94%', trend: 'up', tone: 'live', sparkline: [99.79, 99.82, 99.87, 99.9, 99.91, 99.92, 99.94] },
    { label: 'Requests', value: '14.2k rpm', trend: 'up', tone: 'live', sparkline: [9.2, 10.8, 11.3, 12.1, 12.9, 13.7, 14.2] },
  ]
}

function retrievalMetricsByRange(range: TimeRange): RetrievalMetric[] {
  if (range === '1h') {
    return [
      { label: 'Retrieval Success Rate', value: '98.6%', tone: 'healthy' },
      { label: 'Avg Retrieval Latency', value: '390ms', tone: 'healthy' },
      { label: 'Retrieval Timeout Rate', value: '1.1%', tone: 'healthy' },
      { label: 'No-Context Returned Rate', value: '3.4%', tone: 'watch' },
      { label: 'Retrieval Error Rate', value: '0.7%', tone: 'healthy' },
      { label: 'Vector Search Availability', value: '99.95%', tone: 'healthy' },
      { label: 'Knowledge Source Sync Status', value: '5/5 Healthy', tone: 'healthy' },
      { label: 'Index Refresh Delay', value: '6m', tone: 'healthy' },
      { label: 'Retrieval Queue Depth', value: '23', tone: 'neutral' },
    ]
  }
  if (range === '7d') {
    return [
      { label: 'Retrieval Success Rate', value: '98.3%', tone: 'healthy' },
      { label: 'Avg Retrieval Latency', value: '440ms', tone: 'watch' },
      { label: 'Retrieval Timeout Rate', value: '1.6%', tone: 'watch' },
      { label: 'No-Context Returned Rate', value: '3.9%', tone: 'watch' },
      { label: 'Retrieval Error Rate', value: '1.0%', tone: 'watch' },
      { label: 'Vector Search Availability', value: '99.90%', tone: 'healthy' },
      { label: 'Knowledge Source Sync Status', value: '4/5 Healthy', tone: 'watch' },
      { label: 'Index Refresh Delay', value: '18m', tone: 'watch' },
      { label: 'Retrieval Queue Depth', value: '46', tone: 'neutral' },
    ]
  }
  return retrievalMetrics24h
}

function knowledgeSourcesByRange(range: TimeRange): KnowledgeSourceRow[] {
  if (range === '1h') {
    return knowledgeSources24h.map((source) => ({
      ...source,
      avgLatency:
        source.id === 'crm-kb'
          ? '510ms'
          : source.id === 'product-docs'
            ? '405ms'
            : source.avgLatency,
      timeoutRate:
        source.id === 'crm-kb'
          ? '2.6%'
          : source.id === 'internal-wiki'
            ? '1.5%'
            : source.timeoutRate,
      lastSync: source.id === 'crm-kb' ? '12m ago' : source.lastSync,
      detail: {
        ...source.detail,
        queueDepth: source.id === 'crm-kb' ? '32' : source.detail.queueDepth,
      },
    }))
  }
  if (range === '7d') {
    return knowledgeSources24h.map((source) => ({
      ...source,
      avgLatency:
        source.id === 'crm-kb'
          ? '590ms'
          : source.id === 'internal-wiki'
            ? '490ms'
            : source.avgLatency,
      timeoutRate:
        source.id === 'crm-kb'
          ? '3.8%'
          : source.id === 'product-docs'
            ? '1.8%'
            : source.timeoutRate,
      lastSync: source.id === 'product-docs' ? '18m ago' : source.lastSync,
      detail: {
        ...source.detail,
        indexDelay: source.id === 'product-docs' ? '18m' : source.detail.indexDelay,
      },
    }))
  }
  return knowledgeSources24h
}

export type PromptRuntimeIssueSeverity = 'Critical' | 'Warning' | 'Info'

export type PromptRuntimeIssue = {
  id: string
  severity: PromptRuntimeIssueSeverity
  agent: string
  promptVersion: string
  note: string
  /** Minutes since detection; lower = more recent (used for tie-break within severity). */
  detectedMinutesAgo: number
  /** Feed label, e.g. "5 min ago". */
  detectedLabel: string
  /** Higher = more operational impact when sorting within the same severity. */
  impactScore: number
  /** Optional impact line, e.g. "Seen in 12.4% of executions". */
  impactHint?: string
  detail: {
    executionVolume: string
    avgLatency: string
    p95Latency: string
    tokenLoad: string
    overflowRate: string
    retryFallback: string
    recentEvents: string[]
    runtimeInsight: string
  }
}

const PROMPT_SEVERITY_SORT: Record<PromptRuntimeIssueSeverity, number> = {
  Critical: 0,
  Warning: 1,
  Info: 2,
}

/** Critical first, then Warning, then Info; within tier by impact (desc), then recency (asc). */
export function sortPromptRuntimeIssues(issues: PromptRuntimeIssue[]): PromptRuntimeIssue[] {
  return [...issues].sort((a, b) => {
    const sev = PROMPT_SEVERITY_SORT[a.severity] - PROMPT_SEVERITY_SORT[b.severity]
    if (sev !== 0) return sev
    if (b.impactScore !== a.impactScore) return b.impactScore - a.impactScore
    return a.detectedMinutesAgo - b.detectedMinutesAgo
  })
}

export type PromptRuntimeSnapshot = {
  successRate: string
  avgPromptLatency: string
  tokenLoad: string
  overflowRate: string
  /** Share of executions that used fallback prompts (runtime / dependency-driven). */
  fallbackPromptUsage: string
  /** Successful assemblies per bucket (12 ≈ rolling 12h). */
  hourlyExecutionVolume: number[]
  /** Fallback prompt activations per bucket (stacked on execution bars). */
  hourlyFallbackActivations: number[]
  /** Normalized token-pressure index per bucket (0–100) for chart overlay. */
  hourlyTokenPressure: number[]
  issues: PromptRuntimeIssue[]
  fleetDrawer: {
    headline: string
    bullets: string[]
  }
}

const promptRuntimeIssuesFeed: PromptRuntimeIssue[] = [
  {
    id: 'pr-billing-overflow-critical',
    severity: 'Critical',
    agent: 'Billing Agent',
    promptVersion: 'Prompt v14',
    note: 'Context overflow caused response truncation in 18% of billing workflows',
    detectedMinutesAgo: 7,
    detectedLabel: '7 min ago',
    impactScore: 100,
    impactHint: 'Seen in 18% of executions',
    detail: {
      executionVolume: '38.4k runs / 24h',
      avgLatency: '1.58s',
      p95Latency: '4.4s',
      tokenLoad: '8.1k avg input tokens',
      overflowRate: '18% truncation window',
      retryFallback: 'Tail-truncation 18% · fallback 2.4%',
      recentEvents: [
        'Retrieval expansion for invoice + policy bundles pushed assemblies over context budget.',
        'Truncation fired after model preamble — user-visible answer shortening on long threads.',
        'Billing workflow graph: retrieval → assembly → model; overflow at assembly boundary.',
      ],
      runtimeInsight:
        'Context overflow in Billing v14 is truncating production responses after retrieval-heavy assemblies — treat as P0 until context budget or chunking is adjusted.',
    },
  },
  {
    id: 'pr-support-crm-critical',
    severity: 'Critical',
    agent: 'Support Agent',
    promptVersion: 'Prompt v12',
    note: 'Fallback prompt chain triggered repeatedly during CRM outage',
    detectedMinutesAgo: 14,
    detectedLabel: '14 min ago',
    impactScore: 96,
    impactHint: 'Affecting 6 workflows',
    detail: {
      executionVolume: '112k runs / 24h',
      avgLatency: '1.41s',
      p95Latency: '3.9s',
      tokenLoad: '6.4k avg input tokens',
      overflowRate: '1.7%',
      retryFallback: 'Fallback chain 34% of runs in outage window · CRM retries amplified',
      recentEvents: [
        'Internal CRM 503/timeout burst 08:40–09:25 UTC — tool layer stalled prompt assembly.',
        'Runtime escalated to secondary fallback prompt on repeated dependency failures.',
        'Primary prompt path healthy; degradation isolated to CRM-coupled ticket enrichment.',
      ],
      runtimeInsight:
        'Fallback prompt chain activated repeatedly during CRM outage — dependency instability drove runtime prompt path changes, not model errors.',
    },
  },
  {
    id: 'pr-onboarding-tokens',
    severity: 'Warning',
    agent: 'Onboarding Agent',
    promptVersion: 'Prompt v6',
    note: 'Token load +24% after retrieval expansion',
    detectedMinutesAgo: 22,
    detectedLabel: '22 min ago',
    impactScore: 82,
    impactHint: 'Seen in 12.4% of executions',
    detail: {
      executionVolume: '24.1k runs / 24h',
      avgLatency: '1.64s',
      p95Latency: '4.7s',
      tokenLoad: '9.2k avg input tokens',
      overflowRate: '3.9%',
      retryFallback: 'Truncation 3.2% · fallback 1.1%',
      recentEvents: [
        'New onboarding retrieval pack increased chunk count per turn.',
        'Assembly stage adds ~90ms vs prior week; token histogram shifted right.',
        'Overflow risk trending up — still below Billing critical but above fleet baseline.',
      ],
      runtimeInsight:
        'Retrieval context growth fed directly into prompt assembly — token load +24% warrants smaller static policy blocks or selective retrieval.',
    },
  },
  {
    id: 'pr-policy-latency',
    severity: 'Warning',
    agent: 'Policy Assistant',
    promptVersion: 'Prompt v18',
    note: 'p95 prompt latency exceeded 4.8s during peak multilingual traffic',
    detectedMinutesAgo: 31,
    detectedLabel: '31 min ago',
    impactScore: 78,
    impactHint: 'Peak window · 45 min',
    detail: {
      executionVolume: '67.8k runs / 24h',
      avgLatency: '1.72s',
      p95Latency: '5.1s',
      tokenLoad: '7.1k avg input tokens',
      overflowRate: '2.2%',
      retryFallback: 'Retries 4.1% · multilingual path +220ms median assembly',
      recentEvents: [
        'DE/ES/FR parallel retrieval merged into single assembly — larger preamble.',
        'Tool calls for policy citations serialized behind rate-limited legal index.',
        'p95 spike correlated with EU afternoon peak, not model provider errors.',
      ],
      runtimeInsight:
        'Multilingual retrieval and tool serialization extended assembly-to-first-token latency — runtime healthy but SLO tail breached during peak.',
    },
  },
  {
    id: 'pr-sales-multilingual',
    severity: 'Warning',
    agent: 'Sales Agent',
    promptVersion: 'Prompt v9',
    note: 'Assembly latency increased for multilingual retrieval',
    detectedMinutesAgo: 48,
    detectedLabel: '48 min ago',
    impactScore: 64,
    detail: {
      executionVolume: '51.2k runs / 24h',
      avgLatency: '1.42s',
      p95Latency: '4.0s',
      tokenLoad: '7.0k avg input tokens',
      overflowRate: '2.0%',
      retryFallback: 'Retries 3.5% · fallback 0.7%',
      recentEvents: [
        'Parallel multilingual snippets increased merge cost in assembly stage.',
        'DE/FR sources add ~200ms median before first model token.',
        'Execution success stable; pressure is latency, not failures.',
      ],
      runtimeInsight:
        'Sales v9 assembly latency reflects multilingual retrieval breadth — consider caching hot snippets or narrowing locale fan-out.',
    },
  },
  {
    id: 'pr-tools-dependency',
    severity: 'Warning',
    agent: 'Handoff Agent',
    promptVersion: 'Prompt v8',
    note: 'Tool timeouts extended assembly; retry amplification on 429 from search API',
    detectedMinutesAgo: 55,
    detectedLabel: '55 min ago',
    impactScore: 58,
    impactHint: 'Affecting 4 workflows',
    detail: {
      executionVolume: '19.3k runs / 24h',
      avgLatency: '1.89s',
      p95Latency: '4.5s',
      tokenLoad: '5.8k avg input tokens',
      overflowRate: '1.4%',
      retryFallback: 'Tool retries 11% · assembly waited on search API',
      recentEvents: [
        'Search API 429 burst caused nested retries in handoff tool chain.',
        'Prompt assembly blocked until tool payload resolved — user-visible stall.',
        'Fallback prompt not triggered; issue is latency amplification, not hard failure.',
      ],
      runtimeInsight:
        'Dependency instability on the search tool extended prompt assembly — retrieval → tool → assembly path shows retry amplification.',
    },
  },
  {
    id: 'pr-faq-baseline',
    severity: 'Info',
    agent: 'FAQ Assistant',
    promptVersion: 'Prompt v3',
    note: 'Prompt token load trending above weekly baseline',
    detectedMinutesAgo: 63,
    detectedLabel: '1h ago',
    impactScore: 42,
    impactHint: '+8% vs 7d avg',
    detail: {
      executionVolume: '201k runs / 24h',
      avgLatency: '0.98s',
      p95Latency: '2.6s',
      tokenLoad: '4.6k avg input tokens',
      overflowRate: '0.6%',
      retryFallback: 'Fallback 0.3%',
      recentEvents: [
        'Doc index refresh increased average chunk length in FAQ retrieval.',
        'No overflow alarms; monitor for drift into warning territory.',
      ],
      runtimeInsight:
        'FAQ v3 token load drift is gradual — likely retrieval corpus growth feeding assembly; watch weekly trend.',
    },
  },
  {
    id: 'pr-scheduling-calendar',
    severity: 'Info',
    agent: 'Scheduling Agent',
    promptVersion: 'Prompt v5',
    note: 'Fallback prompts triggered during Calendar API retries',
    detectedMinutesAgo: 76,
    detectedLabel: '1h 16m ago',
    impactScore: 38,
    detail: {
      executionVolume: '44.6k runs / 24h',
      avgLatency: '1.12s',
      p95Latency: '3.1s',
      tokenLoad: '5.1k avg input tokens',
      overflowRate: '0.9%',
      retryFallback: 'Calendar retries 5.2% · fallback prompt 1.8%',
      recentEvents: [
        'Google Calendar intermittent 5xx — runtime selected compact fallback prompt.',
        'Shorter system preamble when dependency degraded.',
      ],
      runtimeInsight:
        'Calendar API instability triggered fallback prompts — classic dependency-driven runtime path change.',
    },
  },
  {
    id: 'pr-compliance-index',
    severity: 'Info',
    agent: 'Compliance Assistant',
    promptVersion: 'Prompt v7',
    note: 'Retrieved context size increased after policy index refresh',
    detectedMinutesAgo: 102,
    detectedLabel: '1h 42m ago',
    impactScore: 35,
    detail: {
      executionVolume: '28.9k runs / 24h',
      avgLatency: '1.31s',
      p95Latency: '3.5s',
      tokenLoad: '6.8k avg input tokens',
      overflowRate: '1.1%',
      retryFallback: 'Fallback 0.5%',
      recentEvents: [
        'Policy index v2.3 deployed — denser chunks in retrieval results.',
        'Assembly ingests larger retrieved blocks; model execution unchanged.',
      ],
      runtimeInsight:
        'Retrieval index refresh grew context size before prompt assembly — informational unless overflow rate climbs.',
    },
  },
  {
    id: 'pr-intake-merge',
    severity: 'Info',
    agent: 'Intake Agent',
    promptVersion: 'Prompt v2',
    note: 'Chunk merge after retrieval added ~45ms median assembly latency',
    detectedMinutesAgo: 118,
    detectedLabel: 'Detected 118 min ago',
    impactScore: 28,
    detail: {
      executionVolume: '12.4k runs / 24h',
      avgLatency: '1.05s',
      p95Latency: '2.9s',
      tokenLoad: '5.4k avg input tokens',
      overflowRate: '0.7%',
      retryFallback: 'Fallback 0.2%',
      recentEvents: [
        'New dedup+merge step in retrieval pipeline before prompt assembly.',
        'Latency delta small; no user-facing incident reports.',
      ],
      runtimeInsight:
        'Post-retrieval merge is an intentional assembly cost — track if token load or latency percentiles worsen.',
    },
  },
]

function promptRuntimeByRange(range: TimeRange): PromptRuntimeSnapshot {
  if (range === '1h') {
    return {
      successRate: '99.1%',
      avgPromptLatency: '1.22s',
      tokenLoad: '7.2k avg tokens',
      overflowRate: '1.8%',
      fallbackPromptUsage: '1.4%',
      hourlyExecutionVolume: [118, 142, 135, 128, 156, 168, 174, 162, 151, 139, 124, 109],
      hourlyFallbackActivations: [6, 9, 8, 5, 11, 14, 16, 13, 10, 8, 7, 6],
      hourlyTokenPressure: [62, 68, 65, 61, 72, 78, 81, 76, 71, 66, 63, 59],
      issues: sortPromptRuntimeIssues(
        promptRuntimeIssuesFeed.map((i) =>
          i.id === 'pr-billing-overflow-critical'
            ? {
                ...i,
                note: 'Truncation spike on billing paths in the last hour — context ceiling',
                detectedMinutesAgo: 5,
                detectedLabel: '5 min ago',
                impactScore: 100,
                detail: {
                  ...i.detail,
                  executionVolume: '1.6k runs / 1h',
                  runtimeInsight:
                    'Hourly window shows concentrated truncation on Billing v14 after retrieval-heavy invoice threads — same failure mode as 24h view, higher immediacy.',
                },
              }
            : i,
        ),
      ),
      fleetDrawer: {
        headline:
          'Fleet prompt executions are completing cleanly; Billing Agent v14 shows higher token pressure in the last hour.',
        bullets: [
          'Assembly-to-first-token latency within SLO for 92% of agents.',
          'Context overflow share slightly below daily average.',
          'Fallback usage concentrated on CRM-coupled support paths.',
        ],
      },
    }
  }
  if (range === '7d') {
    return {
      successRate: '98.4%',
      avgPromptLatency: '1.48s',
      tokenLoad: '8.1k avg tokens',
      overflowRate: '2.6%',
      fallbackPromptUsage: '2.4%',
      hourlyExecutionVolume: [920, 883, 805, 762, 998, 1215, 1382, 1455, 1318, 1265, 1088, 942],
      hourlyFallbackActivations: [38, 41, 33, 29, 48, 58, 64, 61, 52, 49, 42, 36],
      hourlyTokenPressure: [71, 69, 65, 62, 74, 82, 88, 91, 86, 83, 77, 73],
      issues: sortPromptRuntimeIssues(promptRuntimeIssuesFeed),
      fleetDrawer: {
        headline:
          'Weekly view: prompt runtime stable with recurring token pressure on Billing v14 and overflow watch on Onboarding v6.',
        bullets: [
          'Deploy rollback cleared anomalous fallback spike mid-week.',
          'Fallback prompts prevented user-facing failures during CRM incidents.',
          'Fleet-wide assembly latency crept up 6% WoW — mostly multilingual paths.',
        ],
      },
    }
  }
  return {
    successRate: '98.7%',
    avgPromptLatency: '1.4s',
    tokenLoad: '7.8k avg tokens',
    overflowRate: '2.1%',
    fallbackPromptUsage: '1.8%',
    hourlyExecutionVolume: [842, 791, 725, 688, 903, 1124, 1288, 1356, 1240, 1188, 1012, 876],
    hourlyFallbackActivations: [22, 26, 18, 15, 32, 44, 48, 46, 38, 34, 28, 24],
    hourlyTokenPressure: [68, 65, 61, 58, 72, 81, 86, 89, 84, 80, 74, 70],
    issues: sortPromptRuntimeIssues(promptRuntimeIssuesFeed),
    fleetDrawer: {
      headline:
        'Prompt executions are largely stable; watch token load on Billing v14 and overflow on Onboarding policy flows.',
      bullets: [
        'Success rate above fleet target; latency tails driven by long-context assemblies.',
        'Fallback share correlated with external API timeouts, not model faults.',
        'Token pressure peaks follow billing cycle and support queue depth.',
      ],
    },
  }
}

export type OperationalHealthSnapshot = {
  fleetMetrics: FleetMetric[]
  fleetRows: AgentOperationalRow[]
  providerHealthRows: ProviderHealth[]
  retrievalMetrics: RetrievalMetric[]
  knowledgeSources: KnowledgeSourceRow[]
  promptRuntime: PromptRuntimeSnapshot
  apiToolRows: ApiToolRuntimeRow[]
  apiRuntimeIncidents: ApiRuntimeIncident[]
  apiRuntimeOverview: ApiRuntimeOverview
}

export const operationalHealthData: Record<TimeRange, OperationalHealthSnapshot> = {
  '1h': {
    fleetMetrics: fleetMetricsByRange('1h'),
    fleetRows: withRangeAdjustments(fleetRows24h, '1h'),
    providerHealthRows: providerRowsByRange('1h'),
    retrievalMetrics: retrievalMetricsByRange('1h'),
    knowledgeSources: knowledgeSourcesByRange('1h'),
    promptRuntime: promptRuntimeByRange('1h'),
    apiToolRows: apiToolRowsByRange('1h'),
    apiRuntimeIncidents: apiRuntimeIncidentsByRange('1h'),
    apiRuntimeOverview: apiRuntimeOverviewByRange('1h'),
  },
  '24h': {
    fleetMetrics: fleetMetricsByRange('24h'),
    fleetRows: withRangeAdjustments(fleetRows24h, '24h'),
    providerHealthRows: providerRowsByRange('24h'),
    retrievalMetrics: retrievalMetricsByRange('24h'),
    knowledgeSources: knowledgeSourcesByRange('24h'),
    promptRuntime: promptRuntimeByRange('24h'),
    apiToolRows: apiToolRowsByRange('24h'),
    apiRuntimeIncidents: apiRuntimeIncidentsByRange('24h'),
    apiRuntimeOverview: apiRuntimeOverviewByRange('24h'),
  },
  '7d': {
    fleetMetrics: fleetMetricsByRange('7d'),
    fleetRows: withRangeAdjustments(fleetRows24h, '7d'),
    providerHealthRows: providerRowsByRange('7d'),
    retrievalMetrics: retrievalMetricsByRange('7d'),
    knowledgeSources: knowledgeSourcesByRange('7d'),
    promptRuntime: promptRuntimeByRange('7d'),
    apiToolRows: apiToolRowsByRange('7d'),
    apiRuntimeIncidents: apiRuntimeIncidentsByRange('7d'),
    apiRuntimeOverview: apiRuntimeOverviewByRange('7d'),
  },
}
