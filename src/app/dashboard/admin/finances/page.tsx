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
import { cn, formatPrice, formatDate, formatNumber } from "@/lib/utils"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowUpRight,
  Download,
  FileText,
  Wallet,
  ShoppingBag,
  Recycle,
} from "lucide-react"
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
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

const monthlyRevenue = [
  { month: "Jan", collectes: 45000, ventes: 80000 },
  { month: "Fév", collectes: 52000, ventes: 46000 },
  { month: "Mar", collectes: 38000, ventes: 118000 },
  { month: "Avr", collectes: 61000, ventes: 81000 },
  { month: "Mai", collectes: 48000, ventes: 141000 },
  { month: "Juin", collectes: 55000, ventes: 160000 },
]

const expenseBreakdown = [
  { name: "Production", value: 185000 },
  { name: "Logistique", value: 95000 },
  { name: "Salaires", value: 210000 },
  { name: "Marketing", value: 45000 },
  { name: "Administratif", value: 35000 },
]

const EXPENSE_COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"]

const recentTransactions = [
  { id: "TXN-001", date: new Date("2026-06-01"), description: "Vente commande CMD-109", type: "Vente", amount: 125000 },
  { id: "TXN-002", date: new Date("2026-05-31"), description: "Paiement collecte CL-042", type: "Collecte", amount: 7500 },
  { id: "TXN-003", date: new Date("2026-05-30"), description: "Achat matériel production", type: "Dépense", amount: -45000 },
  { id: "TXN-004", date: new Date("2026-05-29"), description: "Vente commande CMD-108", type: "Vente", amount: 195000 },
  { id: "TXN-005", date: new Date("2026-05-28"), description: "Paiement collecte CL-040", type: "Collecte", amount: 6500 },
  { id: "TXN-006", date: new Date("2026-05-27"), description: "Salaire personnel", type: "Dépense", amount: -210000 },
  { id: "TXN-007", date: new Date("2026-05-26"), description: "Vente commande CMD-106", type: "Vente", amount: 425000 },
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

const chartTooltipStyle = {
  background: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: "13px",
}

export default function AdminFinancesPage() {
  const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.collectes + m.ventes, 0)
  const totalCollectes = monthlyRevenue.reduce((sum, m) => sum + m.collectes, 0)
  const totalVentes = monthlyRevenue.reduce((sum, m) => sum + m.ventes, 0)
  const totalExpenses = expenseBreakdown.reduce((sum, e) => sum + e.value, 0)
  const netProfit = totalRevenue - totalExpenses

  const kpis = [
    { label: "Revenus totaux", value: formatPrice(totalRevenue), icon: DollarSign, change: "+18%", color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Revenus collectes", value: formatPrice(totalCollectes), icon: Recycle, change: "+12%", color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Revenus ventes", value: formatPrice(totalVentes), icon: ShoppingBag, change: "+24%", color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Dépenses", value: formatPrice(totalExpenses), icon: TrendingDown, change: "+8%", color: "text-rose-600", bg: "bg-rose-100" },
    { label: "Bénéfices nets", value: formatPrice(netProfit), icon: PiggyBank, change: "+15%", color: "text-amber-600", bg: "bg-amber-100" },
  ]

  const CustomPieLabel = ({ name, percent }: { name: string; percent: number }) => (
    <span className="text-xs">{name} {(percent * 100).toFixed(0)}%</span>
  )

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tableau de Bord Financier</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Aperçu des finances de Néko
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="size-4" />
            Exporter PDF
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <FileText className="size-4" />
            Exporter Excel
          </Button>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.label} size="sm">
              <CardContent className="flex flex-col gap-2 p-3">
                <div className="flex items-center justify-between">
                  <div className={cn("flex size-8 items-center justify-center rounded-lg", kpi.bg)}>
                    <Icon className={cn("size-4", kpi.color)} />
                  </div>
                  <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600">
                    <ArrowUpRight className="size-3" />
                    {kpi.change}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                  <p className="text-lg font-semibold">{kpi.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </motion.div>

      <motion.div variants={item} className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenus mensuels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Legend />
                  <Line type="monotone" dataKey="collectes" stroke="hsl(var(--chart-2))" strokeWidth={2} name="Collectes" dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="ventes" stroke="hsl(var(--chart-3))" strokeWidth={2} name="Ventes" dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition des dépenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72 flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {expenseBreakdown.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(value) => formatPrice(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Transactions récentes</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N°</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="text-xs font-medium">{tx.id}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(tx.date)}</TableCell>
                    <TableCell className="font-medium">{tx.description}</TableCell>
                    <TableCell>
                      <Badge variant={
                        tx.type === "Vente" ? "default" :
                        tx.type === "Collecte" ? "secondary" : "destructive"
                      }>
                        {tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell className={cn(
                      "text-right font-medium tabular-nums",
                      tx.amount > 0 ? "text-emerald-600" : "text-destructive"
                    )}>
                      {tx.amount > 0 ? "+" : ""}{formatPrice(tx.amount)}
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
