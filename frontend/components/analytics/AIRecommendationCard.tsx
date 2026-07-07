"use client"

import { motion } from "framer-motion"
import { Lightbulb, Sparkles, TrendingUp, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { aiRecommendations } from "@/lib/analytics-data"

const typeIcons: Record<string, React.ElementType> = {
  pattern: TrendingUp,
  insight: Lightbulb,
  suggestion: AlertTriangle,
  tip: Sparkles,
}

const typeColors: Record<string, string> = {
  pattern:
    "border-purple-200 bg-purple-50 text-purple-800 dark:border-purple-800/40 dark:bg-purple-950/30 dark:text-purple-200",
  insight:
    "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800/40 dark:bg-blue-950/30 dark:text-blue-200",
  suggestion:
    "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800/40 dark:bg-amber-950/30 dark:text-amber-200",
  tip: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-200",
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const } },
}

export function AIRecommendationCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 md:p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="size-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">AI Recommendations</h3>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-2"
      >
        {aiRecommendations.map((rec) => {
          const Icon = typeIcons[rec.type] || Lightbulb

          return (
            <motion.div
              key={rec.id}
              variants={item}
              className={cn(
                "flex items-start gap-2.5 rounded-lg border p-3 text-xs leading-relaxed",
                typeColors[rec.type]
              )}
            >
              <Icon className="size-4 mt-0.5 shrink-0" />
              <span>{rec.text}</span>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}