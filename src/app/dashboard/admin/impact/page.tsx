"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn, formatNumber } from "@/lib/utils"
import {
  calculateCO2Saved,
  calculateLandfillDiverted,
  calculateEnergySaved,
} from "@/lib/utils"
import {
  Leaf,
  Cloud,
  Trash2,
  Zap,
  Trees,
  Car,
  Droplets,
  ArrowUpRight,
  Recycle,
} from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const impactOverTime = [
  { month: "Jan", co2: 288, dechets: 456, energie: 1200 },
  { month: "Fév", co2: 312, dechets: 494, energie: 1300 },
  { month: "Mar", co2: 366, dechets: 579.5, energie: 1525 },
  { month: "Avr", co2: 348, dechets: 551, energie: 1450 },
  { month: "Mai", co2: 432, dechets: 684, energie: 1800 },
  { month: "Juin", co2: 510, dechets: 807.5, energie: 2125 },
]

const monthlyBreakdown = [
  { month: "Jan", co2: 288, dechets: 456, energie: 1200 },
  { month: "Fév", co2: 312, dechets: 494, energie: 1300 },
  { month: "Mar", co2: 366, dechets: 579.5, energie: 1525 },
  { month: "Avr", co2: 348, dechets: 551, energie: 1450 },
  { month: "Mai", co2: 432, dechets: 684, energie: 1800 },
  { month: "Juin", co2: 510, dechets: 807.5, energie: 2125 },
]

const totalPlasticRecycled = 3760
const totalCO2Saved = calculateCO2Saved(totalPlasticRecycled)
const totalLandfillDiverted = calculateLandfillDiverted(totalPlasticRecycled)
const totalEnergySaved = calculateEnergySaved(totalPlasticRecycled)

const treesEquivalent = Math.round(totalCO2Saved / 21)
const carsEquivalent = Math.round(totalCO2Saved / 4600)
const waterEquivalent = Math.round(totalLandfillDiverted * 1.5)

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

export default function AdminImpactPage() {
  const heroStats = [
    { label: "Plastiques recyclés", value: `${formatNumber(totalPlasticRecycled)} kg`, icon: Recycle, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "CO₂ évité", value: `${formatNumber(totalCO2Saved)} tonnes`, icon: Cloud, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Déchets détournés", value: `${formatNumber(totalLandfillDiverted)} kg`, icon: Trash2, color: "text-amber-600", bg: "bg-amber-100" },
    { label: "Énergie économisée", value: `${formatNumber(totalEnergySaved)} MWh`, icon: Zap, color: "text-purple-600", bg: "bg-purple-100" },
  ]

  const equivalents = [
    { label: "Arbres plantés", value: formatNumber(treesEquivalent), icon: Trees, desc: "Équivaut à la capacité d'absorption annuelle" },
    { label: "Voitures retirées", value: formatNumber(carsEquivalent), icon: Car, desc: "Équivaut aux émissions annuelles" },
    { label: "Eau économisée", value: `${formatNumber(waterEquivalent)} L`, icon: Droplets, desc: "Équivaut à l'eau préservée" },
  ]

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-semibold tracking-tight">Impact Environnemental</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Mesure de l&apos;impact positif de Néko sur l&apos;environnement
        </p>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {heroStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} size="sm">
              <CardContent className="flex flex-col gap-2 p-3">
                <div className="flex items-center justify-between">
                  <div className={cn("flex size-8 items-center justify-center rounded-lg", stat.bg)}>
                    <Icon className={cn("size-4", stat.color)} />
                  </div>
                  <ArrowUpRight className={cn("size-4", stat.color)} />
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
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Impact dans le temps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={impactOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Legend />
                  <Area type="monotone" dataKey="co2" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.15} strokeWidth={2} name="CO₂ évité (tonnes)" />
                  <Area type="monotone" dataKey="dechets" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.15} strokeWidth={2} name="Déchets détournés (kg)" />
                  <Area type="monotone" dataKey="energie" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" fillOpacity={0.15} strokeWidth={2} name="Énergie économisée (MWh)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Impact par mois</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Legend />
                  <Bar dataKey="co2" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} name="CO₂ évité (tonnes)" />
                  <Bar dataKey="dechets" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Déchets détournés (kg)" />
                  <Bar dataKey="energie" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} name="Énergie économisée (MWh)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Équivalences environnementales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {equivalents.map((eq) => {
                const Icon = eq.icon
                return (
                  <div key={eq.label} className="rounded-xl border bg-card p-5 flex flex-col items-center text-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="size-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-primary">{eq.value}</p>
                      <p className="text-sm font-medium mt-1">{eq.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">{eq.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
