/**
 * Centralized chart styling layer for Agent360 sparkline-class widgets.
 *
 * Reversibility:
 * - Flip `USE_LEGACY_CHARTS` to `true` to restore the previous straight-line
 *   sparklines everywhere. No call sites need to change.
 * - The legacy line renderers live in `./SparkLine.tsx` / `./SparkValueLine.tsx`
 *   and remain importable on their own if a single component ever needs to
 *   opt back into the line look.
 */
export const USE_LEGACY_CHARTS = false

export type SparkTone =
  | 'operational-health'
  | 'agent-effectiveness-trust'
  | 'value-delivered'
  | 'cost-optimization'
  | 'neutral'

export type SparkPalette = {
  /** Primary fill / top of vertical bar gradient. */
  primary: string
  /** Secondary / bottom of bar gradient (deeper hue). */
  secondary: string
  /** Soft halo applied around peak bars. */
  glow: string
  /** Inactive / faded bars. */
  inactive: string
  /** Legacy line stroke. */
  legacyStroke: string
  /** Legacy line drop-shadow. */
  legacyShadow: string
}

const palettes: Record<SparkTone, SparkPalette> = {
  'operational-health': {
    primary: 'rgba(125, 182, 254, 0.92)',
    secondary: 'rgba(54, 148, 252, 0.55)',
    glow: 'rgba(54, 148, 252, 0.45)',
    inactive: 'rgba(125, 182, 254, 0.18)',
    legacyStroke: '#3694fc',
    legacyShadow: '0 0 8px rgba(54,148,252,0.45)',
  },
  'agent-effectiveness-trust': {
    primary: 'rgba(174, 184, 245, 0.95)',
    secondary: 'rgba(124, 138, 237, 0.55)',
    glow: 'rgba(154, 166, 240, 0.5)',
    inactive: 'rgba(154, 166, 240, 0.2)',
    legacyStroke: '#9aa6f0',
    legacyShadow: '0 0 8px rgba(154,166,240,0.5)',
  },
  'value-delivered': {
    primary: 'rgba(125, 224, 197, 0.92)',
    secondary: 'rgba(93, 194, 168, 0.55)',
    glow: 'rgba(93, 194, 168, 0.45)',
    inactive: 'rgba(93, 194, 168, 0.2)',
    legacyStroke: '#5DC2A8',
    legacyShadow: '0 0 7px rgba(93,194,168,0.38)',
  },
  'cost-optimization': {
    primary: 'rgba(231, 192, 122, 0.95)',
    secondary: 'rgba(184, 137, 46, 0.55)',
    glow: 'rgba(214, 168, 91, 0.45)',
    inactive: 'rgba(214, 168, 91, 0.2)',
    legacyStroke: '#D6A85B',
    legacyShadow: '0 0 8px rgba(214,168,91,0.45)',
  },
  neutral: {
    primary: 'rgba(242, 240, 235, 0.85)',
    secondary: 'rgba(242, 240, 235, 0.4)',
    glow: 'rgba(242, 240, 235, 0.28)',
    inactive: 'rgba(242, 240, 235, 0.16)',
    legacyStroke: '#f2f0eb',
    legacyShadow: '0 0 6px rgba(242,240,235,0.3)',
  },
}

export const DANGER_PALETTE: SparkPalette = {
  primary: 'rgba(255, 158, 165, 0.95)',
  secondary: 'rgba(224, 122, 131, 0.55)',
  glow: 'rgba(224, 122, 131, 0.5)',
  inactive: 'rgba(224, 122, 131, 0.18)',
  legacyStroke: '#E07a83',
  legacyShadow: '0 0 8px rgba(224,122,131,0.5)',
}

export function getSparkPalette(tone: SparkTone, danger = false): SparkPalette {
  if (danger) return DANGER_PALETTE
  return palettes[tone]
}
