"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  MapPin,
  Clock,
  Weight,
  Trash2,
  CheckCircle,
  Play,
  XCircle,
  Camera,
  PenLine,
  FileText,
  Upload,
  Check,
} from "lucide-react"
import { cn, formatDate, formatNumber } from "@/lib/utils"
import { useDropzone } from "react-dropzone"

type MissionStatus = "AVAILABLE" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"

type Mission = {
  id: string
  address: string
  wasteType: string
  estimatedWeight: number
  status: MissionStatus
  scheduledDate: Date
  clientName: string
  clientPhone: string
}

const initialMissions: Mission[] = [
  { id: "1", address: "15 Rue des Lilas, Dakar", wasteType: "Plastique noir", estimatedWeight: 8, status: "AVAILABLE", scheduledDate: new Date("2026-06-02"), clientName: "Fatou Diop", clientPhone: "+221 77 123 45 67" },
  { id: "2", address: "42 Avenue Cheikh Anta Diop", wasteType: "Plastique blanc", estimatedWeight: 5, status: "AVAILABLE", scheduledDate: new Date("2026-06-02"), clientName: "Moussa Ndiaye", clientPhone: "+221 76 234 56 78" },
  { id: "3", address: "8 Rue de la République", wasteType: "Plastique mixte", estimatedWeight: 12, status: "ASSIGNED", scheduledDate: new Date("2026-06-01"), clientName: "Aminata Fall", clientPhone: "+221 77 345 67 89" },
  { id: "4", address: "27 Boulevard du Sud", wasteType: "Plastique noir", estimatedWeight: 6, status: "IN_PROGRESS", scheduledDate: new Date("2026-06-01"), clientName: "Omar Sow", clientPhone: "+221 76 456 78 90" },
  { id: "5", address: "3 Cité des Eaux", wasteType: "PET", estimatedWeight: 10, status: "COMPLETED", scheduledDate: new Date("2026-05-30"), clientName: "Mariam Ba", clientPhone: "+221 77 567 89 01" },
  { id: "6", address: "12 Rue du Fleuve", wasteType: "Plastique noir", estimatedWeight: 7, status: "COMPLETED", scheduledDate: new Date("2026-05-29"), clientName: "Ibrahima Diallo", clientPhone: "+221 76 678 90 12" },
  { id: "7", address: "5 Place de l'Indépendance", wasteType: "Plastique blanc", estimatedWeight: 4, status: "CANCELLED", scheduledDate: new Date("2026-05-28"), clientName: "Aïcha Gueye", clientPhone: "+221 77 789 01 23" },
  { id: "8", address: "19 Rue Docteur Thèze", wasteType: "Plastique mixte", estimatedWeight: 15, status: "AVAILABLE", scheduledDate: new Date("2026-06-03"), clientName: "Cheikh Mbaye", clientPhone: "+221 76 890 12 34" },
]

const statusConfig: Record<MissionStatus, { label: string; color: "default" | "secondary" | "destructive" | "outline" }> = {
  AVAILABLE: { label: "Disponible", color: "outline" },
  ASSIGNED: { label: "Assignée", color: "secondary" },
  IN_PROGRESS: { label: "En cours", color: "default" },
  COMPLETED: { label: "Terminée", color: "default" },
  CANCELLED: { label: "Annulée", color: "destructive" },
}

