"use client"

import type React from "react"
import { useState, useEffect, useMemo, useRef } from "react"
import { usePathname } from "next/navigation"
import { Home, ScrollText, ClipboardPen, CalendarDays, Hotel, Heart, Image as ImageIcon, CalendarCheck, Shield, FileText, BookA, TreePine } from "lucide-react"
import { PiHandsPraying } from "react-icons/pi"
import { NavBar } from "@/components/organisms/tubelight-navbar"
import { CDN_ASSETS } from "@/lib/cdn-assets"
import { supabase, hasSupabaseClientEnv } from "@/utils/supabase/client"
import { isAllowedAdminDomain } from "@/lib/admin-auth"

type NavIcon = React.ComponentType<any>

type NavigationSubItem = {
  icon: NavIcon
  label: string
  href: string
}

type NavigationItem = {
  icon: NavIcon
  label: string
  href: string
  gradient: string
  iconColor: string
  subItems?: NavigationSubItem[]
}

const menuItems: NavigationItem[] = [
  {
    icon: Home,
    label: "Home",
    href: "/",
    gradient:
      "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)",
    iconColor: "text-blue-500",
  },
  {
    icon: BookA,
    label: "About the Mahotsav",
    href: "/about",
    gradient:
      "radial-gradient(circle, rgba(14,165,233,0.15) 0%, rgba(2,132,199,0.06) 50%, rgba(14,116,144,0) 100%)",
    iconColor: "text-sky-500",
  },
  {
    icon: ScrollText,
    label: "Timeline",
    href: "/timeline",
    gradient:
      "radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.06) 50%, rgba(194,65,12,0) 100%)",
    iconColor: "text-orange-500",
  },
  {
    icon: ClipboardPen,
    label: "Registration",
    href: "/registration",
    gradient:
      "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.06) 50%, rgba(21,128,61,0) 100%)",
    iconColor: "text-green-500",
  },
  {
    icon: FileText,
    label: "Invitation",
    href: "/invitation",
    gradient:
      "radial-gradient(circle, rgba(251,191,36,0.18) 0%, rgba(245,158,11,0.07) 50%, rgba(217,119,6,0) 100%)",
    iconColor: "text-amber-500",
  },
  {
    icon: Hotel,
    label: "Guest Services",
    href: "/guest-services",
    gradient:
      "radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(147,51,234,0.06) 50%, rgba(126,34,206,0) 100%)",
    iconColor: "text-purple-500",
  },
  {
    icon: CalendarDays,
    label: "Schedule",
    href: "/schedule",
    gradient:
      "radial-gradient(circle, rgba(239,68,68,0.15) 0%, rgba(220,38,38,0.06) 50%, rgba(185,28,28,0) 100%)",
    iconColor: "text-red-500",
  },
  {
    icon: PiHandsPraying,
    label: "Seva",
    href: "#",
    gradient:
      "radial-gradient(circle, rgba(251,146,60,0.15) 0%, rgba(249,115,22,0.06) 50%, rgba(234,88,12,0) 100%)",
    iconColor: "text-orange-500",
    subItems: [
      {
        icon: Heart,
        label: "Community Seva",
        href: "/community-seva",
      },
      {
        icon: PiHandsPraying,
        label: "Spiritual Seva",
        href: "/spiritual-seva",
      },
    ],
  },
  {
    icon: CalendarCheck,
    label: "Latest Events",
    href: "/latest-events",
    gradient:
      "radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.06) 50%, rgba(194,65,12,0) 100%)",
    iconColor: "text-orange-500",
  },
  {
    icon: TreePine,
    label: "Tree Plantation",
    href: "/tree-planting",
    gradient:
      "radial-gradient(circle, rgba(34,197,94,0.15) 0%, rgba(22,163,74,0.06) 50%, rgba(21,128,61,0) 100%)",
    iconColor: "text-green-600",
  },
  {
    icon: ImageIcon,
    label: "Media",
    href: "/media",
    gradient:
      "radial-gradient(circle, rgba(236,72,153,0.15) 0%, rgba(219,39,119,0.06) 50%, rgba(190,24,93,0) 100%)",
    iconColor: "text-pink-500",
  },
]

