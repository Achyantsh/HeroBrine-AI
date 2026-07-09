"use client"

import { useRouter } from "next/navigation"
import { AuthCard } from "@/components/auth/AuthCard"
import { LoginForm } from "@/components/auth/LoginForm"

export default function LoginPage() {
  const router = useRouter()

  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to continue to HeroBrine AI"
      footer={
        <>
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/signup")}
            className="text-primary hover:underline"
          >
            Sign Up
          </button>
        </>
      }
    >
      <LoginForm onToggleMode={() => router.push("/signup")} />
    </AuthCard>
  )
}