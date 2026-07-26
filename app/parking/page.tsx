"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Ban,
  TriangleAlert,
  ParkingCircle,
  MapPin,
  Bus,
  Hotel,
  Signpost,
  ArrowRight,
  CarFront,
  Phone,
  Copy,
  Check,
} from "lucide-react"
import { StandardPageHeader } from "@/components/organisms/standard-page-header"
import {
  dropOffSteps,
  hotelShuttleSchedule,
  mainParkingRule,
  otherParkingRules,
  parkingBusSchedule,
  shuttleHotels,
  shuttleHotelsPending,
  templeParkingRule,
  type ScheduleAccent,
  type ScheduleTable,
} from "@/lib/parking-data"
import "@/styles/registration-theme.css"

const SCHEDULE_ACCENT: Record<
  ScheduleAccent,
  {
    border: string
    headerBg: string
    headerBorder: string
    icon: string
  }
> = {
  shuttle: {
    border: "border-blue-200",
    headerBg: "bg-blue-50",
    headerBorder: "border-blue-200",
    icon: "text-blue-500",
  },
  bus: {
    border: "border-indigo-200",
    headerBg: "bg-indigo-50",
    headerBorder: "border-indigo-200",
    icon: "text-indigo-500",
  },
}

function ScheduleCard({ table }: { table: ScheduleTable }) {
  const accent = SCHEDULE_ACCENT[table.accent]

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border-2 ${accent.border} overflow-hidden`}
    >
      <div
        className={`px-6 py-4 ${accent.headerBg} border-b-2 ${accent.headerBorder}`}
      >
        <h3 className="acc-card-title">{table.title}</h3>
        <p className="acc-card-caption text-gray-600 mt-1">{table.origin}</p>
      </div>
      <table className="w-full">
        <thead className="sr-only sm:not-sr-only">
          <tr className="border-b border-gray-100">
            <th className="px-6 py-3 text-left acc-card-caption font-semibold text-gray-500 sm:w-52">
              Time
            </th>
            <th className="px-6 py-3 text-left acc-card-caption font-semibold text-gray-500">
              Service
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {table.entries.map((entry) => (
            <tr key={`${table.id}-${entry.time}`} className="align-top">
              <td className="block px-6 pt-4 pb-0 sm:table-cell sm:py-4 acc-card-base font-semibold text-gray-900 whitespace-nowrap sm:w-52">
                {entry.time}
              </td>
              <td className="block px-6 pt-1 pb-4 sm:table-cell sm:py-4 acc-card-base text-gray-700">
                {entry.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function ParkingPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [copiedHotelIndex, setCopiedHotelIndex] = useState<number | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const copyAddress = (address: string, index: number) => {
    void navigator.clipboard.writeText(address)
    setCopiedHotelIndex(index)
    setTimeout(() => setCopiedHotelIndex(null), 2000)
  }

  return (
    <div className="min-h-screen reg-page-bg page-bg-extend w-full relative text-gray-900">
      <div className="container mx-auto px-4 relative z-10">
        <StandardPageHeader
          title="Parking & Transportation"
          description="Everything you need to know about arriving at the Mahotsav — where to drop off your family, where to park, and how hotel shuttles and the parking-garage bus run to the temple."
          isLoaded={isLoaded}
        />
      </div>

      <div className="relative z-20 bg-transparent">
        <div className="container mx-auto px-4 page-bottom-spacing">
          {/* No Parking at the Temple */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-8">
              <Ban className="h-8 w-8 text-red-500" />
              <h2 className="text-3xl font-bold">{templeParkingRule.title}</h2>
            </div>
            <div className="bg-red-50 rounded-2xl shadow-lg p-6 border-2 border-red-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-red-100 p-3 rounded-lg flex-shrink-0">
                  <Ban className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="acc-card-title text-red-900 mb-2">
                    Temple Premises
                  </h3>
                  <p className="acc-card-base text-gray-800 leading-relaxed">
                    {templeParkingRule.summary}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="acc-card-title text-red-900 mb-4">
                  Drop-off instructions
                </h4>
                <ol className="space-y-4">
                  {dropOffSteps.map((step) => (
                    <li key={step.step} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-100 text-red-700 text-sm font-bold flex items-center justify-center">
                        {step.step}
                      </span>
                      <p className="acc-card-base text-gray-800 leading-relaxed pt-0.5">
                        {step.instruction}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </motion.section>

          {/* Main Parking Location */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-8">
              <ParkingCircle className="h-8 w-8 text-orange-500" />
              <h2 className="text-3xl font-bold">Main Parking Location</h2>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-200">
              <h3 className="acc-card-title mb-4">{mainParkingRule.title}</h3>
              <div className="space-y-3 text-gray-700 mb-5">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1 text-orange-400 flex-shrink-0" />
                  <span className="acc-card-base">
                    Multi-level parking deck between the NBA and Extended Stay
                    America buildings.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Signpost className="h-4 w-4 mt-1 text-orange-400 flex-shrink-0" />
                  <span className="acc-card-base">
                    Look for Rajat Mahotsav signage next to the garage entrance.
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-orange-50 border border-orange-200 p-3 mb-5">
                <p className="acc-card-base font-semibold text-orange-900">
                  Do not park on Level 1.
                </p>
              </div>
              <a
                href={mainParkingRule.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-4 py-2 rounded-full acc-card-caption font-medium transition-all border-2 border-orange-300 hover:border-orange-400"
              >
                <span>Get Directions</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.section>

          {/* Other Parking Options */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-8">
              <MapPin className="h-8 w-8 text-orange-500" />
              <h2 className="text-3xl font-bold">Other Parking Options</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {otherParkingRules.map((rule) => (
                <div
                  key={rule.id}
                  className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-200"
                >
                  <h3 className="acc-card-title mb-3">{rule.title}</h3>
                  <p className="acc-card-base text-gray-700 leading-relaxed">
                    {rule.summary}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Restricted Lots — Tow Zone */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <div className="flex items-center gap-3 mb-8">
              <TriangleAlert className="h-8 w-8 text-red-500" />
              <h2 className="text-3xl font-bold">Restricted Lots — Tow Zone</h2>
            </div>
            <div className="bg-red-50 rounded-2xl shadow-lg p-6 border-2 border-red-300">
              <div className="flex items-start gap-4">
                <div className="bg-red-100 p-3 rounded-lg flex-shrink-0">
                  <TriangleAlert className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="acc-card-title text-red-900 mb-2">
                    Private lots on Penhorn Avenue
                  </h3>
                  <p className="acc-card-base text-gray-800 leading-relaxed">
                    Do not park in any other private parking lots on Penhorn
                    Avenue between{" "}
                    <span className="font-semibold">
                      9:00 AM – 5:00 PM, Monday – Friday
                    </span>
                    . Cars parked illegally will be towed at the owner&apos;s
                    expense.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Hotel Shuttle Service */}
          <motion.section
            id="hotel-shuttle"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            className="mb-16 scroll-mt-28"
          >
            <div className="flex items-center gap-3 mb-4">
              <CarFront className="h-8 w-8 text-blue-500" />
              <h2 className="text-3xl font-bold">Hotel Shuttle Service</h2>
            </div>
            <p className="acc-card-base text-gray-700 leading-relaxed mb-2">
              Shuttles (vans) run{" "}
              <span className="font-semibold">only between the designated
              hotels and the temple</span>
              . They do not serve the parking garage — use the parking garage
              bus for that.
            </p>
            <p className="acc-card-base text-gray-600 mb-6">
              Shuttle timings are also shared in the Rajat Mahotsav WhatsApp
              channel.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {shuttleHotels.map((hotel, index) => (
                <div
                  key={hotel.name}
                  className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-2 min-w-0">
                      <Hotel className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <h3 className="acc-card-title">{hotel.name}</h3>
                        {hotel.aka ? (
                          <p className="acc-card-caption text-gray-500 mt-0.5">
                            Shuttle stop listed as {hotel.aka}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-1 text-blue-400 flex-shrink-0" />
                      <span className="acc-card-base flex-1">{hotel.address}</span>
                      <button
                        type="button"
                        onClick={() => copyAddress(hotel.address, index)}
                        className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors flex-shrink-0"
                        title="Copy address"
                        aria-label={`Copy address for ${hotel.name}`}
                      >
                        {copiedHotelIndex === index ? (
                          <Check className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Copy className="h-4 w-4 text-blue-600" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-blue-400 flex-shrink-0" />
                      <a
                        href={`tel:${hotel.phone.replace(/[^\d+]/g, "")}`}
                        className="acc-card-base hover:underline"
                      >
                        {hotel.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={hotel.directionsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="acc-card-caption text-blue-600 hover:underline font-medium"
                      >
                        Directions
                      </a>
                    </div>
                  </div>
                </div>
              ))}
              {shuttleHotelsPending.map((hotel) => (
                <div
                  key={hotel.name}
                  className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200"
                >
                  <div className="flex items-start gap-2 mb-3">
                    <Hotel className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <h3 className="acc-card-title">{hotel.name}</h3>
                  </div>
                  <p className="acc-card-base text-gray-500">
                    Address and directions will be posted when confirmed.
                  </p>
                </div>
              ))}
            </div>

            <ScheduleCard table={hotelShuttleSchedule} />
          </motion.section>

          {/* Parking Garage Bus */}
          <motion.section
            id="parking-bus"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8 }}
            className="scroll-mt-28"
          >
            <div className="flex items-center gap-3 mb-4">
              <Bus className="h-8 w-8 text-indigo-500" />
              <h2 className="text-3xl font-bold">Parking Garage Bus</h2>
            </div>
            <p className="acc-card-base text-gray-700 leading-relaxed mb-6">
              Buses run{" "}
              <span className="font-semibold">
                only between the Harmon Meadow parking garage and the temple
              </span>
              . Hotel guests should use the hotel shuttle above.
            </p>
            <ScheduleCard table={parkingBusSchedule} />
          </motion.section>
        </div>
      </div>
    </div>
  )
}
