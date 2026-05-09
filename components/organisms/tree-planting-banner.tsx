"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, Leaf, Play, Sprout } from "lucide-react"

/**
 * Featured banner that links to the /tree-planting story page.
 *
 * Placed on the home page as a magazine-style "featured story" tile —
 * verdant editorial aesthetic that contrasts with the surrounding sections
 * while staying cohesive with the temple's gold accent palette.
 *
 * The featured image is a placeholder. Replace `featuredImage` with a
 * Cloudflare image URL once the temple's photo is uploaded.
 */
const featuredImage =
  "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1800&q=80"

export default function TreePlantingBanner() {
  return (
    <section className="relative w-full px-4 py-16 sm:py-24 md:py-28">
      <div className="mx-auto max-w-[1280px]">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href="/tree-planting"
            aria-label="Read the Tree Plantation Program story"
            className="group relative block overflow-hidden rounded-[6px] shadow-[0_40px_80px_-40px_rgba(14,26,16,0.55)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#d4af37]/40"
            style={{ backgroundColor: "#0e1a10" }}
          >
            <div className="relative grid min-h-[440px] grid-cols-1 md:min-h-[520px] md:grid-cols-12">
              {/* IMAGE SIDE */}
              <div className="relative md:col-span-7">
                <div className="relative h-64 w-full overflow-hidden md:absolute md:inset-0 md:h-full">
                  <img
                    src={featuredImage}
                    alt="Volunteers planting saplings to mark 25 years of seva"
                    className="h-full w-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-[1.05]"
                  />
                  {/* Overlay tint */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(14,26,16,0.35) 0%, rgba(14,26,16,0.15) 40%, rgba(14,26,16,0.55) 100%)",
                    }}
                  />
                  {/* Right fade into copy column on desktop */}
                  <div
                    className="absolute inset-y-0 right-0 hidden w-1/3 md:block"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, #0e1a10 100%)",
                    }}
                  />
                  {/* Bottom fade for mobile */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-1/2 md:hidden"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 0%, #0e1a10 100%)",
                    }}
                  />

                  {/* Play badge floating over image */}
                  <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-[#d4af37]/40 bg-[#0e1a10]/65 px-3 py-1.5 backdrop-blur-md">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-[#d4af37] text-[#0e1a10]">
                      <Play className="h-2.5 w-2.5 fill-current" strokeWidth={0} />
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#f5efe0] sm:text-xs">
                      Watch the recap
                    </span>
                  </div>
                </div>
              </div>

              {/* COPY SIDE */}
              <div className="relative flex flex-col justify-between p-7 sm:p-10 md:col-span-5 md:p-12">
                {/* Subtle decorative gold corner */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute right-0 top-0 h-24 w-24 opacity-30"
                  style={{
                    background:
                      "radial-gradient(circle at 100% 0%, rgba(212,175,55,0.6) 0%, transparent 60%)",
                  }}
                />

                <div>
                  <div className="flex items-center gap-2">
                    <Leaf className="h-3.5 w-3.5 text-[#d4af37]" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#d4af37] sm:text-[11px]">
                      Featured Story
                    </span>
                  </div>

                  <h2
                    className="mt-5 font-instrument-serif font-normal leading-[1.0] tracking-tight text-[#f5efe0]"
                    style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
                  >
                    Twenty‑five years,
                    <br />
                    <span className="italic text-[#d4af37]">taking root.</span>
                  </h2>

                  <p className="mt-5 max-w-md font-figtree text-sm leading-relaxed text-[#e9e4d3]/85 sm:text-base">
                    A community tree plantation program marking the temple’s
                    25th anniversary — one tree for every year of devotion, and
                    a forest of hope for the years still to come.
                  </p>

                  {/* Mini meta row */}
                  <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#e9e4d3]/15 pt-5 text-[10px] uppercase tracking-[0.3em] text-[#e9e4d3]/60 sm:text-[11px]">
                    <span className="inline-flex items-center gap-1.5">
                      <Sprout className="h-3 w-3 text-[#d4af37]" />
                      Plantation Program
                    </span>
                    <span>Spring 2026</span>
                  </div>
                </div>

                <div className="mt-8 inline-flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#f5efe0]">
                    Read the story
                  </span>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[#d4af37] text-[#0e1a10] transition-transform duration-500 group-hover:rotate-45 group-hover:scale-110">
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
