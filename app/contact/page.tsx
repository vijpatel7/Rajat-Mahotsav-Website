"use client"

import { useState, useEffect } from "react"
import { StandardPageHeader } from "@/components/organisms/standard-page-header"
import { MapPin, Phone, Mail, Clock, Globe } from "lucide-react"

export default function ContactPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 page-bg-extend">
      <div className="container mx-auto px-4 page-bottom-spacing max-w-6xl">
        <StandardPageHeader
          title="Contact Us"
          description="Have questions about the NJ Rajat Mahotsav 2026? Get in touch with us using the information below. We're here to help with registrations, event details, and any inquiries you may have."
          isLoaded={isLoaded}
        />

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-md p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Temple Contact Information</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                  <p className="text-gray-700 leading-relaxed">200 Swamibapa Way, Secaucus, NJ 07094</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                  <p className="text-gray-700">
                    (201) 325-0510
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-700">
                    Use the registration form for event-related questions
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Event Dates</h3>
                  <p className="text-gray-700">
                    July 27 - August 2, 2026<br />
                    <span className="text-sm text-gray-600">Rajat Pratishtha Mahotsav</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Globe className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Website</h3>
                  <a
                    href="https://njrajatmahotsav.com"
                    className="text-orange-600 hover:text-orange-700 underline"
                  >
                    njrajatmahotsav.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Links</h2>

            <div className="space-y-4">
              <a
                href="/registration"
                className="block p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-orange-600 mb-1">Event Registration</h3>
                <p className="text-sm text-gray-600">Register for the Rajat Mahotsav celebration</p>
              </a>

              <a
                href="/schedule"
                className="block p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-orange-600 mb-1">Event Schedule</h3>
                <p className="text-sm text-gray-600">View the complete program timeline</p>
              </a>

              <a
                href="/guest-services"
                className="block p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-orange-600 mb-1">Guest Services</h3>
                <p className="text-sm text-gray-600">Accommodation and travel information</p>
              </a>

              <a
                href="/parking"
                className="block p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-orange-600 mb-1">Parking & Transportation</h3>
                <p className="text-sm text-gray-600">Where to park and shuttle schedules</p>
              </a>

              <a
                href="/latest-events"
                className="block p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-orange-600 mb-1">Latest Events</h3>
                <p className="text-sm text-gray-600">Browse recent temple activities and photos</p>
              </a>

              <a
                href="/about"
                className="block p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-orange-600 mb-1">About the Temple</h3>
                <p className="text-sm text-gray-600">Learn about our history and mission</p>
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How do I register for the event?</h3>
              <p className="text-gray-700">Visit our <a href="/registration" className="text-orange-600 hover:text-orange-700 underline">Registration page</a> and fill out the form with your details. You'll receive confirmation once your registration is processed.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Where can I find accommodation information?</h3>
              <p className="text-gray-700">Check our <a href="/guest-services" className="text-orange-600 hover:text-orange-700 underline">Guest Services page</a> for recommended hotels, booking information, and travel tips.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What is included in the event schedule?</h3>
              <p className="text-gray-700">The <a href="/schedule" className="text-orange-600 hover:text-orange-700 underline">Schedule page</a> contains the complete timeline of religious programs, cultural performances, and community activities throughout the celebration.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I volunteer or participate in seva?</h3>
              <p className="text-gray-700">Yes! Visit our <a href="/community-seva" className="text-orange-600 hover:text-orange-700 underline">Community Seva</a> and <a href="/spiritual-seva" className="text-orange-600 hover:text-orange-700 underline">Spiritual Seva</a> pages to learn about volunteer opportunities.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
