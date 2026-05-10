"use client"

import type { CSSProperties } from "react"

export type FlierVariant = "spotlight" | "triptych" | "featured" | "polaroid"

export interface FamilyFlierCardProps {
  variant: FlierVariant
  familyName: string
  message: string
  images: string[]
  location?: string
  yearsAttending?: string
  className?: string
}

export const FLIER_LIMITS: Record<
  FlierVariant,
  { name: number; message: number; location: number; images: [number, number] }
> = {
  spotlight: { name: 36, message: 90, location: 28, images: [1, 1] },
  triptych: { name: 36, message: 140, location: 28, images: [3, 3] },
  featured: { name: 36, message: 200, location: 28, images: [3, 3] },
  polaroid: { name: 32, message: 70, location: 24, images: [1, 3] },
}

const goldGradient =
  "linear-gradient(90deg, #fbbf24 0%, #f97316 50%, #fb7185 100%)"

const Ornament = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 120 12"
    className={className}
    fill="none"
    aria-hidden
    preserveAspectRatio="none"
  >
    <path
      d="M0 6 H44 M76 6 H120"
      stroke="url(#og)"
      strokeWidth="1"
      strokeLinecap="round"
    />
    <circle cx="60" cy="6" r="3" stroke="url(#og)" strokeWidth="1" fill="none" />
    <circle cx="60" cy="6" r="1.2" fill="#fbbf24" />
    <circle cx="50" cy="6" r="0.8" fill="#fbbf24" />
    <circle cx="70" cy="6" r="0.8" fill="#fbbf24" />
    <defs>
      <linearGradient id="og" x1="0" y1="0" x2="120" y2="0">
        <stop offset="0%" stopColor="#fbbf24" stopOpacity="0" />
        <stop offset="50%" stopColor="#fbbf24" stopOpacity="1" />
        <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
)

const EventBadge = ({ compact = false }: { compact?: boolean }) => (
  <div
    className={`inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] backdrop-blur-sm ${
      compact ? "px-2.5 py-1" : "px-3 py-1.5"
    }`}
  >
    <span
      className="h-1.5 w-1.5 rounded-full"
      style={{ background: "#fbbf24", boxShadow: "0 0 8px #fbbf24" }}
    />
    <span
      className={`font-semibold tracking-[0.18em] uppercase text-white/85 ${
        compact ? "text-[9px]" : "text-[10px]"
      }`}
    >
      NJ Rajat Mahotsav · 2026
    </span>
  </div>
)

const cardShell: CSSProperties = {
  aspectRatio: "16 / 9",
  background:
    "radial-gradient(120% 80% at 20% 10%, #142048 0%, #0B1B33 45%, #0D132D 100%)",
  boxShadow:
    "0 30px 80px -20px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06) inset",
}

function Spotlight({
  familyName,
  message,
  images,
  location,
}: FamilyFlierCardProps) {
  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl text-white"
      style={cardShell}
    >
      <img
        src={images[0]}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D132D] via-[#0D132D]/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0D132D]/85 via-transparent to-transparent" />

      <div className="relative flex h-full flex-col justify-between p-[4%]">
        <div className="flex items-start justify-between">
          <EventBadge />
          {location ? (
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/70">
              {location}
            </span>
          ) : null}
        </div>

        <div className="max-w-[62%]">
          <p
            className="mb-2 text-[11px] font-semibold uppercase tracking-[0.32em]"
            style={{
              backgroundImage: goldGradient,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Welcoming the
          </p>
          <h3
            className="font-[var(--font-instrument-serif)] leading-[1.02] tracking-tight"
            style={{ fontSize: "clamp(1.6rem, 4.4cqw, 3.4rem)" }}
          >
            {familyName}
          </h3>
          <div className="my-3 h-[2px] w-20 rounded-full" style={{ background: goldGradient }} />
          <p
            className="text-white/85 leading-snug"
            style={{ fontSize: "clamp(0.78rem, 1.55cqw, 1.05rem)" }}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}

function Triptych({
  familyName,
  message,
  images,
  location,
  yearsAttending,
}: FamilyFlierCardProps) {
  const pics = [images[0], images[1] ?? images[0], images[2] ?? images[0]]
  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl text-white"
      style={cardShell}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(251,191,36,0.18), transparent 70%)",
        }}
      />
      <div className="relative grid h-full grid-rows-[auto_1fr_auto] gap-[2.5%] p-[3.5%]">
        <div className="flex items-center justify-between">
          <EventBadge compact />
          {yearsAttending ? (
            <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] uppercase text-white/80">
              {yearsAttending}
            </span>
          ) : null}
        </div>

        <div className="grid grid-cols-3 gap-[2%]">
          {pics.map((src, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl ring-1 ring-white/10"
              style={{
                background: "#0B1B33",
                boxShadow: "0 16px 40px -12px rgba(0,0,0,0.55)",
              }}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          ))}
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3
              className="font-[var(--font-instrument-serif)] leading-[1.05] tracking-tight"
              style={{ fontSize: "clamp(1.3rem, 3.4cqw, 2.6rem)" }}
            >
              {familyName}
            </h3>
            {location ? (
              <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.22em] text-white/65">
                {location}
              </p>
            ) : null}
          </div>
          <p
            className="max-w-[58%] text-right text-white/85 leading-snug"
            style={{ fontSize: "clamp(0.72rem, 1.35cqw, 0.95rem)" }}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}

