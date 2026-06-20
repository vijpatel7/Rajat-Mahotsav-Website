"use client"

/**
 * Browser-only helpers for the Memories upload flow. Kept separate from
 * lib/memories-upload-config.ts because that module is imported by the presign
 * API route on the server and must stay DOM-free.
 */

const durationCache = new WeakMap<File, number>()

/**
 * Read a video's playback length (rounded seconds) in the browser, caching the
 * result per File so the upload-zone validation and the submit handler don't
 * decode the same file twice. Resolves 0 if the duration can't be read.
 */
export function readVideoDurationSeconds(file: File): Promise<number> {
  const cached = durationCache.get(file)
  if (cached !== undefined) return Promise.resolve(cached)

  return new Promise((resolve) => {
    const url = URL.createObjectURL(file)
    const video = document.createElement("video")
    video.preload = "metadata"
    video.muted = true
    const finish = (value: number) => {
      URL.revokeObjectURL(url)
      durationCache.set(file, value)
      resolve(value)
    }
    video.onloadedmetadata = () =>
      finish(Number.isFinite(video.duration) ? Math.round(video.duration) : 0)
    video.onerror = () => finish(0)
    video.src = url
  })
}
