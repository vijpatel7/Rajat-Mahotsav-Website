"use client"

import { useState } from "react"
import { ArrowDownAZ, Clock, Table2 } from "lucide-react"
import {
  AdminDataTable,
  type AdminDataTableColumn,
} from "@/app/admin/components/AdminDataTable"
import {
  SEVA_LEADERBOARD,
  type SevaLeaderboardEntry,
} from "@/lib/seva-leaderboard-data"
import { cn } from "@/lib/utils"

const PAGE_SIZE_OPTIONS = [25, 50, 100] as const

type SortMode = "hours" | "name"

const SELECT_STYLE =
  "rounded-full border-2 border-[rgb(254,215,170)] bg-white px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300"

function sortEntries(
  entries: SevaLeaderboardEntry[],
  mode: SortMode
): SevaLeaderboardEntry[] {
  const sorted = [...entries]
  switch (mode) {
    case "hours":
      sorted.sort((a, b) => b.hours - a.hours || a.name.localeCompare(b.name))
      return sorted
    case "name":
      sorted.sort((a, b) => a.name.localeCompare(b.name) || b.hours - a.hours)
      return sorted
    default: {
      const _exhaustive: never = mode
      return _exhaustive
    }
  }
}

export default function SevaLeaderboardTable() {
  const [sortMode, setSortMode] = useState<SortMode>("hours")
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(25)
  const [page, setPage] = useState(0)

  const sorted = sortEntries(SEVA_LEADERBOARD, sortMode)
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize))
  const safePage = Math.min(page, pageCount - 1)
  const startIndex = safePage * pageSize
  const pageRows = sorted.slice(startIndex, startIndex + pageSize)

  const columns: AdminDataTableColumn<SevaLeaderboardEntry>[] = [
    {
      key: "rank",
      header: "Rank",
      className: "text-center py-3 px-3 font-semibold reg-text-primary w-16",
      cellClassName:
        "py-2.5 px-3 text-center reg-text-secondary tabular-nums font-medium",
      render: (row) => row.rank,
    },
    {
      key: "name",
      header: "Volunteer",
      cellClassName: "py-2.5 px-3 reg-text-primary font-medium",
      render: (row) => row.name,
    },
    {
      key: "hours",
      header: "Hours",
      className: "text-right py-3 px-3 font-semibold reg-text-primary",
      cellClassName:
        "py-2.5 px-3 text-right reg-text-primary tabular-nums font-semibold",
      render: (row) =>
        Number.isInteger(row.hours) ? row.hours.toFixed(0) : row.hours.toFixed(1),
    },
    {
      key: "events",
      header: "Events",
      className: "text-center py-3 px-3 font-semibold reg-text-primary w-20",
      cellClassName:
        "py-2.5 px-3 text-center reg-text-secondary tabular-nums",
      render: (row) => row.events,
    },
  ]

  return (
    <div className="rounded-2xl bg-white/80 border-2 border-[rgb(254,215,170)] overflow-hidden shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 border-b border-[rgb(254,215,170)]/60">
        <div className="text-lg font-semibold reg-text-primary flex items-center gap-2">
          <Table2 className="size-5 text-[rgb(13,19,45)]" aria-hidden />
          Individual Seva Hours
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div
            className="inline-flex rounded-full border-2 border-[rgb(254,215,170)] bg-white p-0.5"
            role="group"
            aria-label="Sort leaderboard"
          >
            <button
              type="button"
              onClick={() => {
                setSortMode("hours")
                setPage(0)
              }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                sortMode === "hours"
                  ? "bg-orange-500 text-white"
                  : "text-gray-700 hover:bg-orange-50"
              )}
              aria-pressed={sortMode === "hours"}
            >
              <Clock className="size-3.5" aria-hidden />
              Hours
            </button>
            <button
              type="button"
              onClick={() => {
                setSortMode("name")
                setPage(0)
              }}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                sortMode === "name"
                  ? "bg-orange-500 text-white"
                  : "text-gray-700 hover:bg-orange-50"
              )}
              aria-pressed={sortMode === "name"}
            >
              <ArrowDownAZ className="size-3.5" aria-hidden />
              A–Z
            </button>
          </div>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value) as (typeof PAGE_SIZE_OPTIONS)[number])
              setPage(0)
            }}
            className={SELECT_STYLE}
            aria-label="Rows per page"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n} per page
              </option>
            ))}
          </select>
        </div>
      </div>

      <AdminDataTable
        rows={pageRows}
        columns={columns}
        getRowKey={(row) => `${row.rank}-${row.name}`}
        startIndex={startIndex + 1}
        minWidthClassName="min-w-[520px]"
        emptyTitle="No seva hours recorded yet"
        totalRowsLabel={`${sorted.length} volunteers`}
        hasPrev={safePage > 0}
        hasMore={safePage < pageCount - 1}
        onPrev={() => setPage((p) => Math.max(0, p - 1))}
        onNext={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
      />
    </div>
  )
}
