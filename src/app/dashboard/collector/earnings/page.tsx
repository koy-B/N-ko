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
import { Wallet, TrendingUp, TrendingDown, Calendar, DollarSign } from "lucide-react"
import { cn, formatPrice, formatDate } from "@/lib/utils"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const monthlyEarnings = [
  { month: "Jan", amount: 45000 },
  { month: "Fév", amount: 52000 },
  { month: "Mar", amount: 48000 },
  { month: "Avr", amount: 61000 },
  { month: "Mai", amount: 72000 },
  { month: "Juin", amount: 65200 },
]

const earningsHistory = [
  { id: "1", date: new Date("2026-05-28"), mission: "15 Rue des Lilas, Dakar", amount: 4000, status: "PAID" },
  { id: "2", date: new Date("2026-05-27"), mission: "42 Avenue Cheikh Anta Diop", amount: 2500, status: "PAID" },
  { id: "3", date: new Date("2026-05-26"), mission: "8 Rue de la République", amount: 6000, status: "PAID" },
  { id: "4", date: new Date("2026-05-25"), mission: "27 Boulevard du Sud", amount: 3000, status: "PAID" },
  { id: "5", date: new Date("2026-05-24"), mission: "3 Cité des Eaux", amount: 5000, status: "PENDING" },
  { id: "6", date: new Date("2026-05-23"), mission: "12 Rue du Fleuve", amount: 3500, status: "PAID" },
  { id: "7", date: new Date("2026-05-22"), mission: "5 Place de l'Indépendance", amount: 2000, status: "PAID" },
  { id: "8", date: new Date("2026-05-21"), mission: "19 Rue Docteur Thèze", amount: 7500, status: "PENDING" },
]

const statusConfig: Record<string, { label: string; color: "default" | "secondary" | "destructive" | "outline" }> = {
  PAID: { label: "Payé", color: "default" },
  PENDING: { label: "En attente", color: "secondary" },
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

export default function CollectorEarningsPage() {
  const totalEarned = earningsHistory.reduce((sum, e) => sum + e.amount, 0)
  const thisWeek = earningsHistory.slice(0, 3).reduce((sum, e) => sum + e.amount, 0)
  const thisMonth = totalEarned

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-semibold tracking-tight">Mes revenus</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Suivez vos gains et votre historique de paiements
        </p>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Wallet className="size-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total gagné</p>
                <p className="text-3xl font-bold tracking-tight">{formatPrice(totalEarned)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <Card size="sm">
          <CardContent className="flex items-center gap-3 p-3">
            <div className="size-9 rounded-lg bg-emerald-100 flex items-center justify-center">
              <TrendingUp className="size-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Cette semaine</p>
              <p className="text-base font-semibold">{formatPrice(thisWeek)}</p>
            </div>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardContent className="flex items-center gap-3 p-3">
            <div className="size-9 rounded-lg bg-blue-100 flex items-center justify-center">
              <Calendar className="size-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ce mois</p>
              <p className="text-base font-semibold">{formatPrice(thisMonth)}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Revenus mensuels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyEarnings}>
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
                    formatter={(value) => [formatPrice(Number(value) || 0), "Revenus"]}
                  />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Historique des paiements</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Mission</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {earningsHistory.map((e) => {
                  const config = statusConfig[e.status]
                  return (
                    <TableRow key={e.id}>
                      <TableCell className="text-muted-foreground">{formatDate(e.date)}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{e.mission}</TableCell>
                      <TableCell className="font-medium">{formatPrice(e.amount)}</TableCell>
                      <TableCell>
                        <Badge variant={config.color}>{config.label}</Badge>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
