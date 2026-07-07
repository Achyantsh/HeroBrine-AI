"use client"

import { CalendarDays, Clock, AlertTriangle, CheckCircle2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import type { Commitment } from "@/lib/mock-data"

interface CommitmentDetailsSheetProps {
  commitment: Commitment | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const priorityColors: Record<string, string> = {
  low: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  high: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  critical: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
}

const categoryColors: Record<string, string> = {
  assignment: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  meeting: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
  project: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  bill: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  exam: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
  health: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  personal: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  interview: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  event: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  other: "bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300",
}

const statusColors: Record<string, string> = {
  pending: "text-muted-foreground bg-muted",
  in_progress: "text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/40",
  completed: "text-emerald-600 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/40",
  missed: "text-red-600 bg-red-50 dark:text-red-300 dark:bg-red-950/40",
  cancelled: "text-muted-foreground bg-muted",
}

function formatDateTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
}

function formatDuration(minutes: number | null): string {
  if (!minutes) return "Not specified"
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function CommitmentDetailsSheet({
  commitment,
  open,
  onOpenChange,
}: CommitmentDetailsSheetProps) {
  if (!commitment) return null

  const hasWarning =
    commitment.priority === "high" || commitment.priority === "critical"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0">
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-border">
          <SheetTitle className="text-lg">{commitment.title}</SheetTitle>
          {commitment.description && (
            <SheetDescription className="mt-1">
              {commitment.description}
            </SheetDescription>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Status + Priority + Category */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className={cn(
                "capitalize border-0",
                statusColors[commitment.status]
              )}
            >
              {commitment.status.replace("_", " ")}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                "capitalize border-0",
                priorityColors[commitment.priority]
              )}
            >
              {commitment.priority}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                "capitalize border-0",
                categoryColors[commitment.category]
              )}
            >
              {commitment.category}
            </Badge>
          </div>

          {/* Deadline */}
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <CalendarDays className="size-4 shrink-0" />
            <span>{formatDateTime(commitment.deadline)}</span>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
            <Clock className="size-4 shrink-0" />
            <span>Estimated: {formatDuration(commitment.estimated_duration)}</span>
          </div>

          {/* AI Confidence */}
          {commitment.ai_confidence != null && (
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <AlertTriangle className="size-4 shrink-0" />
              <span>AI Confidence: {Math.round(commitment.ai_confidence * 100)}%</span>
            </div>
          )}

          {/* Warning for high/critical */}
          {hasWarning && (
            <div className="flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-800/40 dark:bg-amber-950/30 dark:text-amber-200">
              <AlertTriangle className="size-4 mt-0.5 shrink-0" />
              <span>
                This commitment has {commitment.priority} priority. Consider
                prioritizing this in your schedule.
              </span>
            </div>
          )}

          {/* AI Generated badge */}
          {commitment.is_ai_generated && (
            <div className="flex items-center gap-2.5 rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800 dark:border-blue-800/40 dark:bg-blue-950/30 dark:text-blue-200">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>Automatically detected by HeroBrine AI</span>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="border-t border-border px-5 py-4 flex items-center gap-2">
          <Button variant="default" size="sm" className="flex-1">
            Mark Complete
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Edit
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Delete">
            <X className="size-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}