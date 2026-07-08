"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Clock, AlertTriangle, Flame } from "lucide-react"
import type { AnalyticsData } from "@/lib/analytics"

interface WeeklySummaryCardsProps {
  analytics: AnalyticsData | null
  loading: boolean
}

export function WeeklySummaryCards({ analytics }: WeeklySummaryCardsProps) {
  const a = analytics ?? {
    completed: 0,
    pending: 0,
    overdue: 0,
    highPriorityCount: 0,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="rounded-xl border border-border bg-card p-4 md:p-5"
    >
      <h3 className="text-sm font-semibold text-foreground mb-4">Weekly Summary</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border/60 bg-muted/40 p-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="size-4 text-emerald-500" />
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Completed</span>
          </div>
          <p className="text-lg font-bold text-foreground">{a.completed}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/40 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="size-4 text-blue-500" />
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Pending</span>
          </div>
          <p className="text-lg font-bold text-foreground">{a.pending}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/40 p-3">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="size-4 text-amber-500" />
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Overdue</span>
          </div>
          <p className="text-lg font-bold text-foreground">{a.overdue}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/40 p-3">
          <div className="flex items-center gap-2 mb-1">
            <Flame className="size-4 text-red-500" />
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">High Priority</span>
          </div>
          <p className="text-lg font-bold text-foreground">{a.highPriorityCount}</p>
        </div>
      </div>
    </motion.div>
  )
}