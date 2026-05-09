export type SortDirection = 'asc' | 'desc' | null

export type SortState<K extends string> = {
  key: K
  direction: SortDirection
}

export function parseMetricValue(raw: unknown): number | string | null {
  if (raw == null) return null
  if (typeof raw === 'number') return raw
  if (typeof raw !== 'string') return String(raw).toLowerCase()

  const value = raw.trim()
  if (!value || value === '-' || value === '—') return null
  const lower = value.toLowerCase()

  const timeParts = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(lower)
  if (timeParts) {
    const h = Number.parseInt(timeParts[1] ?? '0', 10)
    const m = Number.parseInt(timeParts[2] ?? '0', 10)
    const s = Number.parseInt(timeParts[3] ?? '0', 10)
    return h * 3600 + m * 60 + s
  }

  const ago = /^([\d.]+)\s*m(?:in)?\s*ago$/.exec(lower)
  if (ago) return Number.parseFloat(ago[1] ?? '0')

  if (lower.endsWith('ms')) return Number.parseFloat(lower.replace('ms', '').trim())
  if (lower.endsWith('s')) return Number.parseFloat(lower.replace('s', '').trim()) * 1000
  if (lower.endsWith('%')) return Number.parseFloat(lower.replace('%', '').trim())

  const clean = lower
    .replace(/\$/g, '')
    .replace(/rpm/g, '')
    .replace(/,/g, '')
    .trim()

  if (/^-?[\d.]+k$/.test(clean)) return Number.parseFloat(clean.replace('k', '')) * 1_000
  if (/^-?[\d.]+m$/.test(clean)) return Number.parseFloat(clean.replace('m', '')) * 1_000_000

  const numeric = Number.parseFloat(clean)
  if (!Number.isNaN(numeric)) return numeric

  return lower
}

export function compareParsed(a: number | string | null, b: number | string | null): number {
  if (a == null && b == null) return 0
  if (a == null) return 1
  if (b == null) return -1

  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b))
}

export function sortRows<T, K extends string>(
  rows: T[],
  sort: SortState<K>,
  getValue: (row: T, key: K) => unknown,
): T[] {
  if (!sort.direction) return rows

  return [...rows].sort((left, right) => {
    const a = parseMetricValue(getValue(left, sort.key))
    const b = parseMetricValue(getValue(right, sort.key))
    const result = compareParsed(a, b)
    return sort.direction === 'asc' ? result : -result
  })
}

export function nextSortState<K extends string>(current: SortState<K>, key: K): SortState<K> {
  if (current.key !== key) return { key, direction: 'asc' }
  if (current.direction === 'asc') return { key, direction: 'desc' }
  if (current.direction === 'desc') return { key, direction: null }
  return { key, direction: 'asc' }
}
