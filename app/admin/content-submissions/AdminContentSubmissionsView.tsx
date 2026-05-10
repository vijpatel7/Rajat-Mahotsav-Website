"use client"

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { AnimatePresence, motion } from "framer-motion"
import { format, formatDistanceToNow } from "date-fns"
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Filter,
  Loader2,
  Mail,
  Phone,
  Search,
  User,
  X,
} from "lucide-react"
import { Button } from "@/components/atoms/button"
import { Input } from "@/components/atoms/input"
import { Label } from "@/components/atoms/label"
import { Textarea } from "@/components/atoms/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/molecules/dialog"
import { Toaster } from "@/components/molecules/toaster"
import { useToast } from "@/hooks/use-toast"
import {
  CONTENT_SUBMISSION_STATUSES,
  type ContentImageKey,
  type ContentSubmissionRow,
  type ContentSubmissionStatus,
  publicUrlForKey,
} from "@/lib/content-submissions-admin"
import { mandalStoredToDisplay, getAllMandalOptionsStored } from "@/lib/mandal-options"

const STATUS_LABEL: Record<ContentSubmissionStatus, string> = {
  new: "New",
  approved: "Approved",
  posted: "Posted",
  rejected: "Rejected",
  archived: "Archived",
}

const STATUS_PILL_CLASS: Record<ContentSubmissionStatus, string> = {
  new: "bg-amber-100 text-amber-800 ring-amber-200",
  approved: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  posted: "bg-sky-100 text-sky-800 ring-sky-200",
  rejected: "bg-rose-100 text-rose-700 ring-rose-200",
  archived: "bg-gray-100 text-gray-700 ring-gray-200",
}

type PaginatedResponse = {
  success?: boolean
  rows?: ContentSubmissionRow[]
  pageSize?: number
  nextCursor?: string | null
  prevCursor?: string | null
  hasMore?: boolean
  hasPrev?: boolean
  error?: string
  details?: string
}

type FilterState = {
  search: string
  status: string
  mandal: string
  submittedFrom: string
  submittedTo: string
}

const EMPTY_FILTERS: FilterState = {
  search: "",
  status: "",
  mandal: "",
  submittedFrom: "",
  submittedTo: "",
}

const ALL_VALUE = "__all"
const PAGE_SIZE = 24

type AdminContentSubmissionsViewProps = {
  initialTotalCount?: number | null
}

