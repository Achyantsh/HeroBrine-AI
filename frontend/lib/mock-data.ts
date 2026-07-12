export type Priority = "low" | "medium" | "high" | "critical"
export type Category =
  | "assignment"
  | "exam"
  | "interview"
  | "meeting"
  | "project"
  | "bill"
  | "health"
  | "personal"
  | "event"
  | "other"
export type Status = "pending" | "in_progress" | "completed" | "missed" | "cancelled"

export interface Commitment {
  id: string
  title: string
  description: string | null
  category: Category
  priority: Priority
  status: Status
  deadline: string
  estimated_duration: number | null
  ai_confidence: number | null
  is_ai_generated: boolean
  created_at: string
  updated_at: string
}

export const todayCommitments: Commitment[] = [
  {
    id: "1",
    title: "Submit Physics Assignment",
    description: "Chapter 4: Thermodynamics problem set",
    category: "assignment",
    priority: "high",
    status: "pending",
    deadline: "2026-07-07T23:59:00",
    estimated_duration: 120,
    ai_confidence: 0.95,
    is_ai_generated: true,
    created_at: "2026-07-05T10:00:00",
    updated_at: "2026-07-05T10:00:00",
  },
  {
    id: "2",
    title: "Team Standup Meeting",
    description: "Daily sync with the design team",
    category: "meeting",
    priority: "medium",
    status: "pending",
    deadline: "2026-07-07T10:00:00",
    estimated_duration: 30,
    ai_confidence: 0.88,
    is_ai_generated: true,
    created_at: "2026-07-06T08:00:00",
    updated_at: "2026-07-06T08:00:00",
  },
  {
    id: "3",
    title: "Review PR #142",
    description: "Code review for authentication module",
    category: "project",
    priority: "high",
    status: "in_progress",
    deadline: "2026-07-07T18:00:00",
    estimated_duration: 60,
    ai_confidence: null,
    is_ai_generated: false,
    created_at: "2026-07-06T14:00:00",
    updated_at: "2026-07-06T14:00:00",
  },
  {
    id: "4",
    title: "Pay Internet Bill",
    description: "Monthly ISP payment due",
    category: "bill",
    priority: "critical",
    status: "pending",
    deadline: "2026-07-07T20:00:00",
    estimated_duration: 10,
    ai_confidence: 0.92,
    is_ai_generated: true,
    created_at: "2026-07-01T09:00:00",
    updated_at: "2026-07-01T09:00:00",
  },
]

export const upcomingCommitments: Commitment[] = [
  {
    id: "5",
    title: "Machine Learning Midterm",
    description: "Covers neural networks and deep learning",
    category: "exam",
    priority: "critical",
    status: "pending",
    deadline: "2026-07-10T09:00:00",
    estimated_duration: 180,
    ai_confidence: 0.97,
    is_ai_generated: true,
    created_at: "2026-07-03T12:00:00",
    updated_at: "2026-07-03T12:00:00",
  },
  {
    id: "6",
    title: "Dentist Appointment",
    description: "Regular checkup at Dr. Smith's clinic",
    category: "health",
    priority: "medium",
    status: "pending",
    deadline: "2026-07-11T11:00:00",
    estimated_duration: 60,
    ai_confidence: 0.85,
    is_ai_generated: true,
    created_at: "2026-07-02T16:00:00",
    updated_at: "2026-07-02T16:00:00",
  },
  {
    id: "7",
    title: "Prepare Project Presentation",
    description: "Quarterly review slides for stakeholders",
    category: "project",
    priority: "high",
    status: "pending",
    deadline: "2026-07-12T15:00:00",
    estimated_duration: 240,
    ai_confidence: null,
    is_ai_generated: false,
    created_at: "2026-07-04T10:00:00",
    updated_at: "2026-07-04T10:00:00",
  },
  {
    id: "8",
    title: "Interview with Candidate",
    description: "Senior frontend engineer position",
    category: "interview",
    priority: "high",
    status: "pending",
    deadline: "2026-07-13T14:00:00",
    estimated_duration: 60,
    ai_confidence: 0.91,
    is_ai_generated: true,
    created_at: "2026-07-06T09:00:00",
    updated_at: "2026-07-06T09:00:00",
  },
  {
    id: "9",
    title: "Gym Session",
    description: "Weekly strength training",
    category: "health",
    priority: "low",
    status: "pending",
    deadline: "2026-07-08T07:00:00",
    estimated_duration: 45,
    ai_confidence: 0.75,
    is_ai_generated: true,
    created_at: "2026-07-01T06:00:00",
    updated_at: "2026-07-01T06:00:00",
  },
  {
    id: "10",
    title: "Buy Birthday Gift",
    description: "Find something for Mom's birthday",
    category: "personal",
    priority: "medium",
    status: "pending",
    deadline: "2026-07-14T12:00:00",
    estimated_duration: 60,
    ai_confidence: 0.8,
    is_ai_generated: true,
    created_at: "2026-07-05T18:00:00",
    updated_at: "2026-07-05T18:00:00",
  },
]

export const aiInsights = [
  {
    id: "i1",
    text: "You have 3 deadlines tomorrow. Consider starting early.",
    type: "warning" as const,
  },
  {
    id: "i2",
    text: "Schedule Project work before 5 PM — your focus peaks in the afternoon.",
    type: "suggestion" as const,
  },
  {
    id: "i3",
    text: "Your workload is increasing. 2 high-priority items added this week.",
    type: "info" as const,
  },
  {
    id: "i4",
    text: "You completed 4 commitments this week. Great progress!",
    type: "success" as const,
  },
]

export const summaryStats = {
  total: 10,
  completed: 4,
  pending: 5,
  highPriority: 3,
}