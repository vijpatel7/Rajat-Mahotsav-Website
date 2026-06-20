import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { randomUUID } from "crypto"
import type { NextRequest } from "next/server"
import {
  MAX_IMAGES,
  MAX_IMAGE_BYTES,
  MAX_VIDEOS,
  MAX_VIDEO_BYTES,
  mediaKindForType,
  type MediaKind,
} from "@/lib/memories-upload-config"

// Unique R2 prefix for /memories submissions; intentionally not shared
// with cs_personal_submissions, hotels, audio_files, wallpapers, or anything else.
// NOTE: keep this value as "share-memories" even though the route moved to
// /memories — changing it would orphan already-uploaded objects in R2.
const FOLDER_PREFIX = "share-memories"
// Videos can be large and phone upload connections slow, so give the presigned
// URL plenty of time to finish the direct-to-R2 PUT before it expires.
const PRESIGNED_TTL_SECONDS = 3600

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
  kind: MediaKind
}

type ResponsePayload = {
  submissionId?: string
  uploadUrls?: UploadUrl[]
  error?: string
}

function sanitizeFilename(name: string): string {
  const trimmed = name.trim().replace(/\s+/g, "_")
  return trimmed.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120) || "media"
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

    // Validate each file and tag it with its media kind.
    const tagged: { file: FileMetadata; kind: MediaKind }[] = []
    for (const f of files) {
      if (!f?.name || !f?.type) {
        return Response.json(
          { error: "Each file must include a name and type." } satisfies ResponsePayload,
          { status: 400 }
        )
      }
      const kind = mediaKindForType(f.type)
      if (!kind) {
        return Response.json(
          {
            error: `Unsupported file type: ${f.type}. Allowed: JPG, PNG, HEIC, MP4, MOV.`,
          } satisfies ResponsePayload,
          { status: 400 }
        )
      }
      const maxBytes = kind === "video" ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES
      if (typeof f.size === "number" && f.size > maxBytes) {
        const limitMb = Math.round(maxBytes / (1024 * 1024))
        return Response.json(
          { error: `${f.name} is larger than ${limitMb}MB.` } satisfies ResponsePayload,
          { status: 400 }
        )
      }
      tagged.push({ file: f, kind })
    }

    const imageCount = tagged.filter((t) => t.kind === "image").length
    const videoCount = tagged.filter((t) => t.kind === "video").length

    if (imageCount > MAX_IMAGES) {
      return Response.json(
        { error: `You can upload up to ${MAX_IMAGES} photos.` } satisfies ResponsePayload,
        { status: 400 }
      )
    }
    if (videoCount > MAX_VIDEOS) {
      return Response.json(
        {
          error: `You can upload up to ${MAX_VIDEOS} video${MAX_VIDEOS === 1 ? "" : "s"}.`,
        } satisfies ResponsePayload,
        { status: 400 }
      )
    }

    const submissionId = randomUUID()
    const uploadUrls: UploadUrl[] = []

    for (const { file, kind } of tagged) {
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
        kind,
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
