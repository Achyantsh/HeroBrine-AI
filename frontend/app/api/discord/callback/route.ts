import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import { createSupabaseServerClient } from "@/lib/supabase/server"

interface DiscordTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  scope: string
}

interface DiscordUserResponse {
  id: string
  username: string
  discriminator: string
  avatar: string | null
}

function redirectToProfile(
  request: NextRequest,
  status: string,
): NextResponse {
  const origin = new URL(request.url).origin
  const response = NextResponse.redirect(new URL("/profile", origin))

  // Store the toast status in a short-lived cookie so the client
  // can read it after the redirect without depending on a query
  // parameter that disappears on re-render.
  response.cookies.set("hero_discord_toast", status, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30,
  })

  return response
}

export async function GET(request: NextRequest) {
  try {
    // 1. Validate OAuth state cookie.
    const cookieStore = await cookies()
    const savedState = cookieStore.get("discord_oauth_state")?.value

    const returnedState = request.nextUrl.searchParams.get("state")

    if (!savedState || !returnedState || savedState !== returnedState) {
      return redirectToProfile(request, "invalid_state")
    }

    // Clear the state cookie.
    cookieStore.set("discord_oauth_state", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    })

    // 2. Check for authorization code.
    const code = request.nextUrl.searchParams.get("code")

    if (!code) {
      // User likely cancelled the authorization.
      return redirectToProfile(request, "cancelled")
    }

    // 3. Verify the HeroBrine user is still logged in.
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return redirectToProfile(request, "unauthenticated")
    }

    // 4. Exchange authorization code for Discord access token.
    const clientId = process.env.DISCORD_CLIENT_ID
    const clientSecret = process.env.DISCORD_CLIENT_SECRET
    const redirectUri = process.env.DISCORD_REDIRECT_URI

    if (!clientId || !clientSecret || !redirectUri) {
      console.error("Missing Discord OAuth environment variables")
      return redirectToProfile(request, "config_error")
    }

    const tokenBody = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    })

    let tokenResponse: Response
    try {
      tokenResponse = await fetch("https://discord.com/api/v10/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: tokenBody.toString(),
      })
    } catch {
      console.error("Failed to reach Discord token endpoint")
      return redirectToProfile(request, "token_error")
    }

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error("Discord token exchange failed:", tokenResponse.status, errorText)
      return redirectToProfile(request, "token_error")
    }

    const tokenData: DiscordTokenResponse = await tokenResponse.json()

    // 5. Retrieve Discord user info.
    let userResponse: Response
    try {
      userResponse = await fetch("https://discord.com/api/v10/users/@me", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      })
    } catch {
      console.error("Failed to reach Discord user endpoint")
      return redirectToProfile(request, "token_error")
    }

    if (!userResponse.ok) {
      const errorText = await userResponse.text()
      console.error("Discord user fetch failed:", userResponse.status, errorText)
      return redirectToProfile(request, "token_error")
    }

    const discordUser: DiscordUserResponse = await userResponse.json()
    const discordId = discordUser.id

    // 6. Check if this Discord ID is already linked to another HeroBrine user.
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("discord_id", discordId)
      .maybeSingle()

    if (existingProfile && existingProfile.id !== user.id) {
      return redirectToProfile(request, "already_linked")
    }

    // 7. Update profiles.discord_id for the current authenticated user.
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ discord_id: discordId })
      .eq("id", user.id)

    if (updateError) {
      console.error("Failed to update discord_id:", updateError)
      return redirectToProfile(request, "database_error")
    }

    // 8. Success — redirect back to profile.
    return redirectToProfile(request, "connected")
  } catch (err) {
    console.error("Discord callback unexpected error:", err)
    return redirectToProfile(request, "unexpected_error")
  }
}