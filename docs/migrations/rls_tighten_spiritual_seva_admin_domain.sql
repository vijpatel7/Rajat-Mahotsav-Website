-- RLS Tightening: allow spiritual seva submissions SELECT for authenticated @nj.sgadi.us admins
-- Apply in Supabase before relying on /admin/spiritual-seva-submissions.
-- Ref: security-rls-basics, security-rls-performance (wrap auth calls in SELECT for performance)

-- Replace any prior version of this policy so the migration is safe to rerun.
DROP POLICY IF EXISTS "admin_domain_select" ON public.spiritual_seva_submission;

CREATE POLICY "admin_domain_select"
  ON public.spiritual_seva_submission
  FOR SELECT
  TO authenticated
  USING (
    (select auth.email())::text ilike '%@nj.sgadi.us'
  );

-- This migration intentionally does not enable/disable RLS or alter public write
-- policies. Keep existing INSERT policies so the spiritual seva form can continue
-- creating submissions.
