"use client"

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
  Users,
  Truck,
  Trash2,
  Box,
  DollarSign,
  ShoppingBag,
  Plus,
  Settings,
  Download,
  BarChart3,
  ArrowUpRight,
  UserPlus,
  Recycle,
  Package,
  Bell,
} from "lucide-react"
import Link from "next/link"
import { cn, formatPrice, formatDate, formatNumber } from "@/lib/utils"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const monthlyRevenue = [
  { month: "Jan", revenue: 125000 },
  { month: "Fév", revenue: 98000 },
  { month: "Mar", revenue: 156000 },
  { month: "Avr", revenue: 142000 },
  { month: "Mai", revenue: 189000 },
  { month: "Juin", revenue: 215000 },
]

const monthlyCollections = [
  { month: "Jan", weight: 480 },
  { month: "Fév", weight: 520 },
  { month: "Mar", weight: 610 },
  { month: "Avr", weight: 580 },
  { month: "Mai", weight: 720 },
  { month: "Juin", weight: 850 },
]

const monthlyProduction = [
  { month: "Jan", bricks: 1200 },
  { month: "Fév", bricks: 1500 },
  { month: "Mar", bricks: 1800 },
  { month: "Avr", bricks: 1650 },
  { month: "Mai", bricks: 2100 },
  { month: "Juin", bricks: 2400 },
]

const recentActivities = [
  { id: "1", action: "Nouvel utilisateur inscrit", user: "Fatou Diop", date: new Date("2026-06-01T10:30:00") },
  { id: "2", action: "Collecte terminée #CL-042", user: "Mamadou Fall", date: new Date("2026-06-01T09:15:00") },
  { id: "3", action: "Production batch #PB-018 livrée", user: "Système", date: new Date("2026-05-31T16:45:00") },
  { id: "4", action: "Commande #CMD-109 expédiée", user: "Aminata Sow", date: new Date("2026-05-31T14:20:00") },
  { id: "5", action: "Nouveau produit ajouté", user: "Admin", date: new Date("2026-05-30T11:00:00") },
  { id: "6", action: "Stock plastique mis à jour", user: "Système", date: new Date("2026-05-29T08:30:00") },
  { id: "7", action: "Paiement reçu #PAY-056", user: "Oumar Diallo", date: new Date("2026-05-28T15:10:00") },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function AdminDashboard() {
  const kpiCards = [
    { label: "Utilisateurs", value: formatNumber(1248), icon: Users, change: "+12%", color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Collecteurs", value: formatNumber(36), icon: Truck, change: "+3", color: "text-amber-600", bg: "bg-amber-100" },
    { label: "Déchets collectés", value: "3 760 kg", icon: Trash2, change: "+18%", color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Pavés produits", value: formatNumber(10650), icon: Box, change: "+22%", color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Revenus", value: formatPrice(925000), icon: DollarSign, change: "+15%", color: "text-rose-600", bg: "bg-rose-100" },
    { label: "Commandes", value: formatNumber(342), icon: ShoppingBag, change: "+8%", color: "text-cyan-600", bg: "bg-cyan-100" },
  ]

  const chartTooltipStyle = {
    background: "hsl(var(--popover))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "8px",
    fontSize: "13px",
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tableau de bord</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Vue d&apos;ensemble de l&apos;activité Néko
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="size-4" />
            Exporter
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <BarChart3 className="size-4" />
            Rapports
          </Button>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 grid-cols-2 lg:grid-cols-6">
        {kpiCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} size="sm">
              <CardContent className="flex flex-col gap-2 p-3">
                <div className="flex items-center justify-between">
                  <div className={cn("flex size-8 items-center justify-center rounded-lg", stat.bg)}>
                    <Icon className={cn("size-4", stat.color)} />
                  </div>
                  <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600">
                    <ArrowUpRight className="size-3" />
                    {stat.change}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-lg font-semibold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </motion.div>

      <motion.div variants={item} className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Revenus mensuels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Collectes par mois</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyCollections}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Bar dataKey="weight" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Production de pavés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyProduction}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Area
                    type="monotone"
                    dataKey="bricks"
                    stroke="hsl(var(--chart-3))"
                    fill="hsl(var(--chart-3))"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Activités récentes</CardTitle>
              <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                Voir tout
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">{activity.action}</TableCell>
                    <TableCell className="text-muted-foreground">{activity.user}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(activity.date)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Link href="/dashboard/admin/users">
              <Button className="w-full gap-2 justify-start">
                <UserPlus className="size-4" />
                Ajouter un utilisateur
              </Button>
            </Link>
            <Link href="/dashboard/admin/collections">
              <Button variant="outline" className="w-full gap-2 justify-start">
                <Recycle className="size-4" />
                Gérer les collectes
              </Button>
            </Link>
            <Link href="/dashboard/admin/products">
              <Button variant="outline" className="w-full gap-2 justify-start">
                <Package className="size-4" />
                Nouveau produit
              </Button>
            </Link>
            <Link href="/dashboard/admin/notifications">
              <Button variant="ghost" className="w-full gap-2 justify-start text-muted-foreground">
                <Bell className="size-4" />
                Envoyer une notification
              </Button>
            </Link>
            <Separator />
            <Link href="/dashboard/admin/finances">
              <Button variant="ghost" className="w-full gap-2 justify-start text-muted-foreground">
                <DollarSign className="size-4" />
                Voir les finances
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
