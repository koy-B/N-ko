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
  Search,
  Eye,
  UserCheck,
  MapPin,
  Weight,
  Calendar,
  Clock,
  Phone,
  Mail,
} from "lucide-react"
import { cn, formatDate } from "@/lib/utils"

type CollectionStatus = "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"

type CollectionData = {
  id: string
  date: Date
  client: string
  clientEmail: string
  clientPhone: string
  address: string
  wasteType: string
  weight: number
  status: CollectionStatus
  collector: string | null
  comment?: string
}

const statusLabels: Record<CollectionStatus, string> = {
  PENDING: "En attente",
  ASSIGNED: "Assignée",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
}

const statusColors: Record<CollectionStatus, "outline" | "secondary" | "default" | "default" | "destructive"> = {
  PENDING: "outline",
  ASSIGNED: "secondary",
  IN_PROGRESS: "default",
  COMPLETED: "default",
  CANCELLED: "destructive",
}

const statusDotColors: Record<CollectionStatus, string> = {
  PENDING: "bg-amber-500",
  ASSIGNED: "bg-blue-500",
  IN_PROGRESS: "bg-purple-500",
  COMPLETED: "bg-emerald-500",
  CANCELLED: "bg-muted-foreground",
}

const collectors = [
  { id: "c1", name: "Mamadou Fall" },
  { id: "c2", name: "Oumar Diallo" },
  { id: "c3", name: "Cheikh Thioune" },
  { id: "c4", name: "Aïcha Ba" },
]

