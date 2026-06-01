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
  Calendar,
  Wallet,
  Weight,
  Star,
  MapPin,
  Clock,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Package,
  Play,
} from "lucide-react"
import { cn, formatDate, formatPrice, formatNumber } from "@/lib/utils"
import Link from "next/link"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

const weeklyEarnings = [
  { day: "Lun", amount: 2500 },
  { day: "Mar", amount: 4000 },
  { day: "Mer", amount: 3000 },
  { day: "Jeu", amount: 5500 },
  { day: "Ven", amount: 6000 },
  { day: "Sam", amount: 3500 },
  { day: "Dim", amount: 2000 },
]

const monthlyMissions = [
  { month: "Jan", count: 8 },
  { month: "Fév", count: 12 },
  { month: "Mar", count: 10 },
  { month: "Avr", count: 15 },
  { month: "Mai", count: 18 },
  { month: "Juin", count: 14 },
]

const recentMissions = [
  { id: "1", date: new Date("2026-05-28"), address: "15 Rue des Lilas, Dakar", type: "Plastique noir", weight: 8, status: "COMPLETED" },
  { id: "2", date: new Date("2026-05-27"), address: "42 Avenue Cheikh Anta Diop", type: "Plastique blanc", weight: 5, status: "COMPLETED" },
  { id: "3", date: new Date("2026-05-26"), address: "8 Rue de la République", type: "Plastique mixte", weight: 12, status: "COMPLETED" },
  { id: "4", date: new Date("2026-05-25"), address: "27 Boulevard du Sud", type: "Plastique noir", weight: 6, status: "COMPLETED" },
  { id: "5", date: new Date("2026-05-24"), address: "3 Cité des Eaux", type: "PET", weight: 10, status: "COMPLETED" },
]

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  ASSIGNED: "Assignée",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
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

export default function CollectorDashboard() {
  const { data: session } = useSession()

  const statCards = [
    { label: "Missions du jour", value: "3", icon: Calendar, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Revenus totaux", value: formatPrice(128500), icon: Wallet, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Poids collecté", value: "1 245 kg", icon: Weight, color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Performance", value: "4.8/5", icon: Star, color: "text-amber-600", bg: "bg-amber-100" },
  ]

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-semibold tracking-tight">
          Bon retour, {session?.user?.name?.split(" ")[0] || "Collecteur"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Voici le résumé de vos missions Néko
        </p>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
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

      <motion.div variants={item} className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Mission en cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4 p-4 rounded-lg border bg-card">
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Package className="size-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium">15 Rue des Lilas, Dakar</p>
                  <Badge>En cours</Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" />
                    À 2.3 km
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    Démarrée il y a 15 min
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Button size="sm" className="gap-1.5">
                    <Play className="size-3.5" />
                    Continuer
                  </Button>
                  <Link href="/dashboard/collector/missions">
                    <Button variant="ghost" size="sm" className="gap-1">
                      Détails <ChevronRight className="size-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Aperçu rapide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Calendar className="size-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Cette semaine</p>
                  <p className="text-sm font-semibold">12 missions</p>
                </div>
              </div>
              <TrendingUp className="size-4 text-emerald-500" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Calendar className="size-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ce mois-ci</p>
                  <p className="text-sm font-semibold">46 missions</p>
                </div>
              </div>
              <TrendingUp className="size-4 text-emerald-500" />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Wallet className="size-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Gains du mois</p>
                  <p className="text-sm font-semibold">{formatPrice(65200)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Gains de la semaine</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyEarnings}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "13px",
                    }}
                    formatter={(value) => [formatPrice(Number(value) || 0), "Gains"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
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
            <CardTitle>Missions mensuelles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyMissions}>
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
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Missions récentes</CardTitle>
              <Link href="/dashboard/collector/missions">
                <Button variant="ghost" size="sm" className="gap-1">
                  Voir tout <ArrowRight className="size-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Poids</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentMissions.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="text-muted-foreground">{formatDate(m.date)}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{m.address}</TableCell>
                    <TableCell>{m.type}</TableCell>
                    <TableCell>{m.weight} kg</TableCell>
                    <TableCell>
                      <Badge variant={statusColors[m.status]}>{statusLabels[m.status]}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
