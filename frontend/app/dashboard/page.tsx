"use client"

import { useState, useCallback } from "react"
import { useCommitments } from "@/hooks/useCommitments"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { GreetingHeader } from "@/components/dashboard/GreetingHeader"
import { AICommandCenter } from "@/components/dashboard/AICommandCenter"
import { QuickActionsGrid } from "@/components/dashboard/QuickActionsGrid"
import { TodaysCommitments } from "@/components/dashboard/TodaysCommitments"
import { UpcomingCommitments } from "@/components/dashboard/UpcomingCommitments"
import { AIInsightsCard } from "@/components/dashboard/AIInsightsCard"
import { SummaryCards } from "@/components/dashboard/SummaryCards"
import { UploadDialog } from "@/components/upload/UploadDialog"
import { EditCommitmentDialog } from "@/components/commitments/EditCommitmentDialog"
import type { Commitment } from "@/types/commitment"

export default function DashboardPage() {
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadTab, setUploadTab] = useState("text")
  const [editCommitment, setEditCommitment] = useState<Commitment | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  const { commitments, loading, refresh } = useCommitments()

  const handleAction = useCallback((tab: string) => {
    setUploadTab(tab)
    setUploadOpen(true)
  }, [])

  const handleEdit = useCallback((commitment: Commitment) => {
    setEditCommitment(commitment)
    setEditOpen(true)
  }, [])

  const handleEditSuccess = useCallback(() => {
    refresh()
  }, [refresh])

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8 pb-8">
        <GreetingHeader />
        <AICommandCenter onSuccess={refresh} />
        <QuickActionsGrid onAction={handleAction} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TodaysCommitments
              commitments={commitments}
              loading={loading}
              onEdit={handleEdit}
              onRefresh={refresh}
            />
            <UpcomingCommitments
              commitments={commitments}
              loading={loading}
              onEdit={handleEdit}
              onRefresh={refresh}
            />
          </div>

          <div className="space-y-6">
            <SummaryCards commitments={commitments} />
            <AIInsightsCard />
          </div>
        </div>
      </div>

      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        defaultTab={uploadTab}
        onSuccess={refresh}
      />

      <EditCommitmentDialog
        commitment={editCommitment}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={handleEditSuccess}
      />
    </DashboardLayout>
  )
}
