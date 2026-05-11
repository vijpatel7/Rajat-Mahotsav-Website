"use client"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { StandardPageHeader } from "@/components/organisms/standard-page-header"
import { useDeviceType } from "@/hooks/use-device-type"
import { Clock, Footprints, BookOpenText, Apple, Send, Heart } from "lucide-react"
import { GiPrayerBeads } from "react-icons/gi"
import { PiHandsPraying } from "react-icons/pi"
import { ImageMarquee } from "@/components/organisms/image-marquee"
import { SevaSubmissionForm } from "@/components/organisms/seva-submission-form"
import { ResponsiveImageGallery } from "@/components/organisms/responsive-image-gallery"
import { ProgressCounter } from "@/components/molecules/progress-counter"
import {
  normalizeSpiritualSevaStats,
  type SpiritualSevaStats,
} from "@/lib/spiritual-seva-stats"
import "@/styles/community-service-theme.css"
import { getCloudflareImage, getR2Image } from "@/lib/cdn-assets"

const sevaGoals = [
  { icon: GiPrayerBeads, label: "Malas", target: 250, description: "Meditational Prayer Beads" },
  { icon: Clock, label: "Dhyaan", target: 250, description: "Fully body Meditation", suffix: "min" },
  { icon: Footprints, label: "Pradakshinas", target: 250, description: "Clockwise devotion around the sihasan" },
  { icon: PiHandsPraying, label: "Dandvats", target: 250, description: "Physical devoation to Lord Swaminarayan" },
  { icon: Footprints, label: "Padyatras", target: 25, description: "Walks to the Mandir" },
  { icon: Apple, label: "Upvas", target: 25, description: "Fast for a full day" },
]

const parayans = [
  {
    icon: BookOpenText,
    title: "Sadachar Sandesh",
    description: "Teachings of Prem Murti Acharya Swamishree Maharaj",
    gujaratiLink: "https://www.swaminarayangadi.com/publications/books/scriptures/gujarati/sadachar-sandesh-gujarati",
    englishLink: "https://www.swaminarayangadi.com/publications/books/scriptures/english/sadachar-sandesh-english"
  },
  {
    icon: BookOpenText,
    title: "Harignanamrut Kavya",
    description: "Kirtans composed by Jeevanpran Shree Muktajeevan Swamibapa",
    gujaratiLink: "https://www.swaminarayangadi.com/publications/books/kirtanbooks/gujarati/shree-harignanamurt-kavya-amrut-bindu-1",
    gujaratiLink2: "https://www.swaminarayangadi.com/publications/books/kirtanbooks/gujarati/shree-harignanamurt-kavya-amrut-bindu-2",
    gujaratiLink3: "https://www.swaminarayangadi.com/publications/books/kirtanbooks/gujarati/shree-harignanamurt-kavya-amrut-bindu-3",
    gujaratiLink4: "https://www.swaminarayangadi.com/publications/books/kirtanbooks/gujarati/shree-harignanamurt-kavya-amrut-bindu-4",
    englishLink: "https://www.swaminarayangadi.com/publications/books/kirtanbooks/transliteration/shree-harignanamrut-kavya-transliteration"
  },
  {
    icon: BookOpenText,
    title: "Bapashree ni Vato",
    description: "Discourses by Jeevanpran Shree Abji Bapashree",
    gujaratiLink: "https://www.swaminarayangadi.com/publications/books/scriptures/gujarati/shree-abji-bapashree-ni-vato-bhag-1",
    gujaratiLink2: "https://www.swaminarayangadi.com/publications/books/scriptures/gujarati/shree-abji-bapashree-ni-vato-bhag-2",
    englishLink: "https://www.swaminarayangadi.com/publications/books/scriptures/english/shree-abji-bapashree-ni-vato-part-1-english",
    englishLink2: "https://www.swaminarayangadi.com/publications/books/scriptures/english/shree-abji-bapashree-ni-vato-part-2-english"
  },
]

