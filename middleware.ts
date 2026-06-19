import { NextResponse, type NextRequest } from "next/server"
import { updateSession } from "@/utils/supabase/middleware"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Canonicalize to lowercase paths. URL paths are case-sensitive, so a request
  // for /MEMORIES would 404 instead of resolving to the /memories route. When a
  // page path contains uppercase characters, 308-redirect to its lowercase form
  // (308 preserves method + body) so manually typed/capitalized URLs still work
  // and search engines see a single canonical URL.
  //
  // Skip API routes and anything that looks like a file (has an extension) to
  // avoid breaking case-sensitive endpoints or static assets. Query string and
  // hash are preserved automatically by cloning nextUrl.
  const hasExtension = /\.[a-z0-9]+$/i.test(pathname)
  if (
    !pathname.startsWith("/api") &&
    !hasExtension &&
    pathname !== pathname.toLowerCase()
  ) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = pathname.toLowerCase()
    return NextResponse.redirect(redirectUrl, 308)
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - static assets (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
