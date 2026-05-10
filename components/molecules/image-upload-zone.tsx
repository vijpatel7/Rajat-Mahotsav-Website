"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ImagePlus, UploadCloud, X } from "lucide-react"
import { formatBytes } from "@/lib/utils"

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/heic", "image/heif"]
const ACCEPT_ATTR = ".jpg,.jpeg,.png,.heic,.heif,image/jpeg,image/png,image/heic,image/heif"
const MAX_FILE_BYTES = 5 * 1024 * 1024
const MAX_FILES = 3

type ImageUploadZoneProps = {
  value: File[]
  onChange: (files: File[]) => void
  maxFiles?: number
  id?: string
}

type Preview = { file: File; url: string }

function validateFile(file: File): string | null {
  const isAcceptedType =
    ACCEPTED_TYPES.includes(file.type.toLowerCase()) ||
    /\.(jpe?g|png|heic|heif)$/i.test(file.name)
  if (!isAcceptedType) return `${file.name}: only JPG, PNG, or HEIC files are allowed.`
  if (file.size > MAX_FILE_BYTES) return `${file.name}: file is larger than 5MB.`
  return null
}

export default function ImageUploadZone({
  value,
  onChange,
  maxFiles = MAX_FILES,
  id,
}: ImageUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    (incoming: FileList | File[]) => {
      setError(null)
      const list = Array.from(incoming)
      if (list.length === 0) return

      const accepted: File[] = []
      const errors: string[] = []
      for (const file of list) {
        const err = validateFile(file)
        if (err) {
          errors.push(err)
          continue
        }
        accepted.push(file)
      }

      const slots = Math.max(0, maxFiles - value.length)
      if (accepted.length > slots) {
        errors.push(`You can only add ${slots} more photo${slots === 1 ? "" : "s"}.`)
      }
      const next = [...value, ...accepted.slice(0, slots)]
      onChange(next)
      if (errors.length > 0) setError(errors[0])
    },
    [maxFiles, onChange, value]
  )

  const removeAt = (index: number) => {
    setError(null)
    const next = value.filter((_, i) => i !== index)
    onChange(next)
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    addFiles(e.target.files)
    // reset so the same file can be re-selected after removal
    e.target.value = ""
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (reachedMax) return
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files)
    }
  }

  return (
    <div className="space-y-3">
      <div
        onDragEnter={(e) => {
          e.preventDefault()
          if (!reachedMax) setIsDragging(true)
        }}
        onDragOver={(e) => {
          e.preventDefault()
          if (!reachedMax) setIsDragging(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          if (e.currentTarget.contains(e.relatedTarget as Node)) return
          setIsDragging(false)
        }}
        onDrop={onDrop}
        onClick={() => {
          if (!reachedMax) inputRef.current?.click()
        }}
        role="button"
        tabIndex={reachedMax ? -1 : 0}
        aria-disabled={reachedMax}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !reachedMax) {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        className={[
          "relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-all duration-200",
          "bg-white/60 backdrop-blur-sm",
          reachedMax
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
          accept={ACCEPT_ATTR}
          multiple
          className="sr-only"
          onChange={onInputChange}
          disabled={reachedMax}
        />
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-red-100 text-orange-600 shadow-sm">
          {isDragging ? <UploadCloud className="h-6 w-6" /> : <ImagePlus className="h-6 w-6" />}
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-800 sm:text-base">
            {reachedMax
              ? "Maximum of 3 photos added"
              : isDragging
                ? "Drop your photos here"
                : "Tap to add photos, or drag and drop"}
          </p>
          <p className="text-xs text-gray-500 sm:text-sm">
            JPG, PNG, or HEIC, up to 5MB each, {maxFiles} photos max
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
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
                <div className="aspect-[4/3] w-full overflow-hidden bg-orange-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.url}
                    alt={p.file.name}
                    className="h-full w-full object-cover"
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
