"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Camera, ArrowRight } from "lucide-react"

export default function ShareMemoriesCTA() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="w-full bg-main-page-bg px-4 pb-24 pt-10 sm:px-6 sm:pb-32 lg:px-8"
      aria-labelledby="share-memories-cta-heading"
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative mx-auto max-w-5xl"
      >
        {/* soft gradient halo */}
        <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-r from-orange-200/40 via-amber-100/30 to-red-200/40 opacity-60 blur-2xl will-change-transform" />

        <div className="relative overflow-hidden rounded-[2rem] border-2 border-orange-200/80 bg-gradient-to-br from-white via-orange-50/60 to-red-50/50 px-6 py-12 shadow-xl backdrop-blur-sm sm:px-12 sm:py-16 lg:px-16">
          {/* decorative film-strip arcs */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full border-2 border-orange-200/60 opacity-50"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-16 -left-10 h-52 w-52 rounded-full border-2 border-red-200/60 opacity-40"
          />

          <div className="relative flex flex-col items-center gap-6 text-center">
            <motion.div
              initial={{ scale: 0.6, rotate: -6, opacity: 0 }}
              animate={
                visible
                  ? { scale: 1, rotate: 0, opacity: 1 }
                  : { scale: 0.6, rotate: -6, opacity: 0 }
              }
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/30 sm:h-20 sm:w-20"
            >
              <Camera className="h-8 w-8 text-white sm:h-10 sm:w-10" aria-hidden />
            </motion.div>

            <div className="space-y-3">
              <h2
                id="share-memories-cta-heading"
                className="bg-gradient-to-r from-orange-600 via-orange-700 to-red-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl lg:text-5xl"
                style={{ fontFamily: "var(--font-instrument-serif)" }}
              >
                Share Your NJ Mandir Memories
              </h2>
              <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-700 sm:text-lg">
                Send us photos and a short story from past celebrations and
                events. Help us build a living tribute to NJ Mandir's history,
                with your family's chapter included.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            >
              <Link
                href="/share-memories"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-orange-500/30 transition-all duration-300 hover:scale-[1.03] hover:from-orange-600 hover:to-red-600 hover:shadow-orange-500/50 sm:text-lg"
              >
                Share a Memory
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
