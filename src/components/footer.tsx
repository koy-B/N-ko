"use client"

import Link from "next/link"
import { Mail, MapPin, Phone, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const quickLinks = [
  { label: "Accueil", href: "/" },
  { label: "Comment ça marche", href: "/#how-it-works" },
  { label: "Impact", href: "/#impact" },
  { label: "Produits", href: "/shop" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
]

const legalLinks = [
  { label: "Mentions légales", href: "/legal" },
  { label: "Politique de confidentialité", href: "/privacy" },
  { label: "CGU", href: "/terms" },
]

const contactDetails = [
  { icon: MapPin, text: "Abidjan, Côte d'Ivoire" },
  { icon: Phone, text: "+225 01 23 45 67 89" },
  { icon: Mail, text: "contact@nekogreen.ci" },
]

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Néko" className="h-9 w-auto" />
            </Link>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Néko transforme les déchets plastiques en pavés écologiques. Rejoignez le
              mouvement pour un avenir plus durable.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Liens rapides</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Contact</h3>
            <ul className="space-y-3">
              {contactDetails.map((detail) => {
                const Icon = detail.icon
                return (
                  <li key={detail.text} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Icon className="size-4 shrink-0 text-primary" />
                    {detail.text}
                  </li>
                )
              })}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-foreground">Newsletter</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Recevez nos dernières actualités et offres.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-2"
            >
              <Input
                type="email"
                placeholder="votre@email.com"
                className="h-9"
                required
              />
              <Button type="submit" size="icon" className="shrink-0">
                <ArrowRight className="size-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t py-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Néko. Tous droits réservés.
          </p>
          <div className="flex gap-4">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
