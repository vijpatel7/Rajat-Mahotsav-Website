import Link from "next/link"
import { Sparkles, ChevronRight } from "lucide-react"

export function AnnouncementBanner() {
  return (
    <div
      role="region"
      aria-label="Site announcement"
      className="relative z-[60] w-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 text-white shadow-md"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-sm sm:py-2.5 sm:text-base">
        <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
        <Link
          href="/share-memories"
          className="inline-flex items-center gap-1.5 text-center font-semibold hover:underline"
        >
          <span>Share your NJ Mandir memories</span>
          <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
        </Link>
      </div>
    </div>
  )
}
