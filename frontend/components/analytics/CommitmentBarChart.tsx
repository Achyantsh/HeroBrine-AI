"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { motion } from "framer-motion"
import type { AnalyticsData } from "@/lib/analytics"

interface CommitmentBarChartProps {
  analytics: AnalyticsData | null
  loading: boolean
}

export function CommitmentBarChart({ analytics, loading }: CommitmentBarChartProps) {
  const data = analytics?.weeklyData ?? []

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="rounded-xl border border-border bg-card p-4 md:p-5"
    >
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Commitments per Week
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              axisLine={{ stroke: "hsl(var(--border))" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "13px",
                color: "hsl(var(--popover-foreground))",
              }}
              cursor={{ fill: "transparent" }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
            />
            <Bar
              dataKey="created"
              name="Created"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
            <Bar
              dataKey="completed"
              name="Completed"
              fill="hsl(var(--chart-2))"
              radius={[4, 4, 0, 0]}
              maxBarSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}