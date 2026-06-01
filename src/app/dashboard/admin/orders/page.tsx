"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Eye,
  ShoppingBag,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Calendar,
  Package,
} from "lucide-react"
import { cn, formatPrice, formatDate } from "@/lib/utils"

type OrderStatus = "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED"

type OrderItem = {
  id: string
  productName: string
  quantity: number
  price: number
}

type Order = {
  id: string
  date: Date
  client: string
  clientEmail: string
  clientPhone: string
  address: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
}

const statusLabels: Record<OrderStatus, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  PROCESSING: "En traitement",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
}

const statusColors: Record<OrderStatus, "outline" | "secondary" | "default" | "default" | "default" | "destructive"> = {
  PENDING: "outline",
  CONFIRMED: "secondary",
  PROCESSING: "default",
  SHIPPED: "default",
  DELIVERED: "default",
  CANCELLED: "destructive",
}

const statusDotColors: Record<OrderStatus, string> = {
  PENDING: "bg-amber-500",
  CONFIRMED: "bg-blue-500",
  PROCESSING: "bg-purple-500",
  SHIPPED: "bg-cyan-500",
  DELIVERED: "bg-emerald-500",
  CANCELLED: "bg-muted-foreground",
}

const paymentLabels: Record<PaymentStatus, string> = {
  PENDING: "En attente",
  PAID: "Payé",
  FAILED: "Échoué",
  REFUNDED: "Remboursé",
}

const paymentColors: Record<PaymentStatus, "outline" | "default" | "destructive" | "secondary"> = {
  PENDING: "outline",
  PAID: "default",
  FAILED: "destructive",
  REFUNDED: "secondary",
}

