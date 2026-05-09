import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  Cpu,
  DollarSign,
  Gauge,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react'

export type AssistantHighlightTone = 'blue' | 'amber' | 'rose' | 'mint'

export type AssistantHighlight = {
  label: string
  value: string
  tone?: AssistantHighlightTone
}

export type AssistantAction = {
  label: string
  path: string
}

export type AssistantResponse = {
  text: string
  highlights?: AssistantHighlight[]
  actions: AssistantAction[]
}

export type SuggestedQuery = {
  text: string
  icon?: LucideIcon
}

/** Compact chips shown on the inline entry surface (kept for backward use). */
export const inlineSuggestions: SuggestedQuery[] = [
  { text: 'Investigate latency spikes', icon: Activity },
  { text: 'Show fleet health', icon: ShieldCheck },
  { text: 'Find expensive agents', icon: DollarSign },
  { text: 'Why are escalations increasing?', icon: TrendingUp },
  { text: 'Compare provider performance', icon: Cpu },
]

/** Vertical example queries shown directly on the inline surface. */
export const surfaceExampleQueries: SuggestedQuery[] = [
  { text: 'Why is the Order Agent degraded?', icon: Activity },
  { text: 'Which agents cost the most?', icon: DollarSign },
  { text: 'Show fleet reliability issues.', icon: HeartPulse },
  { text: 'Are we overusing GPT-4o?', icon: Cpu },
  { text: 'Which agents create the most value?', icon: TrendingUp },
]

/** Longer example queries used inside the modal empty state. */
export const modalExampleQueries: SuggestedQuery[] = [
  { text: 'Why is the Order Agent slower today?', icon: Gauge },
  { text: 'Which agents have the highest escalation rate?', icon: TrendingUp },
  { text: 'Are we overusing GPT-4o?', icon: Cpu },
  { text: 'Show agents with rising latency.', icon: Activity },
  { text: 'Which agents create the most value?', icon: Sparkles },
]

const RESPONSE_LATENCY: AssistantResponse = {
  text: "Operational Health detected elevated timeout rates on the Order & Delivery Agent caused by Delivery API instability. Average p95 latency is up 37% over the last 24 hours, concentrated in EU-WEST between 09:00–11:30 local. Two upstream incidents are correlated.\n\nSuggested next step: inspect Delivery API dependency health and consider rerouting through the secondary connector while it stabilises.",
  highlights: [
    { label: 'p95 latency', value: '+37% / 24h', tone: 'amber' },
    { label: 'Region', value: 'EU-WEST', tone: 'blue' },
    { label: 'Linked incidents', value: '2 open', tone: 'rose' },
  ],
  actions: [
    { label: 'Open Operational Health', path: '/operational-health' },
    { label: 'View agent details', path: '/operational-health' },
    { label: 'Open Model Health', path: '/operational-health' },
  ],
}

const RESPONSE_COST: AssistantResponse = {
  text: "Shopping Concierge Agent currently accounts for 34% of total model spend due to high GPT-4o usage on low-complexity flows. Three of its top five intents have safe lower-tier candidates.\n\nAgent360 recommends routing those low-risk shopping flows to Claude Sonnet — projected to reclaim about €3.1k per month with no measurable change in quality scores.",
  highlights: [
    { label: 'Spend share', value: '34%', tone: 'amber' },
    { label: 'Projected savings', value: '€3.1k / mo', tone: 'mint' },
    { label: 'Intents to reroute', value: '3', tone: 'blue' },
  ],
  actions: [
    { label: 'Open Cost Optimization', path: '/cost-optimization' },
    { label: 'Review routing recommendations', path: '/cost-optimization' },
  ],
}

const RESPONSE_ESCALATION: AssistantResponse = {
  text: "Escalation rate has risen from 6.2% to 9.4% over the past week, driven mostly by the Billing & Refunds Agent. The pattern is concentrated on policy-edge questions where retrieval coverage is low.\n\nThis is a trust signal — users are bouncing to humans because the agent sounds uncertain, not because it's failing outright.",
  highlights: [
    { label: 'Escalation rate', value: '6.2% → 9.4%', tone: 'amber' },
    { label: 'Top driver', value: 'Billing & Refunds', tone: 'blue' },
    { label: 'Likely cause', value: 'Retrieval gap', tone: 'rose' },
  ],
  actions: [
    { label: 'Open Effectiveness & Trust', path: '/agent-effectiveness-trust' },
    { label: 'Inspect hallucination risk', path: '/agent-effectiveness-trust' },
  ],
}

