"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Table2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { mandalStoredToDisplay, getAllMandalOptionsStored } from "@/lib/mandal-options"
import { Button } from "@/components/atoms/button"
import { format } from "date-fns"
import { REGISTRATION_DATE_RANGE } from "@/lib/registration-date-range"

// Track the current page number for row numbering
type PageInfo = {
  startIndex: number // The row number to start counting from (1-based)
}

type RegistrationRow = {
  id: number
  first_name: string | null
  middle_name: string | null
  last_name: string | null
  email: string | null
  mobile_number: string | null
  phone_country_code: string | null
  country: string | null
  ghaam: string | null
  mandal: string | null
  arrival_date: string | null
  departure_date: string | null
  age: number | null
}

type PaginatedResponse = {
  success?: boolean
  rows?: RegistrationRow[]
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
  ghaam?: string[]
  country?: string[]
}

const PAGE_SIZE_OPTIONS = [25, 50, 100] as const
const SEARCH_DEBOUNCE_MS = 350
const SELECT_STYLE =
  "h-10 rounded-lg border-2 border-[rgb(254,215,170)] bg-white/80 px-3 text-sm reg-text-primary focus:outline-none focus:ring-2 focus:ring-[rgb(254,215,170)] focus-visible:ring-2 min-w-[120px] sm:min-w-[140px]"
const INPUT_STYLE =
  "h-10 rounded-lg border-2 border-[rgb(254,215,170)] bg-white/80 px-3 text-sm reg-text-primary focus:outline-none focus:ring-2 focus:ring-[rgb(254,215,170)] focus-visible:ring-2"

function formatDate(val: string | null): string {
  if (!val || val === "Unknown") return val ?? "—"
  try {
    const d = new Date(val + "T12:00:00")
    if (Number.isNaN(d.getTime())) return val
    return format(d, "MMM d, yyyy")
  } catch {
    return val
  }
}

function hasActiveFilters(f: FilterState): boolean {
  return !!(
    f.search ||
    f.ghaam ||
    f.mandal ||
    f.country ||
    f.age != null ||
    f.ageMin != null ||
    f.ageMax != null ||
    f.arrivalFrom ||
    f.arrivalTo ||
    f.departureFrom ||
    f.departureTo
  )
}

type FilterState = {
  search: string
  ghaam: string
  mandal: string
  country: string
  age: number | null
  ageMin: number | null
  ageMax: number | null
  arrivalFrom: string
  arrivalTo: string
  departureFrom: string
  departureTo: string
}

const INITIAL_FILTERS: FilterState = {
  search: "",
  ghaam: "",
  mandal: "",
  country: "",
  age: null,
  ageMin: null,
  ageMax: null,
  arrivalFrom: "",
  arrivalTo: "",
  departureFrom: "",
  departureTo: "",
}

type AdminRegistrationsTableProps = {
  /** Total from get_registrations_stats (same as dashboard). Used when no filters applied. */
  initialTotalCount?: number | null
}

