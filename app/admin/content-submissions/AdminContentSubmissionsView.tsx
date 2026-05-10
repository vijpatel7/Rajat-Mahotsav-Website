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
  Copy,
  Download,
  Eye,
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
  type ContentImageKey,
  type ContentSubmissionRow,
  publicUrlForKey,
} from "@/lib/content-submissions-admin"
import { mandalStoredToDisplay, getAllMandalOptionsStored } from "@/lib/mandal-options"
import { formatBytes } from "@/lib/utils"
import {
  AdminDataTable,
  type AdminDataTableColumn,
} from "@/app/admin/components/AdminDataTable"

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

  const archiveUrl = useMemo(() => {
    const params = new URLSearchParams()
    if (filters.search) params.set("search", filters.search)
    if (filters.status) params.set("status", filters.status)
    if (filters.mandal) params.set("mandal", filters.mandal)
    if (filters.submittedFrom)
      params.set("submittedFrom", filters.submittedFrom)
    if (filters.submittedTo) params.set("submittedTo", filters.submittedTo)
    const qs = params.toString()
    return qs
      ? `/api/admin/content-submissions/archive?${qs}`
      : "/api/admin/content-submissions/archive"
  }, [filters])

  const tableColumns: AdminDataTableColumn<ContentSubmissionRow>[] = [
    {
      key: "family_name",
      header: "Family Name",
      render: (row) => (
        <button
          type="button"
          onClick={() => setActiveRow(row)}
          className="text-left font-semibold text-gray-900 hover:text-orange-700 hover:underline"
        >
          {row.family_name}
        </button>
      ),
    },
    {
      key: "ghaam",
      header: "Ghaam",
      render: (row) => (
        <span className="text-sm text-gray-700">{row.village}</span>
      ),
    },
    {
      key: "mandal",
      header: "Mandal",
      render: (row) => (
        <span className="text-sm text-gray-700">
          {mandalStoredToDisplay(row.mandal)}
        </span>
      ),
    },
    {
      key: "photos",
      header: "Photos",
      className: "w-16 text-center py-3 px-2 font-semibold reg-text-primary",
      cellClassName:
        "py-2.5 px-2 text-center text-sm font-medium tabular-nums reg-text-primary",
      render: (row) => row.image_keys?.length ?? 0,
    },
    {
      key: "submitted",
      header: "Submitted",
      className: "w-32 text-left py-3 px-3 font-semibold reg-text-primary",
      render: (row) =>
        row.created_at ? (
          <span
            className="text-xs text-gray-600"
            title={format(new Date(row.created_at), "MMM d, yyyy 'at' h:mm a")}
          >
            {formatDistanceToNow(new Date(row.created_at), {
              addSuffix: true,
            })}
          </span>
        ) : (
          "—"
        ),
    },
    {
      key: "actions",
      header: "",
      className: "w-28 text-right py-3 px-3 font-semibold reg-text-primary",
      cellClassName: "py-2.5 px-3",
      render: (row) => (
        <div className="flex justify-end gap-1">
          <button
            type="button"
            onClick={() => setActiveRow(row)}
            className="inline-flex size-8 items-center justify-center rounded-md text-orange-700 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-300"
            title="View details"
            aria-label="View details"
          >
            <Eye className="size-4" />
          </button>
          <a
            href={`/api/admin/content-submissions/${row.id}/zip`}
            className="inline-flex size-8 items-center justify-center rounded-md text-orange-700 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-300"
            title="Download submission ZIP (data + photos)"
            aria-label="Download submission ZIP"
          >
            <Download className="size-4" />
          </a>
        </div>
      ),
    },
  ]

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
                placeholder="Search family, ghaam, caption, contact…"
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
            <a
              href={archiveUrl}
              className="admin-btn-primary inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm"
              title="Download CSV + all photos for the current filtered set"
            >
              <Download className="size-4" />
              Export Archive
            </a>
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
                <div className="grid grid-cols-1 gap-3 pt-4 sm:grid-cols-3">
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

        {/* Submissions table */}
        <div className="admin-card rounded-2xl">
          <AdminDataTable<ContentSubmissionRow>
            rows={rows}
            columns={tableColumns}
            getRowKey={(row) => row.id}
            startIndex={pageStartIndex + 1}
            loading={loading}
            hasPrev={hasPrev}
            hasMore={hasMore}
            onPrev={goPrev}
            onNext={goNext}
            emptyTitle="No submissions yet"
            emptyDescription="Once memories are submitted at /share-memories, they'll appear here for review."
            minWidthClassName="min-w-[920px]"
            totalRowsLabel={
              totalCount !== null ? (
                <>Total: {totalCount.toLocaleString()}</>
              ) : null
            }
          />
        </div>
      </div>

      <SubmissionDetailDialog
        row={activeRow}
        onClose={() => setActiveRow(null)}
        onSaveNotes={saveNotes}
      />

      <Toaster />
    </>
  )
}

