import { navigate } from '../router'
import { Logo } from './Logo'

type OrbitNode = {
  key: string
  path: string
  label: string
  sub: string
  angle: number
}

const orbitNodes: OrbitNode[] = [
  {
    key: 'operational-health',
    path: '/operational-health',
    label: 'Operational Health',
    sub: 'Stable & reliable',
    angle: -90,
  },
  {
    key: 'agent-effectiveness-trust',
    path: '/agent-effectiveness-trust',
    label: 'Agent Effectiveness & Trust',
    sub: 'Useful & trusted',
    angle: 0,
  },
  {
    key: 'value-delivered',
    path: '/value-delivered',
    label: 'Value Delivered',
    sub: 'Measurable outcomes',
    angle: 90,
  },
  {
    key: 'cost-optimization',
    path: '/cost-optimization',
    label: 'Cost Optimization',
    sub: 'Efficient AI usage',
    angle: 180,
  },
]

const VIEW = 400
const CENTER = VIEW / 2
const NODE_RADIUS = 152
const RING_RADII = [88, 124, 168]

function pointOnRing(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: CENTER + Math.cos(rad) * radius,
    y: CENTER + Math.sin(rad) * radius,
  }
}

export function Orbit360Graphic() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      <svg
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <radialGradient id="orbit-core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(54,148,252,0.45)" />
            <stop offset="55%" stopColor="rgba(54,148,252,0.10)" />
            <stop offset="100%" stopColor="rgba(54,148,252,0)" />
          </radialGradient>
          <linearGradient id="orbit-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(54,148,252,0.5)" />
            <stop offset="100%" stopColor="rgba(54,148,252,0.05)" />
          </linearGradient>
        </defs>

        <circle cx={CENTER} cy={CENTER} r={190} fill="url(#orbit-core-glow)" opacity="0.7" />

        {/* concentric rings */}
        {RING_RADII.map((r, i) => (
          <circle
            key={`ring-${r}`}
            cx={CENTER}
            cy={CENTER}
            r={r}
            fill="none"
            stroke="rgba(242,240,235,0.10)"
            strokeWidth={i === RING_RADII.length - 1 ? 1 : 0.8}
            strokeDasharray={i === 0 ? '0' : '2 6'}
          />
        ))}

        {/* connecting lines from center to each node */}
        {orbitNodes.map((node) => {
          const p = pointOnRing(node.angle, NODE_RADIUS - 6)
          return (
            <line
              key={`line-${node.key}`}
              x1={CENTER}
              y1={CENTER}
              x2={p.x}
              y2={p.y}
              stroke="url(#orbit-line)"
              strokeWidth="1"
              strokeDasharray="2 5"
              opacity="0.6"
            />
          )
        })}

        {/* slow rotating sweep band */}
        <g className="a360-rotate-slow" style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}>
          <path
            d={`M ${CENTER} ${CENTER} L ${CENTER} ${CENTER - 168} A 168 168 0 0 1 ${
              CENTER + 168 * Math.cos((-30 * Math.PI) / 180)
            } ${CENTER + 168 * Math.sin((-30 * Math.PI) / 180)} Z`}
            fill="rgba(54,148,252,0.10)"
          />
          <circle cx={CENTER} cy={CENTER - 168} r="2.5" fill="#3694FC" />
        </g>

        {/* counter rotating signal dot */}
        <g className="a360-rotate-rev" style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}>
          <circle cx={CENTER + 124} cy={CENTER} r="2" fill="#7DB6FE" opacity="0.85" />
        </g>

        {/* slow signal dot on inner ring */}
        <g className="a360-rotate-slow" style={{ transformOrigin: `${CENTER}px ${CENTER}px`, animationDuration: '24s' }}>
          <circle cx={CENTER - 88} cy={CENTER} r="1.6" fill="#3694FC" opacity="0.85" />
        </g>

        {/* connector arcs (outer ring quarters) */}
        <path
          d={`M ${CENTER} ${CENTER - NODE_RADIUS} A ${NODE_RADIUS} ${NODE_RADIUS} 0 0 1 ${
            CENTER + NODE_RADIUS
          } ${CENTER}`}
          fill="none"
          stroke="rgba(54,148,252,0.18)"
          strokeWidth="1"
        />
        <path
          d={`M ${CENTER + NODE_RADIUS} ${CENTER} A ${NODE_RADIUS} ${NODE_RADIUS} 0 0 1 ${CENTER} ${
            CENTER + NODE_RADIUS
          }`}
          fill="none"
          stroke="rgba(54,148,252,0.18)"
          strokeWidth="1"
        />
        <path
          d={`M ${CENTER} ${CENTER + NODE_RADIUS} A ${NODE_RADIUS} ${NODE_RADIUS} 0 0 1 ${
            CENTER - NODE_RADIUS
          } ${CENTER}`}
          fill="none"
          stroke="rgba(54,148,252,0.18)"
          strokeWidth="1"
        />
        <path
          d={`M ${CENTER - NODE_RADIUS} ${CENTER} A ${NODE_RADIUS} ${NODE_RADIUS} 0 0 1 ${CENTER} ${
            CENTER - NODE_RADIUS
          }`}
          fill="none"
          stroke="rgba(54,148,252,0.18)"
          strokeWidth="1"
        />
      </svg>

      {/* center node */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative grid size-28 place-items-center rounded-full border border-white/[0.10] bg-[#1f1f29]/85 shadow-[0_0_60px_-12px_rgba(54,148,252,0.45)] backdrop-blur-xl">
          <div className="absolute inset-1.5 rounded-full bg-gradient-to-br from-[#3694fc]/15 via-transparent to-[#3694fc]/5" />
          <div className="relative flex flex-col items-center">
            <Logo size={32} />
            <p className="mt-1 text-[11px] font-semibold tracking-tight text-[#f2f0eb]">
              Agent<span className="text-[#3694fc]">360</span>
            </p>
          </div>
          <span className="a360-pulse pointer-events-none absolute -inset-3 -z-10 rounded-full border border-[#3694fc]/20" />
          <span className="pointer-events-none absolute -inset-6 -z-20 rounded-full border border-[#3694fc]/10" />
        </div>
      </div>

      {/* outer nodes */}
      {orbitNodes.map((node) => {
        const p = pointOnRing(node.angle, NODE_RADIUS)
        const xPct = (p.x / VIEW) * 100
        const yPct = (p.y / VIEW) * 100
        return (
          <button
            key={node.key}
            type="button"
            onClick={() => navigate(node.path)}
            aria-label={`Open ${node.label}`}
            className="group absolute -translate-x-1/2 -translate-y-1/2 outline-none"
            style={{ left: `${xPct}%`, top: `${yPct}%` }}
          >
            <span className="relative flex flex-col items-center gap-1 rounded-xl border border-white/[0.08] bg-[#21212b]/85 px-3 py-2 backdrop-blur-md transition group-hover:-translate-y-0.5 group-hover:border-[#3694fc]/40 group-hover:bg-[#21212b]/95 group-hover:shadow-[0_18px_40px_-22px_rgba(54,148,252,0.6)] group-focus-visible:border-[#3694fc]/60 group-focus-visible:ring-2 group-focus-visible:ring-[#3694fc]/30">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-[#3694fc] shadow-[0_0_8px_rgba(54,148,252,0.7)]" />
                <span className="whitespace-nowrap text-[12px] font-semibold text-[#f2f0eb]">
                  {node.label}
                </span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#f2f0eb]/50">
                {node.sub}
              </span>
            </span>
          </button>
        )
      })}

      <p className="sr-only">
        Agent360 connects four observability views: Operational Health, Agent Effectiveness and
        Trust, Value Delivered, and Cost Optimization.
      </p>
    </div>
  )
}
