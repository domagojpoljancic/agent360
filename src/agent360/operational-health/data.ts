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
  currentLatency: string
  availability: string
  requestsPerMin: string
  errorRate: string
  rateLimitUsage: string
  status: AgentStatus
  sparkline: number[]
}

export type TopologyNode = {
  id: string
  label: string
  layer: 'Users' | 'AI Agents' | 'Models' | 'Tools/APIs' | 'Human Escalation'
  status: AgentStatus | 'Online'
  issue?: string
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
    currentLatency: '2.3s',
    availability: '99.82%',
    requestsPerMin: '6.2k',
    errorRate: '1.1%',
    rateLimitUsage: '82%',
    status: 'Degraded',
    sparkline: [38, 40, 44, 49, 55, 58, 61],
  },
  {
    id: 'claude-sonnet',
    provider: 'Anthropic',
    model: 'Claude Sonnet',
    currentLatency: '1.5s',
    availability: '99.95%',
    requestsPerMin: '3.1k',
    errorRate: '0.5%',
    rateLimitUsage: '69%',
    status: 'Stable',
    sparkline: [34, 33, 34, 35, 36, 36, 37],
  },
  {
    id: 'gemini-pro',
    provider: 'Google',
    model: 'Gemini Pro',
    currentLatency: '1.8s',
    availability: '99.91%',
    requestsPerMin: '2.4k',
    errorRate: '0.8%',
    rateLimitUsage: '63%',
    status: 'Stable',
    sparkline: [29, 31, 34, 33, 35, 37, 39],
  },
  {
    id: 'embedding',
    provider: 'Internal',
    model: 'Embedding Service',
    currentLatency: '480ms',
    availability: '99.98%',
    requestsPerMin: '11.6k',
    errorRate: '0.2%',
    rateLimitUsage: '54%',
    status: 'Healthy',
    sparkline: [46, 45, 44, 43, 42, 41, 40],
  },
]

const topologyNodes24h: TopologyNode[] = [
  { id: 'users', label: 'Users', layer: 'Users', status: 'Online' },
  { id: 'agents', label: 'AI Agents', layer: 'AI Agents', status: 'Stable' },
  {
    id: 'providers',
    label: 'Models',
    layer: 'Models',
    status: 'Degraded',
    issue: 'GPT-4o latency elevated',
  },
  {
    id: 'tools',
    label: 'Tools/APIs',
    layer: 'Tools/APIs',
    status: 'Degraded',
    issue: 'Delivery API timeouts',
  },
  {
    id: 'escalation',
    label: 'Human Escalation',
    layer: 'Human Escalation',
    status: 'Healthy',
  },
]

