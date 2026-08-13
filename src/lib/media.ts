export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/')
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const MAX_VIDEO_SIZE = 50 * 1024 * 1024

export async function uploadMedia(file: File): Promise<string> {
  if (isVideoFile(file) && file.size > MAX_VIDEO_SIZE) {
    throw new Error('Video file is too large (max 50MB).')
  }

  if (isImageFile(file) && file.size > MAX_IMAGE_SIZE) {
    throw new Error('Image file is too large (max 5MB).')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append(
    'upload_preset',
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  )

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) {
    throw new Error('Cloudinary upload failed')
  }

  const data = await response.json()

  return data.secure_url
}

export async function deleteMedia(url: string): Promise<void> {
  console.log('Delete skipped:', url)
}