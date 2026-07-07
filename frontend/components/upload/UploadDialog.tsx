"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import {
  FileText,
  FileUp,
  FileImage,
  Mic,
  PenSquare,
  Upload,
  Sparkles,
  Send,
  Paperclip,
  X,
  Trash2,
  StopCircle,
  AudioLines,
  CalendarIcon,
  ImageIcon,
  CheckCircle2,
} from "lucide-react"
import { useDropzone } from "react-dropzone"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
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

interface UploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: string
}

// ─── Tab data ───────────────────────────────────────────────────
interface TabDefinition {
  value: string
  label: string
  icon: React.ElementType
}

const tabs: TabDefinition[] = [
  { value: "text", label: "Text", icon: FileText },
  { value: "pdf", label: "PDF", icon: FileUp },
  { value: "image", label: "Image", icon: FileImage },
  { value: "voice", label: "Voice", icon: Mic },
  { value: "manual", label: "Manual", icon: PenSquare },
]

// ─── DropZone sub-component ─────────────────────────────────────
function DropZone({
  accept,
  icon: Icon,
  label,
  description,
  preview,
  onClear,
  isDragReject,
}: {
  accept: Record<string, string[]>
  icon: React.ElementType
  label: string
  description: string
  preview?: string | null
  onClear?: () => void
  isDragReject?: boolean
}) {
  const onDrop = useCallback(() => {
    /* no-op for mock */
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple: false,
  })

  if (preview) {
    return (
      <div className="relative flex flex-col items-center gap-3 rounded-xl border-2 border-emerald-200 bg-emerald-50/50 p-6 dark:border-emerald-800/40 dark:bg-emerald-950/20">
        <CheckCircle2 className="size-8 text-emerald-500" />
        <p className="text-sm font-medium text-foreground">File ready</p>
        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
          {preview}
        </p>
        {onClear && (
          <Button variant="ghost" size="icon-sm" onClick={onClear} className="absolute top-2 right-2">
            <Trash2 className="size-4" />
          </Button>
        )}
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors",
        isDragActive && !isDragReject
          ? "border-primary bg-primary/5"
          : "border-border hover:border-muted-foreground/30 hover:bg-muted/30",
        isDragReject && "border-destructive bg-destructive/5"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Icon className="size-6 text-muted-foreground" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

// ─── Tab: Text ──────────────────────────────────────────────────
function TextTab() {
  const [text, setText] = useState("")

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Paste your notes, emails, or any text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[200px] resize-y text-sm"
      />
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => setText("")}>
          Clear
        </Button>
        <Button size="sm" disabled={!text.trim()} className="gap-1.5">
          <Sparkles className="size-4" />
          Extract Commitments
        </Button>
      </div>
    </div>
  )
}

// ─── Tab: PDF ───────────────────────────────────────────────────
function PdfTab() {
  const [file, setFile] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <DropZone
        accept={{ "application/pdf": [".pdf"] }}
        icon={FileUp}
        label="Upload PDF"
        description="Drag & drop a PDF, or click to browse"
        preview={file}
        onClear={() => setFile(null)}
      />
      <div className="flex justify-end">
        <Button size="sm" disabled={!file} className="gap-1.5">
          <Sparkles className="size-4" />
          Extract from PDF
        </Button>
      </div>
    </div>
  )
}

// ─── Tab: Image ─────────────────────────────────────────────────
function ImageTab() {
  const [preview, setPreview] = useState<string | null>(null)

  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length > 0) {
      setPreview(URL.createObjectURL(accepted[0]))
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    multiple: false,
  })

  if (preview) {
    return (
      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-xl border border-border">
          <img
            src={preview}
            alt="Uploaded preview"
            className="max-h-[300px] w-full object-contain bg-muted/30"
          />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setPreview(null)}
            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
        <div className="flex justify-end">
          <Button size="sm" className="gap-1.5">
            <Sparkles className="size-4" />
            Extract from Image
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors",
        isDragActive && !isDragReject
          ? "border-primary bg-primary/5"
          : "border-border hover:border-muted-foreground/30 hover:bg-muted/30",
        isDragReject && "border-destructive bg-destructive/5"
      )}
    >
      <input {...getInputProps()} />
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <ImageIcon className="size-6 text-muted-foreground" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">Upload Image</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Drag & drop a screenshot or photo, or click to browse
        </p>
      </div>
    </div>
  )
}

