import type { PromptPerformanceBlock, PromptPerformanceTrend } from '../data'
import { ExplainMetricPopover } from './ExplainMetricPopover'

type PromptPerformanceSectionProps = {
  data: PromptPerformanceBlock
}

const VERSION_BAND: Record<string, string> = {
  v17: 'rgba(154,166,240,0.09)',
  v18: 'rgba(54,148,252,0.10)',
  v19: 'rgba(61,214,140,0.09)',
}

function seriesPoints(values: number[], pad: number, innerW: number, innerH: number): string {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  return values
    .map((v, i) => {
      const x = pad + (i / (values.length - 1 || 1)) * innerW
      const y = pad + (1 - (v - min) / span) * innerH
      return `${x},${y}`
    })
    .join(' ')
}

function PromptOutcomeTrendChart({ trend }: { trend: PromptPerformanceTrend }) {
  const W = 100
  const H = 54
  const pad = 6
  const innerW = W - 2 * pad
  const innerH = H - 2 * pad
  const n = trend.bucketLabels.length
  const bandW = innerW / n

  return (
    <div className="space-y-1.5">
      <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-1.5 py-1.5">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-[6.25rem] w-full" preserveAspectRatio="none" aria-hidden>
          {trend.activeVersion.map((ver, i) => (
            <rect
              key={`${ver}-${i}`}
              x={pad + i * bandW}
              y={1}
              width={bandW}
              height={H - 2}
              fill={VERSION_BAND[ver] ?? 'rgba(255,255,255,0.04)'}
            />
          ))}
          <polyline
            fill="none"
            stroke="#9aa6f0"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={seriesPoints(trend.successRates, pad, innerW, innerH)}
            className="drop-shadow-[0_0_6px_rgba(154,166,240,0.45)]"
          />
          <polyline
            fill="none"
            stroke="#D6A85B"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={seriesPoints(trend.escalationRates, pad, innerW, innerH)}
          />
          <polyline
            fill="none"
            stroke="#E07a83"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={seriesPoints(trend.retryClarificationRates, pad, innerW, innerH)}
          />
        </svg>
        <div
          className="mt-0.5 grid gap-0 px-0.5 text-[9px] tabular-nums text-[#f2f0eb]/38"
          style={{ gridTemplateColumns: `repeat(${trend.bucketLabels.length}, minmax(0, 1fr))` }}
        >
          {trend.bucketLabels.map((label) => (
            <span key={label} className="min-w-0 truncate text-center">
              {label}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[10px] text-[#f2f0eb]/55">
        <span className="flex items-center gap-0.5">
          <span className="size-2 shrink-0 rounded-full bg-[#9aa6f0]" />
          <span>Success</span>
          <ExplainMetricPopover explainKey="prompt-success-rate" />
        </span>
        <span className="flex items-center gap-0.5">
          <span className="size-2 shrink-0 rounded-full bg-[#D6A85B]" />
          <span>Escalations</span>
          <ExplainMetricPopover explainKey="prompt-escalation-share" />
        </span>
        <span className="flex items-center gap-0.5">
          <span className="size-2 shrink-0 rounded-full bg-[#E07a83]" />
          <span>Retry / clarify</span>
          <ExplainMetricPopover explainKey="retry-clarification" />
        </span>
      </div>
      <p className="text-[9px] leading-snug text-[#f2f0eb]/40">
        Bands = active prompt version · series scaled per metric for readability.
      </p>
    </div>
  )
}

export function PromptPerformanceSection({ data }: PromptPerformanceSectionProps) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 md:p-3.5">
      <header className="mb-2.5 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#f2f0eb]/38">Advanced insight</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-1">
            <h2 className="text-lg font-semibold text-[#f2f0eb]">Prompt Performance</h2>
            <ExplainMetricPopover explainKey="section-prompt-performance" className="shrink-0" />
          </div>
          <p className="mt-0.5 max-w-xl text-[11px] leading-snug text-[#f2f0eb]/50">
            How prompt behavior impacts trust, task success, and user experience.
          </p>
        </div>
      </header>

      <div className="grid items-stretch gap-2.5 lg:grid-cols-2 lg:gap-3">
        <article className="flex flex-col rounded-xl border border-white/[0.07] bg-[#20202a]/70 p-2.5 transition hover:border-[#9aa6f0]/25 md:p-3">
          <h3 className="text-[13px] font-semibold leading-tight text-[#f2f0eb]">Prompt Success Trends</h3>
          <div className="mt-1.5 min-h-0 flex-1">
            <PromptOutcomeTrendChart trend={data.trend} />
          </div>
        </article>

        <article className="flex flex-col rounded-xl border border-white/[0.07] bg-[#20202a]/70 p-2.5 transition hover:border-[#9aa6f0]/25 md:p-3">
          <h3 className="text-[13px] font-semibold leading-tight text-[#f2f0eb]">Prompt Performance Snapshot</h3>
          <div className="mt-1.5 min-h-0 flex-1 overflow-x-auto rounded-lg border border-white/[0.06]">
            <table className="w-full min-w-[280px] text-left text-[12px]">
              <thead className="bg-[#1a1a22]/95 text-[#f2f0eb]/55 backdrop-blur-xl">
                <tr className="border-b border-white/[0.06]">
                  <th className="px-2 py-1.5 font-medium uppercase tracking-[0.12em]">Version</th>
                  <th className="px-2 py-1.5 font-medium uppercase tracking-[0.12em]">
                    <span className="inline-flex items-center gap-0.5">
                      Success
                      <ExplainMetricPopover explainKey="prompt-success-rate" />
                    </span>
                  </th>
                  <th className="px-2 py-1.5 font-medium uppercase tracking-[0.12em]">
                    <span className="inline-flex items-center gap-0.5">
                      Retries
                      <ExplainMetricPopover explainKey="retry-clarification" />
                    </span>
                  </th>
                  <th className="px-2 py-1.5 font-medium uppercase tracking-[0.12em]">
                    <span className="inline-flex items-center gap-0.5">
                      Escal.
                      <ExplainMetricPopover explainKey="prompt-escalation-share" />
                    </span>
                  </th>
                  <th className="px-2 py-1.5 font-medium uppercase tracking-[0.12em]">
                    <span className="inline-flex items-center gap-0.5">
                      Tokens
                      <ExplainMetricPopover explainKey="avg-prompt-tokens" />
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.versionRows.map((row) => (
                  <tr
                    key={row.version}
                    className="border-b border-white/[0.05] transition hover:bg-white/[0.035] last:border-b-0"
                  >
                    <td className="px-2 py-1.5 font-medium tabular-nums text-[#9aa6f0]">{row.version}</td>
                    <td className="px-2 py-1.5 tabular-nums text-[#f2f0eb]">{row.success}</td>
                    <td className="px-2 py-1.5 tabular-nums text-[#f2f0eb]">{row.retries}</td>
                    <td className="px-2 py-1.5 tabular-nums text-[#f2f0eb]">{row.escalations}</td>
                    <td className="px-2 py-1.5 tabular-nums text-[#f2f0eb]/85">{row.avgTokens}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </div>
    </section>
  )
}
