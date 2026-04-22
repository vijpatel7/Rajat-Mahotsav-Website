"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Input } from "@/components/atoms/input"
import { Label } from "@/components/atoms/label"
import { Send, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card"
import { Toaster } from "@/components/molecules/toaster"
import { useToast } from "@/hooks/use-toast"
import { supabasePublic as supabase } from "@/utils/supabase/public-client"
import "@/styles/registration-theme.css"

const FormSchema = z.object({
  submission_by: z.string().min(1, "Data Submitter is required"),
  event_name: z.string().min(1, "Event Name is required"),
  volunteer_hours: z.string().min(1, "Total Volunteer Hours is required").refine((val) => {
    const num = parseInt(val)
    return !isNaN(num) && num >= 0
  }, "Must be a valid number"),
  meals_served: z.string().min(1, "# Meals Served is required").refine((val) => {
    const num = parseInt(val)
    return !isNaN(num) && num >= 0
  }, "Must be a valid number"),
  community_events: z.string().min(1, "# of Community events is required").refine((val) => {
    const num = parseInt(val)
    return !isNaN(num) && num >= 0
  }, "Must be a valid number"),
  funds_raised: z.string().min(1, "$ Funds Raised is required").refine((val) => {
    const num = parseFloat(val)
    return !isNaN(num) && num >= 0
  }, "Must be a valid number"),
})

type FormData = z.infer<typeof FormSchema>

export default function CommunitySevaSubmitPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    defaultValues: {
      submission_by: "",
      event_name: "",
      volunteer_hours: "",
      meals_served: "",
      community_events: "",
      funds_raised: ""
    }
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    
    try {
      const dbData = {
        submission_by: data.submission_by,
        event_name: data.event_name,
        volunteer_hours: parseInt(data.volunteer_hours),
        meals_served: parseInt(data.meals_served),
        community_events: parseInt(data.community_events),
        funds_raised: parseFloat(data.funds_raised)
      }
      
      const { error } = await supabase
        .from('community_seva_records')
        .insert([dbData])
      
      if (!error) {
        toast({
          title: "Data submitted successfully!",
          description: "Jay Shree Swaminarayan",
          className: "bg-green-500 text-white border-green-400 shadow-xl font-medium",
        })
        reset()
      } else {
        toast({
          title: "Submission failed",
          description: error.message,
          className: "bg-red-500 text-white border-red-400 shadow-xl font-medium",
        })
      }
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please check your connection and try again.",
        className: "bg-red-500 text-white border-red-400 shadow-xl font-medium",
      })
    } finally {
      setTimeout(() => setIsSubmitting(false), 2000)
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <>
      <div className="min-h-[calc(100vh+200px)] w-full reg-page-bg page-bg-extend" data-page="registration">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 page-bottom-spacing">
          <div className="text-center page-header-spacing">
            <motion.h1 
              className="standard-page-title reg-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Community Seva Data Submission
            </motion.h1>
            
            <motion.div 
              className="flex justify-center px-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <p className="text-center text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-5xl">
                Submit community seva event data and track our collective impact.
              </p>
            </motion.div>
          </div>

          <div className="max-w-3xl mx-auto">
            <motion.div 
              className="relative mt-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-200/30 via-white/20 to-red-200/30 rounded-[2rem] blur-xl opacity-40 will-change-transform"></div>
              <div className="relative">
                <Card className="reg-card rounded-3xl overflow-hidden relative">
                  <CardHeader className="text-center pb-6 lg:pb-8">
                    <CardTitle className="text-xl lg:text-2xl font-semibold reg-text-primary">Event Data Form</CardTitle>
                    <CardDescription className="reg-text-secondary text-base">Please fill in the event details</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="submission_by" className="reg-label">Data Submitter *</Label>
                        <Controller
                          name="submission_by"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id="submission_by"
                              type="text"
                              placeholder="Enter your name"
                              className="reg-input rounded-md"
                            />
                          )}
                        />
                        {errors.submission_by && (
                          <p className="reg-error-text">{errors.submission_by.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="event_name" className="reg-label">Event Name *</Label>
                        <Controller
                          name="event_name"
                          control={control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              id="event_name"
                              type="text"
                              placeholder="Enter event name"
                              className="reg-input rounded-md"
                            />
                          )}
                        />
                        {errors.event_name && (
                          <p className="reg-error-text">{errors.event_name.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="volunteer_hours" className="reg-label">Total Volunteer Hours *</Label>
                          <Controller
                            name="volunteer_hours"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                id="volunteer_hours"
                                type="number"
                                min="0"
                                placeholder="Enter hours"
                                className="reg-input rounded-md"
                              />
                            )}
                          />
                          {errors.volunteer_hours && (
                            <p className="reg-error-text">{errors.volunteer_hours.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="meals_served" className="reg-label"># Meals Served *</Label>
                          <Controller
                            name="meals_served"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                id="meals_served"
                                type="number"
                                min="0"
                                placeholder="Enter number"
                                className="reg-input rounded-md"
                              />
                            )}
                          />
                          {errors.meals_served && (
                            <p className="reg-error-text">{errors.meals_served.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="community_events" className="reg-label"># of Community events *</Label>
                          <Controller
                            name="community_events"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                id="community_events"
                                type="number"
                                min="0"
                                placeholder="Enter number"
                                className="reg-input rounded-md"
                              />
                            )}
                          />
                          {errors.community_events && (
                            <p className="reg-error-text">{errors.community_events.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="funds_raised" className="reg-label">$ Funds Raised *</Label>
                          <Controller
                            name="funds_raised"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                id="funds_raised"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Enter amount"
                                className="reg-input rounded-md"
                              />
                            )}
                          />
                          {errors.funds_raised && (
                            <p className="reg-error-text">{errors.funds_raised.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 space-y-4">
                        <button 
                          type="submit" 
                          disabled={isSubmitting}
                          className="reg-button relative w-full h-14 inline-flex items-center justify-center text-center px-4 py-2 text-base rounded-lg overflow-hidden"
                        >
                          <div className={`absolute inset-0 bg-gradient-to-b from-white/20 to-transparent transform transition-transform duration-500 ${isSubmitting ? 'translate-y-0' : 'translate-y-full'}`}></div>
                          <div className="relative z-10 flex items-center justify-center gap-2">
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Please wait
                              </>
                            ) : (
                              <>
                                <Send className="w-5 h-5" />
                                Submit Data
                              </>
                            )}
                          </div>
                        </button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  )
}
