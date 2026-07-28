"use client"

import { useState } from "react"
import { ArrowDownAZ, ChevronLeft, ChevronRight, Clock, Table2 } from "lucide-react"
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

function formatHours(hours: number) {
  return Number.isInteger(hours) ? hours.toFixed(0) : hours.toFixed(1)
}

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

function PaginationBar({
  startIndex,
  rowCount,
  totalCount,
  hasPrev,
  hasMore,
  onPrev,
  onNext,
}: {
  startIndex: number
  rowCount: number
  totalCount: number
  hasPrev: boolean
  hasMore: boolean
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5 pt-4 border-t-2 border-[rgb(254,215,170)]">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <p className="text-sm reg-text-secondary">
          Showing {startIndex}–{startIndex + rowCount - 1}
        </p>
        <p className="text-sm reg-text-secondary">{totalCount} volunteers</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={!hasPrev}
          className={cn(
            "inline-flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200",
            hasPrev
              ? "bg-white border-2 border-[rgb(254,215,170)] text-gray-700 hover:bg-orange-50 hover:border-orange-400 active:scale-95"
              : "bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed"
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" aria-hidden />
          <span>Prev</span>
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!hasMore}
          className={cn(
            "inline-flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200",
            hasMore
              ? "bg-white border-2 border-[rgb(254,215,170)] text-gray-700 hover:bg-orange-50 hover:border-orange-400 active:scale-95"
              : "bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed"
          )}
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRight className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  )
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
  const hasPrev = safePage > 0
  const hasMore = safePage < pageCount - 1
  const onPrev = () => setPage((p) => Math.max(0, p - 1))
  const onNext = () => setPage((p) => Math.min(pageCount - 1, p + 1))

  const columns: AdminDataTableColumn<SevaLeaderboardEntry>[] = [
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
      render: (row) => formatHours(row.hours),
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
      <div className="flex flex-col gap-3 p-4 sm:p-5 border-b border-[rgb(254,215,170)]/60">
        <div className="text-base sm:text-lg font-semibold reg-text-primary flex items-center gap-2">
          <Table2 className="size-5 text-[rgb(13,19,45)] shrink-0" aria-hidden />
          Individual Seva Hours
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
          <div
            className="inline-flex w-full sm:w-auto rounded-full border-2 border-[rgb(254,215,170)] bg-white p-0.5"
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
                "inline-flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
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
                "inline-flex flex-1 sm:flex-none items-center justify-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
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
            className={cn(SELECT_STYLE, "w-full sm:w-auto")}
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

      {/* Mobile: stacked list */}
      <div className="md:hidden p-3 sm:p-4">
        {pageRows.length > 0 ? (
          <>
            <ul className="divide-y divide-[rgb(254,215,170)]/50 rounded-xl overflow-hidden border border-[rgb(254,215,170)]/60">
              {pageRows.map((row, index) => {
                const position = startIndex + index + 1
                return (
                  <li
                    key={`${row.rank}-${row.name}`}
                    className={cn(
                      "flex items-start gap-3 px-3 py-3",
                      index % 2 === 0 ? "bg-white" : "bg-orange-50/80"
                    )}
                  >
                    <span className="mt-0.5 w-8 shrink-0 text-center text-xs font-semibold tabular-nums reg-text-secondary">
                      {position}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium leading-snug reg-text-primary break-words">
                        {row.name}
                      </p>
                      <p className="mt-1 text-sm reg-text-secondary">
                        {row.events} {row.events === 1 ? "event" : "events"}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-base font-semibold tabular-nums text-orange-600">
                        {formatHours(row.hours)}
                      </p>
                      <p className="text-xs reg-text-secondary">hrs</p>
                    </div>
                  </li>
                )
              })}
            </ul>
            <PaginationBar
              startIndex={startIndex + 1}
              rowCount={pageRows.length}
              totalCount={sorted.length}
              hasPrev={hasPrev}
              hasMore={hasMore}
              onPrev={onPrev}
              onNext={onNext}
            />
          </>
        ) : (
          <p className="py-10 text-center reg-text-primary font-medium">
            No seva hours recorded yet
          </p>
        )}
      </div>

      {/* Desktop: existing table */}
      <div className="hidden md:block">
        <AdminDataTable
          rows={pageRows}
          columns={columns}
          getRowKey={(row) => `${row.rank}-${row.name}`}
          startIndex={startIndex + 1}
          minWidthClassName="min-w-0"
          emptyTitle="No seva hours recorded yet"
          totalRowsLabel={`${sorted.length} volunteers`}
          hasPrev={hasPrev}
          hasMore={hasMore}
          onPrev={onPrev}
          onNext={onNext}
        />
      </div>
    </div>
  )
}