function SubmissionDetailDialog({
  row,
  onClose,
  onSaveNotes,
}: {
  row: ContentSubmissionRow | null
  onClose: () => void
  onSaveNotes: (id: string, notes: string) => void
}) {
  const open = Boolean(row)
  const [notes, setNotes] = useState("")
  const lastIdRef = useRef<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (row && row.id !== lastIdRef.current) {
      setNotes(row.notes ?? "")
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
            <div className="flex items-center justify-between gap-3">
              <SectionLabel>
                Photos ({row.image_keys?.length ?? 0})
              </SectionLabel>
              {(row.image_keys?.length ?? 0) > 0 && (
                <a
                  href={`/api/admin/content-submissions/${row.id}/zip`}
                  className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700 ring-1 ring-orange-200 transition-colors hover:bg-orange-100"
                  title="Download a ZIP with this submission's photos and data"
                >
                  <Download className="size-3.5" />
                  Download ZIP
                </a>
              )}
            </div>
            <ul className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {(row.image_keys ?? []).map((img) => (
                <ImageTile
                  key={img.key}
                  image={img}
                  downloadName={buildDownloadName(row, img.filename)}
                />
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

function ImageTile({
  image,
  downloadName,
}: {
  image: ContentImageKey
  downloadName: string
}) {
  const url = publicUrlForKey(image.key)
  const sizeLabel = formatBytes(image.size_bytes)
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    setDownloading(true)
    try {
      await downloadImageBlob(url, downloadName)
    } catch {
      // Open in a new tab as a fallback so the user can right-click to save.
      window.open(url, "_blank", "noreferrer")
    } finally {
      setDownloading(false)
    }
  }

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
        <div className="min-w-0">
          <p className="truncate" title={image.filename}>
            {image.filename}
          </p>
          <p className="text-[10px] text-gray-400">{sizeLabel}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            aria-label="Open in new tab"
            title="Open in new tab"
            className="inline-flex size-7 items-center justify-center rounded-md text-orange-700 hover:bg-orange-50 hover:text-orange-900"
          >
            <ExternalLink className="size-3.5" />
          </a>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            aria-label="Download photo"
            title="Download"
            className="inline-flex size-7 items-center justify-center rounded-md text-orange-700 hover:bg-orange-50 hover:text-orange-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {downloading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Download className="size-3.5" />
            )}
          </button>
        </div>
      </div>
    </li>
  )
}

function buildDownloadName(row: ContentSubmissionRow, filename: string): string {
  const slug = `${row.family_name}-${row.village}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
  return slug ? `${slug}-${filename}` : filename
}

async function downloadImageBlob(url: string, filename: string): Promise<void> {
  const res = await fetch(url, { mode: "cors", credentials: "omit" })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const blob = await res.blob()
  const objectUrl = URL.createObjectURL(blob)
  try {
    const a = document.createElement("a")
    a.href = objectUrl
    a.download = filename
    a.rel = "noopener"
    document.body.appendChild(a)
    a.click()
    a.remove()
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
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

