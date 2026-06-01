"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ClipboardCheck,
  Wallet,
  Bell,
} from "lucide-react"

const navItems = [
  { href: "/dashboard/collector", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/dashboard/collector/missions", label: "Missions", icon: ClipboardCheck },
  { href: "/dashboard/collector/earnings", label: "Revenus", icon: Wallet },
  { href: "/dashboard/collector/notifications", label: "Notifications", icon: Bell },
]

export function CollectorNav({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard/collector" &&
            pathname.startsWith(item.href) &&
            item.href.split("/").length > 3)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavClick}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4 shrink-0" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
