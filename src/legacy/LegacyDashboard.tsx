import { useMemo, useState } from 'react'
import {
  BellRing,
  Bot,
  DollarSign,
  Gauge,
  House,
  RefreshCw,
  Search,
  Settings,
  Shield,
  Sparkles,
  Target,
  Users,
} from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { AgentHealthTable } from '../components/AgentHealthTable'
import { DashboardChart } from '../components/DashboardChart'
import { IncidentTimeline } from '../components/IncidentTimeline'
import { MetricCard } from '../components/MetricCard'
import { RecommendedActions } from '../components/RecommendedActions'
import { TopologyMap } from '../components/TopologyMap'
import { TraceExplorer } from '../components/TraceExplorer'
import {
  agentRows,
  costBreakdown,
  heroMetrics,
  incidents,
  qualityScores,
  recommendedActions,
  spendTrend,
  timeRanges,
  traceRows,
  trafficSeries,
} from '../data/mockData'

const navItems = [
  { label: 'Overview', icon: House },
  { label: 'Agents', icon: Bot },
  { label: 'Traces', icon: Search },
  { label: 'Evaluations', icon: Target },
  { label: 'Incidents', icon: BellRing },
  { label: 'Costs', icon: DollarSign },
  { label: 'Settings', icon: Settings },
]

const pieColors = ['#38bdf8', '#22c55e', '#f59e0b', '#a855f7']

