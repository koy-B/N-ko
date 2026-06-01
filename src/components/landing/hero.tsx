"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, ChevronDown, Recycle, Blocks, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const statVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const, delay: 0.8 + i * 0.15 },
  }),
}

function scrollToNext() {
  const hero = document.getElementById("hero")
  if (hero) {
    const next = hero.nextElementSibling
    if (next) next.scrollIntoView({ behavior: "smooth" })
  }
}

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section
      id="hero"
      ref={ref}
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      <motion.div className="pointer-events-none absolute inset-0" style={{ y: bgY }}>
        <img src="https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?q=80&w=2000&auto=format&fit=crop" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative mx-auto w-full max-w-7xl px-4 pt-32 pb-20 sm:px-6 sm:pt-40 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            variants={itemVariants}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/40" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            Plateforme de recyclage intelligente
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]"
          >
            Chaque plastique collecté{" "}
            <span className="text-primary">construit un avenir plus propre.</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            Néko transforme les déchets plastiques en pavés écologiques. Rejoignez le mouvement
            pour un avenir durable.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button size="lg" render={<Link href="/register" />} className="h-12 rounded-xl px-8 text-base font-medium shadow-lg shadow-primary/25">
              Commencer
              <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={scrollToNext}
              className="h-12 rounded-xl px-8 text-base font-medium"
            >
              En savoir plus
              <ChevronDown className="size-4" />
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] as const }}
          className="mx-auto mt-20 grid max-w-3xl grid-cols-3 gap-px overflow-hidden rounded-2xl border bg-border/50"
        >
          {[
            { icon: Recycle, label: "Collectes", value: "1 200+" },
            { icon: Blocks, label: "Pavés produits", value: "85 000+" },
            { icon: Users, label: "Collecteurs", value: "500+" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              variants={statVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center gap-2 bg-background py-6 sm:py-8"
            >
              <stat.icon className="size-6 text-primary" />
              <span className="text-2xl font-bold text-foreground sm:text-3xl">{stat.value}</span>
              <span className="text-xs text-muted-foreground sm:text-sm">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
