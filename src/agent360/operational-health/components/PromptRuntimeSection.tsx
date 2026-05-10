import { useMemo, useState } from 'react'
import { ChevronRight, Info, Sparkles } from 'lucide-react'
import { sortPromptRuntimeIssues, type PromptRuntimeIssue, type PromptRuntimeSnapshot } from '../data'
import { OperationalDetailDrawer } from './OperationalDetailDrawer'

type PromptRuntimeSectionProps = {
  data: PromptRuntimeSnapshot
  onOpenAiPromptCheck: () => void
  aiPromptCheckOpen: boolean
  aiPromptCheckGenerating: boolean
}

type PromptDrawerState =
  | { mode: 'closed' }
  | { mode: 'fleet' }
  | { mode: 'allAlerts' }
  | { mode: 'issue'; issue: PromptRuntimeIssue }

const PROMPT_METRIC_HELP: Record<string, string> = {
  'Prompt execution success':
    'Percentage of prompt executions completed successfully without runtime failure.',
  'Avg prompt latency': 'Average time between prompt assembly and model response start.',
  'Prompt token load': 'Average number of input tokens sent to the model per execution.',
  'Context overflow': 'Prompt executions approaching or exceeding model context limits.',
  'Fallback prompt usage':
    'Executions where the system used fallback prompts due to runtime or dependency conditions.',
}

const CHART_HELP =
  'Bars: successful prompt assemblies per bucket (rolling ~12h). Line: normalized token-pressure index for spotting load spikes alongside execution volume.'

const TOP_RISK_LIMIT = 4

function issueSeverityClass(s: PromptRuntimeIssue['severity']): string {
  if (s === 'Critical')
    return 'border-[#c45c66]/45 bg-[#2a1c20]/80 text-[#e8b4b8]'
  if (s === 'Warning') return 'border-[#D6A85B]/40 bg-[#D6A85B]/10 text-[#D6A85B]'
  return 'border-white/[0.1] bg-white/[0.04] text-[#f2f0eb]/60'
}

function riskCardAccent(s: PromptRuntimeIssue['severity']): string {
  if (s === 'Critical') return 'border-l-[3px] border-l-[#c45c66]/70'
  if (s === 'Warning') return 'border-l-2 border-l-[#D6A85B]/45'
  return 'border-l border-l-white/[0.08]'
}

function severityLabel(s: PromptRuntimeIssue['severity']): string {
  if (s === 'Critical') return 'Critical'
  if (s === 'Warning') return 'Warning'
  return 'Info'
}

function MetricTile({
  label,
  value,
  helpKey,
}: {
  label: string
  value: string
  helpKey: keyof typeof PROMPT_METRIC_HELP
}) {
  const help = PROMPT_METRIC_HELP[helpKey]
  return (
    <div className="group relative rounded-lg border border-white/[0.07] bg-[#1f1f29]/70 px-2.5 py-2">
      <span className="absolute right-2 top-2 text-[#f2f0eb]/35 transition group-hover:text-[#f2f0eb]/65">
        <Info className="size-3.5" aria-hidden />
      </span>
      <div className="pointer-events-none absolute right-2 top-8 z-20 w-56 rounded-md border border-white/[0.12] bg-[#161620] px-2 py-1.5 text-[11px] leading-snug text-[#f2f0eb]/78 opacity-0 shadow-[0_14px_30px_-20px_rgba(0,0,0,0.8)] transition duration-150 group-hover:opacity-100">
        {help}
      </div>
      <p className="pr-6 text-[10px] leading-tight text-[#f2f0eb]/62">{label}</p>
      <p className="mt-1 text-[15px] font-semibold tabular-nums text-[#f2f0eb]">{value}</p>
    </div>
  )
}

