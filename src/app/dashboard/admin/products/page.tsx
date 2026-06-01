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
  DialogTrigger,
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
  ToggleLeft,
  ToggleRight,
  Package,
  Image as ImageIcon,
  AlertTriangle,
  Loader2,
  Upload as UploadIcon,
} from "lucide-react"
import { cn, formatPrice, formatNumber } from "@/lib/utils"
import { uploadImage } from "@/actions/upload"

type Product = {
  id: string
  name: string
  slug: string
  description: string
  price: number
  category: string
  stock: number
  weight: number
  dimensions: string
  colors: string[]
  isActive: boolean
  image: string
}

const sampleProducts: Product[] = [
  { id: "1", name: "Pavé Neko Classic 6", slug: "pave-neko-classic-6", description: "Pavé écologique fabriqué à partir de plastique recyclé. Format standard 6 cm pour allées et trottoirs.", price: 2500, category: "Pavés", stock: 500, weight: 3.5, dimensions: "20x10x6 cm", colors: ["Noir", "Gris", "Bordeaux"], isActive: true, image: "https://images.unsplash.com/photo-1590059132718-f96119c0128d?q=80&w=400&auto=format&fit=crop" },
  { id: "2", name: "Pavé Neko Premium 8", slug: "pave-neko-premium-8", description: "Pavé renforcé pour zones à fort passage. Haute résistance et finition lisse.", price: 3500, category: "Pavés", stock: 300, weight: 4.8, dimensions: "20x10x8 cm", colors: ["Noir", "Gris"], isActive: true, image: "https://images.unsplash.com/photo-1523301551780-cd17359a95d0?q=80&w=400&auto=format&fit=crop" },
  { id: "3", name: "Dalle Neko Jardin", slug: "dalle-neko-jardin", description: "Dalle décorative pour espaces verts et jardins. Aspect pierre naturelle.", price: 4500, category: "Dalles", stock: 150, weight: 5.2, dimensions: "40x40x5 cm", colors: ["Gris clair", "Beige", "Ardoise"], isActive: true, image: "https://images.unsplash.com/photo-1620626011761-9963d70ef937?q=80&w=400&auto=format&fit=crop" },
  { id: "4", name: "Bordure Neko Ville", slug: "bordure-neko-ville", description: "Bordure de trottoir en plastique recyclé. Résistante aux intempéries.", price: 5500, category: "Bordures", stock: 0, weight: 6.0, dimensions: "50x20x8 cm", colors: ["Noir", "Gris foncé"], isActive: false, image: "https://images.unsplash.com/photo-1558905619-172542713a47?q=80&w=400&auto=format&fit=crop" },
]

