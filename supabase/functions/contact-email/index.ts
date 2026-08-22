// @ts-nocheck
import { serve } from "https://deno.land/std@0.224.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

function base64UrlEncode(input: string) {
  const bytes = new TextEncoder().encode(input)
  let binary = ""

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

function createRawEmail(
  to: string,
  replyTo: string,
  subject: string,
  body: string
) {
  const email = [
    `From: soyal@veehaandigitech.com`,
    `To: ${to}`,
    `Reply-To: ${replyTo}`,
    `Subject: ${subject || "New Contact Form Message"}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "",
    body,
  ].join("\r\n")

  return base64UrlEncode(email)
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    })
  }

  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
    } = await req.json()

    if (!name || !email || !phone || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      )
    }

    const clientId = Deno.env.get("GOOGLE_CLIENT_ID")
    const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET")
    const refreshToken = Deno.env.get("GOOGLE_REFRESH_TOKEN")

    if (!clientId || !clientSecret || !refreshToken) {
      throw new Error("Google OAuth secrets are not configured")
    }

    // Get a fresh Gmail access token
    const tokenResponse = await fetch(
      "https://oauth2.googleapis.com/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        }),
      }
    )

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok || !tokenData.access_token) {
      throw new Error(
        `Google token error: ${JSON.stringify(tokenData)}`
      )
    }

    const emailBody = `
New Contact Form Message

Name: ${name}
Email: ${email}
Phone: ${phone}
Subject: ${subject || "(No subject)"}

Message:
${message}
`

    const raw = createRawEmail(
      "soyal@veehaandigitech.com",
      email,
      subject || "New Contact Form Message",
      emailBody
    )

    const gmailResponse = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw }),
      }
    )

    const gmailData = await gmailResponse.json()

    if (!gmailResponse.ok) {
      throw new Error(
        `Gmail API error: ${JSON.stringify(gmailData)}`
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent successfully",
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    )
  } catch (error) {
    console.error(error)

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error
          ? error.message
          : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    )
  }
})