export function AdminRegistrationsTable({ initialTotalCount = null }: AdminRegistrationsTableProps) {
  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<RegistrationRow[]>([])
  const [pageSize, setPageSize] = useState<25 | 50 | 100>(25)
  const [nextCursor, setNextCursor] = useState<number | null>(null)
  const [prevCursor, setPrevCursor] = useState<number | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS)
  const [searchInput, setSearchInput] = useState("")
  const [distinctValues, setDistinctValues] = useState<{
    ghaam: string[]
    country: string[]
  } | null>(null)
  const [filtersExpanded, setFiltersExpanded] = useState(false)
  const [pageInfo, setPageInfo] = useState<PageInfo>({ startIndex: 1 })
  const [totalCount, setTotalCount] = useState<number | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasLoadedOnceRef = useRef(false)
  const mandalOptions = getAllMandalOptionsStored()
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const requestIdRef = useRef(0)
  const countRequestIdRef = useRef(0)

  const fetchDistinctValues = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/registrations/distinct")
      const data: DistinctValuesResponse = await res.json()
      if (res.ok && data.ghaam && data.country) {
        setDistinctValues({ ghaam: data.ghaam, country: data.country })
      }
    } catch {
      // Non-blocking; dropdowns will show empty
    }
  }, [])

  const buildParams = useCallback(
    (
      cursor: number | null,
      direction: "next" | "prev",
      pageSizeOverride?: number
    ) => {
      const effectivePageSize = pageSizeOverride ?? pageSize
      const params = new URLSearchParams({
        page_size: String(effectivePageSize),
        direction,
      })
      if (cursor != null) params.set("cursor", String(cursor))
      if (filters.search.trim().length >= 2)
        params.set("search", filters.search.trim())
      if (filters.ghaam) params.set("ghaam", filters.ghaam)
      if (filters.mandal) params.set("mandal", filters.mandal)
      if (filters.country) params.set("country", filters.country)
      if (filters.age != null) params.set("age", String(filters.age))
      if (filters.ageMin != null) params.set("age_min", String(filters.ageMin))
      if (filters.ageMax != null) params.set("age_max", String(filters.ageMax))
      if (filters.arrivalFrom) params.set("arrival_from", filters.arrivalFrom)
      if (filters.arrivalTo) params.set("arrival_to", filters.arrivalTo)
      if (filters.departureFrom)
        params.set("departure_from", filters.departureFrom)
      if (filters.departureTo) params.set("departure_to", filters.departureTo)
      return params
    },
    [pageSize, filters]
  )

  /** Build filter-only query string for count and export (no pagination). */
  const buildFilterParams = useCallback(() => {
    const params = new URLSearchParams()
    if (filters.search.trim().length >= 2)
      params.set("search", filters.search.trim())
    if (filters.ghaam) params.set("ghaam", filters.ghaam)
    if (filters.mandal) params.set("mandal", filters.mandal)
    if (filters.country) params.set("country", filters.country)
    if (filters.age != null) params.set("age", String(filters.age))
    if (filters.ageMin != null) params.set("age_min", String(filters.ageMin))
    if (filters.ageMax != null) params.set("age_max", String(filters.ageMax))
    if (filters.arrivalFrom) params.set("arrival_from", filters.arrivalFrom)
    if (filters.arrivalTo) params.set("arrival_to", filters.arrivalTo)
    if (filters.departureFrom)
      params.set("departure_from", filters.departureFrom)
    if (filters.departureTo) params.set("departure_to", filters.departureTo)
    return params
  }, [filters])

  /** Build filter-only query string for "Export current view" (no pagination). */
  const buildExportFilterParams = useCallback(
    () => buildFilterParams().toString(),
    [buildFilterParams]
  )

  /** Fetch total row count for current filters. Only call on load or filter change, not when paginating. */
  const fetchCount = useCallback(async () => {
    const requestId = ++countRequestIdRef.current
    try {
      const qs = buildFilterParams().toString()
      const res = await fetch(
        `/api/admin/registrations/count${qs ? `?${qs}` : ""}`
      )
      const data = await res.json()
      if (requestId !== countRequestIdRef.current) return
      if (res.ok && typeof data.count === "number") {
        setTotalCount(data.count)
      } else {
        setTotalCount(null)
      }
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
      // Only ever display one page of results; cap in case API returns cumulative rows
      const fetchedRows = (data.rows ?? []).slice(0, effectivePageSize)
      setRows(fetchedRows)
      setNextCursor(data.nextCursor ?? null)
      setPrevCursor(data.prevCursor ?? null)

      // When navigating backward, the API's hasMore reflects backward direction.
      // We need to determine if there are more rows forward (next).
      if (direction === "prev") {
        setHasMore(data.nextCursor != null)
      } else {
        setHasMore(data.hasMore ?? false)
      }
      setHasPrev(data.hasPrev ?? false)
      setLoaded(true)
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

        const params = buildParams(cursor, direction, pageSizeOverride)

        setLoading(true)
        setError(null)
        const res = await fetch(`/api/admin/registrations?${params}`, {
          signal: controller.signal,
        })
        const data: PaginatedResponse = await res.json()

        if (!isCurrent()) return

        if (!res.ok) {
          setError(data.error ?? data.details ?? `HTTP ${res.status}`)
          return
        }

        const effectivePageSize = pageSizeOverride ?? pageSize
        applyPageData(data, direction, effectivePageSize)
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return
        }
        if (isCurrent()) {
          setError(err instanceof Error ? err.message : "Request failed")
        }
      } finally {
        if (isCurrent()) setLoading(false)
      }
    },
    [applyPageData, buildParams]
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
    // Reset to first page when filters change (not when paginating)
    setPageInfo({ startIndex: 1 })
    if (hasActiveFilters(filters)) {
      setTotalCount(null)
      fetchCount()
    } else if (initialTotalCount == null) {
      // No filters and no stats total (e.g. stats unavailable): fetch unfiltered count so we don't show "—"
      setTotalCount(null)
      fetchCount()
    }
    fetchPage(null, "next")
  }, [
    loaded,
    filters.ghaam,
    filters.mandal,
    filters.country,
    filters.age,
    filters.ageMin,
    filters.ageMax,
    filters.arrivalFrom,
    filters.arrivalTo,
    filters.departureFrom,
    filters.departureTo,
    filters.search,
    fetchPage,
    fetchCount,
  ])

  const handleLoadRegistrations = () => {
    fetchDistinctValues()
    fetchPage(null, "next")
    setPageInfo({ startIndex: 1 })
    // When stats unavailable, initialTotalCount is not passed; fetch count so total rows can still be shown
    if (initialTotalCount == null) fetchCount()
  }

  const handleNext = () => {
    if (nextCursor == null || !hasMore || loading) return
    setPageInfo((prev) => ({ startIndex: prev.startIndex + rows.length }))
    fetchPage(nextCursor, "next")
  }

  const handlePrev = () => {
    // Use pageInfo.startIndex as source of truth for whether we can go back
    const canGoPrev = pageInfo.startIndex > 1 && prevCursor != null
    if (!canGoPrev || loading) return
    setPageInfo((prev) => ({ startIndex: Math.max(1, prev.startIndex - pageSize) }))
    fetchPage(prevCursor, "prev")
  }

  // Derive whether we're on the first page from pageInfo
  const isOnFirstPage = pageInfo.startIndex === 1

  const handlePageSizeChange = (newSize: 25 | 50 | 100) => {
    if (newSize === pageSize) return
    setPageSize(newSize)
    setPageInfo({ startIndex: 1 }) // Reset to first page when changing page size
    if (loaded) {
      // Need to refetch with new page size from the beginning
      fetchPage(null, "next", newSize)
    }
  }

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS)
    setSearchInput("")
    // useEffect will refetch when filters change
  }

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="rounded-2xl admin-card overflow-hidden"
    >
      {/* Header - always visible */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 border-b border-[rgb(254,215,170)]/60">
        <div className="text-lg font-semibold reg-text-primary flex items-center gap-2">
          {loading && !loaded ? (
            <Loader2 className="size-5 text-orange-500 animate-spin" aria-hidden />
          ) : (
            <Table2 className="size-5 text-[rgb(13,19,45)]" aria-hidden />
          )}
          Registrations Table
        </div>
        <div className="flex items-center gap-3">
          {loaded && (
            <select
              value={pageSize}
              onChange={(e) =>
                handlePageSizeChange(Number(e.target.value) as 25 | 50 | 100)
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
          )}
          <a
            href="/api/registrations/export"
            download
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-medium admin-btn-outline text-sm border-2 border-[rgb(254,215,170)]"
            aria-label="Export entire registration list as CSV"
          >
            <Download className="size-4" aria-hidden />
            Export entire registration list
          </a>
        </div>
      </div>

      {loaded && (
        <div className="p-5 pb-0 space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
            <div className="relative col-span-2 min-w-0 w-full sm:flex-1 sm:min-w-[200px] sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 reg-text-secondary pointer-events-none" aria-hidden />
              <input
                type="search"
                placeholder="Search name, email, phone…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className={`${INPUT_STYLE} w-full pl-10 pr-10`}
                aria-label="Search registrations"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("")
                    setFilters((p) => ({ ...p, search: "" }))
                    fetchPage(null, "next")
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded reg-text-secondary hover:text-[rgb(31,41,55)] hover:bg-[rgb(254,215,170)]/30 transition-colors focus-visible:ring-2 focus-visible:ring-[rgb(254,215,170)]"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <select
              value={filters.ghaam}
              onChange={(e) => updateFilter("ghaam", e.target.value)}
              className={`${SELECT_STYLE} col-span-1 w-full sm:w-auto`}
              aria-label="Filter by ghaam"
            >
              <option value="">All ghaams</option>
              {(distinctValues?.ghaam ?? []).map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            <select
              value={filters.mandal}
              onChange={(e) => updateFilter("mandal", e.target.value)}
              className={`${SELECT_STYLE} col-span-1 w-full sm:w-auto`}
              aria-label="Filter by mandal"
            >
              <option value="">All mandals</option>
              {mandalOptions.map((m) => (
                <option key={m} value={m}>
                  {mandalStoredToDisplay(m)}
                </option>
              ))}
            </select>
            <select
              value={filters.country}
              onChange={(e) => updateFilter("country", e.target.value)}
              className={`${SELECT_STYLE} col-span-2 w-full sm:col-span-1 sm:w-auto`}
              aria-label="Filter by country"
            >
              <option value="">All countries</option>
              {(distinctValues?.country ?? []).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {hasActiveFilters(filters) && (
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
                  href={`/api/admin/registrations/export?${buildExportFilterParams()}`}
                  download
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-medium admin-btn-primary text-sm col-span-2 w-full sm:col-span-1 sm:w-auto sm:min-w-0 justify-center"
                  aria-label="Export current view as CSV (with current filters)"
                >
                  <Download className="size-4 shrink-0" aria-hidden />
                  Export current view
                </a>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setFiltersExpanded((e) => !e)}
            className="flex items-center gap-2 text-sm reg-text-secondary hover:text-[rgb(31,41,55)] transition-colors focus-visible:ring-2 focus-visible:ring-[rgb(254,215,170)] rounded px-2 py-1 -mx-2 -my-1"
          >
            <Filter className="size-4" aria-hidden />
            {filtersExpanded ? (
              <>
                <ChevronUp className="size-4" />
                Hide age & date filters
              </>
            ) : (
              <>
                <ChevronDown className="size-4" />
                Show age & date filters
              </>
            )}
          </button>

          <AnimatePresence>
            {filtersExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap items-end gap-4 pt-2 pb-2 border-t border-[rgb(254,215,170)]/60">
                  <div>
                    <label htmlFor="filter-age" className="block text-xs font-medium reg-text-secondary mb-1">
                      Age (exact)
                    </label>
                    <input
                      id="filter-age"
                      type="number"
                      min={1}
                      max={120}
                      placeholder="—"
                      value={filters.age ?? ""}
                      onChange={(e) =>
                        updateFilter(
                          "age",
                          e.target.value ? parseInt(e.target.value, 10) : null
                        )
                      }
                      className={`${INPUT_STYLE} w-24`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-preset-bluish-gray mb-1">
                      Age min
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      placeholder="—"
                      value={filters.ageMin ?? ""}
                      onChange={(e) =>
                        updateFilter(
                          "ageMin",
                          e.target.value ? parseInt(e.target.value, 10) : null
                        )
                      }
                      className={`${INPUT_STYLE} w-24`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-preset-bluish-gray mb-1">
                      Age max
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      placeholder="—"
                      value={filters.ageMax ?? ""}
                      onChange={(e) =>
                        updateFilter(
                          "ageMax",
                          e.target.value ? parseInt(e.target.value, 10) : null
                        )
                      }
                      className={`${INPUT_STYLE} w-24`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-preset-bluish-gray mb-1">
                      Arrival from
                    </label>
                    <input
                      type="date"
                      min={REGISTRATION_DATE_RANGE.start}
                      max={REGISTRATION_DATE_RANGE.end}
                      value={filters.arrivalFrom}
                      onChange={(e) =>
                        updateFilter("arrivalFrom", e.target.value)
                      }
                      className={`${INPUT_STYLE} w-36`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-preset-bluish-gray mb-1">
                      Arrival to
                    </label>
                    <input
                      type="date"
                      min={REGISTRATION_DATE_RANGE.start}
                      max={REGISTRATION_DATE_RANGE.end}
                      value={filters.arrivalTo}
                      onChange={(e) =>
                        updateFilter("arrivalTo", e.target.value)
                      }
                      className={`${INPUT_STYLE} w-36`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-preset-bluish-gray mb-1">
                      Departure from
                    </label>
                    <input
                      type="date"
                      min={REGISTRATION_DATE_RANGE.start}
                      max={REGISTRATION_DATE_RANGE.end}
                      value={filters.departureFrom}
                      onChange={(e) =>
                        updateFilter("departureFrom", e.target.value)
                      }
                      className={`${INPUT_STYLE} w-36`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-preset-bluish-gray mb-1">
                      Departure to
                    </label>
                    <input
                      type="date"
                      min={REGISTRATION_DATE_RANGE.start}
                      max={REGISTRATION_DATE_RANGE.end}
                      value={filters.departureTo}
                      onChange={(e) =>
                        updateFilter("departureTo", e.target.value)
                      }
                      className={`${INPUT_STYLE} w-36`}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Initial state - prompt to load */}
      {!loaded && !loading && (
        <div className="flex items-center justify-center py-12 px-5">
          <Button
            onClick={handleLoadRegistrations}
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium admin-btn-primary text-base shadow-md hover:shadow-lg transition-shadow"
          >
            <Table2 className="size-5" aria-hidden />
            Load Registrations
          </Button>
        </div>
      )}
      
      {/* Loading state before first load */}
      {!loaded && loading && (
        <div className="flex flex-col items-center justify-center py-10 px-4">
          <Loader2 className="size-8 animate-spin text-orange-500 mb-3" aria-hidden />
          <p className="reg-text-primary font-medium">Loading registrations…</p>
        </div>
      )}

      {error && (
        <div className="mx-5 mb-5 py-3 px-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
          {error}
        </div>
      )}

      {/* Table with fixed height container to prevent layout shift */}
      {loaded && (
        <div ref={tableContainerRef} className="relative min-h-[400px] p-5">
          {/* Loading overlay - shows on top of existing content */}
          <AnimatePresence>
            {loading && (
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
            )}
          </AnimatePresence>

          {rows.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-sm">
                  <thead>
                    <tr className="border-b-2 border-[rgb(254,215,170)]">
                      <th className="text-center py-3 px-2 font-semibold reg-text-secondary w-12">
                        #
                      </th>
                      <th className="text-left py-3 px-3 font-semibold reg-text-primary">
                        Name
                      </th>
                      <th className="text-left py-3 px-3 font-semibold reg-text-primary">
                        Email
                      </th>
                      <th className="text-left py-3 px-3 font-semibold reg-text-primary">
                        Ghaam
                      </th>
                      <th className="text-left py-3 px-3 font-semibold reg-text-primary">
                        Mandal
                      </th>
                      <th className="text-left py-3 px-3 font-semibold reg-text-primary">
                        Arrival
                      </th>
                      <th className="text-left py-3 px-3 font-semibold reg-text-primary">
                        Departure
                      </th>
                      <th className="text-left py-3 px-3 font-semibold reg-text-primary">
                        Age
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => (
                      <tr
                        key={row.id}
                        className={`border-b border-[rgb(254,215,170)]/40 transition-colors ${
                          index % 2 === 0 
                            ? "bg-white" 
                            : "bg-orange-100/70"
                        } hover:bg-orange-200/60`}
                      >
                        <td className="py-2.5 px-2 text-center text-xs font-medium reg-text-secondary tabular-nums">
                          {pageInfo.startIndex + index}
                        </td>
                        <td className="py-2.5 px-3 reg-text-primary font-medium">
                          {[row.first_name, row.middle_name, row.last_name]
                            .filter(Boolean)
                            .join(" ") || "—"}
                        </td>
                        <td className="py-2.5 px-3 reg-text-primary truncate max-w-[160px]">
                          {row.email ?? "—"}
                        </td>
                        <td className="py-2.5 px-3 reg-text-primary">
                          {row.ghaam ?? "—"}
                        </td>
                        <td className="py-2.5 px-3 reg-text-primary">
                          {mandalStoredToDisplay(row.mandal)}
                        </td>
                        <td className="py-2.5 px-3 reg-text-secondary tabular-nums text-xs">
                          {formatDate(row.arrival_date)}
                        </td>
                        <td className="py-2.5 px-3 reg-text-secondary tabular-nums text-xs">
                          {formatDate(row.departure_date)}
                        </td>
                        <td className="py-2.5 px-3 reg-text-primary tabular-nums text-center">
                          {row.age ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination footer */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5 pt-4 border-t-2 border-[rgb(254,215,170)]">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <p className="text-sm reg-text-secondary">
                    Showing rows {pageInfo.startIndex}–{pageInfo.startIndex + rows.length - 1}
                  </p>
                  <p className="text-sm reg-text-secondary">
                    Total rows: {hasActiveFilters(filters) ? (totalCount != null ? totalCount : "—") : (initialTotalCount ?? totalCount ?? "—")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={isOnFirstPage || loading}
                    className={`
                      inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium
                      transition-all duration-200
                      ${!isOnFirstPage && !loading
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
                    onClick={handleNext}
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
              <p className="reg-text-primary font-medium mb-2">
                No registrations match your filters
              </p>
              <p className="text-sm reg-text-secondary mb-4">
                Try adjusting your search or filters
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="rounded-full px-5 py-2.5 admin-btn-outline"
              >
                Clear filters
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </motion.div>
  )
}
