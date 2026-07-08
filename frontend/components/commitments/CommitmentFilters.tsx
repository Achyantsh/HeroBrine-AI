"use client"

import { Search, ArrowUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type SortField = "deadline" | "priority" | "title" | "created_at"

export interface Filters {
  search: string
  priority: string
  category: string
  status: string
  source: string
  sortField: SortField
  sortOrder: "asc" | "desc"
}

interface CommitmentFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

export function CommitmentFilters({ filters, onFiltersChange }: CommitmentFiltersProps) {
  const update = (key: keyof Filters, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleSortOrder = () => {
    onFiltersChange({
      ...filters,
      sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
    })
  }

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          type="search"
          placeholder="Search commitments..."
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
          className="w-full pl-9 h-9 text-sm"
          aria-label="Search commitments"
        />
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Priority filter */}
        <Select value={filters.priority} onValueChange={(v) => update("priority", v ?? "all")}>
          <SelectTrigger size="sm" className="w-[120px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        {/* Category filter */}
        <Select value={filters.category} onValueChange={(v) => update("category", v ?? "all")}>
          <SelectTrigger size="sm" className="w-[130px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="work">Work</SelectItem>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="health">Health</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="study">Study</SelectItem>
            <SelectItem value="shopping">Shopping</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        {/* Status filter */}
        <Select value={filters.status} onValueChange={(v) => update("status", v ?? "all")}>
          <SelectTrigger size="sm" className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        {/* Source filter */}
        <Select value={filters.source} onValueChange={(v) => update("source", v ?? "all")}>
          <SelectTrigger size="sm" className="w-[130px]">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="voice">Voice</SelectItem>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="pdf">PDF</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort field */}
        <Select value={filters.sortField} onValueChange={(v) => update("sortField", (v ?? "deadline") as SortField)}>
          <SelectTrigger size="sm" className="w-[130px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="deadline">Deadline</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="created_at">Created</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort order toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSortOrder}
          aria-label="Toggle sort order"
          className="h-7 gap-1"
        >
          <ArrowUpDown className="size-3.5" />
          {filters.sortOrder === "asc" ? "ASC" : "DESC"}
        </Button>
      </div>
    </div>
  )
}