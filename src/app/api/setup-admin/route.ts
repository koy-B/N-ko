import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const adminPassword = await hash("Admin123!", 12)
    const clientPassword = await hash("Client123!", 12)
    const collectorPassword = await hash("Collector123!", 12)

    // 1. Création Admin
    await prisma.user.upsert({
      where: { email: "admin@nekogreen.com" },
      update: { role: "ADMIN", isActive: true },
      create: {
        name: "Admin Neko Green",
        email: "admin@nekogreen.com",
        password: adminPassword,
        role: "ADMIN",
        isActive: true,
      },
    })

    // 2. Création Client
    await prisma.user.upsert({
      where: { email: "client@test.com" },
      update: { role: "CLIENT", isActive: true },
      create: {
        name: "Test Client",
        email: "client@test.com",
        password: clientPassword,
        role: "CLIENT",
        isActive: true,
        clientProfile: { create: {} }
      },
    })

    // 3. Création Collecteur
    await prisma.user.upsert({
      where: { email: "collector@test.com" },
      update: { role: "COLLECTOR", isActive: true },
      create: {
        name: "Test Collector",
        email: "collector@test.com",
        password: collectorPassword,
        role: "COLLECTOR",
        isActive: true,
        collectorProfile: { create: {} }
      },
    })

    return NextResponse.json({
      message: "Test users created successfully",
      users: [
        { role: "ADMIN", email: "admin@nekogreen.com", password: "Admin123!" },
        { role: "CLIENT", email: "client@test.com", password: "Client123!" },
        { role: "COLLECTOR", email: "collector@test.com", password: "Collector123!" }
      ]
    })
  } catch (error: any) {
    console.error("Setup error:", error)
    return NextResponse.json({
      error: "Failed to create users",
      details: error.message
    }, { status: 500 })
  }
}
