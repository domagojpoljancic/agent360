import { Star } from 'lucide-react'

type StarRatingProps = {
  value: number
  onChange?: (value: number) => void
  readOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const iconSize: Record<NonNullable<StarRatingProps['size']>, string> = {
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-5',
}

const gapClass: Record<NonNullable<StarRatingProps['size']>, string> = {
  sm: 'gap-0.5',
  md: 'gap-1',
  lg: 'gap-1',
}

export function StarRating({
  value,
  onChange,
  readOnly = false,
  size = 'md',
  className = '',
}: StarRatingProps) {
  const interactive = Boolean(onChange) && !readOnly
  const roundedClick = Math.min(5, Math.max(0, Math.round(value)))

  if (interactive) {
    return (
      <div
        className={`inline-flex items-center ${gapClass[size]} ${className}`}
        role="radiogroup"
        aria-label="Rating"
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= roundedClick
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={star === roundedClick}
              onClick={() => onChange?.(star)}
              className="rounded p-0.5 text-[#f2f0eb]/25 transition hover:text-[#D6A85B]/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3694fc]/50"
            >
              <Star
                className={`${iconSize[size]} ${
                  filled
                    ? 'fill-[#D6A85B]/90 text-[#D6A85B]/90'
                    : 'fill-transparent text-[#f2f0eb]/22'
                }`}
                strokeWidth={1.35}
              />
            </button>
          )
        })}
      </div>
    )
  }

  const clamped = Math.min(5, Math.max(0, value))
  const whole = Math.floor(clamped)
  const fraction = clamped - whole

  return (
    <div
      className={`inline-flex items-center ${gapClass[size]} ${className}`}
      role="img"
      aria-label={`${clamped.toFixed(1)} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        if (star <= whole) {
          return (
            <Star
              key={star}
              className={`${iconSize[size]} fill-[#D6A85B]/85 text-[#D6A85B]/85`}
              strokeWidth={1.35}
            />
          )
        }
        if (star === whole + 1 && fraction > 0.001) {
          const pct = Math.round(fraction * 100)
          return (
            <span key={star} className={`relative inline-grid place-items-center ${iconSize[size]}`}>
              <Star className={`${iconSize[size]} fill-transparent text-[#f2f0eb]/18`} strokeWidth={1.35} />
              <span
                className="pointer-events-none absolute inset-0 overflow-hidden"
                style={{ width: `${pct}%` }}
              >
                <Star className={`${iconSize[size]} fill-[#D6A85B]/85 text-[#D6A85B]/85`} strokeWidth={1.35} />
              </span>
            </span>
          )
        }
        return (
          <Star
            key={star}
            className={`${iconSize[size]} fill-transparent text-[#f2f0eb]/18`}
            strokeWidth={1.35}
          />
        )
      })}
    </div>
  )
}
