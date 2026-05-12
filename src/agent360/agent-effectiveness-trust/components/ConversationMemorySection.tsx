import { ChevronRight, MessageCircle, MessageCircleReply, Link2, CheckCircle2 } from 'lucide-react'
import type {
  ConversationMemoryBlock,
  ConversationMemoryFlowStatus,
  ConversationMemoryFlowStep,
  ConversationMemoryMetric,
  ConversationMemoryRiskSeverity,
  ConversationMemoryRiskSignal,
} from '../data'
import { Sparkline } from './shared'
import { ExplainMetricPopover } from './ExplainMetricPopover'
import { StatusBadge } from '../../components/StatusBadge'
import { AISummaryButton } from '../../components/AISummaryButton'

type ConversationMemorySectionProps = {
  data: ConversationMemoryBlock
  onOpenMetric: (metricId: string) => void
  onOpenRisk: (riskId: string) => void
  onRunContextCheck: () => void
  contextCheckActive: boolean
  contextCheckGenerating: boolean
}

const SEVERITY_LABEL: Record<ConversationMemoryRiskSeverity, string> = {
  critical: 'Critical',
  warning: 'Warning',
  info: 'Info',
}

const SEVERITY_TONE: Record<ConversationMemoryRiskSeverity, 'critical' | 'watch' | 'success'> = {
  critical: 'critical',
  warning: 'watch',
  info: 'success',
}

const FLOW_STEP_ICON: Record<ConversationMemoryFlowStatus, typeof MessageCircle> = {
  'memory-used': MessageCircle,
  'context-resolved': MessageCircleReply,
  'continuity-maintained': Link2,
  'repeat-avoided': CheckCircle2,
}

const FLOW_STATUS_LABEL: Record<ConversationMemoryFlowStatus, string> = {
  'memory-used': 'Memory used',
  'context-resolved': 'Context resolved',
  'continuity-maintained': 'Continuity maintained',
  'repeat-avoided': 'Repeat avoided',
}

function trendClass(trend: ConversationMemoryMetric['trend']) {
  if (trend === 'up') return 'text-[#3DD68C]'
  if (trend === 'down') return 'text-[#D6A85B]'
  return 'text-[#f2f0eb]/55'
}

function trendArrow(trend: ConversationMemoryMetric['trend']) {
  if (trend === 'up') return '↑'
  if (trend === 'down') return '↓'
  return '→'
}

function MetricCard({
  metric,
  onClick,
}: {
  metric: ConversationMemoryMetric
  onClick: () => void
}) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onClick()
        }
      }}
      className="group grid h-full cursor-pointer grid-rows-[28px_28px_32px] rounded-xl border border-white/[0.07] bg-[#20202a]/70 p-3 transition hover:border-[#9aa6f0]/30 hover:bg-[#232331] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#9aa6f0]/45"
    >
      <div className="flex items-start justify-between gap-1">
        <div className="flex min-w-0 items-start gap-0.5">
          <p className="line-clamp-2 text-[10.5px] font-medium leading-snug text-[#f2f0eb]/68">
            {metric.label}
          </p>
          <div onClick={(event) => event.stopPropagation()} className="shrink-0">
            <ExplainMetricPopover explainKey={metric.explainKey} />
          </div>
        </div>
        <span className={`shrink-0 text-[10px] font-medium tabular-nums ${trendClass(metric.trend)}`}>
          {trendArrow(metric.trend)} {metric.delta ?? ''}
        </span>
      </div>
      <p className="text-[20px] font-semibold leading-none tabular-nums text-[#f2f0eb]">
        {metric.value}
      </p>
      <div className="rounded-md border border-white/[0.05] bg-white/[0.015] px-0.5 py-0.5">
        <Sparkline
          points={metric.sparkline}
          danger={metric.tone === 'critical' || metric.tone === 'watch'}
          className="h-full w-full"
        />
      </div>
    </article>
  )
}

function FlowStep({ step, isLast }: { step: ConversationMemoryFlowStep; isLast: boolean }) {
  const Icon = FLOW_STEP_ICON[step.status]
  return (
    <li className="relative flex items-start gap-2 pb-1.5 last:pb-0">
      {!isLast ? (
        <span
          aria-hidden
          className="absolute left-[10px] top-[20px] bottom-0 w-px bg-gradient-to-b from-[#9aa6f0]/25 to-transparent"
        />
      ) : null}
      <span className="relative mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-[#9aa6f0]/30 bg-[#9aa6f0]/[0.08] text-[#9aa6f0]">
        <Icon className="size-3" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <p className="text-[11px] font-medium leading-tight text-[#f2f0eb]/85">{step.label}</p>
          <span className="inline-flex items-center gap-1 rounded-full border border-[#3DD68C]/25 bg-[#3DD68C]/[0.08] px-1.5 py-[1px] text-[9px] font-medium uppercase tracking-[0.1em] text-[#3DD68C]">
            <span className="size-1 rounded-full bg-[#3DD68C]" aria-hidden />
            {FLOW_STATUS_LABEL[step.status]}
          </span>
        </div>
        <p className="mt-0.5 line-clamp-1 text-[10.5px] leading-snug text-[#f2f0eb]/55">
          {step.caption}
        </p>
      </div>
    </li>
  )
}

