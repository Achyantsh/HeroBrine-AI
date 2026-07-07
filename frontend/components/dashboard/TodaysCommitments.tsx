"use client"

import { motion } from "framer-motion"
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  Circle,
  PlayCircle,
  XCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { todayCommitments, type Commitment } from "@/lib/mock-data"

const priorityColors: Record<string, string> = {
  low: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  critical:
    "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
}

const categoryColors: Record<string, string> = {
  assignment:
    "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  meeting: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  project:
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  bill: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  exam: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  health:
    "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  personal:
    "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  interview:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  event: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  other:
    "bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300",
}

const statusIcon: Record<string, React.ElementType> = {
  pending: Circle,
  in_progress: PlayCircle,
  completed: CheckCircle2,
  missed: XCircle,
  cancelled: XCircle,
}

const statusColors: Record<string, string> = {
  pending: "text-muted-foreground",
  in_progress: "text-blue-500",
  completed: "text-emerald-500",
  missed: "text-red-500",
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
}: {
  commitment: Commitment
  index: number
}) {
  const StatusIcon = statusIcon[commitment.status] || Circle

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] as const }}
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-card hover:border-border transition-colors group"
      )}
    >
      <StatusIcon
        className={cn(
          "size-5 mt-0.5 shrink-0",
          statusColors[commitment.status]
        )}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium text-foreground truncate">
            {commitment.title}
          </p>
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] px-1.5 py-0 h-4 capitalize border-0",
              priorityColors[commitment.priority]
            )}
          >
            {commitment.priority}
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              "text-[10px] px-1.5 py-0 h-4 capitalize border-0",
              categoryColors[commitment.category]
            )}
          >
            {commitment.category}
          </Badge>
        </div>
        {commitment.description && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {commitment.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
        <Clock className="size-3.5" />
        <span>{formatTime(commitment.deadline)}</span>
      </div>
    </motion.div>
  )
}

export function TodaysCommitments() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground tracking-wide uppercase">
          Today's Commitments
        </h2>
        <Badge variant="secondary" className="text-xs">
          {todayCommitments.length} items
        </Badge>
      </div>
      <div className="space-y-2">
        {todayCommitments.map((commitment, i) => (
          <CommitmentCard key={commitment.id} commitment={commitment} index={i} />
        ))}
      </div>
    </div>
  )
}