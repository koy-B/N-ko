"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  Plus,
  Eye,
  Factory,
  Box,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Package,
  Weight,
} from "lucide-react"
import { cn, formatPrice, formatDate, formatNumber } from "@/lib/utils"

type BatchStatus = "IN_PROGRESS" | "COMPLETED" | "CANCELLED"

type ProductionBatch = {
  id: string
  name: string
  date: Date
  plasticUsed: number
  bricksProduced: number
  cost: number
  revenue: number
  status: BatchStatus
  source: string
  plasticSource: string
  notes?: string
}

const statusLabels: Record<BatchStatus, string> = {
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminé",
  CANCELLED: "Annulé",
}

const statusColors: Record<BatchStatus, "default" | "outline" | "destructive"> = {
  IN_PROGRESS: "default",
  COMPLETED: "outline",
  CANCELLED: "destructive",
}

const statusDotColors: Record<BatchStatus, string> = {
  IN_PROGRESS: "bg-purple-500",
  COMPLETED: "bg-emerald-500",
  CANCELLED: "bg-muted-foreground",
}

const plasticSources = [
  { id: "s1", name: "Lot PL-024 - Plastique noir" },
  { id: "s2", name: "Lot PL-025 - Plastique blanc" },
  { id: "s3", name: "Lot PL-026 - Plastique mixte" },
  { id: "s4", name: "Lot PL-027 - Plastique noir" },
]

