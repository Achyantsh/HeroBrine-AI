"use client"

import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    try {
      await supabase.auth.signOut()
      toast.success("Logged out successfully")
      router.push("/login")
      router.refresh()
    } catch {
      toast.error("Failed to logout")
    }
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleLogout}>
      Logout
    </Button>
  )
}
