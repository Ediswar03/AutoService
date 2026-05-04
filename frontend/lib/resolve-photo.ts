// lib/resolve-photo.ts

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:3002"

export function resolvePhotoUrl(photoUrl?: string | null): string | undefined {
  if (!photoUrl) return undefined
  if (photoUrl.startsWith("http")) return photoUrl
  if (photoUrl.startsWith("local:")) {
    const key = photoUrl.replace("local:", "")
    return `${BACKEND_URL}/api/v1/uploads/${key}`
  }

  // Default fallback: MinIO
  const bucketName = "autoservis"
  try {
    const url = new URL(BACKEND_URL)
    return `http://${url.hostname}:9000/${bucketName}/${photoUrl}`
  } catch {
    return `http://localhost:9000/${bucketName}/${photoUrl}`
  }
}
