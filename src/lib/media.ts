import { supabase } from "./supabase";

export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/')
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024
const MAX_VIDEO_SIZE = 50 * 1024 * 1024

export async function uploadMedia(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const { data, error } = await supabase.functions.invoke(
  "cloudinary-upload",
  {
    body: formData,
    headers: {
      Authorization: "",
    },
  }
);

  if (error) {
    throw new Error(error.message);
  }

  if (!data?.success) {
    throw new Error(data?.error || "Cloudinary upload failed.");
  }

  return data.secure_url;
}

export async function deleteMedia(url: string): Promise<void> {
  const { data, error } = await supabase.functions.invoke(
    "cloudinary-delete",
    {
      body: { url },
      headers: {
        Authorization: "",
      },
    }
  );

  if (error) {
    throw new Error(error.message);
  }

  if (data?.result !== "ok" && data?.result !== "not found") {
    throw new Error(data?.error?.message || "Cloudinary delete failed.");
  }
}