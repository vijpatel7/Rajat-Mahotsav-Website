/**
 * Shared types and helpers for content_submissions admin views.
 */

export const CONTENT_SUBMISSIONS_TABLE = "content_submissions"

export const CONTENT_SUBMISSION_STATUSES = [
  "new",
  "approved",
  "posted",
  "rejected",
  "archived",
] as const
export type ContentSubmissionStatus = (typeof CONTENT_SUBMISSION_STATUSES)[number]

export type ContentImageKey = {
  key: string
  filename: string
  content_type: string
  size_bytes: number
}

export type ContentVideoKey = {
  key: string
  filename: string
  content_type: string
  size_bytes: number
  duration_seconds: number
}

export type ContentSubmissionRow = {
  id: string
  created_at: string
  updated_at: string
  family_name: string
  village: string
  mandal: string
  caption: string
  image_keys: ContentImageKey[]
  video_keys: ContentVideoKey[]
  uploader_name: string | null
  uploader_email: string | null
  uploader_phone_country_code: string | null
  uploader_mobile_number: string | null
  status: ContentSubmissionStatus
  posted_at: string | null
  notes: string | null
}

export const CONTENT_SUBMISSION_COLUMNS: (keyof ContentSubmissionRow)[] = [
  "id",
  "created_at",
  "updated_at",
  "family_name",
  "village",
  "mandal",
  "caption",
  "image_keys",
  "video_keys",
  "uploader_name",
  "uploader_email",
  "uploader_phone_country_code",
  "uploader_mobile_number",
  "status",
  "posted_at",
  "notes",
]

export const CDN_BASE_URL = "https://cdn.njrajatmahotsav.com"

export function publicUrlForKey(key: string): string {
  return `${CDN_BASE_URL}/${key
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`
}

export type ContentSubmissionFilters = {
  search: string
  status: string
  mandal: string
  submittedFrom: string
  submittedTo: string
}

export function parseContentSubmissionFilters(
  params: URLSearchParams
): ContentSubmissionFilters {
  return {
    search: (params.get("search") ?? "").trim(),
    status: (params.get("status") ?? "").trim(),
    mandal: (params.get("mandal") ?? "").trim(),
    submittedFrom: (params.get("submittedFrom") ?? "").trim(),
    submittedTo: (params.get("submittedTo") ?? "").trim(),
  }
}

export function parseContentSubmissionPageSize(value: string | null): number {
  const fallback = 25
  if (!value) return fallback
  const parsed = Number.parseInt(value, 10)
  if (Number.isNaN(parsed)) return fallback
  return Math.min(Math.max(parsed, 5), 100)
}

type SupabaseQuery = {
  ilike: (column: string, pattern: string) => SupabaseQuery
  or: (filter: string) => SupabaseQuery
  eq: (column: string, value: unknown) => SupabaseQuery
  gte: (column: string, value: unknown) => SupabaseQuery
  lte: (column: string, value: unknown) => SupabaseQuery
}

export function applyContentSubmissionFilters<T extends SupabaseQuery>(
  query: T,
  filters: ContentSubmissionFilters
): T {
  let q = query as SupabaseQuery
  if (filters.search) {
    // Escape % and , to avoid breaking the OR list syntax.
    const term = filters.search.replace(/[%,]/g, " ")
    const pattern = `%${term}%`
    q = q.or(
      [
        `family_name.ilike.${pattern}`,
        `village.ilike.${pattern}`,
        `caption.ilike.${pattern}`,
        `uploader_name.ilike.${pattern}`,
        `uploader_email.ilike.${pattern}`,
        `uploader_mobile_number.ilike.${pattern}`,
      ].join(",")
    )
  }
  if (filters.status) q = q.eq("status", filters.status)
  if (filters.mandal) q = q.eq("mandal", filters.mandal)
  if (filters.submittedFrom) q = q.gte("created_at", filters.submittedFrom)
  if (filters.submittedTo) {
    // Inclusive end-of-day: caller passes YYYY-MM-DD → we add 1 day and use lt.
    q = q.lte("created_at", `${filters.submittedTo}T23:59:59.999Z`)
  }
  return q as T
}
