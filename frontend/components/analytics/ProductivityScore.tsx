"use client"

import { motion } from "framer-motion"

export function ProductivityScore() {
  const score = 78
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (score / 100) * circumference

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="rounded-xl border border-border bg-card p-4 md:p-5 flex flex-col items-center"
    >
      <h3 className="text-sm font-semibold text-foreground mb-4 self-start">
        Productivity Score
      </h3>

      <div className="relative flex items-center justify-center">
        <svg width="130" height="130" className="-rotate-90">
          {/* Background circle */}
          <circle
            cx="65"
            cy="65"
            r="54"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <motion.circle
            cx="65"
            cy="65"
            r="54"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-3xl font-bold text-foreground"
          >
            {score}
          </motion.span>
          <span className="text-xs text-muted-foreground">/ 100</span>
        </div>
      </div>

      <p className="mt-3 text-xs text-muted-foreground text-center max-w-[160px]">
        {score >= 80
          ? "Excellent productivity! Keep it up."
          : score >= 60
            ? "Good momentum. Room for improvement."
            : "Needs attention. Try focusing on high-priority items."}
      </p>
    </motion.div>
  )
}