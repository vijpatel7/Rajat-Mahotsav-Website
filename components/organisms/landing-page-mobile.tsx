"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useState, type CSSProperties } from "react"

import { useLoading } from "@/hooks/use-loading"
import TodayHighlights, { DayOfEventTag } from "@/components/molecules/today-highlights"
import { getCloudflareImageBiggest } from "@/lib/cdn-assets"

// Mobile image carousel images (same as Skiper53)
const carouselImages = [
  {
    src: getCloudflareImageBiggest("6369e804-64ef-42fe-2bd7-ece677d9f200"),
    alt: "Swamibapa",
  },
  {
    src: getCloudflareImageBiggest("8e64636f-efca-468f-44a0-1004f7f7a600"),
    alt: "Ishwarbapa",
  },
  {
    src: getCloudflareImageBiggest("f3dcd6de-5334-48d0-c950-8d35e3f32f00"),
    alt: "Abji Bapashree",
  },
  {
    src: getCloudflareImageBiggest("9b13ec59-9484-4191-00db-04b31cda2a00"),
    alt: "Swaminarayan Bhagwan",
  },
  {
    src: getCloudflareImageBiggest("9dbe17dd-7e0b-49d1-984f-f8a4f20cd000"),
    alt: "Gopalbapa",
  },
  {
    src: getCloudflareImageBiggest("1443ce4a-1e60-4a83-34d8-f8626fe74b00"),
    alt: "Nirgunbapa",
  },
  {
    src: getCloudflareImageBiggest("b7366436-526c-437a-bf1b-6bae9cec4a00"),
    alt: "Prem Murti Bapa",
  },
  {
    src: getCloudflareImageBiggest("24e09951-0339-4eb7-b452-02aa945d2600"),
    alt: "Gnan Murti Bapa",
  },
]

function MobileImageCarousel({ className }: { className?: string }) {
  const [activeIndex, setActiveIndex] = useState<number>(3)
  const imageCount = carouselImages.length

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={`flex flex-row w-full h-full overflow-hidden ${className}`}
    >
      {carouselImages.map((image, index) => {
        const isActive = activeIndex === index
        const activeWidth = 35
        const inactiveWidth = (100 - activeWidth) / (imageCount - 1)

        return (
          <motion.div
            key={index}
            className="relative cursor-pointer overflow-hidden flex-shrink-0 h-full"
            initial={{ width: `${100 / imageCount}%` }}
            animate={{
              width: isActive ? `${activeWidth}%` : `${inactiveWidth}%`,
            }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            onClick={() => setActiveIndex(index)}
          >
            <img
              src={image.src}
              className="w-full h-full object-cover"
              alt={image.alt}
            />
          </motion.div>
        )
      })}
    </motion.div>
  )
}

