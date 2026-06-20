import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import JSZip from "jszip"
import { NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"
import { isContentSubmissionsViewer } from "@/lib/admin-auth"
import {
  CONTENT_SUBMISSIONS_TABLE,
  CONTENT_SUBMISSION_COLUMNS,
  applyContentSubmissionFilters,
  parseContentSubmissionFilters,
  type ContentImageKey,
  type ContentSubmissionRow,
} from "@/lib/content-submissions-admin"

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT as string,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
  },
})

const PAGE_SIZE = 500
const MAX_ROWS = 5000

export async function GET(request: Request) {
  let supabase
  try {
    supabase = await createClient()
  } catch {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 }
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!isContentSubmissionsViewer(user)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const filters = parseContentSubmissionFilters(searchParams)

  const rows: ContentSubmissionRow[] = []
  let cursor: string | null = null
  while (rows.length < MAX_ROWS) {
    let query = supabase
      .from(CONTENT_SUBMISSIONS_TABLE)
      .select(CONTENT_SUBMISSION_COLUMNS.join(","))
    query = applyContentSubmissionFilters(query, filters)
    if (cursor) query = query.lt("created_at", cursor)
    query = query
      .order("created_at", { ascending: false })
      .limit(PAGE_SIZE)
    const { data, error } = await query
    if (error) {
      return NextResponse.json(
        { error: "Query failed", details: error.message },
        { status: 500 }
      )
    }
    const batch = (data ?? []) as unknown as ContentSubmissionRow[]
    if (batch.length === 0) break
    rows.push(...batch)
    if (batch.length < PAGE_SIZE) break
    cursor = batch[batch.length - 1].created_at
  }

  const zip = new JSZip()
  zip.file("data.csv", buildCsv(rows))
  zip.file("README.txt", buildReadme(rows.length, filters))

  const photosFolder = zip.folder("photos")
  for (const row of rows) {
    const folderSlug = buildFolderSlug(row)
    const rowFolder = photosFolder?.folder(folderSlug)
    rowFolder?.file("metadata.json", JSON.stringify(row, null, 2))
    for (const img of row.image_keys ?? []) {
      try {
        const buffer = await fetchR2Object(img.key)
        rowFolder?.file(img.filename, buffer)
      } catch (err) {
        console.error("[archive] missing image", img.key, err)
      }
    }
    for (const video of row.video_keys ?? []) {
      try {
        const buffer = await fetchR2Object(video.key)
        rowFolder?.file(video.filename, buffer)
      } catch (err) {
        console.error("[archive] missing video", video.key, err)
      }
    }
  }

  const buf = await zip.generateAsync({ type: "uint8array" })
  const stamp = new Date().toISOString().slice(0, 10)
  const filename = `nj-mandir-memories-${stamp}.zip`
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

const CSV_COLUMNS: (keyof ContentSubmissionRow)[] = [
  "id",
  "created_at",
  "family_name",
  "village",
  "mandal",
  "caption",
  "status",
  "posted_at",
  "notes",
  "uploader_name",
  "uploader_email",
  "uploader_phone_country_code",
  "uploader_mobile_number",
]

function buildCsv(rows: ContentSubmissionRow[]): string {
  const headers = [
    ...CSV_COLUMNS,
    "image_count",
    "image_keys",
    "video_count",
    "video_keys",
  ]
  const lines: string[] = [headers.map(csvCell).join(",")]
  for (const row of rows) {
    const cells = CSV_COLUMNS.map((col) => csvCell(row[col]))
    cells.push(csvCell(row.image_keys?.length ?? 0))
    cells.push(
      csvCell(
        (row.image_keys ?? []).map((img: ContentImageKey) => img.key).join("; ")
      )
    )
    cells.push(csvCell(row.video_keys?.length ?? 0))
    cells.push(
      csvCell(
        (row.video_keys ?? []).map((video) => video.key).join("; ")
      )
    )
    lines.push(cells.join(","))
  }
  return lines.join("\r\n")
}

function csvCell(value: unknown): string {
  if (value == null) return ""
  const str = typeof value === "string" ? value : String(value)
  if (/[",\r\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`
  return str
}

function buildFolderSlug(row: ContentSubmissionRow): string {
  const slug = slugify(`${row.family_name}-${row.village}`)
  return `${slug || "submission"}_${row.id}`
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
}

function buildReadme(
  count: number,
  filters: ReturnType<typeof parseContentSubmissionFilters>
): string {
  const activeFilters = Object.entries(filters)
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => `  ${key} = ${value}`)
    .join("\n")
  return [
    "NJ Mandir Memories Archive",
    `Exported: ${new Date().toISOString()}`,
    `Submissions included: ${count}`,
    "",
    "Filters applied at export time:",
    activeFilters || "  (none — all submissions)",
    "",
    "Layout:",
    "  data.csv             — table of every submission included in this archive",
    "  photos/<family>-<id>/ — one folder per submission",
    "    metadata.json      — full row data (caption, contact, status, notes)",
    "    <photo files>      — original-quality images submitted by the family",
    "    <video files>      — original video clips submitted by the family (if any)",
    "",
  ].join("\n")
}
