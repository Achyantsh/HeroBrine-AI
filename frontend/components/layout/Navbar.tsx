"use client"

import { Search, Bell, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

// import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { UserMenu } from "@/components/auth/UserMenu"
import { useNotifications } from "@/hooks/useNotifications"
import type { Notification } from "@/hooks/useNotifications"

interface NavbarProps {
  className?: string
}

function NotificationItem({
  notification,
}: {
  notification: Notification
}) {
  return (
    <div className="flex items-start gap-3 px-2 py-2 text-sm">
      <span className="mt-0.5 text-base leading-none">
        {notification.icon}
      </span>

      <span className="text-foreground">
        {notification.message}
      </span>
    </div>
  )
}

export function Navbar({ className }: NavbarProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const { notifications, unreadCount, setOpened } = useNotifications()

  const isDarkMode = resolvedTheme === "dark"

  function handleThemeToggle() {
    setTheme(isDarkMode ? "light" : "dark")
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-border bg-background px-4 md:px-6",
        className
      )}
    >
      {/* Left: Logo visible on mobile */}
      <div className="flex items-center gap-3 md:hidden">
        <span className="text-lg font-bold tracking-tight text-foreground">
          HeroBrine AI
        </span>
      </div>

      {/* Spacer for desktop */}
      <div className="hidden md:block" />

      {/* Center: Global commitment search */}
      {/* <div className="mx-auto flex max-w-md flex-1 items-center justify-center">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            type="search"
            placeholder="Search commitments..."
            className="h-9 w-full pl-9 text-sm"
            aria-label="Search commitments"
          />
        </div>
      </div> */}

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        <Tooltip>
          <TooltipTrigger>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleThemeToggle}
              aria-label={
                isDarkMode
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {isDarkMode ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </Button>
          </TooltipTrigger>

          <TooltipContent>
            {isDarkMode ? "Light mode" : "Dark mode"}
          </TooltipContent>
        </Tooltip>

        {/* Notifications */}
        <DropdownMenu
          onOpenChange={(open) => {
            if (open) {
              setOpened(true)
            }
          }}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Notifications"
                  className="relative"
                >
                  <Bell className="size-4" />

                  {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>

            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>

          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>
              Notifications
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {notifications.length === 0 ? (
              <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                No notifications.
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                  />
                ))}
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <UserMenu />
      </div>
    </header>
  )
}