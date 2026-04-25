import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { isAdminDomainUser } from "@/lib/admin-auth"
import {
  PERSONAL_SEVA_COLUMNS,
  applyPersonalSevaFilters,
  parsePersonalSevaFilters,
  parsePersonalSevaPageSize,
} from "@/lib/personal-seva-admin"

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
  const pageSize = parsePersonalSevaPageSize(searchParams.get("page_size"))
  const cursorRaw = searchParams.get("cursor")
  const cursor = cursorRaw ? Number.parseInt(cursorRaw, 10) : null
  const direction = searchParams.get("direction") === "prev" ? "prev" : "next"
  const filters = parsePersonalSevaFilters(searchParams)

  const fetchLimit = pageSize + 1
  let query = supabase
    .from("personal_seva_submission")
    .select(PERSONAL_SEVA_COLUMNS.join(","))

  query = applyPersonalSevaFilters(query, filters)

  if (cursor != null && !Number.isNaN(cursor)) {
    query = direction === "prev" ? query.gt("id", cursor) : query.lt("id", cursor)
  }

  query =
    direction === "prev"
      ? query.order("id", { ascending: true }).limit(fetchLimit)
      : query.order("id", { ascending: false }).limit(fetchLimit)

  const { data, error } = await query

  if (error) {
    return NextResponse.json(
      { error: "Query failed", details: error.message },
      { status: 500, headers }
    )
  }

  const fetchedRows = data ?? []
  const hasExtraRow = fetchedRows.length > pageSize
  const pageRows =
    direction === "prev"
      ? fetchedRows.slice(0, pageSize).reverse()
      : fetchedRows.slice(0, pageSize)

  const firstRow = pageRows[0]
  const lastRow = pageRows[pageRows.length - 1]

  return NextResponse.json(
    {
      success: true,
      rows: pageRows,
      pageSize,
      nextCursor: lastRow?.id ?? null,
      prevCursor: firstRow?.id ?? null,
      hasMore: direction === "prev" ? cursor != null : hasExtraRow,
      hasPrev: direction === "prev" ? hasExtraRow : cursor != null,
    },
    { status: 200, headers }
  )
}
