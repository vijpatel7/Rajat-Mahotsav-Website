"use client"

import type { ReactNode } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

export type AdminDataTableColumn<Row> = {
  key: string
  header: ReactNode
  className?: string
  cellClassName?: string | ((row: Row, index: number) => string)
  render: (row: Row, index: number) => ReactNode
}

type AdminDataTableProps<Row> = {
  rows: Row[]
  columns: AdminDataTableColumn<Row>[]
  getRowKey: (row: Row, index: number) => string | number
  startIndex: number
  loading?: boolean
  minWidthClassName?: string
  emptyTitle: string
  emptyDescription?: string
  emptyAction?: ReactNode
  totalRowsLabel?: ReactNode
  hasPrev: boolean
  hasMore: boolean
  onPrev: () => void
  onNext: () => void
}

export function AdminDataTable<Row>({
  rows,
  columns,
  getRowKey,
  startIndex,
  loading = false,
  minWidthClassName = "min-w-[700px]",
  emptyTitle,
  emptyDescription,
  emptyAction,
  totalRowsLabel,
  hasPrev,
  hasMore,
  onPrev,
  onNext,
}: AdminDataTableProps<Row>) {
  return (
    <div className="relative min-h-[400px] p-5">
      <AnimatePresence>
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-10 flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="size-8 animate-spin text-orange-500" aria-hidden />
              <span className="text-sm reg-text-secondary">Loading…</span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {rows.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <table className={`w-full ${minWidthClassName} text-sm`}>
              <thead>
                <tr className="border-b-2 border-[rgb(254,215,170)]">
                  <th className="text-center py-3 px-2 font-semibold reg-text-secondary w-12">
                    #
                  </th>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={
                        column.className ??
                        "text-left py-3 px-3 font-semibold reg-text-primary"
                      }
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={getRowKey(row, index)}
                    className={`border-b border-[rgb(254,215,170)]/40 transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-orange-100/70"
                    } hover:bg-orange-200/60`}
                  >
                    <td className="py-2.5 px-2 text-center text-xs font-medium reg-text-secondary tabular-nums">
                      {startIndex + index}
                    </td>
                    {columns.map((column) => {
                      const cellClassName =
                        typeof column.cellClassName === "function"
                          ? column.cellClassName(row, index)
                          : column.cellClassName

                      return (
                        <td
                          key={column.key}
                          className={
                            cellClassName ??
                            "py-2.5 px-3 reg-text-primary"
                          }
                        >
                          {column.render(row, index)}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5 pt-4 border-t-2 border-[rgb(254,215,170)]">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <p className="text-sm reg-text-secondary">
                Showing rows {startIndex}–{startIndex + rows.length - 1}
              </p>
              {totalRowsLabel ? (
                <p className="text-sm reg-text-secondary">{totalRowsLabel}</p>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onPrev}
                disabled={!hasPrev || loading}
                className={`
                  inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium
                  transition-all duration-200
                  ${hasPrev && !loading
                    ? "bg-white border-2 border-[rgb(254,215,170)] text-gray-700 hover:bg-orange-50 hover:border-orange-400 active:scale-95"
                    : "bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed"
                  }
                `}
                aria-label="Previous page"
              >
                <ChevronLeft className="size-4" aria-hidden />
                <span>Prev</span>
              </button>
              <button
                type="button"
                onClick={onNext}
                disabled={!hasMore || loading}
                className={`
                  inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium
                  transition-all duration-200
                  ${hasMore && !loading
                    ? "bg-white border-2 border-[rgb(254,215,170)] text-gray-700 hover:bg-orange-50 hover:border-orange-400 active:scale-95"
                    : "bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed"
                  }
                `}
                aria-label="Next page"
              >
                <span>Next</span>
                <ChevronRight className="size-4" aria-hidden />
              </button>
            </div>
          </div>
        </>
      ) : !loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="reg-text-primary font-medium mb-2">{emptyTitle}</p>
          {emptyDescription ? (
            <p className="text-sm reg-text-secondary mb-4">{emptyDescription}</p>
          ) : null}
          {emptyAction}
        </div>
      ) : null}
    </div>
  )
}
