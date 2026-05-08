type Action = {
  title: string
  impact: string
  owner: string
  priority: string
}

type RecommendedActionsProps = {
  actions: Action[]
}

export function RecommendedActions({ actions }: RecommendedActionsProps) {
  return (
    <section className="rounded-2xl border border-slate-700/60 bg-slate-900/45 p-4 shadow-2xl backdrop-blur-md">
      <header className="mb-3">
        <h3 className="text-sm font-semibold text-slate-100">Recommended Actions</h3>
        <p className="text-xs text-slate-400">Prioritized suggestions from live telemetry and evals</p>
      </header>
      <div className="space-y-2">
        {actions.map((action) => (
          <article
            key={action.title}
            className="rounded-xl border border-slate-700/70 bg-slate-950/45 p-3 transition hover:border-slate-500/80"
          >
            <p className="text-xs font-medium text-slate-200">{action.title}</p>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
              <span className="rounded-full border border-cyan-400/35 bg-cyan-400/10 px-2 py-1 text-cyan-300">
                {action.impact} Impact
              </span>
              <span>Owner: {action.owner}</span>
              <span className="rounded-full border border-fuchsia-400/35 bg-fuchsia-400/10 px-2 py-1 text-fuchsia-300">
                {action.priority}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
