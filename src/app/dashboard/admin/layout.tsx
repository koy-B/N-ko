"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  Users,
  Recycle,
  Factory,
  Package,
  ShoppingBag,
  Wallet,
  Leaf,
  FileText,
  HelpCircle,
  Bell,
  Menu,
  LogOut,
  User,
  Settings,
  ChevronDown,
  Warehouse,
  Newspaper,
} from "lucide-react"

const sidebarLinks = [
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

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifCount] = useState(5)

  const user = session?.user
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "A"

  function isActive(href: string) {
    if (href === "/dashboard/admin") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
    return (
      <nav className="flex flex-col gap-1">
        {sidebarLinks.map((item) => {
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

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-1 border-r bg-card">
          <div className="flex items-center px-6 h-14 border-b">
            <img src="/logo.png" alt="Néko" className="h-7 w-auto" />
          </div>
          <ScrollArea className="flex-1 px-3 py-4">
            <SidebarContent />
          </ScrollArea>
        </div>
      </aside>

      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger render={<Button variant="ghost" size="icon" className="fixed top-3 left-3 z-40 lg:hidden" />}>
          <Menu className="size-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center px-6 h-14 border-b">
              <img src="/logo.png" alt="Néko" className="h-7 w-auto" />
            </div>
            <ScrollArea className="flex-1 px-3 py-4">
              <SidebarContent onNavClick={() => setSidebarOpen(false)} />
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 lg:px-6 border-b bg-background/95 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="size-5" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/dashboard/admin/notifications">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="size-4" />
                {notifCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center size-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                    {notifCount}
                  </span>
                )}
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" className="flex items-center gap-2 h-8 px-2">
                  <Avatar size="sm">
                    {user?.image && <AvatarImage src={user.image} />}
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm font-medium max-w-[120px] truncate">
                    {user?.name || "Administrateur"}
                  </span>
                  <ChevronDown className="size-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuGroup>
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user?.name || "Administrateur"}</span>
                      <span className="text-xs text-muted-foreground">{user?.email || ""}</span>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="size-4" />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="size-4" />
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="size-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
