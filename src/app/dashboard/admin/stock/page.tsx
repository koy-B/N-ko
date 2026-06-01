"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
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
  Warehouse,
  ArrowUpRight,
  ArrowDown,
  ArrowUp,
  Weight,
  Trash2,
  Package,
} from "lucide-react"
import { cn, formatDate, formatNumber } from "@/lib/utils"

type StockEntry = {
  id: string
  date: Date
  weight: number
  source: string
  quality: string
  used: boolean
  notes?: string
}

const sampleStock: StockEntry[] = [
  { id: "PL-024", date: new Date("2026-06-01"), weight: 80, source: "Collecte CL-042", quality: "Sélectionné", used: false },
  { id: "PL-025", date: new Date("2026-05-30"), weight: 65, source: "Collecte CL-040", quality: "Mixte", used: true },
  { id: "PL-026", date: new Date("2026-05-28"), weight: 90, source: "Collecte CL-038", quality: "Standard", used: true },
  { id: "PL-027", date: new Date("2026-05-25"), weight: 45, source: "Collecte CL-036", quality: "Sélectionné", used: false },
  { id: "PL-028", date: new Date("2026-05-22"), weight: 70, source: "Collecte CL-035", quality: "Mixte", used: false },
  { id: "PL-029", date: new Date("2026-05-20"), weight: 55, source: "Collecte CL-033", quality: "Standard", used: true },
  { id: "PL-030", date: new Date("2026-05-18"), weight: 100, source: "Collecte CL-031", quality: "Sélectionné", used: false },
]

const qualityBadge: Record<string, "default" | "secondary" | "outline"> = {
  Sélectionné: "default",
  Mixte: "secondary",
  Standard: "outline",
}

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

export default function AdminStockPage() {
  const [stock, setStock] = useState<StockEntry[]>(sampleStock)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<StockEntry | null>(null)
  const [formData, setFormData] = useState({
    weight: "",
    source: "",
    quality: "",
    notes: "",
  })

  const totalStock = stock.reduce((sum, e) => sum + e.weight, 0)
  const entriesThisMonth = stock.filter(
    (e) => e.date.getMonth() === new Date().getMonth() && e.date.getFullYear() === new Date().getFullYear()
  )
  const totalIn = entriesThisMonth.reduce((sum, e) => sum + e.weight, 0)
  const totalOut = stock.filter((e) => e.used).reduce((sum, e) => sum + e.weight, 0)

  const stats = [
    { label: "Total stock", value: `${formatNumber(totalStock)} kg`, icon: Warehouse, change: "", color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Entrées ce mois", value: `${formatNumber(totalIn)} kg`, icon: ArrowDown, change: "+12%", color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: "Sorties ce mois", value: `${formatNumber(totalOut)} kg`, icon: ArrowUp, change: "", color: "text-amber-600", bg: "bg-amber-100" },
  ]

  function handleAddStock() {
    const newEntry: StockEntry = {
      id: `PL-${String(stock.length + 1).padStart(3, "0")}`,
      date: new Date(),
      weight: parseFloat(formData.weight),
      source: formData.source,
      quality: formData.quality,
      used: false,
      notes: formData.notes || undefined,
    }
    setStock([newEntry, ...stock])
    setFormData({ weight: "", source: "", quality: "", notes: "" })
    setDialogOpen(false)
  }

  function openDetail(entry: StockEntry) {
    setSelectedEntry(entry)
    setDetailOpen(true)
  }

  function handleDelete(id: string) {
    setStock(stock.filter((e) => e.id !== id))
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Stock de Plastique</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {stock.length} entrées enregistrées dans le stock
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogClose render={<Button className="gap-2" />}>
            <Plus className="size-4" />
            Ajouter du stock
          </DialogClose>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Ajouter du stock</DialogTitle>
              <DialogDescription>
                Enregistrez une nouvelle entrée de plastique dans le stock.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Poids (kg)</label>
                <Input
                  type="number"
                  placeholder="Ex: 50"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Source</label>
                <Input
                  placeholder="Ex: Collecte CL-042"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Qualité</label>
                <Select
                  value={formData.quality}
                  onValueChange={(v) => setFormData({ ...formData, quality: v ?? "" })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner la qualité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sélectionné">Sélectionné</SelectItem>
                    <SelectItem value="Mixte">Mixte</SelectItem>
                    <SelectItem value="Standard">Standard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  placeholder="Notes optionnelles..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter showCloseButton>
              <DialogClose render={<Button variant="outline" />}>
                Annuler
              </DialogClose>
              <Button onClick={handleAddStock} disabled={!formData.weight || !formData.source || !formData.quality}>
                Ajouter au stock
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 grid-cols-3">
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
            <CardTitle>Entrées de stock</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N°</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Poids</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Qualité</TableHead>
                  <TableHead>Utilisé</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stock.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      Aucune entrée de stock trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  stock.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium text-xs">{entry.id}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(entry.date)}</TableCell>
                      <TableCell>{entry.weight} kg</TableCell>
                      <TableCell className="max-w-[180px] truncate">{entry.source}</TableCell>
                      <TableCell>
                        <Badge variant={qualityBadge[entry.quality]}>{entry.quality}</Badge>
                      </TableCell>
                      <TableCell>
                        {entry.used ? (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <ArrowUpRight className="size-3 text-amber-500" />
                            Utilisé
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-emerald-600">
                            <ArrowDown className="size-3" />
                            Disponible
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon-sm" onClick={() => openDetail(entry)}>
                            <Eye className="size-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(entry.id)}>
                            <Trash2 className="size-3.5 text-destructive" />
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
            <DialogTitle>Détails du stock</DialogTitle>
            <DialogDescription>
              {selectedEntry && <>Informations complètes pour {selectedEntry.id}</>}
            </DialogDescription>
          </DialogHeader>
          {selectedEntry && (
            <div className="flex flex-col gap-4 py-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">N° de lot</p>
                  <p className="text-sm font-medium">{selectedEntry.id}</p>
                </div>
                <Badge variant={selectedEntry.used ? "secondary" : "default"}>
                  {selectedEntry.used ? "Utilisé" : "Disponible"}
                </Badge>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Date de réception</p>
                  <p className="text-sm font-medium">{formatDate(selectedEntry.date)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Poids</p>
                  <p className="text-sm font-medium">{selectedEntry.weight} kg</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Source</p>
                  <p className="text-sm font-medium">{selectedEntry.source}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Qualité</p>
                  <Badge variant={qualityBadge[selectedEntry.quality]}>{selectedEntry.quality}</Badge>
                </div>
              </div>
              {selectedEntry.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm text-muted-foreground">{selectedEntry.notes}</p>
                  </div>
                </>
              )}
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-2">Lots de production associés</p>
                <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
                  {selectedEntry.used ? (
                    <div className="flex items-center gap-2">
                      <Package className="size-4" />
                      <span>Utilisé dans la production</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Warehouse className="size-4" />
                      <span>Disponible pour la production</span>
                    </div>
                  )}
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
