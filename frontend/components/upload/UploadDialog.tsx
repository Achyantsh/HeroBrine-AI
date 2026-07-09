"use client"
import api from "@/lib/api"
import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import {
  FileText,
  FileUp,
  FileImage,
  Mic,
  PenSquare,
  Sparkles,
  Trash2,
  StopCircle,
  CalendarIcon,
  ImageIcon,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
  onSuccess?: () => void
}

// ─── Tab data ───────────────────────────────────────────────────
interface TabDefinition {
  value: string
  label: string
  icon: React.ElementType
}

const tabs: TabDefinition[] = [
  // { value: "text", label: "Text", icon: FileText },
  { value: "pdf", label: "PDF", icon: FileUp },
  { value: "image", label: "Image", icon: FileImage },
  { value: "voice", label: "Voice", icon: Mic },
  { value: "manual", label: "Manual", icon: PenSquare },
]

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
function PdfTab({ onSuccess }: { onSuccess?: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  })

  async function uploadPdf() {
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      await api.post("/ai/pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setFile(null)
      toast.success("PDF processed and commitments saved.")
      onSuccess?.()
    } catch {
      toast.error("Failed to upload PDF. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      {file ? (
        <div className="relative flex flex-col items-center gap-3 rounded-xl border-2 border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-800/40 dark:bg-emerald-950/20">
          <CheckCircle2 className="size-8 text-emerald-500" />
          <p className="font-medium text-sm">{file.name}</p>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => setFile(null)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ) : (
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
          <FileUp className="size-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Drag PDF here or click to browse</p>
        </div>
      )}
      <div className="flex justify-end">
        <Button disabled={!file || uploading} onClick={uploadPdf}>
          {uploading ? (
            <>
              <Loader2 className="size-4 animate-spin mr-1.5" />
              Uploading...
            </>
          ) : (
            "Extract from PDF"
          )}
        </Button>
      </div>
    </div>
  )
}

// ─── Tab: Image ─────────────────────────────────────────────────
function ImageTab({ onSuccess }: { onSuccess?: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const f = acceptedFiles[0]
      setFile(f)
      setPreview(URL.createObjectURL(f))
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    multiple: false,
  })

  function clearImage() {
    if (preview) URL.revokeObjectURL(preview)
    setFile(null)
    setPreview(null)
  }

  async function uploadImage() {
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      await api.post("/ai/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      clearImage()
      toast.success("Image processed and commitments saved.")
      onSuccess?.()
    } catch {
      toast.error("Failed to upload image. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      {preview && file ? (
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
              onClick={clearImage}
              disabled={uploading}
              className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
          <div className="flex justify-end">
            <Button onClick={uploadImage} disabled={uploading} className="gap-1.5">
              {uploading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Extract from Image
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  )
}

// ─── Tab: Voice ─────────────────────────────────────────────────
function VoiceTab({ onSuccess }: { onSuccess?: () => void }) {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [recording, setRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [uploading, setUploading] = useState(false)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" })
      const chunks: BlobPart[] = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" })
        setAudioBlob(blob)
        stream.getTracks().forEach((t) => t.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      setRecording(true)
      setAudioBlob(null)
    } catch {
      toast.error("Microphone access denied. Please allow microphone permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop()
      setRecording(false)
    }
  }

  const deleteRecording = () => {
    setAudioBlob(null)
  }

  const uploadVoice = async () => {
    if (!audioBlob) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", audioBlob, "recording.webm")
      await api.post("/ai/voice", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setAudioBlob(null)
      toast.success("Voice processed and commitments saved.")
      onSuccess?.()
    } catch {
      toast.error("Failed to upload voice recording. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      {/* Microphone button */}
      <motion.button
        onClick={recording ? stopRecording : startRecording}
        whileTap={{ scale: 0.9 }}
        disabled={uploading}
        className={cn(
          "relative flex size-24 items-center justify-center rounded-full transition-all",
          recording
            ? "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/30"
            : audioBlob
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
              : "bg-muted text-muted-foreground hover:bg-muted/80",
          uploading && "opacity-50 cursor-not-allowed"
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
        ) : audioBlob ? (
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Recording ready ({(audioBlob.size / 1024).toFixed(0)} KB)
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">Tap to start recording</p>
        )}
      </div>

      {/* Waveform animation while recording */}
      {recording && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 48 }}
          className="flex items-center justify-center gap-0.5 w-full max-w-[240px]"
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: [8, 32, 8, 20, 8, 40, 8] }}
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
            onClick={stopRecording}
            disabled={uploading}
            className="gap-1.5"
          >
            <StopCircle className="size-4" />
            Stop Recording
          </Button>
        )}
        {audioBlob && !recording && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={deleteRecording}
              disabled={uploading}
            >
              Delete Recording
            </Button>
            <Button
              size="sm"
              onClick={uploadVoice}
              disabled={uploading}
              className="gap-1.5"
            >
              {uploading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  Transcribe & Extract
                </>
              )}
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

function ManualTab({ onSuccess }: { onSuccess?: () => void }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [priority, setPriority] = useState("")
  const [deadline, setDeadline] = useState<Date | undefined>(undefined)
  const [duration, setDuration] = useState("")
  const [dependencies, setDependencies] = useState("")

  const isValid = title.trim().length > 0

  async function saveCommitment() {
    try {
      await api.post("/commitments", {
        title,
        description,
        category: category || "other",
        priority: priority || "medium",
        deadline: deadline ? deadline.toISOString() : null,
        estimated_duration: duration ? Number(duration) : null,
      })

      setTitle("")
      setDescription("")
      setCategory("")
      setPriority("")
      setDeadline(undefined)
      setDuration("")
      setDependencies("")

      toast.success("Commitment saved.")
      onSuccess?.()
    } catch {
      toast.error("Failed to save commitment.")
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">Title *</label>
        <Input placeholder="What do you need to do?" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">Description</label>
        <Textarea
          placeholder="Add details about this commitment..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="min-h-[80px] resize-y"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground">Category</label>
          <Select value={category} onValueChange={(v) => setCategory(v ?? "")}>
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
          <Select value={priority} onValueChange={(v) => setPriority(v ?? "")}>
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

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-foreground">Dependencies</label>
        <Input placeholder="e.g. Submit design, Review feedback" value={dependencies} onChange={(e) => setDependencies(e.target.value)} />
        <p className="text-[10px] text-muted-foreground">Comma-separated list of tasks this depends on</p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border">
        <Badge variant="outline" className="text-xs">
          {isValid ? "Ready to save" : "Title is required"}
        </Badge>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Cancel</Button>
          <Button size="sm" disabled={!isValid} className="gap-1.5" onClick={saveCommitment}>
            <CheckCircle2 className="size-4" />
            Save Commitment
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Main UploadDialog ─────────────────────────────────────────
export function UploadDialog({ open, onOpenChange, defaultTab = "text", onSuccess }: UploadDialogProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  const handleSuccess = () => {
    onSuccess?.()
    onOpenChange(false)
  }

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
            {/* <TabsContent value="text">
              <TextTab />
            </TabsContent> */}
            <TabsContent value="pdf">
              <PdfTab onSuccess={handleSuccess} />
            </TabsContent>
            <TabsContent value="image">
              <ImageTab onSuccess={handleSuccess} />
            </TabsContent>
            <TabsContent value="voice">
              <VoiceTab onSuccess={handleSuccess} />
            </TabsContent>
            <TabsContent value="manual">
              <ManualTab onSuccess={handleSuccess} />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}