"use client"

import { Suspense } from "react"
import { useRouter } from "next/navigation"
import { AuthCard } from "@/components/auth/AuthCard"
import { LoginForm } from "@/components/auth/LoginForm"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()

  return (
    <AuthCard
      title="Welcome Back"
      subtitle="Sign in to continue to HeroBrine AI"
      // footer={
      //   <>
      //     Dont have an account?{" "}
      //     <button
      //       type="button"
      //       onClick={() => router.push("/signup")}
      //       className="text-primary hover:underline"
      //     >
      //       Sign Up
      //     </button>
      //   </>
      // }
    >
      <Suspense
        fallback={
          <div className="flex justify-center py-8">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <LoginForm onToggleMode={() => router.push("/signup")} />
      </Suspense>
    </AuthCard>
  )
}