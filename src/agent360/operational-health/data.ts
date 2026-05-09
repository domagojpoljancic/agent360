export type AgentStatus = 'Healthy' | 'Stable' | 'Degraded' | 'Critical'
export type FacingType = 'Customer' | 'Internal'

export type FleetMetric = {
  label: string
  value: string
  trend: 'up' | 'down' | 'flat'
  tone: 'healthy' | 'watch' | 'critical' | 'live'
  sparkline: number[]
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

export type OperationalHealthSnapshot = {
  fleetMetrics: FleetMetric[]
  fleetRows: AgentOperationalRow[]
  providerHealthRows: ProviderHealth[]
  retrievalMetrics: RetrievalMetric[]
  knowledgeSources: KnowledgeSourceRow[]
}

export const operationalHealthData: Record<TimeRange, OperationalHealthSnapshot> = {
  '1h': {
    fleetMetrics: fleetMetricsByRange('1h'),
    fleetRows: withRangeAdjustments(fleetRows24h, '1h'),
    providerHealthRows: providerRowsByRange('1h'),
    retrievalMetrics: retrievalMetricsByRange('1h'),
    knowledgeSources: knowledgeSourcesByRange('1h'),
  },
  '24h': {
    fleetMetrics: fleetMetricsByRange('24h'),
    fleetRows: withRangeAdjustments(fleetRows24h, '24h'),
    providerHealthRows: providerRowsByRange('24h'),
    retrievalMetrics: retrievalMetricsByRange('24h'),
    knowledgeSources: knowledgeSourcesByRange('24h'),
  },
  '7d': {
    fleetMetrics: fleetMetricsByRange('7d'),
    fleetRows: withRangeAdjustments(fleetRows24h, '7d'),
    providerHealthRows: providerRowsByRange('7d'),
    retrievalMetrics: retrievalMetricsByRange('7d'),
    knowledgeSources: knowledgeSourcesByRange('7d'),
  },
}
