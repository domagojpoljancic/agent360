import { useEffect, useState } from 'react'
import { Activity, Clock3, RefreshCw } from 'lucide-react'
import { AISummaryButton } from '../components/AISummaryButton'
import { AISummaryContent } from '../components/AISummaryContent'
import { AISummaryDrawer } from '../components/AISummaryDrawer'
import { AISummaryLoadingState } from '../components/AISummaryLoadingState'
import { GridBackground } from '../components/GridBackground'
import { Header } from '../components/Header'
import { EnvironmentSelector } from '../components/EnvironmentSelector'
import { StatusBadge } from '../components/StatusBadge'
import { ExperimentalAssistant } from '../components/assistant/ExperimentalAssistant'
import { BusinessImpactStrip } from '../value-delivered/components/BusinessImpactStrip'
import { FleetValueMatrix } from '../value-delivered/components/FleetValueMatrix'
import { OutcomeInsights } from '../value-delivered/components/OutcomeInsights'
import { ValueAssistantSurface } from '../value-delivered/components/ValueAssistantSurface'
import { ValueInvestigationDrawer } from '../value-delivered/components/ValueInvestigationDrawer'
import { ValueOpportunityFeed } from '../value-delivered/components/ValueOpportunityFeed'
import { WorkflowImpactStories } from '../value-delivered/components/WorkflowImpactStories'
import {
  valueDeliveredData,
  valueTimeRanges,
  type ValueTimeRange,
} from '../value-delivered/data'
import {
  boardSummarySubtitle,
  valueDeliveredBoardSummary,
} from '../data/boardSummary'

export function ValueDeliveredPage() {
  const [timeRange, setTimeRange] = useState<ValueTimeRange>('30d')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedAgentId, setSelectedAgentId] = useState('support-copilot')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [summaryContentReady, setSummaryContentReady] = useState(false)

  const snapshot = valueDeliveredData[timeRange]
  const selectedAgent = snapshot.matrixRows.find((row) => row.id === selectedAgentId) ?? snapshot.matrixRows[0]

  useEffect(() => {
    if (!summaryOpen || summaryContentReady) return
    const id = window.setTimeout(() => setSummaryContentReady(true), 2600)
    return () => window.clearTimeout(id)
  }, [summaryOpen, summaryContentReady])

  const updatedAt = new Intl.DateTimeFormat('en', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date())

  function onRefresh() {
    setIsRefreshing(true)
    window.setTimeout(() => setIsRefreshing(false), 850)
  }

  function onSelectAgent(agentId: string) {
    setSelectedAgentId(agentId)
    setDrawerOpen(true)
  }

  function openSummary() {
    setSummaryContentReady(false)
    setSummaryOpen(true)
  }

  function closeSummary() {
    setSummaryOpen(false)
    setSummaryContentReady(false)
  }

  return (
    <div className="relative min-h-screen overflow-x-clip text-[#f2f0eb]">
      <GridBackground variant="page" />
      <div className="relative z-10">
        <Header />
        <main className="mx-auto max-w-7xl space-y-4 px-4 pb-20 pt-8 md:px-6">
          <section className="relative isolate overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 md:p-5">
            <div aria-hidden className="pointer-events-none absolute right-8 top-0 -z-10 h-48 w-64 rounded-full bg-[#5DC2A8]/[0.10] blur-3xl" />
            <div className="flex items-start justify-between gap-4 md:gap-6">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">
                  Agent360 / Value Delivered
                </p>
                <h1 className="mt-1 text-[30px] font-semibold tracking-tight text-[#f2f0eb] md:text-[38px]">
                  Value Delivered
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#f2f0eb]/64">
                  Measure how AI agents improve operations, customer experience, and business outcomes across the organization.
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 md:flex-nowrap md:gap-2">
                <div className="shrink-0 whitespace-nowrap">
                  <EnvironmentSelector />
                </div>
                <StatusBadge
                  className="shrink-0 whitespace-nowrap"
                  label="Live Value"
                  tone="live"
                  icon={<Activity className="size-3.5" />}
                />
                <span className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-[11px] text-[#f2f0eb]/65">
                  <Clock3 className="size-3.5 shrink-0" />
                  Updated {updatedAt}
                </span>
                <button
                  type="button"
                  onClick={onRefresh}
                  className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md border border-[#5DC2A8]/35 bg-[#5DC2A8]/10 px-2.5 py-1.5 text-[12px] text-[#f2f0eb] transition hover:border-[#5DC2A8]/70 hover:bg-[#5DC2A8]/15"
                >
                  <RefreshCw className={`size-3.5 shrink-0 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex rounded-lg border border-white/[0.08] bg-[#1f1f29]/75 p-1">
                {valueTimeRanges.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTimeRange(item)}
                    className={`rounded-md px-3 py-1 text-[11px] font-medium transition ${
                      timeRange === item
                        ? 'bg-[#5DC2A8]/20 text-[#f2f0eb]'
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
                onClick={openSummary}
              />
            </div>
          </section>

          <BusinessImpactStrip metrics={snapshot.overview} />

          <FleetValueMatrix
            rows={snapshot.matrixRows}
            selectedAgentId={selectedAgentId}
            onSelectAgent={onSelectAgent}
          />

          <OutcomeInsights insights={snapshot.insights} />

          <WorkflowImpactStories stories={snapshot.workflowStories} />

          <ValueOpportunityFeed opportunities={snapshot.opportunities} />

          <ExperimentalAssistant>
            {({ onSubmit }) => <ValueAssistantSurface onSubmit={onSubmit} />}
          </ExperimentalAssistant>
        </main>
      </div>

      <ValueInvestigationDrawer
        agent={selectedAgent}
        workflowStories={snapshot.workflowStories}
        opportunities={snapshot.opportunities}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      <AISummaryDrawer
        open={summaryOpen}
        onClose={closeSummary}
        subtitle={boardSummarySubtitle(timeRange)}
        contentReady={summaryContentReady}
        loading={<AISummaryLoadingState />}
      >
        <AISummaryContent sections={valueDeliveredBoardSummary} />
      </AISummaryDrawer>
    </div>
  )
}
