import type { Commitment } from "@/types/commitment"

export type AnalyticsData = {
  total: number
  completed: number
  pending: number
  inProgress: number
  cancelled: number
  overdue: number
  todayCount: number
  upcomingThisWeek: number
  completionRate: number
  averageConfidence: number
  highPriorityCount: number
  categoryDistribution: { name: string; count: number; color: string }[]
  priorityDistribution: { name: string; value: number; color: string }[]
  statusDistribution: { name: string; value: number }[]
  weeklyData: { week: string; created: number; completed: number }[]
  insights: string[]
}

const categoryColors: Record<string, string> = {
  work: "#8b5cf6",
  personal: "#14b8a6",
  health: "#22c55e",
  finance: "#f43f5e",
  study: "#ec4899",
  shopping: "#f59e0b",
  other: "#6b7280",
}

const categoryLabels: Record<string, string> = {
  work: "Work",
  personal: "Personal",
  health: "Health",
  finance: "Finance",
  study: "Study",
  shopping: "Shopping",
  other: "Other",
}

const priorityLabels: Record<string, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
}

const priorityColors: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#f59e0b",
  low: "#3b82f6",
}

function startOfDay(date: Date): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function getWeekKey(date: Date, startOfWeek: Date): string {
  const diff = date.getTime() - startOfWeek.getTime()
  const weekNum = Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1
  return `Week ${weekNum}`
}

