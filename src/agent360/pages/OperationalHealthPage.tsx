import { useMemo, useState } from 'react'
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
import { InfrastructureMap } from '../operational-health/components/InfrastructureMap'
import { InvestigationDrawer } from '../operational-health/components/InvestigationDrawer'

export function OperationalHealthPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedAgentId, setSelectedAgentId] = useState('shopping-concierge')

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
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
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

              <div className="flex flex-wrap items-center gap-2">
                <EnvironmentSelector />
                <StatusBadge label="Live Pulse" tone="live" icon={<Activity className="size-3.5" />} />
                <StatusBadge label="Auto-refresh" tone="success" />
                <span className="inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-[11px] text-[#f2f0eb]/65">
                  <Clock3 className="size-3.5" />
                  Last updated {updatedAt}
                </span>
                <button
                  type="button"
                  onClick={onRefresh}
                  className="inline-flex items-center gap-1 rounded-md border border-[#3694fc]/35 bg-[#3694fc]/10 px-2.5 py-1 text-[12px] text-[#f2f0eb] transition hover:border-[#3694fc]/70"
                >
                  <RefreshCw className={`size-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
            <div className="mt-4 inline-flex rounded-lg border border-white/[0.08] bg-[#1f1f29]/75 p-1">
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
          </section>

          <FleetStatusStrip metrics={snapshot.fleetMetrics} isRefreshing={isRefreshing} />

          <FleetHealthMatrix
            rows={snapshot.fleetRows}
            selectedAgentId={selectedAgent?.id ?? null}
            onSelectAgent={onSelectAgent}
          />
          <ProviderHealthTable rows={snapshot.providerHealthRows} />
          <InfrastructureMap nodes={snapshot.topologyNodes} tools={snapshot.toolDependencies} />
        </main>
      </div>

      <InvestigationDrawer
        agent={selectedAgent}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  )
}
