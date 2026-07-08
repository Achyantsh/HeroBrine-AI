"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import {
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  Target,
  Sparkles,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useCommitments } from "@/hooks/useCommitments"
import { computeAnalytics } from "@/lib/analytics"

function getIcon(text: string) {
  if (text.startsWith("⚠️")) return AlertTriangle
  if (text.includes("Excellent")) return TrendingUp
  if (text.includes("Focus")) return Target
  return Lightbulb
}

function getColors(text: string) {
  if (text.startsWith("⚠️"))
    return {
      border: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800/40 dark:bg-amber-950/30 dark:text-amber-200",
      icon: "text-amber-600 dark:text-amber-400",
    }
  if (text.includes("Excellent") || text.includes("Focus"))
    return {
      border: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-200",
      icon: "text-emerald-600 dark:text-emerald-400",
    }
  return {
    border: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800/40 dark:bg-blue-950/30 dark:text-blue-200",
    icon: "text-blue-600 dark:text-blue-400",
  }
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
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
  const { commitments, loading } = useCommitments()

  const insights = useMemo(() => {
    if (!commitments || commitments.length === 0) return []
    const analytics = computeAnalytics(commitments)
    return analytics.insights
  }, [commitments])

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground tracking-wide uppercase">
            AI Insights
          </h2>
        </div>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 rounded-lg border border-border/60 bg-card animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (insights.length === 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground tracking-wide uppercase">
            AI Insights
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center rounded-lg border border-dashed">
          <Lightbulb className="size-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">Start adding commitments to receive AI insights.</p>
        </div>
      </div>
    )
  }

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
        {insights.map((text, idx) => {
          const Icon = getIcon(text)
          const colors = getColors(text)

          return (
            <motion.div
              key={idx}
              variants={item}
              className={cn(
                "flex items-start gap-2.5 rounded-lg border p-3 text-xs leading-relaxed",
                colors.border
              )}
            >
              <Icon className={cn("size-4 mt-0.5 shrink-0", colors.icon)} />
              <span>{text}</span>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}