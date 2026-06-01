"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Recycle, Cloud, Trash2, TreePine } from "lucide-react"
import { cn } from "@/lib/utils"

const metrics = [
  {
    icon: Recycle,
    value: 150000,
    suffix: " kg",
    label: "Plastiques recyclés",
    color: "text-emerald-500",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    icon: Cloud,
    value: 90000,
    suffix: " kg",
    label: "CO₂ évité",
    color: "text-sky-500",
    bg: "bg-sky-100 dark:bg-sky-900/30",
  },
  {
    icon: Trash2,
    value: 142500,
    suffix: " kg",
    label: "Déchets détournés",
    color: "text-amber-500",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  {
    icon: TreePine,
    value: 4500,
    suffix: "",
    label: "Arbres sauvés",
    color: "text-green-600",
    bg: "bg-green-100 dark:bg-green-900/30",
  },
]

function Counter({ value, suffix, isInView }: { value: number; suffix: string; isInView: boolean }) {
  const countRef = useRef<HTMLSpanElement>(null)

  return (
    <span ref={countRef} className="tabular-nums">
      {isInView ? value.toLocaleString("fr-FR") : "0"}{suffix}
    </span>
  )
}

export function ImpactSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="impact" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            Impact
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Notre impact environnemental
          </h2>
          <p className="mt-4 text-muted-foreground">
            Chaque chiffre représente une victoire pour notre planète. Ensemble, nous faisons la
            différence.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.7,
                  delay: index * 0.15,
                  ease: [0.16, 1, 0.3, 1] as const,
                }}
                className="group relative overflow-hidden rounded-2xl border bg-card p-6 transition-shadow hover:shadow-lg"
              >
                <div className="absolute -right-6 -top-6 size-24 rounded-full bg-primary/[0.03] transition-transform duration-500 group-hover:scale-150" />

                <div className={cn("mb-4 inline-flex rounded-xl p-3", metric.bg)}>
                  <Icon className={cn("size-6", metric.color)} />
                </div>

                <div className={cn("text-3xl font-bold tracking-tight", metric.color)}>
                  <Counter value={metric.value} suffix={metric.suffix} isInView={isInView} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{metric.label}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