const adminMenuItem: NavigationItem = {
  icon: Shield,
  label: "Admin",
  href: "/admin/registrations",
  gradient:
    "radial-gradient(circle, rgba(14,165,233,0.15) 0%, rgba(2,132,199,0.06) 50%, rgba(14,116,144,0) 100%)",
  iconColor: "text-sky-500",
}

export function Navigation() {
  const [mounted, setMounted] = useState(false)
  const [canAccessAdmin, setCanAccessAdmin] = useState(false)
  const [availableInlineWidth, setAvailableInlineWidth] = useState<number>()
  const navRowRef = useRef<HTMLDivElement | null>(null)
  const logosGroupRef = useRef<HTMLDivElement | null>(null)
  const pathname = usePathname()

  const navItems = useMemo(
    () => (canAccessAdmin ? [...menuItems, adminMenuItem] : menuItems),
    [canAccessAdmin]
  )

  useEffect(() => {
    if (!hasSupabaseClientEnv) {
      setCanAccessAdmin(false)
      return
    }

    let isActive = true

    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (!isActive) return
      if (error) {
        setCanAccessAdmin(false)
        return
      }
      setCanAccessAdmin(isAllowedAdminDomain(data.user?.email))
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setCanAccessAdmin(isAllowedAdminDomain(session?.user?.email))
    })

    return () => {
      isActive = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) {
      return
    }

    const navRow = navRowRef.current
    const logosGroup = logosGroupRef.current

    if (!navRow || !logosGroup) {
      return
    }

    const recalculateAvailableWidth = () => {
      const computed = window.getComputedStyle(navRow)
      const gapValue = Number.parseFloat(computed.columnGap || computed.gap || "0")
      const rowWidth = navRow.clientWidth
      const logosWidth = logosGroup.getBoundingClientRect().width
      const reservedSpace = gapValue + 24
      const nextWidth = Math.max(56, Math.floor(rowWidth - logosWidth - reservedSpace))
      setAvailableInlineWidth(nextWidth)
    }

    recalculateAvailableWidth()

    const observer = new ResizeObserver(recalculateAvailableWidth)
    observer.observe(navRow)
    observer.observe(logosGroup)
    window.addEventListener("resize", recalculateAvailableWidth)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", recalculateAvailableWidth)
    }
  }, [mounted, navItems, pathname])

  const isHomePage = pathname === '/'

  return (
    <>
      <nav 
        data-navbar
        className={`${isHomePage ? 'absolute' : 'relative'} w-full z-50 py-3 transition-all duration-300 ${mounted ? 'opacity-100' : 'opacity-0'} bg-transparent`}
        style={{ 
          paddingLeft: 'var(--nav-padding)', 
          paddingRight: 'var(--nav-padding)' 
        }}
      >
        <style jsx>{`
          nav[data-navbar] {
            --nav-padding: max(1rem, 2vw);
            --navbar-height: calc(5rem + 1.5rem);
          }
        `}</style>
        <div ref={navRowRef} className="flex items-center justify-between w-full gap-2 sm:gap-4">

          {/* Left Side - Tubelight Navbar */}
          <div className="flex-shrink-0">
            <NavBar items={navItems.map(item => ({ 
              name: item.label, 
              url: item.href, 
              icon: item.icon,
              subItems: item.subItems?.map(sub => ({
                name: sub.label,
                url: sub.href,
                icon: sub.icon
              }))
            }))}
              availableInlineWidth={availableInlineWidth}
              inlineSafetyBuffer={24}
            />
          </div>

          {/* Center - Flexible spacer */}
          <div className="flex-1 min-w-0"></div>

          {/* Right Side - Both Logos */}
          <div ref={logosGroupRef} className="flex items-center gap-2 sm:gap-3 flex-shrink-0 pl-2">
            <img
              src={CDN_ASSETS.mainLogoNoText}
              alt="Main Logo"
              width="144"
              height="144"
              className="w-auto object-contain"
              style={{ height: "clamp(4.5rem, 8vw, 8.75rem)" }}
            />
            <div className="w-px bg-white/40" style={{ height: "clamp(3.75rem, 7vw, 7.5rem)" }}></div>
            <img
              src={CDN_ASSETS.maningarLogo}
              alt="Maninagar Logo"
              width="144"
              height="144"
              className="w-auto object-contain"
              style={{ height: "clamp(4.5rem, 8vw, 8.75rem)" }}
            />
          </div>
        </div>
      </nav>
    </>
  )
}
