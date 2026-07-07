"use client"

import { useState, useRef } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import type { EventClickArg } from "@fullcalendar/core"
import { motion } from "framer-motion"
import { CalendarDays, List, Grid3x3, Clock } from "lucide-react"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { getCalendarEvents } from "@/lib/calendar-events"
import { todayCommitments, upcomingCommitments, type Commitment } from "@/lib/mock-data"
import { CommitmentDetailsSheet } from "@/components/commitments/CommitmentDetailsSheet"

type ViewType = "dayGridMonth" | "timeGridWeek" | "timeGridDay"

export default function CalendarPage() {
  const calendarRef = useRef<FullCalendar>(null)
  const [selectedCommitment, setSelectedCommitment] = useState<Commitment | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [currentView, setCurrentView] = useState<ViewType>("dayGridMonth")

  const events = getCalendarEvents()

  const allCommitments: Commitment[] = [...todayCommitments, ...upcomingCommitments]

  const handleEventClick = (info: EventClickArg) => {
    const commitment = allCommitments.find((c) => c.id === info.event.id)
    if (commitment) {
      setSelectedCommitment(commitment)
      setSheetOpen(true)
    }
  }

  const changeView = (view: ViewType) => {
    setCurrentView(view)
    const api = calendarRef.current?.getApi()
    if (api) {
      api.changeView(view)
    }
  }

  const viewButtons = [
    { view: "dayGridMonth" as ViewType, icon: Grid3x3, label: "Month" },
    { view: "timeGridWeek" as ViewType, icon: List, label: "Week" },
    { view: "timeGridDay" as ViewType, icon: Clock, label: "Day" },
  ]

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarDays className="size-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Calendar</h1>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-border p-0.5 bg-muted/30">
            {viewButtons.map(({ view, icon: Icon, label }) => (
              <Button
                key={view}
                variant={currentView === view ? "default" : "ghost"}
                size="sm"
                onClick={() => changeView(view)}
                className="h-7 gap-1.5 text-xs"
              >
                <Icon className="size-3.5" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-4 shadow-sm"
        >
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
            events={events}
            eventClick={handleEventClick}
            height="auto"
            contentHeight="auto"
            aspectRatio={1.8}
            firstDay={1}
            buttonText={{
              today: "Today",
              month: "Month",
              week: "Week",
              day: "Day",
            }}
            eventTimeFormat={{
              hour: "numeric",
              minute: "2-digit",
              meridiem: "short",
            }}
          />
        </motion.div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#3b82f6]" />
            Low
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#f59e0b]" />
            Medium
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#f97316]" />
            High
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ef4444]" />
            Critical
          </span>
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