type StatusDotProps = {
  tone?: 'live' | 'blue' | 'amber' | 'rose' | 'neutral'
  size?: 'sm' | 'md'
  pulse?: boolean
}

const toneMap: Record<NonNullable<StatusDotProps['tone']>, string> = {
  live: 'bg-[#3DD68C]',
  blue: 'bg-[#3694fc]',
  amber: 'bg-[#D6A85B]',
  rose: 'bg-[#E07a83]',
  neutral: 'bg-[#f2f0eb]/60',
}

export function StatusDot({ tone = 'live', size = 'sm', pulse = true }: StatusDotProps) {
  const dim = size === 'md' ? 'size-2.5' : 'size-2'
  return (
    <span className={`relative inline-flex ${dim}`}>
      {pulse ? (
        <span
          className={`absolute inline-flex h-full w-full animate-ping rounded-full ${toneMap[tone]} opacity-50`}
        />
      ) : null}
      <span className={`relative inline-flex rounded-full ${dim} ${toneMap[tone]}`} />
    </span>
  )
}
