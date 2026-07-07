"use client"

import { motion } from "framer-motion"
import { BarChart3 } from "lucide-react"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { CommitmentBarChart } from "@/components/analytics/CommitmentBarChart"
import { PriorityPieChart } from "@/components/analytics/PriorityPieChart"
import { CompletionLineChart } from "@/components/analytics/CompletionLineChart"
import { CategoryHorizontalBar } from "@/components/analytics/CategoryHorizontalBar"
import { ProductivityScore } from "@/components/analytics/ProductivityScore"
import { WeeklySummaryCards } from "@/components/analytics/WeeklySummaryCards"
import { AIRecommendationCard } from "@/components/analytics/AIRecommendationCard"

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <BarChart3 className="size-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Analytics
          </h1>
        </div>

        {/* Top row: 2-column charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CommitmentBarChart />
          <PriorityPieChart />
        </div>

        {/* Completion Trend (full width) */}
        <CompletionLineChart />

        {/* Bottom section: 3 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Categories */}
          <div className="lg:col-span-2">
            <CategoryHorizontalBar />
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            <ProductivityScore />
            <WeeklySummaryCards />
          </div>
        </div>

        {/* AI Recommendations (full width) */}
        <AIRecommendationCard />
      </motion.div>
    </DashboardLayout>
  )
}