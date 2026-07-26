export type ParkingRuleTone = "prohibited" | "primary" | "conditional"

export interface ParkingRule {
  id: string
  title: string
  tone: ParkingRuleTone
  summary: string
  details: string[]
  mapsUrl?: string
  mapsLabel?: string
}

export interface DropOffStep {
  step: number
  instruction: string
}

export interface ShuttleHotel {
  name: string
  aka?: string
  address: string
  phone: string
  directionsLink: string
}

export interface ScheduleEntry {
  time: string
  description: string
}

export type ScheduleAccent = "shuttle" | "bus"

export interface ScheduleTable {
  id: string
  title: string
  origin: string
  accent: ScheduleAccent
  entries: ScheduleEntry[]
}

export const HARMON_MEADOW_MAPS_URL =
  "https://maps.app.goo.gl/vMvMw7ihRGCqeiwW6"

export const dropOffSteps: DropOffStep[] = [
  {
    step: 1,
    instruction:
      "Enter Swamibapa Way / Penhorn Avenue and drive to the end of the cul-de-sac.",
  },
  {
    step: 2,
    instruction:
      "Make a U-turn, then head back toward the temple and stop at the marked drop-off area.",
  },
  {
    step: 3,
    instruction:
      "Drop off your passengers and exit toward Harmon Meadow to park.",
  },
]

export const mainParkingRule: ParkingRule = {
  id: "main-parking",
  title: "Multi-Level Parking at the Plaza at Harmon Meadow",
  tone: "primary",
  summary:
    "After drop-off, drivers must park at the multi-level parking deck between the NBA and Extended Stay America buildings.",
  details: [
    "Do not park on Level 1.",
    "Look for Rajat Mahotsav signage next to the garage entrance.",
  ],
  mapsUrl: HARMON_MEADOW_MAPS_URL,
  mapsLabel: "Get Directions",
}

export const otherParkingRules: ParkingRule[] = [
  {
    id: "street-parking",
    title: "Street Parking — Swamibapa Way / Penhorn Avenue",
    tone: "conditional",
    summary:
      "Limited street parking on Swamibapa Way / Penhorn Avenue is first-come, first-served, and is reserved for families with young children and senior citizens.",
    details: [],
  },
  {
    id: "evening-parking",
    title: "Evening Parking — After 5:00 PM",
    tone: "conditional",
    summary:
      "After 5:00 PM, you may park in the lots across from the temple. Please keep these lots clean and take your trash with you.",
    details: [],
  },
]

export const templeParkingRule: ParkingRule = {
  id: "no-temple-parking",
  title: "No Parking at the Temple",
  tone: "prohibited",
  summary:
    "Drop off your family at the temple, then park at Harmon Meadow. Absolutely no parking is permitted on the temple premises at any time, and no cars will be allowed on the grounds.",
  details: [
    "Use the designated drop-off area (marked with signage) before parking at the main parking location.",
  ],
}

export const towZoneRule: ParkingRule = {
  id: "tow-zone",
  title: "Restricted Lots — Tow Zone",
  tone: "prohibited",
  summary:
    "Do not park in any other private parking lots on Penhorn Avenue between 9:00 AM – 5:00 PM, Monday – Friday. Cars parked illegally will be towed at the owner's expense.",
  details: [],
}

/** Addresses / directions aligned with Guest Services hotel cards. */
export const shuttleHotels: ShuttleHotel[] = [
  {
    name: "Wyndham Garden North Bergen",
    aka: "Wyndham",
    address: "1706 Paterson Plank Road, North Bergen, New Jersey 07047",
    phone: "(201) 389-4100",
    directionsLink: "https://maps.app.goo.gl/LyRPx9vKaqS2iy1x9",
  },
  {
    name: "Garner by IHG",
    aka: "Old Ramada",
    address: "2750 Tonnelle Ave, North Bergen, NJ 07047",
    phone: "(201) 442-2424",
    directionsLink: "https://maps.app.goo.gl/vCjZHXt5UcwZsxvb8",
  },
  {
    name: "Aloft Secaucus Meadowlands",
    aka: "Aloft",
    address: "460 Harmon Meadow Blvd., Secaucus, NJ 07094",
    phone: "(201) 809-1000",
    directionsLink: "https://maps.app.goo.gl/CVaAykRG1HQRv9hA9",
  },
  {
    name: "Courtyard by Marriott Secaucus Meadowlands",
    aka: "Courtyard Marriott",
    address: "455 Harmon Meadow Blvd., Secaucus, NJ 07094",
    phone: "(201) 617-8888",
    directionsLink: "https://maps.app.goo.gl/CVaAykRG1HQRv9hA9",
  },
]

/**
 * Holiday Inn is listed as a shuttle stop in the official guidelines, but
 * address details are not yet on Guest Services — add when confirmed.
 */
export const shuttleHotelsPending: { name: string }[] = [
  { name: "Holiday Inn" },
]

export const hotelShuttleSchedule: ScheduleTable = {
  id: "hotel-shuttle",
  title: "Hotel Shuttle Schedule",
  origin: "Van service between the designated hotels and the temple only",
  accent: "shuttle",
  entries: [
    {
      time: "5:30 AM",
      description: "First pick-up from hotels for Mangla Aarti.",
    },
    {
      time: "7:30 AM – 9:00 AM",
      description: "Continuous shuttle between hotels and the temple.",
    },
    {
      time: "9:00 AM",
      description: "Final morning pick-up from hotels.",
    },
    {
      time: "1:30 PM – 2:30 PM",
      description: "Afternoon return service to hotels.",
    },
    {
      time: "3:30 PM – 4:30 PM",
      description: "Evening pick-up resumes from the hotels.",
    },
    {
      time: "After night program",
      description:
        "Pick-up from Mandir back to designated hotels (Wyndham, Garner by IHG, Holiday Inn, Aloft, Courtyard Marriott).",
    },
  ],
}

export const parkingBusSchedule: ScheduleTable = {
  id: "parking-bus",
  title: "Parking Garage Bus Schedule",
  origin:
    "Bus service between Multi-Level Parking at the Plaza at Harmon Meadow and the temple only",
  accent: "bus",
  entries: [
    {
      time: "7:30 AM – 9:30 AM",
      description: "Morning service from the parking garage.",
    },
    {
      time: "1:00 PM – 2:30 PM",
      description: "Early afternoon service from the parking garage.",
    },
    {
      time: "4:00 PM – 5:30 PM",
      description: "Late afternoon service from the parking garage.",
    },
    {
      time: "10:30 PM – 11:30 PM",
      description: "Night service from the parking garage.",
    },
  ],
}
