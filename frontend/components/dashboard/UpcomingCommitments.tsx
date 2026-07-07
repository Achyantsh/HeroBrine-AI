"use client"

import { motion } from "framer-motion"
import { CalendarDays, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { upcomingCommitments, type Commitment } from "@/lib/mock-data"

const priorityColors: Record<string, string> = {
  low: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  critical:
    "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
}

function formatDate(iso: string) {
  const date = new Date(iso)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)

  if (target.getTime() === tomorrow.getTime()) return "Tomorrow"
  if (target.getTime() === today.getTime()) return "Today"

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

function formatTime(iso: string) {
  const date = new Date(iso)
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

function UpcomingRow({
  commitment,
  index,
}: {
  commitment: Commitment
  index: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        delay: index * 0.05,
        ease: [0.25, 0.1, 0.25, 1] as const,
      }}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
      )}
    >
      <div className="flex items-center justify-center size-9 rounded-lg bg-muted shrink-0">
        <CalendarDays className="size-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {commitment.title}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDate(commitment.deadline)} at {formatTime(commitment.deadline)}
        </p>
      </div>
      <Badge
        variant="outline"
        className={cn(
          "text-[10px] px-1.5 py-0 h-4 capitalize border-0 shrink-0",
          priorityColors[commitment.priority]
        )}
      >
        {commitment.priority}
      </Badge>
      <ChevronRight className="size-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0" />
    </motion.div>
  )
}

export function UpcomingCommitments() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground tracking-wide uppercase">
          Upcoming Commitments
        </h2>
        <Button variant="ghost" size="xs" className="text-xs">
          View all
        </Button>
      </div>
      <div className="space-y-0.5">
        {upcomingCommitments.map((commitment, i) => (
          <UpcomingRow key={commitment.id} commitment={commitment} index={i} />
        ))}
      </div>
    </div>
  )
}