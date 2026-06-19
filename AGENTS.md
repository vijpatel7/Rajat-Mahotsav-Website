## Learned User Preferences

- Prefers to preview changes on a local dev server (`npm run dev`, http://localhost:3000) before approving; often explicitly asks to start the server.
- For redesign work, wants several design options shown first as a local mockup (often via the `/frontend-design` skill) before any implementation.
- Frequently asks the agent to commit and push directly to the remote (including `main`) once changes look good.
- Wants Supabase/DB calls for live counters kept strictly read-only, secure, and unbounded (no row limits); asks to validate this before shipping.
- When renaming user-facing labels, keep internal DB field names stable (e.g. label "Family Name" → "Name" while the `family_name` field is unchanged).
- Uses the `cursor/` branch prefix for new work branches.

## Learned Workspace Facts

- Homepage countdown target date lives in `app/page.tsx` (`targetDate`) and is defaulted in `components/organisms/landing-page.tsx` and `landing-page-mobile.tsx`.
- The memories submission route is `/memories` (`app/memories/page.tsx`); old `/share-memories` 308-redirects to it via `next.config.mjs`.
- Memory/content submissions upload via presigned URL → direct PUT to R2 → metadata in Supabase (`content_submissions`, `image_keys` JSON with `content_type`/`size_bytes`); presigned URLs expire in 10 minutes.
- R2 `FOLDER_PREFIX = "share-memories"` in `app/api/generate-content-submission-upload-urls/route.ts` must stay unchanged even though the route moved; renaming it orphans existing uploads.
- Upload file type/size validation is client-metadata only at presign time (no magic-byte check) — a known gap noted in `SECURITY.md`.
- Live counters on the community-seva and spiritual-seva pages tally Supabase submission data using shared components.
- Dev server runs on `localhost:3000` via `npm run dev` and reads config from `.env.local`.
