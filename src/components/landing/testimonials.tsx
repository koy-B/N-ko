"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Quote, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { cn } from "@/lib/utils"

const testimonials = [
  {
    quote:
      "Néko a complètement transformé notre approche de la gestion des déchets. Leur plateforme est intuitive et nos espaces verts sont désormais équipés de pavés écologiques de grande qualité.",
    name: "Marie Koné",
    role: "Directrice Développement Durable, Ville d'Abidjan",
    rating: 5,
  },
  {
    quote:
      "En tant que collecteur indépendant, je gagne ma vie tout en protégeant l'environnement. L'application me permet de suivre mes collectes et de maximiser mon impact quotidien.",
    name: "Kouamé N'Guessan",
    role: "Collecteur Partenaire",
    rating: 5,
  },
  {
    quote:
      "Les pavés sont magnifiques et extrêmement résistants. Nous les avons utilisés pour notre nouvelle terrasse et le résultat dépasse nos attentes. Un vrai choix éco-responsable.",
    name: "Aïssatou Diallo",
    role: "Propriétaire, Villa Verte",
    rating: 5,
  },
]

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1)
    setCurrent(index)
  }, [current])

  const next = useCallback(() => {
    setDirection(1)
    setCurrent((c) => (c + 1) % testimonials.length)
  }, [])

  const prev = useCallback(() => {
    setDirection(-1)
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next])

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  }

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            Témoignages
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ce qu&apos;ils disent
          </h2>
          <p className="mt-4 text-muted-foreground">
            Découvrez les retours d&apos;expérience de nos partenaires et clients.
          </p>
        </motion.div>

        <div className="relative mx-auto mt-16 max-w-3xl">
          <div className="relative min-h-[280px] overflow-hidden rounded-2xl border bg-card p-8 sm:p-12">
            <Quote className="absolute right-6 top-6 size-12 text-primary/10" />

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
                className="space-y-6"
              >
                <div className="flex gap-1">
                  {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                    <Star key={i} className="size-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <blockquote className="text-lg leading-relaxed text-foreground/85 sm:text-xl">
                  &ldquo;{testimonials[current].quote}&rdquo;
                </blockquote>

                <div>
                  <p className="font-semibold text-foreground">{testimonials[current].name}</p>
                  <p className="text-sm text-muted-foreground">{testimonials[current].role}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="flex size-10 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Précédent"
            >
              <ChevronLeft className="size-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={cn(
                    "size-2 rounded-full transition-all",
                    i === current ? "bg-primary w-6" : "bg-muted-foreground/30"
                  )}
                  aria-label={`Témoignage ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="flex size-10 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Suivant"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