export function computeAnalytics(commitments: Commitment[]): AnalyticsData {
  const now = new Date()
  const todayStart = startOfDay(now)
  const weekEnd = new Date(todayStart)
  weekEnd.setDate(weekEnd.getDate() + 7)

  // Find the oldest created_at to build weekly buckets from the start
  const sortedByDate = [...commitments].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )
  const firstDate =
    sortedByDate.length > 0
      ? startOfDay(new Date(sortedByDate[0].created_at))
      : todayStart

  // Align firstDate to Monday
  const dayOfWeek = firstDate.getDay() || 7
  const weekStart = new Date(firstDate)
  weekStart.setDate(weekStart.getDate() - (dayOfWeek - 1))

  // Build weekly buckets
  const weeklyMap = new Map<string, { created: number; completed: number }>()
  for (let d = new Date(weekStart); d <= now; d.setDate(d.getDate() + 7)) {
    const ws = new Date(weekStart)
    const diffDays = Math.floor((d.getTime() - weekStart.getTime()) / (24 * 60 * 60 * 1000))
    const currentWeekStart = new Date(weekStart)
    currentWeekStart.setDate(currentWeekStart.getDate() + Math.floor(diffDays / 7) * 7)
    const key = getWeekKey(currentWeekStart, weekStart)
    if (!weeklyMap.has(key)) {
      weeklyMap.set(key, { created: 0, completed: 0 })
    }
  }

  // Totals
  const completed = commitments.filter((c) => c.status === "completed").length
  const pending = commitments.filter((c) => c.status === "pending").length
  const inProgress = commitments.filter((c) => c.status === "in_progress").length
  const cancelled = commitments.filter((c) => c.status === "cancelled").length
  const overdue = commitments.filter(
    (c) => c.deadline && new Date(c.deadline) < now && c.status !== "completed"
  ).length
  const todayCount = commitments.filter((c) => {
    if (!c.deadline) return false
    return startOfDay(new Date(c.deadline)).getTime() === todayStart.getTime()
  }).length
  const upcomingThisWeek = commitments.filter((c) => {
    if (!c.deadline) return false
    const d = new Date(c.deadline)
    return d >= now && d < weekEnd
  }).length

  const completionRate = commitments.length > 0 ? Math.round((completed / commitments.length) * 100) : 0
  const confidences = commitments.filter((c) => c.ai_confidence != null).map((c) => c.ai_confidence!)
  const averageConfidence =
    confidences.length > 0 ? Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length) : 0
  const highPriorityCount = commitments.filter(
    (c) => c.priority === "high" || c.priority === "critical"
  ).length

  // Status distribution
  const statusDistribution = [
    { name: "Pending", value: pending },
    { name: "In Progress", value: inProgress },
    { name: "Completed", value: completed },
    { name: "Cancelled", value: cancelled },
  ]

  // Priority distribution
  const priorityMap = new Map<string, number>()
  commitments.forEach((c) => {
    priorityMap.set(c.priority, (priorityMap.get(c.priority) || 0) + 1)
  })
  const priorityDistribution = Array.from(priorityMap.entries())
    .map(([key, value]) => ({
      name: priorityLabels[key] || key,
      value,
      color: priorityColors[key] || "#6b7280",
    }))
    .sort((a, b) => {
      const order = ["critical", "high", "medium", "low"]
      return order.indexOf(a.name.toLowerCase()) - order.indexOf(b.name.toLowerCase())
    })

  // Category distribution
  const categoryMap = new Map<string, number>()
  commitments.forEach((c) => {
    categoryMap.set(c.category, (categoryMap.get(c.category) || 0) + 1)
  })
  const categoryDistribution = Array.from(categoryMap.entries())
    .map(([key, count]) => ({
      name: categoryLabels[key] || key,
      count,
      color: categoryColors[key] || "#6b7280",
    }))
    .sort((a, b) => b.count - a.count)

  // Weekly data
  const weeklyBuckets = new Map<string, { created: number; completed: number }>()
  commitments.forEach((c) => {
    const created = new Date(c.created_at)
    const ws = new Date(weekStart)
    const diffDays = Math.floor((created.getTime() - weekStart.getTime()) / (24 * 60 * 60 * 1000))
    const bucketStart = new Date(weekStart)
    bucketStart.setDate(bucketStart.getDate() + Math.floor(diffDays / 7) * 7)
    const key = getWeekKey(bucketStart, weekStart)
    if (!weeklyBuckets.has(key)) weeklyBuckets.set(key, { created: 0, completed: 0 })
    const bucket = weeklyBuckets.get(key)!
    bucket.created += 1
    if (c.status === "completed") bucket.completed += 1
  })
  const weeklyData = Array.from(weeklyBuckets.entries())
    .map(([week, data]) => ({ week, ...data }))
    .sort((a, b) => a.week.localeCompare(b.week))

  // Insights
  const insights: string[] = []
  if (commitments.length === 0) {
    insights.push("You're all caught up 🎉")
  } else {
    insights.push(`You have ${pending} pending commitment${pending !== 1 ? "s" : ""}.`)
    if (highPriorityCount > 0) {
      insights.push(`${highPriorityCount} are high priority.`)
    }
    if (todayCount > 0) {
      insights.push(`${todayCount} deadline${todayCount !== 1 ? "s" : ""} today.`)
    }
    if (upcomingThisWeek > 0) {
      insights.push(`${upcomingThisWeek} due this week.`)
    }
    insights.push(`Overall completion rate is ${completionRate}%.`)
    if (averageConfidence > 0) {
      insights.push(`Average AI confidence is ${averageConfidence}%.`)
    }
    if (overdue > 0) {
      insights.unshift(`⚠️ You have ${overdue} overdue commitment${overdue !== 1 ? "s" : ""}.`)
    }
    if (completionRate > 80 && commitments.length > 0) {
      insights.push("Excellent progress this week.")
    }
    if (highPriorityCount >= 3) {
      insights.push("Focus on your high priority commitments first.")
    }
  }

  return {
    total: commitments.length,
    completed,
    pending,
    inProgress,
    cancelled,
    overdue,
    todayCount,
    upcomingThisWeek,
    completionRate,
    averageConfidence,
    highPriorityCount,
    categoryDistribution,
    priorityDistribution,
    statusDistribution,
    weeklyData,
    insights: insights.slice(0, 5),
  }
}