import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { name, email, phone, password, role } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Champs obligatoires manquants" },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findUnique({ where: { email } })

    if (existing) {
      return NextResponse.json(
        { message: "Un compte avec cet email existe déjà" },
        { status: 409 }
      )
    }

    const hashedPassword = await hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: role || "CLIENT",
        clientProfile: role !== "COLLECTOR" ? { create: {} } : undefined,
        collectorProfile: role === "COLLECTOR" ? { create: {} } : undefined,
      },
    })

    return NextResponse.json(
      { message: "Compte créé avec succès", userId: user.id },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "Erreur lors de la création du compte" },
      { status: 500 }
    )
  }
}
