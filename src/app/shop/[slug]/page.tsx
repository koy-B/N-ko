"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Leaf,
  ShoppingCart,
  Check,
  Minus,
  Plus,
  Ruler,
  Weight,
  Palette,
  ChevronLeft,
  Package,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

const products = [
  {
    id: "1",
    name: "Pavé Standard",
    slug: "pave-standard",
    image: "https://images.unsplash.com/photo-1590059132718-f96119c0128d?q=80&w=800&auto=format&fit=crop",
    description:
      "Pavé écologique 100% recyclé pour allées et trottoirs. Résistant et durable, il offre une solution économique et écologique pour vos aménagements extérieurs. Fabriqué à partir de plastiques noirs collectés localement.",
    price: 1500,
    category: "paves",
    stock: 50,
    weight: "2.5 kg",
    dimensions: "20×10×6 cm",
    colors: ["Gris anthracite", "Noir", "Vert forêt"],
    specifications: [
      { label: "Matériau", value: "Plastique 100% recyclé" },
      { label: "Dimensions", value: "20×10×6 cm" },
      { label: "Poids", value: "2.5 kg" },
      { label: "Résistance", value: "25 MPa" },
      { label: "Couleurs", value: "Gris anthracite, Noir, Vert forêt" },
      { label: "Usage", value: "Allées, trottoirs, cours" },
    ],
  },
  {
    id: "2",
    name: "Pavé Autobloquant",
    slug: "pave-autobloquant",
    image: "https://images.unsplash.com/photo-1523301551780-cd17359a95d0?q=80&w=800&auto=format&fit=crop",
    description:
      "Système d'emboîtement parfait pour parkings et voiries. Haute résistance à la compression et installation simplifiée grâce au design autobloquant.",
    price: 2500,
    category: "paves",
    stock: 35,
    weight: "3.2 kg",
    dimensions: "25×12.5×8 cm",
    colors: ["Gris", "Noir", "Rouge terre"],
    specifications: [
      { label: "Matériau", value: "Plastique 100% recyclé" },
      { label: "Dimensions", value: "25×12.5×8 cm" },
      { label: "Poids", value: "3.2 kg" },
      { label: "Résistance", value: "35 MPa" },
      { label: "Couleurs", value: "Gris, Noir, Rouge terre" },
      { label: "Usage", value: "Parkings, voiries, zones à fort trafic" },
    ],
  },
  {
    id: "3",
    name: "Pavé Décoratif",
    slug: "pave-decoratif",
    image: "https://images.unsplash.com/photo-1620626011761-9963d70ef937?q=80&w=800&auto=format&fit=crop",
    description:
      "Pavé design pour espaces verts et jardins. Aspect naturel et finition soignée pour un rendu esthétique unique.",
    price: 3500,
    category: "decoratif",
    stock: 25,
    weight: "2.8 kg",
    dimensions: "30×15×5 cm",
    colors: ["Beige", "Terre cuite", "Gris clair"],
    specifications: [
      { label: "Matériau", value: "Plastique 100% recyclé" },
      { label: "Dimensions", value: "30×15×5 cm" },
      { label: "Poids", value: "2.8 kg" },
      { label: "Résistance", value: "20 MPa" },
      { label: "Couleurs", value: "Beige, Terre cuite, Gris clair" },
      { label: "Usage", value: "Jardins, espaces verts, décoration" },
    ],
  },
  {
    id: "4",
    name: "Bordures",
    slug: "bordures",
    image: "https://images.unsplash.com/photo-1558905619-172542713a47?q=80&w=800&auto=format&fit=crop",
    description:
      "Bordures de jardin et allées en plastique recyclé. Faciles à installer, résistantes aux intempéries et écologiques.",
    price: 2000,
    category: "bordures",
    stock: 40,
    weight: "3.5 kg",
    dimensions: "50×8×15 cm",
    colors: ["Noir", "Gris", "Marron"],
    specifications: [
      { label: "Matériau", value: "Plastique 100% recyclé" },
      { label: "Dimensions", value: "50×8×15 cm" },
      { label: "Poids", value: "3.5 kg" },
      { label: "Résistance", value: "30 MPa" },
      { label: "Couleurs", value: "Noir, Gris, Marron" },
      { label: "Usage", value: "Bordures de jardin, allées, platebandes" },
    ],
  },
]

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)

  const product = products.find((p) => p.slug === params.slug)

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Package className="size-16 text-muted-foreground/50" />
        <h1 className="mt-4 text-2xl font-bold">Produit non trouvé</h1>
        <p className="mt-2 text-muted-foreground">Ce produit n&apos;existe pas ou a été retiré.</p>
        <Button className="mt-6" render={<Link href="/shop" />}>
          <ChevronLeft className="size-4" />
          Retour à la boutique
        </Button>
      </div>
    )
  }

  const currentProduct = product

  const related = products.filter(
    (p) => p.category === currentProduct.category && p.id !== currentProduct.id
  )

  function addToCart() {
    toast.success(`${quantity} × ${currentProduct.name} ajouté au panier`)
  }

  return (
    <div className="min-h-screen bg-background pt-28">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/shop" />}
            className="mb-6"
          >
            <ChevronLeft className="size-4" />
            Retour à la boutique
          </Button>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            className="group relative aspect-square overflow-hidden rounded-2xl bg-muted/50"
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-black/10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            className="flex flex-col justify-center"
          >
            <Badge variant="secondary" className="mb-4 w-fit">
              <Leaf className="mr-1 size-3" />
              100% Recyclé
            </Badge>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>

            <p className="mt-4 leading-relaxed text-muted-foreground">{product.description}</p>

            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-4xl font-bold text-primary">
                {product.price.toLocaleString("fr-FR")} XOF
              </span>
              <span className="text-sm text-muted-foreground">par unité</span>
            </div>

            <div className="mt-4 flex items-center gap-2">
              {product.stock > 0 ? (
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary hover:bg-primary/20"
                >
                  <Check className="mr-1 size-3" />
                  En stock ({product.stock} unités)
                </Badge>
              ) : (
                <Badge variant="destructive">Rupture de stock</Badge>
              )}
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantité:</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <Minus className="size-3" />
                  </Button>
                  <span className="flex h-8 w-12 items-center justify-center text-sm font-medium tabular-nums">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={quantity >= product.stock}
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  >
                    <Plus className="size-3" />
                  </Button>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full sm:w-auto"
                disabled={product.stock === 0}
                onClick={addToCart}
              >
                <ShoppingCart className="size-4" />
                Ajouter au panier — {(product.price * quantity).toLocaleString("fr-FR")} XOF
              </Button>
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                <Ruler className="size-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Dimensions</p>
                  <p className="text-sm font-medium">{product.dimensions}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                <Weight className="size-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Poids</p>
                  <p className="text-sm font-medium">{product.weight}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                <Palette className="size-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Couleurs</p>
                  <p className="text-sm font-medium">{product.colors.length}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold tracking-tight">Spécifications</h2>
          <div className="mt-6 overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
              <tbody>
                {product.specifications.map((spec, i) => (
                  <tr
                    key={spec.label}
                    className={cn("border-b last:border-none", i % 2 === 0 && "bg-muted/30")}
                  >
                    <td className="px-4 py-3 font-medium">{spec.label}</td>
                    <td className="px-4 py-3 text-muted-foreground">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="my-16"
          >
            <h2 className="text-2xl font-bold tracking-tight">Produits similaires</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  <Card className="group overflow-hidden border-border/50 transition-shadow hover:shadow-md">
                    <Link
                      href={`/shop/${item.slug}`}
                      className="group relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-muted/50"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </Link>
                    <CardHeader>
                      <CardTitle>
                        <Link
                          href={`/shop/${item.slug}`}
                          className="hover:text-primary transition-colors"
                        >
                          {item.name}
                        </Link>
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="text-xl font-bold text-primary">
                        {item.price.toLocaleString("fr-FR")} XOF
                      </span>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
