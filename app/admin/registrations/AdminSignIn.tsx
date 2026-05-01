"use client"

import { useState } from "react"
import { supabase } from "@/utils/supabase/client"
import { Button } from "@/components/atoms/button"
import { Loader2 } from "lucide-react"

type AdminSignInProps = {
  nextPath?: string
}

function sanitizeNextPath(value: string): string {
  if (!value.startsWith("/") || value.includes("//") || value.includes(":")) {
    return "/admin/registrations"
  }

  return value
}

export function AdminSignIn({ nextPath }: AdminSignInProps) {
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      const returnPath = sanitizeNextPath(
        nextPath ?? `${window.location.pathname}${window.location.search}`
      )
      const cookieParts = [
        `rm-auth-next=${encodeURIComponent(returnPath)}`,
        "Path=/",
        "Max-Age=600",
        "SameSite=Lax",
      ]
      // Ensure the cookie survives redirects between `www` and apex domain on prod.
      // (Host-only cookies are lost if the callback lands on a different subdomain.)
      const host = window.location.hostname
      if (host.endsWith("njrajatmahotsav.com")) {
        cookieParts.push("Domain=.njrajatmahotsav.com")
      }
      if (window.location.protocol === "https:") cookieParts.push("Secure")
      document.cookie = cookieParts.join("; ")

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          // Keep redirect URL stable; store the post-auth destination in a cookie
          // because some providers/flows may drop custom query params.
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err) {
      console.error("Sign-in error:", err)
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <Button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-full px-8 py-4 font-semibold admin-btn-primary shadow-lg"
        aria-label="Sign in with Google"
      >
        {loading ? (
          <Loader2 className="size-5 animate-spin" aria-hidden />
        ) : (
          <svg className="size-5" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        )}
        {loading ? "Signing in…" : "Sign in with Google"}
      </Button>
      <p className="text-sm reg-text-secondary max-w-xs text-center">
        Access restricted to @nj.sgadi.us accounts
      </p>
    </div>
  )
}
