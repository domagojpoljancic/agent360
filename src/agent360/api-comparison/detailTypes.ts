export type ApiEndpointOperationalStatus = 'Healthy' | 'Degraded' | 'Critical'

export type ApiEndpointMetric = {
  path: string
  avgLatency: string
  p95Latency: string
  errorRate: string
  timeoutRate: string
  requestsPerMin: string
  retryRate: string
  availability: string
  lastIncident: string
  operationalStatus: ApiEndpointOperationalStatus
  severityLabel: 'OK' | 'Watch' | 'Elevated'
  insight: string
  latencySparkline: number[]
}

export type ApiDependencyOverview = {
  productionAgentCount: number
  workflowCount: number
  criticality: 'Critical' | 'High' | 'Standard'
  fallbackEnabled: boolean
  volumeClass: 'High-volume' | 'Medium' | 'Low'
  primaryWorkflows: string[]
  agentNames: string[]
  notes: string[]
}

export type ApiRuntimeBreakdown = {
  network: string
  processing: string
  authOverhead: string
  retryOverhead: string
  fallbackExecution: string
}

export type ApiTimelineEvent = {
  timeUtc: string
  message: string
  tone: 'critical' | 'warning' | 'neutral' | 'positive'
}

export type ApiComparisonDetail = {
  summary: string
  operationalNotes: string[]
  agentToolingContext: string
  dependencyOverview: ApiDependencyOverview
  runtimeBreakdown: ApiRuntimeBreakdown
  timeline: ApiTimelineEvent[]
  endpoints: ApiEndpointMetric[]
}
