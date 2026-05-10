import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { isContentSubmissionsViewer } from "@/lib/admin-auth"
import {
  CONTENT_SUBMISSIONS_TABLE,
  CONTENT_SUBMISSION_STATUSES,
  type ContentSubmissionStatus,
} from "@/lib/content-submissions-admin"

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const headers = new Headers()
  headers.set("Cache-Control", "no-store, max-age=0")

  const { id } = await context.params
  if (!id || !UUID_RE.test(id)) {
    return NextResponse.json(
      { error: "Invalid id" },
      { status: 400, headers }
    )
  }

  let supabase
  try {
    supabase = await createClient()
  } catch (err) {
    return NextResponse.json(
      { error: "Supabase not configured", details: String(err) },
      { status: 500, headers }
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers }
    )
  }
  if (!isContentSubmissionsViewer(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403, headers })
  }

  let body: { status?: string; notes?: string | null }
  try {
    body = (await request.json()) as { status?: string; notes?: string | null }
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400, headers }
    )
  }

  const update: {
    status?: ContentSubmissionStatus
    notes?: string | null
    posted_at?: string | null
    updated_at?: string
  } = { updated_at: new Date().toISOString() }

  if (body.status !== undefined) {
    if (!CONTENT_SUBMISSION_STATUSES.includes(body.status as ContentSubmissionStatus)) {
      return NextResponse.json(
        { error: `Invalid status. Allowed: ${CONTENT_SUBMISSION_STATUSES.join(", ")}` },
        { status: 400, headers }
      )
    }
    update.status = body.status as ContentSubmissionStatus
    update.posted_at = body.status === "posted" ? new Date().toISOString() : null
  }

  if (body.notes !== undefined) {
    update.notes = body.notes ? String(body.notes).slice(0, 2000) : null
  }

  const { data, error } = await supabase
    .from(CONTENT_SUBMISSIONS_TABLE)
    .update(update)
    .eq("id", id)
    .select("id,status,notes,posted_at,updated_at")
    .single()

  if (error) {
    return NextResponse.json(
      { error: "Update failed", details: error.message },
      { status: 500, headers }
    )
  }

  return NextResponse.json({ success: true, row: data }, { headers })
}
