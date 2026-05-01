import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default function LegacyPersonalSevaSubmissionsPage() {
  redirect("/admin/spiritual-seva-submissions")
}
