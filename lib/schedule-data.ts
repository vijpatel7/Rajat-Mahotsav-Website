export interface ScheduleEvent {
  time: string
  title: string
  description?: string
  location?: string
  /** Programs that run inside this timed block, shown as sub-items */
  items?: string[]
}

export interface ScheduleHighlight {
  session: "Morning" | "Midday" | "Evening"
  title: string
}

export interface ScheduleDay {
  isoDate: string
  date: string
  dayName: string
  month: string
  dayNumber: number
  events: ScheduleEvent[]
  highlights: ScheduleHighlight[]
  isHighlight?: boolean
}

export const SCHEDULE_TIME_ZONE = "America/New_York"
export const TOTAL_EVENT_DAYS = 7
/** Homepage card rolls to the next day's highlights at this Eastern hour (24h). */
export const HERO_SCHEDULE_ROLLOVER_HOUR = 22

export const scheduleData: ScheduleDay[] = [
  {
    isoDate: "2026-07-27",
    date: "27",
    dayName: "Monday",
    month: "July",
    dayNumber: 1,
    isHighlight: true,
    highlights: [
      { session: "Morning", title: "Breakfast, Shobha Yatra, Aashirwad & Welcome Program" },
      { session: "Midday", title: "Lunch" },
      { session: "Evening", title: "All Parayan Mahapooja & Dinner" },
    ],
    events: [
      { time: "7:00 AM", title: "Mangala Aarti" },
      { time: "8:00 AM", title: "Breakfast" },
      {
        time: "9:30 AM – 12:00 PM",
        title: "Welcome Program",
        items: [
          "Shobha Yatra",
          "Chaab & Cake Arpan",
          "Cultural Program",
          "Acharya Swamiji Maharaj’s Aashirwad",
        ],
      },
      { time: "12:00 PM", title: "Lunch" },
      { time: "5:30 PM – 7:30 PM", title: "All Parayan Mahapooja" },
      { time: "8:00 PM", title: "Dinner" },
    ],
  },
  {
    isoDate: "2026-07-28",
    date: "28",
    dayName: "Tuesday",
    month: "July",
    dayNumber: 2,
    isHighlight: true,
    highlights: [
      { session: "Morning", title: "Grand Opening, Ribbon Cutting & Rajat Mahotsav Celebration" },
      { session: "Midday", title: "Lunch" },
      { session: "Evening", title: "Shakotsav & Dinner" },
    ],
    events: [
      { time: "6:30 AM", title: "Mangala Aarti" },
      {
        time: "8:00 AM",
        title: "Breakfast",
        description: "Mix Bhajiya, Cereal, Milk, Juice, Fruits",
      },
      {
        time: "9:00 AM – 12:30 PM",
        title: "Morning Program",
        items: [
          "Parayan Vanchan",
          "Grand Opening & Ribbon Cutting",
          "Rajat Mahotsav Celebration",
          "New Kirtan & Music Video Release",
          "Rajat Mahotsav Seva Initiatives",
          "Parayan Photos",
        ],
      },
      {
        time: "12:30 PM",
        title: "Lunch",
        description: "Mohanthal, Bindi nu Shak, Rajma, Puri, Rice, Kadi, Chaas",
      },
      { time: "5:30 PM", title: "Sandhya Aarti" },
      { time: "6:00 PM – 7:30 PM", title: "Shakotsav" },
      {
        time: "8:00 PM",
        title: "Dinner",
        description:
          "Bajri na Rotla, Khichdi, Gor Ghee, Bhungra, Mutter Paneer, Daal Fry, Jeera Rice, Naan, Mango Lassi",
      },
    ],
  },
  {
    isoDate: "2026-07-29",
    date: "29",
    dayName: "Wednesday",
    month: "July",
    dayNumber: 3,
    isHighlight: true,
    highlights: [
      { session: "Morning", title: "Shobha Yatra, Gurupoonam Poojan & Aashirwad" },
      { session: "Midday", title: "Lunch" },
      { session: "Evening", title: "Bhakti Sandhya & Dinner" },
    ],
    events: [
      { time: "6:30 AM", title: "Mangala Aarti" },
      {
        time: "8:00 AM",
        title: "Breakfast",
        description: "Ganthiya, Papadi, Marcha, Kadhi, Cereal, Milk, Juice, Fruits",
      },
      {
        time: "9:00 AM – 1:00 PM",
        title: "Gurupoonam Program",
        items: [
          "Shobha Yatra & Shahi Swagat",
          "Chaab & Cake Arpan",
          "Gurupoonam Poojan & Celebrations",
          "Jeevanpran Swamibapa’s Aashirwad",
          "Acharya Swamiji Maharaj’s Aashirwad",
        ],
      },
      {
        time: "1:00 PM",
        title: "Lunch",
        description:
          "Motaiya Ladoo, Khaman, Desi Chana, Giloda Batata, Rotli, Daal, Bhaat, Chaas, Udad Papad, Mava Vari Anjir ni Barfi",
      },
      { time: "5:30 PM", title: "Sandhya Aarti" },
      {
        time: "6:30 PM",
        title: "Dinner",
        description:
          "Pav Bhaji, Gulab Jamun, Masala Pulav, Chaas, Udad Papad, Khichdi, French Fries, Tomato/Cabbage/Lemon, Dahi/Chutney",
      },
      { time: "8:00 PM – 10:30 PM", title: "Bhakti Sandhya" },
    ],
  },
  {
    isoDate: "2026-07-30",
    date: "30",
    dayName: "Thursday",
    month: "July",
    dayNumber: 4,
    isHighlight: true,
    highlights: [
      { session: "Morning", title: "Morning Program" },
      { session: "Midday", title: "Ladies Program" },
      { session: "Evening", title: "Samuh Raas" },
    ],
    events: [
      { time: "Morning", title: "Morning Program" },
      { time: "Afternoon", title: "Lunch" },
      { time: "Afternoon", title: "Ladies Program" },
      { time: "Evening", title: "Dinner" },
      { time: "Evening", title: "Samuh Raas" },
    ],
  },
  {
    isoDate: "2026-07-31",
    date: "31",
    dayName: "Friday",
    month: "July",
    dayNumber: 5,
    isHighlight: true,
    highlights: [
      { session: "Morning", title: "Morning Program" },
      { session: "Midday", title: "Hindola Program" },
      { session: "Evening", title: "Bhakti Nrutya" },
    ],
    events: [
      { time: "Morning", title: "Morning Program" },
      { time: "Afternoon", title: "Lunch" },
      { time: "Afternoon", title: "Hindola Program" },
      { time: "Evening", title: "Dinner" },
      { time: "Evening", title: "Bhakti Nrutya" },
    ],
  },
  {
    isoDate: "2026-08-01",
    date: "1",
    dayName: "Saturday",
    month: "August",
    dayNumber: 6,
    isHighlight: true,
    highlights: [
      { session: "Morning", title: "Nagaryatra" },
      { session: "Midday", title: "Abhishek Program" },
      { session: "Evening", title: "Sanskrutik Drama" },
    ],
    events: [
      { time: "Morning", title: "Nagaryatra" },
      { time: "Afternoon", title: "Lunch" },
      { time: "Afternoon", title: "Abhishek Program" },
      { time: "Evening", title: "Dinner" },
      { time: "Evening", title: "Sanskrutik Drama" },
    ],
  },
  {
    isoDate: "2026-08-02",
    date: "2",
    dayName: "Sunday",
    month: "August",
    dayNumber: 7,
    isHighlight: true,
    highlights: [
      { session: "Morning", title: "Patotsav Celebrations" },
      { session: "Midday", title: "Lunch" },
    ],
    events: [
      { time: "Morning", title: "Patotsav Celebrations" },
      { time: "Afternoon", title: "Lunch" },
    ],
  },
]

