"use client"

import { motion } from "framer-motion"
import {
  Lightbulb,
  AlertTriangle,
  Info,
  CheckCircle2,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { aiInsights } from "@/lib/mock-data"

const insightIcons: Record<string, React.ElementType> = {
  warning: AlertTriangle,
  suggestion: Lightbulb,
  info: Info,
  success: CheckCircle2,
}

const insightColors: Record<string, string> = {
  warning:
    "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800/40 dark:bg-amber-950/30 dark:text-amber-200",
  suggestion:
    "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800/40 dark:bg-blue-950/30 dark:text-blue-200",
  info: "border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-800/40 dark:bg-slate-950/30 dark:text-slate-200",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-200",
}

const iconWrapperColors: Record<string, string> = {
  warning: "text-amber-600 dark:text-amber-400",
  suggestion: "text-blue-600 dark:text-blue-400",
  info: "text-slate-600 dark:text-slate-400",
  success: "text-emerald-600 dark:text-emerald-400",
}

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const item = {
  hidden: { opacity: 0, x: -12 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

export function AIInsightsCard() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground tracking-wide uppercase">
          AI Insights
        </h2>
      </div>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-2"
      >
        {aiInsights.map((insight) => {
          const Icon = insightIcons[insight.type] || Info

          return (
            <motion.div
              key={insight.id}
              variants={item}
              className={cn(
                "flex items-start gap-2.5 rounded-lg border p-3 text-xs leading-relaxed",
                insightColors[insight.type]
              )}
            >
              <Icon
                className={cn(
                  "size-4 mt-0.5 shrink-0",
                  iconWrapperColors[insight.type]
                )}
              />
              <span>{insight.text}</span>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}