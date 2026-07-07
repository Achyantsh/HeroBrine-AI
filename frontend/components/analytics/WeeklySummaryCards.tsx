"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Circle, AlertTriangle, AlertOctagon } from "lucide-react"
import { cn } from "@/lib/utils"
import { weeklySummary } from "@/lib/analytics-data"

interface SummaryStat {
  label: string
  value: number
  icon: React.ElementType
  color: string
  bgColor: string
  darkBgColor: string
}

const stats: SummaryStat[] = [
  {
    label: "Completed",
    value: weeklySummary.completed,
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50",
    darkBgColor: "dark:bg-emerald-950/30",
  },
  {
    label: "Pending",
    value: weeklySummary.pending,
    icon: Circle,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50",
    darkBgColor: "dark:bg-amber-950/30",
  },
  {
    label: "Overdue",
    value: weeklySummary.overdue,
    icon: AlertTriangle,
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50",
    darkBgColor: "dark:bg-red-950/30",
  },
  {
    label: "High Priority",
    value: weeklySummary.highPriority,
    icon: AlertOctagon,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50",
    darkBgColor: "dark:bg-orange-950/30",
  },
]

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const } },
}

export function WeeklySummaryCards() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-3"
    >
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.label}
            variants={item}
            className={cn(
              "flex flex-col gap-2 rounded-xl border border-border/60 p-3.5",
              stat.bgColor,
              stat.darkBgColor
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                {stat.label}
              </span>
              <Icon className={cn("size-4", stat.color)} />
            </div>
            <span className="text-2xl font-bold text-foreground">{stat.value}</span>
          </motion.div>
        )
      })}
    </motion.div>
  )
}