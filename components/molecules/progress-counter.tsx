"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect } from "react"
import { LucideIcon } from "lucide-react"

interface ProgressCounterProps {
  icon: LucideIcon
  label: string
  current: number
  target: number
  prefix?: string
  suffix?: string
  delay?: number
  inView: boolean
}

export function ProgressCounter({ 
  icon: Icon, 
  label, 
  current, 
  target, 
  prefix = "",
  suffix = "", 
  delay = 0,
  inView 
}: ProgressCounterProps) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const formatted = useTransform(rounded, (latest) => latest.toLocaleString())
  const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0

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
      aria-label={`${label}: ${prefix}${current.toLocaleString()}${suffix} of ${prefix}${target.toLocaleString()}${suffix}`}
    >
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-200 ease-out cursor-pointer p-6 hover:-translate-y-2 hover:scale-[1.02] h-full">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-orange-100 to-red-100">
              <Icon className="h-8 w-8 community-text-accent" />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex flex-col items-center gap-2">
              <div className="text-2xl lg:text-3xl font-medium text-gray-500">
                <span>{prefix}</span>
                <motion.span>{formatted}</motion.span>
                <span className="text-base">{suffix}</span>
              </div>
              <div className="w-20 h-0.5 bg-gradient-to-r from-orange-400 to-red-400"></div>
              <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {prefix}{target.toLocaleString()}{suffix}
              </div>
            </div>
            
            <h3 className="text-lg font-semibold community-text-primary">
              {label}
            </h3>
            
            {/* Progress Bar */}
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
          </div>
        </div>
      </div>
    </motion.div>
  )
}