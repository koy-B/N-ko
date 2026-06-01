"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  Plus,
  Pencil,
  Trash2,
  Newspaper,
  Eye,
  EyeOff,
  Calendar,
  User,
} from "lucide-react"
import { cn, formatDate } from "@/lib/utils"

type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image: string
  author: string
  published: boolean
  createdAt: Date
}

const samplePosts: BlogPost[] = [
  { id: "1", title: "Néko lance sa nouvelle gamme de pavés écologiques", slug: "nouvelle-gamme-paves-ecologiques", excerpt: "Découvrez notre nouvelle collection de pavés fabriqués à partir de plastique 100% recyclé.", content: "Lorem ipsum dolor sit amet consectetur adipiscing elit...", image: "/images/blog/nouvelle-gamme.jpg", author: "Admin", published: true, createdAt: new Date("2026-06-01") },
  { id: "2", title: "Comment le recyclage plastique transforme le Sénégal", slug: "recyclage-plastique-senegal", excerpt: "Le Sénégal fait face à une crise de pollution plastique. Néko apporte des solutions concrètes.", content: "Lorem ipsum dolor sit amet consectetur adipiscing elit...", image: "/images/blog/recyclage-senegal.jpg", author: "Fatou Diop", published: true, createdAt: new Date("2026-05-28") },
  { id: "3", title: "Guide complet des pavés en plastique recyclé", slug: "guide-paves-plastique-recycle", excerpt: "Tout ce que vous devez savoir sur les pavés fabriqués à partir de déchets plastiques.", content: "Lorem ipsum dolor sit amet consectetur adipiscing elit...", image: "/images/blog/guide-paves.jpg", author: "Admin", published: true, createdAt: new Date("2026-05-20") },
  { id: "4", title: "Partenariat avec la ville de Dakar pour des trottoirs durables", slug: "partenariat-dakar-trottoirs-durables", excerpt: "Un projet ambitieux pour équiper les quartiers de Dakar avec nos pavés recyclés.", content: "Lorem ipsum dolor sit amet consectetur adipiscing elit...", image: "/images/blog/partenariat-dakar.jpg", author: "Ibrahima Kane", published: false, createdAt: new Date("2026-05-15") },
  { id: "5", title: "L'impact environnemental de nos activités en 2026", slug: "impact-environnemental-2026", excerpt: "Bilan de notre impact positif sur l'environnement depuis le début de l'année.", content: "Lorem ipsum dolor sit amet consectetur adipiscing elit...", image: "/images/blog/impact-2026.jpg", author: "Admin", published: false, createdAt: new Date("2026-05-10") },
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
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  image: "",
  author: "",
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(samplePosts)
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [formData, setFormData] = useState(defaultForm)

  function resetForm() {
    setFormData(defaultForm)
  }

  function handleAdd() {
    const newPost: BlogPost = {
      id: String(Date.now()),
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      content: formData.content,
      image: formData.image,
      author: formData.author,
      published: false,
      createdAt: new Date(),
    }
    setPosts([newPost, ...posts])
    resetForm()
    setAddOpen(false)
  }

  function openEdit(post: BlogPost) {
    setEditingPost(post)
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      author: post.author,
    })
    setEditOpen(true)
  }

  function handleEdit() {
    if (!editingPost) return
    setPosts(
      posts.map((p) =>
        p.id === editingPost.id
          ? {
              ...p,
              title: formData.title,
              slug: formData.slug,
              excerpt: formData.excerpt,
              content: formData.content,
              image: formData.image,
              author: formData.author,
            }
          : p
      )
    )
    setEditingPost(null)
    resetForm()
    setEditOpen(false)
  }

  function handleTogglePublish(id: string) {
    setPosts(posts.map((p) => (p.id === id ? { ...p, published: !p.published } : p)))
  }

  function handleDelete(id: string) {
    setPosts(posts.filter((p) => p.id !== id))
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Gestion du Blog</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {posts.length} articles sur le blog
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogClose render={<Button className="gap-2" />}>
            <Plus className="size-4" />
            Nouvel article
          </DialogClose>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Nouvel article</DialogTitle>
              <DialogDescription>
                Créez un nouvel article pour le blog Néko.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-2 max-h-[50vh] overflow-y-auto">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Titre</label>
                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Titre de l'article" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Slug</label>
                <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="titre-de-l-article" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Extrait</label>
                <Textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} rows={2} placeholder="Brève description..." />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Contenu</label>
                <Textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={6} placeholder="Contenu de l'article..." />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Image URL</label>
                <Input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Auteur</label>
                <Input value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} placeholder="Nom de l'auteur" />
              </div>
            </div>
            <DialogFooter showCloseButton>
              <DialogClose render={<Button variant="outline" />}>Annuler</DialogClose>
              <Button onClick={handleAdd} disabled={!formData.title || !formData.slug || !formData.content}>Publier</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>Articles</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Auteur</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Publié</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                      Aucun article trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{post.title}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[300px]">{post.excerpt}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <User className="size-3.5" />
                          {post.author}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(post.createdAt)}</TableCell>
                      <TableCell>
                        <Badge variant={post.published ? "default" : "outline"}>
                          {post.published ? "Publié" : "Brouillon"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon-sm" onClick={() => openEdit(post)}>
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" onClick={() => handleTogglePublish(post.id)}>
                            {post.published ? (
                              <EyeOff className="size-3.5 text-muted-foreground" />
                            ) : (
                              <Eye className="size-3.5 text-emerald-500" />
                            )}
                          </Button>
                          <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(post.id)}>
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

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Modifier l&apos;article</DialogTitle>
            <DialogDescription>
              Mettez à jour les informations de {editingPost?.title}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2 max-h-[50vh] overflow-y-auto">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Titre</label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Slug</label>
              <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Extrait</label>
              <Textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} rows={2} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Contenu</label>
              <Textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={6} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Image URL</label>
              <Input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Auteur</label>
              <Input value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} />
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
