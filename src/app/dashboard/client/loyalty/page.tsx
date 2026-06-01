"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Award, Gift, Star, ChevronRight, Trophy, Sparkles, Leaf, TreePine, Flame, ShoppingBag } from "lucide-react"
import { cn, formatNumber, formatDate, getLevel } from "@/lib/utils"

const currentPoints = 410
const currentLevel = getLevel(currentPoints)
const nextLevel = getLevel(currentPoints + 1)
const isMaxLevel = currentLevel.name === "Eco Champion"
const nextLevelMin = isMaxLevel ? currentLevel.min : currentLevel.max
const pointsToNext = isMaxLevel ? 0 : currentLevel.max - currentPoints
const progressPercent = isMaxLevel ? 100 : ((currentPoints - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100

const levelConfig = [
  { name: "Eco Starter", icon: "🌱", min: 0, color: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700" },
  { name: "Eco Citizen", icon: "🌿", min: 100, color: "bg-green-500", bg: "bg-green-50", text: "text-green-700" },
  { name: "Eco Hero", icon: "🌳", min: 500, color: "bg-teal-500", bg: "bg-teal-50", text: "text-teal-700" },
  { name: "Eco Champion", icon: "🏆", min: 2000, color: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-700" },
]

const rewards = [
  { id: "1", name: "Réduction 10%", description: "Sur votre prochaine commande", points: 200, icon: Gift },
  { id: "2", name: "Sac réutilisable", description: "Sac en toile Néko", points: 350, icon: Star },
  { id: "3", name: "Livraison offerte", description: "Sur toute commande", points: 500, icon: Trophy },
  { id: "4", name: "Réduction 25%", description: "Sur les pavés décoratifs", points: 800, icon: Sparkles },
]

const badges = [
  { name: "Première collecte", earned: true, icon: Leaf },
  { name: "5 collectes", earned: true, icon: TreePine },
  { name: "10 collectes", earned: false, icon: TreePine },
  { name: "50 kg recyclés", earned: true, icon: Flame },
  { name: "100 kg recyclés", earned: false, icon: Flame },
  { name: "Eco Champion", earned: false, icon: Trophy },
]

const history = [
  { id: "1", date: new Date("2026-05-28"), description: "Collecte de 8 kg", points: 80, type: "earned" },
  { id: "2", date: new Date("2026-05-20"), description: "Collecte de 5 kg", points: 50, type: "earned" },
  { id: "3", date: new Date("2026-05-18"), description: "Réduction 10% utilisée", points: -200, type: "redeemed" },
  { id: "4", date: new Date("2026-05-12"), description: "Collecte de 12 kg", points: 120, type: "earned" },
  { id: "5", date: new Date("2026-05-05"), description: "Collecte de 6 kg", points: 60, type: "earned" },
  { id: "6", date: new Date("2026-04-28"), description: "Collecte de 10 kg", points: 100, type: "earned" },
  { id: "7", date: new Date("2026-04-15"), description: "Collecte de 8 kg", points: 80, type: "earned" },
  { id: "8", date: new Date("2026-04-01"), description: "Collecte de 15 kg", points: 150, type: "earned" },
  { id: "9", date: new Date("2026-03-20"), description: "Bon d'achat 5 000 F", points: -500, type: "redeemed" },
  { id: "10", date: new Date("2026-03-15"), description: "Collecte de 7 kg", points: 70, type: "earned" },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

export default function LoyaltyPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Programme fidélité</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gagnez des points à chaque collecte et échangez-les contre des récompenses
        </p>
      </div>

      <motion.div variants={item} className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Votre niveau</CardTitle>
            <CardDescription>Progression vers le prochain palier</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-3xl">
                {currentLevel.icon}
              </div>
              <div>
                <p className="text-xl font-semibold">{currentLevel.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatNumber(currentPoints)} points • {isMaxLevel ? "Niveau max atteint" : `${formatNumber(pointsToNext)} points vers le prochain niveau`}
                </p>
              </div>
            </div>

            {!isMaxLevel && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatNumber(currentLevel.min)} pts</span>
                  <span>{formatNumber(currentLevel.max)} pts</span>
                </div>
                <Progress value={progressPercent} />
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="size-3" />
                  Prochain niveau : {nextLevel.name} {nextLevel.icon}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Points gagnés</span>
              <span className="font-semibold">{formatNumber(710)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Points utilisés</span>
              <span className="font-semibold">{formatNumber(300)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Récompenses obtenues</span>
              <span className="font-semibold">2</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Collectes totales</span>
              <span className="font-semibold">8</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
            <CardDescription>Vos accomplissements Néko</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {badges.map((badge) => {
                const Icon = badge.icon
                return (
                  <div
                    key={badge.name}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border p-3 min-w-[80px] transition-opacity",
                      badge.earned ? "border-primary/20 bg-primary/5" : "border-border opacity-40"
                    )}
                  >
                    <div className={cn("flex size-9 items-center justify-center rounded-lg", badge.earned ? "bg-primary/10" : "bg-muted")}>
                      <Icon className={cn("size-4", badge.earned ? "text-primary" : "text-muted-foreground")} />
                    </div>
                    <span className="text-[10px] font-medium text-center leading-tight">{badge.name}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Récompenses disponibles</CardTitle>
            <CardDescription>Échangez vos points contre des avantages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {rewards.map((reward) => {
                const Icon = reward.icon
                const canAfford = currentPoints >= reward.points
                return (
                  <Card key={reward.id} size="sm" className={cn(!canAfford && "opacity-60")}>
                    <CardContent className="flex flex-col items-center gap-2 p-4 text-center">
                      <div className={cn("flex size-10 items-center justify-center rounded-xl", canAfford ? "bg-primary/10" : "bg-muted")}>
                        <Icon className={cn("size-5", canAfford ? "text-primary" : "text-muted-foreground")} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{reward.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{reward.description}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                        <Award className="size-3" />
                        {formatNumber(reward.points)} pts
                      </div>
                      <Button
                        size="sm"
                        variant={canAfford ? "default" : "outline"}
                        disabled={!canAfford}
                        className="w-full mt-1"
                      >
                        {canAfford ? "Échanger" : "Points insuffisants"}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Historique des points</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="text-muted-foreground">{formatDate(entry.date)}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell>
                      <span className={cn(
                        "font-medium",
                        entry.type === "earned" ? "text-emerald-600" : "text-destructive"
                      )}>
                        {entry.type === "earned" ? "+" : ""}{entry.points}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={entry.type === "earned" ? "default" : "outline"}>
                        {entry.type === "earned" ? "Gagnés" : "Utilisés"}
                      </Badge>
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
