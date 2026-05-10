import { useEffect, useState } from 'react'
import { Activity, Clock3, RefreshCw } from 'lucide-react'
import { Agent360Footer } from '../components/Agent360Footer'
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
import { PromptRuntimeSection } from '../operational-health/components/PromptRuntimeSection'
import { ApiToolRuntimeSection } from '../operational-health/components/ApiToolRuntimeSection'
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
import { getPageTheme } from '../data/pageThemes'

const pageTheme = getPageTheme('operational-health')

export function OperationalHealthPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdatedAt, setLastUpdatedAt] = useState(() => Date.now())
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [summaryContentReady, setSummaryContentReady] = useState(false)
  const [providerCheckOpen, setProviderCheckOpen] = useState(false)
  const [providerCheckReady, setProviderCheckReady] = useState(false)
  const [retrievalCheckOpen, setRetrievalCheckOpen] = useState(false)
  const [retrievalCheckReady, setRetrievalCheckReady] = useState(false)
  const [apiCheckOpen, setApiCheckOpen] = useState(false)
  const [apiCheckReady, setApiCheckReady] = useState(false)
  const [promptCheckOpen, setPromptCheckOpen] = useState(false)
  const [promptCheckReady, setPromptCheckReady] = useState(false)
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

  useEffect(() => {
    if (!apiCheckOpen) {
      setApiCheckReady(false)
      return
    }
    setApiCheckReady(false)
    const id = window.setTimeout(() => setApiCheckReady(true), 2500)
    return () => window.clearTimeout(id)
  }, [apiCheckOpen])

  useEffect(() => {
    if (!promptCheckOpen) {
      setPromptCheckReady(false)
      return
    }
    setPromptCheckReady(false)
    const id = window.setTimeout(() => setPromptCheckReady(true), 2600)
    return () => window.clearTimeout(id)
  }, [promptCheckOpen])

  const snapshot = operationalHealthData[timeRange]
  const selectedAgent =
    snapshot.fleetRows.find((agent) => agent.id === selectedAgentId) ?? snapshot.fleetRows[0]

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

  return (
    <div className="relative flex min-h-screen flex-col text-[#f2f0eb]">
      <GridBackground variant="page" pageAccent="operational-health" />
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
                  Agent360 / Operational Health
                </p>
                <h1 className="mt-1 text-[28px] font-semibold tracking-tight text-[#f2f0eb] md:text-[34px]">
                  Operational Health
                </h1>
                <p className="mt-1 text-sm text-[#f2f0eb]/62">
                  Monitor the reliability and runtime health of the AI agent fleet.
                </p>
                <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-[#f2f0eb]/48">
                  <span className="text-[#f2f0eb]/55">Time range:</span> 1h, 24h, and 7d for latency, errors, and provider health.
                  Value Delivered uses longer windows (through 30d) when tying reliability to business outcomes.
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
                onClick={() => setSummaryOpen(true)}
              />
            </div>
          </section>

          <FleetStatusStrip metrics={snapshot.fleetMetrics} theme={pageTheme} />

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
          <PromptRuntimeSection
            data={snapshot.promptRuntime}
            onOpenAiPromptCheck={() => setPromptCheckOpen(true)}
            aiPromptCheckOpen={promptCheckOpen}
            aiPromptCheckGenerating={promptCheckOpen && !promptCheckReady}
          />
          <ApiToolRuntimeSection
            apiRows={snapshot.apiToolRows}
            incidents={snapshot.apiRuntimeIncidents}
            overview={snapshot.apiRuntimeOverview}
            timeRange={timeRange}
            onOpenApiOverview={() => navigate('/api-overview')}
            onOpenAiApiCheck={() => setApiCheckOpen(true)}
            aiApiCheckOpen={apiCheckOpen}
            aiApiCheckGenerating={apiCheckOpen && !apiCheckReady}
          />
        </main>

        <Agent360Footer />
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

      <AISummaryDrawer
        open={apiCheckOpen}
        onClose={() => setApiCheckOpen(false)}
        title="AI API Check"
        subtitle="Generated from current API and tool runtime data"
        badgeLabel="AI-generated analysis"
        contentReady={apiCheckReady}
        loading={
          <AISummaryLoadingState
            steps={[
              'Analyzing dependency health…',
              'Reviewing API latency patterns…',
              'Detecting operational bottlenecks…',
              'Generating integration recommendations…',
            ]}
          />
        }
      >
        <AISummarySectionStack>
          <AISummaryCard className="border-[#3694fc]/25 bg-gradient-to-br from-[#3694fc]/[0.12] via-[#3694fc]/[0.04] to-transparent shadow-[inset_0_1px_0_0_rgba(138,190,252,0.12)]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8abefc]/90">Overall assessment</p>
            <p className="mt-2 text-[14px] font-medium leading-relaxed text-[#f2f0eb]">
              External API and tool dependencies are largely healthy, with concentrated risk on logistics and CRM paths
              where retries and schema drift can amplify tail latency for tool-calling agents.
            </p>
          </AISummaryCard>

          <AISummaryBulletSection
            title="Stable integrations"
            items={[
              'Slack and Jira integrations remain operationally stable under current traffic.',
              'Stripe and Identity / Auth APIs show low error and timeout rates.',
              'Google Calendar API stays within expected latency bands for scheduling tools.',
            ]}
          />

          <AISummaryBulletSection
            title="APIs requiring attention"
            items={[
              'Zendesk API timeout rates increased during peak traffic.',
              'Delivery Tracking API shows schema mismatch risk on shipment payloads.',
              'Retry amplification detected for Internal CRM API during replica lag events.',
            ]}
          />

          <AISummaryBulletSection
            title="Operational recommendations"
            items={[
              'Enable caching for high-frequency read-only requests where responses are low-volatility.',
              'Increase retry backoff for payment and ticketing APIs when rate limits spike.',
              'Add contract tests for carrier and CRM responses before each partner release.',
            ]}
          />

          <AISummaryFooter text="AI-generated API analysis · Based on current tool runtime metrics · Last updated 2 min ago" />
        </AISummarySectionStack>
      </AISummaryDrawer>

      <AISummaryDrawer
        open={promptCheckOpen}
        onClose={() => setPromptCheckOpen(false)}
        title="AI Prompt Check"
        subtitle="Generated from current prompt runtime data (execution and token pressure only)"
        badgeLabel="AI-generated analysis"
        contentReady={promptCheckReady}
        loading={
          <AISummaryLoadingState
            steps={[
              'Analyzing prompt execution success…',
              'Reviewing token load and overflow signals…',
              'Correlating version and fallback usage…',
              'Generating runtime recommendations…',
            ]}
          />
        }
      >
        <AISummarySectionStack>
          <AISummaryCard className="border-[#3694fc]/25 bg-gradient-to-br from-[#3694fc]/[0.12] via-[#3694fc]/[0.04] to-transparent shadow-[inset_0_1px_0_0_rgba(138,190,252,0.12)]">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8abefc]/90">Runtime assessment</p>
            <p className="mt-2 text-[14px] font-medium leading-relaxed text-[#f2f0eb]">
              Fleet prompt executions are completing at target success rates with localized pressure on token-heavy
              templates and policy-long contexts. Latency tails align with assembly + long-context paths, not model
              errors.
            </p>
          </AISummaryCard>

          <AISummaryBulletSection
            title="Token &amp; context pressure"
            items={[
              'Review Billing Agent prompt v14 due to elevated token load after retrieval expansion.',
              'Reduce retrieved context size for policy-heavy onboarding workflows to protect overflow budget.',
              'Monitor average input tokens on multilingual sales paths — assembly latency grows when extra locales attach.',
            ]}
          />

          <AISummaryBulletSection
            title="Latency &amp; assembly"
            items={[
              'Split large prompt templates for latency-sensitive agents to shorten assembly critical path.',
              'p95 prompt latency clusters on Support and Onboarding during CRM and policy-heavy turns.',
              'Keep prompt assembly caches warm for high-volume agents to shave cold-start assembly cost.',
            ]}
          />

          <AISummaryBulletSection
            title="Fallback &amp; version risk"
            items={[
              'Monitor fallback prompt usage in Support Agent workflows during CRM incidents.',
              'Prompt version errors were isolated to a misconfigured canary — enforce runtime schema checks on deploy.',
              'Track retry chains on prompt render when external tools time out — distinguish from model latency.',
            ]}
          />

          <AISummaryFooter text="AI-generated prompt runtime analysis · Runtime and token signals only (not answer-quality or trust scoring) · Last updated 2 min ago" />
        </AISummarySectionStack>
      </AISummaryDrawer>
    </div>
  )
}
