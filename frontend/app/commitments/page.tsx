"use client"

import { useState, useMemo, useCallback } from "react"
import { motion } from "framer-motion"
import { ListChecks, Plus, Loader2 } from "lucide-react"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { CommitmentCard } from "@/components/commitments/CommitmentCard"
import { CommitmentFilters, type Filters } from "@/components/commitments/CommitmentFilters"
import { EditCommitmentDialog } from "@/components/commitments/EditCommitmentDialog"
import { useCommitments } from "@/hooks/useCommitments"
import type { Commitment } from "@/types/commitment"

const priorityRank: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
}

export default function CommitmentsPage() {
  const { commitments, loading, refresh } = useCommitments()

  const [editCommitment, setEditCommitment] = useState<Commitment | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  const [filters, setFilters] = useState<Filters>({
    search: "",
    priority: "all",
    category: "all",
    status: "all",
    source: "all",
    sortField: "deadline",
    sortOrder: "asc",
  })

  const handleEdit = useCallback((commitment: Commitment) => {
    setEditCommitment(commitment)
    setEditOpen(true)
  }, [])

  const handleEditSuccess = useCallback(() => {
    refresh()
  }, [refresh])

  const filteredCommitments = useMemo(() => {
    let result = [...commitments]

    // Search filter — searches title, description, priority, category, status, source
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase()
      result = result.filter((c) => {
        const searchable = [
          c.title,
          c.description ?? "",
          c.priority,
          c.category,
          c.status,
          c.source ?? "",
        ]
        return searchable.some((field) => field.toLowerCase().includes(query))
      })
    }

    // Priority filter
    if (filters.priority !== "all") {
      result = result.filter((c) => c.priority === filters.priority)
    }

    // Category filter
    if (filters.category !== "all") {
      result = result.filter((c) => c.category === filters.category)
    }

    // Status filter
    if (filters.status !== "all") {
      result = result.filter((c) => c.status === filters.status)
    }

    // Source filter
    if (filters.source !== "all") {
      result = result.filter((c) => c.source === filters.source)
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0
      switch (filters.sortField) {
        case "deadline":
          cmp = new Date(a.deadline ?? 0).getTime() - new Date(b.deadline ?? 0).getTime()
          break
        case "priority":
          cmp = (priorityRank[a.priority] ?? 0) - (priorityRank[b.priority] ?? 0)
          break
        case "title":
          cmp = a.title.localeCompare(b.title)
          break
        case "created_at":
          cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          break
      }
      return filters.sortOrder === "asc" ? cmp : -cmp
    })

    return result
  }, [commitments, filters])

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6 max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ListChecks className="size-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Commitments</h1>
            <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {filteredCommitments.length} of {commitments.length}
            </span>
          </div>
          <Button size="sm" className="gap-1.5">
            <Plus className="size-4" />
            Add Commitment
          </Button>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <CommitmentFilters filters={filters} onFiltersChange={setFilters} />
        </motion.div>

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-xl border border-border/60 bg-card p-4 animate-pulse"
              >
                <div className="size-2.5 rounded-full bg-muted mt-1.5" />
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <div className="h-4 w-48 rounded bg-muted" />
                    <div className="h-4 w-14 rounded bg-muted" />
                    <div className="h-4 w-16 rounded bg-muted" />
                    <div className="h-4 w-20 rounded bg-muted" />
                  </div>
                  <div className="h-3 w-64 rounded bg-muted" />
                  <div className="flex gap-3">
                    <div className="h-3 w-32 rounded bg-muted" />
                    <div className="h-3 w-16 rounded bg-muted" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Commitment cards list */}
        {!loading && (
          <div className="space-y-2">
            {filteredCommitments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <ListChecks className="size-12 text-muted-foreground/30 mb-4" />
                <p className="text-sm text-muted-foreground">
                  {commitments.length === 0
                    ? "No commitments yet. Add one to get started."
                    : "No commitments match your filters."}
                </p>
                {commitments.length > 0 && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() =>
                      setFilters({
                        search: "",
                        priority: "all",
                        category: "all",
                        status: "all",
                        source: "all",
                        sortField: "deadline",
                        sortOrder: "asc",
                      })
                    }
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            ) : (
              filteredCommitments.map((commitment, i) => (
                <CommitmentCard
                  key={commitment.id}
                  commitment={commitment}
                  index={i}
                  onEdit={handleEdit}
                  onRefresh={refresh}
                />
              ))
            )}
          </div>
        )}
      </motion.div>

      {/* Edit dialog */}
      <EditCommitmentDialog
        commitment={editCommitment}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={handleEditSuccess}
      />
    </DashboardLayout>
  )
}