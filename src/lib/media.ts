import { supabase } from './supabase'

const BUCKET = 'product-media'
const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const MAX_VIDEO_SIZE = 50 * 1024 * 1024

export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/')
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

export async function uploadMedia(file: File): Promise<string> {
  if (isVideoFile(file) && file.size > MAX_VIDEO_SIZE) {
    throw new Error('Video file is too large (max 50MB).')
  }
  if (isImageFile(file) && file.size > MAX_IMAGE_SIZE) {
    throw new Error('Image file is too large (max 5MB).')
  }

  const ext = file.name.split('.').pop() || 'bin'
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`
  const path = `${file.type.startsWith('video/') ? 'videos' : 'images'}/${fileName}`

 const { data, error } = await supabase.storage
  .from(BUCKET)
  .upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })

console.log("UPLOAD DATA:", data)
console.log("UPLOAD ERROR:", error)

  if (error) {
  console.error(error)
  throw new Error(error.message)
}

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return urlData.publicUrl
}

export async function deleteMedia(url: string): Promise<void> {
  try {
    const urlObj = new URL(url)
    const parts = urlObj.pathname.split(`/object/public/${BUCKET}/`)
    if (parts.length < 2) return
    const path = parts[1]
    await supabase.storage.from(BUCKET).remove([path])
  } catch {
    // best-effort
  }
}
