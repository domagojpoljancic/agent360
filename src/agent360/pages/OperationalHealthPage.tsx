import { useEffect, useMemo, useState } from 'react'
import { Activity, Clock3, RefreshCw } from 'lucide-react'
import { GridBackground } from '../components/GridBackground'
import { Header } from '../components/Header'
import { StatusBadge } from '../components/StatusBadge'
import { EnvironmentSelector } from '../components/EnvironmentSelector'
import {
  operationalHealthData,
  timeRanges,
  type TimeRange,
} from '../operational-health/data'
import { FleetStatusStrip } from '../operational-health/components/FleetStatusStrip'
import { FleetHealthMatrix } from '../operational-health/components/FleetHealthMatrix'
import { ProviderHealthTable } from '../operational-health/components/ProviderHealthTable'
import { KnowledgeRetrievalSection } from '../operational-health/components/KnowledgeRetrievalSection'
import { InvestigationDrawer } from '../operational-health/components/InvestigationDrawer'
import { AISummaryButton } from '../components/AISummaryButton'
import { AISummaryContent } from '../components/AISummaryContent'
import { AISummaryDrawer } from '../components/AISummaryDrawer'
import { AISummaryLoadingState } from '../components/AISummaryLoadingState'
import {
  AISummaryBulletSection,
  AISummaryCard,
  AISummaryFooter,
  AISummarySectionStack,
} from '../components/AISummarySections'
import {
  boardSummarySubtitle,
  operationalHealthBoardSummary,
} from '../data/boardSummary'
import { navigate } from '../router'

