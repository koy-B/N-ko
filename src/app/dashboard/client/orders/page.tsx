"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Package, ShoppingBag, CreditCard, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn, formatDate, formatPrice } from "@/lib/utils"

const orders = [
  {
    id: "CMD-001",
    date: new Date("2026-05-25"),
    products: "Pavé écologique x10, Briquette x5",
    total: 15000,
    status: "DELIVERED",
    payment: "PAID",
  },
  {
    id: "CMD-002",
    date: new Date("2026-05-20"),
    products: "Pavé écologique x5",
    total: 7500,
    status: "SHIPPED",
    payment: "PAID",
  },
  {
    id: "CMD-003",
    date: new Date("2026-05-15"),
    products: "Briquette x20, Pavé décoratif x4",
    total: 22000,
    status: "PROCESSING",
    payment: "PENDING",
  },
  {
    id: "CMD-004",
    date: new Date("2026-05-10"),
    products: "Pavé écologique x8",
    total: 12000,
    status: "PENDING",
    payment: "PENDING",
  },
  {
    id: "CMD-005",
    date: new Date("2026-05-05"),
    products: "Briquette x10",
    total: 8000,
    status: "CANCELLED",
    payment: "REFUNDED",
  },
]

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  PROCESSING: "En cours",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
}

const paymentLabels: Record<string, string> = {
  PENDING: "En attente",
  PAID: "Payé",
  REFUNDED: "Remboursé",
  FAILED: "Échoué",
}

const statusBadgeColors: Record<string, "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"> = {
  PENDING: "outline",
  PROCESSING: "secondary",
  SHIPPED: "default",
  DELIVERED: "default",
  CANCELLED: "destructive",
}

const paymentBadgeColors: Record<string, "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"> = {
  PENDING: "outline",
  PAID: "default",
  REFUNDED: "secondary",
  FAILED: "destructive",
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

export default function OrdersPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Mes commandes</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Suivez vos commandes de produits recyclés
        </p>
      </div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Toutes les commandes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Commande</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Produits</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Paiement</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(order.date)}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{order.products}</TableCell>
                    <TableCell className="font-medium">{formatPrice(order.total)}</TableCell>
                    <TableCell>
                      <Badge variant={statusBadgeColors[order.status]}>
                        {statusLabels[order.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={paymentBadgeColors[order.payment]}>
                        {paymentLabels[order.payment]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon-sm">
                        <Eye className="size-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total dépensé", value: formatPrice(64500), icon: ShoppingBag, color: "text-emerald-600", bg: "bg-emerald-100" },
          { label: "Commandes livrées", value: "1", icon: Package, color: "text-blue-600", bg: "bg-blue-100" },
          { label: "En attente", value: "2", icon: CreditCard, color: "text-amber-600", bg: "bg-amber-100" },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} size="sm">
              <CardContent className="flex items-center gap-3 p-3">
                <div className={cn("flex size-9 items-center justify-center rounded-lg shrink-0", stat.bg)}>
                  <Icon className={cn("size-4", stat.color)} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-base font-semibold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
