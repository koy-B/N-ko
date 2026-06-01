"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Recycle, MapPin, Calendar, Weight, Trash2 } from "lucide-react"
import { cn, formatDate } from "@/lib/utils"
import Link from "next/link"

type CollectionStatus = "ALL" | "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED"

const statusTabs = [
  { value: "ALL" as const, label: "Toutes" },
  { value: "PENDING" as const, label: "En attente" },
  { value: "ASSIGNED" as const, label: "Assignées" },
  { value: "IN_PROGRESS" as const, label: "En cours" },
  { value: "COMPLETED" as const, label: "Terminées" },
]

const collections = [
  { id: "1", date: new Date("2026-05-28"), address: "15 Rue des Lilas, Dakar", type: "Plastique noir", weight: 8, status: "COMPLETED" as const },
  { id: "2", date: new Date("2026-05-25"), address: "15 Rue des Lilas, Dakar", type: "Plastique blanc", weight: 3, status: "PENDING" as const },
  { id: "3", date: new Date("2026-05-22"), address: "15 Rue des Lilas, Dakar", type: "Plastique mixte", weight: 6, status: "ASSIGNED" as const },
  { id: "4", date: new Date("2026-05-20"), address: "15 Rue des Lilas, Dakar", type: "Plastique noir", weight: 5, status: "IN_PROGRESS" as const },
  { id: "5", date: new Date("2026-05-18"), address: "15 Rue des Lilas, Dakar", type: "Plastique blanc", weight: 10, status: "COMPLETED" as const },
  { id: "6", date: new Date("2026-05-15"), address: "15 Rue des Lilas, Dakar", type: "Autre", weight: 2, status: "CANCELLED" as const },
  { id: "7", date: new Date("2026-05-12"), address: "15 Rue des Lilas, Dakar", type: "Plastique noir", weight: 12, status: "COMPLETED" as const },
  { id: "8", date: new Date("2026-05-10"), address: "15 Rue des Lilas, Dakar", type: "Plastique mixte", weight: 4, status: "PENDING" as const },
]

const statusLabels: Record<string, string> = {
  PENDING: "En attente",
  ASSIGNED: "Assignée",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
}

const statusBadgeColors: Record<string, "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"> = {
  PENDING: "outline",
  ASSIGNED: "secondary",
  IN_PROGRESS: "default",
  COMPLETED: "default",
  CANCELLED: "destructive",
}

const typeIcons: Record<string, string> = {
  "Plastique noir": "bg-gray-100 text-gray-700",
  "Plastique blanc": "bg-blue-100 text-blue-700",
  "Plastique mixte": "bg-amber-100 text-amber-700",
  "Autre": "bg-purple-100 text-purple-700",
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const cardItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

export default function CollectionsPage() {
  const [activeTab, setActiveTab] = useState<CollectionStatus>("ALL")

  const filtered = activeTab === "ALL"
    ? collections
    : collections.filter((c) => c.status === activeTab)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mes collectes</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez vos demandes de collecte de déchets plastiques
          </p>
        </div>
        <Link href="/dashboard/client/collections/new">
          <Button className="gap-2">
            <Plus className="size-4" />
            Nouvelle demande
          </Button>
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as CollectionStatus)}>
        <TabsList>
          {statusTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={container}
          initial="hidden"
          animate="show"
          exit={{ opacity: 0, y: -10 }}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((collection) => (
            <motion.div key={collection.id} variants={cardItem} layout>
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={cn("flex items-center gap-2 rounded-full px-2.5 py-0.5 text-xs font-medium", typeIcons[collection.type] || "bg-muted text-muted-foreground")}>
                      <Recycle className="size-3" />
                      {collection.type}
                    </div>
                    <Badge variant={statusBadgeColors[collection.status]}>
                      {statusLabels[collection.status]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="size-3.5 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground truncate">{collection.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="size-3.5 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">{formatDate(collection.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Weight className="size-3.5 text-muted-foreground shrink-0" />
                    <span className="font-medium">{collection.weight} kg</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Trash2 className="size-12 text-muted-foreground/40 mb-4" />
          <p className="text-sm font-medium text-muted-foreground">Aucune collecte trouvée</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Créez une nouvelle demande pour commencer
          </p>
        </div>
      )}
    </div>
  )
}
