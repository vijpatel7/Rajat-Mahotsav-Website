/**
 * Admin domain gate: only @nj.sgadi.us emails are allowed admin access.
 * Used by server-side admin routes and API handlers.
 *
 * /admin/content-submissions also accepts emails listed in the
 * CONTENT_SUBMISSIONS_VIEWERS env var (comma-separated). This is for the
 * social-media team, which doesn't have @nj.sgadi.us accounts.
 */

const ALLOWED_DOMAIN = "@nj.sgadi.us"

/**
 * Checks if the given email is allowed for admin access.
 * @param email - User email (e.g. from session.user.email)
 * @returns true if email ends with @nj.sgadi.us (case-insensitive), false otherwise
 */
export function isAllowedAdminDomain(email: string | null | undefined): boolean {
  if (!email || typeof email !== "string") return false
  return email.toLowerCase().endsWith(ALLOWED_DOMAIN.toLowerCase())
}

/**
 * Type for objects with an optional email property (e.g. Supabase User).
 */
type WithEmail = { email?: string | null }

/**
 * Checks if the given user has an allowed admin domain email.
 * @param user - User object with optional email (e.g. from session.user)
 * @returns true if user exists and email ends with @nj.sgadi.us, false otherwise
 */
export function isAdminDomainUser(user: WithEmail | null | undefined): boolean {
  return isAllowedAdminDomain(user?.email)
}

/**
 * Parses CONTENT_SUBMISSIONS_VIEWERS into a Set of lowercased emails.
 * Re-evaluated on every call so dev hot-reload picks up env edits.
 */
function getContentSubmissionsViewerSet(): Set<string> {
  const raw = process.env.CONTENT_SUBMISSIONS_VIEWERS ?? ""
  return new Set(
    raw
      .split(",")
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean)
  )
}

/**
 * Checks if the given user can view /admin/content-submissions.
 * Allows: any @nj.sgadi.us account, plus any email listed in
 * CONTENT_SUBMISSIONS_VIEWERS (intended for the social-media team).
 */
export function isContentSubmissionsViewer(
  user: WithEmail | null | undefined
): boolean {
  if (isAdminDomainUser(user)) return true
  const email = user?.email
  if (!email || typeof email !== "string") return false
  return getContentSubmissionsViewerSet().has(email.toLowerCase())
}
