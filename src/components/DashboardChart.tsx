import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type DashboardChartProps = {
  data: Array<{
    time: string
    conversations: number
    completions: number
    errors: number
    escalations: number
  }>
}

export function DashboardChart({ data }: DashboardChartProps) {
  return (
    <section className="rounded-2xl border border-slate-700/60 bg-slate-900/45 p-4 shadow-2xl backdrop-blur-md">
      <header className="mb-3">
        <h3 className="text-sm font-semibold text-slate-100">Real-Time Traffic</h3>
        <p className="text-xs text-slate-400">Conversations, completions, errors, and escalations</p>
      </header>
      <div className="h-72 w-full">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#243044" />
            <XAxis dataKey="time" stroke="#7184a8" tick={{ fontSize: 11 }} />
            <YAxis stroke="#7184a8" tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0b1221',
                borderColor: '#2d3b57',
                borderRadius: 12,
                color: '#e2e8f0',
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="conversations" stroke="#38bdf8" strokeWidth={2.4} dot={false} />
            <Line type="monotone" dataKey="completions" stroke="#22c55e" strokeWidth={2.2} dot={false} />
            <Line type="monotone" dataKey="errors" stroke="#f43f5e" strokeWidth={1.8} dot={false} />
            <Line type="monotone" dataKey="escalations" stroke="#f59e0b" strokeWidth={1.8} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
