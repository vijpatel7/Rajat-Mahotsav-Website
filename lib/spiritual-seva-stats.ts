export const SPIRITUAL_SEVA_STAT_KEYS = [
  "jaap",
  "malas",
  "dhyan",
  "pradakshinas",
  "dandvats",
  "padyatras",
  "sadachar",
  "harignanamrut",
  "bapashree",
  "upvas",
] as const

export type SpiritualSevaStatKey = (typeof SPIRITUAL_SEVA_STAT_KEYS)[number]

export type SpiritualSevaStats = Record<SpiritualSevaStatKey, number> & {
  total_submissions: number
}

type RawSpiritualSevaStats = Partial<Record<SpiritualSevaStatKey | "total_submissions", unknown>>

function toNonNegativeNumber(value: unknown): number {
  const numberValue = typeof value === "number" ? value : Number(value ?? 0)

  if (!Number.isFinite(numberValue) || numberValue < 0) {
    return 0
  }

  return numberValue
}

export function normalizeSpiritualSevaStats(stats: RawSpiritualSevaStats | null | undefined): SpiritualSevaStats {
  const normalized = {
    total_submissions: toNonNegativeNumber(stats?.total_submissions),
  } as SpiritualSevaStats

  for (const key of SPIRITUAL_SEVA_STAT_KEYS) {
    normalized[key] = toNonNegativeNumber(stats?.[key])
  }

  return normalized
}

export function buildSpiritualSevaStats(rows: RawSpiritualSevaStats[] | null | undefined): SpiritualSevaStats {
  const totals = normalizeSpiritualSevaStats({ total_submissions: rows?.length ?? 0 })

  for (const row of rows ?? []) {
    for (const key of SPIRITUAL_SEVA_STAT_KEYS) {
      totals[key] += toNonNegativeNumber(row[key])
    }
  }

  return totals
}
