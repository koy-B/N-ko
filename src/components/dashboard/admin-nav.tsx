"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Users,
  Recycle,
  Factory,
  Package,
  ShoppingBag,
  Wallet,
  Leaf,
  HelpCircle,
  Bell,
  Warehouse,
  Newspaper,
} from "lucide-react"

const navItems = [
  { href: "/dashboard/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/dashboard/admin/users", label: "Utilisateurs", icon: Users },
  { href: "/dashboard/admin/collections", label: "Collectes", icon: Recycle },
  { href: "/dashboard/admin/production", label: "Production", icon: Factory },
  { href: "/dashboard/admin/stock", label: "Stocks plastique", icon: Warehouse },
  { href: "/dashboard/admin/products", label: "Produits", icon: Package },
  { href: "/dashboard/admin/orders", label: "Commandes", icon: ShoppingBag },
  { href: "/dashboard/admin/finances", label: "Finances", icon: Wallet },
  { href: "/dashboard/admin/impact", label: "Impact environnemental", icon: Leaf },
  { href: "/dashboard/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/dashboard/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/dashboard/admin/notifications", label: "Notifications", icon: Bell },
]

export function AdminNav({ onNavClick, notifCount = 5 }: { onNavClick?: () => void; notifCount?: number }) {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === "/dashboard/admin") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = item.icon
        const active = isActive(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavClick}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="truncate">{item.label}</span>
            {item.label === "Notifications" && notifCount > 0 && (
              <Badge variant="default" className="ml-auto size-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                {notifCount}
              </Badge>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
