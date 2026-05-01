"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  ChevronDown,
  ChevronUp,
  Download,
  Filter,
  Loader2,
  Search,
  Table2,
  X,
} from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/atoms/button"
import { mandalStoredToDisplay } from "@/lib/mandal-options"
import {
  AdminDataTable,
  type AdminDataTableColumn,
} from "@/app/admin/components/AdminDataTable"

type PageInfo = {
  startIndex: number
}

type SpiritualSevaRow = {
  id: number
  created_at: string | null
  first_name: string | null
  middle_name: string | null
  last_name: string | null
  ghaam: string | null
  phone_country_code: string | null
  mobile_number: string | null
  country: string | null
  mandal: string | null
  malas: number | null
  dhyan: number | null
  pradakshinas: number | null
  dandvats: number | null
  padyatras: number | null
  sadachar: number | null
  harignanamrut: number | null
  bapashree: number | null
  upvas: number | null
}

type PaginatedResponse = {
  success?: boolean
  rows?: SpiritualSevaRow[]
  pageSize?: number
  nextCursor?: number | null
  prevCursor?: number | null
  hasMore?: boolean
  hasPrev?: boolean
  error?: string
  details?: string
}

type DistinctValuesResponse = {
  success?: boolean
  country?: string[]
  mandal?: string[]
  ghaam?: string[]
}

type FilterState = {
  search: string
  country: string
  mandal: string
  ghaam: string
  submittedFrom: string
  submittedTo: string
}

type AdminSpiritualSevaTableProps = {
  initialTotalCount?: number | null
}

const PAGE_SIZE_OPTIONS = [25, 50, 100] as const
const SEARCH_DEBOUNCE_MS = 350
const INITIAL_FILTERS: FilterState = {
  search: "",
  country: "",
  mandal: "",
  ghaam: "",
  submittedFrom: "",
  submittedTo: "",
}

const SELECT_STYLE =
  "h-10 rounded-lg border-2 border-[rgb(254,215,170)] bg-white/80 px-3 text-sm reg-text-primary focus:outline-none focus:ring-2 focus:ring-[rgb(254,215,170)] focus-visible:ring-2 min-w-[120px] sm:min-w-[140px]"
const INPUT_STYLE =
  "h-10 rounded-lg border-2 border-[rgb(254,215,170)] bg-white/80 px-3 text-sm reg-text-primary focus:outline-none focus:ring-2 focus:ring-[rgb(254,215,170)] focus-visible:ring-2"

function formatSubmittedAt(value: string | null): string {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return format(date, "MMM d, yyyy h:mm a")
}

function formatCount(value: number | null): string {
  if (value == null) return "-"
  return String(value)
}

function hasActiveFilters(filters: FilterState): boolean {
  return !!(
    filters.search ||
    filters.country ||
    filters.mandal ||
    filters.ghaam ||
    filters.submittedFrom ||
    filters.submittedTo
  )
}