const firstRowImages = [
  { src: getCloudflareImage("07f0293e-f384-4a9e-4364-4f7131263100"), alt: "Spiritual Seva 1" },
  { src: getCloudflareImage("f8a344b2-8045-4273-ceb7-bcd0a4f4de00"), alt: "Spiritual Seva 2" },
  { src: getCloudflareImage("1ea74bd4-3867-4016-8010-07622468a800"), alt: "Spiritual Seva 12" },
  { src: getCloudflareImage("dfea2296-fa83-4bdc-6b23-bb28434a5a00"), alt: "Spiritual Seva 3" },
  { src: getCloudflareImage("a8f9e2cb-feec-4bb0-15a5-29dd83648b00"), alt: "Spiritual Seva 4" },
  { src: getCloudflareImage("7e9de524-cfc3-49ca-96cf-105fba01ce00"), alt: "Spiritual Seva 5" },
]

const secondRowImages = [
  { src: getCloudflareImage("694c7ad0-74f9-4c2a-8b30-eb4dce7f8000"), alt: "Spiritual Seva 6" },
  { src: getCloudflareImage("b7160132-914d-4d1f-d6c4-48418b6aa000"), alt: "Spiritual Seva 7" },
  { src: getCloudflareImage("d1b8a1af-abfc-4a8c-b7e2-d4b1377ebf00"), alt: "Spiritual Seva 8" },
  { src: getCloudflareImage("bdf8f682-7bd3-4838-46c4-fe7ba1358b00"), alt: "Spiritual Seva 9" },
  { src: getCloudflareImage("a494c6be-02eb-4fc2-d6eb-9df81b294600"), alt: "Spiritual Seva 10" },
  { src: getCloudflareImage("8c1c0405-0c48-4f49-606b-a4260e2c5900"), alt: "Spiritual Seva 11" },
]

const whyWeServeImages = [
  { id: 1, src: getCloudflareImage("03a146fb-9450-46d8-003b-b15d9b286c00"), alt: "Swamibapa Mantra" },
  { id: 2, src: getCloudflareImage("6f2ae80b-f53f-4a98-20c8-e064b5895200"), alt: "Prem Murti Bapa Darshan" },
  { id: 3, src: getCloudflareImage("04302505-add8-4190-ca57-c4d2ed5c3e00"), alt: "Acharya Swamiji Dhyaan" }
]

