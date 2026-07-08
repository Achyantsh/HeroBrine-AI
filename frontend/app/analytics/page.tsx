"use client"

import { useMemo } from "react"
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
import { useCommitments } from "@/hooks/useCommitments"
import { computeAnalytics, type AnalyticsData } from "@/lib/analytics"

export default function AnalyticsPage() {
  const { commitments, loading } = useCommitments()

  const analytics: AnalyticsData | null = useMemo(() => {
    if (loading || commitments.length === 0) return null
    return computeAnalytics(commitments)
  }, [commitments, loading])

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

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 rounded-xl border border-border bg-card animate-pulse" />
            <div className="h-80 rounded-xl border border-border bg-card animate-pulse" />
          </div>
        )}

        {/* Top row: 2-column charts */}
        {!loading && analytics && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CommitmentBarChart analytics={analytics} loading={loading} />
            <PriorityPieChart analytics={analytics} loading={loading} />
          </div>
        )}

        {/* Completion Trend (full width) */}
        {!loading && (
          <CompletionLineChart analytics={analytics} loading={loading} />
        )}

        {/* Bottom section: 3 columns */}
        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Categories */}
            <div className="lg:col-span-2">
              <CategoryHorizontalBar analytics={analytics} loading={loading} />
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">
              <ProductivityScore analytics={analytics} loading={loading} />
              <WeeklySummaryCards analytics={analytics} loading={loading} />
            </div>
          </div>
        )}

        {/* AI Insights (full width) */}
        {!loading && (
          <AIRecommendationCard analytics={analytics} loading={loading} />
        )}

        {/* Empty state */}
        {!loading && !analytics && (
          <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed">
            <BarChart3 className="size-12 text-muted-foreground/30 mb-4" />
            <p className="text-sm text-muted-foreground">No analytics available yet.</p>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  )
}