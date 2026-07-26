import { createServerClient } from "@supabase/ssr"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

function getSafeNext(value: string | null): string {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.startsWith("/\\")
  ) {
    return "/dashboard"
  }
  return value
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)

  // Check for provider error (e.g. Google OAuth failure)
  const providerError = requestUrl.searchParams.get("error")
  const providerErrorCode = requestUrl.searchParams.get("error_code")

  if (providerError) {
    return NextResponse.redirect(
      new URL(
        `/login?error=${encodeURIComponent(
          providerErrorCode || "auth_callback_failed",
        )}`,
        requestUrl.origin,
      ),
    )
  }

  const code = requestUrl.searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=missing_auth_code", requestUrl.origin),
    )
  }

  const next = getSafeNext(requestUrl.searchParams.get("next"))

  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(
      new URL("/login?error=auth_configuration_error", requestUrl.origin),
    )
  }

  const destination = new URL(next, requestUrl.origin)
  destination.searchParams.set("auth", "success")

  const response = NextResponse.redirect(destination)

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error("Auth callback session exchange failed:", error.message)

    return NextResponse.redirect(
      new URL("/login?error=session_exchange_failed", requestUrl.origin),
    )
  }

  return response
}