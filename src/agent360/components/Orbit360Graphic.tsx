import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight, HeartPulse, ShieldCheck, Sliders, TrendingUp } from 'lucide-react'
import type { AccentTone, ViewKey } from '../data/views'
import { usePageTransition } from '../page-transition/PageTransitionProvider'
import { Logo } from './Logo'

type OrbitNode = {
  key: ViewKey
  path: string
  /** Compact label rendered on the orbit card. */
  label: string
  fullLabel: string
  /** Short uppercase tagline rendered below the label. */
  tagline: string
  /** One-line description revealed on the active card. */
  description: string
  /** Two short metric chips revealed on the active card. */
  metrics: [string, string]
  angle: number
  icon: LucideIcon
  /** Theme accent — mirrors the matching `AgentView.accent` so every surface
   *  (menu icon, sphere card, destination page) shares the same color identity.
   *  Source of truth is `views.ts` (`AccentTone`); kept in sync here. */
  accent: AccentTone
}

const orbitNodes: OrbitNode[] = [
  {
    key: 'value-delivered',
    path: '/value-delivered',
    label: 'Value Delivered',
    fullLabel: 'Value Delivered',
    tagline: 'Measurable impact',
    description: 'Workload reduction, business impact, and outcomes.',
    metrics: ['8.6k tickets', '€42.7k value'],
    angle: 45,
    icon: TrendingUp,
    accent: 'emerald',
  },
  {
    key: 'cost-optimization',
    path: '/cost-optimization',
    label: 'Cost Optimization',
    fullLabel: 'Cost Optimization',
    tagline: 'Efficient AI usage',
    description: 'Model efficiency and AI spend optimization.',
    metrics: ['18% optimized', 'GPT-4o overuse'],
    angle: 135,
    icon: Sliders,
    accent: 'amber',
  },
  {
    key: 'agent-effectiveness-trust',
    path: '/agent-effectiveness-trust',
    label: 'Effectiveness & Trust',
    fullLabel: 'Agent Effectiveness & Trust',
    tagline: 'Useful & trusted',
    description: 'Groundedness, task success, and user trust signals.',
    metrics: ['91% trusted', '9.1% retries'],
    angle: -45,
    icon: ShieldCheck,
    accent: 'violet',
  },
  {
    key: 'operational-health',
    path: '/operational-health',
    label: 'Operational Health',
    fullLabel: 'Operational Health',
    tagline: 'Stable & reliable',
    description: 'Monitor reliability, latency, and runtime stability.',
    metrics: ['99.94% uptime', '1.8s p95'],
    angle: -135,
    icon: HeartPulse,
    accent: 'cyan',
  },
]

/** Per-tone palette for the orbit cards. `primary` matches the menu /
 *  destination-page accent (see `accentClasses` in views.ts), `bright` is the
 *  hover highlight, and the `*Rgb` tuples drive SVG strokes + multi-stop
 *  shadows that need rgba() arithmetic that Tailwind class strings can't do. */
const TONES: Record<
  AccentTone,
  { primary: string; bright: string; rgb: string; brightRgb: string }
> = {
  cyan:    { primary: '#3694fc', bright: '#7DB6FE', rgb: '54, 148, 252',  brightRgb: '125, 182, 254' },
  violet:  { primary: '#9aa6f0', bright: '#c0c8f6', rgb: '154, 166, 240', brightRgb: '192, 200, 246' },
  emerald: { primary: '#5DC2A8', bright: '#8fdac8', rgb: '93, 194, 168',  brightRgb: '143, 218, 200' },
  amber:   { primary: '#D6A85B', bright: '#ecc788', rgb: '214, 168, 91',  brightRgb: '236, 199, 136' },
}

const VIEW = 400
const CENTER = VIEW / 2
const NODE_RADIUS = 160
const RING_RADII = [88, 124, 160]
/** Half the compact header height in px — used to keep the icon row visually
 * pinned to the orbit anchor as the card expands downward. */
