import type { CSSProperties } from 'react'

/**
 * Cinematic, decorative-only 360° sphere visualization rendered behind the
 * vision page hero. Pure SVG + a CSS conic-gradient sweep, all animations are
 * CSS keyframe transforms (GPU-accelerated). Contains:
 *   - layered concentric + tilted orbit rings (suggests 3D)
 *   - a slow counter-rotating sparse ring
 *   - a glowing accent arc on the outer orbit
 *   - 6 ambient signal nodes orbiting at varied radii / speeds / directions
 *   - 1 bright comet pulse on the outer ring
 *   - 3 pulsing connector lines streaming from the core
 *   - a multi-layer central core
 *   - a soft conic-gradient radar sweep over the whole sphere
 *
 * NOT clickable, NOT interactive — purely atmospheric. Sized via parent.
 */

type VisionSphereProps = {
  className?: string
  style?: CSSProperties
}

type SignalNode = {
  /** Distance from the orbit center, in viewBox units (0..400). */
  radius: number
  /** One full revolution duration, in seconds. */
  duration: number
  /** Negative animation delay used to stagger orbit start positions. */
  delay: number
  /** Rotation direction. */
  dir: 'slow' | 'rev'
  /** Visible dot radius in viewBox units. */
  size: number
  /** Inner highlight intensity. */
  opacity: number
}

const SIGNAL_NODES: SignalNode[] = [
  { radius: 200, duration: 38, delay: -7, dir: 'slow', size: 2.5, opacity: 0.85 },
  { radius: 290, duration: 64, delay: -22, dir: 'slow', size: 3.2, opacity: 0.9 },
  { radius: 380, duration: 118, delay: -40, dir: 'slow', size: 3.6, opacity: 0.92 },
  { radius: 160, duration: 28, delay: -9, dir: 'rev', size: 2.0, opacity: 0.75 },
  { radius: 240, duration: 52, delay: -16, dir: 'rev', size: 2.4, opacity: 0.78 },
  { radius: 330, duration: 86, delay: -55, dir: 'rev', size: 2.8, opacity: 0.82 },
]