/** Execution volume (bars) + token-pressure polyline. Uses fixed plot height and normal document flow — no overlapping axis. */
function ExecutionVolumeChart({ volumes, tokenPressure }: { volumes: number[]; tokenPressure: number[] }) {
  const maxV = Math.max(...volumes, 1)
  const plotH = 96

  const tpMax = Math.max(...tokenPressure)
  const tpMin = Math.min(...tokenPressure)
  const tpSpan = tpMax - tpMin || 1
  const n = tokenPressure.length
  const linePoints = tokenPressure
    .map((t, i) => {
      const x = n <= 1 ? 50 : (i / (n - 1)) * 100
      const norm = (t - tpMin) / tpSpan
      const y = 14 + (1 - norm) * 56
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className="flex w-full min-w-0 flex-col rounded-lg border border-white/[0.07] bg-[#1a1a24]/70 p-3">
      <div className="flex shrink-0 items-start justify-between gap-3">
        <div className="min-w-0 pr-2">
          <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-[#f2f0eb]/44">
            Prompt execution volume
          </p>
          <p className="mt-1 text-[10px] leading-snug text-[#f2f0eb]/48">Last 12h rolling · assemblies per bucket</p>
        </div>
        <div className="group/chart-tip relative shrink-0 pt-0.5">
          <button
            type="button"
            className="rounded p-0.5 text-[#f2f0eb]/35 outline-none transition hover:bg-white/[0.06] hover:text-[#f2f0eb]/55 focus-visible:ring-1 focus-visible:ring-[#3694fc]/50"
            aria-label="Chart explanation"
          >
            <Info className="size-3.5" aria-hidden />
          </button>
          <div className="pointer-events-none absolute right-0 top-full z-30 mt-1.5 w-[15rem] rounded-md border border-white/[0.12] bg-[#161620] px-2 py-1.5 text-[10px] leading-snug text-[#f2f0eb]/78 opacity-0 shadow-[0_14px_30px_-20px_rgba(0,0,0,0.8)] transition duration-150 group-focus-within/chart-tip:opacity-100 group-hover/chart-tip:opacity-100">
            {CHART_HELP}
          </div>
        </div>
      </div>

      <div className="mt-3 w-full min-w-0 shrink-0">
        <div
          className="relative w-full overflow-hidden rounded-md bg-[#12121a]/50"
          style={{ height: plotH, minHeight: plotH }}
        >
          <svg
            className="pointer-events-none absolute inset-0 z-0 h-full w-full"
            viewBox="0 0 100 80"
            preserveAspectRatio="none"
            aria-hidden
          >
            <polyline
              fill="none"
              stroke="#D6A85B"
              strokeWidth="0.9"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              opacity={0.5}
              points={linePoints}
            />
          </svg>
          <div
            className="relative z-10 flex h-full w-full min-h-0 items-end justify-between gap-0.5 px-0.5 pb-0.5 pt-1"
            role="img"
            aria-label="Execution volume by time bucket"
          >
            {volumes.map((v, i) => {
              const pct = Math.max(12, Math.round((v / maxV) * 100))
              return (
                <div key={i} className="flex h-full min-w-0 flex-1 flex-col justify-end">
                  <div
                    className="mx-auto w-full max-w-[11px] min-w-[3px] rounded-t-[2px] bg-gradient-to-t from-[#3694fc]/40 via-[#4a8eef] to-[#6ba8f5]"
                    style={{ height: `${pct}%` }}
                    title={`${v.toLocaleString()} assemblies`}
                  />
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-2 flex w-full shrink-0 justify-between border-t border-white/[0.06] pt-1.5 text-[7px] font-mono uppercase tracking-wide text-[#f2f0eb]/32">
          <span>−12h</span>
          <span>−6h</span>
          <span>Now</span>
        </div>
      </div>

      <div className="mt-2.5 flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 text-[8px] text-[#f2f0eb]/38">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 shrink-0 rounded-sm bg-[#5a9efc]" />
          Assemblies
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-0.5 w-4 shrink-0 rounded-full bg-[#D6A85B]/70" />
          Token pressure
        </span>
      </div>
    </div>
  )
}

function TopRiskCard({
  issue,
  onSelect,
}: {
  issue: PromptRuntimeIssue
  onSelect: (issue: PromptRuntimeIssue) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(issue)}
      className={`w-full rounded-lg border border-white/[0.07] bg-[#1a1a24]/55 px-2.5 py-2 text-left transition hover:border-white/[0.11] hover:bg-[#1e1e28]/80 ${riskCardAccent(issue.severity)}`}
    >
      <div className="flex items-start gap-1.5">
        <span
          className={`mt-0.5 shrink-0 rounded border px-1 py-0.5 text-[7.5px] font-semibold uppercase tracking-wide ${issueSeverityClass(issue.severity)}`}
        >
          {severityLabel(issue.severity)}
        </span>
        <p className="min-w-0 flex-1 text-[11px] font-medium leading-snug text-[#f2f0eb]/88">
          {issue.agent}
          <span className="font-normal text-[#f2f0eb]/35"> · </span>
          <span className="font-normal text-[#f2f0eb]/60">{issue.promptVersion}</span>
        </p>
        <ChevronRight className="mt-0.5 size-3.5 shrink-0 text-[#f2f0eb]/25" aria-hidden />
      </div>
      <p className="mt-1.5 text-[11px] leading-snug text-[#f2f0eb]/58">{issue.note}</p>
    </button>
  )
}

export function PromptRuntimeSection({
  data,
  onOpenAiPromptCheck,
  aiPromptCheckOpen,
  aiPromptCheckGenerating,
}: PromptRuntimeSectionProps) {
  const [drawer, setDrawer] = useState<PromptDrawerState>({ mode: 'closed' })

  const sortedAlerts = useMemo(() => sortPromptRuntimeIssues(data.issues), [data.issues])

  const topRisks = useMemo(() => {
    return sortedAlerts.filter((i) => i.severity !== 'Info').slice(0, TOP_RISK_LIMIT)
  }, [sortedAlerts])

  const infoOnlyCount = useMemo(
    () => sortedAlerts.filter((i) => i.severity === 'Info').length,
    [sortedAlerts],
  )

  function openFleetDetail() {
    setDrawer({ mode: 'fleet' })
  }

  function openIssueDetail(issue: PromptRuntimeIssue) {
    setDrawer({ mode: 'issue', issue })
  }

  function openAllAlerts() {
    setDrawer({ mode: 'allAlerts' })
  }

  function closeDrawer() {
    setDrawer({ mode: 'closed' })
  }

  const drawerOpen = drawer.mode !== 'closed'
  const drawerIssue = drawer.mode === 'issue' ? drawer.issue : null

  const fleetTitle = 'Fleet prompt runtime'
  const drawerTitle =
    drawer.mode === 'issue'
      ? `${drawer.issue.agent} · ${drawer.issue.promptVersion}`
      : drawer.mode === 'allAlerts'
        ? 'All prompt runtime alerts'
        : fleetTitle

  const drawerSubtitle =
    drawer.mode === 'issue'
      ? drawer.issue.note
      : drawer.mode === 'allAlerts'
        ? 'Full feed including informational signals. Select a row for execution profile and runtime insight.'
        : data.fleetDrawer.headline

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 md:p-4">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/42">Prompt assembly</p>
          <h3 className="mt-1 text-base font-semibold text-[#f2f0eb]">Prompt Runtime Health</h3>
          <p className="mt-1.5 text-[11px] leading-relaxed text-[#f2f0eb]/56">
            Fleet execution health, top prompt risks, and a compact execution trend — retrieval through tools.
          </p>
        </div>
        <div className="group/ai-prompt relative shrink-0">
          <button
            type="button"
            onClick={onOpenAiPromptCheck}
            aria-expanded={aiPromptCheckOpen}
            aria-busy={aiPromptCheckGenerating}
            aria-haspopup="dialog"
            className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] font-semibold text-[#f2f0eb] transition ${
              aiPromptCheckGenerating
                ? 'border-[#3694fc]/65 bg-[#3694fc]/35'
                : aiPromptCheckOpen
                  ? 'border-[#3694fc]/45 bg-[#3694fc]/24'
                  : 'border-[#3694fc]/35 bg-[#3694fc]/16 hover:border-[#3694fc]/55 hover:bg-[#3694fc]/24'
            }`}
          >
            <Sparkles className={`size-3.5 shrink-0 ${aiPromptCheckGenerating ? 'animate-pulse' : ''}`} />
            AI Prompt Check
          </button>
          <div className="pointer-events-none absolute bottom-full right-0 z-30 mb-2 w-64 rounded-lg border border-white/[0.12] bg-[#161620] px-2.5 py-2 text-[11px] leading-snug text-[#f2f0eb]/78 opacity-0 shadow-[0_14px_30px_-20px_rgba(0,0,0,0.8)] transition duration-150 group-hover/ai-prompt:opacity-100">
            AI analysis of prompt execution health, token pressure, and fallback risk (not answer quality).
          </div>
        </div>
      </header>

      <button
        type="button"
        onClick={openFleetDetail}
        className="w-full rounded-xl border border-white/[0.07] bg-[#1a1a24]/80 p-2.5 text-left transition hover:border-white/[0.12] hover:bg-[#1e1e2a]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3694fc]/40"
      >
        <p className="text-[9px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Fleet metrics · click for detail</p>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          <MetricTile label="Prompt execution success" value={data.successRate} helpKey="Prompt execution success" />
          <MetricTile label="Avg prompt latency" value={data.avgPromptLatency} helpKey="Avg prompt latency" />
          <MetricTile label="Prompt token load" value={data.tokenLoad} helpKey="Prompt token load" />
          <MetricTile label="Context overflow" value={data.overflowRate} helpKey="Context overflow" />
          <MetricTile label="Fallback prompt usage" value={data.fallbackPromptUsage} helpKey="Fallback prompt usage" />
        </div>
      </button>

      {/* Lower band: ~60% chart / ~40% risks — min-w-0 on both columns prevents grid blowout/overlap */}
      <div className="mt-4 grid w-full grid-cols-1 gap-5 lg:grid-cols-[15fr_10fr] lg:items-start lg:gap-6">
        <div className="min-w-0 overflow-hidden">
          <ExecutionVolumeChart volumes={data.hourlyExecutionVolume} tokenPressure={data.hourlyTokenPressure} />
          <p className="mt-3 text-[10px] leading-relaxed text-[#f2f0eb]/38">
            Supporting trend only — fleet metrics and top risks are primary.
          </p>
        </div>

        <aside className="min-w-0 overflow-hidden">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#f2f0eb]/48">
                  Top prompt risks
                </p>
                <p className="mt-0.5 text-[10px] leading-snug text-[#f2f0eb]/42">
                  Critical and warning signals only
                </p>
              </div>
              <button
                type="button"
                onClick={openAllAlerts}
                className="shrink-0 text-left text-[10px] font-medium text-[#8abefc]/90 underline-offset-2 transition hover:text-[#a8ccfc] hover:underline sm:text-right"
              >
                View all alerts
                {sortedAlerts.length > topRisks.length
                  ? ` (${sortedAlerts.length}${infoOnlyCount ? ` · ${infoOnlyCount} info` : ''})`
                  : ''}
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {topRisks.length > 0 ? (
                topRisks.map((issue) => (
                  <TopRiskCard key={issue.id} issue={issue} onSelect={openIssueDetail} />
                ))
              ) : (
                <p className="rounded-lg border border-white/[0.06] bg-[#1a1a24]/40 px-3 py-3 text-[11px] leading-relaxed text-[#f2f0eb]/52">
                  No critical or warning prompt signals in this window.
                </p>
              )}
            </div>
          </div>
        </aside>
      </div>

      <OperationalDetailDrawer open={drawerOpen} onClose={closeDrawer} title={drawerTitle} subtitle={drawerSubtitle}>
        {drawer.mode === 'issue' && drawerIssue ? (
          <>
            <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${issueSeverityClass(drawerIssue.severity)}`}
                >
                  {severityLabel(drawerIssue.severity)}
                </span>
                <dl className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-[#f2f0eb]/68">
                  <div className="flex gap-1.5">
                    <dt className="text-[#f2f0eb]/45">Detected</dt>
                    <dd className="font-mono text-[#f2f0eb]/80">{drawerIssue.detectedLabel}</dd>
                  </div>
                  {drawerIssue.impactHint ? (
                    <div className="flex gap-1.5">
                      <dt className="text-[#f2f0eb]/45">Impact</dt>
                      <dd className="text-[#f2f0eb]/80">{drawerIssue.impactHint}</dd>
                    </div>
                  ) : null}
                </dl>
              </div>
            </div>
            <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Runtime insight</p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-[#f2f0eb]/75">{drawerIssue.detail.runtimeInsight}</p>
            </div>
            <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Execution profile</p>
              <dl className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <dt className="text-[#f2f0eb]/50">Volume</dt>
                  <dd className="font-medium text-[#f2f0eb]">{drawerIssue.detail.executionVolume}</dd>
                </div>
                <div>
                  <dt className="text-[#f2f0eb]/50">Avg latency</dt>
                  <dd className="font-medium text-[#f2f0eb]">{drawerIssue.detail.avgLatency}</dd>
                </div>
                <div>
                  <dt className="text-[#f2f0eb]/50">p95 latency</dt>
                  <dd className="font-medium text-[#8abefc]">{drawerIssue.detail.p95Latency}</dd>
                </div>
                <div>
                  <dt className="text-[#f2f0eb]/50">Token load</dt>
                  <dd className="font-medium text-[#f2f0eb]">{drawerIssue.detail.tokenLoad}</dd>
                </div>
                <div>
                  <dt className="text-[#f2f0eb]/50">Overflow rate</dt>
                  <dd className="font-medium text-[#D6A85B]">{drawerIssue.detail.overflowRate}</dd>
                </div>
                <div>
                  <dt className="text-[#f2f0eb]/50">Retry / fallback</dt>
                  <dd className="font-medium text-[#f2f0eb]/80">{drawerIssue.detail.retryFallback}</dd>
                </div>
              </dl>
            </div>
            <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Recent runtime events</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] text-[#f2f0eb]/72">
                {drawerIssue.detail.recentEvents.map((ev) => (
                  <li key={ev}>{ev}</li>
                ))}
              </ul>
            </div>
          </>
        ) : drawer.mode === 'allAlerts' ? (
          <div className="space-y-2">
            <p className="text-[11px] leading-relaxed text-[#f2f0eb]/65">
              Newest and highest-impact items first. Informational alerts are included for completeness.
            </p>
            <ul className="max-h-[min(420px,60vh)] space-y-2 overflow-y-auto pr-1 [scrollbar-color:rgba(242,240,235,0.1)_transparent] [scrollbar-width:thin]">
              {sortedAlerts.map((issue) => (
                <li key={issue.id}>
                  <button
                    type="button"
                    onClick={() => setDrawer({ mode: 'issue', issue })}
                    className={`flex w-full gap-3 rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-3 text-left transition hover:border-white/[0.11] hover:bg-white/[0.04] ${riskCardAccent(issue.severity)}`}
                  >
                    <span
                      className={`h-fit shrink-0 rounded border px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wide ${issueSeverityClass(issue.severity)}`}
                    >
                      {severityLabel(issue.severity)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium text-[#f2f0eb]/88">
                        {issue.agent}
                        <span className="font-normal text-[#f2f0eb]/35"> · </span>
                        <span className="font-normal text-[#f2f0eb]/58">{issue.promptVersion}</span>
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-[#f2f0eb]/55">{issue.note}</p>
                      <p className="mt-1.5 text-[10px] text-[#f2f0eb]/38">
                        <span className="font-mono">{issue.detectedLabel}</span>
                        {issue.impactHint ? (
                          <>
                            {' '}
                            · {issue.impactHint}
                          </>
                        ) : null}
                      </p>
                    </div>
                    <ChevronRight className="size-4 shrink-0 text-[#f2f0eb]/20" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Fleet summary</p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-[#f2f0eb]/75">{data.fleetDrawer.headline}</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-[11px] text-[#f2f0eb]/68">
                {data.fleetDrawer.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Fleet metrics</p>
              <dl className="mt-2 grid grid-cols-2 gap-2 text-[11px] sm:grid-cols-3">
                <div>
                  <dt className="text-[#f2f0eb]/50">Success rate</dt>
                  <dd className="font-semibold text-[#3DD68C]">{data.successRate}</dd>
                </div>
                <div>
                  <dt className="text-[#f2f0eb]/50">Avg latency</dt>
                  <dd className="font-medium text-[#f2f0eb]">{data.avgPromptLatency}</dd>
                </div>
                <div>
                  <dt className="text-[#f2f0eb]/50">Token load</dt>
                  <dd className="font-medium text-[#f2f0eb]">{data.tokenLoad}</dd>
                </div>
                <div>
                  <dt className="text-[#f2f0eb]/50">Overflow rate</dt>
                  <dd className="font-medium text-[#D6A85B]">{data.overflowRate}</dd>
                </div>
                <div>
                  <dt className="text-[#f2f0eb]/50">Fallback usage</dt>
                  <dd className="font-medium text-[#D6A85B]/90">{data.fallbackPromptUsage}</dd>
                </div>
              </dl>
            </div>
            <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Execution trend</p>
              <p className="mt-1 text-[11px] leading-relaxed text-[#f2f0eb]/65">
                The in-widget chart shows assembly volume by bucket with a light token-pressure trace. Use{' '}
                <span className="text-[#f2f0eb]/78">View all alerts</span> for the full prompt runtime feed, including
                informational signals.
              </p>
            </div>
            <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#f2f0eb]/45">Example runtime signals</p>
              <ul className="mt-2 space-y-2 text-[11px] text-[#f2f0eb]/72">
                <li>
                  <span className="font-medium text-[#f2f0eb]/85">Critical · Billing v14:</span> overflow truncation on
                  retrieval-heavy invoice threads — retrieval → assembly → model path.
                </li>
                <li>
                  <span className="font-medium text-[#f2f0eb]/85">Critical · Support v12:</span> repeated fallback chains
                  during CRM outage — dependency-driven prompt path changes.
                </li>
                <li>
                  <span className="font-medium text-[#f2f0eb]/85">Warning · Policy v18:</span> p95 assembly latency during
                  multilingual peak — parallel retrieval merge cost.
                </li>
              </ul>
            </div>
          </>
        )}
      </OperationalDetailDrawer>
    </section>
  )
}
