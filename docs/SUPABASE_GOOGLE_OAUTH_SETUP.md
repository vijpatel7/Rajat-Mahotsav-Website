# Supabase Google OAuth Setup

This guide configures Google OAuth for the admin dashboard at `/admin/registrations`
and related gated admin pages.

## 1. Supabase Dashboard – Enable Google Provider

1. Go to [Supabase Dashboard](https://app.supabase.com) → your project → **Authentication** → **Providers**.
2. Find **Google** and enable it.
3. You will need a **Client ID** and **Client Secret** from Google Cloud Console (see below).
4. Paste them into the Supabase Google provider settings and save.

## 2. Google Cloud Console – Create OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/) and create or select a project.
2. Open **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID**.
3. Choose **Web application**.
4. **Authorized JavaScript origins**:
   - `http://localhost:3000` (local dev)
   - `https://njrajatmahotsav.com` (production)
5. **Authorized redirect URIs**:
   - Supabase callback: `https://efwvxiqyyunbyouemrhe.supabase.co/auth/v1/callback`
   - App callback: `http://localhost:3000/auth/callback` (local)
   - App callback: `https://njrajatmahotsav.com/auth/callback` (production)
6. Create and copy the **Client ID** and **Client Secret**.
7. Add them to the Supabase Google provider settings.

## 3. Supabase – Redirect URL Allow List

1. Go to **Authentication** → **URL Configuration**.
2. Add these to **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `https://njrajatmahotsav.com/auth/callback`
3. **Site URL** should be `https://njrajatmahotsav.com` (or `http://localhost:3000` for local testing).

## 4. Verification

1. Start the app: `npm run dev`.
2. Visit `/admin/registrations`, `/admin/personal-seva-submissions`, or another gated admin page.
3. Click **Sign in with Google**.
4. Complete the Google consent flow.
5. You should be redirected back to the admin page where you started, with a Supabase session (cookies set).
6. In DevTools → Application → Cookies, confirm `sb-*-auth-token` cookies are present.

## Environment Variables

Ensure `.env.local` has:

```
NEXT_PUBLIC_SUPABASE_URL=https://efwvxiqyyunbyouemrhe.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
# or
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

## Troubleshooting

- **"Supabase is not configured"** / env vars not loading: If using a git worktree, `.env.local` must exist in the worktree root (where you run `npm run dev`), not only in the main repo. Restart the dev server after adding or changing `.env.local`.
- **"redirect_uri_mismatch"**: Ensure the exact callback URL is in both Google Console and Supabase redirect allow list.
- **Session not persisting**: Check that middleware runs (see `middleware.ts`) and that cookies are not blocked.
- **"Invalid OAuth client"**: Verify Client ID/Secret in Supabase match the Google Console values.
