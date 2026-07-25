"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronRight } from "lucide-react"
import { StandardPageHeader } from "@/components/organisms/standard-page-header"
import { cn } from "@/lib/utils"
import {
  CATEGORY_LABELS,
  SCHEDULE,
  findTodayIndex,
  formatTime,
  sessionRange,
  type ScheduleDay,
  type ScheduleEvent,
  type ScheduleSession,
} from "@/lib/schedule-data"

/**
 * One entry, shared by the desktop columns and the phone accordion. Time and
 * place sit together on the lead line so the "when and where" reads as one
 * unit; the category label only appears from lg up, where a column is wide
 * enough to carry it without crowding that line.
 */
function EventItem({ event }: { event: ScheduleEvent }) {
  return (
    <li className="py-1.5 transition-colors lg:px-5 lg:py-3 lg:hover:bg-orange-50/60">
      <div className="flex items-baseline justify-between gap-3">
        <span className="min-w-0 text-xs font-semibold tabular-nums text-gray-500">
          {formatTime(event.start)} <span className="text-gray-300">–</span> {formatTime(event.end)}
          {event.location && <span className="font-normal text-gray-400"> · {event.location}</span>}
        </span>
        <span className="hidden flex-shrink-0 whitespace-nowrap rounded-full border border-orange-100 bg-orange-50 px-2 py-0.5 text-[11px] font-semibold text-orange-700 lg:inline-block">
          {CATEGORY_LABELS[event.category]}
        </span>
      </div>
      <p className="mt-0.5 text-[15px] font-semibold leading-snug text-gray-900">{event.title}</p>
      {event.detail && <p className="mt-0.5 text-xs leading-snug text-gray-600">{event.detail}</p>}
    </li>
  )
}

/**
 * Several days are named after their main session, so printing both reads as a
 * stutter. When they match, the part of day carries the heading instead.
 */
function sessionHeading(session: ScheduleSession, dayHeadline: string) {
  const duplicate = session.name === dayHeadline
  return {
    title: duplicate ? session.part : session.name,
    splitMeta: !duplicate,
  }
}

/* ---------------------------------------------------------------- desktop */

/**
 * Sessions stand side by side, so a day is read across rather than scrolled
 * through. Columns size to their contents and the whole group is centred, which
 * is why a two-session day sits in the middle of the page instead of leaving a
 * third of it empty.
 */
const SESSION_LAYOUT: Record<number, { width: string; cols: string }> = {
  1: { width: "max-w-2xl", cols: "grid-cols-1" },
  2: { width: "max-w-5xl", cols: "grid-cols-2" },
  3: { width: "max-w-7xl", cols: "grid-cols-3" },
}

function SessionColumn({ session, dayHeadline }: { session: ScheduleSession; dayHeadline: string }) {
  const heading = sessionHeading(session, dayHeadline)
  return (
    <section className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-lg shadow-orange-900/5">
      <header className="border-b border-orange-100 bg-orange-50/50 px-5 py-4">
        <h3 className="font-instrument-serif text-xl leading-tight text-gray-900">{heading.title}</h3>
        <p className="mt-0.5 text-xs">
          {heading.splitMeta && <span className="font-semibold text-orange-600">{session.part} · </span>}
          <span className="text-gray-500">{sessionRange(session)}</span>
        </p>
      </header>
      <ul className="divide-y divide-orange-100">
        {session.events.map((event) => (
          <EventItem key={`${event.start}-${event.title}`} event={event} />
        ))}
      </ul>
    </section>
  )
}

function DayPanel({ day }: { day: ScheduleDay }) {
  const layout = SESSION_LAYOUT[Math.min(day.sessions.length, 3)]
  return (
    <>
      <div
        className={cn(
          "mx-auto mb-5 rounded-3xl border border-orange-100 bg-white px-6 py-6 shadow-lg shadow-orange-900/5 lg:px-8",
          layout.width
        )}
      >
        <h2 className="font-instrument-serif bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-3xl leading-tight text-transparent lg:text-4xl">
          {day.headline}
        </h2>
        <p className="mt-2 text-base text-gray-500">
          {day.dayName}, {day.month} {day.dayNum}, 2026
        </p>
        <p className="mt-3 text-base leading-relaxed text-gray-600">{day.summary}</p>
      </div>
      <div className={cn("mx-auto grid items-start gap-5", layout.width, layout.cols)}>
        {day.sessions.map((session) => (
          <SessionColumn key={session.name + session.part} session={session} dayHeadline={day.headline} />
        ))}
      </div>
    </>
  )
}

/* ----------------------------------------------------------------- mobile */

function MobileSession({ session, dayHeadline }: { session: ScheduleSession; dayHeadline: string }) {
  const heading = sessionHeading(session, dayHeadline)
  return (
    <div className="pt-3.5 first:pt-1">
      <h3 className="font-instrument-serif text-lg leading-tight text-gray-900">{heading.title}</h3>
      <p className="text-xs">
        {heading.splitMeta && <span className="font-semibold text-orange-600">{session.part} · </span>}
        <span className="text-gray-400">{sessionRange(session)}</span>
      </p>
      <ul className="mt-1.5 divide-y divide-orange-100 border-t border-orange-100">
        {session.events.map((event) => (
          <EventItem key={`${event.start}-${event.title}`} event={event} />
        ))}
      </ul>
    </div>
  )
}

/* ------------------------------------------------------------------- page */

