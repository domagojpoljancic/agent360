import { useEffect, useState } from 'react'
import { Activity, Clock3, RefreshCw } from 'lucide-react'
import { AISummaryButton } from '../components/AISummaryButton'
import { AISummaryContent } from '../components/AISummaryContent'
import { AISummaryDrawer } from '../components/AISummaryDrawer'
import { AISummaryLoadingState } from '../components/AISummaryLoadingState'
import { Agent360Footer } from '../components/Agent360Footer'
import { GridBackground } from '../components/GridBackground'
import { Header } from '../components/Header'
import { EnvironmentSelector } from '../components/EnvironmentSelector'
import { StatusBadge } from '../components/StatusBadge'
import { boardSummarySubtitle, costOptimizationBoardSummary } from '../data/boardSummary'
import { CostOverviewStrip } from '../cost-optimization/components/CostOverviewStrip'
import { CurrentModelCosts } from '../cost-optimization/components/CurrentModelCosts'
import { FleetCostMatrix } from '../cost-optimization/components/FleetCostMatrix'
import { ModelRoutingSection } from '../cost-optimization/components/ModelRoutingSection'
import { OptimizationOpportunities } from '../cost-optimization/components/OptimizationOpportunities'
import { SavingsSimulation } from '../cost-optimization/components/SavingsSimulation'
import { AgentCostInvestigationDrawer } from '../cost-optimization/components/AgentCostInvestigationDrawer'
import { costOptimizationData, timeRanges, type TimeRange } from '../cost-optimization/data'
import { getPageTheme } from '../data/pageThemes'

const pageTheme = getPageTheme('cost-optimization')

export function CostOptimizationPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdatedAt, setLastUpdatedAt] = useState(() => Date.now())
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedAgentId, setSelectedAgentId] = useState('shopping-concierge')
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [summaryContentReady, setSummaryContentReady] = useState(false)

  const snapshot = costOptimizationData[timeRange]
  const selectedAgent =
    snapshot.fleetCostRows.find((row) => row.id === selectedAgentId) ?? snapshot.fleetCostRows[0]

  useEffect(() => {
    if (!summaryOpen) {
      setSummaryContentReady(false)
      return
    }
    setSummaryContentReady(false)
    const id = window.setTimeout(() => setSummaryContentReady(true), 2600)
    return () => window.clearTimeout(id)
  }, [summaryOpen])

  const updatedAt = new Intl.DateTimeFormat('en', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(lastUpdatedAt))

  function onRefresh() {
    setIsRefreshing(true)
    window.setTimeout(() => {
      setIsRefreshing(false)
      setLastUpdatedAt(Date.now())
    }, 850)
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
    <div className="relative flex min-h-screen flex-col text-[#f2f0eb]">
      <GridBackground variant="page" pageAccent="cost-optimization" />
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
                  Agent360 / Cost Optimization
                </p>
                <h1 className="mt-1 text-[28px] font-semibold tracking-tight text-[#f2f0eb] md:text-[34px]">
                  Cost Optimization
                </h1>
                <p className="mt-1 max-w-3xl text-sm text-[#f2f0eb]/62">
                  Optimize AI spend by matching the right model and resources to the right task.
                </p>
                <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-[#f2f0eb]/48">
                  <span className="text-[#f2f0eb]/55">Time range:</span> 1h, 24h, and 7d for spend and routing signals.
                  Value Delivered uses longer windows (through 30d) for business-outcome rollups.
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 md:flex-nowrap md:gap-2">
                <div className="shrink-0 whitespace-nowrap">
                  <EnvironmentSelector />
                </div>
                <StatusBadge
                  className="shrink-0 whitespace-nowrap"
                  label="Live Signals"
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
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 md:mt-4">
              <div className="inline-flex rounded-lg border border-white/[0.08] bg-[#1f1f29]/75 p-1">
                {timeRanges.map((item) => (
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
                onClick={openSummary}
              />
            </div>
          </section>

          <CostOverviewStrip metrics={snapshot.overviewMetrics} theme={pageTheme} />

          <FleetCostMatrix
            rows={snapshot.fleetCostRows}
            selectedAgentId={selectedAgent?.id ?? null}
            onSelectAgent={onSelectAgent}
          />

          <CurrentModelCosts />

          <SavingsSimulation scenarios={snapshot.savingsScenarios} />

          <OptimizationOpportunities opportunities={snapshot.opportunities} timeRange={timeRange} />

          <ModelRoutingSection
            routingSummaryKpis={snapshot.routingSummaryKpis}
            routingComplexityBuckets={snapshot.routingComplexityBuckets}
            topRoutingSignals={snapshot.topRoutingSignals}
          />
        </main>

        <Agent360Footer />
      </div>

      <AgentCostInvestigationDrawer
        agent={selectedAgent}
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
        <AISummaryContent sections={costOptimizationBoardSummary} />
      </AISummaryDrawer>
    </div>
  )
}