const MEAL_TITLES = new Set(["lunch", "dinner", "breakfast"])

export function getEventCountExcludingMeals(events: ScheduleEvent[]): number {
  return events.reduce((count, event) => {
    if (MEAL_TITLES.has(event.title.trim().toLowerCase())) return count
    return count + 1 + (event.items?.length ?? 0)
  }, 0)
}

const TIME_RANGE_SEPARATOR = /\s*[–—-]\s*/

/**
 * Splits "9:30 AM – 12:00 PM" into ["9:30 AM –", "12:00 PM"] so narrow
 * screens can stack a time range instead of stretching the badge.
 */
export function splitTimeRange(time: string): string[] {
  const parts = time.split(TIME_RANGE_SEPARATOR)
  if (parts.length < 2) return [time]
  return [`${parts[0]} –`, parts.slice(1).join(" – ")]
}

export function toOrdinal(n: number): string {
  const remainder = n % 100
  if (remainder >= 11 && remainder <= 13) return `${n}th`
  switch (n % 10) {
    case 1:
      return `${n}st`
    case 2:
      return `${n}nd`
    case 3:
      return `${n}rd`
    default:
      return `${n}th`
  }
}

export function getEasternDateIso(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SCHEDULE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now)
}

function getEasternHour(now: Date = new Date()): number {
  const hourPart = new Intl.DateTimeFormat("en-US", {
    timeZone: SCHEDULE_TIME_ZONE,
    hour: "2-digit",
    hourCycle: "h23",
  })
    .formatToParts(now)
    .find((part) => part.type === "hour")?.value

  return Number(hourPart ?? "0")
}

