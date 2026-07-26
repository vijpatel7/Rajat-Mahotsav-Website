"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Home, ScrollText, CalendarDays } from "lucide-react"
import { MenuBar } from "@/components/organisms/glow-menu"
import { useDeviceType } from "@/hooks/use-device-type"
import Image from "next/image"

const menuItems = [
  {
    icon: Home,
    label: "Home",
    href: "/",
    gradient:
      "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.06) 50%, rgba(29,78,216,0) 100%)",
    iconColor: "text-blue-500",
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
    icon: ScrollText,
    label: "Timeline",
    href: "/timeline",
    gradient:
      "radial-gradient(circle, rgba(249,115,22,0.15) 0%, rgba(234,88,12,0.06) 50%, rgba(194,65,12,0) 100%)",
    iconColor: "text-orange-500",
  },
]

export function DesktopNavigation() {
  const [activeItem, setActiveItem] = useState<string>("Home")
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const deviceType = useDeviceType()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
    const currentItem = menuItems.find(item => item.href === pathname)
    if (currentItem) {
      setActiveItem(currentItem.label)
    }
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY < 10) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const handleItemClick = (label: string, href: string) => {
    setActiveItem(label)
    if (href !== "#") {
      router.push(href)
    }
  }

  return (
    <div className={`fixed top-6 left-0 right-0 z-50 px-4 transition-all duration-300 ease-in-out ${
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
      <div className="flex items-center w-full max-w-6xl mx-auto">
        {/* Left Side - Desktop Menu - 20% */}
        <div className="w-1/5 flex justify-end">
          <MenuBar
            items={menuItems}
            activeItem={activeItem}
            onItemClick={(label) => {
              const item = menuItems.find(item => item.label === label)
              if (item) {
                handleItemClick(label, item.href)
              }
            }}
            showLabels={mounted ? deviceType === 'desktop' : true}
          />
        </div>

        {/* Center - Main Logo - 60% */}
        <div className="w-3/5 flex justify-center px-4">
          <Image
            src="/main_logo.png"
            alt="Main Logo"
            width={200}
            height={200}
            className="max-h-20 max-w-full w-auto h-auto sm:max-h-24 md:max-h-28 lg:max-h-32 xl:max-h-36 object-contain"
            priority
          />
        </div>

        {/* Right Side - Maninagar Logo - 20% */}
        <div className="w-1/5 flex justify-start">
          <Image
            src="/maninagar_logo.png"
            alt="Maninagar Logo"
            width={80}
            height={80}
            className="h-12 w-auto sm:h-14 md:h-16 lg:h-18 object-contain"
            priority
          />
        </div>
      </div>
    </div>
  )
}
