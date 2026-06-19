import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { isContentSubmissionsViewer } from "@/lib/admin-auth"
import {
  CONTENT_SUBMISSIONS_TABLE,
  CONTENT_SUBMISSION_COLUMNS,
  applyContentSubmissionFilters,
  parseContentSubmissionFilters,
  parseContentSubmissionPageSize,
  type ContentSubmissionRow,
} from "@/lib/content-submissions-admin"

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

  if (!isContentSubmissionsViewer(user)) {
    return NextResponse.json(
      { error: "Forbidden", message: "Access not granted for this account" },
      { status: 403, headers }
    )
  }

  const { searchParams } = new URL(request.url)
  const pageSize = parseContentSubmissionPageSize(searchParams.get("page_size"))
  const cursor = (searchParams.get("cursor") ?? "").trim()
  const direction = searchParams.get("direction") === "prev" ? "prev" : "next"
  const filters = parseContentSubmissionFilters(searchParams)

  const fetchLimit = pageSize + 1
  let query = supabase
    .from(CONTENT_SUBMISSIONS_TABLE)
    .select(CONTENT_SUBMISSION_COLUMNS.join(","))

  query = applyContentSubmissionFilters(query, filters)

  if (cursor) {
    query =
      direction === "prev"
        ? query.gt("created_at", cursor)
        : query.lt("created_at", cursor)
  }

  query =
    direction === "prev"
      ? query.order("created_at", { ascending: true }).limit(fetchLimit)
      : query.order("created_at", { ascending: false }).limit(fetchLimit)

  const { data, error } = await query

  if (error) {
    return NextResponse.json(
      { error: "Query failed", details: error.message },
      { status: 500, headers }
    )
  }

  const fetchedRows = (data ?? []) as unknown as ContentSubmissionRow[]
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
      nextCursor: lastRow?.created_at ?? null,
      prevCursor: firstRow?.created_at ?? null,
      hasMore: direction === "prev" ? cursor !== "" : hasExtraRow,
      hasPrev: direction === "prev" ? hasExtraRow : cursor !== "",
    },
    { status: 200, headers }
  )
}
