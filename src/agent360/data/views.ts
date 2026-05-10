import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  BrainCircuit,
  Cpu,
  DollarSign,
  Gauge,
  Globe2,
  HeartPulse,
  LineChart,
  PiggyBank,
  Plug,
  Receipt,
  Route,
  ShieldCheck,
  Sparkles,
  Sliders,
  Target,
  TimerReset,
  TrendingUp,
  Users,
  Wand2,
  Zap,
} from 'lucide-react'

export type ViewKey =
  | 'value-delivered'
  | 'cost-optimization'
  | 'agent-effectiveness-trust'
  | 'operational-health'

export type AccentTone = 'cyan' | 'violet' | 'emerald' | 'amber'

export type ViewStatus = {
  label: string
  tone: 'healthy' | 'watch' | 'critical' | 'success'
}

export type ViewStat = {
  label: string
  value: string
  trend?: 'up' | 'down' | 'flat'
  positive?: boolean
}

export type PlaceholderCard = {
  title: string
  description: string
  icon: LucideIcon
  badge?: string
  metric?: { label: string; value: string }
}

export type AgentView = {
  key: ViewKey
  path: string
  title: string
  shortTitle: string
  /** One-line label for the header page switcher menu. */
  navSubtitle: string
  question: string
  description: string
  /** Short, hover-friendly description used by the orbit info panel. */
  hoverDescription: string
  /** Concrete example insight used by the orbit info panel. */
  exampleInsight: string
  accent: AccentTone
  icon: LucideIcon
  status: ViewStatus
  stats: ViewStat[]
  comingNext: string
  placeholderCards: PlaceholderCard[]
}

export const accentClasses: Record<
  AccentTone,
  {
    text: string
    softText: string
    border: string
    softBorder: string
    bg: string
    softBg: string
    glow: string
    glowHover: string
    ring: string
    gradient: string
    chip: string
    dot: string
    iconWrap: string
    cardBorderHover: string
    underlineVia: string
  }
