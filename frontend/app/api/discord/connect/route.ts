import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const origin = new URL(request.url).origin

    // 1. Verify the current HeroBrine user is logged in.
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.redirect(new URL("/login", origin))
    }

    // 2. Generate a secure random OAuth state.
    const state = crypto.randomUUID() + "-" + crypto.randomUUID()

    const cookieStore = await cookies()

    // 3. Store the state in an HTTP-only cookie (10 minute expiry).
    cookieStore.set("discord_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 10,
    })

    // 4. Build Discord OAuth URL and redirect.
    const clientId = process.env.DISCORD_CLIENT_ID
    const redirectUri = process.env.DISCORD_REDIRECT_URI

    if (!clientId || !redirectUri) {
      console.error("Missing DISCORD_CLIENT_ID or DISCORD_REDIRECT_URI")
      return NextResponse.redirect(new URL("/profile?discord=config_error", origin))
    }

    const params = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: "identify",
      state,
    })

    return NextResponse.redirect(
      `https://discord.com/api/v10/oauth2/authorize?${params.toString()}`,
    )
  } catch (err) {
    console.error("Discord connect error:", err)
    const origin = new URL(request.url).origin
    return NextResponse.redirect(new URL("/profile?discord=unexpected_error", origin))
  }
}