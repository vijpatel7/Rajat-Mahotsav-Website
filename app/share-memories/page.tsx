"use client"

import { useEffect, useMemo, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { AnimatePresence, motion } from "framer-motion"
import { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input"
import { ChevronDown, Loader2, Send } from "lucide-react"

import { Input } from "@/components/atoms/input"
import { Label } from "@/components/atoms/label"
import { Textarea } from "@/components/atoms/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select"
import LazyPhoneInput from "@/components/molecules/lazy-phone-input"
import ImageUploadZone from "@/components/molecules/image-upload-zone"
import { Toaster } from "@/components/molecules/toaster"
import { useToast } from "@/hooks/use-toast"
import { supabasePublic as supabase } from "@/utils/supabase/public-client"
import {
  MANDAL_OPTIONS_BY_COUNTRY,
  SPECIAL_COUNTRY_MANDALS,
} from "@/lib/mandal-options"
import "@/styles/registration-theme.css"

type UploadUrl = {
  url: string
  key: string
  filename: string
  content_type: string
}

type ImageKeyEntry = {
  key: string
  filename: string
  content_type: string
  size_bytes: number
}

const CAPTION_MIN = 10
const CAPTION_MAX = 600

const FormSchema = z
  .object({
    familyName: z
      .string()
      .min(1, "Family name is required")
      .max(120, "Family name is too long"),
    village: z
      .string()
      .min(1, "Village or town is required")
      .max(120, "Village name is too long"),
    mandal: z.string().min(1, "Please select your mandal"),
    caption: z
      .string()
      .min(CAPTION_MIN, `Please write at least ${CAPTION_MIN} characters`)
      .max(CAPTION_MAX, `Please keep it under ${CAPTION_MAX} characters`),
    images: z
      .array(z.any())
      .min(1, "Please add at least one photo")
      .max(3, "You can add up to 3 photos"),
    contactName: z.string().optional(),
    contactEmail: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        "Please enter a valid email address"
      ),
    contactPhone: z
      .string()
      .optional()
      .refine(
        (val) => !val || isValidPhoneNumber(val),
        "Please enter a valid phone number"
      ),
    contactPhoneCountryCode: z.string().optional(),
  })
  .strict()

type FormData = z.infer<typeof FormSchema>

type MandalOption = { value: string; label: string; country: string }

function toStored(display: string): string {
  return display.toLowerCase().replace(/ /g, "-")
}

function buildMandalOptions(): { country: string; items: MandalOption[] }[] {
  const groups: { country: string; items: MandalOption[] }[] = []

  for (const [country, mandals] of Object.entries(MANDAL_OPTIONS_BY_COUNTRY)) {
    groups.push({
      country,
      items: mandals
        .map((m) => ({ value: toStored(m), label: m, country }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    })
  }

  const specials = Object.entries(SPECIAL_COUNTRY_MANDALS).map(
    ([country, mandal]) => ({
      country,
      items: [{ value: toStored(mandal), label: mandal, country }],
    })
  )

  return [...groups, ...specials].sort((a, b) =>
    a.country.localeCompare(b.country)
  )
}

const COUNTRY_LABELS: Record<string, string> = {
  usa: "United States",
  england: "United Kingdom",
  india: "India",
  australia: "Australia",
  canada: "Canada",
  kenya: "Kenya",
}

export default function ShareMemoriesPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  const mandalGroups = useMemo(buildMandalOptions, [])

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    defaultValues: {
      familyName: "",
      village: "",
      mandal: "",
      caption: "",
      images: [],
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      contactPhoneCountryCode: "",
    },
  })

  const captionValue = watch("caption") ?? ""

  useEffect(() => {
    setMounted(true)
  }, [])

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const files = data.images as File[]

      // 1. Ask the server for presigned PUT URLs (server also generates the submission UUID).
      const presignRes = await fetch(
        "/api/generate-content-submission-upload-urls",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            files: files.map((f) => ({
              name: f.name,
              type: f.type,
              size: f.size,
            })),
          }),
        }
      )

      if (!presignRes.ok) {
        const { error } = (await presignRes.json().catch(() => ({}))) as {
          error?: string
        }
        throw new Error(error || "Could not prepare upload.")
      }

      const { submissionId, uploadUrls } = (await presignRes.json()) as {
        submissionId: string
        uploadUrls: UploadUrl[]
      }

      if (!submissionId || !uploadUrls?.length) {
        throw new Error("Upload service returned an unexpected response.")
      }

      // 2. PUT every file directly to R2 in parallel.
      await Promise.all(
        files.map((file, index) => {
          const target = uploadUrls[index]
          return fetch(target.url, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type },
          }).then((res) => {
            if (!res.ok) {
              throw new Error(`Failed to upload ${file.name}`)
            }
          })
        })
      )

      // 3. Insert the row into Supabase. CHECK constraint requires 1-3 keys present.
      const imageKeys: ImageKeyEntry[] = uploadUrls.map((u, i) => ({
        key: u.key,
        filename: u.filename,
        content_type: u.content_type,
        size_bytes: files[i].size,
      }))

      let phoneNational = data.contactPhone || ""
      if (data.contactPhone && isValidPhoneNumber(data.contactPhone)) {
        try {
          const parsed = parsePhoneNumber(data.contactPhone)
          if (parsed) phoneNational = parsed.nationalNumber
        } catch {
          /* noop */
        }
      }

      const row = {
        id: submissionId,
        family_name: data.familyName.trim(),
        village: data.village.trim(),
        mandal: data.mandal,
        caption: data.caption.trim(),
        image_keys: imageKeys,
        uploader_name: data.contactName?.trim() || null,
        uploader_email: data.contactEmail?.trim() || null,
        uploader_phone_country_code: data.contactPhoneCountryCode || null,
        uploader_mobile_number: phoneNational || null,
        user_agent:
          typeof navigator !== "undefined" ? navigator.userAgent : null,
      }

      const { error: insertError } = await supabase
        .from("content_submissions")
        .insert([row])

      if (insertError) throw new Error(insertError.message)

      toast({
        title: "Thank you for sharing!",
        description:
          "Your memory has been received. Our team will review it before it appears on our channels.",
        className:
          "bg-green-500 text-white border-green-400 shadow-xl font-medium",
      })
      reset()
      setContactOpen(false)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Please try again in a moment."
      toast({
        title: "Submission failed",
        description: message,
        className:
          "bg-red-500 text-white border-red-400 shadow-xl font-medium",
      })
    } finally {
      setTimeout(() => setIsSubmitting(false), 600)
    }
  }

  if (!mounted) return null

  return (
    <>
      <div
        className="min-h-[calc(100vh+200px)] w-full reg-page-bg page-bg-extend"
        data-page="registration"
      >
        <div className="relative z-10 mx-auto max-w-7xl px-4 page-bottom-spacing sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="text-center page-header-spacing">
            <motion.h1
              className="standard-page-title reg-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Share Your Mahotsav Memories
            </motion.h1>

            <motion.div
              className="mt-8 flex justify-center px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            >
              <p className="max-w-3xl text-center text-base leading-relaxed text-gray-600 md:text-lg">
                Share your memories with NJ Mandir. Send us photos of yourself
                or your family from past celebrations and events along with a
                short story. When featured on our channels, we will display your
                family name, village, mandal, your photos, and your story
                together.
              </p>
            </motion.div>
          </div>

          {/* Form card */}
          <div className="mx-auto max-w-3xl">
            <motion.div
              className="relative mt-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-r from-orange-200/30 via-white/20 to-red-200/30 opacity-40 blur-xl will-change-transform" />
              <div className="relative">
                <Card className="reg-card relative overflow-hidden rounded-3xl">
                  <CardHeader className="pb-2 text-center lg:pb-4">
                    <CardTitle className="reg-text-primary text-xl font-semibold lg:text-2xl">
                      Submit a Memory
                    </CardTitle>
                    <CardDescription className="reg-text-secondary text-base">
                      A few quick details, then your photos. Takes about a
                      minute.
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-8"
                    >
                      {/* Section: About this memory */}
                      <section className="space-y-4">
                        <SectionHeader
                          step={1}
                          title="About this memory"
                          description="Helps us caption your photos correctly when we share them."
                        />

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label
                              htmlFor="familyName"
                              className="reg-label"
                            >
                              Family name *
                            </Label>
                            <Controller
                              name="familyName"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  id="familyName"
                                  type="text"
                                  placeholder="e.g. Patel"
                                  className="reg-input rounded-md"
                                />
                              )}
                            />
                            {errors.familyName && (
                              <p className="reg-error-text">
                                {errors.familyName.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="village" className="reg-label">
                              Village or town *
                            </Label>
                            <Controller
                              name="village"
                              control={control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  id="village"
                                  type="text"
                                  placeholder="e.g. Vasna, Karamsad"
                                  className="reg-input rounded-md"
                                />
                              )}
                            />
                            {errors.village && (
                              <p className="reg-error-text">
                                {errors.village.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mandal" className="reg-label">
                            Mandal *
                          </Label>
                          <Controller
                            name="mandal"
                            control={control}
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger
                                  id="mandal"
                                  className="reg-input rounded-md"
                                >
                                  <SelectValue placeholder="Select your mandal" />
                                </SelectTrigger>
                                <SelectContent className="reg-popover rounded-xl">
                                  {mandalGroups.map((group) => (
                                    <SelectGroup key={group.country}>
                                      <SelectLabel className="px-3 pt-2 text-xs font-semibold uppercase tracking-wider text-orange-700">
                                        {COUNTRY_LABELS[group.country] ??
                                          group.country}
                                      </SelectLabel>
                                      {group.items.map((m) => (
                                        <SelectItem
                                          key={m.value}
                                          value={m.value}
                                          className="reg-popover-item rounded-lg"
                                        >
                                          {m.label}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {errors.mandal && (
                            <p className="reg-error-text">
                              {errors.mandal.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-baseline justify-between">
                            <Label htmlFor="caption" className="reg-label">
                              Your caption / story *
                            </Label>
                            <span
                              className={`text-xs ${
                                captionValue.length > CAPTION_MAX
                                  ? "text-red-600"
                                  : "text-gray-400"
                              }`}
                            >
                              {captionValue.length}/{CAPTION_MAX}
                            </span>
                          </div>
                          <Controller
                            name="caption"
                            control={control}
                            render={({ field }) => (
                              <Textarea
                                {...field}
                                id="caption"
                                rows={5}
                                placeholder="Tell us about this moment, who is in the photo, what's happening, and any context that would help us share it with the right tone."
                                className="reg-input min-h-[140px] rounded-md py-3 leading-relaxed"
                              />
                            )}
                          />
                          {errors.caption && (
                            <p className="reg-error-text">
                              {errors.caption.message}
                            </p>
                          )}
                        </div>
                      </section>

                      <Divider />

                      {/* Section: Photos */}
                      <section className="space-y-4">
                        <SectionHeader
                          step={2}
                          title="Add your photos"
                          description="1 to 3 photos. Higher-quality originals look best on social media."
                        />

                        <Controller
                          name="images"
                          control={control}
                          render={({ field }) => (
                            <ImageUploadZone
                              id="images"
                              value={field.value as File[]}
                              onChange={(files) => field.onChange(files)}
                            />
                          )}
                        />
                        {errors.images && (
                          <p className="reg-error-text">
                            {errors.images.message as string}
                          </p>
                        )}
                      </section>

                      <Divider />

                      {/* Section: Optional contact */}
                      <section className="space-y-3">
                        <button
                          type="button"
                          onClick={() => setContactOpen((v) => !v)}
                          aria-expanded={contactOpen}
                          aria-controls="contact-info-panel"
                          className="group flex w-full items-center justify-between gap-3 rounded-xl border border-orange-200 bg-white/60 px-4 py-3 text-left backdrop-blur-sm transition-all hover:border-orange-300 hover:bg-orange-50/60"
                        >
                          <div>
                            <p className="text-sm font-semibold text-gray-800 sm:text-base">
                              Add your contact info{" "}
                              <span className="font-normal text-gray-500">
                                (optional)
                              </span>
                            </p>
                            <p className="text-xs text-gray-500 sm:text-sm">
                              Only if you'd like us to follow up before posting,
                              e.g. to confirm a name or detail.
                            </p>
                          </div>
                          <ChevronDown
                            className={`h-5 w-5 shrink-0 text-orange-600 transition-transform duration-300 ${
                              contactOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {contactOpen && (
                            <motion.div
                              id="contact-info-panel"
                              key="contact-panel"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25, ease: "easeOut" }}
                              className="overflow-hidden"
                            >
                              <div className="space-y-4 pt-2">
                                <div className="space-y-2">
                                  <Label
                                    htmlFor="contactName"
                                    className="reg-label"
                                  >
                                    Your name
                                  </Label>
                                  <Controller
                                    name="contactName"
                                    control={control}
                                    render={({ field }) => (
                                      <Input
                                        {...field}
                                        id="contactName"
                                        type="text"
                                        placeholder="Full name"
                                        className="reg-input rounded-md"
                                      />
                                    )}
                                  />
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                  <div className="space-y-2">
                                    <Label
                                      htmlFor="contactEmail"
                                      className="reg-label"
                                    >
                                      Email
                                    </Label>
                                    <Controller
                                      name="contactEmail"
                                      control={control}
                                      render={({ field }) => (
                                        <Input
                                          {...field}
                                          id="contactEmail"
                                          type="email"
                                          placeholder="your@email.com"
                                          className="reg-input rounded-md"
                                        />
                                      )}
                                    />
                                    {errors.contactEmail && (
                                      <p className="reg-error-text">
                                        {errors.contactEmail.message}
                                      </p>
                                    )}
                                  </div>

                                  <div className="space-y-2">
                                    <Label
                                      htmlFor="contactPhone"
                                      className="reg-label"
                                    >
                                      Phone
                                    </Label>
                                    <Controller
                                      name="contactPhone"
                                      control={control}
                                      render={({ field }) => (
                                        <LazyPhoneInput
                                          value={field.value}
                                          id="contactPhone"
                                          placeholder="Enter a phone number"
                                          defaultCountry="US"
                                          onChange={(value) => {
                                            field.onChange(value)
                                            if (
                                              value &&
                                              isValidPhoneNumber(value)
                                            ) {
                                              try {
                                                const parsed =
                                                  parsePhoneNumber(value)
                                                if (parsed) {
                                                  setValue(
                                                    "contactPhoneCountryCode",
                                                    `+${parsed.countryCallingCode}`,
                                                    { shouldValidate: false }
                                                  )
                                                }
                                              } catch {
                                                /* noop */
                                              }
                                            }
                                          }}
                                        />
                                      )}
                                    />
                                    {errors.contactPhone && (
                                      <p className="reg-error-text">
                                        {errors.contactPhone.message}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </section>

                      <Divider />

                      {/* Privacy + submit */}
                      <div className="space-y-4">
                        <p className="text-xs leading-relaxed text-gray-500 sm:text-sm">
                          By submitting, you confirm you have permission to
                          share these photos. All submissions are reviewed
                          before posting, and we reserve the right to edit
                          submissions for clarity, length, or appropriateness
                          before publishing on Mahotsav social channels and
                          event recap. We will not sell or share your contact
                          info.
                        </p>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="reg-button relative inline-flex h-14 w-full items-center justify-center overflow-hidden rounded-lg px-4 py-2 text-center text-base"
                        >
                          <div
                            className={`absolute inset-0 bg-gradient-to-b from-white/20 to-transparent transition-transform duration-500 ${
                              isSubmitting ? "translate-y-0" : "translate-y-full"
                            }`}
                          />
                          <div className="relative z-10 flex items-center justify-center gap-2">
                            {isSubmitting ? (
                              <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Submitting your memory
                              </>
                            ) : (
                              <>
                                <Send className="h-5 w-5" />
                                Submit Memory
                              </>
                            )}
                          </div>
                        </button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  )
}

function SectionHeader({
  step,
  title,
  description,
}: {
  step: number
  title: string
  description: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-xs font-bold text-white shadow-sm">
        {step}
      </span>
      <div>
        <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
          {title}
        </h2>
        <p className="text-xs leading-relaxed text-gray-500 sm:text-sm">
          {description}
        </p>
      </div>
    </div>
  )
}

function Divider() {
  return (
    <div
      className="h-px w-full bg-gradient-to-r from-transparent via-orange-200 to-transparent"
      aria-hidden="true"
    />
  )
}
