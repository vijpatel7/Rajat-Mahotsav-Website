"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"

type YouTubePlayer = any

declare global {
  interface Window {
    YT?: any
    onYouTubeIframeAPIReady?: () => void
  }
}

const VIDEO_ID = "QVFf80VuMeA"
const POSTER_URL = `https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`
let ytApiPromise: Promise<void> | null = null

const loadYouTubeApi = () => {
  if (typeof window === "undefined") {
    return Promise.resolve()
  }

  if (window.YT?.Player) {
    return Promise.resolve()
  }

  if (ytApiPromise) {
    return ytApiPromise
  }

  ytApiPromise = new Promise((resolve) => {
    const existingScript = document.getElementById("youtube-iframe-api")
    if (!existingScript) {
      const script = document.createElement("script")
      script.id = "youtube-iframe-api"
      script.src = "https://www.youtube.com/iframe_api"
      document.body.appendChild(script)
    }

    const previousReady = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.()
      resolve()
    }
  })

  return ytApiPromise
}

export default function IntroVideoReveal() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const playerRef = useRef<YouTubePlayer | null>(null)
  const [hasRevealed, setHasRevealed] = useState(false)
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasRevealed(true)
          if (sectionRef.current) {
            observer.unobserve(sectionRef.current)
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    // Fallback in case the observer doesn't fire (short viewport, scroll
    // restoration) — otherwise the section stays stuck in blur(8px).
    const fallbackTimer = window.setTimeout(() => setHasRevealed(true), 2500)

    return () => {
      observer.disconnect()
      window.clearTimeout(fallbackTimer)
    }
  }, [])

  useEffect(() => {
    if (!hasRevealed) return
    if (!iframeRef.current || playerRef.current) return

    let cancelled = false

    const setupPlayer = async () => {
      await loadYouTubeApi()
      if (cancelled || !iframeRef.current || playerRef.current) return

      const player = new window.YT.Player(iframeRef.current, {
        events: {
          onReady: (event: any) => {
            event.target.setPlaybackQuality("hd1080")
          },
          onStateChange: (event: any) => {
            if (window.YT?.PlayerState && event.data === window.YT.PlayerState.PLAYING) {
              event.target.setPlaybackQuality("hd1080")
            }
          }
        }
      })

      playerRef.current = player
    }

    setupPlayer()

    return () => {
      cancelled = true
    }
  }, [hasRevealed])

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
  }, [])

  const revealMotion = reduceMotion
    ? { opacity: hasRevealed ? 1 : 0, y: hasRevealed ? 0 : 30 }
    : {
        opacity: hasRevealed ? 1 : 0,
        y: hasRevealed ? 0 : 40,
        scale: hasRevealed ? 1 : 0.98,
        filter: hasRevealed ? "blur(0px)" : "blur(8px)"
      }

  return (
    <section ref={sectionRef} className="relative bg-slate-900 overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-64 w-[85vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,196,113,0.25)_0%,rgba(15,23,42,0)_65%)] blur-3xl" />
        <div className="absolute -bottom-24 left-1/2 h-64 w-[75vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(252,211,77,0.22)_0%,rgba(15,23,42,0)_70%)] blur-3xl" />
      </div>

      {/* Gold rules */}
      <div className="absolute left-1/2 top-0 h-px w-[85vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-300/70 to-transparent" />
      <div className="absolute left-1/2 bottom-0 h-px w-[85vw] -translate-x-1/2 bg-gradient-to-r from-transparent via-amber-200/60 to-transparent" />

      <div className="max-w-[110rem] mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 py-14 sm:py-16 lg:py-24 relative z-10">
        <motion.div
          initial={false}
          animate={revealMotion}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="text-center"
        >
          <p className="text-xs sm:text-sm tracking-[0.35em] uppercase text-amber-200/70 font-semibold mb-3">
            Rajat Mahotsav • Official Preview
          </p>
          <h2
            className="font-instrument-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white mb-6"
            style={{ textShadow: "0 12px 32px rgba(0,0,0,0.35)" }}
          >
            A Glimpse Into the Celebration
          </h2>

          <div className="relative mx-auto w-full lg:max-w-5xl xl:max-w-4xl">
            <div className="absolute -inset-6 rounded-[40px] bg-[radial-gradient(circle,rgba(255,186,120,0.25)_0%,rgba(15,23,42,0)_65%)] blur-2xl" />
            <div
              className="relative rounded-3xl border border-amber-200/20 bg-white/5 backdrop-blur-xl p-3 sm:p-4"
              style={{
                boxShadow: "0 30px 70px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)"
              }}
            >
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-950/80">
                <img
                  src={POSTER_URL}
                  alt="Rajat Mahotsav preview"
                  className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${iframeLoaded ? "opacity-0" : "opacity-100"}`}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-slate-950/30 via-transparent to-slate-950/10" />
                {hasRevealed && (
                  <iframe
                    ref={iframeRef}
                    src={`https://www.youtube.com/embed/${VIDEO_ID}?playsinline=1&rel=0&modestbranding=1&controls=1&enablejsapi=1&vq=hd1080`}
                    title="Rajat Mahotsav Preview"
                    className="absolute inset-0 h-full w-full"
                    allow="encrypted-media; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    onLoad={() => setIframeLoaded(true)}
                  />
                )}
              </div>
            </div>
          </div>

          <p className="mt-6 text-sm sm:text-base text-slate-300 max-w-3xl mx-auto">
            Scroll into the story of our Rajat Pratishtha Mahotsav with a cinematic preview of what awaits.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
