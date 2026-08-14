import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function sha1(message: string): Promise<string> {
  const data = new TextEncoder().encode(message);

  const hashBuffer = await crypto.subtle.digest("SHA-1", data);

  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }

  try {
    const formData = await req.formData();

    const file = formData.get("file");
    const folder = String(formData.get("folder") ?? "products");
    const publicId = formData.get("public_id")?.toString();

    if (!(file instanceof File)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "No file received.",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const cloudName = Deno.env.get("CLOUDINARY_CLOUD_NAME");
    const apiKey = Deno.env.get("CLOUDINARY_API_KEY");
    const apiSecret = Deno.env.get("CLOUDINARY_API_SECRET");

    if (!cloudName || !apiKey || !apiSecret) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Cloudinary secrets are missing.",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);

const signatureBase = publicId
  ? `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`
  : `folder=${folder}&timestamp=${timestamp}${apiSecret}`;

const signature = await sha1(signatureBase);

console.log("Signature Base JSON:", JSON.stringify(signatureBase));

// ===== DEBUG START =====
console.log("Cloud Name:", cloudName);
console.log("API Key:", apiKey);
console.log("API Secret Length:", apiSecret?.length);
console.log("Signature Base:", signatureBase);
console.log("Generated Signature:", signature);
// ===== DEBUG END =====

const uploadForm = new FormData();

    uploadForm.append("file", file);
    uploadForm.append("api_key", apiKey);
    uploadForm.append("timestamp", String(timestamp));
    uploadForm.append("signature", signature);
    uploadForm.append("folder", folder);

    if (publicId) {
      uploadForm.append("public_id", publicId);
    }

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: uploadForm,
      }
    );

        const result = await cloudinaryResponse.json();

    if (!cloudinaryResponse.ok) {
      return new Response(
        JSON.stringify({
          success: false,
          error: result,
        }),
        {
          status: cloudinaryResponse.status,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        secure_url: result.secure_url,
        public_id: result.public_id,
        asset_id: result.asset_id,
        version: result.version,
        format: result.format,
        resource_type: result.resource_type,
        width: result.width,
        height: result.height,
        bytes: result.bytes,
        original_filename: result.original_filename,
        created_at: result.created_at,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error(err);

    return new Response(
      JSON.stringify({
        success: false,
        error:
          err instanceof Error
            ? err.message
            : "Unknown Cloudinary upload error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});