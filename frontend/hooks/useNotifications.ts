"use client"

import { useEffect, useMemo, useState } from "react"
import { Commitment } from "@/types/commitment"
import { commitmentService } from "@/services/commitmentService"

export interface Notification {
  id: string
  type: "overdue" | "due_today" | "due_tomorrow" | "completed"
  icon: string
  message: string
  commitmentId: string
}

function truncateTitle(title: string, max = 50): string {
  return title.length > max ? title.slice(0, max - 1) + "…" : title
}

/** Compute a day key in local time (YYYY-MM-DD) from a Date. */
function dayKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function buildNotifications(commitments: Commitment[]): Notification[] {
  const now = new Date()
  const today = dayKey(now)

  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowKey = dayKey(tomorrow)

  const result: Notification[] = []

  for (const c of commitments) {
    const title = truncateTitle(c.title)
    const deadline = c.deadline ? new Date(c.deadline) : null
    const deadlineKey = deadline ? dayKey(deadline) : null

    // Overdue — deadline has passed and not completed/cancelled
    if (
      deadline &&
      deadlineKey! < today &&
      c.status !== "completed" &&
      c.status !== "cancelled"
    ) {
      result.push({
        id: `overdue-${c.id}`,
        type: "overdue",
        icon: "🔴",
        message: `"${title}" is overdue.`,
        commitmentId: c.id,
      })
    }

    // Due today
    if (
      deadline &&
      deadlineKey === today &&
      c.status !== "completed" &&
      c.status !== "cancelled"
    ) {
      result.push({
        id: `due-today-${c.id}`,
        type: "due_today",
        icon: "🟠",
        message: `"${title}" is due today.`,
        commitmentId: c.id,
      })
    }

    // Due tomorrow
    if (
      deadline &&
      deadlineKey === tomorrowKey &&
      c.status !== "completed" &&
      c.status !== "cancelled"
    ) {
      result.push({
        id: `due-tomorrow-${c.id}`,
        type: "due_tomorrow",
        icon: "🔵",
        message: `"${title}" is due tomorrow.`,
        commitmentId: c.id,
      })
    }

    // Completed today
    if (c.status === "completed") {
      const updatedKey = dayKey(new Date(c.updated_at))
      if (updatedKey === today) {
        result.push({
          id: `completed-${c.id}`,
          type: "completed",
          icon: "🟢",
          message: `"${title}" completed.`,
          commitmentId: c.id,
        })
      }
    }
  }

  // Newest first, stable sort
  return result.sort((a, b) => b.commitmentId.localeCompare(a.commitmentId))
}

export function useNotifications() {
  const [commitments, setCommitments] = useState<Commitment[]>([])
  const [loading, setLoading] = useState(true)
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await commitmentService.getAll()
        if (!cancelled) setCommitments(data)
      } catch {
        // silently fail — notifications are non-critical
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const notifications = useMemo(
    () => buildNotifications(commitments).slice(0, 10),
    [commitments],
  )

  const unreadCount = opened ? 0 : notifications.length

  return { notifications, unreadCount, loading, setOpened }
}