"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { commitmentService } from "@/services/commitmentService"
import type { Commitment } from "@/types/commitment"

const categories = [
  { value: "work", label: "Work" },
  { value: "personal", label: "Personal" },
  { value: "health", label: "Health" },
  { value: "finance", label: "Finance" },
  { value: "study", label: "Study" },
  { value: "shopping", label: "Shopping" },
  { value: "other", label: "Other" },
]

const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
]

interface EditCommitmentDialogProps {
  commitment: Commitment | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditCommitmentDialog({
  commitment,
  open,
  onOpenChange,
  onSuccess,
}: EditCommitmentDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [priority, setPriority] = useState("")
  const [deadline, setDeadline] = useState<Date | undefined>(undefined)
  const [duration, setDuration] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (commitment) {
      setTitle(commitment.title)
      setDescription(commitment.description ?? "")
      setCategory(commitment.category)
      setPriority(commitment.priority)
      setDeadline(commitment.deadline ? new Date(commitment.deadline) : undefined)
      setDuration(commitment.estimated_duration ? String(commitment.estimated_duration) : "")
    }
  }, [commitment])

  const isValid = title.trim().length > 0

  const handleSave = async () => {
    if (!commitment || !isValid) return
    setSaving(true)
    try {
      await commitmentService.update(commitment.id, {
        title,
        description: description || null,
        category: category as any,
        priority: priority as any,
        deadline: deadline ? deadline.toISOString() : null,
        estimated_duration: duration ? Number(duration) : null,
      })
      toast.success("Commitment updated.")
      onSuccess()
      onOpenChange(false)
    } catch {
      toast.error("Failed to update commitment.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Commitment</DialogTitle>
          <DialogDescription>Update the details of this commitment.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Title *</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What do you need to do?" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
              className="min-h-[80px] resize-y"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Category</label>
              <Select value={category} onValueChange={(v) => setCategory(v ?? "other")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Priority</label>
              <Select value={priority} onValueChange={(v) => setPriority(v ?? "medium")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Deadline</label>
            <Popover>
              <PopoverTrigger>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-left font-normal">
                  <CalendarIcon className="size-4" />
                  {deadline ? format(deadline, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={deadline} onSelect={setDeadline} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Estimated Duration (minutes)</label>
            <Input type="number" min={0} placeholder="e.g. 60" value={duration} onChange={(e) => setDuration(e.target.value)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button size="sm" disabled={!isValid || saving} onClick={handleSave}>
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin mr-1.5" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}