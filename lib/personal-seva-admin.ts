export const PERSONAL_SEVA_COLUMNS = [
  "id",
  "created_at",
  "first_name",
  "last_name",
  "mobile_number",
  "country",
  "mandal",
  "activity_name",
  "volunteer_hours",
  "images_uploaded",
  "images_path",
] as const

export type PersonalSevaColumn = (typeof PERSONAL_SEVA_COLUMNS)[number]
export type PersonalSevaRow = Record<PersonalSevaColumn, unknown>

export type PersonalSevaFilters = {
  search: string | null
  country: string | null
  mandal: string | null
  activity: string | null
  submittedFrom: string | null
  submittedTo: string | null
  hoursMin: number | null
  hoursMax: number | null
  imagesUploaded: boolean | null
}

const PAGE_SIZES = [25, 50, 100] as const
export type PersonalSevaPageSize = (typeof PAGE_SIZES)[number]

export function parsePersonalSevaPageSize(value: string | null): PersonalSevaPageSize {
  const parsed = value ? Number.parseInt(value, 10) : 25
  return PAGE_SIZES.includes(parsed as PersonalSevaPageSize)
    ? (parsed as PersonalSevaPageSize)
    : 25
}

function parseOptionalNumber(value: string | null): number | null {
  if (!value || value.trim() === "") return null
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : null
}

function parseOptionalDate(value: string | null): string | null {
  if (!value || value.trim() === "") return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : value.trim()
}

export function parsePersonalSevaFilters(searchParams: URLSearchParams): PersonalSevaFilters {
  const searchRaw = searchParams.get("search")?.trim() || null
  const imagesRaw = searchParams.get("images_uploaded")

  return {
    search: searchRaw && searchRaw.length >= 2 ? searchRaw : null,
    country: searchParams.get("country")?.trim() || null,
    mandal: searchParams.get("mandal")?.trim() || null,
    activity: searchParams.get("activity")?.trim() || null,
    submittedFrom: parseOptionalDate(searchParams.get("submitted_from")),
    submittedTo: parseOptionalDate(searchParams.get("submitted_to")),
    hoursMin: parseOptionalNumber(searchParams.get("hours_min")),
    hoursMax: parseOptionalNumber(searchParams.get("hours_max")),
    imagesUploaded:
      imagesRaw === "true" ? true : imagesRaw === "false" ? false : null,
  }
}

export function applyPersonalSevaFilters<Query>(
  query: Query,
  filters: PersonalSevaFilters
): Query {
  let nextQuery = query as any

  if (filters.search) {
    const escapedSearch = filters.search.replace(/[%_,]/g, "\\$&")
    nextQuery = nextQuery.or(
      [
        `first_name.ilike.%${escapedSearch}%`,
        `last_name.ilike.%${escapedSearch}%`,
        `mobile_number.ilike.%${escapedSearch}%`,
        `activity_name.ilike.%${escapedSearch}%`,
      ].join(",")
    )
  }

  if (filters.country) nextQuery = nextQuery.eq("country", filters.country)
  if (filters.mandal) nextQuery = nextQuery.eq("mandal", filters.mandal)
  if (filters.activity) nextQuery = nextQuery.eq("activity_name", filters.activity)
  if (filters.submittedFrom) {
    nextQuery = nextQuery.gte("created_at", `${filters.submittedFrom}T00:00:00`)
  }
  if (filters.submittedTo) {
    nextQuery = nextQuery.lte("created_at", `${filters.submittedTo}T23:59:59`)
  }
  if (filters.hoursMin != null) {
    nextQuery = nextQuery.gte("volunteer_hours", filters.hoursMin)
  }
  if (filters.hoursMax != null) {
    nextQuery = nextQuery.lte("volunteer_hours", filters.hoursMax)
  }
  if (filters.imagesUploaded != null) {
    nextQuery = nextQuery.eq("images_uploaded", filters.imagesUploaded)
  }

  return nextQuery as Query
}

export function hasPersonalSevaFilters(filters: PersonalSevaFilters): boolean {
  return !!(
    filters.search ||
    filters.country ||
    filters.mandal ||
    filters.activity ||
    filters.submittedFrom ||
    filters.submittedTo ||
    filters.hoursMin != null ||
    filters.hoursMax != null ||
    filters.imagesUploaded != null
  )
}

export function buildPersonalSevaQuery(
  supabase: any,
  filters: PersonalSevaFilters,
  columns = PERSONAL_SEVA_COLUMNS.join(","),
  count = false
) {
  const query = supabase
    .from("personal_seva_submission")
    .select(columns, count ? { count: "exact" } : undefined)

  return applyPersonalSevaFilters(query, filters)
}

export function escapeCsvField(value: unknown): string {
  const s = value == null ? "" : String(value)
  if (s.includes(",") || s.includes("\n") || s.includes('"')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

export function personalSevaRowToCsvLine(row: PersonalSevaRow): string {
  return PERSONAL_SEVA_COLUMNS.map((col) => escapeCsvField(row[col])).join(",")
}
