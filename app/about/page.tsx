"use client"

import { useState, useEffect } from "react"
import { StandardPageHeader } from "@/components/organisms/standard-page-header"
import { Calendar, Heart, Users, Sparkles, MapPin, Phone, Mail, Globe, ChevronDown, ChevronUp } from "lucide-react"

export default function AboutPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isStoryExpanded, setIsStoryExpanded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 page-bg-extend">
      <div className="container mx-auto px-4 page-bottom-spacing max-w-5xl">
        <StandardPageHeader
          title="About the Rajat Mahotsav"
          description="Celebrating 25 years of spiritual service, community devotion, and divine blessings at Shree Swaminarayan Temple Secaucus. Join us for this historic Silver Jubilee celebration from July 27 - August 2, 2026."
          isLoaded={isLoaded}
        />

        <div className="space-y-8">
          {/* Main Story */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div
              className={`relative overflow-hidden transition-[max-height] duration-300 sm:max-h-none ${
                isStoryExpanded
                  ? "max-h-[2000px]"
                  : "max-h-[22rem] [mask-image:linear-gradient(to_bottom,black_72%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,black_72%,transparent)] sm:[mask-image:none] sm:[-webkit-mask-image:none]"
              }`}
            >
              <div className="prose prose-xl max-w-none text-gray-700 space-y-4">
                <p className="leading-relaxed">
                  Shree Swaminarayan Temple Secaucus has been a beacon of spiritual light and community service for 25 years. Founded in 2001, our temple has grown from humble beginnings into a vibrant center of worship, culture, and compassion serving the greater New Jersey community.
                </p>
                <p className="leading-relaxed">
                  The Rajat Mahotsav (Silver Jubilee) marks this historic milestone with a week-long celebration honoring Lord Shree Ghanshyam Maharaj and the divine guidance of Jeevanpran Shree Muktajeevan Swamibapa. This momentous occasion brings together devotees from around the world to celebrate our shared faith, values, and the countless blessings we have received.
                </p>
                <p className="leading-relaxed">
                  Our temple follows the teachings of the Swaminarayan Sampraday, emphasizing devotion to God, service to humanity, and living a life of dharma (righteousness). Through daily worship, community programs, and charitable initiatives, we strive to create a positive impact while preserving and sharing our rich spiritual heritage.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsStoryExpanded((current) => !current)}
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-orange-300 px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-50 transition-colors sm:hidden"
              aria-expanded={isStoryExpanded}
            >
              {isStoryExpanded ? "See less" : "See more"}
              {isStoryExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            <div className="mt-5">
              <a
                href="/timeline"
                className="inline-flex items-center rounded-full border border-orange-300 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-100 transition-colors"
              >
                View Temple Timeline
              </a>
            </div>
          </div>

          {/* Event Highlights */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-md p-6">
              <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Global Unity</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                The Rajat Mahotsav brings together devotees from USA, Canada, England, India, Kenya, Australia, and beyond, uniting our global Swaminarayan community in celebration, devotion, and brotherhood.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="/invitation"
                  className="inline-flex items-center rounded-full border border-blue-300 bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-200 transition-colors"
                >
                  View Invitation
                </a>
                <a
                  href="/guest-services"
                  className="inline-flex items-center rounded-full border border-blue-300 bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-200 transition-colors"
                >
                  Guest Services
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-md p-6">
              <div className="bg-purple-100 p-3 rounded-lg w-fit mb-4">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Divine Experience</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Experience the divine presence through sacred rituals, devotional music, inspiring discourses, and the darshan of our beloved deities in the beautifully decorated temple adorned for this special celebration.
              </p>
              <div className="mt-5">
                <a
                  href="/schedule"
                  className="inline-flex items-center rounded-full border border-purple-300 bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-200 transition-colors"
                >
                  View Schedule
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl shadow-md p-6">
              <div className="bg-orange-100 p-3 rounded-lg w-fit mb-4">
                <Calendar className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Celebration Timeline</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Join us from July 27 through August 2, 2026 for seven days of divine programs, including daily aarti, katha, prasad, cultural performances, and special ceremonies commemorating 25 years of spiritual service.
              </p>
              <div className="mt-5">
                <a
                  href="/schedule"
                  className="inline-flex items-center rounded-full border border-orange-300 bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-200 transition-colors"
                >
                  View Event Schedule
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-white rounded-xl shadow-md p-6">
              <div className="bg-red-100 p-3 rounded-lg w-fit mb-4">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Seva</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our seva efforts include community seva that serves families through outreach and support, and spiritual seva that deepens devotion through worship, satsang, and temple-centered service.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a
                  href="/community-seva"
                  className="inline-flex items-center rounded-full border border-red-300 bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-200 transition-colors"
                >
                  Community Seva
                </a>
                <a
                  href="/spiritual-seva"
                  className="inline-flex items-center rounded-full border border-red-300 bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-200 transition-colors"
                >
                  Spiritual Seva
                </a>
              </div>
            </div>

          </div>

          {/* Temple Contact Resources */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md p-8 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Temple Contact Information</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                    <p className="text-lg text-gray-700 leading-relaxed">200 Swamibapa Way, Secaucus, NJ 07094</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    <p className="text-lg text-gray-700">(201) 325-0510</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <a
                      href="mailto:NewJersey@SwaminarayanGadi.com"
                      className="text-lg text-gray-700 hover:text-gray-900 underline break-words"
                    >
                      NewJersey@<wbr />
                      SwaminarayanGadi.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Globe className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Website</h3>
                    <a
                      href="https://www.swaminarayangadi.com/northamerica"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg text-orange-600 hover:text-orange-700 underline break-words"
                    >
                      swaminarayangadi.com/<wbr />
                      northamerica
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
