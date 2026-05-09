"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowUpRight, Leaf, Sprout, TreePine, Quote, Calendar, MapPin, Users } from "lucide-react"

/**
 * Tree Plantation Program — 25 Years of Roots
 *
 * Aesthetic direction: "Editorial Verdant" — a sophisticated magazine-style
 * tribute that pairs deep forest greens, parchment cream, and the temple's
 * signature gold. Inspired by long-form editorial spreads (think National
 * Geographic meets a refined spiritual journal) rather than typical "eco"
 * pages.
 *
 * IMAGE PLACEHOLDERS:
 * The `placeholderImages` array below holds Unsplash filler photos. Swap each
 * `src` with a Cloudflare image (use `getCloudflareImage(id)` from
 * @/lib/cdn-assets) when the real photos are uploaded. Captions/credits can
 * stay or be updated.
 *
 * VIDEO:
 * `youtubeId` points to the program recap. Replace if a different video is
 * preferred.
 */

const youtubeId = "ueEYFdaFSg0"

type Placeholder = {
  src: string
  alt: string
  caption?: string
  credit?: string
}

// Filler images — replace these with Cloudflare image IDs once uploaded.
const placeholderImages: Record<string, Placeholder> = {
  hero: {
    src: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=2400&q=80",
    alt: "Volunteers planting saplings in a sunlit field",
    caption: "Volunteers gather at sunrise to plant saplings.",
  },
  story1: {
    src: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1600&q=80",
    alt: "A young sapling emerging from rich soil",
    caption: "A sapling breaks the soil — a quiet beginning.",
  },
  story2: {
    src: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1600&q=80",
    alt: "Hands cradling a young plant in soil",
    caption: "Devotees prepare the earth with care and prayer.",
  },
  gallery1: {
    src: "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deae?auto=format&fit=crop&w=1400&q=80",
    alt: "Family planting a tree together",
    caption: "Three generations, one root system.",
  },
  gallery2: {
    src: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1400&q=80",
    alt: "Sunlight through young forest canopy",
  },
  gallery3: {
    src: "https://images.unsplash.com/photo-1508497185412-22ea30b5f8b1?auto=format&fit=crop&w=1400&q=80",
    alt: "Children watering newly planted saplings",
    caption: "The next generation tends what we plant today.",
  },
  gallery4: {
    src: "https://images.unsplash.com/photo-1523301343968-6a6ebf63c672?auto=format&fit=crop&w=1400&q=80",
    alt: "Volunteers in conversation under a tree",
  },
  gallery5: {
    src: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1400&q=80",
    alt: "A canopy of mature trees catching late afternoon light",
    caption: "What we plant in 2026 will canopy our 50th.",
  },
  closing: {
    src: "https://images.unsplash.com/photo-1473773508845-188df298d2d1?auto=format&fit=crop&w=2400&q=80",
    alt: "Sun-dappled forest path",
  },
}

const stats: { value: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "25", label: "Years of Service", icon: Calendar },
  { value: "150+", label: "Trees Planted", icon: TreePine },
  { value: "200+", label: "Volunteers", icon: Users },
  { value: "1", label: "Living Legacy", icon: Sprout },
]