function addOneCalendarDay(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number)
  const next = new Date(Date.UTC(year, month - 1, day))
  next.setUTCDate(next.getUTCDate() + 1)
  return next.toISOString().slice(0, 10)
}

/**
 * Calendar date used for the homepage schedule card. From 10:00 PM Eastern
 * onward, the card advances to the next day's highlights.
 */
export function getHeroScheduleDisplayDateIso(now: Date = new Date()): string {
  const todayIso = getEasternDateIso(now)
  if (getEasternHour(now) < HERO_SCHEDULE_ROLLOVER_HOUR) {
    return todayIso
  }
  return addOneCalendarDay(todayIso)
}

export type HeroScheduleState =
  | { kind: "pre-event"; day: ScheduleDay }
  | { kind: "event-day"; day: ScheduleDay }
  | { kind: "post-event"; day: ScheduleDay }

export function getHeroScheduleState(now: Date = new Date()): HeroScheduleState {
  const displayIso = getHeroScheduleDisplayDateIso(now)
  const firstDay = scheduleData[0]
  const lastDay = scheduleData[scheduleData.length - 1]

  if (displayIso < firstDay.isoDate) {
    return { kind: "pre-event", day: firstDay }
  }

  if (displayIso > lastDay.isoDate) {
    return { kind: "post-event", day: lastDay }
  }

  const day = scheduleData.find((entry) => entry.isoDate === displayIso) ?? firstDay
  return { kind: "event-day", day }
}

export function formatHighlightsHeading(day: ScheduleDay): string {
  return `${day.dayName}, ${day.month} ${toOrdinal(Number(day.date))} Highlights`
}

/** Index of the day the schedule page should open for the current Eastern time. */
export function getActiveScheduleDayIndex(now: Date = new Date()): number {
  const { day } = getHeroScheduleState(now)
  const index = scheduleData.findIndex((entry) => entry.isoDate === day.isoDate)
  return index >= 0 ? index : 0
}

/** Homepage “Full Schedule” link — deep-links to the active day. */
export function getSchedulePageHref(now: Date = new Date()): string {
  const { day } = getHeroScheduleState(now)
  return `/schedule?date=${day.isoDate}`
}
