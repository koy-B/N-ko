"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import {
  Leaf,
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Loader2,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

const contactSchema = z.object({
  name: z.string().min(2, "Nom trop court"),
  email: z.string().email("Email invalide"),
  subject: z.string().min(5, "Sujet trop court"),
  message: z.string().min(10, "Message trop court"),
})

type ContactFormData = z.infer<typeof contactSchema>

const contactInfo = [
  {
    icon: MapPin,
    label: "Adresse",
    value: "Dakar, Sénégal",
    description: "Zone Industrielle de Mbao",
  },
  {
    icon: Phone,
    label: "Téléphone",
    value: "+221 33 123 45 67",
    description: "Lun-Ven 8h-18h",
  },
  {
    icon: Mail,
    label: "Email",
    value: "contact@nekogreen.sn",
    description: "Réponse sous 24h",
  },
  {
    icon: Clock,
    label: "Horaires",
    value: "Lun - Ven: 8h - 18h",
    description: "Sam: 9h - 13h",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  })

  async function onSubmit(data: ContactFormData) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error()

      toast.success("Message envoyé avec succès")
      reset()
    } catch {
      toast.error("Erreur lors de l'envoi du message")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary/5 pb-16 pt-28">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
            className="flex flex-col items-center text-center"
          >
            <Badge variant="secondary" className="mb-4">
              <MessageSquare className="mr-1 size-3" />
              Contact
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Contactez<span className="text-primary">-nous</span>
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Une question, un projet? N&apos;hésitez pas à nous contacter. Notre équipe vous
              répondra dans les plus brefs délais.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container -mt-8 pb-20">
        <div className="grid gap-10 lg:grid-cols-5">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-3"
          >
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Envoyez-nous un message</CardTitle>
                <CardDescription>
                  Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet</Label>
                      <Input
                        id="name"
                        placeholder="Jean Dupont"
                        {...register("name")}
                        className={cn(errors.name && "border-destructive")}
                      />
                      {errors.name && (
                        <p className="text-xs text-destructive">{errors.name.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="vous@exemple.com"
                        {...register("email")}
                        className={cn(errors.email && "border-destructive")}
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet</Label>
                    <Input
                      id="subject"
                      placeholder="Objet de votre message"
                      {...register("subject")}
                      className={cn(errors.subject && "border-destructive")}
                    />
                    {errors.subject && (
                      <p className="text-xs text-destructive">{errors.subject.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Votre message..."
                      rows={6}
                      {...register("message")}
                      className={cn(errors.message && "border-destructive")}
                    />
                    {errors.message && (
                      <p className="text-xs text-destructive">{errors.message.message}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="size-4" />
                        Envoyer le message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4 lg:col-span-2"
          >
            {contactInfo.map((info) => (
              <motion.div key={info.label} variants={itemVariants}>
                <Card className="border-border/50 transition-shadow hover:shadow-md">
                  <CardContent className="flex items-start gap-4 py-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <info.icon className="size-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{info.label}</p>
                      <p className="text-sm text-foreground">{info.value}</p>
                      <p className="text-xs text-muted-foreground">{info.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            <motion.div variants={itemVariants}>
              <Card className="overflow-hidden border-border/50">
                <div className="flex aspect-[4/3] items-center justify-center bg-muted/50">
                  <div className="flex flex-col items-center gap-2 text-center text-muted-foreground">
                    <MapPin className="size-10 text-primary/30" />
                    <p className="text-sm font-medium">Dakar, Sénégal</p>
                    <p className="text-xs">Zone Industrielle de Mbao</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
