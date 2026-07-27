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
      "Drop off your passengers and exit toward the multi-level parking deck at Harmon Meadow.",
  },
]

export const mainParkingRule: ParkingRule = {
  id: "main-parking",
  title: "Multi-Level Parking Deck at the Plaza at Harmon Meadow",
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
      "Between 9:00 AM and 5:00 PM, street parking is available on a first-come, first-serve basis for families with young children and/or senior citizens. Parking directly across from the mandir is not allowed.",
    details: [
      "Do not park on both sides of the street.",
      "Do not park where NO PARKING signs are posted.",
      "If available, park on the left-hand side (mandir side) of the street past 300 Penhorn Ave.",
    ],
  },
  {
    id: "evening-parking",
    title: "Evening Parking — After 5:00 PM",
    tone: "conditional",
    summary:
      "After 5:00 PM, parking is permitted in any building lot across the Temple. Please maintain the cleanliness of these lots and do not leave any trash behind.",
    details: [],
  },
]

export const templeParkingRule: ParkingRule = {
  id: "no-temple-parking",
  title: "No Parking at the Temple",
  tone: "prohibited",
  summary:
    "Drop off your family at the temple, then park at the multi-level parking deck at Harmon Meadow. Absolutely no parking is permitted on the temple premises at any time, and no cars will be allowed on the grounds.",
  details: [
    "Use the designated drop-off area (marked with signage) before parking at the multi-level parking deck.",
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
  origin:
    "Van shuttles operate between the temple and the designated hotel locations only, for hotel guests only",
  accent: "shuttle",
  entries: [
    {
      time: "5:30 AM",
      description:
        "First pick-up for Mangla Aarti (for both hotel guests and drivers at the parking lot).",
    },
    {
      time: "7:30 AM – 9:00 AM",
      description: "Continuous shuttle service.",
    },
    {
      time: "9:00 AM",
      description: "Final morning pick-up.",
    },
    {
      time: "1:30 PM – 2:30 PM",
      description: "Afternoon return service to hotels and the parking lot.",
    },
    {
      time: "3:30 PM – 4:30 PM",
      description: "Evening pick-up service resumes from the hotels.",
    },
    {
      time: "After night program",
      description: "Pick-up from Mandir to designated hotels.",
    },
  ],
}

export const parkingBusSchedule: ScheduleTable = {
  id: "parking-bus",
  title: "Parking Deck Bus Schedule",
  origin:
    "Bus service between the temple and the multi-level parking deck at the Plaza at Harmon Meadow",
  accent: "bus",
  entries: [
    {
      time: "7:30 AM – 9:30 AM",
      description: "Morning service to the Temple.",
    },
    {
      time: "1:00 PM – 2:30 PM",
      description: "Transportation to Parking Deck.",
    },
    {
      time: "4:00 PM – 5:30 PM",
      description: "Late afternoon service to the Temple.",
    },
    {
      time: "10:30 PM – 11:30 PM",
      description: "Transportation to Parking Deck.",
    },
  ],
}