const HEADER_HALF_PX = 32

function pointOnRing(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180
  return {
    x: CENTER + Math.cos(rad) * radius,
    y: CENTER + Math.sin(rad) * radius,
  }
}

type Orbit360GraphicProps = {
  /** Externally-controlled focused node — drives every active visual state. */
  activeKey?: ViewKey | null
  /** Notifies the parent on pointer/focus enter or leave. */
  onHoverChange?: (key: ViewKey | null) => void
}

export function Orbit360Graphic({ activeKey = null, onHoverChange }: Orbit360GraphicProps) {
  // Reuse the same animated route transition as the header dropdown so the
  // sphere cards feel identical to selecting a view from the menu — same
  // shade, same loader, same easing, same pageEnter handoff.
  const { startMainViewTransition } = usePageTransition()

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[600px]"
      onMouseLeave={() => onHoverChange?.(null)}
    >
      {/* ambient blue halo behind the orbit — softer + tighter */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[18%] rounded-full bg-[#3694fc]/[0.05] blur-3xl"
      />

      <svg
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <radialGradient id="orbit-core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(54,148,252,0.30)" />
            <stop offset="55%" stopColor="rgba(54,148,252,0.06)" />
            <stop offset="100%" stopColor="rgba(54,148,252,0)" />
          </radialGradient>
          <radialGradient id="orbit-sphere-disc" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(54,148,252,0.14)" />
            <stop offset="100%" stopColor="rgba(54,148,252,0)" />
          </radialGradient>
        </defs>

        {/* core glow — small + soft, lets the cards dominate */}
        <circle cx={CENTER} cy={CENTER} r={150} fill="url(#orbit-core-glow)" opacity="0.65" />
        <circle cx={CENTER} cy={CENTER} r={48} fill="url(#orbit-sphere-disc)" />

        {/* concentric rings — thin and calm */}
        {RING_RADII.map((r, i) => (
          <circle
            key={`ring-${r}`}
            cx={CENTER}
            cy={CENTER}
            r={r}
            fill="none"
            stroke="rgba(242,240,235,0.085)"
            strokeWidth={i === RING_RADII.length - 1 ? 0.8 : 0.55}
            strokeDasharray={i === 0 ? '0' : '2 8'}
          />
        ))}

        {/* outer ring quarter arcs (extra blue tint) */}
        {[0, 90, 180, 270].map((startAngle) => {
          const start = pointOnRing(startAngle - 90, NODE_RADIUS)
          const end = pointOnRing(startAngle, NODE_RADIUS)
          return (
            <path
              key={`arc-${startAngle}`}
              d={`M ${start.x} ${start.y} A ${NODE_RADIUS} ${NODE_RADIUS} 0 0 1 ${end.x} ${end.y}`}
              fill="none"
              stroke="rgba(54,148,252,0.14)"
              strokeWidth="0.8"
            />
          )
        })}

        {/* connector lines from center to each node — themed per-node so each
            dimension's "channel" carries its own color identity. */}
        {orbitNodes.map((node) => {
          const tone = TONES[node.accent]
          const p = pointOnRing(node.angle, NODE_RADIUS - 4)
          const isActive = activeKey === node.key
          return (
            <line
              key={`line-${node.key}`}
              x1={CENTER}
              y1={CENTER}
              x2={p.x}
              y2={p.y}
              stroke={isActive ? `rgba(${tone.brightRgb},1)` : `rgba(${tone.rgb},0.55)`}
              strokeWidth={isActive ? 2 : 0.85}
              strokeDasharray={isActive ? '0' : '2 7'}
              opacity={isActive ? 1 : 0.55}
              style={{ transition: 'all 280ms ease' }}
            />
          )
        })}

        {/* active orbit segment — illuminates the arc closest to the focused
            node so the orbit itself reacts to the hover. Uses the node's own
            theme highlight so the orbit picks up the dimension's color. */}
        {orbitNodes.map((node) => {
          const tone = TONES[node.accent]
          const isActive = activeKey === node.key
          const arcSpan = 60
          const start = pointOnRing(node.angle - arcSpan / 2, NODE_RADIUS)
          const end = pointOnRing(node.angle + arcSpan / 2, NODE_RADIUS)
          return (
            <path
              key={`arc-active-${node.key}`}
              d={`M ${start.x} ${start.y} A ${NODE_RADIUS} ${NODE_RADIUS} 0 0 1 ${end.x} ${end.y}`}
              fill="none"
              stroke={`rgba(${tone.brightRgb},0.9)`}
              strokeWidth={2}
              strokeLinecap="round"
              opacity={isActive ? 0.9 : 0}
              style={{ transition: 'opacity 320ms ease' }}
            />
          )
        })}

        {/* slow rotating sweep band */}
        <g className="a360-rotate-slow" style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}>
          <path
            d={`M ${CENTER} ${CENTER} L ${CENTER} ${CENTER - 160} A 160 160 0 0 1 ${
              CENTER + 160 * Math.cos((-30 * Math.PI) / 180)
            } ${CENTER + 160 * Math.sin((-30 * Math.PI) / 180)} Z`}
            fill="rgba(54,148,252,0.06)"
          />
          <circle cx={CENTER} cy={CENTER - 160} r="2" fill="#3694FC" opacity="0.75" />
        </g>

        {/* counter rotating signal dot */}
        <g className="a360-rotate-rev" style={{ transformOrigin: `${CENTER}px ${CENTER}px` }}>
          <circle cx={CENTER + 124} cy={CENTER} r="1.6" fill="#7DB6FE" opacity="0.65" />
        </g>

        {/* slow signal dot on inner ring */}
        <g
          className="a360-rotate-slow"
          style={{ transformOrigin: `${CENTER}px ${CENTER}px`, animationDuration: '28s' }}
        >
          <circle cx={CENTER - 88} cy={CENTER} r="1.4" fill="#3694FC" opacity="0.65" />
        </g>
      </svg>

      {/* center sphere — small, soft, recessive */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative grid size-24 place-items-center rounded-full border border-[#3694fc]/20 bg-[#1c1c25]/90 shadow-[0_0_60px_-15px_rgba(54,148,252,0.32),inset_0_0_22px_rgba(54,148,252,0.08)] backdrop-blur-xl">
          <div className="absolute inset-1.5 rounded-full bg-gradient-to-br from-[#3694fc]/14 via-transparent to-[#3694fc]/[0.03]" />
          <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/[0.04]" />
          <div className="relative flex flex-col items-center">
            <Logo size={28} />
            <p className="mt-0.5 text-[10.5px] font-semibold tracking-tight text-[#f2f0eb]">
              Agent<span className="text-[#3694fc]">360</span>
            </p>
            <p className="text-[7.5px] uppercase tracking-[0.22em] text-[#f2f0eb]/45">
              Operating
            </p>
          </div>
          <span className="a360-pulse pointer-events-none absolute -inset-2 -z-10 rounded-full border border-[#3694fc]/15" />
          <span className="pointer-events-none absolute -inset-5 -z-20 rounded-full border border-[#3694fc]/[0.05]" />
        </div>
      </div>

      {/* outer node cards — primary navigation, anchored at NW / NE / SE / SW.
          The icon row is pinned to the orbit ring as the card expands so the
          orbit anchor never shifts. Each card grows INWARD (toward the center
          sphere) so it can never escape the parent container — top cards grow
          downward, bottom cards grow upward — preventing overflow on dense
          dimensions like Cost Optimization at the bottom of the orbit.
          Each card uses its `accent` tone (mirrored from `views.ts`) for
          every themed surface — icon chip, border, glow, ripple, top edge,
          tagline highlight, metric dots, and "Open view" CTA — so each
          dimension carries a distinct color identity that matches the menu
          and destination page. */}
      {orbitNodes.map((node) => {
        const tone = TONES[node.accent]
        const p = pointOnRing(node.angle, NODE_RADIUS)
        const xPct = (p.x / VIEW) * 100
        const yPct = (p.y / VIEW) * 100
        const Icon = node.icon
        const isActive = activeKey === node.key
        // Positive screen-y angles (45°, 135°) sit in the bottom half of the
        // orbit; those cards expand upward so the expansion stays inside the
        // container. Top cards keep the original downward growth.
        const isBottom = node.angle > 0

        return (
          <button
            key={node.key}
            type="button"
            onClick={() => startMainViewTransition(node.path, node.fullLabel)}
            onMouseEnter={() => onHoverChange?.(node.key)}
            onFocus={() => onHoverChange?.(node.key)}
            onBlur={() => onHoverChange?.(null)}
            aria-label={`Open ${node.fullLabel}`}
            className={`group absolute -translate-x-1/2 cursor-pointer outline-none transition-transform duration-150 ease-out active:scale-[0.98] ${
              isActive ? 'z-20' : 'z-10'
            }`}
            style={{
              left: `${xPct}%`,
              // Top cards anchor by their top edge (header at the orbit ring,
              // body grows downward). Bottom cards anchor by their bottom edge
              // (header at the orbit ring, body grows upward into the orbit).
              ...(isBottom
                ? { bottom: `calc(${100 - yPct}% - ${HEADER_HALF_PX}px)` }
                : { top: `calc(${yPct}% - ${HEADER_HALF_PX}px)` }),
            }}
          >
            {/* radial halo behind card — themed soft glow when active */}
            <span
              aria-hidden
              className={`pointer-events-none absolute -inset-4 -z-10 rounded-3xl blur-2xl transition-opacity duration-500 ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundColor: `rgba(${tone.rgb},0.20)` }}
            />

            {/* themed ripple ring on active */}
            <span
              aria-hidden
              className={`pointer-events-none absolute -inset-2 rounded-2xl border transition-opacity duration-500 ${
                isActive ? 'a360-ripple opacity-100' : 'opacity-0'
              }`}
              style={{ borderColor: `rgba(${tone.rgb},0.30)` }}
            />

            <span
              className={`relative flex w-[210px] rounded-2xl border bg-[#21212b]/95 text-left backdrop-blur-md transition-[border-color,box-shadow,background-color] duration-300 ease-out group-focus-visible:ring-2 sm:w-[220px] ${
                isBottom ? 'flex-col-reverse' : 'flex-col'
              }`}
              style={{
                borderColor: isActive
                  ? `rgba(${tone.rgb},0.65)`
                  : 'rgba(255,255,255,0.10)',
                backgroundColor: isActive ? '#23232e' : undefined,
                boxShadow: isActive
                  ? `0 28px 70px -22px rgba(${tone.rgb},0.85), 0 0 0 1px rgba(${tone.rgb},0.20)`
                  : undefined,
                // Picked up by `group-focus-visible:ring-2` for keyboard-only focus.
                ['--tw-ring-color' as string]: `rgba(${tone.rgb},0.30)`,
              }}
            >
              {/* themed edge highlight on active — sits on the card edge nearest
                  the orbit ring (top for top cards, bottom for bottom cards) */}
              <span
                aria-hidden
                className={`pointer-events-none absolute inset-x-4 h-px transition-opacity duration-300 ${
                  isBottom ? '-bottom-px' : '-top-px'
                }`}
                style={{
                  background: `linear-gradient(to right, transparent, rgba(${tone.rgb},0.70), transparent)`,
                  opacity: isActive ? 1 : 0,
                }}
              />

              {/* HEADER — always visible. Icon row's center sits on the orbit
                  ring regardless of growth direction (achieved via the
                  `flex-col-reverse` flip on bottom cards above). */}
              <span className="flex items-center gap-3 px-4 py-3">
                <span
                  className="grid size-10 shrink-0 place-items-center rounded-xl border transition-[background-color,border-color,color] duration-300"
                  style={{
                    backgroundColor: isActive
                      ? `rgba(${tone.rgb},0.22)`
                      : `rgba(${tone.rgb},0.10)`,
                    borderColor: isActive
                      ? `rgba(${tone.rgb},0.65)`
                      : `rgba(${tone.rgb},0.30)`,
                    color: isActive ? tone.bright : tone.primary,
                  }}
                >
                  <Icon className="size-[18px]" />
                </span>
                <span className="flex min-w-0 flex-col items-start leading-tight">
                  <span className="truncate whitespace-nowrap text-[13px] font-semibold tracking-tight text-[#f2f0eb]">
                    {node.label}
                  </span>
                  <span
                    className="mt-0.5 truncate whitespace-nowrap text-[9.5px] font-medium uppercase tracking-[0.18em] transition-colors duration-300"
                    style={{
                      color: isActive ? tone.bright : 'rgba(242,240,235,0.45)',
                    }}
                  >
                    {node.tagline}
                  </span>
                </span>
              </span>

              {/* EXPANSION — collapses smoothly via the grid-rows trick so we
                  never reflow the rest of the orbit. Active card grows toward
                  the orbit center (downward for top cards, upward for bottom).
                  `grid-cols-[minmax(0,1fr)]` pins the implicit column to the
                  card width so long descriptions can't push the grid wider
                  than its parent (otherwise the default `min-width: auto` on
                  grid/flex items causes overflow past the card border). */}
              <span
                className={`grid w-full grid-cols-[minmax(0,1fr)] overflow-hidden transition-[grid-template-rows] duration-[400ms] ease-out ${
                  isActive ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <span className="min-h-0 min-w-0">
                  <span
                    className={`flex w-full min-w-0 flex-col gap-2 px-4 transition-[opacity,transform] duration-300 ease-out ${
                      // Mirror the inner padding so the breathing room sits
                      // on the card edge farthest from the header.
                      isBottom ? 'pt-3' : 'pb-3'
                    } ${
                      isActive
                        ? 'translate-y-0 opacity-100 delay-100'
                        : '-translate-y-1 opacity-0'
                    }`}
                    aria-hidden={!isActive}
                  >
                    {/* hairline separator on the card-side edge of the
                        expansion (between expansion and header). */}
                    {!isBottom && (
                      <span
                        aria-hidden
                        className="-mt-0.5 h-px bg-gradient-to-r from-transparent via-white/[0.10] to-transparent"
                      />
                    )}
                    <p className="text-[11px] leading-snug text-[#f2f0eb]/65 break-words">
                      {node.description}
                    </p>
                    <ul className="flex w-full min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] text-[#f2f0eb]/85">
                      {node.metrics.map((metric) => (
                        <li key={metric} className="flex min-w-0 items-center gap-1.5">
                          <span
                            className="size-1 shrink-0 rounded-full"
                            style={{ backgroundColor: `rgba(${tone.rgb},0.75)` }}
                          />
                          <span className="min-w-0 whitespace-nowrap">{metric}</span>
                        </li>
                      ))}
                    </ul>
                    <span
                      className="mt-0.5 inline-flex items-center gap-1 text-[10.5px] font-semibold"
                      style={{ color: tone.primary }}
                    >
                      Open view
                      <ArrowUpRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                    {isBottom && (
                      <span
                        aria-hidden
                        className="-mb-0.5 h-px bg-gradient-to-r from-transparent via-white/[0.10] to-transparent"
                      />
                    )}
                  </span>
                </span>
              </span>
            </span>
          </button>
        )
      })}

      <p className="sr-only">
        Agent360 connects four observability views: Value Delivered, Cost Optimization, Agent
        Effectiveness and Trust, and Operational Health.
      </p>
    </div>
  )
}
