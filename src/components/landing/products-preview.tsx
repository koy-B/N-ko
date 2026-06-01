"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { ArrowRight, Blocks, Grid3x3, LayoutGrid, Wallpaper } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const products = [
  {
    name: "Pavé Standard",
    slug: "pave-standard",
    image: "https://images.unsplash.com/photo-1590059132718-f96119c0128d?q=80&w=800&auto=format&fit=crop",
    price: "1 500 XOF",
    description: "Pavé écologique rectangulaire pour trottoirs, allées et espaces publics.",
    color: "from-emerald-500 to-green-600",
    icon: Blocks,
  },
  {
    name: "Pavé Autobloquant",
    slug: "pave-autobloquant",
    image: "https://images.unsplash.com/photo-1523301551780-cd17359a95d0?q=80&w=800&auto=format&fit=crop",
    price: "2 000 XOF",
    description: "S'emboîte parfaitement for des surfaces stables sans joint apparent.",
    color: "from-green-500 to-emerald-600",
    icon: Grid3x3,
  },
  {
    name: "Pavé Décoratif",
    slug: "pave-decoratif",
    image: "https://images.unsplash.com/photo-1620626011761-9963d70ef937?q=80&w=800&auto=format&fit=crop",
    price: "2 500 XOF",
    description: "Design moderne pour jardins, terrasses et espaces paysagers.",
    color: "from-emerald-600 to-green-700",
    icon: LayoutGrid,
  },
  {
    name: "Bordures",
    slug: "bordures",
    image: "https://images.unsplash.com/photo-1558905619-172542713a47?q=80&w=800&auto=format&fit=crop",
    price: "1 800 XOF",
    description: "Bordures solides pour délimiter espaces verts, allées et parkings.",
    color: "from-green-600 to-emerald-700",
    icon: Wallpaper,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export function ProductsPreviewSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="relative overflow-hidden bg-muted/50 py-24 sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            Produits
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Nos pavés écologiques
          </h2>
          <p className="mt-4 text-muted-foreground">
            Des pavés de haute qualité fabriqués à partir de plastiques recyclés, disponibles en
            plusieurs formats.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {products.map((product) => {
            const Icon = product.icon
            return (
              <motion.div
                key={product.name}
                variants={cardVariants}
                className="group relative overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative h-48 w-full overflow-hidden bg-muted">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={cn("absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100")} />
                  <div className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-primary shadow-sm backdrop-blur-sm">
                    <Icon className="size-5" />
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                  <p className="mt-3 text-lg font-bold text-primary">{product.price}</p>
                </div>

                <Link href={`/shop/${product.slug}`} className="absolute inset-0 z-10" />
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          className="mt-12 text-center"
        >
          <Button variant="outline" render={<Link href="/shop" />} className="rounded-xl">
            Voir tous nos produits
            <ArrowRight className="size-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