export default function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState(0)
  const [openDay, setOpenDay] = useState<number | null>(0)
  const [todayIndex, setTodayIndex] = useState(-1)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Resolved after mount so the server and client agree on markup: the server
  // has no way to know the visitor's local date.
  useEffect(() => {
    const index = findTodayIndex()
    if (index >= 0) {
      setTodayIndex(index)
      setSelectedDay(index)
      setOpenDay(index)
    }
  }, [])

  const selectDay = (index: number, moveFocus = false) => {
    setSelectedDay(index)
    if (moveFocus) tabRefs.current[index]?.focus()
  }

  const onTabKeyDown = (event: React.KeyboardEvent) => {
    const last = SCHEDULE.length - 1
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault()
      const delta = event.key === "ArrowRight" ? 1 : -1
      selectDay((selectedDay + delta + SCHEDULE.length) % SCHEDULE.length, true)
    } else if (event.key === "Home") {
      event.preventDefault()
      selectDay(0, true)
    } else if (event.key === "End") {
      event.preventDefault()
      selectDay(last, true)
    }
  }

  return (
    <div className="page-bg-extend min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pb-20">
      <div className="page-bottom-spacing container mx-auto px-4">
        <StandardPageHeader
          title="Calendar of Events"
          subtitle="July 27 – August 2, 2026"
          description="Come celebrate 25 years of community, faith, and fellowship! Join us for this special milestone event designed for all ages."
        />

        {/* Desktop: day selector above a details panel. */}
        <div className="mx-auto hidden max-w-7xl lg:block">
          <div
            role="tablist"
            aria-label="Choose a day"
            onKeyDown={onTabKeyDown}
            className="mb-5 grid grid-cols-7 gap-2.5 lg:gap-3"
          >
            {SCHEDULE.map((day, index) => {
              const isSelected = selectedDay === index
              return (
                <button
                  key={day.date}
                  ref={(node) => {
                    tabRefs.current[index] = node
                  }}
                  role="tab"
                  id={`day-tab-${index}`}
                  aria-selected={isSelected}
                  aria-controls="day-panel"
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => selectDay(index)}
                  className={cn(
                    "relative flex min-h-[116px] flex-col items-center justify-center gap-1 rounded-2xl border px-2.5 py-4 text-center transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2",
                    isSelected
                      ? "border-transparent bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg shadow-orange-900/20"
                      : "border-orange-100 bg-white text-gray-800 hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50/70"
                  )}
                >
                  {todayIndex === index && (
                    <span
                      className={cn(
                        "absolute right-2.5 top-2.5 text-[11px] font-bold",
                        isSelected ? "text-white/90" : "text-red-600"
                      )}
                    >
                      Today
                    </span>
                  )}
                  <span className="font-instrument-serif text-4xl leading-none lg:text-5xl">{day.dayNum}</span>
                  <span className={cn("text-sm font-semibold", isSelected ? "text-white/90" : "text-gray-500")}>
                    {day.dayName.slice(0, 3)}
                  </span>
                  <span
                    className={cn(
                      "mt-0.5 line-clamp-2 text-xs leading-snug",
                      isSelected ? "text-white/85" : "text-gray-500"
                    )}
                  >
                    {day.headline}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Kept mounted across day changes: swapping the contents of a live
              element avoids the blank flash and the scroll jump you get from
              unmounting and rebuilding the panel on every click. */}
          <div id="day-panel" role="tabpanel" aria-labelledby={`day-tab-${selectedDay}`}>
            <DayPanel day={SCHEDULE[selectedDay]} />
          </div>
        </div>

        {/* Phone and tablet: the accordion pattern from the current page, tightened up. */}
        <div className="mx-auto max-w-2xl space-y-2.5 lg:hidden">
          {SCHEDULE.map((day, index) => {
            const isOpen = openDay === index
            return (
              <div
                key={day.date}
                className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm"
              >
                <button
                  onClick={() => setOpenDay(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  aria-controls={`day-body-${index}`}
                  className="flex w-full items-center gap-3.5 px-3.5 py-3 text-left"
                >
                  <span
                    className={cn(
                      "flex h-12 w-12 flex-shrink-0 flex-col items-center justify-center rounded-xl",
                      isOpen
                        ? "bg-gradient-to-br from-orange-500 to-red-600 text-white"
                        : "bg-orange-50 text-orange-600"
                    )}
                  >
                    <span className="font-instrument-serif text-xl leading-none">{day.dayNum}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
                      {day.month.slice(0, 3)}
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-gray-900">
                      {day.dayName}
                      {todayIndex === index && (
                        <span className="ml-2 text-[11px] font-bold text-red-600">Today</span>
                      )}
                    </span>
                    <span className="block truncate text-[13px] text-gray-500">{day.headline}</span>
                  </span>
                  <ChevronRight
                    className={cn(
                      "h-5 w-5 flex-shrink-0 text-orange-400 transition-transform duration-200",
                      isOpen && "rotate-90"
                    )}
                  />
                </button>
                {isOpen && (
                  <div id={`day-body-${index}`} className="border-t border-orange-100 px-3.5 pb-4">
                    {day.sessions.map((session) => (
                      <MobileSession
                        key={session.name + session.part}
                        session={session}
                        dayHeadline={day.headline}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          Timings may shift slightly on the day. Please follow announcements at the mandir.
        </p>
      </div>
    </div>
  )
}
