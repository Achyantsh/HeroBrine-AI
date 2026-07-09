"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Sparkles, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { aiService } from "@/services/aiService"

interface AICommandCenterProps {
  onSuccess?: () => void
}

export function AICommandCenter({ onSuccess }: AICommandCenterProps) {
  const [input, setInput] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    const text = input.trim()
    if (!text || submitting) return

    setSubmitting(true)
    try {
      await aiService.extractText(text)
      setInput("")
      toast.success("Commitments extracted and saved.")
      onSuccess?.()
    } catch {
      toast.error("Wait.....")
    } finally {
      setSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
      className="relative w-full max-w-2xl mx-auto"
    >
      {/* Glow effect behind the input */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-2xl blur-xl opacity-60" />

      <div className="relative flex items-center gap-2 bg-card border border-border/60 shadow-lg shadow-primary/5 rounded-xl px-4 py-3 backdrop-blur-sm">
        <Sparkles className="size-5 text-primary shrink-0" />
        <Input
          type="text"
          placeholder="What would you like HeroBrine AI to remember?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={submitting}
          className="border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-sm placeholder:text-muted-foreground/60 h-auto flex-1 disabled:opacity-50"
        />
        <Button
          size="icon-sm"
          aria-label="Send"
          disabled={!input.trim() || submitting}
          onClick={handleSubmit}
        >
          {submitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </div>
    </motion.div>
  )
}