import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { isAdminDomainUser } from "@/lib/admin-auth"
import {
  PERSONAL_SEVA_TABLE,
  applyPersonalSevaFilters,
  parsePersonalSevaFilters,
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
  const filters = parsePersonalSevaFilters(searchParams)
  let query = supabase
    .from(PERSONAL_SEVA_TABLE)
    .select("id", { count: "exact", head: true })

  query = applyPersonalSevaFilters(query, filters)

  const { count, error } = await query

  if (error) {
    return NextResponse.json(
      { error: "Query failed", details: error.message },
      { status: 500, headers }
    )
  }

  return NextResponse.json({ count: count ?? 0 }, { status: 200, headers })
}
