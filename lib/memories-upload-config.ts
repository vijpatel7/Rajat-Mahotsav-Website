/**
 * Single source of truth for /memories upload limits and accepted types.
 *
 * Imported by the client (page + upload zones) AND the server (presign route)
 * so the rules are defined exactly once. Tweak the constants below to change
 * limits — no other file needs editing.
 */

// ----- Photos -----
export const IMAGE_ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/heic",
  "image/heif",
] as const
export const IMAGE_ACCEPT_ATTR =
  ".jpg,.jpeg,.png,.heic,.heif,image/jpeg,image/png,image/heic,image/heif"
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // 5 MB each
export const MAX_IMAGES = 3

// ----- Videos -----
// iPhones record .mov (QuickTime, often HEVC) by default, or .mp4.
export const VIDEO_ALLOWED_TYPES = ["video/mp4", "video/quicktime"] as const
export const VIDEO_ACCEPT_ATTR = ".mp4,.mov,video/mp4,video/quicktime"
export const MAX_VIDEOS = 1
// Primary guard for video is DURATION (checked client-side). This byte cap is a
// generous backstop so the server can reject obviously oversized files even if a
// client bypasses the duration check. A 30s clip rarely exceeds this.
export const MAX_VIDEO_BYTES = 200 * 1024 * 1024 // 200 MB
// Change this to 60, 90, ... to allow longer clips. Enforced client-side via the
// decoded <video> duration; the measured length is stored on each record.
export const MAX_VIDEO_DURATION_SECONDS = 30

// Total media items allowed across photos + videos (a submission needs >= 1).
export const MIN_MEDIA_ITEMS = 1

export type MediaKind = "image" | "video"

/** Infer whether a content-type / file is an image or a video we accept. */
export function mediaKindForType(type: string): MediaKind | null {
  const t = type.toLowerCase()
  if ((IMAGE_ALLOWED_TYPES as readonly string[]).includes(t)) return "image"
  if ((VIDEO_ALLOWED_TYPES as readonly string[]).includes(t)) return "video"
  return null
}

/** Human-readable seconds, e.g. 30 -> "0:30", 95 -> "1:35". */
export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds))
  const m = Math.floor(s / 60)
  const rem = s % 60
  return `${m}:${rem.toString().padStart(2, "0")}`
}
