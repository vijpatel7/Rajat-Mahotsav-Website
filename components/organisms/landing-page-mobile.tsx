"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"

import { useLoading } from "@/hooks/use-loading"
import CountdownTimer from "@/components/molecules/countdown-timer"
import { getCloudflareImageBiggest } from "@/lib/cdn-assets"

interface TitleSectionMobileProps {
  targetDate?: string
}

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

// Mobile-optimized vertical image carousel with tap-to-expand
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
        // Calculate widths: active gets 35%, others share rest
        const activeWidth = 35
        const inactiveWidth = (100 - activeWidth) / (imageCount - 1)

        return (
          <motion.div
            key={index}
            className="relative cursor-pointer overflow-hidden flex-shrink-0 h-full"
            initial={{ width: `${100 / imageCount}%` }}
            animate={{
              width: isActive ? `${activeWidth}%` : `${inactiveWidth}%`
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

export default function TitleSectionMobile({ targetDate = "2026-07-27T07:30:00-04:00" }: TitleSectionMobileProps) {
  const { isLoading } = useLoading()

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Top fade overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800/40 to-transparent z-10 pointer-events-none"
        style={{ height: '15%' }}
      />

      {/* Mobile Image Carousel - constrained to top 45% of viewport */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={!isLoading ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute top-0 left-0 right-0 z-[1]"
        style={{ height: "45vh" }}
      >
        <MobileImageCarousel className="bg-transparent" />
      </motion.div>

      {/* Smooth fade overlay on carousel */}
      <div
        className="absolute top-0 left-0 right-0 z-[2] pointer-events-none"
        style={{
          height: "45vh",
          background: `
            linear-gradient(to bottom, rgba(15, 23, 42, 0.6) 0%, transparent 15%, transparent 50%, rgba(15, 23, 42, 1) 100%),
            linear-gradient(to right, rgba(15, 23, 42, 0.4) 0%, transparent 10%, transparent 90%, rgba(15, 23, 42, 0.4) 100%)
          `
        }}
      />

      {/* Bottom 55% - Glass card section */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-slate-900" style={{ height: "55vh" }}>
        <div className="h-full flex items-start justify-center px-4 pt-4">
          {/* MAIN CONTENT - Glass card */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={!isLoading ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
            transition={{ duration: 1.2, delay: !isLoading ? 0.6 : 0, ease: "easeOut" }}
            className="w-full max-w-lg"
          >
            {/* Liquid Glass Card Container */}
            <div className="relative">
              {/* Subtle ambient glow effect behind card */}
              <motion.div
                animate={{
                  opacity: [0.15, 0.25, 0.15],
                  scale: [1, 1.01, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -inset-1 rounded-3xl blur-2xl opacity-30"
                style={{
                  background: "linear-gradient(135deg, rgba(255, 180, 50, 0.15) 0%, rgba(255, 140, 0, 0.1) 50%, rgba(212, 175, 55, 0.15) 100%)"
                }}
              />

              {/* Main glass card - subtle blend with background */}
              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.02) 50%, rgba(255, 255, 255, 0.03) 100%)",
                  backdropFilter: "blur(12px) saturate(130%)",
                  WebkitBackdropFilter: "blur(12px) saturate(130%)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  boxShadow: `
                    0 4px 20px rgba(0, 0, 0, 0.15),
                    0 0 0 1px rgba(255, 255, 255, 0.02),
                    inset 0 1px 0 rgba(255, 255, 255, 0.04)
                  `
                }}
              >
                {/* Card content */}
                <div className="relative px-4 py-5">
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.8, delay: !isLoading ? 0.8 : 0 }}
                    className="flex justify-center mb-4"
                  >
                    <span
                      className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] uppercase px-4 py-2 rounded-full border"
                      style={{
                        borderColor: "rgba(255, 180, 50, 0.4)",
                        background: "rgba(255, 180, 50, 0.12)",
                        color: "#FFB832",
                        boxShadow: "0 4px 20px rgba(255, 180, 50, 0.15)"
                      }}
                    >
                      ✦ Celebrating 25 Years ✦
                    </span>
                  </motion.div>

                  {/* Main title with gold gradient */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 1, delay: !isLoading ? 1 : 0, ease: "easeOut" }}
                    className="text-center mb-2"
                  >
                    <div
                      className="font-instrument-serif text-3xl font-bold leading-tight"
                      style={{
                        background: "linear-gradient(135deg, #FFD700 0%, #FFA500 30%, #FF8C00 60%, #D4AF37 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        filter: "drop-shadow(0 2px 20px rgba(255, 165, 0, 0.4))"
                      }}
                      role="heading"
                      aria-level={1}
                    >
                      Shree Ghanshyam Maharaj
                    </div>
                  </motion.div>

                  {/* Event name */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.8, delay: !isLoading ? 1.2 : 0, ease: "easeOut" }}
                    className="text-center text-2xl font-instrument-serif tracking-wide mb-1"
                    style={{
                      color: "rgba(255, 255, 255, 0.95)",
                      textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)"
                    }}
                  >
                    Rajat Pratishtha Mahotsav
                  </motion.p>

                  {/* Location */}
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.8, delay: !isLoading ? 1.3 : 0, ease: "easeOut" }}
                    className="text-center text-xl font-instrument-serif tracking-wide"
                    style={{
                      color: "rgba(255, 255, 255, 0.95)",
                    }}
                  >
                    Shree Swaminarayan Temple
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.8, delay: !isLoading ? 1.3 : 0, ease: "easeOut" }}
                    className="text-center text-xl font-instrument-serif tracking-wide mb-5"
                    style={{
                      color: "rgba(255, 255, 255, 0.95)",
                    }}
                  >
                    Secaucus, New Jersey
                  </motion.p>

                  {/* Countdown timer */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.8, delay: !isLoading ? 1.4 : 0, ease: "easeOut" }}
                    className="flex justify-center mb-5"
                  >
                    <CountdownTimer targetDate={targetDate} />
                  </motion.div>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.8, delay: !isLoading ? 1.5 : 0, ease: "easeOut" }}
                    className="flex flex-row justify-center gap-5"
                  >
                    <Link
                      href="/registration"
                      className="group relative isolate inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-sans font-bold text-sm overflow-hidden transition-all border duration-300 hover:-translate-y-0.5 hover:scale-[1.03] active:scale-[0.99] shadow-[0_10px_26px_rgba(212,140,18,0.28)]"
                      style={{
                        borderColor: "rgba(226, 170, 70, 0.7)",
                        background: "linear-gradient(135deg, rgba(220, 160, 70, 0.92), rgba(191, 115, 20, 0.9))",
                        color: "#FFFFFF"
                      }}
                    >
                      <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.22),transparent_55%)] opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
                      <span className="relative z-10 drop-shadow-[0_1px_1px_rgba(85,45,0,0.45)]">Register Now</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 relative z-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/35 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </Link>

                    <Link
                      href="/about"
                      className="group relative isolate inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-sans font-bold text-sm overflow-hidden transition-all border duration-300 hover:-translate-y-0.5 hover:scale-[1.03] active:scale-[0.99]"
                      style={{
                        borderColor: "rgba(255, 200, 90, 0.5)",
                        background: "rgba(255, 195, 80, 0.18)",
                        color: "#FFD88A",
                        boxShadow: "0 6px 18px rgba(255, 180, 50, 0.22)"
                      }}
                    >
                      <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,230,170,0.28),transparent_60%)] opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                      <span className="relative z-10">About the Mahotsav</span>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 relative z-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
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
