import type { TopologyNode } from '../data'

type InfrastructureMapProps = {
  nodes: TopologyNode[]
  tools: { name: string; status: string }[]
}

function statusStyle(status: string): string {
  if (status === 'Degraded') return 'border-[#D6A85B]/40 bg-[#D6A85B]/[0.1] text-[#D6A85B]'
  if (status === 'Healthy' || status === 'Online') return 'border-[#3DD68C]/40 bg-[#3DD68C]/[0.1] text-[#3DD68C]'
  return 'border-[#3694fc]/40 bg-[#3694fc]/[0.1] text-[#3694fc]'
}

export function InfrastructureMap({ nodes, tools }: InfrastructureMapProps) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-3 md:p-4">
      <header className="mb-3">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/42">
          Infrastructure / Dependency Map
        </p>
        <h3 className="mt-1 text-base font-semibold text-[#f2f0eb]">
          Users → AI Agents → Models → Tools/APIs → Human Escalation
        </h3>
      </header>
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="rounded-xl border border-white/[0.07] bg-[#1f1f29]/70 p-3">
          <div className="space-y-2">
            {nodes.map((node, index) => (
              <div key={node.id} className="relative">
                <article className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] font-medium text-[#f2f0eb]">{node.label}</p>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] ${statusStyle(node.status)}`}
                    >
                      {node.status}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#f2f0eb]/55">{node.layer}</p>
                  {node.issue ? <p className="mt-1 text-[11px] text-[#D6A85B]">{node.issue}</p> : null}
                </article>
                {index < nodes.length - 1 ? (
                  <div className="mx-auto h-3 w-px bg-gradient-to-b from-[#3694fc]/60 to-transparent" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.07] bg-[#1f1f29]/70 p-3">
          <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-[#f2f0eb]/45">
            Dependency Nodes
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {tools.map((tool) => (
              <article
                key={tool.name}
                className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-2.5 transition hover:border-[#3694fc]/30"
              >
                <p className="text-[12px] font-medium text-[#f2f0eb]">{tool.name}</p>
                <span className={`mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] ${statusStyle(tool.status)}`}>
                  {tool.status}
                </span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
