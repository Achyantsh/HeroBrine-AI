"use client"

import { useState, useRef, useMemo, useCallback } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import type { EventClickArg, DatesSetArg } from "@fullcalendar/core"
import { motion } from "framer-motion"
import { CalendarDays, List, Grid3x3, Clock, ListChecks } from "lucide-react"

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CommitmentCard } from "@/components/commitments/CommitmentCard"
import { EditCommitmentDialog } from "@/components/commitments/EditCommitmentDialog"
import { getCalendarEvents } from "@/lib/calendar-events"
import { useCommitments } from "@/hooks/useCommitments"
import type { Commitment } from "@/types/commitment"

type ViewType = "dayGridMonth" | "timeGridWeek" | "timeGridDay"

export default function CalendarPage() {
  const calendarRef = useRef<FullCalendar>(null)
  const { commitments, loading, refresh } = useCommitments()

  const [currentView, setCurrentView] = useState<ViewType>("dayGridMonth")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [editCommitment, setEditCommitment] = useState<Commitment | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  const events = useMemo(() => getCalendarEvents(commitments), [commitments])

  const handleEdit = useCallback((commitment: Commitment) => {
    setEditCommitment(commitment)
    setEditOpen(true)
  }, [])

  const handleEditSuccess = useCallback(() => {
    refresh()
  }, [refresh])

  const handleEventClick = (info: EventClickArg) => {
    const commitment = commitments.find((c) => c.id === info.event.id)
    if (commitment) {
      setEditCommitment(commitment)
      setEditOpen(true)
    }
  }

  const handleDatesSet = (arg: DatesSetArg) => {
    setSelectedDate(arg.view.currentStart)
  }

  const handleDateClick = (arg: { date: Date }) => {
    setSelectedDate(arg.date)
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

  // Commitments for the selected date
  const dayCommitments = useMemo(() => {
    const dayStart = new Date(selectedDate)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(dayStart)
    dayEnd.setDate(dayEnd.getDate() + 1)

    return commitments.filter((c) => {
      if (!c.deadline) return false
      const d = new Date(c.deadline)
      return d >= dayStart && d < dayEnd
    })
  }, [commitments, selectedDate])

  const formattedDate = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

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

        {/* Calendar + Day commitments grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-2 rounded-xl border border-border bg-card p-4 shadow-sm"
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
              datesSet={handleDatesSet}
              dateClick={handleDateClick}
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

          {/* Day commitments panel */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-sm font-semibold text-foreground">{formattedDate}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {dayCommitments.length} commitment{dayCommitments.length !== 1 ? "s" : ""}
              </p>
            </div>

            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            ) : dayCommitments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-dashed">
                <ListChecks className="size-8 text-muted-foreground/30 mb-2" />
                <p className="text-xs text-muted-foreground">No commitments for this day.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {dayCommitments.map((commitment, i) => (
                  <CommitmentCard
                    key={commitment.id}
                    commitment={commitment}
                    index={i}
                    onEdit={handleEdit}
                    onRefresh={refresh}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>

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

      {/* Edit dialog */}
      <EditCommitmentDialog
        commitment={editCommitment}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={handleEditSuccess}
      />
    </DashboardLayout>
  )
}