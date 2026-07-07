"use client"

import { Sidebar } from "@/components/layout/Sidebar"
import { Navbar } from "@/components/layout/Navbar"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  className?: string
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-1 flex-col min-w-0">
        <Navbar />

        {/* Page content */}
        <main
          className={cn(
            "flex-1 overflow-y-auto bg-background p-4 md:p-6",
            className
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}