> = {
  cyan: {
    text: 'text-[#3694fc]',
    softText: 'text-[#3694fc]/75',
    border: 'border-[#3694fc]/30',
    softBorder: 'border-[#3694fc]/15',
    bg: 'bg-[#3694fc]/12',
    softBg: 'bg-[#3694fc]/[0.05]',
    glow: 'shadow-[0_24px_60px_-40px_rgba(54,148,252,0.45)]',
    glowHover: 'hover:shadow-[0_24px_60px_-40px_rgba(54,148,252,0.65)]',
    ring: 'ring-[#3694fc]/25',
    gradient: 'from-[#3694fc]/18 via-[#3694fc]/6 to-transparent',
    chip: 'bg-[#3694fc]/10 text-[#3694fc] border-[#3694fc]/25',
    dot: 'bg-[#3694fc]',
    iconWrap: 'bg-[#3694fc]/10 text-[#3694fc] border-[#3694fc]/25',
    cardBorderHover: 'group-hover:border-[#3694fc]/40',
    underlineVia: 'via-[#3694fc]/35',
  },
  violet: {
    text: 'text-[#9aa6f0]',
    softText: 'text-[#9aa6f0]/75',
    border: 'border-[#9aa6f0]/30',
    softBorder: 'border-[#9aa6f0]/15',
    bg: 'bg-[#9aa6f0]/12',
    softBg: 'bg-[#9aa6f0]/[0.05]',
    glow: 'shadow-[0_24px_60px_-40px_rgba(154,166,240,0.45)]',
    glowHover: 'hover:shadow-[0_24px_60px_-40px_rgba(154,166,240,0.6)]',
    ring: 'ring-[#9aa6f0]/25',
    gradient: 'from-[#9aa6f0]/18 via-[#9aa6f0]/6 to-transparent',
    chip: 'bg-[#9aa6f0]/10 text-[#9aa6f0] border-[#9aa6f0]/25',
    dot: 'bg-[#9aa6f0]',
    iconWrap: 'bg-[#9aa6f0]/10 text-[#9aa6f0] border-[#9aa6f0]/25',
    cardBorderHover: 'group-hover:border-[#9aa6f0]/40',
    underlineVia: 'via-[#9aa6f0]/35',
  },
  emerald: {
    text: 'text-[#5DC2A8]',
    softText: 'text-[#5DC2A8]/75',
    border: 'border-[#5DC2A8]/30',
    softBorder: 'border-[#5DC2A8]/15',
    bg: 'bg-[#5DC2A8]/12',
    softBg: 'bg-[#5DC2A8]/[0.05]',
    glow: 'shadow-[0_24px_60px_-40px_rgba(93,194,168,0.45)]',
    glowHover: 'hover:shadow-[0_24px_60px_-40px_rgba(93,194,168,0.6)]',
    ring: 'ring-[#5DC2A8]/25',
    gradient: 'from-[#5DC2A8]/18 via-[#5DC2A8]/6 to-transparent',
    chip: 'bg-[#5DC2A8]/10 text-[#5DC2A8] border-[#5DC2A8]/25',
    dot: 'bg-[#5DC2A8]',
    iconWrap: 'bg-[#5DC2A8]/10 text-[#5DC2A8] border-[#5DC2A8]/25',
    cardBorderHover: 'group-hover:border-[#5DC2A8]/40',
    underlineVia: 'via-[#5DC2A8]/35',
  },
  amber: {
    text: 'text-[#D6A85B]',
    softText: 'text-[#D6A85B]/75',
    border: 'border-[#D6A85B]/30',
    softBorder: 'border-[#D6A85B]/15',
    bg: 'bg-[#D6A85B]/12',
    softBg: 'bg-[#D6A85B]/[0.05]',
    glow: 'shadow-[0_24px_60px_-40px_rgba(214,168,91,0.45)]',
    glowHover: 'hover:shadow-[0_24px_60px_-40px_rgba(214,168,91,0.6)]',
    ring: 'ring-[#D6A85B]/25',
    gradient: 'from-[#D6A85B]/18 via-[#D6A85B]/6 to-transparent',
    chip: 'bg-[#D6A85B]/10 text-[#D6A85B] border-[#D6A85B]/25',
    dot: 'bg-[#D6A85B]',
    iconWrap: 'bg-[#D6A85B]/10 text-[#D6A85B] border-[#D6A85B]/25',
    cardBorderHover: 'group-hover:border-[#D6A85B]/40',
    underlineVia: 'via-[#D6A85B]/35',
  },
}