export default function TitleSectionMobile() {
  const { isLoading } = useLoading()

  return (
    <div className="relative min-h-[100dvh] h-[100dvh] overflow-hidden">
      {/* Top fade */}
      <div
        className="absolute inset-x-0 top-0 z-10 pointer-events-none bg-gradient-to-b from-slate-900 via-slate-800/40 to-transparent"
        style={{ height: "12%" }}
      />

      {/* Carousel — shorter on small phones so the card fits */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={!isLoading ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute top-0 left-0 right-0 z-[1] h-[32dvh] min-[390px]:h-[34dvh]"
      >
        <MobileImageCarousel className="bg-transparent" />
      </motion.div>

      <div
        className="absolute top-0 left-0 right-0 z-[2] pointer-events-none h-[32dvh] min-[390px]:h-[34dvh]"
        style={{
          background: `
            linear-gradient(to bottom, rgba(15, 23, 42, 0.55) 0%, transparent 18%, transparent 52%, rgba(15, 23, 42, 1) 100%),
            linear-gradient(to right, rgba(15, 23, 42, 0.35) 0%, transparent 10%, transparent 90%, rgba(15, 23, 42, 0.35) 100%)
          `,
        }}
      />

      {/* Card region — fills remaining viewport; scrolls if needed */}
      <div className="absolute inset-x-0 bottom-0 z-10 bg-slate-900 h-[68dvh] min-[390px]:h-[66dvh]">
        <div className="h-full overflow-y-auto overscroll-contain px-3 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={!isLoading ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
            transition={{ duration: 1.2, delay: !isLoading ? 0.6 : 0, ease: "easeOut" }}
            className="w-full max-w-lg mx-auto"
          >
            <div className="relative">
              <motion.div
                animate={{
                  opacity: [0.15, 0.25, 0.15],
                  scale: [1, 1.01, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -inset-1 rounded-3xl blur-2xl opacity-30"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255, 180, 50, 0.15) 0%, rgba(255, 140, 0, 0.1) 50%, rgba(212, 175, 55, 0.15) 100%)",
                }}
              />

              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 50%, rgba(255, 200, 100, 0.04) 100%)",
                  backdropFilter: "blur(16px) saturate(140%)",
                  WebkitBackdropFilter: "blur(16px) saturate(140%)",
                  border: "1px solid rgba(255, 200, 100, 0.14)",
                  boxShadow: `
                    0 8px 32px rgba(0, 0, 0, 0.28),
                    0 0 0 1px rgba(255, 180, 50, 0.04),
                    inset 0 1px 0 rgba(255, 255, 255, 0.08)
                  `,
                }}
              >
                <div
                  className="pointer-events-none absolute top-0 left-[8%] right-[8%] h-px z-20"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,200,100,0.55), transparent)",
                  }}
                />

                <div className="relative px-4 min-[390px]:px-5 pt-6 pb-6">
                  {/* Brand header */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                    transition={{ duration: 0.7, delay: !isLoading ? 0.8 : 0 }}
                    className="text-center"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 }}
                      transition={{ duration: 0.6, delay: !isLoading ? 0.7 : 0 }}
                      className="mb-3.5"
                    >
                      <DayOfEventTag />
                    </motion.div>

                    <h1
                      className="font-instrument-serif text-[1.5rem] min-[390px]:text-[1.7rem] font-bold leading-tight text-balance"
                      style={{
                        background:
                          "linear-gradient(135deg, #FFD700 0%, #FFA500 30%, #FF8C00 60%, #D4AF37 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      Shree Ghanshyam Maharaj
                    </h1>
                    <p className="font-instrument-serif text-lg min-[390px]:text-xl text-white/95 leading-snug mt-1.5">
                      Rajat Pratishtha Mahotsav
                    </p>

                    <div
                      className="mx-auto mt-4 h-px w-24"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,200,100,0.5), transparent)",
                      }}
                    />
                  </motion.div>

                  {/* Highlights — primary content on mobile */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                    transition={{ duration: 0.7, delay: !isLoading ? 1.1 : 0 }}
                    className="mt-5"
                  >
                    <TodayHighlights compact />
                  </motion.div>

                  {/* CTAs — full-width stack until both labels fit side by side */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                    transition={{ duration: 0.7, delay: !isLoading ? 1.25 : 0 }}
                    className="mt-7 flex flex-col min-[420px]:flex-row gap-2.5"
                  >
                    <Link
                      href="/schedule"
                      className="group relative isolate inline-flex w-full min-h-[3rem] min-[420px]:w-auto min-[420px]:flex-1 items-center justify-center gap-1.5 rounded-full px-4 font-sans font-bold text-sm overflow-hidden transition-all border active:scale-[0.99]"
                      style={{
                        borderColor: "rgba(255, 205, 120, 0.75)",
                        background:
                          "linear-gradient(135deg, #FFC961 0%, #F5A62F 55%, #E4921E 100%)",
                        color: "#0F172A",
                        boxShadow: "0 10px 24px rgba(212,140,18,0.3)",
                      }}
                    >
                      <span className="relative z-10">Full Schedule</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="w-4 h-4 shrink-0 relative z-10"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </Link>

                    <Link
                      href="/parking"
                      className="group relative isolate inline-flex w-full min-h-[3rem] min-[420px]:w-auto min-[420px]:flex-1 items-center justify-center gap-1.5 rounded-full px-4 font-sans font-bold text-sm overflow-hidden transition-all border active:scale-[0.99]"
                      style={{
                        borderColor: "rgba(255, 200, 90, 0.5)",
                        background: "rgba(255, 195, 80, 0.14)",
                        color: "#FFD88A",
                        boxShadow: "0 6px 16px rgba(255, 180, 50, 0.15)",
                      }}
                    >
                      <span className="relative z-10">Transportation</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="w-4 h-4 shrink-0 relative z-10"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