const categoryColors: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  "Pavés": "default",
  "Dalles": "secondary",
  "Bordures": "outline",
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
  name: "",
  slug: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  weight: "",
  dimensions: "",
  colors: "",
  image: "",
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(sampleProducts)
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState(defaultForm)
  const [uploading, setUploading] = useState(false)

  function resetForm() {
    setFormData(defaultForm)
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview locale immédiate
    const localUrl = URL.createObjectURL(file)
    setFormData((prev) => ({ ...prev, image: localUrl }))

    setUploading(true)
    const uploadFormData = new FormData()
    uploadFormData.append("file", file)

    try {
      const res = await uploadImage(uploadFormData)
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, image: res.url! }))
      }
    } catch (error) {
      console.error("Upload failed", error)
    } finally {
      setUploading(false)
    }
  }

  function handleAdd() {
    const newProduct: Product = {
      id: String(Date.now()),
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      stock: parseInt(formData.stock) || 0,
      weight: parseFloat(formData.weight) || 0,
      dimensions: formData.dimensions,
      colors: formData.colors.split(",").map((c) => c.trim()).filter(Boolean),
      isActive: true,
      image: formData.image || "/images/products/placeholder.jpg",
    }
    setProducts([newProduct, ...products])
    resetForm()
    setAddOpen(false)
  }

  function openEdit(product: Product) {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: String(product.price),
      category: product.category,
      stock: String(product.stock),
      weight: String(product.weight),
      dimensions: product.dimensions,
      colors: product.colors.join(", "),
      image: product.image,
    })
    setEditOpen(true)
  }

  function handleEdit() {
    if (!editingProduct) return
    setProducts(
      products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: formData.name,
              slug: formData.slug,
              description: formData.description,
              price: parseFloat(formData.price),
              category: formData.category,
              stock: parseInt(formData.stock) || 0,
              weight: parseFloat(formData.weight) || 0,
              dimensions: formData.dimensions,
              colors: formData.colors.split(",").map((c) => c.trim()).filter(Boolean),
              image: formData.image,
            }
          : p
      )
    )
    setEditingProduct(null)
    resetForm()
    setEditOpen(false)
  }

  function handleToggle(id: string) {
    setProducts(products.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)))
  }

  function openDelete(product: Product) {
    setDeletingProduct(product)
    setDeleteOpen(true)
  }

  function handleDelete() {
    if (!deletingProduct) return
    setProducts(products.filter((p) => p.id !== deletingProduct.id))
    setDeletingProduct(null)
    setDeleteOpen(false)
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Gestion des Produits</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {products.length} produits sur le catalogue
          </p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger render={<Button className="gap-2" />}>
            <Plus className="size-4" />
            Ajouter un produit
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouveau produit</DialogTitle>
              <DialogDescription>
                Ajoutez un nouveau produit au catalogue Néko.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="flex flex-col gap-2 col-span-2">
                <label className="text-sm font-medium">Image du produit</label>
                <div className="flex gap-4 items-start">
                  <div className="size-24 rounded-lg border bg-muted/30 flex items-center justify-center shrink-0 overflow-hidden relative">
                    {uploading ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                        <Loader2 className="size-6 animate-spin text-primary" />
                      </div>
                    ) : null}
                    {formData.image ? (
                      <img 
                        key={formData.image}
                        src={formData.image} 
                        alt="Preview" 
                        className="size-full object-cover"
                        onError={() => {
                          console.error("Failed to load image preview:", formData.image);
                          // On ne reset plus l'image immédiatement pour laisser une chance à la preview locale
                          // ou à l'utilisateur de corriger l'URL
                        }}
                      />
                    ) : (
                      <ImageIcon className="size-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col gap-1.5">
                      <p className="text-xs text-muted-foreground">Importer une image</p>
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileUpload} 
                        disabled={uploading}
                        className="text-xs h-9 cursor-pointer" 
                      />
                    </div>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">OU URL</span>
                      </div>
                    </div>
                    <Input 
                      value={formData.image} 
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })} 
                      placeholder="https://..." 
                      className="text-xs"
                      disabled={uploading}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <label className="text-sm font-medium">Nom</label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nom du produit" />
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <label className="text-sm font-medium">Slug</label>
                <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="nom-du-produit" />
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Prix (XOF)</label>
                <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Catégorie</label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v ?? "" })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pavés">Pavés</SelectItem>
                    <SelectItem value="Dalles">Dalles</SelectItem>
                    <SelectItem value="Bordures">Bordures</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Stock</label>
                <Input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Poids (kg)</label>
                <Input type="number" step="0.1" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <label className="text-sm font-medium">Dimensions</label>
                <Input value={formData.dimensions} onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })} placeholder="Ex: 20x10x6 cm" />
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <label className="text-sm font-medium">Couleurs (séparées par des virgules)</label>
                <Input value={formData.colors} onChange={(e) => setFormData({ ...formData, colors: e.target.value })} placeholder="Noir, Gris, Blanc" />
              </div>
            </div>
            <DialogFooter showCloseButton>
              <DialogClose render={<Button variant="outline" />}>Annuler</DialogClose>
              <Button onClick={handleAdd} disabled={!formData.name || !formData.slug || !formData.price || !formData.category || uploading}>Créer le produit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                      Aucun produit trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex size-10 items-center justify-center rounded-lg border bg-muted/30 overflow-hidden">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                          ) : (
                            <ImageIcon className="size-5 text-muted-foreground" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.slug}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={categoryColors[product.category] || "outline"}>{product.category}</Badge>
                      </TableCell>
                      <TableCell>{formatPrice(product.price)}</TableCell>
                      <TableCell>
                        <span className={cn(product.stock === 0 ? "text-destructive" : product.stock < 50 ? "text-amber-500" : "")}>
                          {formatNumber(product.stock)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={cn("size-2 rounded-full", product.isActive ? "bg-emerald-500" : "bg-muted-foreground")} />
                          <span className="text-xs text-muted-foreground">{product.isActive ? "Actif" : "Inactif"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon-sm" onClick={() => openEdit(product)}>
                            <Pencil className="size-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon-sm" onClick={() => handleToggle(product.id)}>
                            {product.isActive ? (
                              <ToggleRight className="size-3.5 text-emerald-500" />
                            ) : (
                              <ToggleLeft className="size-3.5 text-muted-foreground" />
                            )}
                          </Button>
                          <Button variant="ghost" size="icon-sm" onClick={() => openDelete(product)}>
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
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le produit</DialogTitle>
            <DialogDescription>
              Mettez à jour les informations de {editingProduct?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="flex flex-col gap-2 col-span-2">
              <label className="text-sm font-medium">Image du produit</label>
              <div className="flex gap-4 items-start">
                <div className="size-24 rounded-lg border bg-muted/30 flex items-center justify-center shrink-0 overflow-hidden relative">
                  {uploading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                      <Loader2 className="size-6 animate-spin text-primary" />
                    </div>
                  ) : null}
                  {formData.image ? (
                    <img 
                      key={formData.image}
                      src={formData.image} 
                      alt="Preview" 
                      className="size-full object-cover"
                      onError={() => {
                        console.error("Failed to load image preview:", formData.image);
                        // On ne reset plus l'image immédiatement pour laisser une chance à la preview locale
                        // ou à l'utilisateur de corriger l'URL
                      }}
                    />
                  ) : (
                    <ImageIcon className="size-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs text-muted-foreground">Modifier l'image</p>
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      disabled={uploading}
                      className="text-xs h-9 cursor-pointer" 
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">OU URL</span>
                    </div>
                  </div>
                  <Input 
                    value={formData.image} 
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })} 
                    placeholder="https://..." 
                    className="text-xs"
                    disabled={uploading}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 col-span-2">
              <label className="text-sm font-medium">Nom</label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2 col-span-2">
              <label className="text-sm font-medium">Slug</label>
              <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2 col-span-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Prix (XOF)</label>
              <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Catégorie</label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v ?? "" })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pavés">Pavés</SelectItem>
                  <SelectItem value="Dalles">Dalles</SelectItem>
                  <SelectItem value="Bordures">Bordures</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Stock</label>
              <Input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Poids (kg)</label>
              <Input type="number" step="0.1" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2 col-span-2">
              <label className="text-sm font-medium">Dimensions</label>
              <Input value={formData.dimensions} onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2 col-span-2">
              <label className="text-sm font-medium">Couleurs (séparées par des virgules)</label>
              <Input value={formData.colors} onChange={(e) => setFormData({ ...formData, colors: e.target.value })} />
            </div>
          </div>
          <DialogFooter showCloseButton>
            <DialogClose render={<Button variant="outline" />}>Annuler</DialogClose>
            <Button onClick={handleEdit} disabled={uploading}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer {deletingProduct?.name} ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 rounded-lg border bg-destructive/5 p-3 text-sm">
            <AlertTriangle className="size-5 text-destructive shrink-0" />
            <span className="text-muted-foreground">Le produit sera définitivement supprimé du catalogue.</span>
          </div>
          <DialogFooter showCloseButton>
            <DialogClose render={<Button variant="outline" />}>Annuler</DialogClose>
            <Button variant="destructive" onClick={handleDelete}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
