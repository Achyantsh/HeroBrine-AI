"use client"

import { useState } from "react"
import {
  MoreHorizontal,
  Pencil,
  CheckCircle2,
  RotateCcw,
  Trash2,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { commitmentService } from "@/services/commitmentService"
import type { Commitment } from "@/types/commitment"

interface CommitmentActionsMenuProps {
  commitment: Commitment
  onEdit: (commitment: Commitment) => void
  onRefresh: () => void
}

export function CommitmentActionsMenu({
  commitment,
  onEdit,
  onRefresh,
}: CommitmentActionsMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [working, setWorking] = useState(false)

  const statusAction =
    commitment.status === "completed"
      ? { label: "Mark Pending", status: "pending" as const, icon: RotateCcw }
      : { label: "Mark Complete", status: "completed" as const, icon: CheckCircle2 }

  const handleStatusChange = async () => {
    setWorking(true)
    try {
      await commitmentService.updateStatus(commitment.id, statusAction.status)
      toast.success(`Commitment marked as ${statusAction.status}.`)
      setMenuOpen(false)
      onRefresh()
    } catch {
      toast.error("Failed to update status.")
    } finally {
      setWorking(false)
    }
  }

  const handleDelete = async () => {
    setWorking(true)
    try {
      await commitmentService.delete(commitment.id)
      toast.success("Deleted successfully.")
      setDeleteOpen(false)
      setMenuOpen(false)
      onRefresh()
    } catch {
      toast.error("Failed to delete commitment.")
    } finally {
      setWorking(false)
    }
  }

  const StatusIcon = statusAction.icon

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Actions"
            disabled={working}
          >
            {working ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <MoreHorizontal className="size-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              onEdit(commitment)
              setMenuOpen(false)
            }}
          >
            <Pencil className="size-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation()
              handleStatusChange()
            }}
          >
            <StatusIcon className="size-4" />
            {statusAction.label}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation()
              setDeleteOpen(true)
            }}
          >
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete confirmation dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete commitment?</DialogTitle>
            <DialogDescription>This cannot be undone.</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete &ldquo;{commitment.title}&rdquo;?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteOpen(false)}
              disabled={working}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={working}
              onClick={handleDelete}
            >
              {working ? (
                <>
                  <Loader2 className="size-4 animate-spin mr-1.5" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}