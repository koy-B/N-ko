"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Qu'est-ce que Néko ?",
    answer:
      "Néko est une plateforme SaaS qui connecte les producteurs de déchets plastiques aux collecteurs et transforme ces déchets en pavés écologiques. Nous proposons une solution complète de collecte intelligente, de recyclage et de production de matériaux de construction durables.",
  },
  {
    question: "Comment puis-je devenir collecteur partenaire ?",
    answer:
      "Pour devenir collecteur partenaire, inscrivez-vous sur notre plateforme en cliquant sur 'Espace Collecteur'. Vous devrez fournir vos informations personnelles et professionnelles. Après validation de votre profil, vous pourrez commencer à accepter des missions de collecte près de chez vous.",
  },
  {
    question: "Quels types de plastiques acceptez-vous ?",
    answer:
      "Nous acceptons principalement les plastiques noirs et les plastiques ménagers courants (bouteilles, emballages, contenants). Les matériaux sont triés, nettoyés et transformés en matière première pour la fabrication de nos pavés écologiques.",
  },
  {
    question: "Où puis-je acheter les pavés Néko ?",
    answer:
      "Nos pavés sont disponibles à l'achat sur notre boutique en ligne. Vous pouvez également nous contacter directement pour des commandes en gros ou des projets d'aménagement. Nous livrons dans toute la Côte d'Ivoire et dans la sous-région.",
  },
  {
    question: "Quels sont les délais de livraison ?",
    answer:
      "Les délais de livraison varient selon votre localisation et la taille de votre commande. En général, comptez 3 à 5 jours ouvrés pour Abidjan et 5 à 10 jours ouvrés pour les autres villes. Nous travaillons avec des transporteurs partenaires pour garantir une livraison rapide et sécurisée.",
  },
  {
    question: "Proposez-vous des services de pose ?",
    answer:
      "Oui, nous collaborons avec des artisans et entrepreneurs partenaires formés à la pose de nos pavés écologiques. Nous pouvons vous recommander un professionnel qualifié près de chez vous pour garantir une installation parfaite.",
  },
]

export function FAQSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="relative overflow-hidden bg-muted/50 py-24 sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            FAQ
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Questions fréquentes
          </h2>
          <p className="mt-4 text-muted-foreground">
            Vous avez des questions ? Nous avons les réponses.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
          className="mx-auto mt-16 max-w-3xl"
        >
          <Accordion className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                className="overflow-hidden rounded-xl border bg-card"
              >
                <AccordionTrigger className="px-5 py-4 text-base font-medium hover:no-underline hover:bg-muted/50 [&>svg]:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-4 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