export function LegacyDashboard() {
  const [selectedAgentId, setSelectedAgentId] = useState(agentRows[0].id)
  const [selectedTraceId, setSelectedTraceId] = useState(traceRows[0].id)
  const [timeRange, setTimeRange] = useState('24h')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const selectedAgent = useMemo(
    () => agentRows.find((agent) => agent.id === selectedAgentId) ?? agentRows[0],
    [selectedAgentId],
  )

  const filteredTraces = useMemo(() => {
    const normalized = searchValue.toLowerCase().trim()
    if (!normalized) return traceRows
    return traceRows.filter(
      (trace) =>
        trace.agent.toLowerCase().includes(normalized) ||
        trace.intent.toLowerCase().includes(normalized) ||
        trace.id.toLowerCase().includes(normalized),
    )
  }, [searchValue])

  function onRefresh() {
    setIsRefreshing(true)
    window.setTimeout(() => setIsRefreshing(false), 900)
  }

  return (
    <div className="flex min-h-screen bg-transparent text-slate-100">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-800/90 bg-slate-950/60 p-4 backdrop-blur-xl lg:flex">
        <div className="mb-6 flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-lg bg-cyan-400/20 text-cyan-300">
            <Sparkles className="size-5" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight">AgentOps</p>
            <p className="text-xs text-slate-400">AI Reliability Platform</p>
          </div>
        </div>
        <nav className="space-y-1">
          {navItems.map(({ label, icon: Icon }) => {
            const active = label === 'Overview'
            return (
              <button
                key={label}
                type="button"
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                  active
                    ? 'border border-cyan-400/40 bg-cyan-500/10 text-cyan-200 shadow-[0_0_25px_-16px_rgba(56,189,248,0.8)]'
                    : 'text-slate-300 hover:bg-slate-800/70'
                }`}
              >
                <Icon className="size-4" />
                {label}
              </button>
            )
          })}
        </nav>
        <div className="mt-6 rounded-xl border border-slate-700/70 bg-slate-900/60 p-3">
          <p className="text-[11px] uppercase tracking-[0.15em] text-slate-500">Environment</p>
          <p className="mt-1 text-sm font-medium text-emerald-300">Production</p>
        </div>
        <div className="mt-auto rounded-xl border border-slate-700/70 bg-slate-900/60 p-3">
          <p className="text-sm font-medium">Agent360 Workspace</p>
          <p className="text-xs text-slate-400">domagoj@agent360.com</p>
        </div>
      </aside>

      <main className="flex-1">
        <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/55 px-4 py-3 backdrop-blur-xl md:px-6">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Observability Command Center</h1>
              <p className="text-xs text-slate-400">Live monitoring for LLM-powered agents</p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5">Last 24h</button>
              <button className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5">Production</button>
              <button className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5">All Models</button>
              <button
                type="button"
                onClick={onRefresh}
                className="inline-flex items-center gap-1 rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-3 py-1.5 text-cyan-200"
              >
                <RefreshCw className={`size-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <label className="relative">
                <Search className="pointer-events-none absolute left-2 top-2 size-3.5 text-slate-500" />
                <input
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  className="w-60 rounded-lg border border-slate-700 bg-slate-900/80 py-1.5 pl-7 pr-2 text-slate-200 outline-none ring-cyan-300 placeholder:text-slate-500 focus:ring-1"
                  placeholder="Search traces, agents, sessions..."
                />
              </label>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            {timeRanges.map((range) => (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                className={`rounded-lg px-2.5 py-1 text-[11px] transition ${
                  timeRange === range
                    ? 'bg-cyan-500/20 text-cyan-200 shadow-[0_0_12px_-6px_rgba(56,189,248,0.9)]'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </header>

        <div className="space-y-4 p-4 md:p-6">
          <section className="relative overflow-hidden rounded-2xl border border-cyan-400/30 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-cyan-950/45 p-4 shadow-[0_24px_60px_-45px_rgba(14,165,233,0.95)]">
            <div className="absolute -right-10 -top-10 size-44 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="mb-3 flex items-center gap-2">
              <span className="relative inline-flex size-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-3 rounded-full bg-emerald-400" />
              </span>
              <p className="text-sm font-medium text-emerald-300">System {heroMetrics.systemStatus}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-7">
              <MetricCard label="Active Agents" value={heroMetrics.activeAgents.toString()} icon={<Bot className="size-3.5 text-cyan-300" />} />
              <MetricCard label="Conversations" value={heroMetrics.totalConversations} icon={<Users className="size-3.5 text-cyan-300" />} />
              <MetricCard label="Active Incidents" value={heroMetrics.activeIncidents.toString()} icon={<BellRing className="size-3.5 text-cyan-300" />} />
              <MetricCard label="Spend Today" value={heroMetrics.spendToday} icon={<DollarSign className="size-3.5 text-cyan-300" />} />
              <MetricCard label="Avg Latency" value={heroMetrics.avgLatency} icon={<Gauge className="size-3.5 text-cyan-300" />} />
              <MetricCard label="Success Rate" value={heroMetrics.successRate} icon={<Shield className="size-3.5 text-cyan-300" />} />
              <MetricCard label="Selected Agent" value={selectedAgent.name} hint={`${selectedAgent.healthScore} health score`} />
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-12">
            <div className="space-y-4 xl:col-span-8">
              <AgentHealthTable
                agents={agentRows}
                selectedAgentId={selectedAgentId}
                onSelectAgent={setSelectedAgentId}
              />
              <DashboardChart data={trafficSeries} />
              <TraceExplorer
                traces={filteredTraces}
                selectedTraceId={selectedTraceId}
                onSelectTrace={setSelectedTraceId}
              />
              <TopologyMap selectedAgentName={selectedAgent.name} />
            </div>

            <div className="space-y-4 xl:col-span-4">
              <section className="rounded-2xl border border-slate-700/60 bg-slate-900/45 p-4 shadow-2xl backdrop-blur-md">
                <h3 className="text-sm font-semibold text-slate-100">Quality Radar / Score Panel</h3>
                <p className="mb-3 text-xs text-slate-400">Evaluation dimensions across latest model snapshots</p>
                <div className="space-y-2">
                  {qualityScores.map((item) => (
                    <article
                      key={item.name}
                      className="rounded-xl border border-slate-700/70 bg-slate-950/45 p-3"
                    >
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <p className="text-slate-200">{item.name}</p>
                        <p className="font-medium text-slate-100">{item.score}</p>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-700/70">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                      <p className="mt-2 text-[11px] text-slate-400">{item.status}</p>
                    </article>
                  ))}
                </div>
              </section>

              <IncidentTimeline incidents={incidents} />

              <section className="rounded-2xl border border-slate-700/60 bg-slate-900/45 p-4 shadow-2xl backdrop-blur-md">
                <h3 className="text-sm font-semibold text-slate-100">Cost & Efficiency Panel</h3>
                <p className="mb-3 text-xs text-slate-400">Spend trend, usage mix, and outcome efficiency</p>
                <div className="mb-4 h-40">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={costBreakdown} dataKey="value" innerRadius={38} outerRadius={62} paddingAngle={4}>
                        {costBreakdown.map((slice, index) => (
                          <Cell key={slice.name} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0b1221',
                          borderColor: '#2d3b57',
                          borderRadius: 12,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 text-xs">
                  {spendTrend.map((item) => (
                    <div key={item.day}>
                      <div className="mb-1 flex items-center justify-between text-slate-300">
                        <span>{item.day}</span>
                        <span>
                          ${item.spend} / {item.efficiency}% efficient
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-700/70">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-400"
                          style={{ width: `${(item.spend / 4500) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <RecommendedActions actions={recommendedActions} />
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
