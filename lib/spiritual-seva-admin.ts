export const SPIRITUAL_SEVA_COLUMNS = [
  "id",
  "created_at",
  "first_name",
  "middle_name",
  "last_name",
  "ghaam",
  "country",
  "mandal",
  "phone_country_code",
  "mobile_number",
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

export const SPIRITUAL_SEVA_TABLE = "spiritual_seva_submission"

export type SpiritualSevaColumn = (typeof SPIRITUAL_SEVA_COLUMNS)[number]
export type SpiritualSevaRow = Record<SpiritualSevaColumn, unknown>

export type SpiritualSevaFilters = {
  search: string | null
  country: string | null
  mandal: string | null
  ghaam: string | null
  submittedFrom: string | null
  submittedTo: string | null
}

const PAGE_SIZES = [25, 50, 100] as const
export type SpiritualSevaPageSize = (typeof PAGE_SIZES)[number]

export function parseSpiritualSevaPageSize(value: string | null): SpiritualSevaPageSize {
  const parsed = value ? Number.parseInt(value, 10) : 25
  return PAGE_SIZES.includes(parsed as SpiritualSevaPageSize)
    ? (parsed as SpiritualSevaPageSize)
    : 25
}

function parseOptionalDate(value: string | null): string | null {
  if (!value || value.trim() === "") return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : value.trim()
}

export function parseSpiritualSevaFilters(searchParams: URLSearchParams): SpiritualSevaFilters {
  const searchRaw = searchParams.get("search")?.trim() || null

  return {
    search: searchRaw && searchRaw.length >= 2 ? searchRaw : null,
    country: searchParams.get("country")?.trim() || null,
    mandal: searchParams.get("mandal")?.trim() || null,
    ghaam: searchParams.get("ghaam")?.trim() || null,
    submittedFrom: parseOptionalDate(searchParams.get("submitted_from")),
    submittedTo: parseOptionalDate(searchParams.get("submitted_to")),
  }
}

export function applySpiritualSevaFilters<Query>(
  query: Query,
  filters: SpiritualSevaFilters
): Query {
  let nextQuery = query as any

  if (filters.search) {
    const escapedSearch = filters.search.replace(/[%_,]/g, "\\$&")
    nextQuery = nextQuery.or(
      [
        `first_name.ilike.%${escapedSearch}%`,
        `middle_name.ilike.%${escapedSearch}%`,
        `last_name.ilike.%${escapedSearch}%`,
        `mobile_number.ilike.%${escapedSearch}%`,
        `ghaam.ilike.%${escapedSearch}%`,
      ].join(",")
    )
  }

  if (filters.country) nextQuery = nextQuery.eq("country", filters.country)
  if (filters.mandal) nextQuery = nextQuery.eq("mandal", filters.mandal)
  if (filters.ghaam) nextQuery = nextQuery.eq("ghaam", filters.ghaam)
  if (filters.submittedFrom) {
    nextQuery = nextQuery.gte("created_at", `${filters.submittedFrom}T00:00:00`)
  }
  if (filters.submittedTo) {
    nextQuery = nextQuery.lte("created_at", `${filters.submittedTo}T23:59:59`)
  }

  return nextQuery as Query
}

export function hasSpiritualSevaFilters(filters: SpiritualSevaFilters): boolean {
  return !!(
    filters.search ||
    filters.country ||
    filters.mandal ||
    filters.ghaam ||
    filters.submittedFrom ||
    filters.submittedTo
  )
}

export function buildSpiritualSevaQuery(
  supabase: any,
  filters: SpiritualSevaFilters,
  columns = SPIRITUAL_SEVA_COLUMNS.join(","),
  count = false
) {
  const query = supabase
    .from(SPIRITUAL_SEVA_TABLE)
    .select(columns, count ? { count: "exact" } : undefined)

  return applySpiritualSevaFilters(query, filters)
}

export function escapeCsvField(value: unknown): string {
  const s = value == null ? "" : String(value)
  if (s.includes(",") || s.includes("\n") || s.includes('"')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

export function spiritualSevaRowToCsvLine(row: SpiritualSevaRow): string {
  return SPIRITUAL_SEVA_COLUMNS.map((col) => escapeCsvField(row[col])).join(",")
}
