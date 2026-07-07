"use client"

import { useState, useCallback } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { GreetingHeader } from "@/components/dashboard/GreetingHeader"
import { AICommandCenter } from "@/components/dashboard/AICommandCenter"
import { QuickActionsGrid } from "@/components/dashboard/QuickActionsGrid"
import { TodaysCommitments } from "@/components/dashboard/TodaysCommitments"
import { UpcomingCommitments } from "@/components/dashboard/UpcomingCommitments"
import { AIInsightsCard } from "@/components/dashboard/AIInsightsCard"
import { SummaryCards } from "@/components/dashboard/SummaryCards"
import { UploadDialog } from "@/components/upload/UploadDialog"

export default function DashboardPage() {
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadTab, setUploadTab] = useState("text")

  const handleAction = useCallback((tab: string) => {
    setUploadTab(tab)
    setUploadOpen(true)
  }, [])

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8 pb-8">
        {/* Greeting */}
        <GreetingHeader />

        {/* AI Command Center */}
        <AICommandCenter />

        {/* Quick Actions */}
        <QuickActionsGrid onAction={handleAction} />

        {/* Main grid: left content + right sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            <TodaysCommitments />
            <UpcomingCommitments />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <SummaryCards />
            <AIInsightsCard />
          </div>
        </div>
      </div>

      {/* Upload Dialog */}
      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        defaultTab={uploadTab}
      />
    </DashboardLayout>
  )
}
