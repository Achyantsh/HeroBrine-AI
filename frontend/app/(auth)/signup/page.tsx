"use client"

import { useRouter } from "next/navigation"
import { AuthCard } from "@/components/auth/AuthCard"
import { SignupForm } from "@/components/auth/SignupForm"

export default function SignupPage() {
  const router = useRouter()

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start organizing your commitments intelligently."
      footer={
        <>
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-primary hover:underline"
          >
            Login
          </button>
        </>
      }
    >
      <SignupForm onToggleMode={() => router.push("/login")} />
    </AuthCard>
  )
}