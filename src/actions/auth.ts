"use server"

import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function registerUser(data: {
  name: string
  email: string
  phone: string
  password: string
  role: "CLIENT" | "COLLECTOR"
}): Promise<{ success: boolean; error?: string }> {
  try {
    const existing = await prisma.user.findUnique({ where: { email: data.email } })

    if (existing) {
      return { success: false, error: "Un compte avec cet email existe déjà" }
    }

    const hashedPassword = await hash(data.password, 12)

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        role: data.role,
      },
    })

    if (data.role === "CLIENT") {
      await prisma.clientProfile.create({ data: { userId: user.id } })
    } else if (data.role === "COLLECTOR") {
      await prisma.collectorProfile.create({ data: { userId: user.id } })
    }

    return { success: true }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, error: "Erreur lors de l'inscription" }
  }
}
