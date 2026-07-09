"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { User, Mail, Globe, MessageCircle, Send, Loader2, CheckCircle2, CircleOff } from "lucide-react"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

type ProfileRow = {
  id: string
  timezone: string
  discord_id: string | null
  telegram_id: string | null
  notifications_enabled: boolean
  created_at: string
  updated_at: string
}

export default function ProfilePage() {
  const [authUser, setAuthUser] = useState<{ id: string; email?: string; user_metadata?: { full_name?: string; avatar_url?: string } } | null>(null)
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [timezone, setTimezone] = useState("UTC")

  useEffect(() => {
    async function load() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          throw new Error("Unable to load user.")
        }

        setAuthUser(user)

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle()

        if (profileError) {
          throw profileError
        }

        if (!profileData) {
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"

          const { data: created, error: insertError } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              timezone,
              notifications_enabled: true,
            })
            .select("*")
            .single()

          if (insertError || !created) {
            throw insertError ?? new Error("Failed to create profile.")
          }

          setProfile(created)
          setTimezone(created.timezone)
        } else {
          setProfile(profileData)
          setTimezone(profileData.timezone)
        }
      } catch {
        toast.error("Failed to load profile.")
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!authUser?.id) {
      toast.error("No authenticated user.")
      return
    }

    setSaving(true)
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ timezone })
        .eq("id", authUser.id)
        .select("*")
        .single()

      if (error || !data) {
        throw error ?? new Error("Update failed")
      }

      setProfile(data)
      toast.success("Preferences updated.")
    } catch {
      toast.error("Failed to update preferences.")
    } finally {
      setSaving(false)
    }
  }

  const fullName = authUser?.user_metadata?.full_name ?? ""
  const email = authUser?.email ?? ""
  const avatarUrl = authUser?.user_metadata?.avatar_url ?? null
  const discordConnected = Boolean(profile?.discord_id)
  const telegramConnected = Boolean(profile?.telegram_id)

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  if (!authUser || !profile) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <User className="size-12 text-muted-foreground/30 mb-4" />
          <p className="text-sm text-muted-foreground">Failed to load profile.</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        <div className="flex items-center gap-3">
          <User className="size-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Profile</h1>
        </div>

        {/* Section 1: Identity (read-only) */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-4">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="size-12 rounded-full object-cover" />
            ) : (
              <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <User className="size-6" />
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-foreground">{fullName || "Unnamed User"}</p>
              <p className="text-xs text-muted-foreground">{email}</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-medium text-foreground">User ID</span>
            <Input value={authUser.id} disabled className="bg-muted" />
            <p className="text-[10px] text-muted-foreground">Your unique user identifier.</p>
          </div>
        </div>

        {/* Section 2: Connected Accounts */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Connected Accounts</h3>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-foreground">Discord</span>
            {discordConnected ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3.5" />
                Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <CircleOff className="size-3.5" />
                Not Connected
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-foreground">Telegram</span>
            {telegramConnected ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3.5" />
                Connected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <CircleOff className="size-3.5" />
                Not Connected
              </span>
            )}
          </div>
        </div>

        {/* Section 3: Preferences */}
        <form onSubmit={handleSave} className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Preferences</h3>

          <div className="space-y-1.5">
            <span className="text-xs font-medium text-foreground">Timezone</span>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder="UTC"
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-1.5" />
                  Saving...
                </>
              ) : (
                "Save Preferences"
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </DashboardLayout>
  )
}