const sampleBatches: ProductionBatch[] = [
  { id: "PB-018", name: "Lot de production #18", date: new Date("2026-06-01"), plasticUsed: 50, bricksProduced: 100, cost: 15000, revenue: 40000, status: "IN_PROGRESS", source: "PL-024", plasticSource: "Plastique noir" },
  { id: "PB-017", name: "Lot de production #17", date: new Date("2026-05-30"), plasticUsed: 45, bricksProduced: 90, cost: 13500, revenue: 36000, status: "COMPLETED", source: "PL-025", plasticSource: "Plastique blanc" },
  { id: "PB-016", name: "Lot de production #16", date: new Date("2026-05-28"), plasticUsed: 60, bricksProduced: 120, cost: 18000, revenue: 48000, status: "COMPLETED", source: "PL-026", plasticSource: "Plastique mixte" },
  { id: "PB-015", name: "Lot de production #15", date: new Date("2026-05-25"), plasticUsed: 35, bricksProduced: 70, cost: 10500, revenue: 28000, status: "COMPLETED", source: "PL-024", plasticSource: "Plastique noir" },
  { id: "PB-014", name: "Lot de production #14", date: new Date("2026-05-22"), plasticUsed: 55, bricksProduced: 110, cost: 16500, revenue: 44000, status: "CANCELLED", source: "PL-027", plasticSource: "Plastique noir" },
  { id: "PB-013", name: "Lot de production #13", date: new Date("2026-05-20"), plasticUsed: 40, bricksProduced: 80, cost: 12000, revenue: 32000, status: "COMPLETED", source: "PL-025", plasticSource: "Plastique blanc" },
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

export default function AdminProductionPage() {
  const [batches, setBatches] = useState<ProductionBatch[]>(sampleBatches)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState<ProductionBatch | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    plasticSource: "",
    plasticUsed: "",
    bricksEstimated: "0",
    cost: "",
  })

  const totalPlasticAvailable = 320
  const batchesInProduction = batches.filter((b) => b.status === "IN_PROGRESS").length
  const bricksThisMonth = batches
    .filter((b) => b.date.getMonth() === new Date().getMonth())
    .reduce((sum, b) => sum + b.bricksProduced, 0)
  const totalProduced = batches.reduce((sum, b) => sum + b.bricksProduced, 0)
  const totalPlasticUsed = batches.reduce((sum, b) => sum + b.plasticUsed, 0)
  const yieldRate = totalPlasticUsed > 0 ? Math.round((totalProduced / (totalPlasticUsed * 2)) * 100) : 0

  const stats = [
    { label: "Plastique disponible", value: `${formatNumber(totalPlasticAvailable)} kg`, icon: Weight, change: "", color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Pavés en production", value: formatNumber(batchesInProduction), icon: Factory, change: "", color: "text-purple-600", bg: "bg-purple-100" },
    { label: "Pavés produits ce mois", value: formatNumber(bricksThisMonth), icon: Box, change: "+18%", color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Rendement", value: `${yieldRate}%`, icon: TrendingUp, change: "+3%", color: "text-amber-600", bg: "bg-amber-100" },
  ]

  function handlePlasticUsedChange(value: string) {
    const kg = parseFloat(value) || 0
    const bricks = Math.floor(kg * 2)
    setFormData({ ...formData, plasticUsed: value, bricksEstimated: String(bricks) })
  }

  function handleAddBatch() {
    const kg = parseFloat(formData.plasticUsed)
    const bricks = Math.floor(kg * 2)
    const sourceName = plasticSources.find((s) => s.id === formData.plasticSource)?.name || ""
    const newBatch: ProductionBatch = {
      id: `PB-${String(batches.length + 1).padStart(3, "0")}`,
      name: formData.name,
      date: new Date(),
      plasticUsed: kg,
      bricksProduced: 0,
      cost: parseFloat(formData.cost),
      revenue: 0,
      status: "IN_PROGRESS",
      source: formData.plasticSource,
      plasticSource: sourceName,
    }
    setBatches([newBatch, ...batches])
    setFormData({ name: "", plasticSource: "", plasticUsed: "", bricksEstimated: "0", cost: "" })
    setDialogOpen(false)
  }

  function openDetail(batch: ProductionBatch) {
    setSelectedBatch(batch)
    setDetailOpen(true)
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Gestion de la Production</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {batches.length} lots de production enregistrés
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogClose render={<Button className="gap-2" />}>
            <Plus className="size-4" />
            Nouveau lot de production
          </DialogClose>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nouveau lot de production</DialogTitle>
              <DialogDescription>
                Créez un nouveau lot à partir du stock plastique disponible.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Nom du lot</label>
                <Input
                  placeholder="Ex: Lot de production #19"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Source plastique</label>
                <Select
                  value={formData.plasticSource}
                  onValueChange={(v) => setFormData({ ...formData, plasticSource: v ?? "" })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une source" />
                  </SelectTrigger>
                  <SelectContent>
                    {plasticSources.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Quantité plastique utilisée (kg)</label>
                <Input
                  type="number"
                  placeholder="Ex: 50"
                  value={formData.plasticUsed}
                  onChange={(e) => handlePlasticUsedChange(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Nombre de pavés estimé</label>
                <Input
                  value={formData.bricksEstimated}
                  disabled
                  className="bg-muted/50"
                />
                <p className="text-xs text-muted-foreground">Auto-calculé (kg × 2)</p>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Coût de fabrication</label>
                <Input
                  type="number"
                  placeholder="Ex: 15000"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter showCloseButton>
              <DialogClose render={<Button variant="outline" />}>
                Annuler
              </DialogClose>
              <Button onClick={handleAddBatch} disabled={!formData.name || !formData.plasticSource || !formData.plasticUsed || !formData.cost}>
                Créer le lot
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} size="sm">
              <CardContent className="flex flex-col gap-2 p-3">
                <div className="flex items-center justify-between">
                  <div className={cn("flex size-8 items-center justify-center rounded-lg", stat.bg)}>
                    <Icon className={cn("size-4", stat.color)} />
                  </div>
                  {stat.change && (
                    <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600">
                      <ArrowUpRight className="size-3" />
                      {stat.change}
                    </span>
                  )}
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

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Lots de production</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Plastique utilisé</TableHead>
                  <TableHead>Pavés produits</TableHead>
                  <TableHead>Coût</TableHead>
                  <TableHead>Revenu</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                      Aucun lot de production trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  batches.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell className="font-medium">{batch.name}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(batch.date)}</TableCell>
                      <TableCell>{batch.plasticUsed} kg</TableCell>
                      <TableCell>{formatNumber(batch.bricksProduced)}</TableCell>
                      <TableCell>{formatPrice(batch.cost)}</TableCell>
                      <TableCell>{formatPrice(batch.revenue)}</TableCell>
                      <TableCell>
                        <Badge variant={statusColors[batch.status]}>
                          <span className={cn("size-1.5 rounded-full mr-1.5", statusDotColors[batch.status])} />
                          {statusLabels[batch.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon-sm" onClick={() => openDetail(batch)}>
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
      </motion.div>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Détails du lot</DialogTitle>
            <DialogDescription>
              {selectedBatch && <>Informations complètes pour {selectedBatch.name}</>}
            </DialogDescription>
          </DialogHeader>
          {selectedBatch && (
            <div className="flex flex-col gap-4 py-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">N° de lot</p>
                  <p className="text-sm font-medium">{selectedBatch.id}</p>
                </div>
                <Badge variant={statusColors[selectedBatch.status]}>
                  <span className={cn("size-1.5 rounded-full mr-1.5", statusDotColors[selectedBatch.status])} />
                  {statusLabels[selectedBatch.status]}
                </Badge>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Nom</p>
                  <p className="text-sm font-medium">{selectedBatch.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm font-medium">{formatDate(selectedBatch.date)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Plastique utilisé</p>
                  <p className="text-sm font-medium">{selectedBatch.plasticUsed} kg</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pavés produits</p>
                  <p className="text-sm font-medium">{formatNumber(selectedBatch.bricksProduced)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Coût de fabrication</p>
                  <p className="text-sm font-medium">{formatPrice(selectedBatch.cost)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Revenu</p>
                  <p className="text-sm font-medium">{formatPrice(selectedBatch.revenue)}</p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground">Source plastique</p>
                <p className="text-sm font-medium">{selectedBatch.plasticSource}</p>
              </div>
              {selectedBatch.notes && (
                <div>
                  <p className="text-xs text-muted-foreground">Notes</p>
                  <p className="text-sm text-muted-foreground">{selectedBatch.notes}</p>
                </div>
              )}
              <Separator />
              <div className="rounded-lg border bg-muted/30 p-3">
                <p className="text-xs text-muted-foreground mb-2">Résumé</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Weight className="size-4 text-muted-foreground" />
                    <span>{selectedBatch.plasticUsed} kg plastique</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="size-4 text-muted-foreground" />
                    <span>{formatNumber(selectedBatch.bricksProduced)} pavés</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="size-4 text-muted-foreground" />
                    <span>Coût: {formatPrice(selectedBatch.cost)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="size-4 text-muted-foreground" />
                    <span>Revenu: {formatPrice(selectedBatch.revenue)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
