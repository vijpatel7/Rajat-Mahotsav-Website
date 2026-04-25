"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input"
import { Input } from "@/components/atoms/input"
import { Label } from "@/components/atoms/label"
import { Send, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/atoms/select"
import { CountrySelector } from "@/components/molecules/country-selector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/atoms/card"
import { Checkbox } from "@/components/atoms/checkbox"
import LazyPhoneInput from "@/components/molecules/lazy-phone-input"
import { useToast } from "@/hooks/use-toast"
import "@/styles/registration-theme.css"

const sevaTypes = [
  { id: "malas", label: "Malas" },
  { id: "dhyan", label: "Dhyan (Minutes)" },
  { id: "pradakshinas", label: "Pradakshinas" },
  { id: "dandvats", label: "Dandvats" },
  { id: "padyatras", label: "Padyatras (KM)" }
]

const FormSchema = z.object({
  firstName: z.string().min(1, "First name is required").regex(/^[A-Za-z]+$/, "First name must contain only letters"),
  middleName: z.string().optional().refine((val) => !val || /^[A-Za-z]+$/.test(val), "Middle name must contain only letters"),
  lastName: z.string().min(1, "Last name is required").regex(/^[A-Za-z]+$/, "Last name must contain only letters"),
  ghaam: z.string().min(1, "Ghaam is required").regex(/^[A-Za-z]+$/, "Ghaam must contain only letters"),
  country: z.string().min(1, "Country is required"),
  mandal: z.string().min(1, "Mandal is required"),
  phoneCountryCode: z.string().min(1, "Phone country code is required"),
  phone: z.string().min(1, "Phone number is required").refine((value) => value && isValidPhoneNumber(value), {
    message: "Invalid phone number",
  }),
  selectedSevas: z.array(z.string()).min(1, "Please select at least one seva type"),
  malas: z.string().optional(),
  dhyan: z.string().optional(),
  pradakshinas: z.string().optional(),
  dandvats: z.string().optional(),
  padyatras: z.string().optional(),
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

type FormData = z.infer<typeof FormSchema>

export function SevaSubmissionForm() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({ country: "", mandal: "" })
  const [phoneCountry, setPhoneCountry] = useState<string>("US")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedSevas, setSelectedSevas] = useState<string[]>([])

  const { control, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "", middleName: "", lastName: "", ghaam: "", country: "", mandal: "",
      phoneCountryCode: "", phone: "", selectedSevas: [],
      malas: "", dhyan: "", pradakshinas: "", dandvats: "", padyatras: ""
    }
  })

  const getPhoneCountryFromCountry = (country: string) => {
    const countryMap: { [key: string]: string } = {
      "australia": "AU", "canada": "CA", "england": "GB", "india": "IN", "kenya": "KE", "usa": "US"
    }
    return countryMap[country] || "US"
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      let nationalNumber = data.phone
      if (data.phone && isValidPhoneNumber(data.phone)) {
        const parsed = parsePhoneNumber(data.phone)
        if (parsed) nationalNumber = parsed.nationalNumber
      }
      
      const sevaData = {
        first_name: data.firstName, middle_name: data.middleName || null, last_name: data.lastName,
        ghaam: data.ghaam, country: data.country, mandal: data.mandal,
        phone_country_code: data.phoneCountryCode, mobile_number: nationalNumber,
        sevas: data.selectedSevas.reduce((acc, seva) => {
          acc[seva] = parseInt(data[seva as keyof FormData] as string)
          return acc
        }, {} as Record<string, number>)
      }
      
      console.log('Seva submission:', sevaData)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
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
    const newSelected = checked ? [...selectedSevas, sevaId] : selectedSevas.filter(id => id !== sevaId)
    setSelectedSevas(newSelected)
    setValue("selectedSevas", newSelected, { shouldValidate: true })
  }

  return (
    <Card className="reg-card rounded-3xl overflow-hidden relative">
      <CardHeader className="text-center pb-6 lg:pb-8">
        <CardTitle className="text-2xl lg:text-3xl font-semibold reg-text-primary">Seva Submission Form</CardTitle>
        <CardDescription className="reg-text-secondary">Record your spiritual seva</CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="reg-label">First Name *</Label>
              <Controller name="firstName" control={control} render={({ field }) => (
                <Input {...field} id="firstName" type="text" placeholder="First name" className="reg-input rounded-md" />
              )} />
              {errors.firstName && <p className="reg-error-text">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="middleName" className="reg-label">Middle Name</Label>
              <Controller name="middleName" control={control} render={({ field }) => (
                <Input {...field} id="middleName" type="text" placeholder="Middle name" className="reg-input rounded-md" />
              )} />
              {errors.middleName && <p className="reg-error-text">{errors.middleName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="reg-label">Last Name *</Label>
              <Controller name="lastName" control={control} render={({ field }) => (
                <Input {...field} id="lastName" type="text" placeholder="Last name" className="reg-input rounded-md" />
              )} />
              {errors.lastName && <p className="reg-error-text">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ghaam" className="reg-label">Ghaam *</Label>
              <Controller name="ghaam" control={control} render={({ field }) => (
                <Input {...field} id="ghaam" type="text" placeholder="Enter your ghaam" className="reg-input rounded-md" />
              )} />
              {errors.ghaam && <p className="reg-error-text">{errors.ghaam.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="reg-label">Phone Number *</Label>
              <Controller name="phone" control={control} render={({ field }) => (
                <LazyPhoneInput value={field.value} id="phone" placeholder="Enter a phone number" defaultCountry={phoneCountry as any}
                  onChange={(value) => {
                    field.onChange(value)
                    if (value && isValidPhoneNumber(value)) {
                      const parsed = parsePhoneNumber(value)
                      if (parsed) setValue("phoneCountryCode", `+${parsed.countryCallingCode}`, { shouldValidate: true })
                    }
                  }} />
              )} />
              {errors.phone && <p className="reg-error-text">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country" className="reg-label">Country *</Label>
              <Controller name="country" control={control} render={({ field }) => (
                <CountrySelector value={field.value} onChange={(value) => {
                  field.onChange(value)
                  updateFormData("country", value)
                  setPhoneCountry(getPhoneCountryFromCountry(value))
                  
                  const mandalMap: { [key: string]: string } = { "india": "Maninagar", "australia": "Perth", "canada": "Toronto", "kenya": "Nairobi" }
                  const mandal = mandalMap[value] || ""
                  updateFormData("mandal", mandal)
                  setValue("mandal", mandal, { shouldValidate: true })
                }} placeholder="Select your country" />
              )} />
              {errors.country && <p className="reg-error-text">{errors.country.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="mandal" className="reg-label">Mandal *</Label>
              <Controller name="mandal" control={control} render={({ field }) => (
                (["india", "australia", "canada", "kenya"].includes(formData.country)) ? (
                  <Input {...field} value={formData.mandal} disabled className="reg-input rounded-md" />
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
              )} />
              {errors.mandal && <p className="reg-error-text">{errors.mandal.message}</p>}
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <Label className="reg-label text-lg">Select Seva Types *</Label>
            <div className="space-y-3">
              {sevaTypes.map((seva) => (
                <div key={seva.id} className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <Checkbox id={seva.id} checked={selectedSevas.includes(seva.id)}
                      onCheckedChange={(checked) => handleSevaToggle(seva.id, checked as boolean)}
                      className="border-orange-300 data-[state=checked]:bg-orange-500" />
                    <Label htmlFor={seva.id} className="reg-label cursor-pointer">{seva.label}</Label>
                  </div>
                  {selectedSevas.includes(seva.id) && (
                    <Controller name={seva.id as keyof FormData} control={control} render={({ field }) => (
                      <Input {...field} type="number" min="1" placeholder={`Enter ${seva.label.toLowerCase()} count`}
                        className="reg-input rounded-md ml-8" />
                    )} />
                  )}
                </div>
              ))}
            </div>
            {errors.selectedSevas && <p className="reg-error-text">{errors.selectedSevas.message}</p>}
          </div>

          <div className="pt-4 space-y-4">
            <button type="submit" disabled={isSubmitting}
              className="reg-button relative w-full h-14 inline-flex items-center justify-center text-center px-4 py-2 text-base rounded-lg overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-b from-white/20 to-transparent transform transition-transform duration-500 ${isSubmitting ? 'translate-y-0' : 'translate-y-full'}`}></div>
              <div className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting ? (<><Loader2 className="w-5 h-5 animate-spin" />Please wait</>) : (<><Send className="w-5 h-5" />Submit Seva</>)}
              </div>
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
