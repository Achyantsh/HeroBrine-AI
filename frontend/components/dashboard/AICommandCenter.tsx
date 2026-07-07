"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Paperclip, Mic, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function AICommandCenter() {
  const [input, setInput] = useState("")

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
          className="border-none bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-sm placeholder:text-muted-foreground/60 h-auto flex-1"
        />
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon-sm" aria-label="Attach file">
            <Paperclip className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Voice input">
            <Mic className="size-4" />
          </Button>
          <Button
            size="icon-sm"
            aria-label="Send"
            disabled={!input.trim()}
          >
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}