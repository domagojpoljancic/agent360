import { PageTransitionCard } from './PageTransitionCard'

const HEADER_H = '3.5rem' /* h-14 — matches Agent360 header */

type PageTransitionLayerProps = {
  isVisible: boolean
  isLeaving: boolean
  targetPageName: string
}

/**
 * Regional dim + centered card below the sticky header (navbar stays crisp).
 */
export function PageTransitionLayer({
  isVisible,
  isLeaving,
  targetPageName,
}: PageTransitionLayerProps) {
  if (!isVisible) return null

  return (
    <>
      <div
        aria-hidden
        className={`a360-page-tx-shade pointer-events-none fixed inset-x-0 bottom-0 z-[28] ${
          isLeaving ? 'a360-page-tx-shade--leave' : 'a360-page-tx-shade--enter'
        }`}
        style={{ top: HEADER_H }}
      />
      <div
        className="pointer-events-none fixed inset-x-0 z-[29] flex justify-center px-4"
        style={{
          top: HEADER_H,
          bottom: 0,
          alignItems: 'center',
        }}
      >
        <PageTransitionCard
          isVisible
          isLeaving={isLeaving}
          targetPageName={targetPageName}
        />
      </div>
    </>
  )
}
