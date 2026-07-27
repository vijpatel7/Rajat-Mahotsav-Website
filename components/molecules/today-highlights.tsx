"use client"

import Link from "next/link"
import {
  formatHighlightsHeading,
  getHeroScheduleState,
  TOTAL_EVENT_DAYS,
  type ScheduleDay,
  type ScheduleHighlight,
} from "@/lib/schedule-data"

interface TodayHighlightsProps {
  className?: string
  /** Denser spacing/type for the mobile hero card */
  compact?: boolean
}

const COMPACT_ROW_STYLE = {
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.07)",
}

const ROW_STYLE = {
  background: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(255, 255, 255, 0.04)",
}

function HighlightsList({
  highlights,
  compact = false,
}: {
  highlights: ScheduleHighlight[]
  compact?: boolean
}) {
  return (
    <div className={`flex flex-col ${compact ? "gap-2" : "gap-1.5 sm:gap-2"}`}>
      {highlights.map((item) => (
        <div
          key={`${item.session}-${item.title}`}
          className={`grid items-start rounded-xl ${
            compact
              ? "grid-cols-[3.5rem_1fr] gap-2.5 px-3 py-2.5"
              : "grid-cols-[4.5rem_1fr] sm:grid-cols-[5rem_1fr] gap-2 sm:gap-2.5 px-2 py-1.5 sm:px-2.5 sm:py-2"
          }`}
          style={compact ? COMPACT_ROW_STYLE : ROW_STYLE}
        >
          <span
            className={`font-extrabold uppercase tracking-[0.12em] ${
              compact ? "pt-[0.3rem] text-[0.62rem]" : "pt-[0.15rem] text-[0.62rem] sm:text-[0.65rem]"
            }`}
            style={{ color: "#D4AF37" }}
          >
            {item.session}
          </span>
          <span
            className={`font-semibold text-white/95 ${
              compact
                ? "text-[0.875rem] leading-[1.45] text-pretty"
                : "text-[0.88rem] sm:text-[0.92rem] leading-snug"
            }`}
          >
            {item.title}
          </span>
        </div>
      ))}
    </div>
  )
}

export function DayOfEventTag({
  day,
  className = "",
}: {
  day?: ScheduleDay
  className?: string
}) {
  const resolvedDay = day ?? getHeroScheduleState().day

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 sm:px-2.5 sm:py-1 text-[0.65rem] sm:text-[0.68rem] font-extrabold uppercase tracking-[0.14em] ${className}`}
      style={{
        color: "#FFB832",
        background: "rgba(255, 180, 50, 0.12)",
        border: "1px solid rgba(255, 180, 50, 0.35)",
      }}
    >
      Day {resolvedDay.dayNumber} of {TOTAL_EVENT_DAYS}
    </span>
  )
}

export default function TodayHighlights({
  className = "",
  compact = false,
}: TodayHighlightsProps) {
  const state = getHeroScheduleState()
  const { day } = state

  if (state.kind === "post-event") {
    return (
      <div className={className}>
        <h2
          className={`font-instrument-serif leading-tight mb-2 text-white ${
            compact ? "text-lg" : "text-xl sm:text-2xl"
          }`}
        >
          Thank you for celebrating with us
        </h2>
        <p
          className={`text-white/75 mb-3 leading-relaxed ${
            compact ? "text-sm" : "text-sm sm:text-base"
          }`}
        >
          The Rajat Pratishtha Mahotsav has concluded. Relive the moments in Memories.
        </p>
        <Link
          href="/memories"
          className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide"
          style={{ color: "#FFB832" }}
        >
          Share Memories →
        </Link>
      </div>
    )
  }

  return (
    <div className={className}>
      <h2
        className={`font-instrument-serif leading-tight text-white ${
          compact ? "text-lg mb-2.5" : "text-xl sm:text-2xl mb-2.5"
        }`}
      >
        {formatHighlightsHeading(day)}
      </h2>
      <HighlightsList highlights={day.highlights} compact={compact} />
    </div>
  )
}
