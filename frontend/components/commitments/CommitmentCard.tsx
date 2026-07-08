"use client"

import { motion } from "framer-motion"
import { CalendarDays, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { CommitmentActionsMenu } from "@/components/commitments/CommitmentActionsMenu"
import type { Commitment } from "@/types/commitment"

const priorityColors: Record<string, string> = {
  low: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  critical: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
}

const categoryColors: Record<string, string> = {
  work: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  personal: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  health: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  finance: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  study: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  shopping: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  other: "bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300",
}

const statusColors: Record<string, string> = {
  pending: "text-muted-foreground bg-muted",
  in_progress: "text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/40",
  completed: "text-emerald-600 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40",
  cancelled: "text-muted-foreground bg-muted",
}

function formatDate(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const target = new Date(d)
  target.setHours(0, 0, 0, 0)

  if (target.getTime() === today.getTime()) return "Today"
  if (target.getTime() === tomorrow.getTime()) return "Tomorrow"

  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
}

function formatDuration(minutes: number | null): string {
  if (!minutes) return ""
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

interface CommitmentCardProps {
  commitment: Commitment
  index: number
  onEdit: (commitment: Commitment) => void
  onRefresh: () => void
}

export function CommitmentCard({ commitment, index, onEdit, onRefresh }: CommitmentCardProps) {
  const isCompleted = commitment.status === "completed"

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: [0.25, 0.1, 0.25, 1] as const }}
      className={cn(
        "group flex items-start gap-4 rounded-xl border border-border/60 bg-card p-4 hover:border-border hover:shadow-sm transition-all",
        isCompleted && "opacity-60"
      )}
    >
      {/* Status indicator */}
      <div
        className={cn(
          "mt-1.5 size-2.5 shrink-0 rounded-full",
          commitment.status === "completed" && "bg-emerald-500",
          commitment.status === "in_progress" && "bg-blue-500",
          commitment.status === "pending" && "bg-muted-foreground/30",
          commitment.status === "cancelled" && "bg-muted-foreground/20"
        )}
      />

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className={cn("text-sm font-medium truncate", isCompleted && "line-through text-muted-foreground")}>
            {commitment.title}
          </h3>
          <Badge
            variant="outline"
            className={cn("text-[10px] px-1.5 py-0 h-4 capitalize border-0", priorityColors[commitment.priority])}
          >
            {commitment.priority}
          </Badge>
          <Badge
            variant="outline"
            className={cn("text-[10px] px-1.5 py-0 h-4 capitalize border-0", categoryColors[commitment.category] || categoryColors.other)}
          >
            {commitment.category}
          </Badge>
          <Badge
            variant="outline"
            className={cn("text-[10px] px-1.5 py-0 h-4 capitalize border-0", statusColors[commitment.status])}
          >
            {commitment.status.replace("_", " ")}
          </Badge>
        </div>

        {commitment.description && (
          <p className="text-xs text-muted-foreground line-clamp-1">
            {commitment.description}
          </p>
        )}

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {commitment.deadline && (
            <span className="flex items-center gap-1">
              <CalendarDays className="size-3.5" />
              {formatDate(commitment.deadline)} at {formatTime(commitment.deadline)}
            </span>
          )}
          {commitment.estimated_duration && (
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {formatDuration(commitment.estimated_duration)}
            </span>
          )}
        </div>
      </div>

      {/* Actions menu — appears on hover */}
      <div className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <CommitmentActionsMenu
          commitment={commitment}
          onEdit={onEdit}
          onRefresh={onRefresh}
        />
      </div>
    </motion.div>
  )
}