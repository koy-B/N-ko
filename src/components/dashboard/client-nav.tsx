"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Recycle,
  PlusCircle,
  ShoppingBag,
  Package,
  Award,
  Bell,
} from "lucide-react"

const navItems = [
  { href: "/dashboard/client", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/dashboard/client/collections", label: "Mes collectes", icon: Recycle },
  { href: "/dashboard/client/collections/new", label: "Nouvelle demande", icon: PlusCircle },
  { href: "/dashboard/client/shop", label: "Boutique", icon: ShoppingBag },
  { href: "/dashboard/client/orders", label: "Mes commandes", icon: Package },
  { href: "/dashboard/client/loyalty", label: "Programme fidélité", icon: Award },
  { href: "/dashboard/client/notifications", label: "Notifications", icon: Bell },
]

export function ClientNav({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard/client" &&
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
