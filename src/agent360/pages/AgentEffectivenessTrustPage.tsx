import { useEffect, useState } from 'react'
import { Activity, Clock3, RefreshCw } from 'lucide-react'
import { Agent360Footer } from '../components/Agent360Footer'
import { GridBackground } from '../components/GridBackground'
import { Header } from '../components/Header'
import { StatusBadge } from '../components/StatusBadge'
import { EnvironmentSelector } from '../components/EnvironmentSelector'
import { trustData, trustTimeRanges, type TrustInvestigation } from '../agent-effectiveness-trust/data'
import type { TimeRange } from '../operational-health/data'
import { TrustOverviewStrip } from '../agent-effectiveness-trust/components/TrustOverviewStrip'
import { FleetTrustMatrix } from '../agent-effectiveness-trust/components/FleetTrustMatrix'
import { TrustSignalsSection } from '../agent-effectiveness-trust/components/TrustSignalsSection'
import { PromptPerformanceSection } from '../agent-effectiveness-trust/components/PromptPerformanceSection'
import { ConversationMemorySection } from '../agent-effectiveness-trust/components/ConversationMemorySection'
import { ConversationExplorer } from '../agent-effectiveness-trust/components/ConversationExplorer'
import { TrustTrendsAdoption } from '../agent-effectiveness-trust/components/TrustTrendsAdoption'
import { InvestigationDrawer } from '../agent-effectiveness-trust/components/InvestigationDrawer'
import { AISummaryButton } from '../components/AISummaryButton'
import { AISummaryContent } from '../components/AISummaryContent'
import { AISummaryDrawer } from '../components/AISummaryDrawer'
import { AISummaryLoadingState } from '../components/AISummaryLoadingState'
import {
  agentEffectivenessTrustBoardSummary,
  aiContextCheckSubtitle,
  boardSummarySubtitle,
  conversationMemoryAIContextCheck,
} from '../data/boardSummary'
import { getPageTheme } from '../data/pageThemes'

const pageTheme = getPageTheme('agent-effectiveness-trust')

type DrawerTarget =
  | { type: 'agent'; id: string }
  | { type: 'conversation'; id: string }
  | { type: 'signal'; id: string }
  | { type: 'memory-metric'; id: string }
  | { type: 'memory-risk'; id: string }

const SEVERITY_TREND_LABEL = {
  critical: 'Critical continuity risk',
  warning: 'Continuity warning',
  info: 'Continuity update',
} as const

