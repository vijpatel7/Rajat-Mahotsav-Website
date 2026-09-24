## Learned User Preferences

- Prefers to preview changes on a local dev server (`npm run dev`, http://localhost:3000) before approving; often explicitly asks to start the server.
- For redesign work, wants several design options shown first as a local mockup (often via the `/frontend-design` skill) before any implementation.
- Rejects generic AI design tells (buzzing dots, thin accent-line rectangles, tiny eyebrow labels before titles); designs must match existing site fonts, colors, and patterns.
- For new information pages, closely reuse existing info-page styling rather than inventing a divergent look.
- Commit and push only when explicitly asked; confirm before pushing to `main`.
- Prefers isolated feature work in git worktrees created from remote `main`.
- For DB migrations and bulk data uploads, prepare artifacts for review and wait for explicit approval before running or submitting.
- Wants Supabase/DB calls for live counters kept strictly read-only, secure, and unbounded (no row limits); asks to validate this before shipping.
- When renaming user-facing labels, keep internal DB field names stable (e.g. label "Family Name" → "Name" while the `family_name` field is unchanged).
- Uses the `cursor/` branch prefix for new work branches.
- Homepage "current schedule" / now-happening messaging should use general session or event names, not live minute-to-minute program tracking (programs often run late).

## Learned Workspace Facts

- Homepage countdown target date lives in `app/page.tsx` (`targetDate`) and is defaulted in `components/organisms/landing-page.tsx` and `landing-page-mobile.tsx`.
- The memories submission route is `/memories` (`app/memories/page.tsx`); old `/share-memories` 308-redirects to it via `next.config.mjs`.
- Memory/content submissions upload via presigned URL → direct PUT to R2 → metadata in Supabase (`content_submissions`, `image_keys` JSON with `content_type`/`size_bytes`); presigned URLs expire in 10 minutes.
- R2 `FOLDER_PREFIX = "share-memories"` in `app/api/generate-content-submission-upload-urls/route.ts` must stay unchanged even though the route moved; renaming it orphans existing uploads.
- Upload file type/size validation is client-metadata only at presign time (no magic-byte check) — a known gap noted in `SECURITY.md`.
- Live counters on the community-seva and spiritual-seva pages tally Supabase submission data using shared components.
- Spiritual seva submissions include a `jaap` (mantra repetitions) column reflected in form, admin, and aggregate stats.
- Detailed public event schedule lives in `lib/schedule-data.ts` (session-grouped); keep internal logistics unpublished; timeline content stays in `lib/timeline-data.ts`.
- Schedule UI copy uses American "Schedule" (not "programmes"); homepage/current-event surfaces should show general day/session realm, not live minute-to-minute program titles.
- Primary nav order starts Home then Schedule; CTAs favor Schedule over Registration (registration closed); Latest Events and Media routes remain but are hidden from toolbars.
- Parking & Transportation lives at `/parking` with content in `lib/parking-data.ts`; keep it visually aligned with existing information pages like guest-services.
- Community seva `hours` is stored as `float4` so half-hour values are supported.

## Architecture

- Next.js 15 App Router site (routes under `app/`); `npm run dev`, `npm run build`, `npm run lint`, `npm test` (vitest).
- Components follow atomic design in `components/`: `atoms/`, `molecules/`, `organisms/`, `templates/`, plus shadcn/ui in `components/ui/`.
- `app/layout.tsx` nests `LoadingProvider` (`hooks/use-loading.tsx`) > `AudioProvider` (`contexts/audio-context.tsx`) > `ThemeProvider`, which forces light mode (`forcedTheme="light"`).
- Static assets come from the Cloudflare R2 CDN (`https://cdn.njrajatmahotsav.com`); use the helpers in `lib/cdn-assets.ts` (`getCloudflareImage`, `getCloudflareImageMobileWp`, `getCloudflareImageBiggest`).
- Supabase clients live in `utils/supabase/` and read `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (falling back to `NEXT_PUBLIC_SUPABASE_ANON_KEY`) from `.env.local`.
- Styling is Tailwind CSS v4; fonts are exposed as `--font-figtree`, `--font-instrument-serif`, and `--font-gujarati`.
- `next.config.mjs` sets `eslint.ignoreDuringBuilds` and `typescript.ignoreBuildErrors`, so a passing build does not mean lint or types are clean.
- Path alias `@/*` maps to the repo root.