export default function SpiritualSevaPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [statsData, setStatsData] = useState<SpiritualSevaStats>(() =>
    normalizeSpiritualSevaStats(null)
  )
  const [statsError, setStatsError] = useState<string | null>(null)
  const statsRef = useRef(null)
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" })
  const deviceType = useDeviceType()

  useEffect(() => {
    const allImages = [...firstRowImages, ...secondRowImages, ...whyWeServeImages]
    allImages.forEach((image) => {
      const img = new Image()
      img.src = image.src
    })
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let isMounted = true

    async function fetchSpiritualStats() {
      try {
        const response = await fetch("/api/spiritual-seva/stats", { cache: "no-store" })
        const payload = await response.json()

        if (!response.ok || !payload.success) {
          throw new Error(payload.details || payload.error || "Unable to load spiritual seva stats")
        }

        if (isMounted) {
          setStatsData(normalizeSpiritualSevaStats(payload.stats))
          setStatsError(null)
        }
      } catch (error) {
        if (isMounted) {
          setStatsError(error instanceof Error ? error.message : "Unable to load spiritual seva stats")
        }
      }
    }

    fetchSpiritualStats()

    return () => {
      isMounted = false
    }
  }, [])

  const spiritualStats = [
    {
      icon: Send,
      label: "Submissions",
      current: statsData.total_submissions,
      target: 25,
    },
    {
      icon: BookOpenText,
      label: "Malas",
      current: statsData.malas,
      target: 250,
    },
    {
      icon: Clock,
      label: "Dhyaan",
      current: statsData.dhyan,
      target: 250,
      suffix: "min",
    },
    {
      icon: Footprints,
      label: "Pradakshinas",
      current: statsData.pradakshinas,
      target: 250,
    },
    {
      icon: Heart,
      label: "Dandvats",
      current: statsData.dandvats,
      target: 250,
    },
    {
      icon: Footprints,
      label: "Padyatras",
      current: statsData.padyatras,
      target: 25,
    },
    {
      icon: Apple,
      label: "Upvas",
      current: statsData.upvas,
      target: 25,
    },
    {
      icon: BookOpenText,
      label: "Sadachar Sandesh",
      current: statsData.sadachar,
      target: 1,
    },
    {
      icon: BookOpenText,
      label: "Harignanamrut Kavya",
      current: statsData.harignanamrut,
      target: 1,
    },
    {
      icon: BookOpenText,
      label: "Bapashree ni Vato",
      current: statsData.bapashree,
      target: 1,
    },
  ]

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 page-bg-extend transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      data-page="spiritual-seva"
    >

      <section className="min-h-screen">
        <div className="relative z-10">
          <div className="mb-36">
            <StandardPageHeader
              title="Spiritual Seva"
              subtitle="Dharma, Gnyan, Vairagya, and Bhakti"
              description=""
              isLoaded={isLoaded}
            />

            {/* Custom Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex justify-center px-4 mt-8"
            >
              <p className="text-center text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-5xl">
                In celebration of our Temple's Rajat Mahotsav, devotees are coming together in a collective spiritual endeavor that extends far beyond a single event. We are transforming this momentous milestone into a year-round journey of spiritual growth, using this celebration as a catalyst to deepen our devotion and strengthen our eternal bond with God. Through dedicated niyams and seva, and by embracing the four pillars of Dharma, Gnyan, Vairagya, and Bhakti, we commit to sustaining this spiritual momentum throughout the year, ensuring that the divine inspiration of our Rajat Mahotsav becomes a lasting foundation for our path toward God.
              </p>
            </motion.div>
          </div>

          <ResponsiveImageGallery images={whyWeServeImages as any} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">
            <motion.div
              ref={statsRef}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
              className="space-y-8"
            >
              <div className="max-w-4xl mx-auto space-y-4 text-center">
                <motion.h3
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-2xl md:text-3xl font-bold text-gray-800"
                >
                  Live Collective Spiritual Seva Progress
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-lg md:text-xl text-gray-700 leading-relaxed"
                >
                  These live totals are calculated from all spiritual seva submissions received so far.
                </motion.p>
                {statsError && (
                  <p className="text-sm font-medium text-red-600">
                    Live spiritual seva totals are temporarily unavailable: {statsError}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {spiritualStats.map((stat, index) => (
                  <ProgressCounter
                    key={stat.label}
                    {...stat}
                    delay={index * 0.1}
                    inView={isStatsInView}
                  />
                ))}
              </div>
            </motion.div>

            <div className="space-y-8">
              <div className="max-w-4xl mx-auto space-y-4">
                <motion.h3
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-2xl md:text-3xl font-bold text-gray-800 text-center"
                >
                  Monthly Spiritual Goals
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-lg md:text-xl text-gray-700 leading-relaxed text-justify"
                >
                  Over a ten-month period (October 2025 – July 2026), each haribhakt is encouraged to complete monthly spiritual goals — including 250 Malas, 250 minutes of Dhyan, 250 Pradakshinas, 250 Dandvats, 25 Padyatras to the Mandir, and 25 Upvas.
                </motion.p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {sevaGoals.map((goal, index) => {
                  const Icon = goal.icon
                  return (
                    <motion.div
                      key={goal.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-200 ease-out cursor-pointer p-6 hover:-translate-y-2 hover:scale-[1.02] h-full">
                        <div className="text-center space-y-4">
                          <div className="flex justify-center">
                            <div className="p-3 rounded-full bg-gradient-to-br from-orange-100 to-red-100">
                              <Icon className="h-8 w-8 community-text-accent" />
                            </div>
                          </div>
                          <div className="text-3xl lg:text-4xl font-bold community-text-primary">
                            {goal.target}
                            {goal.suffix && <span className="text-lg ml-1">{goal.suffix}</span>}
                          </div>
                          <h4 className="text-xl font-semibold community-text-primary">
                            {goal.label}
                          </h4>
                          <p className="text-base community-text-secondary">
                            {goal.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            <div className="space-y-8">
              <div className="max-w-4xl mx-auto space-y-4">
                <motion.h3
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="text-2xl md:text-3xl font-bold text-gray-800 text-center"
                >
                  Sacred Scripture Parayans
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-lg md:text-xl text-gray-700 leading-relaxed text-justify"
                >
                  In addition, devotees are inspired to complete Parayans of sacred scriptures such as Sadachar Sandesh, Harignanamrut Kavya, and Bapashree ni Vato, further enriching their spiritual journey.
                </motion.p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {parayans.map((parayan, index) => {
                  const Icon = parayan.icon
                  return (
                    <motion.div
                      key={parayan.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-200 ease-out p-6 hover:-translate-y-2 hover:scale-[1.02] h-full flex flex-col">
                        <div className="text-center space-y-4 flex-1">
                          <div className="flex justify-center">
                            <div className="p-3 rounded-full bg-gradient-to-br from-orange-100 to-red-100">
                              <Icon className="h-8 w-8 community-text-accent" />
                            </div>
                          </div>
                          <h4 className="text-xl font-semibold community-text-primary">
                            {parayan.title}
                          </h4>
                          <p className="text-base community-text-secondary">
                            {parayan.description}
                          </p>
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-2">
                            {(parayan.gujaratiLink2 || parayan.gujaratiLink3 || parayan.gujaratiLink4) ? (
                              <>
                                <span className="text-sm font-medium text-gray-700">ભાગ:</span>
                                <a href={parayan.gujaratiLink} target="_blank" rel="noopener noreferrer" className="w-7 h-7 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 hover:bg-orange-600 hover:text-white text-sm font-semibold transition-colors">1</a>
                                {parayan.gujaratiLink2 && <a href={parayan.gujaratiLink2} target="_blank" rel="noopener noreferrer" className="w-7 h-7 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 hover:bg-orange-600 hover:text-white text-sm font-semibold transition-colors">2</a>}
                                {parayan.gujaratiLink3 && <a href={parayan.gujaratiLink3} target="_blank" rel="noopener noreferrer" className="w-7 h-7 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 hover:bg-orange-600 hover:text-white text-sm font-semibold transition-colors">3</a>}
                                {parayan.gujaratiLink4 && <a href={parayan.gujaratiLink4} target="_blank" rel="noopener noreferrer" className="w-7 h-7 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 hover:bg-orange-600 hover:text-white text-sm font-semibold transition-colors">4</a>}
                              </>
                            ) : (
                              <a href={parayan.gujaratiLink} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-orange-600 hover:text-orange-700 hover:underline transition-colors">ગુજરાતી</a>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {parayan.englishLink2 ? (
                              <>
                                <span className="text-sm font-medium text-gray-700">Part:</span>
                                <a href={parayan.englishLink} target="_blank" rel="noopener noreferrer" className="w-7 h-7 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 hover:bg-orange-600 hover:text-white text-sm font-semibold transition-colors">1</a>
                                <a href={parayan.englishLink2} target="_blank" rel="noopener noreferrer" className="w-7 h-7 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 hover:bg-orange-600 hover:text-white text-sm font-semibold transition-colors">2</a>
                              </>
                            ) : (
                              <a href={parayan.englishLink} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-orange-600 hover:text-orange-700 hover:underline transition-colors">English</a>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            <div className="space-y-8 mt-20">
              <div className="max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="bg-white rounded-2xl shadow-lg p-8 border-2 border-orange-200"
                >
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-6">
                    Seva Tracking & Checkpoint
                  </h3>
                  <div className="space-y-6 text-lg md:text-xl text-gray-700 leading-relaxed text-justify">
                    <p>
                      Track your collective spiritual progress throughout the Rajat Mahotsav period by submitting your seva.
                    </p>
                    <p>
                      <span className="font-bold text-orange-600">January 1st Checkpoint:</span> We will conduct a live review of individual totals, serving as an important milestone to celebrate seva completed and inspire continued dedication to our spiritual goals.
                    </p>
                    <div className="flex justify-center pt-2">
                      <Link href="/spiritual-seva/submit">
                        <button className="inline-flex items-center justify-center px-8 py-4 text-xl font-bold text-white bg-gradient-to-r from-orange-600 to-red-600 rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:from-orange-700 hover:to-red-700">
                          <Send className="w-6 h-6 mr-3" />
                          SUBMIT YOUR SEVA!
                        </button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="w-full pb-20">
            <ImageMarquee firstRow={firstRowImages} secondRow={secondRowImages} />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* <div className="space-y-8 mt-20">
              <motion.h3
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-2xl md:text-3xl font-bold text-gray-800 text-center"
              >
                Submit Your Seva
              </motion.h3>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto"
              >
                <SevaSubmissionForm />
              </motion.div>
            </div> */}
          </div>
        </div>
      </section>
    </div>
  )
}
