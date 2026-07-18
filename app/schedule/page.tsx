"use client"

import { useState, useEffect } from "react"
import { StandardPageHeader } from "@/components/organisms/standard-page-header"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, MapPin, ChevronRight } from "lucide-react"

interface Event {
  time: string
  title: string
  description?: string
  location?: string
}

interface ScheduleDay {
  date: string
  dayName: string
  month: string
  events: Event[]
  isHighlight?: boolean
}

const scheduleData: ScheduleDay[] = [
  {
    date: "27",
    dayName: "Monday",
    month: "July",
    events: [
      { time: "Morning", title: "Welcome Program" },
      { time: "Afternoon", title: "Lunch" },
      { time: "Afternoon", title: "All Parayan Mahapooja" },
      { time: "Evening", title: "Dinner" },
      { time: "Evening", title: "Opening Ceremony" }
    ],
    isHighlight: true
  },
  {
    date: "28",
    dayName: "Tuesday",
    month: "July",
    events: [
      { time: "Morning", title: "All Parayan Mahapooja" },
      { time: "Afternoon", title: "Lunch" },
      { time: "Evening", title: "Shakotsav" },
      { time: "Evening", title: "Dinner" }
    ],
    isHighlight: true
  },
  {
    date: "29",
    dayName: "Wednesday",
    month: "July",
    events: [
      { time: "Morning", title: "Gurupoonam" },
      { time: "Afternoon", title: "Lunch" },
      { time: "Evening", title: "Dinner" },
      { time: "Evening", title: "Bhakti Sandhya" }
    ],
    isHighlight: true
  },
  {
    date: "30",
    dayName: "Thursday",
    month: "July",
    events: [
      { time: "Morning", title: "Morning Program" },
      { time: "Afternoon", title: "Lunch" },
      { time: "Afternoon", title: "Ladies Program" },
      { time: "Evening", title: "Dinner" },
      { time: "Evening", title: "Samuh Raas" }
    ],
    isHighlight: true
  },
  {
    date: "31",
    dayName: "Friday",
    month: "July",
    events: [
      { time: "Morning", title: "Morning Program" },
      { time: "Afternoon", title: "Lunch" },
      { time: "Afternoon", title: "Hindola Program" },
      { time: "Evening", title: "Dinner" },
      { time: "Evening", title: "Bhakti Nrutya" }
    ],
    isHighlight: true
  },
  {
    date: "1",
    dayName: "Saturday",
    month: "August",
    events: [
      { time: "Morning", title: "Nagaryatra" },
      { time: "Afternoon", title: "Lunch" },
      { time: "Afternoon", title: "Abhishek Program" },
      { time: "Evening", title: "Dinner" },
      { time: "Evening", title: "Sanskrutik Drama" }
    ],
    isHighlight: true
  },
  {
    date: "2",
    dayName: "Sunday",
    month: "August",
    events: [
      { time: "Morning", title: "Patotsav Celebrations" },
      { time: "Afternoon", title: "Lunch" }
    ],
    isHighlight: true
  }
]

