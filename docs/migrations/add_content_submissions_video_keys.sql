-- Memories: enable video uploads alongside photos.
--
-- Adds a `video_keys` JSONB column to content_submissions and replaces the old
-- "1-3 images required" CHECK with a combined media check so a submission is
-- valid with photos, a video, or both (at least one media item total).
--
-- Self-contained: step 2 finds and drops the old image-count CHECK by
-- definition (no need to know its name). Run in the Supabase SQL editor.
--
-- Each video_keys entry looks like:
--   { "key": "...", "filename": "...", "content_type": "video/mp4",
--     "size_bytes": 12345, "duration_seconds": 28 }

-- 1. New column (safe to re-run).
alter table public.content_submissions
  add column if not exists video_keys jsonb not null default '[]'::jsonb;

-- 2. Drop any existing CHECK constraint that references image_keys, whatever
--    it's named (e.g. an auto-generated content_submissions_image_keys_check).
do $$
declare c record;
begin
  for c in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'content_submissions'
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) ilike '%image_keys%'
  loop
    execute format(
      'alter table public.content_submissions drop constraint %I',
      c.conname
    );
  end loop;
end $$;

-- 3. Add the combined media constraint:
--    - image_keys and video_keys must be JSON arrays
--    - at most 3 photos, at most 1 video
--    - at least one media item total (photo OR video)
--    (image_keys is cast to jsonb so this works whether the column is json or
--    jsonb; the cast is a no-op when it is already jsonb.)
alter table public.content_submissions
  drop constraint if exists content_submissions_media_check;
alter table public.content_submissions
  add constraint content_submissions_media_check check (
    jsonb_typeof(image_keys::jsonb) = 'array'
    and jsonb_typeof(video_keys::jsonb) = 'array'
    and jsonb_array_length(image_keys::jsonb) <= 3
    and jsonb_array_length(video_keys::jsonb) <= 1
    and (jsonb_array_length(image_keys::jsonb) + jsonb_array_length(video_keys::jsonb)) >= 1
  );
