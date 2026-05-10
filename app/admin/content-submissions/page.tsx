import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { isAdminDomainUser } from "@/lib/admin-auth"
import { CONTENT_SUBMISSIONS_TABLE } from "@/lib/content-submissions-admin"
import { StandardPageHeader } from "@/components/organisms/standard-page-header"
import { AdminSignIn } from "../registrations/AdminSignIn"
import { AdminContentSubmissionsView } from "./AdminContentSubmissionsView"

export const dynamic = "force-dynamic"

export default async function AdminContentSubmissionsPage() {
  let supabase
  try {
    supabase = await createClient()
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Supabase is not configured."
    return (
      <div className="page-bg-extend reg-page-bg min-h-screen">
        <div className="container mx-auto max-w-6xl px-4 page-bottom-spacing">
          <StandardPageHeader title="Admin Access" description={message} />
          <p className="reg-text-secondary mx-auto mt-4 max-w-lg text-center text-sm">
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
      .from(CONTENT_SUBMISSIONS_TABLE)
      .select("id", { count: "exact", head: true })

    return (
      <div className="page-bg-extend reg-page-bg min-h-screen">
        <div className="container mx-auto max-w-6xl px-4 page-bottom-spacing">
          <StandardPageHeader
            title="Mahotsav Memories"
            description="Photos and stories submitted by the community. Approve, post, or archive entries for the social team."
          />
          <AdminContentSubmissionsView initialTotalCount={count ?? null} />
        </div>
      </div>
    )
  }

  return (
    <div className="page-bg-extend reg-page-bg min-h-screen">
      <div className="container mx-auto max-w-6xl px-4 page-bottom-spacing">
        <StandardPageHeader
          title="Admin Access"
          description="Sign in with your @nj.sgadi.us Google account to view community memory submissions."
        />
        <div className="mt-12 flex justify-center">
          <AdminSignIn nextPath="/admin/content-submissions" />
        </div>
      </div>
    </div>
  )
}
