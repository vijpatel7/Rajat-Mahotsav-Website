"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, ScrollText, ClipboardPen, CalendarDays, Hotel, Heart, Image, CalendarCheck, FileText, BookA, MapPinned, Camera } from "lucide-react"
import { PiHandsPraying } from "react-icons/pi"
import { useRouter, usePathname } from "next/navigation"
import { FloatingButton } from "../atoms/floating-button"

const menuItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: ScrollText, label: "Timeline", href: "/timeline" },
  {
    icon: MapPinned,
    label: "Attend",
    href: "#",
    subItems: [
      { icon: BookA, label: "About the Mahotsav", href: "/about" },
      { icon: ClipboardPen, label: "Registration", href: "/registration" },
      { icon: FileText, label: "Invitation", href: "/invitation" },
      { icon: CalendarDays, label: "Schedule", href: "/schedule" },
      { icon: Hotel, label: "Guest Services", href: "/guest-services" },
    ]
  },
  {
    icon: PiHandsPraying,
    label: "Seva",
    href: "#",
    subItems: [
      { icon: Heart, label: "Community Seva", href: "/community-seva" },
      { icon: PiHandsPraying, label: "Spiritual Seva", href: "/spiritual-seva" },
    ]
  },
  { icon: Camera, label: "Share Memories", href: "/memories" },
  { icon: CalendarCheck, label: "Latest Events", href: "/latest-events" },
  { icon: Image, label: "Media", href: "/media" },
]

export function FloatingMenuButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDarkBackground, setIsDarkBackground] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const rafRef = useRef<number>()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsVisible(window.scrollY > 300)
          
          if (rafRef.current) cancelAnimationFrame(rafRef.current)
          rafRef.current = requestAnimationFrame(() => {
            const element = document.elementFromPoint(50, window.innerHeight - 100)
            if (element) {
              const styles = window.getComputedStyle(element)
              const bgColor = styles.backgroundColor
              
              if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
                const rgb = bgColor.match(/\d+/g)
                if (rgb) {
                  const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000
                  setIsDarkBackground(brightness < 128)
                }
              }
            }
          })
          
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const handleMenuItemClick = (href: string) => {
    setIsMenuOpen(false)
    router.push(href)
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' }), 0)
  }

  const bgClass = isDarkBackground ? 'bg-black/10 hover:bg-black/20' : 'bg-white/10 hover:bg-white/20'
  const textClass = isDarkBackground ? 'text-white/90 hover:text-white' : 'text-black/90 hover:text-black'

  return (
    <>
      <FloatingButton
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        isDarkBackground={isDarkBackground}
        isVisible={isVisible}
        className="fixed bottom-6 left-6 z-40"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
      </FloatingButton>

      <AnimatePresence>
        {isMenuOpen && isVisible && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-39"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-20 left-6 z-40 rounded-2xl backdrop-blur-md bg-gradient-to-r from-slate-900/20 to-slate-800/20 p-2 shadow-lg w-[220px]"
            >
              <nav className="flex flex-col gap-1">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  const isActive = item.href === pathname || item.subItems?.some(sub => sub.href === pathname)
                  const isExpanded = expandedItem === item.label
                  
                  return (
                    <div key={item.label}>
                      {item.subItems ? (
                        <>
                          <button
                            onClick={() => setExpandedItem(isExpanded ? null : item.label)}
                            className="flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 w-full text-white/90 hover:text-white"
                          >
                            <Icon size={18} />
                            <span className="text-base font-medium whitespace-nowrap">{item.label}</span>
                            <motion.div
                              animate={{ rotate: isExpanded ? 90 : 0 }}
                              className="ml-auto"
                            >
                              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                              </svg>
                            </motion.div>
                          </button>
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden pl-4"
                              >
                                {item.subItems.map((subItem) => {
                                  const SubIcon = subItem.icon
                                  const isSubActive = subItem.href === pathname
                                  return (
                                    <button
                                      key={subItem.label}
                                      onClick={() => handleMenuItemClick(subItem.href)}
                                      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 w-full text-left text-white/90 hover:text-white ${
                                        isSubActive ? 'bg-red-500/20' : 'hover:bg-red-500/10'
                                      }`}
                                    >
                                      <SubIcon size={16} />
                                      <span className="text-sm font-medium whitespace-nowrap">{subItem.label}</span>
                                    </button>
                                  )
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <button
                          onClick={() => handleMenuItemClick(item.href)}
                          className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 w-full text-left text-white/90 hover:text-white ${
                            isActive ? 'bg-red-500/20' : 'hover:bg-red-500/10 hover:scale-105'
                          }`}
                        >
                          <Icon size={18} />
                          <span className="text-base font-medium whitespace-nowrap">{item.label}</span>
                        </button>
                      )}
                    </div>
                  )
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
