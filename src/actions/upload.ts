"use server"

import { put } from "@vercel/blob"

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get("file") as File
    if (!file) {
      return { success: false, error: "Aucun fichier fourni" }
    }

    // Si le token n'est pas configuré, on simule l'upload pour le prototype
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn("BLOB_READ_WRITE_TOKEN is missing. Simulating upload...")
      await new Promise((r) => setTimeout(r, 1000))
      // Utilisation d'une URL de placeholder plus fiable
      return { 
        success: true, 
        url: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=400&auto=format&fit=crop" 
      }
    }

    const blob = await put(file.name, file, {
      access: "public",
    })

    return { success: true, url: blob.url }
  } catch (error) {
    console.error("Error uploading to Vercel Blob:", error)
    return { success: false, error: "Erreur lors de l'envoi de l'image" }
  }
}
