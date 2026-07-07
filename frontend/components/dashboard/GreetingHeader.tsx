"use client"

import { motion } from "framer-motion"

export function GreetingHeader() {
  const now = new Date()
  const hour = now.getHours()
  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening"

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }
  const formattedDate = now.toLocaleDateString("en-US", dateOptions)

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-1"
    >
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
        {greeting}, Achyant
      </h1>
      <p className="text-sm text-muted-foreground">{formattedDate}</p>
      <p className="mt-1 text-sm text-muted-foreground/80 italic">
        &ldquo;Small steps lead to big accomplishments. Let&rsquo;s make today count.&rdquo;
      </p>
    </motion.div>
  )
}
