import type { ReactNode } from 'react'

type AISummarySectionStackProps = {
  children: ReactNode
  className?: string
}

type AISummaryCardProps = {
  children: ReactNode
  className?: string
}

type AISummaryBulletSectionProps = {
  title: string
  items: string[]
  className?: string
}

type AISummaryFooterProps = {
  text: string
  className?: string
}

export function AISummarySectionStack({ children, className }: AISummarySectionStackProps) {
  return <div className={`space-y-4 md:space-y-5 ${className ?? ''}`}>{children}</div>
}

export function AISummaryCard({ children, className }: AISummaryCardProps) {
  return (
    <div
      className={`rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 ${className ?? ''}`}
    >
      {children}
    </div>
  )
}

export function AISummaryBulletSection({
  title,
  items,
  className,
}: AISummaryBulletSectionProps) {
  return (
    <AISummaryCard className={className}>
      <p className="text-[10px] uppercase tracking-[0.2em] text-[#f2f0eb]/45">{title}</p>
      <ul className="mt-3 list-disc space-y-2 pl-4 text-[13px] leading-relaxed text-[#f2f0eb]/75">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </AISummaryCard>
  )
}

export function AISummaryFooter({ text, className }: AISummaryFooterProps) {
  return (
    <p
      className={`mt-2 border-t border-white/[0.06] pt-4 text-[11px] leading-relaxed text-[#f2f0eb]/50 ${className ?? ''}`}
    >
      {text}
    </p>
  )
}
