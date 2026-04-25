import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { isAdminDomainUser } from "@/lib/admin-auth"
import { PERSONAL_SEVA_COLUMNS } from "@/lib/personal-seva-admin"

const RESPONSE_HEADERS = new Headers()
RESPONSE_HEADERS.set("Cache-Control", "no-store, max-age=0")

function uniqueSorted(values: unknown[]): string[] {
  return Array.from(
    new Set(
      values
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim())
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b))
}

export async function GET() {
  let supabase
  try {
    supabase = await createClient()
  } catch (err) {
    return NextResponse.json(
      { error: "Supabase not configured", details: String(err) },
      { status: 500, headers: RESPONSE_HEADERS }
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized", message: "Sign in required" },
      { status: 401, headers: RESPONSE_HEADERS }
    )
  }

  if (!isAdminDomainUser(user)) {
    return NextResponse.json(
      { error: "Forbidden", message: "Admin domain (@nj.sgadi.us) required" },
      { status: 403, headers: RESPONSE_HEADERS }
    )
  }

  const { data, error } = await supabase
    .from("personal_seva_submission")
    .select(PERSONAL_SEVA_COLUMNS.join(","))
    .order("id", { ascending: false })
    .limit(5000)

  if (error) {
    return NextResponse.json(
      { error: "Query failed", details: error.message },
      { status: 500, headers: RESPONSE_HEADERS }
    )
  }

  const rows = data ?? []

  return NextResponse.json(
    {
      success: true,
      country: uniqueSorted(rows.map((row) => row.country)),
      mandal: uniqueSorted(rows.map((row) => row.mandal)),
      activity: uniqueSorted(rows.map((row) => row.activity_name)),
    },
    { status: 200, headers: RESPONSE_HEADERS }
  )
}
