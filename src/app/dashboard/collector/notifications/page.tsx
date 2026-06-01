"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCheck,
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  MapPin,
  Calendar,
  Wallet,
  Award,
} from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

type Notification = {
  id: string
  title: string
  message: string
  type: "SUCCESS" | "INFO" | "ASSIGNMENT" | "ALERT"
  read: boolean
  createdAt: Date
  link?: string
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Nouvelle mission disponible",
    message: "Une collecte de 8 kg de plastique noir vous a été assignée au 15 Rue des Lilas, Dakar.",
    type: "ASSIGNMENT",
    read: false,
    createdAt: new Date("2026-06-01T09:30:00"),
    link: "/dashboard/collector/missions",
  },
  {
    id: "2",
    title: "Mission en cours",
    message: "Vous avez une mission en cours au 27 Boulevard du Sud. Pensez à la terminer.",
    type: "INFO",
    read: false,
    createdAt: new Date("2026-06-01T08:15:00"),
    link: "/dashboard/collector/missions",
  },
  {
    id: "3",
    title: "Paiement reçu",
    message: `Votre paiement de ${formatPrice(4000)} pour la mission du 28 mai a été confirmé.`,
    type: "SUCCESS",
    read: false,
    createdAt: new Date("2026-05-29T14:00:00"),
    link: "/dashboard/collector/earnings",
  },
  {
    id: "4",
    title: "Rappel de mission",
    message: "Vous avez une collecte prévue demain à 8 Rue de la République. Soyez à l'heure.",
    type: "ALERT",
    read: true,
    createdAt: new Date("2026-05-31T07:00:00"),
    link: "/dashboard/collector/missions",
  },
  {
    id: "5",
    title: "Mission terminée",
    message: "La collecte au 3 Cité des Eaux (10 kg) a été complétée avec succès.",
    type: "SUCCESS",
    read: true,
    createdAt: new Date("2026-05-30T16:45:00"),
    link: "/dashboard/collector/missions",
  },
  {
    id: "6",
    title: "Prime de performance",
    message: "Félicitations ! Vous avez atteint le seuil de 50 missions et recevez une prime de 10 000 F.",
    type: "SUCCESS",
    read: true,
    createdAt: new Date("2026-05-28T10:00:00"),
    link: "/dashboard/collector/earnings",
  },
  {
    id: "7",
    title: "Nouveau secteur disponible",
    message: "Des missions sont désormais disponibles dans le secteur de Ouakam. Consultez les missions disponibles.",
    type: "INFO",
    read: true,
    createdAt: new Date("2026-05-25T12:30:00"),
    link: "/dashboard/collector/missions",
  },
  {
    id: "8",
    title: "Bienvenue chez Néko",
    message: "Merci de rejoindre l'équipe Néko en tant que collecteur. Vous recevrez vos premières missions sous peu !",
    type: "INFO",
    read: true,
    createdAt: new Date("2026-04-01T09:00:00"),
  },
]

const typeConfig = {
  SUCCESS: { icon: CheckCircle, bg: "bg-emerald-100", color: "text-emerald-600", label: "Succès" },
  INFO: { icon: Info, bg: "bg-blue-100", color: "text-blue-600", label: "Information" },
  ASSIGNMENT: { icon: MapPin, bg: "bg-purple-100", color: "text-purple-600", label: "Mission" },
  ALERT: { icon: AlertCircle, bg: "bg-amber-100", color: "text-amber-600", label: "Alerte" },
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const notificationItem = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 },
}

export default function CollectorNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    )
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {unreadCount > 0
              ? `Vous avez ${unreadCount} notification${unreadCount > 1 ? "s" : ""} non lue${unreadCount > 1 ? "s" : ""}`
              : "Toutes les notifications sont lues"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" className="gap-2" onClick={markAllAsRead}>
            <CheckCheck className="size-4" />
            Tout marquer comme lu
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="p-0 divide-y">
          <AnimatePresence>
            {notifications.map((notification) => {
              const config = typeConfig[notification.type]
              const Icon = config.icon
              return (
                <motion.div
                  key={notification.id}
                  variants={notificationItem}
                  layout
                  initial={false}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  className={cn(
                    "flex items-start gap-4 p-4 transition-colors cursor-pointer",
                    !notification.read && "bg-primary/[0.02]",
                    "hover:bg-muted/50"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className={cn("flex size-9 items-center justify-center rounded-full shrink-0 mt-0.5", config.bg)}>
                    <Icon className={cn("size-4", config.color)} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={cn("text-sm", !notification.read && "font-medium")}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="size-2 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      {formatDistanceToNow(notification.createdAt, { addSuffix: true, locale: fr })}
                    </p>
                  </div>

                  <Badge variant="outline" className="shrink-0 text-[10px]">
                    {config.label}
                  </Badge>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </CardContent>
      </Card>

      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Bell className="size-12 text-muted-foreground/40 mb-4" />
          <p className="text-sm font-medium text-muted-foreground">Aucune notification</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Les notifications apparaîtront ici
          </p>
        </div>
      )}
    </motion.div>
  )
}