export default function SchedulePage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedDay, setSelectedDay] = useState<number>(0)
  const [isMobile, setIsMobile] = useState(false)

  const getEventCountExcludingMeals = (events: Event[]) =>
    events.filter((event) => {
      const normalizedTitle = event.title.trim().toLowerCase()
      return normalizedTitle !== "lunch" && normalizedTitle !== "dinner"
    }).length

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Theme constants matching original design
  const theme = {
    gradients: {
      background: 'bg-gradient-to-br from-orange-50 via-white to-red-50',
      cardOverlay: 'bg-gradient-to-br from-orange-100/20 to-red-100/20',
      eventHighlight: 'bg-gradient-to-r from-orange-100 to-red-100',
      eventHighlightStatic: 'bg-gradient-to-r from-orange-50 to-red-50'
    },
    colors: {
      highlight: 'text-orange-600',
      ring: 'ring-orange-200',
      border: 'border-orange-300'
    }
  }

  return (
    <div className={`min-h-screen ${theme.gradients.background} page-bg-extend pb-20`}>
      <div className="container mx-auto px-4 page-bottom-spacing">
        {/* Header */}
        <StandardPageHeader
          title="Calendar of Events"
          subtitle="July 27 - August 2, 2026"
          description="Come celebrate 25 years of community, faith, and fellowship! Join us for this special milestone event designed for all ages."
          isLoaded={isLoaded}
        />

        {/* Desktop: Calendar Grid View */}
        {!isMobile && (
          <div className="max-w-7xl mx-auto">
            {/* Calendar Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-7 gap-3 mb-6"
            >
              {scheduleData.map((day, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedDay(index)}
                  className={`group relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 ${
                    selectedDay === index
                      ? `ring-2 ${theme.colors.ring} shadow-2xl scale-105`
                      : 'hover:scale-102 hover:shadow-lg'
                  }`}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Background */}
                  <div className={`absolute inset-0 ${
                    selectedDay === index
                      ? theme.gradients.eventHighlight
                      : 'bg-white hover:bg-gradient-to-br hover:from-orange-50 hover:to-red-50'
                  }`} />

                  {/* Month Label */}
                  <div className={`absolute top-3 left-3 font-bold tracking-wider uppercase ${
                    selectedDay === index ? 'text-lg text-orange-700' : 'text-base text-gray-400 group-hover:text-orange-400'
                  }`}>
                    {day.month}
                  </div>

                  {/* Event Count Badge */}
                  <div className={`absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    selectedDay === index
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-orange-100 text-orange-600 group-hover:bg-orange-200'
                  }`}>
                    {getEventCountExcludingMeals(day.events)}
                  </div>

                  {/* Date & Day */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pt-6">
                    <div className={`font-black tracking-tighter mb-1 leading-none ${
                      selectedDay === index ? 'text-7xl text-orange-600' : 'text-5xl text-gray-800 group-hover:text-orange-600'
                    }`}>
                      {day.date}
                    </div>
                    <div className={`font-bold tracking-wide mt-1 ${
                      selectedDay === index ? 'text-lg text-orange-700' : 'text-sm text-gray-500 group-hover:text-orange-500'
                    }`}>
                      {day.dayName.slice(0, 3).toUpperCase()}
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {selectedDay === index && (
                    <motion.div
                      layoutId="selectedIndicator"
                      className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 shadow-sm"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>

            {/* Event Details Panel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDay}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[500px]"
              >
                {/* Day Header */}
                <div className="relative px-8 py-6 bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-1">
                        {scheduleData[selectedDay].month}
                      </div>
                      <div className={`text-5xl font-black tracking-tight ${theme.colors.highlight}`}>
                        {scheduleData[selectedDay].date}
                      </div>
                      <div className="text-xl font-medium mt-1 text-gray-800">
                        {scheduleData[selectedDay].dayName}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-500 mb-2">TOTAL EVENTS</div>
                      <div className={`text-6xl font-black ${theme.colors.highlight}`}>
                        {getEventCountExcludingMeals(scheduleData[selectedDay].events)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Events List */}
                <div className="p-8">
                  <div className="space-y-4">
                    {scheduleData[selectedDay].events.map((event, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`group relative flex items-start gap-6 p-5 rounded-2xl transition-all duration-300 hover:shadow-lg border border-transparent ${
                          theme.gradients.eventHighlightStatic
                        } hover:${theme.gradients.eventHighlight}`}
                      >
                        {/* Time Badge */}
                        <div className="flex-shrink-0 w-32">
                          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-white shadow-sm border ${theme.colors.border}`}>
                            <Clock className={`w-4 h-4 ${theme.colors.highlight}`} />
                            <span className={`text-sm font-bold tracking-wide ${theme.colors.highlight}`}>{event.time}</span>
                          </div>
                        </div>

                        {/* Event Info */}
                        <div className="flex-grow">
                          <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-orange-600 transition-colors">
                            {event.title}
                          </h3>
                          {event.description && (
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {event.description}
                            </p>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-1.5 mt-2 text-sm text-orange-600">
                              <MapPin className="w-4 h-4" />
                              <span className="font-medium">{event.location}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* Mobile: Accordion View */}
        {isMobile && (
          <div className="max-w-2xl mx-auto space-y-3">
            {scheduleData.map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                {/* Day Header - Clickable */}
                <button
                  onClick={() => setSelectedDay(selectedDay === index ? -1 : index)}
                  className="w-full text-left"
                >
                  <div className={`p-5 transition-all duration-300 ${
                    selectedDay === index
                      ? theme.gradients.eventHighlight
                      : 'bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Date Circle */}
                        <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center ${
                          selectedDay === index
                            ? 'bg-orange-500 shadow-lg'
                            : 'bg-white shadow-sm'
                        }`}>
                          <div className={`text-2xl font-black ${
                            selectedDay === index ? 'text-white' : 'text-orange-600'
                          }`}>
                            {day.date}
                          </div>
                          <div className={`text-[10px] font-bold tracking-wider uppercase ${
                            selectedDay === index ? 'text-white/90' : 'text-gray-500'
                          }`}>
                            {day.month}
                          </div>
                        </div>

                        {/* Day Name */}
                        <div>
                          <div className={`text-xl font-bold ${
                            selectedDay === index ? 'text-orange-700' : 'text-gray-800'
                          }`}>
                            {day.dayName}
                          </div>
                          <div className={`text-sm font-medium ${
                            selectedDay === index ? 'text-orange-600' : 'text-gray-500'
                          }`}>
                            {getEventCountExcludingMeals(day.events)} events scheduled
                          </div>
                        </div>
                      </div>

                      {/* Chevron */}
                      <motion.div
                        animate={{ rotate: selectedDay === index ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className={`w-6 h-6 ${
                          selectedDay === index ? 'text-orange-700' : 'text-orange-500'
                        }`} />
                      </motion.div>
                    </div>
                  </div>
                </button>

                {/* Expandable Events */}
                <AnimatePresence>
                  {selectedDay === index && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 space-y-3 bg-gradient-to-br from-orange-50/30 to-rose-50/20">
                        {day.events.map((event, eventIndex) => (
                          <motion.div
                            key={eventIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: eventIndex * 0.05 }}
                            className="flex items-start gap-3 p-4 rounded-xl bg-white shadow-sm border border-orange-100/50"
                          >
                            {/* Time */}
                            <div className={`flex-shrink-0 px-3 py-1.5 rounded-lg bg-white shadow-sm border ${theme.colors.border}`}>
                              <div className={`text-xs font-bold whitespace-nowrap ${theme.colors.highlight}`}>{event.time}</div>
                            </div>

                            {/* Event Details */}
                            <div className="flex-grow min-w-0">
                              <h4 className="text-base font-bold text-gray-800 leading-tight">
                                {event.title}
                              </h4>
                              {event.description && (
                                <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                              )}
                              {event.location && (
                                <div className="flex items-center gap-1 mt-1.5 text-xs text-orange-600">
                                  <MapPin className="w-3 h-3" />
                                  <span className="font-medium">{event.location}</span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