export default function TreePlantingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const heroImageY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"])
  const heroOverlayOpacity = useTransform(scrollYProgress, [0, 1], [0.55, 0.85])
  const heroTextY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"])

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div
      className="relative min-h-screen overflow-x-clip"
      style={{
        background:
          "radial-gradient(1200px 600px at 80% -10%, rgba(212,175,55,0.08), transparent 60%), radial-gradient(900px 500px at -10% 110%, rgba(60,90,55,0.10), transparent 60%), #f4f1e6",
        color: "#1a2f1d",
      }}
    >
      {/* Subtle paper grain — purely decorative */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.07] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.16 0 0 0 0 0.11 0 0 0 0.85 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ===================== HERO ===================== */}
      <section
        ref={heroRef}
        className="relative h-[100svh] min-h-[640px] w-full overflow-hidden"
        style={{ backgroundColor: "#0e1a10" }}
      >
        {/* Parallax background image */}
        <motion.div
          style={{ y: heroImageY }}
          className="absolute inset-0 -top-[10%] h-[120%]"
        >
          <img
            src={placeholderImages.hero.src}
            alt={placeholderImages.hero.alt}
            className="h-full w-full object-cover"
            loading="eager"
          />
        </motion.div>

        {/* Multi-layer overlay for depth */}
        <motion.div
          style={{ opacity: heroOverlayOpacity }}
          className="absolute inset-0"
          aria-hidden
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(14,26,16,0.65) 0%, rgba(14,26,16,0.35) 35%, rgba(14,26,16,0.55) 70%, rgba(14,26,16,0.95) 100%)",
            }}
          />
          <div
            className="absolute inset-0 mix-blend-multiply"
            style={{
              background:
                "radial-gradient(ellipse at 30% 30%, rgba(20,40,22,0) 0%, rgba(20,40,22,0.45) 70%)",
            }}
          />
        </motion.div>

        {/* Decorative top frame */}
        <div className="absolute inset-x-0 top-0 z-20 px-6 pt-[max(7rem,calc(var(--navbar-height)+0.5rem))] sm:px-10">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between text-[10px] uppercase tracking-[0.4em] text-[#e9e4d3]/70 sm:text-xs">
            <span className="hidden sm:inline">Vol. XXV — Anniversary Edition</span>
            <span className="hidden sm:inline">№ 001 — Stewardship</span>
            <span className="ml-auto sm:ml-0">2026</span>
          </div>
        </div>

        {/* Hero copy */}
        <motion.div
          style={{ y: heroTextY }}
          className="relative z-10 flex h-full flex-col justify-end px-6 pb-16 sm:px-10 sm:pb-20 lg:pb-28"
        >
          <div className="mx-auto w-full max-w-[1400px]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3"
            >
              <span className="h-px w-10 bg-[#d4af37]" />
              <span className="text-[11px] font-medium uppercase tracking-[0.4em] text-[#d4af37] sm:text-xs">
                A 25th Anniversary Plantation Program
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 font-instrument-serif font-normal leading-[0.95] tracking-tight text-[#f5efe0]"
              style={{ fontSize: "clamp(3rem, 11vw, 9.5rem)" }}
            >
              Twenty‑five
              <br />
              <span className="italic text-[#d4af37]">years</span>, taking
              <br />
              <span className="italic">root</span>.
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 grid max-w-3xl gap-6 sm:grid-cols-[1fr_auto] sm:items-end"
            >
              <p className="font-figtree text-base leading-relaxed text-[#e9e4d3]/85 sm:text-lg">
                In gratitude for a quarter‑century of seva, the Shree Swaminarayan
                Temple of Secaucus gathered to plant a living tribute — one tree
                for every year of devotion, and a forest of hope for the years
                still to come.
              </p>

              <a
                href="#story"
                className="group inline-flex items-center gap-3 self-start rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#f5efe0] backdrop-blur-sm transition hover:border-[#d4af37] hover:bg-[#d4af37]/20"
              >
                Read the story
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[#d4af37] text-[#0e1a10] transition group-hover:rotate-45">
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                </span>
              </a>
            </motion.div>

            {/* Hero meta strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={mounted ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-[#e9e4d3]/15 pt-6 text-[11px] uppercase tracking-[0.3em] text-[#e9e4d3]/65 sm:text-xs"
            >
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                Spring 2026
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                Secaucus, New Jersey
              </span>
              <span className="inline-flex items-center gap-2">
                <Leaf className="h-3.5 w-3.5 text-[#d4af37]" />
                Community Seva
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={mounted ? { opacity: 1 } : {}}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 sm:block"
        >
          <div className="flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-[#e9e4d3]/60">
            <span>Scroll</span>
            <span className="block h-8 w-px animate-pulse bg-[#d4af37]/60" />
          </div>
        </motion.div>
      </section>

      {/* ===================== STATS RIBBON ===================== */}
      <section
        className="relative z-10 -mt-px"
        style={{
          background:
            "linear-gradient(180deg, #0e1a10 0%, #142019 100%)",
          color: "#e9e4d3",
        }}
      >
        <div className="mx-auto max-w-[1400px] px-6 py-12 sm:px-10 sm:py-16">
          <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4">
            {stats.map((s, i) => {
              const Icon = s.icon
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                  className="relative flex flex-col items-center text-center sm:flex-row sm:items-end sm:gap-5 sm:text-left"
                >
                  {/* Vertical divider for desktop */}
                  {i > 0 && (
                    <span className="absolute -left-px top-1/2 hidden h-12 w-px -translate-y-1/2 bg-[#e9e4d3]/15 sm:block" />
                  )}
                  <Icon className="mb-2 h-5 w-5 text-[#d4af37] sm:mb-1 sm:h-6 sm:w-6" />
                  <div>
                    <div
                      className="font-instrument-serif font-normal leading-none text-[#f5efe0]"
                      style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)" }}
                    >
                      {s.value}
                    </div>
                    <div className="mt-2 text-[10px] uppercase tracking-[0.3em] text-[#e9e4d3]/60 sm:text-xs">
                      {s.label}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===================== EDITORIAL STORY ===================== */}
      <section id="story" className="relative z-10 px-6 py-24 sm:px-10 sm:py-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid gap-x-12 gap-y-16 lg:grid-cols-12">
            {/* Section number + label */}
            <div className="lg:col-span-3">
              <div className="sticky top-32">
                <div className="text-[10px] uppercase tracking-[0.4em] text-[#3e5e3a]/70">
                  № 01
                </div>
                <div
                  className="mt-3 font-instrument-serif italic text-[#3e5e3a]"
                  style={{ fontSize: "clamp(1.25rem, 2vw, 1.75rem)" }}
                >
                  The Beginning
                </div>
                <div className="mt-6 h-px w-16 bg-[#3e5e3a]/30" />
              </div>
            </div>

            {/* Body copy */}
            <div className="lg:col-span-6">
              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="font-instrument-serif font-normal leading-[1.05] tracking-tight text-[#1a2f1d]"
                style={{ fontSize: "clamp(2rem, 4.2vw, 3.75rem)" }}
              >
                A quiet act of devotion, with{" "}
                <span className="italic text-[#3e5e3a]">deep roots</span>.
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="prose prose-lg mt-10 max-w-none font-figtree text-[#293340]"
              >
                <p className="text-lg leading-relaxed sm:text-xl sm:leading-[1.7]">
                  <span className="font-instrument-serif text-5xl leading-none float-left mr-3 mt-1 text-[#3e5e3a]">
                    O
                  </span>
                  n a clear morning this spring, members of the Shree Swaminarayan
                  Temple of Secaucus gathered with shovels in hand and prayers
                  in heart. The occasion: twenty‑five years since the temple
                  first opened its doors. The offering: a living one — saplings
                  pressed gently into soil, watered, and consecrated.
                </p>

                <p className="mt-6 text-base leading-[1.8] text-[#293340]/85 sm:text-lg">
                  <em className="font-instrument-serif italic text-[#3e5e3a]">
                    [Article copy will be placed here.]
                  </em>{" "}
                  This is a placeholder for the full write‑up. Replace this
                  paragraph with the temple’s article describing the day —
                  the participants, the species planted, the blessings offered,
                  and the vision for the canopy still to come.
                </p>

                <p className="mt-6 text-base leading-[1.8] text-[#293340]/85 sm:text-lg">
                  Add as many paragraphs as the article requires. The editorial
                  layout is designed to breathe with longer prose, pull‑quotes,
                  and image breaks. The page will adapt gracefully.
                </p>
              </motion.div>
            </div>

            {/* Side image */}
            <motion.figure
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="relative overflow-hidden rounded-sm shadow-[0_30px_60px_-30px_rgba(26,47,29,0.4)]">
                <img
                  src={placeholderImages.story1.src}
                  alt={placeholderImages.story1.alt}
                  className="aspect-[3/4] w-full object-cover"
                />
              </div>
              {placeholderImages.story1.caption && (
                <figcaption className="mt-3 font-instrument-serif text-sm italic text-[#3e5e3a]/80">
                  {placeholderImages.story1.caption}
                </figcaption>
              )}
            </motion.figure>
          </div>

          {/* Pull quote */}
          <motion.blockquote
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative mx-auto mt-28 max-w-4xl px-6 text-center"
          >
            <Quote
              className="mx-auto mb-6 h-10 w-10 text-[#d4af37]"
              strokeWidth={1.25}
            />
            <p
              className="font-instrument-serif italic leading-[1.15] text-[#1a2f1d]"
              style={{ fontSize: "clamp(1.75rem, 4.5vw, 3.5rem)" }}
            >
              “The truest seva is the kind whose fruit you will never taste —
              you plant it for those who come after.”
            </p>
            <div className="mx-auto mt-8 flex items-center justify-center gap-4">
              <span className="h-px w-10 bg-[#3e5e3a]/40" />
              <span className="text-[11px] uppercase tracking-[0.4em] text-[#3e5e3a]/70">
                A Reflection
              </span>
              <span className="h-px w-10 bg-[#3e5e3a]/40" />
            </div>
          </motion.blockquote>
        </div>
      </section>

      {/* ===================== VIDEO ===================== */}
      <section className="relative z-10 px-6 pb-24 sm:px-10 sm:pb-32">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-10 grid gap-x-12 gap-y-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-3">
              <div className="text-[10px] uppercase tracking-[0.4em] text-[#3e5e3a]/70">
                № 02
              </div>
              <div
                className="mt-3 font-instrument-serif italic text-[#3e5e3a]"
                style={{ fontSize: "clamp(1.25rem, 2vw, 1.75rem)" }}
              >
                Watch
              </div>
              <div className="mt-6 h-px w-16 bg-[#3e5e3a]/30" />
            </div>
            <h2
              className="font-instrument-serif font-normal leading-[1.05] tracking-tight text-[#1a2f1d] lg:col-span-9"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
            >
              The day, captured in <span className="italic">motion</span>.
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="relative"
          >
            {/* Decorative frame */}
            <div
              aria-hidden
              className="absolute -inset-3 rounded-sm sm:-inset-5"
              style={{
                background:
                  "linear-gradient(135deg, #d4af37 0%, #3e5e3a 50%, #1a2f1d 100%)",
                opacity: 0.5,
              }}
            />
            <div
              className="relative overflow-hidden rounded-sm bg-[#0e1a10]"
              style={{ aspectRatio: "16 / 9" }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                title="Tree Plantation Program — Recap"
                frameBorder={0}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </motion.div>

          <p className="mx-auto mt-6 max-w-2xl text-center font-instrument-serif text-sm italic text-[#3e5e3a]/80">
            A short film documenting the morning of plantation, the volunteers,
            and the prayers offered with each sapling.
          </p>
        </div>
      </section>

      {/* ===================== EDITORIAL GALLERY ===================== */}
      <section
        className="relative z-10 px-6 py-24 sm:px-10 sm:py-32"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(62,94,58,0.06) 25%, rgba(62,94,58,0.10) 75%, transparent 100%)",
        }}
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12 grid gap-x-12 gap-y-6 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-3">
              <div className="text-[10px] uppercase tracking-[0.4em] text-[#3e5e3a]/70">
                № 03
              </div>
              <div
                className="mt-3 font-instrument-serif italic text-[#3e5e3a]"
                style={{ fontSize: "clamp(1.25rem, 2vw, 1.75rem)" }}
              >
                The Day
              </div>
              <div className="mt-6 h-px w-16 bg-[#3e5e3a]/30" />
            </div>
            <div className="lg:col-span-9">
              <h2
                className="font-instrument-serif font-normal leading-[1.05] tracking-tight text-[#1a2f1d]"
                style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
              >
                Earth, hands, <span className="italic">light</span>.
              </h2>
              <p className="mt-4 max-w-2xl font-figtree text-base leading-relaxed text-[#293340]/80 sm:text-lg">
                A photographic record of the morning. (Photographs to be replaced
                with the temple’s own. The grid will accommodate any number — add
                or remove tiles as needed.)
              </p>
            </div>
          </div>

          {/* Asymmetric editorial grid */}
          <div className="grid grid-cols-12 grid-rows-[repeat(8,minmax(70px,auto))] gap-3 sm:gap-4">
            <GalleryTile
              data={placeholderImages.gallery1}
              className="col-span-12 row-span-3 sm:col-span-7 sm:row-span-4"
              priority
            />
            <GalleryTile
              data={placeholderImages.gallery2}
              className="col-span-6 row-span-2 sm:col-span-5 sm:row-span-2"
            />
            <GalleryTile
              data={placeholderImages.gallery3}
              className="col-span-6 row-span-2 sm:col-span-5 sm:row-span-2"
            />
            <GalleryTile
              data={placeholderImages.gallery4}
              className="col-span-6 row-span-2 sm:col-span-4 sm:row-span-3"
            />
            <GalleryTile
              data={placeholderImages.gallery5}
              className="col-span-6 row-span-3 sm:col-span-8 sm:row-span-3"
            />
          </div>
        </div>
      </section>

      {/* ===================== CLOSING ===================== */}
      <section className="relative z-10 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={placeholderImages.closing.src}
            alt={placeholderImages.closing.alt}
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(14,26,16,0.85) 0%, rgba(14,26,16,0.75) 50%, rgba(14,26,16,0.95) 100%)",
            }}
          />
        </div>

        <div className="relative mx-auto max-w-[1400px] px-6 py-28 text-center sm:px-10 sm:py-40">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <Sprout className="mx-auto h-9 w-9 text-[#d4af37]" strokeWidth={1.5} />
            <h2
              className="mx-auto mt-8 max-w-4xl font-instrument-serif font-normal leading-[1.05] text-[#f5efe0]"
              style={{ fontSize: "clamp(2.25rem, 6vw, 5.5rem)" }}
            >
              May every leaf be a <span className="italic text-[#d4af37]">prayer</span>.
            </h2>
            <p className="mx-auto mt-8 max-w-2xl font-figtree text-base leading-relaxed text-[#e9e4d3]/80 sm:text-lg">
              The trees we planted will grow with us through the next chapter of
              the temple’s story. Join us as we continue to sow seeds of devotion,
              service, and stewardship.
            </p>

            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/community-seva"
                className="group inline-flex items-center gap-3 rounded-full border border-[#d4af37] bg-[#d4af37] px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#0e1a10] transition hover:bg-transparent hover:text-[#d4af37]"
              >
                Volunteer with us
                <ArrowUpRight
                  className="h-4 w-4 transition group-hover:rotate-45"
                  strokeWidth={2.5}
                />
              </Link>
              <Link
                href="/latest-events"
                className="group inline-flex items-center gap-3 rounded-full border border-[#e9e4d3]/30 bg-transparent px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#f5efe0] transition hover:border-[#d4af37]/60 hover:text-[#d4af37]"
              >
                More events
                <ArrowUpRight
                  className="h-4 w-4 transition group-hover:rotate-45"
                  strokeWidth={2.5}
                />
              </Link>
            </div>

            <div className="mx-auto mt-16 flex max-w-md items-center justify-center gap-4 text-[10px] uppercase tracking-[0.4em] text-[#e9e4d3]/50">
              <span className="h-px flex-1 bg-[#e9e4d3]/20" />
              <span>Shree Swaminarayan Temple — Secaucus</span>
              <span className="h-px flex-1 bg-[#e9e4d3]/20" />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

function GalleryTile({
  data,
  className,
  priority = false,
}: {
  data: Placeholder
  className?: string
  priority?: boolean
}) {
  return (
    <motion.figure
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-sm bg-[#1a2f1d]/5 shadow-[0_20px_50px_-30px_rgba(26,47,29,0.55)] ${className ?? ""}`}
    >
      <img
        src={data.src}
        alt={data.alt}
        loading={priority ? "eager" : "lazy"}
        className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"
      />
      {data.caption && (
        <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-[#0e1a10]/85 via-[#0e1a10]/50 to-transparent px-4 py-3 text-xs italic text-[#f5efe0] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:text-sm">
          <span className="font-instrument-serif">{data.caption}</span>
        </figcaption>
      )}
    </motion.figure>
  )
}
