"use client"

import { useEffect, useState } from "react"
import {
  Bell,
  CheckCircle2,
  Clock3,
  Loader2,
  Moon,
  Settings,
  Sun,
} from "lucide-react"
import { useTheme } from "next-themes"
import { toast } from "sonner"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"

type ProfileSettings = {
  id: string
  timezone: string
  notifications_enabled: boolean
}

export default function SettingsPage() {
  const { resolvedTheme, setTheme } = useTheme()

  const [profile, setProfile] = useState<ProfileSettings | null>(null)
  const [timezone, setTimezone] = useState("UTC")
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const isDarkMode = resolvedTheme === "dark"

  useEffect(() => {
    let cancelled = false

    async function loadSettings() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          throw userError ?? new Error("No authenticated user.")
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("id, timezone, notifications_enabled")
          .eq("id", user.id)
          .single()

        if (error) {
          throw error
        }

        if (!cancelled) {
          setProfile(data)
          setTimezone(data.timezone ?? "UTC")
          setNotificationsEnabled(data.notifications_enabled ?? true)
        }
      } catch (error) {
        console.error("Failed to load settings:", error)

        if (!cancelled) {
          toast.error("Failed to load settings.")
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadSettings()

    return () => {
      cancelled = true
    }
  }, [])

  async function handleSave() {
    if (!profile) {
      toast.error("Profile settings are unavailable.")
      return
    }

    const normalizedTimezone = timezone.trim() || "UTC"

    setSaving(true)

    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          timezone: normalizedTimezone,
          notifications_enabled: notificationsEnabled,
        })
        .eq("id", profile.id)
        .select("id, timezone, notifications_enabled")
        .single()

      if (error) {
        throw error
      }

      setProfile(data)
      setTimezone(data.timezone)
      setNotificationsEnabled(data.notifications_enabled)

      toast.success("Settings saved successfully.")
    } catch (error) {
      console.error("Failed to save settings:", error)
      toast.error("Failed to save settings.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center gap-3">
          <Settings className="size-6 text-primary" />

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Settings
            </h1>

            <p className="text-sm text-muted-foreground">
              Manage your HeroBrine preferences and appearance.
            </p>
          </div>
        </div>

        <section className="rounded-xl border border-border bg-card p-6">
          <div className="mb-5 flex items-start gap-3">
            {isDarkMode ? (
              <Moon className="mt-0.5 size-5 text-primary" />
            ) : (
              <Sun className="mt-0.5 size-5 text-primary" />
            )}

            <div>
              <h2 className="text-base font-semibold text-foreground">
                Appearance
              </h2>

              <p className="text-sm text-muted-foreground">
                Choose how HeroBrine looks on this device.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Button
              type="button"
              variant={resolvedTheme === "light" ? "default" : "outline"}
              onClick={() => setTheme("light")}
              className="justify-start gap-2"
            >
              <Sun className="size-4" />
              Light
            </Button>

            <Button
              type="button"
              variant={resolvedTheme === "dark" ? "default" : "outline"}
              onClick={() => setTheme("dark")}
              className="justify-start gap-2"
            >
              <Moon className="size-4" />
              Dark
            </Button>

            <Button
              type="button"
              variant={resolvedTheme !== "light" && resolvedTheme !== "dark" ? "default" : "outline"}
              onClick={() => setTheme("system")}
              className="justify-start gap-2"
            >
              <Settings className="size-4" />
              System
            </Button>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <div className="mb-5 flex items-start gap-3">
            <Clock3 className="mt-0.5 size-5 text-primary" />

            <div>
              <h2 className="text-base font-semibold text-foreground">
                Timezone
              </h2>

              <p className="text-sm text-muted-foreground">
                Used for deadlines, reminders, and calendar views.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="timezone"
              className="text-sm font-medium text-foreground"
            >
              IANA timezone
            </label>

            <Input
              id="timezone"
              value={timezone}
              onChange={(event) => setTimezone(event.target.value)}
              placeholder="Asia/Kolkata"
            />

            <p className="text-xs text-muted-foreground">
              Examples: Asia/Kolkata, Europe/London, America/New_York.
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <div className="mb-5 flex items-start gap-3">
            <Bell className="mt-0.5 size-5 text-primary" />

            <div>
              <h2 className="text-base font-semibold text-foreground">
                Notifications
              </h2>

              <p className="text-sm text-muted-foreground">
                Control whether HeroBrine surfaces deadline notifications.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                Commitment notifications
              </p>

              <p className="text-xs text-muted-foreground">
                Show reminders for overdue, due-today, and upcoming commitments.
              </p>
            </div>

            <Button
              type="button"
              variant={notificationsEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => setNotificationsEnabled((current) => !current)}
              className="min-w-28 gap-2"
              aria-pressed={notificationsEnabled}
            >
              {notificationsEnabled ? (
                <>
                  <CheckCircle2 className="size-4" />
                  Enabled
                </>
              ) : (
                "Disabled"
              )}
            </Button>
          </div>
        </section>

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving || !profile}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Settings"
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}