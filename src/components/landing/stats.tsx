"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Scale, Blocks, Heart, Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

const stats = [
  {
    icon: Scale,
    value: 150,
    suffix: "+",
    label: "Tonnes recyclées",
    color: "text-emerald-500",
  },
  {
    icon: Blocks,
    value: 85000,
    suffix: "+",
    label: "Pavés produits",
    color: "text-green-600",
  },
  {
    icon: Heart,
    value: 1200,
    suffix: "+",
    label: "Clients satisfaits",
    color: "text-rose-500",
  },
  {
    icon: Building2,
    value: 15,
    suffix: "",
    label: "Villes actives",
    color: "text-sky-500",
  },
]

function AnimatedCounter({
  value,
  suffix,
  isInView,
}: {
  value: number
  suffix: string
  isInView: boolean
}) {
  return (
    <span className="tabular-nums">
      {isInView ? value.toLocaleString("fr-FR") : "0"}{suffix}
    </span>
  )
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="relative overflow-hidden bg-primary py-20 sm:py-24">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
      <div className="absolute bottom-0 right-0 size-[500px] rounded-full bg-white/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.7,
                  delay: index * 0.15,
                  ease: [0.16, 1, 0.3, 1] as const,
                }}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-white/10">
                  <Icon className="size-7 text-white" />
                </div>
                <div className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} isInView={isInView} />
                </div>
                <p className="mt-2 text-sm font-medium text-white/70">{stat.label}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
