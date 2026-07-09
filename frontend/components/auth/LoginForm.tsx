"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import Image from "next/image"

interface LoginFormProps {
  onToggleMode: () => void
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [waitingForSession, setWaitingForSession] = useState(false)

  useEffect(() => {
    let mounted = true
    async function waitForSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (mounted && session) {
        router.replace("/dashboard")
      }
    }
    waitForSession()
    return () => { mounted = false }
  }, [router])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setWaitingForSession(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      

      if (error) {
        toast.error(error.message || "Invalid credentials.")
        setWaitingForSession(false)
        setLoading(false)
        return
      }

      toast.success("Welcome back!")
      
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.replace("/dashboard")
      } else {
        setTimeout(() => {
          router.replace("/dashboard")
        }, 500)
      }
    } catch {
      toast.error("Network error. Please try again.")
      setWaitingForSession(false)
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (error) {
        toast.error("Failed to login with Google.")
      }
    } catch {
      toast.error("Network error. Please try again.")
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        onClick={handleGoogleLogin}
      >
        <Image src="/google.svg" alt="Google" width={18} height={18} />
        Continue with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
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

      <Button type="submit" className="w-full" disabled={loading || waitingForSession}>
        {loading || waitingForSession ? (
          <>
            <Loader2 className="size-4 animate-spin mr-1.5" />
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
        <button type="button" onClick={onToggleMode} className="text-primary hover:underline">
          Sign Up
        </button>
      </p>
    </form>
  )
}