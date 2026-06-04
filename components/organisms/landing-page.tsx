"use client"

import { motion } from "framer-motion"
import { useLoading } from "@/hooks/use-loading"
import CountdownTimer from "@/components/molecules/countdown-timer"
import Link from "next/link"
import { Skiper53 } from "@/components/ui/skiper-ui/skiper53"

interface TitleSectionProps {
  targetDate?: string
}

export default function TitleSection({ targetDate = "2026-07-27T07:30:00-04:00" }: TitleSectionProps) {
  const { isLoading } = useLoading()

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Top fade overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800/40 to-transparent z-10 pointer-events-none" style={{ height: '20%' }} />

      {/* Skiper53 - constrained to top 65% of viewport */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={!isLoading ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute top-0 left-0 right-0 z-[1]"
        style={{ height: "65vh" }}
      >
        <Skiper53 fullscreen className="bg-transparent" />
      </motion.div>

      {/* Smooth fade overlay on Skiper53 - blend edges to slate-900 */}
      <div
        className="absolute top-0 left-0 right-0 z-[2] pointer-events-none"
        style={{
          height: "60vh",
          background: `
            linear-gradient(to bottom, rgba(15, 23, 42, 0.6) 0%, transparent 12%, transparent 55%, rgba(15, 23, 42, 1) 100%),
            linear-gradient(to right, rgba(15, 23, 42, 0.5) 0%, transparent 15%, transparent 85%, rgba(15, 23, 42, 0.5) 100%)
          `
        }}
      />

      {/* Bottom 40% - Glass card section */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-slate-900" style={{ height: "40vh" }}>
        <div className="h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
          {/* MAIN CONTENT - Glass card */}
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={!isLoading ? { y: 0, opacity: 1 } : { y: 60, opacity: 0 }}
            transition={{ duration: 1.2, delay: !isLoading ? 0.6 : 0, ease: "easeOut" }}
            className="w-full max-w-6xl xl:max-w-7xl pointer-events-none"
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
                className="relative rounded-2xl sm:rounded-3xl overflow-hidden"
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

                {/* Card content - Horizontal layout */}
                <div className="relative px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-6">
                  {/* Two-column layout for desktop */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4 xl:gap-8">

                    {/* LEFT COLUMN - Event info */}
                    <div className="flex-1 lg:pr-4 xl:pr-6">
                      {/* Badge */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.8, delay: !isLoading ? 0.8 : 0 }}
                        className="flex justify-center lg:justify-start mb-3"
                      >
                        <span
                          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase px-5 py-2 sm:px-6 sm:py-2.5 rounded-full border"
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

                      {/* Main title */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 1, delay: !isLoading ? 1 : 0, ease: "easeOut" }}
                        className="text-center lg:text-left mb-2"
                      >
                        <h1
                          className="font-instrument-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight whitespace-nowrap"
                          style={{
                            background: "linear-gradient(135deg, #FFD700 0%, #FFA500 30%, #FF8C00 60%, #D4AF37 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            filter: "drop-shadow(0 2px 20px rgba(255, 165, 0, 0.4))"
                          }}
                        >
                          Shree Ghanshyam Maharaj
                        </h1>
                      </motion.div>

                      {/* Event name */}
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.8, delay: !isLoading ? 1.2 : 0, ease: "easeOut" }}
                        className="text-center lg:text-left text-xl sm:text-2xl md:text-3xl lg:text-4xl font-instrument-serif tracking-wide mb-2"
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
                        className="text-center lg:text-left text-lg sm:text-xl md:text-2xl lg:text-3xl font-instrument-serif tracking-wide"
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
                        className="text-center lg:text-left text-lg sm:text-xl md:text-2xl lg:text-3xl font-instrument-serif tracking-wide"
                        style={{
                          color: "rgba(255, 255, 255, 0.95)",
                        }}
                      >
                        Secaucus, New Jersey
                      </motion.p>
                    </div>

                    {/* Vertical divider for desktop */}
                    <div className="hidden lg:block w-px bg-white/10 self-stretch my-2" />

                    {/* RIGHT COLUMN - Countdown & Buttons */}
                    <div className="flex-shrink-0 lg:pl-6 mt-4 lg:mt-0">
                      {/* Countdown timer */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.8, delay: !isLoading ? 1.4 : 0, ease: "easeOut" }}
                        className="flex justify-center lg:justify-start mb-4"
                      >
                        <CountdownTimer targetDate={targetDate} />
                      </motion.div>

                      {/* CTA Buttons - stacked on right column */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.8, delay: !isLoading ? 1.5 : 0, ease: "easeOut" }}
                        className="flex flex-row gap-3 justify-center lg:justify-start pointer-events-auto"
                      >
                        <Link
                          href="/registration"
                          className="group relative isolate inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full px-6 sm:px-7 py-2.5 sm:py-3 font-sans font-bold text-sm sm:text-base text-slate-900 overflow-hidden transition-all border duration-300 hover:-translate-y-0.5 hover:scale-[1.03] active:scale-[0.99] shadow-[0_10px_26px_rgba(212,140,18,0.28)]"
                          style={{
                            borderColor: "rgba(226, 170, 70, 0.7)",
                            background: "linear-gradient(135deg, rgba(220, 160, 70, 0.92), rgba(191, 115, 20, 0.9))",
                            color: "#FFFFFF"
                          }}
                        >
                          <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.22),transparent_55%)] opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
                          <span className="relative z-10 drop-shadow-[0_1px_1px_rgba(85,45,0,0.45)]">Register Now</span>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 group-hover:translate-x-1 transition-transform">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/35 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        </Link>

                        <Link
                          href="/about"
                          className="group relative isolate inline-flex items-center justify-center gap-2 sm:gap-3 rounded-full px-6 sm:px-7 py-2.5 sm:py-3 font-sans font-bold text-sm sm:text-base text-slate-900 overflow-hidden transition-all border duration-300 hover:-translate-y-0.5 hover:scale-[1.03] active:scale-[0.99]"
                          style={{
                            borderColor: "rgba(255, 200, 90, 0.5)",
                            background: "rgba(255, 195, 80, 0.18)",
                            color: "#FFD88A",
                            boxShadow: "0 6px 18px rgba(255, 180, 50, 0.22)"
                          }}
                        >
                          <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,230,170,0.28),transparent_60%)] opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                          <span className="relative z-10">About the Mahotsav</span>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 group-hover:translate-x-1 transition-transform">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                          </svg>
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        </Link>
                      </motion.div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
