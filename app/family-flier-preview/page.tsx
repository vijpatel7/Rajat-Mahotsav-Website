"use client"

import { useState } from "react"
import FamilyFlierCard, {
  FLIER_LIMITS,
  type FlierVariant,
} from "@/components/molecules/family-flier-card"

const MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=900&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=900&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=900&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1543269664-647b9ba0b9cd?w=900&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529390079861-591de354faf5?w=900&q=80&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=900&q=80&auto=format&fit=crop",
]

type SampleContent = {
  familyName: string
  message: string
  location: string
  yearsAttending: string
}

const SAMPLES: Record<FlierVariant, SampleContent> = {
  spotlight: {
    familyName: "The Patel Family",
    message:
      "Jai Swaminarayan! Celebrating 25 sacred years with our temple family.",
    location: "Edison, NJ",
    yearsAttending: "Members since 2003",
  },
  triptych: {
    familyName: "The Shah Parivar",
    message:
      "Three generations, one devotion. Grateful for every aarti, every utsav, every moment of seva at our beloved temple.",
    location: "Secaucus, NJ",
    yearsAttending: "20 yrs",
  },
  featured: {
    familyName: "The Mehta Family",
    message:
      "From Mota Bapa's first darshan to Bapji's blessings — this temple has shaped our children, our marriages, and our hearts. Jai Ghanshyam Maharaj! Dhanyavaad for 25 years of love and seva. Here's to many more.",
    location: "Jersey City, NJ",
    yearsAttending: "Since 2001",
  },
  polaroid: {
    familyName: "The Joshi Family",
    message: "With folded hands and full hearts — Jai Swaminarayan!",
    location: "Iselin, NJ",
    yearsAttending: "",
  },
}

const VARIANT_META: Record<
  FlierVariant,
  { title: string; tagline: string; bestFor: string }
> = {
  spotlight: {
    title: "1. Spotlight",
    tagline: "One bold photo, short blessing",
    bestFor:
      "Single-photo submissions. The most cinematic option — works beautifully for solo or couple portraits.",
  },
  triptych: {
    title: "2. Triptych",
    tagline: "Three equal panels in a row",
    bestFor:
      "Three photos of equal importance — e.g., one per generation, or the same family at different events.",
  },
  featured: {
    title: "3. Featured + Two",
    tagline: "One hero image, two supporting, info panel",
    bestFor:
      "Submissions with one great group shot plus candid moments. Most room for a longer family message.",
  },
  polaroid: {
    title: "4. Polaroid Stack",
    tagline: "Tilted instant photos, handwritten feel",
    bestFor:
      "Warm, casual feel. Great for 1–3 photos and a short, heartfelt greeting.",
  },
}

const VARIANT_ORDER: FlierVariant[] = [
  "spotlight",
  "triptych",
  "featured",
  "polaroid",
]