function buildInvestigation({
  snapshot,
  target,
}: {
  snapshot: (typeof trustData)[TimeRange]
  target: DrawerTarget
}): TrustInvestigation | null {
  if (target.type === 'agent') {
    const agent = snapshot.matrixRows.find((item) => item.id === target.id)
    const conversation = snapshot.conversations.find((item) => item.agentId === target.id) ?? snapshot.conversations[0]
    if (!agent || !conversation) return null
    return {
      id: `agent-${agent.id}`,
      sourceType: 'agent',
      agentId: agent.id,
      agentName: agent.agent,
      trustScore: agent.trustScore,
      status: agent.status,
      trendLabel: `Trust Trend ${agent.trustTrend[0]} -> ${agent.trustTrend[agent.trustTrend.length - 1]}`,
      conversationSnapshot: {
        userQuestion: conversation.userQuestion,
        aiResponse: conversation.aiResponse,
        outcome: conversation.outcome,
      },
      trustAnalysis: [
        `Friction: ${agent.signal}. Retry/clarification ${agent.retryClarification}; escalations ${agent.escalations}.`,
        ...(agent.internalHumanEditRate
          ? [`Internal copilot draft edit rate: ${agent.internalHumanEditRate} (tooling metric—compare only within internal agents).`]
          : []),
        `Trusted replies ${agent.trustedResponses}; high-confidence failures ${agent.highConfidenceFails}.`,
        `CSAT ${agent.userSatisfaction}/5 · operational index ${agent.trustScore}.`,
      ],
      humanIntervention: conversation.interventionSummary,
      suggestedImprovements: conversation.suggestedImprovements,
      relatedTrends: snapshot.trends,
    }
  }
  if (target.type === 'conversation') {
    const conversation = snapshot.conversations.find((item) => item.id === target.id)
    if (!conversation) return null
    const agent = snapshot.matrixRows.find((item) => item.id === conversation.agentId) ?? snapshot.matrixRows[0]
    return {
      id: `conversation-${conversation.id}`,
      sourceType: 'conversation',
      agentId: conversation.agentId,
      agentName: conversation.agent,
      trustScore: agent?.trustScore ?? 80,
      status: agent?.status ?? 'Watch',
      trendLabel: `Conversation ${conversation.status}`,
      conversationSnapshot: {
        userQuestion: conversation.userQuestion,
        aiResponse: conversation.aiResponse,
        outcome: conversation.outcome,
      },
      trustAnalysis: [
        `Trust impact: ${conversation.trustImpact}.`,
        `Human signal: ${conversation.humanIntervention}`,
        `Agent index ${agent?.trustScore ?? 80} · status ${agent?.status ?? 'Watch'}.`,
      ],
      humanIntervention: conversation.interventionSummary,
      suggestedImprovements: conversation.suggestedImprovements,
      relatedTrends: snapshot.trends,
    }
  }

  if (target.type === 'memory-metric') {
    const metric = snapshot.conversationMemory.metrics.find((item) => item.id === target.id)
    const conversation = snapshot.conversations[0]
    const agent = snapshot.matrixRows.find((item) => item.id === conversation.agentId) ?? snapshot.matrixRows[0]
    if (!metric || !conversation || !agent) return null
    return {
      id: `memory-metric-${metric.id}`,
      sourceType: 'signal',
      agentId: agent.id,
      agentName: `Conversation memory · ${metric.label}`,
      trustScore: agent.trustScore,
      status: agent.status,
      trendLabel: `${metric.label} ${metric.value}${metric.delta ? ` · ${metric.delta}` : ''}`,
      conversationSnapshot: {
        userQuestion: snapshot.conversationMemory.flow.steps[0]?.caption ?? conversation.userQuestion,
        aiResponse:
          snapshot.conversationMemory.flow.steps[snapshot.conversationMemory.flow.steps.length - 1]?.caption ??
          conversation.aiResponse,
        outcome: `${metric.label}: ${metric.value}${metric.delta ? ` (${metric.delta})` : ''}`,
      },
      trustAnalysis: [
        `${metric.label} stands at ${metric.value}${metric.delta ? ` (${metric.delta} vs prior)` : ''}.`,
        `Trend: ${metric.trend === 'up' ? 'improving' : metric.trend === 'down' ? 'softening' : 'flat'} across the selected range.`,
        'Pair with retry/clarification and high-confidence failure signals before changing prompts.',
      ],
      humanIntervention: snapshot.conversationMemory.risks
        .slice(0, 3)
        .map((risk) => `${risk.agentName}: ${risk.signal}`),
      suggestedImprovements: [
        'Sample 5–10 long threads tied to this metric and review entity-grounding quality.',
        'Confirm summarization or memory window settings for affected agents.',
        'If metric persists, route long threads to a longer-context model tier.',
      ],
      relatedTrends: snapshot.trends,
    }
  }

  if (target.type === 'memory-risk') {
    const risk = snapshot.conversationMemory.risks.find((item) => item.id === target.id)
    if (!risk) return null
    const agent = snapshot.matrixRows.find((item) => item.id === risk.agentId) ?? snapshot.matrixRows[0]
    const conversation =
      snapshot.conversations.find((item) => item.agentId === risk.agentId) ?? snapshot.conversations[0]
    return {
      id: `memory-risk-${risk.id}`,
      sourceType: 'signal',
      agentId: risk.agentId,
      agentName: risk.agentName,
      trustScore: agent?.trustScore ?? 80,
      status: agent?.status ?? 'Watch',
      trendLabel: `${SEVERITY_TREND_LABEL[risk.severity]}${risk.affectedSessions ? ` · ${risk.affectedSessions}` : ''}`,
      conversationSnapshot: {
        userQuestion: conversation.userQuestion,
        aiResponse: conversation.aiResponse,
        outcome: risk.signal,
      },
      trustAnalysis: [
        risk.signal,
        ...(risk.affectedSessions ? [`Affected scope: ${risk.affectedSessions}.`] : []),
        'Continuity signals weigh into trust alongside retry/clarification and escalations.',
      ],
      humanIntervention: conversation.interventionSummary,
      suggestedImprovements: conversation.suggestedImprovements,
      relatedTrends: snapshot.trends,
    }
  }

  const signal = snapshot.trustSignals.find((item) => item.id === target.id)
  const conversation = snapshot.conversations[0]
  const agent = snapshot.matrixRows.find((item) => item.id === conversation.agentId) ?? snapshot.matrixRows[0]
  if (!signal || !conversation || !agent) return null
  return {
    id: `signal-${signal.id}`,
    sourceType: 'signal',
    agentId: conversation.agentId,
    agentName: agent.agent,
    trustScore: agent.trustScore,
    status: agent.status,
    trendLabel: signal.metricLabel,
    conversationSnapshot: {
      userQuestion: conversation.userQuestion,
      aiResponse: conversation.aiResponse,
      outcome: signal.insightLine ?? `${signal.metricLabel} ${signal.metricValue}`,
    },
    trustAnalysis: [
      ...(signal.insightLine ? [signal.insightLine] : []),
      `${signal.metricLabel}: ${signal.metricValue}.`,
    ],
    humanIntervention: conversation.interventionSummary,
    suggestedImprovements: conversation.suggestedImprovements,
    relatedTrends: snapshot.trends,
  }
}

export function AgentEffectivenessTrustPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [summaryContentReady, setSummaryContentReady] = useState(false)
  const [contextCheckOpen, setContextCheckOpen] = useState(false)
  const [contextCheckReady, setContextCheckReady] = useState(false)
  const [drawerTarget, setDrawerTarget] = useState<DrawerTarget>({ type: 'agent', id: 'support-copilot' })

  useEffect(() => {
    if (!summaryOpen) {
      setSummaryContentReady(false)
      return
    }
    setSummaryContentReady(false)
    const id = window.setTimeout(() => setSummaryContentReady(true), 2600)
    return () => window.clearTimeout(id)
  }, [summaryOpen])

  useEffect(() => {
    if (!contextCheckOpen) {
      setContextCheckReady(false)
      return
    }
    setContextCheckReady(false)
    const id = window.setTimeout(() => setContextCheckReady(true), 2600)
    return () => window.clearTimeout(id)
  }, [contextCheckOpen])

  const snapshot = trustData[timeRange]
  const investigation = buildInvestigation({ snapshot, target: drawerTarget })

  const updatedAt = new Intl.DateTimeFormat('en', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())

  function onRefresh() {
    setIsRefreshing(true)
    window.setTimeout(() => setIsRefreshing(false), 850)
  }

  return (
    <div className="relative flex min-h-screen flex-col text-[#f2f0eb]">
      <GridBackground variant="page" pageAccent="agent-effectiveness-trust" />
      <div className="relative z-10 flex flex-1 flex-col">
        <Header />
        <main className="mx-auto max-w-7xl flex-1 space-y-4 px-4 pb-12 pt-8 md:px-6 md:pb-14">
          <section className={pageTheme.heroSection}>
            <div aria-hidden className={pageTheme.heroTopLine} />
            <div aria-hidden className={pageTheme.heroGlowRight} />
            <div aria-hidden className={pageTheme.heroGlowLeft} />
            <div className="flex items-start justify-between gap-4 md:gap-6">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">
                  Agent360 / Agent Effectiveness & Trust
                </p>
                <h1 className="mt-1 text-[28px] font-semibold tracking-tight text-[#f2f0eb] md:text-[34px]">
                  Agent Effectiveness & Trust
                </h1>
                <p className="mt-1 text-sm text-[#f2f0eb]/62">
                  Operational trust: who relies on agents, where humans step in, and where confidence breaks.
                </p>
                <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-[#f2f0eb]/48">
                  <span className="text-[#f2f0eb]/55">Time range:</span> 1h, 24h, and 7d for behavior and handoff patterns.
                  Value Delivered uses longer windows (through 30d) for outcome-level impact.
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 md:flex-nowrap md:gap-2">
                <div className="shrink-0 whitespace-nowrap">
                  <EnvironmentSelector />
                </div>
                <StatusBadge
                  className="shrink-0 whitespace-nowrap"
                  label="Live Pulse"
                  tone="live"
                  icon={<Activity className="size-3.5" />}
                />
                <StatusBadge className="shrink-0 whitespace-nowrap" label="Auto-refresh" tone="success" />
                <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/[0.08] bg-white/[0.02] px-2 py-1 text-[11px] text-[#f2f0eb]/65 md:px-2.5">
                  <Clock3 className="size-3.5 shrink-0" />
                  Updated {updatedAt}
                </span>
                <button type="button" onClick={onRefresh} className={pageTheme.refreshButton}>
                  <RefreshCw className={`size-3.5 shrink-0 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex rounded-lg border border-white/[0.08] bg-[#1f1f29]/75 p-1">
                {trustTimeRanges.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTimeRange(item)}
                    className={`rounded-md px-3 py-1 text-[11px] font-medium transition ${
                      timeRange === item
                        ? pageTheme.timeRangeActive
                        : 'text-[#f2f0eb]/55 hover:text-[#f2f0eb]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <AISummaryButton
                drawerOpen={summaryOpen}
                generating={summaryOpen && !summaryContentReady}
                onClick={() => setSummaryOpen(true)}
              />
            </div>
          </section>

          <TrustOverviewStrip metrics={snapshot.overview} theme={pageTheme} />
          <FleetTrustMatrix
            rows={snapshot.matrixRows}
            selectedAgentId={drawerTarget.type === 'agent' ? drawerTarget.id : null}
            onSelectAgent={(id) => {
              setDrawerTarget({ type: 'agent', id })
              setDrawerOpen(true)
            }}
          />
          <TrustSignalsSection
            cards={snapshot.trustSignals}
            onOpenSignal={(id) => {
              setDrawerTarget({ type: 'signal', id })
              setDrawerOpen(true)
            }}
          />
          <ConversationExplorer
            rows={snapshot.conversations}
            onSelectConversation={(id) => {
              setDrawerTarget({ type: 'conversation', id })
              setDrawerOpen(true)
            }}
          />
          <TrustTrendsAdoption series={snapshot.trends} />
          <PromptPerformanceSection data={snapshot.promptPerformance} />
          <ConversationMemorySection
            data={snapshot.conversationMemory}
            onOpenMetric={(id) => {
              setDrawerTarget({ type: 'memory-metric', id })
              setDrawerOpen(true)
            }}
            onOpenRisk={(id) => {
              setDrawerTarget({ type: 'memory-risk', id })
              setDrawerOpen(true)
            }}
            onRunContextCheck={() => setContextCheckOpen(true)}
            contextCheckActive={contextCheckOpen}
            contextCheckGenerating={contextCheckOpen && !contextCheckReady}
          />
        </main>

        <Agent360Footer />
      </div>

      <InvestigationDrawer
        investigation={investigation}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <AISummaryDrawer
        open={summaryOpen}
        onClose={() => setSummaryOpen(false)}
        subtitle={boardSummarySubtitle(timeRange)}
        contentReady={summaryContentReady}
        loading={<AISummaryLoadingState />}
      >
        <AISummaryContent sections={agentEffectivenessTrustBoardSummary} />
      </AISummaryDrawer>

      <AISummaryDrawer
        open={contextCheckOpen}
        onClose={() => setContextCheckOpen(false)}
        title="AI Context Check"
        subtitle={`${aiContextCheckSubtitle} · ${boardSummarySubtitle(timeRange)}`}
        contentReady={contextCheckReady}
        loading={
          <AISummaryLoadingState
            steps={[
              'Sampling multi-turn conversations…',
              'Checking follow-up and reference resolution…',
              'Scoring continuity and repeat-prompt signals…',
              'Preparing context check summary…',
            ]}
          />
        }
      >
        <AISummaryContent sections={conversationMemoryAIContextCheck} />
      </AISummaryDrawer>
    </div>
  )
}
