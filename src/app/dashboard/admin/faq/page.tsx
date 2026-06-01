"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
  Pencil,
  Trash2,
  GripVertical,
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { cn } from "@/lib/utils"

type FAQEntry = {
  id: string
  question: string
  answer: string
  category: string
  order: number
  isActive: boolean
}

const sampleFAQs: FAQEntry[] = [
  { id: "1", question: "Comment sont fabriqués les pavés Néko ?", answer: "Nos pavés sont fabriqués à partir de plastique recyclé collecté au Sénégal. Le plastique est trié, nettoyé, broyé puis compressé à haute température pour former des pavés solides et durables.", category: "Produits", order: 1, isActive: true },
  { id: "2", question: "Quels types de plastique acceptez-vous ?", answer: "Nous acceptons les plastiques de type PEHD (polyéthylène haute densité), PP (polypropylène) et PET. Ces plastiques sont les plus adaptés à notre processus de fabrication.", category: "Collecte", order: 2, isActive: true },
  { id: "3", question: "Quel est le délai de livraison ?", answer: "Le délai de livraison standard est de 5 à 7 jours ouvrés pour la région de Dakar, et de 7 à 14 jours pour les autres régions du Sénégal.", category: "Commandes", order: 3, isActive: true },
  { id: "4", question: "Puis-je commander en gros ?", answer: "Oui, nous proposons des tarifs dégressifs pour les commandes en gros. Contactez notre équipe commerciale pour un devis personnalisé.", category: "Commandes", order: 4, isActive: true },
  { id: "5", question: "Comment devenir collecteur partenaire ?", answer: "Pour devenir collecteur partenaire, inscrivez-vous sur notre plateforme et suivez le processus de validation. Vous devez disposer d'un moyen de transport adapté.", category: "Collecte", order: 5, isActive: true },
  { id: "6", question: "Quelle est la durée de vie des pavés ?", answer: "Nos pavés ont une durée de vie estimée à plus de 20 ans, avec une résistance comparable à celle des pavés en béton traditionnels.", category: "Produits", order: 6, isActive: false },
]