function CharCounter({
  label,
  value,
  limit,
}: {
  label: string
  value: string
  limit: number
}) {
  const len = value.length
  const pct = Math.min(100, (len / limit) * 100)
  const over = len > limit
  const near = !over && pct > 85
  const color = over
    ? "bg-red-500"
    : near
      ? "bg-amber-400"
      : "bg-emerald-500"
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
        <span className="uppercase tracking-wider">{label}</span>
        <span
          className={
            over
              ? "text-red-600 font-semibold"
              : near
                ? "text-amber-600"
                : "text-slate-500"
          }
        >
          {len} / {limit}
        </span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full ${color} transition-all`}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
    </div>
  )
}

function EditableField({
  label,
  value,
  limit,
  onChange,
  textarea = false,
}: {
  label: string
  value: string
  limit: number
  onChange: (v: string) => void
  textarea?: boolean
}) {
  const Tag: any = textarea ? "textarea" : "input"
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
        {label}
      </label>
      <Tag
        value={value}
        onChange={(e: any) => onChange(e.target.value)}
        rows={textarea ? 3 : undefined}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
      />
      <CharCounter label={label} value={value} limit={limit} />
    </div>
  )
}

export default function FamilyFlierPreview() {
  const [content, setContent] = useState<Record<FlierVariant, SampleContent>>(
    SAMPLES,
  )

  const update = (
    variant: FlierVariant,
    field: keyof SampleContent,
    value: string,
  ) =>
    setContent((c) => ({ ...c, [variant]: { ...c[variant], [field]: value } }))

  return (
    <div className="min-h-screen bg-slate-50 pb-24 pt-32">
      <div className="mx-auto max-w-[1400px] px-6">
        <header className="mb-12 max-w-3xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            Internal · Concept Preview
          </p>
          <h1 className="mb-3 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Family Flier Card — Layout Variations
          </h1>
          <p className="text-slate-600 md:text-lg">
            Stadium-style screen flyers (16:9) for the Rajat Mahotsav big-screen
            rotation. Edit the text below each card to feel out the character
            limits, then pick a layout to take forward into the submission flow.
          </p>
        </header>

        <div className="mb-10 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Display format
            </p>
            <p className="mt-1 text-sm text-slate-800">
              16:9 — sized to fill a venue projector / LED wall
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Submission inputs
            </p>
            <p className="mt-1 text-sm text-slate-800">
              1–3 photos · family name · short message · city (optional)
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Mock images
            </p>
            <p className="mt-1 text-sm text-slate-800">
              Placeholders only — real submissions will replace them.
            </p>
          </div>
        </div>

        <div className="space-y-16">
          {VARIANT_ORDER.map((variant) => {
            const meta = VARIANT_META[variant]
            const limits = FLIER_LIMITS[variant]
            const data = content[variant]
            const imgRange =
              limits.images[0] === limits.images[1]
                ? `${limits.images[0]} photo${limits.images[0] > 1 ? "s" : ""}`
                : `${limits.images[0]}–${limits.images[1]} photos`

            return (
              <section key={variant} className="space-y-5">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                      {meta.title}
                    </h2>
                    <p className="text-slate-500">{meta.tagline}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-wider">
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-white">
                      {imgRange}
                    </span>
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-slate-700">
                      Name ≤ {limits.name}
                    </span>
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-slate-700">
                      Message ≤ {limits.message}
                    </span>
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
                  <FamilyFlierCard
                    variant={variant}
                    familyName={data.familyName}
                    message={data.message}
                    location={data.location}
                    yearsAttending={data.yearsAttending}
                    images={MOCK_IMAGES.slice(0, limits.images[1])}
                  />

                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Best for
                    </p>
                    <p className="mb-5 text-sm text-slate-700">{meta.bestFor}</p>

                    <div className="space-y-4">
                      <EditableField
                        label="Family name"
                        value={data.familyName}
                        limit={limits.name}
                        onChange={(v) => update(variant, "familyName", v)}
                      />
                      <EditableField
                        label="Message"
                        value={data.message}
                        limit={limits.message}
                        onChange={(v) => update(variant, "message", v)}
                        textarea
                      />
                      <EditableField
                        label="Location (optional)"
                        value={data.location}
                        limit={limits.location}
                        onChange={(v) => update(variant, "location", v)}
                      />
                    </div>
                  </div>
                </div>
              </section>
            )
          })}
        </div>

        <section className="mt-20 rounded-2xl border border-slate-200 bg-white p-8">
          <h2 className="mb-2 text-xl font-bold text-slate-900">
            Suggested character limits
          </h2>
          <p className="mb-6 text-sm text-slate-600">
            Based on what fits comfortably at typical viewing distance on a
            big screen. Going below these keeps things readable from the back
            of the hall.
          </p>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                <tr>
                  <th className="px-4 py-3">Layout</th>
                  <th className="px-4 py-3">Photos</th>
                  <th className="px-4 py-3">Family name</th>
                  <th className="px-4 py-3">Message</th>
                  <th className="px-4 py-3">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {VARIANT_ORDER.map((v) => {
                  const l = FLIER_LIMITS[v]
                  const range =
                    l.images[0] === l.images[1]
                      ? `${l.images[0]}`
                      : `${l.images[0]}–${l.images[1]}`
                  return (
                    <tr key={v}>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {VARIANT_META[v].title.replace(/^\d+\.\s/, "")}
                      </td>
                      <td className="px-4 py-3">{range}</td>
                      <td className="px-4 py-3">{l.name} chars</td>
                      <td className="px-4 py-3">{l.message} chars</td>
                      <td className="px-4 py-3">{l.location} chars</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