export function VisionSphere({ className = '', style }: VisionSphereProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none relative ${className}`}
      style={style}
    >
      {/* Outer ambient halo — soft blue diffusion behind everything */}
      <div className="absolute left-1/2 top-1/2 size-[88%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#3694fc]/[0.045] blur-3xl" />
      <div className="absolute left-1/2 top-1/2 size-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7DB6FE]/[0.03] blur-3xl" />

      {/* SVG sphere geometry */}
      <svg
        viewBox="0 0 800 800"
        className="absolute inset-0 h-full w-full"
        aria-hidden
        role="presentation"
      >
        <defs>
          <radialGradient id="vs-core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(125,182,254,0.30)" />
            <stop offset="40%" stopColor="rgba(54,148,252,0.10)" />
            <stop offset="100%" stopColor="rgba(54,148,252,0)" />
          </radialGradient>

          <radialGradient id="vs-disc" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(54,148,252,0.07)" />
            <stop offset="100%" stopColor="rgba(54,148,252,0)" />
          </radialGradient>

          <radialGradient id="vs-signal" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(125,182,254,0.85)" />
            <stop offset="60%" stopColor="rgba(54,148,252,0.40)" />
            <stop offset="100%" stopColor="rgba(54,148,252,0)" />
          </radialGradient>

          <radialGradient id="vs-comet" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(220,238,255,0.85)" />
            <stop offset="35%" stopColor="rgba(125,182,254,0.55)" />
            <stop offset="100%" stopColor="rgba(54,148,252,0)" />
          </radialGradient>

          <linearGradient id="vs-arc" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(125,182,254,0.85)" />
            <stop offset="100%" stopColor="rgba(54,148,252,0.05)" />
          </linearGradient>
        </defs>

        {/* Background disc — soft inner glow */}
        <circle cx="400" cy="400" r="300" fill="url(#vs-disc)" />

        {/* Concentric flat rings — slow rotation for ambient drift */}
        <g
          className="a360-rotate-slow"
          style={{ transformOrigin: '400px 400px', animationDuration: '120s' }}
        >
          <circle cx="400" cy="400" r="380" fill="none" stroke="rgba(54,148,252,0.07)" strokeWidth="0.6" strokeDasharray="2 12" />
          <circle cx="400" cy="400" r="290" fill="none" stroke="rgba(54,148,252,0.09)" strokeWidth="0.6" strokeDasharray="2 10" />
          <circle cx="400" cy="400" r="200" fill="none" stroke="rgba(54,148,252,0.11)" strokeWidth="0.7" strokeDasharray="2 8" />
          <circle cx="400" cy="400" r="120" fill="none" stroke="rgba(54,148,252,0.13)" strokeWidth="0.7" strokeDasharray="2 6" />
        </g>

        {/* Counter-rotating sparse ring — breaks symmetry */}
        <g
          className="a360-rotate-rev"
          style={{ transformOrigin: '400px 400px', animationDuration: '90s' }}
        >
          <circle cx="400" cy="400" r="245" fill="none" stroke="rgba(125,182,254,0.10)" strokeWidth="0.5" strokeDasharray="1 14" />
        </g>

        {/* Tilted elliptical orbits — static rotations create the 3D illusion */}
        <g>
          <ellipse cx="400" cy="400" rx="335" ry="115" fill="none" stroke="rgba(54,148,252,0.13)" strokeWidth="0.7" transform="rotate(20 400 400)" />
          <ellipse cx="400" cy="400" rx="320" ry="95" fill="none" stroke="rgba(54,148,252,0.10)" strokeWidth="0.6" transform="rotate(-28 400 400)" />
          <ellipse cx="400" cy="400" rx="280" ry="78" fill="none" stroke="rgba(125,182,254,0.10)" strokeWidth="0.5" transform="rotate(72 400 400)" />
        </g>

        {/* Glowing accent arc on the outer ring — rotates faster than rings */}
        <g
          className="a360-rotate-slow"
          style={{ transformOrigin: '400px 400px', animationDuration: '36s' }}
        >
          <path
            d="M 720 400 A 320 320 0 0 1 460 712"
            fill="none"
            stroke="url(#vs-arc)"
            strokeWidth="1.4"
            strokeLinecap="round"
            opacity="0.85"
          />
        </g>

        {/* Pulsing connector lines from the core out to a few orbital points.
            The dashed stroke `flows` outward via stroke-dashoffset animation. */}
        <g className="a360-line-flow" style={{ stroke: 'rgba(125,182,254,0.40)' }}>
          <line x1="400" y1="400" x2="660" y2="248" strokeWidth="0.6" strokeDasharray="3 9" />
          <line x1="400" y1="400" x2="220" y2="540" strokeWidth="0.55" strokeDasharray="3 9" />
          <line x1="400" y1="400" x2="600" y2="620" strokeWidth="0.5" strokeDasharray="3 9" />
          <line x1="400" y1="400" x2="180" y2="280" strokeWidth="0.5" strokeDasharray="3 9" />
        </g>

        {/* Signal nodes — orbit around the core at varied radii / speeds.
            Each is wrapped in a rotating <g>, with a static rotate offset to
            distribute starting angles around the sphere. */}
        {SIGNAL_NODES.map((node, i) => {
          const startAngle = i * 47 // visually distributes nodes
          return (
            <g key={i} transform={`rotate(${startAngle} 400 400)`}>
              <g
                className={node.dir === 'rev' ? 'a360-rotate-rev' : 'a360-rotate-slow'}
                style={{
                  transformOrigin: '400px 400px',
                  animationDuration: `${node.duration}s`,
                  animationDelay: `${node.delay}s`,
                }}
              >
                <g transform={`translate(${400 + node.radius} 400)`}>
                  <circle r={node.size + 4} fill="url(#vs-signal)" opacity="0.45" />
                  <circle r={node.size} fill="#3694FC" opacity={node.opacity} />
                  <circle r={Math.max(0.6, node.size * 0.4)} fill="#dceeff" />
                </g>
              </g>
            </g>
          )
        })}

        {/* Bright comet — fast orbit on the outer ring, suggests "active scan".
            Toned down (no pure white pixel) so it reads as a soft pulse, not a
            hot spotlight when it sweeps behind the hero text. */}
        <g
          className="a360-rotate-slow"
          style={{ transformOrigin: '400px 400px', animationDuration: '9s' }}
        >
          <g transform="translate(720 400)">
            <circle r="9" fill="url(#vs-comet)" opacity="0.55" />
            <circle r="3" fill="rgba(125,182,254,0.65)" />
            <circle r="1" fill="rgba(220,238,255,0.80)" />
          </g>
        </g>

        {/* Center core — multi-layer glow with a slow breathing pulse. Tuned
            for atmosphere, not luminosity: no pure-white hotspot, the brightest
            inner disc is a soft cyan-blue at ~55% alpha. */}
        <g>
          <circle
            cx="400"
            cy="400"
            r="92"
            fill="url(#vs-core-glow)"
            className="a360-aura"
            style={{ transformOrigin: '400px 400px' }}
          />
          <circle
            cx="400"
            cy="400"
            r="44"
            fill="rgba(54,148,252,0.14)"
            className="a360-pulse"
            style={{ transformOrigin: '400px 400px' }}
          />
          <circle cx="400" cy="400" r="22" fill="rgba(125,182,254,0.28)" />
          <circle cx="400" cy="400" r="8" fill="rgba(125,182,254,0.55)" />
        </g>
      </svg>

      {/* Conic-gradient radar sweep overlay — fades from transparent to a soft
          accent, masked into a ring zone, slowly rotating. */}
      <div className="a360-vision-sphere-sweep" />
    </div>
  )
}
