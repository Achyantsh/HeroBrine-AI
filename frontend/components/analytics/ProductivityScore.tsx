"use client"

import { motion } from "framer-motion"
import { TrendingUp } from "lucide-react"
import type { AnalyticsData } from "@/lib/analytics"

interface ProductivityScoreProps {
  analytics: AnalyticsData | null
  loading: boolean
}

export function ProductivityScore({ analytics }: ProductivityScoreProps) {
  const score = analytics?.completionRate ?? 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="rounded-xl border border-border bg-card p-4 md:p-5"
    >
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Productivity Score
      </h3>
      <div className="flex items-center justify-center py-4">
        <div className="relative flex items-center justify-center size-32">
          <svg className="size-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="10"
            />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 52}`}
              strokeDashoffset={`${2 * Math.PI * 52 * (1 - score / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{score}%</span>
            <span className="text-[10px] text-muted-foreground">completion</span>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <TrendingUp className="size-3.5 text-emerald-500" />
          {score >= 80 ? "Excellent" : score >= 50 ? "Good" : "Needs improvement"}
        </div>
      </div>
    </motion.div>
  )
}