export const views: AgentView[] = [
  {
    key: 'value-delivered',
    path: '/value-delivered',
    title: 'Value Delivered',
    shortTitle: 'Value',
    navSubtitle: 'Business outcomes and impact',
    question: 'Is the agent creating measurable business value?',
    description:
      'Track time saved, workload reduced, tickets avoided, customer experience improvements, productivity gains, and revenue influence.',
    hoverDescription:
      'Track business impact, workload reduction, and measurable AI value.',
    exampleInsight: '1,240h saved · €42.7k value tracked',
    accent: 'emerald',
    icon: TrendingUp,
    status: { label: 'On target', tone: 'success' },
    stats: [
      { label: 'Time saved', value: '1,240h', trend: 'up', positive: true },
      { label: 'Tickets avoided', value: '8.6k', trend: 'up', positive: true },
      { label: 'Value tracked', value: '€42.7k', trend: 'up', positive: true },
    ],
    comingNext:
      'Connect agent activity to business outcomes — measured in hours, tickets, and revenue.',
    placeholderCards: [
      {
        title: 'Time Saved',
        description: 'Hours reclaimed by agents vs. manual baseline.',
        icon: TimerReset,
        badge: 'This month',
        metric: { label: 'Saved', value: '1,240h' },
      },
      {
        title: 'Tickets Avoided',
        description: 'Self-served journeys that never reached a human.',
        icon: Users,
        badge: 'Trending up',
        metric: { label: 'Avoided', value: '8.6k' },
      },
      {
        title: 'Resolution Impact',
        description: 'CSAT lift, first-contact resolution and escalations.',
        icon: Sparkles,
        badge: 'CSAT +6',
        metric: { label: 'FCR', value: '78%' },
      },
      {
        title: 'Revenue Influence',
        description: 'Pipeline assisted, retention saved, upsell impact.',
        icon: LineChart,
        badge: 'Linked',
        metric: { label: 'Influenced', value: '€42.7k' },
      },
    ],
  },
  {
    key: 'cost-optimization',
    path: '/cost-optimization',
    title: 'Cost Optimization',
    shortTitle: 'Cost',
    navSubtitle: 'AI efficiency and routing',
    question: 'Are we using the right models and resources for the value created?',
    description:
      'Connect AI spend to outcomes, identify premium model overuse, compare cost per successful task, and recommend smarter model routing.',
    hoverDescription:
      'Connect AI spend to outcomes and surface routing opportunities.',
    exampleInsight: '€9.4k savings open · 18% optimized',
    accent: 'amber',
    icon: Sliders,
    status: { label: 'Savings available', tone: 'watch' },
    stats: [
      { label: 'Spend optimized', value: '18%', trend: 'up', positive: true },
      { label: 'Overkill usage', value: '11%', trend: 'down', positive: true },
      { label: 'Savings opportunity', value: '€9.4k', trend: 'up', positive: true },
    ],
    comingNext:
      'Spend intelligence — cost per outcome, smart routing, and FinOps for AI.',
    placeholderCards: [
      {
        title: 'Cost per Successful Outcome',
        description: 'Unit economics of every successful agent journey.',
        icon: Receipt,
        badge: 'Calibrated',
        metric: { label: 'Avg', value: '€0.41' },
      },
      {
        title: 'Model Routing Recommendations',
        description: 'Right-size models for risk, intent and SLA.',
        icon: Route,
        badge: '5 routes',
        metric: { label: 'Savings', value: '€3.1k' },
      },
      {
        title: 'Premium Model Overuse',
        description: 'Where flagship models do work cheaper tiers can do.',
        icon: Cpu,
        badge: 'Detected',
        metric: { label: 'Overkill', value: '11%' },
      },
      {
        title: 'Savings Opportunities',
        description: 'Prioritized actions ranked by impact and effort.',
        icon: PiggyBank,
        badge: 'Ready',
        metric: { label: 'Total', value: '€9.4k' },
      },
    ],
  },
  {
    key: 'agent-effectiveness-trust',
    path: '/agent-effectiveness-trust',
    title: 'Agent Effectiveness & Trust',
    shortTitle: 'Trust',
    navSubtitle: 'Human trust and quality',
    question: 'Is the agent doing the job well enough to earn user confidence?',
    description:
      'Understand answer quality, groundedness, relevance, task success, retry/clarification behavior, escalation patterns, and fleet-wide trust signals.',
    hoverDescription:
      'Understand groundedness, task success, and user trust behavior across customer and internal agents.',
    exampleInsight: '91% trusted answers · 9.1% retry/clarify loops',
    accent: 'violet',
    icon: ShieldCheck,
    status: { label: 'Quality steady', tone: 'success' },
    stats: [
      { label: 'Trusted answers', value: '91%', trend: 'up', positive: true },
      { label: 'Task success', value: '87%', trend: 'up', positive: true },
      { label: 'Retry / clarify', value: '9.1%', trend: 'down', positive: true },
    ],
    comingNext:
      'A trust layer for AI — quality scoring, hallucination detection, and human-in-the-loop signals.',
    placeholderCards: [
      {
        title: 'Groundedness',
        description: 'Citations, retrieval coverage, and source attribution.',
        icon: BadgeCheck,
        badge: 'Tracking',
        metric: { label: 'Score', value: '94' },
      },
      {
        title: 'Task Success',
        description: 'Goal completion across journeys and intents.',
        icon: Target,
        badge: 'Improving',
        metric: { label: 'Success', value: '87%' },
      },
      {
        title: 'Hallucination Risk',
        description: 'Drift detection and fabricated-claim signals.',
        icon: BrainCircuit,
        badge: 'Watch',
        metric: { label: 'Risk', value: 'Low' },
      },
      {
        title: 'Retry & clarification',
        description: 'Rephrases, clarification loops, and restated intent after AI replies.',
        icon: Wand2,
        badge: 'Active',
        metric: { label: 'Loop rate', value: '9.1%' },
      },
    ],
  },
  {
    key: 'operational-health',
    path: '/operational-health',
    title: 'Operational Health',
    shortTitle: 'Health',
    navSubtitle: 'Runtime reliability monitoring',
    question: 'Is the agent stable and reliable?',
    description:
      'Monitor latency, errors, timeouts, tool failures, model availability, and infrastructure signals before they affect users.',
    hoverDescription:
      'Monitor latency, reliability, incidents, and provider health.',
    exampleInsight: '2 agents on watch · uptime 99.94%',
    accent: 'cyan',
    icon: HeartPulse,
    status: { label: 'All systems nominal', tone: 'healthy' },
    stats: [
      { label: 'p95 latency', value: '1.8s', trend: 'down', positive: true },
      { label: 'Error rate', value: '0.7%', trend: 'down', positive: true },
      { label: 'Uptime', value: '99.94%', trend: 'flat', positive: true },
    ],
    comingNext:
      'Real-time reliability surface — from agent heartbeats to infrastructure dependencies.',
    placeholderCards: [
      {
        title: 'Latency Monitoring',
        description: 'p50 / p95 / p99 across agents, models and tool calls.',
        icon: Gauge,
        badge: 'Stable',
        metric: { label: 'p95', value: '1.8s' },
      },
      {
        title: 'Error & Timeout Trends',
        description: 'Error budgets, retry storms, and cascading timeouts.',
        icon: AlertTriangle,
        badge: 'Watching',
        metric: { label: '24h', value: '0.7%' },
      },
      {
        title: 'Tool / API Reliability',
        description: 'Connector availability, schema mismatches, throttling.',
        icon: Plug,
        badge: 'Healthy',
        metric: { label: 'Connectors', value: '32/34' },
      },
      {
        title: 'Incident Timeline',
        description: 'Auto-correlated incidents with rollback windows.',
        icon: Activity,
        badge: '2 open',
        metric: { label: 'MTTR', value: '11m' },
      },
    ],
  },
]

