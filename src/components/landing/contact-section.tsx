"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { MapPin, Phone, Mail, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  subject: z.string().min(3, "Le sujet doit contenir au moins 3 caractères"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
})

type ContactForm = z.infer<typeof contactSchema>

const contactInfo = [
  {
    icon: MapPin,
    label: "Adresse",
    value: "Abidjan, Côte d'Ivoire",
    href: null,
  },
  {
    icon: Phone,
    label: "Téléphone",
    value: "+225 01 23 45 67 89",
    href: "tel:+2250123456789",
  },
  {
    icon: Mail,
    label: "Email",
    value: "contact@nekogreen.ci",
    href: "mailto:contact@nekogreen.ci",
  },
]

export function ContactSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactForm) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    reset()
  }

  return (
    <section id="contact" className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            Contact
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Parlons de votre projet
          </h2>
          <p className="mt-4 text-muted-foreground">
            Une question, un projet, une collaboration ? N&apos;hésitez pas à nous contacter.
          </p>
        </motion.div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-12 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
            className="space-y-8 lg:col-span-2"
          >
            {contactInfo.map((info) => {
              const Icon = info.icon
              const content = (
                <div className="flex items-start gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{info.label}</p>
                    <p className="text-sm text-muted-foreground">{info.value}</p>
                  </div>
                </div>
              )

              return info.href ? (
                <a key={info.label} href={info.href} className="block transition-colors hover:opacity-80">
                  {content}
                </a>
              ) : (
                <div key={info.label}>{content}</div>
              )
            })}
          </motion.div>

          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
            className="space-y-5 lg:col-span-3"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input id="name" placeholder="Jean Dupont" {...register("name")} />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="jean@exemple.com" {...register("email")} />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Sujet</Label>
              <Input id="subject" placeholder="Sujet de votre message" {...register("subject")} />
              {errors.subject && (
                <p className="text-xs text-destructive">{errors.subject.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={5}
                placeholder="Écrivez votre message ici..."
                {...register("message")}
              />
              {errors.message && (
                <p className="text-xs text-destructive">{errors.message.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full rounded-xl sm:w-auto">
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  Envoyer le message
                </>
              )}
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