function RiskRow({
  risk,
  onClick,
}: {
  risk: ConversationMemoryRiskSignal
  onClick: () => void
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="group flex w-full items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.015] px-2.5 py-2 text-left transition hover:border-[#9aa6f0]/30 hover:bg-white/[0.04] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#9aa6f0]/45"
      >
        <StatusBadge
          tone={SEVERITY_TONE[risk.severity]}
          label={SEVERITY_LABEL[risk.severity]}
          className="shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11.5px] font-medium text-[#f2f0eb]/85">{risk.agentName}</p>
          <p className="line-clamp-2 text-[11px] leading-snug text-[#f2f0eb]/55">{risk.signal}</p>
        </div>
        {risk.affectedSessions ? (
          <span className="hidden shrink-0 whitespace-nowrap text-[10px] tabular-nums text-[#f2f0eb]/45 md:inline">
            {risk.affectedSessions}
          </span>
        ) : null}
        <ChevronRight className="size-3.5 shrink-0 text-[#f2f0eb]/35 transition group-hover:text-[#9aa6f0]" />
      </button>
    </li>
  )
}

export function ConversationMemorySection({
  data,
  onOpenMetric,
  onOpenRisk,
  onRunContextCheck,
  contextCheckActive,
  contextCheckGenerating,
}: ConversationMemorySectionProps) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 md:p-3.5">
      <header className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#f2f0eb]/38">Continuity</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-1">
            <h2 className="text-lg font-semibold text-[#f2f0eb]">Conversation Context &amp; Memory</h2>
            <ExplainMetricPopover explainKey="section-conversation-memory" className="shrink-0" />
          </div>
          <p className="mt-0.5 max-w-2xl text-[11px] leading-snug text-[#f2f0eb]/50">
            Tracks follow-up understanding, session continuity, and conversational memory behavior.
          </p>
        </div>
        <AISummaryButton
          label="AI Context Check"
          tooltip="Generate an AI analysis of conversational continuity and context loss."
          onClick={onRunContextCheck}
          generating={contextCheckGenerating}
          drawerOpen={contextCheckActive}
        />
      </header>

      {/* Top: 5 equal metric cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-3">
        {data.metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            metric={metric}
            onClick={() => onOpenMetric(metric.id)}
          />
        ))}
      </div>

      {/* Bottom row: Risks (~65%) + compact Multi-turn flow (~35%) */}
      <div className="mt-3 grid gap-2.5 lg:grid-cols-3 lg:gap-3">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-2.5 py-2.5 md:px-3 lg:col-span-2">
          <div className="flex items-center gap-1">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#f2f0eb]/45">
              Context risk signals
            </p>
            <ExplainMetricPopover explainKey="section-conversation-memory-risks" />
          </div>
          <ul className="mt-2 space-y-1.5">
            {data.risks.map((risk) => (
              <RiskRow key={risk.id} risk={risk} onClick={() => onOpenRisk(risk.id)} />
            ))}
          </ul>
        </div>

        <article className="flex flex-col rounded-xl border border-white/[0.07] bg-[#20202a]/70 p-2.5 transition hover:border-[#9aa6f0]/25 md:p-3 lg:col-span-1">
          <div className="flex items-start justify-between gap-1.5">
            <div className="min-w-0">
              <h3 className="text-[12.5px] font-semibold leading-tight text-[#f2f0eb]">
                Multi-turn context flow
              </h3>
              <p className="mt-0.5 line-clamp-1 text-[10px] text-[#f2f0eb]/45">{data.flow.summary}</p>
            </div>
            <ExplainMetricPopover
              explainKey="section-conversation-memory-flow"
              className="shrink-0"
            />
          </div>
          <ol className="mt-2 space-y-0.5">
            {data.flow.steps.map((step, index) => (
              <FlowStep
                key={step.id}
                step={step}
                isLast={index === data.flow.steps.length - 1}
              />
            ))}
          </ol>
        </article>
      </div>
    </section>
  )
}