/**
 * Fixed menu width (px) for the header page switcher: widest row’s text column
 * (max of title vs subtitle per view) plus icon, gaps, check column, padding.
 * Caps at 560px; use with `min(..., calc(100vw - 2rem))` in the component.
 */
export const PAGE_SWITCHER_MENU_WIDTH_PX = (() => {
  const padX = 16
  const icon = 36
  const gap = 8
  const check = 18
  const titlePxPerChar = 7.1
  const subPxPerChar = 5.35

  const maxTextCol = views.reduce((max, v) => {
    const row = Math.max(
      v.title.length * titlePxPerChar,
      v.navSubtitle.length * subPxPerChar,
    )
    return Math.max(max, row)
  }, 0)

  return Math.min(Math.ceil(padX + icon + gap + maxTextCol + gap + check + 6), 560)
})()

export function getViewByPath(path: string): AgentView | undefined {
  return views.find((view) => view.path === path)
}

export function getViewByKey(key: ViewKey): AgentView {
  const view = views.find((v) => v.key === key)
  if (!view) throw new Error(`Unknown view key: ${key}`)
  return view
}

export const teams = [
  {
    title: 'Engineering',
    line: 'Detect reliability issues before they impact users.',
    icon: Zap,
  },
  {
    title: 'Product & AI Teams',
    line: 'Understand which agents succeed, fail, and why.',
    icon: BrainCircuit,
  },
  {
    title: 'Operations',
    line: 'See where AI reduces workload or requires human escalation.',
    icon: Globe2,
  },
  {
    title: 'Leadership & Finance',
    line: 'Connect AI investment to measurable business value.',
    icon: DollarSign,
  },
]
