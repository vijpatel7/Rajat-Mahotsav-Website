/**
 * Public schedule for the Rajat Mahotsav, July 27 – August 2, 2026.
 *
 * Derived from the master schedule. Internal logistics (haar counts, volunteer
 * assignments, sponsor confirmations, equipment notes) are deliberately not
 * published here.
 *
 * Times are the planned run of day. They are grouped into sessions so the page
 * can describe the general shape of a day rather than track it minute by
 * minute — programs run late, and a page that claims otherwise is worse than
 * one that stays general.
 */

export type EventCategory =
  | "ceremony"
  | "procession"
  | "cultural"
  | "darshan"
  | "discourse"
  | "community"
  | "prasad"

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  ceremony: "Ceremony",
  procession: "Procession",
  cultural: "Cultural",
  darshan: "Darshan",
  discourse: "Discourse",
  community: "Community",
  prasad: "Prasad",
}

export interface ScheduleEvent {
  /** 24-hour "HH:MM" */
  start: string
  /** 24-hour "HH:MM" */
  end: string
  title: string
  detail?: string
  location?: string
  category: EventCategory
}

export interface ScheduleSession {
  /** What this stretch of the day is called, e.g. "Hindola" */
  name: string
  /** Which part of the day it occupies, e.g. "Afternoon" */
  part: string
  events: ScheduleEvent[]
}

export interface ScheduleDay {
  /** ISO date, used to work out which day is today */
  date: string
  dayName: string
  dayNum: string
  month: string
  /** The day's headline, as guests would name it */
  headline: string
  summary: string
  sessions: ScheduleSession[]
}