export function OperationalHealthPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [summaryContentReady, setSummaryContentReady] = useState(false)
  const [providerCheckOpen, setProviderCheckOpen] = useState(false)
  const [providerCheckReady, setProviderCheckReady] = useState(false)
  const [retrievalCheckOpen, setRetrievalCheckOpen] = useState(false)
  const [retrievalCheckReady, setRetrievalCheckReady] = useState(false)
  const [selectedAgentId, setSelectedAgentId] = useState('shopping-concierge')

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
    if (!providerCheckOpen) {
      setProviderCheckReady(false)
      return
    }
    setProviderCheckReady(false)
    const id = window.setTimeout(() => setProviderCheckReady(true), 2400)
    return () => window.clearTimeout(id)
  }, [providerCheckOpen])

  useEffect(() => {
    if (!retrievalCheckOpen) {
      setRetrievalCheckReady(false)
      return
    }
    setRetrievalCheckReady(false)
    const id = window.setTimeout(() => setRetrievalCheckReady(true), 2450)
    return () => window.clearTimeout(id)
  }, [retrievalCheckOpen])

  const snapshot = operationalHealthData[timeRange]
  const selectedAgent =
    snapshot.fleetRows.find((agent) => agent.id === selectedAgentId) ?? snapshot.fleetRows[0]

  const updatedAt = useMemo(
    () =>
      new Intl.DateTimeFormat('en', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date()),
    [isRefreshing],
  )

  function onRefresh() {
    setIsRefreshing(true)
    window.setTimeout(() => setIsRefreshing(false), 850)
  }

  function onSelectAgent(agentId: string) {
    setSelectedAgentId(agentId)
    setDrawerOpen(true)
  }

  return (
    <div className="relative min-h-screen text-[#f2f0eb]">
      <GridBackground variant="page" />
      <div className="relative z-10">
        <Header />
        <main className="mx-auto max-w-7xl space-y-4 px-4 pb-20 pt-8 md:px-6">
          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 md:p-5">
            <div className="flex items-start justify-between gap-4 md:gap-6">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">
                  Agent360 / Operational Health
                </p>
                <h1 className="mt-1 text-[28px] font-semibold tracking-tight text-[#f2f0eb] md:text-[34px]">
                  Operational Health
                </h1>
                <p className="mt-1 text-sm text-[#f2f0eb]/62">
                  Monitor the reliability and runtime health of the AI agent fleet.
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
                <button
                  type="button"
                  onClick={onRefresh}
                  className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md border border-[#3694fc]/35 bg-[#3694fc]/10 px-2 py-1 text-[12px] text-[#f2f0eb] transition hover:border-[#3694fc]/70 md:px-2.5"
                >
                  <RefreshCw className={`size-3.5 shrink-0 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex rounded-lg border border-white/[0.08] bg-[#1f1f29]/75 p-1">
                {timeRanges.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTimeRange(item)}
                    className={`rounded-md px-3 py-1 text-[11px] font-medium transition ${
                      timeRange === item
                        ? 'bg-[#3694fc]/20 text-[#f2f0eb]'
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

          <FleetStatusStrip metrics={snapshot.fleetMetrics} />

          <FleetHealthMatrix
            rows={snapshot.fleetRows}
            selectedAgentId={selectedAgent?.id ?? null}
            onSelectAgent={onSelectAgent}
          />
          <ProviderHealthTable
            rows={snapshot.providerHealthRows}
            onOpenModelComparison={() => navigate('/model-comparison')}
            onOpenAiCheck={() => setProviderCheckOpen(true)}
            aiCheckOpen={providerCheckOpen}
            aiCheckGenerating={providerCheckOpen && !providerCheckReady}
          />
          <KnowledgeRetrievalSection
            metrics={snapshot.retrievalMetrics}
            sources={snapshot.knowledgeSources}
            onOpenRetrievalComparison={() => navigate('/retrieval-comparison')}
            onOpenAiRetrievalCheck={() => setRetrievalCheckOpen(true)}
            aiRetrievalCheckOpen={retrievalCheckOpen}
            aiRetrievalCheckGenerating={retrievalCheckOpen && !retrievalCheckReady}
          />
        </main>
      </div>

      <InvestigationDrawer
        agent={selectedAgent}
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
        <AISummaryContent sections={operationalHealthBoardSummary} />
      </AISummaryDrawer>

      <AISummaryDrawer
        open={providerCheckOpen}
        onClose={() => setProviderCheckOpen(false)}
        title="AI Provider Analysis"
        subtitle="Generated from current runtime health data"
        badgeLabel="AI-generated analysis"
        contentReady={providerCheckReady}
        loading={
          <AISummaryLoadingState
            steps={[
              'Analyzing provider latency…',
              'Comparing runtime stability…',
              'Reviewing model performance patterns…',
              'Generating optimization recommendations…',
            ]}
          />
        }
      >
        <AISummarySectionStack>
          <AISummaryCard className="border-[#3694fc]/25 bg-gradient-to-br from-[#3694fc]/[0.12] via-[#3694fc]/[0.04] to-transparent shadow-[inset_0_1px_0_0_rgba(138,190,252,0.12)]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8abefc]/90">Overall assessment</p>
            <p className="mt-2 text-[14px] font-medium leading-relaxed text-[#f2f0eb]">
              Current provider performance is stable overall, with strong latency behavior from
              lightweight models and elevated response times on high-capacity models.
            </p>
          </AISummaryCard>

          <AISummaryBulletSection
            title="Best performing models"
            items={[
              'GPT-4o-mini continues to provide the lowest average latency across production workloads.',
              'Gemini 1.5 Flash shows strong throughput consistency during peak traffic.',
              'Claude 3 Haiku remains stable for low-complexity interactions.',
            ]}
          />

          <AISummaryBulletSection
            title="Models requiring attention"
            items={[
              'Claude 3 Opus shows elevated p95 latency during peak periods.',
              'GPT-4 Turbo demonstrates increased timeout rates under high concurrent load.',
              'Higher retry rates are observed for long-context requests.',
            ]}
          />

          <AISummaryBulletSection
            title="Suggested operational optimizations"
            items={[
              'Route low-complexity workflows to GPT-4o-mini for improved responsiveness.',
              'Reserve high-capacity models for long-context or reasoning-heavy workflows.',
              'Monitor provider latency distribution across EU traffic regions.',
            ]}
          />

          <AISummaryFooter text="AI-generated analysis · Based on current runtime metrics · Last updated 2 min ago" />
        </AISummarySectionStack>
      </AISummaryDrawer>

      <AISummaryDrawer
        open={retrievalCheckOpen}
        onClose={() => setRetrievalCheckOpen(false)}
        title="AI Retrieval Analysis"
        subtitle="Generated from current retrieval runtime data"
        badgeLabel="AI-generated analysis"
        contentReady={retrievalCheckReady}
        loading={
          <AISummaryLoadingState
            steps={[
              'Analyzing retrieval latency…',
              'Reviewing embedding performance…',
              'Evaluating vector search behavior…',
              'Generating retrieval recommendations…',
            ]}
          />
        }
      >
        <AISummarySectionStack>
          <AISummaryCard className="border-[#3694fc]/25 bg-gradient-to-br from-[#3694fc]/[0.12] via-[#3694fc]/[0.04] to-transparent shadow-[inset_0_1px_0_0_rgba(138,190,252,0.12)]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8abefc]/90">Overall assessment</p>
            <p className="mt-2 text-[14px] font-medium leading-relaxed text-[#f2f0eb]">
              Retrieval infrastructure remains stable overall, with strong query availability and healthy
              embedding response times across most production workloads.
            </p>
          </AISummaryCard>

          <AISummaryBulletSection
            title="Best performing retrieval systems"
            items={[
              'text-embedding-3-small continues to provide strong low-latency retrieval behavior.',
              'Qdrant maintains stable query latency during peak workload periods.',
              'Hybrid retrieval improves relevance for long-form support documentation.',
            ]}
          />

          <AISummaryBulletSection
            title="Retrieval systems requiring attention"
            items={[
              'Pinecone query latency increases under high concurrent traffic.',
              'Embedding dimensionality overhead impacts storage efficiency for large indexes.',
              'Retrieval timeout spikes are detected in EU knowledge clusters.',
            ]}
          />

          <AISummaryBulletSection
            title="Suggested retrieval optimizations"
            items={[
              'Route FAQ workflows to smaller embedding models for lower retrieval cost.',
              'Reduce chunk overlap to minimize token overhead.',
              'Enable reranking only for high-complexity knowledge retrieval.',
            ]}
          />

          <AISummaryFooter text="AI-generated retrieval analysis · Based on current retrieval metrics · Last updated 2 min ago" />
        </AISummarySectionStack>
      </AISummaryDrawer>
    </div>
  )
}
