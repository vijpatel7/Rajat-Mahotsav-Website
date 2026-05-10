import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { isAdminDomainUser } from "@/lib/admin-auth"
import {
  CONTENT_SUBMISSIONS_TABLE,
  applyContentSubmissionFilters,
  parseContentSubmissionFilters,
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
      { error: "Unauthorized" },
      { status: 401, headers }
    )
  }

  if (!isAdminDomainUser(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403, headers })
  }

  const { searchParams } = new URL(request.url)
  const filters = parseContentSubmissionFilters(searchParams)

  let query = supabase
    .from(CONTENT_SUBMISSIONS_TABLE)
    .select("id", { count: "exact", head: true })

  query = applyContentSubmissionFilters(query, filters)

  const { count, error } = await query

  if (error) {
    return NextResponse.json(
      { error: "Query failed", details: error.message },
      { status: 500, headers }
    )
  }

  return NextResponse.json({ success: true, count: count ?? 0 }, { headers })
}
