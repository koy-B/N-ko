"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, X, MapPin, Package, Weight, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const formSchema = z.object({
  address: z.string().min(5, "L'adresse est requise"),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  wasteType: z.string().min(1, "Sélectionnez un type de déchet"),
  estimatedWeight: z.string().refine((v) => v !== "" && !isNaN(Number(v)) && Number(v) > 0, "Le poids doit être supérieur à 0"),
  comment: z.string().optional(),
  scheduledDate: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

const wasteTypes = [
  { value: "Plastique noir", label: "Plastique noir" },
  { value: "Plastique blanc", label: "Plastique blanc" },
  { value: "Plastique mixte", label: "Plastique mixte" },
  { value: "Autre", label: "Autre" },
]

export default function NewCollectionPage() {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      wasteType: "",
      estimatedWeight: "",
      comment: "",
      scheduledDate: "",
    },
  })

  const onDrop = useCallback((accepted: File[]) => {
    setFiles((prev) => [...prev, ...accepted].slice(0, 5))
  }, [])

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxSize: 5 * 1024 * 1024,
  })

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1500))
    toast.success("Demande de collecte créée avec succès")
    router.push("/dashboard/client/collections")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      <div className="flex items-center gap-4">
        <Link href="/dashboard/client/collections">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Nouvelle demande de collecte</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Remplissez le formulaire pour créer une nouvelle collecte
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Informations de collecte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Textarea
                id="address"
                placeholder="15 Rue des Lilas, Dakar"
                {...register("address")}
              />
              {errors.address && (
                <p className="text-xs text-destructive">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3" />
                    Latitude
                  </span>
                </Label>
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  placeholder="14.7167"
                  {...register("latitude")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3" />
                    Longitude
                  </span>
                </Label>
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  placeholder="-17.4677"
                  {...register("longitude")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wasteType">
                  <span className="flex items-center gap-1.5">
                    <Package className="size-3" />
                    Type de déchet
                  </span>
                </Label>
                <Select
                  onValueChange={(v: unknown) => setValue("wasteType", v as string)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    {wasteTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.wasteType && (
                  <p className="text-xs text-destructive">{errors.wasteType.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedWeight">
                  <span className="flex items-center gap-1.5">
                    <Weight className="size-3" />
                    Poids estimé (kg)
                  </span>
                </Label>
                <Input
                  id="estimatedWeight"
                  type="number"
                  step="0.1"
                  placeholder="5"
                  {...register("estimatedWeight")}
                />
                {errors.estimatedWeight && (
                  <p className="text-xs text-destructive">{errors.estimatedWeight.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledDate">
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3" />
                  Date souhaitée (optionnelle)
                </span>
              </Label>
              <Input
                id="scheduledDate"
                type="date"
                {...register("scheduledDate")}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Photos (optionnelles)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              {...getRootProps()}
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-colors",
                isDragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground/30"
              )}
            >
              <input {...getInputProps()} />
              <Upload className="size-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {isDragActive
                  ? "Déposez les fichiers ici"
                  : "Glissez-déposez des photos ou cliquez pour sélectionner"}
              </p>
              <p className="text-xs text-muted-foreground/60">
                PNG, JPG, WebP jusqu'à 5 Mo max
              </p>
            </div>

            {files.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {files.map((file, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="size-16 rounded-lg object-cover border"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Commentaire (optionnel)</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Informations supplémentaires..."
              rows={3}
              {...register("comment")}
            />
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Link href="/dashboard/client/collections">
            <Button type="button" variant="ghost">
              Annuler
            </Button>
          </Link>
          <Button type="submit" disabled={submitting} className="gap-2">
            {submitting ? (
              <>Création en cours...</>
            ) : (
              <>Créer la demande</>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  )
}
