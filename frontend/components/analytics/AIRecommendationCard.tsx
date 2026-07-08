"use client"

import { motion } from "framer-motion"
import { Lightbulb, AlertTriangle, TrendingUp, Target, Zap } from "lucide-react"
import type { AnalyticsData } from "@/lib/analytics"

interface AIRecommendationCardProps {
  analytics: AnalyticsData | null
  loading: boolean
}

const iconMap: Record<string, React.ElementType> = {
  insight: Lightbulb,
  tip: Zap,
  pattern: TrendingUp,
  suggestion: Target,
}

function getIcon(text: string) {
  if (text.startsWith("⚠️")) return AlertTriangle
  if (text.includes("Excellent")) return TrendingUp
  if (text.includes("Focus")) return Target
  return Lightbulb
}

export function AIRecommendationCard({ analytics }: AIRecommendationCardProps) {
  const insights = analytics?.insights ?? []

  if (insights.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.45 }}
        className="rounded-xl border border-border bg-card p-4 md:p-5"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4">AI Insights</h3>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Lightbulb className="size-10 text-muted-foreground/30 mb-3" />
          <p className="text-sm text-muted-foreground">Start adding commitments to receive AI insights.</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.45 }}
      className="rounded-xl border border-border bg-card p-4 md:p-5"
    >
      <h3 className="text-sm font-semibold text-foreground mb-4">AI Insights</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {insights.map((text, i) => {
          const Icon = getIcon(text)
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.05 * i }}
              className="flex items-start gap-3 rounded-lg border border-border/60 bg-muted/30 p-3"
            >
              <div className="mt-0.5 size-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="size-4 text-primary" />
              </div>
              <p className="text-xs text-foreground leading-relaxed">{text}</p>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}