const toolDependencies24h = [
  { name: 'OpenAI', status: 'Degraded' },
  { name: 'Anthropic', status: 'Stable' },
  { name: 'Shopify API', status: 'Healthy' },
  { name: 'Delivery API', status: 'Degraded' },
  { name: 'Inventory API', status: 'Stable' },
  { name: 'CRM', status: 'Healthy' },
  { name: 'Vector DB', status: 'Stable' },
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
    return [
      { id: 'gpt-4o', provider: 'OpenAI', model: 'GPT-4o', currentLatency: '1.9s', availability: '99.88%', requestsPerMin: '4.4k', errorRate: '0.8%', rateLimitUsage: '74%', status: 'Stable', sparkline: [35, 38, 36, 41, 39, 43, 40] },
      { id: 'claude-sonnet', provider: 'Anthropic', model: 'Claude Sonnet', currentLatency: '1.4s', availability: '99.96%', requestsPerMin: '2.2k', errorRate: '0.4%', rateLimitUsage: '61%', status: 'Healthy', sparkline: [30, 31, 30, 32, 33, 32, 31] },
      { id: 'gemini-pro', provider: 'Google', model: 'Gemini Pro', currentLatency: '1.7s', availability: '99.92%', requestsPerMin: '1.8k', errorRate: '0.7%', rateLimitUsage: '58%', status: 'Stable', sparkline: [28, 29, 31, 30, 33, 32, 34] },
      { id: 'embedding', provider: 'Internal', model: 'Embedding Service', currentLatency: '440ms', availability: '99.99%', requestsPerMin: '8.7k', errorRate: '0.2%', rateLimitUsage: '49%', status: 'Healthy', sparkline: [43, 42, 41, 40, 39, 40, 38] },
    ]
  }
  if (range === '7d') {
    return [
      { id: 'gpt-4o', provider: 'OpenAI', model: 'GPT-4o', currentLatency: '2.0s', availability: '99.90%', requestsPerMin: '7.9k', errorRate: '0.9%', rateLimitUsage: '79%', status: 'Stable', sparkline: [40, 41, 42, 43, 44, 43, 42] },
      { id: 'claude-sonnet', provider: 'Anthropic', model: 'Claude Sonnet', currentLatency: '1.5s', availability: '99.95%', requestsPerMin: '3.9k', errorRate: '0.5%', rateLimitUsage: '66%', status: 'Stable', sparkline: [33, 33, 34, 34, 35, 35, 36] },
      { id: 'gemini-pro', provider: 'Google', model: 'Gemini Pro', currentLatency: '1.8s', availability: '99.93%', requestsPerMin: '3.2k', errorRate: '0.7%', rateLimitUsage: '62%', status: 'Stable', sparkline: [31, 31, 32, 33, 33, 34, 35] },
      { id: 'embedding', provider: 'Internal', model: 'Embedding Service', currentLatency: '460ms', availability: '99.99%', requestsPerMin: '14.8k', errorRate: '0.2%', rateLimitUsage: '57%', status: 'Healthy', sparkline: [44, 44, 43, 43, 42, 42, 41] },
    ]
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

function topologyByRange(range: TimeRange): TopologyNode[] {
  if (range === '1h') {
    return topologyNodes24h.map((node) =>
      node.id === 'providers'
        ? { ...node, status: 'Stable', issue: 'Short GPT-4o jitter' }
        : node.id === 'tools'
          ? { ...node, status: 'Degraded', issue: 'Carrier API retries' }
          : node,
    )
  }
  if (range === '7d') {
    return topologyNodes24h.map((node) =>
      node.id === 'providers'
        ? { ...node, status: 'Stable', issue: 'No sustained provider issues' }
        : node.id === 'tools'
          ? { ...node, status: 'Stable', issue: 'Occasional delivery timeouts' }
          : node,
    )
  }
  return topologyNodes24h
}

function toolsByRange(range: TimeRange) {
  if (range === '1h') {
    return [
      { name: 'OpenAI', status: 'Stable' },
      { name: 'Anthropic', status: 'Healthy' },
      { name: 'Shopify API', status: 'Healthy' },
      { name: 'Delivery API', status: 'Degraded' },
      { name: 'Inventory API', status: 'Stable' },
      { name: 'CRM', status: 'Healthy' },
      { name: 'Vector DB', status: 'Stable' },
    ]
  }
  if (range === '7d') {
    return [
      { name: 'OpenAI', status: 'Stable' },
      { name: 'Anthropic', status: 'Stable' },
      { name: 'Shopify API', status: 'Healthy' },
      { name: 'Delivery API', status: 'Stable' },
      { name: 'Inventory API', status: 'Stable' },
      { name: 'CRM', status: 'Healthy' },
      { name: 'Vector DB', status: 'Healthy' },
    ]
  }
  return toolDependencies24h
}

export type OperationalHealthSnapshot = {
  fleetMetrics: FleetMetric[]
  fleetRows: AgentOperationalRow[]
  providerHealthRows: ProviderHealth[]
  topologyNodes: TopologyNode[]
  toolDependencies: { name: string; status: string }[]
}

export const operationalHealthData: Record<TimeRange, OperationalHealthSnapshot> = {
  '1h': {
    fleetMetrics: fleetMetricsByRange('1h'),
    fleetRows: withRangeAdjustments(fleetRows24h, '1h'),
    providerHealthRows: providerRowsByRange('1h'),
    topologyNodes: topologyByRange('1h'),
    toolDependencies: toolsByRange('1h'),
  },
  '24h': {
    fleetMetrics: fleetMetricsByRange('24h'),
    fleetRows: withRangeAdjustments(fleetRows24h, '24h'),
    providerHealthRows: providerRowsByRange('24h'),
    topologyNodes: topologyByRange('24h'),
    toolDependencies: toolsByRange('24h'),
  },
  '7d': {
    fleetMetrics: fleetMetricsByRange('7d'),
    fleetRows: withRangeAdjustments(fleetRows24h, '7d'),
    providerHealthRows: providerRowsByRange('7d'),
    topologyNodes: topologyByRange('7d'),
    toolDependencies: toolsByRange('7d'),
  },
}
