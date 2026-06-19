import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { randomUUID } from "crypto"
import type { NextRequest } from "next/server"

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/heic",
  "image/heif",
])
const MAX_FILE_BYTES = 5 * 1024 * 1024
const MAX_FILES = 3
// Unique R2 prefix for /memories submissions; intentionally not shared
// with cs_personal_submissions, hotels, audio_files, wallpapers, or anything else.
// NOTE: keep this value as "share-memories" even though the route moved to
// /memories — changing it would orphan already-uploaded objects in R2.
const FOLDER_PREFIX = "share-memories"
const PRESIGNED_TTL_SECONDS = 600

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT as string,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
  },
})

type FileMetadata = {
  name: string
  type: string
  size?: number
}

type RequestBody = {
  files: FileMetadata[]
}

type UploadUrl = {
  url: string
  key: string
  filename: string
  content_type: string
}

type ResponsePayload = {
  submissionId?: string
  uploadUrls?: UploadUrl[]
  error?: string
}

function sanitizeFilename(name: string): string {
  const trimmed = name.trim().replace(/\s+/g, "_")
  return trimmed.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "image"
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = (await request.json()) as RequestBody
    const files = body?.files

    if (!Array.isArray(files) || files.length === 0) {
      return Response.json(
        { error: "At least one file is required." } satisfies ResponsePayload,
        { status: 400 }
      )
    }
    if (files.length > MAX_FILES) {
      return Response.json(
        { error: `You can upload up to ${MAX_FILES} files.` } satisfies ResponsePayload,
        { status: 400 }
      )
    }

    for (const f of files) {
      if (!f?.name || !f?.type) {
        return Response.json(
          { error: "Each file must include a name and type." } satisfies ResponsePayload,
          { status: 400 }
        )
      }
      if (!ALLOWED_TYPES.has(f.type.toLowerCase())) {
        return Response.json(
          {
            error: `Unsupported file type: ${f.type}. Allowed: JPG, PNG, HEIC.`,
          } satisfies ResponsePayload,
          { status: 400 }
        )
      }
      if (typeof f.size === "number" && f.size > MAX_FILE_BYTES) {
        return Response.json(
          { error: `${f.name} is larger than 5MB.` } satisfies ResponsePayload,
          { status: 400 }
        )
      }
    }

    const submissionId = randomUUID()
    const uploadUrls: UploadUrl[] = []

    for (const file of files) {
      const safeName = sanitizeFilename(file.name)
      const key = `${FOLDER_PREFIX}/${submissionId}/${safeName}`

      const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME as string,
        Key: key,
        ContentType: file.type,
      })
      const url = await getSignedUrl(s3Client, command, {
        expiresIn: PRESIGNED_TTL_SECONDS,
      })

      uploadUrls.push({
        url,
        key,
        filename: safeName,
        content_type: file.type,
      })
    }

    return Response.json({ submissionId, uploadUrls } satisfies ResponsePayload)
  } catch (error) {
    console.error("[content-submissions] presign error:", error)
    return Response.json(
      { error: "Internal server error" } satisfies ResponsePayload,
      { status: 500 }
    )
  }
}
