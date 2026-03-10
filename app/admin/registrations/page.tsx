import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { isAdminDomainUser } from "@/lib/admin-auth"
import { REGISTRATION_DATE_RANGE } from "@/lib/registration-date-range"
import { StandardPageHeader } from "@/components/organisms/standard-page-header"
import { AdminSignIn } from "./AdminSignIn"
import type { RegistrationsStats } from "./types"
import { AdminDashboardStats } from "./AdminDashboardStats"
import { AdminRegistrationsTable } from "./AdminRegistrationsTable"

export const dynamic = "force-dynamic"

export default async function AdminRegistrationsPage() {
  let supabase
  try {
    supabase = await createClient()
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Supabase is not configured."
    return (
      <div className="page-bg-extend reg-page-bg min-h-screen">
        <div className="container mx-auto px-4 page-bottom-spacing max-w-6xl">
          <StandardPageHeader
            title="Admin Access"
            description={message}
          />
          <p className="text-sm reg-text-secondary mt-4 text-center max-w-lg mx-auto">
            Ensure .env.local is in the project root (where you run npm run dev)
            and restart the dev server after changes.
          </p>
        </div>
      </div>
    )
  }
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    if (!isAdminDomainUser(user)) {
      redirect("/admin/registrations/unauthorized")
    }

    const { data: statsData, error: statsError } = await supabase.rpc(
      "get_registrations_stats",
      {
        p_start_date: REGISTRATION_DATE_RANGE.start,
        p_end_date: REGISTRATION_DATE_RANGE.end,
      }
    )

    const stats = statsError ? null : (statsData as RegistrationsStats)

    return (
      <div className="page-bg-extend reg-page-bg min-h-screen">
        <div className="container mx-auto px-4 page-bottom-spacing max-w-6xl">
          <StandardPageHeader
            title="Registrations Admin"
            description="Insights and registrations data for the Rajat Mahotsav."
          />
          {stats ? (
            <>
              <AdminDashboardStats stats={stats} userEmail={user.email ?? ""} />
              <div className="mt-6">
                <AdminRegistrationsTable initialTotalCount={stats.total_registrations} />
              </div>
            </>
          ) : (
            <div className="p-6 rounded-2xl admin-card max-w-2xl mx-auto">
              <p className="reg-text-primary">
                Stats unavailable. {statsError?.message ?? "Please try again."}
              </p>
              <div className="mt-6">
                <AdminRegistrationsTable />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="page-bg-extend reg-page-bg min-h-screen">
      <div className="container mx-auto px-4 page-bottom-spacing max-w-6xl">
        <StandardPageHeader
          title="Admin Access"
          description="Sign in with your @nj.sgadi.us Google account to view registrations."
        />
        <div className="mt-12 flex justify-center">
          <AdminSignIn />
        </div>
      </div>
    </div>
  )
}