const RESPONSE_VALUE: AssistantResponse = {
  text: "Value Delivered is on target this month — agents have reclaimed roughly 1,240 hours of human work and avoided 8.6k support tickets. The Support Agent leads with €18.4k of tracked outcome value.\n\nThe largest opportunity sits inside the Onboarding Agent: lifting first-contact resolution from 71% to 80% would project an additional €4–6k of monthly impact.",
  highlights: [
    { label: 'Hours saved', value: '1,240h', tone: 'mint' },
    { label: 'Tickets avoided', value: '8.6k', tone: 'mint' },
    { label: 'Top contributor', value: 'Support Agent', tone: 'blue' },
  ],
  actions: [
    { label: 'Open Value Delivered', path: '/value-delivered' },
    { label: 'See contributor breakdown', path: '/value-delivered' },
  ],
}

const RESPONSE_HEALTH: AssistantResponse = {
  text: "Fleet is healthy overall — 22 of 24 agents are inside SLA, p95 sits at 1.8s, and uptime is at 99.94%. Two agents are on watch: Sales Agent (latency drift after prompt v14) and Billing & Refunds (retrieval timeouts).\n\nNo critical incidents are active. Streaming pipelines are clean across all 3 regions.",
  highlights: [
    { label: 'Agents in SLA', value: '22 / 24', tone: 'mint' },
    { label: 'Uptime', value: '99.94%', tone: 'mint' },
    { label: 'Watching', value: '2 agents', tone: 'amber' },
  ],
  actions: [
    { label: 'Open Operational Health', path: '/operational-health' },
    { label: 'Show watched agents', path: '/operational-health' },
  ],
}

const RESPONSE_PROVIDERS: AssistantResponse = {
  text: "Across the last 7 days, Anthropic Sonnet leads on quality (0.91 task-success vs. 0.87 for OpenAI GPT-4o) but trails on latency (p95 2.4s vs. 1.6s). OpenAI is currently cheaper per successful outcome on short flows, while Anthropic wins on long, multi-turn journeys.\n\nNo provider is failing — but routing by intent type would likely reclaim cost without hurting quality.",
  highlights: [
    { label: 'Quality leader', value: 'Anthropic Sonnet', tone: 'mint' },
    { label: 'Latency leader', value: 'OpenAI 4o', tone: 'blue' },
    { label: 'Routing upside', value: '€2–3k / mo', tone: 'amber' },
  ],
  actions: [
    { label: 'Open Cost Optimization', path: '/cost-optimization' },
    { label: 'Open Effectiveness & Trust', path: '/agent-effectiveness-trust' },
  ],
}

const RESPONSE_DEFAULT: AssistantResponse = {
  text: "I can guide you across reliability, trust, value and cost. Try asking about a specific agent, a metric trend, or a model-routing question — for example: \"Why did the Sales Agent drift this week?\" or \"Where can we shrink GPT-4o spend?\"",
  highlights: [],
  actions: [
    { label: 'Open Operational Health', path: '/operational-health' },
    { label: 'Open Effectiveness & Trust', path: '/agent-effectiveness-trust' },
    { label: 'Open Value Delivered', path: '/value-delivered' },
    { label: 'Open Cost Optimization', path: '/cost-optimization' },
  ],
}

export function matchResponse(query: string): AssistantResponse {
  const q = query.toLowerCase()
  if (/provider|anthropic|openai|claude|gpt|model.*compar|compare.*model/.test(q))
    return RESPONSE_PROVIDERS
  if (/cost|expensive|spend|overus|cheap|budget|finops/.test(q)) return RESPONSE_COST
  if (/escalat|handoff|human|trust|hallucinat|quality|drift/.test(q)) return RESPONSE_ESCALATION
  if (/value|outcome|saved|hours|tickets|revenue|impact/.test(q)) return RESPONSE_VALUE
  if (/latency|slow|degrad|spike|order|delivery|p95|p99|timeout|error/.test(q))
    return RESPONSE_LATENCY
  if (/health|reliability|uptime|fleet|stable|status/.test(q)) return RESPONSE_HEALTH
  return RESPONSE_DEFAULT
}