export const SCHEDULE: ScheduleDay[] = [
  {
    date: "2026-07-27",
    dayName: "Monday",
    dayNum: "27",
    month: "July",
    headline: "Bapa's Welcome",
    summary: "The Mahotsav opens with a Shobha Yatra and the Parayan Mahapooja.",
    sessions: [
      {
        name: "Bapa's Welcome",
        part: "Morning",
        events: [
          { start: "08:30", end: "09:00", title: "Sponsor Darshan & Photos with Bapa", location: "Mandir", category: "darshan" },
          { start: "09:00", end: "09:30", title: "Shobha Yatra with Pipe Band", location: "From the Main Parking Lot", category: "procession" },
          { start: "09:30", end: "09:40", title: "Chhab Arpan & Cake Arpan", location: "Swamibapa Hall", category: "ceremony" },
          { start: "09:40", end: "09:50", title: "Welcome Dance", category: "cultural" },
          { start: "09:50", end: "10:00", title: "Sponsor Kirtan & Speech", category: "community" },
          { start: "10:00", end: "10:10", title: "Youth Program", category: "cultural" },
          { start: "10:10", end: "10:20", title: "Sant Vani", detail: "On the significance of the Rajat Mahotsav", category: "discourse" },
          { start: "10:20", end: "11:20", title: "Katha & Aashirwad", category: "discourse" },
          { start: "11:20", end: "11:50", title: "Bapa & Santo Swagat Program", category: "ceremony" },
          { start: "11:50", end: "12:00", title: "Announcements", category: "community" },
          { start: "12:00", end: "12:10", title: "Bapa Departs the Sabha Mandap", category: "ceremony" },
          { start: "12:10", end: "13:30", title: "Lunch", category: "prasad" },
        ],
      },
      {
        name: "Parayan Mahapooja",
        part: "Afternoon & Evening",
        events: [
          { start: "16:00", end: "17:00", title: "All Parayan Mahapooja", detail: "Event sponsors, men and women", location: "Swamibapa Hall", category: "ceremony" },
          { start: "17:00", end: "18:00", title: "Parayan Vanchan, Poornahuti & Aarti", category: "ceremony" },
          { start: "18:00", end: "19:00", title: "Parayan Name & Sankalp Vanchan", detail: "Bapa's darshan and photographs alongside", category: "darshan" },
          { start: "19:10", end: "19:40", title: "Sandhya Aarti & Niyam", location: "Mandir", category: "ceremony" },
          { start: "19:30", end: "21:00", title: "Dinner", category: "prasad" },
        ],
      },
    ],
  },
  {
    date: "2026-07-28",
    dayName: "Tuesday",
    dayNum: "28",
    month: "July",
    headline: "Opening Ceremony",
    summary: "Three album launches, the Rajat opening dance, and Shakotsav after dark.",
    sessions: [
      {
        name: "Rajat Mahotsav Opening Ceremony",
        part: "Morning",
        events: [
          { start: "08:30", end: "09:00", title: "Sponsor Darshan & Photos with Bapa", location: "Mandir", category: "darshan" },
          { start: "09:00", end: "09:30", title: "Surprise Welcome Program with Dance", location: "Mandir Main Entrance", category: "cultural" },
          { start: "09:30", end: "09:45", title: "Bapa's Procession to the Tent", detail: "Accompanied by Nasik Dhol", category: "procession" },
          { start: "09:45", end: "09:55", title: "Rajat Opening Dance", detail: "Bapa at the center of the Tent", location: "Tent", category: "cultural" },
          { start: "09:55", end: "10:15", title: "Three Album Launch", detail: "Umang Chhayo Re · Kevi Varshi Krupa · Shree Swaminarayan Gadi Nadvansh Dhoon", category: "ceremony" },
          { start: "10:15", end: "10:25", title: "Sponsor Speech & Mandir History", category: "community" },
          { start: "10:25", end: "10:30", title: "Kids Music Video", detail: "\u201CWe Love You So Much Bapa\u201D, featuring NJ Mandir Balako", category: "cultural" },
          { start: "10:30", end: "10:45", title: "Mandir Smruti Video", category: "cultural" },
          { start: "10:45", end: "11:00", title: "Community & Spiritual Seva Highlights", category: "community" },
          { start: "11:00", end: "11:15", title: "Prem Murti Bapa Smruti Smaran", category: "discourse" },
          { start: "11:15", end: "12:15", title: "Parayan & Event Sponsor Photos with Bapa", category: "darshan" },
          { start: "12:15", end: "12:30", title: "Bapa Returns to the Mandir", category: "ceremony" },
          { start: "12:30", end: "14:00", title: "Lunch", category: "prasad" },
        ],
      },
      {
        name: "Shakotsav",
        part: "Evening",
        events: [
          { start: "17:30", end: "18:00", title: "Sandhya Aarti & Niyam", location: "Mandir", category: "ceremony" },
          { start: "18:00", end: "18:30", title: "Sponsor Photos with Bapa", location: "Mandir", category: "darshan" },
          { start: "18:30", end: "18:45", title: "Bapa Arrives at the Tent", location: "Tent", category: "procession" },
          { start: "18:45", end: "18:55", title: "Sant Vani", category: "discourse" },
          { start: "18:55", end: "19:05", title: "Sponsor Kirtan & Speech", category: "community" },
          { start: "19:05", end: "19:15", title: "Shakotsav Leela & Skit", category: "cultural" },
          { start: "19:15", end: "19:30", title: "Utsav on Stage with Santo", category: "ceremony" },
          { start: "19:30", end: "19:45", title: "Bapa Departs the Tent", category: "ceremony" },
          { start: "20:00", end: "21:30", title: "Dinner", category: "prasad" },
        ],
      },
    ],
  },
  {
    date: "2026-07-29",
    dayName: "Wednesday",
    dayNum: "29",
    month: "July",
    headline: "Gurupoonam",
    summary: "Swamibapa's poojan, Acharya Maharaj's aashirwad, and Bhakti Sandhya.",
    sessions: [
      {
        name: "Gurupoonam",
        part: "Morning",
        events: [
          { start: "08:30", end: "09:00", title: "Sponsor Darshan & Photos with Bapa", location: "Mandir", category: "darshan" },
          { start: "09:00", end: "09:15", title: "Shobha Yatra with Pipe Band & Palkhi", location: "From the Mandir's Center Doors", category: "procession" },
          { start: "09:15", end: "09:45", title: "Sahi Swagat, Chhab Arpan & Cake Arpan", category: "ceremony" },
          { start: "09:45", end: "09:55", title: "Kirtan, Bhale Aavi Gurupoonam Aaj", category: "cultural" },
          { start: "09:55", end: "10:10", title: "Swamibapa's Poojan & Aarti by Bapa", category: "ceremony" },
          { start: "10:10", end: "10:20", title: "Sponsor Allocated Time", category: "community" },
          { start: "10:20", end: "10:25", title: "Swamibapa Video Darshan", category: "cultural" },
          { start: "10:25", end: "10:50", title: "Aarti Utsavni", category: "ceremony" },
          { start: "10:50", end: "11:15", title: "Swamibapa's Aashirwad", category: "discourse" },
          { start: "11:15", end: "12:15", title: "Acharya Shree Jitendriyapriyadasji Swamiji Maharaj, Aashirwad", category: "discourse" },
          { start: "12:15", end: "13:15", title: "Swamibapa Poojan & Aarti for All Haribhakto", detail: "Bapa's darshan alongside", category: "darshan" },
          { start: "13:15", end: "14:30", title: "Lunch", category: "prasad" },
        ],
      },
      {
        name: "Bhakti Sandhya",
        part: "Evening",
        events: [
          { start: "18:00", end: "18:30", title: "Sandhya Aarti", location: "Mandir", category: "ceremony" },
          { start: "18:30", end: "19:30", title: "Dinner", category: "prasad" },
          { start: "19:30", end: "20:00", title: "Sponsor Photos with Bapa", location: "Mandir", category: "darshan" },
          { start: "20:00", end: "20:15", title: "Bapa Arrives at the Tent with Guests", location: "Tent", category: "procession" },
          { start: "20:15", end: "20:35", title: "Guest Honoring & Peace Candle Ceremony", category: "ceremony" },
          { start: "20:35", end: "22:35", title: "Bhakti Sandhya with Professional Artists", category: "cultural" },
        ],
      },
    ],
  },
  {
    date: "2026-07-30",
    dayName: "Thursday",
    dayNum: "30",
    month: "July",
    headline: "Rakshabandhan & Samuh Raas",
    summary: "Katha and Rakshabandhan by day, two hours of Samuh Raas by night.",
    sessions: [
      {
        name: "Parayan Vanchan & Aashirwad",
        part: "Morning",
        events: [
          { start: "08:30", end: "09:00", title: "Sponsor Darshan & Photos with Bapa", location: "Mandir", category: "darshan" },
          { start: "09:00", end: "09:15", title: "Shobha Yatra with Pipe Band", location: "From the Mandir's Center Doors", category: "procession" },
          { start: "09:15", end: "09:30", title: "Chhab Arpan & Sponsor Photos", category: "ceremony" },
          { start: "09:30", end: "09:40", title: "Sponsor Allocated Time", category: "community" },
          { start: "09:40", end: "10:40", title: "Katha & Bapa's Aashirwad", category: "discourse" },
          { start: "10:40", end: "11:40", title: "Rakshabandhan Celebration", detail: "Santo tie Rakhi · Parayan and seva photos with Bapa", category: "ceremony" },
          { start: "12:00", end: "13:30", title: "Lunch", detail: "Early service for women ahead of the Ladies Program", category: "prasad" },
        ],
      },
      {
        name: "Ladies Program",
        part: "Afternoon",
        events: [
          { start: "14:00", end: "17:00", title: "Ladies Program", category: "community" },
        ],
      },
      {
        name: "Samuh Raas",
        part: "Evening",
        events: [
          { start: "18:00", end: "18:30", title: "Sandhya Aarti", location: "Mandir", category: "ceremony" },
          { start: "18:30", end: "19:30", title: "Dinner", category: "prasad" },
          { start: "19:30", end: "20:00", title: "Sponsor Photos with Bapa", location: "Mandir", category: "darshan" },
          { start: "20:00", end: "20:15", title: "Bapa Arrives at the Tent", location: "Tent", category: "procession" },
          { start: "20:15", end: "20:20", title: "Special Speech by Agasthya", detail: "Eight years old, from North Carolina", category: "community" },
          { start: "20:20", end: "22:20", title: "Samuh Raas with Professional Artists", category: "cultural" },
        ],
      },
    ],
  },
  {
    date: "2026-07-31",
    dayName: "Friday",
    dayNum: "31",
    month: "July",
    headline: "Sant Samelan & Hindola",
    summary: "A gathering of Santo, the Hindola Utsav, and an evening of Bhakti Nrutya.",
    sessions: [
      {
        name: "Parayan Vanchan & Aashirwad",
        part: "Morning",
        events: [
          { start: "08:30", end: "09:00", title: "Sponsor Darshan & Photos with Bapa", location: "Mandir", category: "darshan" },
          { start: "09:00", end: "09:15", title: "Shobha Yatra with Pipe Band", location: "From the Mandir's Center Doors", category: "procession" },
          { start: "09:15", end: "09:30", title: "Chhab Arpan & Sponsor Photos", category: "ceremony" },
          { start: "09:30", end: "09:40", title: "Sponsor Allocated Time", detail: "Including the history of their mandir", category: "community" },
          { start: "09:40", end: "10:40", title: "Katha & Aashirwad", category: "discourse" },
          { start: "10:40", end: "10:55", title: "Sant Samelan Procession with Pipe Band", category: "procession" },
          { start: "10:55", end: "12:25", title: "Sant Samelan & Bapa's Aashirwad", category: "discourse" },
          { start: "12:30", end: "14:00", title: "Lunch", category: "prasad" },
        ],
      },
      {
        name: "Hindola",
        part: "Afternoon",
        events: [
          { start: "16:45", end: "17:15", title: "Sponsor Photos with Bapa", location: "Mandir", category: "darshan" },
          { start: "17:15", end: "17:30", title: "Bapa Arrives at the Sabha Mandap", location: "Tent", category: "procession" },
          { start: "17:30", end: "17:40", title: "Sponsor Allocated Time", category: "community" },
          { start: "17:40", end: "18:05", title: "Hindola Utsav", category: "ceremony" },
          { start: "18:05", end: "18:45", title: "Hindola Darshan for All Haribhakto", detail: "Dinner follows", category: "darshan" },
        ],
      },
      {
        name: "Bhakti Nrutya",
        part: "Evening",
        events: [
          { start: "18:00", end: "18:30", title: "Sandhya Aarti", location: "Mandir", category: "ceremony" },
          { start: "18:30", end: "20:00", title: "Dinner", category: "prasad" },
          { start: "19:30", end: "20:00", title: "Sponsor Photos with Bapa", location: "Mandir", category: "darshan" },
          { start: "20:00", end: "20:15", title: "Bapa Arrives at the Tent", location: "Tent", category: "procession" },
          { start: "20:15", end: "20:25", title: "Sponsor Allocated Time", category: "community" },
          { start: "20:25", end: "22:25", title: "Bhakti Nrutya & Dances", category: "cultural" },
        ],
      },
    ],
  },
  {
    date: "2026-08-01",
    dayName: "Saturday",
    dayNum: "1",
    month: "August",
    headline: "Nagaryatra & Abhishek",
    summary: "A three-hour Nagaryatra through town, Abhishek, and a cultural drama.",
    sessions: [
      {
        name: "Nagaryatra",
        part: "Morning",
        events: [
          { start: "08:30", end: "09:00", title: "Sponsor Darshan & Photos with Bapa", location: "Mandir", category: "darshan" },
          { start: "09:00", end: "09:15", title: "Bapa Departs for the Nagaryatra", category: "procession" },
          { start: "09:15", end: "12:30", title: "Nagaryatra", detail: "Three hours outdoors. Bring sunglasses and a cap.", category: "procession" },
          { start: "12:30", end: "14:00", title: "Lunch", category: "prasad" },
        ],
      },
      {
        name: "Abhishek",
        part: "Afternoon",
        events: [
          { start: "16:45", end: "17:15", title: "Sponsor Photos with Bapa", location: "Mandir", category: "darshan" },
          { start: "17:15", end: "17:30", title: "Bapa Arrives at the Sabha Mandap in Baghi", location: "Tent", category: "procession" },
          { start: "17:30", end: "17:40", title: "Sponsor Allocated Time", category: "community" },
          { start: "17:40", end: "18:05", title: "Abhishek Program", category: "ceremony" },
          { start: "18:05", end: "18:45", title: "Abhishek Labh for All Haribhakto", detail: "Dinner follows", category: "darshan" },
        ],
      },
      {
        name: "Sanskrutik Karyakram",
        part: "Evening",
        events: [
          { start: "18:00", end: "18:30", title: "Sandhya Aarti", location: "Mandir", category: "ceremony" },
          { start: "18:30", end: "19:30", title: "Dinner", category: "prasad" },
          { start: "19:30", end: "20:00", title: "Sponsor Photos with Bapa", location: "Mandir", category: "darshan" },
          { start: "20:00", end: "20:15", title: "Bapa Arrives at the Tent", location: "Tent", category: "procession" },
          { start: "20:15", end: "22:15", title: "Sanskrutik Karyakram, Cultural Drama", category: "cultural" },
        ],
      },
    ],
  },
  {
    date: "2026-08-02",
    dayName: "Sunday",
    dayNum: "2",
    month: "August",
    headline: "Patotsav & Closing Ceremony",
    summary: "Patotsav Vidhi, Tula, Bapa's Aashirwad, and the closing of the Mahotsav.",
    sessions: [
      {
        name: "Patotsav",
        part: "All Day",
        events: [
          { start: "08:30", end: "09:30", title: "Patotsav Vidhi by Bapa", location: "Mandir", category: "ceremony" },
          { start: "09:30", end: "10:00", title: "Aarti Utsavni", category: "ceremony" },
          { start: "10:00", end: "11:00", title: "Aarti by All Haribhakto", category: "darshan" },
          { start: "11:00", end: "11:30", title: "Bapa Arrives at the Sabha Mandap", detail: "With Pipe Band", location: "Tent", category: "procession" },
          { start: "11:30", end: "11:40", title: "Sponsor Allocated Time", category: "community" },
          { start: "11:40", end: "12:25", title: "Tula & Aarti", category: "ceremony" },
          { start: "12:25", end: "13:25", title: "Bapa's Aashirwad", category: "discourse" },
          { start: "13:25", end: "14:00", title: "Rajat Mahotsav Closing Ceremony", category: "ceremony" },
          { start: "14:00", end: "15:30", title: "Lunch", category: "prasad" },
        ],
      },
    ],
  },
]

/** "09:05" → "9:05am". Compact on purpose: these sit in a narrow column. */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number)
  const suffix = h >= 12 ? "pm" : "am"
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour}:${String(m).padStart(2, "0")}${suffix}`
}

/** Start and end of a session, e.g. "8:30am – 1:30pm". */
export function sessionRange(session: ScheduleSession): string {
  const events = session.events
  return `${formatTime(events[0].start)} – ${formatTime(events[events.length - 1].end)}`
}

/**
 * Index of today within the festival, or -1 if we are outside it. Computed from
 * the local calendar date so it does not drift with time zones the way
 * Date.now() comparisons against UTC timestamps do.
 */
export function findTodayIndex(now: Date = new Date()): number {
  const local = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`
  return SCHEDULE.findIndex((day) => day.date === local)
}
