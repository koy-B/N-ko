"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { ArrowRight, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const posts = [
  {
    title: "Comment le recyclage des plastiques noirs révolutionne la construction",
    excerpt:
      "Découvrez comment les déchets plastiques sont transformés en matériaux de construction durables et écologiques.",
    date: "15 Mai 2026",
    category: "Environnement",
    color: "from-emerald-400 to-green-500",
  },
  {
    title: "Néko lance son programme de collecte dans 5 nouvelles villes",
    excerpt:
      "La plateforme étend son réseau de collecte pour couvrir davantage de communes et faciliter le recyclage.",
    date: "28 Avril 2026",
    category: "Actualités",
    color: "from-green-500 to-emerald-600",
  },
  {
    title: "5 raisons de choisir des pavés écologiques pour votre aménagement",
    excerpt:
      "Les pavés recyclés offrent une alternative durable et esthétique aux matériaux traditionnels. Voici pourquoi.",
    date: "10 Avril 2026",
    category: "Conseils",
    color: "from-emerald-600 to-green-700",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const cardVariants: import("framer-motion").Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export function BlogPreviewSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="relative overflow-hidden bg-muted/50 py-24 sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            Blog
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Derniers articles
          </h2>
          <p className="mt-4 text-muted-foreground">
            Suivez notre actualité et découvrez nos conseils pour un mode de vie plus durable.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-16 grid gap-6 md:grid-cols-3"
        >
          {posts.map((post) => (
            <motion.article
              key={post.title}
              variants={cardVariants}
              className="group relative overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div className={cn("flex h-48 items-end justify-start bg-gradient-to-br p-6", post.color)}>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {post.category}
                </span>
              </div>

              <div className="p-5">
                <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays className="size-3.5" />
                  {post.date}
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {post.excerpt}
                </p>
              </div>

              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-foreground/5 pointer-events-none" />
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          className="mt-12 text-center"
        >
          <Button variant="outline" render={<Link href="/blog" />} className="rounded-xl">
            Voir tous nos articles
            <ArrowRight className="size-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
