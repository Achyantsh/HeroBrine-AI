"use client"

import { motion } from "framer-motion"
import {
  Clock,
  CheckCircle2,
  Circle,
  PlayCircle,
  XCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Commitment } from "@/types/commitment"
import { CommitmentActionsMenu } from "@/components/commitments/CommitmentActionsMenu"

interface TodaysCommitmentsProps {
  commitments: Commitment[]
  loading: boolean
  onEdit: (commitment: Commitment) => void
  onRefresh: () => void
}

const priorityColors: Record<string, string> = {
  low: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  critical:
    "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
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

const statusIcon: Record<string, React.ElementType> = {
  pending: Circle,
  in_progress: PlayCircle,
  completed: CheckCircle2,
  cancelled: XCircle,
}

const statusColors: Record<string, string> = {
  pending: "text-muted-foreground",
  in_progress: "text-blue-500",
  completed: "text-emerald-500",
  cancelled: "text-muted-foreground/50",
}

function formatTime(iso: string) {
  const date = new Date(iso)
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

function CommitmentCard({
  commitment,
  index,
  onEdit,
  onRefresh,
}: {
  commitment: Commitment
  index: number
  onEdit: (commitment: Commitment) => void
  onRefresh: () => void
}) {
  const StatusIcon = statusIcon[commitment.status] || Circle
  const isCompleted = commitment.status === "completed"

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.08,
        ease: [0.25, 0.1, 0.25, 1] as const,
      }}
      className={cn(
        "flex items-start gap-3 rounded-lg border border-border/50 bg-card p-3 transition-colors hover:border-border group",
        isCompleted && "opacity-60"
      )}
    >
      <StatusIcon
        className={cn(
          "mt-0.5 size-5 shrink-0",
          statusColors[commitment.status]
        )}
      />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p
            className={cn(
              "truncate text-sm font-medium text-foreground",
              isCompleted && "line-through"
            )}
          >
            {commitment.title}
          </p>

          <Badge
            variant="outline"
            className={cn(
              "h-4 border-0 px-1.5 py-0 text-[10px] capitalize",
              priorityColors[commitment.priority]
            )}
          >
            {commitment.priority}
          </Badge>

          <Badge
            variant="outline"
            className={cn(
              "h-4 border-0 px-1.5 py-0 text-[10px] capitalize",
              categoryColors[commitment.category] || categoryColors.other
            )}
          >
            {commitment.category}
          </Badge>
        </div>

        {commitment.description && (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {commitment.description}
          </p>
        )}
      </div>

      {commitment.deadline && (
        <div className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3.5" />
          <span>{formatTime(commitment.deadline)}</span>
        </div>
      )}

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

export function TodaysCommitments({
  commitments,
  loading,
  onEdit,
  onRefresh,
}: TodaysCommitmentsProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todaysCommitments = commitments.filter((commitment) => {
    if (!commitment.deadline) return false
    const deadline = new Date(commitment.deadline)
    deadline.setHours(0, 0, 0, 0)
    return deadline.getTime() === today.getTime()
  })

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground">
          Today's Commitments
        </h2>
        <Badge variant="secondary" className="text-xs">
          {todaysCommitments.length} items
        </Badge>
      </div>

      {loading ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          Loading commitments...
        </div>
      ) : todaysCommitments.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          No commitments for today 🎉
        </div>
      ) : (
        <div className="space-y-2">
          {todaysCommitments.map((commitment, index) => (
            <CommitmentCard
              key={commitment.id}
              commitment={commitment}
              index={index}
              onEdit={onEdit}
              onRefresh={onRefresh}
            />
          ))}
        </div>
      )}
    </div>
  )
}