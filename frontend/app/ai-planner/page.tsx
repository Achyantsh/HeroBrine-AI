"use client"

import { BrainCircuit, Sparkles, Clock } from "lucide-react"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Badge } from "@/components/ui/badge"

export default function AIPlannerPage() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl py-8">
        <div className="flex items-center gap-3 mb-8">
          <BrainCircuit className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              AI Planner
            </h1>
            <p className="text-muted-foreground mt-1">
              Intelligent planning and scheduling powered by AI.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-10 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Sparkles className="h-10 w-10 text-primary" />
          </div>

          <Badge variant="secondary" className="mb-5">
            Coming Soon
          </Badge>

          <h2 className="text-2xl font-semibold mb-3">
            AI Planner is under development
          </h2>

          <p className="mx-auto max-w-2xl text-muted-foreground leading-7">
            The AI Planner will be introduced in a future version of HeroBrine AI.
            It will intelligently organize your commitments, prioritize tasks,
            optimize schedules, detect conflicts, recommend the best time to
            complete work, and help you stay productive with personalized AI-driven
            planning.
          </p>

          <div className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Available in a future release.
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}