export function AdminContentSubmissionsView({
  initialTotalCount,
}: AdminContentSubmissionsViewProps) {
  const { toast } = useToast()

  const [rows, setRows] = useState<ContentSubmissionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS)
  const [searchInput, setSearchInput] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const [cursor, setCursor] = useState<string>("")
  const [direction, setDirection] = useState<"next" | "prev">("next")
  const [hasMore, setHasMore] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)
  const [pageStartIndex, setPageStartIndex] = useState(0)

  const [totalCount, setTotalCount] = useState<number | null>(
    initialTotalCount ?? null
  )

  const [activeRow, setActiveRow] = useState<ContentSubmissionRow | null>(null)

  const mandalOptions = useMemo(() => {
    return getAllMandalOptionsStored().map((stored) => ({
      value: stored,
      label: mandalStoredToDisplay(stored),
    }))
  }, [])

  const buildQuery = useCallback(
    (overrides?: Partial<{ cursor: string; direction: "next" | "prev" }>) => {
      const params = new URLSearchParams()
      params.set("page_size", String(PAGE_SIZE))
      const c = overrides?.cursor ?? cursor
      const d = overrides?.direction ?? direction
      if (c) params.set("cursor", c)
      if (d) params.set("direction", d)
      if (filters.search) params.set("search", filters.search)
      if (filters.status) params.set("status", filters.status)
      if (filters.mandal) params.set("mandal", filters.mandal)
      if (filters.submittedFrom)
        params.set("submittedFrom", filters.submittedFrom)
      if (filters.submittedTo) params.set("submittedTo", filters.submittedTo)
      return params
    },
    [cursor, direction, filters]
  )

  const fetchRows = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(
        `/api/admin/content-submissions?${buildQuery().toString()}`,
        { cache: "no-store" }
      )
      const json = (await res.json()) as PaginatedResponse
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to load submissions")
      }
      setRows(json.rows ?? [])
      setHasMore(Boolean(json.hasMore))
      setHasPrev(Boolean(json.hasPrev))
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load"
      toast({
        title: "Could not load submissions",
        description: message,
        className: "bg-red-500 text-white border-red-400 shadow-xl font-medium",
      })
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [buildQuery, toast])

  const fetchCount = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (filters.search) params.set("search", filters.search)
      if (filters.status) params.set("status", filters.status)
      if (filters.mandal) params.set("mandal", filters.mandal)
      if (filters.submittedFrom)
        params.set("submittedFrom", filters.submittedFrom)
      if (filters.submittedTo) params.set("submittedTo", filters.submittedTo)
      const res = await fetch(
        `/api/admin/content-submissions/count?${params.toString()}`,
        { cache: "no-store" }
      )
      const json = (await res.json()) as { count?: number }
      if (typeof json.count === "number") setTotalCount(json.count)
    } catch {
      /* non-fatal */
    }
  }, [filters])

  useEffect(() => {
    void fetchRows()
    void fetchCount()
  }, [fetchRows, fetchCount])

  // Debounce the search input.
  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((prev) =>
        prev.search === searchInput ? prev : { ...prev, search: searchInput }
      )
      setCursor("")
      setDirection("next")
      setPageStartIndex(0)
    }, 300)
    return () => clearTimeout(t)
  }, [searchInput])

  const onFilterChange = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setCursor("")
    setDirection("next")
    setPageStartIndex(0)
  }

  const onClearFilters = () => {
    setFilters(EMPTY_FILTERS)
    setSearchInput("")
    setCursor("")
    setDirection("next")
    setPageStartIndex(0)
  }

  const goNext = () => {
    if (rows.length === 0) return
    const last = rows[rows.length - 1]
    setCursor(last.created_at)
    setDirection("next")
    setPageStartIndex((p) => p + rows.length)
  }

  const goPrev = () => {
    if (rows.length === 0) return
    const first = rows[0]
    setCursor(first.created_at)
    setDirection("prev")
    setPageStartIndex((p) => Math.max(0, p - PAGE_SIZE))
  }

  const updateRow = (id: string, patch: Partial<ContentSubmissionRow>) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
    )
    setActiveRow((current) =>
      current && current.id === id ? { ...current, ...patch } : current
    )
  }

  const setStatus = async (id: string, status: ContentSubmissionStatus) => {
    try {
      const res = await fetch(`/api/admin/content-submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      const json = (await res.json()) as {
        success?: boolean
        row?: Partial<ContentSubmissionRow>
        error?: string
      }
      if (!res.ok || !json.success) throw new Error(json.error || "Update failed")
      updateRow(id, json.row ?? { status })
      toast({
        title: `Marked as ${STATUS_LABEL[status]}`,
        className:
          "bg-green-500 text-white border-green-400 shadow-xl font-medium",
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Try again"
      toast({
        title: "Update failed",
        description: message,
        className: "bg-red-500 text-white border-red-400 shadow-xl font-medium",
      })
    }
  }

  const saveNotes = async (id: string, notes: string) => {
    try {
      const res = await fetch(`/api/admin/content-submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: notes || null }),
      })
      const json = (await res.json()) as {
        success?: boolean
        row?: Partial<ContentSubmissionRow>
        error?: string
      }
      if (!res.ok || !json.success) throw new Error(json.error || "Update failed")
      updateRow(id, json.row ?? { notes })
      toast({
        title: "Notes saved",
        className:
          "bg-green-500 text-white border-green-400 shadow-xl font-medium",
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Try again"
      toast({
        title: "Save failed",
        description: message,
        className: "bg-red-500 text-white border-red-400 shadow-xl font-medium",
      })
    }
  }

  const filteredCountLabel = useMemo(() => {
    if (totalCount === null) return null
    return `${rows.length === 0 ? 0 : pageStartIndex + 1}–${
      pageStartIndex + rows.length
    } of ${totalCount.toLocaleString()}`
  }, [rows.length, totalCount, pageStartIndex])

  return (
    <>
      <div className="mt-8 space-y-4">
        {/* Filter bar */}
        <div className="admin-card rounded-2xl p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search
                className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-orange-500/70"
                aria-hidden
              />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search family, village, caption, contact…"
                className="reg-input rounded-md pl-10"
                aria-label="Search submissions"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters((v) => !v)}
              className="admin-btn-outline gap-2 rounded-md"
            >
              <Filter className="size-4" />
              Filters
            </Button>
            {(filters.status ||
              filters.mandal ||
              filters.submittedFrom ||
              filters.submittedTo ||
              filters.search) && (
              <Button
                type="button"
                variant="ghost"
                onClick={onClearFilters}
                className="gap-1 text-orange-700 hover:bg-orange-50"
              >
                <X className="size-4" />
                Clear
              </Button>
            )}
            <div className="ml-auto text-xs text-gray-600 sm:text-sm">
              {filteredCountLabel}
            </div>
          </div>

          <AnimatePresence initial={false}>
            {showFilters && (
              <motion.div
                key="filters"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-1.5">
                    <Label className="reg-label text-xs">Status</Label>
                    <Select
                      value={filters.status || ALL_VALUE}
                      onValueChange={(v) =>
                        onFilterChange("status", v === ALL_VALUE ? "" : v)
                      }
                    >
                      <SelectTrigger className="reg-input rounded-md">
                        <SelectValue placeholder="Any status" />
                      </SelectTrigger>
                      <SelectContent className="reg-popover rounded-xl">
                        <SelectItem
                          value={ALL_VALUE}
                          className="reg-popover-item rounded-lg"
                        >
                          Any status
                        </SelectItem>
                        {CONTENT_SUBMISSION_STATUSES.map((s) => (
                          <SelectItem
                            key={s}
                            value={s}
                            className="reg-popover-item rounded-lg"
                          >
                            {STATUS_LABEL[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="reg-label text-xs">Mandal</Label>
                    <Select
                      value={filters.mandal || ALL_VALUE}
                      onValueChange={(v) =>
                        onFilterChange("mandal", v === ALL_VALUE ? "" : v)
                      }
                    >
                      <SelectTrigger className="reg-input rounded-md">
                        <SelectValue placeholder="Any mandal" />
                      </SelectTrigger>
                      <SelectContent className="reg-popover max-h-72 rounded-xl">
                        <SelectItem
                          value={ALL_VALUE}
                          className="reg-popover-item rounded-lg"
                        >
                          Any mandal
                        </SelectItem>
                        <SelectGroup>
                          <SelectLabel className="px-3 pt-2 text-xs font-semibold uppercase tracking-wider text-orange-700">
                            All mandals
                          </SelectLabel>
                          {mandalOptions.map((m) => (
                            <SelectItem
                              key={m.value}
                              value={m.value}
                              className="reg-popover-item rounded-lg"
                            >
                              {m.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="reg-label text-xs">From</Label>
                    <Input
                      type="date"
                      value={filters.submittedFrom}
                      onChange={(e) =>
                        onFilterChange("submittedFrom", e.target.value)
                      }
                      className="reg-input rounded-md"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="reg-label text-xs">To</Label>
                    <Input
                      type="date"
                      value={filters.submittedTo}
                      onChange={(e) =>
                        onFilterChange("submittedTo", e.target.value)
                      }
                      className="reg-input rounded-md"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Cards grid */}
        <div className="admin-card relative min-h-[400px] rounded-2xl p-4 sm:p-5">
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/70 backdrop-blur-[1px]"
              >
                <div className="flex flex-col items-center gap-2">
                  <Loader2
                    className="size-8 animate-spin text-orange-500"
                    aria-hidden
                  />
                  <span className="reg-text-secondary text-sm">Loading…</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {rows.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
              <p className="reg-text-primary text-base font-semibold">
                No submissions yet
              </p>
              <p className="reg-text-secondary max-w-sm text-sm">
                Once memories are submitted at /share-memories, they'll appear
                here for review.
              </p>
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rows.map((row) => (
                <SubmissionCard
                  key={row.id}
                  row={row}
                  onOpen={() => setActiveRow(row)}
                />
              ))}
            </ul>
          )}

          {/* Pagination */}
          {(hasMore || hasPrev) && (
            <div className="mt-5 flex items-center justify-between border-t-2 border-orange-200/60 pt-4">
              <Button
                type="button"
                variant="outline"
                disabled={!hasPrev || loading}
                onClick={goPrev}
                className="admin-btn-outline gap-1 rounded-md"
              >
                <ChevronLeft className="size-4" />
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={!hasMore || loading}
                onClick={goNext}
                className="admin-btn-outline gap-1 rounded-md"
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <SubmissionDetailDialog
        row={activeRow}
        onClose={() => setActiveRow(null)}
        onStatusChange={setStatus}
        onSaveNotes={saveNotes}
      />

      <Toaster />
    </>
  )
}

function SubmissionCard({
  row,
  onOpen,
}: {
  row: ContentSubmissionRow
  onOpen: () => void
}) {
  const firstImage = row.image_keys?.[0]
  const extra = Math.max(0, (row.image_keys?.length ?? 0) - 1)
  const submitted = row.created_at
    ? formatDistanceToNow(new Date(row.created_at), { addSuffix: true })
    : ""

  return (
    <li>
      <button
        type="button"
        onClick={onOpen}
        className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-orange-200 bg-white text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-300"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-orange-50">
          {firstImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={publicUrlForKey(firstImage.key)}
              alt={firstImage.filename}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
              No image
            </div>
          )}
          {extra > 0 && (
            <span className="absolute bottom-2 right-2 rounded-full bg-black/65 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              +{extra} more
            </span>
          )}
          <span
            className={`absolute left-2 top-2 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ring-1 ${STATUS_PILL_CLASS[row.status]}`}
          >
            {STATUS_LABEL[row.status]}
          </span>
        </div>
        <div className="flex flex-1 flex-col gap-1 p-3">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate text-sm font-semibold text-gray-900">
              {row.family_name}
            </p>
            <span className="shrink-0 text-[11px] text-gray-500">
              {submitted}
            </span>
          </div>
          <p className="text-xs text-gray-600">
            {row.village} · {mandalStoredToDisplay(row.mandal)}
          </p>
          <p className="line-clamp-2 pt-1 text-xs text-gray-500">
            {row.caption}
          </p>
        </div>
      </button>
    </li>
  )
}

function SubmissionDetailDialog({
  row,
  onClose,
  onStatusChange,
  onSaveNotes,
}: {
  row: ContentSubmissionRow | null
  onClose: () => void
  onStatusChange: (id: string, status: ContentSubmissionStatus) => void
  onSaveNotes: (id: string, notes: string) => void
}) {
  const open = Boolean(row)
  const [notes, setNotes] = useState("")
  const [savingStatus, setSavingStatus] =
    useState<ContentSubmissionStatus | null>(null)
  const lastIdRef = useRef<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (row && row.id !== lastIdRef.current) {
      setNotes(row.notes ?? "")
      setSavingStatus(null)
      lastIdRef.current = row.id
    }
    if (!row) {
      lastIdRef.current = null
    }
  }, [row])

  if (!row) {
    return (
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent />
      </Dialog>
    )
  }

  const submittedAbsolute = row.created_at
    ? format(new Date(row.created_at), "MMM d, yyyy 'at' h:mm a")
    : "—"
  const submittedRelative = row.created_at
    ? formatDistanceToNow(new Date(row.created_at), { addSuffix: true })
    : ""

  const phoneFull =
    [row.uploader_phone_country_code, row.uploader_mobile_number]
      .filter(Boolean)
      .join(" ")
      .trim() || null

  const copy = (label: string, value: string) => {
    navigator.clipboard
      ?.writeText(value)
      .then(() =>
        toast({
          title: `${label} copied`,
          className:
            "bg-green-500 text-white border-green-400 shadow-xl font-medium",
        })
      )
      .catch(() => undefined)
  }

  const handleStatus = async (next: ContentSubmissionStatus) => {
    setSavingStatus(next)
    await onStatusChange(row.id, next)
    setSavingStatus(null)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="admin-scrollbar fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[95vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-0 shadow-2xl">
        <DialogHeader className="border-b border-orange-100 bg-gradient-to-r from-orange-50 to-red-50 p-5">
          <DialogTitle className="text-lg font-semibold text-gray-900 sm:text-xl">
            {row.family_name} · {row.village}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {mandalStoredToDisplay(row.mandal)} mandal · submitted{" "}
            {submittedAbsolute} ({submittedRelative})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 p-5">
          {/* Images */}
          <section>
            <SectionLabel>
              Photos ({row.image_keys?.length ?? 0})
            </SectionLabel>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {(row.image_keys ?? []).map((img) => (
                <ImageTile key={img.key} image={img} />
              ))}
            </ul>
          </section>

          {/* Caption */}
          <section>
            <div className="flex items-center justify-between">
              <SectionLabel>Caption / story</SectionLabel>
              <button
                type="button"
                onClick={() => copy("Caption", row.caption)}
                className="inline-flex items-center gap-1 text-xs font-medium text-orange-700 hover:text-orange-900"
              >
                <Copy className="size-3.5" />
                Copy
              </button>
            </div>
            <p className="mt-2 whitespace-pre-wrap rounded-xl border border-orange-100 bg-orange-50/40 p-3 text-sm leading-relaxed text-gray-800">
              {row.caption}
            </p>
          </section>

          {/* Uploader contact */}
          <section>
            <SectionLabel>Uploader contact</SectionLabel>
            {row.uploader_name ||
            row.uploader_email ||
            phoneFull ? (
              <ul className="mt-2 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3">
                <ContactItem
                  icon={<User className="size-4" />}
                  label="Name"
                  value={row.uploader_name}
                  onCopy={(v) => copy("Name", v)}
                />
                <ContactItem
                  icon={<Mail className="size-4" />}
                  label="Email"
                  value={row.uploader_email}
                  onCopy={(v) => copy("Email", v)}
                />
                <ContactItem
                  icon={<Phone className="size-4" />}
                  label="Phone"
                  value={phoneFull}
                  onCopy={(v) => copy("Phone", v)}
                />
              </ul>
            ) : (
              <p className="mt-2 text-sm italic text-gray-500">
                Uploader did not provide contact info.
              </p>
            )}
          </section>

          {/* Status workflow */}
          <section>
            <SectionLabel>Status</SectionLabel>
            <p className="mt-1 text-xs text-gray-500">
              Current:{" "}
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ring-1 ${STATUS_PILL_CLASS[row.status]}`}
              >
                {STATUS_LABEL[row.status]}
              </span>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {CONTENT_SUBMISSION_STATUSES.map((s) => {
                const isCurrent = s === row.status
                const isSaving = savingStatus === s
                return (
                  <Button
                    key={s}
                    type="button"
                    onClick={() => handleStatus(s)}
                    disabled={isCurrent || savingStatus !== null}
                    className={
                      isCurrent
                        ? "admin-btn-outline cursor-default rounded-full opacity-60"
                        : "admin-btn-primary rounded-full"
                    }
                  >
                    {isSaving ? (
                      <Loader2 className="mr-1.5 size-4 animate-spin" />
                    ) : null}
                    {STATUS_LABEL[s]}
                  </Button>
                )
              })}
            </div>
          </section>

          {/* Notes */}
          <section>
            <div className="flex items-center justify-between">
              <SectionLabel>Internal notes</SectionLabel>
              <Button
                type="button"
                onClick={() => onSaveNotes(row.id, notes)}
                className="admin-btn-primary h-9 rounded-md text-xs"
              >
                Save notes
              </Button>
            </div>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Notes for the social team (not shown publicly)"
              className="reg-input mt-2 min-h-[88px] rounded-md py-2 leading-relaxed"
            />
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ImageTile({ image }: { image: ContentImageKey }) {
  const url = publicUrlForKey(image.key)
  const sizeLabel = formatBytes(image.size_bytes)
  return (
    <li className="overflow-hidden rounded-xl border border-orange-100 bg-white shadow-sm">
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="block aspect-[4/3] w-full overflow-hidden bg-orange-50"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={image.filename}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.03]"
        />
      </a>
      <div className="flex items-center justify-between gap-2 px-3 py-2 text-xs text-gray-600">
        <span className="truncate" title={image.filename}>
          {image.filename}
        </span>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-1 text-orange-700 hover:text-orange-900"
        >
          <ExternalLink className="size-3.5" />
          {sizeLabel}
        </a>
      </div>
    </li>
  )
}

function ContactItem({
  icon,
  label,
  value,
  onCopy,
}: {
  icon: React.ReactNode
  label: string
  value: string | null
  onCopy: (value: string) => void
}) {
  return (
    <li className="flex items-start gap-2 rounded-xl border border-orange-100 bg-white p-3">
      <span className="mt-0.5 text-orange-600">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          {label}
        </p>
        {value ? (
          <div className="flex items-center gap-2">
            <span className="truncate text-sm text-gray-800" title={value}>
              {value}
            </span>
            <button
              type="button"
              onClick={() => onCopy(value)}
              className="shrink-0 text-orange-700 hover:text-orange-900"
              aria-label={`Copy ${label.toLowerCase()}`}
            >
              <Copy className="size-3.5" />
            </button>
          </div>
        ) : (
          <span className="text-sm italic text-gray-400">Not provided</span>
        )}
      </div>
    </li>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-orange-700">
      {children}
    </h3>
  )
}

function formatBytes(bytes: number): string {
  if (!bytes && bytes !== 0) return "—"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