function Featured({
  familyName,
  message,
  images,
  location,
  yearsAttending,
}: FamilyFlierCardProps) {
  const pics = [images[0], images[1] ?? images[0], images[2] ?? images[0]]
  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl text-white"
      style={cardShell}
    >
      <div className="relative grid h-full grid-cols-12 gap-[1.5%] p-[2.5%]">
        <div className="relative col-span-7 overflow-hidden rounded-2xl ring-1 ring-white/10">
          <img src={pics[0]} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <div className="absolute left-0 right-0 bottom-0 p-[5%]">
            <EventBadge compact />
          </div>
        </div>

        <div className="col-span-5 flex flex-col gap-[3%]">
          <div className="grid grid-cols-2 gap-[3%] h-[42%]">
            {[pics[1], pics[2]].map((src, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-xl ring-1 ring-white/10"
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>

          <div
            className="flex flex-1 flex-col justify-between rounded-2xl p-[6%]"
            style={{
              background:
                "linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div>
              <p
                className="text-[10px] font-semibold uppercase tracking-[0.3em]"
                style={{
                  backgroundImage: goldGradient,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                In Attendance
              </p>
              <h3
                className="mt-1 font-[var(--font-instrument-serif)] leading-[1.05] tracking-tight"
                style={{ fontSize: "clamp(1.1rem, 2.6cqw, 1.95rem)" }}
              >
                {familyName}
              </h3>
              {location || yearsAttending ? (
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/60">
                  {[location, yearsAttending].filter(Boolean).join(" · ")}
                </p>
              ) : null}
              <div
                className="my-2 h-[2px] w-12 rounded-full"
                style={{ background: goldGradient }}
              />
              <p
                className="text-white/85 leading-snug"
                style={{ fontSize: "clamp(0.7rem, 1.25cqw, 0.9rem)" }}
              >
                {message}
              </p>
            </div>
            <Ornament className="mt-2 h-[8px] w-full opacity-70" />
          </div>
        </div>
      </div>
    </div>
  )
}

function Polaroid({
  familyName,
  message,
  images,
  location,
}: FamilyFlierCardProps) {
  const pics = images.slice(0, 3)
  while (pics.length < 3) pics.push(images[0])
  const tilts = ["-rotate-6", "rotate-2", "rotate-6"]
  const offsets = ["translate-y-2", "-translate-y-2", "translate-y-1"]

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl text-white"
      style={cardShell}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 80% 20%, rgba(251,113,133,0.18), transparent 60%), radial-gradient(50% 60% at 10% 90%, rgba(96,165,250,0.18), transparent 60%)",
        }}
      />
      <div className="relative grid h-full grid-cols-12 gap-[2%] p-[3.5%]">
        <div className="col-span-7 flex items-center justify-center">
          <div className="relative h-[88%] w-full">
            {pics.map((src, i) => {
              const positions = [
                "left-[2%] top-[8%]",
                "left-[28%] top-[2%]",
                "left-[54%] top-[12%]",
              ]
              return (
                <div
                  key={i}
                  className={`absolute ${positions[i]} ${tilts[i]} ${offsets[i]} w-[44%] rounded-[6px] bg-white p-[4%] pb-[14%] shadow-[0_18px_40px_rgba(0,0,0,0.55)] transition-transform`}
                  style={{ aspectRatio: "3 / 4" }}
                >
                  <div className="relative h-full w-full overflow-hidden bg-black/10">
                    <img
                      src={src}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="col-span-5 flex flex-col justify-center">
          <EventBadge compact />
          <p
            className="mt-3 italic text-white/80"
            style={{
              fontFamily: "var(--font-instrument-serif)",
              fontSize: "clamp(0.95rem, 2cqw, 1.3rem)",
            }}
          >
            With love from the
          </p>
          <h3
            className="font-[var(--font-instrument-serif)] leading-[1.02] tracking-tight"
            style={{
              fontSize: "clamp(1.5rem, 3.8cqw, 2.9rem)",
              backgroundImage: goldGradient,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {familyName}
          </h3>
          {location ? (
            <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.22em] text-white/60">
              {location}
            </p>
          ) : null}
          <Ornament className="my-3 h-[8px] w-2/3 opacity-80" />
          <p
            className="text-white/85 leading-snug"
            style={{ fontSize: "clamp(0.78rem, 1.5cqw, 1.05rem)" }}
          >
            {message}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function FamilyFlierCard(props: FamilyFlierCardProps) {
  const { variant, className = "" } = props
  return (
    <div className={className} style={{ containerType: "inline-size" }}>
      {variant === "spotlight" && <Spotlight {...props} />}
      {variant === "triptych" && <Triptych {...props} />}
      {variant === "featured" && <Featured {...props} />}
      {variant === "polaroid" && <Polaroid {...props} />}
    </div>
  )
}
