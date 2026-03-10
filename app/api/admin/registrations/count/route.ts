import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { isAdminDomainUser } from "@/lib/admin-auth"

const COUNT_CHUNK_SIZE = 500
const MAX_COUNT = 100_000

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

/**
 * Returns total number of rows matching the same filters as GET /api/admin/registrations.
 * Same query params (filter params only; no pagination).
 * Only fired when filters change or on initial load, not when paginating.
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

  let total = 0
  let cursor: number | null = null
  let hasMore = true

  while (hasMore) {
    const { data, error } = await supabase.rpc("get_registrations_filtered", {
      p_page_size: COUNT_CHUNK_SIZE,
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
      return NextResponse.json(
        { error: "Query failed", details: error.message },
        { status: 500, headers }
      )
    }

    const result = data as { rows?: unknown[]; nextCursor?: number | null; hasMore?: boolean }
    const rows = result.rows ?? []
    const len = rows.length
    total += len
    if (total >= MAX_COUNT) break
    cursor = result.nextCursor ?? null
    hasMore = result.hasMore === true && cursor != null && len === COUNT_CHUNK_SIZE
  }

  return NextResponse.json(
    { count: Math.min(total, MAX_COUNT) },
    { status: 200, headers }
  )
}
