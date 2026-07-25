"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

import { ShimmerText } from "@/components/ui/shimmer-text"
import { festivalPosition, type FestivalPosition } from "@/lib/schedule-data"

interface BannerContent {
  label: string
  cta: string
  href: string
  aria: string
}

/**
 * Named after the day rather than whatever is on stage this minute. Programmes
 * run late, and a banner claiming "Hindola Utsav, now" while the katha is still
 * going is worse than one that only ever promises the general shape of the day.
 */
function bannerContent(position: FestivalPosition | null): BannerContent {
  if (position?.phase === "during") {
    return {
      label: `Today · ${position.day.headline}`,
      cta: "Today's Schedule",
      href: "/schedule",
      aria: "View today's schedule",
    }
  }

  if (position?.phase === "after") {
    return {
      label: "Help Tell NJ Mandir's 25 Year History",
      cta: "Share Your Memories",
      href: "/memories",
      aria: "Share your memories",
    }
  }

  // Also the server-rendered state. It is true on every date, so the first
  // paint is never wrong — once mounted it only ever gets more specific.
  return {
    label: "Rajat Mahotsav · July 27 – August 2, 2026",
    cta: "View the Schedule",
    href: "/schedule",
    aria: "View the schedule",
  }
}

export function AnnouncementBanner() {
  const pathname = usePathname()
  const [position, setPosition] = useState<FestivalPosition | null>(null)

  // Resolved after mount. Reading the date during render would bake the build
  // day into any statically prerendered page.
  useEffect(() => {
    setPosition(festivalPosition())
  }, [])

  const content = bannerContent(position)

  // No point advertising the page we are already on.
  if (pathname === content.href) return null

  return (
    <div
      role="region"
      aria-label="Site announcement"
      className="relative z-[60] w-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white shadow-md"
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-1.5 px-3 py-2 text-center sm:flex-row sm:gap-x-4 sm:py-2.5">
        <span className="text-sm font-semibold leading-tight opacity-95 sm:text-base">{content.label}</span>
        <Link
          href={content.href}
          aria-label={content.aria}
          className="group inline-flex shrink-0 items-center justify-center gap-1 rounded-full border border-white/40 bg-gradient-to-b from-white to-[#f1f2f5] px-3 py-0.5 text-orange-600 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 sm:gap-1.5 sm:px-4 sm:py-1.5 sm:shadow-md"
        >
          <ShimmerText
            variant="orange"
            className="block text-center text-[0.7rem] font-extrabold uppercase tracking-wide [--shimmer-contrast:rgba(255,255,255,0.42)] sm:text-sm sm:normal-case"
          >
            {content.cta}
          </ShimmerText>
          <ChevronRight className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" aria-hidden />
        </Link>
      </div>
    </div>
  )
}
