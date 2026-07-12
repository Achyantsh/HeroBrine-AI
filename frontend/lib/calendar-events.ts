import type { Commitment } from "@/types/commitment"

const priorityColors: Record<string, string> = {
  low: "#3b82f6",
  medium: "#f59e0b",
  high: "#f97316",
  critical: "#ef4444",
}

export interface CalendarEvent {
  id: string
  title: string
  start: string
  end: string
  backgroundColor: string
  borderColor: string
  textColor: string
  extendedProps: {
    priority: string
    category: string
    status: string
    description: string | null
    estimated_duration: number | null
  }
}

function computeEndTime(start: string, durationMinutes: number | null): string {
  const startDate = new Date(start)
  const mins = durationMinutes ?? 60
  const endDate = new Date(startDate.getTime() + mins * 60 * 1000)
  return endDate.toISOString()
}

function commitmentToEvent(c: Commitment): CalendarEvent {
  const color = priorityColors[c.priority] || "#6b7280"

  return {
    id: c.id,
    title: c.title,
    start: c.deadline ?? new Date().toISOString(),
    end: computeEndTime(c.deadline ?? new Date().toISOString(), c.estimated_duration),
    backgroundColor: color,
    borderColor: color,
    textColor: "#ffffff",
    extendedProps: {
      priority: c.priority,
      category: c.category,
      status: c.status,
      description: c.description,
      estimated_duration: c.estimated_duration,
    },
  }
}

export function getCalendarEvents(commitments: Commitment[]): CalendarEvent[] {
  return commitments.filter((c) => c.deadline).map(commitmentToEvent)
}