"use client"

import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { User, Settings, LogOut } from "lucide-react"
import { useAuth } from "@/components/auth/AuthProvider"

export function UserMenu() {
  const router = useRouter()
  const { user } = useAuth()

  const name =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    ""

  const email = user?.email ?? ""

  const initials = (name || email.split("@")[0])
  .trim()
  .split(/\s+/)
  .map((part: string) => part.charAt(0))
  .slice(0, 2)
  .join("")
  .toUpperCase()

  async function handleLogout() {
    try {
      await supabase.auth.signOut()
      toast.success("Logged out successfully")
      router.replace("/login")
      router.refresh()
    } catch {
      toast.error("Failed to logout")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="ml-1 rounded-full"
          aria-label="User menu"
        >
          <Avatar size="sm">
            <AvatarImage
              src={user?.user_metadata?.avatar_url ?? ""}
              alt={name || email}
            />
            <AvatarFallback>{initials || "?"}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="flex flex-col">
          <span className="font-medium">
            {name || "HeroBrine User"}
          </span>
          <span className="text-xs text-muted-foreground font-normal truncate">
            {email}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/profile")}>
            <User className="mr-2 size-4" />
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => router.push("/settings")}>
            <Settings className="mr-2 size-4" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 size-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}