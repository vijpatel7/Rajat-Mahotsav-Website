"use client"

import { useState } from "react"
import { Play } from "lucide-react"

/**
 * Lite YouTube embed.
 *
 * Renders a static thumbnail with a play button until the user clicks,
 * at which point it loads the real iframe. This is faster, more reliable
 * (you always see something even if the iframe fails to render), and
 * avoids the "blank black box" experience while the embed boots.
 *
 * Thumbnail comes from i.ytimg.com which is YouTube's public CDN and
 * does not require auth or special permissions.
 */
interface LiteYouTubeProps {
  videoId: string
  title?: string
  className?: string
  posterQuality?: "default" | "hq" | "sd" | "maxres"
}

export default function LiteYouTube({
  videoId,
  title = "YouTube video",
  className = "",
  posterQuality = "maxres",
}: LiteYouTubeProps) {
  const [activated, setActivated] = useState(false)

  const qualityMap: Record<string, string> = {
    default: "hqdefault",
    hq: "hqdefault",
    sd: "sddefault",
    maxres: "maxresdefault",
  }
  const poster = `https://i.ytimg.com/vi/${videoId}/${qualityMap[posterQuality]}.jpg`
  const fallbackPoster = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className}`}
      style={{ backgroundColor: "#0e1a10" }}
    >
      {!activated ? (
        <button
          type="button"
          onClick={() => setActivated(true)}
          aria-label={`Play video: ${title}`}
          className="group absolute inset-0 block h-full w-full cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-[#d4af37]/60"
        >
          {/* Poster */}
          <img
            src={poster}
            onError={(e) => {
              const img = e.currentTarget
              if (img.src !== fallbackPoster) img.src = fallbackPoster
            }}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            loading="lazy"
          />
          {/* Subtle dark overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)",
            }}
          />
          {/* Play button */}
          <span
            className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full transition-all duration-300 group-hover:scale-110 sm:h-24 sm:w-24"
            style={{
              background:
                "linear-gradient(135deg, rgba(212,175,55,0.95) 0%, rgba(180,135,30,0.95) 100%)",
              boxShadow:
                "0 20px 50px -10px rgba(212,175,55,0.5), 0 0 0 4px rgba(245,239,224,0.15)",
            }}
            aria-hidden
          >
            <Play
              className="h-7 w-7 translate-x-[2px] fill-[#0e1a10] text-[#0e1a10] sm:h-9 sm:w-9"
              strokeWidth={0}
            />
          </span>
          {/* Title bar */}
          <span className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#f5efe0]/85 sm:text-xs">
            <span className="inline-block h-px w-6 bg-[#d4af37]" />
            Watch on YouTube
          </span>
        </button>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          frameBorder={0}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      )}
    </div>
  )
}
