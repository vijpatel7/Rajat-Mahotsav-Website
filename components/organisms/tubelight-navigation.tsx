"use client"

import { Home, ScrollText, CalendarDays, Heart } from "lucide-react"
import { NavBar } from "@/components/organisms/tubelight-navbar"

const navItems = [
  { name: "Home", url: "/", icon: Home },
  { name: "Schedule", url: "/schedule", icon: CalendarDays },
  { name: "Community Seva", url: "/community-seva", icon: Heart },
  { name: "Timeline", url: "/timeline", icon: ScrollText },
]

export function TubelightNavigation() {
  return <NavBar items={navItems} />
}
