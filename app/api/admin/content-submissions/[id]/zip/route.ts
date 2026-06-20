import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import JSZip from "jszip"
import type { NextRequest } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { isContentSubmissionsViewer } from "@/lib/admin-auth"
import {
  CONTENT_SUBMISSIONS_TABLE,
  CONTENT_SUBMISSION_COLUMNS,
  type ContentImageKey,
  type ContentSubmissionRow,
} from "@/lib/content-submissions-admin"

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT as string,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
  },
})

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  if (!id || !UUID_RE.test(id)) {
    return new Response("Invalid id", { status: 400 })
  }

  let supabase
  try {
    supabase = await createClient()
  } catch {
    return new Response("Supabase not configured", { status: 500 })
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return new Response("Unauthorized", { status: 401 })
  if (!isContentSubmissionsViewer(user)) {
    return new Response("Forbidden", { status: 403 })
  }

  const { data, error } = await supabase
    .from(CONTENT_SUBMISSIONS_TABLE)
    .select(CONTENT_SUBMISSION_COLUMNS.join(","))
    .eq("id", id)
    .single()

  if (error || !data) {
    return new Response("Not found", { status: 404 })
  }

  const row = data as unknown as ContentSubmissionRow

  const zip = new JSZip()
  zip.file("metadata.json", JSON.stringify(row, null, 2))

  const photosFolder = zip.folder("photos")
  for (const img of row.image_keys ?? []) {
    try {
      const buffer = await fetchR2Object(img.key)
      photosFolder?.file(img.filename, buffer)
    } catch (err) {
      console.error("[content-submissions zip] missing image", img.key, err)
    }
  }

  if ((row.video_keys?.length ?? 0) > 0) {
    const videosFolder = zip.folder("videos")
    for (const video of row.video_keys ?? []) {
      try {
        const buffer = await fetchR2Object(video.key)
        videosFolder?.file(video.filename, buffer)
      } catch (err) {
        console.error("[content-submissions zip] missing video", video.key, err)
      }
    }
  }

  const buf = await zip.generateAsync({ type: "uint8array" })
  const filename = buildArchiveFilename(row)
  return new Response(new Uint8Array(buf), {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Length": String(buf.byteLength),
      "Cache-Control": "no-store",
    },
  })
}

async function fetchR2Object(key: string): Promise<Uint8Array> {
  const cmd = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME as string,
    Key: key,
  })
  const resp = await s3Client.send(cmd)
  const body = resp.Body as
    | { transformToByteArray?: () => Promise<Uint8Array> }
    | undefined
  if (!body?.transformToByteArray) throw new Error("Empty body")
  return body.transformToByteArray()
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
}

function buildArchiveFilename(row: ContentSubmissionRow): string {
  const slug = slugify(`${row.family_name}-${row.village}`)
  return `${slug || "submission"}_${row.id}.zip`
}

