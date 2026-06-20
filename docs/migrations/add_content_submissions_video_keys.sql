-- Memories: enable video uploads alongside photos.
--
-- Adds a `video_keys` JSONB column to content_submissions and relaxes the media
-- count constraint so a submission is valid with photos, a video, or both
-- (at least one media item total). Run in the Supabase SQL editor.
--
-- Each video_keys entry looks like:
--   { "key": "...", "filename": "...", "content_type": "video/mp4",
--     "size_bytes": 12345, "duration_seconds": 28 }

-- 1. New column (safe to re-run).
alter table public.content_submissions
  add column if not exists video_keys jsonb not null default '[]'::jsonb;

-- 2. Replace the old "1-3 images required" check with a combined media check.
--    NOTE: confirm the existing constraint's name first, e.g.:
--      select conname from pg_constraint
--      where conrelid = 'public.content_submissions'::regclass and contype = 'c';
--    Then drop it by that name. The IF EXISTS lines below cover the common names;
--    adjust if yours differs.
alter table public.content_submissions
  drop constraint if exists content_submissions_image_keys_check;
alter table public.content_submissions
  drop constraint if exists content_submissions_image_keys_length_check;

-- 3. Add the combined constraint:
--    - image_keys and video_keys must be JSON arrays
--    - at most 3 photos, at most 1 video
--    - at least one media item total (photo OR video)
alter table public.content_submissions
  add constraint content_submissions_media_check check (
    jsonb_typeof(image_keys) = 'array'
    and jsonb_typeof(video_keys) = 'array'
    and jsonb_array_length(image_keys) <= 3
    and jsonb_array_length(video_keys) <= 1
    and (jsonb_array_length(image_keys) + jsonb_array_length(video_keys)) >= 1
  );
