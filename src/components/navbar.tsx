"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, User, ChevronDown, LogOut, LayoutDashboard, Recycle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Comment ça marche", href: "/#how-it-works" },
  { label: "Impact", href: "/#impact" },
  { label: "Produits", href: "/shop" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
]

export function Navbar() {
  const { data: session, status } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-xs"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Néko" className="h-9 w-auto" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {status === "loading" ? (
            <div className="size-8 animate-pulse rounded-full bg-muted" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {session.user?.name?.[0] ?? <User className="size-4" />}
                </div>
                <span className="hidden lg:inline">{session.user?.name ?? "Utilisateur"}</span>
                <ChevronDown className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/dashboard" />}>
                  <LayoutDashboard className="size-4" />
                  Tableau de bord
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/profile" />}>
                  <User className="size-4" />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
                  <LogOut className="size-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" size="sm" render={<Link href="/login?role=client" />}>
                <User className="size-4" />
                Espace Client
              </Button>
              <Button size="sm" render={<Link href="/login?role=collector" />}>
                <Recycle className="size-4" />
                Espace Collecteur
              </Button>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted md:hidden"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
            className="overflow-hidden border-t bg-white/95 backdrop-blur-xl md:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t pt-3">
                {session ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2">
                      <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-medium">
                        {session.user?.name?.[0] ?? "U"}
                      </div>
                      <span className="text-sm font-medium">{session.user?.name ?? "Utilisateur"}</span>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <LayoutDashboard className="size-4" />
                      Tableau de bord
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="size-4" />
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" render={<Link href="/login?role=client" />} className="w-full justify-start">
                      <User className="size-4" />
                      Espace Client
                    </Button>
                    <Button size="sm" render={<Link href="/login?role=collector" />} className="w-full justify-start">
                      <Recycle className="size-4" />
                      Espace Collecteur
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
