// ─── Commitments per Week ──────────────────────────────────────
export interface WeeklyData {
  week: string
  created: number
  completed: number
}

export const weeklyData: WeeklyData[] = [
  { week: "Week 1", created: 8, completed: 6 },
  { week: "Week 2", created: 12, completed: 9 },
  { week: "Week 3", created: 7, completed: 5 },
  { week: "Week 4", created: 14, completed: 11 },
  { week: "Week 5", created: 10, completed: 8 },
  { week: "Week 6", created: 9, completed: 7 },
]

// ─── Priority Distribution ────────────────────────────────────
export interface PriorityData {
  name: string
  value: number
  color: string
}

export const priorityDistribution: PriorityData[] = [
  { name: "Critical", value: 4, color: "#ef4444" },
  { name: "High", value: 8, color: "#f97316" },
  { name: "Medium", value: 12, color: "#f59e0b" },
  { name: "Low", value: 6, color: "#3b82f6" },
]

// ─── Completion Trend (daily last 2 weeks) ─────────────────────
export interface TrendData {
  date: string
  completed: number
  created: number
}

export const completionTrend: TrendData[] = [
  { date: "Jul 1", completed: 2, created: 3 },
  { date: "Jul 2", completed: 1, created: 2 },
  { date: "Jul 3", completed: 3, created: 1 },
  { date: "Jul 4", completed: 0, created: 2 },
  { date: "Jul 5", completed: 4, created: 3 },
  { date: "Jul 6", completed: 2, created: 4 },
  { date: "Jul 7", completed: 3, created: 2 },
  { date: "Jul 8", completed: 5, created: 1 },
  { date: "Jul 9", completed: 1, created: 3 },
  { date: "Jul 10", completed: 3, created: 2 },
  { date: "Jul 11", completed: 2, created: 4 },
  { date: "Jul 12", completed: 4, created: 2 },
  { date: "Jul 13", completed: 1, created: 3 },
  { date: "Jul 14", completed: 3, created: 2 },
]

// ─── Categories ──────────────────────────────────────────────
export interface CategoryData {
  name: string
  count: number
  color: string
}

export const categoryDistribution: CategoryData[] = [
  { name: "Assignment", count: 6, color: "#8b5cf6" },
  { name: "Meeting", count: 5, color: "#06b6d4" },
  { name: "Project", count: 4, color: "#6366f1" },
  { name: "Exam", count: 3, color: "#ec4899" },
  { name: "Health", count: 3, color: "#22c55e" },
  { name: "Bill", count: 2, color: "#f43f5e" },
  { name: "Personal", count: 2, color: "#14b8a6" },
  { name: "Interview", count: 1, color: "#a855f7" },
  { name: "Event", count: 1, color: "#eab308" },
  { name: "Other", count: 3, color: "#6b7280" },
]

// ─── Weekly Summary ──────────────────────────────────────────
export const weeklySummary = {
  completed: 7,
  pending: 5,
  overdue: 2,
  highPriority: 3,
}

// ─── AI Recommendations ──────────────────────────────────────
export interface AIRecommendation {
  id: string
  text: string
  type: "insight" | "tip" | "pattern" | "suggestion"
}

export const aiRecommendations: AIRecommendation[] = [
  {
    id: "r1",
    text: "You complete most work on Tuesdays. Schedule important deadlines then.",
    type: "pattern",
  },
  {
    id: "r2",
    text: "Morning productivity is highest — 73% of your completions happen before 12 PM.",
    type: "insight",
  },
  {
    id: "r3",
    text: "Consider spreading deadlines more evenly. You have 3 commitments due tomorrow.",
    type: "suggestion",
  },
  {
    id: "r4",
    text: "Your completion rate dropped 12% this week. Try breaking tasks into smaller steps.",
    type: "tip",
  },
]