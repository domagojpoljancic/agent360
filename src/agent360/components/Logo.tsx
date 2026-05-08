type LogoProps = {
  size?: number
  className?: string
}

export function Logo({ size = 28, className }: LogoProps) {
  return (
    <span
      className={`relative inline-flex items-center justify-center ${className ?? ''}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 64 64" width={size} height={size}>
        <defs>
          <linearGradient id="agent360-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7DB6FE" />
            <stop offset="100%" stopColor="#3694FC" />
          </linearGradient>
        </defs>
        <circle
          cx="32"
          cy="32"
          r="27"
          fill="none"
          stroke="url(#agent360-logo-grad)"
          strokeWidth="1.5"
          strokeDasharray="3 5"
          opacity="0.7"
        />
        <circle
          cx="32"
          cy="32"
          r="20"
          fill="none"
          stroke="#3694FC"
          strokeOpacity="0.45"
          strokeWidth="1.2"
        />
        <circle cx="32" cy="32" r="9" fill="url(#agent360-logo-grad)" />
        <circle cx="32" cy="32" r="3" fill="#1a1a22" />
        <circle cx="59" cy="32" r="2" fill="#3694FC" />
        <circle cx="5" cy="32" r="2" fill="#3694FC" opacity="0.55" />
        <circle cx="32" cy="59" r="2" fill="#3694FC" opacity="0.7" />
        <circle cx="32" cy="5" r="2" fill="#3694FC" opacity="0.7" />
      </svg>
    </span>
  )
}
