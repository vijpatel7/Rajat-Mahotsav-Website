import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { isAdminDomainUser } from "@/lib/admin-auth"
import {
  SPIRITUAL_SEVA_COLUMNS,
  SPIRITUAL_SEVA_TABLE,
  applySpiritualSevaFilters,
  hasSpiritualSevaFilters,
  parseSpiritualSevaFilters,
  spiritualSevaRowToCsvLine,
  type SpiritualSevaRow,
} from "@/lib/spiritual-seva-admin"

const CHUNK_SIZE = 500

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
  const filters = parseSpiritualSevaFilters(searchParams)
  const hasFilters = hasSpiritualSevaFilters(filters)

  const baseName = hasFilters
    ? "spiritual-seva-submissions-filtered"
    : "spiritual-seva-submissions"
  const filename = `${baseName}-${new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .slice(0, 19)}.csv`

  headers.set("Content-Type", "text/csv; charset=utf-8")
  headers.set("Content-Disposition", `attachment; filename="${filename}"`)

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(encoder.encode("\uFEFF"))
      controller.enqueue(encoder.encode(SPIRITUAL_SEVA_COLUMNS.join(",") + "\n"))

      let from = 0
      let hasMore = true

      while (hasMore) {
        const to = from + CHUNK_SIZE - 1
        let query = supabase
          .from(SPIRITUAL_SEVA_TABLE)
          .select(SPIRITUAL_SEVA_COLUMNS.join(","))

        query = applySpiritualSevaFilters(query, filters)

        const { data, error } = await query
          .order("id", { ascending: false })
          .range(from, to)

        if (error) {
          controller.error(new Error(error.message))
          return
        }

        const rows = (data ?? []) as unknown as SpiritualSevaRow[]
        if (rows.length > 0) {
          controller.enqueue(
            encoder.encode(rows.map(spiritualSevaRowToCsvLine).join("\n") + "\n")
          )
        }

        hasMore = rows.length === CHUNK_SIZE
        from += CHUNK_SIZE
      }

      controller.close()
    },
  })

  return new Response(stream, { headers })
}
