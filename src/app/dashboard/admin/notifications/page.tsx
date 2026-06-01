"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  Bell,
  Info,
  CheckCircle,
  AlertTriangle,
  Users,
  User,
  Trash2,
  ArrowUpRight,
} from "lucide-react"
import { cn, formatDate } from "@/lib/utils"

type NotificationType = "INFO" | "SUCCESS" | "WARNING"

type NotificationEntry = {
  id: string
  date: Date
  recipient: string
  title: string
  message: string
  type: NotificationType
  read: boolean
}

const typeLabels: Record<NotificationType, string> = {
  INFO: "Information",
  SUCCESS: "Succès",
  WARNING: "Avertissement",
}

const typeColors: Record<NotificationType, "default" | "default" | "secondary"> = {
  INFO: "default",
  SUCCESS: "default",
  WARNING: "secondary",
}

const typeIcons: Record<NotificationType, typeof Info> = {
  INFO: Info,
  SUCCESS: CheckCircle,
  WARNING: AlertTriangle,
}

const typeIconColors: Record<NotificationType, string> = {
  INFO: "text-blue-500",
  SUCCESS: "text-emerald-500",
  WARNING: "text-amber-500",
}

const sampleNotifications: NotificationEntry[] = [
  { id: "N-001", date: new Date("2026-06-01"), recipient: "Tous", title: "Nouvelle gamme disponible", message: "Découvrez notre nouvelle gamme de pavés premium.", type: "INFO", read: false },
  { id: "N-002", date: new Date("2026-05-31"), recipient: "Clients", title: "Votre commande est expédiée", message: "Votre commande CMD-109 a été expédiée.", type: "SUCCESS", read: false },
  { id: "N-003", date: new Date("2026-05-30"), recipient: "Collecteurs", title: "Rappel collecte", message: "Vous avez des collectes programmées cette semaine.", type: "WARNING", read: true },
  { id: "N-004", date: new Date("2026-05-29"), recipient: "Tous", title: "Maintenance plateforme", message: "La plateforme sera en maintenance le 2 juin.", type: "WARNING", read: true },
  { id: "N-005", date: new Date("2026-05-28"), recipient: "Clients", title: "Points doublés ce mois", message: "Gagnez le double de points sur chaque collecte.", type: "SUCCESS", read: true },
  { id: "N-006", date: new Date("2026-05-27"), recipient: "Utilisateur spécifique", title: "Bienvenue sur Néko", message: "Merci de votre inscription sur notre plateforme.", type: "INFO", read: true },
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

const defaultForm = {
  recipient: "",
  specificUser: "",
  title: "",
  message: "",
  type: "INFO" as NotificationType,
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationEntry[]>(sampleNotifications)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState(defaultForm)

  const unreadCount = notifications.filter((n) => !n.read).length

  function handleSend() {
    const recipientLabel =
      formData.recipient === "specific" ? formData.specificUser :
      formData.recipient === "all" ? "Tous" :
      formData.recipient === "clients" ? "Clients" : "Collecteurs"

    const newNotification: NotificationEntry = {
      id: `N-${String(notifications.length + 1).padStart(3, "0")}`,
      date: new Date(),
      recipient: recipientLabel,
      title: formData.title,
      message: formData.message,
      type: formData.type,
      read: false,
    }
    setNotifications([newNotification, ...notifications])
    setFormData(defaultForm)
    setDialogOpen(false)
  }

  function handleDelete(id: string) {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {unreadCount} notification{unreadCount > 1 ? "s" : ""} non lue{unreadCount > 1 ? "s" : ""}
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogClose render={<Button className="gap-2" />}>
            <Plus className="size-4" />
            Nouvelle notification
          </DialogClose>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nouvelle notification</DialogTitle>
              <DialogDescription>
                Envoyez une notification aux utilisateurs de la plateforme.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Destinataire</label>
                <Select
                  value={formData.recipient}
                  onValueChange={(v) => setFormData({ ...formData, recipient: v ?? "" })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choisir le destinataire" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="clients">Clients</SelectItem>
                    <SelectItem value="collectors">Collecteurs</SelectItem>
                    <SelectItem value="specific">Utilisateur spécifique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.recipient === "specific" && (
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium">Nom d'utilisateur</label>
                  <Input
                    value={formData.specificUser}
                    onChange={(e) => setFormData({ ...formData, specificUser: e.target.value })}
                    placeholder="Ex: Fatou Diop"
                  />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Titre</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Titre de la notification"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                  placeholder="Contenu du message..."
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Type</label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => setFormData({ ...formData, type: (v ?? "INFO") as NotificationType })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INFO">Information</SelectItem>
                    <SelectItem value="SUCCESS">Succès</SelectItem>
                    <SelectItem value="WARNING">Avertissement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter showCloseButton>
              <DialogClose render={<Button variant="outline" />}>
                Annuler
              </DialogClose>
              <Button onClick={handleSend} disabled={!formData.title || !formData.message || !formData.recipient}>
                Envoyer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Historique des notifications</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N°</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Destinataire</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      Aucune notification trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  notifications.map((notification) => {
                    const TypeIcon = typeIcons[notification.type]
                    return (
                      <TableRow key={notification.id}>
                        <TableCell className="font-medium text-xs">{notification.id}</TableCell>
                        <TableCell className="text-muted-foreground">{formatDate(notification.date)}</TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1.5 text-sm">
                            {notification.recipient === "Tous" ? (
                              <Users className="size-3.5 text-muted-foreground" />
                            ) : (
                              <User className="size-3.5 text-muted-foreground" />
                            )}
                            {notification.recipient}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{notification.title}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">{notification.message}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={typeColors[notification.type]}>
                            <TypeIcon className={cn("size-3 mr-1", typeIconColors[notification.type])} />
                            {typeLabels[notification.type]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "size-2 rounded-full",
                                notification.read ? "bg-muted-foreground" : "bg-blue-500"
                              )}
                            />
                            <span className="text-xs text-muted-foreground">
                              {notification.read ? "Lu" : "Non lu"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(notification.id)}>
                              <Trash2 className="size-3.5 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
