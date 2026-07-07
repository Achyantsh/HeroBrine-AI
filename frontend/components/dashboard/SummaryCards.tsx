"use client"

import { motion } from "framer-motion"
import { ListChecks, CheckCircle2, Circle, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { summaryStats } from "@/lib/mock-data"

interface StatCard {
  label: string
  value: number
  icon: React.ElementType
  color: string
  bgColor: string
  darkBgColor: string
  accentBorder: string
}

const stats: StatCard[] = [
  {
    label: "Total",
    value: summaryStats.total,
    icon: ListChecks,
    color: "text-slate-600 dark:text-slate-300",
    bgColor: "bg-slate-50",
    darkBgColor: "dark:bg-slate-900/60",
    accentBorder: "border-l-slate-500",
  },
  {
    label: "Completed",
    value: summaryStats.completed,
    icon: CheckCircle2,
    color: "text-emerald-600 dark:text-emerald-300",
    bgColor: "bg-emerald-50",
    darkBgColor: "dark:bg-emerald-900/30",
    accentBorder: "border-l-emerald-500",
  },
  {
    label: "Pending",
    value: summaryStats.pending,
    icon: Circle,
    color: "text-amber-600 dark:text-amber-300",
    bgColor: "bg-amber-50",
    darkBgColor: "dark:bg-amber-900/30",
    accentBorder: "border-l-amber-500",
  },
  {
    label: "High Priority",
    value: summaryStats.highPriority,
    icon: AlertTriangle,
    color: "text-red-600 dark:text-red-300",
    bgColor: "bg-red-50",
    darkBgColor: "dark:bg-red-900/30",
    accentBorder: "border-l-red-500",
  },
]

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

export function SummaryCards() {
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
              "flex flex-col gap-2 rounded-xl border border-border/60 border-l-2 p-3.5",
              stat.bgColor,
              stat.darkBgColor,
              stat.accentBorder
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                {stat.label}
              </span>
              <Icon className={cn("size-4", stat.color)} />
            </div>
            <span className="text-2xl font-bold text-foreground">
              {stat.value}
            </span>
          </motion.div>
        )
      })}
    </motion.div>
  )
}