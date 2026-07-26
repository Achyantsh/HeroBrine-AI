"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { FcGoogle } from "react-icons/fc";
interface LoginFormProps {
  onToggleMode: () => void
}

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

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  // Handle query-parameter feedback (confirmation-required, errors)
  useEffect(() => {
    const signup = searchParams.get("signup")
    const error = searchParams.get("error")

    let needsCleanup = false

    if (signup === "confirmation-required") {
      toast.success(
        "Account created. Check your email and verify it before signing in.",
      )
      needsCleanup = true
    }

    if (error) {
      const messages: Record<string, string> = {
        otp_expired:
          "This verification link is invalid or has expired. Request a new link or sign up again.",
        session_exchange_failed:
          "We verified the link but could not start your session. Please sign in.",
        missing_auth_code: "The authentication link is incomplete. Please try again.",
        auth_configuration_error: "Authentication is temporarily unavailable.",
        auth_callback_failed: "Authentication failed. Please try again.",
      }

      toast.error(messages[error] ?? "Authentication failed. Please try again.")
      needsCleanup = true
    }

    if (needsCleanup) {
      // Build a clean URL keeping only `next`
      const next = searchParams.get("next")
      const params = new URLSearchParams()
      if (next) {
        params.set("next", next)
      }
      const query = params.toString()
      const cleanPath = query ? `/login?${query}` : "/login"
      router.replace(cleanPath, { scroll: false })
    }
  }, [searchParams, router])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        if (
          error.message?.toLowerCase().includes("email not confirmed") ||
          error.message?.toLowerCase().includes("email_not_confirmed")
        ) {
          toast.error("Please verify your email before signing in.")
        } else if (
          error.message?.toLowerCase().includes("invalid login") ||
          error.message?.toLowerCase().includes("invalid credentials")
        ) {
          toast.error("Invalid email or password.")
        } else {
          toast.error(error.message || "Invalid email or password.")
        }
        setLoading(false)
        return
      }

      toast.success("Welcome back!")

      const safeNext = getSafeNext(searchParams.get("next"))
      router.replace(safeNext)
      router.refresh()
    } catch {
      toast.error("Network error. Please try again.")
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true)

    try {
      const safeNext = getSafeNext(searchParams.get("next"))

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(safeNext)}`,
        },
      })

      if (error) {
        toast.error(error.message || "Unable to continue with Google.")
        setGoogleLoading(false)
      }
    } catch {
      toast.error("Network error. Please try again.")
      setGoogleLoading(false)
    }
  }

  async function handleResendVerification() {
    if (!email.trim()) {
      toast.error("Enter your email address first.")
      return
    }

    setResendLoading(true)

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      })

      if (error) {
        toast.error(error.message || "Failed to resend verification email.")
      } else {
        toast.success("Verification email sent. Check your inbox.")
      }
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleLogin}
      > 
      <FcGoogle className="mr-2 h-5 w-5" />
        Continue with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">Email</label>
        <Input
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">Password</label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin mr-1.5" />
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </Button>

      {/* Resend verification — shown when user might need it */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleResendVerification}
          disabled={resendLoading}
          className="text-xs text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
        >
          {resendLoading ? "Sending..." : "Resend verification email"}
        </button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Dont have an account?{" "}
        <button type="button" onClick={onToggleMode} className="text-primary hover:underline">
          Sign Up
        </button>
      </p>
    </form>
  )
}