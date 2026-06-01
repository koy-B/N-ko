"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Leaf, Calendar, ArrowRight, Newspaper, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"

const posts = [
  {
    id: "1",
    title: "Comment le recyclage des plastiques noirs transforme nos villes",
    slug: "recyclage-plastiques-noirs-transforme-villes",
    excerpt:
      "Découvrez comment les déchets plastiques noirs, autrefois considérés comme non recyclables, sont aujourd'hui transformés en pavés écologiques qui embellissent nos espaces urbains.",
    date: new Date("2026-05-15"),
    category: "Environnement",
    author: "Néko",
  },
  {
    id: "2",
    title: "Guide complet : Construire une allée écologique avec des pavés recyclés",
    slug: "guide-allee-ecologique-paves-recycles",
    excerpt:
      "Apprenez étape par étape comment aménager une allée durable et esthétique en utilisant nos pavés écologiques. Un guide pratique pour les particuliers et les professionnels.",
    date: new Date("2026-04-28"),
    category: "Guide",
    author: "Néko",
  },
  {
    id: "3",
    title: "L'impact environnemental du plastique : chiffres clés et solutions",
    slug: "impact-environnemental-plastique-chiffres-solutions",
    excerpt:
      "Chaque année, des millions de tonnes de plastique finissent dans les océans. Découvrez les chiffres alarmants et comment Néko contribue à inverser la tendance.",
    date: new Date("2026-04-10"),
    category: "Écologie",
    author: "Néko",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export default function BlogPage() {
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
              <Newspaper className="mr-1 size-3" />
              Actualités
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Blog <span className="text-primary">Néko</span>
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Actualités, guides et conseils sur le recyclage des plastiques et la construction
              écologique.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container -mt-8 pb-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {posts.map((post) => (
            <motion.div key={post.id} variants={itemVariants}>
              <Card className="group flex h-full flex-col overflow-hidden border-border/50 transition-shadow hover:shadow-md">
                <Link
                  href={`/blog/${post.slug}`}
                  className="flex aspect-video items-center justify-center bg-muted/50 overflow-hidden"
                >
                  <img
                    src={`/images/blog-${post.id}.jpg`}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                <CardHeader>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="size-3" />
                    {formatDate(post.date)}
                    <span className="text-muted-foreground/50">|</span>
                    <Badge variant="secondary" className="text-[10px]">
                      {post.category}
                    </Badge>
                  </div>
                  <CardTitle className="mt-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="line-clamp-2 hover:text-primary transition-colors"
                    >
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Button
                    variant="link"
                    size="sm"
                    render={<Link href={`/blog/${post.slug}`} />}
                    className="h-auto px-0 text-primary"
                  >
                    Lire plus
                    <ArrowRight className="ml-1 size-3 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