export function AdminSpiritualSevaTable({
  initialTotalCount = null,
}: AdminSpiritualSevaTableProps) {
  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<SpiritualSevaRow[]>([])
  const [pageSize, setPageSize] = useState<25 | 50 | 100>(25)
  const [nextCursor, setNextCursor] = useState<number | null>(null)
  const [prevCursor, setPrevCursor] = useState<number | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS)
  const [searchInput, setSearchInput] = useState("")
  const [distinctValues, setDistinctValues] =
    useState<DistinctValuesResponse | null>(null)
  const [filtersExpanded, setFiltersExpanded] = useState(false)
  const [pageInfo, setPageInfo] = useState<PageInfo>({ startIndex: 1 })
  const [totalCount, setTotalCount] = useState<number | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasLoadedOnceRef = useRef(false)
  const abortRef = useRef<AbortController | null>(null)
  const requestIdRef = useRef(0)
  const countRequestIdRef = useRef(0)

  const buildFilterParams = useCallback(() => {
    const params = new URLSearchParams()
    if (filters.search.trim().length >= 2) {
      params.set("search", filters.search.trim())
    }
    if (filters.country) params.set("country", filters.country)
    if (filters.mandal) params.set("mandal", filters.mandal)
    if (filters.ghaam) params.set("ghaam", filters.ghaam)
    if (filters.submittedFrom) {
      params.set("submitted_from", filters.submittedFrom)
    }
    if (filters.submittedTo) params.set("submitted_to", filters.submittedTo)
    return params
  }, [filters])

  const buildParams = useCallback(
    (
      cursor: number | null,
      direction: "next" | "prev",
      pageSizeOverride?: number
    ) => {
      const params = buildFilterParams()
      params.set("page_size", String(pageSizeOverride ?? pageSize))
      params.set("direction", direction)
      if (cursor != null) params.set("cursor", String(cursor))
      return params
    },
    [buildFilterParams, pageSize]
  )

  const fetchDistinctValues = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/spiritual-seva-submissions/distinct")
      const data: DistinctValuesResponse = await response.json()
      if (response.ok) setDistinctValues(data)
    } catch {
      // Non-blocking; filters remain usable through search/date/hour inputs.
    }
  }, [])

  const fetchCount = useCallback(async () => {
    const requestId = ++countRequestIdRef.current
    try {
      const params = buildFilterParams().toString()
      const response = await fetch(
        `/api/admin/spiritual-seva-submissions/count${params ? `?${params}` : ""}`
      )
      const data = await response.json()
      if (requestId !== countRequestIdRef.current) return
      setTotalCount(response.ok && typeof data.count === "number" ? data.count : null)
    } catch {
      if (requestId !== countRequestIdRef.current) return
      setTotalCount(null)
    }
  }, [buildFilterParams])

  const applyPageData = useCallback(
    (
      data: PaginatedResponse,
      direction: "next" | "prev",
      effectivePageSize: number
    ) => {
      const fetchedRows = (data.rows ?? []).slice(0, effectivePageSize)
      setRows(fetchedRows)
      setNextCursor(data.nextCursor ?? null)
      setPrevCursor(data.prevCursor ?? null)
      setHasMore(data.hasMore ?? false)
      setLoaded(true)

      if (direction === "prev") {
        setHasMore(data.nextCursor != null)
      }
    },
    []
  )

  const fetchPage = useCallback(
    async (
      cursor: number | null,
      direction: "next" | "prev" = "next",
      pageSizeOverride?: number
    ) => {
      const requestId = ++requestIdRef.current
      const isCurrent = () => requestId === requestIdRef.current

      try {
        abortRef.current?.abort()
        const controller = new AbortController()
        abortRef.current = controller

        setLoading(true)
        setError(null)
        const response = await fetch(
          `/api/admin/spiritual-seva-submissions?${buildParams(
            cursor,
            direction,
            pageSizeOverride
          )}`,
          { signal: controller.signal }
        )
        const data: PaginatedResponse = await response.json()

        if (!isCurrent()) return
        if (!response.ok) {
          setError(data.error ?? data.details ?? `HTTP ${response.status}`)
          return
        }

        applyPageData(data, direction, pageSizeOverride ?? pageSize)
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return
        if (isCurrent()) {
          setError(err instanceof Error ? err.message : "Request failed")
        }
      } finally {
        if (isCurrent()) setLoading(false)
      }
    },
    [applyPageData, buildParams, pageSize]
  )

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }))
      debounceRef.current = null
    }, SEARCH_DEBOUNCE_MS)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [searchInput])

  useEffect(() => {
    if (!loaded) return
    if (!hasLoadedOnceRef.current) {
      hasLoadedOnceRef.current = true
      return
    }
    setPageInfo({ startIndex: 1 })
    if (hasActiveFilters(filters) || initialTotalCount == null) {
      setTotalCount(null)
      fetchCount()
    }
    fetchPage(null, "next")
  }, [
    loaded,
    filters.search,
    filters.country,
    filters.mandal,
    filters.ghaam,
    filters.submittedFrom,
    filters.submittedTo,
    fetchCount,
    fetchPage,
    initialTotalCount,
  ])

  const handleLoadSubmissions = () => {
    fetchDistinctValues()
    fetchPage(null, "next")
    setPageInfo({ startIndex: 1 })
    if (initialTotalCount == null) fetchCount()
  }

  const handleNext = () => {
    if (nextCursor == null || !hasMore || loading) return
    setPageInfo((prev) => ({ startIndex: prev.startIndex + rows.length }))
    fetchPage(nextCursor, "next")
  }

  const handlePrev = () => {
    const canGoPrev = pageInfo.startIndex > 1 && prevCursor != null
    if (!canGoPrev || loading) return
    setPageInfo((prev) => ({ startIndex: Math.max(1, prev.startIndex - pageSize) }))
    fetchPage(prevCursor, "prev")
  }

  const handlePageSizeChange = (newSize: 25 | 50 | 100) => {
    if (newSize === pageSize) return
    setPageSize(newSize)
    setPageInfo({ startIndex: 1 })
    if (loaded) fetchPage(null, "next", newSize)
  }

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS)
    setSearchInput("")
  }

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const columns: AdminDataTableColumn<SpiritualSevaRow>[] = [
    {
      key: "submitted",
      header: "Submitted",
      cellClassName: "py-2.5 px-3 reg-text-secondary tabular-nums text-xs",
      render: (row) => formatSubmittedAt(row.created_at),
    },
    {
      key: "name",
      header: "Name",
      cellClassName: "py-2.5 px-3 reg-text-primary font-medium",
      render: (row) =>
        [row.first_name, row.middle_name, row.last_name].filter(Boolean).join(" ") ||
        "-",
    },
    {
      key: "ghaam",
      header: "Ghaam",
      render: (row) => row.ghaam ?? "-",
    },
    {
      key: "phone",
      header: "Phone",
      cellClassName: "py-2.5 px-3 reg-text-primary tabular-nums",
      render: (row) =>
        [row.phone_country_code, row.mobile_number].filter(Boolean).join(" ") || "-",
    },
    {
      key: "country",
      header: "Country",
      render: (row) => row.country ?? "-",
    },
    {
      key: "mandal",
      header: "Mandal",
      render: (row) => mandalStoredToDisplay(row.mandal),
    },
    {
      key: "malas",
      header: "Malas",
      cellClassName: "py-2.5 px-3 reg-text-primary tabular-nums text-center",
      render: (row) => formatCount(row.malas),
    },
    {
      key: "dhyan",
      header: "Dhyan",
      cellClassName: "py-2.5 px-3 reg-text-primary tabular-nums text-center",
      render: (row) => formatCount(row.dhyan),
    },
    {
      key: "pradakshinas",
      header: "Pradakshinas",
      cellClassName: "py-2.5 px-3 reg-text-primary tabular-nums text-center",
      render: (row) => formatCount(row.pradakshinas),
    },
    {
      key: "dandvats",
      header: "Dandvats",
      cellClassName: "py-2.5 px-3 reg-text-primary tabular-nums text-center",
      render: (row) => formatCount(row.dandvats),
    },
    {
      key: "padyatras",
      header: "Padyatras",
      cellClassName: "py-2.5 px-3 reg-text-primary tabular-nums text-center",
      render: (row) => formatCount(row.padyatras),
    },
    {
      key: "sadachar",
      header: "Sadachar",
      cellClassName: "py-2.5 px-3 reg-text-primary text-center",
      render: (row) => formatCount(row.sadachar),
    },
    {
      key: "harignanamrut",
      header: "Harignanamrut",
      cellClassName: "py-2.5 px-3 reg-text-primary text-center",
      render: (row) => formatCount(row.harignanamrut),
    },
    {
      key: "bapashree",
      header: "Bapashree",
      cellClassName: "py-2.5 px-3 reg-text-primary text-center",
      render: (row) => formatCount(row.bapashree),
    },
    {
      key: "upvas",
      header: "Upvas",
      cellClassName: "py-2.5 px-3 reg-text-primary text-center",
      render: (row) => formatCount(row.upvas),
    },
  ]

  const activeFilterString = buildFilterParams().toString()
  const totalRows =
    hasActiveFilters(filters) ? totalCount : initialTotalCount ?? totalCount

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="rounded-2xl admin-card overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 border-b border-[rgb(254,215,170)]/60">
        <div className="text-lg font-semibold reg-text-primary flex items-center gap-2">
          {loading && !loaded ? (
            <Loader2 className="size-5 text-orange-500 animate-spin" aria-hidden />
          ) : (
            <Table2 className="size-5 text-[rgb(13,19,45)]" aria-hidden />
          )}
          Spiritual Seva Submissions
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {loaded ? (
            <select
              value={pageSize}
              onChange={(event) =>
                handlePageSizeChange(Number(event.target.value) as 25 | 50 | 100)
              }
              className={SELECT_STYLE}
              aria-label="Rows per page"
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n} per page
                </option>
              ))}
            </select>
          ) : null}
          <a
            href="/api/admin/spiritual-seva-submissions/export"
            download
            className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 font-medium admin-btn-outline text-sm border-2 border-[rgb(254,215,170)]"
            aria-label="Export all spiritual seva submissions as CSV"
          >
            <Download className="size-4" aria-hidden />
            Export all
          </a>
        </div>
      </div>

      {loaded ? (
        <div className="p-5 pb-0 space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
            <div className="relative col-span-2 min-w-0 w-full sm:flex-1 sm:min-w-[200px] sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 reg-text-secondary pointer-events-none" aria-hidden />
              <input
                type="search"
                placeholder="Search name, phone, ghaam..."
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                className={`${INPUT_STYLE} w-full pl-10 pr-10`}
                aria-label="Search spiritual seva submissions"
              />
              {searchInput ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("")
                    setFilters((prev) => ({ ...prev, search: "" }))
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded reg-text-secondary hover:text-[rgb(31,41,55)] hover:bg-[rgb(254,215,170)]/30 transition-colors focus-visible:ring-2 focus-visible:ring-[rgb(254,215,170)]"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </div>
            <select
              value={filters.country}
              onChange={(event) => updateFilter("country", event.target.value)}
              className={`${SELECT_STYLE} col-span-1 w-full sm:w-auto`}
              aria-label="Filter by country"
            >
              <option value="">All countries</option>
              {(distinctValues?.country ?? []).map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <select
              value={filters.mandal}
              onChange={(event) => updateFilter("mandal", event.target.value)}
              className={`${SELECT_STYLE} col-span-1 w-full sm:w-auto`}
              aria-label="Filter by mandal"
            >
              <option value="">All mandals</option>
              {(distinctValues?.mandal ?? []).map((mandal) => (
                <option key={mandal} value={mandal}>
                  {mandalStoredToDisplay(mandal)}
                </option>
              ))}
            </select>
            <select
              value={filters.ghaam}
              onChange={(event) => updateFilter("ghaam", event.target.value)}
              className={`${SELECT_STYLE} col-span-2 w-full sm:col-span-1 sm:w-auto`}
              aria-label="Filter by ghaam"
            >
              <option value="">All ghaams</option>
              {(distinctValues?.ghaam ?? []).map((ghaam) => (
                <option key={ghaam} value={ghaam}>
                  {ghaam}
                </option>
              ))}
            </select>

            {hasActiveFilters(filters) ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                  className="col-span-2 w-full sm:col-span-1 sm:w-auto rounded-full px-4 py-2 admin-btn-outline"
                >
                  <X className="size-4 mr-1" aria-hidden />
                  Clear filters
                </Button>
                <a
                  href={`/api/admin/spiritual-seva-submissions/export?${activeFilterString}`}
                  download
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-medium admin-btn-primary text-sm col-span-2 w-full sm:col-span-1 sm:w-auto sm:min-w-0 justify-center"
                  aria-label="Export filtered spiritual seva submissions as CSV"
                >
                  <Download className="size-4 shrink-0" aria-hidden />
                  Export current view
                </a>
              </>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => setFiltersExpanded((expanded) => !expanded)}
            className="flex items-center gap-2 text-sm reg-text-secondary hover:text-[rgb(31,41,55)] transition-colors focus-visible:ring-2 focus-visible:ring-[rgb(254,215,170)] rounded px-2 py-1 -mx-2 -my-1"
          >
            <Filter className="size-4" aria-hidden />
            {filtersExpanded ? (
              <>
                <ChevronUp className="size-4" />
                Hide date filters
              </>
            ) : (
              <>
                <ChevronDown className="size-4" />
                Show date filters
              </>
            )}
          </button>

          <AnimatePresence>
            {filtersExpanded ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap items-end gap-4 pt-2 pb-2 border-t border-[rgb(254,215,170)]/60">
                  <div>
                    <label className="block text-xs font-medium text-preset-bluish-gray mb-1">
                      Submitted from
                    </label>
                    <input
                      type="date"
                      value={filters.submittedFrom}
                      onChange={(event) =>
                        updateFilter("submittedFrom", event.target.value)
                      }
                      className={`${INPUT_STYLE} w-36`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-preset-bluish-gray mb-1">
                      Submitted to
                    </label>
                    <input
                      type="date"
                      value={filters.submittedTo}
                      onChange={(event) =>
                        updateFilter("submittedTo", event.target.value)
                      }
                      className={`${INPUT_STYLE} w-36`}
                    />
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      ) : null}

      {!loaded && !loading ? (
        <div className="flex items-center justify-center py-12 px-5">
          <Button
            onClick={handleLoadSubmissions}
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium admin-btn-primary text-base shadow-md hover:shadow-lg transition-shadow"
          >
            <Table2 className="size-5" aria-hidden />
            Load Spiritual Seva Submissions
          </Button>
        </div>
      ) : null}

      {!loaded && loading ? (
        <div className="flex flex-col items-center justify-center py-10 px-4">
          <Loader2 className="size-8 animate-spin text-orange-500 mb-3" aria-hidden />
          <p className="reg-text-primary font-medium">Loading submissions...</p>
        </div>
      ) : null}

      {error ? (
        <div className="mx-5 mb-5 py-3 px-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
          {error}
        </div>
      ) : null}

      {loaded ? (
        <AdminDataTable
          rows={rows}
          columns={columns}
          getRowKey={(row) => row.id}
          startIndex={pageInfo.startIndex}
          loading={loading}
          minWidthClassName="min-w-[980px]"
          emptyTitle="No spiritual seva submissions match your filters"
          emptyDescription="Try adjusting your search or filters"
          emptyAction={
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="rounded-full px-5 py-2.5 admin-btn-outline"
            >
              Clear filters
            </Button>
          }
          totalRowsLabel={<>Total rows: {totalRows ?? "-"}</>}
          hasPrev={pageInfo.startIndex > 1}
          hasMore={hasMore}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      ) : null}
    </motion.div>
  )
}
