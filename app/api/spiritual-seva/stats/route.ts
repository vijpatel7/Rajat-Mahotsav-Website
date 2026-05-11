import { NextResponse } from "next/server"

import {
  SPIRITUAL_SEVA_STAT_KEYS,
  buildSpiritualSevaStats,
  normalizeSpiritualSevaStats,
  type SpiritualSevaStats,
} from "@/lib/spiritual-seva-stats"
import { createClient } from "@/utils/supabase/server"

const FALLBACK_PAGE_SIZE = 1000

function isMissingRpcError(error: { code?: string; message?: string }) {
  return (
    error.code === "PGRST202" ||
    /schema cache|function .*get_spiritual_seva_stats|could not find the function/i.test(
      error.message ?? ""
    )
  )
}

async function fetchStatsFromRows(supabase: Awaited<ReturnType<typeof createClient>>) {
  const rows = []
  let from = 0
  let hasMore = true

  while (hasMore) {
    const to = from + FALLBACK_PAGE_SIZE - 1
    const { data, error } = await supabase
      .from("spiritual_seva_submission")
      .select(SPIRITUAL_SEVA_STAT_KEYS.join(","))
      .range(from, to)

    if (error) {
      throw error
    }

    const pageRows = data ?? []
    rows.push(...pageRows)
    hasMore = pageRows.length === FALLBACK_PAGE_SIZE
    from += FALLBACK_PAGE_SIZE
  }

  return buildSpiritualSevaStats(rows)
}

export async function GET() {
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

  const { data, error } = await supabase.rpc("get_spiritual_seva_stats")

  if (error) {
    if (!isMissingRpcError(error)) {
      return NextResponse.json(
        { error: "Stats query failed", details: error.message },
        { status: 500, headers }
      )
    }

    try {
      const stats = await fetchStatsFromRows(supabase)
      return NextResponse.json(
        {
          success: true,
          stats,
          source: "paginated-fallback",
        },
        { status: 200, headers }
      )
    } catch (fallbackError) {
      return NextResponse.json(
        {
          error: "Stats query failed",
          details:
            fallbackError instanceof Error ? fallbackError.message : String(fallbackError),
        },
        { status: 500, headers }
      )
    }
  }

  const rawStats = Array.isArray(data) ? data[0] : data
  const stats: SpiritualSevaStats = normalizeSpiritualSevaStats(rawStats)

  return NextResponse.json(
    {
      success: true,
      stats,
    },
    { status: 200, headers }
  )
}