const categoryColors: Record<string, "default" | "secondary" | "outline"> = {
  "Produits": "default",
  "Collecte": "secondary",
  "Commandes": "outline",
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

const defaultForm = {
  question: "",
  answer: "",
  category: "",
  order: "",
}

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState<FAQEntry[]>(sampleFAQs)
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingFaq, setEditingFaq] = useState<FAQEntry | null>(null)
  const [formData, setFormData] = useState(defaultForm)

  function resetForm() {
    setFormData(defaultForm)
  }

  function handleAdd() {
    const newFaq: FAQEntry = {
      id: String(Date.now()),
      question: formData.question,
      answer: formData.answer,
      category: formData.category,
      order: parseInt(formData.order) || faqs.length + 1,
      isActive: true,
    }
    setFaqs([...faqs, newFaq].sort((a, b) => a.order - b.order))
    resetForm()
    setAddOpen(false)
  }

  function openEdit(faq: FAQEntry) {
    setEditingFaq(faq)
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order: String(faq.order),
    })
    setEditOpen(true)
  }

  function handleEdit() {
    if (!editingFaq) return
    setFaqs(
      faqs.map((f) =>
        f.id === editingFaq.id
          ? { ...f, question: formData.question, answer: formData.answer, category: formData.category, order: parseInt(formData.order) || f.order }
          : f
      ).sort((a, b) => a.order - b.order)
    )
    setEditingFaq(null)
    resetForm()
    setEditOpen(false)
  }

  function handleToggle(id: string) {
    setFaqs(faqs.map((f) => (f.id === id ? { ...f, isActive: !f.isActive } : f)))
  }

  function handleDelete(id: string) {
    setFaqs(faqs.filter((f) => f.id !== id))
  }

  function moveItem(id: string, direction: "up" | "down") {
    const index = faqs.findIndex((f) => f.id === id)
    if (index === -1) return
    const newFaqs = [...faqs]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newFaqs.length) return
    const temp = newFaqs[index].order
    newFaqs[index] = { ...newFaqs[index], order: newFaqs[targetIndex].order }
    newFaqs[targetIndex] = { ...newFaqs[targetIndex], order: temp }
    setFaqs(newFaqs.sort((a, b) => a.order - b.order))
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Gestion des FAQs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {faqs.filter((f) => f.isActive).length} FAQs actives sur {faqs.length}
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogClose render={<Button className="gap-2" />}>
            <Plus className="size-4" />
            Nouvelle FAQ
          </DialogClose>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nouvelle FAQ</DialogTitle>
              <DialogDescription>
                Ajoutez une nouvelle question fréquente à la base de connaissances.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Question</label>
                <Input value={formData.question} onChange={(e) => setFormData({ ...formData, question: e.target.value })} placeholder="Votre question..." />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Réponse</label>
                <Textarea value={formData.answer} onChange={(e) => setFormData({ ...formData, answer: e.target.value })} rows={4} placeholder="Votre réponse..." />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Catégorie</label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v ?? "" })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Produits">Produits</SelectItem>
                    <SelectItem value="Collecte">Collecte</SelectItem>
                    <SelectItem value="Commandes">Commandes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Ordre</label>
                <Input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: e.target.value })} placeholder="1" />
              </div>
            </div>
            <DialogFooter showCloseButton>
              <DialogClose render={<Button variant="outline" />}>Annuler</DialogClose>
              <Button onClick={handleAdd} disabled={!formData.question || !formData.answer || !formData.category}>Ajouter</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Liste des FAQs</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {faqs.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  Aucune FAQ trouvée
                </div>
              ) : (
                faqs.map((faq, index) => (
                  <div key={faq.id} className={cn("flex items-start gap-3 p-4", !faq.isActive && "opacity-50")}>
                    <div className="flex flex-col items-center gap-0.5 pt-0.5">
                      <Button variant="ghost" size="icon-xs" onClick={() => moveItem(faq.id, "up")} disabled={index === 0}>
                        <ArrowUp className="size-3" />
                      </Button>
                      <span className="text-xs text-muted-foreground font-mono">{faq.order}</span>
                      <Button variant="ghost" size="icon-xs" onClick={() => moveItem(faq.id, "down")} disabled={index === faqs.length - 1}>
                        <ArrowDown className="size-3" />
                      </Button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <HelpCircle className="size-4 text-muted-foreground shrink-0 mt-0.5" />
                          <p className="text-sm font-medium">{faq.question}</p>
                        </div>
                        <Badge variant={categoryColors[faq.category] || "outline"} className="shrink-0 text-[10px]">
                          {faq.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{faq.answer}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(faq)}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => handleToggle(faq.id)}>
                        {faq.isActive ? (
                          <ToggleRight className="size-3.5 text-emerald-500" />
                        ) : (
                          <ToggleLeft className="size-3.5 text-muted-foreground" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(faq.id)}>
                        <Trash2 className="size-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier la FAQ</DialogTitle>
            <DialogDescription>
              Mettez à jour les informations de cette question fréquente.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Question</label>
              <Input value={formData.question} onChange={(e) => setFormData({ ...formData, question: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Réponse</label>
              <Textarea value={formData.answer} onChange={(e) => setFormData({ ...formData, answer: e.target.value })} rows={4} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Catégorie</label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v ?? "" })}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Produits">Produits</SelectItem>
                  <SelectItem value="Collecte">Collecte</SelectItem>
                  <SelectItem value="Commandes">Commandes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Ordre</label>
              <Input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: e.target.value })} />
            </div>
          </div>
          <DialogFooter showCloseButton>
            <DialogClose render={<Button variant="outline" />}>Annuler</DialogClose>
            <Button onClick={handleEdit}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
