-- Add jaap (mantra repetitions) to spiritual seva submissions.
-- Apply in Supabase SQL editor before relying on jaap in the form/admin/stats.
-- Also relaxes ghaam NOT NULL so North America mandals without a ghaam can submit.

ALTER TABLE public.spiritual_seva_submission
  ADD COLUMN IF NOT EXISTS jaap bigint DEFAULT 0;

ALTER TABLE public.spiritual_seva_submission
  ALTER COLUMN ghaam DROP NOT NULL;

-- Refresh public aggregate stats to include jaap totals.
CREATE OR REPLACE FUNCTION public.get_spiritual_seva_stats()
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'total_submissions', count(*),
    'jaap', coalesce(sum(jaap), 0),
    'malas', coalesce(sum(malas), 0),
    'dhyan', coalesce(sum(dhyan), 0),
    'pradakshinas', coalesce(sum(pradakshinas), 0),
    'dandvats', coalesce(sum(dandvats), 0),
    'padyatras', coalesce(sum(padyatras), 0),
    'sadachar', coalesce(sum(sadachar), 0),
    'harignanamrut', coalesce(sum(harignanamrut), 0),
    'bapashree', coalesce(sum(bapashree), 0),
    'upvas', coalesce(sum(upvas), 0)
  )
  FROM public.spiritual_seva_submission;
$$;

REVOKE ALL ON FUNCTION public.get_spiritual_seva_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_spiritual_seva_stats() TO anon;
GRANT EXECUTE ON FUNCTION public.get_spiritual_seva_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_spiritual_seva_stats() TO service_role;
