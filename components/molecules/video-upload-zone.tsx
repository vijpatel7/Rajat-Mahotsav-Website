"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Film, Loader2, UploadCloud, X } from "lucide-react"
import { formatBytes } from "@/lib/utils"
import {
  MAX_VIDEOS,
  MAX_VIDEO_BYTES,
  MAX_VIDEO_DURATION_SECONDS,
  VIDEO_ACCEPT_ATTR,
  VIDEO_ALLOWED_TYPES,
  formatDuration,
} from "@/lib/memories-upload-config"
import { readVideoDurationSeconds } from "@/lib/memories-upload-client"

type VideoUploadZoneProps = {
  value: File[]
  onChange: (files: File[]) => void
  maxFiles?: number
  id?: string
}

type Preview = { file: File; url: string }

function isAcceptedType(file: File): boolean {
  return (
    (VIDEO_ALLOWED_TYPES as readonly string[]).includes(
      file.type.toLowerCase()
    ) || /\.(mp4|mov)$/i.test(file.name)
  )
}

export default function VideoUploadZone({
  value,
  onChange,
  maxFiles = MAX_VIDEOS,
  id,
}: VideoUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)

  const previews = useMemo<Preview[]>(
    () => value.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [value]
  )

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url))
    }
  }, [previews])

  const remainingSlots = Math.max(0, maxFiles - value.length)
  const reachedMax = remainingSlots === 0

  const addFiles = useCallback(
    async (incoming: FileList | File[]) => {
      setError(null)
      const list = Array.from(incoming)
      if (list.length === 0) return

      const slots = Math.max(0, maxFiles - value.length)
      if (slots === 0) {
        setError(
          `You can add up to ${maxFiles} video${maxFiles === 1 ? "" : "s"}.`
        )
        return
      }

      // Only consider as many as we have room for.
      const candidates = list.slice(0, slots)
      const accepted: File[] = []
      setChecking(true)
      try {
        for (const file of candidates) {
          if (!isAcceptedType(file)) {
            setError(`${file.name}: only MP4 or MOV videos are allowed.`)
            continue
          }
          if (file.size > MAX_VIDEO_BYTES) {
            setError(
              `${file.name}: video is larger than ${formatBytes(
                MAX_VIDEO_BYTES
              )}.`
            )
            continue
          }
          const duration = await readVideoDurationSeconds(file)
          if (!duration) {
            setError(
              `${file.name}: this video's length couldn't be read in the browser.`
            )
            continue
          }
          if (duration > MAX_VIDEO_DURATION_SECONDS) {
            setError(
              `${file.name}: video is ${formatDuration(
                duration
              )} long. Please keep it under ${MAX_VIDEO_DURATION_SECONDS} seconds.`
            )
            continue
          }
          accepted.push(file)
        }
      } finally {
        setChecking(false)
      }

      if (accepted.length > 0) {
        onChange([...value, ...accepted].slice(0, maxFiles))
      }
    },
    [maxFiles, onChange, value]
  )

  const removeAt = (index: number) => {
    setError(null)
    onChange(value.filter((_, i) => i !== index))
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    void addFiles(e.target.files)
    // reset so the same file can be re-selected after removal
    e.target.value = ""
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (reachedMax || checking) return
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      void addFiles(e.dataTransfer.files)
    }
  }

  const disabled = reachedMax || checking

  return (
    <div className="space-y-3">
      <div
        onDragEnter={(e) => {
          e.preventDefault()
          if (!disabled) setIsDragging(true)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setIsDragging(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          if (e.currentTarget.contains(e.relatedTarget as Node)) return
          setIsDragging(false)
        }}
        onDrop={onDrop}
        onClick={() => {
          if (!disabled) inputRef.current?.click()
        }}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        className={[
          "relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-all duration-200",
          "bg-white/60 backdrop-blur-sm",
          disabled
            ? "cursor-not-allowed border-orange-200/70 opacity-60"
            : "cursor-pointer hover:border-orange-300 hover:bg-orange-50/40",
          isDragging
            ? "border-orange-400 bg-orange-50/70 ring-4 ring-orange-200/60"
            : "border-orange-200",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={VIDEO_ACCEPT_ATTR}
          className="sr-only"
          onChange={onInputChange}
          disabled={disabled}
        />
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-red-100 text-orange-600 shadow-sm">
          {checking ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : isDragging ? (
            <UploadCloud className="h-6 w-6" />
          ) : (
            <Film className="h-6 w-6" />
          )}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-800 sm:text-base">
            {checking
              ? "Checking your video…"
              : reachedMax
                ? `Maximum of ${maxFiles} video${maxFiles === 1 ? "" : "s"} added`
                : isDragging
                  ? "Drop your video here"
                  : "Tap to add a video, or drag and drop"}
          </p>
          <p className="text-xs text-gray-500 sm:text-sm">
            MP4 or MOV, up to {MAX_VIDEO_DURATION_SECONDS}s and{" "}
            {formatBytes(MAX_VIDEO_BYTES)}
            {maxFiles > 1 ? `, ${maxFiles} videos max` : ""}
          </p>
        </div>
        <p className="mt-1 text-xs font-medium text-orange-700">
          {value.length} of {maxFiles} added
        </p>
      </div>

      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="reg-error-text"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {previews.length > 0 && (
        <ul className="grid grid-cols-1 gap-3">
          <AnimatePresence initial={false}>
            {previews.map((p, index) => (
              <motion.li
                key={`${p.file.name}-${p.file.size}-${index}`}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="group relative overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-sm"
              >
                <div className="aspect-video w-full overflow-hidden bg-black">
                  {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                  <video
                    src={p.url}
                    controls
                    playsInline
                    preload="metadata"
                    className="h-full w-full bg-black object-contain"
                  />
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeAt(index)
                  }}
                  aria-label={`Remove ${p.file.name}`}
                  className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-90 backdrop-blur-sm transition-all hover:bg-black/80 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-orange-300"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="flex items-center justify-between gap-2 px-3 py-2 text-xs text-gray-600">
                  <span className="truncate" title={p.file.name}>
                    {p.file.name}
                  </span>
                  <span className="shrink-0 font-medium text-gray-500">
                    {formatBytes(p.file.size)}
                  </span>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  )
}
