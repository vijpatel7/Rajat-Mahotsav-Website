"use client"

import React, { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

type NavIcon = React.ComponentType<any>

interface NavItem {
  name: string
  url: string
  icon: NavIcon
  subItems?: NavItem[]
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  availableInlineWidth?: number
  inlineSafetyBuffer?: number
  forceOverlayMode?: boolean
  /** Routes where the desktop toolbar should auto-expand on entry. */
  autoExpandPaths?: string[]
}

const DESKTOP_BREAKPOINT = 1024

export function NavBar({
  items,
  className,
  availableInlineWidth,
  inlineSafetyBuffer = 24,
  forceOverlayMode,
  autoExpandPaths,
}: NavBarProps) {
  const pathname = usePathname()
  const menuPanelId = "primary-nav-panel"
  const [activeTab, setActiveTab] = useState(items[0]?.name ?? "")
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [viewportWidth, setViewportWidth] = useState(0)
  const [requiredInlineWidth, setRequiredInlineWidth] = useState(0)
  const measureRef = useRef<HTMLDivElement | null>(null)
  const previousOverlayModeRef = useRef<boolean | null>(null)

  useEffect(() => {
    const currentItem = items.find(
      (item) => item.url === pathname || item.subItems?.some((sub) => sub.url === pathname)
    )

    if (currentItem) {
      setActiveTab(currentItem.name)
    }
  }, [pathname, items])

  useEffect(() => {
    const timeout = window.setTimeout(() => setHasAnimated(true), 400)
    return () => window.clearTimeout(timeout)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const recalculateInlineWidth = () => {
      if (!measureRef.current) {
        return
      }

      const measuredWidth = Math.ceil(measureRef.current.getBoundingClientRect().width)
      setRequiredInlineWidth(measuredWidth)
    }

    recalculateInlineWidth()

    if (!measureRef.current) {
      return
    }

    const observer = new ResizeObserver(recalculateInlineWidth)
    observer.observe(measureRef.current)
    window.addEventListener("resize", recalculateInlineWidth)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", recalculateInlineWidth)
    }
  }, [items])

  const hasEnoughInlineSpace =
    typeof availableInlineWidth !== "number"
      ? true
      : availableInlineWidth >= requiredInlineWidth + inlineSafetyBuffer

  const usesOverlayMenu =
    forceOverlayMode === true || viewportWidth <= DESKTOP_BREAKPOINT || !hasEnoughInlineSpace

  useEffect(() => {
    const previousMode = previousOverlayModeRef.current

    if (previousMode === null) {
      previousOverlayModeRef.current = usesOverlayMenu
      return
    }

    if (previousMode !== usesOverlayMenu) {
      setIsExpanded(false)
      setExpandedItem(null)
      setHoveredItem(null)
      setHoveredTab(null)
    }

    previousOverlayModeRef.current = usesOverlayMenu
  }, [usesOverlayMenu])

  const shouldAutoExpand = autoExpandPaths?.includes(pathname) ?? false

  // On configured routes (e.g. /memories), open the desktop toolbar on entry
  // even if the user had previously collapsed it. Mobile keeps the overlay
  // menu closed so it doesn't cover the page.
  useEffect(() => {
    if (shouldAutoExpand && !usesOverlayMenu) {
      setIsExpanded(true)
    }
  }, [shouldAutoExpand, usesOverlayMenu])

  useEffect(() => {
    if (!isExpanded && !expandedItem && !hoveredItem) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return
      }

      setIsExpanded(false)
      setExpandedItem(null)
      setHoveredItem(null)
      setHoveredTab(null)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isExpanded, expandedItem, hoveredItem])

  const getSubMenuId = (itemName: string) =>
    `primary-nav-submenu-${itemName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`

  return (
    <>
      <div aria-hidden className="absolute -left-[9999px] top-0 opacity-0 pointer-events-none">
        <div
          ref={measureRef}
          className="flex items-center gap-3 bg-gradient-to-r from-slate-900/95 to-slate-800/95 border-2 border-slate-700/60 backdrop-blur-md rounded-full shadow-lg"
        >
          <div className="flex items-center justify-center min-w-[56px] h-[56px] text-white">
            <Menu size={22} strokeWidth={2.5} />
          </div>
          <div className="flex flex-row items-center gap-1 pr-1">
            {items.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={`measure-${item.name}`}
                  className="text-base font-semibold px-3 py-2.5 whitespace-nowrap flex items-center justify-center text-white/80"
                >
                  <Icon size={18} strokeWidth={2.5} className="mr-1.5" />
                  <span>{item.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {isExpanded && usesOverlayMenu && (
        <motion.div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setIsExpanded(false)
            setExpandedItem(null)
          }}
        />
      )}

      <motion.div className={cn("relative p-4", className)}>
        {usesOverlayMenu ? (
          <>
            <motion.button
              type="button"
              className="flex items-center justify-center w-[60px] h-[56px] bg-gradient-to-r from-slate-900/95 to-slate-800/95 border-2 border-slate-700/60 backdrop-blur-md rounded-full shadow-lg text-white cursor-pointer z-50 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              aria-expanded={isExpanded}
              aria-controls={menuPanelId}
              aria-label={isExpanded ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => setIsExpanded((prev) => !prev)}
            >
              <motion.span animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                {isExpanded ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
              </motion.span>
            </motion.button>

            <AnimatePresence>
              {isExpanded && (
                <motion.nav
                  id={menuPanelId}
                  aria-label="Primary navigation"
                  className="absolute top-20 left-4 z-50 bg-gradient-to-r from-slate-900/95 to-slate-800/95 border-2 border-slate-700/60 backdrop-blur-md shadow-lg rounded-3xl p-2 w-[240px]"
                  initial={{ opacity: 0, scale: 0.8, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="flex flex-col gap-1">
                    {items.map((item) => {
                      const Icon = item.icon
                      const isActive = activeTab === item.name || item.subItems?.some((sub) => sub.url === pathname)
                      const isHovered = hoveredTab === item.name
                      const isSubmenuExpanded = expandedItem === item.name
                      const submenuId = getSubMenuId(item.name)

                      return (
                        <div key={item.name}>
                          {item.subItems ? (
                            <>
                              <button
                                type="button"
                                onClick={() => setExpandedItem(isSubmenuExpanded ? null : item.name)}
                                aria-expanded={isSubmenuExpanded}
                                aria-controls={submenuId}
                                className={cn(
                                  "relative cursor-pointer text-sm font-semibold rounded-full transition-colors flex items-center w-full justify-start",
                                  "text-white/80 hover:text-white px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/80",
                                  isActive && "text-white"
                                )}
                              >
                                <Icon size={20} strokeWidth={2.5} className="mr-2" />
                                <span>{item.name}</span>
                                <motion.span animate={{ rotate: isSubmenuExpanded ? 180 : 0 }} className="ml-auto">
                                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                                  </svg>
                                </motion.span>
                                {isActive && (
                                  <motion.div
                                    layoutId="lamp"
                                    className="absolute inset-0 w-full rounded-full bg-red-500/20 -z-10"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                  >
                                    <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-1.5 h-10 bg-red-500 rounded-l-full shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                                      <div className="absolute h-16 w-8 bg-red-500/50 rounded-full blur-lg -left-3 -top-3" />
                                      <div className="absolute h-12 w-8 bg-red-500/50 rounded-full blur-lg -left-2" />
                                      <div className="absolute h-6 w-6 bg-red-500/60 rounded-full blur-md top-2 left-0" />
                                    </div>
                                  </motion.div>
                                )}
                              </button>
                              <AnimatePresence>
                                {isSubmenuExpanded && (
                                  <motion.div
                                    id={submenuId}
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden pl-6"
                                  >
                                    {item.subItems.map((subItem) => {
                                      const SubIcon = subItem.icon
                                      const isSubActive = pathname === subItem.url
                                      return (
                                        <Link
                                          key={subItem.name}
                                          href={subItem.url}
                                          onClick={() => {
                                            setActiveTab(item.name)
                                            setIsExpanded(false)
                                            setExpandedItem(null)
                                            setTimeout(() => window.scrollTo({ top: 0, behavior: "instant" }), 0)
                                          }}
                                          className={cn(
                                            "flex items-center px-4 py-2 text-sm rounded-full transition-colors",
                                            "text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/80",
                                            isSubActive && "text-white bg-white/10"
                                          )}
                                        >
                                          <SubIcon size={18} strokeWidth={2.5} className="mr-2" />
                                          <span>{subItem.name}</span>
                                        </Link>
                                      )
                                    })}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </>
                          ) : (
                            <Link
                              href={item.url}
                              onClick={() => {
                                setActiveTab(item.name)
                                setIsExpanded(false)
                                setTimeout(() => window.scrollTo({ top: 0, behavior: "instant" }), 0)
                              }}
                              onMouseEnter={() => setHoveredTab(item.name)}
                              onMouseLeave={() => setHoveredTab(null)}
                              className={cn(
                                "relative cursor-pointer text-sm font-semibold rounded-full transition-colors flex items-center",
                                "text-white/80 hover:text-white px-4 py-3 w-full justify-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/80"
                              )}
                            >
                              <Icon size={20} strokeWidth={2.5} className="mr-2" />
                              <span>{item.name}</span>
                              {(isActive || isHovered) && (
                                <motion.div
                                  layoutId="lamp"
                                  className={cn(
                                    "absolute inset-0 w-full rounded-full -z-10",
                                    isActive ? "bg-red-500/20" : "bg-red-500/10"
                                  )}
                                  initial={false}
                                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                >
                                  <div className="absolute top-1/2 -translate-y-1/2 -left-2 w-1.5 h-10 bg-red-500 rounded-l-full shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                                    <div className="absolute h-16 w-8 bg-red-500/50 rounded-full blur-lg -left-3 -top-3" />
                                    <div className="absolute h-12 w-8 bg-red-500/50 rounded-full blur-lg -left-2" />
                                    <div className="absolute h-6 w-6 bg-red-500/60 rounded-full blur-md top-2 left-0" />
                                  </div>
                                </motion.div>
                              )}
                            </Link>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </motion.nav>
              )}
            </AnimatePresence>
          </>
        ) : (
          <motion.div
            className="flex items-center gap-3 bg-gradient-to-r from-slate-900/95 to-slate-800/95 border-2 border-slate-700/60 backdrop-blur-md rounded-full shadow-lg"
            initial={false}
            animate={{ width: isExpanded ? "auto" : "60px", height: "56px" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.button
              type="button"
              className="flex items-center justify-center min-w-[56px] h-full text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/80"
              aria-expanded={isExpanded}
              aria-controls={menuPanelId}
              aria-label={isExpanded ? "Collapse navigation menu" : "Expand navigation menu"}
              onClick={() => setIsExpanded((prev) => !prev)}
            >
              <motion.span animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                {isExpanded ? <X size={22} strokeWidth={2.5} /> : <Menu size={22} strokeWidth={2.5} />}
              </motion.span>
            </motion.button>
            {isExpanded && (
              <motion.nav
                id={menuPanelId}
                aria-label="Primary navigation"
                className="flex flex-row items-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {items.map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.name || item.subItems?.some((sub) => sub.url === pathname)
                  const isHovered = hoveredItem === item.name
                  const submenuId = getSubMenuId(item.name)

                  return (
                    <div
                      key={item.name}
                      className="relative"
                      onMouseEnter={() => setHoveredItem(item.name)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      {item.subItems ? (
                        <>
                          <button
                            type="button"
                            onClick={() => setHoveredItem((current) => (current === item.name ? null : item.name))}
                            aria-expanded={isHovered}
                            aria-controls={submenuId}
                            className="relative cursor-pointer text-base font-semibold px-3 py-2.5 rounded-full transition-colors whitespace-nowrap flex items-center justify-center text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/80"
                          >
                            <Icon size={18} strokeWidth={2.5} className="mr-1.5" />
                            <span>{item.name}</span>
                            {(isHovered || (!hoveredItem && isActive)) && (
                              <motion.div
                                layoutId="lamp"
                                className="absolute inset-0 w-full bg-red-500/35 rounded-full -z-10"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={
                                  hasAnimated
                                    ? { type: "spring", stiffness: 300, damping: 30 }
                                    : { delay: 0.15, duration: 0.2 }
                                }
                              >
                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-red-500 rounded-t-full shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                                  <div className="absolute w-16 h-8 bg-red-500/50 rounded-full blur-lg -top-3 -left-3" />
                                  <div className="absolute w-12 h-8 bg-red-500/50 rounded-full blur-lg -top-2" />
                                  <div className="absolute w-6 h-6 bg-red-500/60 rounded-full blur-md top-0 left-2" />
                                </div>
                              </motion.div>
                            )}
                          </button>
                          <AnimatePresence>
                            {isHovered && (
                              <motion.div
                                id={submenuId}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 pt-2 z-50"
                              >
                                <div className="bg-gradient-to-r from-slate-900/95 to-slate-800/95 border-2 border-slate-700/60 backdrop-blur-md rounded-2xl p-2 shadow-lg min-w-[240px]">
                                  {item.subItems.map((subItem) => {
                                    const SubIcon = subItem.icon
                                    const isSubActive = pathname === subItem.url
                                    return (
                                      <Link
                                        key={subItem.name}
                                        href={subItem.url}
                                        onClick={() => {
                                          setActiveTab(item.name)
                                          setTimeout(() => window.scrollTo({ top: 0, behavior: "instant" }), 0)
                                        }}
                                        className={cn(
                                          "flex items-center px-3 py-2 text-sm rounded-lg transition-colors text-white/80 hover:text-white hover:bg-red-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/80",
                                          isSubActive && "bg-red-500/25 text-white"
                                        )}
                                      >
                                        <SubIcon size={16} strokeWidth={2.5} className="mr-2" />
                                        <span>{subItem.name}</span>
                                      </Link>
                                    )
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          href={item.url}
                          onClick={() => {
                            setActiveTab(item.name)
                            setTimeout(() => window.scrollTo({ top: 0, behavior: "instant" }), 0)
                          }}
                          className="relative cursor-pointer text-base font-semibold px-3 py-2.5 rounded-full transition-colors whitespace-nowrap flex items-center justify-center text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/80"
                        >
                          <Icon size={18} strokeWidth={2.5} className="mr-1.5" />
                          <span>{item.name}</span>
                          {(isHovered || (!hoveredItem && isActive)) && (
                            <motion.div
                              layoutId="lamp"
                              className="absolute inset-0 w-full bg-red-500/35 rounded-full -z-10"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={
                                hasAnimated
                                  ? { type: "spring", stiffness: 300, damping: 30 }
                                  : { delay: 0.15, duration: 0.2 }
                              }
                            >
                              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-red-500 rounded-t-full shadow-[0_0_10px_rgba(239,68,68,0.8)]">
                                <div className="absolute w-16 h-8 bg-red-500/50 rounded-full blur-lg -top-3 -left-3" />
                                <div className="absolute w-12 h-8 bg-red-500/50 rounded-full blur-lg -top-2" />
                                <div className="absolute w-6 h-6 bg-red-500/60 rounded-full blur-md top-0 left-2" />
                              </div>
                            </motion.div>
                          )}
                        </Link>
                      )}
                    </div>
                  )
                })}
              </motion.nav>
            )}
          </motion.div>
        )}
      </motion.div>
    </>
  )
}
