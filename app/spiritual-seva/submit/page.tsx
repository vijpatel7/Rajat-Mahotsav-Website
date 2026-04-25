"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input"
import { supabasePublic as supabase } from "@/utils/supabase/public-client"
import { Button } from "@/components/atoms/button"
import { Input } from "@/components/atoms/input"
import { Label } from "@/components/atoms/label"
import { Send, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select"
import { CountrySelector } from "@/components/molecules/country-selector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card"
import { Checkbox } from "@/components/atoms/checkbox"
import LazyPhoneInput from "@/components/molecules/lazy-phone-input"
import { Toaster } from "@/components/molecules/toaster"
import { useToast } from "@/hooks/use-toast"
import { useDeviceType } from "@/hooks/use-device-type"
import Typewriter from "@/components/atoms/typewriter"
import "@/styles/registration-theme.css"


const sevaTypes = [
  { id: "malas", label: "Malas" },
  { id: "dhyan", label: "Dhyan (Minutes)" },
  { id: "pradakshinas", label: "Pradakshinas" },
  { id: "dandvats", label: "Dandvats" },
  { id: "padyatras", label: "Padyatras" },
  { id: "sadachar", label: "Sadachar Sandesh Parayan" },
  { id: "harignanamrut", label: "Harignanamrut Kavya Parayan" },
  { id: "bapashree", label: "Bapashree ni Vato Parayan" },
  { id: "upvas", label: "Upvas" }
]

const SubmitFormSchema = z.object({
  firstName: z.string().min(1, "First name is required").regex(/^[A-Za-z]+$/, "First name must contain only letters"),
  middleName: z.string().optional().refine((val) => !val || /^[A-Za-z]+$/.test(val), "Middle name must contain only letters"),
  lastName: z.string().min(1, "Last name is required").regex(/^[A-Za-z]+$/, "Last name must contain only letters"),
  ghaam: z.string().min(1, "Ghaam is required").regex(/^[A-Za-z]+$/, "Ghaam must contain only letters"),
  country: z.string().min(1, "Country is required"),
  mandal: z.string().min(1, "Mandal is required"),
  phoneCountryCode: z.string().min(1, "Phone country code is required"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine((value) => value && isValidPhoneNumber(value), {
      message: "Invalid phone number",
    }),
  selectedSevas: z.array(z.string()).min(1, "Please select at least one seva type"),
  malas: z.string().optional(),
  dhyan: z.string().optional(),
  pradakshinas: z.string().optional(),
  dandvats: z.string().optional(),
  padyatras: z.string().optional(),
  sadachar: z.string().optional(),
  harignanamrut: z.string().optional(),
  bapashree: z.string().optional(),
  upvas: z.string().optional(),
}).refine((data) => {
  for (const seva of data.selectedSevas) {
    const count = data[seva as keyof typeof data]
    if (!count || count === "" || parseInt(count as string) <= 0) {
      return false
    }
  }
  return true
}, {
  message: "Please enter valid counts for all selected sevas",
  path: ["selectedSevas"]
})

const ViewFormSchema = z.object({
  phoneCountryCode: z.string().min(1, "Phone country code is required"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine((value) => value && isValidPhoneNumber(value), {
      message: "Invalid phone number",
    }),
})

type FormData = z.infer<typeof SubmitFormSchema>

export default function SevaSubmissionPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    country: "",
    mandal: ""
  })
  const [phoneCountry, setPhoneCountry] = useState<string>("US")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedSevas, setSelectedSevas] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<"submit" | "view">("submit")
  const [submissions, setSubmissions] = useState<any[]>([])

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<FormData>({
    resolver: (values, context, options) => {
      const schema = activeTab === "submit" ? SubmitFormSchema : ViewFormSchema
      return zodResolver(schema)(values, context, options)
    },
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      ghaam: "",
      country: "",
      mandal: "",
      phoneCountryCode: "",
      phone: "",
      selectedSevas: [],
      malas: "",
      dhyan: "",
      pradakshinas: "",
      dandvats: "",
      padyatras: "",
      sadachar: "",
      harignanamrut: "",
      bapashree: "",
      upvas: ""
    }
  })

  const getPhoneCountryFromCountry = (country: string) => {
    const countryMap: { [key: string]: string } = {
      "australia": "AU",
      "canada": "CA",
      "england": "GB",
      "india": "IN",
      "kenya": "KE",
      "usa": "US"
    }
    return countryMap[country] || "US"
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)

    if (activeTab === "view") {
      // View submissions logic
      // console.log('Fetching submissions for:', data)
      let nationalNumber = data.phone
      if (data.phone && isValidPhoneNumber(data.phone)) {
        try {
          const parsed = parsePhoneNumber(data.phone)
          if (parsed) {
            nationalNumber = parsed.nationalNumber
          }
        } catch (error) {
          console.log("Phone parsing error:", error)
        }
      }

      const { data: submissionsData, error: fetchError } = await supabase
        .from('spiritual_seva_submission')
        .select('*')
        .eq('mobile_number', nationalNumber)
        .order('created_at', { ascending: false })

      if (fetchError) {
        console.error("Fetch error:", fetchError)
        toast({
          title: "Error fetching submissions",
          description: fetchError.message,
          variant: "destructive",
        })
      } else {
        const formattedSubmissions = submissionsData.map(sub => ({
          date: new Date(sub.created_at).toLocaleDateString(),
          malas: sub.malas,
          dhyan: sub.dhyan,
          pradakshinas: sub.pradakshinas,
          dandvats: sub.dandvats,
          padyatras: sub.padyatras,
          sadachar: sub.sadachar,
          harignanamrut: sub.harignanamrut,
          bapashree: sub.bapashree,
          upvas: sub.upvas
        }))
        setSubmissions(formattedSubmissions)
        if (formattedSubmissions.length === 0) {
          toast({
            title: "No submissions found",
            description: "No records found for this phone number.",
          })
        }
      }

      setIsSubmitting(false)
      return
    }

    try {
      let nationalNumber = data.phone
      if (data.phone && isValidPhoneNumber(data.phone)) {
        try {
          const parsed = parsePhoneNumber(data.phone)
          if (parsed) {
            nationalNumber = parsed.nationalNumber
          }
        } catch (error) {
          console.log("Phone parsing error:", error)
        }
      }

      const sevaData = {
        first_name: data.firstName,
        middle_name: data.middleName || null,
        last_name: data.lastName,
        ghaam: data.ghaam,
        country: data.country,
        mandal: data.mandal,
        phone_country_code: data.phoneCountryCode,
        mobile_number: nationalNumber,
        ...data.selectedSevas.reduce((acc, seva) => {
          acc[seva] = parseInt(data[seva as keyof FormData] as string)
          return acc
        }, {} as Record<string, number>)
      }

      // console.log('Seva submission:', sevaData)

      const { error: insertError } = await supabase
        .from('spiritual_seva_submission')
        .insert([sevaData])

      if (insertError) throw insertError

      // await new Promise(resolve => setTimeout(resolve, 1000))

      toast({
        title: `Seva recorded, ${data.firstName}!`,
        description: "Jay Shree Swaminarayan",
        className: "bg-green-500 text-white border-green-400 shadow-xl font-medium",
      })
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

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setValue(field as keyof FormData, value)
  }

  const getMandals = (country: string) => {
    const mandalOptions = {
      "england": ["Bolton", "London"],
      "usa": ["Alabama", "California", "Chicago", "Delaware", "Georgia", "Horseheads", "Kentucky", "New Jersey", "Ocala", "Ohio", "Seattle", "Tennessee", "Virginia"]
    }
    return mandalOptions[country as keyof typeof mandalOptions] || []
  }

  const handleSevaToggle = (sevaId: string, checked: boolean) => {
    const newSelected = checked
      ? [...selectedSevas, sevaId]
      : selectedSevas.filter(id => id !== sevaId)

    setSelectedSevas(newSelected)
    setValue("selectedSevas", newSelected, { shouldValidate: true })
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 200)
    return () => clearTimeout(timer)
  }, [])



  const calculateTotals = () => {
    return submissions.reduce((acc, submission) => {
      sevaTypes.forEach(seva => {
        acc[seva.id] = (acc[seva.id] || 0) + (submission[seva.id as keyof typeof submission] as number || 0)
      })
      return acc
    }, {} as Record<string, number>)
  }

  return (
    <>
      <div className={`min-h-[calc(100vh+200px)] w-full reg-page-bg page-bg-extend transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} data-page="registration">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 page-bottom-spacing">
          <div className="text-center page-header-spacing">
            <div className="flex justify-center min-h-[6rem] lg:min-h-[6rem] xl:min-h-[6rem]">
              <Typewriter
                text="Submit Your Spiritual Seva"
                speed={50}
                className="standard-page-title reg-title xl:whitespace-nowrap"
              />
            </div>
          </div>

          <div className="lg:grid lg:grid-cols-3 lg:gap-8 lg:items-start" style={{ gridAutoRows: 'auto' }}>
            <div className={`lg:col-span-1 transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              } mt-8 lg:mt-0 px-4 lg:px-0`} style={{ transitionDelay: '400ms' }}>
              <div className="reg-important-card rounded-xl p-4 lg:p-6 relative lg:sticky lg:top-8">
                <h3 className="text-center reg-text-primary font-semibold text-xl lg:text-2xl mb-4">Important</h3>
                <div className="space-y-3 text-justify">
                  <p className="reg-text-secondary leading-relaxed text-sm lg:text-base font-bold underline">
                    Please submit your spiritual seva completed since your last submission.
                  </p>
                  <p className="reg-text-secondary leading-relaxed text-sm lg:text-base">
                    Select the types of seva you have completed and enter the counts for each.
                  </p>
                  <p className="reg-text-secondary leading-relaxed text-sm lg:text-base">
                    All seva counts contribute to our collective spiritual goal.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 relative mt-8 lg:mt-0">
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-200/30 via-white/20 to-red-200/30 rounded-[2rem] blur-xl opacity-40 will-change-transform"></div>
              <div className={`relative transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                <Card className="reg-card rounded-3xl overflow-hidden relative">
                  <CardHeader className="pb-6 lg:pb-8">
                    <div className="flex gap-2 mb-6">
                      <button
                        type="button"
                        onClick={() => setActiveTab("submit")}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === "submit"
                          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                      >
                        Submit Seva
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("view")}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === "view"
                          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                      >
                        View Submissions
                      </button>
                    </div>
                    <CardTitle className="text-2xl lg:text-3xl font-semibold reg-text-primary text-center">
                      {activeTab === "submit" ? "Seva Submission Form" : "View My Submissions"}
                    </CardTitle>
                    <CardDescription className="reg-text-secondary text-center">
                      {activeTab === "submit" ? "Record your spiritual seva" : "View your submitted seva records"}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="reg-label">First Name *</Label>
                          <Controller
                            name="firstName"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                id="firstName"
                                type="text"
                                placeholder="First name"
                                className="reg-input rounded-md"
                              />
                            )}
                          />
                          {errors.firstName && (
                            <p className="reg-error-text">{errors.firstName.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="middleName" className="reg-label">Middle Name</Label>
                          <Controller
                            name="middleName"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                id="middleName"
                                type="text"
                                placeholder="Middle name"
                                className="reg-input rounded-md"
                              />
                            )}
                          />
                          {errors.middleName && (
                            <p className="reg-error-text">{errors.middleName.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="reg-label">Last Name *</Label>
                          <Controller
                            name="lastName"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                id="lastName"
                                type="text"
                                placeholder="Last name"
                                className="reg-input rounded-md"
                              />
                            )}
                          />
                          {errors.lastName && (
                            <p className="reg-error-text">{errors.lastName.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ghaam" className="reg-label">Ghaam *</Label>
                          <Controller
                            name="ghaam"
                            control={control}
                            render={({ field }) => (
                              <Input
                                {...field}
                                id="ghaam"
                                type="text"
                                placeholder="Enter your ghaam"
                                className="reg-input rounded-md"
                              />
                            )}
                          />
                          {errors.ghaam && (
                            <p className="reg-error-text">{errors.ghaam.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone" className="reg-label">Phone Number *</Label>
                          <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                              <LazyPhoneInput
                                value={field.value}
                                id="phone"
                                placeholder="Enter a phone number"
                                defaultCountry={phoneCountry as any}
                                onChange={(value) => {
                                  field.onChange(value)
                                  if (value && isValidPhoneNumber(value)) {
                                    try {
                                      const parsed = parsePhoneNumber(value)
                                      if (parsed) {
                                        setValue("phoneCountryCode", `+${parsed.countryCallingCode}`, { shouldValidate: true })
                                      }
                                    } catch (error) {
                                      console.log("Phone parsing error:", error)
                                    }
                                  }
                                }}
                              />
                            )}
                          />
                          {errors.phone && (
                            <p className="reg-error-text">{errors.phone.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="country" className="reg-label">Country *</Label>
                          <Controller
                            name="country"
                            control={control}
                            render={({ field }) => (
                              <CountrySelector
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value)
                                  updateFormData("country", value)

                                  const newPhoneCountry = getPhoneCountryFromCountry(value)
                                  setPhoneCountry(newPhoneCountry)

                                  if (value === "india") {
                                    updateFormData("mandal", "Maninagar")
                                    setValue("mandal", "Maninagar", { shouldValidate: true })
                                  } else if (value === "australia") {
                                    updateFormData("mandal", "Perth")
                                    setValue("mandal", "Perth", { shouldValidate: true })
                                  } else if (value === "canada") {
                                    updateFormData("mandal", "Toronto")
                                    setValue("mandal", "Toronto", { shouldValidate: true })
                                  } else if (value === "kenya") {
                                    updateFormData("mandal", "Nairobi")
                                    setValue("mandal", "Nairobi", { shouldValidate: true })
                                  } else {
                                    updateFormData("mandal", "")
                                    setValue("mandal", "", { shouldValidate: true })
                                  }
                                }}
                                placeholder="Select your country"
                              />
                            )}
                          />
                          {errors.country && (
                            <p className="reg-error-text">{errors.country.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="mandal" className="reg-label">Mandal *</Label>
                          <Controller
                            name="mandal"
                            control={control}
                            render={({ field }) => (
                              (formData.country === "india" || formData.country === "australia" || formData.country === "canada" || formData.country === "kenya") ? (
                                <Input
                                  {...field}
                                  value={formData.mandal}
                                  disabled
                                  className="reg-input rounded-md"
                                />
                              ) : (
                                <Select value={field.value} onValueChange={field.onChange} disabled={!formData.country}>
                                  <SelectTrigger className="reg-input rounded-md">
                                    <SelectValue placeholder={formData.country ? "Select mandal" : "Select country first"} />
                                  </SelectTrigger>
                                  <SelectContent className="reg-popover rounded-xl">
                                    {getMandals(formData.country).map((mandal) => (
                                      <SelectItem key={mandal} value={mandal.toLowerCase().replace(/ /g, '-')} className="reg-popover-item rounded-lg">{mandal}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )
                            )}
                          />
                          {errors.mandal && (
                            <p className="reg-error-text">{errors.mandal.message}</p>
                          )}
                        </div>
                      </div>

                      {activeTab === "submit" && (
                        <div className="space-y-4 pt-4">
                          <Label className="reg-label text-lg">Select Seva Types *</Label>
                          <div className="space-y-3">
                            {sevaTypes.map((seva) => (
                              <div key={seva.id} className="space-y-2">
                                <div className="flex items-center space-x-3">
                                  <Checkbox
                                    id={seva.id}
                                    checked={selectedSevas.includes(seva.id)}
                                    onCheckedChange={(checked) => handleSevaToggle(seva.id, checked as boolean)}
                                    className="border-orange-300 data-[state=checked]:bg-orange-500"
                                  />
                                  <Label htmlFor={seva.id} className="reg-label cursor-pointer">{seva.label}</Label>
                                </div>
                                {selectedSevas.includes(seva.id) && (
                                  <div className="ml-8 max-w-xs">
                                    <Controller
                                      name={seva.id as keyof FormData}
                                      control={control}
                                      render={({ field }) => (
                                        <Input
                                          {...field}
                                          type="number"
                                          min="1"
                                          placeholder={`Enter count`}
                                          className="reg-input rounded-md"
                                        />
                                      )}
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          {errors.selectedSevas && (
                            <p className="reg-error-text">{errors.selectedSevas.message}</p>
                          )}
                        </div>
                      )}

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
                                {activeTab === "submit" ? "Submit Seva" : "View My Submissions"}
                              </>
                            )}
                          </div>
                        </button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>

            </div>
          </div>

          {activeTab === "view" && submissions.length > 0 && (
            <div className="lg:col-span-3 relative mt-8">
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-200/30 via-white/20 to-red-200/30 rounded-[2rem] blur-xl opacity-40 will-change-transform"></div>
              <div className={`relative transition-all duration-1000 ease-out ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                <Card className="reg-card rounded-3xl overflow-hidden relative">
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl lg:text-2xl font-semibold reg-text-primary">Your Submissions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gradient-to-r from-orange-100 to-red-100">
                            <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-700 whitespace-nowrap">Date</th>
                            {sevaTypes.map(seva => (
                              <th key={seva.id} className="border border-gray-300 px-4 py-2 text-center font-semibold text-gray-700">{seva.label}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {submissions.map((submission, idx) => (
                            <tr key={idx} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-100"} hover:bg-orange-50 transition-colors`}>
                              <td className="border border-gray-300 px-4 py-2 font-medium whitespace-nowrap">{submission.date}</td>
                              {sevaTypes.map(seva => (
                                <td key={seva.id} className="border border-gray-300 px-4 py-2 text-center">
                                  {submission[seva.id as keyof typeof submission] || 0}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-gradient-to-r from-orange-200 to-red-200 font-bold">
                            <td className="border border-gray-300 px-4 py-2">Total</td>
                            {sevaTypes.map(seva => (
                              <td key={seva.id} className="border border-gray-300 px-4 py-2 text-center">
                                {calculateTotals()[seva.id] || 0}
                              </td>
                            ))}
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
      <Toaster />
    </>
  )
}
