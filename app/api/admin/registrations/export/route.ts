import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { isAdminDomainUser } from "@/lib/admin-auth"

/** Chunk size when streaming filtered results via RPC */
const CHUNK_SIZE = 500

/** Explicit columns for CSV – must match get_registrations_filtered output */
const REGISTRATION_COLUMNS = [
  "id",
  "first_name",
  "middle_name",
  "last_name",
  "email",
  "mobile_number",
  "phone_country_code",
  "country",
  "ghaam",
  "mandal",
  "arrival_date",
  "departure_date",
  "age",
] as const

type RegistrationRow = Record<(typeof REGISTRATION_COLUMNS)[number], unknown>

function parseOptionalInt(val: string | null): number | null {
  if (!val || val.trim() === "") return null
  const n = parseInt(val, 10)
  return Number.isNaN(n) ? null : n
}

function parseOptionalDate(val: string | null): string | null {
  if (!val || val.trim() === "") return null
  const d = new Date(val)
  return Number.isNaN(d.getTime()) ? null : val.trim()
}

function escapeCsvField(value: unknown): string {
  const s = value == null ? "" : String(value)
  if (s.includes(",") || s.includes("\n") || s.includes('"')) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

function rowToCsvLine(row: RegistrationRow): string {
  return REGISTRATION_COLUMNS.map((col) => escapeCsvField(row[col])).join(",")
}

/**
 * CSV export for registrations with optional filters.
 * Same query params as GET /api/admin/registrations (filter params only).
 * Streams all matching rows. No query params = export entire list (same as /api/registrations/export).
 */
export async function GET(request: Request) {
  const headers = new Headers()
  headers.set("Cache-Control", "no-store, max-age=0")

  let supabase
  try {
    supabase = await createClient()
  } catch (err) {
    return NextResponse.json(
      { error: "Supabase not configured", details: String(err) },
      { status: 500, headers }
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized", message: "Sign in required" },
      { status: 401, headers }
    )
  }

  if (!isAdminDomainUser(user)) {
    return NextResponse.json(
      { error: "Forbidden", message: "Admin domain (@nj.sgadi.us) required" },
      { status: 403, headers }
    )
  }

  const { searchParams } = new URL(request.url)
  const ghaam = searchParams.get("ghaam")?.trim() || null
  const mandal = searchParams.get("mandal")?.trim() || null
  const country = searchParams.get("country")?.trim() || null
  const age = parseOptionalInt(searchParams.get("age"))
  const ageMin = parseOptionalInt(searchParams.get("age_min"))
  const ageMax = parseOptionalInt(searchParams.get("age_max"))
  const arrivalFrom = parseOptionalDate(searchParams.get("arrival_from"))
  const arrivalTo = parseOptionalDate(searchParams.get("arrival_to"))
  const departureFrom = parseOptionalDate(searchParams.get("departure_from"))
  const departureTo = parseOptionalDate(searchParams.get("departure_to"))
  const searchRaw = searchParams.get("search")?.trim() || null
  const search = searchRaw && searchRaw.length >= 2 ? searchRaw : null

  if (ageMin != null && ageMax != null && ageMin > ageMax) {
    return NextResponse.json(
      { error: "age_min must be <= age_max" },
      { status: 400, headers }
    )
  }

  const hasFilters = !!(
    ghaam ||
    mandal ||
    country ||
    age != null ||
    ageMin != null ||
    ageMax != null ||
    arrivalFrom ||
    arrivalTo ||
    departureFrom ||
    departureTo ||
    search
  )

  const baseName = hasFilters ? "registrations-filtered" : "registrations"
  const filename = `${baseName}-${new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)}.csv`
  headers.set("Content-Type", "text/csv; charset=utf-8")
  headers.set("Content-Disposition", `attachment; filename="${filename}"`)

  const encoder = new TextEncoder()
  const headerLine = REGISTRATION_COLUMNS.join(",") + "\n"

  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode("\uFEFF"))
      controller.enqueue(encoder.encode(headerLine))

      let cursor: number | null = null
      let hasMore = true

      while (hasMore) {
        const { data, error } = await supabase.rpc("get_registrations_filtered", {
          p_page_size: CHUNK_SIZE,
          p_cursor: cursor,
          p_direction: "next",
          p_ghaam: ghaam,
          p_mandal: mandal,
          p_country: country,
          p_age: age,
          p_age_min: ageMin,
          p_age_max: ageMax,
          p_arrival_from: arrivalFrom,
          p_arrival_to: arrivalTo,
          p_departure_from: departureFrom,
          p_departure_to: departureTo,
          p_search: search,
        })

        if (error) {
          controller.error(new Error(error.message))
          return
        }

        const result = data as {
          rows?: unknown[]
          nextCursor?: number | null
          hasMore?: boolean
        }
        const rows = (result.rows ?? []) as RegistrationRow[]
        const nextCursorVal = result.nextCursor ?? null
        hasMore = result.hasMore === true && nextCursorVal != null

        if (rows.length > 0) {
          const csvChunk = rows.map(rowToCsvLine).join("\n") + "\n"
          controller.enqueue(encoder.encode(csvChunk))
        }

        cursor = nextCursorVal
        if (rows.length < CHUNK_SIZE) hasMore = false
      }

      controller.close()
    },
  })

  return new Response(stream, { headers })
}