const sampleCollections: CollectionData[] = [
  { id: "CL-042", date: new Date("2026-06-01"), client: "Fatou Diop", clientEmail: "fatou.diop@email.com", clientPhone: "+221 77 123 45 67", address: "15 Rue des Lilas, Dakar", wasteType: "Plastique noir", weight: 12, status: "COMPLETED", collector: "Mamadou Fall" },
  { id: "CL-043", date: new Date("2026-06-01"), client: "Aminata Sow", clientEmail: "aminata.sow@email.com", clientPhone: "+221 77 345 67 89", address: "8 Avenue de la République, Dakar", wasteType: "Plastique blanc", weight: 8, status: "IN_PROGRESS", collector: "Oumar Diallo" },
  { id: "CL-044", date: new Date("2026-05-31"), client: "Ndeye Ndiaye", clientEmail: "ndeye.ndiaye@email.com", clientPhone: "+221 76 567 89 01", address: "22 Rue du Marché, Thiès", wasteType: "Plastique mixte", weight: 15, status: "ASSIGNED", collector: "Cheikh Thioune" },
  { id: "CL-045", date: new Date("2026-05-31"), client: "Marième Sy", clientEmail: "marieme.sy@email.com", clientPhone: "+221 77 901 23 45", address: "5 Rue de la Paix, Saint-Louis", wasteType: "Plastique noir", weight: 6, status: "PENDING", collector: null },
  { id: "CL-046", date: new Date("2026-05-30"), client: "Ibrahima Kane", clientEmail: "ibrahima.kane@email.com", clientPhone: "+221 77 678 90 12", address: "12 Rue de l'Afrique, Dakar", wasteType: "Plastique blanc", weight: 20, status: "PENDING", collector: null },
  { id: "CL-047", date: new Date("2026-05-30"), client: "Aïcha Ba", clientEmail: "aicha.ba@email.com", clientPhone: "+221 70 789 01 23", address: "3 Rue du Fleuve, Kaolack", wasteType: "Plastique noir", weight: 10, status: "CANCELLED", collector: null },
  { id: "CL-048", date: new Date("2026-05-29"), client: "Papa Sarr", clientEmail: "papa.sarr@email.com", clientPhone: "+221 70 012 34 56", address: "18 Rue des Acacias, Dakar", wasteType: "Plastique mixte", weight: 7, status: "COMPLETED", collector: "Mamadou Fall" },
  { id: "CL-049", date: new Date("2026-05-29"), client: "Fatou Diop", clientEmail: "fatou.diop@email.com", clientPhone: "+221 77 123 45 67", address: "15 Rue des Lilas, Dakar", wasteType: "Plastique noir", weight: 5, status: "ASSIGNED", collector: "Aïcha Ba" },
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

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<CollectionData[]>(sampleCollections)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState<CollectionData | null>(null)
  const [selectedCollector, setSelectedCollector] = useState("")
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [detailCollection, setDetailCollection] = useState<CollectionData | null>(null)

  const filteredCollections = collections.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "pending" && c.status === "PENDING") ||
      (activeTab === "assigned" && c.status === "ASSIGNED") ||
      (activeTab === "in_progress" && c.status === "IN_PROGRESS") ||
      (activeTab === "completed" && c.status === "COMPLETED") ||
      (activeTab === "cancelled" && c.status === "CANCELLED")
    return matchesSearch && matchesTab
  })

  function openAssignDialog(collection: CollectionData) {
    setSelectedCollection(collection)
    setSelectedCollector("")
    setAssignDialogOpen(true)
  }

  function handleAssign() {
    if (!selectedCollection || !selectedCollector) return
    const collectorName = collectors.find((c) => c.id === selectedCollector)?.name || ""
    setCollections(
      collections.map((c) =>
        c.id === selectedCollection.id ? { ...c, status: "ASSIGNED" as CollectionStatus, collector: collectorName } : c
      )
    )
    setAssignDialogOpen(false)
    setSelectedCollection(null)
    setSelectedCollector("")
  }

  function openDetailDialog(collection: CollectionData) {
    setDetailCollection(collection)
    setDetailDialogOpen(true)
  }

  const countByStatus = (status: string) => {
    if (status === "all") return collections.length
    return collections.filter((c) => c.status === status).length
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-semibold tracking-tight">Gestion des collectes</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {collections.length} collectes enregistrées sur la plateforme
        </p>
      </motion.div>

      <motion.div variants={item} className="flex flex-col gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">
                Toutes
                <Badge variant="secondary" className="ml-1.5">{countByStatus("all")}</Badge>
              </TabsTrigger>
              <TabsTrigger value="pending">
                En attente
                <Badge variant="secondary" className="ml-1.5">{countByStatus("PENDING")}</Badge>
              </TabsTrigger>
              <TabsTrigger value="assigned">
                Assignées
                <Badge variant="secondary" className="ml-1.5">{countByStatus("ASSIGNED")}</Badge>
              </TabsTrigger>
              <TabsTrigger value="in_progress">
                En cours
                <Badge variant="secondary" className="ml-1.5">{countByStatus("IN_PROGRESS")}</Badge>
              </TabsTrigger>
              <TabsTrigger value="completed">
                Terminées
                <Badge variant="secondary" className="ml-1.5">{countByStatus("COMPLETED")}</Badge>
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Annulées
                <Badge variant="secondary" className="ml-1.5">{countByStatus("CANCELLED")}</Badge>
              </TabsTrigger>
            </TabsList>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Rechercher une collecte..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>N°</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Adresse</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Poids</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Collecteur</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCollections.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                          Aucune collecte trouvée
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredCollections.map((collection) => (
                        <TableRow
                          key={collection.id}
                          className="cursor-pointer"
                          onClick={() => openDetailDialog(collection)}
                        >
                          <TableCell className="font-medium text-xs">{collection.id}</TableCell>
                          <TableCell className="text-muted-foreground">{formatDate(collection.date)}</TableCell>
                          <TableCell>
                            <span className="font-medium">{collection.client}</span>
                          </TableCell>
                          <TableCell className="text-muted-foreground max-w-[160px] truncate">
                            {collection.address}
                          </TableCell>
                          <TableCell>{collection.wasteType}</TableCell>
                          <TableCell>{collection.weight} kg</TableCell>
                          <TableCell>
                            <Badge variant={statusColors[collection.status]}>
                              <span className={cn("size-1.5 rounded-full mr-1.5", statusDotColors[collection.status])} />
                              {statusLabels[collection.status]}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {collection.collector || "—"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => openDetailDialog(collection)}
                              >
                                <Eye className="size-3.5" />
                              </Button>
                              {(collection.status === "PENDING" || collection.status === "ASSIGNED") && (
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() => openAssignDialog(collection)}
                                >
                                  <UserCheck className="size-3.5" />
                                </Button>
                              )}
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

      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assigner un collecteur</DialogTitle>
            <DialogDescription>
              {selectedCollection && (
                <>Sélectionnez un collecteur pour la demande {selectedCollection.id}</>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedCollection && (
            <div className="flex flex-col gap-4 py-2">
              <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">N°</span>
                  <span className="font-medium">{selectedCollection.id}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Client</span>
                  <span className="font-medium">{selectedCollection.client}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Adresse</span>
                  <span className="font-medium text-right max-w-[200px] truncate">{selectedCollection.address}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Poids estimé</span>
                  <span className="font-medium">{selectedCollection.weight} kg</span>
                </div>
              </div>
              <Separator />
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Collecteur</label>
                <Select value={selectedCollector} onValueChange={(v) => setSelectedCollector(v ?? "")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choisir un collecteur" />
                  </SelectTrigger>
                  <SelectContent>
                    {collectors.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter showCloseButton>
            <DialogClose render={<Button variant="outline" />}>
              Annuler
            </DialogClose>
            <Button onClick={handleAssign} disabled={!selectedCollector}>
              Assigner
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Détails de la collecte</DialogTitle>
            <DialogDescription>
              {detailCollection && <>Informations complètes pour {detailCollection.id}</>}
            </DialogDescription>
          </DialogHeader>
          {detailCollection && (
            <div className="flex flex-col gap-4 py-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">N° de collecte</p>
                  <p className="text-sm font-medium">{detailCollection.id}</p>
                </div>
                <Badge variant={statusColors[detailCollection.status]}>
                  <span className={cn("size-1.5 rounded-full mr-1.5", statusDotColors[detailCollection.status])} />
                  {statusLabels[detailCollection.status]}
                </Badge>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <Calendar className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="text-sm font-medium">{formatDate(detailCollection.date)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Weight className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Poids</p>
                    <p className="text-sm font-medium">{detailCollection.weight} kg</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Adresse</p>
                    <p className="text-sm font-medium">{detailCollection.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Type de déchet</p>
                    <p className="text-sm font-medium">{detailCollection.wasteType}</p>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-2">Client</p>
                <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{detailCollection.client}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="size-3" /> {detailCollection.clientEmail}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="size-3" /> {detailCollection.clientPhone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {detailCollection.collector && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Collecteur assigné</p>
                  <div className="flex items-center gap-2 text-sm">
                    <UserCheck className="size-4 text-muted-foreground" />
                    <span className="font-medium">{detailCollection.collector}</span>
                  </div>
                </div>
              )}
              {detailCollection.comment && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Commentaire</p>
                  <p className="text-sm text-muted-foreground">{detailCollection.comment}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
