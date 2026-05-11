"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect } from "react"
import { LucideIcon } from "lucide-react"

interface ProgressCounterProps {
  icon: LucideIcon
  label: string
  current: number
  target?: number
  prefix?: string
  suffix?: string
  delay?: number
  inView: boolean
  mode?: "goal" | "total"
}

export function ProgressCounter({ 
  icon: Icon, 
  label, 
  current, 
  target, 
  prefix = "",
  suffix = "", 
  delay = 0,
  inView,
  mode = "goal",
}: ProgressCounterProps) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const formatted = useTransform(rounded, (latest) => latest.toLocaleString())
  const progress = target && target > 0 ? Math.min((current / target) * 100, 100) : 0
  const formattedCurrent = `${prefix}${current.toLocaleString()}${suffix}`
  const formattedTarget = target ? `${prefix}${target.toLocaleString()}${suffix}` : ""

  useEffect(() => {
    if (inView) {
      const controls = animate(count, current, {
        duration: 2,
        delay: delay,
        ease: "easeOut"
      })
      return controls.stop
    }
  }, [count, current, delay, inView])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
      role="group"
      aria-label={
        mode === "goal" && target
          ? `${label}: ${formattedCurrent} of ${formattedTarget}`
          : `${label}: ${formattedCurrent}`
      }
    >
      <div className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-200 ease-out cursor-pointer hover:-translate-y-2 hover:scale-[1.02] h-full ${mode === "total" ? "p-4 lg:p-5" : "p-6"}`}>
        <div className="text-center">
          <div className={`flex justify-center ${mode === "total" ? "mb-3" : "mb-4"}`}>
            <div className={`${mode === "total" ? "p-2.5" : "p-3"} rounded-full bg-gradient-to-br from-orange-100 to-red-100`}>
              <Icon className={`${mode === "total" ? "h-6 w-6" : "h-8 w-8"} community-text-accent`} />
            </div>
          </div>
          
          <div className={mode === "total" ? "space-y-2" : "space-y-3"}>
            <div className="flex flex-col items-center gap-2">
              <div className={mode === "total" ? "text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent" : "text-2xl lg:text-3xl font-medium text-gray-500"}>
                <span>{prefix}</span>
                <motion.span>{formatted}</motion.span>
                {suffix && <span className="ml-1 text-base">{suffix}</span>}
              </div>
              <div className={`${mode === "total" ? "w-16" : "w-20"} h-0.5 bg-gradient-to-r from-orange-400 to-red-400`}></div>
              {mode === "goal" && target && (
                <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                  {formattedTarget}
                </div>
              )}
            </div>
            
            <h3 className={`${mode === "total" ? "text-base" : "text-lg"} font-semibold community-text-primary`}>
              {label}
            </h3>
            
            {mode === "goal" && target ? (
              <>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-orange-400 to-red-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={inView ? { width: `${progress}%` } : { width: 0 }}
                    transition={{ duration: 1.5, delay: delay + 0.5, ease: "easeOut" }}
                  />
                </div>
                
                <div className="flex justify-between text-sm community-text-secondary">
                  <span>Current</span>
                  <span className="font-medium">
                    {Math.round(progress)}%
                  </span>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </motion.div>
  )
}