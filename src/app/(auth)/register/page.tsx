"use client"

import { Suspense, useState, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"
import { Leaf, Eye, EyeOff, Loader2, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

const registerSchema = z
  .object({
    name: z.string().min(2, "Nom trop court"),
    email: z.string().email("Email invalide"),
    phone: z.string().min(8, "Numéro invalide"),
    password: z.string().min(6, "Minimum 6 caractères").max(50, "Maximum 50 caractères"),
    confirmPassword: z.string(),
    role: z.enum(["CLIENT", "COLLECTOR"]),
    acceptTerms: z.literal(true, { message: "Vous devez accepter les conditions" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

type RegisterFormData = z.infer<typeof registerSchema>

function getPasswordStrength(password: string): { label: string; color: string; width: string } {
  if (!password) return { label: "", color: "", width: "0%" }
  const length = password.length
  if (length < 6) return { label: "Faible", color: "bg-destructive", width: "25%" }
  if (length < 10) return { label: "Moyen", color: "bg-orange-500", width: "50%" }
  if (length < 14) return { label: "Fort", color: "bg-yellow-500", width: "75%" }
  return { label: "Très fort", color: "bg-primary", width: "100%" }
}

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "client"
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: role === "collector" ? "COLLECTOR" : "CLIENT",
      acceptTerms: false as unknown as true,
    },
  })

  const password = watch("password")
  const strength = useMemo(() => getPasswordStrength(password || ""), [password])

  async function onSubmit(data: RegisterFormData) {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
          role: data.role,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        toast.error(error.message || "Erreur lors de l'inscription")
        return
      }

      toast.success("Compte créé avec succès ! Connectez-vous.")
      router.push(`/login?role=${data.role === "COLLECTOR" ? "collector" : "client"}`)
    } catch {
      toast.error("Une erreur est survenue")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="border-border/50 shadow-lg">
        <CardHeader className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-primary"
          >
            <Leaf className="size-6 text-white" />
          </motion.div>
          <CardTitle className="text-2xl">Créer un compte</CardTitle>
          <CardDescription>
            {role === "collector"
              ? "Inscrivez-vous en tant que collecteur"
              : "Inscrivez-vous en tant que client"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input id="name" placeholder="Jean Dupont" {...register("name")} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" placeholder="+225 01 02 03 04" {...register("phone")} />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="vous@exemple.com" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Type de compte</Label>
              <Select
                defaultValue={role === "collector" ? "COLLECTOR" : "CLIENT"}
                onValueChange={(value) => setValue("role", value as "CLIENT" | "COLLECTOR")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CLIENT">Client</SelectItem>
                  <SelectItem value="COLLECTOR">Collecteur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {password && (
                  <div className="mt-1 space-y-1">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full transition-all ${strength.color}`}
                        style={{ width: strength.width }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Force: {strength.label}</p>
                  </div>
                )}
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="acceptTerms"
                onCheckedChange={(checked) =>
                  setValue("acceptTerms", checked as true)
                }
              />
              <Label htmlFor="acceptTerms" className="text-sm leading-tight">
                J&apos;accepte les{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  conditions d&apos;utilisation
                </Link>{" "}
                et la{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  politique de confidentialité
                </Link>
              </Label>
            </div>
            {errors.acceptTerms && (
              <p className="text-xs text-destructive">{errors.acceptTerms.message}</p>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <Check className="mr-2 size-4" />
                  Créer mon compte
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Déjà un compte?{" "}
            <Link
              href={`/login?role=${role}`}
              className="font-medium text-primary hover:underline"
            >
              Se connecter
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-12">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}