type CompletionData = {
  photoProof: string | null
  actualWeight: number
  clientSignature: string
  notes: string
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const cardItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function CollectorMissionsPage() {
  const [missions, setMissions] = useState<Mission[]>(initialMissions)
  const [activeTab, setActiveTab] = useState("all")
  const [completionOpen, setCompletionOpen] = useState(false)
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)
  const [completionData, setCompletionData] = useState<CompletionData>({
    photoProof: null,
    actualWeight: 0,
    clientSignature: "",
    notes: "",
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setCompletionData((prev) => ({ ...prev, photoProof: e.target?.result as string }))
        }
        reader.readAsDataURL(acceptedFiles[0])
      }
    },
  })

  const filteredMissions = missions.filter((m) => {
    if (activeTab === "all") return true
    if (activeTab === "available") return m.status === "AVAILABLE"
    if (activeTab === "in_progress") return m.status === "ASSIGNED" || m.status === "IN_PROGRESS"
    if (activeTab === "completed") return m.status === "COMPLETED"
    return true
  })

  const handleAccept = (id: string) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "ASSIGNED" as MissionStatus } : m))
    )
  }

  const handleStart = (id: string) => {
    setMissions((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: "IN_PROGRESS" as MissionStatus } : m))
    )
  }

  const openCompletion = (mission: Mission) => {
    setSelectedMission(mission)
    setCompletionData({ photoProof: null, actualWeight: mission.estimatedWeight, clientSignature: "", notes: "" })
    setCompletionOpen(true)
  }

  const handleComplete = () => {
    if (!selectedMission) return
    setMissions((prev) =>
      prev.map((m) => (m.id === selectedMission.id ? { ...m, status: "COMPLETED" as MissionStatus } : m))
    )
    setCompletionOpen(false)
    setSelectedMission(null)
  }

  const renderActionButton = (mission: Mission) => {
    switch (mission.status) {
      case "AVAILABLE":
        return (
          <Button size="sm" className="gap-1.5" onClick={() => handleAccept(mission.id)}>
            <Check className="size-3.5" />
            Accepter
          </Button>
        )
      case "ASSIGNED":
        return (
          <Button size="sm" className="gap-1.5" onClick={() => handleStart(mission.id)}>
            <Play className="size-3.5" />
            Démarrer
          </Button>
        )
      case "IN_PROGRESS":
        return (
          <Button size="sm" variant="default" className="gap-1.5" onClick={() => openCompletion(mission)}>
            <CheckCircle className="size-3.5" />
            Terminer
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={cardItem}>
        <h1 className="text-2xl font-semibold tracking-tight">Mes missions</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gérez vos missions de collecte
        </p>
      </motion.div>

      <motion.div variants={cardItem}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="available">Disponibles</TabsTrigger>
            <TabsTrigger value="in_progress">En cours</TabsTrigger>
            <TabsTrigger value="completed">Terminées</TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      <motion.div variants={cardItem} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredMissions.map((mission) => {
            const config = statusConfig[mission.status]
            return (
              <motion.div
                key={mission.id}
                layout
                variants={cardItem}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-sm font-medium leading-snug">
                        {mission.address}
                      </CardTitle>
                      <Badge variant={config.color} className="shrink-0">
                        {config.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Trash2 className="size-3" />
                        {mission.wasteType}
                      </span>
                      <span className="flex items-center gap-1">
                        <Weight className="size-3" />
                        {mission.estimatedWeight} kg
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3" />
                        {mission.clientName}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {formatDate(mission.scheduledDate)}
                      </span>
                    </div>
                    <div className="pt-2 border-t flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{mission.clientPhone}</span>
                      {renderActionButton(mission)}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>

      {filteredMissions.length === 0 && (
        <motion.div variants={cardItem} className="flex flex-col items-center justify-center py-16 text-center">
          <CheckCircle className="size-12 text-muted-foreground/40 mb-4" />
          <p className="text-sm font-medium text-muted-foreground">Aucune mission</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Aucune mission ne correspond à ce filtre
          </p>
        </motion.div>
      )}

      <Dialog open={completionOpen} onOpenChange={setCompletionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Terminer la mission</DialogTitle>
            <DialogDescription>
              {selectedMission?.address} — {selectedMission?.wasteType}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Photo preuve
              </label>
              <div
                {...getRootProps()}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors cursor-pointer",
                  isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/30"
                )}
              >
                <input {...getInputProps()} />
                {completionData.photoProof ? (
                  <div className="relative w-full">
                    <img
                      src={completionData.photoProof}
                      alt="Preuve"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="absolute top-1 right-1 bg-background/80"
                      onClick={() => setCompletionData((prev) => ({ ...prev, photoProof: null }))}
                    >
                      <XCircle className="size-3.5" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Camera className="size-6 text-muted-foreground/60" />
                    <p className="text-xs text-muted-foreground text-center">
                      {isDragActive
                        ? "Déposez la photo ici"
                        : "Glissez une photo ou cliquez pour sélectionner"}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Poids réel (kg)
              </label>
              <Input
                type="number"
                min={0}
                step={0.5}
                value={completionData.actualWeight || ""}
                onChange={(e) =>
                  setCompletionData((prev) => ({ ...prev, actualWeight: parseFloat(e.target.value) || 0 }))
                }
                placeholder="0"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Signature du client
              </label>
              <div className="relative">
                <PenLine className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                <Input
                  className="pl-7"
                  value={completionData.clientSignature}
                  onChange={(e) =>
                    setCompletionData((prev) => ({ ...prev, clientSignature: e.target.value }))
                  }
                  placeholder="Nom du client"
                />
              </div>
              <p className="text-[10px] text-muted-foreground/60 mt-1">
                Saisissez le nom du client pour validation
              </p>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Notes
              </label>
              <Textarea
                value={completionData.notes}
                onChange={(e) =>
                  setCompletionData((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Observations éventuelles..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button
              onClick={handleComplete}
              disabled={!completionData.actualWeight || !completionData.clientSignature}
              className="gap-1.5"
            >
              <CheckCircle className="size-4" />
              Valider la mission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
