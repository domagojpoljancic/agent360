import { TimerReset } from 'lucide-react'
import type { ProviderHealth } from '../data'
import { HealthPill, Sparkline } from './shared'

export function ProviderHealthTable({ rows }: { rows: ProviderHealth[] }) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 md:p-4">
      <header className="mb-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/42">AI Stack</p>
        <h3 className="mt-1 text-base font-semibold text-[#f2f0eb]">Model & Provider Health</h3>
      </header>
      <div className="overflow-auto rounded-xl border border-white/[0.07]">
        <table className="min-w-[820px] w-full text-left text-[13px]">
          <thead className="bg-[#1f1f28]/90">
            <tr className="border-b border-white/[0.07] text-[#f2f0eb]/65">
              {[
                'Provider',
                'Current Latency',
                'Availability',
                'Requests/min',
                'Error Rate',
                'Rate Limit Usage',
                'Latency Trend',
                'Status',
              ].map((header) => (
                <th key={header} className="px-3 py-2.5 font-medium uppercase tracking-[0.16em]">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-white/[0.05] hover:bg-white/[0.03]">
                <td className="px-3 py-2.5">
                  <p className="font-medium text-[#f2f0eb]">{row.model}</p>
                  <p className="text-[11px] text-[#f2f0eb]/45">{row.provider}</p>
                </td>
                <td className="px-3 py-2.5">
                  <p className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#f2f0eb]">
                    <TimerReset className="size-3.5 text-[#3694fc] a360-pulse" />
                    {row.currentLatency}
                  </p>
                </td>
                <td className="px-3 py-2.5 text-[#f2f0eb]">{row.availability}</td>
                <td className="px-3 py-2.5 text-[#f2f0eb]">{row.requestsPerMin}</td>
                <td className="px-3 py-2.5 text-[#f2f0eb]">{row.errorRate}</td>
                <td className="px-3 py-2.5 text-[#f2f0eb]">{row.rateLimitUsage}</td>
                <td className="px-3 py-2.5">
                  <div className="w-20">
                    <Sparkline points={row.sparkline} danger={row.status === 'Degraded'} />
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <HealthPill status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
