import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { isAdminDomainUser } from "@/lib/admin-auth"
import { SPIRITUAL_SEVA_TABLE } from "@/lib/spiritual-seva-admin"
import { StandardPageHeader } from "@/components/organisms/standard-page-header"
import { AdminSignIn } from "../registrations/AdminSignIn"
import { AdminSpiritualSevaTable } from "./AdminSpiritualSevaTable"

export const dynamic = "force-dynamic"

export default async function AdminSpiritualSevaSubmissionsPage() {
  let supabase
  try {
    supabase = await createClient()
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Supabase is not configured."
    return (
      <div className="page-bg-extend reg-page-bg min-h-screen">
        <div className="container mx-auto px-4 page-bottom-spacing max-w-6xl">
          <StandardPageHeader title="Admin Access" description={message} />
          <p className="text-sm reg-text-secondary mt-4 text-center max-w-lg mx-auto">
            Ensure .env.local is in the project root and restart the dev server
            after changes.
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

    const { count } = await supabase
      .from(SPIRITUAL_SEVA_TABLE)
      .select("id", { count: "exact", head: true })

    return (
      <div className="page-bg-extend reg-page-bg min-h-screen">
        <div className="container mx-auto px-4 page-bottom-spacing max-w-6xl">
          <StandardPageHeader
            title="Spiritual Seva Submissions"
            description="Secret admin view for reviewing spiritual seva entries and exporting the latest results."
          />
          <AdminSpiritualSevaTable initialTotalCount={count ?? null} />
        </div>
      </div>
    )
  }

  return (
    <div className="page-bg-extend reg-page-bg min-h-screen">
      <div className="container mx-auto px-4 page-bottom-spacing max-w-6xl">
        <StandardPageHeader
          title="Admin Access"
          description="Sign in with your @nj.sgadi.us Google account to view spiritual seva submissions."
        />
        <div className="mt-12 flex justify-center">
          <AdminSignIn nextPath="/admin/spiritual-seva-submissions" />
        </div>
      </div>
    </div>
  )
}
