"use client"

import { motion } from "framer-motion"
import { FileImage, Mic, PenSquare, FileUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuickAction {
  title: string
  description: string
  icon: React.ElementType
  tab: string
  color: string
  bgColor: string
  darkBgColor: string
}

const actions: QuickAction[] = [
  {
    title: "PDF",
    description: "Upload a document to analyze",
    icon: FileUp,
    tab: "pdf",
    color: "text-red-600",
    bgColor: "bg-red-50",
    darkBgColor: "dark:bg-red-950/40",
  },
  {
    title: "Image",
    description: "OCR from screenshots or photos",
    icon: FileImage,
    tab: "image",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    darkBgColor: "dark:bg-emerald-950/40",
  },
  {
    title: "Voice",
    description: "Transcribe and extract tasks",
    icon: Mic,
    tab: "voice",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    darkBgColor: "dark:bg-purple-950/40",
  },
  {
    title: "Manual Add",
    description: "Create a commitment manually",
    icon: PenSquare,
    tab: "manual",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    darkBgColor: "dark:bg-amber-950/40",
  },
]

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as const } },
}

interface QuickActionsGridProps {
  onAction?: (tab: string) => void
}

export function QuickActionsGrid({ onAction }: QuickActionsGridProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-foreground tracking-wide uppercase">
        Quick Actions
      </h2>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <motion.button
              key={action.title}
              variants={item}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAction?.(action.tab)}
              className={cn(
                "flex flex-col items-center gap-2.5 rounded-xl border border-border/50 p-4 text-left transition-colors cursor-pointer",
                "bg-card hover:border-border hover:shadow-md",
                "backdrop-blur-sm"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center size-10 rounded-lg",
                  action.color,
                  action.bgColor,
                  action.darkBgColor
                )}
              >
                <Icon className="size-5" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  {action.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
                  {action.description}
                </p>
              </div>
            </motion.button>
          )
        })}
      </motion.div>
    </div>
  )
}