"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Leaf,
  Search,
  ShoppingCart,
  Check,
  Package,
  ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { toast } from "sonner"

const categories = [
  { id: "all", label: "Tous" },
  { id: "paves", label: "Pavés" },
  { id: "bordures", label: "Bordures" },
  { id: "decoratif", label: "Décoratif" },
]

const products = [
  {
    id: "1",
    name: "Pavé Standard",
    slug: "pave-standard",
    image: "https://images.unsplash.com/photo-1590059132718-f96119c0128d?q=80&w=800&auto=format&fit=crop",
    description: "Pavé écologique 100% recyclé pour allées et trottoirs. Résistant et durable.",
    price: 1500,
    category: "paves",
    stock: 50,
    weight: "2.5 kg",
    dimensions: "20×10×6 cm",
    colors: ["Gris anthracite", "Noir", "Vert forêt"],
  },
  {
    id: "2",
    name: "Pavé Autobloquant",
    slug: "pave-autobloquant",
    image: "https://images.unsplash.com/photo-1523301551780-cd17359a95d0?q=80&w=800&auto=format&fit=crop",
    description:
      "Système d'emboîtement parfait pour parkings et voiries. Haute résistance à la compression.",
    price: 2500,
    category: "paves",
    stock: 35,
    weight: "3.2 kg",
    dimensions: "25×12.5×8 cm",
    colors: ["Gris", "Noir", "Rouge terre"],
  },
  {
    id: "3",
    name: "Pavé Décoratif",
    slug: "pave-decoratif",
    image: "https://images.unsplash.com/photo-1620626011761-9963d70ef937?q=80&w=800&auto=format&fit=crop",
    description:
      "Pavé design pour espaces verts et jardins. Aspect naturel et finition soignée.",
    price: 3500,
    category: "decoratif",
    stock: 25,
    weight: "2.8 kg",
    dimensions: "30×15×5 cm",
    colors: ["Beige", "Terre cuite", "Gris clair"],
  },
  {
    id: "4",
    name: "Bordures",
    slug: "bordures",
    image: "https://images.unsplash.com/photo-1558905619-172542713a47?q=80&w=800&auto=format&fit=crop",
    description:
      "Bordures de jardin et allées en plastique recyclé. Faciles à installer et écologiques.",
    price: 2000,
    category: "bordures",
    stock: 40,
    weight: "3.5 kg",
    dimensions: "50×8×15 cm",
    colors: ["Noir", "Gris", "Marron"],
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export default function ShopPage() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [cart, setCart] = useState<Record<string, number>>({})

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = activeCategory === "all" || p.category === activeCategory
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      return matchCategory && matchSearch
    })
  }, [search, activeCategory])

  function addToCart(productId: string, productName: string) {
    setCart((prev) => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }))
    toast.success(`${productName} ajouté au panier`)
  }

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/5 pb-16 pt-28">
        <div className="container">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Retour à l'accueil
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            className="flex flex-col items-center text-center"
          >
            <Badge variant="secondary" className="mb-4">
              <Leaf className="mr-1 size-3" />
              Éco-responsable
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Boutique <span className="text-primary">Néko</span>
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Des pavés écologiques fabriqués à partir de plastiques recyclés. Construisez un
              avenir plus vert.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container -mt-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </motion.div>

        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filtered.length} produit{filtered.length !== 1 ? "s" : ""} trouvé
            {filtered.length !== 1 ? "s" : ""}
          </p>
          {cartCount > 0 && (
            <Badge variant="secondary" className="gap-1">
              <ShoppingCart className="size-3" />
              {cartCount} article{cartCount !== 1 ? "s" : ""}
            </Badge>
          )}
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={activeCategory + search}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {filtered.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <Card className="group flex h-full flex-col overflow-hidden border-border/50 transition-shadow hover:shadow-md">
                <Link
                  href={`/shop/${product.slug}`}
                  className="flex aspect-[4/3] items-center justify-center bg-muted/50 overflow-hidden"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle>
                        <Link
                          href={`/shop/${product.slug}`}
                          className="hover:text-primary transition-colors"
                        >
                          {product.name}
                        </Link>
                      </CardTitle>
                      <CardDescription className="mt-1 line-clamp-2">
                        {product.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary">
                      {product.price.toLocaleString("fr-FR")} XOF
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    {product.stock > 0 ? (
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary hover:bg-primary/20"
                      >
                        <Check className="mr-1 size-3" />
                        En stock
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Rupture</Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    disabled={product.stock === 0}
                    onClick={() => addToCart(product.id, product.name)}
                  >
                    <ShoppingCart className="size-4" />
                    Ajouter au panier
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center py-20 text-center"
          >
            <Package className="size-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">Aucun produit trouvé</h3>
            <p className="text-sm text-muted-foreground">
              Essayez de modifier vos filtres ou votre recherche
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
