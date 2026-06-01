"use client"

import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Trash2,
  Truck,
  Percent,
  Award,
  ShoppingBag,
  Plus,
  ArrowRight,
  Leaf,
} from "lucide-react"
import { cn, formatDate, formatNumber } from "@/lib/utils"
import Link from "next/link"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const monthlyData = [
  { month: "Jan", weight: 0 },
  { month: "Fév", weight: 12 },
  { month: "Mar", weight: 8 },
  { month: "Avr", weight: 15 },
  { month: "Mai", weight: 10 },
  { month: "Juin", weight: 20 },
]

const impactData = [
  { label: "CO₂ économisé", value: 39 },
  { label: "Déchets enfouis évités", value: 61.75 },
]

const recentCollections = [
  { id: "1", date: new Date("2026-05-28"), address: "15 Rue des Lilas, Dakar", type: "Plastique noir", weight: 8, status: "COMPLETED" },
  { id: "2", date: new Date("2026-05-20"), address: "15 Rue des Lilas, Dakar", type: "Plastique blanc", weight: 5, status: "COMPLETED" },
  { id: "3", date: new Date("2026-05-12"), address: "15 Rue des Lilas, Dakar", type: "Plastique mixte", weight: 12, status: "COMPLETED" },
  { id: "4", date: new Date("2026-05-05"), address: "15 Rue des Lilas, Dakar", type: "Plastique noir", weight: 6, status: "COMPLETED" },
  { id: "5", date: new Date("2026-04-28"), address: "15 Rue des Lilas, Dakar", type: "Plastique noir", weight: 10, status: "COMPLETED" },
]

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  ASSIGNED: "Assignée",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"> = {
  PENDING: "outline",
  ASSIGNED: "secondary",
  IN_PROGRESS: "default",
  COMPLETED: "default",
  CANCELLED: "destructive",
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function ClientDashboard() {
  const { data: session } = useSession()

  const stats = [
    { label: "Déchets collectés", value: "41 kg", icon: Trash2, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Collectes effectuées", value: "5", icon: Truck, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Réductions obtenues", value: "2 500 F", icon: Percent, color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Points fidélité", value: formatNumber(410), icon: Award, color: "text-amber-600", bg: "bg-amber-100" },
    { label: "Commandes", value: "3", icon: ShoppingBag, color: "text-rose-600", bg: "bg-rose-100" },
  ]

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-semibold tracking-tight">
          Bon retour, {session?.user?.name?.split(" ")[0] || "Client"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Voici le résumé de votre activité Néko
        </p>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} size="sm">
              <CardContent className="flex flex-col gap-2 p-3">
                <div className={cn("flex size-8 items-center justify-center rounded-lg", stat.bg)}>
                  <Icon className={cn("size-4", stat.color)} />
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

      <motion.div variants={item} className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Historique mensuel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "13px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
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

        <Card>
          <CardHeader>
            <CardTitle>Impact écologique</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={impactData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "13px",
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Dernières collectes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Poids</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCollections.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="text-muted-foreground">{formatDate(c.date)}</TableCell>
                    <TableCell>{c.type}</TableCell>
                    <TableCell>{c.weight} kg</TableCell>
                    <TableCell>
                      <Badge variant={statusColors[c.status]}>{statusLabels[c.status]}</Badge>
                    </TableCell>
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
            <Link href="/dashboard/client/collections/new">
              <Button className="w-full gap-2">
                <Plus className="size-4" />
                Nouvelle collecte
              </Button>
            </Link>
            <Link href="/dashboard/client/shop">
              <Button variant="outline" className="w-full gap-2">
                <ShoppingBag className="size-4" />
                Voir la boutique
              </Button>
            </Link>
            <Link href="/dashboard/client/loyalty">
              <Button variant="ghost" className="w-full gap-2 text-muted-foreground">
                <Award className="size-4" />
                Programme fidélité
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="rounded-xl border bg-card p-4 flex items-center gap-4">
        <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Leaf className="size-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">Impact total</p>
          <p className="text-xs text-muted-foreground">
            Vous avez recyclé 41 kg de plastique, économisé 39 kg de CO₂ et évité 61.75 kg de déchets enfouis.
          </p>
        </div>
        <Link href="/dashboard/client/collections">
          <Button variant="ghost" size="sm" className="gap-1 shrink-0">
            Voir plus <ArrowRight className="size-3" />
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  )
}