const sampleOrders: Order[] = [
  { id: "CMD-109", date: new Date("2026-06-01"), client: "Fatou Diop", clientEmail: "fatou.diop@email.com", clientPhone: "+221 77 123 45 67", address: "15 Rue des Lilas, Dakar", items: [{ id: "i1", productName: "Pavé Neko Classic 6", quantity: 50, price: 2500 }], total: 125000, status: "SHIPPED", paymentStatus: "PAID" },
  { id: "CMD-108", date: new Date("2026-05-31"), client: "Aminata Sow", clientEmail: "aminata.sow@email.com", clientPhone: "+221 77 345 67 89", address: "8 Avenue de la République, Dakar", items: [{ id: "i2", productName: "Dalle Neko Jardin", quantity: 20, price: 4500 }, { id: "i3", productName: "Pavé Neko Premium 8", quantity: 30, price: 3500 }], total: 195000, status: "CONFIRMED", paymentStatus: "PAID" },
  { id: "CMD-107", date: new Date("2026-05-30"), client: "Ndeye Ndiaye", clientEmail: "ndeye.ndiaye@email.com", clientPhone: "+221 76 567 89 01", address: "22 Rue du Marché, Thiès", items: [{ id: "i4", productName: "Bordure Neko Ville", quantity: 15, price: 5500 }], total: 82500, status: "PENDING", paymentStatus: "PENDING" },
  { id: "CMD-106", date: new Date("2026-05-29"), client: "Ibrahima Kane", clientEmail: "ibrahima.kane@email.com", clientPhone: "+221 77 678 90 12", address: "12 Rue de l'Afrique, Dakar", items: [{ id: "i5", productName: "Pavé Neko Classic 6", quantity: 100, price: 2500 }, { id: "i6", productName: "Pavé Neko Premium 8", quantity: 50, price: 3500 }], total: 425000, status: "DELIVERED", paymentStatus: "PAID" },
  { id: "CMD-105", date: new Date("2026-05-28"), client: "Marième Sy", clientEmail: "marieme.sy@email.com", clientPhone: "+221 77 901 23 45", address: "5 Rue de la Paix, Saint-Louis", items: [{ id: "i7", productName: "Dalle Neko Jardin", quantity: 10, price: 4500 }], total: 45000, status: "CANCELLED", paymentStatus: "REFUNDED" },
  { id: "CMD-104", date: new Date("2026-05-27"), client: "Papa Sarr", clientEmail: "papa.sarr@email.com", clientPhone: "+221 70 012 34 56", address: "18 Rue des Acacias, Dakar", items: [{ id: "i8", productName: "Pavé Neko Premium 8", quantity: 25, price: 3500 }], total: 87500, status: "PROCESSING", paymentStatus: "PAID" },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(sampleOrders)
  const [activeTab, setActiveTab] = useState("all")
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const filteredOrders = orders.filter((o) => {
    if (activeTab === "all") return true
    if (activeTab === "pending") return o.status === "PENDING"
    if (activeTab === "confirmed") return o.status === "CONFIRMED"
    if (activeTab === "shipped") return o.status === "SHIPPED"
    if (activeTab === "delivered") return o.status === "DELIVERED"
    if (activeTab === "cancelled") return o.status === "CANCELLED"
    return true
  })

  function openDetail(order: Order) {
    setSelectedOrder(order)
    setDetailOpen(true)
  }

  function handleStatusChange(orderId: string, newStatus: string) {
    setOrders(
      orders.map((o) =>
        o.id === orderId ? { ...o, status: newStatus as OrderStatus } : o
      )
    )
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus as OrderStatus })
    }
  }

  const countByStatus = (status: string) => {
    if (status === "all") return orders.length
    return orders.filter((o) => o.status === status).length
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-semibold tracking-tight">Gestion des Commandes</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {orders.length} commandes sur la plateforme
        </p>
      </motion.div>

      <motion.div variants={item} className="flex flex-col gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">
              Toutes
              <Badge variant="secondary" className="ml-1.5">{countByStatus("all")}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending">
              En attente
              <Badge variant="secondary" className="ml-1.5">{countByStatus("PENDING")}</Badge>
            </TabsTrigger>
            <TabsTrigger value="confirmed">
              Confirmées
              <Badge variant="secondary" className="ml-1.5">{countByStatus("CONFIRMED")}</Badge>
            </TabsTrigger>
            <TabsTrigger value="shipped">
              Expédiées
              <Badge variant="secondary" className="ml-1.5">{countByStatus("SHIPPED")}</Badge>
            </TabsTrigger>
            <TabsTrigger value="delivered">
              Livrées
              <Badge variant="secondary" className="ml-1.5">{countByStatus("DELIVERED")}</Badge>
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Annulées
              <Badge variant="secondary" className="ml-1.5">{countByStatus("CANCELLED")}</Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>N°</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Produits</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Paiement</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                          Aucune commande trouvée
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium text-xs">{order.id}</TableCell>
                          <TableCell className="text-muted-foreground">{formatDate(order.date)}</TableCell>
                          <TableCell className="font-medium">{order.client}</TableCell>
                          <TableCell className="max-w-[160px] truncate">
                            {order.items.map((i) => i.productName).join(", ")}
                          </TableCell>
                          <TableCell>{formatPrice(order.total)}</TableCell>
                          <TableCell>
                            <Badge variant={statusColors[order.status]}>
                              <span className={cn("size-1.5 rounded-full mr-1.5", statusDotColors[order.status])} />
                              {statusLabels[order.status]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={paymentColors[order.paymentStatus]}>
                              {paymentLabels[order.paymentStatus]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end">
                              <Button variant="ghost" size="icon-sm" onClick={() => openDetail(order)}>
                                <Eye className="size-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Détails de la commande</DialogTitle>
            <DialogDescription>
              {selectedOrder && <>Informations complètes pour {selectedOrder.id}</>}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="flex flex-col gap-4 py-2 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">N° de commande</p>
                  <p className="text-sm font-medium">{selectedOrder.id}</p>
                </div>
                <Badge variant={statusColors[selectedOrder.status]}>
                  <span className={cn("size-1.5 rounded-full mr-1.5", statusDotColors[selectedOrder.status])} />
                  {statusLabels[selectedOrder.status]}
                </Badge>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <Calendar className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="text-sm font-medium">{formatDate(selectedOrder.date)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CreditCard className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Paiement</p>
                    <Badge variant={paymentColors[selectedOrder.paymentStatus]}>{paymentLabels[selectedOrder.paymentStatus]}</Badge>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-2">Client</p>
                <div className="rounded-lg border bg-muted/30 p-3 space-y-1">
                  <p className="text-sm font-medium">{selectedOrder.client}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="size-3" /> {selectedOrder.clientEmail}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="size-3" /> {selectedOrder.clientPhone}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3" /> {selectedOrder.address}
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-2">Articles commandés</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-2">
                        <Package className="size-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">Quantité: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                  <div className="flex items-center justify-between rounded-lg bg-primary/5 p-3">
                    <p className="text-sm font-semibold">Total</p>
                    <p className="text-sm font-semibold">{formatPrice(selectedOrder.total)}</p>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-2">Mettre à jour le statut</p>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(v) => handleStatusChange(selectedOrder.id, v ?? selectedOrder.status)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">En attente</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmée</SelectItem>
                    <SelectItem value="PROCESSING">En traitement</SelectItem>
                    <SelectItem value="SHIPPED">Expédiée</SelectItem>
                    <SelectItem value="DELIVERED">Livrée</SelectItem>
                    <SelectItem value="CANCELLED">Annulée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
