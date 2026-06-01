"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Truck, Recycle, Factory, ShoppingBag, ArrowDown } from "lucide-react"

const steps = [
  {
    icon: Truck,
    title: "Collecte",
    description:
      "Nos collecteurs partenaires récupèrent les déchets plastiques auprès des ménages et entreprises via notre plateforme intelligente.",
    color: "from-emerald-400 to-green-500",
  },
  {
    icon: Recycle,
    title: "Recyclage",
    description:
      "Les plastiques collectés sont triés, nettoyés et transformés en matière première recyclée de haute qualité.",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Factory,
    title: "Production",
    description:
      "La matière recyclée est pressée et moulée pour créer des pavés écologiques solides et durables.",
    color: "from-emerald-600 to-green-700",
  },
  {
    icon: ShoppingBag,
    title: "Vente",
    description:
      "Les pavés écologiques sont vendus aux particuliers, entreprises et collectivités pour des aménagements durables.",
    color: "from-green-700 to-emerald-800",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
}

const stepVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-muted/50 py-24 sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            Processus
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Comment ça marche
          </h2>
          <p className="mt-4 text-muted-foreground">
            Découvrez comment Néko transforme vos déchets plastiques en pavés écologiques en
            quatre étapes simples.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.title}
                variants={stepVariants}
                className="group relative flex flex-col items-center text-center"
              >
                <div className="relative mb-6">
                  <div className={`flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} shadow-lg shadow-primary/20`}>
                    <Icon className="size-9 text-white" />
                  </div>
                  <div className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full bg-foreground text-[11px] font-bold text-background">
                    {index + 1}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>

                {index < steps.length - 1 && (
                  <div className="mt-6 hidden text-primary/40 lg:block">
                    <ArrowDown className="size-6" />
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
