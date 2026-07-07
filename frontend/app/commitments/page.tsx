"use client"

import { useState, useMemo, useCallback } from "react"
import { motion } from "framer-motion"
import { ListChecks, Plus } from "lucide-react"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { CommitmentCard } from "@/components/commitments/CommitmentCard"
import { CommitmentFilters, type Filters } from "@/components/commitments/CommitmentFilters"
import { CommitmentDetailsSheet } from "@/components/commitments/CommitmentDetailsSheet"
import { todayCommitments, upcomingCommitments, type Commitment } from "@/lib/mock-data"

const priorityRank: Record<string, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
}

export default function CommitmentsPage() {
  const [selectedCommitment, setSelectedCommitment] = useState<Commitment | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const allCommitments: Commitment[] = useMemo(
    () => [...todayCommitments, ...upcomingCommitments],
    []
  )

  const [filters, setFilters] = useState<Filters>({
    search: "",
    priority: "all",
    category: "all",
    status: "all",
    sortField: "deadline",
    sortOrder: "asc",
  })

  const handleViewDetails = useCallback((commitment: Commitment) => {
    setSelectedCommitment(commitment)
    setSheetOpen(true)
  }, [])

  const filteredCommitments = useMemo(() => {
    let result = [...allCommitments]

    // Search filter
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase()
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(query) ||
          (c.description && c.description.toLowerCase().includes(query))
      )
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

    // Sort
    result.sort((a, b) => {
      let cmp = 0
      switch (filters.sortField) {
        case "deadline":
          cmp = new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
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
  }, [allCommitments, filters])

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
              {filteredCommitments.length} of {allCommitments.length}
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

        {/* Commitment cards list */}
        <div className="space-y-2">
          {filteredCommitments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ListChecks className="size-12 text-muted-foreground/30 mb-4" />
              <p className="text-sm text-muted-foreground">No commitments match your filters.</p>
              <Button
                variant="link"
                size="sm"
                onClick={() =>
                  setFilters({
                    search: "",
                    priority: "all",
                    category: "all",
                    status: "all",
                    sortField: "deadline",
                    sortOrder: "asc",
                  })
                }
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            filteredCommitments.map((commitment, i) => (
              <CommitmentCard
                key={commitment.id}
                commitment={commitment}
                index={i}
                onViewDetails={handleViewDetails}
              />
            ))
          )}
        </div>
      </motion.div>

      {/* Details sheet */}
      <CommitmentDetailsSheet
        commitment={selectedCommitment}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </DashboardLayout>
  )
}