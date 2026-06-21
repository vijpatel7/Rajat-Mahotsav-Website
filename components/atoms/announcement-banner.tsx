"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

import { ShimmerText } from "@/components/ui/shimmer-text"

export function AnnouncementBanner() {
  const pathname = usePathname()

  // Already on the memories page — no need to advertise it.
  if (pathname === "/memories") return null

  return (
    <div
      role="region"
      aria-label="Site announcement"
      className="relative z-[60] w-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white shadow-md"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-1.5 px-3 py-2 text-center sm:flex-row sm:gap-x-4 sm:py-2.5">
        <span className="text-sm font-semibold leading-tight opacity-95 sm:text-base">
          Help Tell NJ Mandir&apos;s 25 Year History
        </span>
        <Link
          href="/memories"
          aria-label="Share your memories"
          className="group inline-flex shrink-0 items-center justify-center gap-1 rounded-full border border-white/40 bg-gradient-to-b from-white to-[#f1f2f5] px-3 py-0.5 text-orange-600 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 sm:gap-1.5 sm:px-4 sm:py-1.5 sm:shadow-md"
        >
          <ShimmerText
            variant="orange"
            className="block text-center text-[0.7rem] font-extrabold uppercase tracking-wide [--shimmer-contrast:rgba(255,255,255,0.42)] sm:text-sm sm:normal-case"
          >
            Share Your Memories
          </ShimmerText>
          <ChevronRight className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" aria-hidden />
        </Link>
      </div>
    </div>
  )
}
