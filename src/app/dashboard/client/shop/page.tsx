"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, ArrowRight, Leaf, Recycle, Package } from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"
import Link from "next/link"

const products = [
  {
    id: "1",
    name: "Pavé écologique",
    description: "Pavé en plastique recyclé 100% écologique",
    price: 1500,
    image: "https://images.unsplash.com/photo-1590059132718-f96119c0128d?q=80&w=400&auto=format&fit=crop",
    category: "Pavés",
    badge: "Populaire",
  },
  {
    id: "2",
    name: "Briquette",
    description: "Briquette de plastique recyclé pour construction",
    price: 800,
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop",
    category: "Briquettes",
  },
  {
    id: "3",
    name: "Pavé décoratif",
    description: "Pavé décoratif coloré pour aménagement",
    price: 2500,
    image: "https://images.unsplash.com/photo-1620626011761-9963d70ef937?q=80&w=400&auto=format&fit=crop",
    category: "Pavés",
    badge: "Nouveau",
  },
  {
    id: "4",
    name: "Dalle de sol",
    description: "Dalle robuste pour revêtement extérieur",
    price: 3500,
    image: "https://images.unsplash.com/photo-1523301551780-cd17359a95d0?q=80&w=400&auto=format&fit=crop",
    category: "Dalles",
  },
  {
    id: "5",
    name: "Kit jardin",
    description: "Ensemble de 10 pavés pour bordure de jardin",
    price: 12000,
    image: "https://images.unsplash.com/photo-1558905619-172542713a47?q=80&w=400&auto=format&fit=crop",
    category: "Kits",
    badge: "Promo",
  },
  {
    id: "6",
    name: "Pavé drainant",
    description: "Pavé perméable pour allées et parkings",
    price: 2000,
    image: "https://images.unsplash.com/photo-1505142446710-0f5664599506?q=80&w=400&auto=format&fit=crop",
    category: "Pavés",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

export default function ShopPage() {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Boutique</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Produits fabriqués à partir de plastique recyclé
        </p>
      </div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="group cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="aspect-[16/9] w-full overflow-hidden rounded-lg bg-muted mb-4">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Package className="size-8 text-muted-foreground/50" />
                  </div>
                )}
              </div>
              <div className="flex items-start justify-between">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                  <Package className="size-4 text-primary" />
                </div>
                {product.badge && (
                  <Badge className="text-[10px] h-5">{product.badge}</Badge>
                )}
              </div>
              <CardTitle className="mt-3 text-lg">{product.name}</CardTitle>
              <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{product.category}</p>
                <p className="text-lg font-semibold">{formatPrice(product.price)}</p>
              </div>
              <Button variant="outline" size="sm" className="gap-1">
                Ajouter <ArrowRight className="size-3" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={item} className="rounded-xl border bg-card p-6 text-center">
        <Leaf className="size-8 text-primary mx-auto mb-3" />
        <h2 className="text-lg font-semibold">Chaque achat compte</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
          En achetant nos produits, vous contribuez à réduire les déchets plastiques et à financer nos programmes de collecte.
        </p>
        <div className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><Recycle className="size-4" /> 100% recyclé</span>
          <span className="flex items-center gap-1.5"><Leaf className="size-4" /> Écologique</span>
          <span className="flex items-center gap-1.5"><ShoppingBag className="size-4" /> Made in Sénégal</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