// ─── Tab: Voice ─────────────────────────────────────────────────
function VoiceTab() {
  const [recording, setRecording] = useState(false)
  const [recorded, setRecorded] = useState(false)

  const toggleRecording = () => {
    if (recording) {
      setRecording(false)
      setRecorded(true)
    } else {
      setRecording(true)
      setRecorded(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      {/* Microphone button */}
      <motion.button
        onClick={toggleRecording}
        whileTap={{ scale: 0.9 }}
        className={cn(
          "relative flex size-24 items-center justify-center rounded-full transition-all",
          recording
            ? "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/30"
            : recorded
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
        )}
      >
        {recording ? (
          <AnimatePresence mode="wait">
            <motion.div
              key="recording"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-1"
            >
              <span className="size-2 animate-pulse rounded-full bg-white" />
              <span className="size-2 animate-pulse rounded-full bg-white delay-150" />
              <span className="size-2 animate-pulse rounded-full bg-white delay-300" />
            </motion.div>
          </AnimatePresence>
        ) : (
          <Mic className="size-8" />
        )}
      </motion.button>

      {/* Status text */}
      <div className="text-center">
        {recording ? (
          <p className="text-sm font-medium text-destructive">Recording...</p>
        ) : recorded ? (
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Recording saved
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">Tap to start recording</p>
        )}
      </div>

      {/* Waveform placeholder */}
      {recording && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 48 }}
          className="flex items-center justify-center gap-0.5 w-full max-w-[240px]"
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                height: [8, 32, 8, 20, 8, 40, 8],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.05,
                ease: "easeInOut",
              }}
              className="w-1.5 rounded-full bg-destructive/60"
            />
          ))}
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {recording && (
          <Button
            variant="destructive"
            size="sm"
            onClick={toggleRecording}
            className="gap-1.5"
          >
            <StopCircle className="size-4" />
            Stop Recording
          </Button>
        )}
        {recorded && (
          <>
            <Button variant="outline" size="sm" onClick={() => setRecorded(false)}>
              Re-record
            </Button>
            <Button size="sm" className="gap-1.5">
              <Sparkles className="size-4" />
              Transcribe & Extract
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Tab: Manual ────────────────────────────────────────────────
const categories = [
  { value: "assignment", label: "Assignment" },
  { value: "exam", label: "Exam" },
  { value: "interview", label: "Interview" },
  { value: "meeting", label: "Meeting" },
  { value: "project", label: "Project" },
  { value: "bill", label: "Bill" },
  { value: "health", label: "Health" },
  { value: "personal", label: "Personal" },
  { value: "event", label: "Event" },
  { value: "other", label: "Other" },
]

const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
]

function ManualTab() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [priority, setPriority] = useState("")
  const [deadline, setDeadline] = useState<Date | undefined>(undefined)
  const [duration, setDuration] = useState("")
  const [dependencies, setDependencies] = useState("")

  const isValid = title.trim().length > 0

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">Title *</label>
        <Input
          placeholder="What do you need to do?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">Description</label>
        <Textarea
          placeholder="Add details about this commitment..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[80px] resize-y"
        />
      </div>

      {/* Category + Priority row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Category</label>
          <Select value={category} onValueChange={(v) => setCategory(v ?? "")}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Priority</label>
          <Select value={priority} onValueChange={(v) => setPriority(v ?? "")}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {priorities.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Deadline */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">Deadline</label>
        <Popover>
          <PopoverTrigger>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 text-left font-normal"
            >
              <CalendarIcon className="size-4" />
              {deadline ? format(deadline, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={deadline}
              onSelect={setDeadline}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Estimated Duration */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">
          Estimated Duration (minutes)
        </label>
        <Input
          type="number"
          min={0}
          placeholder="e.g. 60"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </div>

      {/* Dependencies */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">Dependencies</label>
        <Input
          placeholder="e.g. Submit design, Review feedback"
          value={dependencies}
          onChange={(e) => setDependencies(e.target.value)}
        />
        <p className="text-[10px] text-muted-foreground">
          Comma-separated list of tasks this depends on
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <Badge variant="outline" className="text-xs">
          {isValid ? "Ready to save" : "Title is required"}
        </Badge>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button size="sm" disabled={!isValid} className="gap-1.5">
            <CheckCircle2 className="size-4" />
            Save Commitment
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Main UploadDialog ─────────────────────────────────────────
export function UploadDialog({ open, onOpenChange, defaultTab = "text" }: UploadDialogProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="size-5 text-primary" />
            AI Upload Center
          </DialogTitle>
          <DialogDescription>
            Upload or paste your content to let HeroBrine AI extract commitments.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5">
                  <Icon className="size-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          <div className="mt-4">
            <TabsContent value="text">
              <TextTab />
            </TabsContent>
            <TabsContent value="pdf">
              <PdfTab />
            </TabsContent>
            <TabsContent value="image">
              <ImageTab />
            </TabsContent>
            <TabsContent value="voice">
              <VoiceTab />
            </TabsContent>
            <TabsContent value="manual">
              <ManualTab />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}