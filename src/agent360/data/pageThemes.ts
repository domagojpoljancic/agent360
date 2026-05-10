import type { ViewKey } from './views'

/**
 * Page “energy signature” tokens aligned with `views[].accent` / switcher icons.
 * Use for ambient grid, hero chrome, and primary controls — not full UI recolor.
 */
export type PageTheme = {
  /** Large fixed grid wash (see GridBackground). */
  gridOrbPrimary: string
  gridOrbSecondary: string
  /** Hero card shell. */
  heroSection: string
  heroGlowRight: string
  heroGlowLeft: string
  heroTopLine: string
  refreshButton: string
  timeRangeActive: string
  /** KPI / overview strip section (first major band below hero). */
  kpiStripSection: string
  kpiStripAura: string
  kpiStripAuraSecondary: string
  kpiStripTopLine: string
  kpiStripLabel: string
  kpiCardTrendMuted: string
  kpiCardHoverBorder: string
  kpiCardHoverShadow: string
}

export const pageThemes: Record<ViewKey, PageTheme> = {
  'value-delivered': {
    gridOrbPrimary:
      'absolute -top-32 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[#5DC2A8]/[0.12] blur-3xl',
    gridOrbSecondary:
      'absolute top-[30%] right-[8%] h-[380px] w-[380px] rounded-full bg-[#3D9B86]/[0.06] blur-3xl',
    heroSection:
      'relative isolate overflow-hidden rounded-2xl border border-[#5DC2A8]/[0.14] bg-white/[0.02] p-4 shadow-[0_28px_90px_-52px_rgba(93,194,168,0.55)] md:p-5',
    heroGlowRight:
      'pointer-events-none absolute right-6 top-0 -z-10 h-52 w-64 rounded-full bg-[#5DC2A8]/[0.12] blur-3xl',
    heroGlowLeft:
      'pointer-events-none absolute -left-8 bottom-0 -z-10 h-40 w-44 rounded-full bg-[#3D9B86]/[0.08] blur-3xl',
    heroTopLine:
      'pointer-events-none absolute inset-x-10 top-0 z-10 h-px bg-gradient-to-r from-transparent via-[#5DC2A8]/50 to-transparent',
    refreshButton:
      'inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md border border-[#5DC2A8]/35 bg-[#5DC2A8]/10 px-2.5 py-1.5 text-[12px] text-[#f2f0eb] transition hover:border-[#5DC2A8]/70 hover:bg-[#5DC2A8]/16',
    timeRangeActive: 'bg-[#5DC2A8]/22 text-[#f2f0eb]',
    kpiStripSection:
      'relative isolate overflow-hidden rounded-3xl border border-[#5DC2A8]/[0.18] bg-gradient-to-br from-white/[0.055] via-[#20202a]/80 to-[#15151c]/90 p-4 shadow-[0_28px_80px_-58px_rgba(93,194,168,0.85)] md:p-5',
    kpiStripAura:
      'a360-aura pointer-events-none absolute -left-20 -top-24 -z-10 h-72 w-72 rounded-full bg-[#5DC2A8]/[0.15] blur-3xl',
    kpiStripAuraSecondary:
      'pointer-events-none absolute right-0 top-0 -z-10 h-72 w-72 rounded-full bg-[#3694fc]/[0.06] blur-3xl',
    kpiStripTopLine:
      'pointer-events-none absolute inset-x-14 top-0 h-px bg-gradient-to-r from-transparent via-[#5DC2A8]/60 to-transparent',
    kpiStripLabel: 'text-[#5DC2A8]',
    kpiCardTrendMuted: 'text-[#5DC2A8]/85',
    kpiCardHoverBorder: 'hover:border-[#5DC2A8]/38',
    kpiCardHoverShadow: 'hover:shadow-[0_16px_40px_-30px_rgba(93,194,168,0.5)]',
  },
  'cost-optimization': {
    gridOrbPrimary:
      'absolute -top-28 left-1/2 h-[500px] w-[880px] -translate-x-1/2 rounded-full bg-[#D6A85B]/[0.10] blur-3xl',
    gridOrbSecondary:
      'absolute top-[32%] left-[6%] h-[320px] w-[320px] rounded-full bg-[#B8892E]/[0.05] blur-3xl',
    heroSection:
      'relative isolate overflow-hidden rounded-2xl border border-[#D6A85B]/[0.15] bg-white/[0.02] p-4 shadow-[0_28px_90px_-52px_rgba(214,168,91,0.42)] md:p-5',
    heroGlowRight:
      'pointer-events-none absolute right-8 top-0 -z-10 h-48 w-60 rounded-full bg-[#D6A85B]/[0.11] blur-3xl',
    heroGlowLeft:
      'pointer-events-none absolute -left-6 top-1/2 -z-10 h-36 w-40 -translate-y-1/2 rounded-full bg-[#B8892E]/[0.07] blur-3xl',
    heroTopLine:
      'pointer-events-none absolute inset-x-10 top-0 z-10 h-px bg-gradient-to-r from-transparent via-[#D6A85B]/45 to-transparent',
    refreshButton:
      'inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md border border-[#D6A85B]/38 bg-[#D6A85B]/11 px-2 py-1 text-[12px] text-[#f2f0eb] transition hover:border-[#D6A85B]/72 hover:bg-[#D6A85B]/18 md:px-2.5',
    timeRangeActive: 'bg-[#D6A85B]/22 text-[#f2f0eb]',
    kpiStripSection:
      'relative isolate overflow-hidden rounded-3xl border border-[#D6A85B]/[0.16] bg-gradient-to-br from-white/[0.05] via-[#20202a]/82 to-[#15151c]/92 p-3 shadow-[0_26px_72px_-56px_rgba(214,168,91,0.65)] md:p-4',
    kpiStripAura:
      'pointer-events-none absolute -right-16 -top-20 -z-10 h-64 w-64 rounded-full bg-[#D6A85B]/[0.12] blur-3xl',
    kpiStripAuraSecondary:
      'pointer-events-none absolute -left-12 bottom-0 -z-10 h-52 w-52 rounded-full bg-[#B8892E]/[0.07] blur-3xl',
    kpiStripTopLine:
      'pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[#D6A85B]/50 to-transparent',
    kpiStripLabel: 'text-[#D6A85B]',
    kpiCardTrendMuted: 'text-[#D6A85B]/88',
    kpiCardHoverBorder: 'hover:border-[#D6A85B]/40',
    kpiCardHoverShadow: 'hover:shadow-[0_16px_40px_-30px_rgba(214,168,91,0.48)]',
  },
  'agent-effectiveness-trust': {
    gridOrbPrimary:
      'absolute -top-32 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[#9aa6f0]/[0.10] blur-3xl',
    gridOrbSecondary:
      'absolute top-[26%] left-[10%] h-[360px] w-[360px] rounded-full bg-[#6B7FD7]/[0.06] blur-3xl',
    heroSection:
      'relative isolate overflow-hidden rounded-2xl border border-[#9aa6f0]/[0.14] bg-white/[0.02] p-4 shadow-[0_28px_90px_-52px_rgba(154,166,240,0.48)] md:p-5',
    heroGlowRight:
      'pointer-events-none absolute right-6 top-0 -z-10 h-48 w-56 rounded-full bg-[#9aa6f0]/[0.11] blur-3xl',
    heroGlowLeft:
      'pointer-events-none absolute -left-10 bottom-2 -z-10 h-44 w-48 rounded-full bg-[#7c8aed]/[0.08] blur-3xl',
    heroTopLine:
      'pointer-events-none absolute inset-x-10 top-0 z-10 h-px bg-gradient-to-r from-transparent via-[#9aa6f0]/45 to-transparent',
    refreshButton:
      'inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md border border-[#9aa6f0]/38 bg-[#9aa6f0]/10 px-2 py-1 text-[12px] text-[#f2f0eb] transition hover:border-[#9aa6f0]/70 hover:bg-[#9aa6f0]/16 md:px-2.5',
    timeRangeActive: 'bg-[#9aa6f0]/22 text-[#f2f0eb]',
    kpiStripSection:
      'relative isolate overflow-hidden rounded-3xl border border-[#9aa6f0]/[0.15] bg-gradient-to-br from-white/[0.048] via-[#20202a]/82 to-[#15151c]/92 p-3 shadow-[0_26px_72px_-56px_rgba(154,166,240,0.55)] md:p-4',
    kpiStripAura:
      'pointer-events-none absolute -left-14 top-0 -z-10 h-60 w-60 rounded-full bg-[#9aa6f0]/[0.11] blur-3xl',
    kpiStripAuraSecondary:
      'pointer-events-none absolute right-0 bottom-0 -z-10 h-56 w-56 rounded-full bg-[#7c8aed]/[0.07] blur-3xl',
    kpiStripTopLine:
      'pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[#9aa6f0]/48 to-transparent',
    kpiStripLabel: 'text-[#9aa6f0]',
    kpiCardTrendMuted: 'text-[#9aa6f0]/88',
    kpiCardHoverBorder: 'hover:border-[#9aa6f0]/38',
    kpiCardHoverShadow: 'hover:shadow-[0_16px_40px_-30px_rgba(154,166,240,0.55)]',
  },
  'operational-health': {
    gridOrbPrimary:
      'absolute -top-32 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[#3694fc]/[0.11] blur-3xl',
    gridOrbSecondary:
      'absolute top-[28%] right-[10%] h-[400px] w-[400px] rounded-full bg-[#7DB6FE]/[0.07] blur-3xl',
    heroSection:
      'relative isolate overflow-hidden rounded-2xl border border-[#3694fc]/[0.16] bg-white/[0.02] p-4 shadow-[0_28px_90px_-52px_rgba(54,148,252,0.5)] md:p-5',
    heroGlowRight:
      'pointer-events-none absolute right-4 top-0 -z-10 h-52 w-64 rounded-full bg-[#3694fc]/[0.12] blur-3xl',
    heroGlowLeft:
      'pointer-events-none absolute -left-8 top-1/3 -z-10 h-40 w-44 rounded-full bg-[#7DB6FE]/[0.09] blur-3xl',
    heroTopLine:
      'pointer-events-none absolute inset-x-10 top-0 z-10 h-px bg-gradient-to-r from-transparent via-[#3694fc]/55 to-transparent',
    refreshButton:
      'inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-md border border-[#3694fc]/38 bg-[#3694fc]/11 px-2 py-1 text-[12px] text-[#f2f0eb] transition hover:border-[#7DB6FE]/75 hover:bg-[#3694fc]/18 md:px-2.5',
    timeRangeActive: 'bg-[#3694fc]/22 text-[#f2f0eb]',
    kpiStripSection:
      'relative isolate overflow-hidden rounded-3xl border border-[#3694fc]/[0.15] bg-gradient-to-br from-white/[0.048] via-[#20202a]/82 to-[#15151c]/92 p-3 shadow-[0_26px_72px_-56px_rgba(54,148,252,0.55)] md:p-4',
    kpiStripAura:
      'pointer-events-none absolute right-0 -top-16 -z-10 h-64 w-64 rounded-full bg-[#3694fc]/[0.11] blur-3xl',
    kpiStripAuraSecondary:
      'pointer-events-none absolute -left-8 top-1/2 -z-10 h-48 w-48 -translate-y-1/2 rounded-full bg-[#7DB6FE]/[0.08] blur-3xl',
    kpiStripTopLine:
      'pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[#3694fc]/55 to-transparent',
    kpiStripLabel: 'text-[#7DB6FE]',
    kpiCardTrendMuted: 'text-[#7DB6FE]/90',
    kpiCardHoverBorder: 'hover:border-[#3694fc]/42',
    kpiCardHoverShadow: 'hover:shadow-[0_16px_40px_-30px_rgba(54,148,252,0.65)]',
  },
}

export function getPageTheme(key: ViewKey): PageTheme {
  return pageThemes[key]
}
