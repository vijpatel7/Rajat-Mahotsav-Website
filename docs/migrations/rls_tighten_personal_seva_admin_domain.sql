-- RLS Tightening: allow personal seva submissions SELECT for authenticated @nj.sgadi.us admins
-- Apply in Supabase before relying on /admin/personal-seva-submissions.
-- Ref: security-rls-basics, security-rls-performance (wrap auth calls in SELECT for performance)

-- Replace any prior version of this policy so the migration is safe to rerun.
DROP POLICY IF EXISTS "admin_domain_select" ON public.personal_seva_submission;

CREATE POLICY "admin_domain_select"
  ON public.personal_seva_submission
  FOR SELECT
  TO authenticated
  USING (
    (select auth.email())::text ilike '%@nj.sgadi.us'
  );

-- This migration intentionally does not enable/disable RLS or alter public write
-- policies. Keep existing INSERT/UPDATE policies so the community seva form can
-- continue creating submissions and marking uploaded images.
