import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { z } from "zod"

const RegistrationSchema = z.object({
  first_name: z.string().min(1),
  middle_name: z.string().nullable().optional(),
  last_name: z.string().min(1),
  age: z.number().int().min(1).max(99),
  ghaam: z.string().min(1),
  country: z.string().min(1),
  mandal: z.string().min(1),
  email: z.string().email(),
  phone_country_code: z.string().min(1),
  mobile_number: z.string().min(1),
  arrival_date: z.string().min(1),
  departure_date: z.string().min(1),
})

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error("Missing Supabase service role configuration")
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  })
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = RegistrationSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid data", details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const dbData = parsed.data

  let supabase
  try {
    supabase = getServiceClient()
  } catch (err) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    )
  }

  // Check for existing record by the 4 unique fields
  const { data: existing } = await supabase
    .from("registrations")
    .select("id")
    .eq("first_name", dbData.first_name)
    .eq("age", dbData.age)
    .eq("email", dbData.email)
    .eq("mobile_number", dbData.mobile_number)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from("registrations")
      .update(dbData)
      .eq("id", existing.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true, updated: true })
  }

  const { error } = await supabase.from("registrations").insert([dbData])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true, updated: false }, { status: 201 })
}
